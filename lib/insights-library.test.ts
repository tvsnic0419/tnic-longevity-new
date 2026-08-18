import { describe, expect, it } from 'vitest';
import { compoundModules, COMPOUND_COUNT } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import {
  LIBRARY_COMPOUND_COUNT,
  LIBRARY_HALLMARK_COVERAGE,
  LIBRARY_TIER_SPLIT,
} from './insights-library';

// Mirrors the assertions in lib/insights.test.ts, but for the library-wide
// stats that /insights reports across every compound deep-dive. The contract is
// the same: these are the library, counted — so they can never drift above (or
// below) what it actually contains.
describe('library-wide insights', () => {
  it('reports the full deep-dive count', () => {
    expect(LIBRARY_COMPOUND_COUNT).toBe(COMPOUND_COUNT);
    expect(LIBRARY_COMPOUND_COUNT).toBe(compoundModules.length);
  });

  it('tier split covers every module exactly once', () => {
    expect(LIBRARY_TIER_SPLIT.reduce((s, t) => s + t.count, 0)).toBe(COMPOUND_COUNT);
    expect(LIBRARY_TIER_SPLIT.every((t) => t.share >= 0 && t.share <= 1)).toBe(true);
  });

  it('tier counts match the modules they describe', () => {
    for (const slice of LIBRARY_TIER_SPLIT) {
      expect(slice.count, `tier ${slice.tier}`).toBe(
        compoundModules.filter((m) => m.evidenceTier === slice.tier).length,
      );
    }
  });

  it('covers all 12 hallmarks, most-covered first', () => {
    expect(LIBRARY_HALLMARK_COVERAGE).toHaveLength(hallmarkLibrary.length);
    for (let i = 1; i < LIBRARY_HALLMARK_COVERAGE.length; i++) {
      expect(LIBRARY_HALLMARK_COVERAGE[i - 1].count).toBeGreaterThanOrEqual(
        LIBRARY_HALLMARK_COVERAGE[i].count,
      );
    }
  });

  it('every hallmark row names real modules that target it', () => {
    const bySlug = new Map(compoundModules.map((m) => [m.slug, m]));
    for (const row of LIBRARY_HALLMARK_COVERAGE) {
      expect(hallmarkLibrary.some((h) => h.id === row.id)).toBe(true);
      expect(row.compoundIds).toHaveLength(row.count);
      for (const slug of row.compoundIds) {
        expect(bySlug.get(slug)?.relatedHallmarkIds).toContain(row.id);
      }
    }
  });

  it('describes at least as many compounds as the fully-graded set', () => {
    // The graded set (lib/data.ts) is a subset of the deep-dive library, so a
    // library-wide count that fell below it would mean the two drifted apart.
    expect(LIBRARY_COMPOUND_COUNT).toBeGreaterThanOrEqual(27);
  });
});
