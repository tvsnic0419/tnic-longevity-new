import { compoundModules, COMPOUND_COUNT } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { EVIDENCE_TIERS, type HallmarkCoverage, type TierSlice } from './insights';

/**
 * Library-wide analytics for /insights — the counterpart to `lib/insights.ts`.
 *
 * The library has two tiers (see NOTES-COMPOUND-LIBRARY.md):
 *
 *  - Every compound deep-dive module carries an `evidenceTier` and
 *    `relatedHallmarkIds`. That is ALL of them, so tier mix and hallmark
 *    coverage can honestly describe the whole library — which is what this
 *    file derives.
 *  - Only the smaller graded set in `lib/data.ts` carries bioavailability,
 *    timing, dosing, and PMID-cited studies. Those stats stay in
 *    `lib/insights.ts` and stay scoped to that subset.
 *
 * Kept in a SEPARATE module from `lib/insights.ts` on purpose:
 * `lib/library-modules.ts` is ~2.5k lines and the /insights chart components
 * are client components. Importing it into `lib/insights.ts` would drag the
 * whole module list into the page's client bundle. Only the server page
 * imports this file; the small derived arrays below cross as props.
 *
 * The same honesty contract applies as in `lib/insights.ts`: every number is
 * counted from the library, never written as a literal.
 */

/** Total compound deep-dives in the library. */
export const LIBRARY_COMPOUND_COUNT = COMPOUND_COUNT;

/** Evidence-tier mix across every compound deep-dive. */
export const LIBRARY_TIER_SPLIT: TierSlice[] = EVIDENCE_TIERS.map((tier) => {
  const count = compoundModules.filter((m) => m.evidenceTier === tier).length;
  return { tier, count, share: COMPOUND_COUNT ? count / COMPOUND_COUNT : 0 };
});

/**
 * How many compound deep-dives target each of the 12 hallmarks, most-covered
 * first — the library-wide sibling of `HALLMARK_COVERAGE`.
 *
 * Derived from `relatedHallmarkIds` alone rather than reusing
 * `getCompoundsForHallmark()` (lib/library-graph.ts): that helper unions the
 * module mapping with `lib/data.ts`'s separate `hallmarks` field, so its count
 * would mix two different hallmark mappings. One source keeps this number
 * unambiguous — it is the module set, counted.
 */
export const LIBRARY_HALLMARK_COVERAGE: HallmarkCoverage[] = hallmarkLibrary
  .map((h) => {
    const acting = compoundModules.filter((m) => m.relatedHallmarkIds.includes(h.id));
    return {
      id: h.id,
      number: h.number,
      title: h.title,
      slug: h.slug,
      count: acting.length,
      compoundIds: acting.map((m) => m.slug),
    };
  })
  .sort((a, b) => b.count - a.count || a.number - b.number);
