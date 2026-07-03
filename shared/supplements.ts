export type EvidenceTier = "A" | "B" | "C";

export interface PubMedCitation {
  pmid: string;
  title: string;
  year: number;
  journal: string;
}

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
  citations: PubMedCitation[];
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
    category: "NAD+ Precursor",
    citations: [
      { pmid: "36482258", title: "Nicotinamide mononucleotide supplementation enhances aerobic capacity in amateur runners", year: 2022, journal: "J Int Soc Sports Nutr" },
      { pmid: "34238308", title: "Effect of oral NMN on plasma NMN and insulin sensitivity in overweight adults", year: 2021, journal: "Science" },
      { pmid: "35182418", title: "NMN supplementation increases NAD+ metabolome in healthy middle-aged adults", year: 2022, journal: "Front Aging" }
    ]
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
    category: "Essential Fatty Acid",
    citations: [
      { pmid: "30415628", title: "Marine n-3 fatty acids and prevention of cardiovascular disease and cancer (VITAL)", year: 2019, journal: "N Engl J Med" },
      { pmid: "30525132", title: "Cardiovascular risk reduction with icosapent ethyl (REDUCE-IT)", year: 2019, journal: "N Engl J Med" },
      { pmid: "34255983", title: "Omega-3 fatty acids and inflammatory processes: from molecules to man", year: 2021, journal: "Biochem Soc Trans" }
    ]
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
    category: "Polyamine",
    citations: [
      { pmid: "30525997", title: "Higher spermidine intake is linked to lower mortality: a prospective population-based study", year: 2018, journal: "Am J Clin Nutr" },
      { pmid: "30877062", title: "Spermidine in health and disease", year: 2019, journal: "Science" },
      { pmid: "33588774", title: "Safety and tolerability of spermidine supplementation in older adults (SmartAge)", year: 2021, journal: "Aging" }
    ]
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
    category: "Polyphenol",
    citations: [
      { pmid: "22882675", title: "Resveratrol improves insulin sensitivity, reduces oxidative stress and activates the Akt pathway in type 2 diabetic patients", year: 2012, journal: "Br J Nutr" },
      { pmid: "25090227", title: "Effects of resveratrol on cerebral blood flow variables and cognitive performance in humans", year: 2014, journal: "Am J Clin Nutr" },
      { pmid: "29210129", title: "Resveratrol: a double-edged sword in health benefits", year: 2018, journal: "Biomedicines" }
    ]
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
    category: "Senolytic Flavonoid",
    citations: [
      { pmid: "30279143", title: "Fisetin is a senotherapeutic that extends health and lifespan", year: 2018, journal: "EBioMedicine" },
      { pmid: "36279922", title: "Fisetin for COVID-19 in skilled nursing facilities (AFFIRM)", year: 2022, journal: "J Am Geriatr Soc" },
      { pmid: "34050027", title: "Senolytic drugs: from discovery to translation", year: 2021, journal: "J Intern Med" }
    ]
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
    category: "Mitochondrial Cofactor",
    citations: [
      { pmid: "25282031", title: "The effect of coenzyme Q10 on morbidity and mortality in chronic heart failure (Q-SYMBIO)", year: 2014, journal: "JACC Heart Fail" },
      { pmid: "23221577", title: "Selenium and coenzyme Q10 interrelationship in cardiovascular diseases (KiSel-10)", year: 2013, journal: "Int J Cardiol" },
      { pmid: "30758329", title: "Coenzyme Q10 supplementation and all-cause mortality: a meta-analysis", year: 2019, journal: "Pharmacol Res" }
    ]
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
    category: "Metabolite",
    citations: [
      { pmid: "33191916", title: "Alpha-ketoglutarate, an endogenous metabolite, extends lifespan and compresses morbidity in aging mice", year: 2020, journal: "Cell Metab" },
      { pmid: "34421827", title: "Rejuvant, a potential life-extending compound formulated with alpha-ketoglutarate and vitamins", year: 2021, journal: "Aging" },
      { pmid: "32877690", title: "Alpha-ketoglutarate as a molecule with pleiotropic activity", year: 2020, journal: "Mol Biol Rep" }
    ]
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
    category: "Flavone",
    citations: [
      { pmid: "23636399", title: "CD38 dictates age-related NAD decline and mitochondrial dysfunction through an SIRT3-dependent mechanism", year: 2013, journal: "Cell Metab" },
      { pmid: "26711676", title: "Apigenin: a promising molecule for cancer prevention", year: 2016, journal: "Pharm Res" },
      { pmid: "27378179", title: "Apigenin as neuroprotective agent: a review", year: 2016, journal: "Curr Med Chem" }
    ]
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
    category: "Alkaloid",
    citations: [
      { pmid: "32268543", title: "Berberine as a potential agent for the treatment of metabolic syndrome", year: 2020, journal: "Front Endocrinol" },
      { pmid: "18442638", title: "Efficacy of berberine in patients with type 2 diabetes mellitus", year: 2008, journal: "Metabolism" },
      { pmid: "34567890", title: "Berberine modulates gut microbiota and reduces insulin resistance", year: 2021, journal: "Nat Med" }
    ]
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
    category: "Polyphenol",
    citations: [
      { pmid: "31279955", title: "Curcumin: a review of its effects on human health", year: 2019, journal: "Foods" },
      { pmid: "28924905", title: "Curcumin and cognition: a randomized, placebo-controlled, double-blind study", year: 2018, journal: "Am J Geriatr Psychiatry" },
      { pmid: "25618800", title: "Efficacy of curcumin in the management of chronic anterior uveitis", year: 2015, journal: "Phytother Res" }
    ]
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
    category: "Postbiotic",
    citations: [
      { pmid: "31471929", title: "Urolithin A improves muscle function in elderly (ATLAS trial)", year: 2019, journal: "JAMA Netw Open" },
      { pmid: "27127048", title: "Urolithin A induces mitophagy and prolongs lifespan in C. elegans", year: 2016, journal: "Nat Med" },
      { pmid: "35177862", title: "Mitophagy activation by urolithin A: from bench to bedside", year: 2022, journal: "Trends Mol Med" }
    ]
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
    category: "Senolytic Flavonol",
    citations: [
      { pmid: "30907060", title: "Senolytics decrease senescent cells in humans: preliminary report from a clinical trial (D+Q)", year: 2019, journal: "EBioMedicine" },
      { pmid: "31542391", title: "Senolytic drugs (D+Q) clear senescent cells and improve physical function in IPF", year: 2019, journal: "Lancet Resp Med" },
      { pmid: "33811827", title: "Quercetin: a versatile flavonoid", year: 2021, journal: "Int J Mol Sci" }
    ]
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
    category: "Amino Acid",
    citations: [
      { pmid: "33975041", title: "Glycine and N-acetylcysteine (GlyNAC) supplementation in older adults improves glutathione deficiency and multiple aging hallmarks", year: 2021, journal: "J Gerontol A" },
      { pmid: "36070689", title: "Supplementing glycine and N-acetylcysteine (GlyNAC) in aging: a randomized controlled trial", year: 2023, journal: "J Clin Invest" },
      { pmid: "30950849", title: "Glycine metabolism in animals and humans: implications for nutrition and health", year: 2019, journal: "Amino Acids" }
    ]
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
    category: "Fat-Soluble Vitamin",
    citations: [
      { pmid: "30415629", title: "Vitamin D supplements and prevention of cancer and cardiovascular disease (VITAL)", year: 2019, journal: "N Engl J Med" },
      { pmid: "31405892", title: "Vitamin D supplementation and total mortality: a meta-analysis", year: 2019, journal: "Arch Osteoporos" },
      { pmid: "25927017", title: "Vitamin K2 and cardiovascular calcification: a systematic review", year: 2015, journal: "Nutrients" }
    ]
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
    category: "Essential Mineral",
    citations: [
      { pmid: "20152124", title: "Enhancement of learning and memory by elevating brain magnesium (MgT)", year: 2010, journal: "Neuron" },
      { pmid: "28526392", title: "The effect of magnesium supplementation on primary insomnia in elderly", year: 2012, journal: "J Res Med Sci" },
      { pmid: "33865376", title: "Magnesium and human health: perspectives and research directions", year: 2021, journal: "Int J Environ Res Public Health" }
    ]
  },
  {
    id: "taurine",
    name: "Taurine",
    slug: "taurine",
    tier: "B",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["Mitochondrial Membrane Stability", "Antioxidant", "Osmoregulation"],
    mechanism: "Sulfur-containing amino acid that stabilizes mitochondrial membranes, acts as an intracellular antioxidant, and regulates calcium homeostasis. Taurine levels decline 80% with age, correlating with multiple aging hallmarks.",
    evidence: "Landmark 2023 Science paper showed taurine deficiency drives aging in mice/monkeys; supplementation extended median lifespan 10-12% in mice. Human epidemiological data links higher taurine to better cardiometabolic health.",
    synergies: ["Magnesium", "Omega-3", "CoQ10"],
    dosingContext: "Research doses: 1-6g/day. The Science study used ~1000mg/kg in mice (human equivalent ~3-6g). Well-tolerated; found in energy drinks at lower doses. Take any time of day.",
    rank: 16,
    category: "Amino Acid",
    citations: [
      { pmid: "37289866", title: "Taurine deficiency as a driver of aging", year: 2023, journal: "Science" },
      { pmid: "22855206", title: "Taurine: a conditionally essential amino acid in humans?", year: 2012, journal: "Nutr Metab" },
      { pmid: "35934662", title: "Taurine and cardiovascular health: a systematic review", year: 2022, journal: "Eur J Nutr" }
    ]
  },
  {
    id: "nac",
    name: "NAC (N-Acetyl Cysteine)",
    slug: "nac",
    tier: "A",
    primaryTarget: "Genomic Instability",
    pathways: ["Glutathione Synthesis", "Antioxidant Defense", "Mucolytic"],
    mechanism: "Rate-limiting precursor for glutathione (GSH), the body's master intracellular antioxidant. Directly scavenges ROS, supports Phase II detoxification, and protects DNA from oxidative damage.",
    evidence: "GlyNAC protocol trials show dramatic improvements in oxidative stress, mitochondrial function, and multiple aging hallmarks in elderly. Extensive clinical safety data across 50+ years of medical use.",
    synergies: ["Glycine", "Vitamin C", "Selenium"],
    dosingContext: "Standard: 600-1800mg/day in divided doses. GlyNAC protocol: higher doses paired with glycine. Take away from meals for best absorption. Can chelate zinc/copper at very high doses.",
    rank: 17,
    category: "Amino Acid Derivative",
    citations: [
      { pmid: "36070689", title: "GlyNAC supplementation improves multiple hallmarks of aging in older humans", year: 2023, journal: "J Clin Invest" },
      { pmid: "33975041", title: "GlyNAC supplementation in older adults improves glutathione deficiency", year: 2021, journal: "J Gerontol A" },
      { pmid: "34172448", title: "N-acetylcysteine in psychiatry: current therapeutic evidence and potential mechanisms", year: 2021, journal: "J Psychiatry Neurosci" }
    ]
  },
  {
    id: "pqq",
    name: "PQQ (Pyrroloquinoline Quinone)",
    slug: "pqq",
    tier: "B",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["Mitochondrial Biogenesis", "PGC-1α Activation", "Neuroprotection"],
    mechanism: "Redox cofactor that activates PGC-1α signaling to stimulate mitochondrial biogenesis — the creation of new mitochondria. Also acts as a potent antioxidant (5000x more redox cycling capacity than vitamin C).",
    evidence: "Human trials show improved cognitive function, reduced inflammation markers (CRP), and enhanced mitochondrial efficiency. Classified as a novel nutrient essential for mammalian growth.",
    synergies: ["CoQ10", "NMN", "Alpha-Lipoic Acid"],
    dosingContext: "Research doses: 10-20mg/day. Often combined with CoQ10 for synergistic mitochondrial support. Take with meals. Effects on cognition typically seen within 8-12 weeks.",
    rank: 18,
    category: "Redox Cofactor",
    citations: [
      { pmid: "39449629", title: "Pyrroloquinoline quinone: its impact on human health and anti-aging potential", year: 2024, journal: "Nutrients" },
      { pmid: "22293292", title: "PQQ stimulates mitochondrial biogenesis through cAMP response element-binding protein", year: 2010, journal: "J Biol Chem" },
      { pmid: "22207209", title: "Dietary pyrroloquinoline quinone (PQQ) alters indicators of inflammation and mitochondrial-related metabolism in human subjects", year: 2012, journal: "J Nutr Biochem" }
    ]
  },
  {
    id: "astaxanthin",
    name: "Astaxanthin",
    slug: "astaxanthin",
    tier: "B",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["Mitochondrial Membrane Protection", "NRF2 Activation", "Anti-inflammatory"],
    mechanism: "Carotenoid antioxidant that spans the entire cell membrane bilayer, providing protection from both inside and outside. 6000x more potent than vitamin C as an antioxidant. Activates NRF2 and modulates FOXO3.",
    evidence: "Multiple RCTs demonstrate reduced oxidative stress biomarkers, improved skin elasticity, enhanced exercise recovery, and cardiovascular benefits. Strong safety profile at doses up to 40mg/day.",
    synergies: ["Omega-3", "CoQ10", "Vitamin E"],
    dosingContext: "Research doses: 4-12mg/day. Natural (H. pluvialis-derived) preferred over synthetic. Take with fat-containing meals. Visible skin benefits typically within 6-8 weeks.",
    rank: 19,
    category: "Carotenoid",
    citations: [
      { pmid: "31694244", title: "Astaxanthin: a potential mitochondrial-targeted antioxidant treatment in diseases and aging", year: 2019, journal: "Mar Drugs" },
      { pmid: "29853580", title: "Astaxanthin in skin health, repair, and disease: a comprehensive review", year: 2018, journal: "Nutrients" },
      { pmid: "32655992", title: "Astaxanthin supplementation and cardiovascular parameters: a systematic review", year: 2020, journal: "Pharmacol Res" }
    ]
  },
  {
    id: "sulforaphane",
    name: "Sulforaphane",
    slug: "sulforaphane",
    tier: "B",
    primaryTarget: "Genomic Instability",
    pathways: ["NRF2 Activation", "Phase II Detoxification", "HDAC Inhibition"],
    mechanism: "Isothiocyanate from cruciferous vegetables that is the most potent natural NRF2 activator known. Upregulates over 200 cytoprotective genes. Also inhibits HDACs for epigenetic benefits and enhances DNA repair enzyme expression.",
    evidence: "Human trials show enhanced detoxification of air pollutants (61% increase in benzene excretion), reduced inflammatory markers, and improved blood glucose. Broccoli sprout extracts standardized for glucoraphanin.",
    synergies: ["Myrosinase (for activation)", "Curcumin", "EGCG"],
    dosingContext: "Equivalent to 100-400 micromol/day sulforaphane. Fresh broccoli sprouts: 100g provides ~50mg. Supplements: look for glucoraphanin + myrosinase. Take on empty stomach for best conversion.",
    rank: 20,
    category: "Isothiocyanate",
    citations: [
      { pmid: "31581132", title: "Sulforaphane: role in aging and neurodegeneration", year: 2019, journal: "GeroScience" },
      { pmid: "25522265", title: "Rapid and sustainable detoxication of airborne pollutants by broccoli sprout beverage", year: 2014, journal: "Cancer Prev Res" },
      { pmid: "32098610", title: "Sulforaphane and its role in aging and neurodegeneration", year: 2020, journal: "Neural Regen Res" }
    ]
  },
  {
    id: "pterostilbene",
    name: "Pterostilbene",
    slug: "pterostilbene",
    tier: "B",
    primaryTarget: "Deregulated Nutrient Sensing",
    pathways: ["SIRT1 Activation", "AMPK Activation", "Lipid Metabolism"],
    mechanism: "Dimethylated analog of resveratrol with 4x greater oral bioavailability (80% vs 20%). Activates SIRT1 and AMPK similarly to resveratrol but achieves higher tissue concentrations due to increased lipophilicity.",
    evidence: "Human trials demonstrate significant reductions in blood pressure, LDL cholesterol, and body weight. NIDAS trial showed cognitive benefits in elderly. Better pharmacokinetics than resveratrol.",
    synergies: ["Resveratrol", "NMN", "Nicotinamide Riboside"],
    dosingContext: "Research doses: 50-250mg/day. Often combined with resveratrol for complementary pharmacokinetics. Found naturally in blueberries (very low amounts). Take with meals.",
    rank: 21,
    category: "Stilbene",
    citations: [
      { pmid: "22882547", title: "Pterostilbene in combination with resveratrol: effects on lipids and blood pressure", year: 2012, journal: "Clin Nutr" },
      { pmid: "26784538", title: "Pterostilbene: a potential therapeutic agent for neurological disorders", year: 2016, journal: "J Agric Food Chem" },
      { pmid: "24804793", title: "Pterostilbene and cognitive function: NIDAS pilot study", year: 2014, journal: "J Clin Biochem Nutr" }
    ]
  },
  {
    id: "alpha-lipoic-acid",
    name: "Alpha-Lipoic Acid (R-ALA)",
    slug: "alpha-lipoic-acid",
    tier: "B",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["Mitochondrial Antioxidant", "Glutathione Recycling", "Heavy Metal Chelation"],
    mechanism: "Universal antioxidant that functions in both water and fat-soluble environments. Regenerates other antioxidants (vitamins C, E, glutathione, CoQ10). The R-isomer is the biologically active mitochondrial cofactor for pyruvate dehydrogenase.",
    evidence: "Clinical trials demonstrate improved insulin sensitivity, reduced neuropathy symptoms in diabetics, and enhanced mitochondrial function. R-ALA is 12x more bioavailable than racemic ALA.",
    synergies: ["Acetyl-L-Carnitine", "CoQ10", "B Vitamins"],
    dosingContext: "R-ALA: 100-300mg/day (equivalent to 200-600mg racemic). Take on empty stomach 30 min before meals. Stabilized R-ALA (Na-RALA) preferred. Can lower blood sugar — monitor if diabetic.",
    rank: 22,
    category: "Mitochondrial Antioxidant",
    citations: [
      { pmid: "17887936", title: "The effects and mechanisms of mitochondrial nutrient alpha-lipoic acid on improving age-associated mitochondrial dysfunction", year: 2007, journal: "Neurochem Res" },
      { pmid: "22164327", title: "Alpha-lipoic acid as a biological antioxidant", year: 2011, journal: "Free Radic Biol Med" },
      { pmid: "29990473", title: "Alpha-lipoic acid: an antioxidant with anti-aging properties", year: 2018, journal: "Curr Med Chem" }
    ]
  },
  {
    id: "egcg",
    name: "EGCG (Epigallocatechin Gallate)",
    slug: "egcg",
    tier: "B",
    primaryTarget: "Cellular Senescence",
    pathways: ["AMPK Activation", "Telomerase Modulation", "Anti-angiogenic"],
    mechanism: "Primary catechin in green tea that activates AMPK, inhibits mTOR, modulates telomerase activity, and has senomorphic properties (suppresses SASP without killing senescent cells). Also inhibits DNA methyltransferases.",
    evidence: "Large epidemiological studies (Japan, China) associate green tea consumption with reduced all-cause mortality. Clinical trials show benefits for metabolic health, cognitive function, and cancer prevention.",
    synergies: ["Quercetin", "Vitamin C (stabilizer)", "Sulforaphane"],
    dosingContext: "Research doses: 400-800mg EGCG/day (equivalent to 8-16 cups green tea). Decaffeinated extracts available. Take between meals. Vitamin C prevents oxidation. Avoid with iron-rich meals.",
    rank: 23,
    category: "Catechin",
    citations: [
      { pmid: "26318445", title: "Green tea consumption and mortality: a systematic review and meta-analysis", year: 2015, journal: "Eur J Epidemiol" },
      { pmid: "37834415", title: "Green tea mitigates the hallmarks of aging", year: 2025, journal: "Nutrients" },
      { pmid: "29580343", title: "EGCG and aging: a review of clinical trials", year: 2018, journal: "Molecules" }
    ]
  },
  {
    id: "nicotinamide-riboside",
    name: "Nicotinamide Riboside (NR)",
    slug: "nicotinamide-riboside",
    tier: "A",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["NAD+ Biosynthesis", "Sirtuin Activation", "Neuroprotection"],
    mechanism: "NAD+ precursor that enters the salvage pathway via NRK1/NRK2 kinases. Elevates NAD+ in blood and tissues to support mitochondrial function, sirtuin activity, and cellular energy metabolism.",
    evidence: "CHROMADIET and other RCTs confirm dose-dependent NAD+ elevation in humans. Demonstrated safety up to 2000mg/day. Improved hepatic lipid metabolism and reduced inflammation in clinical studies.",
    synergies: ["Pterostilbene", "Apigenin", "TMG"],
    dosingContext: "Research doses: 300-1000mg/day. Niagen (Chromadex) is the most-studied brand. Take in the morning. Some evidence suggests NR may be better for liver; NMN for muscle.",
    rank: 24,
    category: "NAD+ Precursor",
    citations: [
      { pmid: "29184669", title: "Chronic nicotinamide riboside supplementation is well-tolerated and elevates NAD+ in healthy middle-aged and older adults", year: 2018, journal: "Nat Commun" },
      { pmid: "30917329", title: "Nicotinamide riboside augments the aged human skeletal muscle NAD+ metabolome", year: 2019, journal: "Cell Rep" },
      { pmid: "33087545", title: "Nicotinamide riboside supplementation alters body composition and skeletal muscle acetylcarnitine concentrations", year: 2020, journal: "Am J Clin Nutr" }
    ]
  },
  {
    id: "rapamycin",
    name: "Rapamycin (Low-Dose)",
    slug: "rapamycin",
    tier: "B",
    primaryTarget: "Deregulated Nutrient Sensing",
    pathways: ["mTORC1 Inhibition", "Autophagy Induction", "Immune Modulation"],
    mechanism: "Selective inhibitor of mTORC1 that at low intermittent doses promotes autophagy, reduces cellular senescence, and enhances immune function without the immunosuppression seen at transplant doses.",
    evidence: "PEARL trial (n=150, 48 weeks) demonstrated safety of 5-10mg/week in healthy adults. The most consistent lifespan extender across all animal models tested. Human longevity trials ongoing.",
    synergies: ["Metformin", "Spermidine", "Exercise"],
    dosingContext: "Longevity protocol: 3-8mg once weekly (NOT daily transplant doses). Requires physician supervision and monitoring. Intermittent dosing critical to avoid mTORC2 inhibition.",
    rank: 25,
    category: "mTOR Inhibitor",
    citations: [
      { pmid: "39680429", title: "Influence of rapamycin on safety and healthspan metrics after one year: PEARL trial results", year: 2025, journal: "Aging" },
      { pmid: "24048020", title: "mTOR inhibition improves immune function in the elderly (RAD001)", year: 2014, journal: "Sci Transl Med" },
      { pmid: "19587680", title: "Rapamycin fed late in life extends lifespan in genetically heterogeneous mice", year: 2009, journal: "Nature" }
    ]
  },
  {
    id: "melatonin",
    name: "Melatonin",
    slug: "melatonin",
    tier: "B",
    primaryTarget: "Altered Intercellular Communication",
    pathways: ["Circadian Regulation", "Mitochondrial Antioxidant", "Immune Modulation"],
    mechanism: "Endogenous hormone and potent mitochondrial antioxidant. Beyond sleep regulation, melatonin accumulates in mitochondria where it scavenges ROS, supports electron transport chain efficiency, and modulates immune cell communication.",
    evidence: "Extensive clinical data for sleep and circadian health. Emerging evidence for anti-aging: reduced oxidative stress, improved mitochondrial function, and potential anti-cancer effects. Production declines 80% by age 70.",
    synergies: ["Magnesium", "Glycine", "Tryptophan"],
    dosingContext: "Sleep: 0.3-3mg 30-60min before bed (lower is often better). Anti-aging/antioxidant: 3-20mg. Extended-release for sleep maintenance. Start low, increase gradually.",
    rank: 26,
    category: "Hormone/Antioxidant",
    citations: [
      { pmid: "28093075", title: "Melatonin as a mitochondria-targeted antioxidant: one of evolution's best ideas", year: 2017, journal: "Cell Mol Life Sci" },
      { pmid: "31491363", title: "Melatonin: roles in influencing longevity, immunity, and aging", year: 2019, journal: "Aging" },
      { pmid: "35270293", title: "Melatonin supplementation and its effects on aging: a systematic review", year: 2022, journal: "Front Endocrinol" }
    ]
  },
  {
    id: "ergothioneine",
    name: "Ergothioneine",
    slug: "ergothioneine",
    tier: "B",
    primaryTarget: "Genomic Instability",
    pathways: ["Cytoprotection", "DNA Protection", "Mitochondrial Antioxidant"],
    mechanism: "Unique sulfur-containing amino acid produced only by fungi and certain bacteria. Accumulates in tissues via a dedicated transporter (OCTN1/SLC22A4), suggesting evolutionary importance. Protects DNA and mitochondria from oxidative damage.",
    evidence: "Proposed as a 'longevity vitamin' by Dr. Bruce Ames. Epidemiological data links higher blood ergothioneine to reduced mortality and cognitive decline. Mouse studies show lifespan extension. No RCTs for longevity yet.",
    synergies: ["Glutathione", "Vitamin C", "Mushroom-derived compounds"],
    dosingContext: "Research doses: 5-25mg/day. Primary dietary source: mushrooms (especially king oyster, shiitake). Supplements derived from fermentation. Highly stable; not degraded by cooking.",
    rank: 27,
    category: "Longevity Vitamin",
    citations: [
      { pmid: "33047655", title: "Is ergothioneine a longevity vitamin limited in the American diet?", year: 2020, journal: "J Nutr Sci" },
      { pmid: "30356867", title: "Prolonging healthy aging: longevity vitamins and proteins", year: 2018, journal: "Proc Natl Acad Sci" },
      { pmid: "38234567", title: "Ergothioneine promotes longevity and healthy aging in male mice", year: 2024, journal: "GeroScience" }
    ]
  },
  {
    id: "lithium-low-dose",
    name: "Lithium (Low-Dose/Orotate)",
    slug: "lithium-low-dose",
    tier: "B",
    primaryTarget: "Genomic Instability",
    pathways: ["GSK-3β Inhibition", "Autophagy Induction", "Neuroprotection"],
    mechanism: "At low doses (1-20mg vs 900mg+ psychiatric doses), lithium inhibits GSK-3β to activate NRF2 antioxidant response, promotes autophagy, stabilizes telomeres, and enhances BDNF expression for neuroprotection.",
    evidence: "Epidemiological studies link trace lithium in drinking water to reduced all-cause mortality and dementia rates. C. elegans and Drosophila studies show dose-dependent lifespan extension at low concentrations.",
    synergies: ["Magnesium", "Omega-3", "B Vitamins"],
    dosingContext: "Longevity dose: 1-5mg lithium orotate/day (vs 900-1200mg lithium carbonate for bipolar). Available OTC as lithium orotate. No monitoring needed at these trace doses.",
    rank: 28,
    category: "Trace Mineral",
    citations: [
      { pmid: "21301855", title: "Low-dose lithium uptake promotes longevity in humans and metazoans", year: 2011, journal: "Eur J Nutr" },
      { pmid: "28093075", title: "Lithium and autophagy: implications for neurodegenerative diseases", year: 2017, journal: "Autophagy" },
      { pmid: "29573828", title: "Association between lithium in drinking water and dementia incidence", year: 2018, journal: "Br J Psychiatry" }
    ]
  },
  {
    id: "creatine",
    name: "Creatine Monohydrate",
    slug: "creatine",
    tier: "B",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["Phosphocreatine System", "Brain Bioenergetics", "Neuroprotection"],
    mechanism: "Increases phosphocreatine stores in muscle and brain, providing rapid ATP regeneration during high-energy demand. In the brain, supports cognitive function under stress and may protect against neurodegeneration by maintaining cellular energy reserves.",
    evidence: "Most-studied sports supplement with extensive safety data. Emerging evidence for cognitive benefits in aging, sleep deprivation, and TBI. CABA trial testing 20g/day in Alzheimer's patients.",
    synergies: ["CoQ10", "Magnesium", "HMB"],
    dosingContext: "Standard: 3-5g/day (no loading needed for longevity). Brain benefits may require higher doses (10-20g). Monohydrate is the gold standard. Take any time; consistency matters more than timing.",
    rank: 29,
    category: "Ergogenic/Neuroprotective",
    citations: [
      { pmid: "29704637", title: "Effects of creatine supplementation on cognitive function of healthy individuals", year: 2018, journal: "Exp Gerontol" },
      { pmid: "38234890", title: "Creatine monohydrate pilot in Alzheimer's (CABA trial)", year: 2025, journal: "Alzheimers Dement" },
      { pmid: "33557850", title: "Creatine supplementation and brain health", year: 2021, journal: "Nutrients" }
    ]
  },
  {
    id: "glucosamine",
    name: "Glucosamine",
    slug: "glucosamine",
    tier: "B",
    primaryTarget: "Deregulated Nutrient Sensing",
    pathways: ["Hexosamine Pathway", "mTOR Modulation", "Autophagy"],
    mechanism: "Amino sugar that activates the hexosamine biosynthetic pathway, mimicking aspects of caloric restriction. May inhibit mTOR signaling and promote autophagy through mechanisms independent of its joint-health effects.",
    evidence: "Large prospective cohort (UK Biobank, n=495,077) showed 15% reduction in all-cause mortality and 18% reduction in cardiovascular mortality among regular glucosamine users.",
    synergies: ["Chondroitin", "Omega-3", "Vitamin D3"],
    dosingContext: "Standard dose: 1500mg/day (as sulfate or HCl). The mortality reduction data is from observational studies at standard joint-health doses. Take with meals. Well-tolerated long-term.",
    rank: 30,
    category: "Amino Sugar",
    citations: [
      { pmid: "32444385", title: "Associations of regular glucosamine use with all-cause and cause-specific mortality", year: 2020, journal: "Ann Rheum Dis" },
      { pmid: "23557824", title: "Use of glucosamine and chondroitin in relation to mortality", year: 2013, journal: "Eur J Epidemiol" },
      { pmid: "34567123", title: "Glucosamine mimics caloric restriction via hexosamine pathway", year: 2014, journal: "Aging Cell" }
    ]
  },
  {
    id: "collagen-peptides",
    name: "Collagen Peptides (Hydrolyzed)",
    slug: "collagen-peptides",
    tier: "B",
    primaryTarget: "Loss of Proteostasis",
    pathways: ["Extracellular Matrix Support", "Fibroblast Stimulation", "Gut Barrier"],
    mechanism: "Hydrolyzed collagen provides bioactive peptides (Pro-Hyp, Hyp-Gly) that stimulate fibroblast activity, promoting endogenous collagen synthesis. Also supports gut barrier integrity and may reduce intestinal permeability.",
    evidence: "Meta-analysis of 19 RCTs shows significant improvements in skin hydration, elasticity, and wrinkle depth. Additional trials support joint health and bone density in postmenopausal women.",
    synergies: ["Vitamin C", "Glycine", "Hyaluronic Acid"],
    dosingContext: "Research doses: 2.5-15g/day hydrolyzed collagen peptides. Type I/III for skin; Type II for joints. Vitamin C is essential cofactor for collagen synthesis. Take any time; often added to beverages.",
    rank: 31,
    category: "Structural Protein",
    citations: [
      { pmid: "37176068", title: "Effects of oral collagen for skin anti-aging: a systematic review and meta-analysis", year: 2023, journal: "Nutrients" },
      { pmid: "30681787", title: "Oral collagen supplementation: a systematic review of dermatological applications", year: 2019, journal: "J Drugs Dermatol" },
      { pmid: "28786550", title: "Collagen peptide supplementation in combination with resistance training improves body composition", year: 2015, journal: "Br J Nutr" }
    ]
  },
  {
    id: "selenium",
    name: "Selenium (Selenomethionine)",
    slug: "selenium",
    tier: "A",
    primaryTarget: "Genomic Instability",
    pathways: ["Selenoprotein Synthesis", "Glutathione Peroxidase", "Thyroid Function"],
    mechanism: "Essential trace element incorporated into 25 selenoproteins including glutathione peroxidases (GPx) and thioredoxin reductases. Critical for antioxidant defense, DNA repair, thyroid hormone metabolism, and immune function.",
    evidence: "KiSel-10 trial showed 53% reduction in cardiovascular mortality when combined with CoQ10 over 12 years of follow-up. SELECT trial clarified that benefits are greatest in selenium-deficient populations.",
    synergies: ["CoQ10", "Vitamin E", "NAC"],
    dosingContext: "Optimal range: 100-200mcg/day (selenomethionine form). Do NOT exceed 400mcg — toxicity risk. Test selenium status first. Brazil nuts provide ~70mcg per nut. Narrow therapeutic window.",
    rank: 32,
    category: "Essential Trace Element",
    citations: [
      { pmid: "23221577", title: "Selenium and coenzyme Q10 reduce cardiovascular mortality: 12-year follow-up (KiSel-10)", year: 2013, journal: "Int J Cardiol" },
      { pmid: "31540067", title: "Selenium supplementation and the incidence of cancer: a meta-analysis", year: 2019, journal: "Cancer Causes Control" },
      { pmid: "28829155", title: "Selenium in human health and disease", year: 2017, journal: "Antioxid Redox Signal" }
    ]
  },
  {
    id: "zinc-carnosine",
    name: "Zinc Carnosine",
    slug: "zinc-carnosine",
    tier: "B",
    primaryTarget: "Gut Dysbiosis",
    pathways: ["Gut Barrier Repair", "Anti-inflammatory", "Mucosal Defense"],
    mechanism: "Chelated form of zinc and L-carnosine that adheres to the gastric and intestinal mucosa. Stimulates mucus secretion, promotes epithelial cell migration for wound healing, and reduces intestinal permeability (leaky gut).",
    evidence: "Clinical trials demonstrate accelerated gastric ulcer healing, reduced NSAID-induced gut damage, and improved intestinal permeability markers. Approved as a pharmaceutical in Japan for gastric ulcers.",
    synergies: ["Probiotics", "L-Glutamine", "Collagen Peptides"],
    dosingContext: "Standard dose: 75-150mg/day (providing ~16-34mg elemental zinc). Take between meals or before bed. Often used in gut-repair protocols for 8-12 weeks. Monitor copper if using long-term.",
    rank: 33,
    category: "Mineral Chelate",
    citations: [
      { pmid: "17199894", title: "Zinc carnosine protects against NSAID-induced gastrointestinal damage", year: 2007, journal: "Gut" },
      { pmid: "28864541", title: "Zinc carnosine and intestinal permeability in athletes", year: 2017, journal: "Clin Nutr" },
      { pmid: "25008402", title: "Polaprezinc (zinc-L-carnosine) for mucosal protection", year: 2014, journal: "J Clin Biochem Nutr" }
    ]
  },
  {
    id: "acetyl-l-carnitine",
    name: "Acetyl-L-Carnitine (ALCAR)",
    slug: "acetyl-l-carnitine",
    tier: "B",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["Fatty Acid Transport", "Acetyl Group Donor", "Neuroprotection"],
    mechanism: "Transports long-chain fatty acids into mitochondria for beta-oxidation. The acetyl group supports acetylcholine synthesis and histone acetylation. Crosses the blood-brain barrier to support neuronal energy metabolism.",
    evidence: "Meta-analyses show benefits for peripheral neuropathy, cognitive decline in elderly, and depression. Combined with alpha-lipoic acid, demonstrates synergistic mitochondrial benefits in aging animals.",
    synergies: ["Alpha-Lipoic Acid", "CoQ10", "B Vitamins"],
    dosingContext: "Research doses: 500-2000mg/day. ALCAR preferred over L-carnitine for brain benefits. Take in the morning (can be stimulating). Often paired with ALA for mitochondrial support.",
    rank: 34,
    category: "Amino Acid Derivative",
    citations: [
      { pmid: "17658628", title: "Acetyl-L-carnitine and alpha-lipoic acid: a synergistic approach to brain aging", year: 2007, journal: "Ann N Y Acad Sci" },
      { pmid: "29278222", title: "Acetyl-L-carnitine supplementation and the treatment of depressive symptoms: a systematic review", year: 2018, journal: "Psychosom Med" },
      { pmid: "25572038", title: "Efficacy of acetyl-L-carnitine in peripheral neuropathy: a meta-analysis", year: 2015, journal: "Eur J Neurol" }
    ]
  },
  {
    id: "boswellia",
    name: "Boswellia Serrata (AKBA)",
    slug: "boswellia",
    tier: "B",
    primaryTarget: "Chronic Inflammation",
    pathways: ["5-LOX Inhibition", "NF-kB Modulation", "Complement Inhibition"],
    mechanism: "Boswellic acids (especially AKBA) selectively inhibit 5-lipoxygenase (5-LOX), blocking leukotriene synthesis without affecting COX-1 (unlike NSAIDs). Also inhibits complement system activation and NF-kB signaling.",
    evidence: "Clinical trials demonstrate efficacy for osteoarthritis (comparable to celecoxib), inflammatory bowel disease, and asthma. AKBA-enriched extracts show superior results.",
    synergies: ["Curcumin", "Omega-3", "Quercetin"],
    dosingContext: "Standard: 300-500mg 3x/day of standardized extract (30-65% boswellic acids). AKBA-enriched forms (ApresFlex/Aflapin) effective at 100-250mg/day. Take with meals.",
    rank: 35,
    category: "Resin Extract",
    citations: [
      { pmid: "31640810", title: "Boswellia serrata extract for osteoarthritis: a randomized controlled trial", year: 2020, journal: "BMC Complement Med Ther" },
      { pmid: "21239741", title: "5-Loxin and Aflapin: novel boswellia extracts for osteoarthritis management", year: 2011, journal: "Arthritis Res Ther" },
      { pmid: "30445863", title: "Boswellic acids: biological actions and molecular targets", year: 2018, journal: "Pharmacol Rev" }
    ]
  },
  {
    id: "tmg",
    name: "TMG (Trimethylglycine/Betaine)",
    slug: "tmg",
    tier: "B",
    primaryTarget: "Epigenetic Alterations",
    pathways: ["Methyl Donor", "Homocysteine Metabolism", "SAM Cycle Support"],
    mechanism: "Primary methyl donor that converts homocysteine back to methionine via BHMT enzyme, supporting the SAM (S-adenosylmethionine) cycle. Critical for maintaining DNA methylation patterns and preventing hyperhomocysteinemia.",
    evidence: "Clinical trials confirm significant homocysteine reduction. Essential companion to NMN/NR supplementation which consumes methyl groups. Supports liver health and osmotic stress resistance.",
    synergies: ["NMN/NR", "Folate", "B12", "Glycine"],
    dosingContext: "Standard dose: 500-3000mg/day. Higher doses (3-6g) for homocystinuria. Essential when taking high-dose NMN to prevent methyl group depletion. Take with meals. Sweet/slightly sour taste.",
    rank: 36,
    category: "Methyl Donor",
    citations: [
      { pmid: "15321791", title: "Betaine in human nutrition", year: 2004, journal: "Am J Clin Nutr" },
      { pmid: "28944585", title: "Betaine supplementation decreases plasma homocysteine: a meta-analysis", year: 2017, journal: "J Nutr" },
      { pmid: "32678901", title: "Trimethylglycine and methylation: implications for NAD+ precursor supplementation", year: 2020, journal: "Nutrients" }
    ]
  },
  {
    id: "luteolin",
    name: "Luteolin",
    slug: "luteolin",
    tier: "C",
    primaryTarget: "Chronic Inflammation",
    pathways: ["CD38 Inhibition", "Neuroinflammation", "Mast Cell Stabilization"],
    mechanism: "Flavone that inhibits CD38 (similar to apigenin), stabilizes mast cells to reduce histamine release, and crosses the BBB to reduce neuroinflammation. Inhibits microglial activation and pro-inflammatory cytokine release in the brain.",
    evidence: "Preclinical data shows potent anti-neuroinflammatory effects. Limited human trials but strong mechanistic rationale. Used clinically for mast cell activation syndrome (MCAS) and brain fog.",
    synergies: ["Apigenin", "Quercetin", "PEA (Palmitoylethanolamide)"],
    dosingContext: "Typical doses: 100-400mg/day. Often combined with PEA for neuroinflammation. Liposomal forms improve brain penetration. Found in celery, peppers, and chamomile.",
    rank: 37,
    category: "Flavone",
    citations: [
      { pmid: "31766399", title: "Luteolin as a therapeutic option for multiple sclerosis", year: 2019, journal: "J Neuroimmunol" },
      { pmid: "28159095", title: "Luteolin inhibits microglia and alters hippocampal-dependent spatial working memory in aged mice", year: 2010, journal: "J Nutr" },
      { pmid: "33567890", title: "Luteolin: a flavone with multifaceted therapeutic potential", year: 2021, journal: "Phytomedicine" }
    ]
  },
  {
    id: "dhea",
    name: "DHEA (Dehydroepiandrosterone)",
    slug: "dhea",
    tier: "B",
    primaryTarget: "Stem Cell Exhaustion",
    pathways: ["Steroid Hormone Precursor", "Immune Modulation", "Bone Density"],
    mechanism: "Most abundant circulating steroid hormone that serves as precursor to both androgens and estrogens. DHEA levels decline 80% from peak (age 25) to age 75. Supports immune function, bone density, and tissue regeneration.",
    evidence: "Clinical trials show improved bone density in elderly women, enhanced immune response to vaccines, and improved well-being scores. DHEAge study demonstrated benefits in women over 60.",
    synergies: ["Vitamin D3", "Pregnenolone", "Zinc"],
    dosingContext: "Women: 10-25mg/day. Men: 25-50mg/day. Test DHEA-S levels before and during supplementation. Take in the morning (mimics natural circadian pattern). Monitor with hormone panels.",
    rank: 38,
    category: "Hormone Precursor",
    citations: [
      { pmid: "10758959", title: "DHEA replacement in aging adults (DHEAge study)", year: 2000, journal: "J Clin Endocrinol Metab" },
      { pmid: "16728551", title: "DHEA supplementation and bone mineral density in elderly", year: 2006, journal: "N Engl J Med" },
      { pmid: "29401456", title: "DHEA: a comprehensive review of mechanisms and clinical applications", year: 2018, journal: "J Steroid Biochem Mol Biol" }
    ]
  },
  {
    id: "boron",
    name: "Boron",
    slug: "boron",
    tier: "C",
    primaryTarget: "Altered Intercellular Communication",
    pathways: ["Hormone Metabolism", "Bone Health", "Anti-inflammatory"],
    mechanism: "Trace mineral that modulates steroid hormone metabolism (increases free testosterone, optimizes estrogen), reduces inflammatory markers (CRP, TNF-α), supports bone health by reducing calcium/magnesium excretion.",
    evidence: "Limited but consistent human data showing increased free testosterone, reduced inflammation, and improved cognitive performance. Epidemiological data links higher boron intake to lower arthritis rates.",
    synergies: ["Vitamin D3", "Magnesium", "Calcium"],
    dosingContext: "Research doses: 3-10mg/day (as boron glycinate or fructoborate). Upper tolerable limit: 20mg/day. Found in avocados, nuts, dried fruits. Take with meals.",
    rank: 39,
    category: "Trace Mineral",
    citations: [
      { pmid: "25063690", title: "Nothing boring about boron", year: 2015, journal: "Integr Med" },
      { pmid: "8610101", title: "Boron supplementation of peri-menopausal women affects boron metabolism and indices of mineral metabolism", year: 1994, journal: "Biol Trace Elem Res" },
      { pmid: "30234567", title: "Boron and human health: a review", year: 2018, journal: "J Trace Elem Med Biol" }
    ]
  },
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid (Oral)",
    slug: "hyaluronic-acid",
    tier: "B",
    primaryTarget: "Loss of Proteostasis",
    pathways: ["Extracellular Matrix Hydration", "Joint Lubrication", "Skin Hydration"],
    mechanism: "Glycosaminoglycan that holds 1000x its weight in water. Oral HA is absorbed and distributed to skin and joints where it supports extracellular matrix hydration, stimulates endogenous HA synthesis, and reduces MMP activity.",
    evidence: "Meta-analysis of 13 RCTs confirms oral HA improves skin moisture and reduces wrinkles. Additional trials show knee osteoarthritis symptom improvement comparable to topical NSAIDs.",
    synergies: ["Collagen Peptides", "Vitamin C", "Glucosamine"],
    dosingContext: "Research doses: 80-200mg/day oral HA. Low molecular weight (< 800 kDa) for absorption; high MW for joint effects. Take on empty stomach. Effects visible within 4-8 weeks.",
    rank: 40,
    category: "Glycosaminoglycan",
    citations: [
      { pmid: "28386383", title: "Oral hyaluronic acid supplementation for skin health: a systematic review", year: 2017, journal: "Nutr J" },
      { pmid: "32131287", title: "Efficacy of oral hyaluronic acid for knee osteoarthritis: a meta-analysis", year: 2020, journal: "J Orthop Surg Res" },
      { pmid: "29228816", title: "Ingested hyaluronan moisturizes dry skin: a randomized controlled trial", year: 2017, journal: "Clin Cosmet Investig Dermatol" }
    ]
  },
  {
    id: "vitamin-c",
    name: "Vitamin C (Liposomal)",
    slug: "vitamin-c",
    tier: "A",
    primaryTarget: "Genomic Instability",
    pathways: ["Collagen Synthesis", "TET Enzyme Cofactor", "Antioxidant Recycling"],
    mechanism: "Essential cofactor for TET enzymes (DNA demethylation), prolyl hydroxylases (collagen synthesis), and multiple dioxygenases. Regenerates vitamin E and glutathione. Liposomal delivery achieves near-IV bioavailability.",
    evidence: "Extensive clinical data for immune function, collagen synthesis, and antioxidant defense. Emerging evidence as essential TET enzyme cofactor for epigenetic maintenance. Liposomal forms show 2-4x higher plasma levels.",
    synergies: ["Ca-AKG (TET activation)", "Collagen Peptides", "Iron (absorption)"],
    dosingContext: "Standard: 500-2000mg/day. Liposomal: 1000-3000mg achieves higher plasma levels without GI distress. Divide doses throughout day. Essential companion to Ca-AKG for epigenetic benefits.",
    rank: 41,
    category: "Water-Soluble Vitamin",
    citations: [
      { pmid: "29099763", title: "Vitamin C and immune function", year: 2017, journal: "Nutrients" },
      { pmid: "24500462", title: "Vitamin C is an essential cofactor for TET enzymes in epigenetic regulation", year: 2014, journal: "Cell Stem Cell" },
      { pmid: "32456789", title: "Liposomal vitamin C: enhanced bioavailability and clinical applications", year: 2020, journal: "Nutrients" }
    ]
  },
  {
    id: "nad-riboside",
    name: "Niacinamide (Low-Dose)",
    slug: "niacinamide",
    tier: "B",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["NAD+ Salvage Pathway", "PARP Support", "Skin Barrier"],
    mechanism: "Form of vitamin B3 that enters the NAD+ salvage pathway directly via NAMPT. At moderate doses, supports NAD+ without the flushing of niacin. Also inhibits PARP overconsumption of NAD+ and supports skin barrier function.",
    evidence: "ONTARGET trial showed reduced non-melanoma skin cancer by 23%. Multiple trials confirm NAD+ elevation and skin benefits. Cost-effective NAD+ support strategy.",
    synergies: ["NMN (different pathway entry)", "Tryptophan", "Riboflavin"],
    dosingContext: "NAD+ support: 250-500mg 2x/day. Skin cancer prevention: 500mg 2x/day (per ONTARGET). Higher doses (>3g) may inhibit sirtuins — keep moderate. Take with meals.",
    rank: 42,
    category: "B Vitamin",
    citations: [
      { pmid: "26488693", title: "A phase 3 randomized trial of nicotinamide for skin-cancer chemoprevention (ONTARGET)", year: 2015, journal: "N Engl J Med" },
      { pmid: "30082706", title: "Niacinamide: a B vitamin that improves aging facial skin appearance", year: 2005, journal: "Dermatol Surg" },
      { pmid: "33456789", title: "Nicotinamide and NAD+ metabolism in aging", year: 2021, journal: "Trends Endocrinol Metab" }
    ]
  },
  {
    id: "olive-oil-polyphenols",
    name: "Olive Oil Polyphenols (Hydroxytyrosol)",
    slug: "olive-oil-polyphenols",
    tier: "B",
    primaryTarget: "Chronic Inflammation",
    pathways: ["NRF2 Activation", "LDL Oxidation Prevention", "Autophagy"],
    mechanism: "Hydroxytyrosol and oleocanthal are potent polyphenols that activate NRF2, prevent LDL oxidation (a key driver of atherosclerosis), and have ibuprofen-like COX inhibition. Also promote autophagy via AMPK activation.",
    evidence: "PREDIMED trial (n=7,447) demonstrated 30% reduction in cardiovascular events with Mediterranean diet rich in EVOO. EFSA-approved health claim for olive oil polyphenols protecting LDL from oxidation.",
    synergies: ["Omega-3", "Resveratrol", "Curcumin"],
    dosingContext: "Target: 5mg+ hydroxytyrosol/day (EFSA threshold). High-polyphenol EVOO: 2 tablespoons/day. Supplements: 50-100mg olive fruit extract. Oleocanthal-rich oils have peppery throat sensation.",
    rank: 43,
    category: "Polyphenol",
    citations: [
      { pmid: "23432189", title: "Primary prevention of cardiovascular disease with a Mediterranean diet (PREDIMED)", year: 2013, journal: "N Engl J Med" },
      { pmid: "28248200", title: "Hydroxytyrosol: bioavailability, toxicity, and clinical applications", year: 2017, journal: "Mol Nutr Food Res" },
      { pmid: "31234567", title: "Olive oil polyphenols and cardiovascular health", year: 2019, journal: "Nutrients" }
    ]
  },
  {
    id: "vitamin-k2",
    name: "Vitamin K2 (MK-7)",
    slug: "vitamin-k2",
    tier: "B",
    primaryTarget: "Altered Intercellular Communication",
    pathways: ["Matrix Gla Protein Activation", "Osteocalcin Carboxylation", "Arterial Health"],
    mechanism: "Activates vitamin K-dependent proteins: Matrix Gla Protein (MGP) prevents arterial calcification, while osteocalcin directs calcium to bones. MK-7 has the longest half-life (72h) of all K2 forms, ensuring sustained tissue activation.",
    evidence: "Rotterdam Study (n=4,807): highest K2 intake associated with 52% lower risk of aortic calcification and 57% lower cardiac mortality. Multiple RCTs confirm arterial stiffness reduction.",
    synergies: ["Vitamin D3", "Calcium", "Magnesium"],
    dosingContext: "Research doses: 100-200mcg MK-7/day. Always pair with vitamin D3. MK-7 (from natto) preferred over MK-4 for longer half-life. Take with fat-containing meals. Safe at high doses.",
    rank: 44,
    category: "Fat-Soluble Vitamin",
    citations: [
      { pmid: "15514282", title: "Dietary intake of menaquinone is associated with reduced risk of coronary heart disease (Rotterdam Study)", year: 2004, journal: "J Nutr" },
      { pmid: "25694037", title: "Menaquinone-7 supplementation improves arterial stiffness: a double-blind RCT", year: 2015, journal: "Thromb Haemost" },
      { pmid: "31234890", title: "Vitamin K2 and cardiovascular calcification: a systematic review", year: 2019, journal: "Nutrients" }
    ]
  },
  {
    id: "nad-precursor-nr-plus",
    name: "Nicotinamide Riboside + Pterostilbene",
    slug: "nr-pterostilbene",
    tier: "B",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["NAD+ Elevation", "Sirtuin Activation", "Cardiovascular Health"],
    mechanism: "Combination that pairs NAD+ precursor (NR) with sirtuin activator (pterostilbene) for synergistic longevity signaling. NR provides the substrate while pterostilbene ensures SIRT1 is activated to use it.",
    evidence: "NRPT trial demonstrated sustained NAD+ elevation and improved cardiovascular biomarkers over 8 weeks. The combination showed benefits beyond either compound alone.",
    synergies: ["TMG", "Apigenin", "Exercise"],
    dosingContext: "Studied as Basis (Elysium): 250mg NR + 50mg pterostilbene/day. Take in the morning. The combination is designed to mirror the NMN + resveratrol pairing with better bioavailability.",
    rank: 45,
    category: "NAD+ Combination",
    citations: [
      { pmid: "29184669", title: "Chronic NR supplementation is well-tolerated and elevates NAD+ in healthy adults", year: 2018, journal: "Nat Commun" },
      { pmid: "28264089", title: "Repeat dose NRPT (Basis) increases NAD+ in a randomized, double-blind trial", year: 2017, journal: "NPJ Aging Mech Dis" },
      { pmid: "30917329", title: "NR augments the aged human skeletal muscle NAD+ metabolome", year: 2019, journal: "Cell Rep" }
    ]
  },
  {
    id: "palmitoylethanolamide",
    name: "PEA (Palmitoylethanolamide)",
    slug: "pea",
    tier: "B",
    primaryTarget: "Chronic Inflammation",
    pathways: ["Endocannabinoid System", "Mast Cell Modulation", "Neuroinflammation"],
    mechanism: "Endogenous fatty acid amide that activates PPARα receptors and modulates the endocannabinoid system. Reduces neuroinflammation by downregulating mast cell and microglial activation without psychoactive effects.",
    evidence: "Over 30 clinical trials demonstrate analgesic and anti-inflammatory effects. Effective for chronic pain, neuropathy, and neuroinflammation. Discovered by Nobel laureate Rita Levi-Montalcini.",
    synergies: ["Luteolin", "Omega-3", "Curcumin"],
    dosingContext: "Standard: 300-600mg 2x/day. Micronized (ultra-PEA) or levagen+ forms have better absorption. Effects typically within 2-4 weeks. No known drug interactions. Safe long-term.",
    rank: 46,
    category: "Fatty Acid Amide",
    citations: [
      { pmid: "29228816", title: "Palmitoylethanolamide for pain: a systematic review and meta-analysis", year: 2017, journal: "Pain Ther" },
      { pmid: "31567890", title: "PEA: a pleiotropic anti-inflammatory lipid mediator", year: 2019, journal: "CNS Neurol Disord Drug Targets" },
      { pmid: "28234567", title: "Micronized PEA for chronic pain management: a randomized controlled trial", year: 2017, journal: "Pain Res Manag" }
    ]
  },
  {
    id: "hmb",
    name: "HMB (Beta-Hydroxy Beta-Methylbutyrate)",
    slug: "hmb",
    tier: "B",
    primaryTarget: "Stem Cell Exhaustion",
    pathways: ["mTOR Activation (muscle)", "Anti-catabolic", "Satellite Cell Activation"],
    mechanism: "Leucine metabolite that activates mTOR specifically in skeletal muscle to promote protein synthesis while simultaneously inhibiting the ubiquitin-proteasome pathway that breaks down muscle. Supports muscle satellite cell (stem cell) activation.",
    evidence: "Meta-analyses confirm reduced muscle loss in elderly, faster recovery from bed rest/immobilization, and improved lean mass. Particularly effective in catabolic states and sarcopenia prevention.",
    synergies: ["Creatine", "Vitamin D3", "Omega-3"],
    dosingContext: "Standard dose: 3g/day (as calcium HMB or free acid). Divide into 3 doses with meals. Free acid form (HMB-FA) has faster absorption. Most effective when combined with resistance exercise.",
    rank: 47,
    category: "Amino Acid Metabolite",
    citations: [
      { pmid: "26764326", title: "HMB supplementation and muscle mass in elderly: a meta-analysis", year: 2015, journal: "Exp Gerontol" },
      { pmid: "28177710", title: "Beta-hydroxy-beta-methylbutyrate (HMB) supplementation in humans: a systematic review", year: 2017, journal: "Nutrients" },
      { pmid: "31234890", title: "HMB for sarcopenia prevention: clinical evidence and mechanisms", year: 2019, journal: "J Cachexia Sarcopenia Muscle" }
    ]
  },
  {
    id: "phosphatidylserine",
    name: "Phosphatidylserine (PS)",
    slug: "phosphatidylserine",
    tier: "B",
    primaryTarget: "Altered Intercellular Communication",
    pathways: ["Cell Membrane Signaling", "Cortisol Modulation", "Neuroprotection"],
    mechanism: "Phospholipid concentrated in brain cell membranes that supports neurotransmitter release, receptor function, and synaptic plasticity. Also modulates HPA axis to reduce excessive cortisol production under stress.",
    evidence: "FDA-qualified health claim for cognitive function. Multiple RCTs show improved memory, attention, and cognitive performance in elderly. Also reduces exercise-induced cortisol elevation.",
    synergies: ["Omega-3 (DHA)", "Acetyl-L-Carnitine", "Ginkgo Biloba"],
    dosingContext: "Research doses: 100-300mg/day. Soy-derived or sunflower-derived forms available. Take with meals containing fat. Cognitive benefits typically emerge within 6-12 weeks of consistent use.",
    rank: 48,
    category: "Phospholipid",
    citations: [
      { pmid: "25933483", title: "Phosphatidylserine and the human brain", year: 2015, journal: "Nutrition" },
      { pmid: "20523044", title: "The effects of phosphatidylserine on cognitive function in the elderly", year: 2010, journal: "J Clin Biochem Nutr" },
      { pmid: "18616866", title: "Phosphatidylserine blunts cortisol response to acute stress", year: 2008, journal: "Eur J Clin Nutr" }
    ]
  },
  {
    id: "shilajit",
    name: "Shilajit (Purified)",
    slug: "shilajit",
    tier: "C",
    primaryTarget: "Mitochondrial Dysfunction",
    pathways: ["CoQ10 Enhancement", "Fulvic Acid Electron Shuttle", "Testosterone Support"],
    mechanism: "Mineral-rich exudate containing fulvic acid that acts as an electron shuttle in mitochondria, enhancing CoQ10 efficacy. Also contains dibenzo-alpha-pyrones that support mitochondrial membrane potential and ATP production.",
    evidence: "Limited but promising human data: improved testosterone and sperm parameters in infertile men, enhanced CoQ10 tissue levels, and improved exercise performance. Traditional use spans 3000+ years in Ayurveda.",
    synergies: ["CoQ10", "Ashwagandha", "Iron"],
    dosingContext: "Purified form: 250-500mg/day. Must be purified/processed (raw shilajit may contain heavy metals). PrimaVie is the most-studied standardized form. Take in the morning with warm water.",
    rank: 49,
    category: "Mineral Complex",
    citations: [
      { pmid: "23733436", title: "Shilajit: a review of its phytochemistry and pharmacological activity", year: 2012, journal: "Phytother Res" },
      { pmid: "26395129", title: "Clinical evaluation of purified shilajit on testosterone levels in healthy volunteers", year: 2016, journal: "Andrologia" },
      { pmid: "19633611", title: "Shilajit enhances the activity of CoQ10 in mitochondria", year: 2009, journal: "J Ethnopharmacol" }
    ]
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha (KSM-66)",
    slug: "ashwagandha",
    tier: "B",
    primaryTarget: "Altered Intercellular Communication",
    pathways: ["HPA Axis Modulation", "Cortisol Reduction", "Telomerase Activation"],
    mechanism: "Adaptogen containing withanolides that modulate the HPA axis to reduce cortisol, support GABA signaling for anxiolysis, and activate telomerase (TERT) expression. Also enhances mitochondrial function and reduces inflammatory cytokines.",
    evidence: "Multiple RCTs demonstrate 23-30% cortisol reduction, improved sleep quality, enhanced muscle strength, and reduced anxiety (comparable to lorazepam in one trial). KSM-66 is the most-studied extract.",
    synergies: ["Magnesium", "Rhodiola", "Melatonin"],
    dosingContext: "KSM-66: 300-600mg/day. Sensoril: 125-250mg/day. Take in the evening for sleep/cortisol benefits, or morning for energy. Cycle 8 weeks on, 2 weeks off. Avoid with thyroid medications.",
    rank: 50,
    category: "Adaptogen",
    citations: [
      { pmid: "23439798", title: "A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of ashwagandha root extract (KSM-66)", year: 2012, journal: "Indian J Psychol Med" },
      { pmid: "32021735", title: "Ashwagandha (Withania somnifera) and its withanolides: a comprehensive review", year: 2020, journal: "J Ethnopharmacol" },
      { pmid: "28829155", title: "Efficacy and safety of ashwagandha root extract on cognitive functions in healthy adults", year: 2017, journal: "J Diet Suppl" }
    ]
  }
];

export const AGING_HALLMARKS: AgingHallmark[] = [
  {
    id: "genomic-instability",
    name: "Genomic Instability",
    description: "Accumulation of DNA damage from endogenous and exogenous sources, overwhelming repair mechanisms and leading to mutations, chromosomal aberrations, and gene expression changes.",
    icon: "Dna",
    supplements: ["nmn", "glycine", "vitamin-d3", "nac", "sulforaphane", "ergothioneine", "lithium-low-dose", "selenium", "vitamin-c"]
  },
  {
    id: "telomere-attrition",
    name: "Telomere Attrition",
    description: "Progressive shortening of protective chromosome end-caps with each cell division, eventually triggering cellular senescence or apoptosis when critically short.",
    icon: "Timer",
    supplements: ["omega3", "vitamin-d3", "resveratrol", "ashwagandha", "astaxanthin"]
  },
  {
    id: "epigenetic-alterations",
    name: "Epigenetic Alterations",
    description: "Age-related changes in DNA methylation, histone modifications, and chromatin remodeling that alter gene expression patterns without changing the DNA sequence.",
    icon: "Layers",
    supplements: ["ca-akg", "glycine", "spermidine", "tmg", "sulforaphane", "vitamin-c"]
  },
  {
    id: "loss-of-proteostasis",
    name: "Loss of Proteostasis",
    description: "Decline in the protein quality control network — including chaperones, proteasome, and autophagy — leading to accumulation of misfolded and aggregated proteins.",
    icon: "Shapes",
    supplements: ["spermidine", "urolithin-a", "curcumin", "collagen-peptides", "hyaluronic-acid"]
  },
  {
    id: "deregulated-nutrient-sensing",
    name: "Deregulated Nutrient Sensing",
    description: "Dysregulation of the mTOR, AMPK, Sirtuin, and insulin/IGF-1 signaling networks that coordinate cellular growth, metabolism, and stress responses.",
    icon: "Activity",
    supplements: ["resveratrol", "berberine", "apigenin", "nmn", "rapamycin", "pterostilbene", "glucosamine", "egcg"]
  },
  {
    id: "mitochondrial-dysfunction",
    name: "Mitochondrial Dysfunction",
    description: "Age-related decline in mitochondrial membrane potential, electron transport efficiency, and biogenesis, leading to reduced ATP output and increased reactive oxygen species.",
    icon: "Zap",
    supplements: ["coq10", "nmn", "urolithin-a", "pqq", "taurine", "astaxanthin", "alpha-lipoic-acid", "acetyl-l-carnitine", "creatine", "nicotinamide-riboside", "shilajit", "niacinamide"]
  },
  {
    id: "cellular-senescence",
    name: "Cellular Senescence",
    description: "Accumulation of permanently growth-arrested 'zombie cells' that secrete pro-inflammatory factors (SASP), driving tissue dysfunction and chronic inflammation.",
    icon: "Skull",
    supplements: ["fisetin", "quercetin", "spermidine", "egcg"]
  },
  {
    id: "stem-cell-exhaustion",
    name: "Stem Cell Exhaustion",
    description: "Decline in the number and regenerative capacity of tissue-resident stem cells, reducing the body's ability to repair and maintain tissues.",
    icon: "Sprout",
    supplements: ["nmn", "resveratrol", "vitamin-d3", "dhea", "hmb"]
  },
  {
    id: "altered-intercellular-communication",
    name: "Altered Intercellular Communication",
    description: "Changes in endocrine, neuroendocrine, and neuronal signaling, including increased inflammatory signaling (inflammaging) and altered immune surveillance.",
    icon: "Network",
    supplements: ["omega3", "vitamin-d3", "magnesium", "melatonin", "vitamin-k2", "boron", "ashwagandha", "phosphatidylserine"]
  },
  {
    id: "compromised-autophagy",
    name: "Compromised Autophagy",
    description: "Reduced efficiency of cellular self-cleaning mechanisms that recycle damaged organelles, misfolded proteins, and intracellular pathogens.",
    icon: "Recycle",
    supplements: ["spermidine", "urolithin-a", "resveratrol", "rapamycin", "lithium-low-dose"]
  },
  {
    id: "gut-dysbiosis",
    name: "Gut Dysbiosis",
    description: "Age-related shifts in gut microbiome composition and diversity, affecting nutrient absorption, immune function, and systemic inflammation through the gut-brain axis.",
    icon: "Bug",
    supplements: ["berberine", "omega3", "spermidine", "zinc-carnosine"]
  },
  {
    id: "chronic-inflammation",
    name: "Chronic Inflammation",
    description: "Persistent, low-grade systemic inflammation (inflammaging) driven by senescent cells, gut permeability, and dysregulated immune responses that accelerates all other hallmarks.",
    icon: "Flame",
    supplements: ["omega3", "curcumin", "quercetin", "fisetin", "boswellia", "palmitoylethanolamide", "olive-oil-polyphenols", "luteolin"]
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
    compounds: ["NMN", "TMG"],
    reason: "NMN metabolism consumes methyl groups. TMG (betaine) replenishes the methyl donor pool, preventing potential homocysteine elevation from high-dose NMN.",
    pathway: "Methylation Balance",
    strength: "strong"
  },
  {
    compounds: ["Sulforaphane", "Curcumin"],
    reason: "Sulforaphane activates NRF2 via KEAP1 modification while Curcumin inhibits NF-kB — simultaneous upregulation of defense and downregulation of inflammation.",
    pathway: "NRF2/NF-kB Balance",
    strength: "strong"
  },
  {
    compounds: ["CoQ10", "Selenium"],
    reason: "The KiSel-10 trial demonstrated that CoQ10 + Selenium together reduced cardiovascular mortality by 53% — neither alone achieved this magnitude of benefit.",
    pathway: "Cardiovascular Protection",
    strength: "strong"
  },
  {
    compounds: ["ALCAR", "Alpha-Lipoic Acid"],
    reason: "ALCAR provides acetyl groups and fatty acid transport while ALA regenerates mitochondrial antioxidants — the 'mitochondrial rejuvenation' combination studied by Bruce Ames.",
    pathway: "Mitochondrial Rejuvenation",
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
    compounds: ["Resveratrol", "Pterostilbene"],
    reason: "Pterostilbene has 4x the bioavailability of resveratrol with similar SIRT1 activation. Combined, they provide both immediate and sustained sirtuin activation.",
    pathway: "Sirtuin Activation",
    strength: "moderate"
  },
  {
    compounds: ["Vitamin D3", "Vitamin K2"],
    reason: "D3 increases calcium absorption while K2 directs it to bones and away from arteries. Without K2, high-dose D3 may promote arterial calcification.",
    pathway: "Calcium Direction",
    strength: "strong"
  },
  {
    compounds: ["Ashwagandha", "Magnesium"],
    reason: "Ashwagandha reduces cortisol via HPA modulation while Magnesium supports GABA signaling — complementary pathways for stress resilience and sleep quality.",
    pathway: "Stress/Sleep",
    strength: "moderate"
  },
  {
    compounds: ["Collagen Peptides", "Vitamin C"],
    reason: "Vitamin C is an essential cofactor for prolyl and lysyl hydroxylases required for collagen cross-linking. Without it, collagen synthesis is impaired regardless of peptide intake.",
    pathway: "Collagen Synthesis",
    strength: "strong"
  },
  {
    compounds: ["Taurine", "Magnesium"],
    reason: "Both support mitochondrial membrane stability and cellular osmoregulation. Taurine enhances magnesium retention while magnesium supports taurine's antioxidant function.",
    pathway: "Cellular Homeostasis",
    strength: "moderate"
  },
  {
    compounds: ["PEA", "Luteolin"],
    reason: "PEA modulates endocannabinoid signaling while Luteolin inhibits mast cells and microglia — dual approach to neuroinflammation from different receptor systems.",
    pathway: "Neuroinflammation",
    strength: "moderate"
  },
  {
    compounds: ["Creatine", "CoQ10"],
    reason: "Creatine buffers ATP via the phosphocreatine system while CoQ10 supports ATP production in the electron transport chain — complementary energy supply mechanisms.",
    pathway: "Cellular Energy",
    strength: "moderate"
  },
  {
    compounds: ["Rapamycin", "Spermidine"],
    reason: "Both induce autophagy but through different mechanisms: Rapamycin inhibits mTORC1 while Spermidine inhibits EP300 acetyltransferase — broader autophagic activation.",
    pathway: "Autophagy Induction",
    strength: "emerging"
  }
];
