import { HALLMARKS, type HallmarkId } from '@/lib/compound-engine-data';

// ─────────────────────────────────────────────────────────────────────────────
// HallmarkReachRadial — a 12-spoke radial "mechanistic reach" diagram for a
// compound deep-dive. Each of the twelve López-Otín aging hallmarks sits at a
// fixed clock position (canonical HALLMARKS order); the ones a compound engages
// light up and are joined into a reach polygon, so the shape reads breadth at a
// glance: a wide net vs. a focused single-mechanism agent.
//
// REAL DATA ONLY — driven by the compound's own `hallmarks` array (the same
// field the Compound Intelligence Matrix lists as text). No hallmark is ever
// invented; unengaged spokes render faint. Pure SVG, server-safe, no client JS.
// The <title>/role give it an accessible summary; the sibling text list in the
// matrix remains the full non-visual fallback.
// ─────────────────────────────────────────────────────────────────────────────

interface HallmarkReachRadialProps {
  /** Hallmark ids the compound engages. */
  engaged: HallmarkId[];
  /** Accent for lit nodes + reach polygon (e.g. the compound's score color). */
  color: string;
  /** Square viewBox size in user units. Rendered responsively via width:100%. */
  size?: number;
}

export function HallmarkReachRadial({ engaged, color, size = 260 }: HallmarkReachRadialProps) {
  const engagedSet = new Set(engaged);
  const cx = size / 2;
  const cy = size / 2;
  const rNode = size * 0.34; // node ring radius
  const rLabel = size * 0.44; // label ring radius

  // Fixed clock positions: hallmark 0 at 12 o'clock, then clockwise every 30°.
  const nodes = HALLMARKS.map((h, i) => {
    const angle = (-90 + i * 30) * (Math.PI / 180);
    return {
      h,
      lit: engagedSet.has(h.id),
      x: cx + rNode * Math.cos(angle),
      y: cy + rNode * Math.sin(angle),
      lx: cx + rLabel * Math.cos(angle),
      ly: cy + rLabel * Math.sin(angle),
      cos: Math.cos(angle),
    };
  });

  const litNodes = nodes.filter((n) => n.lit);
  const reachPoints = litNodes.map((n) => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' ');
  const engagedLabels = litNodes.map((n) => n.h.label).join(', ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full"
      style={{ maxWidth: size, height: 'auto' }}
      role="img"
      aria-label={`Mechanistic reach: engages ${litNodes.length} of 12 aging hallmarks${
        engagedLabels ? ` — ${engagedLabels}` : ''
      }`}
    >
      {/* Concentric guide rings */}
      {[rNode, rNode * 0.62].map((r) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="color-mix(in srgb, var(--color-text-primary) 7%, transparent)"
          strokeWidth={1}
        />
      ))}

      {/* Faint spokes to every position */}
      {nodes.map((n) => (
        <line
          key={`spoke-${n.h.id}`}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
          stroke={
            n.lit
              ? `color-mix(in srgb, ${color} 32%, transparent)`
              : 'color-mix(in srgb, var(--color-text-primary) 5%, transparent)'
          }
          strokeWidth={1}
        />
      ))}

      {/* Reach polygon through engaged nodes (needs 3+ points to read as an area) */}
      {litNodes.length >= 3 && (
        <polygon
          points={reachPoints}
          fill={`color-mix(in srgb, ${color} 14%, transparent)`}
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 5px color-mix(in srgb, ${color} 45%, transparent))` }}
        />
      )}
      {litNodes.length === 2 && (
        <line
          x1={litNodes[0].x}
          y1={litNodes[0].y}
          x2={litNodes[1].x}
          y2={litNodes[1].y}
          stroke={color}
          strokeWidth={1.5}
        />
      )}

      {/* Nodes */}
      {nodes.map((n) => (
        <circle
          key={`node-${n.h.id}`}
          cx={n.x}
          cy={n.y}
          r={n.lit ? 4.5 : 2.2}
          fill={n.lit ? color : 'color-mix(in srgb, var(--color-text-primary) 22%, transparent)'}
          style={n.lit ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined}
        />
      ))}

      {/* Short labels */}
      {nodes.map((n) => (
        <text
          key={`label-${n.h.id}`}
          x={n.lx}
          y={n.ly}
          textAnchor={n.cos > 0.3 ? 'start' : n.cos < -0.3 ? 'end' : 'middle'}
          dominantBaseline="middle"
          style={{
            fontFamily: 'var(--font-mono, ui-monospace, monospace)',
            fontSize: 8,
            letterSpacing: '0.04em',
            fill: n.lit ? color : 'var(--color-text-faint)',
            opacity: n.lit ? 1 : 0.55,
          }}
        >
          {n.h.short}
        </text>
      ))}

      {/* Center readout */}
      <text
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: 'var(--font-display, Fraunces, serif)',
          fontWeight: 600,
          fontSize: size * 0.14,
          letterSpacing: '-0.02em',
          fill: color,
        }}
      >
        {litNodes.length}
      </text>
      <text
        x={cx}
        y={cy + size * 0.08}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: 'var(--font-mono, ui-monospace, monospace)',
          fontSize: 8.5,
          letterSpacing: '0.12em',
          fill: 'var(--color-text-faint)',
        }}
      >
        OF 12
      </text>
    </svg>
  );
}
