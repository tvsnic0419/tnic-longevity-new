import { describe, expect, it } from 'vitest';
import { getKnowledgeGraphData } from './knowledge-graph';
import { hallmarkLibrary } from './hallmarks-library';
import { libraryModules } from './library-modules';
import { getCompoundsForHallmark, getHallmarksForCompound } from './library-graph';

const hallmarkIds = new Set(hallmarkLibrary.map((h) => h.id));
const compoundModuleSlugs = new Set(
  libraryModules.filter((m) => m.category === 'compounds').map((m) => m.slug),
);

describe('knowledge graph data — every node and edge is real', () => {
  const { hallmarks, compounds, edges } = getKnowledgeGraphData();

  it('includes all 12 hallmarks', () => {
    expect(hallmarks.length).toBe(12);
    for (const h of hallmarks) {
      expect(hallmarkIds.has(h.id)).toBe(true);
    }
  });

  it('only includes compounds with a real library page', () => {
    for (const c of compounds) {
      expect(compoundModuleSlugs.has(c.slug), `unknown compound ${c.slug}`).toBe(true);
    }
  });

  it('has no duplicate compound nodes', () => {
    const slugs = compounds.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has no duplicate hallmark nodes', () => {
    const ids = hallmarks.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every edge resolves to a real hallmark and compound node', () => {
    const hallmarkNodeIds = new Set(hallmarks.map((h) => h.id));
    const compoundNodeSlugs = new Set(compounds.map((c) => c.slug));
    for (const e of edges) {
      expect(hallmarkNodeIds.has(e.hallmarkId), `edge references unknown hallmark ${e.hallmarkId}`).toBe(
        true,
      );
      expect(
        compoundNodeSlugs.has(e.compoundSlug),
        `edge references unknown compound ${e.compoundSlug}`,
      ).toBe(true);
    }
  });

  it('has no duplicate edges', () => {
    const keys = edges.map((e) => `${e.hallmarkId}:${e.compoundSlug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every hallmark has at least one edge (no isolated nodes)', () => {
    for (const h of hallmarks) {
      const hasEdge = edges.some((e) => e.hallmarkId === h.id);
      expect(hasEdge, `hallmark ${h.id} has no edges — isolated node`).toBe(true);
    }
  });

  it('every compound has at least one edge (no isolated nodes)', () => {
    for (const c of compounds) {
      const hasEdge = edges.some((e) => e.compoundSlug === c.slug);
      expect(hasEdge, `compound ${c.slug} has no edges — isolated node`).toBe(true);
    }
  });

  it('edges match getCompoundsForHallmark / getHallmarksForCompound exactly', () => {
    for (const h of hallmarks) {
      const expected = getCompoundsForHallmark(h.id).map((c) => c.slug).sort();
      const actual = edges
        .filter((e) => e.hallmarkId === h.id)
        .map((e) => e.compoundSlug)
        .sort();
      expect(actual).toEqual(expected);
    }
    for (const c of compounds) {
      const expected = getHallmarksForCompound(c.slug).map((h) => h.slug).sort();
      const actualIds = edges.filter((e) => e.compoundSlug === c.slug).map((e) => e.hallmarkId);
      const actual = actualIds
        .map((id) => hallmarkLibrary.find((h) => h.id === id)!.slug)
        .sort();
      expect(actual).toEqual(expected);
    }
  });
});
