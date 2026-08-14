import { describe, it, expect } from 'vitest';
import { COMPOUND_PRODUCTS, getCompoundProducts, hasCompoundProducts } from './compound-products';

/**
 * Content-lock for the per-compound retail lists that replaced the illustrative
 * molecule motif on compound deep-dives. These guard the honesty rules: real
 * https links, at most one verified pick, no padded/duplicated entries, and
 * coverage for every compound whose deep-dive renders a CompoundHero.
 */

// The compounds whose /library deep-dive renders a CompoundHero (category
// 'compounds' + a lib/data.ts entry). Kept in sync with library-modules.
const COMPOUND_HERO_IDS = [
  'berberine', 'cakg', 'coq10', 'fisetin', 'glynac', 'nmn', 'omega3',
  'pterostilbene', 'rala', 'resveratrol', 'spermidine', 'sulforaphane',
  'taurine', 'urolithin-a',
];

describe('compound-products data integrity', () => {
  for (const [id, list] of Object.entries(COMPOUND_PRODUCTS)) {
    describe(id, () => {
      it('has between 1 and 5 products', () => {
        expect(list.length).toBeGreaterThanOrEqual(1);
        expect(list.length).toBeLessThanOrEqual(5);
      });

      it('every product has a real https link and required fields', () => {
        for (const p of list) {
          expect(p.brand.trim().length).toBeGreaterThan(0);
          expect(p.product.trim().length).toBeGreaterThan(0);
          expect(p.url).toMatch(/^https:\/\/[^\s]+\.[^\s]+/);
        }
      });

      it('has at most one verified pick', () => {
        expect(list.filter((p) => p.verified).length).toBeLessThanOrEqual(1);
      });

      it('has no duplicate brand+product entries', () => {
        const keys = list.map((p) => `${p.brand}|${p.product}`.toLowerCase());
        expect(new Set(keys).size).toBe(keys.length);
      });
    });
  }
});

describe('CompoundHero coverage', () => {
  for (const id of COMPOUND_HERO_IDS) {
    it(`${id} has retail products so its hero is not empty`, () => {
      expect(hasCompoundProducts(id)).toBe(true);
      expect(getCompoundProducts(id).length).toBeGreaterThan(0);
    });
  }
});

describe('getCompoundProducts', () => {
  it('returns the verified pick first when present', () => {
    const nmn = getCompoundProducts('nmn');
    expect(nmn[0].verified).toBe(true);
  });

  it('respects the max argument', () => {
    expect(getCompoundProducts('nmn', 3).length).toBe(3);
  });

  it('returns an empty array for an unknown compound', () => {
    expect(getCompoundProducts('not-a-compound')).toEqual([]);
    expect(hasCompoundProducts('not-a-compound')).toBe(false);
  });
});
