import { HubSplitInstrument } from '@/components/viz/HubSplitInstrument';
import { evidenceIndexStats } from '@/lib/evidence-index';
import { evidenceTagDefinitions, TIER_COLOR_VAR, TIER_INK_VAR } from '@/lib/trust';
import type { EvidenceTier } from '@/lib/types';

/**
 * Library / Evidence Table instrument. A thin, derived view over
 * `evidenceIndexStats()` so the A/B/C split cannot drift from the table or
 * the compound grid. Colour is `TIER_COLOR_VAR` — never a local map.
 */

const ORDER: EvidenceTier[] = ['A', 'B', 'C'];

export function LibraryHeroInstrument() {
  const stats = evidenceIndexStats();
  return (
    <HubSplitInstrument
      kicker="Evidence split"
      total={stats.total}
      totalLabel="graded"
      rows={ORDER.map((tier) => ({
        key: tier,
        label: `${tier} · ${evidenceTagDefinitions[tier].short}`,
        count: stats.byTier[tier],
        color: TIER_COLOR_VAR[tier],
        ink: TIER_INK_VAR[tier],
      }))}
      footer={
        <>
          <span className="font-mono font-semibold text-foreground">{stats.scored}</span> scored ·{' '}
          <span className="font-mono font-semibold text-foreground">{stats.unscored}</span> not scored
        </>
      }
      href="/library/evidence"
      hrefLabel="Open the table →"
    />
  );
}
