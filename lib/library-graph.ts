import { libraryModules, type LibraryModule } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { eliteStacks } from './stacks-library';
import type { EvidenceTier, StackGoal } from './types';

/**
 * Cross-type interlinking for the library. Derives relationships between
 * hallmarks, compounds, stacks, and the supplement-guide landing pages from
 * existing structured data so every content node links to its neighbours.
 * Shapes are kept small and serializable so server components can pass them
 * to client components without pulling heavy datasets into the client bundle.
 *
 * Every `CompoundLink` here is resolved from the compound's own **library
 * module** (`title`, `evidenceTier`) rather than the separate Stack Architect
 * catalog (`lib/data.ts`). A handful of real compound pages — NR, Rapamycin,
 * TUDCA, Grape Seed — are documentation-only and were never added to that
 * catalog, so resolving through it silently dropped them from every
 * hallmark/stack/guide/comparison link. Resolving from the module instead
 * means "this page exists" is the only requirement for an entity to appear in
 * the graph.
 *
 * This module + `comparison-relations.ts` together form the site's interlink
 * graph: hallmark ↔ compound ↔ comparison ↔ stack ↔ guide. Every function
 * here only returns slugs/hrefs that resolve to a real page — guarded by
 * `library-graph.test.ts`.
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

export interface HallmarkLink {
  /** Hallmark slug — resolves to /library/<slug>. */
  slug: string;
  title: string;
  number: number;
}

export interface StackLink {
  /** Elite stack slug — resolves to /stacks?preset=<slug>. */
  slug: string;
  name: string;
  goal: StackGoal;
  evidence: EvidenceTier;
}

const compoundModules = libraryModules.filter((m) => m.category === 'compounds');

function toCompoundLink(m: LibraryModule): CompoundLink {
  return { slug: m.slug, name: m.title, evidence: m.evidenceTier };
}

// compound id -> compound module, for compounds that have a page and declare
// a compoundId (links them to the separate Stack Architect catalog).
const moduleByCompoundId = new Map<string, LibraryModule>();
for (const m of compoundModules) {
  if (m.compoundId) moduleByCompoundId.set(m.compoundId, m);
}

/**
 * Compounds that target a given hallmark (by hallmark id, e.g. 'mito'), via
 * each compound module's authored `relatedHallmarkIds`. Strongest evidence
 * first.
 */
export function getCompoundsForHallmark(hallmarkId: string): CompoundLink[] {
  return compoundModules
    .filter((m) => m.relatedHallmarkIds.includes(hallmarkId))
    .map(toCompoundLink)
    .sort((a, b) => a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name));
}

// hallmark id -> hallmark, for resolving a compound's hallmark ids to real links.
const hallmarkById = new Map(hallmarkLibrary.map((h) => [h.id, h]));

/**
 * Hallmarks a compound (by module slug) targets — the reverse of
 * `getCompoundsForHallmark`. Ordered by hallmark number.
 */
export function getHallmarksForCompound(moduleSlug: string): HallmarkLink[] {
  const mod = compoundModules.find((m) => m.slug === moduleSlug);
  if (!mod) return [];
  return mod.relatedHallmarkIds
    .map((id) => hallmarkById.get(id))
    .filter((h): h is NonNullable<typeof h> => h !== undefined)
    .map((h) => ({ slug: h.slug, title: h.title, number: h.number }))
    .sort((a, b) => a.number - b.number);
}

function toStackLink(s: (typeof eliteStacks)[number]): StackLink {
  return { slug: s.slug, name: s.name, goal: s.goal, evidence: s.evidenceTier };
}

/**
 * Elite Stacks (by slug) that touch a given hallmark id, via their authored
 * `hallmarkCoverage`. Strongest evidence first.
 */
export function getStacksForHallmark(hallmarkId: string): StackLink[] {
  return eliteStacks
    .filter((s) => s.hallmarkCoverage.includes(hallmarkId))
    .map(toStackLink)
    .sort((a, b) => a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name));
}

/**
 * Elite Stacks (by slug) that include a given compound (by module slug). These
 * link to /stacks?preset=<slug> — a real, resolvable Stack Architect deep link.
 */
export function getStacksForCompound(moduleSlug: string): StackLink[] {
  const mod = compoundModules.find((m) => m.slug === moduleSlug);
  if (!mod?.compoundId) return [];
  return eliteStacks
    .filter((s) => s.compoundIds.includes(mod.compoundId!))
    .map(toStackLink)
    .sort((a, b) => a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name));
}

/**
 * Compounds (with library pages) that make up a given Elite Stack — the
 * reverse of `getStacksForCompound`. Only compounds with a real module page
 * are returned so every rendered link resolves.
 */
export function getCompoundsForStack(stackSlug: string): CompoundLink[] {
  const stack = eliteStacks.find((s) => s.slug === stackSlug);
  if (!stack) return [];
  return stack.compoundIds
    .map((id) => moduleByCompoundId.get(id))
    .filter((m): m is LibraryModule => m !== undefined)
    .map(toCompoundLink);
}

/** Build the `/stacks?preset=<slug>` deep link for an Elite Stack. */
export function buildStackHref(stackSlug: string): string {
  return `/stacks?preset=${stackSlug}`;
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
 * Compounds (with library pages) covered by a given supplement-guide href —
 * the reverse of `getGuideForCompound`. Several compound slugs can map to the
 * same guide (e.g. nmn + nr → /nad-supplement-guide), so every guide page can
 * link back to all of its compounds, not just the one that sent the visitor.
 */
export function getCompoundsForGuide(guideHref: string): CompoundLink[] {
  return Object.entries(compoundGuides)
    .filter(([, guide]) => guide.href === guideHref)
    .map(([moduleSlug]) => compoundModules.find((m) => m.slug === moduleSlug))
    .filter((m): m is LibraryModule => m !== undefined)
    .map(toCompoundLink);
}

/**
 * Map of compound id -> compound module slug for every compound that has a
 * page and declares a compoundId. Lets a server component hand client
 * components the data to build correct `/library/compounds/<slug>` links
 * without importing the module dataset into the client bundle.
 */
export function getCompoundIdToSlugMap(): Record<string, string> {
  return Object.fromEntries([...moduleByCompoundId].map(([id, m]) => [id, m.slug]));
}

/** All distinct guide routes referenced by the compound → guide map. */
export function getMappedGuideHrefs(): string[] {
  return [...new Set(Object.values(compoundGuides).map((g) => g.href))];
}
