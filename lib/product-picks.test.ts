import { describe, expect, it } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';
import { productPicks, getComparePicks } from '@/lib/product-picks';
import { getAllComparisonSlugs } from '@/lib/comparisons';

const PUBLIC_PRODUCTS = join(process.cwd(), 'public', 'products');

describe('product pick images', () => {
  it.each(productPicks.map((p) => [p.compoundId, p.imageSrc, p.fallbackImageSrc]))(
    '%s image file exists on disk',
    (_id, imageSrc, fallbackImageSrc) => {
      const primary = join(PUBLIC_PRODUCTS, imageSrc.replace('/products/', ''));
      const fallback = join(PUBLIC_PRODUCTS, fallbackImageSrc.replace('/products/', ''));
      expect(existsSync(primary), `missing ${primary}`).toBe(true);
      expect(existsSync(fallback), `missing ${fallback}`).toBe(true);
    },
  );

  it('uses local /products paths for reliable Next.js rendering', () => {
    for (const pick of productPicks) {
      expect(pick.imageSrc.startsWith('/products/')).toBe(true);
      expect(pick.fallbackImageSrc.startsWith('/products/')).toBe(true);
    }
  });
});

describe('getComparePicks', () => {
  it('resolves both sides when each compared compound has a pick', () => {
    const picks = getComparePicks('nmn-vs-nr');
    expect(picks.map((p) => p.compoundId)).toEqual(['nmn', 'nr']);
  });

  it('preserves side order (A before B)', () => {
    expect(getComparePicks('taurine-vs-nmn').map((p) => p.compoundId)).toEqual([
      'taurine',
      'nmn',
    ]);
  });

  it('omits a side with no curated pick', () => {
    // glutathione has no pick; glynac does.
    expect(getComparePicks('glynac-vs-liposomal-glutathione').map((p) => p.compoundId)).toEqual([
      'glynac',
    ]);
  });

  it('returns nothing for comparisons where neither side has a pick', () => {
    expect(getComparePicks('berberine-vs-metformin')).toEqual([]);
    expect(getComparePicks('urolithin-a-vs-coq10')).toEqual([]);
  });

  it('never resolves a pick for stack/form comparison slugs', () => {
    expect(getComparePicks('nrf2-triad-vs-mito-stack')).toEqual([]);
    expect(getComparePicks('starter-elite-vs-full-hybrid')).toEqual([]);
  });

  it('only ever returns real picks for any authored comparison slug', () => {
    for (const slug of getAllComparisonSlugs()) {
      for (const pick of getComparePicks(slug)) {
        expect(productPicks).toContain(pick);
      }
    }
  });
});