import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * HallmarkChip — a signature TNiC component.
 *
 * A restrained, hairline-bordered chip that links a compound/comparison/stack
 * back to one of the twelve hallmarks of aging. This is the reusable atom for
 * hallmark ↔ entity interlinking, so every entity page can surface its targeted
 * hallmarks with one consistent, on-brand affordance instead of ad-hoc markup.
 *
 * Design principles it embodies (see docs/DESIGN_SYSTEM.md):
 *  - Hairline border + neutral surface at rest; a single accent (cyan) only on
 *    hover / focus. No gradient borders, no per-instance color soup.
 *  - A monospace number token gives it a "systematized" catalog feel.
 *  - Pure presentational + server-safe: it takes small serializable props, so
 *    heavy hallmark data stays in server components (bundle discipline).
 *
 * Every chip links to the canonical hallmark URL `/library/<slug>`; callers must
 * pass a slug that resolves (guarded by the graph tests), so chips never 404.
 */
export interface HallmarkChipProps {
  /** Canonical hallmark slug — resolves to /library/<slug>. */
  slug: string;
  /** Hallmark title, e.g. "Mitochondrial dysfunction". */
  title: string;
  /** Hallmark number (1–12) rendered as the leading token. Optional. */
  number?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function HallmarkChip({ slug, title, number, size = 'md', className }: HallmarkChipProps) {
  return (
    <Link
      href={`/library/${slug}`}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border border-border bg-card/40',
        'text-foreground/80 transition-colors',
        'hover:border-accent-cyan/50 hover:bg-accent-cyan/5 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        className,
      )}
    >
      {number !== undefined && (
        <span
          className={cn(
            'font-mono tabular-nums text-caption transition-colors group-hover:text-accent-cyan',
            size === 'sm' ? 'text-[10px]' : 'text-[11px]',
          )}
          aria-hidden="true"
        >
          {String(number).padStart(2, '0')}
        </span>
      )}
      <span className="font-medium leading-none">{title}</span>
    </Link>
  );
}

/**
 * A labelled, wrapping group of HallmarkChips. Use at the end of an entity page
 * ("Targets these hallmarks") or in a sidebar. Renders nothing when empty.
 */
export function HallmarkChipGroup({
  hallmarks,
  label = 'Targets these hallmarks',
  size = 'md',
  className,
}: {
  hallmarks: Array<{ slug: string; title: string; number?: number }>;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  if (hallmarks.length === 0) return null;

  return (
    <div className={className}>
      {label && <p className="text-label mb-3">{label}</p>}
      <ul className="flex flex-wrap gap-2">
        {hallmarks.map((h) => (
          <li key={h.slug}>
            <HallmarkChip slug={h.slug} title={h.title} number={h.number} size={size} />
          </li>
        ))}
      </ul>
    </div>
  );
}
