import { compoundEntity, hallmarkEntity, pathwayEntity, type GraphEntity } from './entity-graph';

/**
 * Contextual next-steps for pages the entity graph cannot reach.
 *
 * `entity-graph.ts` covers anything with a registry behind it — a compound, a
 * hallmark, a pathway. What it cannot cover is the rest of the site: the trust
 * and editorial pages, and the tool pages whose whole body is a client island.
 * A route audit found 21 routes carrying under three in-body links, several of
 * them substantial: /trust/methodology explained the evidence grading across
 * 4,860 characters and linked to nothing, /trust/updates ran to 14,367
 * characters with two links, and /nico, /bio-age and /tools/pathway-architect
 * server-rendered no in-body links at all because their content hydrates.
 *
 * The brief for this is "contextual, not comprehensive": a page gets the two
 * or three places a reader of THAT page would actually want next, not a
 * sitemap. So connections are declared per cluster rather than generated —
 * a generated "related pages" block is exactly the random-links-everywhere
 * failure mode — but the SIBLINGS within a cluster are derived, so adding a
 * page to a cluster links it from every other member automatically and no
 * member can fall out of date.
 *
 * Nothing here is a claim about content. Every entry is a route that exists
 * (asserted by `audit-routes.mjs`, which resolves every internal link target)
 * and a label describing what is at the other end.
 */

export interface PageLink {
  href: string;
  label: string;
  /** Why a reader of this page would want that page. One short clause. */
  detail: string;
}

export interface PageCluster {
  /** Heading for the rail. */
  title: string;
  /** One line framing the group. */
  intro: string;
  members: PageLink[];
}

/**
 * The trust cluster. These pages genuinely belong together: a reader checking
 * how evidence is graded is the same reader who wants to know what the site
 * refuses to claim, how sponsorship is walled off, and what it got wrong.
 * Every one of them was a near-dead-end before this.
 */
const TRUST_CLUSTER: PageLink[] = [
  { href: '/trust', label: 'Trust & transparency', detail: 'How the whole system is held accountable' },
  { href: '/trust/methodology', label: 'Grading methodology', detail: 'What Tier A, B and C each require' },
  { href: '/trust/disclaimers', label: 'Disclaimers', detail: 'What this site does not claim' },
  { href: '/trust/sponsorship', label: 'Sponsorship principles', detail: 'How commercial interest is walled off' },
  { href: '/trust/updates', label: 'Update log', detail: 'What changed, and when' },
  { href: '/editorial-policy', label: 'Editorial policy', detail: 'Who writes this and to what standard' },
  { href: '/corrections', label: 'Corrections', detail: 'Errors found, and how they were fixed' },
  { href: '/library/evidence', label: 'The evidence table', detail: 'Every graded compound, with its tier' },
];

/** The legal/data cluster — adjacent to trust, but a different question. */
const POLICY_CLUSTER: PageLink[] = [
  { href: '/privacy', label: 'Privacy', detail: 'What is collected, and what is not' },
  { href: '/health-data', label: 'Health data', detail: 'Why lab data never leaves the browser' },
  { href: '/terms', label: 'Terms', detail: 'The terms of use' },
  { href: '/trust/disclaimers', label: 'Disclaimers', detail: 'What this site does not claim' },
];

/** The about/contact cluster — "who is behind this, and how do I reach them". */
const ABOUT_CLUSTER: PageLink[] = [
  { href: '/about', label: 'About & founder', detail: 'Who builds this and why' },
  { href: '/contact', label: 'Contact', detail: 'How to reach a person' },
  { href: '/partnerships', label: 'Partnerships', detail: 'What kind of work is taken on' },
  { href: '/editorial-policy', label: 'Editorial policy', detail: 'The standard the writing is held to' },
  { href: '/corrections', label: 'Corrections', detail: 'Errors found, and how they were fixed' },
];

/**
 * The explore cluster — the site's main evidence surfaces. Offered from the
 * tool pages, whose bodies are client islands: a reader who lands on the
 * questionnaire or the biological-age model from search sees a shell that
 * links nowhere until it hydrates, and a crawler never sees more than that.
 */
const EXPLORE_CLUSTER: PageLink[] = [
  { href: '/library', label: 'The compound library', detail: 'Every graded compound, by hallmark' },
  { href: '/library/evidence', label: 'The evidence table', detail: 'All of it as one sortable index' },
  { href: '/pathways', label: 'Pathways', detail: 'The mechanisms compounds act through' },
  { href: '/stacks', label: 'Stacks & protocols', detail: 'Published protocols with dosing' },
  { href: '/best', label: 'Best by goal', detail: 'Goal-led shortlists, without hype' },
  { href: '/trust/methodology', label: 'How this is graded', detail: 'What Tier A, B and C each require' },
];

const CLUSTERS = {
  explore: { title: 'Explore the evidence', intro: 'Where to go from here.', members: EXPLORE_CLUSTER },
  trust: { title: 'How to check this', intro: 'The rest of the accountability trail.', members: TRUST_CLUSTER },
  policy: { title: 'Your data, in full', intro: 'The other policies that govern this site.', members: POLICY_CLUSTER },
  about: { title: 'More about TNiC', intro: 'Who is behind this, and how it is held to a standard.', members: ABOUT_CLUSTER },
} satisfies Record<string, PageCluster>;

export type ClusterId = keyof typeof CLUSTERS;

/**
 * A cluster as seen from one of its members: the same group, minus the page
 * you are on. Self-exclusion is by href, so a page that is not a member gets
 * the whole cluster, which is the right behaviour for a page that links INTO
 * the cluster without belonging to it.
 */
export function clusterFrom(id: ClusterId, currentPath: string): PageCluster {
  const c = CLUSTERS[id];
  return { ...c, members: c.members.filter((m) => m.href !== currentPath) };
}

/**
 * Subject entities for the tool pages, whose bodies are client islands and so
 * server-render no links at all. Each list names what the tool is ABOUT,
 * resolved through the entity graph so an unresolvable id is dropped rather
 * than rendered as a broken link.
 */
export function toolSubjects(ids: {
  compounds?: string[];
  hallmarks?: string[];
  pathways?: string[];
}): { compounds: GraphEntity[]; hallmarks: GraphEntity[]; pathways: GraphEntity[] } {
  const pick = <T>(xs: (T | null)[]) => xs.filter((x): x is T => x !== null);
  return {
    compounds: pick((ids.compounds ?? []).map(compoundEntity)),
    hallmarks: pick((ids.hallmarks ?? []).map(hallmarkEntity)),
    pathways: pick((ids.pathways ?? []).map(pathwayEntity)),
  };
}
