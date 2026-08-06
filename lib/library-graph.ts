import { compounds } from './data';
import { libraryModules } from './library-modules';
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
