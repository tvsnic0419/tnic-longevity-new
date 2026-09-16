import { HubSplitInstrument } from '@/components/viz/HubSplitInstrument';
import { trialIndexStats } from '@/lib/trial-index.server';
import { EVIDENCE_BASE_LABEL, type TrialEvidenceBase } from '@/lib/trial-index';

/**
 * Trial Index instrument — the split that actually describes this page.
 *
 * Not `LibraryHeroInstrument`: that one is bound to `evidenceIndexStats()` and
 * shows 100 graded COMPOUNDS by tier, which on a page about 363 study ROWS would
 * put a figure beside a headline that counts something else, and its "Open the
 * table" link would point away to the evidence table. Same primitive, different
 * question: of the studies this library cites, how many were run in people.
 *
 * Colour is deliberate rather than reused from `TIER_COLOR_VAR`. Human rows take
 * violet, not the emerald that means Tier A — a human trial is not automatically
 * strong evidence, and borrowing the tier palette here would quietly say it was.
 * Preclinical keeps amber, which IS the Tier C colour, because there the two
 * meanings genuinely coincide. "Not stated" is faint on purpose: an unknown is
 * not a category, it is a gap.
 */

const ORDER: TrialEvidenceBase[] = ['human', 'preclinical', 'mixed', 'unclear'];

const COLOR: Record<TrialEvidenceBase, string> = {
  human: 'var(--accent-violet)',
  preclinical: 'var(--accent-amber)',
  mixed: 'var(--accent-cyan)',
  unclear: 'var(--color-text-faint)',
};

export function TrialHeroInstrument() {
  const stats = trialIndexStats();
  return (
    <HubSplitInstrument
      kicker="Studied in"
      total={stats.total}
      totalLabel="study rows"
      rows={ORDER.map((base) => ({
        key: base,
        label: EVIDENCE_BASE_LABEL[base],
        count: stats.byEvidenceBase[base],
        color: COLOR[base],
      }))}
      footer={
        <>
          <span className="font-mono font-semibold text-foreground">{stats.withPmid}</span>{' '}
          PMID-linked ·{' '}
          <span className="font-mono font-semibold text-foreground">{stats.compoundsCovered}</span>/
          {stats.compoundsTotal} compounds
        </>
      }
      href="#trial-table"
      hrefLabel="Open the index →"
    />
  );
}
