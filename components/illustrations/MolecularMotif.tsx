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

/** Sampled sine-wave strand for the DNA double helix */
function helixStrand(cx: number, top: number, bottom: number, amplitude: number, phase: number): string {
  const steps = 24;
  const points: [number, number][] = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const y = top + t * (bottom - top);
    const x = cx + amplitude * Math.sin(t * Math.PI * 3 + phase);
    return [x, y];
  });
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

const RING_A = hexPoints(96, 108, 44);
const RING_B = hexPoints(184, 132, 34);
const HELIX_CX = 150;
const HELIX_TOP = 210;
const HELIX_BOTTOM = 440;
const HELIX_STEPS = 8;

/**
 * Literal molecular / scientific-diagram motif for hero and hub-header
 * backdrops — a two-ring "compound" sketch (atoms, bonds, alternating double
 * bonds) flowing into a DNA double helix with base-pair rungs. Purely
 * decorative (aria-hidden) and server-rendered; its one ambient glow pulse
 * is a plain CSS animation, so the site's global
 * `prefers-reduced-motion: reduce` rule (app/globals.css) neutralizes it
 * automatically — no client JS needed.
 */
export function MolecularMotif({ theme = 'cyan', size = 'hero', className = '' }: MolecularMotifProps) {
  const accent = ACCENT_VAR[theme];

  const helixRungs = Array.from({ length: HELIX_STEPS + 1 }, (_, i) => {
    const t = i / HELIX_STEPS;
    const y = HELIX_TOP + t * (HELIX_BOTTOM - HELIX_TOP);
    const phase = t * Math.PI * 3;
    const x1 = HELIX_CX + 26 * Math.sin(phase);
    const x2 = HELIX_CX + 26 * Math.sin(phase + Math.PI);
    return { x1, x2, y };
  });

  return (
    <svg
      viewBox="0 0 300 460"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none select-none ${size === 'hero' ? 'w-full h-full' : 'w-32 h-48 md:w-40 md:h-60'} ${className}`}
    >
      <defs>
        <linearGradient id={`motif-fade-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
        </linearGradient>
        <filter id={`motif-glow-${theme}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      <g opacity="0.9" strokeLinecap="round">
        {/* Ring A — six-membered aromatic ring, alternating double bonds */}
        <path d={ringPath(RING_A)} fill="none" stroke={accent} strokeWidth="2" opacity="0.55" />
        {[0, 2, 4].map((i) => {
          const bond = doubleBondLine(RING_A[i], RING_A[(i + 1) % 6]);
          return (
            <line
              key={i}
              x1={bond.x1}
              y1={bond.y1}
              x2={bond.x2}
              y2={bond.y2}
              stroke={accent}
              strokeWidth="1.5"
              opacity="0.4"
            />
          );
        })}
        {RING_A.map(([x, y], i) => (
          <circle key={`a-${i}`} cx={x} cy={y} r={i % 3 === 0 ? 4.5 : 3} fill={i % 3 === 0 ? accent : '#fafafa'} opacity={i % 3 === 0 ? 0.9 : 0.5} />
        ))}

        {/* Bond connecting the two rings */}
        <line x1={RING_A[1][0]} y1={RING_A[1][1]} x2={RING_B[4][0]} y2={RING_B[4][1]} stroke={accent} strokeWidth="2" opacity="0.5" />

        {/* Ring B — smaller heteroatom ring (nitrogen-tinted vertex, NAD+/purine-style) */}
        <path d={ringPath(RING_B)} fill="none" stroke={accent} strokeWidth="1.75" opacity="0.5" />
        {RING_B.map(([x, y], i) => (
          <circle key={`b-${i}`} cx={x} cy={y} r={i === 1 ? 4 : 2.5} fill={i === 1 ? '#fafafa' : accent} opacity={i === 1 ? 0.85 : 0.45} />
        ))}

        {/* Bond flowing from ring B into the helix */}
        <path
          d={`M ${RING_B[2][0]},${RING_B[2][1]} Q ${RING_B[2][0] + 10},${(RING_B[2][1] + HELIX_TOP) / 2} ${HELIX_CX},${HELIX_TOP}`}
          fill="none"
          stroke={accent}
          strokeWidth="1.75"
          opacity="0.4"
        />

        {/* DNA double helix */}
        <path d={helixStrand(HELIX_CX, HELIX_TOP, HELIX_BOTTOM, 26, 0)} fill="none" stroke={`url(#motif-fade-${theme})`} strokeWidth="2.25" />
        <path d={helixStrand(HELIX_CX, HELIX_TOP, HELIX_BOTTOM, 26, Math.PI)} fill="none" stroke="#fafafa" strokeOpacity="0.3" strokeWidth="2" />
        {helixRungs.map((r, i) => (
          <line key={`rung-${i}`} x1={r.x1} y1={r.y} x2={r.x2} y2={r.y} stroke={accent} strokeWidth="1.25" opacity="0.3" />
        ))}
      </g>

      {/* Soft ambient glow behind ring A, echoing the hero's existing blur orbs */}
      <circle
        cx={RING_A[0][0]}
        cy={RING_A[0][1]}
        r="60"
        fill={accent}
        opacity="0.12"
        filter={`url(#motif-glow-${theme})`}
        className="motif-glow-pulse"
      />
    </svg>
  );
}
