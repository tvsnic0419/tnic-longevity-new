/**
 * Shared SVG <defs> for the data-viz "instrument" look — one glow recipe so
 * every gauge, sparkline and chart accent reads as the same luminous system.
 *
 * Filter ids must be unique per SVG document, so each consumer passes its own
 * `useId()`-derived id and drops these inside its own <defs>. Apply the glow
 * with `filter={`url(#${id})`}` on the stroke/mark you want to bloom.
 */

interface VizGlowProps {
  /** Unique filter id (e.g. from React useId). */
  id: string;
  /** Blur radius of the halo, in user units. */
  blur?: number;
}

/** Soft additive glow — blurs a copy of the mark and composites the crisp
 *  original back on top, so strokes/dots bloom without losing definition. */
export function VizGlow({ id, blur = 3 }: VizGlowProps) {
  return (
    <filter id={id} x="-75%" y="-75%" width="250%" height="250%">
      <feGaussianBlur stdDeviation={blur} result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

interface VizAreaGradientProps {
  /** Unique gradient id. */
  id: string;
  /** CSS color for the fill (defaults to the cyan accent). */
  color?: string;
  /** Opacity at the top of the area. */
  topOpacity?: number;
}

/** Vertical fade for area fills beneath a line — strong at the line, gone at
 *  the baseline. Reference as `fill={`url(#${id})`}`. */
export function VizAreaGradient({
  id,
  color = 'var(--accent-cyan)',
  topOpacity = 0.28,
}: VizAreaGradientProps) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={topOpacity} />
      <stop offset="100%" stopColor={color} stopOpacity={0} />
    </linearGradient>
  );
}
