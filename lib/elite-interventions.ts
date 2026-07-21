import { PRODUCT_PICKS, type ProductPick } from './product-picks';
import { compounds } from './data';
import type { Compound } from './types';

/**
 * The homepage "elite interventions" showcase.
 *
 * This is a curated *ordering* over data that already lives in the repo — it
 * invents nothing. Every field is joined at runtime from two existing sources:
 *   - lib/product-picks.ts  → the verified brand, product, and buy link
 *   - lib/data.ts           → the evidence tier, pathway, dose, PMIDs, hallmarks
 *
 * A compound only appears here if it has BOTH a verified product pick AND a
 * graded compound entry (so we never show a buy button next to a fabricated or
 * absent evidence tier). `nr` and `tudca` product picks are intentionally
 * excluded — they have no matching graded compound in lib/data.ts.
 *
 * Ordering rule: the four Tier-A interventions the owner asked to feature lead —
 * GlyNAC, NAD⁺ restoration (the owner's "RESTORN", mapped to NMN, whose pathway
 * in lib/data.ts is literally "NAD+ Restoration"), Ca-AKG, and NRF2/sulforaphane
 * (Nrf2 Renew) — followed by the strongest Tier-B picks. `mechanismLine` is a
 * neutral, mechanism-level descriptor drawn
 * from each compound's own pathway/mechanism text in lib/data.ts — not an
 * efficacy or health-outcome claim.
 */

interface EliteSeed {
  compoundId: string;
  mechanismLine: string;
}

const ELITE_SEEDS: EliteSeed[] = [
  { compoundId: 'glynac', mechanismLine: 'Rebuilds the glutathione antioxidant system' },
  { compoundId: 'nmn', mechanismLine: 'Restores NAD⁺ that powers sirtuins and DNA repair' },
  { compoundId: 'cakg', mechanismLine: 'Feeds the TCA cycle and α-ketoglutarate signalling' },
  { compoundId: 'sulforaphane', mechanismLine: 'Switches on the NRF2 cellular-defense response' },
  { compoundId: 'resveratrol', mechanismLine: 'Activates SIRT1, a caloric-restriction mimic' },
  { compoundId: 'spermidine', mechanismLine: 'Induces autophagy — the cell’s self-cleanup pathway' },
  { compoundId: 'taurine', mechanismLine: 'A mitochondrial osmolyte that declines with age' },
  { compoundId: 'rala', mechanismLine: 'Recycles antioxidants across water and lipid compartments' },
  { compoundId: 'pterostilbene', mechanismLine: 'A more bioavailable SIRT1 activator than resveratrol' },
];

export interface EliteIntervention {
  rank: number;
  compoundId: string;
  /** Common compound name from lib/data.ts (e.g. "GlyNAC ET"). */
  compoundName: string;
  /** Pathway/mechanism family from lib/data.ts (used as the card eyebrow). */
  pathway: string;
  mechanismLine: string;
  evidence: Compound['evidence'];
  /** Number of PMID-cited human/clinical studies attached to the compound. */
  studyCount: number;
  dose: string;
  hallmarks: string[];
  /** Verified product pick. */
  pick: ProductPick;
  /** First-party affiliate redirect. */
  goHref: string;
  /** Compound evidence module. */
  libraryHref: string;
}

export const eliteInterventions: EliteIntervention[] = ELITE_SEEDS.map((seed, i) => {
  const compound = compounds.find((c) => c.id === seed.compoundId);
  const pick = PRODUCT_PICKS[seed.compoundId];
  if (!compound || !pick) {
    throw new Error(
      `elite-interventions: "${seed.compoundId}" needs both a graded compound and a product pick`,
    );
  }
  return {
    rank: i + 1,
    compoundId: compound.id,
    compoundName: compound.name,
    pathway: compound.pathway,
    mechanismLine: seed.mechanismLine,
    evidence: compound.evidence,
    studyCount: compound.studies?.length ?? 0,
    dose: compound.dose,
    hallmarks: compound.hallmarks ?? [],
    pick,
    goHref: `/api/go/${compound.id}`,
    libraryHref: `/library/compounds/${compound.id}`,
  };
});

/** Count by evidence tier — used for the showcase's summary line. */
export const eliteTierCounts = eliteInterventions.reduce<Record<string, number>>((acc, e) => {
  acc[e.evidence] = (acc[e.evidence] ?? 0) + 1;
  return acc;
}, {});
