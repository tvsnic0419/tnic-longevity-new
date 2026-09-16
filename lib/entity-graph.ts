import { compoundModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { pathways } from './pathways';
import type { EvidenceTier } from './types';

/**
 * The site's cross-type entity graph, as a derived view.
 *
 * Every edge here already existed in a registry — `pathway.compoundSlugs`,
 * `pathway.hallmarkIds`, `module.relatedHallmarkIds`,
 * `hallmark.relatedCompoundIds`. What did not exist was one place to ask
 * "what does this entity connect to, across types, and where do those live?",
 * so pages kept rendering the edges they held as dead text. An audit of the
 * rendered site found `/pathways` displaying the string
 * "6 compounds · 3 hallmarks" on every card while linking to zero compounds,
 * and `/sirtuin-atlas` server-rendering 12,183 characters about SIRT1–SIRT7
 * activators with zero in-body links of any kind.
 *
 * Three rules this module holds to:
 *
 *  1. It INVENTS NOTHING. Every neighbour is resolved from an existing
 *     registry by id or slug. An id that does not resolve is dropped, never
 *     guessed at and never rendered as a link to a route that may not exist —
 *     which is also why `resolveCompounds` filters rather than maps.
 *  2. It is derived at module scope, so a registry edit moves the graph with
 *     it and cannot leave a stale copy behind.
 *  3. It returns entities, not markup. Presentation lives in `EntityChips`.
 *
 * `entity-graph.test.ts` asserts every href produced here resolves to a real
 * route, and that the neighbour sets actually agree with their registries.
 */

export type EntityKind = 'compound' | 'hallmark' | 'pathway';

export interface GraphEntity {
  kind: EntityKind;
  /** Registry key: compound/pathway slug, or hallmark id. */
  key: string;
  /** Human label, as the registry spells it. */
  label: string;
  href: string;
  /** Only compounds carry a graded tier. */
  tier?: EvidenceTier;
}

// ── Lookup tables, built once ───────────────────────────────────────────────

const compoundBySlug = new Map(compoundModules.map((m) => [m.slug, m]));
const hallmarkById = new Map(hallmarkLibrary.map((h) => [h.id, h]));
const pathwayBySlug = new Map(pathways.map((p) => [p.slug, p]));

export function compoundEntity(slug: string): GraphEntity | null {
  const m = compoundBySlug.get(slug);
  if (!m) return null;
  return {
    kind: 'compound',
    key: m.slug,
    label: m.title,
    href: `/library/compounds/${m.slug}`,
    tier: m.evidenceTier,
  };
}

export function hallmarkEntity(id: string): GraphEntity | null {
  const h = hallmarkById.get(id);
  if (!h) return null;
  return { kind: 'hallmark', key: h.id, label: h.title, href: `/library/${h.slug}` };
}

export function pathwayEntity(slug: string): GraphEntity | null {
  const p = pathwayBySlug.get(slug);
  if (!p) return null;
  return { kind: 'pathway', key: p.slug, label: p.name, href: `/pathways/${p.slug}` };
}

/** Resolve a list of ids/slugs, dropping anything with no page behind it. */
export function resolveCompounds(slugs: readonly string[]): GraphEntity[] {
  return slugs.map(compoundEntity).filter((e): e is GraphEntity => e !== null);
}
export function resolveHallmarks(ids: readonly string[]): GraphEntity[] {
  return ids.map(hallmarkEntity).filter((e): e is GraphEntity => e !== null);
}
export function resolvePathways(slugs: readonly string[]): GraphEntity[] {
  return slugs.map(pathwayEntity).filter((e): e is GraphEntity => e !== null);
}

// ── Neighbours, by entity ───────────────────────────────────────────────────

export interface Neighbours {
  compounds: GraphEntity[];
  hallmarks: GraphEntity[];
  pathways: GraphEntity[];
}

const EMPTY: Neighbours = { compounds: [], hallmarks: [], pathways: [] };

/** What a pathway connects to: the compounds that engage it, the hallmarks it drives. */
export function pathwayNeighbours(slug: string): Neighbours {
  const p = pathwayBySlug.get(slug);
  if (!p) return EMPTY;
  return {
    compounds: resolveCompounds(p.compoundSlugs),
    hallmarks: resolveHallmarks(p.hallmarkIds),
    pathways: [],
  };
}

/** What a hallmark connects to, inverting the pathway edge to get back down. */
export function hallmarkNeighbours(id: string): Neighbours {
  const h = hallmarkById.get(id);
  if (!h) return EMPTY;
  return {
    compounds: resolveCompounds(h.relatedCompoundIds),
    hallmarks: [],
    pathways: resolvePathways(pathways.filter((p) => p.hallmarkIds.includes(id)).map((p) => p.slug)),
  };
}

/** What a compound connects to, inverting the pathway edge the same way. */
export function compoundNeighbours(slug: string): Neighbours {
  const m = compoundBySlug.get(slug);
  if (!m) return EMPTY;
  return {
    compounds: [],
    hallmarks: resolveHallmarks(m.relatedHallmarkIds),
    pathways: resolvePathways(pathways.filter((p) => p.compoundSlugs.includes(slug)).map((p) => p.slug)),
  };
}

/**
 * Best-effort resolution of a free-form name to a compound deep-dive.
 *
 * Deliberately strict, because a wrong link on an evidence site is worse than
 * no link: an exact slug match, or an exact case-insensitive title match, and
 * nothing else. No fuzzy matching, no prefix matching, no stripping of
 * parentheticals — those would silently point "Quercetin / isoquercetin" or
 * "Cyanidin / anthocyanidins" at a page that is not about that thing.
 */
const compoundByTitle = new Map(compoundModules.map((m) => [m.title.toLowerCase(), m]));

export function compoundEntityByNameOrSlug(nameOrSlug: string): GraphEntity | null {
  const bySlug = compoundEntity(nameOrSlug);
  if (bySlug) return bySlug;
  const m = compoundByTitle.get(nameOrSlug.trim().toLowerCase());
  return m ? compoundEntity(m.slug) : null;
}

/** Counts for a page that wants to state the graph's size without asserting one. */
export function entityGraphStats() {
  const pathwayEdges = pathways.reduce(
    (n, p) => n + resolveCompounds(p.compoundSlugs).length + resolveHallmarks(p.hallmarkIds).length,
    0,
  );
  return {
    compounds: compoundModules.length,
    hallmarks: hallmarkLibrary.length,
    pathways: pathways.length,
    pathwayEdges,
  };
}
