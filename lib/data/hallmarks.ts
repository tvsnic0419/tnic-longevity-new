/* Split out of the former monolithic lib/data.ts. Keeping these datasets in
   focused modules stops a client component that needs one export from pulling
   the entire content library into its bundle. */

import { Activity, Zap, Heart, Brain, Dna, FlaskConical, Shield, Radio, Layers, Network, Timer, Scale } from 'lucide-react';
import type { Hallmark, PathwayNode, RoadmapItem } from '../types';

export const protocolSchedule = [
  { time: '6:00 AM', period: 'AM' as const, action: 'Wake + Morning Light', compounds: [], rationale: 'Circadian entrainment — sets NAD+ and cortisol rhythm' },
  { time: '6:30 AM', period: 'AM' as const, action: 'NRF2 Activation Stack', compounds: ['glynac', 'sulforaphane'], rationale: 'Empty stomach maximizes isothiocyanate absorption' },
  { time: '7:00 AM', period: 'AM' as const, action: 'Mitochondrial Stack', compounds: ['nmn', 'cakg'], rationale: 'NAD+ precursor timed with morning metabolic peak' },
  { time: '7:30 AM', period: 'AM' as const, action: 'Breakfast + Fat-Soluble Stack', compounds: ['rala', 'coq10', 'omega3', 'urolithina'], rationale: 'CoQ10, omega-3, and urolithin A require fat co-ingestion for absorption; R-ALA recycles CoQ10 in situ' },
  { time: '8:00 AM', period: 'AM' as const, action: 'Berberine Dose 1 (of 3)', compounds: ['berberine'], rationale: 'TID dosing maintains stable plasma berberine; first dose with or just after breakfast for AMPK activation at peak glucose window' },
  { time: '12:30 PM', period: 'AM' as const, action: 'Berberine Dose 2 + Lunch', compounds: ['berberine'], rationale: 'Midday dose sustains AMPK signaling through afternoon; take with lunch to match glucose exposure and avoid GI discomfort' },
  { time: '6:00 PM', period: 'PM' as const, action: 'Berberine Dose 3 + Dinner', compounds: ['berberine'], rationale: 'Evening dose covers post-dinner glucose and lipid window; complete berberine TID cycle for full 24-hour AMPK coverage' },
  { time: '8:00 PM', period: 'PM' as const, action: 'Sirtuin Activation', compounds: ['resveratrol'], rationale: 'Evening dosing aligns with SIRT1 circadian peak; avoid high-fat co-ingestion which blunts bioavailability' },
  { time: '9:30 PM', period: 'PM' as const, action: 'Screens Off + Wind Down', compounds: [], rationale: 'RHR reduction protocol for optimal sleep architecture' },
  { time: 'Weekly', period: 'Weekly' as const, action: 'Biomarker Self-Assessment', compounds: [], rationale: 'Track subjective energy, recovery, and inflammation markers' },
  { time: '2×/Month', period: 'Weekly' as const, action: 'Fisetin Senolytic Pulse (2 days)', compounds: ['fisetin'], rationale: 'Mayo Clinic protocol: 20 mg/kg × 2 consecutive days per month — pulse dosing maximizes senescent cell clearance vs daily low-dose which shows attenuated effect' },
];

export const hallmarks: Hallmark[] = [
  { id: 'genomic', title: 'Genomic Instability', desc: 'Accumulated DNA damage overwhelms repair machinery', coverage: 85, icon: Dna, intervention: 'NMN replenishes NAD+ consumed by PARP during strand repair. Sulforaphane activates NQO1 and phase-II detox enzymes that shield DNA from oxidative adducts (PMID 38772511).' },
  { id: 'telomeres', title: 'Telomere Attrition', desc: 'Progressive shortening limits cellular replication', coverage: 45, icon: Timer, intervention: 'Chronic cortisol accelerates shortening — HRV and breathwork training show measurable telomerase activity increases. NMN/NAD+ supports sirtuin-mediated telomere maintenance as adjunct.' },
  { id: 'epigenetic', title: 'Epigenetic Alterations', desc: 'Drift in methylation & histone marks alters gene expression', coverage: 78, icon: Layers, intervention: 'Ca-AKG fuels TET dioxygenase demethylation — 12-month RCT reduced epigenetic age ~8 years (PMID 34847066). NMN restores NAD+ for SIRT1/SIRT3 histone deacetylation.' },
  { id: 'proteostasis', title: 'Loss of Proteostasis', desc: 'Protein misfolding & aggregation impair function', coverage: 82, icon: FlaskConical, intervention: 'GlyNAC restores glutathione — the primary chaperone defense against oxidative protein misfolding (PMID 35975308). R-ALA recycles redox cofactors that drive proteasome efficiency.' },
  { id: 'autophagy', title: 'Disabled Autophagy', desc: 'Cellular cleanup machinery slows with age', coverage: 70, icon: Scale, intervention: 'NMN activates SIRT1-mediated autophagy initiation. Spermidine (polyamine) directly triggers autophagic flux — memory RCT confirms benefit in older adults (PMID 29563638). Sulforaphane NRF2 supports autophagosome clearance.' },
  { id: 'mito', title: 'Mitochondrial Dysfunction', desc: 'Energy production fails, ROS generation surges', coverage: 95, icon: Zap, intervention: 'Full mito stack: NMN elevates NAD+ for Complex I electron transport; Ca-AKG fuels TCA cycle and extends lifespan in mice (PMID 32877690); Resveratrol activates PGC-1α biogenesis; R-ALA recycles CoQ10.' },
  { id: 'senescence', title: 'Cellular Senescence', desc: 'Zombie cells secrete SASP inflammatory factors', coverage: 75, icon: Heart, intervention: 'Quercetin + Dasatinib cleared senescent cells in human adipose tissue (PMID 31542391). NMN reduces SASP via NAD+-dependent PARP and SIRT1. Fisetin reduced p16/p21 markers in Mayo Clinic pilot (PMID 30279143).' },
  { id: 'stem', title: 'Stem Cell Exhaustion', desc: 'Regenerative pools deplete across tissues', coverage: 68, icon: Brain, intervention: 'Ca-AKG supports stem cell niche via epigenetic reprogramming and mTOR modulation. NAD+ restoration via NMN maintains hematopoietic stem cell function and reduces age-related drift in lineage output.' },
  { id: 'communication', title: 'Altered Intercellular Communication', desc: 'Signaling networks become dysregulated', coverage: 55, icon: Network, intervention: 'SASP cytokine signaling is the primary driver — reducing senescent cell burden (senolytics) lowers IL-6, IL-8, and TNF-α. NRF2 stack blocks NF-κB, the master switch for pro-inflammatory intercellular signaling.' },
  { id: 'inflammation', title: 'Chronic Inflammation', desc: 'Inflammaging drives systemic tissue damage', coverage: 88, icon: Activity, intervention: 'Sulforaphane and GlyNAC form the core NRF2 anti-inflammatory stack — restoring glutathione and blocking NF-κB. Resveratrol activates SIRT1-FOXO3a axis that directly suppresses inflammatory gene transcription (PMID 22055504).' },
  { id: 'dysbiosis', title: 'Dysbiosis', desc: 'Gut microbiome imbalance affects systemic aging', coverage: 40, icon: Radio, intervention: "Sulforaphane's NRF2 activation supports gut-barrier and detox capacity; direct human microbiome-reshaping evidence is still preclinical. Taurine also modulates gut barrier integrity and bile acid composition." },
  { id: 'nutrient', title: 'Disabled Macroautophagy', desc: 'Nutrient sensing pathways (mTOR/AMPK) dysregulate', coverage: 72, icon: Shield, intervention: 'Resveratrol activates AMPK to inhibit mTORC1 and restore autophagic signaling. Berberine activates AMPK with metformin-comparable potency (PMID 18396172). NMN supports SIRT1-mTOR axis balance via NAD+.' },
];

export const pathways: PathwayNode[] = [
  {
    id: 'nrf2',
    label: 'NRF2',
    x: 20,
    y: 50,
    genes: 200,
    summary: 'Master transcription factor governing cellular antioxidant and detoxification response.',
    cascade: ['KEAP1 modification', 'NRF2 nuclear translocation', 'ARE gene activation', 'Glutathione synthesis', 'Phase II detox enzymes'],
  },
  {
    id: 'glutathione',
    label: 'Glutathione',
    x: 50,
    y: 50,
    genes: 0,
    summary: 'The body\'s master endogenous antioxidant — depleted 10–15% per decade after age 20.',
    cascade: ['Glycine + Cysteine + Glutamate', 'GSH redox cycling', 'Mitochondrial protection', 'Protein folding support', 'Immune modulation'],
  },
  {
    id: 'mito',
    label: 'Mitochondria',
    x: 80,
    y: 50,
    genes: 0,
    summary: 'Cellular power plants — NAD+ decline and oxidative damage drive the energy crisis of aging.',
    cascade: ['NAD+ pool restoration', 'TCA cycle optimization', 'Mitochondrial biogenesis', 'Mitophagy activation', 'ATP output recovery'],
  },
];

export const roadmap: RoadmapItem[] = [
  {
    phase: 'LIVE',
    title: 'Defense Stack Architect',
    desc: 'Synergy-scored compound protocols with AM/PM dosing intelligence.',
    specs: ['14 evidence-graded compounds', 'Synergy matrix', 'Hallmark coverage mapping', 'Evidence tier grading'],
    active: true,
  },
  {
    phase: 'Q3 2026',
    title: 'Biomarker Intelligence Dashboard',
    desc: 'Track glutathione, NAD+, hs-CRP, and epigenetic clock markers with trend analysis and protocol auto-adjustment nudges.',
    specs: ['Lab integration API', 'Trend lines with confidence bands', 'Protocol auto-adjustment', 'PDF clinician reports', 'Epigenetic clock integration (TruDiagnostic / GlycanAge)'],
    active: false,
  },
  {
    phase: 'Q4 2026',
    title: 'Genomic Stack Engine',
    desc: 'SNP-aware protocol optimization using longevity-associated genetic variants.',
    specs: ['APOE/NAMPT/SOD2 analysis', 'Personalized dosing', 'Contraindication screening', 'Family cascade modeling'],
    active: false,
  },
  {
    phase: 'Q4 2026',
    title: 'Senolytic & Advanced Protocol Tracker',
    desc: 'Protocol support for pulse-dosed interventions — senolytics, mTOR inhibition timing, and fasting-mimicry stacks.',
    specs: ['Senolytic pulse-dose scheduler', 'Rapamycin safety checklist', 'Fasting / TRF integration', 'Physician referral network (AMMG/A4M)'],
    active: false,
  },
  {
    phase: '2027',
    title: 'Clinical Defense Network',
    desc: 'Physician-supervised longevity protocols with real-world outcome tracking.',
    specs: ['500+ clinic partners', 'IRB-tracked outcomes', 'Insurance pathway advocacy', 'Peer-reviewed publications'],
    active: false,
  },
];
