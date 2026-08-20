/**
 * Combination Lab engine — progressive combination analysis for TNiC stacks.
 *
 * Pure TypeScript: no React, no browser APIs, no side effects on import.
 * All relationship claims are derived from the curated TNiC dataset
 * (`lib/data.ts` + `lib/stack-analysis.ts`); nothing is duplicated here.
 *
 * Honesty contract: an edge is `demonstrated: true` ONLY when it comes from
 * the curated `stackInteractions` list, the curated `synergyPairMatrix`, or a
 * declared `synergies` pairing in the dataset. Everything inferred from
 * pathway/hallmark ontology overlap is a mechanistic hypothesis
 * (`demonstrated: false`) and always carries HYPOTHESIS_LABEL.
 */
import { compounds } from './data';
import { hallmarkLibrary } from './hallmarks-library';
import {
  stackInteractions,
  synergyPairMatrix,
  compoundBaseScores,
  hallmarkDisplayNames,
} from './stack-analysis';
import type { Compound, EvidenceTier } from './types';

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */

/** Mandatory disclosure on every ontology-derived edge or panel. */
export const HYPOTHESIS_LABEL = 'Mechanistic hypothesis — not demonstrated in humans.';
/** Disclosure for pairs with no curated or ontological basis at all. */
export const UNCERTAIN_LABEL = 'Insufficient curated data for this pair.';

/* ------------------------------------------------------------------ */
/* Biological systems (hallmarks are the grouping layer)               */
/* ------------------------------------------------------------------ */

export interface LabSystem {
  id: string;
  label: string;
}

/** The biological systems the Lab groups by — derived from the canonical
 *  12-hallmark library (`lib/hallmarks-library.ts`), not the smaller
 *  11-entry display map in `lib/stack-analysis.ts`. That map is missing
 *  `dysbiosis`, which several real compounds are tagged with — sourcing from
 *  the full library means every hallmark a compound can carry gets a real,
 *  already-authored label instead of silently falling back to the raw id. */
export const LAB_SYSTEMS: LabSystem[] = hallmarkLibrary
  .map((h) => ({ id: h.id, label: h.title }))
  .sort((a, b) => a.label.localeCompare(b.label));

const hallmarkTitleById = new Map<string, string>(hallmarkLibrary.map((h) => [h.id, h.title]));

/** Display name for a hallmark id — the canonical library first, the
 *  smaller display map second, the raw id as a last resort for anything
 *  neither source names. */
export function hallmarkLabel(id: string): string {
  return hallmarkTitleById.get(id) ?? hallmarkDisplayNames[id] ?? id;
}

/* ------------------------------------------------------------------ */
/* Compound access + adapters                                          */
/* ------------------------------------------------------------------ */

const compoundById = new Map<string, Compound>(compounds.map((c) => [c.id, c]));

/** Dataset lookup by id (undefined for unknown ids — callers filter). */
export function getLabCompound(id: string): Compound | undefined {
  return compoundById.get(id);
}

/** Flattened per-compound view the graph and panels consume. */
export interface LabNode {
  id: string;
  name: string;
  pathway: string;
  tier: EvidenceTier;
  hallmarks: string[];
  dose: string;
  timing: Compound['timing'];
  /** Curated 1–10 base strength (tier-derived fallback for unlisted ids). */
  baseScore: number;
  studyCount: number;
}

/** Tier-derived fallback matching the platform's existing convention. */
export function compoundBaseScore(c: Compound): number {
  return compoundBaseScores[c.id] ?? (c.evidence === 'A' ? 8 : c.evidence === 'B' ? 7 : 6);
}

export function compoundToLabNode(c: Compound): LabNode {
  return {
    id: c.id,
    name: c.name,
    pathway: c.pathway,
    tier: c.evidence,
    hallmarks: c.hallmarks,
    dose: c.dose,
    timing: c.timing,
    baseScore: compoundBaseScore(c),
    studyCount: c.studies.length,
  };
}

/* ------------------------------------------------------------------ */
/* Relationship model                                                  */
/* ------------------------------------------------------------------ */

export type RelationshipType =
  | 'synergy'
  | 'complementary'
  | 'additive'
  | 'redundancy'
  | 'antagonism'
  | 'interaction'
  | 'uncertain';

export const RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  'synergy',
  'complementary',
  'additive',
  'redundancy',
  'interaction',
  'antagonism',
  'uncertain',
];

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  synergy: 'Synergy',
  complementary: 'Complementary',
  additive: 'Additive',
  redundancy: 'Redundancy',
  interaction: 'Interaction caution',
  antagonism: 'Antagonism',
  uncertain: 'Uncertain',
};

export type LabConfidence = 'high' | 'moderate' | 'low';

export type RedundancyGrade = 'useful-overlap' | 'excessive';

/** Provenance of an edge — drives the demonstrated-vs-hypothesis banner. */
export type RelationshipSource =
  | 'curated-interaction'
  | 'curated-matrix'
  | 'declared-synergy'
  | 'pathway-ontology'
  | 'hallmark-ontology'
  | 'none';

export interface LabRelationship {
  /** Compound ids, sorted for stable keying. */
  pair: [string, string];
  type: RelationshipType;
  confidence: LabConfidence;
  /** True ONLY for curated/dataset-declared edges — never for ontology. */
  demonstrated: boolean;
  title: string;
  detail: string;
  /** Shared normalized pathway label, when the pair converges on one. */
  sharedPathway: string | null;
  sharedHallmarks: string[];
  /** Curated severity when sourced from stackInteractions. */
  severity: 'low' | 'medium' | 'high' | null;
  redundancyGrade: RedundancyGrade | null;
  /** Limitation text — HYPOTHESIS_LABEL / UNCERTAIN_LABEL / null. */
  limitation: string | null;
  source: RelationshipSource;
}

/** Stable undirected pair key. */
export function pairKey(a: string, b: string): string {
  return [a, b].sort().join('::');
}

function curatedPairInteraction(aId: string, bId: string) {
  return stackInteractions.find(
    (i) =>
      (i.compoundIds[0] === aId && i.compoundIds[1] === bId) ||
      (i.compoundIds[0] === bId && i.compoundIds[1] === aId),
  );
}

function matrixPairScore(aId: string, bId: string): number | undefined {
  return synergyPairMatrix[aId]?.[bId] ?? synergyPairMatrix[bId]?.[aId];
}

/* ---------------- pathway normalization ---------------- */

const PATHWAY_STOPWORDS = new Set([
  'the', 'a', 'an', 'of', 'and', 'to', 'via', 'for', 'in', 'on', 'with',
  'activation', 'support', 'induction', 'restoration', 'modulation',
  'proposed', 'mechanism', 'pathway', 'multi',
]);

/** Token synonyms so dataset spellings like "SIRT1" and "Sirtuin" converge. */
const PATHWAY_SYNONYMS: Record<string, string> = {
  sirt1: 'sirtuin',
  sirtuins: 'sirtuin',
  'nad+': 'nad',
  nadh: 'nad',
};

function pathwayTokens(pathway: string): string[] {
  const tokens = pathway
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter(Boolean)
    .map((t) => PATHWAY_SYNONYMS[t] ?? t)
    .filter((t) => !PATHWAY_STOPWORDS.has(t));
  return [...new Set(tokens)].sort();
}

function pathwayKey(pathway: string): string {
  return pathwayTokens(pathway).join(' ');
}

/** True when two pathway strings describe the same axis — exact match, or
 *  Jaccard token overlap >= 0.5 after normalization. */
function samePathway(a: Compound, b: Compound): boolean {
  if (a.pathway.trim().toLowerCase() === b.pathway.trim().toLowerCase()) return true;
  const ka = pathwayTokens(a.pathway);
  const kb = pathwayTokens(b.pathway);
  if (ka.length === 0 || kb.length === 0) return false;
  const inter = ka.filter((t) => kb.includes(t)).length;
  const union = new Set([...ka, ...kb]).size;
  return inter / union >= 0.5;
}

/* ---------------- pair classification ---------------- */

/**
 * Classify one pair. Precedence:
 *  (a) curated stackInteractions — synergy / interaction (caution) /
 *      antagonism (contraindication); duplication-titled cautions become
 *      `redundancy` (e.g. "Redundant SIRT1 activation");
 *  (b) curated synergyPairMatrix — >= 8 synergy, 6–7 additive;
 *  (b2) dataset-declared `synergies` pairing — synergy, moderate confidence;
 *  (c) same pathway — redundancy (graded) unless hallmarks are disjoint
 *      (then complementary);
 *  (d) shared hallmarks on different pathways — complementary (>= 2 shared)
 *      or additive (1 shared);
 *  (e) nothing — uncertain.
 */
export function computePairRelationship(aId: string, bId: string): LabRelationship | null {
  const a = compoundById.get(aId);
  const b = compoundById.get(bId);
  if (!a || !b || aId === bId) return null;

  const pair: [string, string] = [aId, bId].sort() as [string, string];
  const sharedHallmarks = a.hallmarks.filter((h) => b.hallmarks.includes(h));
  const pathwayShared = samePathway(a, b);
  const sharedPathway = pathwayShared ? a.pathway : null;
  const base = { pair, sharedPathway, sharedHallmarks };

  /* (a) curated interactions */
  const curated = curatedPairInteraction(aId, bId);
  if (curated) {
    if (curated.type === 'synergy') {
      return {
        ...base,
        type: 'synergy',
        confidence: 'high',
        demonstrated: true,
        title: curated.title,
        detail: curated.detail,
        severity: curated.severity,
        redundancyGrade: null,
        limitation: null,
        source: 'curated-interaction',
      };
    }
    if (curated.type === 'contraindication') {
      return {
        ...base,
        type: 'antagonism',
        confidence: 'high',
        demonstrated: true,
        title: curated.title,
        detail: curated.detail,
        severity: curated.severity,
        redundancyGrade: null,
        limitation: null,
        source: 'curated-interaction',
      };
    }
    /* caution — duplication-titled entries classify as redundancy */
    if (/redundan|duplicat|overlap/i.test(curated.title)) {
      return {
        ...base,
        type: 'redundancy',
        confidence: 'high',
        demonstrated: true,
        title: curated.title,
        detail: curated.detail,
        severity: curated.severity,
        redundancyGrade: 'excessive',
        limitation: null,
        source: 'curated-interaction',
      };
    }
    return {
      ...base,
      type: 'interaction',
      confidence: curated.severity === 'high' ? 'high' : 'moderate',
      demonstrated: true,
      title: curated.title,
      detail: curated.detail,
      severity: curated.severity,
      redundancyGrade: null,
      limitation: null,
      source: 'curated-interaction',
    };
  }

  /* (b) curated pairwise matrix */
  const m = matrixPairScore(aId, bId);
  if (m !== undefined && m >= 8) {
    return {
      ...base,
      type: 'synergy',
      confidence: 'high',
      demonstrated: true,
      title: `Curated synergy (${m}/10)`,
      detail: `${a.name} + ${b.name} score ${m}/10 in the TNiC curated synergy matrix — a strong complementary pair.`,
      severity: null,
      redundancyGrade: null,
      limitation: null,
      source: 'curated-matrix',
    };
  }
  if (m !== undefined && m >= 6) {
    return {
      ...base,
      type: 'additive',
      confidence: 'moderate',
      demonstrated: true,
      title: `Curated additive pairing (${m}/10)`,
      detail: `${a.name} + ${b.name} score ${m}/10 in the TNiC curated synergy matrix — compatible, mostly independent effects.`,
      severity: null,
      redundancyGrade: null,
      limitation: null,
      source: 'curated-matrix',
    };
  }

  /* (b2) dataset-declared synergy pairing */
  if (a.synergies.includes(bId) || b.synergies.includes(aId)) {
    return {
      ...base,
      type: 'synergy',
      confidence: 'moderate',
      demonstrated: true,
      title: 'Declared mechanistic pairing',
      detail: `${a.name} lists ${b.name} as a synergy partner in the TNiC compound dataset.`,
      severity: null,
      redundancyGrade: null,
      limitation: null,
      source: 'declared-synergy',
    };
  }

  /* (c) same pathway → graded redundancy, unless hallmarks are disjoint */
  if (pathwayShared) {
    if (sharedHallmarks.length === 0) {
      return {
        ...base,
        type: 'complementary',
        confidence: 'low',
        demonstrated: false,
        title: 'Same axis, different hallmarks',
        detail: `Both act on ${a.pathway} but map to disjoint hallmarks — plausibly complementary coverage of the same axis.`,
        severity: null,
        redundancyGrade: null,
        limitation: HYPOTHESIS_LABEL,
        source: 'pathway-ontology',
      };
    }
    const grade: RedundancyGrade = sharedHallmarks.length >= 2 ? 'excessive' : 'useful-overlap';
    return {
      ...base,
      type: 'redundancy',
      confidence: grade === 'excessive' ? 'moderate' : 'low',
      demonstrated: false,
      title: grade === 'excessive' ? 'Same-pathway overlap' : 'Partial pathway overlap',
      detail: `Both act on ${a.pathway} and share ${sharedHallmarks.length} hallmark${
        sharedHallmarks.length === 1 ? '' : 's'
      } (${sharedHallmarks.map(hallmarkLabel).join(', ')}) — stacking may add little over either alone.`,
      severity: null,
      redundancyGrade: grade,
      limitation: HYPOTHESIS_LABEL,
      source: 'pathway-ontology',
    };
  }

  /* (d) shared hallmarks on different pathways */
  if (sharedHallmarks.length >= 2) {
    return {
      ...base,
      type: 'complementary',
      confidence: 'moderate',
      demonstrated: false,
      title: 'Convergent hallmark coverage',
      detail: `Different pathways (${a.pathway} vs ${b.pathway}) converging on ${sharedHallmarks
        .map(hallmarkLabel)
        .join(', ')} — plausibly complementary.`,
      severity: null,
      redundancyGrade: null,
      limitation: HYPOTHESIS_LABEL,
      source: 'hallmark-ontology',
    };
  }
  if (sharedHallmarks.length === 1) {
    return {
      ...base,
      type: 'additive',
      confidence: 'low',
      demonstrated: false,
      title: 'Single shared hallmark',
      detail: `Independent pathways with one shared hallmark (${hallmarkLabel(
        sharedHallmarks[0] ?? '',
      )}) — effects likely additive.`,
      severity: null,
      redundancyGrade: null,
      limitation: HYPOTHESIS_LABEL,
      source: 'hallmark-ontology',
    };
  }

  /* (e) nothing to say honestly */
  return {
    ...base,
    type: 'uncertain',
    confidence: 'low',
    demonstrated: false,
    title: 'No curated relationship',
    detail: UNCERTAIN_LABEL,
    severity: null,
    redundancyGrade: null,
    limitation: UNCERTAIN_LABEL,
    source: 'none',
  };
}

/** All pairwise relationships across the selected stack (order-stable). */
export function computeRelationships(selectedIds: readonly string[]): LabRelationship[] {
  const ids = [...new Set(selectedIds)].filter((id) => compoundById.has(id));
  const out: LabRelationship[] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const aId = ids[i];
      const bId = ids[j];
      if (!aId || !bId) continue;
      const rel = computePairRelationship(aId, bId);
      if (rel) out.push(rel);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Scoring config                                                      */
/* ------------------------------------------------------------------ */

/** Every tunable weight of the explainable scorer. The Config tab edits a
 *  copy of this; re-scoring is just calling computeLabScore again. */
export interface LabScoringConfig {
  /** Cap for the base-strength term (mean curated 1–10 compound score). */
  baseWeight: number;
  /** Per synergy pair (hypothesized edges x hypothesisDiscount). */
  synergyBonus: number;
  /** Per additive pair. */
  additiveBonus: number;
  /** Per complementary pair. */
  complementaryBonus: number;
  /** Multiplier applied to hypothesized (non-demonstrated) edge terms. */
  hypothesisDiscount: number;
  /** Per covered hallmark, with diminishing returns (1/sqrt(n)). */
  coverageBonus: number;
  /** Per tier-weighted covered hallmark (best evidence covering it). */
  benefitBonus: number;
  /** x mean tier-weighted evidence of the stack. */
  evidenceBonus: number;
  /** x mean unique hallmark/pathway contribution per compound. */
  marginalBonus: number;
  /** Per redundancy edge, by grade. */
  redundancyPenalty: { usefulOverlap: number; excessive: number };
  /** Per antagonism edge — full weight, never discounted. */
  antagonismPenalty: number;
  /** Per interaction edge — demonstrated at full weight. */
  interactionPenalty: { demonstrated: number; hypothesized: number };
  /** Stack size beyond which complexityPenalty accrues. */
  complexityThreshold: number;
  /** Per compound beyond the threshold. */
  complexityPenalty: number;
  /** Evidence-tier multipliers (A = full weight). */
  tierMultipliers: Record<EvidenceTier, number>;
  /** Normalization caps for each unbounded positive term. */
  caps: {
    synergy: number;
    additive: number;
    complementary: number;
    coverage: number;
    benefit: number;
    evidence: number;
    marginal: number;
  };
}

export const DEFAULT_LAB_CONFIG: LabScoringConfig = {
  baseWeight: 25,
  synergyBonus: 5,
  additiveBonus: 1.2,
  complementaryBonus: 2,
  hypothesisDiscount: 0.4,
  coverageBonus: 3,
  benefitBonus: 4,
  evidenceBonus: 10,
  marginalBonus: 3,
  redundancyPenalty: { usefulOverlap: 3, excessive: 6 },
  antagonismPenalty: 10,
  interactionPenalty: { demonstrated: 6, hypothesized: 2 },
  complexityThreshold: 6,
  complexityPenalty: 1.5,
  tierMultipliers: { A: 1, B: 0.7, C: 0.4 },
  caps: {
    /* Safety rails only — the per-edge diminishing transform below keeps
     * realistic stacks well under these, so every added edge still moves
     * the score and removal simulation stays sensitive. */
    synergy: 40,
    additive: 12,
    complementary: 15,
    coverage: 18,
    benefit: 8,
    evidence: 10,
    marginal: 8,
  },
};

/** localStorage key for the Config tab — namespaced, never touches
 *  PlatformContext storage keys. */
export const LAB_CONFIG_STORAGE_KEY = 'tnic:combination-lab-config:v1';

/** Deep clone so UI editors never mutate the shared default. */
export function cloneLabConfig(config: LabScoringConfig = DEFAULT_LAB_CONFIG): LabScoringConfig {
  return {
    ...config,
    redundancyPenalty: { ...config.redundancyPenalty },
    interactionPenalty: { ...config.interactionPenalty },
    tierMultipliers: { ...config.tierMultipliers },
    caps: { ...config.caps },
  };
}

function asFiniteNumber(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** Merge unknown persisted JSON over the defaults, field by field — a stale
 *  or hand-edited localStorage payload can never produce a broken config. */
export function sanitizeLabConfig(raw: unknown): LabScoringConfig {
  const d = DEFAULT_LAB_CONFIG;
  if (typeof raw !== 'object' || raw === null) return cloneLabConfig();
  const r = raw as Record<string, unknown>;
  const nested = (key: 'redundancyPenalty' | 'interactionPenalty' | 'tierMultipliers' | 'caps') =>
    (typeof r[key] === 'object' && r[key] !== null ? (r[key] as Record<string, unknown>) : {});
  const rp = nested('redundancyPenalty');
  const ip = nested('interactionPenalty');
  const tm = nested('tierMultipliers');
  const cp = nested('caps');
  return {
    baseWeight: asFiniteNumber(r.baseWeight, d.baseWeight),
    synergyBonus: asFiniteNumber(r.synergyBonus, d.synergyBonus),
    additiveBonus: asFiniteNumber(r.additiveBonus, d.additiveBonus),
    complementaryBonus: asFiniteNumber(r.complementaryBonus, d.complementaryBonus),
    hypothesisDiscount: asFiniteNumber(r.hypothesisDiscount, d.hypothesisDiscount),
    coverageBonus: asFiniteNumber(r.coverageBonus, d.coverageBonus),
    benefitBonus: asFiniteNumber(r.benefitBonus, d.benefitBonus),
    evidenceBonus: asFiniteNumber(r.evidenceBonus, d.evidenceBonus),
    marginalBonus: asFiniteNumber(r.marginalBonus, d.marginalBonus),
    redundancyPenalty: {
      usefulOverlap: asFiniteNumber(rp.usefulOverlap, d.redundancyPenalty.usefulOverlap),
      excessive: asFiniteNumber(rp.excessive, d.redundancyPenalty.excessive),
    },
    antagonismPenalty: asFiniteNumber(r.antagonismPenalty, d.antagonismPenalty),
    interactionPenalty: {
      demonstrated: asFiniteNumber(ip.demonstrated, d.interactionPenalty.demonstrated),
      hypothesized: asFiniteNumber(ip.hypothesized, d.interactionPenalty.hypothesized),
    },
    complexityThreshold: Math.max(
      1,
      Math.round(asFiniteNumber(r.complexityThreshold, d.complexityThreshold)),
    ),
    complexityPenalty: asFiniteNumber(r.complexityPenalty, d.complexityPenalty),
    tierMultipliers: {
      A: asFiniteNumber(tm.A, d.tierMultipliers.A),
      B: asFiniteNumber(tm.B, d.tierMultipliers.B),
      C: asFiniteNumber(tm.C, d.tierMultipliers.C),
    },
    caps: {
      synergy: asFiniteNumber(cp.synergy, d.caps.synergy),
      additive: asFiniteNumber(cp.additive, d.caps.additive),
      complementary: asFiniteNumber(cp.complementary, d.caps.complementary),
      coverage: asFiniteNumber(cp.coverage, d.caps.coverage),
      benefit: asFiniteNumber(cp.benefit, d.caps.benefit),
      evidence: asFiniteNumber(cp.evidence, d.caps.evidence),
      marginal: asFiniteNumber(cp.marginal, d.caps.marginal),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

export interface LabSubScores {
  synergy: number;
  coverage: number;
  benefitCoverage: number;
  evidence: number;
  marginalUtility: number;
  /** Inverted: 100 = no redundancy. */
  redundancyPenalty: number;
  /** Inverted: 100 = no antagonism. */
  antagonismPenalty: number;
  /** Inverted: 100 = no interaction risk. */
  interactionRisk: number;
  /** Inverted: 100 = within complexity threshold. */
  complexityPenalty: number;
  confidence: number;
}

export const LAB_SUB_SCORE_LABELS: Record<keyof LabSubScores, string> = {
  synergy: 'Synergy',
  coverage: 'Hallmark coverage',
  benefitCoverage: 'Benefit coverage',
  evidence: 'Evidence quality',
  marginalUtility: 'Marginal utility',
  redundancyPenalty: 'Redundancy (inverted)',
  antagonismPenalty: 'Antagonism (inverted)',
  interactionRisk: 'Interaction risk (inverted)',
  complexityPenalty: 'Complexity (inverted)',
  confidence: 'Confidence',
};

/** One itemized waterfall row of the score explanation. */
export interface LabContribution {
  key: string;
  label: string;
  /** Signed, weighted points this term adds to the composite. */
  delta: number;
  kind: 'positive' | 'negative';
  /** One-line human-readable justification. */
  detail: string;
  /** Compound ids responsible for the term. */
  refIds: string[];
}

export type ContributionFlag = 'appears-unnecessary' | 'net-negative';

/** Per-compound contribution ranking row. */
export interface CompoundContribution {
  id: string;
  name: string;
  /** positive - penalty, in composite points attributable to this compound. */
  net: number;
  positive: number;
  penalty: number;
  /** Hallmarks / pathways ONLY this compound covers. */
  uniqueHallmarks: string[];
  uniquePathways: string[];
  /** Pair keys of redundancy edges it participates in. */
  redundancyPairKeys: string[];
  flags: ContributionFlag[];
  /** 1-based rank by net contribution. */
  rank: number;
}

export interface LabScoreResult {
  /** 0–100 composite. */
  overall: number;
  confidence: LabConfidence;
  subScores: LabSubScores;
  /** Fully itemized waterfall — every point accounted for. */
  contributions: LabContribution[];
  /** Per-compound attribution, ranked by net contribution. */
  ranking: CompoundContribution[];
  /** Every pairwise relationship the score was computed from. */
  relationships: LabRelationship[];
  /** Hallmark ids covered by the stack, in first-coverage order. */
  coveredHallmarks: string[];
  counts: {
    compounds: number;
    pairs: number;
    demonstrated: number;
    hypothesized: number;
    /** Antagonisms + demonstrated interactions. */
    flagged: number;
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Saturating 0–100 normalization for unbounded positive raws. */
function sat(raw: number, k: number): number {
  return raw <= 0 ? 0 : round1((100 * raw) / (raw + k));
}

/** Diminishing returns: the Nth covered hallmark counts 1/sqrt(N), so more
 *  compounds never mechanically max out the score. */
function diminishing(count: number): number {
  let s = 0;
  for (let i = 1; i <= count; i++) s += 1 / Math.sqrt(i);
  return s;
}

const EMPTY_SUB_SCORES: LabSubScores = {
  synergy: 0,
  coverage: 0,
  benefitCoverage: 0,
  evidence: 0,
  marginalUtility: 0,
  redundancyPenalty: 100,
  antagonismPenalty: 100,
  interactionRisk: 100,
  complexityPenalty: 100,
  confidence: 0,
};

/**
 * The explainable stack score. Composite:
 *
 *   overall = clamp(0, 100,
 *       base + coverage + benefit + synergy + complementary + additive
 *     + evidence + marginal
 *     - redundancy - antagonism - interaction - complexity)
 *
 * Every term is a capped, itemized LabContribution. Hypothesized edges score
 * at `hypothesisDiscount`; antagonism is never discounted or silently netted.
 */
export function computeLabScore(
  selectedIds: readonly string[],
  config: LabScoringConfig = DEFAULT_LAB_CONFIG,
): LabScoreResult {
  const ids = [...new Set(selectedIds)].filter((id) => compoundById.has(id));
  const stack = ids.map((id) => compoundById.get(id) as Compound);
  const n = stack.length;

  if (n === 0) {
    return {
      overall: 0,
      confidence: 'low',
      subScores: { ...EMPTY_SUB_SCORES },
      contributions: [],
      ranking: [],
      relationships: [],
      coveredHallmarks: [],
      counts: { compounds: 0, pairs: 0, demonstrated: 0, hypothesized: 0, flagged: 0 },
    };
  }

  const mult = config.tierMultipliers;
  const relationships = computeRelationships(ids);
  const byType = (t: RelationshipType) => relationships.filter((r) => r.type === t);
  const contributions: LabContribution[] = [];

  /* attribution accumulators for the per-compound ranking */
  const pos = new Map<string, number>();
  const pen = new Map<string, number>();
  const addPos = (id: string, v: number) => pos.set(id, (pos.get(id) ?? 0) + v);
  const addPen = (id: string, v: number) => pen.set(id, (pen.get(id) ?? 0) + v);
  const addPair = (pair: [string, string], v: number) => {
    addPos(pair[0], v / 2);
    addPos(pair[1], v / 2);
  };
  const penPair = (pair: [string, string], v: number) => {
    addPen(pair[0], v / 2);
    addPen(pair[1], v / 2);
  };

  /* ---------------- base strength ---------------- */
  const meanBase = stack.reduce((s, c) => s + compoundBaseScore(c), 0) / n;
  const baseDelta = (meanBase / 10) * config.baseWeight;
  for (const c of stack) addPos(c.id, (compoundBaseScore(c) / 10 / 10) * config.baseWeight);
  contributions.push({
    key: 'base',
    label: 'BASE STRENGTH',
    delta: round1(baseDelta),
    kind: 'positive',
    detail: `Mean curated compound strength ${round1(meanBase)}/10 across ${n} compound${
      n === 1 ? '' : 's'
    }.`,
    refIds: ids,
  });

  /* ---------------- hallmark coverage (diminishing returns) ---------------- */
  const coveredHallmarks: string[] = [];
  const hallmarkMembers = new Map<string, string[]>();
  for (const c of stack) {
    for (const h of c.hallmarks) {
      if (!coveredHallmarks.includes(h)) coveredHallmarks.push(h);
      const arr = hallmarkMembers.get(h) ?? [];
      arr.push(c.id);
      hallmarkMembers.set(h, arr);
    }
  }
  const coverageRaw = diminishing(coveredHallmarks.length);
  const coverageDelta = Math.min(coverageRaw * config.coverageBonus, config.caps.coverage);
  const coverageScale = coverageRaw > 0 ? coverageDelta / (coverageRaw * config.coverageBonus) : 0;
  coveredHallmarks.forEach((h, i) => {
    const v = (config.coverageBonus / Math.sqrt(i + 1)) * coverageScale;
    const members = hallmarkMembers.get(h) ?? [];
    for (const id of members) addPos(id, v / members.length);
  });
  contributions.push({
    key: 'coverage',
    label: 'HALLMARK COVERAGE',
    delta: round1(coverageDelta),
    kind: 'positive',
    detail: `${coveredHallmarks.length} hallmark system${
      coveredHallmarks.length === 1 ? '' : 's'
    } touched (${coveredHallmarks
      .map(hallmarkLabel)
      .join(', ')}) — diminishing returns: each additional hallmark counts less.`,
    refIds: ids,
  });

  /* ---------------- benefit coverage (tier-weighted) ---------------- */
  const bestMultByHallmark = new Map<string, number>();
  for (const c of stack) {
    for (const h of c.hallmarks) {
      const prev = bestMultByHallmark.get(h) ?? 0;
      if (mult[c.evidence] > prev) bestMultByHallmark.set(h, mult[c.evidence]);
    }
  }
  let benefitRaw = 0;
  for (const [, m] of bestMultByHallmark) {
    benefitRaw += m;
  }
  const benefitDelta = Math.min(benefitRaw * config.benefitBonus, config.caps.benefit);
  const benefitScale = benefitRaw > 0 ? benefitDelta / (benefitRaw * config.benefitBonus) : 0;
  for (const [h, m] of bestMultByHallmark) {
    const members = hallmarkMembers.get(h) ?? [];
    for (const id of members) addPos(id, (m * config.benefitBonus * benefitScale) / members.length);
  }
  contributions.push({
    key: 'benefit-coverage',
    label: 'BENEFIT COVERAGE',
    delta: round1(benefitDelta),
    kind: 'positive',
    detail: `${bestMultByHallmark.size} hallmark${
      bestMultByHallmark.size === 1 ? '' : 's'
    } covered, weighted by the best evidence tier covering each.`,
    refIds: ids,
  });

  /* ---------------- relationship bonuses ---------------- */
  /* Per-edge diminishing returns: edges are sorted demonstrated-first, and
   * the Nth edge counts factor/sqrt(N). Linear-plus-cap scoring saturates on
   * dense stacks (25 curated synergy edges in the 14-compound preset), which
   * silently breaks removal simulation — this transform never saturates. */
  const edgeBonus = (
    type: RelationshipType,
    weight: number,
    cap: number,
    key: string,
    label: string,
    emptyDetail: string,
    presentDetail: (edges: LabRelationship[], dem: number) => string,
  ) => {
    const edges = byType(type).sort(
      (a, b) => Number(b.demonstrated) - Number(a.demonstrated),
    );
    let raw = 0;
    edges.forEach((r, i) => {
      raw += ((r.demonstrated ? 1 : config.hypothesisDiscount) * weight) / Math.sqrt(i + 1);
    });
    const delta = Math.min(raw, cap);
    const scale = raw > 0 ? delta / raw : 0;
    edges.forEach((r, i) => {
      addPair(
        r.pair,
        (((r.demonstrated ? 1 : config.hypothesisDiscount) * weight) / Math.sqrt(i + 1)) * scale,
      );
    });
    const dem = edges.filter((r) => r.demonstrated).length;
    contributions.push({
      key,
      label,
      delta: round1(delta),
      kind: 'positive',
      detail: edges.length === 0 ? emptyDetail : presentDetail(edges, dem),
      refIds: [...new Set(edges.flatMap((r) => r.pair))],
    });
    return { edges, countRaw: edges.reduce((s, r) => s + (r.demonstrated ? 1 : config.hypothesisDiscount), 0), delta };
  };

  const syn = edgeBonus(
    'synergy',
    config.synergyBonus,
    config.caps.synergy,
    'synergy',
    'SYNERGY',
    'No synergy relationships in this stack.',
    (edges, dem) =>
      `${edges.length} pair${edges.length === 1 ? '' : 's'} · ${dem} demonstrated, ${
        edges.length - dem
      } hypothesized — hypotheses score at reduced weight.`,
  );

  edgeBonus(
    'complementary',
    config.complementaryBonus,
    config.caps.complementary,
    'complementarity',
    'COMPLEMENTARITY',
    'No complementary coverage detected.',
    (edges, dem) =>
      `${edges.length} pair${edges.length === 1 ? '' : 's'} cover shared hallmarks via different pathways (${dem} demonstrated).`,
  );

  edgeBonus(
    'additive',
    config.additiveBonus,
    config.caps.additive,
    'additive',
    'ADDITIVE',
    'No additive relationships detected.',
    (edges, dem) =>
      `${edges.length} pair${edges.length === 1 ? '' : 's'} with compatible, mostly independent effects (${dem} demonstrated).`,
  );

  /* ---------------- evidence quality ---------------- */
  const evidenceMean = stack.reduce((s, c) => s + mult[c.evidence], 0) / n;
  const evidenceDelta = Math.min(evidenceMean * config.evidenceBonus, config.caps.evidence);
  for (const c of stack) addPos(c.id, (mult[c.evidence] * config.evidenceBonus) / n);
  const weak = stack.filter((c) => c.evidence === 'C');
  contributions.push({
    key: 'evidence',
    label: 'EVIDENCE QUALITY',
    delta: round1(evidenceDelta),
    kind: 'positive',
    detail:
      weak.length === 0
        ? `All ${n} compound${n === 1 ? ' is' : 's are'} Tier A/B.`
        : `Tier C evidence drags the term: ${weak.map((c) => c.name).join(', ')}.`,
    refIds: weak.map((c) => c.id),
  });

  /* ---------------- marginal utility (unique contribution) ---------------- */
  const pathwayCount = new Map<string, number>();
  for (const c of stack) {
    pathwayCount.set(pathwayKey(c.pathway), (pathwayCount.get(pathwayKey(c.pathway)) ?? 0) + 1);
  }
  const hallmarkTotals = new Map<string, number>();
  for (const c of stack) {
    for (const h of c.hallmarks) hallmarkTotals.set(h, (hallmarkTotals.get(h) ?? 0) + 1);
  }
  const uniqueHallmarksById = new Map<string, string[]>();
  const uniquePathwaysById = new Map<string, string[]>();
  for (const c of stack) {
    uniqueHallmarksById.set(
      c.id,
      [...new Set(c.hallmarks)].filter((h) => hallmarkTotals.get(h) === 1),
    );
    const key = pathwayKey(c.pathway);
    uniquePathwaysById.set(c.id, pathwayCount.get(key) === 1 ? [c.pathway] : []);
  }
  const uniqueCounts = stack.map(
    (c) =>
      (uniqueHallmarksById.get(c.id) ?? []).length + (uniquePathwaysById.get(c.id) ?? []).length,
  );
  /* Uniqueness is meaningless for a solo compound — everything is trivially
   * unique — so the marginal term only accrues from two compounds up. */
  const marginalRaw = n === 1 ? 0 : uniqueCounts.reduce((a, b) => a + b, 0) / n;
  const marginalDelta = Math.min(marginalRaw * config.marginalBonus, config.caps.marginal);
  const marginalScale = marginalRaw > 0 ? marginalDelta / (marginalRaw * config.marginalBonus) : 0;
  stack.forEach((c, i) => addPos(c.id, ((uniqueCounts[i] ?? 0) * config.marginalBonus * marginalScale) / n));
  contributions.push({
    key: 'marginal-utility',
    label: 'MARGINAL UTILITY',
    delta: round1(marginalDelta),
    kind: 'positive',
    detail: `Average of ${round1(
      marginalRaw,
    )} unique hallmark/pathway contributions per compound — stacks where every member pulls weight score higher.`,
    refIds: ids,
  });

  /* ---------------- penalties ---------------- */
  const redEdges = byType('redundancy');
  const redWeight = (r: LabRelationship) =>
    (r.redundancyGrade === 'excessive'
      ? config.redundancyPenalty.excessive
      : config.redundancyPenalty.usefulOverlap) * (r.demonstrated ? 1 : config.hypothesisDiscount);
  const redDelta = -redEdges.reduce((s, r) => s + redWeight(r), 0);
  for (const r of redEdges) penPair(r.pair, redWeight(r));
  contributions.push({
    key: 'redundancy-penalty',
    label: 'REDUNDANCY PENALTY',
    delta: round1(redDelta),
    kind: 'negative',
    detail:
      redEdges.length === 0
        ? 'No redundancy detected.'
        : redEdges
            .map(
              (r) =>
                `${compoundById.get(r.pair[0])?.name ?? r.pair[0]} + ${
                  compoundById.get(r.pair[1])?.name ?? r.pair[1]
                } (${r.redundancyGrade ?? 'useful-overlap'}${r.demonstrated ? '' : ', hypothesis'})`,
            )
            .join('; ') + '.',
    refIds: [...new Set(redEdges.flatMap((r) => r.pair))],
  });

  const antEdges = byType('antagonism');
  const antDelta = -antEdges.length * config.antagonismPenalty;
  for (const r of antEdges) penPair(r.pair, config.antagonismPenalty);
  contributions.push({
    key: 'antagonism-penalty',
    label: 'ANTAGONISM PENALTY',
    delta: round1(antDelta),
    kind: 'negative',
    detail:
      antEdges.length === 0
        ? 'No antagonisms.'
        : `${antEdges.length} antagonism${
            antEdges.length === 1 ? '' : 's'
          } at full weight — never discounted, never netted silently against synergy.`,
    refIds: [...new Set(antEdges.flatMap((r) => r.pair))],
  });

  const intEdges = byType('interaction');
  const intDem = intEdges.filter((r) => r.demonstrated);
  const intHyp = intEdges.filter((r) => !r.demonstrated);
  const intDelta =
    -intDem.length * config.interactionPenalty.demonstrated -
    intHyp.length * config.interactionPenalty.hypothesized * config.hypothesisDiscount;
  for (const r of intDem) penPair(r.pair, config.interactionPenalty.demonstrated);
  for (const r of intHyp) {
    penPair(r.pair, config.interactionPenalty.hypothesized * config.hypothesisDiscount);
  }
  contributions.push({
    key: 'interaction-risk',
    label: 'INTERACTION RISK',
    delta: round1(intDelta),
    kind: 'negative',
    detail:
      intEdges.length === 0
        ? 'No known interactions.'
        : `${intDem.length} demonstrated, ${intHyp.length} hypothesized interaction${
            intEdges.length === 1 ? '' : 's'
          }.`,
    refIds: [...new Set(intEdges.flatMap((r) => r.pair))],
  });

  const over = Math.max(0, n - config.complexityThreshold);
  const cpxDelta = -over * config.complexityPenalty;
  contributions.push({
    key: 'complexity-penalty',
    label: 'COMPLEXITY PENALTY',
    delta: round1(cpxDelta),
    kind: 'negative',
    detail:
      over === 0
        ? `Stack size ${n} is within the ${config.complexityThreshold}-compound threshold.`
        : `${over} compound${
            over === 1 ? '' : 's'
          } beyond ${config.complexityThreshold} — larger stacks are not assumed better.`,
    refIds: [],
  });

  /* ---------------- composite + confidence ---------------- */
  const overall = clamp(
    0,
    100,
    Math.round(contributions.reduce((s, c) => s + c.delta, 0)),
  );

  const demonstrated = relationships.filter((r) => r.demonstrated).length;
  const confidenceScore =
    relationships.length > 0
      ? demonstrated / relationships.length
      : stack.filter((c) => c.evidence !== 'C').length / n;
  const confidence: LabConfidence =
    confidenceScore >= 0.5 ? 'high' : confidenceScore >= 0.25 ? 'moderate' : 'low';

  /* ---------------- per-compound ranking ---------------- */
  const redundancyPairsByMember = new Map<string, string[]>();
  for (const r of redEdges) {
    for (const id of r.pair) {
      const arr = redundancyPairsByMember.get(id) ?? [];
      arr.push(pairKey(r.pair[0], r.pair[1]));
      redundancyPairsByMember.set(id, arr);
    }
  }

  const ranking: CompoundContribution[] = stack
    .map((c) => {
      const uniqueHallmarks = uniqueHallmarksById.get(c.id) ?? [];
      const uniquePathways = uniquePathwaysById.get(c.id) ?? [];
      const positive = round1(pos.get(c.id) ?? 0);
      const penalty = round1(pen.get(c.id) ?? 0);
      const net = round1(positive - penalty);
      const flags: ContributionFlag[] = [];
      if (net < 0) flags.push('net-negative');
      if (
        uniqueHallmarks.length === 0 &&
        uniquePathways.length === 0 &&
        (redundancyPairsByMember.get(c.id)?.length ?? 0) > 0
      ) {
        flags.push('appears-unnecessary');
      }
      return {
        id: c.id,
        name: c.name,
        net,
        positive,
        penalty,
        uniqueHallmarks,
        uniquePathways,
        redundancyPairKeys: redundancyPairsByMember.get(c.id) ?? [],
        flags,
        rank: 0,
      };
    })
    .sort((a, b) => b.net - a.net)
    .map((row, i) => ({ ...row, rank: i + 1 }));

  return {
    overall,
    confidence,
    subScores: {
      synergy: sat(syn.countRaw, 2),
      coverage: clamp(round1((coveredHallmarks.length / LAB_SYSTEMS.length) * 100), 0, 100),
      benefitCoverage: sat(benefitRaw, 3),
      evidence: round1(evidenceMean * 100),
      marginalUtility: sat(marginalRaw, 2),
      redundancyPenalty: clamp(
        round1(100 - sat(redEdges.reduce((s, r) => s + redWeight(r), 0), 4)),
        0,
        100,
      ),
      antagonismPenalty: clamp(100 - antEdges.length * 40, 0, 100),
      interactionRisk: clamp(100 - (intDem.length * 25 + intHyp.length * 10), 0, 100),
      complexityPenalty: over === 0 ? 100 : round1(100 / (1 + over)),
      confidence: round1(confidenceScore * 100),
    },
    contributions,
    ranking,
    relationships,
    coveredHallmarks,
    counts: {
      compounds: n,
      pairs: (n * (n - 1)) / 2,
      demonstrated,
      hypothesized: relationships.length - demonstrated,
      flagged: antEdges.length + intDem.length,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Marginal contribution                                               */
/* ------------------------------------------------------------------ */

export interface LabMarginal {
  addedId: string;
  name: string;
  /** Ids the contribution was computed against (stack minus added). */
  againstIds: string[];
  /** Hallmarks no other stack member covers. */
  newHallmarks: string[];
  /** Pathways no other stack member acts on. */
  newPathways: string[];
  /** Hallmarks already covered that this compound reinforces. */
  strengthenedHallmarks: string[];
  /** New edges between the added compound and the rest, by type. */
  newSynergies: LabRelationship[];
  newComplementary: LabRelationship[];
  newAdditive: LabRelationship[];
  newRedundancies: LabRelationship[];
  newInteractions: { demonstrated: LabRelationship[]; hypothesized: LabRelationship[] };
  newAntagonisms: LabRelationship[];
  /** What the addition does to the evidence base. */
  evidenceAdded: { tier: EvidenceTier; studyCount: number; evidenceDelta: number; note: string };
  scoreBefore: number;
  scoreAfter: number;
  scoreDelta: number;
  /** One-line verdict, e.g. "Mixed — extends coverage into Autophagy, but duplicates Mitochondrial." */
  verdict: string;
}

function marginalVerdict(mc: Omit<LabMarginal, 'verdict'>): string {
  const pluses: string[] = [];
  const minuses: string[] = [];
  if (mc.newHallmarks.length > 0) {
    pluses.push(`extends coverage into ${mc.newHallmarks.map(hallmarkLabel).slice(0, 2).join(' and ')}`);
  }
  if (mc.newSynergies.length > 0) {
    pluses.push(`${mc.newSynergies.length} new synergy edge${mc.newSynergies.length === 1 ? '' : 's'}`);
  }
  if (mc.strengthenedHallmarks.length > 0 && mc.newHallmarks.length === 0) {
    pluses.push(`reinforces ${mc.strengthenedHallmarks.length} existing hallmark${mc.strengthenedHallmarks.length === 1 ? '' : 's'}`);
  }
  if (mc.newRedundancies.length > 0) {
    minuses.push(`${mc.newRedundancies.length} redundanc${mc.newRedundancies.length === 1 ? 'y' : 'ies'} introduced`);
  }
  if (mc.newAntagonisms.length > 0) {
    minuses.push(`${mc.newAntagonisms.length} antagonism${mc.newAntagonisms.length === 1 ? '' : 's'}`);
  }
  if (mc.newInteractions.demonstrated.length > 0) {
    minuses.push(`${mc.newInteractions.demonstrated.length} demonstrated interaction${mc.newInteractions.demonstrated.length === 1 ? '' : 's'}`);
  }
  if (mc.newInteractions.hypothesized.length > 0) {
    minuses.push(`${mc.newInteractions.hypothesized.length} hypothesized interaction${mc.newInteractions.hypothesized.length === 1 ? '' : 's'}`);
  }
  const prefix = minuses.length === 0 ? 'Net positive' : pluses.length === 0 ? 'Net negative' : 'Mixed';
  const body = [pluses.join(', '), minuses.join(', ')].filter(Boolean).join(' — but ');
  if (!body) return 'Neutral — no measurable change to coverage, relationships, or risk.';
  return `${prefix} — ${body}.`;
}

/**
 * "What changed when `addedId` was added to the rest of this stack?"
 * Every item is human-readable so the Marginal tab can render it directly.
 */
export function computeMarginal(
  selectedIds: readonly string[],
  addedId: string,
  config: LabScoringConfig = DEFAULT_LAB_CONFIG,
): LabMarginal | null {
  const added = compoundById.get(addedId);
  if (!added) return null;
  const rest = [...new Set(selectedIds)].filter((id) => id !== addedId && compoundById.has(id));

  const restHallmarks = new Set<string>();
  const restPathwayKeys = new Set<string>();
  for (const id of rest) {
    const c = compoundById.get(id) as Compound;
    for (const h of c.hallmarks) restHallmarks.add(h);
    restPathwayKeys.add(pathwayKey(c.pathway));
  }

  const addedHallmarks = [...new Set(added.hallmarks)];
  const newHallmarks = addedHallmarks.filter((h) => !restHallmarks.has(h));
  const strengthenedHallmarks = addedHallmarks.filter((h) => restHallmarks.has(h));
  const newPathways = restPathwayKeys.has(pathwayKey(added.pathway)) ? [] : [added.pathway];

  const edges = rest
    .map((id) => computePairRelationship(addedId, id))
    .filter((r): r is LabRelationship => r !== null && r.type !== 'uncertain');
  const ofType = (t: RelationshipType) => edges.filter((e) => e.type === t);
  const interactions = ofType('interaction');

  const before = rest.length > 0 ? computeLabScore(rest, config) : null;
  const after = computeLabScore([...rest, addedId], config);
  const evidenceDelta = round1(after.subScores.evidence - (before?.subScores.evidence ?? 0));

  const partial: Omit<LabMarginal, 'verdict'> = {
    addedId,
    name: added.name,
    againstIds: rest,
    newHallmarks,
    newPathways,
    strengthenedHallmarks,
    newSynergies: ofType('synergy'),
    newComplementary: ofType('complementary'),
    newAdditive: ofType('additive'),
    newRedundancies: ofType('redundancy'),
    newInteractions: {
      demonstrated: interactions.filter((e) => e.demonstrated),
      hypothesized: interactions.filter((e) => !e.demonstrated),
    },
    newAntagonisms: ofType('antagonism'),
    evidenceAdded: {
      tier: added.evidence,
      studyCount: added.studies.length,
      evidenceDelta,
      note:
        evidenceDelta > 0
          ? `raises evidence score +${evidenceDelta}`
          : evidenceDelta < 0
            ? `lowers evidence score ${evidenceDelta}`
            : 'no change to the evidence score',
    },
    scoreBefore: before?.overall ?? 0,
    scoreAfter: after.overall,
    scoreDelta: after.overall - (before?.overall ?? 0),
  };
  return { ...partial, verdict: marginalVerdict(partial) };
}

/* ------------------------------------------------------------------ */
/* Removal-simulation optimizer                                        */
/* ------------------------------------------------------------------ */

export type RemovalVerdict =
  | 'high-value'
  | 'low-value'
  | 'redundant'
  | 'disproportionately-beneficial'
  | 'disproportionately-risky';

export const REMOVAL_VERDICT_LABELS: Record<RemovalVerdict, string> = {
  'high-value': 'HIGH-VALUE',
  'low-value': 'LOW-VALUE',
  redundant: 'REDUNDANT',
  'disproportionately-beneficial': 'DISPROPORTIONATE BENEFIT',
  'disproportionately-risky': 'DISPROPORTIONATE RISK',
};

export interface RemovalSimulation {
  id: string;
  name: string;
  /** Composite with this compound removed. */
  scoreWithout: number;
  /** scoreWithout - current overall. Positive = removing IMPROVES the stack. */
  delta: number;
  verdict: RemovalVerdict;
  rationale: string;
}

function classifyRemoval(
  edges: LabRelationship[],
  delta: number,
  config: LabScoringConfig,
): { verdict: RemovalVerdict; rationale: string } {
  const synergies = edges.filter((e) => e.type === 'synergy' && e.demonstrated);
  const redundancies = edges.filter((e) => e.type === 'redundancy');
  const risks = edges.filter(
    (e) => e.type === 'antagonism' || (e.type === 'interaction' && e.demonstrated),
  );

  /* structural: removing it breaks multiple demonstrated synergies */
  if (synergies.length >= 2 && delta < 0) {
    return {
      verdict: 'disproportionately-beneficial',
      rationale: `Removing it breaks ${synergies.length} demonstrated synergy edges — structural to this stack.`,
    };
  }
  /* risk carrier: dedicated risk edges, and removing it doesn't clearly hurt */
  if (risks.length > 0 && delta >= -config.complementaryBonus) {
    return {
      verdict: 'disproportionately-risky',
      rationale: `Carries ${risks.length} antagonism/demonstrated-interaction edge${
        risks.length === 1 ? '' : 's'
      } with dedicated penalties.`,
    };
  }
  /* redundant: participates in redundancy edges and removal doesn't hurt */
  if (redundancies.length > 0 && delta >= -config.complementaryBonus) {
    return {
      verdict: 'redundant',
      rationale: `Overlaps ${redundancies.length} other compound${
        redundancies.length === 1 ? '' : 's'
      } on the same pathway — removing it costs nothing measurable.`,
    };
  }
  if (delta <= -config.synergyBonus / 2) {
    return {
      verdict: 'high-value',
      rationale: `Removing it drops the score ${Math.abs(delta)} pts — it earns its place.`,
    };
  }
  if (delta >= 0) {
    return {
      verdict: 'low-value',
      rationale: 'Removing it leaves the score unchanged or improved.',
    };
  }
  return {
    verdict: 'low-value',
    rationale: 'Small net contribution — removal is nearly free.',
  };
}

/**
 * "What happens if I remove one?" Recomputes the composite per compound and
 * classifies the result. Pure simulation — nothing is mutated.
 */
export function simulateRemovals(
  selectedIds: readonly string[],
  config: LabScoringConfig = DEFAULT_LAB_CONFIG,
): RemovalSimulation[] {
  const ids = [...new Set(selectedIds)].filter((id) => compoundById.has(id));
  if (ids.length === 0) return [];
  const overall = computeLabScore(ids, config).overall;
  const relationships = computeRelationships(ids);

  return ids.map((id) => {
    const rest = ids.filter((x) => x !== id);
    const scoreWithout = rest.length > 0 ? computeLabScore(rest, config).overall : 0;
    const delta = round1(scoreWithout - overall);
    const edges = relationships.filter((r) => r.pair.includes(id));
    const { verdict, rationale } = classifyRemoval(edges, delta, config);
    return {
      id,
      name: (compoundById.get(id) as Compound).name,
      scoreWithout,
      delta,
      verdict,
      rationale,
    };
  });
}
