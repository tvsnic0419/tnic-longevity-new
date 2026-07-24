"use client";

import {
  useRef, useEffect,
  type MouseEvent, type TouchEvent,
} from "react";
import { getGeometry, type Geometry } from "./molecule";
import type { RGB } from "./tokens";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { runWhenVisible, cappedDpr } from "@/lib/raf-visibility";

// ─────────────────────────────────────────────────────────────────────────────
// MoleculeStage — the shared cinematic renderer for the viz family.
//   mode="molecule": Phong-lit ball-and-stick from a real stylized skeleton
//                    (drag to rotate, scroll to zoom, inertial spin).
//   mode="field":    an abstract orbital particle field tinted to a compound's
//                    signature hue — used when we have no literal structure, so
//                    nothing fabricated is ever passed off as a real molecule.
// Both honor prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

const ELEMENT_COLOR: Record<string, { core: RGB; hi: RGB; glow: string }> = {
  C: { core: [216, 234, 255], hi: [255, 255, 255], glow: "rgba(95,227,224," },
  O: { core: [244, 142, 126], hi: [255, 220, 210], glow: "rgba(240,138,122," },
  N: { core: [140, 160, 245], hi: [220, 228, 255], glow: "rgba(140,140,245," },
  S: { core: [240, 210, 120], hi: [255, 244, 210], glow: "rgba(240,196,106," },
};

export function MoleculeStage({
  geometryId,
  hue,
  interactive = true,
  className,
  style,
}: {
  geometryId?: string;
  hue: RGB;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const reducedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef({ down: false, x: 0, y: 0, rx: -0.15, ry: 0.5, vx: 0, vy: 0, zoom: 1 });
  const geomRef = useRef<Geometry | null>(null);
  const hueRef = useRef<RGB>(hue);

  useEffect(() => { reducedRef.current = reduced; }, [reduced]);
  useEffect(() => { hueRef.current = hue; }, [hue]);
  useEffect(() => {
    geomRef.current = geometryId ? getGeometry(geometryId) : null;
  }, [geometryId]);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let w = 0, h = 0;
    const dpr = cappedDpr();

    // field-mode particles (only used when there is no geometry)
    const N = 64;
    const field = Array.from({ length: N }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.2 + Math.random() * 0.8,
      z: (Math.random() - 0.5) * 2,
      sp: (Math.random() * 0.4 + 0.2) * (Math.random() < 0.5 ? 1 : -1),
      rad: Math.random() * 2 + 0.6,
      ph: Math.random() * Math.PI * 2,
    }));

    function resize() {
      if (!cv || !ctx) return;
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    function drawMolecule(geom: Geometry) {
      if (!ctx) return;
      const d = drag.current;
      if (!d.down) {
        if (!reducedRef.current) d.ry += 0.005;
        d.rx += d.vx; d.ry += d.vy;
        d.vx *= 0.94; d.vy *= 0.94;
      }
      const scale = (Math.min(w, h) / 7.2) * d.zoom;
      const cx = w / 2, cy = h / 2;
      const cosY = Math.cos(d.ry), sinY = Math.sin(d.ry);
      const cosX = Math.cos(d.rx), sinX = Math.sin(d.rx);
      const proj = geom.atoms.map((a) => {
        const x = a.x * cosY - a.z * sinY;
        let z = a.x * sinY + a.z * cosY;
        const y = a.y * cosX - z * sinX;
        z = a.y * sinX + z * cosX;
        const persp = 6 / (6 + z);
        return { sx: cx + x * scale * persp, sy: cy + y * scale * persp, z, persp, el: a.el, label: a.label };
      });
      ctx.clearRect(0, 0, w, h);
      const back = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      back.addColorStop(0, "rgba(20,30,60,0.35)");
      back.addColorStop(1, "rgba(5,7,16,0)");
      ctx.fillStyle = back;
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(w, h) * 0.7, 0, Math.PI * 2); ctx.fill();
      ctx.lineCap = "round";
      const bonds = geom.bonds.map(([i, j, order]) => ({ i, j, order, z: (proj[i].z + proj[j].z) / 2 }))
        .sort((p, q) => q.z - p.z);
      for (const bd of bonds) {
        const p = proj[bd.i], q = proj[bd.j];
        const depth = (bd.z + 3) / 6;
        const alpha = 0.35 + (1 - depth) * 0.55;
        const lw = (1.9 + (1 - depth) * 3) * ((p.persp + q.persp) / 2);
        const grad = ctx.createLinearGradient(p.sx, p.sy, q.sx, q.sy);
        grad.addColorStop(0, `rgba(190,215,255,${alpha})`);
        grad.addColorStop(1, `rgba(140,170,220,${alpha * 0.85})`);
        if (bd.order === 2) {
          const dx = q.sy - p.sy, dy = -(q.sx - p.sx);
          const len = Math.hypot(dx, dy) || 1; const off = 2.6;
          for (const s of [-1, 1]) {
            ctx.strokeStyle = grad; ctx.lineWidth = lw * 0.7;
            ctx.beginPath();
            ctx.moveTo(p.sx + (dx / len) * off * s, p.sy + (dy / len) * off * s);
            ctx.lineTo(q.sx + (dx / len) * off * s, q.sy + (dy / len) * off * s);
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = grad; ctx.lineWidth = lw;
          ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
        }
      }
      const order = proj.map((p, idx) => ({ ...p, idx })).sort((a, b) => a.z - b.z);
      for (const p of order) {
        const depth = (p.z + 3) / 6;
        const isHetero = p.el !== "C";
        const rad = (isHetero ? 11 : 9) * p.persp * (1.2 - depth * 0.3);
        const pal = ELEMENT_COLOR[p.el] ?? ELEMENT_COLOR.C;
        const a = 0.94 - depth * 0.35;
        const bloom = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad * 3);
        bloom.addColorStop(0, `${pal.glow}${0.55 * a})`);
        bloom.addColorStop(1, `${pal.glow}0)`);
        ctx.fillStyle = bloom;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rad * 3, 0, Math.PI * 2); ctx.fill();
        const sphere = ctx.createRadialGradient(p.sx - rad * 0.4, p.sy - rad * 0.45, rad * 0.05, p.sx, p.sy, rad);
        sphere.addColorStop(0, `rgba(${pal.hi[0]},${pal.hi[1]},${pal.hi[2]},${a})`);
        sphere.addColorStop(0.35, `rgba(${pal.core[0]},${pal.core[1]},${pal.core[2]},${a})`);
        sphere.addColorStop(1, `rgba(${Math.round(pal.core[0] * 0.35)},${Math.round(pal.core[1] * 0.4)},${Math.round(pal.core[2] * 0.5)},${a})`);
        ctx.fillStyle = sphere;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(180,220,255,${0.4 * a})`; ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rad, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
        const labelText = p.label ?? (p.el === "O" ? "OH" : undefined);
        if (labelText) {
          ctx.fillStyle = `rgba(255,240,235,${0.9 * a})`;
          ctx.font = `600 ${Math.round(11 * p.persp)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(labelText, p.sx, p.sy);
        }
      }
    }

    let t = 0;
    function drawField() {
      if (!ctx) return;
      const [cr, cg, cb] = hueRef.current;
      if (!reducedRef.current) t += 0.006;
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.34;
      ctx.clearRect(0, 0, w, h);
      const back = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      back.addColorStop(0, `rgba(${cr},${cg},${cb},0.08)`);
      back.addColorStop(1, "rgba(5,7,16,0)");
      ctx.fillStyle = back;
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(w, h) * 0.7, 0, Math.PI * 2); ctx.fill();
      // three orbital rings
      for (let ring = 0; ring < 3; ring++) {
        const tilt = 0.5 + ring * 0.6;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.1 - ring * 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let k = 0; k <= 60; k++) {
          const ang = (k / 60) * Math.PI * 2 + t * (ring % 2 ? -1 : 1);
          const rx = Math.cos(ang) * R * (1 + ring * 0.18);
          const ry = Math.sin(ang) * R * (1 + ring * 0.18) * Math.cos(tilt);
          const px = cx + rx, py = cy + ry;
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      // particles orbiting
      const proj = field.map((p) => {
        const ang = p.a + t * p.sp;
        const rr = R * (0.6 + p.r);
        const x = Math.cos(ang) * rr;
        const y = Math.sin(ang) * rr * (0.35 + Math.abs(p.z) * 0.3);
        const z = p.z + Math.sin(t + p.ph) * 0.3;
        const persp = 6 / (6 + z);
        return { sx: cx + x * persp, sy: cy + y * persp, z, persp, rad: p.rad, ph: p.ph };
      }).sort((a, b) => a.z - b.z);
      for (const p of proj) {
        const tw = 0.55 + Math.sin(t * 2 + p.ph) * 0.45;
        const rad = p.rad * 3 * p.persp;
        const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${0.85 * tw})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(240,248,255,${0.7 * tw})`;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, p.rad * 0.7 * p.persp, 0, Math.PI * 2); ctx.fill();
      }
      // nucleus
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.32);
      core.addColorStop(0, "rgba(255,255,255,0.9)");
      core.addColorStop(0.4, `rgba(${cr},${cg},${cb},0.8)`);
      core.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.32, 0, Math.PI * 2); ctx.fill();
    }

    const draw = () => {
      const geom = geomRef.current;
      if (geom) drawMolecule(geom); else drawField();
    };
    const stopLoop = runWhenVisible(cv, draw);
    return () => { stopLoop(); ro.disconnect(); };
  }, []);

  const pointerFrom = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const m = e as MouseEvent;
    return { x: m.clientX, y: m.clientY };
  };
  const canInteract = interactive && !!geometryId;
  const onDown = (e: MouseEvent | TouchEvent) => {
    if (!canInteract) return;
    const d = drag.current; d.down = true;
    const pt = pointerFrom(e); d.x = pt.x; d.y = pt.y; d.vx = 0; d.vy = 0;
  };
  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!canInteract) return;
    const d = drag.current; if (!d.down) return;
    const pt = pointerFrom(e);
    const dx = pt.x - d.x, dy = pt.y - d.y;
    d.ry += dx * 0.01; d.rx += dy * 0.01;
    d.vy = dx * 0.01; d.vx = dy * 0.01;
    d.x = pt.x; d.y = pt.y;
  };
  const onUp = () => { drag.current.down = false; };

  // Attached as a native, non-passive listener — React's synthetic `onWheel`
  // is registered passive by default, so `preventDefault()` inside it silently
  // fails (browsers log "Unable to preventDefault inside passive event
  // listener invocation") and the page scrolls underneath the zoom gesture at
  // the same time the molecule tries to zoom, which reads as the stage
  // freezing/fighting the scroll. A manual `{ passive: false }` listener is
  // the only way to actually claim the wheel gesture here.
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const onWheel = (e: WheelEvent) => {
      if (!canInteract) return;
      e.preventDefault();
      const d = drag.current;
      d.zoom = Math.max(0.55, Math.min(2.4, d.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
    };
    cv.addEventListener("wheel", onWheel, { passive: false });
    return () => cv.removeEventListener("wheel", onWheel);
  }, [canInteract]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", cursor: canInteract ? "grab" : "default", ...style }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
    />
  );
}
