import { compoundModules } from './library-modules';
import { hallmarks } from './data/hallmarks';
import { compounds } from './data/compounds';
import { eliteInterventions } from './elite-interventions';
import { peptideLibrary } from './peptides-library';

/**
 * Single source of truth for every count the site states out loud.
 *
 * Counts were previously read off whichever array happened to be in scope, or
 * typed in by hand — which is how the NAD+ guide came to advertise "8 elite
 * compounds" while the homepage stat rail, reading `eliteInterventions.length`,
 * said 9. Numbers stated in UI copy must come from here so a data change can
 * never leave a stale figure behind.
 *
 * Everything below is derived at build time from the data layer; nothing is
 * hardcoded. `lib/compound-coverage.test.ts` separately pins COMPOUND_COUNT so
 * an unintended change to the library fails CI rather than silently reflowing
 * copy across the site.
 */

/** Compound deep-dives in the library (content/compounds/*.mdx, 1:1 with modules). */
export const COMPOUND_COUNT = compoundModules.length;

/**
 * Compounds rich enough to drive the interactive tools (Stack Architect,
 * Constellation). A deliberate subset of the library — see
 * NOTES-COMPOUND-LIBRARY.md — so it is always <= COMPOUND_COUNT.
 */
export const STACK_BUILDABLE_COUNT = compounds.length;

/** Hallmarks of aging the library is organised around. */
export const HALLMARK_COUNT = hallmarks.length;

/** Interventions in the Elite ranking (Longevity Quotient). */
export const ELITE_COUNT = eliteInterventions.length;

/** Peptides documented in the peptide library. */
export const PEPTIDE_COUNT = peptideLibrary.length;

/** Compound deep-dives per evidence tier, e.g. { A: 9, B: 34, C: 12 }. */
export const TIER_COUNTS: Record<'A' | 'B' | 'C', number> = compoundModules.reduce(
  (acc, m) => {
    acc[m.evidenceTier] += 1;
    return acc;
  },
  { A: 0, B: 0, C: 0 },
);

/** The evidence-tier range, as rendered in stat rails. */
export const EVIDENCE_TIER_RANGE = 'A–C';
