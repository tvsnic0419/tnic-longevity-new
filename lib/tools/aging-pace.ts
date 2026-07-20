/**
 * Biological Age Trajectory — pace-of-aging engine.
 *
 * Turns a 7-question lifestyle intake + the user's supplement stack into a
 * modeled "pace of aging" (biological years accrued per calendar year, in the
 * spirit of DunedinPACE) and a multi-year biological-age trajectory.
 *
 * Design intent: optimistic but honest. The headline number is always the
 * stack's OWN contribution (baseline-vs-stack, which is always ≥ 0), while the
 * verdict compares the on-stack forward pace to the calendar (1.0×) so the
 * claim "slower / on par / faster than your chronological age" is truthful.
 *
 * Every output is a MODEL, not a clinical prediction — see `disclaimer`. Weights
 * are anchored to published effect sizes and the site's own evidence tiers, and
 * reuse the existing baseline model (`calculateDefenseProfile`, `analyzeStack`)
 * so this tool agrees with the rest of the platform.
 */

import { calculateDefenseProfile, compounds } from '../data';
import { analyzeStack } from '../stack-analysis';
import type { EvidenceTier } from '../types';

export type Sex = 'male' | 'female' | 'prefer_not';

/** The 7-question intake. All lifestyle fields are 0–100 (higher = healthier),
 *  except `stress` and `substances` where higher = worse (more aging load). */
export interface AgingPaceIntake {
  age: number;
  sex: Sex;
  sleep: number;      // 0–100 (hours × restfulness)
  exercise: number;   // 0–100 (frequency × intensity)
  diet: number;       // 0–100 (ultra-processed → whole-food)
  stress: number;     // 0–100 (none → severe chronic)
  substances: number; // 0–100 (none → heavy smoking/alcohol)
}

export interface AgingPaceInput {
  intake: AgingPaceIntake;
  stackIds: string[];
  /** Projection horizon in years (default 10). */
  horizonYears?: number;
  /** Protocol adherence 0–1 (default 1.0). Scales every compound's effect. */
  adherence?: number;
}

export type Verdict = 'slowing' | 'on-par' | 'faster';

export interface CompoundContribution {
  id: string;
  name: string;
  evidence: EvidenceTier;
  /** Marginal share of the stack's pace reduction, in percentage points. */
  paceReductionPct: number;
}

export interface TrajectoryPoint {
  year: number;
  chronoAge: number;
  /** Biological age on the current lifestyle with NO stack. */
  baselineBioAge: number;
  /** Biological age on the stack (expected). */
  stackBioAge: number;
  /** Conservative / optimistic band around the on-stack line. */
  stackBioAgeConservative: number;
  stackBioAgeOptimistic: number;
}

export interface AgingPaceResult {
  chronologicalAge: number;
  /** Biological age today (year 0), from the intake. */
  currentBioAge: number;
  /** Forward pace of aging on the stack — biological years per calendar year. */
  paceOfAging: number;
  /** Same, with no stack — the lifestyle-only baseline pace. */
  baselinePace: number;
  /** Total forward pace vs the calendar. Positive = slower. round((1 − pace)·100). */
  pctSlower: number;
  /** The STACK's own marginal share of the slowing, in percentage points. */
  stackPctSlower: number;
  verdict: Verdict;
  /** Biological years the STACK reclaims vs the no-stack baseline, at horizon. Always ≥ 0. */
  yearsReclaimedByStack: number;
  yearsReclaimedRange: [low: number, high: number];
  /** Honest gap vs the calendar at horizon (chrono − on-stack bio). Can be negative. */
  yearsVsChronological: number;
  effectiveStackReduction: number; // 0–1
  ceilingHit: boolean;
  rampMonths: number;
  horizonYears: number;
  synergyScore: number;
  hallmarkCount: number;
  evidenceTier: EvidenceTier;
  contributions: CompoundContribution[];
  points: TrajectoryPoint[];
  headline: string;
  detail: string;
  disclaimer: string;
}

// ── Per-compound annual pace reduction (fraction of aging rate removed at full,
//    single-compound effect). Anchored to evidence tier + mechanism strength;
//    intentionally modest so a large stack combines to a plausible ceiling. ──
const PACE_REDUCTION: Record<string, number> = {
  glynac: 0.044,       // Tier A, multi-hallmark human RCTs (Baylor)
  nmn: 0.038,          // NAD+ restoration, human RCTs
  sulforaphane: 0.036, // NRF2 activation, human data
  cakg: 0.036,         // Ca-AKG, mouse lifespan + human pilot
  spermidine: 0.032,   // autophagy induction, cohort epidemiology
  berberine: 0.032,    // AMPK / metabolic
  urolithina: 0.032,   // mitophagy, human RCT
  taurine: 0.030,      // 2023 Science multi-species lifespan
  omega3: 0.030,       // strong cardiovascular outcome data
  fisetin: 0.029,      // senolytic (preclinical strong)
  resveratrol: 0.026,
  pterostilbene: 0.024,
  rala: 0.024,
  coq10: 0.024,
};

const TIER_FALLBACK: Record<EvidenceTier, number> = { A: 0.036, B: 0.026, C: 0.016 };

const RAMP_YEARS = 0.75;          // effects phase in over ~9 months
const REDUCTION_CEILING = 0.3;    // max plausible pace slowing from a stack alone
const MAX_STACK = 10;

function paceReductionFor(id: string): number {
  if (PACE_REDUCTION[id] !== undefined) return PACE_REDUCTION[id];
  const c = compounds.find((x) => x.id === id);
  return TIER_FALLBACK[c?.evidence ?? 'C'];
}

/** ∫₀ᵗ ramp(τ)dτ where ramp rises linearly 0→1 over RAMP_YEARS then holds at 1. */
function rampIntegral(t: number): number {
  if (t <= RAMP_YEARS) return (t * t) / (2 * RAMP_YEARS);
  return RAMP_YEARS / 2 + (t - RAMP_YEARS);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** 0–100 lifestyle vitality from the 5 lifestyle answers (higher = healthier). */
function vitalityScore(i: AgingPaceIntake): number {
  return (
    i.sleep * 0.25 +
    i.exercise * 0.25 +
    i.diet * 0.2 +
    (100 - i.stress) * 0.15 +
    (100 - i.substances) * 0.15
  );
}

export function projectAgingPace(input: AgingPaceInput): AgingPaceResult {
  const { intake } = input;
  const horizonYears = input.horizonYears ?? 10;
  const adherence = Math.max(0, Math.min(1, input.adherence ?? 1));
  const ids = input.stackIds.slice(0, MAX_STACK);

  // ── Baseline (lifestyle-only) pace + current biological age ──
  const vitality = vitalityScore(intake);
  const sexFactor = intake.sex === 'female' ? 0.99 : intake.sex === 'male' ? 1.01 : 1.0;
  const baselinePace = Math.max(
    0.85,
    Math.min(1.18, (1.15 - (vitality / 100) * 0.3) * sexFactor),
  );

  // Reuse the platform's existing biological-age model for the year-0 anchor.
  const defense = calculateDefenseProfile(intake.age, intake.stress, intake.sleep, intake.exercise);
  const currentBioAge = defense.biologicalAge;

  // ── Stack pace reduction (multiplicative → honest diminishing returns) ──
  const logSum = ids.reduce((s, id) => s + -Math.log(1 - paceReductionFor(id) * adherence), 0);
  const rawReduction = 1 - Math.exp(-logSum); // 0..1 before synergy/coverage factors

  const stack = ids.length > 0 ? analyzeStack(ids) : null;
  const synergyScore = stack?.score ?? 0;
  const hallmarkCount = stack?.hallmarkCount ?? 0;
  const evidenceTier = stack?.evidenceTier ?? 'C';

  const synergyFactor = 1 + (synergyScore / 100) * 0.15;     // up to +15%
  const coverageFactor = 1 + (hallmarkCount / 12) * 0.08;    // up to +8%

  const uncapped = rawReduction * synergyFactor * coverageFactor;
  const effectiveStackReduction = Math.min(REDUCTION_CEILING, uncapped);
  const ceilingHit = uncapped > REDUCTION_CEILING;

  // Steady-state (post-ramp) forward pace on the stack.
  const paceOfAging = baselinePace * (1 - effectiveStackReduction);
  const pctSlower = Math.round((1 - paceOfAging) * 100);
  const stackPctSlower = Math.round(effectiveStackReduction * 100);

  const verdict: Verdict =
    paceOfAging <= 0.97 ? 'slowing' : paceOfAging <= 1.03 ? 'on-par' : 'faster';

  // ── Trajectory: chronological, baseline (no stack), on-stack (+ band) ──
  const conservative = effectiveStackReduction * 0.6;
  const optimistic = Math.min(0.42, effectiveStackReduction * 1.35);

  const bioAgeAt = (t: number, reduction: number) =>
    currentBioAge + baselinePace * t - baselinePace * reduction * rampIntegral(t);

  const points: TrajectoryPoint[] = [];
  for (let t = 0; t <= horizonYears; t++) {
    points.push({
      year: t,
      chronoAge: intake.age + t,
      baselineBioAge: round1(bioAgeAt(t, 0)),
      stackBioAge: round1(bioAgeAt(t, effectiveStackReduction)),
      stackBioAgeConservative: round1(bioAgeAt(t, conservative)),
      stackBioAgeOptimistic: round1(bioAgeAt(t, optimistic)),
    });
  }

  const reclaim = (reduction: number) =>
    baselinePace * reduction * rampIntegral(horizonYears);
  const yearsReclaimedByStack = round1(reclaim(effectiveStackReduction));
  const yearsReclaimedRange: [number, number] = [
    round1(reclaim(conservative)),
    round1(reclaim(optimistic)),
  ];
  const yearsVsChronological = round1(
    intake.age + horizonYears - bioAgeAt(horizonYears, effectiveStackReduction),
  );

  // ── Per-compound contributions (log-share so bars sum to the total) ──
  const contributions: CompoundContribution[] = ids
    .map((id) => {
      const c = compounds.find((x) => x.id === id);
      const share = logSum > 0 ? -Math.log(1 - paceReductionFor(id) * adherence) / logSum : 0;
      return {
        id,
        name: c?.name ?? id,
        evidence: c?.evidence ?? 'C',
        paceReductionPct: round1(share * effectiveStackReduction * 100),
      };
    })
    .sort((a, b) => b.paceReductionPct - a.paceReductionPct);

  // ── Narrative (optimistic, coherent, honest) ──
  const { headline, detail } = buildNarrative({
    verdict,
    pctSlower,
    stackPctSlower,
    paceOfAging,
    yearsReclaimedByStack,
    horizonYears,
    stackSize: ids.length,
    currentBioAge,
    age: intake.age,
    topCompound: contributions[0]?.name,
  });

  return {
    chronologicalAge: intake.age,
    currentBioAge,
    paceOfAging: round1(paceOfAging * 100) / 100,
    baselinePace: round1(baselinePace * 100) / 100,
    pctSlower,
    stackPctSlower,
    verdict,
    yearsReclaimedByStack,
    yearsReclaimedRange,
    yearsVsChronological,
    effectiveStackReduction,
    ceilingHit,
    rampMonths: Math.round(RAMP_YEARS * 12),
    horizonYears,
    synergyScore,
    hallmarkCount,
    evidenceTier,
    contributions,
    points,
    headline,
    detail,
    disclaimer:
      'Educational model — not a medical prediction. Pace-of-aging estimates are derived from ' +
      'published effect sizes and TNiC evidence tiers, then combined with diminishing returns. ' +
      'Individual results vary; supplements are not a substitute for lifestyle or medical care.',
  };
}

function buildNarrative(o: {
  verdict: Verdict;
  pctSlower: number;
  stackPctSlower: number;
  paceOfAging: number;
  yearsReclaimedByStack: number;
  horizonYears: number;
  stackSize: number;
  currentBioAge: number;
  age: number;
  topCompound?: string;
}): { headline: string; detail: string } {
  if (o.stackSize === 0) {
    return {
      headline: 'Add your supplements to project your pace of aging.',
      detail:
        `On your current lifestyle alone, your biological age is modeled at ${o.currentBioAge} ` +
        `against a chronological age of ${o.age}. Enter up to 10 supplements to see how much ` +
        `your stack bends that curve.`,
    };
  }

  const reclaimed = o.yearsReclaimedByStack;
  const pace = o.paceOfAging.toFixed(2);
  const led = o.topCompound ? `, led by ${o.topCompound},` : '';
  // The stack's own contribution is the optimistic through-line in every verdict.
  const stackLine =
    `Your stack${led} accounts for about ${o.stackPctSlower}% slower aging on its own — a modeled ` +
    `~${reclaimed} biological years reclaimed over ${o.horizonYears} years versus the same ` +
    `lifestyle without it.`;

  if (o.verdict === 'slowing') {
    return {
      headline: `You're aging at ${pace}× — about ${o.pctSlower}% slower than the calendar.`,
      detail:
        `${stackLine} Stay consistent and you pull further ahead of your chronological age every year.`,
    };
  }
  if (o.verdict === 'on-par') {
    return {
      headline: `You're aging at ${pace}× — right in step with the calendar.`,
      detail:
        `${stackLine} You're tracking near your chronological age today; tightening sleep, training, ` +
        `or adding one more Tier-A compound tips you into net-younger territory.`,
    };
  }
  return {
    headline: `You're aging at ${pace}× — and your stack is pulling that back toward parity.`,
    detail:
      `${stackLine} Lifestyle factors are still setting a fast baseline, so the biggest next win is ` +
      `hiding in the sleep, training, and stress levers from your intake.`,
  };
}
