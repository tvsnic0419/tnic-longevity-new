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
    tagline: 'A potent OPC antioxidant with real human RCTs behind its blood-pressure and vascular support',
    summary:
      'Grape Seed Extract standardized to ≥95% OPC (oligomeric proanthocyanidins) is one of the better-studied polyphenol antioxidants. A 2016 meta-analysis (16 RCTs, n=810) found a significant reduction in systolic blood pressure, and diastolic BP and heart-rate benefits replicate in later analyses. Effects track with dose and OPC standardization, so the form genuinely matters — a strong educational pick when you are building an antioxidant and vascular-support layer.',
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

  // ── Expansion batch (Aug 2026): well-evidenced, high-demand compounds ──
  {
    slug: 'cocoa-flavanols',
    category: 'compounds',
    title: 'Cocoa Flavanols',
    tagline: 'Among the best-studied nutrients for the aging vascular system — NO, blood pressure, and a cardiovascular-death signal in COSMOS',
    summary:
      'Cocoa flavanols (chiefly epicatechin) raise nitric-oxide availability, improve flow-mediated dilation, and lower blood pressure across dozens of RCTs. In COSMOS (~21,000 adults) the flavanol arm showed reduced cardiovascular death in the pre-specified secondary analysis — real, large-scale human signal from a food-derived compound.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'inflammation', 'mito'],
    outline: [
      'What cocoa flavanols do (and why it matters)',
      'Mechanism — eNOS, NO, and vascular inflammation',
      'Evidence — COSMOS and the vascular-function trials',
      'Dosing & standardization',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'cocoa-flavanols',
  },
  {
    slug: 'bergamot',
    category: 'compounds',
    title: 'Citrus Bergamot',
    tagline: 'A polyphenol lipid lever with real RCTs lowering LDL and triglycerides — statin-like pathway, no prescription',
    summary:
      'Citrus bergamot concentrates flavonoids that behave like natural HMG-CoA reductase modulators and activate AMPK. Human RCTs report LDL and triglyceride reductions of 15–30% at 500–1,000 mg/day, with additive effects on a statin — a strong, well-tolerated metabolic and cardiovascular option.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['nutrient', 'inflammation', 'communication'],
    outline: [
      'What citrus bergamot does (and why it matters)',
      'Mechanism — HMG-CoA, AMPK, LDL oxidation',
      'Evidence — the lipid RCTs',
      'Dosing & standardization',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'bergamot',
  },
  {
    slug: 'l-theanine',
    category: 'compounds',
    title: 'L-Theanine',
    tagline: 'Calm, focused alertness without sedation — the most replicable acute nootropic, and it tames caffeine jitter',
    summary:
      'The amino acid in green tea that produces alert-but-relaxed focus. Human EEG studies show increased alpha-wave activity and reduced stress; paired with caffeine it sharpens attention while smoothing the jitter. Fast-acting and exceptionally safe.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'inflammation'],
    outline: [
      'What L-theanine does (and why it matters)',
      'Mechanism — alpha waves, GABA/glutamate, stress response',
      'Evidence — attention and the caffeine pairing',
      'Dosing',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'l-theanine',
  },
  {
    slug: 'collagen-peptides',
    category: 'compounds',
    title: 'Collagen Peptides',
    tagline: 'One of the best-evidenced supplements for skin elasticity, joint comfort, and bone — building blocks that also signal repair',
    summary:
      'Hydrolyzed collagen delivers bioactive di- and tri-peptides that reach skin, joints, and bone and instruct fibroblasts and chondrocytes to build new matrix. RCTs show improved skin elasticity and hydration, reduced joint pain, and bone-density support over 12 weeks to 12 months.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'inflammation'],
    outline: [
      'What collagen peptides do (and why it matters)',
      'Mechanism — bioactive peptides as repair signals',
      'Evidence — skin, joint, and bone RCTs',
      'Dosing & vitamin-C cofactor',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'collagen-peptides',
  },
  {
    slug: 'beetroot-nitrate',
    category: 'compounds',
    title: "Beetroot / Dietary Nitrate",
    tagline: 'A direct, food-based nitric-oxide boost — lower blood pressure and more efficient muscles, backed by consistent RCTs',
    summary:
      'Dietary nitrate converts to nitric oxide through a route independent of the age-impaired eNOS enzyme — a back-up NO supply that matters more with age. Meta-analyses show ~4–5 mmHg systolic BP reductions, and sports-science RCTs show improved exercise economy and endurance.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'mito'],
    outline: [
      'What dietary nitrate does (and why it matters)',
      'Mechanism — the nitrate→nitrite→NO pathway',
      'Evidence — blood pressure and exercise economy',
      'Dosing & the mouthwash caveat',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'beetroot-nitrate',
  },
  {
    slug: 'lions-mane',
    category: 'compounds',
    title: "Lion's Mane",
    tagline: 'A mushroom that stimulates nerve growth factor — a compelling, low-risk cognition and mood play',
    summary:
      "Lion's mane hericenones and erinacines stimulate NGF and BDNF, the signals that keep neurons healthy and connected. A double-blind RCT in mild cognitive impairment (Mori 2009) found improved cognition during use; the mechanism is strong and the human evidence is still emerging.",
    evidenceTier: 'C',
    relatedHallmarkIds: ['communication', 'inflammation'],
    outline: [
      "What lion's mane does (and why it matters)",
      'Mechanism — NGF/BDNF and neuroplasticity',
      'Evidence — the MCI trial and mood signals',
      'Dosing & standardization',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'lions-mane',
  },
  {
    slug: 'citicoline',
    category: 'compounds',
    title: 'Citicoline (CDP-Choline)',
    tagline: 'Highly bioavailable choline for attention and memory — feeds both acetylcholine and neuronal membrane repair',
    summary:
      'Citicoline supplies the raw material for acetylcholine (attention, memory) and phosphatidylcholine (neuronal membranes). Randomized trials in healthy adults show improved attention and memory at 250–500 mg/day, with a large evidence base in age-related cognitive decline.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication'],
    outline: [
      'What citicoline does (and why it matters)',
      'Mechanism — acetylcholine and membrane synthesis',
      'Evidence — attention and memory RCTs',
      'Dosing',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'citicoline',
  },
  {
    slug: 'nattokinase',
    category: 'compounds',
    title: 'Nattokinase',
    tagline: 'A fibrinolytic enzyme from natto with human RCTs for blood pressure, clot breakdown, and arterial health',
    summary:
      'Nattokinase, the enzyme from fermented soy (natto), directly degrades fibrin and supports healthy clotting balance and blood flow. Human RCTs show meaningful systolic blood-pressure reduction and improved fibrinolytic markers, with emerging data on arterial plaque and blood viscosity.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'inflammation'],
    outline: [
      'What nattokinase does (and why it matters)',
      'Mechanism — fibrinolysis and blood-flow support',
      'Evidence — blood pressure and fibrinolytic RCTs',
      'Dosing (fibrinolytic units)',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'nattokinase',
  },
  {
    slug: 'mitoq',
    category: 'compounds',
    title: 'MitoQ (Mitoquinol)',
    tagline: "CoQ10 re-engineered to reach inside mitochondria — a landmark RCT restored older adults' vascular function",
    summary:
      'A lipophilic cation concentrates ubiquinol several-hundred-fold inside mitochondria, quenching oxidative stress at its source. A double-blind RCT (Rossman 2018) found six weeks of MitoQ improved flow-mediated dilation ~42% in older adults — effectively rejuvenating endothelial function.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'communication'],
    outline: [
      'What MitoQ does (and why it matters)',
      'Mechanism — mitochondria-targeted delivery',
      'Evidence — the vascular-aging RCT',
      'Dosing',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'mitoq',
  },
  {
    slug: 'aged-garlic',
    category: 'compounds',
    title: 'Aged Garlic Extract',
    tagline: 'One of the best-evidenced cardiovascular supplements — lowers blood pressure and slows coronary plaque in imaging trials',
    summary:
      'Aging converts harsh allicin into stable, bioavailable S-allylcysteine, delivering reliable cardiovascular benefit without the burn. Meta-analyses show meaningful blood-pressure reduction, and Budoff\'s imaging RCTs show slowed coronary plaque progression over 12 months.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'inflammation', 'nutrient'],
    outline: [
      'What aged garlic extract does (and why it matters)',
      'Mechanism — H2S/NO, LDL oxidation, platelets',
      'Evidence — blood pressure and coronary plaque',
      'Dosing',
      'Monitoring',
      'Safety & red flags',
      'Synergies & stack integration',
    ],
    mdxSlug: 'aged-garlic',
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
    "tagline": "Fixing a real vitamin-D deficiency is one of the highest-yield, best-evidenced moves in the stack",
    "summary": "Vitamin D3 (cholecalciferol) is a nuclear-hormone precursor acting on hundreds of genes across bone, immune, and muscle biology. Deficiency is common and correcting it is Tier-A, high-value — and the large VITAL and D-Health trials point to lower autoimmune-disease incidence and a signal for reduced cancer mortality. The strongest play is repletion to a healthy 25-OH-D level, tested and dialed in, rather than mega-dosing someone already replete.",
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

  // ── Expansion batch (Aug 2026 — round 2): 65 → 100 compound library ──
  // Photo-informed priority tier (nine compounds from the Irwin Naturals
  // liquid soft-gel label the founder shared) plus a longevity-relevance
  // backlog of B-vitamin actives, mushroom polysaccharides, adaptogens,
  // and connective-tissue support. Every entry corresponds to an MDX
  // deep-dive with real PMIDs and honest evidence tiers.
  {
    slug: 'alpha-gpc',
    category: 'compounds',
    title: 'Alpha-GPC (L-Alpha-Glycerylphosphorylcholine)',
    tagline: 'The choline form that reaches the brain — cholinergic support with real cognitive-decline RCTs',
    summary:
      'Bioavailable choline delivery that crosses the blood–brain barrier and raises synaptic acetylcholine. Tier B for cognitive support in MCI/AD (De Jesus Moreno 2003, ASCOMALVA 2014); acute focus / reaction time in adults; and an acute GH pulse used peri-workout.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'stem'],
    compoundId: 'alpha-gpc',
    outline: [
      'What alpha-GPC does (and why it matters)',
      'Mechanism — why alpha-GPC beats other choline forms',
      'Evidence summary (De Jesus Moreno, ASCOMALVA)',
      'Dosing protocol',
      'Monitoring',
      'Safety and the 2021 stroke-risk signal',
      'Synergies and antagonists',
    ],
    mdxSlug: 'alpha-gpc',
  },
  {
    slug: 'phosphatidylserine',
    category: 'compounds',
    title: 'Phosphatidylserine (PS)',
    tagline: 'Neuronal membrane phospholipid — cognitive support and the reproducible post-exercise cortisol lever',
    summary:
      'Membrane phospholipid essential to synaptic signaling. Crook 1991 age-associated memory RCT and Starks 2008 exercise-cortisol crossover are the two most-replicated signals; modern soy/sunflower PS has thinner evidence than the withdrawn bovine PS behind the classic dementia trials.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'proteostasis', 'inflammation'],
    compoundId: 'phosphatidylserine',
    outline: [
      'What phosphatidylserine does (and why it matters)',
      'Mechanism — membrane phospholipid vs stress hormone',
      'Evidence summary (Crook, Starks, Hellhammer)',
      'Dosing protocol',
      'Monitoring',
      'Safety and red flags',
      'Synergies and antagonists',
    ],
    mdxSlug: 'phosphatidylserine',
  },
  {
    slug: 'ginkgo-biloba',
    category: 'compounds',
    title: 'Ginkgo Biloba (EGb 761)',
    tagline: 'Vascular cognition — real effect in established dementia, negative for prevention (GEM trial)',
    summary:
      'Standardized EGb 761 (24% flavone glycosides, 6% terpene lactones) reduces cognitive decline in mild-moderate AD/vascular dementia (Le Bars 1997; Ihl 2011 meta) but the GEM trial was decisively negative for preventing dementia in healthy elderly. Discontinue 2 weeks before surgery due to PAF-antagonist bleeding effect.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'mito', 'inflammation'],
    compoundId: 'ginkgo-biloba',
    outline: [
      'What ginkgo does (and why it matters)',
      'Mechanism — PAF antagonism, cerebral perfusion',
      'Evidence — treatment vs prevention (Le Bars, GEM, Amieva)',
      'Dosing protocol',
      'Monitoring',
      'Safety and bleeding-risk stacking',
      'Synergies and antagonists',
    ],
    mdxSlug: 'ginkgo-biloba',
  },
  {
    slug: 'panax-ginseng',
    category: 'compounds',
    title: 'Panax Ginseng (Korean / Asian Ginseng)',
    tagline: 'Adaptogen with real fatigue-reduction and glycemic RCTs — cycle to prevent tachyphylaxis',
    summary:
      'Ginsenoside-rich root extract that dampens HPA axis output, improves insulin sensitivity, and supports mild cognitive vigilance. Barton 2013 cancer-related fatigue RCT and Vuksan 2000 T2D postprandial-glucose crossover anchor the evidence. Cycle 6 weeks on / 2 off to avoid ginseng abuse syndrome.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'inflammation', 'nutrient'],
    compoundId: 'panax-ginseng',
    outline: [
      'What panax ginseng does (and why it matters)',
      'Mechanism — HPA, glycemic, endothelial',
      'Evidence (Barton, Vuksan, Reay)',
      'Dosing and cycling',
      'Monitoring',
      'Safety and hormone-sensitive-cancer caution',
      'Synergies and antagonists',
    ],
    mdxSlug: 'panax-ginseng',
  },
  {
    slug: 'mucuna-pruriens',
    category: 'compounds',
    title: 'Mucuna Pruriens (Velvet Bean, L-DOPA)',
    tagline: 'Natural L-DOPA — dopaminergic support that should be treated as a real drug, not just an herb',
    summary:
      "Seed cotyledons contain 3.6-6% pharmaceutical-identical L-DOPA. Katzenschlager 2004 Parkinson's crossover showed comparable efficacy to synthetic levodopa with less dyskinesia. Every L-DOPA precaution applies — MAOIs, antipsychotics, and psychosis are hard contraindications. Not a casual wellness supplement.",
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'stem'],
    compoundId: 'mucuna-pruriens',
    requiresDisclaimer: true,
    outline: [
      'What mucuna pruriens does (and why it matters)',
      'Mechanism — L-DOPA to dopamine',
      "Evidence (Katzenschlager PD crossover, Shukla fertility)",
      'Dosing by L-DOPA content, not mucuna mg',
      'Monitoring',
      'Safety — treat as levodopa',
      'Synergies and antagonists',
    ],
    mdxSlug: 'mucuna-pruriens',
  },
  {
    slug: 'theobromine',
    category: 'compounds',
    title: 'Theobromine',
    tagline: "Cocoa's cardiovascular fraction — vasodilator, cough suppressant, and 7-hour half-life",
    summary:
      "The primary methylxanthine in cocoa (~10× more than caffeine by mass). Less CNS-stimulating than caffeine, more peripherally vasodilatory, and Usmani 2005 established antitussive efficacy against codeine. Isolated theobromine is Tier C; the larger cocoa-flavanol RCT evidence (COSMOS) captures theobromine's contribution as part of the matrix.",
    evidenceTier: 'C',
    relatedHallmarkIds: ['communication', 'inflammation'],
    compoundId: 'theobromine',
    outline: [
      'What theobromine does (and why it matters)',
      'Mechanism — adenosine antagonism, PDE inhibition',
      'Evidence — Usmani cough, Baba endothelial, Neufingerl lipids',
      'Dosing (dietary vs supplemental)',
      'Monitoring',
      'Safety and pet toxicity',
      'Synergies and antagonists',
    ],
    mdxSlug: 'theobromine',
  },
  {
    slug: 'capsaicin',
    category: 'compounds',
    title: 'Capsaicin (Cayenne / Chili)',
    tagline: 'TRPV1 agonist with a 14% mortality signal in China Kadoorie and topical Tier A for neuropathic pain',
    summary:
      'Chili-derived alkaloid that activates TRPV1 in brown adipose tissue, gut, and sensory neurons. Lv 2015 (487,375 adults) and Chopan 2017 (NHANES III) both showed ~13-14% all-cause mortality reduction with frequent spicy-food consumption. Topical capsaicin is Cochrane-Tier-A for neuropathic pain. Whole-chili beats capsules for the mortality-signal use case.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['nutrient', 'inflammation', 'mito'],
    compoundId: 'capsaicin',
    outline: [
      'What capsaicin does (and why it matters)',
      'Mechanism — TRPV1, thermogenesis, satiety',
      'Evidence — Lv 2015, Chopan 2017, topical Cochrane',
      'Dosing — dietary vs supplement vs topical',
      'Monitoring',
      'Safety and GI contraindications',
      'Synergies and antagonists',
    ],
    mdxSlug: 'capsaicin',
  },
  {
    slug: 'pumpkin-seed-oil',
    category: 'compounds',
    title: 'Pumpkin Seed Oil',
    tagline: 'Weak 5α-reductase modulator with the GRANU BPH trial and a real male-AGA hair-count signal',
    summary:
      'Lignan- and phytosterol-rich cold-pressed oil from Cucurbita pepo. Vahlensieck 2015 GRANU study (476 BPH men, 12 months) and Cho 2014 androgenic-alopecia RCT (76 men, 24 weeks) are the anchor human trials. Much weaker than finasteride but very well tolerated; also works for overactive bladder (Nishimura 2014).',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'inflammation'],
    compoundId: 'pumpkin-seed-oil',
    outline: [
      'What pumpkin seed oil does (and why it matters)',
      'Mechanism — 5α-reductase, prostatic inflammation, bladder tone',
      'Evidence — GRANU BPH, Cho AGA, Nishimura OAB',
      'Dosing protocol',
      'Monitoring',
      'Safety and red flags',
      'Synergies and antagonists',
    ],
    mdxSlug: 'pumpkin-seed-oil',
  },
  {
    slug: 'superoxide-dismutase',
    category: 'compounds',
    title: 'Superoxide Dismutase (SOD, Oral GliSODin)',
    tagline: 'Melon-derived SOD with gliadin coating — an Nrf2 signaling dose, not an enzyme-replacement supplement',
    summary:
      "Cucumis melo SOD extract complexed with wheat gliadin for GI protection. The mechanism is indirect Nrf2/ARE induction (not exogenous SOD replacement — the enzyme is largely digested). Muth 2004 and Egoumenides 2014 support oxidative-marker improvements, but studies are small and industry-funded. Better documented alternative: sulforaphane.",
    evidenceTier: 'C',
    relatedHallmarkIds: ['mito', 'inflammation', 'genomic'],
    compoundId: 'superoxide-dismutase',
    outline: [
      'What SOD supplementation does (and why the direct-replacement story is wrong)',
      'Mechanism — Nrf2 induction via gut lymphoid uptake',
      'Evidence (Muth, Skarpańska rowers, Egoumenides)',
      'Dosing',
      'Monitoring',
      'Safety — wheat gliadin caution',
      'Synergies and antagonists',
    ],
    mdxSlug: 'superoxide-dismutase',
  },
  {
    slug: 'piperine',
    category: 'compounds',
    title: 'Piperine (BioPerine)',
    tagline: 'Black-pepper bioenhancer — 20× curcumin absorption, and a real drug-interaction concern',
    summary:
      'Piper nigrum alkaloid that inhibits intestinal UGT and P-glycoprotein, dramatically increasing systemic exposure to curcumin, resveratrol, EGCG, and CoQ10 (Shoba 1998). Direct-effect Tier C. The bioenhancement is Tier A mechanism — but the same mechanism affects many prescription drugs. Not a standalone.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['nutrient', 'inflammation'],
    compoundId: 'piperine',
    outline: [
      'What piperine does (and why it matters)',
      'Mechanism — UGT / P-gp inhibition',
      'Evidence (Shoba, Kesarwani; drug-interaction warnings)',
      'Dosing — never as a standalone',
      'Monitoring — Rx interaction watch',
      'Safety and interaction inventory',
      'Synergies and antagonists',
    ],
    mdxSlug: 'piperine',
  },
  {
    slug: 'mct-oil',
    category: 'compounds',
    title: 'MCT Oil (Medium-Chain Triglycerides / C8:C10)',
    tagline: 'Portal-vein absorbed fats → ketones → the Cunnane MCI cognitive brain-fuel intervention',
    summary:
      'Medium-chain triglycerides bypass chylomicron packaging and go straight to the liver, where rapid β-oxidation produces ketones as an alternative brain fuel. Cunnane 2020 MCI trial showed improved episodic memory / processing speed via increased brain ketone uptake on PET. C8-only formulations produce ~3× the ketone response of coconut oil per gram.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'nutrient', 'communication'],
    compoundId: 'mct-oil',
    outline: [
      'What MCT oil does (and why brain glucose decline matters)',
      'Mechanism — portal absorption, hepatic β-oxidation, ketogenesis',
      'Evidence (Cunnane MCI, Vandenberghe dose-response, Henderson AC-1202)',
      'Dosing — titration for GI tolerance',
      'Monitoring',
      'Safety and diabetic contraindications',
      'Synergies and antagonists',
    ],
    mdxSlug: 'mct-oil',
  },
  {
    slug: 'bacopa-monnieri',
    category: 'compounds',
    title: 'Bacopa Monnieri (Brahmi)',
    tagline: 'Ayurvedic nootropic — real memory consolidation at 8-12 weeks, no acute effect',
    summary:
      'Bacoside-standardized extract with genuinely delayed cognitive benefit — Stough 2001, Morgan 2010 meta, and Peth-Nui 2012 all show verbal-recall and working-memory gains at 300 mg/day over 12 weeks. Users expecting caffeine-like acute lift are disappointed; the effect builds slowly.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'proteostasis', 'inflammation'],
    compoundId: 'bacopa-monnieri',
    outline: [
      'What bacopa does (and why it matters)',
      'Mechanism — cholinergic + serotonergic, dendritic branching',
      'Evidence (Stough, Morgan meta, Peth-Nui, Kongkeaw)',
      'Dosing — commit to 12+ weeks',
      'Monitoring',
      'Safety and thyroid interaction',
      'Synergies and antagonists',
    ],
    mdxSlug: 'bacopa-monnieri',
  },
  {
    slug: 'cordyceps',
    category: 'compounds',
    title: 'Cordyceps (Cordyceps militaris / sinensis)',
    tagline: 'Medicinal mushroom with a plausible mitochondrial mechanism and one honest older-adult VO₂max RCT',
    summary:
      'Cordycepin- and β-glucan-rich fungal extract with real preclinical mitochondrial-biogenesis story via AMPK/PGC-1α. Chen 2010 showed 10.5% VO₂max threshold improvement in older adults at 12 weeks — but broader human evidence is small and short. Cultivated C. militaris fruiting body preferred over wild C. sinensis (adulteration).',
    evidenceTier: 'C',
    relatedHallmarkIds: ['mito', 'inflammation', 'communication'],
    compoundId: 'cordyceps',
    outline: [
      'What cordyceps does (and why it matters)',
      'Mechanism — cordycepin, AMPK, β-glucan',
      'Evidence (Chen 2010, Hirsch, Nagata)',
      'Dosing — verify cordycepin ≥0.3%',
      'Monitoring',
      'Safety and immunomodulator cautions',
      'Synergies and antagonists',
    ],
    mdxSlug: 'cordyceps',
  },
  {
    slug: 'reishi',
    category: 'compounds',
    title: 'Reishi (Ganoderma lucidum)',
    tagline: '"Spirit mushroom" of TCM — genuine immune mechanism, modest human evidence',
    summary:
      'Dual-extract Ganoderma lucidum captures both β-glucans (immune signaling) and triterpenoids (weak HMG-CoA reductase / statin-like). Cochrane review of cancer-adjunct RCTs was modest; direct sleep and cardiovascular evidence is small. Real drug-interaction risks with anticoagulants and immunosuppressants.',
    evidenceTier: 'C',
    relatedHallmarkIds: ['communication', 'inflammation', 'nutrient'],
    compoundId: 'reishi',
    outline: [
      'What reishi does (and why it matters)',
      'Mechanism — β-glucan Dectin-1, triterpenoid HMG-CoA',
      'Evidence (Jin Cochrane, Chu, Klupp meta)',
      'Dosing — dual-extract standardization',
      'Monitoring',
      'Safety — anticoagulant and immunosuppressant caution',
      'Synergies and antagonists',
    ],
    mdxSlug: 'reishi',
  },
  {
    slug: 'turkey-tail',
    category: 'compounds',
    title: 'Turkey Tail (Trametes versicolor, PSK / PSP)',
    tagline: 'The best-evidenced medicinal mushroom — PSK is an approved oncology adjunct in Japan and China',
    summary:
      'Trametes versicolor polysaccharide extracts PSK (Krestin) and PSP have real meta-analytic survival benefit in gastric and colorectal cancer when added to chemotherapy (Oba 2007, Sakamoto 2006). Wellness/general-immune supplementation extrapolates from a strong cancer-adjunct evidence base to a weaker general one.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'senescence', 'inflammation'],
    compoundId: 'turkey-tail',
    outline: [
      'What turkey tail does (and why it matters)',
      'Mechanism — Dectin-1, NK cells, dendritic maturation',
      'Evidence (Oba, Sakamoto, Torkelson, Chay)',
      'Dosing — dual-extract with verified β-glucan',
      'Monitoring',
      'Safety and immunosuppressant caution',
      'Synergies and antagonists',
    ],
    mdxSlug: 'turkey-tail',
  },
  {
    slug: 'astragalus',
    category: 'compounds',
    title: 'Astragalus (Astragalus membranaceus)',
    tagline: 'The cycloastragenol / TA-65 telomere story — real, modest, and expensive',
    summary:
      'TCM immune tonic whose astragaloside IV / cycloastragenol fraction is the direct compound behind TA-65. Salvador 2016 CMV-positive adult trial showed preserved (not lengthened) mean telomere length over 12 months. Cancer-adjunct chemotherapy-tolerability evidence is Chinese-literature-heavy.',
    evidenceTier: 'C',
    relatedHallmarkIds: ['telomeres', 'communication', 'inflammation'],
    compoundId: 'astragalus',
    outline: [
      'What astragalus does (and why the TA-65 story matters)',
      'Mechanism — telomerase, β-glucan immune modulation',
      'Evidence (Salvador TA-65, Bernardes preclinical, Xu chemo meta, Piao CKD)',
      'Dosing — root extract vs cycloastragenol',
      'Monitoring',
      'Safety — immunosuppressant caution',
      'Synergies and antagonists',
    ],
    mdxSlug: 'astragalus',
  },
  {
    slug: 'milk-thistle',
    category: 'compounds',
    title: 'Milk Thistle (Silymarin / Silybin)',
    tagline: 'Flavonolignan hepatoprotection — real NAFLD and diabetic-glycemic RCT evidence',
    summary:
      'Silybum marianum seed extract standardized to 70-80% silymarin, dominated by silybin. Loguercio 2012 NAFLD RCT (138 patients, 12 months) and Huseini 2006 T2D RCT are the anchor human trials. Silybin phytosome (Siliphos, Legalon) has ~10× the bioavailability of plain silymarin extract.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'proteostasis', 'nutrient'],
    compoundId: 'milk-thistle',
    outline: [
      'What milk thistle does (and why hepatic health matters for aging)',
      'Mechanism — hepatocyte membrane, GSH preservation, anti-fibrotic',
      'Evidence (Loguercio NAFLD, Huseini T2D, Ferenci cirrhosis)',
      'Dosing — phytosome vs plain extract',
      'Monitoring',
      'Safety and warfarin interaction',
      'Synergies and antagonists',
    ],
    mdxSlug: 'milk-thistle',
  },
  {
    slug: 'msm',
    category: 'compounds',
    title: 'MSM (Methylsulfonylmethane)',
    tagline: 'Bioavailable sulfur for connective tissue and GSH substrate — modest knee-OA RCT signal',
    summary:
      'Dimethyl sulfone (oxidized DMSO) that supplies bioavailable sulfur for collagen crosslinks, glutathione synthesis, and phase-II sulfotransferases. Kim 2006 and Debbi 2011 both showed ~20-25% WOMAC pain reduction in knee OA. Skin/hair and post-exercise recovery evidence is Tier C.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'proteostasis', 'genomic'],
    compoundId: 'msm',
    outline: [
      'What MSM does (and why sulfur matters)',
      'Mechanism — sulfur donation, GSH substrate',
      'Evidence (Kim, Debbi, Brien meta, Muizzuddin skin)',
      'Dosing protocol',
      'Monitoring',
      'Safety',
      'Synergies and antagonists',
    ],
    mdxSlug: 'msm',
  },
  {
    slug: 'chondroitin',
    category: 'compounds',
    title: 'Chondroitin Sulfate',
    tagline: 'Cartilage glycosaminoglycan — MOVES showed non-inferiority to celecoxib for knee OA',
    summary:
      'Sulfated GAG structural component of cartilage. Fransen 2015 LEGS trial and Hochberg 2016 MOVES trial anchor the evidence: chondroitin + glucosamine slowed joint-space narrowing over 2 years (LEGS) and matched celecoxib for severe knee OA pain (MOVES). Pharmaceutical-grade CS (Bioiberica, Chondrosulf) is what has the evidence — cheap products vary in purity.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'proteostasis', 'communication'],
    compoundId: 'chondroitin',
    outline: [
      'What chondroitin does (and why it matters)',
      'Mechanism — cartilage substrate, anti-catabolic',
      'Evidence (LEGS, MOVES, Reginster, Wandel meta)',
      'Dosing — pharma-grade CS matters',
      'Monitoring',
      'Safety',
      'Synergies and antagonists',
    ],
    mdxSlug: 'chondroitin',
  },
  {
    slug: 'uc-ii',
    category: 'compounds',
    title: 'UC-II (Undenatured Type II Collagen)',
    tagline: 'Native chicken-sternum collagen at 40 mg/day — oral tolerance, not substrate; beats G+C in head-to-head RCTs',
    summary:
      'Undenatured type II collagen dosed intentionally low (40 mg/day) to induce gut-lymphoid oral tolerance to joint-derived TII antigens — a fundamentally different mechanism from hydrolyzed collagen peptides. Crowley 2009 and Lugo 2016 both showed UC-II outperformed glucosamine + chondroitin for knee OA symptom reduction. Product quality is critical — denatured "type II collagen" has no evidence of the same effect.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'communication', 'proteostasis'],
    compoundId: 'uc-ii',
    outline: [
      'What UC-II does (and how it differs from collagen peptides)',
      'Mechanism — oral tolerance via Peyer\'s patches',
      'Evidence (Crowley head-to-head, Lugo 6-month, Trentham RA)',
      'Dosing — 40 mg on empty stomach',
      'Monitoring',
      'Safety and poultry-allergy caution',
      'Synergies and antagonists',
    ],
    mdxSlug: 'uc-ii',
  },
  {
    slug: 'bromelain',
    category: 'compounds',
    title: 'Bromelain',
    tagline: 'Pineapple proteolytic enzyme — sports medicine and sinusitis workhorse, real anticoagulant potentiation',
    summary:
      'Ananas comosus stem thiol protease with genuine Tier B evidence in acute soft-tissue injury (Kerkhoffs ankle sprain), sinusitis (Guo 2018 meta), and modest OA pain (Braun). Better human PK than serrapeptase — enteric formulations reliably deliver systemic activity. Watch anticoagulant + NSAID stacking.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'communication'],
    compoundId: 'bromelain',
    outline: [
      'What bromelain does (and why it matters)',
      'Mechanism — fibrinolysis, bradykinin, prostaglandin modulation',
      'Evidence (Kerkhoffs, Guo meta, Braun OA)',
      'Dosing — GDU/g potency matters',
      'Monitoring',
      'Safety — bleeding-risk stacking',
      'Synergies and antagonists',
    ],
    mdxSlug: 'bromelain',
  },
  {
    slug: 'methylfolate',
    category: 'compounds',
    title: 'Methylfolate (L-5-MTHF / L-Methylfolate)',
    tagline: 'The MTHFR bypass — bioactive folate for methylation-dependent variants',
    summary:
      'L-5-methyltetrahydrofolate bypasses the MTHFR enzyme bottleneck that 677C>T carriers hit with plain folic acid. Papakostas 2012 established 15 mg/day L-MTHF augmentation for SSRI-inadequate depression; Willems 2004 showed superior homocysteine lowering in variant carriers. Always pair with B12 — folate masks B12 deficiency.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['epigenetic', 'communication', 'genomic'],
    compoundId: 'methylfolate',
    outline: [
      'What methylfolate does (and why MTHFR variants matter)',
      'Mechanism — methionine cycle, SAM production',
      'Evidence (Papakostas depression, Willems Hcy, MRC NTD)',
      'Dosing — Deplin vs OTC',
      'Monitoring — always check B12 first',
      'Safety — overmethylation phenotype',
      'Synergies and antagonists',
    ],
    mdxSlug: 'methylfolate',
  },
  {
    slug: 'methylcobalamin',
    category: 'compounds',
    title: 'Methylcobalamin (Active B12)',
    tagline: 'Direct-active B12 for age-related atrophic gastritis and methylation stacks',
    summary:
      'Directly-active B12 form used by methionine synthase without cellular reduction of cyanocobalamin. B12 deficiency prevalence is 15-20% in adults over 60 due to atrophic gastritis, PPI use, and metformin. Kuzminski 1998 established high-dose oral equivalence to IM; Yamashiki established methylcobalamin for diabetic peripheral neuropathy.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['epigenetic', 'communication', 'proteostasis'],
    compoundId: 'methylcobalamin',
    outline: [
      'What methylcobalamin does (and why age-related deficiency matters)',
      'Mechanism — methionine synthase, myelin, mitochondrial fatty-acid oxidation',
      'Evidence (Kuzminski oral vs IM, Yamashiki DPN, Sun meta)',
      'Dosing — sublingual for absorption bypass',
      'Monitoring — MMA is more sensitive than serum B12',
      'Safety — nitrous oxide and metformin interactions',
      'Synergies and antagonists',
    ],
    mdxSlug: 'methylcobalamin',
  },
  {
    slug: 'p5p',
    category: 'compounds',
    title: 'P5P (Pyridoxal-5-Phosphate, Active B6)',
    tagline: 'The direct-active B6 coenzyme — bypass hepatic conversion, cofactor for 150+ enzymes',
    summary:
      'Pyridoxal-5-phosphate is the enzymatically-active B6 form, cofactor for homocysteine transsulfuration, neurotransmitter synthesis (GABA, dopamine, serotonin), and heme biosynthesis. HOPE-2 and VITATOPS lowered Hcy but not CV events — Hcy is a marker, not the driver. Cap chronic use at 100 mg/day; pyridoxine >200 mg is neurotoxic.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['epigenetic', 'communication'],
    compoundId: 'p5p',
    outline: [
      'What P5P does (and why the active form matters)',
      'Mechanism — 150+ B6-dependent enzymes',
      'Evidence (HOPE-2, VITATOPS, Merete NHANES, Vazquez DPN meta)',
      'Dosing — cap at 100 mg/day chronic',
      'Monitoring — plasma PLP for deficiency',
      'Safety and neuropathy risk',
      'Synergies and antagonists',
    ],
    mdxSlug: 'p5p',
  },
  {
    slug: 'benfotiamine',
    category: 'compounds',
    title: 'Benfotiamine (Fat-Soluble B1)',
    tagline: 'Transketolase activator that blocks all four AGE-formation pathways in hyperglycemia',
    summary:
      'Fat-soluble thiamine derivative with ~5× the bioavailability of thiamine HCl. Restores transketolase activity, which blocks glucose flux into the polyol, hexosamine, PKC, and AGE pathways that drive diabetic complications. Stracke 2001 and BENDIP established diabetic peripheral neuropathy benefit; Stirban 2006 showed prevention of postprandial endothelial dysfunction.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['proteostasis', 'inflammation', 'nutrient'],
    compoundId: 'benfotiamine',
    outline: [
      'What benfotiamine does (and why AGE matters for aging)',
      'Mechanism — transketolase, four AGE pathways',
      'Evidence (Stracke, Haupt, Stirban, BENDIP; Alkhalaf nephropathy negative)',
      'Dosing protocol',
      'Monitoring',
      'Safety',
      'Synergies and antagonists',
    ],
    mdxSlug: 'benfotiamine',
  },
  {
    slug: 'niacin',
    category: 'compounds',
    title: 'Niacin (Nicotinic Acid, Vitamin B3)',
    tagline: 'The lipid-modifying B3 form — dramatically raises HDL and lowers Lp(a), but AIM-HIGH/HPS2-THRIVE were negative',
    summary:
      'Nicotinic acid (flushing form of B3) modifies lipids potently: HDL +15-35%, LDL -5-25%, Lp(a) -20-30%. Coronary Drug Project 1975 showed ↓ MI recurrence and, at 15-year follow-up, ↓ all-cause mortality. But AIM-HIGH 2011 and HPS2-THRIVE 2014 both showed no benefit and added harm when combined with statins — a Tier A NEGATIVE for that use case. Also an NAD+ precursor at much lower cost than NMN.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'genomic', 'nutrient'],
    compoundId: 'niacin',
    requiresDisclaimer: true,
    outline: [
      'What niacin does (and why it is nuanced)',
      'Mechanism — GPR109A, lipid modulation, NAD+ precursor',
      'Evidence — CDP, AIM-HIGH, HPS2-THRIVE',
      'Dosing — IR vs Niaspan, aspirin pre-treatment',
      'Monitoring — LFTs, glucose, uric acid',
      'Safety — hepatotoxicity, glucose intolerance',
      'Synergies and antagonists',
    ],
    mdxSlug: 'niacin',
  },
  {
    slug: 'vitamin-c',
    category: 'compounds',
    title: 'Vitamin C (Ascorbic Acid)',
    tagline: 'Essential cofactor for collagen and neurotransmitter synthesis; PHS-II negative for CV prevention',
    summary:
      'Essential water-soluble antioxidant; humans lack GULO gene. Padayatty 2004 established oral saturation at 200 mg BID — higher oral doses just get excreted. PHS-II and WACS were Tier A NEGATIVE for cardiovascular prevention in supplementation. Iron absorption enhancement, collagen support, and neurotransmitter cofactor roles are the real use cases.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['proteostasis', 'inflammation', 'communication'],
    compoundId: 'vitamin-c',
    outline: [
      'What vitamin C does (and why the megadose narrative is wrong)',
      'Mechanism — collagen hydroxylation, catecholamines, vitamin E recycling',
      'Evidence (Padayatty PK, PHS-II, WACS, Cochrane cold)',
      'Dosing — 500-1,000 mg divided BID is the sweet spot',
      'Monitoring',
      'Safety — kidney stones, hemochromatosis',
      'Synergies and antagonists',
    ],
    mdxSlug: 'vitamin-c',
  },
  {
    slug: 'mixed-tocopherols',
    category: 'compounds',
    title: 'Mixed Tocopherols (Full-Spectrum Vitamin E)',
    tagline: 'Preserve γ-tocopherol — SELECT and Miller meta made isolated α-tocopherol a bad bet',
    summary:
      "Vitamin E is 8 molecules, not just α-tocopherol. SELECT (17% ↑ prostate cancer) and Miller 2005 (↑ mortality at ≥400 IU α) turned the field against isolated α-tocopherol supplementation. Mixed tocopherols with γ preserved is the better-evidenced form; Loguercio's NAFLD trial combined vitamin E with silymarin.",
    evidenceTier: 'C',
    relatedHallmarkIds: ['inflammation', 'mito', 'proteostasis'],
    compoundId: 'mixed-tocopherols',
    outline: [
      'What mixed tocopherols do (and why isolated α is a mistake)',
      'Mechanism — membrane antioxidant, γ-tocopherol RNS scavenging',
      'Evidence — SELECT, HOPE, Miller meta (all negative for α); Loguercio NAFLD',
      'Dosing — mixed with ≥100 mg γ',
      'Monitoring',
      'Safety — bleeding, vitamin K antagonism, prostate cancer signal',
      'Synergies and antagonists',
    ],
    mdxSlug: 'mixed-tocopherols',
  },
  {
    slug: 'iodine',
    category: 'compounds',
    title: 'Iodine',
    tagline: 'Essential thyroid substrate — deficiency is quietly returning as iodized salt use falls',
    summary:
      'Essential for T3/T4 synthesis. NHANES data shows median urinary iodine in US women of childbearing age has fallen from 320 to ~120 μg/L over three decades — approaching WHO adequacy floor. Non-iodized artisanal salt + low dairy + reduced iodized bread is the modern deficiency trifecta. RDA 150 μg; excess (>1,100 μg) triggers Wolff-Chaikoff.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['communication', 'nutrient'],
    compoundId: 'iodine',
    outline: [
      'What iodine does (and why deficiency is returning)',
      'Mechanism — thyroid hormone synthesis, BMR, brain development',
      'Evidence (Zimmermann children, Bath pregnancy, Ghent fibrocystic)',
      'Dosing — RDA range; avoid megadose',
      'Monitoring — urinary iodine, TSH, TPO antibodies',
      'Safety — Wolff-Chaikoff, Hashimoto flare',
      'Synergies and antagonists',
    ],
    mdxSlug: 'iodine',
  },
  {
    slug: 'hmb',
    category: 'compounds',
    title: 'HMB (β-Hydroxy β-Methylbutyrate)',
    tagline: 'The strongest RCT evidence for preventing muscle loss during bed rest, hospitalization, and sarcopenia',
    summary:
      "Leucine metabolite (~5% of dietary leucine → HMB) that inhibits ubiquitin-proteasome muscle protein degradation and stabilizes sarcolemmal membranes during catabolic states. Deutz 2013 (PMID 23809521) is the landmark: HMB fully preserved lean mass in older adults during 10-day bed rest vs 2.05 kg loss on placebo. Wu 2015 meta of 7 RCTs confirms sarcopenia benefit. Not for young trained athletes; the signal is preventing loss, not building excess.",
    evidenceTier: 'B',
    relatedHallmarkIds: ['stem', 'proteostasis', 'inflammation'],
    compoundId: 'hmb',
    outline: [
      'What HMB does (and why the age-related use case matters)',
      'Mechanism — anti-catabolic vs anabolic',
      'Evidence (Deutz bed rest, Wu meta, Bear ICU, Kim sarcopenia)',
      'Dosing — 3 g/day divided',
      'Monitoring — grip strength, lean mass',
      'Safety',
      'Synergies and antagonists',
    ],
    mdxSlug: 'hmb',
  },
  {
    slug: 'trigonelline',
    category: 'compounds',
    title: 'Trigonelline (Frontier NAD+ Precursor)',
    tagline: 'The 2024 NAD+ story — elevated in centenarians, restores muscle mitochondrial function in aged models',
    summary:
      "Nestlé Research / EPFL's 2024 identification that plasma trigonelline is elevated in Sardinian centenarians vs age-matched controls, and that supplementation restores NAD+ pools + mitochondrial respiration in aged muscle (Membrez/Auwerx, Nature Metabolism, PMID 38286830). Bypasses the age-declining NAMPT bottleneck via a parallel Preiss-Handler-adjacent NAD+ synthesis route. Tier B frontier — compound to watch.",
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'nutrient', 'genomic', 'proteostasis'],
    compoundId: 'trigonelline',
    outline: [
      'What trigonelline does (and why the centenarian data matters)',
      'Mechanism — parallel NAD+ pathway via NAPRT',
      'Evidence (Membrez / Auwerx 2024, Sardinia cohort)',
      'Dosing — emerging protocol',
      'Monitoring — whole-blood NAD+, grip strength',
      'Safety — frontier data caveats',
      'Synergies and antagonists',
    ],
    mdxSlug: 'trigonelline',
  },
  {
    slug: 'krill-oil',
    category: 'compounds',
    title: 'Krill Oil (Phospholipid Omega-3)',
    tagline: 'Phospholipid-bound EPA/DHA plus astaxanthin — higher bioavailability per mg than fish oil',
    summary:
      "Antarctic krill (Euphausia superba) oil delivers omega-3s in phospholipid form (mostly PC) with ~50% higher bioavailability per mg than fish-oil triglycerides (Ulven 2011). Bunea 2004 showed impressive lipid improvements; Deutsch 2007 knee arthritis pain reduction at 300 mg/day. More expensive than fish oil; sustainability concerns favor MSC-certified sources.",
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'communication', 'nutrient'],
    compoundId: 'krill-oil',
    outline: [
      'What krill oil does (and when it beats fish oil)',
      'Mechanism — phospholipid absorption, astaxanthin',
      'Evidence (Ulven, Bunea, Deutsch)',
      'Dosing (1-3 g/day)',
      'Monitoring — omega-3 index',
      'Safety and shellfish allergy',
      'Synergies and antagonists',
    ],
    mdxSlug: 'krill-oil',
  },
  {
    slug: 'pea',
    category: 'compounds',
    title: 'PEA (Palmitoylethanolamide)',
    tagline: 'Endogenous PPAR-α agonist — "endocannabinoid without CB1" with real meta-analytic pain evidence',
    summary:
      'Naturally-occurring fatty acid amide that activates PPAR-α, stabilizes mast cells, and potentiates endogenous anandamide via FAAH inhibition. Paladini 2016 meta of 12 RCTs (1,484 patients) showed ~2-point pain reduction on a 10-point scale across chronic pain conditions; consistently effective in diabetic peripheral neuropathy. Non-psychoactive alternative or adjunct to CBD. Ultra-micronized (um-PEA) formulations matter for bioavailability.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'communication', 'proteostasis'],
    compoundId: 'pea',
    outline: [
      'What PEA does (and why the endocannabinoid-adjacent mechanism matters)',
      'Mechanism — PPAR-α, mast cell stabilization, FAAH inhibition',
      'Evidence (Paladini meta, Gugliandolo DPN review, Beggiato AD/PD)',
      'Dosing — ultra-micronized 300–1,200 mg/day',
      'Monitoring — pain VAS, function',
      'Safety — well tolerated, non-psychoactive',
      'Synergies and antagonists',
    ],
    mdxSlug: 'pea',
  },
  {
    slug: 'l-arginine',
    category: 'compounds',
    title: 'L-Arginine',
    tagline: 'eNOS substrate for endothelial NO — but VINTAGE-MI is a hard post-MI contraindication',
    summary:
      'Semi-essential amino acid, the sole substrate for endothelial NO synthase. Real evidence for erectile dysfunction, endothelial function, and modest BP reduction. VINTAGE-MI (Schulman 2006) stopped early due to ↑ mortality in post-MI arm — do not use post-MI. Citrulline (see `l-citrulline`) often preferred: better raises plasma arginine per dose with less GI upset.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['communication', 'inflammation'],
    compoundId: 'l-arginine',
    outline: [
      'What arginine does (and the VINTAGE-MI caveat)',
      'Mechanism — eNOS, NO, cGMP',
      'Evidence (Chen ED, Bode-Böger endothelium, VINTAGE-MI harm)',
      'Dosing — often prefer citrulline',
      'Monitoring',
      'Safety — HSV, post-MI, PDE5 interactions',
      'Synergies and antagonists',
    ],
    mdxSlug: 'l-arginine',
  },
  {
    slug: 'acetyl-l-carnitine',
    category: 'compounds',
    title: 'Acetyl-L-Carnitine (ALCAR)',
    tagline: 'Brain-penetrant carnitine — Tier B for DPN, MCI, and depression with a large evidence base',
    summary:
      'Acetylated carnitine crosses the blood-brain barrier and delivers both mitochondrial fatty-acid transport and acetyl for ACh synthesis. Sima 2005 large (1,257 patient) DPN trial, Montgomery 2003 meta of 21 MCI/AD RCTs, and Wang 2014 meta of depression RCTs all support Tier B use. TMAO / gut microbiome long-term effects debated. Alerting — avoid PM dosing.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['mito', 'communication', 'inflammation'],
    compoundId: 'acetyl-l-carnitine',
    outline: [
      'What ALCAR does (and the acetyl advantage)',
      'Mechanism — mitochondrial fatty-acid oxidation, cholinergic',
      'Evidence (Sima DPN, Montgomery meta, Wang depression meta)',
      'Dosing — divided AM/midday',
      'Monitoring — TSH, TMAO consideration',
      'Safety — bipolar mania, thyroid, TMAO',
      'Synergies and antagonists',
    ],
    mdxSlug: 'acetyl-l-carnitine',
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