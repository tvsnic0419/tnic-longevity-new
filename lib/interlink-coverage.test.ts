import { describe, it, expect } from 'vitest';
import { hallmarkLibrary } from './hallmarks-library';
import { libraryModules } from './library-modules';
import {
  getCompoundsForHallmark,
  getGuidesForHallmark,
  getMappedGuideHrefs,
} from './library-graph';
import { pathways, getPathwaysForHallmark, getPathwaysForCompound } from './pathways';

/**
 * Reachability / anti-orphan guard. The other interlink tests assert that links
 * RESOLVE (no 404s); this one asserts that nodes are REACHABLE — that every
 * compound, pathway, and guide can be reached inbound from a hallmark page (the
 * pillar of the pillar→cluster model). It exists so a high-value node can't
 * silently become an island that only the footer or prose auto-links can reach,
 * and so the hallmark→compound / hallmark→pathway / hallmark→guide rails can't
 * regress without failing CI.
 */
describe('interlink coverage: no orphaned nodes', () => {
  const compoundSlugs = libraryModules
    .filter((m) => m.category === 'compounds')
    .map((m) => m.slug);

  it('every compound is reachable from at least one hallmark page', () => {
    const reachable = new Set<string>();
    for (const h of hallmarkLibrary) {
      for (const c of getCompoundsForHallmark(h.id)) reachable.add(c.slug);
    }
    for (const slug of compoundSlugs) {
      expect(reachable.has(slug), `compound "${slug}" is linked from no hallmark page`).toBe(true);
    }
  });

  it('every pathway is reachable from both a hallmark page and a compound page', () => {
    const fromHallmark = new Set<string>();
    for (const h of hallmarkLibrary) {
      for (const p of getPathwaysForHallmark(h.id)) fromHallmark.add(p.slug);
    }
    for (const p of pathways) {
      expect(fromHallmark.has(p.slug), `pathway "${p.slug}" is linked from no hallmark page`).toBe(true);
      const viaCompound = p.compoundSlugs.some((s) =>
        getPathwaysForCompound(s).some((x) => x.slug === p.slug),
      );
      expect(viaCompound, `pathway "${p.slug}" is linked from no compound page`).toBe(true);
    }
  });

  it('every supplement guide is reachable from at least one hallmark page', () => {
    const reachable = new Set<string>();
    for (const h of hallmarkLibrary) {
      for (const g of getGuidesForHallmark(h.id)) reachable.add(g.href);
    }
    for (const href of getMappedGuideHrefs()) {
      expect(reachable.has(href), `guide "${href}" is linked from no hallmark page`).toBe(true);
    }
  });
});
