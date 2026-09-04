import { citationRegistry } from './trust';
import { COMPOUND_COUNT } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { pathways } from './pathways';
import { peptideLibrary } from './peptides-library';
import { evidenceComparisons } from './comparisons';

/**
 * Single source of truth for the platform's headline counts.
 *
 * Every value is derived from a live registry, so a number can never drift
 * from what's actually published — add a compound, a hallmark, a citation, and
 * the count moves with it. Surfaces that show these figures (partnerships,
 * trust/methodology, the homepage credibility strip) import from here rather
 * than hand-writing a literal, so the same population never shows two
 * different numbers on two different pages.
 *
 * The label on each figure names the population it counts (e.g. "Compounds —
 * evidence-graded A–C"), because the codebase intentionally has more than one
 * compound population — the full graded library counted here vs. the compound
 * engine's smaller *curated scoring* dataset (`COMPOUND_DB`), which is a
 * deliberately different set and is always labeled "Curated compounds" where
 * it appears.
 *
 * NOTE: this module imports the content registries, so importing it pulls
 * that data into the bundle. It is fine in server components (the credibility
 * strips are server-rendered). `COMPOUND_COUNT` alone is already reached by
 * the client hero via `library-modules`, so client use of that specific count
 * costs nothing new — but prefer computing on the server and passing values
 * as props.
 */
export const DERIVED_STATS = {
  compounds: COMPOUND_COUNT,
  hallmarks: hallmarkLibrary.length,
  pathways: pathways.length,
  peptides: peptideLibrary.length,
  comparisons: evidenceComparisons.length,
  citations: citationRegistry.length,
} as const;

export interface PlatformStatCard {
  value: string;
  label: string;
  sublabel: string;
}

/**
 * The canonical "platform by the numbers" cards. Ordered most-credible-first.
 */
export const platformStats: readonly PlatformStatCard[] = [
  { value: String(DERIVED_STATS.compounds), label: 'Compounds', sublabel: 'Evidence-graded A–C' },
  { value: String(DERIVED_STATS.hallmarks), label: 'Hallmarks', sublabel: 'Full coverage' },
  { value: String(DERIVED_STATS.pathways), label: 'Pathways', sublabel: 'Mechanistic actors' },
  { value: String(DERIVED_STATS.peptides), label: 'Peptides', sublabel: 'Legality stated' },
  { value: String(DERIVED_STATS.comparisons), label: 'Comparisons', sublabel: 'Head-to-head' },
  { value: String(DERIVED_STATS.citations), label: 'PMID Citations', sublabel: 'Traceable sources' },
] as const;
