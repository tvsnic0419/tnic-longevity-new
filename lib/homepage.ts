import { stackPresets } from './presets';
import { researchFeed } from './data';
import { platformStats } from './platform-stats';

export const heroValueProps = [
  'Every compound rated Tier A, B, or C — from human trials, not marketing claims',
  '12 Hallmarks of Aging library — mechanism-mapped, PMID-cited, updated as trials publish',
  'Six local-first tools — biomarker forecasts, defense scan, stack simulator. No accounts, no paywall.',
];

export const quizSteps = [
  {
    id: 'goal',
    question: 'What brings you to TNiC today?',
    options: [
      { id: 'learn', label: 'Understand the science first', icon: 'book' as const },
      { id: 'defense', label: 'Strengthen antioxidant defenses', icon: 'shield' as const },
      { id: 'energy', label: 'Restore energy & NAD+', icon: 'zap' as const },
      { id: 'longevity', label: 'Target senescent cells & healthspan', icon: 'layers' as const },
      { id: 'metabolic', label: 'Improve metabolic & cardiovascular health', icon: 'shield' as const },
      { id: 'full', label: 'Build a complete protocol', icon: 'layers' as const },
    ],
  },
  {
    id: 'age',
    question: 'Your age range',
    options: [
      { id: '30-40', label: '30–40', desc: 'Prevention window' },
      { id: '41-50', label: '41–50', desc: 'Early decline signals' },
      { id: '51-60', label: '51–60', desc: 'Accelerated depletion' },
      { id: '60+', label: '60+', desc: 'Multi-pathway focus' },
    ],
  },
  {
    id: 'experience',
    question: 'Your supplement experience',
    options: [
      { id: 'new', label: 'Brand new', desc: 'Start with fundamentals' },
      { id: 'some', label: 'Some experience', desc: 'Ready to optimize' },
      { id: 'advanced', label: 'Advanced', desc: 'Compare & stack' },
    ],
  },
] as const;

export type QuizAnswers = {
  goal?: string;
  age?: string;
  experience?: string;
};

export function getQuizResult(answers: QuizAnswers) {
  const preset =
    answers.goal === 'energy' ? 'mito'
      : answers.goal === 'defense' ? 'nrf2'
        : answers.goal === 'longevity' ? 'longevity'
          : answers.goal === 'metabolic' ? 'metabolic'
            : answers.goal === 'full' ? 'hybrid'
              : 'starter';

  const paths = {
    learn: { title: 'Search the library', href: '/library', cta: 'Open Library' },
    defense: { title: 'Run your Defense Scan', href: '/tools?tab=healthspan', cta: 'Defense Scan' },
    energy: { title: 'Explore mitochondrial pathways', href: '/library?q=mitochondrial', cta: 'View Science' },
    longevity: { title: 'Open Longevity Pro in Stack Architect', href: '/stacks', cta: 'Open Stack Architect' },
    metabolic: { title: 'Open Cardio-Metabolic in Stack Architect', href: '/stacks', cta: 'Open Stack Architect' },
    full: { title: 'Open your Personal Dashboard', href: '/dashboard', cta: 'Go to Dashboard' },
  };

  const primary = paths[answers.goal as keyof typeof paths] ?? paths.learn;
  const stack = stackPresets[preset];

  const insight =
    answers.goal === 'learn'
      ? "Good starting point. TNiC maps every compound to a specific hallmark mechanism, evidence tier, and human trial before it enters the library — you'll know exactly what each one targets and why before you spend a dollar."
      : answers.goal === 'longevity'
        ? 'Your profile maps to Longevity Pro — urolithin A (Phase 2 mitophagy RCT), fisetin (Mayo Clinic senolytic pilot), and omega-3 (REDUCE-IT, SPM resolution axis). Targets the senescent cell accumulation and cellular cleanup hallmarks directly. Load it and adjust synergy scoring from there.'
        : answers.goal === 'metabolic'
          ? 'Your profile maps to Cardio-Metabolic — berberine (head-to-head vs metformin, PMID 18396172), omega-3 (REDUCE-IT 25% CV event reduction), and CoQ10 (17-RCT meta-analysis, hs-CRP reduction). AMPK, lipid, and ETC stack — Tier A across all three.'
          : answers.age === '60+'
            ? 'At 60+, NAD+ has typically fallen 40–60% from peak (Cell Metab, 2018). Dual-pathway coverage — NRF2 defense restoration plus mitochondrial substrate support — produces the highest modeled defense index at this stage. Your preset stacks both.'
            : answers.experience === 'new'
              ? 'Starting with GlyNAC is the evidence-first move: 24-week human trials showed restored glutathione, improved mitochondrial function, and reduced oxidative stress in older adults (J Gerontol A, 2023, PMID 36656670). Tier A for a reason.'
              : 'Your profile aligns with the Hybrid preset — 5 Tier-A/B compounds spanning NRF2 activation, mitochondrial substrate restoration, and sirtuin pathway support. The broadest evidence-graded coverage TNiC offers. Load it in Stack Architect and adjust synergy scoring from there.';

  return { preset, stack, primary, insight };
}

export const featuredStacks = (Object.keys(stackPresets) as (keyof typeof stackPresets)[]).map((key) => ({
  key,
  ...stackPresets[key],
  compoundCount: stackPresets[key].ids.length,
}));

export const latestResearch = researchFeed.slice(0, 3);

export const trustPillars = [
  {
    title: 'Human Trial–Graded',
    desc: 'GlyNAC, NMN, and Ca-AKG hold Tier A: randomized or controlled human trials with measured biomarker endpoints. R-ALA and Resveratrol hold Tier B: strong mechanism plus human pharmacokinetic data. No compound earns Tier A from mouse data alone.',
    href: '/trust/methodology',
  },
  {
    title: 'Model vs. Lab — Always Labeled',
    desc: 'Every biological age estimate and biomarker projection is explicitly marked as modeled — not a clinical diagnostic. Log real bloodwork in Lab Hub to compare your actual values against what the model predicts for your age and stack.',
    href: '/labs',
  },
  {
    title: 'Safety Before Stack',
    desc: 'Per-compound contraindications, a seven-point red-flag brand checklist, and physician-export protocols are built into every recommendation. Taking prescriptions? Export your stack PDF and review with your pharmacist before combining.',
    href: '/trust/disclaimers',
  },
  {
    title: 'No Pay-for-Placement',
    desc: "Brands cannot pay for inclusion, evidence tier upgrades, or Library positioning. Affiliate links are disclosed and never influence compound rankings, hallmark mapping, or research feed placement.",
    href: '/trust/methodology',
  },
];

export { platformStats };
