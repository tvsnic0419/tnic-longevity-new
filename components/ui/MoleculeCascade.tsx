import { MOLECULES, type Molecule, type Pt } from './molecules';

/**
 * Site-wide molecular structure cascade — a field of authentic skeletal
 * chemical structures (the compounds the library is built on) drifting behind
 * every page. Server-rendered SVG: zero client JS, GPU-cheap transform drift,
 * theme-aware via currentColor, and fully disabled under reduced-motion.
 */

const STROKE = 2.4;
const DOUBLE_OFFSET = 1.7;
const LABEL_GAP = 6.5; // bonds stop short of a labeled atom, as in real skeletal formulae

/** If an endpoint sits on a labeled atom, pull it back toward the other end so
 *  the heteroatom glyph (N / O / S) reads cleanly in a gap. */
function trimToLabel([x1, y1]: Pt, [x2, y2]: Pt, labelPts: Pt[]): Pt {
  const onLabel = labelPts.some((p) => Math.hypot(p[0] - x1, p[1] - y1) < 2.5);
  if (!onLabel) return [x1, y1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return [x1 + (dx / len) * LABEL_GAP, y1 + (dy / len) * LABEL_GAP];
}

function bondPaths(m: Molecule): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const labelPts = m.labels.map((l) => l.at);
  m.bonds.forEach((b, i) => {
    const [x1, y1] = trimToLabel(b.a, b.b, labelPts);
    const [x2, y2] = trimToLabel(b.b, b.a, labelPts);
    if (b.order === 1) {
      nodes.push(<line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />);
      return;
    }
    // double bond: two parallel lines offset along the perpendicular
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ox = (-dy / len) * DOUBLE_OFFSET;
    const oy = (dx / len) * DOUBLE_OFFSET;
    // shorten the inner pair slightly for the classic skeletal look
    const sx = dx * 0.12;
    const sy = dy * 0.12;
    nodes.push(
      <line key={`b${i}a`} x1={x1 + ox} y1={y1 + oy} x2={x2 + ox} y2={y2 + oy} />,
      <line
        key={`b${i}b`}
        x1={x1 - ox + sx}
        y1={y1 - oy + sy}
        x2={x2 - ox - sx}
        y2={y2 - oy - sy}
      />,
    );
  });
  return nodes;
}

function MoleculeSvg({ molecule }: { molecule: Molecule }) {
  return (
    <svg
      viewBox={`-6 -6 ${molecule.w + 12} ${molecule.h + 12}`}
      className="molecule-svg"
      role="presentation"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {bondPaths(molecule)}
      </g>
      <g fill="currentColor" stroke="none" className="molecule-atoms">
        {molecule.labels.map((l, i) => (
          <text key={`l${i}`} x={l.at[0]} y={l.at[1]} dy="0.32em" textAnchor="middle">
            {l.text}
          </text>
        ))}
      </g>
    </svg>
  );
}

/** Scatter field — each instance: molecule id, position, scale, rotation, hue tier. */
interface Instance {
  m: string;
  top: string;
  left: string;
  scale: number;
  rot: number;
  hue: 'cyan' | 'emerald' | 'violet';
  depth: 1 | 2 | 3; // opacity/drift tier (1 = faintest/farthest)
  delay: number;
}

const FIELD: Instance[] = [
  { m: 'berberine', top: '6%', left: '-4%', scale: 1.5, rot: -8, hue: 'cyan', depth: 1, delay: 0 },
  { m: 'fisetin', top: '54%', left: '4%', scale: 1.15, rot: 12, hue: 'violet', depth: 2, delay: -6 },
  { m: 'resveratrol', top: '22%', left: '66%', scale: 1.35, rot: -14, hue: 'emerald', depth: 2, delay: -11 },
  { m: 'spermidine', top: '78%', left: '58%', scale: 1.2, rot: 6, hue: 'cyan', depth: 1, delay: -3 },
  { m: 'nicotinamide', top: '70%', left: '30%', scale: 1.0, rot: 18, hue: 'emerald', depth: 3, delay: -14 },
  { m: 'sulforaphane', top: '40%', left: '40%', scale: 0.95, rot: -6, hue: 'violet', depth: 1, delay: -8 },
  { m: 'resveratrol', top: '2%', left: '34%', scale: 0.8, rot: 20, hue: 'cyan', depth: 3, delay: -17 },
  { m: 'nicotinamide', top: '30%', left: '86%', scale: 1.25, rot: -20, hue: 'violet', depth: 2, delay: -2 },
  { m: 'fisetin', top: '82%', left: '84%', scale: 0.9, rot: -10, hue: 'emerald', depth: 3, delay: -9 },
  { m: 'berberine', top: '48%', left: '72%', scale: 0.85, rot: 14, hue: 'cyan', depth: 3, delay: -5 },
  { m: 'spermidine', top: '14%', left: '8%', scale: 0.9, rot: -4, hue: 'violet', depth: 3, delay: -13 },
  { m: 'sulforaphane', top: '90%', left: '10%', scale: 0.8, rot: 10, hue: 'emerald', depth: 3, delay: -16 },
];

const byId = new Map(MOLECULES.map((m) => [m.id, m]));

export function MoleculeCascade() {
  return (
    <div className="molecule-cascade" aria-hidden="true">
      {FIELD.map((inst, i) => {
        const molecule = byId.get(inst.m);
        if (!molecule) return null;
        return (
          <div
            key={i}
            className={`molecule-node hue-${inst.hue} depth-${inst.depth}`}
            style={{
              top: inst.top,
              left: inst.left,
              // width scales the whole structure; drift/rotation handled in CSS
              width: `${molecule.w * inst.scale * 1.3}px`,
              // custom props consumed by the CSS drift keyframes
              ['--rot' as string]: `${inst.rot}deg`,
              ['--delay' as string]: `${inst.delay}s`,
            }}
          >
            <MoleculeSvg molecule={molecule} />
          </div>
        );
      })}
    </div>
  );
}
