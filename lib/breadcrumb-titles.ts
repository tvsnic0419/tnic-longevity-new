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

/**
 * Top-level route slugs whose display title should be stated rather than
 * inferred. `buildRouteBreadcrumbs` falls back to title-casing the slug, which
 * silently produces the wrong label for any route whose name isn't just its
 * words capitalized — so anything added here is authoritative over that guess.
 */
export const routeTitles: Record<string, string> = {
  'compound-engine': 'Compound Engine',
  'pathway-architect': 'Pathway Architect',
  'sirtuin-atlas': 'Sirtuin Atlas',
};

/**
 * Supplement-guide route → breadcrumb leaf label. Keyed by full route so
 * `buildRouteBreadcrumbs` can special-case the `/…-supplement-guide` pages into
 * a `TNiC › Supplement Guides › <title>` trail. Duplicated from the
 * `SUPPLEMENT_GUIDES` registry titles (kept out of this bundle-light module on
 * purpose); `breadcrumb-titles.test.ts` asserts the two never drift.
 */
export const guideTitles: Record<string, string> = {
  '/longevity-supplements-guide': 'Best Longevity Supplements 2026',
  '/nad-supplement-guide': 'NAD+ Supplement Guide',
  '/glynac-supplement-guide': 'GlyNAC Supplement Guide',
  '/berberine-supplement-guide': 'Berberine Guide',
  '/taurine-supplement-guide': 'Taurine Longevity Guide',
  '/sulforaphane-supplement-guide': 'Sulforaphane & NRF2 Guide',
  '/spermidine-supplement-guide': 'Spermidine Guide',
};

export const comparisonTitles: Record<string, string> = {
  'nmn-vs-nr': 'NMN vs NR',
  'glynac-vs-liposomal-glutathione': 'GlyNAC vs Liposomal Glutathione',
  'sulforaphane-vs-curcumin': 'Sulforaphane vs Curcumin',
  'resveratrol-vs-pterostilbene': 'Trans-Resveratrol vs Pterostilbene',
  'nrf2-triad-vs-mito-stack': 'NRF2 Triad vs NAD+ Mito Stack',
  'starter-elite-vs-full-hybrid': 'Starter Elite vs Full Hybrid',
  'berberine-vs-metformin': 'Berberine vs Metformin',
  'urolithin-a-vs-coq10': 'Urolithin A vs CoQ10',
  'nmn-vs-spermidine': 'NMN vs Spermidine',
  'fisetin-vs-quercetin': 'Fisetin vs Quercetin',
  'taurine-vs-nmn': 'Taurine vs NMN',
  'cakg-vs-spermidine': 'Ca-AKG vs Spermidine',
  'rapamycin-vs-metformin': 'Rapamycin vs Metformin',
  'coq10-vs-ubiquinol': 'CoQ10 vs Ubiquinol',
  'omega3-vs-krill-oil': 'Omega-3 vs Krill Oil',
  'magnesium-glycinate-vs-threonate': 'Magnesium Glycinate vs L-Threonate',
  'coq10-vs-pqq': 'CoQ10 vs PQQ',
};

export const hallmarkTitles: Record<string, string> = {
  'genomic-instability': 'Genomic Instability',
  'telomere-attrition': 'Telomere Attrition',
  'epigenetic-alterations': 'Epigenetic Alterations',
  'loss-of-proteostasis': 'Loss of Proteostasis',
  'disabled-macroautophagy': 'Disabled Macroautophagy',
  'mitochondrial-dysfunction': 'Mitochondrial Dysfunction',
  'cellular-senescence': 'Cellular Senescence',
  'stem-cell-exhaustion': 'Stem Cell Exhaustion',
  'altered-intercellular-communication': 'Altered Intercellular Communication',
  'chronic-inflammation': 'Chronic Inflammation',
  dysbiosis: 'Dysbiosis',
  'deregulated-nutrient-sensing': 'Deregulated Nutrient Sensing',
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
  'compounds/urolithin-a': "Urolithin A",
  'compounds/fisetin': "Fisetin",
  'compounds/coq10': "CoQ10 (Ubiquinol)",
  'compounds/omega3': "Omega-3 (EPA + DHA)",
  'compounds/cocoa-flavanols': "Cocoa Flavanols",
  'compounds/bergamot': "Citrus Bergamot",
  'compounds/l-theanine': "L-Theanine",
  'compounds/collagen-peptides': "Collagen Peptides",
  'compounds/beetroot-nitrate': "Beetroot / Dietary Nitrate",
  'compounds/lions-mane': "Lion's Mane",
  'compounds/citicoline': "Citicoline (CDP-Choline)",
  'compounds/nattokinase': "Nattokinase",
  'compounds/mitoq': "MitoQ (Mitoquinol)",
  'compounds/aged-garlic': "Aged Garlic Extract",
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
  // ── Aug 2026 expansion batch (65 → 100) ──
  'compounds/alpha-gpc': "Alpha-GPC (L-Alpha-Glycerylphosphorylcholine)",
  'compounds/phosphatidylserine': "Phosphatidylserine (PS)",
  'compounds/ginkgo-biloba': "Ginkgo Biloba (EGb 761)",
  'compounds/panax-ginseng': "Panax Ginseng (Korean / Asian Ginseng)",
  'compounds/mucuna-pruriens': "Mucuna Pruriens (Velvet Bean, L-DOPA)",
  'compounds/theobromine': "Theobromine",
  'compounds/capsaicin': "Capsaicin (Cayenne / Chili)",
  'compounds/pumpkin-seed-oil': "Pumpkin Seed Oil",
  'compounds/superoxide-dismutase': "Superoxide Dismutase (SOD, Oral GliSODin)",
  'compounds/piperine': "Piperine (BioPerine)",
  'compounds/mct-oil': "MCT Oil (Medium-Chain Triglycerides / C8:C10)",
  'compounds/bacopa-monnieri': "Bacopa Monnieri (Brahmi)",
  'compounds/cordyceps': "Cordyceps (Cordyceps militaris / sinensis)",
  'compounds/reishi': "Reishi (Ganoderma lucidum)",
  'compounds/turkey-tail': "Turkey Tail (Trametes versicolor, PSK / PSP)",
  'compounds/astragalus': "Astragalus (Astragalus membranaceus)",
  'compounds/milk-thistle': "Milk Thistle (Silymarin / Silybin)",
  'compounds/msm': "MSM (Methylsulfonylmethane)",
  'compounds/chondroitin': "Chondroitin Sulfate",
  'compounds/uc-ii': "UC-II (Undenatured Type II Collagen)",
  'compounds/bromelain': "Bromelain",
  'compounds/methylfolate': "Methylfolate (L-5-MTHF / L-Methylfolate)",
  'compounds/methylcobalamin': "Methylcobalamin (Active B12)",
  'compounds/p5p': "P5P (Pyridoxal-5-Phosphate, Active B6)",
  'compounds/benfotiamine': "Benfotiamine (Fat-Soluble B1)",
  'compounds/niacin': "Niacin (Nicotinic Acid, Vitamin B3)",
  'compounds/vitamin-c': "Vitamin C (Ascorbic Acid)",
  'compounds/mixed-tocopherols': "Mixed Tocopherols (Full-Spectrum Vitamin E)",
  'compounds/iodine': "Iodine",
  'compounds/hmb': "HMB (β-Hydroxy β-Methylbutyrate)",
  'compounds/trigonelline': "Trigonelline (Frontier NAD+ Precursor)",
  'compounds/krill-oil': "Krill Oil (Phospholipid Omega-3)",
  'compounds/pea': "PEA (Palmitoylethanolamide)",
  'compounds/l-arginine': "L-Arginine",
  'compounds/acetyl-l-carnitine': "Acetyl-L-Carnitine (ALCAR)",
  'synergies/glynac-nrf2-triad': "NRF2 Defense Triad",
  'synergies/nmn-resveratrol-sirt1': "SIRT1 Activation Pair",
  'synergies/nad-mito-stack': "NAD+ Mitochondrial Stack",
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
