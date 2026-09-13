import Link from 'next/link';
import { evidenceIndexStats } from '@/lib/evidence-index';
import { evidenceTagDefinitions, TIER_COLOR_VAR } from '@/lib/trust';
import type { EvidenceTier } from '@/lib/types';

/**
 * The library hero's instrument — a real data figure, not atmosphere.
 *
 * Counts come from `evidenceIndexStats()`, which itself is a view over
 * `compoundModules`, so a number here cannot drift from the Evidence Table
 * or the compound grid below. Tier colour is `TIER_COLOR_VAR` — never a
 * local map. No heading: the page h1 lives in the hero title beside this.
 */

const ORDER: EvidenceTier[] = ['A', 'B', 'C'];

export function LibraryHeroInstrument() {
  const stats = evidenceIndexStats();
  const total = stats.total;
  const rows = ORDER.map((tier) => ({
    tier,
    count: stats.byTier[tier],
    pct: total ? (stats.byTier[tier] / total) * 100 : 0,
    short: evidenceTagDefinitions[tier].short,
    color: TIER_COLOR_VAR[tier],
  }));

  return (
    <div className="flex h-full min-h-[16rem] flex-col justify-between gap-5 p-1">
      <div>
        <p className="text-label text-[var(--color-text-faint)]">Evidence split</p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {total}
          <span className="ml-2 text-micro font-medium uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
            graded
          </span>
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.tier}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="text-body-sm font-semibold" style={{ color: row.color }}>
                {row.tier} · {row.short}
              </span>
              <span className="font-mono text-micro tabular-nums text-[var(--color-text-faint)]">
                {row.count}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${row.pct}%`,
                  background: row.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t border-[var(--color-border-subtle)] pt-3">
        <p className="text-micro text-[var(--color-text-muted)]">
          <span className="font-mono font-semibold text-foreground">{stats.scored}</span> scored ·{' '}
          <span className="font-mono font-semibold text-foreground">{stats.unscored}</span> not scored
        </p>
        <Link
          href="/library/evidence"
          className="action-link focus-ring rounded text-micro font-semibold text-accent-cyan hover:underline"
        >
          Open the table →
        </Link>
      </div>
    </div>
  );
}
