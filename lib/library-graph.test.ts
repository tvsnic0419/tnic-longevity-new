import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { compounds } from './data';
import { libraryModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import {
  getCompoundsForHallmark,
  getGuideForCompound,
  getGuidesForHallmark,
  getHallmarksForGuide,
  getMappedGuideHrefs,
} from './library-graph';

const hallmarkIds = new Set(hallmarkLibrary.map((h) => h.id));
const compoundModuleSlugs = new Set(
  libraryModules.filter((m) => m.category === 'compounds').map((m) => m.slug),
);

describe('library-graph: hallmark → compounds', () => {
  it('every hallmark id referenced by a compound is a real hallmark', () => {
    for (const c of compounds) {
      for (const id of c.hallmarks ?? []) {
        expect(hallmarkIds.has(id)).toBe(true);
      }
    }
  });

  it('returns only compounds that have a real library page', () => {
    for (const h of hallmarkLibrary) {
      for (const link of getCompoundsForHallmark(h.id)) {
        expect(compoundModuleSlugs.has(link.slug)).toBe(true);
      }
    }
  });

  it('surfaces compounds for a known hallmark (mitochondrial dysfunction)', () => {
    const links = getCompoundsForHallmark('mito');
    expect(links.length).toBeGreaterThan(0);
    // GlyNAC targets 'mito' and has a page.
    expect(links.map((l) => l.slug)).toContain('glynac');
  });

  it('sorts by evidence tier (A before B before C)', () => {
    const tiers = getCompoundsForHallmark('inflammation').map((l) => l.evidence);
    const sorted = [...tiers].sort();
    expect(tiers).toEqual(sorted);
  });
});

describe('library-graph: compound → guide', () => {
  it('maps only real compound module slugs', () => {
    for (const slug of Object.keys({
      nmn: 1, nr: 1, glynac: 1, berberine: 1, sulforaphane: 1, spermidine: 1, taurine: 1,
    })) {
      expect(compoundModuleSlugs.has(slug)).toBe(true);
    }
  });

  it('every mapped guide href resolves to a real app route', () => {
    for (const href of getMappedGuideHrefs()) {
      const dir = join(process.cwd(), 'app', href.replace(/^\//, ''));
      expect(existsSync(join(dir, 'page.tsx'))).toBe(true);
    }
  });

  it('returns a guide for a mapped compound and nothing for an unmapped one', () => {
    expect(getGuideForCompound('nmn')?.href).toBe('/nad-supplement-guide');
    expect(getGuideForCompound('grapeseed')).toBeUndefined();
  });
});

describe('library-graph: hallmark → guides (inverse of guide → hallmarks)', () => {
  const slugToId = new Map(hallmarkLibrary.map((h) => [h.slug, h.id]));

  it('every guide returned for a hallmark resolves to a real app route', () => {
    for (const h of hallmarkLibrary) {
      for (const g of getGuidesForHallmark(h.id)) {
        const dir = join(process.cwd(), 'app', g.href.replace(/^\//, ''));
        expect(existsSync(join(dir, 'page.tsx'))).toBe(true);
      }
    }
  });

  it('round-trips with getHallmarksForGuide: a guide is returned for every hallmark it targets', () => {
    for (const href of getMappedGuideHrefs()) {
      for (const hl of getHallmarksForGuide(href)) {
        const id = slugToId.get(hl.slug);
        expect(id).toBeDefined();
        const hrefs = getGuidesForHallmark(id!).map((g) => g.href);
        expect(hrefs).toContain(href);
      }
    }
  });

  it('surfaces the NAD+ guide for a hallmark NMN targets', () => {
    const nmn = libraryModules.find((m) => m.category === 'compounds' && m.slug === 'nmn');
    expect(nmn).toBeDefined();
    const targetHallmark = nmn!.relatedHallmarkIds[0];
    expect(getGuidesForHallmark(targetHallmark).map((g) => g.href)).toContain('/nad-supplement-guide');
  });
});
