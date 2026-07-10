import { evidenceComparisons, type EvidenceComparison } from './comparisons';
import { libraryModules } from './library-modules';

/**
 * Lightweight, serializable shape for cross-linking to a comparison. Kept small
 * on purpose so server components can pass it to client components without
 * dragging the full `comparisons` data (~64 kB) into the client bundle.
 */
export interface ComparisonLink {
  slug: string;
  title: string;
  labelA: string;
  labelB: string;
  evidenceTier: EvidenceComparison['evidenceTier'];
}

// Compound module slugs that actually have a page under /library/compounds/*.
const compoundModuleSlugs = new Set(
  libraryModules.filter((m) => m.category === 'compounds').map((m) => m.slug),
);

/**
 * Compound module slugs a comparison relates to, derived from its curated
 * `relatedHrefs` (`/library/compounds/<slug>`). Only slugs that resolve to a
 * real compound page are returned, so links can never 404.
 */
export function compoundSlugsForComparison(comp: EvidenceComparison): string[] {
  const slugs = new Set<string>();
  for (const { href } of comp.relatedHrefs) {
    const match = href.match(/^\/library\/compounds\/([a-z0-9-]+)/i);
    if (match && compoundModuleSlugs.has(match[1])) slugs.add(match[1]);
  }
  return [...slugs];
}

const toLink = (c: EvidenceComparison): ComparisonLink => ({
  slug: c.slug,
  title: c.title,
  labelA: c.labelA,
  labelB: c.labelB,
  evidenceTier: c.evidenceTier,
});

/** Comparisons that feature a given compound (by its module slug). */
export function getComparisonsForCompound(moduleSlug: string): ComparisonLink[] {
  return evidenceComparisons
    .filter((c) => compoundSlugsForComparison(c).includes(moduleSlug))
    .map(toLink);
}

/**
 * Sibling comparisons that share at least one compound with `slug`, ranked by
 * how many compounds they share (most related first). Excludes the comparison
 * itself and any comparison with no compound overlap.
 */
export function getRelatedComparisons(slug: string, limit = 4): ComparisonLink[] {
  const current = evidenceComparisons.find((c) => c.slug === slug);
  if (!current) return [];
  const currentCompounds = new Set(compoundSlugsForComparison(current));
  if (currentCompounds.size === 0) return [];

  return evidenceComparisons
    .filter((c) => c.slug !== slug)
    .map((c) => ({
      comparison: c,
      overlap: compoundSlugsForComparison(c).filter((s) => currentCompounds.has(s)).length,
    }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((x) => toLink(x.comparison));
}
