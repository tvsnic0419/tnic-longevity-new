import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { compounds } from './data';
import { libraryModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { eliteStacks } from './stacks-library';
import { evidenceComparisons } from './comparisons';
import {
  getCompoundsForHallmark,
  getHallmarksForCompound,
  getStacksForCompound,
  getStacksForHallmark,
  getCompoundsForStack,
  getGuideForCompound,
  getCompoundsForGuide,
  getMappedGuideHrefs,
  buildStackHref,
} from './library-graph';
import { getComparisonsForCompound, getCompoundLinksForComparison } from './comparison-relations';

const hallmarkIds = new Set(hallmarkLibrary.map((h) => h.id));
const compoundModuleSlugs = new Set(
  libraryModules.filter((m) => m.category === 'compounds').map((m) => m.slug),
);
const hallmarkSlugs = new Set(hallmarkLibrary.map((h) => h.slug));
const stackSlugs = new Set(eliteStacks.map((s) => s.slug));
const comparisonSlugs = new Set(evidenceComparisons.map((c) => c.slug));

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

  it('every mapped guide href resolves to at least one real compound (reverse link)', () => {
    for (const href of getMappedGuideHrefs()) {
      const back = getCompoundsForGuide(href);
      expect(back.length, `${href} has no compounds`).toBeGreaterThan(0);
      for (const c of back) {
        expect(compoundModuleSlugs.has(c.slug), `${href} links to unknown compound ${c.slug}`).toBe(
          true,
        );
      }
    }
  });

  it.each([...compoundModuleSlugs])('%s guide link (if any) round-trips back to it', (slug) => {
    const guide = getGuideForCompound(slug);
    if (!guide) return;
    const back = getCompoundsForGuide(guide.href).map((c) => c.slug);
    expect(back, `guide ${guide.href} does not link back to compound ${slug}`).toContain(slug);
  });
});

/**
 * hallmark ↔ compound ↔ comparison ↔ stack ↔ guide, completed. Every function
 * below is checked two ways: (a) forward links resolve to a real page/route,
 * and (b) traversing forward then backward lands back on the starting slug —
 * the actual definition of "bidirectional."
 */
describe('interlink graph — compound <-> hallmark (reverse)', () => {
  it.each([...compoundModuleSlugs])('%s hallmark links resolve and link back', (slug) => {
    for (const h of getHallmarksForCompound(slug)) {
      expect(hallmarkSlugs.has(h.slug), `${slug} links to unknown hallmark ${h.slug}`).toBe(true);
      const back = getCompoundsForHallmark(
        hallmarkLibrary.find((entry) => entry.slug === h.slug)!.id,
      ).map((c) => c.slug);
      expect(back, `hallmark ${h.slug} does not link back to compound ${slug}`).toContain(slug);
    }
  });
});

describe('interlink graph — compound <-> stack', () => {
  it.each([...compoundModuleSlugs])('%s stack links resolve and link back', (slug) => {
    for (const stack of getStacksForCompound(slug)) {
      expect(stackSlugs.has(stack.slug), `${slug} links to unknown stack ${stack.slug}`).toBe(true);
      const back = getCompoundsForStack(stack.slug).map((c) => c.slug);
      expect(back, `stack ${stack.slug} does not link back to compound ${slug}`).toContain(slug);
    }
  });

  it.each(eliteStacks.map((s) => s.slug))('%s stack compound links resolve to real modules', (slug) => {
    for (const compound of getCompoundsForStack(slug)) {
      expect(
        compoundModuleSlugs.has(compound.slug),
        `stack ${slug} links to unknown compound module ${compound.slug}`,
      ).toBe(true);
    }
  });

  it('/stacks route exists for the buildStackHref target', () => {
    expect(existsSync(join(process.cwd(), 'app/stacks/page.tsx'))).toBe(true);
  });

  it.each(eliteStacks.map((s) => s.slug))('%s stack href is well-formed', (slug) => {
    expect(buildStackHref(slug)).toBe(`/stacks?preset=${slug}`);
  });
});

describe('interlink graph — hallmark <-> stack', () => {
  it.each(hallmarkLibrary.map((h) => h.id))(
    'every stack linked from hallmark %s actually covers it',
    (hallmarkId) => {
      for (const stack of getStacksForHallmark(hallmarkId)) {
        expect(stackSlugs.has(stack.slug), `unknown stack ${stack.slug}`).toBe(true);
        const covered = eliteStacks.find((s) => s.slug === stack.slug)!.hallmarkCoverage;
        expect(covered, `stack ${stack.slug} does not actually cover ${hallmarkId}`).toContain(
          hallmarkId,
        );
      }
    },
  );
});

describe('interlink graph — compound <-> comparison', () => {
  it.each([...compoundModuleSlugs])('%s comparison links resolve and link back', (slug) => {
    for (const comparison of getComparisonsForCompound(slug)) {
      expect(
        comparisonSlugs.has(comparison.slug),
        `${slug} links to unknown comparison ${comparison.slug}`,
      ).toBe(true);
      const comp = evidenceComparisons.find((c) => c.slug === comparison.slug)!;
      const back = getCompoundLinksForComparison(comp).map((c) => c.slug);
      expect(back, `comparison ${comparison.slug} does not link back to compound ${slug}`).toContain(
        slug,
      );
    }
  });
});

describe('interlink graph — no dead ends on the flagship set', () => {
  const flagshipCompounds = ['glynac', 'nmn', 'taurine', 'spermidine', 'pterostilbene', 'rapamycin'];

  it.each(flagshipCompounds)('%s resolves to at least one related entity', (slug) => {
    const relatedCount =
      getHallmarksForCompound(slug).length +
      getStacksForCompound(slug).length +
      getComparisonsForCompound(slug).length +
      (getGuideForCompound(slug) ? 1 : 0);
    expect(relatedCount, `${slug} is a dead end — no outgoing graph edges`).toBeGreaterThan(0);
  });

  it.each(hallmarkLibrary.map((h) => h.id))('hallmark %s resolves to at least one compound', (id) => {
    expect(
      getCompoundsForHallmark(id).length,
      `hallmark ${id} has no linked compounds`,
    ).toBeGreaterThan(0);
  });

  it.each(eliteStacks.map((s) => s.slug))('stack %s resolves to at least one compound', (slug) => {
    expect(getCompoundsForStack(slug).length, `stack ${slug} has no linked compounds`).toBeGreaterThan(
      0,
    );
  });
});
