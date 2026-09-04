import Link from 'next/link';
import { hallmarkLibrary } from '@/lib/hallmarks-library';

// ─────────────────────────────────────────────────────────────────────────────
// HallmarkCoverageAtlas — an orientation panel for the hallmarks index. Ranks
// all 12 hallmarks by how many graded interventions the library documents for
// each, so a visitor sees which mechanisms are richly covered and which are
// thinner before scrolling the card grid. Derived from `hallmarkLibrary`
// (each entry's own `interventions` array); no count is asserted. Server-safe.
// ─────────────────────────────────────────────────────────────────────────────

export function HallmarkCoverageAtlas({ className = '' }: { className?: string }) {
  const rows = hallmarkLibrary
    .map((h) => ({
      slug: h.slug,
      number: h.number,
      title: h.title,
      count: h.interventions?.length ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  if (rows.length === 0) return null;

  const peak = Math.max(...rows.map((r) => r.count), 1);
  const totalInterventions = rows.reduce((sum, r) => sum + r.count, 0);

  return (
    <section
      className={`premium-card p-5 sm:p-7 ${className}`}
      style={{ ['--card-accent' as string]: 'var(--accent-emerald)' }}
      aria-label={`Hallmark coverage atlas: ${totalInterventions} documented interventions across ${rows.length} hallmarks`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-label text-[var(--color-text-faint)]">Coverage atlas</p>
          <h2 className="heading-card mt-1 text-foreground">
            {totalInterventions} interventions, ranked across {rows.length} hallmarks
          </h2>
        </div>
        <p className="font-mono text-micro text-[var(--color-text-faint)]">Documented interventions per mechanism</p>
      </div>

      <ul className="mt-5 grid gap-x-8 gap-y-2.5 lg:grid-cols-2">
        {rows.map((r) => {
          const pct = (r.count / peak) * 100;
          return (
            <li key={r.slug}>
              <Link
                href={`/hallmarks/${r.slug}`}
                className="focus-ring group flex items-center gap-3 rounded-lg py-1"
              >
                <span className="w-6 shrink-0 text-right font-mono text-micro text-[var(--color-text-faint)]">
                  {String(r.number).padStart(2, '0')}
                </span>
                <span className="w-40 shrink-0 truncate text-body-sm text-[var(--color-text-secondary)] transition-colors group-hover:text-foreground">
                  {r.title}
                </span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-bg-muted)]" aria-hidden="true">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))',
                    }}
                  />
                </span>
                <span className="w-6 shrink-0 text-right font-mono text-body-sm font-semibold tabular-nums text-foreground">
                  {r.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
