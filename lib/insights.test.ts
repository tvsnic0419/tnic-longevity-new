import { describe, it, expect } from 'vitest';
import {
  TIER_SPLIT,
  HALLMARK_COVERAGE,
  BIOAVAILABILITY_RANK,
  DOSING_TIME,
  MOST_CITED,
  INSIGHTS_TOTALS,
  MATRIX_COMPOUNDS,
  MATRIX_HALLMARKS,
} from './insights';
import { compounds } from './data';
import { hallmarkLibrary } from './hallmarks-library';

/**
 * Locks the derived insights so a data edit that changes a headline number has
 * to update this test in the same commit — the paper trail that keeps the
 * /insights page honest. Values below were computed from the live data.
 */
describe('insights — derived analytics stay honest', () => {
  it('tier split sums to the graded-compound count and is ordered A,B,C,D', () => {
    expect(TIER_SPLIT.map((t) => t.tier)).toEqual(['A', 'B', 'C', 'D']);
    expect(TIER_SPLIT.reduce((s, t) => s + t.count, 0)).toBe(compounds.length);
    expect(TIER_SPLIT.every((t) => t.share >= 0 && t.share <= 1)).toBe(true);
  });

  it('headline totals match the current library', () => {
    expect(INSIGHTS_TOTALS.compounds).toBe(81);
    expect(INSIGHTS_TOTALS.tierA).toBe(9);
    expect(INSIGHTS_TOTALS.hallmarks).toBe(12);
    expect(INSIGHTS_TOTALS.withBioavailability).toBe(17);
    // studies total = sum of every compound's cited-study entries
    expect(INSIGHTS_TOTALS.studies).toBe(
      compounds.reduce((s, c) => s + (c.studies?.length ?? 0), 0),
    );
    expect(INSIGHTS_TOTALS.pathways).toBeGreaterThan(0);
  });

  it('hallmark coverage covers all 12 and every count is real', () => {
    expect(HALLMARK_COVERAGE).toHaveLength(hallmarkLibrary.length);
    for (const h of HALLMARK_COVERAGE) {
      expect(h.compoundIds).toHaveLength(h.count);
      // every listed compound genuinely acts on this hallmark
      for (const id of h.compoundIds) {
        expect(compounds.find((c) => c.id === id)?.hallmarks).toContain(h.id);
      }
    }
    // sorted most-covered first
    for (let i = 1; i < HALLMARK_COVERAGE.length; i++) {
      expect(HALLMARK_COVERAGE[i - 1].count).toBeGreaterThanOrEqual(HALLMARK_COVERAGE[i].count);
    }
  });

  it('bioavailability rank only includes compounds that carry the figure, sorted desc', () => {
    expect(BIOAVAILABILITY_RANK.length).toBe(
      compounds.filter((c) => typeof c.bioavailability === 'number').length,
    );
    for (let i = 1; i < BIOAVAILABILITY_RANK.length; i++) {
      expect(BIOAVAILABILITY_RANK[i - 1].value).toBeGreaterThanOrEqual(BIOAVAILABILITY_RANK[i].value);
    }
    expect(BIOAVAILABILITY_RANK.every((r) => r.value > 0 && r.value <= 100)).toBe(true);
  });

  it('dosing-time slices sum to the graded set', () => {
    expect(DOSING_TIME.reduce((s, t) => s + t.count, 0)).toBe(compounds.length);
  });

  it('most-cited is sorted by study count desc', () => {
    for (let i = 1; i < MOST_CITED.length; i++) {
      expect(MOST_CITED[i - 1].studyCount).toBeGreaterThanOrEqual(MOST_CITED[i].studyCount);
    }
  });

  it('matrix rows carry only real hallmark ids, sorted by breadth', () => {
    const validIds = new Set(MATRIX_HALLMARKS.map((h) => h.id));
    for (const c of MATRIX_COMPOUNDS) {
      expect(c.breadth).toBe(c.hallmarkIds.length);
      for (const id of c.hallmarkIds) expect(validIds.has(id)).toBe(true);
    }
    for (let i = 1; i < MATRIX_COMPOUNDS.length; i++) {
      expect(MATRIX_COMPOUNDS[i - 1].breadth).toBeGreaterThanOrEqual(MATRIX_COMPOUNDS[i].breadth);
    }
  });
});
