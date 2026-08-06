"use client";

import {
  useRef, useEffect,
  type MouseEvent, type TouchEvent, type WheelEvent,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { runWhenVisible, cappedDpr } from "@/lib/raf-visibility";

// ─────────────────────────────────────────────────────────────────────────────
// NetworkStage — the network sibling of MoleculeStage. Renders a compound-
// synergy graph as a 3D rotating artwork on a 2D canvas (same hand-rolled
// projection + drag/inertia/zoom the molecule uses — no WebGL), so the Descent's
// "Nothing works alone" act reads as the same object family as the molecule
// directly above it. Nodes are glowing spheres (elite picks haloed gold); edges
// are depth-sorted lines coloured by relationship tier, clashes drawn dashed.
// Honors prefers-reduced-motion. Purely a visual — the data is passed in.
// ─────────────────────────────────────────────────────────────────────────────

export type NetworkNode = {
  name: string;
  /** Unit-ish sphere coordinates (see fibonacciSphere in the caller). */
  pos: [number, number, number];
  elite: boolean;
  /** Connection count → node radius. */
  degree: number;
};

export type NetworkEdge = {
  /** Indices into the nodes array. */
  a: number;
  b: number;
  color: string;
  dashed: boolean;
};

const ELITE_GLOW = "rgba(240,196,106,"; // gold halo for elite picks
const NODE_HI: [number, number, number] = [240, 248, 255];
const NODE_CORE: [number, number, number] = [150, 220, 240];

export function NetworkStage({
  nodes,
  edges,
  className,
  ariaLabel,
}: {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();
  const reducedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef({ down: false, x: 0, y: 0, rx: -0.12, ry: 0.5, vx: 0, vy: 0, zoom: 1 });
  const dataRef = useRef({ nodes, edges });

  useEffect(() => { reducedRef.current = reduced; }, [reduced]);
  useEffect(() => { dataRef.current = { nodes, edges }; }, [nodes, edges]);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let w = 0, h = 0;
    const dpr = cappedDpr();

    function resize() {
      if (!cv || !ctx) return;
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    function draw() {
      if (!ctx) return;
      const { nodes: N, edges: E } = dataRef.current;
      const d = drag.current;
      if (!d.down) {
        if (!reducedRef.current) d.ry += 0.005;
        d.rx += d.vx; d.ry += d.vy;
        d.vx *= 0.94; d.vy *= 0.94;
      }
      const cx = w / 2, cy = h / 2;
      const scale = (Math.min(w, h) / 6.4) * d.zoom;
      const cosY = Math.cos(d.ry), sinY = Math.sin(d.ry);
      const cosX = Math.cos(d.rx), sinX = Math.sin(d.rx);

      const proj = N.map((n) => {
        const [ax, ay, az] = n.pos;
        const x = ax * cosY - az * sinY;
        let z = ax * sinY + az * cosY;
        const y = ay * cosX - z * sinX;
        z = ay * sinX + z * cosX;
        const persp = 6 / (6 + z);
        return { sx: cx + x * scale * persp, sy: cy + y * scale * persp, z, persp };
      });

      ctx.clearRect(0, 0, w, h);
      const back = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      back.addColorStop(0, "rgba(20,30,60,0.32)");
      back.addColorStop(1, "rgba(5,7,16,0)");
      ctx.fillStyle = back;
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(w, h) * 0.7, 0, Math.PI * 2); ctx.fill();

      // Edges, back-to-front so nearer links read brighter.
      ctx.lineCap = "round";
      const edgeOrder = E
        .map((e) => ({ e, z: (proj[e.a].z + proj[e.b].z) / 2 }))
        .sort((p, q) => q.z - p.z);
      for (const { e } of edgeOrder) {
        const p = proj[e.a], q = proj[e.b];
        const depth = ((proj[e.a].z + proj[e.b].z) / 2 + 2.3) / 4.6; // 0 near … 1 far
        const alpha = e.dashed ? 0.55 - depth * 0.32 : 0.4 - depth * 0.26;
        ctx.strokeStyle = e.color;
        ctx.globalAlpha = Math.max(0.06, alpha);
        ctx.lineWidth = (e.dashed ? 1.4 : 1.1) * ((p.persp + q.persp) / 2);
        ctx.setLineDash(e.dashed ? [4, 6] : []);
        ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      // Nodes, back-to-front.
      const order = proj.map((p, idx) => ({ ...p, idx })).sort((a, b) => a.z - b.z);
      for (const p of order) {
        const n = N[p.idx];
        const depth = (p.z + 2.3) / 4.6;
        const rad = (5.5 + Math.min(n.degree, 6) * 1.5) * p.persp * (1.15 - depth * 0.3);
        const a = 0.95 - depth * 0.4;

        if (n.elite) {
          const halo = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad * 3.4);
          halo.addColorStop(0, `${ELITE_GLOW}${0.5 * a})`);
          halo.addColorStop(1, `${ELITE_GLOW}0)`);
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(p.sx, p.sy, rad * 3.4, 0, Math.PI * 2); ctx.fill();
        } else {
          const bloom = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad * 2.6);
          bloom.addColorStop(0, `rgba(95,227,224,${0.4 * a})`);
          bloom.addColorStop(1, "rgba(95,227,224,0)");
          ctx.fillStyle = bloom;
          ctx.beginPath(); ctx.arc(p.sx, p.sy, rad * 2.6, 0, Math.PI * 2); ctx.fill();
        }

        const hi = n.elite ? [255, 244, 214] as const : NODE_HI;
        const core = n.elite ? [240, 196, 106] as const : NODE_CORE;
        const sphere = ctx.createRadialGradient(p.sx - rad * 0.4, p.sy - rad * 0.45, rad * 0.05, p.sx, p.sy, rad);
        sphere.addColorStop(0, `rgba(${hi[0]},${hi[1]},${hi[2]},${a})`);
        sphere.addColorStop(0.4, `rgba(${core[0]},${core[1]},${core[2]},${a})`);
        sphere.addColorStop(1, `rgba(${Math.round(core[0] * 0.3)},${Math.round(core[1] * 0.36)},${Math.round(core[2] * 0.5)},${a})`);
        ctx.fillStyle = sphere;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = n.elite ? `rgba(255,235,190,${0.5 * a})` : `rgba(180,235,255,${0.4 * a})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rad, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();

        // Label the front-facing nodes only, faded by depth — legible without
        // clutter, and the far side stays clean artwork.
        if (depth < 0.5) {
          ctx.fillStyle = `rgba(230,240,255,${(0.85 - depth * 1.4) * a})`;
          ctx.font = `500 ${Math.round(11 * p.persp)}px 'Inter', system-ui, sans-serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(n.name, p.sx, p.sy - rad - 8 * p.persp);
        }
      }
    }

    const stopLoop = runWhenVisible(cv, draw);
    return () => { stopLoop(); ro.disconnect(); };
  }, []);

  const pointerFrom = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const m = e as MouseEvent;
    return { x: m.clientX, y: m.clientY };
  };
  const onDown = (e: MouseEvent | TouchEvent) => {
    const d = drag.current; d.down = true;
    const pt = pointerFrom(e); d.x = pt.x; d.y = pt.y; d.vx = 0; d.vy = 0;
  };
  const onMove = (e: MouseEvent | TouchEvent) => {
    const d = drag.current; if (!d.down) return;
    const pt = pointerFrom(e);
    const dx = pt.x - d.x, dy = pt.y - d.y;
    d.ry += dx * 0.01; d.rx += dy * 0.01;
    d.vy = dx * 0.01; d.vx = dy * 0.01;
    d.x = pt.x; d.y = pt.y;
  };
  const onUp = () => { drag.current.down = false; };
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const d = drag.current;
    d.zoom = Math.max(0.6, Math.min(2.2, d.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={ariaLabel ?? "Compound synergy network visualization"}
      style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      onWheel={onWheel}
    />
  );
}
