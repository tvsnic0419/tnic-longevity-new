/**
 * Head-to-Head — free-form "pick any two compounds" comparison.
 *
 * The curated `/library/compare/<slug>` pages are hand-authored head-to-head
 * essays for 17 specific pairs. This module backs the complementary surface the
 * compare hub's own microcopy has been apologizing for: letting a reader weigh
 * ANY two compounds in the graded library against each other.
 *
 * Nothing here is a new dataset or a new claim. It is a pure *reader* that
 * joins two already-shipped sources:
 *
 *   1. lib/tnic-score.ts  → the six-dimension derived TNiC Score (itself a
 *      transparent layering of the Elite-8 LQ model, the Compound Engine, and
 *      the canonical library — see that module's header).
 *   2. lib/data.ts        → the canonical graded compound record: evidence
 *      tier, studied dose, timing, published bioavailability, hallmark
 *      coverage, documented synergies, and indexed studies with PMIDs.
 *
 * Honesty contract (NOTES-COMPOUND-LIBRARY.md):
 * - A dimension either side cannot support is reported `insufficient`, never
 *   inferred, defaulted to zero, or silently dropped — an unscored dimension
 *   must not read as a loss.
 * - A "winner" is only declared outside a deliberate tie band (see TIE_BAND);
 *   these are derived composites, not measured quantities, and a 1–2 point gap
 *   is not a real difference.
 * - Absence of a documented synergy is reported as absence of a record, never
 *   as evidence of safety or of non-interaction.
 */

import { compounds } from './data';
import { computeTnicScore, type TnicScore, type TnicDimensionKey } from './tnic-score';
import { hallmarkTitlesFor } from './best-for';
import { getAllComparisonSlugs } from './comparisons';
import type { Compound, EvidenceTier } from './types';

/**
 * Opening pair when the reader hasn't chosen one yet.
 *
 * Deliberately a genuine either/or rather than the site's most famous pair:
 * NR is an engine-only entry and is not in the graded canonical library, so
 * "NMN vs NR" cannot be built here. Resveratrol vs pterostilbene is a real
 * decision (the methylated analog's absorption advantage), both sides carry
 * full-depth scores, and a curated in-depth page exists to hand off to.
 */
export const DEFAULT_PAIR = { a: 'resveratrol', b: 'pterostilbene' } as const;

/**
 * Points of separation below which two derived scores are called a tie.
 *
 * The TNiC Score is a weighted composite of graded/curated inputs, not a
 * measurement — reporting a 1-point edge as a "winner" would imply a precision
 * the underlying data does not carry. 3 points is roughly the swing a single
 * study-count step produces through the log-scaled studies signal.
 */
export const TIE_BAND = 3;

export type ComparisonOutcome = 'a' | 'b' | 'tie' | 'insufficient';

export interface HeadToHeadOption {
  id: string;
  name: string;
  tier: EvidenceTier;
  pathway: string;
}

export interface HeadToHeadDimension {
  key: TnicDimensionKey;
  label: string;
  note: string;
  a: number | null;
  b: number | null;
  /** Which side leads, or why no call is made. */
  leader: ComparisonOutcome;
  /** Absolute gap, only when both sides are scored. */
  delta: number | null;
}

export interface HeadToHeadSide {
  compound: Compound;
  score: TnicScore;
  hallmarks: { id: string; slug: string; title: string }[];
}

export interface HeadToHeadRelation {
  /** `synergy` only when the canonical library documents the pairing. */
  kind: 'synergy' | 'undocumented';
  detail: string;
}

export interface HeadToHead {
  a: HeadToHeadSide;
  b: HeadToHeadSide;
  dimensions: HeadToHeadDimension[];
  /** Hallmarks of aging both compounds act on. */
  sharedHallmarks: { id: string; slug: string; title: string }[];
  /** Hallmarks unique to each side. */
  uniqueA: { id: string; slug: string; title: string }[];
  uniqueB: { id: string; slug: string; title: string }[];
  relation: HeadToHeadRelation;
  /** Overall composite outcome, under the same tie band. */
  scoreLeader: ComparisonOutcome;
  /** How many of the six dimensions could actually be compared. */
  comparableDimensions: number;
  /**
   * Slug of the hand-authored in-depth comparison for this exact pair, when one
   * exists — so the free-form tool hands off to the editorial page rather than
   * competing with it. `null` for the great majority of pairings.
   */
  curatedSlug: string | null;
}

/** Curated comparison slugs are built from compound ids (`a-vs-b`). */
function curatedSlugFor(idA: string, idB: string): string | null {
  const slugs = new Set(getAllComparisonSlugs());
  if (slugs.has(`${idA}-vs-${idB}`)) return `${idA}-vs-${idB}`;
  if (slugs.has(`${idB}-vs-${idA}`)) return `${idB}-vs-${idA}`;
  return null;
}

/** Every graded compound, alphabetized — the pick list for both selectors. */
export function comparableCompounds(): HeadToHeadOption[] {
  return compounds
    .map((c) => ({ id: c.id, name: c.name, tier: c.evidence, pathway: c.pathway }))
    .sort((x, y) => x.name.localeCompare(y.name));
}

export function isComparableId(id: string): boolean {
  return compounds.some((c) => c.id === id);
}

/** Tie-band-aware comparison of two optional derived values. */
function outcomeFor(a: number | null, b: number | null): ComparisonOutcome {
  if (a === null || b === null) return 'insufficient';
  if (Math.abs(a - b) <= TIE_BAND) return 'tie';
  return a > b ? 'a' : 'b';
}

function sideFor(compound: Compound): HeadToHeadSide {
  return {
    compound,
    score: computeTnicScore(compound.id),
    hallmarks: hallmarkTitlesFor(compound.hallmarks),
  };
}

/**
 * A documented synergy is recorded on either compound's `synergies` list. The
 * relation is deliberately binary — the canonical library records synergies,
 * not antagonisms, so this must never render as an "interaction check".
 */
function relationFor(a: Compound, b: Compound): HeadToHeadRelation {
  const documented = a.synergies.includes(b.id) || b.synergies.includes(a.id);
  if (documented) {
    return {
      kind: 'synergy',
      detail: `The library documents ${a.name} and ${b.name} as a synergistic pairing — they are recorded as complementary, not alternatives.`,
    };
  }
  return {
    kind: 'undocumented',
    detail: `No synergy is documented between ${a.name} and ${b.name} in the TNiC library. That is an absence of a record — not evidence that the pairing is safe, unsafe, or without interaction.`,
  };
}

/**
 * Build the full comparison. Returns `null` when either id isn't a graded
 * compound, so the caller can fall back rather than render a half-empty page.
 */
export function buildHeadToHead(idA: string, idB: string): HeadToHead | null {
  if (idA === idB) return null;
  const rawA = compounds.find((c) => c.id === idA);
  const rawB = compounds.find((c) => c.id === idB);
  if (!rawA || !rawB) return null;

  const a = sideFor(rawA);
  const b = sideFor(rawB);

  const dimensions: HeadToHeadDimension[] = a.score.dimensions.map((dim, i) => {
    const other = b.score.dimensions[i];
    const av = dim.value;
    const bv = other?.value ?? null;
    return {
      key: dim.key,
      label: dim.label,
      note: dim.note,
      a: av,
      b: bv,
      leader: outcomeFor(av, bv),
      delta: av !== null && bv !== null ? Math.abs(av - bv) : null,
    };
  });

  const aIds = new Set(rawA.hallmarks);
  const bIds = new Set(rawB.hallmarks);

  return {
    a,
    b,
    dimensions,
    sharedHallmarks: a.hallmarks.filter((h) => bIds.has(h.id)),
    uniqueA: a.hallmarks.filter((h) => !bIds.has(h.id)),
    uniqueB: b.hallmarks.filter((h) => !aIds.has(h.id)),
    relation: relationFor(rawA, rawB),
    scoreLeader: outcomeFor(a.score.score, b.score.score),
    comparableDimensions: dimensions.filter((d) => d.leader !== 'insufficient').length,
    curatedSlug: curatedSlugFor(idA, idB),
  };
}
