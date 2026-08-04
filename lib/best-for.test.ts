import { describe, it, expect } from 'vitest';
import {
  bestForGoals,
  getBestForGoal,
  rankCompoundsForGoal,
  hallmarkTitlesFor,
} from './best-for';
import { compounds } from './data';
import { hallmarkLibrary } from './hallmarks-library';

const compoundIds = new Set(compounds.map((c) => c.id));
const hallmarkIds = new Set(hallmarkLibrary.map((h) => h.id));

describe('best-for goals', () => {
  it('has unique slugs', () => {
    const slugs = bestForGoals.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every goal references only real hallmark ids and compound ids', () => {
    for (const g of bestForGoals) {
      for (const h of g.hallmarkIds) {
        expect(hallmarkIds.has(h), `${g.slug} references missing hallmark ${h}`).toBe(true);
      }
      for (const id of g.boost) {
        expect(compoundIds.has(id), `${g.slug} boosts missing compound ${id}`).toBe(true);
      }
    }
  });

  it('every goal ranks at least 4 real compounds', () => {
    for (const g of bestForGoals) {
      const picks = rankCompoundsForGoal(g);
      expect(picks.length, `${g.slug} ranked too few`).toBeGreaterThanOrEqual(4);
      for (const p of picks) {
        expect(compoundIds.has(p.compound.id)).toBe(true);
      }
      // The top pick should be the highest-tier, most-on-mechanism compound.
      expect(['A', 'B']).toContain(picks[0].compound.evidence);
    }
  });

  it('different goals produce different top picks', () => {
    const energyTop = rankCompoundsForGoal(getBestForGoal('energy')!)[0].compound.id;
    const sleepTop = rankCompoundsForGoal(getBestForGoal('sleep')!)[0].compound.id;
    expect(energyTop).not.toBe(sleepTop);
  });

  it('hallmarkTitlesFor resolves to real hallmark routes', () => {
    const resolved = hallmarkTitlesFor(['mito', 'genomic']);
    expect(resolved.map((r) => r.slug)).toEqual([
      'mitochondrial-dysfunction',
      'genomic-instability',
    ]);
  });
});
