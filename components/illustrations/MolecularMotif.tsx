import type { ThemeAccent } from '@/lib/design-system';

interface MolecularMotifProps {
  /** Which section theme's accent color drives the primary strokes/glow */
  theme?: ThemeAccent;
  /** 'hero' = large hero backdrop; 'compact' = hub-header accent */
  size?: 'hero' | 'compact';
  className?: string;
}

const ACCENT_VAR: Record<ThemeAccent, string> = {
  cyan: 'var(--accent-cyan)',
  emerald: 'var(--accent-emerald)',
  violet: 'var(--accent-violet)',
  rose: 'var(--accent-rose)',
  amber: 'var(--accent-amber)',
};

/** Regular hexagon vertices — used for the two aromatic-ring motifs */
function hexPoints(cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
}

function ringPath(points: [number, number][]): string {
  return `M ${points.map((p) => p.join(',')).join(' L ')} Z`;
}

/** Short, perpendicular-offset, inset parallel line — the standard
 * chemistry-diagram convention for drawing a double bond next to an edge. */
function doubleBondLine(p1: [number, number], p2: [number, number]) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * 4;
  const ny = (dx / len) * 4;
  const inset = 0.18;
  return {
    x1: x1 + dx * inset + nx,
    y1: y1 + dy * inset + ny,
    x2: x1 + dx * (1 - inset) + nx,
    y2: y1 + dy * (1 - inset) + ny,
  };
}

const HELIX_TWISTS = 4; // full half-turns across the strand — more twists reads as more visibly intertwined

function pointToStr([x, y]: [number, number]): string {
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

function pointsToPath(points: [number, number][]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${pointToStr(p)}`).join(' ');
}

/** Deviation of the two mirror-image strands at a given point along the helix */
function helixDeviations(t: number, amplitude: number): [number, number] {
  const theta = t * Math.PI * HELIX_TWISTS;
  const d0 = amplitude * Math.sin(theta);
  return [d0, -d0];
}

/**
 * A real double helix reads as *intertwined* only if one strand visibly
 * passes over the other at each twist — two flat overlapping sine paths
 * don't sell that. So instead of drawing "strand A" and "strand B" as two
 * whole paths (whichever is drawn second would sit on top everywhere,
 * right or wrong), this samples the pair of mirror-image sine strands and,
 * point by point, sorts them into a continuous "front" envelope (always on
 * top) and a "back" envelope broken into short segments with a small gap
 * right at each crossing — the standard illustrator's trick for showing
 * one strand ducking behind the other.
 */
function helixWeave(cx: number, top: number, bottom: number, amplitude: number, steps: number) {
  const sample = (t: number, front: boolean): [number, number] => {
    const [d0, d1] = helixDeviations(t, amplitude);
    const d = front ? Math.max(d0, d1) : Math.min(d0, d1);
    return [cx + d, top + t * (bottom - top)];
  };

  const frontPoints = Array.from({ length: steps + 1 }, (_, i) => sample(i / steps, true));

  const gapHalfWidth = 0.018;
  const crossings = Array.from({ length: HELIX_TWISTS - 1 }, (_, i) => (i + 1) / HELIX_TWISTS);
  const boundaries = [0, ...crossings, 1];
  const backSegments = boundaries.slice(0, -1).map((start, i) => {
    const end = boundaries[i + 1];
    const segStart = i === 0 ? start : start + gapHalfWidth;
    const segEnd = i === boundaries.length - 2 ? end : end - gapHalfWidth;
    const segSteps = Math.max(4, Math.round(steps * (segEnd - segStart)));
    const pts = Array.from({ length: segSteps + 1 }, (_, j) => sample(segStart + (j / segSteps) * (segEnd - segStart), false));
    return pointsToPath(pts);
  });

  return { frontPath: pointsToPath(frontPoints), backSegments };
}

const RING_A = hexPoints(96, 108, 44);
const RING_B = hexPoints(184, 132, 34);
const HELIX_CX = 150;
const HELIX_TOP = 210;
const HELIX_BOTTOM = 440;
const HELIX_STEPS = 10;
const HELIX_AMPLITUDE = 26;

const RING_A_PATH = ringPath(RING_A);
const RING_B_PATH = ringPath(RING_B);
const { frontPath: HELIX_FRONT_PATH, backSegments: HELIX_BACK_SEGMENTS } = helixWeave(
  HELIX_CX, HELIX_TOP, HELIX_BOTTOM, HELIX_AMPLITUDE, 64,
);
const RING_BOND_PATH = `M ${RING_A[1].join(',')} L ${RING_B[4].join(',')}`;
const HELIX_LEAD_IN_PATH = `M ${RING_B[2][0]},${RING_B[2][1]} Q ${RING_B[2][0] + 10},${(RING_B[2][1] + HELIX_TOP) / 2} ${HELIX_CX},${HELIX_TOP}`;

/**
 * Literal molecular / scientific-diagram motif for hero and hub-header
 * backdrops — a two-ring "compound" sketch (atoms, bonds, alternating double
 * bonds) flowing into a DNA double helix with base-pair rungs. Every stroke
 * is drawn twice — a wide, blurred "glow" pass underneath a crisp pass on
 * top — and atoms use a radial gradient plus a small specular dot, for a
 * lit, dimensional look rather than flat vector lines. Purely decorative
 * (aria-hidden) and server-rendered; its one ambient glow pulse is a plain
 * CSS animation, so the site's global `prefers-reduced-motion: reduce` rule
 * (app/globals.css) neutralizes it automatically — no client JS needed.
 */
export function MolecularMotif({ theme = 'cyan', size = 'hero', className = '' }: MolecularMotifProps) {
  const accent = ACCENT_VAR[theme];
  const orbId = `motif-orb-${theme}`;
  const fadeId = `motif-fade-${theme}`;
  const softGlowId = `motif-blur-soft-${theme}`;
  const wideGlowId = `motif-blur-wide-${theme}`;

  const helixRungs = Array.from({ length: HELIX_STEPS + 1 }, (_, i) => {
    const t = i / HELIX_STEPS;
    const y = HELIX_TOP + t * (HELIX_BOTTOM - HELIX_TOP);
    const [d0, d1] = helixDeviations(t, HELIX_AMPLITUDE);
    return { x1: HELIX_CX + d0, x2: HELIX_CX + d1, y };
  });

  const doubleBonds = [0, 2, 4].map((i) => doubleBondLine(RING_A[i], RING_A[(i + 1) % 6]));

  return (
    <svg
      viewBox="0 0 300 460"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none select-none ${size === 'compact' ? 'w-32 h-48 md:w-40 md:h-60' : 'w-full h-full'} ${className}`}
    >
      <defs>
        <linearGradient id={fadeId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id={orbId} cx="32%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.55" />
        </radialGradient>
        <filter id={softGlowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" />
        </filter>
        <filter id={wideGlowId} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
        </filter>
      </defs>

      {/* Layered bloom — soft, diffuse light pools behind the ring cluster
          and the length of the helix, echoing the hero's own blur orbs but
          scoped to this motif so it still reads at "compact" header size. */}
      <g filter={`url(#${wideGlowId})`}>
        <circle cx={RING_A[0][0]} cy={RING_A[0][1]} r="58" fill={accent} opacity="0.16" className="motif-glow-pulse" />
        <circle cx={RING_B[0][0]} cy={RING_B[0][1]} r="34" fill={accent} opacity="0.14" />
        <ellipse cx={HELIX_CX} cy={(HELIX_TOP + HELIX_BOTTOM) / 2} rx="34" ry={(HELIX_BOTTOM - HELIX_TOP) / 2} fill={accent} opacity="0.08" />
      </g>

      {/* Glow pass — wide, blurred duplicate of every stroke beneath the
          crisp linework, so bonds and strands read as lit neon rather than
          flat vector lines. */}
      <g fill="none" strokeLinecap="round" filter={`url(#${softGlowId})`} opacity="0.55">
        <path d={RING_A_PATH} stroke={accent} strokeWidth="4.5" />
        <path d={RING_B_PATH} stroke={accent} strokeWidth="4" />
        <path d={RING_BOND_PATH} stroke={accent} strokeWidth="4" />
        <path d={HELIX_LEAD_IN_PATH} stroke={accent} strokeWidth="3.5" />
        <path d={HELIX_FRONT_PATH} stroke={accent} strokeWidth="4.5" />
        {HELIX_BACK_SEGMENTS.map((d, i) => (
          <path key={i} d={d} stroke={accent} strokeWidth="3.5" />
        ))}
      </g>

      <g opacity="0.95" strokeLinecap="round">
        {/* Ring A — six-membered aromatic ring, alternating double bonds */}
        <path d={RING_A_PATH} fill="none" stroke={accent} strokeWidth="2" opacity="0.65" />
        {doubleBonds.map((bond, i) => (
          <line
            key={i}
            x1={bond.x1}
            y1={bond.y1}
            x2={bond.x2}
            y2={bond.y2}
            stroke={accent}
            strokeWidth="1.5"
            opacity="0.5"
          />
        ))}
        {RING_A.map(([x, y], i) => {
          const featured = i % 3 === 0;
          return (
            <g key={`a-${i}`}>
              <circle cx={x} cy={y} r={featured ? 4.5 : 3} fill={featured ? `url(#${orbId})` : '#fafafa'} opacity={featured ? 1 : 0.55} />
              {featured && <circle cx={x - 1.3} cy={y - 1.3} r="1" fill="#ffffff" opacity="0.9" />}
            </g>
          );
        })}

        {/* Bond connecting the two rings */}
        <path d={RING_BOND_PATH} stroke={accent} strokeWidth="2" opacity="0.55" />

        {/* Ring B — smaller heteroatom ring (nitrogen-tinted vertex, NAD+/purine-style) */}
        <path d={RING_B_PATH} fill="none" stroke={accent} strokeWidth="1.75" opacity="0.55" />
        {RING_B.map(([x, y], i) => {
          const featured = i === 1;
          return (
            <g key={`b-${i}`}>
              <circle cx={x} cy={y} r={featured ? 4 : 2.5} fill={featured ? '#fafafa' : `url(#${orbId})`} opacity={featured ? 0.9 : 0.65} />
              {featured && <circle cx={x - 1.1} cy={y - 1.1} r="0.9" fill="#ffffff" opacity="0.85" />}
            </g>
          );
        })}

        {/* Bond flowing from ring B into the helix */}
        <path d={HELIX_LEAD_IN_PATH} fill="none" stroke={accent} strokeWidth="1.75" opacity="0.45" />

        {/* DNA double helix — back strand + rungs drawn first, front strand
            drawn last so it visibly passes over both at every twist. */}
        {HELIX_BACK_SEGMENTS.map((d, i) => (
          <path key={`back-${i}`} d={d} fill="none" stroke="#fafafa" strokeOpacity="0.32" strokeWidth="2" />
        ))}
        {helixRungs.map((r, i) => (
          <line key={`rung-${i}`} x1={r.x1} y1={r.y} x2={r.x2} y2={r.y} stroke={accent} strokeWidth="1.25" opacity="0.35" />
        ))}
        <path d={HELIX_FRONT_PATH} fill="none" stroke={`url(#${fadeId})`} strokeWidth="2.25" />
      </g>
    </svg>
  );
}
