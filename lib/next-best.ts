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
  buildStackHref,
} from './library-graph';
import { getComparisonsForCompound, getCompoundLinksForComparison, getRelatedComparisons } from './comparison-relations';
import type { EvidenceTier } from './types';

/**
 * Unified "next best" links — the single aggregator behind the rail every
 * entity page ends with, so no compound, hallmark, stack, comparison, or
 * guide page is a dead end. Each function pulls from the interlink graph
 * (`library-graph.ts` + `comparison-relations.ts`), interleaves the different
 * entity types round-robin (so the rail isn't five hallmarks in a row), dedupes,
 * and caps at `limit`.
 */
export type NextBestType = 'hallmark' | 'compound' | 'comparison' | 'stack' | 'guide';

export interface NextBestItem {
  type: NextBestType;
  slug: string;
  href: string;
  title: string;
  meta?: string;
  evidence?: EvidenceTier;
}

const hallmarkById = new Map(hallmarkLibrary.map((h) => [h.id, h]));
const stackBySlug = new Map(eliteStacks.map((s) => [s.slug, s]));
const comparisonBySlug = new Map(evidenceComparisons.map((c) => [c.slug, c]));

/** Interleave several lists round-robin so no single type dominates the rail. */
function interleave<T>(lists: T[][], limit: number): T[] {
  const out: T[] = [];
  let i = 0;
  while (out.length < limit && lists.some((l) => i < l.length)) {
    for (const list of lists) {
      if (out.length >= limit) break;
      if (i < list.length) out.push(list[i]);
    }
    i++;
  }
  return out;
}

function dedupe(items: NextBestItem[]): NextBestItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.type}:${item.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Next-best rail for a compound deep-dive (by module slug). */
export function getNextBestForCompound(moduleSlug: string, limit = 6): NextBestItem[] {
  const hallmarks: NextBestItem[] = getHallmarksForCompound(moduleSlug).map((h) => ({
    type: 'hallmark',
    slug: h.slug,
    href: `/library/${h.slug}`,
    title: h.title,
    meta: `Hallmark ${h.number}`,
  }));

  const stacks: NextBestItem[] = getStacksForCompound(moduleSlug).map((s) => ({
    type: 'stack',
    slug: s.slug,
    href: buildStackHref(s.slug),
    title: s.name,
    meta: 'Elite Stack',
    evidence: s.evidence,
  }));

  const comparisons: NextBestItem[] = getComparisonsForCompound(moduleSlug).map((c) => ({
    type: 'comparison',
    slug: c.slug,
    href: `/library/compare/${c.slug}`,
    title: `${c.labelA} vs ${c.labelB}`,
    meta: 'Comparison',
    evidence: c.evidenceTier,
  }));

  const guide = getGuideForCompound(moduleSlug);
  const guides: NextBestItem[] = guide
    ? [{ type: 'guide', slug: guide.href, href: guide.href, title: guide.label, meta: 'Buyer guide' }]
    : [];

  return dedupe(interleave([hallmarks, stacks, comparisons, guides], limit));
}

/** Next-best rail for a hallmark page (by hallmark id). */
export function getNextBestForHallmark(hallmarkId: string, limit = 6): NextBestItem[] {
  const compounds: NextBestItem[] = getCompoundsForHallmark(hallmarkId).map((c) => ({
    type: 'compound',
    slug: c.slug,
    href: `/library/compounds/${c.slug}`,
    title: c.name,
    meta: 'Compound',
    evidence: c.evidence,
  }));

  const stacks: NextBestItem[] = getStacksForHallmark(hallmarkId).map((s) => ({
    type: 'stack',
    slug: s.slug,
    href: buildStackHref(s.slug),
    title: s.name,
    meta: 'Elite Stack',
    evidence: s.evidence,
  }));

  return dedupe(interleave([compounds, stacks], limit));
}

/** Next-best rail for an Elite Stack (by slug) — its compounds and covered hallmarks. */
export function getNextBestForStack(stackSlug: string, limit = 6): NextBestItem[] {
  const stack = stackBySlug.get(stackSlug);
  if (!stack) return [];

  const compounds: NextBestItem[] = getCompoundsForStack(stackSlug).map((c) => ({
    type: 'compound',
    slug: c.slug,
    href: `/library/compounds/${c.slug}`,
    title: c.name,
    meta: 'Compound',
    evidence: c.evidence,
  }));

  const hallmarks: NextBestItem[] = stack.hallmarkCoverage
    .map((id) => hallmarkById.get(id))
    .filter((h): h is NonNullable<typeof h> => h !== undefined)
    .map((h) => ({
      type: 'hallmark' as const,
      slug: h.slug,
      href: `/library/${h.slug}`,
      title: h.title,
      meta: `Hallmark ${h.number}`,
    }));

  return dedupe(interleave([compounds, hallmarks], limit));
}

/**
 * Best-effort typing of a comparison's own authored `relatedHrefs` — used as a
 * fallback for comparisons whose two sides are stacks/synergies rather than
 * individual compounds (`compoundSlugsForComparison` only extracts compound
 * links by design), so those pages aren't dead ends. Generic tool links
 * ('/stacks', '/quiz', '/elite-8') are skipped — they're navigation, not a
 * graph entity.
 */
function fallbackFromRelatedHrefs(comp: { relatedHrefs: { label: string; href: string }[] }): NextBestItem[] {
  const items: NextBestItem[] = [];
  for (const { label, href } of comp.relatedHrefs) {
    const base = href.split('#')[0].split('?')[0];
    let match: RegExpMatchArray | null;
    if ((match = base.match(/^\/library\/synergies\/([a-z0-9-]+)$/))) {
      items.push({ type: 'stack', slug: match[1], href, title: label, meta: 'Synergy stack' });
    } else if ((match = base.match(/^\/library\/compare\/([a-z0-9-]+)$/))) {
      items.push({ type: 'comparison', slug: match[1], href, title: label, meta: 'Comparison' });
    } else if ((match = base.match(/^\/library\/guides\/([a-z0-9-]+)$/))) {
      items.push({ type: 'guide', slug: match[1], href, title: label, meta: 'Guide' });
    } else if ((match = base.match(/^\/library\/([a-z0-9-]+)$/)) && hallmarkSlugSet.has(match[1])) {
      items.push({ type: 'hallmark', slug: match[1], href, title: label, meta: 'Hallmark' });
    } else if ((match = href.match(/^\/stacks\?preset=([a-z0-9-]+)$/))) {
      items.push({ type: 'stack', slug: match[1], href, title: label, meta: 'Elite Stack' });
    }
    // Generic routes ('/stacks', '/quiz', '/elite-8', ...) intentionally skipped.
  }
  return items;
}

const hallmarkSlugSet = new Set(hallmarkLibrary.map((h) => h.slug));

/** Next-best rail for a comparison page (by slug) — its compounds and sibling comparisons. */
export function getNextBestForComparison(slug: string, limit = 6): NextBestItem[] {
  const comp = comparisonBySlug.get(slug);
  if (!comp) return [];

  const compounds: NextBestItem[] = getCompoundLinksForComparison(comp).map((c) => ({
    type: 'compound',
    slug: c.slug,
    href: `/library/compounds/${c.slug}`,
    title: c.name,
    meta: 'Compound',
    evidence: c.evidence,
  }));

  const siblings: NextBestItem[] = getRelatedComparisons(slug, limit).map((c) => ({
    type: 'comparison',
    slug: c.slug,
    href: `/library/compare/${c.slug}`,
    title: `${c.labelA} vs ${c.labelB}`,
    meta: 'Comparison',
    evidence: c.evidenceTier,
  }));

  const items = dedupe(interleave([compounds, siblings], limit));
  if (items.length > 0) return items;

  // Stack/synergy-category comparisons have no individual-compound signal —
  // fall back to the comparison's own authored relatedHrefs.
  return dedupe(fallbackFromRelatedHrefs(comp)).slice(0, limit);
}

/** Next-best rail for a supplement-guide landing page (by href) — its compounds. */
export function getNextBestForGuide(guideHref: string, limit = 6): NextBestItem[] {
  const compoundLinks = getCompoundsForGuide(guideHref);
  const compounds: NextBestItem[] = compoundLinks.map((c) => ({
    type: 'compound',
    slug: c.slug,
    href: `/library/compounds/${c.slug}`,
    title: c.name,
    meta: 'Compound',
    evidence: c.evidence,
  }));

  // Round out the rail with hallmarks + comparisons from the guide's own compounds.
  const hallmarks: NextBestItem[] = compoundLinks
    .flatMap((c) => getHallmarksForCompound(c.slug))
    .map((h) => ({
      type: 'hallmark' as const,
      slug: h.slug,
      href: `/library/${h.slug}`,
      title: h.title,
      meta: `Hallmark ${h.number}`,
    }));

  const comparisons: NextBestItem[] = compoundLinks
    .flatMap((c) => getComparisonsForCompound(c.slug))
    .map((c) => ({
      type: 'comparison' as const,
      slug: c.slug,
      href: `/library/compare/${c.slug}`,
      title: `${c.labelA} vs ${c.labelB}`,
      meta: 'Comparison',
      evidence: c.evidenceTier,
    }));

  return dedupe(interleave([compounds, hallmarks, comparisons], limit));
}
