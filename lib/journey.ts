import type { JourneyMilestone } from './types';

/** TNiC founder/platform journey — N=1 labeled */
export const journeyMilestones: JourneyMilestone[] = [
  {
    date: '2024 Q1',
    title: 'Health Reset Trigger',
    type: 'personal',
    desc: 'Recovering from burnout and metabolic decline. Started tracking sleep, hs-CRP, and subjective energy daily.',
    metric: null,
    personal: true,
  },
  {
    date: '2024 Q3',
    title: 'GlyNAC Protocol Begins',
    type: 'experiment',
    desc: 'N=1 trial: 600mg glycine + 600mg NAC daily. Targeting glutathione restoration based on Kumar et al. human trials.',
    metric: 'Subjective recovery improved',
    evidenceTier: 'A',
    citationIds: ['c-glynac-2023'],
    personal: true,
  },
  {
    date: '2025 Q1',
    title: 'NRF2 Stack Formalized',
    type: 'protocol',
    desc: 'Added sulforaphane + R-ALA. Built first synergy matrix mapping compounds to hallmarks of aging.',
    metric: '3-compound NRF2 stack',
    evidenceTier: 'A',
    citationIds: ['c-sf-2008'],
    personal: true,
  },
  {
    date: '2025 Q3',
    title: 'Mitochondrial Layer Added',
    type: 'experiment',
    desc: 'Introduced NMN + Ca-AKG after baseline labs. NAD+ pathway prioritized based on age-related decline data.',
    metric: 'NAD+ precursor stack',
    evidenceTier: 'A',
    citationIds: ['c-nmn-2022', 'c-akg-2020'],
    personal: true,
  },
  {
    date: '2026 Q1',
    title: 'Hallmarks Framework Mapped',
    type: 'platform',
    desc: 'Integrated López-Otín hallmarks as the organizing taxonomy for all TNiC content and compound mapping.',
    metric: '12 hallmarks · 6 compounds',
    evidenceTier: 'A',
    citationIds: ['c-hallmarks-2013'],
    personal: false,
  },
  {
    date: '2026 Q2',
    title: 'TNiC Platform Launch',
    type: 'platform',
    desc: 'Opened tools publicly: Stack Architect, Bio Age calculator, biomarker projections. Radical transparency — modeled vs. lab data always labeled.',
    metric: 'tnic.help live',
    personal: false,
  },
  {
    date: '2026 Q2',
    title: 'Trust & Transparency Hub',
    type: 'platform',
    desc: 'Published evidence tagging system, citation framework, methodology, disclaimers, and public update history.',
    metric: '/trust hub live',
    personal: false,
  },
  {
    date: '2026 Q2',
    title: 'Elite 8 + Tier B Expansion',
    type: 'platform',
    desc: 'Longevity Quotient ranking tool at /elite-8; Taurine, Spermidine, and Pterostilbene added as Tier B library compounds with full safety profiles.',
    metric: '9 compounds · /elite-8 live',
    personal: false,
  },
];

/** Template steps for user's personal longevity journey */
export const personalJourneyTemplate = [
  { step: 1, title: 'Baseline Assessment', desc: 'Run Defense Scan. Note age, stress, sleep, exercise. Optional: order baseline labs (CBC, metabolic panel, hs-CRP).', link: '#calculator' },
  { step: 2, title: 'Learn the Framework', desc: 'Review the 12 Hallmarks. Understand which pathways matter most for your profile.', link: '/library' },
  { step: 3, title: 'Start Foundation Stack', desc: 'Begin with Starter Elite or GlyNAC Foundation. Add one compound per week.', link: '/stacks' },
  { step: 4, title: 'Log Your Labs', desc: 'Enter blood panel results in the Lab Hub. Track trends over 12–24 weeks.', link: '/labs' },
  { step: 5, title: 'Review & Iterate', desc: 'Re-scan at 90 days. Adjust stack based on lab trends and hallmark risk insights.', link: '/trust/journey' },
];

export const starterStack = {
  name: 'TNiC Starter Defense Stack',
  subtitle: 'Evidence-graded entry protocol for adults 35+',
  compounds: [
    { id: 'glynac', name: 'GlyNAC ET', dose: '600mg glycine + 600mg NAC', timing: 'AM', tier: 'A' as const, why: 'Restores glutathione — depleted 10–15% per decade' },
    { id: 'sulforaphane', name: 'Sulforaphane', dose: '10–35mg glucoraphanin', timing: 'AM', tier: 'A' as const, why: 'Activates NRF2 — master antioxidant gene switch' },
    { id: 'nmn', name: 'NMN', dose: '250–500mg', timing: 'AM', tier: 'A' as const, why: 'Replenishes NAD+ — declines ~50% by age 60' },
  ],
  disclaimer: 'Educational template only. Consult your physician. Adjust based on your labs, medications, and tolerance.',
};