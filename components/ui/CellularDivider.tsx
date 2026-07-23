import { cn } from '@/lib/utils';

/**
 * Section-boundary motif: a small molecular-cluster glyph sitting on the
 * hairline border between homepage sections, in place of a bare `border-t`.
 * Replaces the generic blurred-orb/gradient-blob language used elsewhere with
 * something that actually reads as "cellular" — a restrained connective-tissue
 * detail repeated at every section seam so it reads as a deliberate system.
 *
 * Phase 3 raised it into a chaptered descent: the primary nodes and the two
 * traveling "signal" pulses take the color of the section the seam introduces
 * (`hue`), so the seam previews that section's identity; an optional
 * `index` + `label` render a small editorial chapter marker above the glyph.
 * All new props are optional — a bare `<CellularDivider />` is the original
 * cyan motif, now gently animated.
 *
 * Purely decorative — aria-hidden, no semantic content, zero layout impact
 * (absolutely positioned over the section's own border line). The pulse and
 * the chapter marker never affect the glyph's position on the seam.
 */
export function CellularDivider({
  className,
  hue,
  index,
  label,
}: {
  className?: string;
  /** CSS color for the primary nodes + signal pulses. Defaults to cyan. */
  hue?: string;
  /** Optional chapter number (e.g. "01"), shown in the seam hue. */
  index?: string;
  /** Optional editorial chapter label paired with the index. */
  label?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'cellular-divider pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2',
        className,
      )}
      style={hue ? ({ '--seam-hue': hue } as React.CSSProperties) : undefined}
    >
      {(index || label) && (
        <span className="cd-chapter">
          {index && <b>{index}</b>}
          {label && <span>{label}</span>}
        </span>
      )}

      {/* color is set on the container (.cellular-divider) so the primary
          elements can inherit it via currentColor; the secondary nodes keep
          their own emerald so the motif stays a deliberate two-accent mark. */}
      <svg width="132" height="28" viewBox="0 0 132 28" fill="none" className="cd-glyph">
        <line x1="0" y1="14" x2="42" y2="14" stroke="var(--color-border-strong)" strokeWidth="1" />
        <line x1="90" y1="14" x2="132" y2="14" stroke="var(--color-border-strong)" strokeWidth="1" />

        <g strokeWidth="1">
          <line x1="50" y1="14" x2="66" y2="6" stroke="currentColor" strokeOpacity="0.45" />
          <line x1="50" y1="14" x2="66" y2="22" stroke="currentColor" strokeOpacity="0.45" />
        </g>
        <g strokeWidth="1" className="text-accent-emerald">
          <line x1="66" y1="6" x2="82" y2="14" stroke="currentColor" strokeOpacity="0.45" />
          <line x1="66" y1="22" x2="82" y2="14" stroke="currentColor" strokeOpacity="0.45" />
        </g>

        <circle cx="50" cy="14" r="3" fill="currentColor" />
        <circle cx="66" cy="6" r="2.25" className="text-accent-emerald" fill="currentColor" />
        <circle cx="66" cy="22" r="2.25" className="text-accent-emerald" fill="currentColor" />
        <circle cx="82" cy="14" r="3" fill="currentColor" />

        <circle cx="50" cy="14" r="6" fill="currentColor" fillOpacity="0.12" />
        <circle cx="82" cy="14" r="6" fill="currentColor" fillOpacity="0.12" />

        {/* traveling signal pulses along the outer bonds toward the cluster */}
        <circle className="cd-flow cd-flow-l" cx="2" cy="14" r="1.6" fill="currentColor" />
        <circle className="cd-flow cd-flow-r" cx="130" cy="14" r="1.6" fill="currentColor" />
      </svg>
    </div>
  );
}
