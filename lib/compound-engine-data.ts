/**
 * Compound Intelligence Engine — mechanistic scoring dataset + pure analysis.
 *
 * This is a *dedicated* mechanistic scoring library, distinct from
 * `lib/data.ts` (the 27 stack-buildable compounds) and the 55 library
 * deep-dives. It carries scoring dimensions those sources do not model
 * (curated effect / bioavailability / safety magnitudes, pathway + hallmark
 * fan-out, curated interaction pairs). Per `NOTES-COMPOUND-LIBRARY.md` these
 * magnitudes are NOT promoted into `lib/data.ts` — that requires real evidence
 * review. Instead, every entry cross-links to its library deep-dive when one
 * exists (`libraryHref`), so the engine and the canonical library stay wired
 * together without duplicating the source of truth.
 *
 * Scores are indicative decision-support, not medical advice. The Fact-Check
 * surface in the UI exposes provenance for every value.
 */

import { compoundModules, getModulePath } from './library-modules';

/* ── Palette (aligned to the site's dark-theme accent tokens) ────────────── */
// Concrete hexes (not CSS vars) so SVG presentation attributes and Recharts
// props resolve correctly. Values mirror the `--accent-*` / text tokens in
// app/globals.css.
export const PALETTE = {
  ink: '#020811',
  panel: '#080f1c',
  panel2: '#0d1526',
  line: '#212b3c',
  text: '#fafafa',
  muted: '#a1a1aa',
  dim: '#6b7280',
  jade: '#34d399', // --accent-emerald
  amber: '#fbbf24', // --accent-amber
  violet: '#c084fc', // --accent-violet
  rose: '#f472b6', // --accent-rose
  cyan: '#00e0ff', // --accent-cyan
} as const;

/* ── 12 Hallmarks of Aging (López-Otín et al., 2023) ─────────────────────── */
export type HallmarkId =
  | 'genomic' | 'telomere' | 'epigenetic' | 'proteostasis' | 'autophagy'
  | 'nutrient' | 'mito' | 'senescence' | 'stemcell' | 'intercellular'
  | 'inflammation' | 'dysbiosis';

export interface Hallmark {
  id: HallmarkId;
  label: string;
  short: string;
  blurb: string;
}

export const HALLMARKS: Hallmark[] = [
  { id: 'genomic', label: 'Genomic instability', short: 'GEN', blurb: 'Accumulating DNA damage and mutation.' },
  { id: 'telomere', label: 'Telomere attrition', short: 'TEL', blurb: 'Progressive shortening of chromosome caps.' },
  { id: 'epigenetic', label: 'Epigenetic alterations', short: 'EPI', blurb: 'Drift in methylation and chromatin state.' },
  { id: 'proteostasis', label: 'Loss of proteostasis', short: 'PRO', blurb: 'Failure of protein folding and clearance.' },
  { id: 'autophagy', label: 'Disabled macroautophagy', short: 'AUT', blurb: 'Declining cellular self-recycling.' },
  { id: 'nutrient', label: 'Deregulated nutrient sensing', short: 'NUT', blurb: 'mTOR / AMPK / IGF signaling drift.' },
  { id: 'mito', label: 'Mitochondrial dysfunction', short: 'MITO', blurb: 'Falling bioenergetic capacity and quality.' },
  { id: 'senescence', label: 'Cellular senescence', short: 'SEN', blurb: 'Accumulation of arrested, inflammatory cells.' },
  { id: 'stemcell', label: 'Stem cell exhaustion', short: 'STEM', blurb: 'Depleted regenerative reserve.' },
  { id: 'intercellular', label: 'Altered intercellular comms', short: 'COMM', blurb: 'Disrupted signaling between cells.' },
  { id: 'inflammation', label: 'Chronic inflammation', short: 'INFL', blurb: 'Persistent low-grade inflammaging.' },
  { id: 'dysbiosis', label: 'Dysbiosis', short: 'DYS', blurb: 'Imbalance of the microbiome.' },
];
export const HALLMARK_MAP: Record<HallmarkId, Hallmark> = Object.fromEntries(
  HALLMARKS.map((h) => [h.id, h]),
) as Record<HallmarkId, Hallmark>;

/* ── Mechanistic pathways ────────────────────────────────────────────────── */
export const PATHWAY_LABELS = {
  nad: 'NAD⁺', sirt1: 'SIRT1', ampk: 'AMPK', mtor: 'mTOR', nrf2: 'NRF2',
  nfkb: 'NF-κB', pgc1a: 'PGC-1α', etc: 'ETC', autophagy: 'Autophagy',
  mitophagy: 'Mitophagy', senolytic: 'Senolytic', glutathione: 'Glutathione',
  methylation: 'Methylation', cd38: 'CD38', akg: 'α-KG / TET', lipid: 'Membrane lipids',
  glucose: 'Glucose / Insulin', ecm: 'ECM', immune: 'Immune', ngf: 'NGF / BDNF', osmo: 'Osmolyte',
} as const;
export type PathwayId = keyof typeof PATHWAY_LABELS;

export type Tier = 'A' | 'B' | 'C' | 'D';
export type Form = 'basic' | 'std' | 'enh';

export interface Compound {
  id: string;
  name: string;
  full: string;
  aliases: string[];
  cls: string;
  tier: Tier;
  rct: boolean;
  studies: number;
  effect: number;
  bioavail: number;
  safety: number;
  pathways: PathwayId[];
  hallmarks: HallmarkId[];
  dose: string;
  note: string;
  flags: string[];
  /** Internal deep-dive link, resolved against the canonical library. */
  libraryHref?: string;
}

/* ── Curated mechanistic library ─────────────────────────────────────────── */
const RAW_COMPOUND_DB: Omit<Compound, 'libraryHref'>[] = [
  { id: 'nmn', name: 'NMN', full: 'Nicotinamide Mononucleotide', aliases: ['β-nmn', 'beta nmn'], cls: 'NAD⁺ precursor', tier: 'B', rct: true, studies: 350, effect: 60, bioavail: 62, safety: 88, pathways: ['nad', 'sirt1', 'pgc1a'], hallmarks: ['nutrient', 'mito', 'genomic', 'epigenetic'], dose: '250–1000 mg', note: 'Raises NAD⁺; sirtuin fuel. Oral uptake mechanism debated. (Note: US regulatory status contested.)', flags: ['High methylation demand — pair a methyl donor'] },
  { id: 'nr', name: 'NR', full: 'Nicotinamide Riboside', aliases: ['niagen'], cls: 'NAD⁺ precursor', tier: 'B', rct: true, studies: 300, effect: 55, bioavail: 70, safety: 90, pathways: ['nad', 'sirt1'], hallmarks: ['nutrient', 'mito', 'genomic'], dose: '250–500 mg', note: 'Robustly raises NAD⁺ in humans; clinical outcomes modest so far.', flags: ['Consumes methyl groups'] },
  { id: 'tmg', name: 'TMG', full: 'Betaine (Trimethylglycine)', aliases: ['betaine', 'trimethylglycine'], cls: 'Methyl donor', tier: 'B', rct: true, studies: 500, effect: 58, bioavail: 82, safety: 90, pathways: ['methylation'], hallmarks: ['epigenetic'], dose: '500–1000 mg', note: 'Homocysteine remethylation; buffers the methyl cost of NAD⁺ precursors.', flags: [] },
  { id: 'glycine', name: 'Glycine', full: 'Glycine', aliases: [], cls: 'Amino acid', tier: 'B', rct: true, studies: 600, effect: 55, bioavail: 88, safety: 92, pathways: ['glutathione'], hallmarks: ['inflammation', 'proteostasis'], dose: '3–10 g', note: 'Glutathione substrate; supports sleep and metabolic markers.', flags: [] },
  { id: 'nac', name: 'NAC', full: 'N-Acetylcysteine', aliases: ['n acetylcysteine'], cls: 'Antioxidant', tier: 'B', rct: true, studies: 1200, effect: 62, bioavail: 60, safety: 85, pathways: ['glutathione', 'nrf2'], hallmarks: ['inflammation', 'proteostasis', 'mito'], dose: '600–1800 mg', note: 'Cysteine donor for glutathione synthesis.', flags: ['High-dose antioxidants may blunt exercise adaptation'] },
  { id: 'glynac', name: 'GlyNAC', full: 'Glycine + NAC', aliases: ['gly nac', 'glycine nac'], cls: 'Combination', tier: 'B', rct: true, studies: 45, effect: 66, bioavail: 70, safety: 88, pathways: ['glutathione', 'nrf2'], hallmarks: ['mito', 'inflammation', 'genomic', 'proteostasis'], dose: 'per components', note: 'Combined glutathione restoration; promising small human trials.', flags: [] },
  { id: 'rala', name: 'R-ALA', full: 'R-Alpha-Lipoic Acid', aliases: ['alpha lipoic acid', 'lipoic acid', 'ala'], cls: 'Redox cofactor', tier: 'B', rct: true, studies: 500, effect: 55, bioavail: 55, safety: 82, pathways: ['nrf2', 'ampk', 'glutathione'], hallmarks: ['mito', 'inflammation', 'nutrient'], dose: '300–600 mg', note: 'Mitochondrial cofactor + redox recycler; R-form/Na-salt better absorbed.', flags: ['Take away from meals'] },
  { id: 'coq10', name: 'CoQ10', full: 'Coenzyme Q10 / Ubiquinol', aliases: ['ubiquinol', 'ubiquinone', 'coenzyme q10'], cls: 'Mito cofactor', tier: 'B', rct: true, studies: 900, effect: 58, bioavail: 55, safety: 90, pathways: ['etc'], hallmarks: ['mito', 'inflammation'], dose: '100–200 mg', note: 'Electron carrier in the respiratory chain; ubiquinol better absorbed.', flags: ['Fat-soluble — take with fat'] },
  { id: 'omega3', name: 'Omega-3', full: 'EPA / DHA', aliases: ['fish oil', 'epa', 'dha', 'omega 3'], cls: 'Essential fatty acid', tier: 'A', rct: true, studies: 5000, effect: 60, bioavail: 70, safety: 88, pathways: ['nfkb', 'lipid'], hallmarks: ['inflammation', 'intercellular'], dose: '1–3 g EPA+DHA', note: 'Resolvin precursors; incorporate into membranes.', flags: ['Oxidation-prone — protect / co-dose antioxidant'] },
  { id: 'astax', name: 'Astaxanthin', full: 'Astaxanthin', aliases: [], cls: 'Carotenoid', tier: 'B', rct: true, studies: 400, effect: 50, bioavail: 55, safety: 88, pathways: ['nrf2', 'lipid'], hallmarks: ['inflammation', 'mito'], dose: '4–12 mg', note: 'Lipid-phase antioxidant; shields membrane PUFAs.', flags: [] },
  { id: 'lionsmane', name: "Lion's Mane", full: 'Hericium erinaceus', aliases: ['hericium', 'lions mane'], cls: 'Nootropic fungus', tier: 'C', rct: true, studies: 250, effect: 45, bioavail: 50, safety: 85, pathways: ['ngf'], hallmarks: ['intercellular', 'inflammation'], dose: '500–1000 mg (10:1)', note: 'NGF induction; early human cognition signals.', flags: [] },
  { id: 'berberine', name: 'Berberine', full: 'Berberine HCl', aliases: [], cls: 'Metabolic', tier: 'A', rct: true, studies: 1500, effect: 66, bioavail: 40, safety: 78, pathways: ['ampk', 'glucose'], hallmarks: ['nutrient', 'inflammation'], dose: '500 mg 1–3×', note: 'AMPK activator; improves glucose and lipids.', flags: ['GI effects; low bioavailability'] },
  { id: 'resveratrol', name: 'Resveratrol', full: 'Resveratrol', aliases: [], cls: 'Stilbene', tier: 'C', rct: true, studies: 9000, effect: 42, bioavail: 30, safety: 82, pathways: ['sirt1', 'ampk'], hallmarks: ['nutrient', 'inflammation', 'epigenetic'], dose: '150–500 mg', note: 'SIRT1 activation debated; poor bioavailability; mixed human outcomes.', flags: ['Low bioavailability — pair fat/piperine; evidence mixed'] },
  { id: 'pterostilbene', name: 'Pterostilbene', full: 'Pterostilbene', aliases: [], cls: 'Stilbene', tier: 'C', rct: true, studies: 300, effect: 45, bioavail: 70, safety: 80, pathways: ['sirt1'], hallmarks: ['nutrient', 'inflammation'], dose: '50–125 mg', note: 'Methylated resveratrol analog with much better absorption.', flags: ['May raise LDL at higher doses'] },
  { id: 'fisetin', name: 'Fisetin', full: 'Fisetin', aliases: [], cls: 'Senolytic flavonoid', tier: 'C', rct: true, studies: 400, effect: 48, bioavail: 45, safety: 82, pathways: ['senolytic', 'nfkb'], hallmarks: ['senescence', 'inflammation'], dose: '100–1500 mg (pulsed)', note: 'Senolytic in animals; human trials underway.', flags: ['Human senolytic efficacy unproven'] },
  { id: 'quercetin', name: 'Quercetin', full: 'Quercetin', aliases: [], cls: 'Flavonoid', tier: 'B', rct: true, studies: 2000, effect: 48, bioavail: 40, safety: 84, pathways: ['senolytic', 'nfkb', 'cd38'], hallmarks: ['senescence', 'inflammation'], dose: '250–1000 mg', note: 'Senolytic; CD38 inhibition may spare NAD⁺; phytosome improves uptake.', flags: ['Low bioavailability unless phytosome'] },
  { id: 'sulforaphane', name: 'Sulforaphane', full: 'Sulforaphane (glucoraphanin)', aliases: ['glucoraphanin', 'broccoli'], cls: 'Isothiocyanate', tier: 'B', rct: true, studies: 800, effect: 55, bioavail: 55, safety: 82, pathways: ['nrf2'], hallmarks: ['inflammation', 'genomic', 'proteostasis', 'epigenetic'], dose: '10–40 mg', note: 'Potent NRF2 activator and dietary HDAC inhibitor (epigenetic); myrosinase-dependent.', flags: ['Stability/conversion variable — spec stabilized form'] },
  { id: 'spermidine', name: 'Spermidine', full: 'Spermidine', aliases: [], cls: 'Polyamine', tier: 'B', rct: true, studies: 600, effect: 55, bioavail: 65, safety: 86, pathways: ['autophagy'], hallmarks: ['autophagy', 'proteostasis', 'intercellular', 'epigenetic'], dose: '1–6 mg', note: 'Induces autophagy; modulates histone acetylation; cohort longevity link.', flags: [] },
  { id: 'pqq', name: 'PQQ', full: 'Pyrroloquinoline quinone', aliases: [], cls: 'Mito cofactor', tier: 'C', rct: true, studies: 300, effect: 45, bioavail: 60, safety: 84, pathways: ['pgc1a'], hallmarks: ['mito'], dose: '10–20 mg', note: 'Signals mitochondrial biogenesis.', flags: ['Small human evidence base'] },
  { id: 'taurine', name: 'Taurine', full: 'Taurine', aliases: [], cls: 'Amino sulfonic acid', tier: 'B', rct: true, studies: 1000, effect: 52, bioavail: 80, safety: 90, pathways: ['osmo', 'etc'], hallmarks: ['mito', 'inflammation', 'intercellular'], dose: '1–3 g', note: '2023 Science: taurine declines with age; supplementation extended lifespan in mice.', flags: ['Human longevity RCT still lacking'] },
  { id: 'urolithina', name: 'Urolithin A', full: 'Urolithin A', aliases: ['urolithin'], cls: 'Mitophagy activator', tier: 'B', rct: true, studies: 150, effect: 58, bioavail: 60, safety: 88, pathways: ['mitophagy', 'autophagy'], hallmarks: ['mito', 'autophagy'], dose: '500–1000 mg', note: 'Induces mitophagy; positive human muscle trials; only ~40% produce it endogenously.', flags: ['Direct supplementation beats relying on precursors'] },
  { id: 'caakg', name: 'Ca-AKG', full: 'Calcium Alpha-Ketoglutarate', aliases: ['akg', 'alpha ketoglutarate', 'ca akg'], cls: 'TCA metabolite', tier: 'B', rct: true, studies: 200, effect: 52, bioavail: 65, safety: 84, pathways: ['akg', 'mtor'], hallmarks: ['epigenetic', 'nutrient', 'inflammation'], dose: '1000 mg', note: 'Co-substrate for Fe²⁺/α-KG-dependent TET demethylases; retrospective DNAm-clock signal; RCT pending.', flags: ['Human data early / retrospective'] },
  { id: 'vitd3', name: 'Vitamin D3', full: 'Cholecalciferol', aliases: ['vitamin d', 'd3', 'cholecalciferol'], cls: 'Hormone / vitamin', tier: 'A', rct: true, studies: 10000, effect: 55, bioavail: 70, safety: 85, pathways: ['immune'], hallmarks: ['inflammation', 'intercellular', 'genomic'], dose: '1000–4000 IU', note: 'Correct deficiency; broad immune and bone roles.', flags: ['Test levels; fat-soluble'] },
  { id: 'vitk2', name: 'Vitamin K2', full: 'Menaquinone (MK-7)', aliases: ['vitamin k', 'mk-7', 'menaquinone', 'k2'], cls: 'Vitamin', tier: 'B', rct: true, studies: 600, effect: 52, bioavail: 70, safety: 86, pathways: ['ecm'], hallmarks: ['intercellular'], dose: '90–200 mcg', note: 'Activates MGP/osteocalcin; directs calcium to bone.', flags: [] },
  { id: 'magnesium', name: 'Magnesium', full: 'Magnesium (glycinate/malate)', aliases: ['mag', 'magnesium glycinate'], cls: 'Mineral', tier: 'A', rct: true, studies: 4000, effect: 55, bioavail: 60, safety: 88, pathways: ['ampk'], hallmarks: ['genomic', 'mito', 'inflammation'], dose: '200–400 mg elem.', note: 'Cofactor for 300+ enzymes including DNA-repair machinery.', flags: ['Oxide form poorly absorbed'] },
  { id: 'creatine', name: 'Creatine', full: 'Creatine monohydrate', aliases: ['creatine monohydrate'], cls: 'Ergogenic', tier: 'A', rct: true, studies: 6000, effect: 60, bioavail: 90, safety: 90, pathways: ['etc'], hallmarks: ['mito', 'intercellular'], dose: '3–5 g', note: 'Phosphocreatine energy buffer; muscle + cognition; very well evidenced.', flags: [] },
  { id: 'curcumin', name: 'Curcumin', full: 'Curcumin', aliases: ['turmeric'], cls: 'Polyphenol', tier: 'B', rct: true, studies: 15000, effect: 50, bioavail: 25, safety: 84, pathways: ['nfkb', 'nrf2'], hallmarks: ['inflammation', 'senescence'], dose: '500–1000 mg (enhanced)', note: 'Anti-inflammatory; requires piperine or phytosome delivery.', flags: ['Very low bioavailability unformulated'] },
  { id: 'egcg', name: 'EGCG', full: 'Epigallocatechin gallate', aliases: ['green tea', 'egcg'], cls: 'Catechin', tier: 'B', rct: true, studies: 4000, effect: 48, bioavail: 35, safety: 76, pathways: ['ampk', 'nfkb'], hallmarks: ['inflammation', 'nutrient', 'epigenetic'], dose: '300–500 mg', note: 'Catechin with DNMT-inhibitory (epigenetic) activity.', flags: ['Hepatotoxicity risk at high dose fasted'] },
  { id: 'apigenin', name: 'Apigenin', full: 'Apigenin', aliases: [], cls: 'Flavone', tier: 'C', rct: true, studies: 300, effect: 45, bioavail: 40, safety: 82, pathways: ['cd38', 'nfkb'], hallmarks: ['senescence', 'inflammation', 'nutrient'], dose: '50 mg', note: 'CD38 inhibition may preserve NAD⁺; largely preclinical.', flags: ['Human data limited'] },
  { id: 'lactoferrin', name: 'Lactoferrin', full: 'Lactoferrin (bovine / rhLF)', aliases: ['ltf', 'apolactoferrin'], cls: 'Glycoprotein', tier: 'B', rct: true, studies: 900, effect: 55, bioavail: 45, safety: 88, pathways: ['immune', 'nfkb'], hallmarks: ['inflammation', 'intercellular', 'mito'], dose: '150–300 mg', note: 'Iron homeostasis and anti-inflammaging; gastric-labile so enteric delivery preferred.', flags: ['Enteric-protect; dairy allergen unless recombinant'] },
];

/* Cross-link each compound to its canonical library deep-dive when one exists.
   Engine id → library slug where they diverge. */
const LIBRARY_SLUG_OVERRIDES: Record<string, string> = { caakg: 'cakg' };
const libraryPathBySlug = new Map(compoundModules.map((m) => [m.slug, getModulePath(m)]));
function resolveLibraryHref(id: string): string | undefined {
  return libraryPathBySlug.get(LIBRARY_SLUG_OVERRIDES[id] ?? id);
}

export const COMPOUND_DB: Compound[] = RAW_COMPOUND_DB.map((c) => ({
  ...c,
  libraryHref: resolveLibraryHref(c.id),
}));
export const CDB: Record<string, Compound> = Object.fromEntries(COMPOUND_DB.map((c) => [c.id, c]));

/* ── Interaction knowledge ───────────────────────────────────────────────── */
export type SynergyPair = [string, string, string, number];
export const SYNERGY_PAIRS: SynergyPair[] = [
  ['nmn', 'tmg', 'TMG replenishes methyl groups consumed during NAD⁺-precursor metabolism.', 3],
  ['nr', 'tmg', 'TMG offsets the methylation cost of NAD⁺-precursor turnover.', 3],
  ['nmn', 'apigenin', 'CD38 inhibition slows NAD⁺ breakdown, extending the pool NMN builds.', 2],
  ['nmn', 'quercetin', "Quercetin's CD38 inhibition helps preserve the NAD⁺ pool from NMN.", 2],
  ['glycine', 'nac', 'Combined glutathione precursors — the GlyNAC redox-restoration rationale.', 3],
  ['omega3', 'astax', 'Astaxanthin embeds in membranes and shields omega-3 PUFAs from peroxidation.', 2],
  ['vitd3', 'vitk2', 'K2 routes D3-absorbed calcium to bone and away from arteries.', 3],
  ['resveratrol', 'pterostilbene', 'Overlapping SIRT1 activation; pterostilbene adds the bioavailability resveratrol lacks.', 1],
  ['curcumin', 'quercetin', 'Complementary NF-κB / NRF2 anti-inflammatory coverage.', 1],
  ['fisetin', 'quercetin', 'Senolytic flavonoid stacking broadens senescent-cell clearance.', 2],
  ['berberine', 'rala', 'Dual AMPK / insulin-sensitizing routes to glucose control.', 1],
  ['coq10', 'pqq', 'PQQ signals mitochondrial biogenesis; CoQ10 supplies the ETC of new mitochondria.', 2],
  ['urolithina', 'spermidine', 'Mitophagy (UA) plus macroautophagy (spermidine) — complementary quality control.', 2],
  ['magnesium', 'vitd3', 'Magnesium is a required cofactor for vitamin D activation.', 2],
  ['lactoferrin', 'caakg', 'Iron homeostasis (lactoferrin) supports the Fe²⁺/α-KG-dependent TET demethylases that α-KG feeds.', 2],
  ['sulforaphane', 'spermidine', 'Layered epigenetic modulation — HDAC inhibition plus histone-acetylation/autophagy.', 1],
];

export type AntagonismPair = [string, string, string, number];
export const ANTAGONISM_PAIRS: AntagonismPair[] = [
  ['egcg', 'berberine', 'Overlapping glucose-lowering and hepatic load — monitor closely if stacked.', 4],
];

export interface RedundancyGroup {
  label: string;
  ids: string[];
  penalty: number;
  rationale: string;
}
export const REDUNDANCY_GROUPS: RedundancyGroup[] = [
  { label: 'NAD⁺ precursors', ids: ['nmn', 'nr'], penalty: 6, rationale: 'Multiple NAD⁺ precursors give diminishing returns — consolidate unless deliberately layering routes.' },
];
export const ANTIOXIDANT_SET = ['nac', 'rala', 'astax', 'coq10', 'curcumin', 'egcg'];

export const TIER_META: Record<Tier, { label: string; color: string }> = {
  A: { label: 'Human RCT · strong', color: PALETTE.jade },
  B: { label: 'Human trials · moderate', color: PALETTE.cyan },
  C: { label: 'Preclinical + mechanistic', color: PALETTE.amber },
  D: { label: 'Theoretical / in-vitro', color: PALETTE.muted },
};

export type Weights = { evidence: number; effect: number; breadth: number; bioavail: number; safety: number };
export const DEFAULT_WEIGHTS: Weights = { evidence: 0.30, effect: 0.22, breadth: 0.20, bioavail: 0.14, safety: 0.14 };
export const FORM_ADJ: Record<Form, number> = { std: 0, enh: 12, basic: -12 };
export const FORM_LABEL: Record<Form, string> = { std: 'Standard', enh: 'Enhanced', basic: 'Basic' };

/* ── Staged / scored types ───────────────────────────────────────────────── */
export interface StagedItem {
  uid: string;
  data: Compound;
  name: string;
  brand: string;
  dose: string;
  form: Form;
  source: 'curated';
}
export type Subscores = { evidence: number; effect: number; breadth: number; bioavail: number; safety: number };
export interface ScoredItem extends StagedItem {
  subs: Subscores;
  overall: number;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
export const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

export const evidenceScore = (c: Compound) =>
  clamp(({ A: 92, B: 76, C: 56, D: 34 }[c.tier] ?? 34) + (c.rct ? 3 : 0));

export const breadthScore = (c: Compound) =>
  Math.round(clamp((c.hallmarks.length / 12) * 55 + (Math.min(c.pathways.length, 6) / 6) * 45));

export const subscoresOf = (item: StagedItem): Subscores => {
  const c = item.data;
  return {
    evidence: evidenceScore(c),
    effect: c.effect,
    breadth: breadthScore(c),
    bioavail: clamp(c.bioavail + (FORM_ADJ[item.form] || 0)),
    safety: c.safety,
  };
};

export const overallOf = (subs: Subscores, w: Weights): number => {
  const tot = w.evidence + w.effect + w.breadth + w.bioavail + w.safety;
  const v =
    (subs.evidence * w.evidence + subs.effect * w.effect + subs.breadth * w.breadth +
      subs.bioavail * w.bioavail + subs.safety * w.safety) / (tot || 1);
  return Math.round(v);
};

export const tierColor = (t: Tier) => (TIER_META[t] || TIER_META.D).color;
export const scoreColor = (v: number) =>
  v >= 78 ? PALETTE.jade : v >= 60 ? PALETTE.cyan : v >= 42 ? PALETTE.amber : PALETTE.rose;

export const pubmedUrl = (name: string) =>
  `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(name + ' (aging OR longevity OR healthspan)')}`;

/* ── Stack analysis ──────────────────────────────────────────────────────── */
export interface ConvergentPathway { p: PathwayId; count: number; members: string[] }
export interface Synergy { a: string; b: string; rationale: string; w: number }
export interface Caution { kind: string; a: string; b: string; rationale: string; penalty: number }
export interface Redundancy { label: string; members: string[]; rationale: string; penalty: number }
export interface BreakdownRow { label: string; value: number; kind: 'base' | 'pos' | 'neg' }

export interface StackAnalysis {
  scored: ScoredItem[];
  meanScore: number | null;
  synergyScore: number | null;
  convergent: ConvergentPathway[];
  synergies: Synergy[];
  cautions: Caution[];
  redundancies: Redundancy[];
  hallmarkDepth: Record<HallmarkId, number>;
  hallmarkMembers: Record<HallmarkId, string[]>;
  coveragePct: number;
  coveredCount: number;
  gaps: Hallmark[];
  breakdown: BreakdownRow[];
}

export function analyzeStack(staged: StagedItem[], weights: Weights): StackAnalysis {
  const items = staged.filter((s) => s.data);
  const scored: ScoredItem[] = items.map((it) => {
    const subs = subscoresOf(it);
    return { ...it, subs, overall: overallOf(subs, weights) };
  });
  const idsPresent = new Set(items.map((i) => i.data.id));

  const pathwayCount: Partial<Record<PathwayId, number>> = {};
  const pathwayMembers: Partial<Record<PathwayId, string[]>> = {};
  const hallmarkDepth = Object.fromEntries(HALLMARKS.map((h) => [h.id, 0])) as Record<HallmarkId, number>;
  const hallmarkMembers = Object.fromEntries(HALLMARKS.map((h) => [h.id, [] as string[]])) as Record<HallmarkId, string[]>;
  items.forEach((it) => {
    it.data.pathways.forEach((p) => {
      pathwayCount[p] = (pathwayCount[p] || 0) + 1;
      (pathwayMembers[p] = pathwayMembers[p] || []).push(it.name);
    });
    it.data.hallmarks.forEach((h) => {
      hallmarkDepth[h] += 1;
      hallmarkMembers[h].push(it.name);
    });
  });

  const convergent: ConvergentPathway[] = (Object.keys(pathwayCount) as PathwayId[])
    .filter((p) => (pathwayCount[p] || 0) >= 2)
    .map((p) => ({ p, count: pathwayCount[p]!, members: pathwayMembers[p]! }))
    .sort((a, b) => b.count - a.count);
  let convergenceScore = 0;
  convergent.forEach((c) => { convergenceScore += 7 + Math.min(c.count - 2, 3) * 3; });
  convergenceScore = Math.min(convergenceScore, 34);

  const synergies: Synergy[] = [];
  SYNERGY_PAIRS.forEach(([a, b, rationale, w]) => {
    if (idsPresent.has(a) && idsPresent.has(b))
      synergies.push({ a: CDB[a]?.name || a, b: CDB[b]?.name || b, rationale, w });
  });
  const complementScore = Math.min(synergies.reduce((s, x) => s + x.w, 0) * 4, 28);

  const cautions: Caution[] = [];
  let antPenalty = 0;
  ANTAGONISM_PAIRS.forEach(([a, b, rationale, penalty]) => {
    if (idsPresent.has(a) && idsPresent.has(b)) {
      cautions.push({ kind: 'Interaction', a: CDB[a]?.name || a, b: CDB[b]?.name || b, rationale, penalty });
      antPenalty += penalty;
    }
  });

  const redundancies: Redundancy[] = [];
  let redPenalty = 0;
  REDUNDANCY_GROUPS.forEach((g) => {
    const members = g.ids.filter((id) => idsPresent.has(id)).map((id) => CDB[id]?.name || id);
    if (members.length >= 2) { redundancies.push({ label: g.label, members, rationale: g.rationale, penalty: g.penalty }); redPenalty += g.penalty; }
  });

  const antioxidantMembers = ANTIOXIDANT_SET.filter((id) => idsPresent.has(id)).map((id) => CDB[id]?.name || id);
  let antioxidantPenalty = 0;
  if (antioxidantMembers.length >= 4) {
    antioxidantPenalty = 6;
    cautions.push({ kind: 'Redox load', a: '', b: '', rationale: `High cumulative antioxidant load (${antioxidantMembers.join(', ')}) may blunt exercise-induced hormetic adaptation.`, penalty: 6 });
  }

  const coveredCount = HALLMARKS.filter((h) => hallmarkDepth[h.id] > 0).length;
  const coveragePct = items.length ? coveredCount / 12 : 0;
  const coverageScore = Math.round(coveragePct * 20);
  const gaps = HALLMARKS.filter((h) => hallmarkDepth[h.id] === 0);

  const breakdown: BreakdownRow[] = [
    { label: 'Baseline', value: 50, kind: 'base' },
    { label: 'Pathway convergence', value: convergenceScore, kind: 'pos' },
    { label: 'Known synergies', value: complementScore, kind: 'pos' },
    { label: 'Hallmark coverage', value: coverageScore, kind: 'pos' },
    { label: 'Redundancy', value: -redPenalty, kind: 'neg' },
    { label: 'Interaction caution', value: -antPenalty, kind: 'neg' },
    { label: 'Redox load', value: -antioxidantPenalty, kind: 'neg' },
  ].filter((b) => b.value !== 0 || b.kind === 'base') as BreakdownRow[];

  const synergyScore = items.length < 2 ? null : clamp(
    Math.round(50 + convergenceScore + complementScore + coverageScore - redPenalty - antPenalty - antioxidantPenalty),
  );

  const meanScore = scored.length ? Math.round(scored.reduce((s, x) => s + x.overall, 0) / scored.length) : null;

  return {
    scored, meanScore, synergyScore, convergent, synergies, cautions, redundancies,
    hallmarkDepth, hallmarkMembers, coveragePct, coveredCount, gaps, breakdown,
  };
}
