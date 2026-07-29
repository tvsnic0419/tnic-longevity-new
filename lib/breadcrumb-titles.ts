import type { LibraryModuleCategory } from './library-modules';
import type { ToolId } from './registry';

/**
 * Lightweight slug → display-title lookups for breadcrumb / route-context
 * rendering.
 *
 * These maps intentionally duplicate only the *titles* from the full content
 * modules (`comparisons`, `hallmarks-library`, `library-modules`, `registry`).
 * The OS status bar (`ContextBar`) renders on nearly every page and only needs
 * titles to build breadcrumbs — importing the full modules there would pull
 * ~40 kB gzipped of mechanism/citation/body payload into every route's client
 * bundle. Keeping this module free of heavy imports lets it tree-shake cleanly.
 *
 * `breadcrumb-titles.test.ts` asserts these stay in sync with the source data,
 * so any added/renamed compound, hallmark, comparison, or tool fails CI until
 * the corresponding entry here is updated.
 */

export const comparisonTitles: Record<string, string> = {
  'nmn-vs-nr': 'NMN vs NR',
  'glynac-vs-liposomal-glutathione': 'GlyNAC vs Liposomal Glutathione',
  'sulforaphane-vs-curcumin': 'Sulforaphane vs Curcumin',
  'resveratrol-vs-pterostilbene': 'Trans-Resveratrol vs Pterostilbene',
  'nrf2-triad-vs-mito-stack': 'NRF2 Triad vs NAD+ Mito Stack',
  'starter-elite-vs-full-hybrid': 'Starter Elite vs Full Hybrid',
  'berberine-vs-metformin': 'Berberine vs Metformin',
  'urolithina-vs-coq10': 'Urolithin A vs CoQ10',
  'nmn-vs-spermidine': 'NMN vs Spermidine',
  'fisetin-vs-quercetin': 'Fisetin vs Quercetin',
  'taurine-vs-nmn': 'Taurine vs NMN',
  'cakg-vs-spermidine': 'Ca-AKG vs Spermidine',
  'rapamycin-vs-metformin': 'Rapamycin vs Metformin',
  'coq10-vs-ubiquinol': 'CoQ10 vs Ubiquinol',
  'omega3-vs-krill-oil': 'Omega-3 vs Krill Oil',
};

export const hallmarkTitles: Record<string, string> = {
  'genomic-instability': 'Genomic Instability',
  'telomere-attrition': 'Telomere Attrition',
  'epigenetic-alterations': 'Epigenetic Alterations',
  'loss-of-proteostasis': 'Loss of Proteostasis',
  'disabled-autophagy': 'Disabled Autophagy',
  'mitochondrial-dysfunction': 'Mitochondrial Dysfunction',
  'cellular-senescence': 'Cellular Senescence',
  'stem-cell-exhaustion': 'Stem Cell Exhaustion',
  'altered-intercellular-communication': 'Altered Intercellular Communication',
  'chronic-inflammation': 'Chronic Inflammation',
  dysbiosis: 'Dysbiosis',
  'disabled-macroautophagy': 'Disabled Macroautophagy',
};

/** Keyed by `${category}/${slug}`. */
export const libraryModuleTitles: Record<string, string> = {
  'compounds/glynac': "GlyNAC (Glycine + NAC)",
  'compounds/nmn': "NMN (Nicotinamide Mononucleotide)",
  'compounds/nr': "NR (Nicotinamide Riboside)",
  'compounds/rapamycin': "Rapamycin (Sirolimus)",
  'compounds/tudca': "TUDCA (Tauroursodeoxycholic Acid)",
  'compounds/grapeseed': "Grape Seed Extract (95% OPC)",
  'compounds/sulforaphane': "Sulforaphane",
  'compounds/rala': "R-Alpha Lipoic Acid (R-ALA)",
  'compounds/cakg': "Ca-AKG (Calcium Alpha-Ketoglutarate)",
  'compounds/resveratrol': "Trans-Resveratrol",
  'compounds/taurine': "Taurine",
  'compounds/spermidine': "Spermidine",
  'compounds/pterostilbene': "Pterostilbene",
  'compounds/berberine': "Berberine HCl",
  'compounds/urolithina': "Urolithin A (Mitopure)",
  'compounds/fisetin': "Fisetin",
  'compounds/coq10': "CoQ10 (Ubiquinol)",
  'compounds/omega3': "Omega-3 (EPA + DHA)",
  'compounds/metformin': "Metformin",
  'compounds/creatine': "Creatine Monohydrate",
  'compounds/vitamin-d3': "Vitamin D3 (Cholecalciferol)",
  'compounds/magnesium': "Magnesium (Glycinate / Threonate)",
  'compounds/curcumin': "Curcumin (Curcuminoids)",
  'compounds/quercetin': "Quercetin",
  'compounds/glucosamine': "Glucosamine Sulfate",
  'compounds/vitamin-k2': "Vitamin K2 (MK-7)",
  'compounds/melatonin': "Melatonin",
  'compounds/glycine': "Glycine",
  'compounds/nac': "N-Acetylcysteine (NAC)",
  'compounds/zinc': "Zinc",
  'compounds/l-citrulline': "L-Citrulline",
  'compounds/egcg': "EGCG (Green Tea Catechin)",
  'compounds/astaxanthin': "Astaxanthin",
  'compounds/apigenin': "Apigenin",
  'compounds/luteolin': "Luteolin",
  'compounds/ergothioneine': "Ergothioneine",
  'compounds/l-carnosine': "L-Carnosine",
  'compounds/tmg': "TMG (Trimethylglycine / Betaine)",
  'compounds/tocotrienols': "Tocotrienols (Vitamin E)",
  'compounds/butyrate': "Butyrate (Sodium / Tributyrin)",
  'compounds/ashwagandha': "Ashwagandha (Withania somnifera)",
  'compounds/rhodiola': "Rhodiola rosea",
  'compounds/nicotinamide': "Nicotinamide (NAM)",
  'compounds/hesperidin': "Hesperidin",
  'compounds/boswellia': "Boswellia serrata (AKBA)",
  'compounds/gynostemma': "Gynostemma pentaphyllum (Jiaogulan)",
  'compounds/lithium': "Low-Dose Lithium",
  'compounds/hyaluronic-acid': "Hyaluronic Acid (Oral)",
  'compounds/inulin': "Inulin / Prebiotic Fiber",
  'compounds/acarbose': "Acarbose",
  'compounds/canagliflozin': "Canagliflozin (SGLT2 inhibitor)",
  'compounds/17a-estradiol': "17-alpha-Estradiol",
  'compounds/dasatinib': "Dasatinib",
  'compounds/selenium': "Selenium",
  'compounds/pqq': "PQQ (Pyrroloquinoline Quinone)",
  'synergies/glynac-nrf2-triad': "NRF2 Defense Triad",
  'synergies/nmn-resveratrol-sirt1': "SIRT1 Activation Pair",
  'synergies/nad-mito-stack': "NAD+ Mitochondrial Stack",
  'synergies/systems-longevity-stack': "Systems-Biology Longevity Stack",
  'lifestyle/exercise': "Exercise",
  'lifestyle/sleep': "Sleep",
  'lifestyle/nutrition': "Nutrition",
  'lifestyle/stress': "Stress & Recovery",
  'guides/testing-and-monitoring': "Testing & Monitoring Guide",
};

export const libraryCategoryLabels: Record<LibraryModuleCategory, string> = {
  compounds: 'Compound Deep-Dives',
  synergies: 'Synergy Guides',
  lifestyle: 'Lifestyle Pillars',
  guides: 'Testing & Monitoring',
};

export const toolLabels: Record<ToolId, string> = {
  simulator: 'Stack Simulator',
  network: 'Stack Network',
  protocol: 'Protocol Engine',
  biomarker: 'Biomarker Dashboard',
  impact: 'Biomarker Impact',
  healthspan: 'Healthspan Estimator',
  inventory: 'Inventory Forecast',
};

export const peptideTitles: Record<string, string> = {
  'bpc-157': 'BPC-157',
  'ghk-cu': 'GHK-Cu',
  epithalon: 'Epithalon',
  'thymosin-alpha-1': 'Thymosin Alpha-1',
  'gh-secretagogues': 'Ipamorelin & CJC-1295',
  'mots-c': 'MOTS-c',
  'glp1-longevity': 'Semaglutide & Tirzepatide',
  humanin: 'Humanin',
};
