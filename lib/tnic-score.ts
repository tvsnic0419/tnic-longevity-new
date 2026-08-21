/**
 * TNiC Score — a single, deterministic, *derived* composite score per compound.
 *
 * The site already carries three overlapping evidence systems (see
 * NOTES-COMPOUND-LIBRARY.md); this module does NOT invent a fourth dataset. It
 * is a thin, transparent *reader* that layers the existing sources by richness
 * and normalizes them into one consistent 0–100 presentation so every compound
 * page can show the same proprietary "TNiC SCORE" shape:
 *
 *   1. Elite-8 LQ model   (lib/elite-8-data.ts)      → 8-dimension weighted
 *      composite, the site's most formal scoring model. Highest confidence.
 *   2. Compound Engine     (lib/compound-engine-data.ts) → curated effect /
 *      bioavailability / safety magnitudes + tier + study count. Medium.
 *   3. Canonical Compound  (lib/data.ts)             → evidence tier, indexed
 *      study count, published bioavailability, hallmark breadth. Limited — the
 *      widest coverage, but the thinnest per-dimension detail.
 *
 * Nothing here is a health claim. `confidence` reflects *data completeness*,
 * not clinical certainty, and any dimension a source cannot support is returned
 * as `null` ("insufficient evidence") rather than guessed. Server-safe (pure
 * data + math, no client imports), mirroring lib/platform-stats.ts.
 */

import { compounds } from './data';
import type { Compound, EvidenceTier } from './types';
import {
  ELITE_8_COMPOUNDS,
  calcLQScore,
  type LQCompound,
} from './elite-8-data';
import { CDB, type Compound as EngineCompound } from './compound-engine-data';

export type TnicScoreConfidence = 'high' | 'moderate' | 'limited';
export type TnicScoreSource = 'lq' | 'engine' | 'canonical';

/** The six canonical dimensions rendered consistently across every scorecard. */
export type TnicDimensionKey =
  | 'humanEvidence'
  | 'clinicalEvidence'
  | 'mechanisticStrength'
  | 'safety'
  | 'bioavailability'
  | 'longevityRelevance';

export interface TnicDimension {
  key: TnicDimensionKey;
  label: string;
  /** 0–100, or null when the underlying source cannot support the dimension. */
  value: number | null;
  /** Short, honest description of what the dimension reflects. */
  note: string;
}

export interface TnicScore {
  compoundId: string;
  compoundName: string;
  /** 0–100 composite, or null when no source can score the compound. */
  score: number | null;
  /** Canonical evidence tier (A/B/C) where one exists; drives the tier label. */
  tier: EvidenceTier | null;
  confidence: TnicScoreConfidence;
  source: TnicScoreSource;
  dimensions: TnicDimension[];
  /** Count of hallmarks of aging the compound targets (0 when unknown). */
  hallmarkCount: number;
  /** Transparent, one-line methodology note for the provenance disclosure. */
  methodologyNote: string;
}

export const DIMENSION_META: Record<TnicDimensionKey, { label: string; note: string }> = {
  humanEvidence: {
    label: 'Human evidence',
    note: 'Strength of human data — evidence tier weighted by indexed study depth.',
  },
  clinicalEvidence: {
    label: 'Clinical evidence',
    note: 'Controlled-trial quality: RCT presence and clinical-endpoint depth.',
  },
  mechanisticStrength: {
    label: 'Mechanistic strength',
    note: 'Magnitude of the biological effect through its characterized pathway.',
  },
  safety: {
    label: 'Safety',
    note: 'Tolerability and adverse-event profile at studied doses.',
  },
  bioavailability: {
    label: 'Bioavailability',
    note: 'Absorption and delivery — published oral bioavailability where available.',
  },
  longevityRelevance: {
    label: 'Longevity relevance',
    note: 'Breadth of coverage across the 12 hallmarks of aging.',
  },
};

/** Composite weighting for the engine / canonical paths (normalized over the
 *  dimensions a compound can actually support). The LQ path keeps its own
 *  branded weighted composite instead. */
const DIMENSION_WEIGHT: Record<TnicDimensionKey, number> = {
  humanEvidence: 0.28,
  clinicalEvidence: 0.22,
  mechanisticStrength: 0.18,
  safety: 0.12,
  bioavailability: 0.1,
  longevityRelevance: 0.1,
};

const clamp = (n: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, Math.round(n)));

const TIER_BASE: Record<'A' | 'B' | 'C' | 'D', number> = { A: 90, B: 72, C: 54, D: 38 };

/** Diminishing-returns signal from raw indexed study count (log-scaled). */
function studiesSignal(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return clamp(30 + 26 * Math.log10(n + 1));
}

/** Hallmark coverage breadth → 0–100 (out of the 12 hallmarks of aging). */
function hallmarkBreadth(count: number): number {
  if (!Number.isFinite(count) || count <= 0) return 0;
  return clamp(35 + count * 11);
}

function dim(key: TnicDimensionKey, value: number | null): TnicDimension {
  return { key, value, label: DIMENSION_META[key].label, note: DIMENSION_META[key].note };
}

/** Weighted mean over the dimensions that have a value, weights renormalized. */
function compositeFrom(dimensions: TnicDimension[]): number | null {
  let weighted = 0;
  let weightSum = 0;
  for (const d of dimensions) {
    if (d.value == null) continue;
    const w = DIMENSION_WEIGHT[d.key];
    weighted += d.value * w;
    weightSum += w;
  }
  if (weightSum === 0) return null;
  return clamp(weighted / weightSum);
}

const lqById = new Map<string, LQCompound>(ELITE_8_COMPOUNDS.map((c) => [c.id, c]));
const canonicalById = new Map<string, Compound>(compounds.map((c) => [c.id, c]));

/**
 * A handful of ids diverge across the three namespaces. The canonical library
 * id is the key we score against everywhere else; map it to the LQ id where the
 * Elite-8 model spells it differently so those richer scores still resolve.
 */
const LQ_ID_BY_COMPOUND: Record<string, string> = {
  glynac: 'glycine_nac',
  // The Elite-8 `resveratrol_pterostilbene` entry is the *pterostilbene* profile
  // (methylated analog, ~4× bioavailability). Only pterostilbene maps to it;
  // resveratrol keeps its own, accurate engine magnitudes (low bioavailability).
  pterostilbene: 'resveratrol_pterostilbene',
};

const ENGINE_ID_BY_COMPOUND: Record<string, string> = {
  cakg: 'caakg',
};

function scoreFromLQ(id: string, name: string, lq: LQCompound, tier: EvidenceTier | null, hallmarkCount: number): TnicScore {
  // The LQ dimensions (0–10) map onto the six canonical dimensions. The headline
  // number stays the real, branded LQ composite (calcLQScore) — the per-dimension
  // bars are the transparent breakdown of that same model.
  const x10 = (v: number) => clamp(v * 10);
  const dimensions: TnicDimension[] = [
    dim('humanEvidence', clamp(lq.CE * 6 + lq.HP * 4)),
    dim('clinicalEvidence', x10(lq.CE)),
    dim('mechanisticStrength', clamp(lq.ES * 6 + lq.EE * 4)),
    // Safety net of the risk penalty (R is on the same 0–10 scale, subtracted).
    dim('safety', clamp((lq.SF - lq.R * 0.5) * 10)),
    dim('bioavailability', x10(lq.BV)),
    dim('longevityRelevance', clamp(lq.EE * 6 + hallmarkBreadth(hallmarkCount) * 0.4)),
  ];
  return {
    compoundId: id,
    compoundName: name,
    score: clamp(calcLQScore(lq)),
    tier,
    confidence: 'high',
    source: 'lq',
    dimensions,
    hallmarkCount,
    methodologyNote:
      'Derived from the TNiC LQ model — eight evidence dimensions weighted by clinical strength, effect size, safety, and bioavailability.',
  };
}

function scoreFromEngine(id: string, name: string, e: EngineCompound, tier: EvidenceTier | null, hallmarkCount: number): TnicScore {
  const studies = studiesSignal(e.studies);
  const tierScore = TIER_BASE[e.tier];
  const dimensions: TnicDimension[] = [
    dim('humanEvidence', clamp(tierScore * 0.65 + studies * 0.35)),
    dim('clinicalEvidence', e.rct ? clamp(tierScore * 0.7 + studies * 0.3) : clamp(tierScore * 0.5)),
    dim('mechanisticStrength', clamp(e.effect)),
    dim('safety', clamp(e.safety)),
    dim('bioavailability', clamp(e.bioavail)),
    dim('longevityRelevance', hallmarkBreadth(hallmarkCount || e.hallmarks.length)),
  ];
  return {
    compoundId: id,
    compoundName: name,
    score: compositeFrom(dimensions),
    tier,
    confidence: 'moderate',
    source: 'engine',
    dimensions,
    hallmarkCount: hallmarkCount || e.hallmarks.length,
    methodologyNote:
      'Derived from TNiC’s mechanistic engine — curated effect, bioavailability, and safety magnitudes anchored to the compound’s evidence tier and study base.',
  };
}

function scoreFromCanonical(c: Compound, hallmarkCount: number): TnicScore {
  const studies = studiesSignal(c.studies?.length ?? 0);
  const tierScore = TIER_BASE[c.evidence];
  const dimensions: TnicDimension[] = [
    dim('humanEvidence', clamp(tierScore * 0.7 + studies * 0.3)),
    // Canonical data carries only a single blended tier, so we do not split out a
    // separate clinical-evidence or mechanistic/safety magnitude we cannot source.
    dim('clinicalEvidence', null),
    dim('mechanisticStrength', null),
    dim('safety', null),
    dim('bioavailability', c.bioavailability != null ? clamp(c.bioavailability) : null),
    dim('longevityRelevance', hallmarkBreadth(hallmarkCount)),
  ];
  return {
    compoundId: c.id,
    compoundName: c.name,
    score: compositeFrom(dimensions),
    tier: c.evidence,
    confidence: 'limited',
    source: 'canonical',
    dimensions,
    hallmarkCount,
    methodologyNote:
      'Derived from the compound’s published evidence tier, indexed study count, and hallmark coverage. Per-dimension detail is limited for this compound.',
  };
}

/**
 * Compute the TNiC Score for a compound id (canonical library id). Returns the
 * richest scoring available; `null` score only when the id resolves to no
 * scored source at all.
 */
export function computeTnicScore(compoundId: string): TnicScore {
  const canonical = canonicalById.get(compoundId);
  const name = canonical?.name ?? compoundId;
  const tier: EvidenceTier | null = canonical?.evidence ?? null;
  const hallmarkCount = canonical?.hallmarks?.length ?? 0;

  const lq = lqById.get(LQ_ID_BY_COMPOUND[compoundId] ?? compoundId);
  if (lq) return scoreFromLQ(compoundId, name, lq, tier ?? lq.evidenceTier ?? null, hallmarkCount);

  const engine = CDB[ENGINE_ID_BY_COMPOUND[compoundId] ?? compoundId];
  if (engine) {
    // Prefer the canonical A/B/C tier; the engine's 'D' tier has no canonical
    // equivalent, so fall back to no tier badge rather than inventing one.
    const engineTier: EvidenceTier | null = tier ?? (engine.tier === 'D' ? null : engine.tier);
    return scoreFromEngine(compoundId, name, engine, engineTier, hallmarkCount);
  }

  if (canonical) return scoreFromCanonical(canonical, hallmarkCount);

  return {
    compoundId,
    compoundName: name,
    score: null,
    tier,
    confidence: 'limited',
    source: 'canonical',
    dimensions: (Object.keys(DIMENSION_META) as TnicDimensionKey[]).map((k) => dim(k, null)),
    hallmarkCount,
    methodologyNote: 'No scored evidence source is available for this compound yet.',
  };
}

export const CONFIDENCE_META: Record<TnicScoreConfidence, { label: string; description: string }> = {
  high: {
    label: 'High confidence',
    description: 'Scored on the full TNiC LQ evidence model.',
  },
  moderate: {
    label: 'Moderate confidence',
    description: 'Scored on curated mechanistic magnitudes and evidence tier.',
  },
  limited: {
    label: 'Limited confidence',
    description: 'Scored on evidence tier and study depth; some dimensions unavailable.',
  },
};

/** Bucket a composite score into a qualitative band for color / label. */
export type TnicScoreBand = 'exceptional' | 'strong' | 'moderate' | 'emerging';

export function scoreBand(score: number | null): TnicScoreBand | null {
  if (score == null) return null;
  if (score >= 80) return 'exceptional';
  if (score >= 65) return 'strong';
  if (score >= 50) return 'moderate';
  return 'emerging';
}
