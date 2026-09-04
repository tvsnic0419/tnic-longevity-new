import { evidenceComparisons } from '@/lib/comparisons';
import type { EvidenceTier } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// ComparisonLandscape — an orientation panel for the head-to-head hub. Shows
// what the curated comparison library actually covers: how many pairings by
// category (compound / stack / form) and the evidence tier behind them. It's
// a curated set, so saying its shape up front (and that it's curated, not a
// pick-any-two tool) is honest orientation. Derived from `evidenceComparisons`.
// Server-safe.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  compound: 'Compound vs compound',
  stack: 'Stack vs stack',
  form: 'Form vs form',
};

const CATEGORY_ACCENT: Record<string, string> = {
  compound: 'var(--accent-cyan)',
  stack: 'var(--accent-violet)',
  form: 'var(--accent-amber)',
};

const TIER_ACCENT: Record<EvidenceTier, string> = {
  A: 'var(--tier-a)',
  B: 'var(--tier-b)',
  C: 'var(--tier-c)',
  D: 'var(--tier-d)',
};

export function ComparisonLandscape({ className = '' }: { className?: string }) {
  const total = evidenceComparisons.length;
  if (total === 0) return null;

  const categories = Object.entries(
    evidenceComparisons.reduce<Record<string, number>>((acc, c) => {
      acc[c.category] = (acc[c.category] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([category, count]) => ({
      category,
      count,
      label: CATEGORY_LABEL[category] ?? category,
      color: CATEGORY_ACCENT[category] ?? 'var(--accent-cyan)',
    }))
    .sort((a, b) => b.count - a.count);

  const tiers = (['A', 'B', 'C', 'D'] as EvidenceTier[])
    .map((tier) => ({
      tier,
      count: evidenceComparisons.filter((c) => c.evidenceTier === tier).length,
      color: TIER_ACCENT[tier],
    }))
    .filter((t) => t.count > 0);

  return (
    <section
      className={`premium-card p-5 sm:p-7 ${className}`}
      style={{ ['--card-accent' as string]: 'var(--accent-cyan)' }}
      aria-label={`Comparison landscape: ${total} curated head-to-heads — ${categories
        .map((c) => `${c.count} ${c.label}`)
        .join(', ')}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-label text-[var(--color-text-faint)]">The comparison landscape</p>
          <h2 className="heading-card mt-1 text-foreground">
            {total} curated head-to-heads
          </h2>
        </div>
        <p className="max-w-xs text-micro leading-relaxed text-[var(--color-text-muted)]">
          Hand-authored pairings — for an uncovered pair, build both in Stack Architect.
        </p>
      </div>

      {/* Category tiles */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {categories.map((c) => (
          <div
            key={c.category}
            className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5" style={{ background: c.color }} />
            <div className="font-display text-2xl font-semibold tabular-nums" style={{ color: c.color }}>
              {c.count}
            </div>
            <div className="mt-1 text-body-sm text-[var(--color-text-secondary)]">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tier split */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-label text-[var(--color-text-faint)]">Evidence tier</span>
        <div className="flex h-2.5 flex-1 min-w-[140px] overflow-hidden rounded-full bg-[var(--color-bg-muted)]" role="presentation">
          {tiers.map((t) => (
            <div
              key={t.tier}
              style={{ width: `${(t.count / total) * 100}%`, background: t.color, opacity: 0.85 }}
              title={`Tier ${t.tier}: ${t.count}`}
            />
          ))}
        </div>
        {tiers.map((t) => (
          <span key={t.tier} className="font-mono text-micro font-semibold" style={{ color: t.color }}>
            {t.tier} {t.count}
          </span>
        ))}
      </div>
    </section>
  );
}
