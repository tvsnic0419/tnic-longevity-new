import { stackPresets, type PresetKey } from './presets';
import { researchFeed, compounds } from './data';
import { platformStats } from './platform-stats';
import { analyzeStack, hallmarkDisplayNames } from './stack-analysis';

export const heroValueProps = [
  'Every compound rated Tier A, B, or C — from human trials, not marketing claims',
  '12 Hallmarks of Aging library — mechanism-mapped, PMID-cited, updated as trials publish',
  'Six local-first tools — biomarker forecasts, defense scan, stack simulator. No accounts, no paywall.',
];

export const quizSteps = [
  {
    id: 'goal',
    question: 'What brings you to TNiC today?',
    multi: false,
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
    id: 'concern',
    question: "What's bothering you most right now?",
    multi: false,
    options: [
      { id: 'mito', label: 'Low energy / fatigue', desc: 'Mitochondrial & NAD+ decline' },
      { id: 'inflammation', label: 'Brain fog or slow recovery', desc: 'Chronic inflammation' },
      { id: 'senescence', label: 'Feeling older than my age', desc: 'Cellular senescence' },
      { id: 'nutrient', label: 'Metabolic or blood-sugar sluggishness', desc: 'Nutrient-sensing pathways' },
      { id: 'none', label: 'Nothing specific — being proactive', desc: 'No particular symptom' },
    ],
  },
  {
    id: 'age',
    question: 'Your age range',
    multi: false,
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
    multi: false,
    options: [
      { id: 'new', label: 'Brand new', desc: 'Start with fundamentals' },
      { id: 'some', label: 'Some experience', desc: 'Ready to optimize' },
      { id: 'advanced', label: 'Advanced', desc: 'Compare & stack' },
    ],
  },
  {
    id: 'budget',
    question: 'Monthly budget for this stack',
    multi: false,
    options: [
      { id: 'under50', label: 'Under $50/month', desc: 'Start lean' },
      { id: '50to150', label: '$50–150/month', desc: 'Most popular range' },
      { id: 'over150', label: '$150+/month', desc: 'Maximum coverage' },
    ],
  },
  {
    id: 'safety',
    question: 'Any of these apply to you?',
    multi: true,
    options: [
      { id: 'pregnant', label: 'Pregnant or nursing' },
      { id: 'bloodThinners', label: 'Taking blood thinners' },
      { id: 'diabetesMeds', label: 'Diabetes medication' },
      { id: 'kidney', label: 'Kidney disease' },
      { id: 'thyroid', label: 'Thyroid condition' },
      { id: 'chemo', label: 'Active chemotherapy' },
      { id: 'none', label: 'None of these apply' },
    ],
  },
] as const;

export type QuizAnswers = {
  goal?: string;
  /** Hallmark id the user says bothers them most, or 'none' — see CONCERN_HALLMARK. */
  concern?: string;
  age?: string;
  experience?: string;
  budget?: string;
  /** Multi-select; ['none'] or omitted means no flags raised. */
  safety?: string[];
};

type QuizNextStep = { title: string; href: string; cta: string };

// The goal answer picks the mechanism family — this is the base/anchor preset
// for that goal before age or experience are taken into account.
const GOAL_PRESET: Record<string, PresetKey> = {
  learn: 'starter',
  defense: 'nrf2',
  energy: 'mito',
  longevity: 'longevity',
  metabolic: 'metabolic',
};

/**
 * A goal's upgrade path beyond its base preset: one rung (only the strongest
 * combined signal unlocks it — no gentle mid-tier exists) or two (a softer
 * rung, then the strongest). resolveRung()'s indexing only holds for exactly
 * these two shapes; capping the type here means extending a goal to a third
 * rung is a compile error, not a silent misresolution.
 */
type UpgradeRungs = readonly [PresetKey] | readonly [PresetKey, PresetKey];

// Goals that can broaden beyond their base preset once experience + age signal
// the user is ready for more. Listed weakest→strongest rung. 'hybrid' is a
// strict superset of the NRF2 and NAD+ families; 'full' is a strict superset
// of every preset — so broadening never drops a compound the stated goal
// promised. 'learn' has no ladder: it's about understanding fundamentals
// first, not maximizing stack size, so it always stays on 'starter'.
const GOAL_UPGRADE_RUNGS: Partial<Record<string, UpgradeRungs>> = {
  defense: ['hybrid', 'full'],
  energy: ['hybrid', 'full'],
  metabolic: ['full'],
  longevity: ['full'],
};

/** '51-60' and '60+' are where the quiz's own copy says decline accelerates. */
function isAcceleratedAge(age?: string): boolean {
  return age === '51-60' || age === '60+';
}

/** Concern option id -> the real hallmark id it names (see lib/data.ts compound
 * `hallmarks` fields). 'none' and unrecognized ids intentionally have no entry. */
const CONCERN_HALLMARK: Record<string, string> = {
  mito: 'mito',
  inflammation: 'inflammation',
  senescence: 'senescence',
  nutrient: 'nutrient',
};

/** A preset's aggregate hallmark coverage, derived from its actual compounds —
 * never a hand-maintained second copy of what each preset "covers". */
function presetHallmarks(key: PresetKey): Set<string> {
  return new Set(
    stackPresets[key].ids.flatMap((id) => compounds.find((c) => c.id === id)?.hallmarks ?? []),
  );
}

/** True when the stated concern names a real hallmark the base preset doesn't
 * already cover — i.e. there's a genuine gap a broader stack could close. */
function isConcernUnmet(concern: string | undefined, base: PresetKey): boolean {
  const hallmark = concern ? CONCERN_HALLMARK[concern] : undefined;
  return hallmark ? !presetHallmarks(base).has(hallmark) : false;
}

/**
 * How far up a goal's ladder to climb, 0–2. A brand-new user always stays at
 * rung 0 regardless of age or concern — "start with fundamentals" is a
 * promise, not a suggestion. Age and concern only matter once experience says
 * the user is ready to act on them, matching the quiz's own option copy
 * ("Advanced: Compare & stack") — an unmet concern is treated as exactly the
 * same strength of readiness signal as an accelerated age band, not a
 * guarantee the broadened stack fully covers it (see isConcernUnmet).
 */
function ladderStep(age: string | undefined, experience: string | undefined, concernUnmet = false): 0 | 1 | 2 {
  if (experience === 'advanced') return isAcceleratedAge(age) || concernUnmet ? 2 : 1;
  if (experience === 'some') return isAcceleratedAge(age) || concernUnmet ? 1 : 0;
  return 0;
}

/**
 * Resolve a ladder step against a goal's available rungs, counting from the
 * strongest rung backward. A single-rung goal (metabolic, longevity — there's
 * no gentle mid-tier for them) only activates on the strongest combined
 * signal (step 2: advanced + accelerated age); a lone step-1 nudge isn't
 * enough to justify jumping straight to the 14-compound Full-Spectrum stack.
 * A two-rung goal (defense, energy — bridged by 'hybrid') can take the softer
 * step first. See UpgradeRungs — this indexing is only valid for 1–2 rungs.
 */
function resolveRung(rungs: UpgradeRungs, step: 1 | 2): PresetKey | null {
  const index = rungs.length - (3 - step);
  return index >= 0 ? rungs[index] : null;
}

// The open-ended "build a complete protocol" goal scales its breadth to the
// user's experience (and, once experience shows readiness, to age) so a
// first-timer isn't handed 14 compounds and an advanced user in an
// accelerated-decline age band isn't capped at five. Age is only consulted
// once experience is affirmatively 'some' — an *unanswered* experience must
// stay on the same neutral 'hybrid' default as a totally blank quiz, not
// silently borrow the age signal. This matters beyond the final result: the
// live quiz preview (see StarterQuiz.tsx) calls this mid-flow with age known
// but experience not yet picked — if age alone could push it to 'full' here,
// the preview would promise Full-Spectrum 14 and then drop to Foundation the
// instant the user picked "Brand new".
function resolveFullGoalPreset(age?: string, experience?: string): PresetKey {
  if (experience === 'new') return 'starter';
  if (experience === 'advanced') return 'full';
  if (experience === 'some') return isAcceleratedAge(age) ? 'full' : 'hybrid';
  return 'hybrid';
}

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
 * Resolve the stack preset for a set of quiz answers. Goal picks the mechanism
 * family; age, experience, and a stated concern the base preset doesn't cover
 * can then broaden it up that goal's ladder (see GOAL_UPGRADE_RUNGS) so two
 * people with the same goal but different readiness signals aren't handed an
 * identical stack. Exported so the live preview and the final result share a
 * single source of truth.
 */
export function getQuizPreset(answers: QuizAnswers): PresetKey {
  if (answers.goal === 'full') {
    return resolveFullGoalPreset(answers.age, answers.experience);
  }
  const base = GOAL_PRESET[answers.goal ?? ''];
  if (!base) return 'starter';

  const rungs = GOAL_UPGRADE_RUNGS[answers.goal ?? ''];
  if (!rungs) return base;

  const step = ladderStep(answers.age, answers.experience, isConcernUnmet(answers.concern, base));
  if (step === 0) return base;
  return resolveRung(rungs, step) ?? base;
}

/** The base preset for a goal, ignoring any age/experience broadening — used to detect and explain when a broadening actually happened. */
function baseGoalPreset(goal: string | undefined): PresetKey | null {
  return goal && goal !== 'full' ? (GOAL_PRESET[goal] ?? null) : null;
}

function broadeningNote(answers: QuizAnswers, preset: PresetKey): string | null {
  const base = baseGoalPreset(answers.goal);
  if (!base || base === preset) return null;
  return `Your experience level and age band signaled you're ready for more than the standard ${stackPresets[base].label} preset, so this was broadened to ${stackPresets[preset].label} for fuller pathway coverage.`;
}

/** Names the concern the user flagged and whether this preset actually covers
 * that hallmark — either confirms the match or points at the gap honestly
 * rather than implying every stated concern gets folded in automatically. */
function concernNote(answers: QuizAnswers, preset: PresetKey): string | null {
  const hallmark = answers.concern ? CONCERN_HALLMARK[answers.concern] : undefined;
  if (!hallmark) return null;
  const label = (hallmarkDisplayNames[hallmark] ?? hallmark).toLowerCase();
  return presetHallmarks(preset).has(hallmark)
    ? `You flagged ${label} as your top concern — this stack directly targets that pathway.`
    : `You also flagged ${label} — this preset doesn't center on that pathway, so browse the ${hallmarkDisplayNames[hallmark] ?? hallmark} hallmark in the Library to see what would layer in well.`;
}

const BUDGET_LABEL: Record<string, string> = {
  under50: 'under $50/month',
  '50to150': '$50–150/month',
  over150: '$150+/month',
};
const BUDGET_CEILING: Record<string, number> = {
  under50: 50,
  '50to150': 150,
  over150: Infinity,
};

/** Compares the preset's real monthly cost (lib/stack-analysis's own
 * calculation, not a second estimate) against the user's stated ceiling. */
function budgetNote(answers: QuizAnswers, preset: PresetKey): string | null {
  const ceiling = answers.budget ? BUDGET_CEILING[answers.budget] : undefined;
  if (ceiling === undefined) return null;
  const { low, high } = analyzeStack([...stackPresets[preset].ids]).monthlyCost;
  const label = BUDGET_LABEL[answers.budget!];
  return high <= ceiling
    ? `At $${low}–${high}/month, it fits comfortably inside your stated ${label} range.`
    : `Heads up: this runs $${low}–${high}/month, above your stated ${label} — start with the highest-evidence compounds first and phase the rest in as budget allows.`;
}

/** Doesn't attempt to match a specific flagged condition to a specific
 * caution (free-text safety notes aren't reliably keyword-matchable) — just
 * confirms the flag was heard and points at the real, compound-specific
 * cautions already rendered below, which is what an honest cross-reference
 * looks like without guessing. */
function safetyNote(answers: QuizAnswers): string | null {
  const flags = (answers.safety ?? []).filter((f) => f !== 'none');
  if (flags.length === 0) return null;
  return 'You flagged a health condition or medication — review the consult-worthy cautions for your exact compounds below before starting anything new.';
}

export function getQuizResult(answers: QuizAnswers) {
  const preset = getQuizPreset(answers);
  const stack = stackPresets[preset];
  const primary = GOAL_NEXT_STEP[answers.goal ?? ''] ?? GOAL_NEXT_STEP.learn;
  const insight = [
    PRESET_INSIGHT[preset],
    broadeningNote(answers, preset),
    concernNote(answers, preset),
    personalizationNote(answers),
    budgetNote(answers, preset),
    safetyNote(answers),
  ]
    .filter((part): part is string => Boolean(part))
    .join(' ');

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
