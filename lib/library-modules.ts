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
    tagline: 'Elite antioxidant — OPC multi-pathway cardiovascular + oxidative defense',
    summary:
      'Grape Seed Extract standardized to ≥95% OPC (oligomeric proanthocyanidins) — 20–50× stronger antioxidant than vitamin C. Meta-analysis: SBP −6 mmHg, LDL oxidation −13%, endothelial FMD improved. Four independent mechanisms: ROS scavenging, Nrf2 activation, eNOS/NO upregulation, NF-κB suppression.',
    evidenceTier: 'B',
    relatedHallmarkIds: ['inflammation', 'genomic', 'mito', 'communication'],
    compoundId: 'grapeseed',
    relatedSynergySlugs: ['glynac-nrf2-triad'],
    outline: [
      'Overview & OPC standardization — why 95% matters',
      'Four mechanisms: ROS scavenging, Nrf2, eNOS/NO, NF-κB',
      'Evidence summary (meta-analysis 16 RCTs, n=810)',
      'Dosing protocol & form selection',
      'Monitoring: BP, hs-CRP, 8-OHdG',
      'Buyer guide — verifying 95% OPC quality',
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
    slug: 'urolithina',
    category: 'compounds',
    title: 'Urolithin A (Mitopure)',
    tagline: 'Mitophagy activator — Phase 2 muscle trial, Tier A',
    summary:
      'Gut-derived metabolite from ellagitannin polyphenols that activates mitophagy — the selective clearance of damaged mitochondria. Phase 2 RCT (2022, Cell Reports Medicine) confirmed improved muscle strength and reduced fatigue in adults ≥65 at 1000 mg/day. Only commercially available mitophagy-specific compound with human trial data.',
    evidenceTier: 'A',
    relatedHallmarkIds: ['mito', 'autophagy', 'senescence'],
    compoundId: 'urolithina',
    outline: [
      'Overview & mitophagy mechanism',
      'Phase 2 RCT: muscle strength + fatigue outcomes',
      'Mitopure vs pomegranate extract — why standardization matters',
      'Dosing: 500 vs 1000 mg, AM with food',
      'Monitoring: muscle function, hs-CRP',
      'Safety & contraindications',
      'Personal results template',
    ],
    mdxSlug: 'urolithina',
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