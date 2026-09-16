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
 * Journey framing (audit 2026-09): four intent clusters — Start / Explore /
 * Decide / Verify — match the product story Newcomer → NICO → Library/Elite →
 * Stacks/Tools → Labs/Shop. Trust / policy / about remain accountability rails.
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
 * Start — newcomer onboarding path. Primary CTA language: Start with NICO /
 * Explore library. Used from home-adjacent and first-touch hubs.
 */
const START_CLUSTER: PageLink[] = [
  { href: '/nico', label: 'Start with NICO', detail: 'Nine questions → an adjustable, evidence-graded stack' },
  { href: '/library', label: 'Explore the library', detail: 'Every graded compound, by hallmark and tier' },
  { href: '/elite-8', label: 'Elite 8 rankings', detail: 'Dose-matched picks ranked by Longevity Quotient' },
  { href: '/learn', label: 'Learn hub', detail: 'Glossary, getting started, and safety red flags' },
  { href: '/hallmarks', label: '12 Hallmarks', detail: 'The molecular map every rational protocol is built on' },
  { href: '/dashboard', label: 'My Longevity OS', detail: 'Command center once you have a stack and labs' },
];

/**
 * Explore — evidence surfaces. Bidirectional with Decide/Verify so readers
 * never dead-end after finishing a deep-dive or tool shell.
 */
const EXPLORE_CLUSTER: PageLink[] = [
  { href: '/library', label: 'The compound library', detail: 'Every graded compound, by hallmark' },
  { href: '/library/evidence', label: 'The evidence table', detail: 'All of it as one sortable index' },
  { href: '/pathways', label: 'Pathways', detail: 'The mechanisms compounds act through' },
  { href: '/hallmarks', label: '12 Hallmarks', detail: 'Mechanism maps with PMID-cited interventions' },
  { href: '/elite-8', label: 'Elite 8', detail: 'Highest-evidence shortlist with LQ ranking' },
  { href: '/peptides', label: 'Peptide library', detail: 'Evidence tier and legal status, stated plainly' },
  { href: '/library/compare', label: 'Evidence comparisons', detail: 'Head-to-head tables with PMID anchors' },
  { href: '/insights', label: 'Insights', detail: 'Editorial deep-dives on longevity questions' },
  { href: '/best', label: 'Best by goal', detail: 'Goal-led shortlists, without hype' },
  { href: '/trust/methodology', label: 'How this is graded', detail: 'What Tier A, B and C each require' },
];

/**
 * Decide — builders and planners. Primary path after evidence review.
 */
const DECIDE_CLUSTER: PageLink[] = [
  { href: '/stacks', label: 'Stack Architect', detail: 'Presets, synergy scoring, and shareable stack URLs' },
  { href: '/protocols', label: 'Protocol library', detail: 'Choreographed stacks where each compound has a job' },
  { href: '/tools', label: 'Longevity tools', detail: 'Simulator, protocol engine, forecasts — rule-based' },
  { href: '/nico', label: 'Start with NICO', detail: 'Personalized starter stack from your answers' },
  { href: '/compound-engine', label: 'Compound Engine', detail: 'Score evidence, effect, breadth, and safety' },
  { href: '/stacks/lab', label: 'Combination Lab', detail: 'Marginal contribution and explainable stack scoring' },
  { href: '/elite-8', label: 'Elite 8 LQ', detail: 'Compare interventions before you commit' },
  { href: '/bio-age', label: 'Biological age', detail: 'Educational bio-age gauge from lifestyle inputs' },
];

/**
 * Verify — labs, shop, products, trust. Closing the loop after a stack exists.
 */
const VERIFY_CLUSTER: PageLink[] = [
  { href: '/shop', label: 'Verify stack', detail: 'COA checklists filtered by your active stack' },
  { href: '/products', label: 'Verified products', detail: 'One dose-matched pick per graded compound' },
  { href: '/labs', label: 'Lab Hub', detail: 'Log biomarkers locally — supplements without labs is guessing' },
  { href: '/trust', label: 'Trust & transparency', detail: 'How grades, citations, and sponsorship are held accountable' },
  { href: '/trust/methodology', label: 'Grading methodology', detail: 'Tier criteria you can audit' },
  { href: '/dashboard', label: 'My Longevity OS', detail: 'Track stack status, labs, and next steps' },
  { href: '/brief', label: 'Protocol Brief', detail: 'PMID digest mapped to modules and stacks' },
];

/**
 * The trust cluster. These pages genuinely belong together: a reader checking
 * how evidence is graded is the same reader who wants to know what the site
 * refuses to claim, how sponsorship is walled off, and what it got wrong.
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
  { href: '/shop', label: 'Verify before you buy', detail: 'Buyer checklists — commission never moves a grade' },
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
  { href: '/trust', label: 'Trust hub', detail: 'Evidence grading and commercial boundaries' },
];

const CLUSTERS = {
  start: {
    title: 'Start here',
    intro: 'Newcomer path — questionnaire, library, then elite shortlist.',
    members: START_CLUSTER,
  },
  explore: {
    title: 'Explore the evidence',
    intro: 'Where to go from here.',
    members: EXPLORE_CLUSTER,
  },
  decide: {
    title: 'Decide & build',
    intro: 'Turn evidence into a stack you can inspect.',
    members: DECIDE_CLUSTER,
  },
  verify: {
    title: 'Verify & track',
    intro: 'Confirm the buy, log the labs, keep the trail honest.',
    members: VERIFY_CLUSTER,
  },
  trust: {
    title: 'How to check this',
    intro: 'The rest of the accountability trail.',
    members: TRUST_CLUSTER,
  },
  policy: {
    title: 'Your data, in full',
    intro: 'The other policies that govern this site.',
    members: POLICY_CLUSTER,
  },
  about: {
    title: 'More about TNiC',
    intro: 'Who is behind this, and how it is held to a standard.',
    members: ABOUT_CLUSTER,
  },
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

/** All cluster ids — used by integrity tests to pin the journey rails. */
export const PAGE_CONNECTION_CLUSTER_IDS = Object.keys(CLUSTERS) as ClusterId[];
