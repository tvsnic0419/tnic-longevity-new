import { describe, expect, it } from 'vitest';
import { pathways, getAllPathwaySlugs, getMolecularPathwaysForHallmark } from './pathways';
import { hallmarkLibrary } from './hallmarks-library';
import { libraryModules } from './library-modules';

const hallmarkIds = new Set(hallmarkLibrary.map((h) => h.id));
const compoundSlugs = new Set(
  libraryModules.filter((m) => m.category === 'compounds').map((m) => m.slug),
);

describe('pathway registry integrity', () => {
  it('every pathway references only real hallmark ids', () => {
    for (const p of pathways) {
      for (const id of p.hallmarkIds) {
        expect(hallmarkIds.has(id), `pathway ${p.slug} → unknown hallmark id "${id}"`).toBe(true);
      }
    }
  });

  it('every pathway references only real compound slugs', () => {
    for (const p of pathways) {
      for (const s of p.compoundSlugs) {
        expect(compoundSlugs.has(s), `pathway ${p.slug} → unknown compound slug "${s}"`).toBe(true);
      }
    }
  });

  it('pathway slugs are unique and non-empty', () => {
    const slugs = getAllPathwaySlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s.length).toBeGreaterThan(0);
  });

  it('every pathway has at least one hallmark and one compound', () => {
    for (const p of pathways) {
      expect(p.hallmarkIds.length, `${p.slug} has no hallmarks`).toBeGreaterThan(0);
      expect(p.compoundSlugs.length, `${p.slug} has no compounds`).toBeGreaterThan(0);
    }
  });

  it('getMolecularPathwaysForHallmark returns only pathways that list the hallmark', () => {
    for (const h of hallmarkLibrary) {
      for (const p of getMolecularPathwaysForHallmark(h.id)) {
        expect(p.hallmarkIds.includes(h.id), `${p.slug} returned for unrelated hallmark ${h.id}`).toBe(true);
      }
    }
  });

  it('every pathway is reachable from at least one of its hallmarks (inverse coverage)', () => {
    for (const p of pathways) {
      const reachable = p.hallmarkIds.some((hid) =>
        getMolecularPathwaysForHallmark(hid).some((q) => q.slug === p.slug),
      );
      expect(reachable, `${p.slug} unreachable via getMolecularPathwaysForHallmark`).toBe(true);
    }
  });
});
