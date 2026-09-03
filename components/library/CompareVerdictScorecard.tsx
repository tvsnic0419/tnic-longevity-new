import type { CompareRow } from '@/lib/comparisons';

// ─────────────────────────────────────────────────────────────────────────────
// CompareVerdictScorecard — an at-a-glance visual tally of a head-to-head's
// per-dimension verdicts. Purely a summary of the curated `rows` already shown
// in EvidenceCompareTable: it counts how many dimensions each side wins, how
// many are even, and how many depend on the goal, then renders that as a
// proportional segmented bar plus four count tiles. No new claim is made — it
// only re-presents the verdicts a human already authored per row.
// ─────────────────────────────────────────────────────────────────────────────

interface CompareVerdictScorecardProps {
  labelA: string;
  labelB: string;
  rows: CompareRow[];
}

const SEGMENTS = [
  { key: 'a', color: 'var(--accent-cyan)' },
  { key: 'b', color: 'var(--accent-violet)' },
  { key: 'tie', color: 'var(--accent-emerald)' },
  { key: 'context', color: 'var(--accent-amber)' },
] as const;

export function CompareVerdictScorecard({ labelA, labelB, rows }: CompareVerdictScorecardProps) {
  const total = rows.length;
  if (total === 0) return null;

  const counts = {
    a: rows.filter((r) => r.verdict === 'a').length,
    b: rows.filter((r) => r.verdict === 'b').length,
    tie: rows.filter((r) => r.verdict === 'tie').length,
    context: rows.filter((r) => r.verdict === 'context').length,
  };

  const tiles = [
    { key: 'a' as const, label: `${labelA} edge`, count: counts.a, color: 'var(--accent-cyan)' },
    { key: 'b' as const, label: `${labelB} edge`, count: counts.b, color: 'var(--accent-violet)' },
    { key: 'tie' as const, label: 'Even', count: counts.tie, color: 'var(--accent-emerald)' },
    { key: 'context' as const, label: 'Depends on goal', count: counts.context, color: 'var(--accent-amber)' },
  ];

  const summary = tiles
    .filter((t) => t.count > 0)
    .map((t) => `${t.label}: ${t.count}`)
    .join(' · ');

  return (
    <section
      className="premium-card p-5 sm:p-6"
      style={{ ['--card-accent' as string]: 'var(--accent-cyan)' }}
      aria-label={`Verdict scorecard across ${total} dimensions — ${summary}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label text-[var(--color-text-faint)]">Verdict scorecard</p>
        <p className="font-mono text-micro text-[var(--color-text-faint)]">{total} dimensions compared</p>
      </div>

      {/* Proportional segmented tally bar */}
      <div
        className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]"
        role="presentation"
      >
        {SEGMENTS.map((s) => {
          const count = counts[s.key];
          if (count === 0) return null;
          return (
            <div
              key={s.key}
              style={{
                width: `${(count / total) * 100}%`,
                background: s.color,
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${s.color} 60%, transparent)`,
              }}
            />
          );
        })}
      </div>

      {/* Count tiles */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {tiles.map((t) => (
          <div
            key={t.key}
            className="rounded-xl border p-3 text-center"
            style={{
              borderColor: t.count > 0 ? `color-mix(in srgb, ${t.color} 32%, transparent)` : 'var(--color-border-subtle)',
              background: t.count > 0 ? `color-mix(in srgb, ${t.color} 8%, transparent)` : 'transparent',
              opacity: t.count > 0 ? 1 : 0.55,
            }}
          >
            <div
              className="font-display text-2xl font-semibold tabular-nums"
              style={{ color: t.count > 0 ? t.color : 'var(--color-text-faint)' }}
            >
              {t.count}
            </div>
            <div className="mt-0.5 text-micro text-[var(--color-text-muted)]">{t.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
