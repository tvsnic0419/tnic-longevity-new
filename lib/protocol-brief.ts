import type { EvidenceTier } from './types';

export interface ProtocolBriefEntry {
  id: string;
  date: string;
  headline: string;
  summary: string;
  evidenceTier: EvidenceTier;
  pmids: string[];
  libraryHrefs: { label: string; href: string }[];
  takeaway: string;
  tags: string[];
}

/** Curated research drops — tied to library modules, not coupon marketing */
export const protocolBriefIssues: ProtocolBriefEntry[] = [
  {
    id: 'brief-2026-06-16-s6',
    date: '2026-06-16',
    headline: 'Sprint 6 ships: compare tables + buyer guides',
    summary:
      'Six evidence comparison routes (NMN vs NR, NRF2 vs Mito, and more) and brand-agnostic buyer guides now live on every compound module. Decision tools beat catalog browsing.',
    evidenceTier: 'A',
    pmids: ['36482258', '34129059'],
    libraryHrefs: [
      { label: 'Evidence comparisons', href: '/library/compare' },
      { label: 'NMN buyer guide', href: '/library/compounds/nmn#buyer-guide' },
      { label: 'Testing guide', href: '/library/guides/testing-and-monitoring' },
    ],
    takeaway: 'Before buying, run compare → buyer guide → labs baseline in that order.',
    tags: ['platform', 'library'],
  },
  {
    id: 'brief-2026-06-16-nmn',
    date: '2026-06-16',
    headline: 'NMN at 250 mg: human NAD+ restoration holds',
    summary:
      'Igarashi 2022 and Liao 2021 RCTs confirm 250 mg/day raises blood NAD+ metabolites with functional signals over 12 weeks. TNiC standardizes on this dose before titration.',
    evidenceTier: 'A',
    pmids: ['36482258', '33443990'],
    libraryHrefs: [
      { label: 'NMN deep dive', href: '/library/compounds/nmn' },
      { label: 'NMN vs NR compare', href: '/library/compare/nmn-vs-nr' },
      { label: 'NAD+ Mito Stack', href: '/library/synergies/nad-mito-stack' },
    ],
    takeaway: 'Retest NAD+ at week 4 — not week 12. Flat at 4 weeks → audit product COA first.',
    tags: ['nmn', 'nad+', 'clinical'],
  },
  {
    id: 'brief-2026-06-16-glynac',
    date: '2026-06-16',
    headline: 'GlyNAC 24-week data: GSH restoration is reproducible',
    summary:
      'Kumar trials show dual-precursor GlyNAC restores erythrocyte glutathione and improves mitochondrial markers in older adults. Liposomal GSH lacks equivalent longevity-trial depth.',
    evidenceTier: 'A',
    pmids: ['34129059', '36656670'],
    libraryHrefs: [
      { label: 'GlyNAC module', href: '/library/compounds/glynac' },
      { label: 'GlyNAC vs liposomal GSH', href: '/library/compare/glynac-vs-liposomal-glutathione' },
      { label: 'NRF2 Triad', href: '/library/synergies/glynac-nrf2-triad' },
    ],
    takeaway: 'Schedule week-12 and week-24 GSH draws — single baseline proves nothing.',
    tags: ['glynac', 'gsh', 'clinical'],
  },
  {
    id: 'brief-2026-06-16-sfn',
    date: '2026-06-16',
    headline: 'Sulforaphane: myrosinase is the product test',
    summary:
      'NRF2 activation requires glucoraphanin conversion via myrosinase. Broccoli powder without quantified GR + enzyme fails the buyer guide — regardless of marketing.',
    evidenceTier: 'A',
    pmids: ['18454171', '27356680'],
    libraryHrefs: [
      { label: 'Sulforaphane module', href: '/library/compounds/sulforaphane' },
      { label: 'SFN vs curcumin', href: '/library/compare/sulforaphane-vs-curcumin' },
      { label: 'Chronic inflammation hallmark', href: '/library/chronic-inflammation' },
    ],
    takeaway: 'Pair sulforaphane AM with GlyNAC — substrate before gene switch.',
    tags: ['sulforaphane', 'nrf2', 'buyer'],
  },
  {
    id: 'brief-2026-06-16-rapa',
    date: '2026-06-16',
    headline: 'Rapamycin: strongest mouse lifespan drug, zero DIY',
    summary:
      'Harrison 2009 and replications establish rapamycin as the top pharmacological lifespan extension in mice. Human use remains off-label Rx with immunosuppression monitoring — research chemicals are never acceptable.',
    evidenceTier: 'B',
    pmids: ['19587683', '25540326'],
    libraryHrefs: [
      { label: 'Rapamycin module', href: '/library/compounds/rapamycin' },
      { label: 'Disabled autophagy hallmark', href: '/library/disabled-autophagy' },
      { label: 'Trust disclaimers', href: '/trust/disclaimers' },
    ],
    takeaway: 'OTC stacks complement — never substitute — physician-managed rapamycin.',
    tags: ['rapamycin', 'rx', 'autophagy'],
  },
  {
    id: 'brief-2026-06-16-hallmarks',
    date: '2026-06-16',
    headline: '12/12 hallmarks elevated — pick biology first',
    summary:
      'All hallmark MDX modules now at template standard with decision trees, compare blocks, and monitoring tie-ins. Homepage tiles route symptoms to mechanisms.',
    evidenceTier: 'A',
    pmids: ['23746838'],
    libraryHrefs: [
      { label: 'Hallmark targets (home)', href: '/#hallmark-targets' },
      { label: 'Full library', href: '/library' },
      { label: '3-Min Quiz', href: '/quiz' },
    ],
    takeaway: 'Start at the hallmark that matches your labs — not the supplement you saw advertised.',
    tags: ['hallmarks', 'library'],
  },
];

export function getLatestBriefs(limit = 6): ProtocolBriefEntry[] {
  return protocolBriefIssues.slice(0, limit);
}

export { getAllBriefIssues, getResearchBriefIssues } from './brief-research-sync';