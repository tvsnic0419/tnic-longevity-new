// ─────────────────────────────────────────────────────────────────────────────
// TNiC · what molecule each compound page actually renders
//
// This file is the human-judgement half of the molecular-structure pipeline.
// It says, for every compound in the library, WHICH molecule the hero should
// draw — and, just as importantly, when the honest answer is "there isn't
// one." `scripts/fetch-molecule-geometry.mjs` reads this, resolves each entry
// against PubChem, and writes the real 3D coordinates into
// `molecule-geometry.generated.ts`. No structure on this site is drawn from
// memory or invented.
//
// `kind` is the contract with the reader, and the hero caption states it:
//
//   'self'        — the compound IS this molecule. Render it plainly.
//   'constituent' — the compound is an extract, oil or standardised blend with
//                   no single structure. We draw its named principal active
//                   constituent and SAY SO on the page. Drawing one molecule
//                   and implying it is the whole product would be the same
//                   class of error as a mis-attributed citation.
//   'repeat-unit' — a polymer. We draw the repeating unit and say so.
//   'none'        — proteins, enzymes, mineral ions, elements and multi-
//                   component formulas have no informative small-molecule
//                   structure. These keep the abstract orbital field, which
//                   the caption labels as illustrative. This is a correct
//                   answer, not a gap to be filled.
//
// `query` is a precise chemical name, deliberately NOT a CID typed from
// memory. PubChem resolves it and the generated file records the CID, formula
// and IUPAC name it returned, so every structure is auditable after the fact.
// ─────────────────────────────────────────────────────────────────────────────

export type MoleculeSourceKind = 'self' | 'constituent' | 'repeat-unit' | 'none';

export interface MoleculeSource {
  /** Compound id in lib/data.ts. */
  id: string;
  kind: MoleculeSourceKind;
  /** Chemical name resolved against PubChem. Omitted when kind is 'none'. */
  query?: string;
  /**
   * For 'constituent' / 'repeat-unit': the display name shown in the caption,
   * e.g. "withaferin A". The page says what it is drawing.
   */
  as?: string;
  /** Why this compound has no single structure — shown nowhere, read by humans. */
  note?: string;
}

export const MOLECULE_SOURCES: MoleculeSource[] = [
  // ── single molecules ───────────────────────────────────────────────────────
  // These four previously rendered as 3D projections of the 2D ambient
  // skeletons in components/ui/molecules.ts. That projection is only as good
  // as the drawing: berberine's tetracyclic system was drawn with its rings
  // meeting at a point rather than sharing an edge, which produced three
  // zero-length bonds. Real conformers are strictly better here.
  { id: 'berberine', kind: 'self', query: 'berberine' },
  { id: 'spermidine', kind: 'self', query: 'spermidine' },
  { id: 'sulforaphane', kind: 'self', query: 'sulforaphane' },
  { id: 'fisetin', kind: 'self', query: 'fisetin' },
  { id: 'nr', kind: 'self', query: 'nicotinamide riboside' },
  { id: 'rapamycin', kind: 'self', query: 'sirolimus' },
  { id: 'tudca', kind: 'self', query: 'tauroursodeoxycholic acid' },
  { id: 'l-theanine', kind: 'self', query: 'L-theanine' },
  { id: 'citicoline', kind: 'self', query: 'citicoline' },
  { id: 'mitoq', kind: 'self', query: 'mitoquinone' },
  { id: 'metformin', kind: 'self', query: 'metformin' },
  { id: 'acarbose', kind: 'self', query: 'acarbose' },
  { id: 'canagliflozin', kind: 'self', query: 'canagliflozin' },
  { id: '17a-estradiol', kind: 'self', query: '17-alpha-estradiol' },
  { id: 'dasatinib', kind: 'self', query: 'dasatinib' },
  { id: 'cakg', kind: 'constituent', query: 'alpha-ketoglutaric acid', as: 'alpha-ketoglutarate', note: 'Calcium salt; the AKG anion is the active species and the calcium is a counter-ion.' },
  { id: 'rala', kind: 'self', query: '(R)-lipoic acid' },
  { id: 'taurine', kind: 'self', query: 'taurine' },
  { id: 'urolithin-a', kind: 'self', query: 'urolithin A' },
  { id: 'coq10', kind: 'self', query: 'ubiquinone-10' },
  { id: 'creatine', kind: 'self', query: 'creatine' },
  { id: 'curcumin', kind: 'self', query: 'curcumin' },
  { id: 'glucosamine', kind: 'self', query: 'glucosamine' },
  { id: 'glycine', kind: 'self', query: 'glycine' },
  { id: 'melatonin', kind: 'self', query: 'melatonin' },
  { id: 'nac', kind: 'self', query: 'acetylcysteine' },
  { id: 'pqq', kind: 'self', query: 'pyrroloquinoline quinone' },
  { id: 'quercetin', kind: 'self', query: 'quercetin' },
  { id: 'l-citrulline', kind: 'self', query: 'L-citrulline' },
  { id: 'egcg', kind: 'self', query: 'epigallocatechin gallate' },
  { id: 'apigenin', kind: 'self', query: 'apigenin' },
  { id: 'luteolin', kind: 'self', query: 'luteolin' },
  { id: 'ergothioneine', kind: 'self', query: 'ergothioneine' },
  { id: 'l-carnosine', kind: 'self', query: 'carnosine' },
  { id: 'tmg', kind: 'self', query: 'betaine' },
  { id: 'butyrate', kind: 'self', query: 'butyric acid' },
  { id: 'nicotinamide', kind: 'self', query: 'nicotinamide' },
  { id: 'hesperidin', kind: 'self', query: 'hesperidin' },
  { id: 'alpha-gpc', kind: 'self', query: 'alpha-glycerylphosphorylcholine' },
  { id: 'theobromine', kind: 'self', query: 'theobromine' },
  { id: 'capsaicin', kind: 'self', query: 'capsaicin' },
  { id: 'piperine', kind: 'self', query: 'piperine' },
  { id: 'methylfolate', kind: 'self', query: 'levomefolic acid' },
  { id: 'methylcobalamin', kind: 'self', query: 'methylcobalamin' },
  { id: 'p5p', kind: 'self', query: "pyridoxal 5'-phosphate" },
  { id: 'benfotiamine', kind: 'self', query: 'benfotiamine' },
  { id: 'niacin', kind: 'self', query: 'nicotinic acid' },
  { id: 'vitamin-c', kind: 'self', query: 'L-ascorbic acid' },
  { id: 'hmb', kind: 'self', query: '3-hydroxy-3-methylbutyric acid' },
  { id: 'trigonelline', kind: 'self', query: 'trigonelline' },
  { id: 'l-arginine', kind: 'self', query: 'L-arginine' },
  { id: 'acetyl-l-carnitine', kind: 'self', query: 'acetyl-L-carnitine' },
  { id: 'msm', kind: 'self', query: 'dimethyl sulfone' },
  { id: 'vitamin-d3', kind: 'self', query: 'cholecalciferol' },
  { id: 'vitamin-k2', kind: 'self', query: 'menaquinone-7' },

  // ── extracts and blends: draw the named principal constituent ──────────────
  { id: 'cocoa-flavanols', kind: 'constituent', query: '(-)-epicatechin', as: 'epicatechin', note: 'Flavanol-standardised cocoa extract.' },
  { id: 'bergamot', kind: 'constituent', query: 'brutieridin', as: 'brutieridin', note: 'Citrus bergamot polyphenolic fraction.' },
  { id: 'beetroot-nitrate', kind: 'constituent', query: 'nitrate', as: 'the nitrate ion', note: 'Beetroot is dosed for its dietary nitrate content.' },
  { id: 'lions-mane', kind: 'constituent', query: 'hericenone B', as: 'hericenone B', note: 'Fruiting-body extract; hericenones/erinacines are the marker compounds.' },
  { id: 'aged-garlic', kind: 'constituent', query: 'S-allylcysteine', as: 'S-allyl cysteine', note: 'Aged extract standardised to S-allyl cysteine.' },
  { id: 'omega3', kind: 'constituent', query: 'docosahexaenoic acid', as: 'DHA', note: 'EPA/DHA blend — no single structure.' },
  { id: 'ashwagandha', kind: 'constituent', query: 'withaferin A', as: 'withaferin A', note: 'Withanolide-standardised root extract.' },
  { id: 'rhodiola', kind: 'constituent', query: 'salidroside', as: 'salidroside', note: 'Rosavin/salidroside-standardised extract.' },
  { id: 'boswellia', kind: 'constituent', query: '3-acetyl-11-keto-beta-boswellic acid', as: 'AKBA', note: 'Boswellic-acid-standardised resin extract.' },
  { id: 'ginkgo-biloba', kind: 'constituent', query: 'ginkgolide B', as: 'ginkgolide B', note: 'Standardised to flavone glycosides + terpene lactones.' },
  { id: 'panax-ginseng', kind: 'constituent', query: 'ginsenoside Rg1', as: 'ginsenoside Rg1', note: 'Ginsenoside-standardised root extract.' },
  { id: 'mucuna-pruriens', kind: 'constituent', query: 'levodopa', as: 'L-DOPA', note: 'Standardised to its L-DOPA content.' },
  { id: 'cordyceps', kind: 'constituent', query: 'cordycepin', as: 'cordycepin', note: 'Mushroom extract; cordycepin is the marker compound.' },
  { id: 'reishi', kind: 'constituent', query: 'ganoderic acid A', as: 'ganoderic acid A', note: 'Triterpenoid + polysaccharide extract.' },
  { id: 'astragalus', kind: 'constituent', query: 'astragaloside IV', as: 'astragaloside IV', note: 'Saponin-standardised root extract.' },
  { id: 'milk-thistle', kind: 'constituent', query: 'silybin', as: 'silybin', note: 'Silymarin is a flavonolignan complex; silybin is its principal component.' },
  { id: 'bacopa-monnieri', kind: 'constituent', query: 'bacopaside I', as: 'bacopaside I', note: 'Bacoside-standardised extract.' },
  { id: 'grapeseed', kind: 'constituent', query: 'procyanidin B2', as: 'procyanidin B2', note: 'Oligomeric proanthocyanidin extract.' },
  { id: 'gynostemma', kind: 'constituent', query: 'gypenoside XLIX', as: 'gypenoside XLIX', note: 'Gypenoside-standardised extract.' },
  { id: 'tocotrienols', kind: 'constituent', query: 'alpha-tocotrienol', as: 'alpha-tocotrienol', note: 'Four-isomer tocotrienol family.' },
  { id: 'mixed-tocopherols', kind: 'constituent', query: 'alpha-tocopherol', as: 'alpha-tocopherol', note: 'Alpha/beta/gamma/delta tocopherol blend.' },
  { id: 'phosphatidylserine', kind: 'constituent', query: '1,2-dioleoyl-sn-glycero-3-phospho-L-serine', as: 'a representative diacyl species', note: 'Acyl chain composition varies by source.' },
  { id: 'krill-oil', kind: 'constituent', query: 'eicosapentaenoic acid', as: 'EPA', note: 'Phospholipid-bound omega-3 oil plus astaxanthin.' },
  { id: 'mct-oil', kind: 'constituent', query: 'octanoic acid', as: 'C8 caprylic acid', note: 'C8/C10 triglyceride blend.' },
  { id: 'pumpkin-seed-oil', kind: 'constituent', query: 'linoleic acid', as: 'linoleic acid', note: 'Fatty acid + phytosterol oil.' },
  { id: 'selenium', kind: 'constituent', query: 'L-selenomethionine', as: 'L-selenomethionine', note: 'Supplemented as selenomethionine rather than elemental selenium.' },

  // ── polymers: draw the repeating unit ──────────────────────────────────────
  { id: 'chondroitin', kind: 'repeat-unit', query: 'cid:24766', as: 'the sulfated disaccharide unit' },
  { id: 'inulin', kind: 'repeat-unit', query: '1-kestose', as: '1-kestose, an inulin-type fructan' },

  // ── genuinely non-molecular — the orbital field is the honest answer ───────
  { id: 'glynac', kind: 'none', note: 'Two separate molecules dosed together (glycine + N-acetylcysteine); each has its own page.' },
  { id: 'superoxide-dismutase', kind: 'none', note: 'Metalloenzyme — a protein, not a small molecule.' },
  { id: 'bromelain', kind: 'none', note: 'Proteolytic enzyme complex — a protein mixture.' },
  { id: 'uc-ii', kind: 'none', note: 'Undenatured type-II collagen — a structural protein.' },
  { id: 'pea', kind: 'none', note: 'Pea protein isolate — a protein mixture.' },
  { id: 'turkey-tail', kind: 'none', note: 'PSK/PSP protein-bound polysaccharides — heterogeneous, no defined structure.' },
  { id: 'magnesium', kind: 'none', note: 'Mineral ion; the counter-ion (glycinate, threonate, citrate) varies by form.' },
  { id: 'zinc', kind: 'none', note: 'Mineral ion; form varies (picolinate, bisglycinate, gluconate).' },
  { id: 'collagen-peptides', kind: 'none', note: 'Hydrolysed collagen — a heterogeneous peptide mixture, not one molecule.' },
  { id: 'nattokinase', kind: 'none', note: 'Fibrinolytic enzyme — a protein.' },
  { id: 'lithium', kind: 'none', note: 'Mineral ion; counter-ion (orotate, carbonate) varies by form.' },
  { id: 'iodine', kind: 'none', note: 'Element/iodide ion — no informative skeleton.' },
  { id: 'hyaluronic-acid', kind: 'none', note: 'High-molecular-weight glycosaminoglycan. PubChem carries no repeat-unit record this pipeline could verify, and an unverified disaccharide is worse than an honest abstraction.' },
];

export const MOLECULE_SOURCE_BY_ID = new Map(MOLECULE_SOURCES.map((s) => [s.id, s]));
