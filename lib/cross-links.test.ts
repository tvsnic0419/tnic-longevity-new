import { describe, expect, it } from 'vitest';
import { crossLinks, crossLinkTerms } from './cross-links';
import { libraryModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { peptideLibrary } from './peptides-library';
import { pathways } from './pathways';

const compoundHrefs = new Set(
  libraryModules
    .filter((m) => m.category === 'compounds')
    .map((m) => `/library/compounds/${m.slug}`),
);
const hallmarkHrefs = new Set(hallmarkLibrary.map((h) => `/library/${h.slug}`));
const peptideHrefs = new Set(peptideLibrary.map((p) => `/peptides/${p.slug}`));
const pathwayHrefs = new Set(pathways.map((p) => `/pathways/${p.slug}`));

describe('cross-links resolve to real routes', () => {
  it('every cross-link href is a real compound, hallmark, peptide, or pathway deep-dive', () => {
    for (const { href } of crossLinks) {
      const ok =
        compoundHrefs.has(href) ||
        hallmarkHrefs.has(href) ||
        peptideHrefs.has(href) ||
        pathwayHrefs.has(href);
      expect(ok, `cross-link href does not resolve: ${href}`).toBe(true);
    }
  });

  it('all 12 hallmarks are cross-linked', () => {
    for (const h of hallmarkLibrary) {
      const has = crossLinks.some((c) => c.href === `/library/${h.slug}`);
      expect(has, `hallmark ${h.slug} missing from cross-links`).toBe(true);
    }
  });

  it('no duplicate prose names (would double-process)', () => {
    const names = crossLinkTerms.map((t) => t.name.toLowerCase());
    expect(new Set(names).size, `duplicate cross-link names: ${names.join(', ')}`).toBe(names.length);
  });

  it('terms are sorted longest-first so aliases match before short forms', () => {
    for (let i = 1; i < crossLinkTerms.length; i++) {
      expect(crossLinkTerms[i - 1].name.length).toBeGreaterThanOrEqual(crossLinkTerms[i].name.length);
    }
  });
});
