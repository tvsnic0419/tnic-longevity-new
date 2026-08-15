import { compounds } from './data';
import { libraryModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import type { EvidenceTier } from './types';

/**
 * Cross-type interlinking for the library. Derives relationships between
 * hallmarks, compounds, and the supplement-guide landing pages from existing
 * structured data so every content node links to its neighbours. Shapes are
 * kept small and serializable so server components can pass them to client
 * components without pulling the heavy `data` module into the client bundle.
 */

export interface CompoundLink {
  /** Module slug — resolves to /library/compounds/<slug>. */
  slug: string;
  name: string;
  evidence: EvidenceTier;
}

export interface GuideLink {
  href: string;
  label: string;
}

// compound id -> compound module slug, for compounds that have a page.
const compoundIdToModuleSlug = new Map<string, string>();
for (const m of libraryModules) {
  if (m.category === 'compounds' && m.compoundId) {
    compoundIdToModuleSlug.set(m.compoundId, m.slug);
  }
}

/**
 * Compounds that target a given hallmark (by hallmark id, e.g. 'mito'), limited
 * to compounds that have a library page. Strongest evidence first.
 *
 * Unions two sources so every hallmark links its FULL evidence set:
 *  1. Structured `compounds` (data.ts) — the stack-buildable subset, mapped by
 *     their richer display name.
 *  2. Library-first compound modules whose `relatedHallmarkIds` include the
 *     hallmark — the deep-dive compounds that have no dataset entry. Without
 *     this, half the library is invisible to the hallmark knowledge graph.
 */
export function getCompoundsForHallmark(hallmarkId: string): CompoundLink[] {
  const bySlug = new Map<string, CompoundLink>();

  for (const c of compounds) {
    if (!Array.isArray(c.hallmarks) || !c.hallmarks.includes(hallmarkId)) continue;
    const slug = compoundIdToModuleSlug.get(c.id);
    if (slug) bySlug.set(slug, { slug, name: c.name, evidence: c.evidence });
  }

  for (const m of libraryModules) {
    if (m.category !== 'compounds' || !m.relatedHallmarkIds.includes(hallmarkId)) continue;
    if (bySlug.has(m.slug)) continue;
    bySlug.set(m.slug, { slug: m.slug, name: m.title, evidence: m.evidenceTier });
  }

  return [...bySlug.values()].sort(
    (a, b) => a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name),
  );
}

export interface RelatedCompoundLink extends CompoundLink {
  /** How many hallmarks this compound shares with the anchor compound. */
  shared: number;
}

/**
 * Other compound deep-dives that share at least one hallmark with the given
 * compound module, ranked by overlap then evidence. Powers the reciprocal
 * "Related compounds" rail so every compound page links laterally into the
 * library instead of being a dead end. Operates purely on module data, so all
 * 55 compounds participate — not just the stack-buildable subset.
 */
export function getRelatedCompounds(moduleSlug: string, limit = 6): RelatedCompoundLink[] {
  const self = libraryModules.find(
    (m) => m.category === 'compounds' && m.slug === moduleSlug,
  );
  if (!self) return [];
  const selfHallmarks = new Set(self.relatedHallmarkIds);

  return libraryModules
    .filter((m) => m.category === 'compounds' && m.slug !== moduleSlug)
    .map((m) => ({
      slug: m.slug,
      name: m.title,
      evidence: m.evidenceTier,
      shared: m.relatedHallmarkIds.filter((h) => selfHallmarks.has(h)).length,
    }))
    .filter((r) => r.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        a.evidence.localeCompare(b.evidence) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}

/**
 * The supplement-guide landing page for a compound (by module slug), when one
 * exists. These are high-intent SEO pages, so compound deep-dives funnel to
 * them. Keys are compound module slugs; every href is a real guide route.
 */
const compoundGuides: Record<string, GuideLink> = {
  nmn: { href: '/nad-supplement-guide', label: 'NAD+ supplement guide' },
  nr: { href: '/nad-supplement-guide', label: 'NAD+ supplement guide' },
  glynac: { href: '/glynac-supplement-guide', label: 'GlyNAC supplement guide' },
  berberine: { href: '/berberine-supplement-guide', label: 'Berberine supplement guide' },
  sulforaphane: { href: '/sulforaphane-supplement-guide', label: 'Sulforaphane supplement guide' },
  spermidine: { href: '/spermidine-supplement-guide', label: 'Spermidine supplement guide' },
  taurine: { href: '/taurine-supplement-guide', label: 'Taurine supplement guide' },
};

export function getGuideForCompound(moduleSlug: string): GuideLink | undefined {
  return compoundGuides[moduleSlug];
}

/**
 * The inverse of `compoundGuides`: the compound module slugs a given guide
 * route covers. Lets a guide page derive its own compound set (and, through
 * that, its related comparisons) from the same map the compound deep-dives use,
 * so the guide↔compound relationship has exactly one source of truth.
 */
export function getCompoundSlugsForGuide(guideHref: string): string[] {
  return Object.entries(compoundGuides)
    .filter(([, g]) => g.href === guideHref)
    .map(([slug]) => slug);
}

/**
 * The compound deep-dives a guide covers, as ready-to-render links (name +
 * evidence tier), strongest-evidence first. Derived from the same compound→guide
 * map as everything else, so a guide's compound rail can neither drift from nor
 * 404 against the library — replacing the fragile hand-authored compound links
 * guide pages previously carried.
 */
export function getCompoundLinksForGuide(guideHref: string): CompoundLink[] {
  const out: CompoundLink[] = [];
  for (const slug of getCompoundSlugsForGuide(guideHref)) {
    const mod = libraryModules.find((m) => m.category === 'compounds' && m.slug === slug);
    if (mod) out.push({ slug: mod.slug, name: mod.title, evidence: mod.evidenceTier });
  }
  return out.sort(
    (a, b) => a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name),
  );
}

export interface HallmarkLink {
  /** Resolves to the canonical hallmark page at /library/<slug>. */
  slug: string;
  title: string;
  number: number;
}

const hallmarkById = new Map(hallmarkLibrary.map((h) => [h.id, h]));

/**
 * The hallmarks of aging a guide addresses, derived from the relatedHallmarkIds
 * of the compound(s) it covers. Closes the guide→hallmark loop so a guide links
 * up into the mechanism map, not just sideways to sibling guides. Deduplicated
 * and ordered by hallmark number.
 */
export function getHallmarksForGuide(guideHref: string): HallmarkLink[] {
  const ids = new Set<string>();
  for (const slug of getCompoundSlugsForGuide(guideHref)) {
    const mod = libraryModules.find((m) => m.category === 'compounds' && m.slug === slug);
    if (mod) for (const id of mod.relatedHallmarkIds) ids.add(id);
  }
  const links: HallmarkLink[] = [];
  for (const id of ids) {
    const h = hallmarkById.get(id);
    if (h) links.push({ slug: h.slug, title: h.title, number: h.number });
  }
  return links.sort((a, b) => a.number - b.number);
}

/**
 * The inverse of `getHallmarksForGuide`: the supplement guides that address a
 * given hallmark, because at least one compound they cover targets it. Closes
 * the hallmark→guide loop — guides already point *up* to hallmarks, but until
 * now hallmark pages had no rail *down* to the high-intent buyer guides. Derived
 * from the same compound→hallmark map, so it can never drift from
 * `getHallmarksForGuide`.
 */
export function getGuidesForHallmark(hallmarkId: string): GuideLink[] {
  const out: GuideLink[] = [];
  const seen = new Set<string>();
  for (const href of getMappedGuideHrefs()) {
    const covers = getCompoundSlugsForGuide(href).some((slug) => {
      const mod = libraryModules.find((m) => m.category === 'compounds' && m.slug === slug);
      return mod?.relatedHallmarkIds.includes(hallmarkId) ?? false;
    });
    if (!covers || seen.has(href)) continue;
    seen.add(href);
    const label = Object.values(compoundGuides).find((g) => g.href === href)?.label ?? href;
    out.push({ href, label });
  }
  return out;
}

/**
 * Map of compound id -> compound module slug for every compound that has a
 * page. Lets a server component hand client components the data to build
 * correct `/library/compounds/<slug>` links without importing the compound or
 * module datasets into the client bundle.
 */
export function getCompoundIdToSlugMap(): Record<string, string> {
  return Object.fromEntries(compoundIdToModuleSlug);
}

/** All distinct guide routes referenced by the compound → guide map. */
export function getMappedGuideHrefs(): string[] {
  return [...new Set(Object.values(compoundGuides).map((g) => g.href))];
}
