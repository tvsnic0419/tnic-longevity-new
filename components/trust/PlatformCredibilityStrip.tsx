import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// PlatformCredibilityStrip — a visual "evidence base behind the grades" panel.
// Presentational only: the caller passes the derived `platformStats` (a
// server-only module, kept out of client bundles), so this component itself
// holds no data and can render anywhere. Each tile carries an accent hairline
// so the panel reads as an instrument cluster, not a row of loose numbers.
// ─────────────────────────────────────────────────────────────────────────────

interface Stat {
  value: string;
  label: string;
  sublabel: string;
}

const ACCENTS = [
  'var(--accent-cyan)',
  'var(--accent-emerald)',
  'var(--accent-violet)',
  'var(--accent-rose)',
  'var(--accent-amber)',
  'var(--accent-cyan)',
];

export function PlatformCredibilityStrip({
  stats,
  className = '',
  heading = 'The evidence base behind every grade',
}: {
  stats: readonly Stat[];
  className?: string;
  heading?: string;
}) {
  if (stats.length === 0) return null;
  return (
    <section
      className={cn('premium-card p-5 sm:p-7', className)}
      style={{ ['--card-accent' as string]: 'var(--accent-emerald)' }}
      aria-label={heading}
    >
      <p className="text-label text-[var(--color-text-faint)]">By the numbers</p>
      <h2 className="heading-card mt-1 text-foreground">{heading}</h2>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ background: accent }}
              />
              <div className="font-display text-2xl font-semibold tabular-nums" style={{ color: accent }}>
                {s.value}
              </div>
              <div className="mt-1 text-body-sm font-medium text-foreground">{s.label}</div>
              <div className="mt-0.5 text-micro text-[var(--color-text-muted)]">{s.sublabel}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
