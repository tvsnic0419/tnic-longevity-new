import { stackPresets } from './presets';
import { researchFeed } from './data';

/**
 * The questionnaire engine moved to `lib/questionnaire.ts` when the three-question
 * quiz grew into the nine-question NICO Starter Questionnaire (steps, lifestyle
 * burden scoring, and the curated-data safety screen all live there now).
 *
 * These re-exports keep the original import paths working for the surfaces that
 * only need the preset/insight shape — the live in-flow preview and the share-card
 * builders. New code should import from `./questionnaire` directly.
 */
export {
  quizSteps,
  getQuizPreset,
  getQuizResult,
  type QuizAnswers,
} from './questionnaire';

export const heroValueProps = [
  'Every compound rated Tier A, B, or C — from human trials, not marketing claims',
  '12 Hallmarks of Aging library — mechanism-mapped, PMID-cited, updated as trials publish',
  'Six local-first tools — biomarker forecasts, defense scan, stack simulator. No accounts, no paywall.',
];

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
