import { cn } from '@/lib/utils';

/**
 * Section-boundary motif: a small molecular-cluster glyph sitting on the
 * hairline border between homepage sections, in place of a bare
 * `border-t`. Replaces the generic blurred-orb/gradient-blob language used
 * elsewhere on the site with something that actually reads as "cellular" —
 * a restrained connective-tissue detail repeated at every section seam
 * rather than a one-off decoration, so it reads as a deliberate system.
 *
 * Purely decorative — aria-hidden, no semantic content, zero layout impact
 * (absolutely positioned over the section's own border line).
 */
export function CellularDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2',
        className,
      )}
    >
      <svg width="132" height="28" viewBox="0 0 132 28" fill="none">
        <line x1="0" y1="14" x2="42" y2="14" stroke="var(--color-border-strong)" strokeWidth="1" />
        <line x1="90" y1="14" x2="132" y2="14" stroke="var(--color-border-strong)" strokeWidth="1" />

        {/* four-node molecular cluster — two accent colors, never more, so it
            reads as one motif rather than a rainbow */}
        <g strokeWidth="1" className="text-accent-cyan">
          <line x1="50" y1="14" x2="66" y2="6" stroke="currentColor" strokeOpacity="0.45" />
          <line x1="50" y1="14" x2="66" y2="22" stroke="currentColor" strokeOpacity="0.45" />
        </g>
        <g strokeWidth="1" className="text-accent-emerald">
          <line x1="66" y1="6" x2="82" y2="14" stroke="currentColor" strokeOpacity="0.45" />
          <line x1="66" y1="22" x2="82" y2="14" stroke="currentColor" strokeOpacity="0.45" />
        </g>

        <circle cx="50" cy="14" r="3" className="text-accent-cyan" fill="currentColor" />
        <circle cx="66" cy="6" r="2.25" className="text-accent-emerald" fill="currentColor" />
        <circle cx="66" cy="22" r="2.25" className="text-accent-emerald" fill="currentColor" />
        <circle cx="82" cy="14" r="3" className="text-accent-cyan" fill="currentColor" />

        <circle cx="50" cy="14" r="6" className="text-accent-cyan" fill="currentColor" fillOpacity="0.12" />
        <circle cx="82" cy="14" r="6" className="text-accent-cyan" fill="currentColor" fillOpacity="0.12" />
      </svg>
    </div>
  );
}
