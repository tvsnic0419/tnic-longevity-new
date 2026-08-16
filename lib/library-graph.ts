import { compounds } from './data';
import { libraryModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { peptideLibrary } from './peptides-library';
import type { EvidenceTier, PeptideLegalStatus } from './types';

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

export interface PeptideLink {
  /** Resolves to /peptides/<slug>. */
  slug: string;
  name: string;
  evidenceTier: EvidenceTier;
  legalStatus: PeptideLegalStatus;
}

/**
 * Peptides that target a given hallmark (by id, e.g. 'proteostasis'), inverting
 * `peptide.relatedHallmarkIds`. Strongest evidence first. The symmetric partner
 * to `getCompoundsForHallmark`, so a hallmark page can surface the peptides
 * addressing it — closing the hallmark↔peptide loop the peptide library already
 * encodes but nothing rendered.
 */
export function getPeptidesForHallmark(hallmarkId: string): PeptideLink[] {
  return peptideLibrary
    .filter((p) => p.relatedHallmarkIds.includes(hallmarkId))
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      evidenceTier: p.evidenceTier,
      legalStatus: p.legalStatus,
    }))
    .sort(
      (a, b) => a.evidenceTier.localeCompare(b.evidenceTier) || a.name.localeCompare(b.name),
    );
}

/**
 * Compounds that share at least one target hallmark with a peptide — a DERIVED,
 * honest bridge (peptides carry no direct compound edges, and we don't invent
 * them). Unions `getCompoundsForHallmark` over the peptide's hallmark ids,
 * deduped, strongest evidence first. Powers a "Compounds that share its targets"
 * rail on peptide pages so peptides stop being a dead end in the graph.
 */
export function getCompoundsForPeptideHallmarks(
  hallmarkIds: string[],
  limit = 8,
): CompoundLink[] {
  const bySlug = new Map<string, CompoundLink>();
  for (const hid of hallmarkIds) {
    for (const c of getCompoundsForHallmark(hid)) {
      if (!bySlug.has(c.slug)) bySlug.set(c.slug, c);
    }
  }
  return [...bySlug.values()]
    .sort((a, b) => a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name))
    .slice(0, limit);
}
