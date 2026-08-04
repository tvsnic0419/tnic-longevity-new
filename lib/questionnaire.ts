/**
 * The NICO Starter Questionnaire — steps, scoring, and result resolution.
 *
 * This module replaces the old three-question quiz that lived in
 * `lib/homepage.ts`. That version mapped (goal, age, experience) through a flat
 * lookup table onto one of seven presets and stopped there — nine tenths of
 * what the visitor told us went unused, and nothing in the repo's curated
 * safety data was ever consulted.
 *
 * What changed:
 *   • nine questions instead of three, including a real safety screen;
 *   • lifestyle burden (sleep / energy / stress / movement) now moves the
 *     preset ladder and sets the phase-in order, so those answers visibly
 *     change the output instead of decorating it;
 *   • the safety screen removes or flags compounds using the *curated*
 *     `safetyNotes` entries in `lib/data.ts`.
 *
 * The presets themselves are unchanged — this improves the mapping onto them.
 *
 * EVIDENCE INTEGRITY: every safety reason surfaced to a visitor is copied
 * verbatim from `safetyNotes`. Nothing here authors a new medical claim, and
 * `questionnaire.test.ts` fails the build if a reason string appears that is
 * not present in that curated data.
 *
 * Every exported resolver is pure, so `/results` can compute a result on the
 * server straight from URL params.
 */

import { stackPresets, type PresetKey } from './presets';
import { compounds, safetyNotes } from './data';

/**
 * Canonical product name. Consumed by the H1, <title>, nav label, metadata,
 * share cards, and JSON-LD so the spelling cannot drift between surfaces.
 */
export const QUESTIONNAIRE_NAME = 'The NICO Starter Questionnaire';
export const QUESTIONNAIRE_SHORT_NAME = 'NICO Starter Questionnaire';

export type IconKey = 'book' | 'shield' | 'zap' | 'layers';

export type QuestionnaireAnswers = {
  goal?: string;
  age?: string;
  experience?: string;
  sex?: string;
  sleep?: string;
  energy?: string;
  stress?: string;
  movement?: string;
  /** Multi-select. `['none']` is an affirmative "nothing applies". */
  safety?: string[];
};

export type AnswerKey = keyof QuestionnaireAnswers;

export type QuestionnaireOption = {
  id: string;
  label: string;
  desc?: string;
  icon?: IconKey;
};

export type QuestionnaireStep = {
  id: AnswerKey;
  question: string;
  help?: string;
  kind: 'single' | 'multi';
  options: readonly QuestionnaireOption[];
};

/* ── Safety screen ────────────────────────────────────────────────────────
   Each flag carries the patterns that identify it inside a compound's curated
   `avoidIf` / `consultIf` strings. The patterns are deliberately narrow: they
   recognise language the safety data already uses rather than encoding any
   pharmacological judgement of our own. `other-rx` matches only the two
   genuinely generic prescription risks the data names — an explicit "any
   prescription medication" caution, and CYP-enzyme interactions. */
export const SAFETY_FLAGS = [
  {
    id: 'pregnancy',
    label: 'Pregnant or nursing',
    patterns: [/pregnan/i, /nursing/i],
  },
  {
    id: 'anticoagulant',
    label: 'Blood thinners or anticoagulants',
    patterns: [/blood thinner/i, /anticoagulant/i, /warfarin/i, /clopidogrel/i, /\bDOAC/i, /vitamin K antagonist/i, /clotting disorder/i, /antiplatelet/i],
  },
  {
    id: 'glucose',
    label: 'Diabetes or glucose medication',
    patterns: [/diabet/i, /prediabet/i, /blood glucose/i, /insulin/i],
  },
  {
    id: 'thyroid',
    label: 'Thyroid medication or condition',
    patterns: [/thyroid/i],
  },
  {
    id: 'organ',
    label: 'Kidney or liver disease',
    patterns: [/kidney/i, /renal/i, /liver disease/i],
  },
  {
    id: 'oncology',
    label: 'Active cancer treatment',
    patterns: [/chemotherap/i, /cancer treatment/i, /oncologist/i],
  },
  {
    id: 'other-rx',
    label: 'Other prescription medication',
    patterns: [/any prescription medication/i, /CYP/i],
  },
  {
    id: 'none',
    label: 'None of these',
    patterns: [],
  },
] as const;

export type SafetyFlagId = (typeof SAFETY_FLAGS)[number]['id'];

export const quizSteps: readonly QuestionnaireStep[] = [
  {
    id: 'goal',
    question: 'What brings you to TNiC today?',
    kind: 'single',
    options: [
      { id: 'learn', label: 'Understand the science first', icon: 'book' },
      { id: 'defense', label: 'Strengthen antioxidant defenses', icon: 'shield' },
      { id: 'energy', label: 'Restore energy & NAD+', icon: 'zap' },
      { id: 'longevity', label: 'Target senescent cells & healthspan', icon: 'layers' },
      { id: 'metabolic', label: 'Improve metabolic & cardiovascular health', icon: 'shield' },
      { id: 'full', label: 'Build a complete protocol', icon: 'layers' },
    ],
  },
  {
    id: 'age',
    question: 'Your age range',
    kind: 'single',
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
    kind: 'single',
    options: [
      { id: 'new', label: 'Brand new', desc: 'Start with fundamentals' },
      { id: 'some', label: 'Some experience', desc: 'Ready to optimize' },
      { id: 'advanced', label: 'Advanced', desc: 'Compare & stack' },
    ],
  },
  {
    id: 'sex',
    question: 'Biological sex',
    help: 'Used to contextualise the guidance below your stack. It does not change which compounds are recommended — TNiC has no curated per-sex compound data, and inventing any would be a medical claim.',
    kind: 'single',
    options: [
      { id: 'female', label: 'Female' },
      { id: 'male', label: 'Male' },
      { id: 'unspecified', label: 'Prefer not to say' },
    ],
  },
  {
    id: 'sleep',
    question: 'How is your sleep, most nights?',
    kind: 'single',
    options: [
      { id: 'good', label: 'Solid', desc: '7+ hours, wake rested' },
      { id: 'mixed', label: 'Inconsistent', desc: 'Some good nights, some bad' },
      { id: 'poor', label: 'Poor', desc: 'Short, broken, or unrefreshing' },
    ],
  },
  {
    id: 'energy',
    question: 'Your daytime energy',
    kind: 'single',
    options: [
      { id: 'good', label: 'Steady', desc: 'Through to the evening' },
      { id: 'mixed', label: 'Dips', desc: 'Afternoon crash' },
      { id: 'low', label: 'Low', desc: 'Fatigued most of the day' },
    ],
  },
  {
    id: 'stress',
    question: 'Your stress load right now',
    kind: 'single',
    options: [
      { id: 'low', label: 'Manageable' },
      { id: 'moderate', label: 'Elevated', desc: 'Busy stretch' },
      { id: 'high', label: 'High', desc: 'Sustained pressure' },
    ],
  },
  {
    id: 'movement',
    question: 'How much do you move in a typical week?',
    kind: 'single',
    options: [
      { id: 'active', label: 'Trained', desc: '4+ sessions' },
      { id: 'moderate', label: 'Some', desc: '1–3 sessions' },
      { id: 'sedentary', label: 'Little', desc: 'Mostly seated' },
    ],
  },
  {
    id: 'safety',
    question: 'Do any of these apply to you?',
    help: 'Select all that apply. This filters your recommendation against TNiC’s per-compound safety data — it is not medical advice, and it does not replace talking to your doctor or pharmacist.',
    kind: 'multi',
    options: SAFETY_FLAGS.map((f) => ({ id: f.id, label: f.label })),
  },
] as const;

/** Legacy alias — the first three steps are the original quiz. */
export type QuizAnswers = QuestionnaireAnswers;

type QuizNextStep = { title: string; href: string; cta: string };

// The goal answer picks the mechanism family — this is the base/anchor preset
// for that goal before age, experience, or lifestyle burden are considered.
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

// Goals that can broaden beyond their base preset once experience, age, and
// lifestyle burden signal the user is ready for more. Listed weakest→strongest.
// 'hybrid' is a strict superset of the NRF2 and NAD+ families; 'full' is a
// strict superset of every preset — so broadening never drops a compound the
// stated goal promised. 'learn' has no ladder: it's about understanding
// fundamentals first, not maximizing stack size, so it always stays 'starter'.
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

/* ── Lifestyle burden ─────────────────────────────────────────────────────
   Four independent signals, one point each. This is the layer that makes
   questions 5–8 load-bearing: burden both moves the preset ladder and sets
   which pathway gets phased in first. */

export type BurdenDriver = {
  id: 'sleep' | 'energy' | 'stress' | 'movement';
  label: string;
  /** Hallmark ids (as used by `compounds[].hallmarks`) this driver implicates. */
  hallmarks: readonly string[];
};

const BURDEN_DRIVERS: Record<string, BurdenDriver> = {
  sleep: { id: 'sleep', label: 'Poor sleep', hallmarks: ['mito', 'inflammation'] },
  energy: { id: 'energy', label: 'Low daytime energy', hallmarks: ['mito', 'nutrient'] },
  stress: { id: 'stress', label: 'High stress load', hallmarks: ['inflammation', 'proteostasis'] },
  movement: { id: 'movement', label: 'Little movement', hallmarks: ['mito', 'nutrient'] },
};

export type Burden = {
  score: 0 | 1 | 2 | 3 | 4;
  drivers: BurdenDriver[];
  /** Hallmarks implicated by the active drivers, most-implicated first. */
  priorityHallmarks: string[];
};

export function scoreBurden(answers: QuestionnaireAnswers): Burden {
  const drivers: BurdenDriver[] = [];
  if (answers.sleep === 'poor') drivers.push(BURDEN_DRIVERS.sleep);
  if (answers.energy === 'low') drivers.push(BURDEN_DRIVERS.energy);
  if (answers.stress === 'high') drivers.push(BURDEN_DRIVERS.stress);
  if (answers.movement === 'sedentary') drivers.push(BURDEN_DRIVERS.movement);

  const tally = new Map<string, number>();
  for (const d of drivers) {
    for (const h of d.hallmarks) tally.set(h, (tally.get(h) ?? 0) + 1);
  }
  const priorityHallmarks = [...tally.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([h]) => h);

  return { score: drivers.length as Burden['score'], drivers, priorityHallmarks };
}

/**
 * How far up a goal's ladder to climb, 0–2.
 *
 * A brand-new user always stays at rung 0 regardless of age or burden —
 * "start with fundamentals" is a promise, not a suggestion, and someone
 * already struggling is the last person who should be handed fourteen new
 * compounds at once. Age only matters once experience says the user is ready
 * to act on it, matching the quiz's own option copy ("Advanced: Compare &
 * stack"). Sustained lifestyle burden (2+ drivers) then adds one rung for
 * everyone else, because more systems under load justifies broader coverage.
 */
function ladderStep(
  age: string | undefined,
  experience: string | undefined,
  burden: number,
): 0 | 1 | 2 {
  if (experience === 'new') return 0;

  let step: 0 | 1 | 2 = 0;
  if (experience === 'advanced') step = isAcceleratedAge(age) ? 2 : 1;
  else if (experience === 'some') step = isAcceleratedAge(age) ? 1 : 0;

  if (burden >= 2) step = Math.min(2, step + 1) as 0 | 1 | 2;
  return step;
}

/**
 * Resolve a ladder step against a goal's available rungs, counting from the
 * strongest rung backward. A single-rung goal (metabolic, longevity — there's
 * no gentle mid-tier for them) only activates on the strongest combined
 * signal; a lone step-1 nudge isn't enough to justify jumping straight to the
 * 14-compound Full-Spectrum stack. A two-rung goal (defense, energy — bridged
 * by 'hybrid') can take the softer step first. See UpgradeRungs — this
 * indexing is only valid for 1–2 rungs.
 */
function resolveRung(rungs: UpgradeRungs, step: 1 | 2): PresetKey | null {
  const index = rungs.length - (3 - step);
  return index >= 0 ? rungs[index] : null;
}

// The open-ended "build a complete protocol" goal scales its breadth to the
// user's experience (and, once experience shows readiness, to age and burden)
// so a first-timer isn't handed 14 compounds and an advanced user in an
// accelerated-decline age band isn't capped at five. Age is only consulted
// once experience is affirmatively 'some' — an *unanswered* experience must
// stay on the same neutral 'hybrid' default as a totally blank questionnaire,
// not silently borrow the age signal. This matters beyond the final result:
// the live preview calls this mid-flow with age known but experience not yet
// picked — if age alone could push it to 'full' here, the preview would
// promise Full-Spectrum 14 and then drop to Foundation the instant the user
// picked "Brand new".
function resolveFullGoalPreset(age?: string, experience?: string, burden = 0): PresetKey {
  if (experience === 'new') return 'starter';
  if (experience === 'advanced') return 'full';
  if (experience === 'some') return isAcceleratedAge(age) || burden >= 2 ? 'full' : 'hybrid';
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

// A closing sentence tuned to the remaining answers so both the stack and the
// guidance reflect everything the user told us.
function personalizationNote(answers: QuestionnaireAnswers, burden: Burden): string {
  if (answers.goal === 'learn') {
    return 'Since you came to understand the science first, open the Library alongside it — every compound is mapped to a hallmark mechanism, evidence tier, and human trial before it reaches your stack.';
  }
  if (burden.score >= 3) {
    return `You flagged ${burden.drivers.length} systems under load (${burden.drivers.map((d) => d.label.toLowerCase()).join(', ')}). Supplements work downstream of sleep, movement, and stress — treat those as the protocol and this stack as support for it.`;
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
 * Resolve the stack preset for a set of answers. Goal picks the mechanism
 * family; age, experience, and lifestyle burden can then broaden it up that
 * goal's ladder (see GOAL_UPGRADE_RUNGS) so two people with the same goal but
 * different readiness signals aren't handed an identical stack.
 *
 * Note this is the preset *before* the safety screen runs — a declared
 * pregnancy caps it further in resolveQuestionnaireResult().
 */
export function getQuizPreset(answers: QuestionnaireAnswers): PresetKey {
  const burden = scoreBurden(answers).score;

  if (answers.goal === 'full') {
    return resolveFullGoalPreset(answers.age, answers.experience, burden);
  }
  const base = GOAL_PRESET[answers.goal ?? ''];
  if (!base) return 'starter';

  const rungs = GOAL_UPGRADE_RUNGS[answers.goal ?? ''];
  if (!rungs) return base;

  const step = ladderStep(answers.age, answers.experience, burden);
  if (step === 0) return base;
  return resolveRung(rungs, step) ?? base;
}

/** The base preset for a goal, ignoring any broadening — used to detect and explain when a broadening actually happened. */
function baseGoalPreset(goal: string | undefined): PresetKey | null {
  return goal && goal !== 'full' ? (GOAL_PRESET[goal] ?? null) : null;
}

function broadeningNote(answers: QuestionnaireAnswers, preset: PresetKey, burden: Burden): string | null {
  const base = baseGoalPreset(answers.goal);
  if (!base || base === preset) return null;
  const because =
    burden.score >= 2
      ? `your experience level, age band, and ${burden.drivers.length} flagged lifestyle signals`
      : 'your experience level and age band';
  return `Because ${because} pointed to more than the standard ${stackPresets[base].label} preset, this was broadened to ${stackPresets[preset].label} for fuller pathway coverage.`;
}

/* ── Safety screen ──────────────────────────────────────────────────────── */

export type SafetyFinding = {
  id: string;
  name: string;
  /** Copied verbatim from the compound's curated safetyNotes entry. */
  reason: string;
};

function activeFlags(answers: QuestionnaireAnswers) {
  const selected = answers.safety ?? [];
  return SAFETY_FLAGS.filter((f) => f.id !== 'none' && selected.includes(f.id));
}

function matchesAnyFlag(text: string, flags: ReturnType<typeof activeFlags>): boolean {
  return flags.some((f) => f.patterns.some((p) => p.test(text)));
}

/* ── Result ─────────────────────────────────────────────────────────────── */

export type RecommendedCompound = {
  id: string;
  name: string;
  tier: string;
  dose: string;
  timing: string;
  /** Why this compound is in *this* stack, from its own curated pathway data. */
  why: string;
};

export type QuestionnaireResult = {
  preset: PresetKey;
  stack: (typeof stackPresets)[PresetKey];
  recommended: RecommendedCompound[];
  excluded: SafetyFinding[];
  flagged: SafetyFinding[];
  burden: Burden;
  /** True when a declared pregnancy narrowed the preset before filtering. */
  safetyCapped: boolean;
  insight: string;
  phasing: string[];
  primary: QuizNextStep;
};

/** Order the stack so the pathways the visitor's burden implicates come first. */
function prioritise(ids: readonly string[], priorityHallmarks: string[]): string[] {
  if (priorityHallmarks.length === 0) return [...ids];
  const weight = (id: string) => {
    const c = compounds.find((x) => x.id === id);
    if (!c) return 0;
    return c.hallmarks.reduce((sum, h) => {
      const rank = priorityHallmarks.indexOf(h);
      return rank === -1 ? sum : sum + (priorityHallmarks.length - rank);
    }, 0);
  };
  return [...ids].sort((a, b) => weight(b) - weight(a));
}

function buildPhasing(
  recommended: RecommendedCompound[],
  answers: QuestionnaireAnswers,
  burden: Burden,
): string[] {
  if (recommended.length === 0) return [];
  const steps: string[] = [];
  const first = recommended[0];

  if (burden.priorityHallmarks.length > 0) {
    steps.push(
      `Start with ${first.name} — it targets the pathways your ${burden.drivers
        .map((d) => d.label.toLowerCase())
        .join(' and ')} answers implicate most.`,
    );
  } else {
    steps.push(`Start with ${first.name} — the strongest-evidence anchor of this stack.`);
  }

  const window = answers.experience === 'new' ? 'two to three weeks' : 'one to two weeks';
  if (recommended.length > 1) {
    steps.push(`Add the remaining ${recommended.length - 1} one at a time, ${window} apart, so you can attribute any change.`);
  }
  steps.push('Re-check at 90 days — log a baseline now so there is something to compare against.');
  return steps;
}

export function resolveQuestionnaireResult(answers: QuestionnaireAnswers): QuestionnaireResult {
  const burden = scoreBurden(answers);
  const flags = activeFlags(answers);
  const pregnant = flags.some((f) => f.id === 'pregnancy');

  // A declared pregnancy narrows the stack before anything else runs. Much of
  // the library lists "Pregnant or nursing" under consultIf, so starting from
  // the smallest preset keeps the result honest rather than presenting a wide
  // stack that is then almost entirely flagged.
  const resolved = getQuizPreset(answers);
  const preset: PresetKey = pregnant ? 'starter' : resolved;
  const safetyCapped = pregnant && preset !== resolved;

  const stack = stackPresets[preset];
  const ordered = prioritise(stack.ids, burden.priorityHallmarks);

  const recommended: RecommendedCompound[] = [];
  const excluded: SafetyFinding[] = [];
  const flagged: SafetyFinding[] = [];

  for (const id of ordered) {
    const compound = compounds.find((c) => c.id === id);
    if (!compound) continue;
    const notes = safetyNotes.find((n) => n.compoundId === id);

    const avoidHit = notes?.avoidIf.find((t) => matchesAnyFlag(t, flags));
    if (avoidHit) {
      excluded.push({ id, name: compound.name, reason: avoidHit });
      continue;
    }

    const consultHit = notes?.consultIf.find((t) => matchesAnyFlag(t, flags));
    if (consultHit) {
      flagged.push({ id, name: compound.name, reason: consultHit });
    }

    recommended.push({
      id,
      name: compound.name,
      tier: compound.evidence,
      dose: compound.dose,
      timing: compound.timing,
      why: compound.pathway,
    });
  }

  const broadening = broadeningNote(answers, preset, burden);
  const capNote = safetyCapped
    ? ' Because you indicated pregnancy or nursing, this was narrowed to the smallest evidence-graded stack — review every item with your OB or midwife before starting anything.'
    : '';
  const insight = `${PRESET_INSIGHT[preset]}${broadening ? ` ${broadening}` : ''}${capNote} ${personalizationNote(answers, burden)}`;

  return {
    preset,
    stack,
    recommended,
    excluded,
    flagged,
    burden,
    safetyCapped,
    insight,
    phasing: buildPhasing(recommended, answers, burden),
    primary: GOAL_NEXT_STEP[answers.goal ?? ''] ?? GOAL_NEXT_STEP.learn,
  };
}

/**
 * Back-compat shape for the surfaces that only need preset + insight + next
 * step (the live in-flow preview and the share-card builders).
 */
export function getQuizResult(answers: QuestionnaireAnswers) {
  const full = resolveQuestionnaireResult(answers);
  return {
    preset: full.preset,
    stack: full.stack,
    primary: full.primary,
    insight: full.insight,
  };
}

/** True once every question that changes the recommendation has an answer. */
export function isCompleteAnswers(answers: QuestionnaireAnswers): boolean {
  return quizSteps.every((step) => {
    const value = answers[step.id];
    return step.kind === 'multi' ? Array.isArray(value) && value.length > 0 : Boolean(value);
  });
}
