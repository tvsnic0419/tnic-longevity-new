import type { EvidenceTier } from './types';

export type LibraryModuleCategory = 'compounds' | 'synergies' | 'lifestyle' | 'guides';

export interface LibraryModule {
  slug: string;
  category: LibraryModuleCategory;
  title: string;
  tagline: string;
  summary: string;
  evidenceTier: EvidenceTier;
  relatedHallmarkIds: string[];
  compoundId?: string;
  synergyCompoundIds?: string[];
  relatedSynergySlugs?: string[];
  requiresDisclaimer?: boolean;
  outline: string[];
  mdxSlug: string;
}

export const libraryCategoryMeta: Record<
  LibraryModuleCategory,
  { label: string; description: string; hubOrder: number }
> = {
  compounds: {
    label: 'Compound Deep-Dives',
    description:
      'Mechanism, evidence tiers, dosing protocols, monitoring checklists, and personal results templates for each intervention.',
    hubOrder: 1,
  },
  synergies: {
    label: 'Synergy Guides',
    description:
      'Multi-compound combinations with mechanistic rationale, trial data, timing choreography, and contraindication notes.',
    hubOrder: 2,
  },
  lifestyle: {
    label: 'Lifestyle Pillars',
    description:
      'Exercise, sleep, nutrition, and stress — mapped to hallmarks with actionable protocols and biomarker tie-ins.',
    hubOrder: 3,
  },
  guides: {
    label: 'Testing & Monitoring',
    description:
      'What to test, when to retest, how to interpret trends, and how lab data connects to your stack.',
    hubOrder: 4,
  },
};

export const libraryModules: LibraryModule[] = [
  // ── Compounds ──────────────────────────────────────────────────────────────
  {
    slug: 'glynac',
    category: 'compounds',
    title: 'GlyNAC (Glycine + NAC)',
    tagline: 'Flagship glutathione restoration — human RCT backbone',
    summary:
      'Dual-precursor strategy rebuilding the glutathione triad (GSH, cysteine, glycine). Tier A human data for oxidative stress, mitochondrial function, and inflammaging markers.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['mito', 'proteostasis', 'inflammation', 'genomic'],
    compoundId: 'glynac',
    relatedSynergySlugs: ['glynac-nrf2-triad'],
    outline: [
      'Overview & hallmark mapping',
      'Mechanism: GSH synthesis bottleneck',
      'Evidence summary (Kumar et al. RCTs)',
      'Dosing protocol (AM/PM, cycling)',
      'Monitoring: GSH, 8-OHdG, hs-CRP',
      'Safety & contraindications',
      'Personal results template',
    ],
    mdxSlug: 'glynac',
  },
  {
    slug: 'nmn',
    category: 'compounds',
    title: 'NMN (Nicotinamide Mononucleotide)',
    tagline: 'NAD+ precursor — sirtuin and PARP fuel',
    summary:
      'Direct NAD+ precursor bypassing NAMPT rate-limiting step. Restores NAD+ pools that decline ~50% between ages 40–60, activating SIRT1/3, DNA repair, and mitophagy.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['mito', 'genomic', 'epigenetic', 'senescence', 'nutrient'],
    compoundId: 'nmn',
    relatedSynergySlugs: ['nmn-resveratrol-sirt1', 'nad-mito-stack'],
    outline: [
      'Overview & NAD+ decline curve',
      'Mechanism: NMN → NAD+ → SIRT/PARP axis',
      'Evidence summary (human PK + biomarkers)',
      'Dosing protocol & resveratrol pairing',
      'Monitoring: NAD+ index, metabolic markers',
      'Safety & methyl donor considerations',
      'Personal results template',
    ],
    mdxSlug: 'nmn',
  },
  {
    slug: 'nr',
    category: 'compounds',
    title: 'NR (Nicotinamide Riboside)',
    tagline: 'NAD+ precursor alternative — human RCT data, manual stack substitution',
    summary:
      'Legitimate NAD+ precursor with human trial footprint. TNiC defaults to NMN for stack integration; this module covers when NR is the right choice, dosing, buyer verification, and compare-table evidence.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['mito', 'genomic', 'epigenetic', 'senescence', 'nutrient'],
    relatedSynergySlugs: ['nad-mito-stack', 'nmn-resveratrol-sirt1'],
    outline: [
      'Overview & NR → NMN → NAD+ pathway',
      'When to choose NR vs NMN',
      'Evidence summary (Martens, Trammell)',
      'Dosing & NR-Cl form requirements',
      'TNiC stack substitution guide',
      'Buyer guide & red flags',
      'Personal results template',
    ],
    mdxSlug: 'nr',
  },
  {
    slug: 'rapamycin',
    category: 'compounds',
    title: 'Rapamycin (Sirolimus)',
    tagline: 'mTORC1 inhibition — strongest preclinical lifespan drug',
    summary:
      'Educational deep-dive on the most replicated lifespan-extending pharmacological intervention. Prescription-only; immunosuppressive risks require physician oversight.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['autophagy', 'nutrient', 'senescence', 'mito'],
    requiresDisclaimer: true,
    relatedSynergySlugs: [],
    outline: [
      'Overview & mTOR/AMPK balance',
      'Mechanism: mTORC1 → autophagy induction',
      'Evidence: mouse, dog, PEARL trial',
      'Decision tree & physician checklist',
      'Dosing paradigms (pulse vs continuous)',
      'Monitoring: CBC, lipids, infection vigilance',
      'Buyer/sourcing guide (Rx only)',
      'Personal results template (physician-supervised)',
    ],
    mdxSlug: 'rapamycin',
  },
  {
    slug: 'tudca',
    category: 'compounds',
    title: 'TUDCA (Tauroursodeoxycholic Acid)',
    tagline: 'ER stress chaperone — proteostasis & mitochondrial support',
    summary:
      'Bile acid derivative stabilizing protein folding, reducing ER stress, and supporting mitochondrial membrane integrity. Strong preclinical data; emerging human hepatoprotection studies.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['proteostasis', 'mito', 'autophagy'],
    relatedSynergySlugs: [],
    outline: [
      'Overview & proteostasis link',
      'Mechanism: UPR modulation & chaperone activity',
      'Evidence summary (preclinical + pilot human)',
      'Decision tree & stack placement',
      'Dosing protocol & compliance checklist',
      'Monitoring: liver panel, GGT',
      'Buyer guide & red flags',
      'Personal results template',
    ],
    mdxSlug: 'tudca',
  },
  {
    slug: 'grapeseed',
    category: 'compounds',
    title: 'Grape Seed Extract (95% OPC)',
    tagline: 'Antioxidant polyphenol — real RCT evidence, but meta-analyses disagree on the headline claim',
    summary:
      'Grape Seed Extract standardized to ≥95% OPC (oligomeric proanthocyanidins). A 2016 meta-analysis (16 RCTs, n=810) found a significant systolic blood pressure reduction, but a larger 2022 meta-analysis of 19 trials found no significant SBP or endothelial (FMD) effect — only diastolic BP and heart rate held up. Not a native Stack Architect compound; evaluate it as an educational deep-dive, not a plug-and-play stack addition.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'genomic', 'mito', 'communication'],
    relatedSynergySlugs: ['glynac-nrf2-triad'],
    outline: [
      'Overview & OPC standardization — why 95% matters',
      'Mechanisms: ROS scavenging, Nrf2, eNOS/NO, NF-κB',
      'Evidence summary — where meta-analyses agree and disagree',
      'Dosing protocol & form selection',
      'Monitoring: blood pressure, hs-CRP',
      'Safety, antiplatelet notes, interactions',
      'Personal results template',
    ],
    mdxSlug: 'grapeseed',
  },
  {
    slug: 'sulforaphane',
    category: 'compounds',
    title: 'Sulforaphane',
    tagline: 'NRF2 master regulator — 200+ cytoprotective genes',
    summary:
      'Isothiocyanate from broccoli sprouts that covalently modifies KEAP1, releasing NRF2 to drive phase-II detox, proteasome upregulation, and anti-inflammatory gene expression.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['genomic', 'inflammation', 'proteostasis'],
    compoundId: 'sulforaphane',
    relatedSynergySlugs: ['glynac-nrf2-triad'],
    outline: [
      'Overview & NRF2 pathway',
      'Mechanism: KEAP1 modification',
      'Evidence summary',
      'Dosing & myrosinase activation',
      'Monitoring',
      'Personal results template',
    ],
    mdxSlug: 'sulforaphane',
  },
  {
    slug: 'rala',
    category: 'compounds',
    title: 'R-Alpha Lipoic Acid (R-ALA)',
    tagline: 'Mitochondrial redox recycler — NRF2 stack completion',
    summary:
      'Recycles oxidized glutathione, vitamins C and E. Cofactor for pyruvate dehydrogenase in mitochondria. Completes the NRF2 Defense Triad (substrate → signal → recycle). Tier B in healthy adults; strong mechanistic and metabolic syndrome data.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'proteostasis', 'inflammation'],
    compoundId: 'rala',
    relatedSynergySlugs: ['glynac-nrf2-triad', 'nad-mito-stack'],
    outline: [
      'Overview & NRF2 triad placement',
      'Mechanism: redox recycling hub',
      'Evidence summary (neuropathy, metabolic data)',
      'Dosing protocol & enantiomer note',
      'NRF2 Defense Triad choreography',
      'Monitoring: GSH, 8-OHdG, glucose',
      'Safety & interactions',
      'Personal results template',
    ],
    mdxSlug: 'rala',
  },
  {
    slug: 'cakg',
    category: 'compounds',
    title: 'Ca-AKG (Calcium Alpha-Ketoglutarate)',
    tagline: 'Epigenetic cofactor & TCA fuel — highest hallmark breadth per gram',
    summary:
      'TCA cycle intermediate and obligate cofactor for TET, JMJ, and PHD enzymes that reverse age-related DNA and histone methylation drift. Mouse lifespan +12%; emerging human metabolic and clock data from 2024.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['epigenetic', 'mito', 'stem'],
    compoundId: 'cakg',
    relatedSynergySlugs: ['nad-mito-stack'],
    outline: [
      'Overview & AKG decline curve',
      'Mechanism: TCA anaplerosis + TET/JMJ cofactor',
      'Evidence summary (mouse lifespan + human 2024)',
      'Dosing protocol & titration',
      'NAD+ Mito Stack ramp-in schedule',
      'Monitoring: glucose, hs-CRP, epigenetic clock',
      'Safety & contraindications',
      'Personal results template',
    ],
    mdxSlug: 'cakg',
  },
  {
    slug: 'resveratrol',
    category: 'compounds',
    title: 'Trans-Resveratrol',
    tagline: 'SIRT1 activator — caloric restriction mimetic',
    summary:
      'Phytoalexin activating SIRT1 and AMPK. Synergistic with NAD+ precursors for epigenetic and mitochondrial remodeling. Tier B — strong mechanism, mixed human outcomes.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'epigenetic', 'inflammation', 'senescence'],
    compoundId: 'resveratrol',
    relatedSynergySlugs: ['nmn-resveratrol-sirt1', 'nad-mito-stack'],
    outline: [
      'Overview & SIRT1 axis',
      'Mechanism & bioavailability',
      'Evidence summary',
      'Dosing & NMN pairing (PM timing)',
      'Monitoring',
      'Personal results template',
    ],
    mdxSlug: 'resveratrol',
  },
  {
    slug: 'taurine',
    category: 'compounds',
    title: 'Taurine',
    tagline: 'Age-depleted osmolyte — Science 2023 lifespan signals',
    summary:
      'Sulfonic amino acid buffering mitochondrial stress and declining ~80% with age. Tier B: strong Singh 2023 Science mechanism and animal lifespan data; limited human longevity RCT.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'inflammation', 'genomic'],
    compoundId: 'taurine',
    outline: [
      'Overview & taurine decline with age',
      'Mechanism: membrane + mitochondrial buffering',
      'Evidence: Singh 2023 Science',
      'Dosing protocol',
      'Monitoring',
      'Personal results template',
    ],
    mdxSlug: 'taurine',
  },
  {
    slug: 'spermidine',
    category: 'compounds',
    title: 'Spermidine',
    tagline: 'Autophagy polyamine — Madeo 2021 memory RCT',
    summary:
      'Dietary and supplemental polyamine inducing autophagy via EP300 inhibition. Tier B: human pilot memory outcomes; strong mechanistic autophagy data.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['autophagy', 'epigenetic', 'senescence'],
    compoundId: 'spermidine',
    outline: [
      'Overview & autophagy induction',
      'Mechanism: EP300 / eIF5A',
      'Evidence: Madeo 2021 Cell RCT',
      'Dosing & dietary sources',
      'Monitoring',
      'Personal results template',
    ],
    mdxSlug: 'spermidine',
  },
  {
    slug: 'pterostilbene',
    category: 'compounds',
    title: 'Pterostilbene',
    tagline: 'Methylated resveratrol — 4× bioavailability',
    summary:
      'Stilbenoid SIRT1 activator with superior human PK vs trans-resveratrol. Tier B: Kapetanovic 2011 safety/PK; compare with resveratrol for stack pairing.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'epigenetic', 'inflammation'],
    compoundId: 'pterostilbene',
    relatedSynergySlugs: ['nmn-resveratrol-sirt1'],
    outline: [
      'Overview vs resveratrol',
      'Mechanism & bioavailability advantage',
      'Evidence summary',
      'Dosing & NMN pairing',
      'Compare table link',
      'Personal results template',
    ],
    mdxSlug: 'pterostilbene',
  },

  {
    slug: 'berberine',
    category: 'compounds',
    title: 'Berberine HCl',
    tagline: 'AMPK activator — metformin-equivalent glucose outcomes without a prescription',
    summary:
      'Isoquinoline alkaloid activating AMPK with RCT-equivalent glucose control vs metformin (500 mg TID, 13-week head-to-head). Tier A for metabolic endpoints; adds LDL/TG lipid benefits metformin lacks. Bioavailability-enhanced forms (dihydroberberine) achieve 5× plasma levels.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['nutrient', 'inflammation', 'mito', 'communication'],
    compoundId: 'berberine',
    outline: [
      'Overview & AMPK mechanism',
      'Head-to-head vs metformin (Yin 2008 RCT)',
      'Lipid and glucose evidence summary',
      'Dosing: TID vs dihydroberberine upgrade',
      'Monitoring: HbA1c, ApoB, LDL',
      'Safety & drug interactions',
      'Personal results template',
    ],
    mdxSlug: 'berberine',
  },
  {
    slug: 'urolithin-a',
    category: 'compounds',
    title: 'Urolithin A',
    tagline: 'Mitophagy activator — Phase 2 muscle trial, Tier A',
    summary:
      'Gut-derived metabolite from ellagitannin polyphenols that activates mitophagy — the selective clearance of damaged mitochondria. Phase 2 RCT (2022, Cell Reports Medicine) confirmed improved muscle strength and reduced fatigue in adults ≥65 at 1000 mg/day. Only commercially available mitophagy-specific compound with human trial data.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['mito', 'autophagy', 'senescence'],
    compoundId: 'urolithin-a',
    outline: [
      'Overview & mitophagy mechanism',
      'Phase 2 RCT: muscle strength + fatigue outcomes',
      'Mitopure vs pomegranate extract — why standardization matters',
      'Dosing: 500 vs 1000 mg, AM with food',
      'Monitoring: muscle function, hs-CRP',
      'Safety & contraindications',
      'Personal results template',
    ],
    mdxSlug: 'urolithin-a',
  },
  {
    slug: 'fisetin',
    category: 'compounds',
    title: 'Fisetin',
    tagline: 'Senolytic flavonoid — Mayo Clinic pilot, highest potency ranking',
    summary:
      'Flavonoid with the highest senolytic potency of dietary compounds tested (Kirkland lab, 2018). Mayo Clinic pilot RCT reduced p16INK4A and p21 senescence markers and improved physical function. Pulse-dose protocol (20 mg/kg × 2 consecutive days/month) is the evidence-based regimen. Tier B pending larger RCT.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['senescence', 'communication', 'inflammation'],
    compoundId: 'fisetin',
    outline: [
      'Overview: senolytics and the SASP problem',
      'Senolytic potency ranking vs quercetin, navitoclax',
      'Mayo Clinic pilot RCT — design and outcomes',
      'Pulse-dose protocol: why 2-day burst, not daily',
      'Monitoring: p16/p21 proxies, inflammation markers',
      'Safety — low adverse event profile',
      'Personal results template',
    ],
    mdxSlug: 'fisetin',
  },
  {
    slug: 'coq10',
    category: 'compounds',
    title: 'CoQ10 (Ubiquinol)',
    tagline: 'Electron transport chain cofactor — essential for statin users',
    summary:
      'Mitochondrial cofactor required at Complex I, II, and III of the electron transport chain. Declines ~50% by age 70. Ubiquinol (reduced form) has superior bioavailability. Meta-analysis of 17 RCTs confirms hs-CRP and IL-6 reduction. Critical for statin users — statins block HMG-CoA reductase, which also synthesizes CoQ10. Tier B.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'inflammation', 'genomic'],
    compoundId: 'coq10',
    outline: [
      'Overview: CoQ10 in the ETC',
      'Age-related decline and statin depletion',
      'Ubiquinol vs ubiquinone — bioavailability data',
      'Meta-analysis: 17 RCTs on inflammation markers',
      'Dosing: 100–300 mg ubiquinol, fat co-ingestion required',
      'Monitoring: CoQ10 plasma, hs-CRP, energy',
      'Personal results template',
    ],
    mdxSlug: 'coq10',
  },
  {
    slug: 'omega3',
    category: 'compounds',
    title: 'Omega-3 (EPA + DHA)',
    tagline: 'REDUCE-IT: 25% CV event reduction — SPM resolution axis',
    summary:
      'EPA and DHA serve as precursors to specialized pro-resolving mediators (SPMs) — resolvins and protectins — that actively resolve inflammation rather than merely suppressing it. REDUCE-IT trial (NEJM 2018, n=8,179): high-dose EPA (4 g/day) reduced major CV events 25% in high-risk patients. Tier A across cardiovascular, inflammatory, and microbiome endpoints.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['inflammation', 'communication', 'telomeres', 'dysbiosis'],
    compoundId: 'omega3',
    outline: [
      'Overview: EPA/DHA vs ALA — why conversion matters',
      'SPM resolution axis — active resolution, not suppression',
      'REDUCE-IT trial design and outcomes',
      'Telomere data: omega-3 and telomerase activation',
      'Dosing: 2–4 g EPA+DHA combined; form (rTG, krill, standard)',
      'Monitoring: omega-3 index, hs-CRP, ApoB, triglycerides',
      'Personal results template',
    ],
    mdxSlug: 'omega3',
  },

  {
    "slug": "metformin",
    "category": "compounds",
    "title": "Metformin",
    "tagline": "Prescription biguanide with Tier-A diabetes data and a genuinely unsettled Tier-B geroprotection case.",
    "summary": "Metformin inhibits mitochondrial Complex I and activates AMPK, with strong human evidence for glucose control and diabetes prevention but no completed human trial showing a lifespan or healthspan benefit in healthy people; the NIA ITP found no lifespan extension from metformin alone and one RCT shows it can blunt exercise adaptations.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "nutrient",
      "mito",
      "inflammation",
      "communication"
    ],
    "requiresDisclaimer": true,
    "outline": [
      "What metformin does & why it matters",
      "Mechanism: Complex I, AMPK & caveats",
      "Evidence summary: strong vs. contested",
      "Dosing (educational, physician-set)",
      "Monitoring & B12 depletion",
      "Safety, red flags & exercise-blunting",
      "Synergies & mechanism overlap"
    ],
    "mdxSlug": "metformin",
  },

  {
    "slug": "creatine",
    "category": "compounds",
    "title": "Creatine Monohydrate",
    "tagline": "Phosphocreatine ATP buffer — Tier A for muscle and strength in aging",
    "summary": "The best-evidenced legal amplifier of resistance training for defending against sarcopenia, with a large older-adult RCT base for lean mass and strength; cognition benefit is real but weaker and concentrated in older/stressed brains.",
    "evidenceTier": "A",
    "relatedHallmarkIds": [
      "mito",
      "stem",
      "nutrient"
    ],
    "compoundId": "creatine",
    "requiresDisclaimer": false,
    "outline": [
      "What creatine does (and why it matters)",
      "Mechanism — a phosphate buffer, not an anabolic drug",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety, red flags, and contraindications",
      "Synergies and personal results template"
    ],
    "mdxSlug": "creatine",
  },

  {
    "slug": "vitamin-d3",
    "category": "compounds",
    "title": "Vitamin D3 (Cholecalciferol)",
    "tagline": "Correcting deficiency is Tier A; the hard-outcome longevity data is mostly null.",
    "summary": "A secosteroid hormone precursor where fixing a real deficiency is well-established, but large RCTs (VITAL, D-Health) show no cancer, cardiovascular, fracture, or mortality benefit in replete people. Softer signals for autoimmune-disease incidence and cancer mortality keep the longevity case at Tier B.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "inflammation",
      "communication",
      "genomic"
    ],
    "compoundId": "vitamin-d3",
    "requiresDisclaimer": false,
    "outline": [
      "What vitamin D3 does (and why it matters)",
      "Mechanism — a nuclear hormone, not an antioxidant",
      "Evidence summary — honest about the hard outcomes",
      "Dosing protocol",
      "Monitoring",
      "Safety, red flags, and contraindications",
      "Synergies"
    ],
    "mdxSlug": "vitamin-d3",
  },

  {
    "slug": "magnesium",
    "category": "compounds",
    "title": "Magnesium (Glycinate / Threonate)",
    "tagline": "Essential ATP-Mg2+ cofactor — modest, repletion-shaped RCT wins for BP, insulin sensitivity, and sleep",
    "summary": "Cofactor for 300+ enzymes including ATP-Mg2+, DNA repair, and insulin signaling; deficiency is common. Tier B: real meta-analyses show modest BP (-2.0/-1.8 mmHg) and HOMA-IR improvements plus a small sleep-latency signal, but no longevity-endpoint trial exists. Form matters: glycinate for repletion/tolerance, L-threonate for CNS targeting.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "genomic",
      "mito",
      "nutrient"
    ],
    "compoundId": "magnesium",
    "requiresDisclaimer": false,
    "outline": [
      "What magnesium does & ATP-Mg mechanism",
      "Mechanism — repletion, not pharmacology",
      "Evidence: BP, HOMA-IR, sleep, cognition",
      "Dosing & form selection (glycinate vs threonate)",
      "Monitoring: RBC magnesium, BP, glucose",
      "Safety, red flags & drug interactions",
      "Synergies & personal results template"
    ],
    "mdxSlug": "magnesium",
  },

  {
    "slug": "curcumin",
    "category": "compounds",
    "title": "Curcumin (Curcuminoids)",
    "tagline": "Turmeric polyphenol with Tier-A knee-OA symptom relief, Tier-B systemic inflammation effects, and a defining bioavailability problem",
    "summary": "Curcumin suppresses NF-κB and activates Nrf2, with strong human RCT evidence for knee-osteoarthritis pain (as effective as ibuprofen at 1,500 mg/day) and modest, formulation-dependent reductions in CRP/TNF-α. Plain curcumin is barely absorbed, so trial results apply only to phytosome, piperine-combined, or nano/micellar forms.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "inflammation",
      "senescence",
      "communication"
    ],
    "compoundId": "curcumin",
    "requiresDisclaimer": false,
    "outline": [
      "What curcumin does (and why it matters)",
      "Mechanism — promiscuous anti-inflammatory, not a clean single target",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety, red flags, and contraindications",
      "Synergies"
    ],
    "mdxSlug": "curcumin",
  },

  {
    "slug": "quercetin",
    "category": "compounds",
    "title": "Quercetin",
    "tagline": "Founding senolytic flavonoid — strong mechanism, early human outcomes",
    "summary": "The 'Q' in the dasatinib + quercetin senolytic protocol. Well-established preclinically with promising but small, mostly uncontrolled human pilots (diabetic kidney disease, IPF), plus a modest anti-hypertensive signal at >500 mg/day. Bioavailability is poor unless a phytosome/EMIQ form is used.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "senescence",
      "inflammation"
    ],
    "compoundId": "quercetin",
    "requiresDisclaimer": false,
    "outline": [
      "What quercetin does (and why it matters)",
      "Mechanism: senolysis plus flavonoid anti-inflammation",
      "Evidence summary: strong mechanism, early human outcomes",
      "Dosing protocol (daily vs D+Q senolytic)",
      "Monitoring: BP, hs-CRP, kidney function",
      "Safety, red flags, and contraindications",
      "Synergies and personal results template"
    ],
    "mdxSlug": "quercetin",
  },

  {
    "slug": "glucosamine",
    "category": "compounds",
    "title": "Glucosamine Sulfate",
    "tagline": "Large observational cohorts link regular use to lower mortality — associational, not causal.",
    "summary": "An aminosaccharide joint supplement with a striking but confounded UK Biobank association to lower cardiovascular and all-cause mortality, a modest AMPK/low-carb-mimicking lifespan effect in animals, and genuinely mixed osteoarthritis RCT data.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "inflammation",
      "nutrient"
    ],
    "compoundId": "glucosamine",
    "requiresDisclaimer": false,
    "outline": [
      "What glucosamine does",
      "Mechanism — low-carb mimic",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety & red flags",
      "Synergies & personal log"
    ],
    "mdxSlug": "glucosamine",
  },

  {
    "slug": "vitamin-k2",
    "category": "compounds",
    "title": "Vitamin K2 (MK-7)",
    "tagline": "The calcium-routing cofactor: activates MGP and osteocalcin, with mixed 3-year RCT outcomes",
    "summary": "MK-7 is the vitamin K2 form that carboxylates matrix Gla protein and osteocalcin, steering calcium away from arteries and into bone. Human RCTs support improved arterial stiffness and slowed bone loss at 180 mcg/day, but a matched osteopenia trial found no BMD benefit, keeping the evidence honestly at Tier B.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "communication",
      "inflammation"
    ],
    "compoundId": "vitamin-k2",
    "requiresDisclaimer": false,
    "outline": [
      "What Vitamin K2 does (and why it matters)",
      "Mechanism — carboxylation as a molecular on switch",
      "Evidence summary — where the RCTs agree and disagree",
      "Dosing protocol",
      "Monitoring",
      "Safety, red flags, and contraindications",
      "Synergies and personal results template"
    ],
    "mdxSlug": "vitamin-k2",
  },

  {
    "slug": "melatonin",
    "category": "compounds",
    "title": "Melatonin",
    "tagline": "Circadian hormone and mitochondrial antioxidant — Tier A for sleep, Tier B/C for longevity.",
    "summary": "Pineal indoleamine that sets circadian timing and doubles as a mitochondria-concentrated antioxidant; secretion declines with age. Strong human RCT evidence for reducing sleep latency, with anti-inflammatory and metabolic signals modest and geroprotection still preclinical.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "mito",
      "inflammation",
      "communication"
    ],
    "compoundId": "melatonin",
    "requiresDisclaimer": false,
    "outline": [
      "What melatonin does (and why it matters)",
      "Mechanism — a hormone that is also an antioxidant",
      "Evidence summary — strong for sleep, thinner for longevity",
      "Dosing protocol",
      "Monitoring",
      "Safety, red flags, and contraindications",
      "Synergies and personal results template"
    ],
    "mdxSlug": "melatonin",
  },

  {
    "slug": "glycine",
    "category": "compounds",
    "title": "Glycine",
    "tagline": "Conditionally-essential amino acid: glutathione substrate, methyl-group buffer, and NMDA-mediated sleep aid — small but real human RCTs, preclinical lifespan signal.",
    "summary": "Glycine is the third glutathione residue and a co-limiting substrate with cysteine in aging. Small human RCTs support 3 g at night for sleep and 15 g/day for oxidative stress and systolic BP in metabolic syndrome; direct lifespan evidence is preclinical (NIA ITP mouse). Strongest aging data is for the glycine+NAC (GlyNAC) combination.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "proteostasis",
      "mito",
      "nutrient"
    ],
    "compoundId": "glycine",
    "requiresDisclaimer": false,
    "outline": [
      "What glycine does (and why it matters)",
      "Mechanism: glutathione, methylation, CNS sleep",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety, red flags, and contraindications",
      "Synergies and personal results"
    ],
    "mdxSlug": "glycine",
  },

  {
    "slug": "nac",
    "category": "compounds",
    "title": "N-Acetylcysteine (NAC)",
    "tagline": "Cysteine donor that refills glutathione — strong mechanism and safety, thin standalone longevity data (Tier B).",
    "summary": "NAC is a plasma-stable cysteine precursor that raises glutathione, with decades of approved mucolytic and acetaminophen-antidote use. The direct human aging evidence is for the GlyNAC combination (NAC + glycine), not NAC alone, so standalone NAC is honestly Tier B.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "proteostasis",
      "inflammation",
      "mito"
    ],
    "compoundId": "nac",
    "requiresDisclaimer": false,
    "outline": [
      "What NAC does (and why it matters)",
      "Mechanism — a substrate, not a signaling drug",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety, red flags, and contraindications",
      "Synergies and personal results"
    ],
    "mdxSlug": "nac",
  },

  {
    "slug": "zinc",
    "category": "compounds",
    "title": "Zinc",
    "tagline": "Essential trace mineral; corrects age-related immune decline in the deficient, with genuine RCT infection data and indirect longevity rationale.",
    "summary": "Zinc is a cofactor for ~300 enzymes including antioxidant SOD and thymulin; deficiency is common in older adults and mirrors immunosenescence. Human RCT and meta-analytic data support immune/infection endpoints, but longevity benefit is inferred, not demonstrated. Tier B; watch copper depletion at higher doses.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "inflammation",
      "genomic",
      "communication"
    ],
    "compoundId": "zinc",
    "requiresDisclaimer": false,
    "outline": [
      "What zinc does (and why it matters)",
      "Mechanism - cofactor biology, not a druglike target",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety, red flags, and contraindications",
      "Synergies"
    ],
    "mdxSlug": "zinc",
  },

  {
    "slug": "l-citrulline",
    "category": "compounds",
    "title": "L-Citrulline",
    "tagline": "Nitric-oxide support — evidence-graded deep dive",
    "summary": "Oral citrulline raises arginine availability and supports nitric-oxide signaling; human evidence focuses on vascular function, blood pressure, and exercise rather than lifespan.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "communication",
      "mito"
    ],
    "compoundId": "l-citrulline",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "l-citrulline"
  },

  {
    "slug": "egcg",
    "category": "compounds",
    "title": "EGCG (Green Tea Catechin)",
    "tagline": "AMPK and redox signaling — evidence-graded deep dive",
    "summary": "Green-tea catechins influence AMPK and inflammatory signaling, but isolated high-dose extracts can injure the liver and longevity outcomes remain unproven.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "epigenetic",
      "inflammation",
      "mito"
    ],
    "compoundId": "egcg",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "egcg"
  },

  {
    "slug": "astaxanthin",
    "category": "compounds",
    "title": "Astaxanthin",
    "tagline": "Membrane antioxidant defense — evidence-graded deep dive",
    "summary": "This lipid-soluble carotenoid spans cell membranes and has human studies in skin, oxidative stress, and exercise; direct healthspan evidence is limited.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "mito",
      "inflammation",
      "communication"
    ],
    "compoundId": "astaxanthin",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "astaxanthin"
  },

  {
    "slug": "apigenin",
    "category": "compounds",
    "title": "Apigenin",
    "tagline": "CD38 and inflammatory signaling — evidence-graded deep dive",
    "summary": "Apigenin inhibits CD38 and inflammatory pathways in laboratory models, but oral human intervention evidence is sparse and no longevity outcome has been shown.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "inflammation",
      "senescence"
    ],
    "compoundId": "apigenin",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "apigenin"
  },

  {
    "slug": "luteolin",
    "category": "compounds",
    "title": "Luteolin",
    "tagline": "Neuroinflammatory signaling — evidence-graded deep dive",
    "summary": "Luteolin is a preclinical anti-inflammatory and senotherapeutic candidate; available human work uses small studies or combination formulations.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "senescence",
      "inflammation"
    ],
    "compoundId": "luteolin",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "luteolin"
  },

  {
    "slug": "ergothioneine",
    "category": "compounds",
    "title": "Ergothioneine",
    "tagline": "OCTN1 cytoprotective transport — evidence-graded deep dive",
    "summary": "This diet-derived thiol has a dedicated transporter and strong observational or mechanistic rationale, while supplementation trials and longevity endpoints remain scarce.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "mito",
      "inflammation",
      "genomic"
    ],
    "compoundId": "ergothioneine",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "ergothioneine"
  },

  {
    "slug": "l-carnosine",
    "category": "compounds",
    "title": "L-Carnosine",
    "tagline": "Carbonyl and glycation defense — evidence-graded deep dive",
    "summary": "Carnosine scavenges reactive carbonyls and buffers pH, but oral hydrolysis by carnosinase and small heterogeneous trials limit confidence.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "proteostasis",
      "senescence"
    ],
    "compoundId": "l-carnosine",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "l-carnosine"
  },

  {
    "slug": "tmg",
    "category": "compounds",
    "title": "TMG (Trimethylglycine / Betaine)",
    "tagline": "BHMT methyl donation — evidence-graded deep dive",
    "summary": "Betaine donates methyl groups through BHMT and reliably lowers homocysteine; performance and longevity implications are less certain.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "epigenetic",
      "communication"
    ],
    "compoundId": "tmg",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "tmg"
  },

  {
    "slug": "tocotrienols",
    "category": "compounds",
    "title": "Tocotrienols (Vitamin E)",
    "tagline": "Lipid redox protection — evidence-graded deep dive",
    "summary": "Tocotrienols are vitamin-E isoforms distinct from alpha-tocopherol, with human trials in lipids and metabolic or liver endpoints but no direct lifespan evidence.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "inflammation",
      "mito"
    ],
    "compoundId": "tocotrienols",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "tocotrienols"
  },

  {
    "slug": "butyrate",
    "category": "compounds",
    "title": "Butyrate (Sodium / Tributyrin)",
    "tagline": "SCFA and HDAC signaling — evidence-graded deep dive",
    "summary": "Butyrate is a colonocyte fuel and HDAC-active microbial metabolite; oral-product evidence is emerging and increasing fermentable fiber is usually the better-supported first step.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "dysbiosis",
      "epigenetic",
      "inflammation"
    ],
    "compoundId": "butyrate",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "butyrate"
  },

  {
    "slug": "ashwagandha",
    "category": "compounds",
    "title": "Ashwagandha (Withania somnifera)",
    "tagline": "Stress-response modulation — evidence-graded deep dive",
    "summary": "Standardized extracts have human evidence for perceived stress and sleep, while longevity claims are indirect and rare liver injury is a material caution.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "inflammation",
      "communication"
    ],
    "compoundId": "ashwagandha",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "ashwagandha"
  },

  {
    "slug": "rhodiola",
    "category": "compounds",
    "title": "Rhodiola rosea",
    "tagline": "Stress and fatigue signaling — evidence-graded deep dive",
    "summary": "Rhodiola has modest human evidence for fatigue and stress, but study quality varies and lifespan findings are preclinical.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "mito",
      "inflammation"
    ],
    "compoundId": "rhodiola",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "rhodiola"
  },

  {
    "slug": "nicotinamide",
    "category": "compounds",
    "title": "Nicotinamide (NAM)",
    "tagline": "NAD precursor and DNA repair — evidence-graded deep dive",
    "summary": "Nicotinamide is a non-flushing vitamin-B3 form with strong evidence for reducing new non-melanoma skin cancers in high-risk patients; high doses are not interchangeable with general NAD support.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "genomic",
      "epigenetic"
    ],
    "compoundId": "nicotinamide",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "nicotinamide"
  },

  {
    "slug": "hesperidin",
    "category": "compounds",
    "title": "Hesperidin",
    "tagline": "Endothelial flavanone signaling — evidence-graded deep dive",
    "summary": "This citrus flavanone has human vascular and inflammatory studies, with effects influenced by formulation and individual metabolism; longevity outcomes are absent.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "communication",
      "inflammation"
    ],
    "compoundId": "hesperidin",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "hesperidin"
  },

  {
    "slug": "boswellia",
    "category": "compounds",
    "title": "Boswellia serrata (AKBA)",
    "tagline": "5-LOX inflammatory signaling — evidence-graded deep dive",
    "summary": "Standardized boswellic-acid extracts have reasonable evidence for osteoarthritis pain and function, while systemic longevity claims extend beyond the data.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "inflammation"
    ],
    "compoundId": "boswellia",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "boswellia"
  },

  {
    "slug": "gynostemma",
    "category": "compounds",
    "title": "Gynostemma pentaphyllum (Jiaogulan)",
    "tagline": "AMPK-linked metabolic signaling — evidence-graded deep dive",
    "summary": "Small human studies suggest metabolic effects from gypenosides, but replication, product standardization, and healthspan evidence are limited.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "nutrient",
      "mito"
    ],
    "compoundId": "gynostemma",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "gynostemma"
  },

  {
    "slug": "lithium",
    "category": "compounds",
    "title": "Low-Dose Lithium",
    "tagline": "GSK-3 and autophagy signaling — evidence-graded deep dive",
    "summary": "Ecological and preclinical signals are hypothesis-generating only; even low exposure can affect thyroid and kidney function, and lithium orotate lacks robust longevity trials.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "autophagy",
      "communication"
    ],
    "compoundId": "lithium",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "lithium"
  },

  {
    "slug": "hyaluronic-acid",
    "category": "compounds",
    "title": "Hyaluronic Acid (Oral)",
    "tagline": "Extracellular-matrix hydration — evidence-graded deep dive",
    "summary": "Oral hyaluronic acid has modest trials for skin hydration and knee symptoms, but absorption mechanisms and long-term healthspan relevance remain uncertain.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "communication",
      "inflammation"
    ],
    "compoundId": "hyaluronic-acid",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "hyaluronic-acid"
  },

  {
    "slug": "inulin",
    "category": "compounds",
    "title": "Inulin / Prebiotic Fiber",
    "tagline": "Microbiome SCFA production — evidence-graded deep dive",
    "summary": "Inulin-type fructans feed saccharolytic microbes and can improve bowel and selected metabolic outcomes; tolerance is dose-dependent and benefits vary by baseline microbiome.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "dysbiosis",
      "inflammation",
      "nutrient"
    ],
    "compoundId": "inulin",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "inulin"
  },

  {
    "slug": "acarbose",
    "category": "compounds",
    "title": "Acarbose",
    "tagline": "Post-meal glucose attenuation — evidence-graded deep dive",
    "summary": "Acarbose extends mouse lifespan in the NIA Intervention Testing Program and improves postprandial glucose in humans, but healthy-human longevity benefit is unproven and gastrointestinal effects are common.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "nutrient",
      "inflammation"
    ],
    "requiresDisclaimer": true,
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "acarbose"
  },

  {
    "slug": "canagliflozin",
    "category": "compounds",
    "title": "Canagliflozin (SGLT2 inhibitor)",
    "tagline": "Renal glucose excretion — evidence-graded deep dive",
    "summary": "SGLT2 inhibition has strong cardiorenal outcome data in indicated patients and male-mouse lifespan data, but it is not a healthy-person longevity supplement and carries ketoacidosis and infection risks.",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "nutrient",
      "communication"
    ],
    "requiresDisclaimer": true,
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "canagliflozin"
  },

  {
    "slug": "17a-estradiol",
    "category": "compounds",
    "title": "17-alpha-Estradiol",
    "tagline": "Sex-specific metabolic signaling — evidence-graded deep dive",
    "summary": "17-alpha-estradiol extends lifespan in male mice in the NIA program, but has no human longevity evidence and should be treated strictly as an experimental research compound.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "nutrient",
      "inflammation"
    ],
    "requiresDisclaimer": true,
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "17a-estradiol"
  },

  {
    "slug": "dasatinib",
    "category": "compounds",
    "title": "Dasatinib",
    "tagline": "Senolytic tyrosine-kinase inhibition — evidence-graded deep dive",
    "summary": "Dasatinib plus quercetin has early human senolytic studies, but dasatinib is a potent leukemia drug with serious hematologic and infectious risks and no role in self-experimentation.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "senescence",
      "inflammation"
    ],
    "requiresDisclaimer": true,
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "dasatinib"
  },

  {
    "slug": "selenium",
    "category": "compounds",
    "title": "Selenium",
    "tagline": "Selenoprotein Redox Defense — evidence-graded deep dive",
    "summary": "Tier B for correcting insufficiency, not for general longevity. SELECT found no cancer-prevention benefit in largely replete men (PMID 19066370), while randomized and meta-analytic evidence raises a type-2-diabetes concern at high intake (PMIDs 17620655, 29974401).",
    "evidenceTier": "B",
    "relatedHallmarkIds": [
      "genomic",
      "inflammation"
    ],
    "compoundId": "selenium",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "selenium"
  },

  {
    "slug": "pqq",
    "category": "compounds",
    "title": "PQQ (Pyrroloquinoline Quinone)",
    "tagline": "PGC-1alpha Mitochondrial Signaling — evidence-graded deep dive",
    "summary": "Tier C: a 10-person crossover reported inflammatory and metabolic-marker shifts (PMID 24231099), while small cognition trials provide preliminary rather than decisive evidence (PMIDs 26782228, 36807425). No human longevity endpoint has been demonstrated.",
    "evidenceTier": "C",
    "relatedHallmarkIds": [
      "mito",
      "inflammation"
    ],
    "compoundId": "pqq",
    "relatedSynergySlugs": [],
    "outline": [
      "What it does and hallmark mapping",
      "Mechanism and biological context",
      "Evidence summary",
      "Dosing protocol",
      "Monitoring",
      "Safety and red flags",
      "Synergies and stack integration",
      "Personal results template"
    ],
    "mdxSlug": "pqq"
  },

  // ── Synergies ──────────────────────────────────────────────────────────────
  {
    slug: 'glynac-nrf2-triad',
    category: 'synergies',
    title: 'NRF2 Defense Triad',
    tagline: 'GlyNAC + Sulforaphane + R-ALA',
    summary:
      'The foundational TNiC NRF2 stack: glutathione substrate (GlyNAC), gene transcription (sulforaphane), and redox recycling (R-ALA) — three layers of antioxidant defense.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['genomic', 'mito', 'proteostasis', 'inflammation'],
    synergyCompoundIds: ['glynac', 'sulforaphane', 'rala'],
    outline: [
      'Rationale: substrate + signal + recycle',
      'Mechanistic synergy map',
      'Evidence per compound + combination logic',
      'AM choreography & spacing',
      'Biomarker targets (GSH, oxLDL)',
      'Contraindications',
    ],
    mdxSlug: 'glynac-nrf2-triad',
  },
  {
    slug: 'nmn-resveratrol-sirt1',
    category: 'synergies',
    title: 'SIRT1 Activation Pair',
    tagline: 'NMN + Trans-Resveratrol',
    summary:
      'NAD+ provides the fuel; resveratrol activates the enzyme. Combined SIRT1 signaling drives mitochondrial biogenesis, epigenetic stability, and senescence resistance.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'epigenetic', 'senescence', 'nutrient'],
    synergyCompoundIds: ['nmn', 'resveratrol'],
    outline: [
      'Rationale: cofactor + activator',
      'SIRT1 mechanism deep-dive',
      'Trial data & PK considerations',
      'AM NMN / PM resveratrol timing',
      'Monitoring: NAD+ index',
      'When to skip resveratrol',
    ],
    mdxSlug: 'nmn-resveratrol-sirt1',
  },
  {
    slug: 'nad-mito-stack',
    category: 'synergies',
    title: 'NAD+ Mitochondrial Stack',
    tagline: 'NMN + Ca-AKG + Resveratrol',
    summary:
      'Triple-axis mitochondrial support: NAD+ restoration (NMN), TCA cycle & epigenetic cofactor (Ca-AKG), and sirtuin-driven biogenesis (resveratrol). Highest hallmark coverage combo.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['mito', 'epigenetic', 'stem', 'genomic'],
    synergyCompoundIds: ['nmn', 'cakg', 'resveratrol'],
    outline: [
      'Rationale: energy + epigenetics + biogenesis',
      'Hallmark coverage matrix',
      'Evidence per leg',
      'Full-day dosing schedule',
      'Biomarker panel (NAD+, AKG)',
      'Cost & simplicity tiers',
    ],
    mdxSlug: 'nad-mito-stack',
  },

  // ── Lifestyle ──────────────────────────────────────────────────────────────
  {
    slug: 'exercise',
    category: 'lifestyle',
    title: 'Exercise',
    tagline: 'The intervention no compound can replace',
    summary:
      'Zone 2 aerobic base, resistance training, and VO2max work — mapped to mitochondrial biogenesis, senescence clearance, telomere maintenance, and nutrient sensing.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['mito', 'senescence', 'telomeres', 'nutrient', 'inflammation', 'stem'],
    outline: [
      'Hallmark impact matrix (primary/secondary)',
      'Decision tree — sedentary vs trained vs deload',
      'Zone 2 vs HIIT vs resistance pyramid',
      'Weekly protocol template',
      'Lab tie-ins (hs-CRP, NAD+ index)',
      'Wearable signals (Zone 2, RHR, HRV)',
      'Stack prerequisite gate',
      'Personal tracking template',
    ],
    mdxSlug: 'exercise',
  },
  {
    slug: 'sleep',
    category: 'lifestyle',
    title: 'Sleep',
    tagline: 'When repair happens — glymphatic, DNA, hormonal',
    summary:
      '7–9 hours with adequate slow-wave and REM sleep drives DNA repair, glymphatic clearance, growth hormone release, and cortisol normalization. Non-negotiable longevity pillar.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['genomic', 'proteostasis', 'inflammation', 'telomeres', 'communication'],
    outline: [
      'Hallmark impact matrix (primary/secondary)',
      'Decision tree — debt vs OSA vs stack timing',
      'Sleep architecture & repair windows',
      'Protocol: timing, light, temperature',
      'Lab tie-ins (hs-CRP, 8-OHdG)',
      'Wearable metrics (deep sleep, wake SD)',
      'Stack prerequisite gate',
      'Personal tracking template',
    ],
    mdxSlug: 'sleep',
  },
  {
    slug: 'nutrition',
    category: 'lifestyle',
    title: 'Nutrition',
    tagline: 'Methyl donors, protein thresholds, and nutrient sensing',
    summary:
      'Protein adequacy for glycine/NAC synthesis, methyl donor support (B12, folate, choline), time-restricted eating, and low-glycemic patterns that modulate mTOR/AMPK.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['nutrient', 'epigenetic', 'dysbiosis', 'inflammation', 'autophagy'],
    outline: [
      'Hallmark impact matrix (primary/secondary)',
      'Decision tree — TRE readiness vs methyl donors',
      'Macro framework (protein, fiber, polyphenols)',
      'Methyl donor checklist',
      'Lab tie-ins (hs-CRP, AKG)',
      'Wearable proxies (fiber, eating window)',
      'Stack prerequisite gate',
      'Personal tracking template',
    ],
    mdxSlug: 'nutrition',
  },
  {
    slug: 'stress',
    category: 'lifestyle',
    title: 'Stress & Recovery',
    tagline: 'Cortisol, HPA axis, and inflammaging acceleration',
    summary:
      'Chronic stress accelerates telomere attrition, elevates hs-CRP, impairs sleep architecture, and diverts resources from repair to survival signaling.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['telomeres', 'inflammation', 'communication', 'genomic', 'senescence'],
    outline: [
      'Hallmark impact matrix (primary/secondary)',
      'Decision tree — acute stress vs HRV collapse',
      'HPA axis & cortisol curve',
      'HRV training & breathwork protocols',
      'Lab tie-ins (hs-CRP, GSH)',
      'Wearable signals (HRV, stress score)',
      'Stack prerequisite gate',
      'Personal tracking template',
    ],
    mdxSlug: 'stress',
  },

  // ── Guides ──────────────────────────────────────────────────────────────
  {
    slug: 'testing-and-monitoring',
    category: 'guides',
    title: 'Testing & Monitoring Guide',
    tagline: 'What to test, when, and how to interpret',
    summary:
      'Comprehensive lab panel roadmap tied to TNiC biomarkers, hallmark risks, retest cadence, trend interpretation, and stack-adjustment triggers.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['genomic', 'mito', 'inflammation', 'epigenetic', 'proteostasis'],
    outline: [
      'Tier 1 baseline panel',
      'Tier 2 advanced panel',
      'Retest cadence & decision tree',
      'Interpretation playbook & compare block',
      'Stack-adjustment triggers + compare links',
      'Lab day checklist & CSV upload',
      'Hallmark → biomarker reference',
    ],
    mdxSlug: 'testing-and-monitoring',
  },
];

export function getModuleBySlug(category: LibraryModuleCategory, slug: string): LibraryModule | undefined {
  return libraryModules.find((m) => m.category === category && m.slug === slug);
}

export function getModulesByCategory(category: LibraryModuleCategory): LibraryModule[] {
  return libraryModules.filter((m) => m.category === category);
}

export function getAllModuleParams(): { slug: LibraryModuleCategory; moduleSlug: string }[] {
  return libraryModules.map((m) => ({ slug: m.category, moduleSlug: m.slug }));
}

export function getModulePath(module: LibraryModule): string {
  return `/library/${module.category}/${module.slug}`;
}

/**
 * Single source of truth for compound counts. Anything user-facing that names a
 * number of compounds MUST derive it from here so the count can never drift out
 * of sync with the actual library again. `content-integrity` locks the expected
 * total, so a dropped compound fails the build rather than silently vanishing.
 */
export const compoundModules: LibraryModule[] = libraryModules.filter(
  (m) => m.category === 'compounds',
);
export const COMPOUND_COUNT = compoundModules.length;