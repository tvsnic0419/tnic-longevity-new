/**
 * NICO Starter Questionnaire — the single personalized entry point.
 *
 * A deterministic scoring engine that turns a visitor's own answers into a
 * personalized, evidence-graded compound stack. Nothing here is hardcoded to a
 * fixed protocol: the recommended stack is computed from
 *
 *     answers → per-compound affinity (goals + focus areas + lifestyle signals)
 *             → safety filters → ranked stack → result
 *
 * so two different runs return two different stacks. Everything is joined from
 * existing sources — `lib/data.ts` (evidence tiers, hallmarks, dosing) and
 * `lib/stack-engine.ts` (synergy + coverage scoring) — it invents no data.
 */

import { compounds } from './data';
import { scoreStack } from './stack-engine';
import type { EvidenceTier } from './types';

// ─── Answer shape ────────────────────────────────────────────────────────────

export type NicoGoal =
  | 'energy'
  | 'inflammation'
  | 'cognitive'
  | 'longevity'
  | 'recovery'
  | 'epigenetic'
  | 'sleep';

export type NicoFocus =
  | 'mito'
  | 'genomic'
  | 'epigenetic'
  | 'inflammation'
  | 'senescence'
  | 'proteostasis'
  | 'nutrient'
  | 'autophagy'
  | 'telomeres';

export type NicoSafetyFlag =
  | 'anticoagulant'
  | 'immunosuppressant'
  | 'pregnancy'
  | 'statin'
  | 'bloodPressure';

/** 1 (poor / low) … 5 (great / high). */
export type Scale = 1 | 2 | 3 | 4 | 5;

export interface NicoAnswers {
  goals: NicoGoal[];
  age: number;
  sleep: Scale;
  energy: Scale;
  stress: Scale;
  movement: Scale;
  diet: Scale;
  focus: NicoFocus[];
  safety: NicoSafetyFlag[];
}

// ─── Question definitions (drive the UI) ─────────────────────────────────────

export const NICO_GOAL_OPTIONS: { id: NicoGoal; label: string; desc: string }[] = [
  { id: 'energy', label: 'Energy & mitochondria', desc: 'NAD⁺, ATP, fatigue' },
  { id: 'longevity', label: 'Full longevity', desc: 'Multi-hallmark coverage' },
  { id: 'inflammation', label: 'Lower inflammation', desc: 'hs-CRP, inflammaging' },
  { id: 'cognitive', label: 'Cognitive clarity', desc: 'Focus, brain fog' },
  { id: 'sleep', label: 'Sleep & recovery', desc: 'Sleep depth, wind-down' },
  { id: 'recovery', label: 'Physical resilience', desc: 'Strength, oxidative stress' },
  { id: 'epigenetic', label: 'Biological age', desc: 'Methylation, epigenetic clocks' },
];

export const NICO_FOCUS_OPTIONS: { id: NicoFocus; label: string }[] = [
  { id: 'mito', label: 'Mitochondrial function' },
  { id: 'genomic', label: 'DNA / genomic integrity' },
  { id: 'epigenetic', label: 'Epigenetic age' },
  { id: 'inflammation', label: 'Chronic inflammation' },
  { id: 'senescence', label: 'Senescent-cell burden' },
  { id: 'proteostasis', label: 'Protein quality control' },
  { id: 'nutrient', label: 'Nutrient sensing (mTOR/AMPK)' },
  { id: 'autophagy', label: 'Autophagy / cellular cleanup' },
  { id: 'telomeres', label: 'Telomere maintenance' },
];

export const NICO_SAFETY_OPTIONS: { id: NicoSafetyFlag; label: string }[] = [
  { id: 'anticoagulant', label: 'Blood thinners / anticoagulants' },
  { id: 'statin', label: 'Statins' },
  { id: 'bloodPressure', label: 'Blood-pressure medication' },
  { id: 'immunosuppressant', label: 'Immunosuppressants' },
  { id: 'pregnancy', label: 'Pregnant, nursing, or trying to conceive' },
];

export const NICO_SCALE_LABELS: Record<
  'sleep' | 'energy' | 'stress' | 'movement' | 'diet',
  { question: string; low: string; high: string }
> = {
  sleep: { question: 'How is your sleep, most nights?', low: 'Poor', high: 'Excellent' },
  energy: { question: 'How are your daytime energy levels?', low: 'Drained', high: 'Strong' },
  stress: { question: 'How high is your day-to-day stress?', low: 'Low', high: 'High' },
  movement: { question: 'How active are you in a typical week?', low: 'Sedentary', high: 'Very active' },
  diet: { question: 'How would you rate your diet quality?', low: 'Poor', high: 'Excellent' },
};

// ─── Affinity maps ───────────────────────────────────────────────────────────

const GOAL_HALLMARKS: Record<NicoGoal, string[]> = {
  energy: ['mito', 'nutrient', 'proteostasis'],
  inflammation: ['inflammation', 'senescence', 'communication'],
  cognitive: ['proteostasis', 'mito', 'inflammation'],
  longevity: ['mito', 'genomic', 'epigenetic', 'autophagy', 'senescence'],
  recovery: ['proteostasis', 'mito', 'inflammation'],
  epigenetic: ['epigenetic', 'nutrient', 'stem'],
  sleep: ['inflammation', 'mito', 'communication'],
};

/** Compounds most directly matched to each goal — an explicit boost on top of hallmark overlap. */
const GOAL_BOOST: Record<NicoGoal, string[]> = {
  energy: ['nmn', 'cakg', 'rala', 'coq10', 'creatine', 'pqq'],
  inflammation: ['glynac', 'sulforaphane', 'omega3', 'curcumin', 'resveratrol'],
  cognitive: ['nmn', 'glycine', 'magnesium', 'curcumin', 'omega3'],
  longevity: ['glynac', 'nmn', 'cakg', 'sulforaphane', 'spermidine', 'fisetin'],
  recovery: ['creatine', 'glynac', 'omega3', 'taurine', 'rala'],
  epigenetic: ['cakg', 'nmn', 'resveratrol', 'sulforaphane'],
  sleep: ['magnesium', 'glycine', 'melatonin', 'taurine'],
};

/** Lifestyle-signal modifiers: a low score on a pillar boosts the compounds that address it. */
const SIGNAL_BOOST: { test: (a: NicoAnswers) => boolean; ids: string[]; note: string }[] = [
  { test: (a) => a.sleep <= 2, ids: ['magnesium', 'glycine', 'melatonin'], note: 'sleep support' },
  { test: (a) => a.stress >= 4, ids: ['magnesium', 'omega3', 'glynac', 'taurine'], note: 'stress load' },
  { test: (a) => a.energy <= 2, ids: ['nmn', 'cakg', 'coq10', 'creatine'], note: 'low energy' },
  { test: (a) => a.movement <= 2, ids: ['creatine', 'vitamin-d3'], note: 'low activity' },
  { test: (a) => a.diet <= 2, ids: ['omega3', 'vitamin-d3', 'magnesium', 'zinc'], note: 'diet gaps' },
  { test: (a) => a.age >= 50, ids: ['nmn', 'cakg', 'coq10'], note: 'age ≥ 50 (NAD⁺/CoQ10 decline)' },
  { test: (a) => a.age >= 60, ids: ['urolithin-a', 'glynac'], note: 'age ≥ 60' },
];

/**
 * Safety filters. Conservative by design: some flags EXCLUDE a compound, others
 * only attach a caution. Honest empty-handed is better than a risky suggestion.
 */
const SAFETY_EXCLUDE: Record<NicoSafetyFlag, string[]> = {
  // Additive bleeding risk / vitamin-K antagonism with warfarin-class drugs.
  anticoagulant: ['omega3', 'vitamin-k2', 'quercetin', 'curcumin'],
  // No OTC compound here is an immunosuppressant; we simply don't layer onto Rx ones.
  immunosuppressant: ['berberine'],
  // Insufficient pregnancy safety data for most longevity compounds — keep only foundational.
  pregnancy: [
    'nmn', 'cakg', 'resveratrol', 'pterostilbene', 'berberine', 'spermidine',
    'fisetin', 'quercetin', 'urolithin-a', 'rala', 'taurine', 'sulforaphane', 'nac',
  ],
  statin: [],
  bloodPressure: [],
};

const SAFETY_BOOST: Partial<Record<NicoSafetyFlag, string[]>> = {
  // Statins block the mevalonate pathway that also makes CoQ10 — repletion is the classic pairing.
  statin: ['coq10'],
};

const SAFETY_NOTE: Record<NicoSafetyFlag, string> = {
  anticoagulant:
    'You flagged anticoagulants — omega-3, vitamin K2, and high-dose polyphenols are held back for bleeding-risk / INR reasons. Clear any addition with your prescriber.',
  immunosuppressant:
    'You flagged immunosuppressants — AMPK activators are held back; do not layer supplements onto an immunosuppressive regimen without your specialist.',
  pregnancy:
    'You flagged pregnancy / nursing / trying to conceive — most longevity compounds lack safety data here, so only foundational nutrients are shown. Confirm everything with your OB.',
  statin: 'You flagged statins — CoQ10 (ubiquinol) is prioritized because statins deplete it.',
  bloodPressure:
    'You flagged blood-pressure medication — berberine and magnesium can be additive; monitor with your prescriber.',
};

// Approximate retail monthly cost (USD) for an "est. cost" readout — deliberately
// rounded and labeled as an estimate, not a price we charge.
const MONTHLY_COST: Record<string, number> = {
  glynac: 35, sulforaphane: 25, rala: 20, cakg: 40, nmn: 45, resveratrol: 25,
  taurine: 12, spermidine: 30, pterostilbene: 25, berberine: 20, urolithina: 55,
  fisetin: 25, coq10: 30, omega3: 25, creatine: 12, curcumin: 20, glucosamine: 15,
  glycine: 12, magnesium: 15, melatonin: 8, nac: 15, pqq: 25, quercetin: 18,
  selenium: 8, 'vitamin-d3': 8, 'vitamin-k2': 15, zinc: 8,
};

// ─── Result shape ────────────────────────────────────────────────────────────

export interface NicoStackCompound {
  id: string;
  name: string;
  pathway: string;
  dose: string;
  timing: 'AM' | 'PM' | 'AM/PM';
  evidence: EvidenceTier;
  hallmarks: string[];
  rationale: string;
}

export interface NicoResult {
  protocolName: string;
  compoundIds: string[];
  compounds: NicoStackCompound[];
  synergy: number;
  hallmarksCovered: number;
  compoundCount: number;
  estMonthlyCost: number;
  bioAgeDelta: number;
  evidenceMix: { A: number; B: number; C: number };
  summary: string;
  drivers: string[];
  safetyNotes: string[];
}

const EVIDENCE_RANK: Record<EvidenceTier, number> = { A: 3, B: 2, C: 1 };

const PROTOCOL_NAME: Record<NicoGoal, string> = {
  energy: 'Mitochondrial Energy Protocol',
  inflammation: 'Inflammaging Control Protocol',
  cognitive: 'Cognitive Longevity Protocol',
  longevity: 'Full-Spectrum Longevity Protocol',
  recovery: 'Recovery & Resilience Protocol',
  epigenetic: 'Epigenetic Age Protocol',
  sleep: 'Sleep & Recovery Protocol',
};

function rationaleFor(
  compoundId: string,
  matchedGoals: NicoGoal[],
  matchedSignals: string[],
): string {
  const c = compounds.find((x) => x.id === compoundId);
  if (!c) return '';
  const bits: string[] = [];
  if (matchedGoals.length) {
    const labels = matchedGoals
      .map((g) => NICO_GOAL_OPTIONS.find((o) => o.id === g)?.label ?? g)
      .slice(0, 2);
    bits.push(`matches your ${labels.join(' & ').toLowerCase()} goal`);
  }
  if (matchedSignals.length) bits.push(`flagged for ${matchedSignals[0]}`);
  const lead = bits.length ? `${bits.join(', ')} — ` : '';
  return `${lead}${c.pathway}. Tier ${c.evidence}.`;
}

/**
 * The engine. Scores every graded compound against the answers, applies safety
 * filters, and returns a ranked, personalized stack plus its synergy metrics.
 */
export function computeNicoStack(answers: NicoAnswers): NicoResult {
  const goals = answers.goals.length ? answers.goals : (['longevity'] as NicoGoal[]);

  // Weight goals: first-picked goals count slightly more.
  const goalWeight = new Map<NicoGoal, number>();
  goals.forEach((g, i) => goalWeight.set(g, 1 + (goals.length - i) * 0.15));

  const excluded = new Set<string>();
  answers.safety.forEach((flag) => SAFETY_EXCLUDE[flag].forEach((id) => excluded.add(id)));

  const safetyBoost = new Set<string>();
  answers.safety.forEach((flag) => (SAFETY_BOOST[flag] ?? []).forEach((id) => safetyBoost.add(id)));

  const focusSet = new Set<string>(answers.focus);

  interface Scored {
    id: string;
    score: number;
    matchedGoals: NicoGoal[];
    matchedSignals: string[];
  }

  const scored: Scored[] = [];

  for (const c of compounds) {
    if (excluded.has(c.id)) continue;

    let score = EVIDENCE_RANK[c.evidence] * (0.55 + 0.45 * ((c.bioavailability ?? 60) / 100));
    const matchedGoals: NicoGoal[] = [];
    const matchedSignals: string[] = [];

    // Goal affinity: hallmark overlap + explicit compound boost.
    for (const g of goals) {
      const w = goalWeight.get(g) ?? 1;
      const hallmarkHits = c.hallmarks.filter((h) => GOAL_HALLMARKS[g].includes(h)).length;
      const boosted = GOAL_BOOST[g].includes(c.id);
      if (hallmarkHits > 0 || boosted) matchedGoals.push(g);
      score += hallmarkHits * 1.1 * w;
      if (boosted) score += 3.2 * w;
    }

    // Focus-area affinity.
    const focusHits = c.hallmarks.filter((h) => focusSet.has(h)).length;
    score += focusHits * 1.6;

    // Lifestyle-signal modifiers.
    for (const sig of SIGNAL_BOOST) {
      if (sig.test(answers) && sig.ids.includes(c.id)) {
        score += 2.4;
        matchedSignals.push(sig.note);
      }
    }

    // Safety-driven boost (e.g. statins → CoQ10).
    if (safetyBoost.has(c.id)) score += 3;

    scored.push({ id: c.id, score, matchedGoals, matchedSignals });
  }

  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  // Target stack size scales with how much the visitor asked for.
  const breadth = goals.length + answers.focus.length;
  const target = Math.max(3, Math.min(7, 3 + Math.round(breadth / 2)));
  const picked = scored.slice(0, target);

  const compoundIds = picked.map((p) => p.id);
  const stackScore = scoreStack(compoundIds);

  const stackCompounds: NicoStackCompound[] = picked.map((p) => {
    const c = compounds.find((x) => x.id === p.id)!;
    return {
      id: c.id,
      name: c.name,
      pathway: c.pathway,
      dose: c.dose,
      timing: c.timing,
      evidence: c.evidence,
      hallmarks: c.hallmarks,
      rationale: rationaleFor(p.id, p.matchedGoals, p.matchedSignals),
    };
  });

  const hallmarksCovered = new Set(stackCompounds.flatMap((c) => c.hallmarks)).size;
  const estMonthlyCost =
    Math.round(compoundIds.reduce((sum, id) => sum + (MONTHLY_COST[id] ?? 25), 0) / 5) * 5;

  const primaryGoal = [...goals].sort(
    (a, b) => (goalWeight.get(b) ?? 0) - (goalWeight.get(a) ?? 0),
  )[0];

  const drivers: string[] = [];
  const goalLabel = NICO_GOAL_OPTIONS.find((o) => o.id === primaryGoal)?.label ?? 'longevity';
  drivers.push(`Primary goal: ${goalLabel}`);
  const activeSignals = SIGNAL_BOOST.filter((s) => s.test(answers)).map((s) => s.note);
  if (activeSignals.length) drivers.push(`Lifestyle signals: ${activeSignals.join(', ')}`);
  if (answers.focus.length) {
    const focusLabels = answers.focus
      .map((f) => NICO_FOCUS_OPTIONS.find((o) => o.id === f)?.label ?? f)
      .join(', ');
    drivers.push(`Focus areas: ${focusLabels}`);
  }

  const safetyNotes = answers.safety.map((flag) => SAFETY_NOTE[flag]);

  const summary =
    `Built from your answers: a ${compoundIds.length}-compound ${goalLabel.toLowerCase()} stack ` +
    `covering ${hallmarksCovered} hallmark${hallmarksCovered === 1 ? '' : 's'} of aging, ` +
    `synergy ${stackScore.synergy}/100. Personalized for you — not a fixed preset.`;

  return {
    protocolName: PROTOCOL_NAME[primaryGoal],
    compoundIds,
    compounds: stackCompounds,
    synergy: stackScore.synergy,
    hallmarksCovered,
    compoundCount: compoundIds.length,
    estMonthlyCost,
    bioAgeDelta: stackScore.bioAgeDelta,
    evidenceMix: stackScore.evidenceMix,
    summary,
    drivers,
    safetyNotes,
  };
}

/** Default answers — a neutral middle state for a fresh visitor. */
export const NICO_DEFAULT_ANSWERS: NicoAnswers = {
  goals: [],
  age: 45,
  sleep: 3,
  energy: 3,
  stress: 3,
  movement: 3,
  diet: 3,
  focus: [],
  safety: [],
};
