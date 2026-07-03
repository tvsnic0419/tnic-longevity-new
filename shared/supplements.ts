export type EvidenceTier = "A" | "B" | "C";

export interface Supplement {
  id: string;
  name: string;
  slug: string;
  tier: EvidenceTier;
  primaryTarget: string;
  pathways: string[];
  mechanism: string;
  evidence: string;
  synergies: string[];
  dosingContext: string;
  rank: number;
  category: string;
}

export interface AgingHallmark {
  id: string;
  name: string;
  description: string;
  icon: string;
  supplements: string[];
}

export interface SynergyPair {
  compounds: string[];
  reason: string;
  pathway: string;
  strength: "strong" | "moderate" | "emerging";
}

export const SUPPLEMENTS: Supplement[] = [
  {
    id: "nmn",
    name: "NMN (Nicotinamide Mononucleotide)",
    slug: "nmn",
    tier: "A",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["NAD+ Biosynthesis", "Sirtuin Activation", "DNA Repair"],
    mechanism: "Direct precursor to NAD+, bypassing the rate-limiting NAMPT step. Elevates intracellular NAD+ to restore mitochondrial function, activate SIRT1/SIRT3, and support PARP-mediated DNA repair.",
    evidence: "Multiple randomized controlled trials (2021-2024) demonstrate 40-60% increases in blood NAD+ metabolites, improved muscle insulin sensitivity, and enhanced aerobic capacity in adults 40-75.",
    synergies: ["Resveratrol", "Apigenin", "TMG (Trimethylglycine)"],
    dosingContext: "Typical research doses: 250-1000mg/day orally. Sublingual forms may improve bioavailability. Often taken in the morning due to potential circadian NAD+ effects.",
    rank: 1,
    category: "NAD+ Precursor"
  },
  {
    id: "omega3",
    name: "Omega-3 (EPA/DHA)",
    slug: "omega-3",
    tier: "A",
    primaryTarget: "Chronic Inflammation",
    pathways: ["NF-kB Inhibition", "SPM Production", "Cell Membrane Fluidity"],
    mechanism: "EPA and DHA incorporate into cell membranes, reducing arachidonic acid-derived pro-inflammatory eicosanoids. They serve as precursors to specialized pro-resolving mediators (SPMs) that actively resolve inflammation.",
    evidence: "Decades of human trial data. VITAL trial (n=25,871) showed 28% reduction in heart attack risk. REDUCE-IT demonstrated 25% cardiovascular event reduction with high-dose EPA.",
    synergies: ["Vitamin D3", "Curcumin", "Astaxanthin"],
    dosingContext: "Research doses: 1-4g combined EPA+DHA daily. Higher EPA ratios for inflammation; balanced for general health. Take with fatty meals for absorption.",
    rank: 2,
    category: "Essential Fatty Acid"
  },
  {
    id: "spermidine",
    name: "Spermidine",
    slug: "spermidine",
    tier: "A",
    primaryTarget: "Compromised Autophagy",
    pathways: ["Autophagy Induction", "Proteostasis", "Epigenetic Regulation"],
    mechanism: "Polyamine that induces autophagy through inhibition of acetyltransferase EP300, mimicking caloric restriction at the cellular level. Promotes clearance of damaged organelles and misfolded proteins.",
    evidence: "Bruneck Study (20-year prospective, n=829) showed highest-tertile spermidine intake associated with 5.7-year mortality reduction. Clinical trials confirm improved memory and cardiac function in elderly.",
    synergies: ["Fasting/Time-Restricted Eating", "Resveratrol", "Urolithin A"],
    dosingContext: "Dietary sources: wheat germ, aged cheese, mushrooms. Supplemental doses: 1-6mg/day. Often taken with meals. Synergizes with intermittent fasting protocols.",
    rank: 3,
    category: "Polyamine"
  },
  {
    id: "resveratrol",
    name: "Resveratrol",
    slug: "resveratrol",
    tier: "B",
    primaryTarget: "Deregulated Nutrient Sensing",
    pathways: ["SIRT1 Activation", "AMPK Activation", "NRF2 Pathway"],
    mechanism: "Polyphenol stilbene that allosterically activates SIRT1, mimicking caloric restriction signaling. Also activates AMPK and the NRF2 antioxidant response pathway.",
    evidence: "Strong mechanistic and animal data. Human trials show improved vascular function and glucose metabolism, but bioavailability remains a challenge. Best evidence in combination with NAD+ precursors.",
    synergies: ["NMN/NR", "Quercetin", "Pterostilbene"],
    dosingContext: "Research doses: 150-1000mg/day. Trans-resveratrol is the active form. Take with fat-containing meals. Micronized forms improve absorption. Often paired with NMN.",
    rank: 4,
    category: "Polyphenol"
  },
  {
    id: "fisetin",
    name: "Fisetin",
    slug: "fisetin",
    tier: "B",
    primaryTarget: "Cellular Senescence",
    pathways: ["Senolytic Activity", "Anti-inflammatory", "Neuroprotection"],
    mechanism: "Flavonoid with potent senolytic properties — selectively induces apoptosis in senescent cells while sparing healthy cells. Reduces SASP (senescence-associated secretory phenotype) inflammatory burden.",
    evidence: "Mayo Clinic trials (ongoing) show senescent cell clearance in humans. Mouse studies demonstrate 10% median lifespan extension. AFFIRM trial investigating intermittent high-dose protocols.",
    synergies: ["Quercetin", "NMN", "Spermidine"],
    dosingContext: "Senolytic protocol: 20mg/kg for 2 consecutive days, repeated monthly (intermittent dosing). Daily low-dose: 100-500mg for antioxidant effects. Liposomal forms preferred.",
    rank: 5,
    category: "Senolytic Flavonoid"
  },
  {
    id: "coq10",
    name: "CoQ10 (Ubiquinol)",
    slug: "coq10",
    tier: "A",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["Electron Transport Chain", "Antioxidant Defense", "ATP Production"],
    mechanism: "Essential cofactor in mitochondrial Complex III of the electron transport chain. In its reduced form (ubiquinol), acts as a potent lipid-soluble antioxidant protecting mitochondrial membranes from oxidative damage.",
    evidence: "Q-SYMBIO trial (n=420) showed 43% reduction in cardiovascular mortality over 2 years. KiSel-10 study demonstrated 53% reduction in CV mortality with CoQ10 + selenium over 5 years.",
    synergies: ["PQQ", "Magnesium", "Selenium"],
    dosingContext: "Ubiquinol (reduced form) preferred over ubiquinone for adults 40+. Typical doses: 100-300mg/day. Take with fat-containing meals. Statin users may need higher doses.",
    rank: 6,
    category: "Mitochondrial Cofactor"
  },
  {
    id: "ca-akg",
    name: "Calcium Alpha-Ketoglutarate (Ca-AKG)",
    slug: "ca-akg",
    tier: "B",
    primaryTarget: "Epigenetic Alterations",
    pathways: ["TET Enzyme Activation", "DNA Demethylation", "TCA Cycle"],
    mechanism: "Key TCA cycle intermediate that serves as a cofactor for TET demethylases and Jumonji-domain histone demethylases. Supports epigenetic maintenance by enabling proper DNA and histone demethylation patterns.",
    evidence: "Rejuvant trial (n=42) showed 8-year reduction in biological age (DNAmAge) over 7 months. Mouse studies show 12% median lifespan extension and reduced frailty markers.",
    synergies: ["Vitamin C", "NMN", "Glycine"],
    dosingContext: "Research dose: 1000mg/day (as calcium salt). Take on empty stomach for best absorption. Often cycled: 5 days on, 2 days off. Vitamin C enhances TET enzyme activity.",
    rank: 7,
    category: "Metabolite"
  },
  {
    id: "apigenin",
    name: "Apigenin",
    slug: "apigenin",
    tier: "B",
    primaryTarget: "Deregulated Nutrient Sensing",
    pathways: ["CD38 Inhibition", "NAD+ Preservation", "Anxiolytic"],
    mechanism: "Flavone that potently inhibits CD38, the primary NAD+-consuming enzyme that increases with age. By blocking CD38, apigenin preserves endogenous NAD+ pools without requiring exogenous supplementation.",
    evidence: "Mechanistic studies confirm CD38 inhibition in human tissues. Clinical data supports anxiolytic and sleep-promoting effects. Longevity-specific human trials are emerging but limited.",
    synergies: ["NMN/NR", "Luteolin", "Quercetin"],
    dosingContext: "Typical doses: 50-500mg/day. Often taken in the evening due to mild sedative effects. Found naturally in chamomile, parsley, celery. Pairs well with NAD+ precursors.",
    rank: 8,
    category: "Flavone"
  },
  {
    id: "berberine",
    name: "Berberine",
    slug: "berberine",
    tier: "B",
    primaryTarget: "Deregulated Nutrient Sensing",
    pathways: ["AMPK Activation", "Glucose Metabolism", "Gut Microbiome"],
    mechanism: "Isoquinoline alkaloid that activates AMPK through inhibition of mitochondrial Complex I, mimicking the metabolic effects of exercise and metformin. Also modulates gut microbiota composition favorably.",
    evidence: "Meta-analyses of 27+ RCTs confirm efficacy comparable to metformin for blood glucose reduction. Demonstrated improvements in lipid profiles, insulin sensitivity, and inflammatory markers.",
    synergies: ["Milk Thistle (absorption)", "Omega-3", "Chromium"],
    dosingContext: "Standard dose: 500mg 2-3x/day with meals. Dihydroberberine may offer better bioavailability. Cycle 8 weeks on, 2 weeks off. Monitor blood glucose if on medications.",
    rank: 9,
    category: "Alkaloid"
  },
  {
    id: "curcumin",
    name: "Curcumin (Bioavailable)",
    slug: "curcumin",
    tier: "B",
    primaryTarget: "Chronic Inflammation",
    pathways: ["NF-kB Inhibition", "COX-2 Inhibition", "NRF2 Activation"],
    mechanism: "Polyphenol that inhibits NF-kB nuclear translocation at multiple points, suppressing over 100 pro-inflammatory genes. Also activates NRF2 antioxidant response and inhibits COX-2/LOX enzymes.",
    evidence: "200+ clinical trials across inflammation, cognition, and joint health. Bioavailable forms (Longvida, Meriva, CurcuWIN) show consistent anti-inflammatory effects in humans.",
    synergies: ["Piperine", "Omega-3", "Quercetin", "Boswellia"],
    dosingContext: "Bioavailable forms essential: Longvida 400mg, Meriva 1000mg, or standard + piperine (2000mg + 20mg). Take with meals. Anti-inflammatory effects within 4-8 weeks.",
    rank: 10,
    category: "Polyphenol"
  },
  {
    id: "urolithin-a",
    name: "Urolithin A",
    slug: "urolithin-a",
    tier: "A",
    primaryTarget: "Compromised Autophagy",
    pathways: ["Mitophagy", "Mitochondrial Biogenesis", "Muscle Function"],
    mechanism: "Postbiotic metabolite that activates mitophagy — the selective autophagy of damaged mitochondria. Triggers PINK1/Parkin pathway to clear dysfunctional mitochondria and stimulates biogenesis of new ones.",
    evidence: "ATLAS trial (n=88) demonstrated improved mitochondrial function and muscle endurance in elderly. Multiple RCTs confirm bioavailability and mitophagy activation biomarkers in humans.",
    synergies: ["Spermidine", "CoQ10", "NAD+ Precursors"],
    dosingContext: "Clinical dose: 500-1000mg/day (Mitopure/Timeline brand used in trials). Gut microbiome converts ellagitannins to UA naturally, but only ~40% of people produce it efficiently.",
    rank: 11,
    category: "Postbiotic"
  },
  {
    id: "quercetin",
    name: "Quercetin",
    slug: "quercetin",
    tier: "B",
    primaryTarget: "Cellular Senescence",
    pathways: ["Senolytic (with Dasatinib)", "Anti-inflammatory", "Antiviral"],
    mechanism: "Flavonol that acts as a senolytic when combined with dasatinib (D+Q protocol) by inhibiting pro-survival pathways (PI3K, BCL-2 family) in senescent cells. Also has broad anti-inflammatory and immunomodulatory effects.",
    evidence: "Unity Biotechnology and Mayo Clinic trials validate D+Q senolytic protocol in humans with idiopathic pulmonary fibrosis and diabetic kidney disease. Standalone quercetin has extensive safety data.",
    synergies: ["Fisetin", "Dasatinib (clinical)", "Vitamin C", "Bromelain"],
    dosingContext: "Senolytic protocol: 1000mg + Dasatinib 100mg for 3 days/month. Daily antioxidant: 500-1000mg. Phytosome forms improve absorption. Take away from antibiotics.",
    rank: 12,
    category: "Senolytic Flavonol"
  },
  {
    id: "glycine",
    name: "Glycine",
    slug: "glycine",
    tier: "B",
    primaryTarget: "Epigenetic Alterations",
    pathways: ["Methyl Donor Pool", "Glutathione Synthesis", "Collagen Production"],
    mechanism: "Simplest amino acid that serves as a methyl group acceptor, supporting SAM cycle balance. Also a rate-limiting precursor for glutathione synthesis (with NAC) and essential for collagen turnover.",
    evidence: "GlyNAC (glycine + NAC) trials in elderly show reversal of multiple hallmarks: improved mitochondrial function, reduced oxidative stress, insulin resistance, and genomic damage markers.",
    synergies: ["NAC", "TMG", "Collagen Peptides"],
    dosingContext: "Research doses: 1-3g 2-3x/day. GlyNAC protocol: 1.33mmol/kg/day each of glycine and NAC. Sweet taste makes it easy to add to beverages. Safe at high doses.",
    rank: 13,
    category: "Amino Acid"
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3 + K2",
    slug: "vitamin-d3-k2",
    tier: "A",
    primaryTarget: "Altered Intercellular Communication",
    pathways: ["VDR Signaling", "Immune Modulation", "Calcium Homeostasis"],
    mechanism: "Vitamin D3 activates the Vitamin D Receptor (VDR) in over 200 genes, modulating immune function, reducing inflammatory cytokines, and supporting cellular communication. K2 directs calcium to bones, away from arteries.",
    evidence: "Meta-analyses of 50+ RCTs show reduced all-cause mortality with adequate D levels (40-60 ng/mL). VITAL trial showed benefits in cancer mortality reduction. K2 data supports arterial health.",
    synergies: ["Omega-3", "Magnesium", "Boron"],
    dosingContext: "Dose to blood level (40-60 ng/mL): typically 2000-5000 IU/day D3. Always pair with K2 (MK-7, 100-200mcg). Take with largest fat-containing meal. Test levels every 3-6 months.",
    rank: 14,
    category: "Fat-Soluble Vitamin"
  },
  {
    id: "magnesium",
    name: "Magnesium (Threonate/Glycinate)",
    slug: "magnesium",
    tier: "A",
    primaryTarget: "Altered Intercellular Communication",
    pathways: ["Enzymatic Cofactor (300+)", "NMDA Modulation", "Sleep Architecture"],
    mechanism: "Essential mineral cofactor for 300+ enzymatic reactions including ATP production, DNA repair, and protein synthesis. Threonate form crosses BBB to support synaptic plasticity; glycinate supports GABA and sleep.",
    evidence: "Population data shows 50%+ are deficient. RCTs demonstrate improved sleep quality, reduced blood pressure, enhanced insulin sensitivity, and neuroprotection with adequate supplementation.",
    synergies: ["Vitamin D3", "CoQ10", "Zinc"],
    dosingContext: "Threonate: 144mg elemental Mg (as 2g MgT) for cognition. Glycinate: 200-400mg elemental for sleep/relaxation. Avoid oxide form (poor absorption). Split doses AM/PM.",
    rank: 15,
    category: "Essential Mineral"
  }
];

export const AGING_HALLMARKS: AgingHallmark[] = [
  {
    id: "genomic-instability",
    name: "Genomic Instability",
    description: "Accumulation of DNA damage from endogenous and exogenous sources, overwhelming repair mechanisms and leading to mutations, chromosomal aberrations, and gene expression changes.",
    icon: "Dna",
    supplements: ["nmn", "glycine", "vitamin-d3"]
  },
  {
    id: "telomere-attrition",
    name: "Telomere Attrition",
    description: "Progressive shortening of protective chromosome end-caps with each cell division, eventually triggering cellular senescence or apoptosis when critically short.",
    icon: "Timer",
    supplements: ["omega3", "vitamin-d3", "resveratrol"]
  },
  {
    id: "epigenetic-alterations",
    name: "Epigenetic Alterations",
    description: "Age-related changes in DNA methylation, histone modifications, and chromatin remodeling that alter gene expression patterns without changing the DNA sequence.",
    icon: "Layers",
    supplements: ["ca-akg", "glycine", "spermidine"]
  },
  {
    id: "loss-of-proteostasis",
    name: "Loss of Proteostasis",
    description: "Decline in the protein quality control network — including chaperones, proteasome, and autophagy — leading to accumulation of misfolded and aggregated proteins.",
    icon: "Shapes",
    supplements: ["spermidine", "urolithin-a", "curcumin"]
  },
  {
    id: "deregulated-nutrient-sensing",
    name: "Deregulated Nutrient Sensing",
    description: "Dysregulation of the mTOR, AMPK, Sirtuin, and insulin/IGF-1 signaling networks that coordinate cellular growth, metabolism, and stress responses.",
    icon: "Activity",
    supplements: ["resveratrol", "berberine", "apigenin", "nmn"]
  },
  {
    id: "mitochondrial-dysfunction",
    name: "Mitochondrial Dysfunction",
    description: "Age-related decline in mitochondrial membrane potential, electron transport efficiency, and biogenesis, leading to reduced ATP output and increased reactive oxygen species.",
    icon: "Zap",
    supplements: ["coq10", "nmn", "urolithin-a"]
  },
  {
    id: "cellular-senescence",
    name: "Cellular Senescence",
    description: "Accumulation of permanently growth-arrested 'zombie cells' that secrete pro-inflammatory factors (SASP), driving tissue dysfunction and chronic inflammation.",
    icon: "Skull",
    supplements: ["fisetin", "quercetin", "spermidine"]
  },
  {
    id: "stem-cell-exhaustion",
    name: "Stem Cell Exhaustion",
    description: "Decline in the number and regenerative capacity of tissue-resident stem cells, reducing the body's ability to repair and maintain tissues.",
    icon: "Sprout",
    supplements: ["nmn", "resveratrol", "vitamin-d3"]
  },
  {
    id: "altered-intercellular-communication",
    name: "Altered Intercellular Communication",
    description: "Changes in endocrine, neuroendocrine, and neuronal signaling, including increased inflammatory signaling (inflammaging) and altered immune surveillance.",
    icon: "Network",
    supplements: ["omega3", "vitamin-d3", "magnesium"]
  },
  {
    id: "compromised-autophagy",
    name: "Compromised Autophagy",
    description: "Reduced efficiency of cellular self-cleaning mechanisms that recycle damaged organelles, misfolded proteins, and intracellular pathogens.",
    icon: "Recycle",
    supplements: ["spermidine", "urolithin-a", "resveratrol"]
  },
  {
    id: "gut-dysbiosis",
    name: "Gut Dysbiosis",
    description: "Age-related shifts in gut microbiome composition and diversity, affecting nutrient absorption, immune function, and systemic inflammation through the gut-brain axis.",
    icon: "Bug",
    supplements: ["berberine", "omega3", "spermidine"]
  },
  {
    id: "chronic-inflammation",
    name: "Chronic Inflammation",
    description: "Persistent, low-grade systemic inflammation (inflammaging) driven by senescent cells, gut permeability, and dysregulated immune responses that accelerates all other hallmarks.",
    icon: "Flame",
    supplements: ["omega3", "curcumin", "quercetin", "fisetin"]
  }
];

export const SYNERGY_PAIRS: SynergyPair[] = [
  {
    compounds: ["NMN", "Resveratrol"],
    reason: "NMN provides the NAD+ substrate while Resveratrol activates SIRT1 — together they maximize sirtuin-mediated longevity signaling beyond what either achieves alone.",
    pathway: "NAD+/Sirtuin Axis",
    strength: "strong"
  },
  {
    compounds: ["NMN", "Apigenin"],
    reason: "NMN boosts NAD+ production while Apigenin inhibits CD38-mediated NAD+ degradation — a supply + preservation strategy for optimal NAD+ levels.",
    pathway: "NAD+ Optimization",
    strength: "strong"
  },
  {
    compounds: ["Fisetin", "Quercetin"],
    reason: "Both are senolytics targeting different anti-apoptotic pathways in senescent cells. Combined, they achieve broader senescent cell clearance.",
    pathway: "Senolytic Clearance",
    strength: "strong"
  },
  {
    compounds: ["CoQ10", "PQQ"],
    reason: "CoQ10 supports existing mitochondrial electron transport while PQQ stimulates mitochondrial biogenesis — repair + renewal for the mitochondrial network.",
    pathway: "Mitochondrial Health",
    strength: "strong"
  },
  {
    compounds: ["Spermidine", "Urolithin A"],
    reason: "Spermidine induces general autophagy while Urolithin A specifically targets mitophagy — comprehensive cellular recycling across all organelles.",
    pathway: "Autophagy/Mitophagy",
    strength: "strong"
  },
  {
    compounds: ["Omega-3", "Curcumin"],
    reason: "Omega-3s reduce pro-inflammatory eicosanoid production while Curcumin inhibits NF-kB — dual anti-inflammatory mechanisms for synergistic inflammation resolution.",
    pathway: "Anti-Inflammation",
    strength: "strong"
  },
  {
    compounds: ["Glycine", "NAC"],
    reason: "Together they form the GlyNAC protocol, providing both rate-limiting precursors for glutathione synthesis — the body's master antioxidant.",
    pathway: "Glutathione/Redox",
    strength: "strong"
  },
  {
    compounds: ["Vitamin D3", "Magnesium"],
    reason: "Magnesium is required for vitamin D activation (hydroxylation). Without adequate Mg, vitamin D remains inactive regardless of dose.",
    pathway: "Vitamin D Activation",
    strength: "strong"
  },
  {
    compounds: ["Berberine", "Omega-3"],
    reason: "Berberine activates AMPK for metabolic optimization while Omega-3 reduces the inflammatory component of metabolic syndrome — complementary metabolic support.",
    pathway: "Metabolic Health",
    strength: "moderate"
  },
  {
    compounds: ["Ca-AKG", "Vitamin C"],
    reason: "Vitamin C is a required cofactor for TET enzymes that use AKG as a substrate for DNA demethylation — both are needed for proper epigenetic maintenance.",
    pathway: "Epigenetic Maintenance",
    strength: "moderate"
  },
  {
    compounds: ["NMN", "TMG"],
    reason: "NMN metabolism consumes methyl groups. TMG (betaine) replenishes the methyl donor pool, preventing potential homocysteine elevation from high-dose NMN.",
    pathway: "Methylation Balance",
    strength: "moderate"
  },
  {
    compounds: ["Resveratrol", "Pterostilbene"],
    reason: "Pterostilbene has 4x the bioavailability of resveratrol with similar SIRT1 activation. Combined, they provide both immediate and sustained sirtuin activation.",
    pathway: "Sirtuin Activation",
    strength: "moderate"
  }
];
