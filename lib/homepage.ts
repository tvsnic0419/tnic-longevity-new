import { stackPresets, type PresetKey } from './presets';
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

type QuizNextStep = { title: string; href: string; cta: string };

// The goal answer is the top-priority signal: it selects the mechanism family
// the recommended stack is built around. Age and experience refine it from there.
const GOAL_PRESET: Record<string, PresetKey> = {
  learn: 'starter',
  defense: 'nrf2',
  energy: 'mito',
  longevity: 'longevity',
  metabolic: 'metabolic',
  full: 'hybrid',
};

// The open-ended "build a complete protocol" goal scales its breadth to the
// user's experience, so a first-timer isn't handed 14 compounds and an advanced
// user isn't capped at five.
const FULL_GOAL_BY_EXPERIENCE: Record<string, PresetKey> = {
  new: 'starter',
  some: 'hybrid',
  advanced: 'full',
};

// Where each goal sends the user next, independent of which stack is loaded.
const GOAL_NEXT_STEP: Record<string, QuizNextStep> = {
  learn: { title: 'Search the library', href: '/library', cta: 'Open Library' },
  defense: { title: 'Run your Defense Scan', href: '/tools?tab=healthspan', cta: 'Defense Scan' },
  energy: { title: 'Explore mitochondrial pathways', href: '/library?q=mitochondrial', cta: 'View Science' },
  longevity: { title: 'Open Longevity Pro in Stack Architect', href: '/stacks', cta: 'Open Stack Architect' },
  metabolic: { title: 'Open Cardio-Metabolic in Stack Architect', href: '/stacks', cta: 'Open Stack Architect' },
  full: { title: 'Open your Personal Dashboard', href: '/dashboard', cta: 'Go to Dashboard' },
};

// One lead sentence per preset. Each names the compounds actually in that stack,
// so the insight can never describe a protocol the user wasn't given.
const PRESET_INSIGHT: Record<PresetKey, string> = {
  starter:
    'Your Foundation stack leads with GlyNAC, sulforaphane, and NMN — Tier-A glutathione, NRF2, and NAD+ support in the three most-studied entry compounds.',
  nrf2:
    "Your NRF2 Defense stack — GlyNAC, sulforaphane, and R-ALA — activates the body's master antioxidant switch and rebuilds glutathione, the core of oxidative-stress defense.",
  mito:
    'Your Mitochondrial stack — NMN, Ca-AKG, and resveratrol — rebuilds NAD+ and drives sirtuin signaling, the energy-production and cellular-repair axis.',
  longevity:
    'Your Longevity Pro stack centers on urolithin A (Phase 2 mitophagy RCT) and fisetin (Mayo Clinic senolytic pilot), with omega-3, NMN, and resveratrol — aimed squarely at senescent-cell clearance and mitochondrial cleanup.',
  metabolic:
    'Your Cardio-Metabolic stack — berberine (head-to-head vs metformin, PMID 18396172), omega-3 (REDUCE-IT), CoQ10, and R-ALA — stacks AMPK, lipid, and ETC support, Tier A across the board.',
  hybrid:
    'Your Full Hybrid stack spans GlyNAC, sulforaphane, NMN, Ca-AKG, and R-ALA — NRF2 activation, mitochondrial substrate restoration, and glutathione support in the broadest five-compound protocol TNiC offers.',
  full:
    'Your Full-Spectrum protocol loads all 14 evidence-graded compounds across every mechanism family — NRF2, NAD+, senolytic, and cardio-metabolic — built for side-by-side comparison and synergy tuning.',
};

// A closing sentence tuned to the remaining answers (stated goal, then age, then
// experience) so both the stack and the guidance reflect everything the user told us.
function personalizationNote(answers: QuizAnswers): string {
  if (answers.goal === 'learn') {
    return 'Since you came to understand the science first, open the Library alongside it — every compound is mapped to a hallmark mechanism, evidence tier, and human trial before it reaches your stack.';
  }
  if (answers.age === '60+') {
    return 'At 60+, NAD+ has typically fallen 40–60% from peak (Cell Metab, 2018), so lead with the NAD+ and mitochondrial elements and layer the rest in over your first month.';
  }
  if (answers.age === '51-60') {
    return 'In your 50s, antioxidant reserve and NAD+ decline accelerate — this stack front-loads the pathways under the most pressure now.';
  }
  if (answers.experience === 'new') {
    return 'As a first protocol, phase these in one at a time over two to three weeks and log how you respond before adding the next.';
  }
  if (answers.experience === 'advanced') {
    return 'You know the terrain — load it in Stack Architect and tune the synergy scoring and dosing from there.';
  }
  return 'Load it in Stack Architect to check the synergy score, then adjust dosing to fit your routine.';
}

/**
 * Resolve the stack preset for a set of quiz answers. Goal is the primary driver;
 * the "complete protocol" goal additionally scales with experience. Exported so
 * the live preview and the final result share a single source of truth.
 */
export function getQuizPreset(answers: QuizAnswers): PresetKey {
  if (answers.goal === 'full') {
    return FULL_GOAL_BY_EXPERIENCE[answers.experience ?? ''] ?? 'hybrid';
  }
  return GOAL_PRESET[answers.goal ?? ''] ?? 'starter';
}

export function getQuizResult(answers: QuizAnswers) {
  const preset = getQuizPreset(answers);
  const stack = stackPresets[preset];
  const primary = GOAL_NEXT_STEP[answers.goal ?? ''] ?? GOAL_NEXT_STEP.learn;
  const insight = `${PRESET_INSIGHT[preset]} ${personalizationNote(answers)}`;

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
