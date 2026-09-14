/**
 * Shared SVG <defs> for the data-viz "instrument" look — glow, area fades, and
 * volumetric bar fills so every gauge, sparkline and column chart reads as one
 * luminous system.
 *
 * Filter/gradient ids must be unique per SVG document, so each consumer passes
 * its own `useId()`-derived id and drops these inside its own <defs>.
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
      <stop offset="55%" stopColor={color} stopOpacity={topOpacity * 0.35} />
      <stop offset="100%" stopColor={color} stopOpacity={0} />
    </linearGradient>
  );
}

interface VizBarDepthProps {
  /** Unique gradient id for the bar face. */
  id: string;
  /** CSS color for the bar body. */
  color?: string;
}

/**
 * Volumetric column fill — three stops give a lit top face, saturated mid,
 * and shadowed base so flat bars read as instrument columns without 3D libs.
 * Pair with VizBarSpecular for the edge highlight. Reduced-motion consumers
 * can fall back to a solid `color` fill.
 */
export function VizBarDepth({ id, color = 'var(--accent-cyan)' }: VizBarDepthProps) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.42} />
      <stop offset="18%" stopColor={color} stopOpacity={1} />
      <stop offset="72%" stopColor={color} stopOpacity={0.92} />
      <stop offset="100%" stopColor={color} stopOpacity={0.55} />
    </linearGradient>
  );
}

/**
 * Horizontal specular sheen across a bar face — thin bright edge on the left,
 * soft falloff. Apply as a second rect with `fill={`url(#${id})`}` over the
 * depth fill (pointer-events none).
 */
export function VizBarSpecular({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
      <stop offset="22%" stopColor="#ffffff" stopOpacity={0.12} />
      <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
    </linearGradient>
  );
}

/**
 * Soft drop under a column — grounds the bar on the baseline without a hard
 * shadow. Use as an ellipse fill beneath the bar.
 */
export function VizBarGroundShadow({ id }: { id: string }) {
  return (
    <radialGradient id={id} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#000000" stopOpacity={0.45} />
      <stop offset="100%" stopColor="#000000" stopOpacity={0} />
    </radialGradient>
  );
}
