import { describe, expect, it } from 'vitest';
import { evidenceRows, evidenceIndexStats, evidenceHallmarkFacets } from './evidence-index';
import { compoundModules } from './library-modules';
import { computeTnicScore } from './tnic-score';
import { hallmarkLibrary } from './hallmarks-library';

/**
 * The evidence index is a *view* over registries that are published elsewhere.
 * Its whole claim is that it says the same thing the compound's own page says.
 * These guard that claim rather than the table's appearance.
 */
describe('evidence index', () => {
  it('covers every graded compound, with nothing dropped for being unscored', () => {
    expect(evidenceRows).toHaveLength(compoundModules.length);
    const rowSlugs = new Set(evidenceRows.map((r) => r.slug));
    for (const m of compoundModules) expect(rowSlugs.has(m.slug)).toBe(true);
  });

  it('reports the tier the module itself carries', () => {
    const tierBySlug = new Map(compoundModules.map((m) => [m.slug, m.evidenceTier]));
    for (const row of evidenceRows) {
      expect(row.tier).toBe(tierBySlug.get(row.slug));
    }
  });

  it('reports the score computeTnicScore returns, or null — never a substitute', () => {
    const moduleBySlug = new Map(compoundModules.map((m) => [m.slug, m]));
    for (const row of evidenceRows) {
      const m = moduleBySlug.get(row.slug)!;
      const expected = m.compoundId ? computeTnicScore(m.compoundId).score : null;
      expect(row.score).toBe(expected);
      // An unscored row must not smuggle in a confidence grade either.
      if (row.score === null && !m.compoundId) expect(row.confidence).toBeNull();
    }
  });

  it('links every row to a compound deep-dive that exists', () => {
    const slugs = new Set(compoundModules.map((m) => m.slug));
    for (const row of evidenceRows) {
      expect(row.href).toBe(`/library/compounds/${row.slug}`);
      expect(slugs.has(row.slug)).toBe(true);
    }
  });

  it('only names hallmarks that exist in the hallmark library', () => {
    const titles = new Set(hallmarkLibrary.map((h) => h.title));
    for (const row of evidenceRows) {
      for (const t of row.hallmarkTitles) expect(titles.has(t)).toBe(true);
    }
  });

  it('derives its headline counts from the rows, so the page cannot overstate them', () => {
    const stats = evidenceIndexStats();
    expect(stats.total).toBe(evidenceRows.length);
    expect(stats.scored + stats.unscored).toBe(stats.total);
    expect(stats.scored).toBe(evidenceRows.filter((r) => r.score !== null).length);
    expect(stats.byTier.A + stats.byTier.B + stats.byTier.C).toBe(stats.total);
    // Every scored row carries a confidence, so the two totals must agree.
    const confidenceTotal =
      stats.byConfidence.high + stats.byConfidence.moderate + stats.byConfidence.limited;
    expect(confidenceTotal).toBe(evidenceRows.filter((r) => r.confidence !== null).length);
  });

  it('sorts by tier first — the grade the site stands behind, not the derived score', () => {
    const rank = { A: 0, B: 1, C: 2 } as const;
    for (let i = 1; i < evidenceRows.length; i += 1) {
      expect(rank[evidenceRows[i - 1].tier]).toBeLessThanOrEqual(rank[evidenceRows[i].tier]);
    }
  });

  it('offers only hallmark facets that actually match a row', () => {
    for (const facet of evidenceHallmarkFacets()) {
      expect(evidenceRows.some((r) => r.hallmarkTitles.includes(facet))).toBe(true);
    }
  });
});
