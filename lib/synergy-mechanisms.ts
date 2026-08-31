import { compounds } from '@/lib/data';

/**
 * Authored, pair-specific mechanism prose for compound synergies.
 *
 * The synergy network derives its edges from `compounds[].synergies`, but most
 * pairs had no written "why" — surfaces fell back to a generic hallmark-overlap
 * sentence (see lib/synergy-coverage.ts). This table supplies the real
 * mechanism for each pair.
 *
 * Deliberately separate from `stackInteractions` in lib/stack-analysis.ts:
 * that table also feeds `getPairSynergyScore`, where a `type: 'synergy'` entry
 * would bump a pair's score and change every Stack Builder / NICO result. This
 * table feeds *explanation only* — no scoring side effects — so mechanism
 * coherence can improve without silently re-scoring stacks.
 *
 * Each line describes established biochemistry at a mechanism level and does
 * not assert clinical outcomes or cite specific trials; evidence grading lives
 * with the individual compounds. Keys are the two compound ids sorted and
 * joined with "::", so an edge matches regardless of direction.
 */

function key(aId: string, bId: string): string {
  return [aId, bId].sort().join('::');
}

const ENTRIES: Array<[string, string, string]> = [
  ['coq10', 'nmn', 'NMN restores the NAD⁺ that Complex I uses to accept electrons, while CoQ10 (ubiquinol) shuttles those electrons from Complexes I and II onward to Complex III — the two act at consecutive steps of the same electron-transport chain.'],
  ['nmn', 'taurine', 'Taurine supports mitochondrial tRNA modification and respiratory-chain efficiency and falls with age, while NMN restores the NAD⁺ those same complexes depend on — complementary inputs to mitochondrial energy output.'],
  ['fisetin', 'nmn', 'Fisetin clears senescent cells, lowering the SASP and the DNA-damage signalling that drains NAD⁺; NMN replenishes the NAD⁺ that PARP and the sirtuins consume — clearance paired with substrate restoration.'],
  ['omega3', 'resveratrol', 'Resveratrol activates the SIRT1–FOXO3a axis that suppresses NF-κB inflammatory transcription, while omega-3 EPA/DHA are converted into specialized pro-resolving mediators that actively resolve inflammation — suppression plus resolution.'],
  ['berberine', 'nmn', 'Berberine activates AMPK while NMN restores NAD⁺ for SIRT1; AMPK and SIRT1 co-activate PGC-1α, so the pair drives mitochondrial biogenesis through both arms of the same metabolic switch.'],
  ['nmn', 'pqq', 'PQQ promotes mitochondrial biogenesis through PGC-1α/CREB signalling, and NMN supplies the NAD⁺ that SIRT1 needs to deacetylate and activate PGC-1α — converging on new mitochondrial mass.'],
  ['nmn', 'pterostilbene', 'Pterostilbene is a dimethylated resveratrol analogue with greater oral bioavailability that activates SIRT1; NMN provides the NAD⁺ substrate activated SIRT1 requires — the NAD⁺/sirtuin pairing with improved pharmacokinetics.'],
  ['nmn', 'urolithin-a', 'Urolithin A triggers mitophagy via PINK1/Parkin to clear damaged mitochondria, while NMN restores the NAD⁺ that supports SIRT1/PGC-1α biogenesis of new ones — balanced mitochondrial turnover.'],
  ['creatine', 'omega3', 'Creatine buffers cellular ATP through the phosphocreatine system while omega-3 fatty acids maintain membrane fluidity and resolve inflammation — complementary support for muscle and brain energetics.'],
  ['melatonin', 'omega3', 'Melatonin is a mitochondrially-concentrated antioxidant that protects the electron-transport chain, and omega-3-derived pro-resolving mediators quiet inflammation — overlapping protection of mitochondria from oxidative and inflammatory stress.'],
  ['omega3', 'vitamin-d3', 'Vitamin D modulates immune tone through the vitamin-D receptor while omega-3 EPA/DHA drive resolution of inflammation — two independent levers on immune balance, and a long-standing co-supplementation pair.'],
  ['curcumin', 'omega3', 'Curcumin inhibits NF-κB-driven inflammatory transcription and omega-3-derived resolvins actively clear inflammation — blocking initiation and promoting resolution of the same pathway.'],
  ['fisetin', 'resveratrol', 'Fisetin clears senescent cells and, like resveratrol, is a polyphenol antioxidant; resveratrol adds SIRT1 activation — senolytic clearance alongside sirtuin-mediated stress resistance.'],
  ['omega3', 'sulforaphane', 'Sulforaphane activates NRF2 to induce endogenous antioxidant and phase-II defences, while omega-3 EPA/DHA resolve inflammation — antioxidant defence paired with inflammation resolution.'],
  ['resveratrol', 'spermidine', 'Spermidine induces autophagy through eIF5A/TFEB signalling independently of the sirtuins, while resveratrol induces it via SIRT1/AMPK — two mechanistically distinct autophagy inducers converging on the same clean-up program.'],
  ['glynac', 'taurine', 'GlyNAC restores glutathione to control mitochondrial oxidative stress while taurine supports respiratory-chain efficiency — antioxidant defence paired with respiratory support inside the mitochondrion.'],
  ['berberine', 'resveratrol', 'Both push AMPK — berberine directly and resveratrol via SIRT1 — reinforcing the caloric-restriction-mimetic signal that shifts metabolism toward oxidation and autophagy.'],
  ['coq10', 'rala', 'R-alpha-lipoic acid is a redox cofactor that helps regenerate oxidized ubiquinone back to active ubiquinol, extending CoQ10\'s antioxidant and electron-carrying capacity in the mitochondrion.'],
  ['coq10', 'creatine', 'Creatine buffers ATP via phosphocreatine while CoQ10 supports the electron-transport chain that regenerates that ATP — sequential support of the cellular energy supply.'],
  ['glucosamine', 'omega3', 'Glucosamine supplies substrate for cartilage glycosaminoglycans while omega-3 fatty acids lower joint inflammation — complementary structural and anti-inflammatory support for joints.'],
  ['glycine', 'glynac', 'Glycine is one of glutathione\'s three amino-acid building blocks and a component of GlyNAC itself; added glycine further supports the glutathione-synthesis capacity GlyNAC is designed to restore.'],
  ['creatine', 'magnesium', 'Magnesium is the obligatory cofactor for creatine kinase, the enzyme that transfers phosphate between ATP and phosphocreatine — magnesium status directly gates creatine\'s energy-buffering function.'],
  ['magnesium', 'taurine', 'Both stabilize mitochondrial and excitable-membrane function — magnesium as a cofactor for hundreds of ATP-dependent enzymes, taurine through respiratory efficiency and calcium handling.'],
  ['magnesium', 'vitamin-d3', 'Magnesium is a required cofactor for the enzymes that hydroxylate vitamin D to active calcitriol, so adequate magnesium is needed for supplemented vitamin D3 to be fully utilized.'],
  ['coq10', 'melatonin', 'Melatonin and CoQ10 both concentrate in mitochondria and protect the electron-transport chain — melatonin as a chain-breaking antioxidant, CoQ10 by maintaining efficient electron flow that limits ROS leak.'],
  ['magnesium', 'melatonin', 'Magnesium participates in the biosynthetic pathway to melatonin and supports GABAergic relaxation; together they reinforce sleep onset and circadian signalling.'],
  ['glynac', 'nac', 'NAC donates cysteine, the rate-limiting amino acid for glutathione synthesis that GlyNAC also supplies — additional cysteine availability supports the same glutathione-restoration goal.'],
  ['pterostilbene', 'resveratrol', 'Both are stilbene SIRT1 activators; pterostilbene\'s methylation gives it a longer half-life and higher bioavailability, complementing resveratrol\'s broader polyphenol activity on the shared sirtuin axis.'],
  ['glynac', 'selenium', 'Selenium forms the catalytic selenocysteine centre of glutathione-peroxidase enzymes, which use the glutathione GlyNAC restores to neutralize peroxides — cofactor and substrate for the same antioxidant reaction.'],
  ['creatine', 'taurine', 'Both are cellular osmolytes that support muscle hydration and energy metabolism; taurine adds mitochondrial and calcium-handling support alongside creatine\'s phosphagen buffering.'],
  ['magnesium', 'vitamin-k2', 'Vitamin K2 directs calcium into bone and away from arteries while magnesium regulates calcium transport and bone-metabolism enzymes — complementary control of calcium in the bone–vascular axis.'],
  ['glycine', 'melatonin', 'Glycine lowers core body temperature to ease sleep onset while melatonin sets circadian timing — two distinct routes to better sleep architecture.'],
  ['coq10', 'pqq', 'PQQ stimulates biogenesis of new mitochondria while CoQ10 supplies the electron carrier those mitochondria need to respire — building capacity and fuelling it, a classic mitochondrial pairing.'],
  ['vitamin-d3', 'zinc', 'Zinc supports vitamin-D-receptor function and broad innate immunity, complementing vitamin D\'s modulation of immune tone — two co-dependent inputs to immune regulation.'],
  ['curcumin', 'quercetin', 'Both polyphenols suppress NF-κB inflammatory signalling; quercetin adds senolytic activity, pairing broad anti-inflammatory action with clearance of senescent cells.'],
  ['glycine', 'nac', 'NAC and glycine are two of the three amino acids in glutathione; supplied together they cover the cysteine (from NAC) and glycine legs of glutathione synthesis.'],
  ['nac', 'selenium', 'NAC restores cysteine for glutathione synthesis while selenium forms the catalytic core of glutathione-peroxidase — substrate and enzyme for the same peroxide-clearing system.'],
  ['selenium', 'zinc', 'Both are trace-element cofactors for protective enzymes — selenium for glutathione peroxidases, zinc for superoxide dismutase and DNA-repair proteins — covering complementary arms of redox and genome defence.'],
  ['vitamin-d3', 'vitamin-k2', 'Vitamin D raises calcium absorption while vitamin K2 activates the proteins (osteocalcin, matrix-Gla protein) that direct that calcium into bone and away from arteries — the canonical D3/K2 pairing.'],
  ['quercetin', 'zinc', 'Quercetin acts as a zinc ionophore, helping move zinc into cells where it supports antioxidant and immune enzymes — the flavonoid improves delivery of its partner.'],
  ['curcumin', 'glucosamine', 'Glucosamine supplies cartilage-matrix substrate while curcumin suppresses the NF-κB inflammation that degrades joint tissue — structural support paired with anti-inflammatory protection.'],
];

export const SYNERGY_MECHANISMS: Map<string, string> = new Map(
  ENTRIES.map(([a, b, text]) => [key(a, b), text]),
);

/** Authored mechanism prose for a synergy pair, if one exists. */
export function getSynergyMechanism(aId: string, bId: string): string | undefined {
  return SYNERGY_MECHANISMS.get(key(aId, bId));
}

/** Every id referenced by the table, for the integrity test to validate against the catalog. */
export function synergyMechanismCompoundIds(): string[] {
  const ids = new Set<string>();
  for (const [a, b] of ENTRIES) {
    ids.add(a);
    ids.add(b);
  }
  return [...ids];
}

/** Guard used by tests: keys that don't correspond to a real compound id. */
export function invalidSynergyMechanismIds(): string[] {
  const valid = new Set(compounds.map((c) => c.id));
  return synergyMechanismCompoundIds().filter((id) => !valid.has(id));
}
