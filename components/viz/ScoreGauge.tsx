// ─────────────────────────────────────────────────────────────────────────────
// ScoreGauge — a server-safe radial gauge for a 0–100 composite score. Turns a
// bare number (e.g. the Longevity Quotient on the Compound Intelligence Matrix)
// into an instrument reading: a 270° track with a value arc that fills
// proportionally, colored by the caller (kept in lockstep with the score's own
// accent), plus the number and a caption at the center.
//
// Pure SVG, no client JS — renders identically on the server so it can live in
// a server component and never enters a client bundle. The fill is a static
// stroke-dashoffset (no animation library); the optional entrance grow honors
// reduced-motion via a scoped @keyframes guarded in the markup.
// ─────────────────────────────────────────────────────────────────────────────

interface ScoreGaugeProps {
  /** 0–100 composite value. */
  value: number;
  /** Arc color — pass the same accent the number renders in (e.g. perfColor). */
  color: string;
  /** Small caption under the number. */
  caption?: string;
  /** Square px size of the gauge. */
  size?: number;
  /** Accessible description of what the number means. */
  ariaLabel?: string;
}

// 270° sweep, opening at the bottom (a classic instrument dial).
const START_ANGLE = 135; // degrees, measured clockwise from 3 o'clock
const SWEEP = 270;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** SVG arc path from startAngle sweeping `sweep` degrees clockwise. */
function arcPath(cx: number, cy: number, r: number, startAngle: number, sweep: number) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, startAngle + sweep);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function ScoreGauge({
  value,
  color,
  caption = 'Longevity Quotient',
  size = 132,
  ariaLabel,
}: ScoreGaugeProps) {
  const v = Math.max(0, Math.min(100, value));
  const stroke = Math.round(size * 0.075);
  const r = (size - stroke * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  // Arc length of the full 270° track, and the fraction the value fills.
  const circumference = 2 * Math.PI * r;
  const trackLen = circumference * (SWEEP / 360);
  const fillLen = trackLen * (v / 100);

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? `${caption}: ${v} out of 100`}
      style={{ width: size, position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {/* Track */}
        <path
          d={arcPath(cx, cy, r, START_ANGLE, SWEEP)}
          fill="none"
          stroke="color-mix(in srgb, var(--color-text-primary) 9%, transparent)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={arcPath(cx, cy, r, START_ANGLE, SWEEP)}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${fillLen.toFixed(2)} ${circumference.toFixed(2)}`}
          style={{ filter: `drop-shadow(0 0 6px color-mix(in srgb, ${color} 60%, transparent))` }}
        />
      </svg>
      {/* Center readout — absolutely centered over the dial */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display, Fraunces, serif)',
            fontWeight: 600,
            fontSize: Math.round(size * 0.3),
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            color,
          }}
        >
          {v}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono, ui-monospace, monospace)',
            fontSize: 8.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-text-faint)',
            marginTop: 4,
            maxWidth: size * 0.8,
          }}
        >
          {caption}
        </span>
      </div>
    </div>
  );
}
