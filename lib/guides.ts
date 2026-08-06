import { getCompoundSlugsForGuide } from './library-graph';

/**
 * Single source of truth for the supplement-guide landing pages. The compound
 * a guide covers is NOT re-declared here — it is derived by inverting the
 * `compoundGuides` map in library-graph.ts (via getCompoundSlugsForGuide), so
 * a guide's compound coverage can never drift from the cross-link graph the
 * compound deep-dives already use. This registry only adds presentation
 * metadata (label, one-line descriptor, evidence tier) and defines guide↔guide
 * sibling relationships for in-context cross-linking.
 */

export interface SupplementGuideMeta {
  /** Route, e.g. /nad-supplement-guide */
  href: string;
  /** Full guide title for cross-link cards. */
  label: string;
  /** One-line descriptor. */
  short: string;
  /** Headline evidence tier the guide leads with. */
  tier: 'A' | 'B';
  /** The master hub guide sits first and is offered as a sibling everywhere. */
  isMaster?: boolean;
}

export const SUPPLEMENT_GUIDES: SupplementGuideMeta[] = [
  {
    href: '/longevity-supplements-guide',
    label: 'Best Longevity Supplements 2026',
    short: 'The complete ranked guide to evidence-backed longevity compounds',
    tier: 'A',
    isMaster: true,
  },
  {
    href: '/nad-supplement-guide',
    label: 'NAD+ Supplement Guide',
    short: 'NMN vs NR, precursor hierarchy, and the NAD+ decline curve',
    tier: 'B',
  },
  {
    href: '/glynac-supplement-guide',
    label: 'GlyNAC Supplement Guide',
    short: '9 hallmarks of aging reversed in a 24-week human RCT',
    tier: 'A',
  },
  {
    href: '/berberine-supplement-guide',
    label: 'Berberine Guide',
    short: 'AMPK activation, metabolic evidence, and an honest semaglutide comparison',
    tier: 'B',
  },
  {
    href: '/taurine-supplement-guide',
    label: 'Taurine Longevity Guide',
    short: '80% decline by age 60 and 10–12% lifespan extension in mammals',
    tier: 'B',
  },
  {
    href: '/sulforaphane-supplement-guide',
    label: 'Sulforaphane & NRF2 Guide',
    short: 'Broccoli-sprout extract, form selection, and the Keap1–NRF2 mechanism',
    tier: 'B',
  },
  {
    href: '/spermidine-supplement-guide',
    label: 'Spermidine Guide',
    short: '~10% ITP lifespan extension and autophagy induction',
    tier: 'B',
  },
];

export function getGuideMeta(href: string): SupplementGuideMeta | undefined {
  return SUPPLEMENT_GUIDES.find((g) => g.href === href);
}

/**
 * Sibling guides to surface on a guide page: the master hub first (unless it is
 * the current page), then the other guides in registry order. Excludes the
 * current guide so a page never links to itself.
 */
export function getSiblingGuides(currentHref: string, limit = 4): SupplementGuideMeta[] {
  const others = SUPPLEMENT_GUIDES.filter((g) => g.href !== currentHref);
  const master = others.filter((g) => g.isMaster);
  const rest = others.filter((g) => !g.isMaster);
  return [...master, ...rest].slice(0, limit);
}

/** Re-export so callers have one import for guide relationships. */
export { getCompoundSlugsForGuide };
