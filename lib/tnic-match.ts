/**
 * TNiC Match — a transparent, criteria-based fit score for a verified product
 * pick, shown on the TNiC Verified surface.
 *
 * This is NOT a quality or lab-testing claim. It is a deterministic checklist:
 * does the pick join a graded compound, does it carry dose guidance in real
 * units, does the compound's evidence tier support recommending it, is the
 * manufacturer identified, and has the buy link been verified. Every point is
 * traceable to existing data in lib/product-picks.ts + lib/data.ts — nothing is
 * inferred about purity or manufacturing that the data does not state.
 * Server-safe (pure data + math).
 */

import type { ProductPick } from './product-picks';
import { compounds } from './data';
import type { EvidenceTier } from './types';

export type MatchCriterionKey = 'compound' | 'dose' | 'evidence' | 'manufacturer' | 'verified';

export interface MatchCriterion {
  key: MatchCriterionKey;
  label: string;
  met: boolean;
  detail: string;
}

export interface TnicMatch {
  compoundId: string;
  /** 0–100 criteria-based fit score. */
  score: number;
  tier: EvidenceTier | null;
  criteria: MatchCriterion[];
}

/** Points awarded per criterion when met (evidence is tier-scaled). */
const WEIGHTS = {
  compound: 30,
  dose: 22,
  manufacturer: 13,
  verified: 10,
} as const;

const EVIDENCE_POINTS: Record<EvidenceTier, number> = { A: 25, B: 18, C: 10, D: 4 };

/**
 * Does the dose note carry a real, comparable dose — a number followed by a
 * unit? The unit may be attached to the number ("1,800mg") or spaced ("3–5 g"),
 * so we anchor on a digit rather than a leading word boundary (which never
 * matches "1800mg", since digit→letter is not a word boundary).
 */
function hasDoseGuidance(doseNote: string | undefined): boolean {
  if (!doseNote) return false;
  return /\d[\d,.]*\s?(mg|mcg|µg|g|iu|billion|cfu)\b/i.test(doseNote);
}

const compoundById = new Map(compounds.map((c) => [c.id, c]));

export function computeTnicMatch(pick: ProductPick): TnicMatch {
  const compound = compoundById.get(pick.compoundId);
  const tier: EvidenceTier | null = compound?.evidence ?? null;

  const compoundMet = Boolean(compound);
  const doseMet = hasDoseGuidance(pick.doseNote);
  const evidenceMet = tier === 'A' || tier === 'B';
  const manufacturerMet = Boolean(pick.brand && pick.brandWebsite);
  const verifiedMet = Boolean(pick.linkVerifiedAt);

  const criteria: MatchCriterion[] = [
    {
      key: 'compound',
      label: 'Appropriate compound',
      met: compoundMet,
      detail: compound
        ? `Matches the graded ${compound.name} evidence module`
        : 'No graded compound match',
    },
    {
      key: 'dose',
      label: 'Appropriate dose',
      met: doseMet,
      detail: doseMet ? 'Label dose stated in studied units' : 'Dose not stated in comparable units',
    },
    {
      key: 'evidence',
      label: 'Evidence alignment',
      met: evidenceMet,
      detail: tier
        ? `Compound graded Tier ${tier}`
        : 'No evidence tier available',
    },
    {
      key: 'manufacturer',
      label: 'Manufacturer identified',
      met: manufacturerMet,
      detail: manufacturerMet ? `${pick.brand} — source disclosed` : 'Manufacturer not disclosed',
    },
    {
      key: 'verified',
      label: 'Buy link verified',
      met: verifiedMet,
      detail: pick.linkVerifiedAt ? `Link checked ${pick.linkVerifiedAt}` : 'Link not yet verified',
    },
  ];

  let score = 0;
  if (compoundMet) score += WEIGHTS.compound;
  if (doseMet) score += WEIGHTS.dose;
  if (tier) score += EVIDENCE_POINTS[tier];
  if (manufacturerMet) score += WEIGHTS.manufacturer;
  if (verifiedMet) score += WEIGHTS.verified;

  return {
    compoundId: pick.compoundId,
    score: Math.max(0, Math.min(100, Math.round(score))),
    tier,
    criteria,
  };
}
