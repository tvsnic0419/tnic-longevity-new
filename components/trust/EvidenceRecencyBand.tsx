import { citationRegistry } from '@/lib/trust';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// EvidenceRecencyBand — a credibility read on how CURRENT the traceable
// evidence base is. Longevity science moves fast; "we cite recent primary
// literature" is a claim worth showing, not just stating. Derived entirely from
// the canonical `citationRegistry` (year field): a per-year distribution plus
// median year, share published since 2020, and the full span. Server-safe SVG.
// Honestly scoped — this is the canonical citation registry, not every PMID
// mentioned across the site.
// ─────────────────────────────────────────────────────────────────────────────

export function EvidenceRecencyBand({ className = '' }: { className?: string }) {
  const years = citationRegistry
    .map((c) => c.year)
    .filter((y): y is number => typeof y === 'number' && y > 1900)
    .sort((a, b) => a - b);

  if (years.length < 4) return null;

  const min = years[0];
  const max = years[years.length - 1];
  const median = years[Math.floor(years.length / 2)];
  const since2020 = years.filter((y) => y >= 2020).length;
  const since2020Pct = Math.round((since2020 / years.length) * 100);

  // Per-year counts across the full span so gaps read honestly.
  const byYear: { year: number; count: number }[] = [];
  for (let y = min; y <= max; y++) {
    byYear.push({ year: y, count: years.filter((v) => v === y).length });
  }
  const peak = Math.max(...byYear.map((b) => b.count), 1);

  const stats = [
    { value: String(years.length), label: 'Traceable sources', accent: 'var(--accent-cyan)' },
    { value: String(median), label: 'Median year', accent: 'var(--accent-emerald)' },
    { value: `${since2020Pct}%`, label: 'Since 2020', accent: 'var(--accent-emerald)' },
    { value: `${min}–${max}`, label: 'Span', accent: 'var(--accent-violet)' },
  ];

  return (
    <section
      className={cn('premium-card p-5 sm:p-7', className)}
      style={{ ['--card-accent' as string]: 'var(--accent-cyan)' }}
      aria-label={`Evidence recency: ${years.length} traceable citations, median year ${median}, ${since2020Pct}% published since 2020, spanning ${min} to ${max}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-label text-[var(--color-text-faint)]">Evidence recency</p>
        <p className="font-mono text-micro text-[var(--color-text-faint)]">Canonical citation registry</p>
      </div>

      {/* Stat readouts */}
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="font-display text-2xl font-semibold tabular-nums" style={{ color: s.accent }}>
              {s.value}
            </dd>
            <dt className="mt-0.5 text-micro text-[var(--color-text-muted)]">{s.label}</dt>
          </div>
        ))}
      </dl>

      {/* Per-year distribution */}
      <div className="mt-6">
        <div className="flex items-end gap-[3px]" style={{ height: 56 }} aria-hidden="true">
          {byYear.map((b) => {
            const h = b.count === 0 ? 2 : Math.max(6, (b.count / peak) * 56);
            const recent = b.year >= 2020;
            return (
              <div
                key={b.year}
                className="flex-1 rounded-t-sm"
                title={`${b.year}: ${b.count} citation${b.count === 1 ? '' : 's'}`}
                style={{
                  height: h,
                  background:
                    b.count === 0
                      ? 'color-mix(in srgb, var(--color-text-primary) 8%, transparent)'
                      : recent
                        ? 'var(--accent-cyan)'
                        : 'color-mix(in srgb, var(--accent-cyan) 45%, transparent)',
                  boxShadow: b.count > 0 && recent ? '0 0 8px -2px var(--accent-cyan)' : undefined,
                }}
              />
            );
          })}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-micro text-[var(--color-text-faint)]">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </section>
  );
}
