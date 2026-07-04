/**
 * TNiC Mechanistic Stack Engine
 * ─────────────────────────────
 * One transparent scoring model that replaces the old presence/absence math.
 * Every term maps to a real mechanism, and nothing here claims clinical
 * precision it can't back — outputs are modeled heuristics, surfaced with
 * their reasoning so users can see *why*, not just a number.
 *
 * Terms:
 *  1. Evidence weight     — Tier A (human RCT) > B (pilot/mechanistic) > C (preclinical)
 *  2. Bioavailability     — fraction reaching circulation scales a compound's effect
 *  3. Pathway saturation  — within one axis, the 1st compound counts fully, the
 *                           2nd at 60%, 3rd at 36%… (receptor/pathway ceilings)
 *  4. Breadth             — distinct pathway axes covered are rewarded
 *  5. Emergent synergy     — authored multi-compound combos add a bonus
 *  6. Antagonism/redundancy — competing or duplicative pairs subtract
 *  7. Coverage depth      — a hallmark hit by two Tier-A compounds > one Tier-C
 *  8. Bio-age modifier     — a bounded, labeled projected-age reduction
 */

import { compounds } from './data';
import type { EvidenceTier } from './types';
import { pathwayGroups, emergentEffects } from './relations';

/**
 * Compound → hallmark mapping, derived from pathway axes + emergent effects.
 * Self-contained here so the engine doesn't depend on helpers that live
 * elsewhere (or get refactored away).
 */
function getCompoundsForHallmark(hallmarkId: string): string[] {
  const ids = new Set<string>();
  // Primary source: each compound's own curated hallmark targets. Every compound
  // has these, so nothing is invisible even if the pathway-axis data omits it.
  compounds.forEach((c) => {
    if (c.hallmarks?.includes(hallmarkId)) ids.add(c.id);
  });
  // Enrich with mechanistic pathway-axis and emergent-effect membership.
  pathwayGroups
    .filter((g) => g.hallmarkIds.includes(hallmarkId))
    .forEach((g) => g.compoundIds.forEach((c) => ids.add(c)));
  emergentEffects
    .filter((e) => e.hallmarkIds.includes(hallmarkId))
    .forEach((e) => e.compoundIds.forEach((c) => ids.add(c)));
  return Array.from(ids);
}

// ─── Tunable constants (documented, not magic) ──────────────────────────────

/** Human-RCT evidence contributes full weight; preclinical is discounted. */
const EVIDENCE_WEIGHT: Record<EvidenceTier, number> = { A: 1, B: 0.7, C: 0.45 };

/** Within-axis diminishing returns: contribution_n = base × DECAY^n. */
const SATURATION_DECAY = 0.6;

/** Reward per additional distinct pathway axis engaged. */
const BREADTH_WEIGHT = 0.4;

/** Scales authored emergent-effect multipliers into score points. */
const SYNERGY_SCALE = 0.8;

/** Softening constant for raw→0-100 mapping (calibrated, see tests). */
const SCALE_K = 5.9;

/** Maximum modeled biological-age reduction a perfect stack can imply (years). */
const MAX_BIOAGE_REDUCTION = 5;

const HALLMARK_LABEL: Record<string, string> = {
  genomic: 'Genomic instability',
  telomeres: 'Telomere attrition',
  epigenetic: 'Epigenetic alterations',
  proteostasis: 'Loss of proteostasis',
  autophagy: 'Disabled macroautophagy',
  mito: 'Mitochondrial dysfunction',
  senescence: 'Cellular senescence',
  stem: 'Stem cell exhaustion',
  communication: 'Altered intercellular communication',
  inflammation: 'Chronic inflammation',
  dysbiosis: 'Dysbiosis',
  nutrient: 'Deregulated nutrient sensing',
};

const ALL_HALLMARK_IDS = Object.keys(HALLMARK_LABEL);

/**
 * Curated antagonism / redundancy pairs. Small and conservative — mechanistic
 * saturation already discounts same-pathway stacking, so this only flags real
 * competition or high-dose caution overlaps.
 */
const CAUTION_PAIRS: { a: string; b: string; kind: 'antagonism' | 'redundancy'; detail: string }[] = [
  {
    a: 'sulforaphane',
    b: 'rala',
    kind: 'redundancy',
    detail:
      'Both drive a strong electrophilic/antioxidant load through overlapping NRF2 chemistry — stacking high doses adds little beyond the first and can blunt hormetic signaling.',
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PathwayLoad {
  id: string;
  name: string;
  accent: string;
  compoundIds: string[];
  /** 0–1 how saturated this axis is (diminishing returns applied). */
  saturation01: number;
}

export interface HallmarkDepth {
  hallmarkId: string;
  label: string;
  /** 0–1 weighted coverage depth (evidence × bioavailability, saturating). */
  depth01: number;
  contributors: string[];
}

export interface StackBonus {
  id: string;
  title: string;
  kind: 'synergy' | 'breadth';
  detail: string;
  deltaPts: number;
}

export interface StackPenalty {
  id: string;
  title: string;
  kind: 'antagonism' | 'redundancy';
  detail: string;
  deltaPts: number;
}

export interface StackScore {
  /** Headline mechanistic quality, 0–100. */
  overall: number;
  /** Alias of overall — legacy `score` consumers. */
  synergy: number;
  /** Binary hallmarks-covered %, kept for backward-compatible display. */
  coveragePct: number;
  /** Weighted coverage depth %, the richer metric. */
  coverageDepthPct: number;
  /** Distinct pathway axes engaged. */
  breadth: number;
  pathwayLoad: PathwayLoad[];
  hallmarkDepth: HallmarkDepth[];
  bonuses: StackBonus[];
  penalties: StackPenalty[];
  /** Modeled biological-age reduction (years younger), bounded. */
  bioAgeDelta: number;
  evidenceMix: { A: number; B: number; C: number };
  explanation: string[];
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

const compoundById = new Map(compounds.map((c) => [c.id, c]));

/** Fraction of a dose reaching circulation, floored so nothing is worthless. */
export function bioavailabilityFactor(bioavailability: number): number {
  return 0.55 + 0.45 * Math.min(1, Math.max(0, bioavailability / 100));
}

/** A single compound's mechanistic contribution: evidence × bioavailability. */
export function compoundContribution(compoundId: string): number {
  const c = compoundById.get(compoundId);
  if (!c) return 0;
  return EVIDENCE_WEIGHT[c.evidence] * bioavailabilityFactor(c.bioavailability);
}

/** Diminishing-returns sum: sort desc, weight by DECAY^n. */
function saturatingSum(contributions: number[]): number {
  return [...contributions]
    .sort((a, b) => b - a)
    .reduce((sum, v, i) => sum + v * SATURATION_DECAY ** i, 0);
}

// ─── The engine ────────────────────────────────────────────────────────────────

export function scoreStack(compoundIds: string[]): StackScore {
  const ids = [...new Set(compoundIds)].filter((id) => compoundById.has(id));

  if (ids.length === 0) {
    return {
      overall: 0,
      synergy: 0,
      coveragePct: 0,
      coverageDepthPct: 0,
      breadth: 0,
      pathwayLoad: [],
      hallmarkDepth: ALL_HALLMARK_IDS.map((h) => ({
        hallmarkId: h,
        label: HALLMARK_LABEL[h],
        depth01: 0,
        contributors: [],
      })),
      bonuses: [],
      penalties: [],
      bioAgeDelta: 0,
      evidenceMix: { A: 0, B: 0, C: 0 },
      explanation: ['No compounds selected — add compounds to model stack mechanics.'],
    };
  }

  // 1. Pathway saturation across the 7 mechanistic axes.
  const pathwayLoad: PathwayLoad[] = [];
  let pathwaySaturationSum = 0;
  for (const group of pathwayGroups) {
    const inAxis = ids.filter((id) => group.compoundIds.includes(id));
    if (inAxis.length === 0) continue;
    const decayed = saturatingSum(inAxis.map(compoundContribution));
    pathwaySaturationSum += decayed;
    // Normalize per-axis: a single top-tier compound ≈ 0.96; the sum saturates.
    const saturation01 = Math.min(1, decayed / 2.2);
    pathwayLoad.push({
      id: group.id,
      name: group.name,
      accent: group.accent,
      compoundIds: inAxis,
      saturation01,
    });
  }

  // Credit compounds not captured by any curated pathway axis (via their own
  // contribution) so every selected compound counts — the axis data doesn't
  // enumerate every compound, and a Tier-A pick must never score zero.
  const axisCompoundIds = new Set(pathwayLoad.flatMap((a) => a.compoundIds));
  pathwaySaturationSum += saturatingSum(
    ids.filter((id) => !axisCompoundIds.has(id)).map(compoundContribution),
  );

  // 2. Breadth — reward distinct axes engaged.
  const breadth = pathwayLoad.length;
  const breadthBonusPts = breadth * BREADTH_WEIGHT;

  // 3. Emergent synergy bonuses (full or partial combo presence).
  const bonuses: StackBonus[] = [];
  for (const effect of emergentEffects) {
    const present = effect.compoundIds.filter((c) => ids.includes(c));
    if (present.length < 2) continue;
    const completeness = present.length / effect.compoundIds.length;
    const evidenceW = EVIDENCE_WEIGHT[effect.evidence];
    const delta = (effect.synergyMultiplier - 1) * evidenceW * SYNERGY_SCALE * completeness;
    if (delta <= 0) continue;
    bonuses.push({
      id: effect.id,
      title: effect.title,
      kind: 'synergy',
      detail:
        completeness === 1
          ? effect.tagline
          : `${effect.tagline} — partial (${present.length}/${effect.compoundIds.length} present).`,
      deltaPts: delta,
    });
  }
  if (breadth >= 4) {
    bonuses.push({
      id: 'breadth-bonus',
      title: `${breadth}-axis coverage`,
      kind: 'breadth',
      detail: 'Engaging multiple independent aging pathways compounds resilience beyond any single axis.',
      deltaPts: breadthBonusPts,
    });
  }
  const synergyBonusSum = bonuses
    .filter((b) => b.kind === 'synergy')
    .reduce((s, b) => s + b.deltaPts, 0);

  // 4. Antagonism / redundancy penalties.
  const penalties: StackPenalty[] = [];
  for (const pair of CAUTION_PAIRS) {
    if (ids.includes(pair.a) && ids.includes(pair.b)) {
      const nameA = compoundById.get(pair.a)?.name ?? pair.a;
      const nameB = compoundById.get(pair.b)?.name ?? pair.b;
      penalties.push({
        id: `${pair.a}-${pair.b}`,
        title: `${nameA} + ${nameB}`,
        kind: pair.kind,
        detail: pair.detail,
        deltaPts: 0.5,
      });
    }
  }
  const penaltySum = penalties.reduce((s, p) => s + p.deltaPts, 0);

  // 5. Raw → 0–100 via saturating map.
  const raw = pathwaySaturationSum + breadthBonusPts + synergyBonusSum - penaltySum;
  const overall = Math.round(100 * (1 - Math.exp(-Math.max(0, raw) / SCALE_K)));

  // 6. Coverage depth per hallmark (weighted, not binary).
  const hallmarkDepth: HallmarkDepth[] = ALL_HALLMARK_IDS.map((hallmarkId) => {
    const targeting = new Set(getCompoundsForHallmark(hallmarkId));
    const contributors = ids.filter((id) => targeting.has(id));
    const weighted = saturatingSum(contributors.map(compoundContribution));
    const depth01 = 1 - Math.exp(-weighted / 1.4);
    return { hallmarkId, label: HALLMARK_LABEL[hallmarkId], depth01, contributors };
  });
  const coverageDepthMean =
    hallmarkDepth.reduce((s, h) => s + h.depth01, 0) / hallmarkDepth.length;
  const coverageDepthPct = Math.round(coverageDepthMean * 100);

  // Binary coverage (backward-compatible): any compound present on a hallmark.
  const coveredCount = ALL_HALLMARK_IDS.filter((h) => {
    const targeting = new Set(getCompoundsForHallmark(h));
    return ids.some((id) => targeting.has(id));
  }).length;
  const coveragePct = Math.round((coveredCount / ALL_HALLMARK_IDS.length) * 100);

  // 7. Evidence mix.
  const evidenceMix = ids.reduce(
    (acc, id) => {
      const tier = compoundById.get(id)!.evidence;
      acc[tier] += 1;
      return acc;
    },
    { A: 0, B: 0, C: 0 } as { A: number; B: number; C: number },
  );

  // 8. Bounded, modeled bio-age reduction.
  const breadth01 = Math.min(1, breadth / 6);
  const stackQuality01 = 0.5 * coverageDepthMean + 0.35 * (overall / 100) + 0.15 * breadth01;
  const bioAgeDelta = Math.round(MAX_BIOAGE_REDUCTION * stackQuality01 * 10) / 10;

  // Reasoning lines.
  const explanation: string[] = [];
  explanation.push(
    `${ids.length} compound${ids.length > 1 ? 's' : ''} across ${breadth} pathway ${breadth === 1 ? 'axis' : 'axes'} (${evidenceMix.A} Tier-A · ${evidenceMix.B} Tier-B · ${evidenceMix.C} Tier-C).`,
  );
  const topGaps = [...hallmarkDepth]
    .sort((a, b) => a.depth01 - b.depth01)
    .slice(0, 3)
    .filter((h) => h.depth01 < 0.25);
  if (topGaps.length) {
    explanation.push(
      `Thinnest coverage: ${topGaps.map((g) => g.label).join(', ')} — add a compound here to raise depth.`,
    );
  }
  if (synergyBonusSum > 0) {
    explanation.push(
      `${bonuses.filter((b) => b.kind === 'synergy').length} emergent synergy combo(s) active, amplifying effect beyond additive.`,
    );
  }
  if (penalties.length) {
    explanation.push(
      `${penalties.length} redundancy/antagonism flag(s) — trimming can sharpen the stack without losing coverage.`,
    );
  }
  explanation.push(
    `Modeled biological-age impact: ${bioAgeDelta > 0 ? `−${bioAgeDelta} years` : 'negligible'} (heuristic, not a diagnostic).`,
  );

  return {
    overall,
    synergy: overall,
    coveragePct,
    coverageDepthPct,
    breadth,
    pathwayLoad,
    hallmarkDepth,
    bonuses,
    penalties,
    bioAgeDelta,
    evidenceMix,
    explanation,
  };
}

/** Convenience: modeled years-younger from a stack (bounded). */
export function bioAgeModifierYears(compoundIds: string[]): number {
  return scoreStack(compoundIds).bioAgeDelta;
}
