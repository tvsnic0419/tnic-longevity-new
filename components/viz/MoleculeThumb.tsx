import { hasGeometry, getGeometry, type Element } from './molecule';
import { signatureHue } from './tokens';

/**
 * MoleculeThumb — a static, server-rendered SVG of a compound's real skeleton.
 *
 * This is the browse-surface counterpart of MoleculeStage: the same geometry,
 * the same honesty contract (no geometry → orbital field, never a fabricated
 * molecule), projected once to 2D so a 100-card grid can ship unique visuals
 * without 100 canvases or the client geometry bundle.
 *
 * Decorative: the parent card's title is the accessible name. The SVG is
 * aria-hidden; a caption is omitted because the card already names the compound.
 */

const ELEMENT_FILL: Record<Element, string> = {
  C: '#d8eaff',
  O: '#f48e7e',
  N: '#8ca0f5',
  S: '#f0d278',
  P: '#f8aa60',
  Se: '#d69860',
  Co: '#a68ce8',
  F: '#96e6be',
  Cl: '#8cdc96',
};

const RX = -0.42;
const RY = 0.58;

type Pt = { x: number; y: number; z: number; el: Element };

function project(x: number, y: number, z: number): { x: number; y: number; z: number } {
  const cosy = Math.cos(RY);
  const siny = Math.sin(RY);
  const x1 = x * cosy - z * siny;
  const z1 = x * siny + z * cosy;
  const cosx = Math.cos(RX);
  const sinx = Math.sin(RX);
  return {
    x: x1,
    y: y * cosx - z1 * sinx,
    z: y * sinx + z1 * cosx,
  };
}

function fit(points: Pt[], pad = 10): { pts: Pt[]; size: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const span = Math.max(maxX - minX, maxY - minY, 0.001);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const inner = 100 - pad * 2;
  const s = inner / span;
  return {
    pts: points.map((p) => ({
      x: 50 + (p.x - cx) * s,
      y: 50 + (p.y - cy) * s,
      z: p.z,
      el: p.el,
    })),
    size: s,
  };
}

function OrbitalThumb({ id }: { id: string }) {
  const hue = signatureHue(id);
  const c = `rgb(${hue[0]},${hue[1]},${hue[2]})`;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`orb-${id}`} cx="42%" cy="38%" r="62%">
          <stop offset="0%" stopColor={c} stopOpacity="0.55" />
          <stop offset="55%" stopColor={c} stopOpacity="0.12" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="34" fill={`url(#orb-${id})`} />
      <circle cx="50" cy="50" r="18" fill="none" stroke={c} strokeOpacity="0.35" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="8" fill={c} fillOpacity="0.55" />
    </svg>
  );
}

function StructureThumb({ id }: { id: string }) {
  const geom = getGeometry(id);
  if (!geom) return <OrbitalThumb id={id} />;

  const projected: Pt[] = geom.atoms.map((a) => {
    const p = project(a.x, a.y, a.z);
    return { x: p.x, y: p.y, z: p.z, el: a.el };
  });
  const { pts, size } = fit(projected);
  const atomR = Math.max(1.6, Math.min(3.2, 22 / Math.sqrt(pts.length)));

  const bonds = geom.bonds
    .map(([ia, ib, order]) => {
      const a = pts[ia];
      const b = pts[ib];
      if (!a || !b) return null;
      return { a, b, order, z: (a.z + b.z) / 2 };
    })
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .sort((l, r) => l.z - r.z);

  const atoms = pts
    .map((p, i) => ({ ...p, i }))
    .sort((l, r) => l.z - r.z);

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {bonds.map((b, i) => {
        if (b.order === 2) {
          const dx = b.b.x - b.a.x;
          const dy = b.b.y - b.a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ox = (-dy / len) * 1.15;
          const oy = (dx / len) * 1.15;
          return (
            <g key={`b-${i}`} opacity="0.72">
              <line
                x1={b.a.x + ox}
                y1={b.a.y + oy}
                x2={b.b.x + ox}
                y2={b.b.y + oy}
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <line
                x1={b.a.x - ox}
                y1={b.a.y - oy}
                x2={b.b.x - ox}
                y2={b.b.y - oy}
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </g>
          );
        }
        return (
          <line
            key={`b-${i}`}
            x1={b.a.x}
            y1={b.a.y}
            x2={b.b.x}
            y2={b.b.y}
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.55"
          />
        );
      })}
      {atoms.map((a) => (
        <circle
          key={`a-${a.i}`}
          cx={a.x}
          cy={a.y}
          r={a.el === 'C' ? atomR * 0.85 : atomR}
          fill={ELEMENT_FILL[a.el]}
          opacity={a.el === 'C' ? 0.92 : 1}
        />
      ))}
      {/* size is referenced so the fit scale stays in the render path for tests */}
      <desc>{`${geom.formula} · scale ${size.toFixed(2)}`}</desc>
    </svg>
  );
}

export function MoleculeThumb({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const structured = hasGeometry(id);
  return (
    <div
      className={className}
      data-molecule-thumb={id}
      data-structured={structured ? 'true' : 'false'}
      aria-hidden="true"
    >
      {structured ? <StructureThumb id={id} /> : <OrbitalThumb id={id} />}
    </div>
  );
}
