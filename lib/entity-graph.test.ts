import { describe, expect, it } from 'vitest';
import {
  compoundEntity,
  hallmarkEntity,
  pathwayEntity,
  compoundEntityByNameOrSlug,
  compoundNeighbours,
  hallmarkNeighbours,
  pathwayNeighbours,
  entityGraphStats,
  resolveCompounds,
} from './entity-graph';
import { compoundModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { pathways } from './pathways';

/**
 * The graph's whole claim is that every edge it renders came from a registry
 * and lands on a page that exists. A wrong link on an evidence site is worse
 * than no link, so these guard resolution and reachability — not appearance.
 */
describe('entity graph', () => {
  it('resolves every compound, hallmark and pathway to its own route', () => {
    for (const m of compoundModules) {
      expect(compoundEntity(m.slug)).toEqual({
        kind: 'compound',
        key: m.slug,
        label: m.title,
        href: `/library/compounds/${m.slug}`,
        tier: m.evidenceTier,
      });
    }
    for (const h of hallmarkLibrary) {
      expect(hallmarkEntity(h.id)?.href).toBe(`/library/${h.slug}`);
    }
    for (const p of pathways) {
      expect(pathwayEntity(p.slug)?.href).toBe(`/pathways/${p.slug}`);
    }
  });

  it('returns null for an unknown key rather than a route that would 404', () => {
    expect(compoundEntity('not-a-compound')).toBeNull();
    expect(hallmarkEntity('not-a-hallmark')).toBeNull();
    expect(pathwayEntity('not-a-pathway')).toBeNull();
    expect(compoundEntityByNameOrSlug('Definitely Not A Compound')).toBeNull();
  });

  it('drops unresolvable ids instead of emitting a broken link', () => {
    const real = compoundModules[0].slug;
    const out = resolveCompounds([real, 'ghost-compound', 'another-ghost']);
    expect(out).toHaveLength(1);
    expect(out[0].key).toBe(real);
  });

  it('matches a name only on an exact slug or exact title', () => {
    const m = compoundModules[0];
    expect(compoundEntityByNameOrSlug(m.slug)?.key).toBe(m.slug);
    expect(compoundEntityByNameOrSlug(m.title.toUpperCase())?.key).toBe(m.slug);
    // No prefix or fuzzy matching — that is how "Quercetin / isoquercetin"
    // would end up pointed at a page that is not about that thing.
    expect(compoundEntityByNameOrSlug(`${m.title} extended release`)).toBeNull();
  });

  it('agrees with the registry it derives each neighbour set from', () => {
    for (const p of pathways) {
      const n = pathwayNeighbours(p.slug);
      // Resolvable subset, in registry order, nothing added.
      expect(n.compounds.map((c) => c.key)).toEqual(
        p.compoundSlugs.filter((s) => compoundEntity(s) !== null),
      );
      expect(n.hallmarks.map((h) => h.key)).toEqual(
        p.hallmarkIds.filter((id) => hallmarkEntity(id) !== null),
      );
    }
    for (const h of hallmarkLibrary) {
      const n = hallmarkNeighbours(h.id);
      expect(n.compounds.map((c) => c.key)).toEqual(
        h.relatedCompoundIds.filter((s) => compoundEntity(s) !== null),
      );
      // The pathway edge, inverted.
      for (const p of n.pathways) {
        expect(pathways.find((x) => x.slug === p.key)?.hallmarkIds).toContain(h.id);
      }
    }
    for (const m of compoundModules) {
      for (const p of compoundNeighbours(m.slug).pathways) {
        expect(pathways.find((x) => x.slug === p.key)?.compoundSlugs).toContain(m.slug);
      }
    }
  });

  it('gives an unknown entity an empty neighbourhood, never a partial one', () => {
    for (const n of [compoundNeighbours('nope'), hallmarkNeighbours('nope'), pathwayNeighbours('nope')]) {
      expect(n.compounds).toEqual([]);
      expect(n.hallmarks).toEqual([]);
      expect(n.pathways).toEqual([]);
    }
  });

  it('counts the graph from the graph, so a page cannot overstate it', () => {
    const s = entityGraphStats();
    expect(s.compounds).toBe(compoundModules.length);
    expect(s.hallmarks).toBe(hallmarkLibrary.length);
    expect(s.pathways).toBe(pathways.length);
    expect(s.pathwayEdges).toBe(
      pathways.reduce(
        (n, p) => n + pathwayNeighbours(p.slug).compounds.length + pathwayNeighbours(p.slug).hallmarks.length,
        0,
      ),
    );
  });

  it('keeps every pathway reachable from at least one compound or hallmark', () => {
    // A pathway nothing points at is a page only the hub can reach — the
    // dead-end shape this module exists to remove.
    for (const p of pathways) {
      const n = pathwayNeighbours(p.slug);
      expect(n.compounds.length + n.hallmarks.length).toBeGreaterThan(0);
    }
  });
});
