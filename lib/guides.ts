import type { ThemeAccent } from './design-system';
import { getCompoundSlugsForGuide, getHallmarksForGuide } from './library-graph';

/**
 * Single source of truth for the supplement-guide landing pages. The compound a
 * guide covers is NOT re-declared here — it is derived by inverting the
 * `compoundGuides` map in library-graph.ts (getCompoundSlugsForGuide), and the
 * hallmarks it targets are derived from those compounds (getHallmarksForGuide),
 * so a guide's graph relationships can never drift from the links the compound
 * deep-dives already use. This registry owns the presentation facts (label,
 * descriptor, tier, accent, badge, quick-fact pills, blurb) that the guides
 * index, the in-context cross-links, and the coverage guard all read from.
 */

export interface SupplementGuideMeta {
  /** Route, e.g. /nad-supplement-guide */
  href: string;
  /** Full guide title. */
  label: string;
  /** One-line subtitle. */
  short: string;
  /** Longer blurb for the index card. */
  description: string;
  /** Headline evidence tier the guide leads with. */
  tier: 'A' | 'B';
  /** Brand accent used for the card treatment. */
  accent: ThemeAccent;
  /** Small eyebrow badge, e.g. "Landmark RCT". */
  badge: string;
  /** Three quick-fact chips. */
  pills: string[];
  /** The master hub guide sits first and is offered as a sibling everywhere. */
  isMaster?: boolean;
}

// Copy is relocated verbatim from the former inline array on
// app/supplement-guides/page.tsx (same cited figures as the guide pages
// themselves) — this is a consolidation, not a rewrite, so nothing drifts.
export const SUPPLEMENT_GUIDES: SupplementGuideMeta[] = [
  {
    href: '/longevity-supplements-guide',
    label: 'Best Longevity Supplements 2026',
    short: 'The complete ranked guide to evidence-backed longevity compounds',
    description:
      'Start here. Our master guide ranks 12+ compounds by evidence quality, covers the Hallmarks of Aging framework, explains synergy principles, and includes honest cautions. Built on 50+ PubMed citations.',
    tier: 'A',
    accent: 'cyan',
    badge: 'Master Guide',
    pills: ['12+ compounds', 'Tier A–D ranking', '50+ citations'],
    isMaster: true,
  },
  {
    href: '/nad-supplement-guide',
    label: 'NAD+ Supplement Guide',
    short: 'NMN vs NR, precursor hierarchy, and the NAD+ decline curve',
    description:
      'NAD+ declines 50% by age 60. This guide compares NMN, NR, and niacin riboside as precursors — covering bioavailability data, optimal dosing windows, and why the form you choose matters for tissue distribution.',
    tier: 'B',
    accent: 'violet',
    badge: 'High Interest',
    pills: ['NMN vs NR vs Niacin', '50% decline by 60', 'Dosing by age'],
  },
  {
    href: '/glynac-supplement-guide',
    label: 'GlyNAC Supplement Guide',
    short: '9 hallmarks of aging reversed in a 24-week human RCT',
    description:
      'Sekhar et al. 2021 found GlyNAC (glycine + NAC) reversed 9 of the 12 hallmarks of aging in older adults — including a 94.6% increase in glutathione and 3.7-year epigenetic age reversal. This guide covers the evidence and the protocol.',
    tier: 'A',
    accent: 'emerald',
    badge: 'Landmark RCT',
    pills: ['Sekhar 2021 RCT', '9 hallmarks reversed', 'GSH +94.6%'],
  },
  {
    href: '/berberine-supplement-guide',
    label: 'Berberine Guide',
    short: 'AMPK activation, metabolic evidence, and honest semaglutide comparison',
    description:
      "Berberine activates AMPK — the cell's master energy switch — with meta-analytic evidence for HbA1c reduction (−0.72%) and LDL lowering (−0.65 mmol/L). A rigorous 7-row honest comparison with semaglutide tells you what it can and cannot do.",
    tier: 'B',
    accent: 'rose',
    badge: "Nature's Ozempic?",
    pills: ['AMPK activation', 'HbA1c −0.72%', 'vs Semaglutide'],
  },
  {
    href: '/taurine-supplement-guide',
    label: 'Taurine Longevity Guide',
    short: '80% decline by age 60 and 10–12% lifespan extension in mammals',
    description:
      'The landmark Singh et al. 2023 Science paper found taurine declines 80% by age 60 and that supplementation extended lifespan 10–12% in worms and mice, plus reversed epigenetic age in monkeys. Covers 5 longevity mechanisms and dosing protocol.',
    tier: 'B',
    accent: 'amber',
    badge: 'Science 2023',
    pills: ['Singh 2023 Science', '80% decline by 60', '+10–12% lifespan'],
  },
  {
    href: '/sulforaphane-supplement-guide',
    label: 'Sulforaphane & NRF2 Guide',
    short: 'Broccoli sprout extract, form selection, and Keap1-NRF2 mechanism',
    description:
      'Sulforaphane from broccoli sprouts alkylates Keap1 cysteine residues, releasing NRF2 to upregulate 200+ cytoprotective genes. Covers human trial data (H. pylori, NAFLD, ASD, air pollution), form hierarchy, and the NRF2 Triad stack.',
    tier: 'B',
    accent: 'cyan',
    badge: 'NRF2 Activator',
    pills: ['200+ NRF2 genes', '4 human trials', 'Form hierarchy'],
  },
  {
    href: '/spermidine-supplement-guide',
    label: 'Spermidine Guide',
    short: '~10% ITP lifespan extension and 40% cardiovascular mortality reduction',
    description:
      'Spermidine is one of the few OTC longevity compounds with NIA Interventions Testing Program lifespan data (~10% in female mice). The Kiechl 2018 20-year cohort found a 40% reduction in cardiovascular mortality in the highest dietary spermidine tertile. Covers EP300 inhibition mechanism, dosing, and the autophagy triad.',
    tier: 'B',
    accent: 'emerald',
    badge: 'ITP Mouse Data',
    pills: ['ITP mouse data', 'Kiechl 2018 cohort', 'EP300 inhibition'],
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
export { getCompoundSlugsForGuide, getHallmarksForGuide };
