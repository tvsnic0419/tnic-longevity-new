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
 */
export function getCompoundsForHallmark(hallmarkId: string): CompoundLink[] {
  return compounds
    .filter((c) => Array.isArray(c.hallmarks) && c.hallmarks.includes(hallmarkId))
    .map((c) => {
      const slug = compoundIdToModuleSlug.get(c.id);
      return slug ? { slug, name: c.name, evidence: c.evidence } : null;
    })
    .filter((x): x is CompoundLink => x !== null)
    .sort((a, b) => a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name));
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
