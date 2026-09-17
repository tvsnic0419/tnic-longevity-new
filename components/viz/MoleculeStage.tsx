"use client";

import {
  useRef, useEffect, useImperativeHandle, useMemo, forwardRef,
  type MouseEvent, type TouchEvent, type WheelEvent,
} from "react";
import { cameraFit, getGeometry, labelForAtom, type Geometry } from "./molecule";
import type { StageHandle } from "./stage-handle";
import type { RGB } from "./tokens";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { runWhenVisible, cappedDpr, fitCanvas } from "@/lib/raf-visibility";
import { makeGlowSprite, blitGlow, createGlowCache } from "@/lib/canvas-glow";

// ─────────────────────────────────────────────────────────────────────────────
// MoleculeStage — the shared cinematic renderer for the viz family.
//   mode="molecule": Phong-lit ball-and-stick from a real stylized skeleton
//                    (drag to rotate, scroll to zoom, inertial spin).
//   mode="field":    an abstract orbital particle field tinted to a compound's
//                    signature hue — used when we have no literal structure, so
//                    nothing fabricated is ever passed off as a real molecule.
// Both honor prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

const ELEMENT_COLOR: Record<string, { core: RGB; hi: RGB; glow: string; glowRgb: RGB }> = {
  C: { core: [216, 234, 255], hi: [255, 255, 255], glow: "rgba(95,227,224,", glowRgb: [95, 227, 224] },
  O: { core: [244, 142, 126], hi: [255, 220, 210], glow: "rgba(240,138,122,", glowRgb: [240, 138, 122] },
  N: { core: [140, 160, 245], hi: [220, 228, 255], glow: "rgba(140,140,245,", glowRgb: [140, 140, 245] },
  S: { core: [240, 210, 120], hi: [255, 244, 210], glow: "rgba(240,196,106,", glowRgb: [240, 196, 106] },
  P: { core: [248, 170, 96], hi: [255, 226, 190], glow: "rgba(245,165,90,", glowRgb: [245, 165, 90] },
  // Se (selenomethionine) and Co (methylcobalamin) appear in the PubChem-sourced
  // structures. Without entries here they would silently draw as carbon.
  Se: { core: [214, 152, 96], hi: [250, 222, 190], glow: "rgba(206,146,92,", glowRgb: [206, 146, 92] },
  Co: { core: [166, 140, 232], hi: [228, 216, 255], glow: "rgba(158,132,228,", glowRgb: [158, 132, 228] },
  // Halogens — canagliflozin carries an F, dasatinib a Cl.
  F: { core: [150, 230, 190], hi: [222, 255, 240], glow: "rgba(142,224,184,", glowRgb: [142, 224, 184] },
  Cl: { core: [140, 220, 150], hi: [216, 252, 220], glow: "rgba(132,214,142,", glowRgb: [132, 214, 142] },
};

/**
 * Bake a lit-sphere sprite for one element once, reproducing the exact
 * highlight-offset radial gradient the per-atom draw used to allocate every
 * frame (hi → core → shaded rim, light from upper-left). Blitted scaled to each
 * atom's projected radius and modulated with `globalAlpha` for depth, so the
 * whole molecule costs five baked bitmaps instead of two live gradients per
 * atom per frame.
 */
function makeSphereSprite(pal: { core: RGB; hi: RGB }): HTMLCanvasElement {
  const s = 96;
  const half = s / 2;
  const cv = document.createElement("canvas");
  cv.width = s;
  cv.height = s;
  const c = cv.getContext("2d")!;
  const dark: RGB = [
    Math.round(pal.core[0] * 0.35),
    Math.round(pal.core[1] * 0.4),
    Math.round(pal.core[2] * 0.5),
  ];
  const g = c.createRadialGradient(half - half * 0.4, half - half * 0.45, half * 0.05, half, half, half);
  g.addColorStop(0, `rgba(${pal.hi[0]},${pal.hi[1]},${pal.hi[2]},1)`);
  g.addColorStop(0.35, `rgba(${pal.core[0]},${pal.core[1]},${pal.core[2]},1)`);
  g.addColorStop(1, `rgba(${dark[0]},${dark[1]},${dark[2]},1)`);
  c.fillStyle = g;
  c.beginPath();
  c.arc(half, half, half, 0, Math.PI * 2);
  c.fill();
  return cv;
}

export const MoleculeStage = forwardRef<StageHandle, {
  geometryId?: string;
  hue: RGB;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  /**
   * Plain-prop alternative to the forwarded ref. `next/dynamic` does not
   * reliably forward refs, and this stage is lazy-loaded behind it, so the
   * shell hands its handle down as an ordinary prop instead.
   */
  handleRef?: React.RefObject<StageHandle | null>;
}>(function MoleculeStage({
  geometryId,
  hue,
  interactive = true,
  className,
  style,
  ariaLabel,
  handleRef,
}, ref) {
  const reduced = useReducedMotion();
  const reducedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef({ down: false, x: 0, y: 0, rx: -0.15, ry: 0.5, vx: 0, vy: 0, zoom: 1 });
  const geomRef = useRef<Geometry | null>(null);
  const hueRef = useRef<RGB>(hue);

  useEffect(() => { reducedRef.current = reduced; }, [reduced]);
  useEffect(() => { hueRef.current = hue; }, [hue]);

  // Expose the drag state so a shell can offer Reset / Zoom controls and a
  // keyboard path. Zoom limits mirror the wheel handler's exactly.
  const handle = useMemo<StageHandle>(() => ({
    reset() {
      const d = drag.current;
      d.rx = -0.15; d.ry = 0.5; d.vx = 0; d.vy = 0; d.zoom = 1;
    },
    zoomBy(factor: number) {
      const d = drag.current;
      d.zoom = Math.max(0.55, Math.min(2.4, d.zoom * factor));
    },
    rotateBy(dx: number, dy: number) {
      const d = drag.current;
      d.ry += dx; d.rx += dy; d.vx = 0; d.vy = 0;
    },
  }), []);
  useImperativeHandle(ref, () => handle, [handle]);
  useEffect(() => {
    if (!handleRef) return;
    handleRef.current = handle;
    return () => { handleRef.current = null; };
  }, [handle, handleRef]);
  useEffect(() => {
    geomRef.current = geometryId ? getGeometry(geometryId) : null;
  }, [geometryId]);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let w = 0, h = 0;
    const dpr = cappedDpr();

    // Pre-baked glow + sphere sprites, built once per mount. The molecule's
    // element palette is fixed, so its atom bloom + sphere become five cached
    // bitmaps each; the field's tint animates, so its glow is cached lazily by
    // rounded hue. See lib/canvas-glow for why this beats per-frame gradients.
    const bloomSprites = new Map<string, HTMLCanvasElement>();
    const sphereSprites = new Map<string, HTMLCanvasElement>();
    for (const [el, pal] of Object.entries(ELEMENT_COLOR)) {
      bloomSprites.set(el, makeGlowSprite(pal.glowRgb, 0.55));
      sphereSprites.set(el, makeSphereSprite(pal));
    }
    const fieldGlow = createGlowCache();

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
      // Device-pixel-exact backing store — crisp on fractional layout widths.
      ({ w, h } = fitCanvas(cv, ctx, dpr));
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
      // Camera derived from this structure, not from three constants shared by
      // all 87 of them — see `cameraFit` in molecule.ts for what each number
      // replaces and why. 0.88 leaves the frame a margin for the atom spheres,
      // whose radius is added around the projected point.
      const fit = cameraFit(geom);
      const unit = ((Math.min(w, h) / 2) * 0.94) / fit.radius;
      const scale = unit * d.zoom;
      const eye = fit.eye;
      const cx = w / 2, cy = h / 2;
      const cosY = Math.cos(d.ry), sinY = Math.sin(d.ry);
      const cosX = Math.cos(d.rx), sinX = Math.sin(d.rx);
      const proj = geom.atoms.map((a) => {
        const ax = a.x - fit.cx, ay = a.y - fit.cy, az = a.z - fit.cz;
        const x = ax * cosY - az * sinY;
        let z = ax * sinY + az * cosY;
        const y = ay * cosX - z * sinX;
        z = ay * sinX + z * cosX;
        const persp = eye / (eye + z);
        return { sx: cx + x * scale * persp, sy: cy + y * scale * persp, z, persp, el: a.el };
      });
      // Depth is a fraction of this molecule's own radius, so a compact and a
      // long structure shade across the same range instead of the long one
      // pinning to the extremes of a hardcoded -3..3.
      const depthOf = (z: number) => Math.min(1, Math.max(0, (z + fit.radius) / (fit.radius * 2)));
      // Every stroke width and sphere radius below used to be a pixel constant
      // tuned against one stage size, which is why the same molecule on a phone
      // was not a smaller drawing but a cruder one — spheres nearly touching,
      // bonds lost between them. Expressed per geometry unit they hold their
      // proportions at any stage size. The values are the old pixel numbers
      // divided by the scale they were tuned at (58.2 px/unit).
      const px = (units: number) => units * scale;
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
        const depth = depthOf(bd.z);
        const alpha = 0.35 + (1 - depth) * 0.55;
        const lw = Math.max(1, px(0.0326 + (1 - depth) * 0.0515) * ((p.persp + q.persp) / 2));
        const grad = ctx.createLinearGradient(p.sx, p.sy, q.sx, q.sy);
        grad.addColorStop(0, `rgba(190,215,255,${alpha})`);
        grad.addColorStop(1, `rgba(140,170,220,${alpha * 0.85})`);
        if (bd.order === 2) {
          const dx = q.sy - p.sy, dy = -(q.sx - p.sx);
          const len = Math.hypot(dx, dy) || 1; const off = Math.max(1.6, px(0.0447));
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
      // Nearest first. The bonds above sort the other way, farthest first,
      // which is the painter's order that makes a nearer thing cover a farther
      // one; the atoms have always used the opposite comparator in the same
      // function, so a small dim back atom was painted over the large bright
      // front one it passes behind. The spheres are drawn from the back of this
      // list forward to put that right, and the symbol pass below walks it
      // front-to-back so that when two symbols collide it is the nearer atom
      // that keeps its letter.
      const order = proj.map((p, idx) => ({ ...p, idx })).sort((a, b) => a.z - b.z);
      for (let oi = order.length - 1; oi >= 0; oi -= 1) {
        const p = order[oi];
        const depth = depthOf(p.z);
        const isHetero = p.el !== "C";
        const rad = px(isHetero ? 0.189 : 0.155) * p.persp * (1.2 - depth * 0.3);
        const el = ELEMENT_COLOR[p.el] ? p.el : "C";
        const a = 0.94 - depth * 0.35;
        // Bloom halo, then the lit sphere — both cached bitmaps blitted at this
        // atom's radius and dimmed by depth via globalAlpha (was two live
        // radial gradients allocated per atom, per frame).
        blitGlow(ctx, bloomSprites.get(el)!, p.sx, p.sy, rad * 3, 0.55 * a);
        blitGlow(ctx, sphereSprites.get(el)!, p.sx, p.sy, rad, a);
        ctx.strokeStyle = `rgba(180,220,255,${0.4 * a})`; ctx.lineWidth = Math.max(0.5, px(0.0155));
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rad, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
      }

      // ── Heteroatom symbols ──
      //
      // Three things were wrong with printing "OH" inside the atom loop.
      //
      // It was false. Every oxygen got the caption regardless of what it was
      // bonded to; across the shipped structures that mislabelled 242 oxygens
      // as hydroxyls, including every oxygen in CoQ10 and berberine, which have
      // no hydroxyl at all. `labelForAtom` now prints the element symbol, which
      // is what the geometry actually records — see the note in molecule.ts.
      //
      // It collided. On a 390px phone the stage is small enough that adjacent
      // oxygens overlapped into an unreadable smudge, so the labels are placed
      // here in their own pass, nearest atom first, and any symbol whose box
      // would overlap one already placed is dropped rather than drawn on top.
      // A dropped symbol costs nothing: the sphere colour still identifies the
      // element, and `heteroatomSummary` carries the full tally in text.
      //
      // And it was fixed at 11px scaled only by perspective, so on a small
      // stage the type was larger than the sphere it sat on. The size now
      // follows the atom's own projected radius.
      const placed: { x: number; y: number; w: number; h: number }[] = [];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const p of order) {
        const sym = labelForAtom(p.el);
        if (!sym) continue;
        const depth = depthOf(p.z);
        // Back-half atoms are dimmed toward the background, where dark ink
        // stops resolving. Colour carries those; only the front half is
        // lettered.
        if (depth > 0.62) continue;
        const rad = px(0.189) * p.persp * (1.2 - depth * 0.3);
        const fs = Math.round(rad * (sym.length > 1 ? 0.92 : 1.12));
        if (fs < 8) continue;
        ctx.font = `600 ${fs}px 'JetBrains Mono', monospace`;
        const w = ctx.measureText(sym).width;
        const box = { x: p.sx - w / 2 - 1.5, y: p.sy - fs / 2 - 1.5, w: w + 3, h: fs + 3 };
        if (placed.some((q) =>
          box.x < q.x + q.w && q.x < box.x + box.w && box.y < q.y + q.h && q.y < box.y + box.h,
        )) continue;
        placed.push(box);
        // Every element core in the palette is a light tint, so dark ink is the
        // contrast-safe choice on all of them and stays so if a colour is
        // retuned. Same reasoning as a ball-and-stick viewer: the label belongs
        // to the sphere, not to the background.
        ctx.fillStyle = `rgba(14,18,30,${Math.min(1, 1.06 - depth * 0.45)})`;
        ctx.fillText(sym, p.sx, p.sy);
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
        blitGlow(ctx, fieldGlow([cr, cg, cb]), p.sx, p.sy, rad, 0.85 * tw);
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
  const onWheel = (e: WheelEvent) => {
    if (!canInteract) return;
    e.preventDefault();
    const d = drag.current;
    d.zoom = Math.max(0.55, Math.min(2.4, d.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={ariaLabel ?? "Molecular structure visualization"}
      style={{ width: "100%", height: "100%", display: "block", cursor: canInteract ? "grab" : "default", ...style }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      onWheel={onWheel}
    />
  );
});
