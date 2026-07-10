import { describe, it, expect } from 'vitest';
import { evidenceComparisons } from './comparisons';
import { libraryModules } from './library-modules';
import {
  compoundSlugsForComparison,
  getComparisonsForCompound,
  getRelatedComparisons,
} from './comparison-relations';

const comparisonSlugs = new Set(evidenceComparisons.map((c) => c.slug));
const compoundModuleSlugs = new Set(
  libraryModules.filter((m) => m.category === 'compounds').map((m) => m.slug),
);

describe('comparison-relations', () => {
  it('only derives compound slugs that resolve to a real compound page', () => {
    for (const comp of evidenceComparisons) {
      for (const slug of compoundSlugsForComparison(comp)) {
        expect(compoundModuleSlugs.has(slug)).toBe(true);
      }
    }
  });

  it('at least one compound comparison resolves to a compound (mapping is wired)', () => {
    const withCompounds = evidenceComparisons.filter(
      (c) => compoundSlugsForComparison(c).length > 0,
    );
    expect(withCompounds.length).toBeGreaterThan(0);
  });

  it('getComparisonsForCompound returns only real comparisons that feature the compound', () => {
    for (const slug of compoundModuleSlugs) {
      const links = getComparisonsForCompound(slug);
      for (const link of links) {
        expect(comparisonSlugs.has(link.slug)).toBe(true);
        const comp = evidenceComparisons.find((c) => c.slug === link.slug)!;
        expect(compoundSlugsForComparison(comp)).toContain(slug);
      }
    }
  });

  it('surfaces comparisons on a known compound (nmn)', () => {
    const links = getComparisonsForCompound('nmn');
    expect(links.length).toBeGreaterThan(0);
    expect(links.map((l) => l.slug)).toContain('nmn-vs-nr');
  });

  it('getRelatedComparisons excludes self, returns only real siblings, respects the limit', () => {
    for (const comp of evidenceComparisons) {
      const related = getRelatedComparisons(comp.slug, 4);
      expect(related.length).toBeLessThanOrEqual(4);
      for (const link of related) {
        expect(link.slug).not.toBe(comp.slug);
        expect(comparisonSlugs.has(link.slug)).toBe(true);
      }
      // no duplicates
      const slugs = related.map((l) => l.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('related comparisons actually share a compound with the source', () => {
    const nmnNr = getRelatedComparisons('nmn-vs-nr');
    expect(nmnNr.length).toBeGreaterThan(0);
    const source = new Set(
      compoundSlugsForComparison(evidenceComparisons.find((c) => c.slug === 'nmn-vs-nr')!),
    );
    for (const link of nmnNr) {
      const comp = evidenceComparisons.find((c) => c.slug === link.slug)!;
      const overlap = compoundSlugsForComparison(comp).some((s) => source.has(s));
      expect(overlap).toBe(true);
    }
  });
});
