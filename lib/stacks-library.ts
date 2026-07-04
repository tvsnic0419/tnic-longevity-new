import type { CostTier, EvidenceTier, SimplicityTier, StackGoal } from './types';
import type { PresetKey } from './presets';

export interface StackDoseItem {
  compoundId: string;
  dose: string;
  notes?: string;
}

export interface StackDosingBlock {
  period: 'AM' | 'PM' | 'Weekly';
  time?: string;
  items: StackDoseItem[];
  rationale: string;
}

export interface StackBreakdown {
  compoundId: string;
  role: string;
  mechanism: string;
}

export interface RxCompound {
  id: string;
  name: string;
  class: string;
  typicalDose: string;
  evidence: EvidenceTier;
  note: string;
}

export interface EliteStack {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  goal: StackGoal;
  compoundIds: string[];
  rxCompounds?: RxCompound[];
  costTier: CostTier;
  costMonthlyUsd: { low: number; high: number };
  simplicity: SimplicityTier;
  simplicityScore: number;
  synergyRating: number;
  evidenceTier: EvidenceTier;
  evidenceSummary: string;
  hallmarkCoverage: string[];
  dosingSchedule: StackDosingBlock[];
  monitoring: string[];
  biomarkers: string[];
  studies: { title: string; journal: string; year: number; pmid: string }[];
  rationale: string;
  breakdown: StackBreakdown[];
  warnings: string[];
  presetKey?: PresetKey;
  featured: boolean;
  durationWeeks: string;
}

export const rxCompoundCatalog: RxCompound[] = [
  {
    id: 'rapamycin',
    name: 'Rapamycin (Sirolimus)',
    class: 'mTOR inhibitor',
    typicalDose: '3–6mg weekly (pulse dosing)',
    evidence: 'B',
    note: 'Prescription-only. Used off-label in longevity medicine. Requires physician supervision, CBC, metabolic panel, and lipid monitoring.',
  },
  {
    id: 'metformin',
    name: 'Metformin',
    class: 'AMPK activator / biguanide',
    typicalDose: '500–1000mg daily',
    evidence: 'A',
    note: 'Prescription-only. TAME trial candidate. May interact with NMN/NAD+ pathways — discuss with physician.',
  },
];

export const goalLabels: Record<StackGoal, string> = {
  nrf2: 'NRF2 / Antioxidant',
  mito: 'Mitochondrial',
  hybrid: 'Dual-Pathway',
  sirt1: 'SIRT1 / NAD+',
  autophagy: 'Autophagy / mTOR',
  longevity: 'Full Longevity',
};

export const costLabels: Record<CostTier, string> = {
  budget: 'Budget',
  moderate: 'Moderate',
  premium: 'Premium',
  clinical: 'Clinical / Rx',
};

export const simplicityLabels: Record<SimplicityTier, string> = {
  minimal: 'Minimal (2–3)',
  moderate: 'Moderate (3–4)',
  advanced: 'Advanced (5+)',
  clinical: 'Clinical Supervision',
};

export const eliteStacks: EliteStack[] = [
  {
    id: 'glynac-foundation',
    slug: 'glynac-foundation',
    name: 'GlyNAC Foundation',
    tagline: 'Tier-A glutathione restoration — the clinical benchmark stack',
    goal: 'nrf2',
    compoundIds: ['glynac', 'sulforaphane'],
    costTier: 'budget',
    costMonthlyUsd: { low: 60, high: 100 },
    simplicity: 'minimal',
    simplicityScore: 2,
    synergyRating: 72,
    evidenceTier: 'A',
    evidenceSummary:
      'Built on two Tier-A compounds with direct human trial data. GlyNAC trials (24 weeks) showed restored glutathione, reduced oxidative stress, and improved mitochondrial function in older adults.',
    hallmarkCoverage: ['mito', 'proteostasis', 'inflammation', 'genomic'],
    dosingSchedule: [
      {
        period: 'AM',
        time: '6:30 AM',
        items: [
          { compoundId: 'glynac', dose: '600mg glycine + 600mg NAC', notes: 'Empty stomach' },
          { compoundId: 'sulforaphane', dose: '10–35mg glucoraphanin', notes: 'With light fat source' },
        ],
        rationale: 'Morning NRF2 activation on empty stomach maximizes isothiocyanate absorption and GSH synthesis kickstart.',
      },
    ],
    monitoring: [
      'Subjective energy and recovery at weeks 2, 4, 12',
      'Optional: plasma glutathione or GSH:GSSG ratio at baseline and 24 weeks',
      'Blood pressure check if on antihypertensives (GlyNAC may lower BP)',
      'hs-CRP at 12–24 weeks to track inflammaging reduction',
    ],
    biomarkers: ['gsh', 'hscrp', '8ohdg'],
    studies: [
      { title: 'GlyNAC supplementation improves glutathione deficiency in aging humans', journal: 'J Gerontol A', year: 2021, pmid: '34129059' },
      { title: 'Improvement of mitochondrial function in older adults after GlyNAC', journal: 'J Gerontol A', year: 2023, pmid: '36656670' },
      { title: 'Sulforaphane activates Nrf2 and protects against oxidative stress', journal: 'Oncogene', year: 2008, pmid: '18454171' },
    ],
    rationale:
      'GlyNAC addresses the root cause of age-related glutathione depletion (10–15% per decade) by supplying both limiting substrates. Sulforaphane activates NRF2 to upregulate 200+ cytoprotective genes, creating a feed-forward antioxidant defense loop. This is the most evidence-dense entry stack in the TNiC library.',
    breakdown: [
      { compoundId: 'glynac', role: 'GSH substrate restoration', mechanism: 'Glycine + NAC → glutathione synthesis → mitochondrial & proteostasis protection' },
      { compoundId: 'sulforaphane', role: 'NRF2 master switch', mechanism: 'KEAP1 modification → NRF2 nuclear translocation → phase II detox enzyme upregulation' },
    ],
    warnings: [
      'Start GlyNAC alone for 1 week before adding sulforaphane if GI-sensitive',
      'NAC sulfur odor is normal and harmless',
      'Avoid during active chemotherapy without oncologist approval',
    ],
    featured: true,
    durationWeeks: '24+ weeks for clinical benchmark (GlyNAC trial duration)',
  },
  {
    id: 'nrf2-defense',
    slug: 'nrf2-defense',
    name: 'NRF2 Defense Elite',
    tagline: 'Full antioxidant triad — glutathione, NRF2, and redox cycling',
    goal: 'nrf2',
    compoundIds: ['glynac', 'sulforaphane', 'rala'],
    costTier: 'moderate',
    costMonthlyUsd: { low: 90, high: 150 },
    simplicity: 'moderate',
    simplicityScore: 3,
    synergyRating: 88,
    evidenceTier: 'A',
    evidenceSummary:
      'Extends GlyNAC Foundation with R-ALA for redox cycling. Three mechanistically complementary NRF2-pathway compounds with strong human data on the core pair.',
    hallmarkCoverage: ['mito', 'proteostasis', 'inflammation', 'genomic'],
    dosingSchedule: [
      {
        period: 'AM',
        time: '6:30 AM',
        items: [
          { compoundId: 'glynac', dose: '600mg glycine + 600mg NAC' },
          { compoundId: 'sulforaphane', dose: '10–35mg glucoraphanin' },
        ],
        rationale: 'Core NRF2 + glutathione activation on empty stomach.',
      },
      {
        period: 'AM',
        time: '7:30 AM',
        items: [{ compoundId: 'rala', dose: '300–600mg R-ALA', notes: 'With breakfast containing fat' }],
        rationale: 'R-ALA absorption improves with dietary fat; regenerates vitamins C/E and oxidized glutathione.',
      },
    ],
    monitoring: [
      'Fasting glucose if diabetic (R-ALA may lower blood sugar)',
      'Glutathione panel at 12 and 24 weeks',
      'Oxidized LDL trend at 12 weeks',
      'Thyroid function if on thyroid medication — separate R-ALA dosing by 4 hours',
    ],
    biomarkers: ['gsh', 'hscrp', 'oxldl', '8ohdg'],
    studies: [
      { title: 'GlyNAC supplementation improves glutathione deficiency in aging humans', journal: 'J Gerontol A', year: 2021, pmid: '34129059' },
      { title: 'Lipoic acid as a means of metabolic therapy', journal: 'Neurochem Res', year: 2007, pmid: '17909917' },
    ],
    rationale:
      'The complete NRF2 defense stack targets oxidative stress from three angles: substrate restoration (GlyNAC), transcriptional upregulation (sulforaphane), and redox recycling (R-ALA). This is the highest-synergy antioxidant protocol in the TNiC catalog.',
    breakdown: [
      { compoundId: 'glynac', role: 'GSH triad restoration', mechanism: 'Direct precursor supply for endogenous antioxidant synthesis' },
      { compoundId: 'sulforaphane', role: 'Genomic antioxidant switch', mechanism: 'NRF2 → ARE → GST, NQO1, HO-1 upregulation' },
      { compoundId: 'rala', role: 'Redox recycler', mechanism: 'Regenerates GSH, vitamins C/E; supports pyruvate dehydrogenase' },
    ],
    warnings: [
      'Use R-form ALA only — racemic ALA is ~50% biologically inert',
      'Monitor glucose if on diabetes medications',
      'Add R-ALA in week 2 after tolerating GlyNAC + sulforaphane',
    ],
    presetKey: 'nrf2',
    featured: true,
    durationWeeks: '12–24 weeks minimum',
  },
  {
    id: 'sirt1-activation',
    slug: 'sirt1-activation',
    name: 'SIRT1 Activation Stack',
    tagline: 'NAD+ restoration meets sirtuin activation — the caloric restriction mimetic pair',
    goal: 'sirt1',
    compoundIds: ['nmn', 'resveratrol'],
    costTier: 'moderate',
    costMonthlyUsd: { low: 70, high: 145 },
    simplicity: 'minimal',
    simplicityScore: 2,
    synergyRating: 85,
    evidenceTier: 'A',
    evidenceSummary:
      'NMN has human RCT data for NAD+ elevation. Resveratrol activates SIRT1 but requires NAD+ as cofactor — this pairing is mechanistically essential, not optional.',
    hallmarkCoverage: ['mito', 'genomic', 'epigenetic', 'senescence', 'inflammation', 'nutrient'],
    dosingSchedule: [
      {
        period: 'AM',
        time: '7:00 AM',
        items: [{ compoundId: 'nmn', dose: '250–500mg NMN', notes: 'Empty stomach or light meal' }],
        rationale: 'Morning NAD+ precursor aligns with circadian NAD+ rhythm and metabolic peak.',
      },
      {
        period: 'PM',
        time: '8:00 PM',
        items: [{ compoundId: 'resveratrol', dose: '150–500mg trans-resveratrol', notes: 'With fat-containing meal' }],
        rationale: 'Evening SIRT1 dosing aligns with circadian sirtuin activity; fat improves resveratrol absorption.',
      },
    ],
    monitoring: [
      'NAD+ metabolite panel (optional) at baseline and 8–12 weeks',
      'Fasting insulin and HOMA-IR at 12 weeks',
      'Liver enzymes if exceeding 500mg resveratrol daily',
      'Platelet function if on blood thinners',
    ],
    biomarkers: ['nad', 'hscrp'],
    studies: [
      { title: 'NMN supplementation elevates NAD+ levels in healthy adults', journal: 'GeroScience', year: 2022, pmid: '36482258' },
      { title: 'Resveratrol and NAD+ precursors synergize for mitochondrial health', journal: 'Cell Metab', year: 2019, pmid: '30930169' },
      { title: 'Resveratrol improves health and survival of mice on a high-calorie diet', journal: 'Nature', year: 2006, pmid: '17028500' },
    ],
    rationale:
      'Sirtuins are NAD+-dependent deacetylases central to longevity biology. NMN bypasses the rate-limiting NAMPT step to restore NAD+ pools that decline ~50% between ages 40–60. Trans-resveratrol allosterically activates SIRT1, mimicking caloric restriction signaling. Without NAD+, resveratrol activation is biochemically limited.',
    breakdown: [
      { compoundId: 'nmn', role: 'NAD+ pool restoration', mechanism: 'NMN → NAD+ → fuels SIRT1/3, PARP repair, mitophagy' },
      { compoundId: 'resveratrol', role: 'SIRT1 activator', mechanism: 'Allosteric SIRT1 activation → AMPK, PGC-1α, mitochondrial biogenesis' },
    ],
    warnings: [
      'Verify NMN purity certificate (≥99%) — market quality varies enormously',
      'Stop resveratrol 2 weeks before scheduled surgery (platelet effects)',
      'Discuss with physician if on metformin (NAD+ pathway interaction)',
      'Use micronized trans-resveratrol — standard forms have poor bioavailability',
    ],
    featured: true,
    durationWeeks: '8–24 weeks',
  },
  {
    id: 'mito-renewal',
    slug: 'mito-renewal',
    name: 'Mitochondrial Renewal',
    tagline: 'NAD+, TCA cycle, and sirtuin trifecta for cellular energy restoration',
    goal: 'mito',
    compoundIds: ['nmn', 'cakg', 'resveratrol'],
    costTier: 'premium',
    costMonthlyUsd: { low: 110, high: 215 },
    simplicity: 'moderate',
    simplicityScore: 3,
    synergyRating: 92,
    evidenceTier: 'A',
    evidenceSummary:
      'Combines two Tier-A compounds (NMN, Ca-AKG) with Tier-B resveratrol. Ca-AKG mouse lifespan data (12–14% extension) plus human NMN NAD+ trials form the evidence backbone.',
    hallmarkCoverage: ['mito', 'epigenetic', 'genomic', 'senescence', 'stem', 'nutrient'],
    dosingSchedule: [
      {
        period: 'AM',
        time: '7:00 AM',
        items: [
          { compoundId: 'nmn', dose: '250–500mg NMN' },
          { compoundId: 'cakg', dose: '1–2g Ca-AKG', notes: 'Split dose if GI sensitive' },
        ],
        rationale: 'Morning metabolic peak — NAD+ precursor + TCA cycle fuel together.',
      },
      {
        period: 'PM',
        time: '8:00 PM',
        items: [{ compoundId: 'resveratrol', dose: '150–500mg trans-resveratrol', notes: 'With dinner' }],
        rationale: 'Evening SIRT1/AMPK activation for mitochondrial biogenesis signaling.',
      },
    ],
    monitoring: [
      'NAD+ metabolites and AKG levels (optional advanced panels)',
      'Resting heart rate and HRV trend (mitochondrial energy often improves recovery)',
      'Kidney function if history of stones (Ca-AKG contains calcium)',
      'Epigenetic clock (TruDiagnostic) at 6–12 months for directional tracking',
    ],
    biomarkers: ['nad', 'akg', 'hscrp'],
    studies: [
      { title: 'Alpha-ketoglutarate extends lifespan in mice', journal: 'Cell Metab', year: 2020, pmid: '33027664' },
      { title: 'AKG supplementation in middle-aged adults', journal: 'Aging Cell', year: 2024, pmid: '38247127' },
      { title: 'NMN supplementation elevates NAD+ levels in healthy adults', journal: 'GeroScience', year: 2022, pmid: '36482258' },
    ],
    rationale:
      'Mitochondrial dysfunction is the hallmark with highest compound coverage in TNiC. This stack attacks energy crisis from three vectors: NAD+ cofactor restoration (NMN), TCA cycle intermediate replenishment (Ca-AKG), and sirtuin/AMPK-driven biogenesis (resveratrol).',
    breakdown: [
      { compoundId: 'nmn', role: 'NAD+ restoration', mechanism: 'Replenishes NAD+ for OXPHOS, sirtuins, and mitophagy' },
      { compoundId: 'cakg', role: 'TCA cycle & epigenetic cofactor', mechanism: 'AKG fuels Krebs cycle; cofactor for TET dioxygenases' },
      { compoundId: 'resveratrol', role: 'Mitochondrial biogenesis signal', mechanism: 'SIRT1/AMPK → PGC-1α → new mitochondria' },
    ],
    warnings: [
      'Titrate Ca-AKG from 1g — GI effects possible at 2g',
      'Calcium content may matter for kidney stone history',
      'Premium stack — verify product purity on all three compounds',
    ],
    presetKey: 'mito',
    featured: true,
    durationWeeks: '12–24 weeks',
  },
  {
    id: 'starter-elite',
    slug: 'starter-elite',
    name: 'Starter Elite',
    tagline: 'Balanced entry protocol — NRF2 foundation plus NAD+ restoration',
    goal: 'hybrid',
    compoundIds: ['glynac', 'sulforaphane', 'nmn'],
    costTier: 'moderate',
    costMonthlyUsd: { low: 105, high: 190 },
    simplicity: 'moderate',
    simplicityScore: 3,
    synergyRating: 78,
    evidenceTier: 'A',
    evidenceSummary:
      'Three Tier-A compounds spanning the two most depleted pathways (glutathione/NRF2 and NAD+). Ideal first stack for new longevity practitioners.',
    hallmarkCoverage: ['mito', 'proteostasis', 'inflammation', 'genomic', 'epigenetic', 'senescence'],
    dosingSchedule: [
      {
        period: 'AM',
        time: '6:30 AM',
        items: [
          { compoundId: 'glynac', dose: '600mg glycine + 600mg NAC' },
          { compoundId: 'sulforaphane', dose: '10–35mg glucoraphanin' },
          { compoundId: 'nmn', dose: '250mg NMN', notes: 'Add in week 2' },
        ],
        rationale: 'Layer NRF2 stack first, add NMN after 1–2 week tolerance window.',
      },
    ],
    monitoring: [
      'Week-by-week symptom log during titration',
      'Glutathione and hs-CRP at 12 weeks',
      'NAD+ metabolites at 8–12 weeks (optional)',
    ],
    biomarkers: ['gsh', 'nad', 'hscrp', '8ohdg'],
    studies: [
      { title: 'GlyNAC supplementation improves glutathione deficiency in aging humans', journal: 'J Gerontol A', year: 2021, pmid: '34129059' },
      { title: 'NMN supplementation elevates NAD+ levels in healthy adults', journal: 'GeroScience', year: 2022, pmid: '36482258' },
    ],
    rationale:
      'The recommended onboarding stack. Covers the two pathways most adults over 40 need: antioxidant defense (depleted glutathione) and NAD+ restoration (depleted sirtuin cofactor). Three compounds, all Tier-A, manageable cost, clear titration path.',
    breakdown: [
      { compoundId: 'glynac', role: 'Antioxidant foundation', mechanism: 'Glutathione restoration — the master intracellular antioxidant' },
      { compoundId: 'sulforaphane', role: 'NRF2 genomic defense', mechanism: '200+ cytoprotective gene upregulation' },
      { compoundId: 'nmn', role: 'NAD+ entry dose', mechanism: '250mg starting dose — titrate to 500mg at week 4 if tolerated' },
    ],
    warnings: [
      'Add one compound per week: GlyNAC → sulforaphane → NMN',
      'Most common side effect is mild GI adjustment in week 1',
    ],
    presetKey: 'starter',
    featured: true,
    durationWeeks: '24+ weeks',
  },
  {
    id: 'full-hybrid',
    slug: 'full-hybrid',
    name: 'Full Hybrid Defense',
    tagline: 'Maximum TNiC coverage — dual-pathway elite protocol',
    goal: 'hybrid',
    compoundIds: ['glynac', 'sulforaphane', 'nmn', 'cakg', 'rala'],
    costTier: 'premium',
    costMonthlyUsd: { low: 175, high: 305 },
    simplicity: 'advanced',
    simplicityScore: 5,
    synergyRating: 96,
    evidenceTier: 'A',
    evidenceSummary:
      'Five evidence-graded compounds covering 10+ hallmarks. Highest synergy score achievable with the TNiC catalog. Resveratrol added separately in PM for circadian optimization.',
    hallmarkCoverage: ['mito', 'proteostasis', 'inflammation', 'genomic', 'epigenetic', 'senescence', 'stem', 'autophagy'],
    dosingSchedule: [
      {
        period: 'AM',
        time: '6:30 AM',
        items: [
          { compoundId: 'glynac', dose: '600mg glycine + 600mg NAC' },
          { compoundId: 'sulforaphane', dose: '10–35mg glucoraphanin' },
        ],
        rationale: 'NRF2 activation core.',
      },
      {
        period: 'AM',
        time: '7:00 AM',
        items: [
          { compoundId: 'nmn', dose: '250–500mg NMN' },
          { compoundId: 'cakg', dose: '1–2g Ca-AKG' },
        ],
        rationale: 'NAD+ and TCA cycle morning stack.',
      },
      {
        period: 'AM',
        time: '7:30 AM',
        items: [{ compoundId: 'rala', dose: '300–600mg R-ALA', notes: 'With breakfast' }],
        rationale: 'Redox cycling with fat-containing meal.',
      },
    ],
    monitoring: [
      'Full metabolic panel + CBC at baseline and 6 months',
      'Comprehensive biomarker panel: GSH, NAD+, hs-CRP, AKG, oxLDL',
      'Epigenetic clock at 6–12 months',
      'Physician review recommended before starting 5-compound protocol',
    ],
    biomarkers: ['gsh', 'nad', 'hscrp', 'akg', 'oxldl', '8ohdg'],
    studies: [
      { title: 'GlyNAC supplementation improves glutathione deficiency in aging humans', journal: 'J Gerontol A', year: 2021, pmid: '34129059' },
      { title: 'Alpha-ketoglutarate extends lifespan in mice', journal: 'Cell Metab', year: 2020, pmid: '33027664' },
      { title: 'NMN supplementation elevates NAD+ levels in healthy adults', journal: 'GeroScience', year: 2022, pmid: '36482258' },
    ],
    rationale:
      'The flagship TNiC protocol. Combines complete NRF2 defense with mitochondrial renewal, minus evening resveratrol for users who prefer a single daily window. Add resveratrol PM to reach full 6-compound coverage.',
    breakdown: [
      { compoundId: 'glynac', role: 'GSH restoration', mechanism: 'Antioxidant substrate foundation' },
      { compoundId: 'sulforaphane', role: 'NRF2 activation', mechanism: 'Genomic cytoprotective upregulation' },
      { compoundId: 'nmn', role: 'NAD+ restoration', mechanism: 'Sirtuin and PARP cofactor replenishment' },
      { compoundId: 'cakg', role: 'TCA/epigenetic support', mechanism: 'Krebs cycle fuel + TET cofactor' },
      { compoundId: 'rala', role: 'Redox recycler', mechanism: 'Glutathione and vitamin regeneration' },
    ],
    warnings: [
      'Not for beginners — build up via Starter Elite over 4–6 weeks',
      '5-compound interaction screening with physician recommended',
      'Highest monthly cost in OTC catalog',
    ],
    presetKey: 'hybrid',
    featured: true,
    durationWeeks: '24+ weeks',
  },
  {
    id: 'cakg-longevity',
    slug: 'cakg-longevity',
    name: 'Ca-AKG Longevity',
    tagline: 'TCA cycle intermediate with published lifespan extension data',
    goal: 'mito',
    compoundIds: ['cakg', 'nmn'],
    costTier: 'moderate',
    costMonthlyUsd: { low: 85, high: 160 },
    simplicity: 'minimal',
    simplicityScore: 2,
    synergyRating: 80,
    evidenceTier: 'A',
    evidenceSummary:
      'Ca-AKG has mouse lifespan extension (Cell Metabolism 2020) and emerging human data (Aging Cell 2024). Paired with NMN for NAD+-dependent epigenetic regulation.',
    hallmarkCoverage: ['mito', 'epigenetic', 'stem', 'genomic'],
    dosingSchedule: [
      {
        period: 'AM',
        time: '7:00 AM',
        items: [
          { compoundId: 'cakg', dose: '1–2g Ca-AKG' },
          { compoundId: 'nmn', dose: '250–500mg NMN' },
        ],
        rationale: 'AKG fuels TCA cycle; NAD+ supports dioxygenase enzymes that AKG cofactors.',
      },
    ],
    monitoring: [
      'AKG levels if advanced testing available',
      'Calcium intake total if on calcium-restricted diet',
      'Kidney function at 3 and 6 months',
    ],
    biomarkers: ['akg', 'nad'],
    studies: [
      { title: 'Alpha-ketoglutarate extends lifespan in mice', journal: 'Cell Metab', year: 2020, pmid: '33027664' },
      { title: 'AKG supplementation in middle-aged adults', journal: 'Aging Cell', year: 2024, pmid: '38247127' },
    ],
    rationale:
      'Focused two-compound stack for users prioritizing metabolic and epigenetic aging. Ca-AKG is the most direct TCA cycle intervention in the catalog; NMN ensures NAD+-dependent epigenetic enzymes have adequate cofactor.',
    breakdown: [
      { compoundId: 'cakg', role: 'TCA cycle fuel', mechanism: 'Replenishes Krebs cycle intermediate depleted with age' },
      { compoundId: 'nmn', role: 'Epigenetic cofactor supply', mechanism: 'NAD+ for SIRT/TET-mediated epigenetic maintenance' },
    ],
    warnings: ['Start Ca-AKG at 1g daily', 'Monitor calcium if kidney stone history'],
    featured: false,
    durationWeeks: '12–24 weeks',
  },
  {
    id: 'rapamycin-combo',
    slug: 'rapamycin-combo',
    name: 'Rapamycin Combo (Educational)',
    tagline: 'mTOR modulation with supporting OTC stack — physician-supervised only',
    goal: 'autophagy',
    compoundIds: ['glynac', 'nmn', 'cakg'],
    rxCompounds: [
      rxCompoundCatalog.find((r) => r.id === 'rapamycin')!,
      rxCompoundCatalog.find((r) => r.id === 'metformin')!,
    ],
    costTier: 'clinical',
    costMonthlyUsd: { low: 200, high: 500 },
    simplicity: 'clinical',
    simplicityScore: 8,
    synergyRating: 90,
    evidenceTier: 'B',
    evidenceSummary:
      'Rapamycin has the strongest preclinical lifespan data of any single intervention. Human longevity use is off-label and requires clinical supervision. Supporting OTC stack provides antioxidant and NAD+ foundation.',
    hallmarkCoverage: ['autophagy', 'mito', 'senescence', 'nutrient', 'inflammation', 'epigenetic'],
    dosingSchedule: [
      {
        period: 'Weekly',
        time: 'Sunday AM',
        items: [
          { compoundId: 'rapamycin', dose: '3–6mg sirolimus (Rx)', notes: 'PHYSICIAN PRESCRIBED ONLY' },
        ],
        rationale: 'Pulse-dose mTOR inhibition — weekly dosing minimizes immunosuppressive effects while promoting autophagy.',
      },
      {
        period: 'AM',
        time: '7:00 AM',
        items: [
          { compoundId: 'glynac', dose: '600mg glycine + 600mg NAC' },
          { compoundId: 'nmn', dose: '250–500mg NMN' },
          { compoundId: 'cakg', dose: '1g Ca-AKG' },
        ],
        rationale: 'Daily OTC foundation supports autophagy, NAD+, and antioxidant pathways alongside mTOR modulation.',
      },
      {
        period: 'AM',
        time: '7:00 AM',
        items: [{ compoundId: 'metformin', dose: '500–1000mg (Rx)', notes: 'With breakfast — physician prescribed' }],
        rationale: 'AMPK activation complements mTOR inhibition. TAME trial protocol reference.',
      },
    ],
    monitoring: [
      'CBC with differential — every 3 months (rapamycin)',
      'Comprehensive metabolic panel — every 3 months',
      'Fasting glucose and HbA1c — monthly initially',
      'Lipid panel — every 6 months',
      'Infection vigilance — rapamycin is immunosuppressive at continuous doses',
      'Oral glucose tolerance test if on metformin + NMN combination',
      'Physician follow-up every 3 months minimum',
    ],
    biomarkers: ['nad', 'gsh', 'hscrp', 'akg'],
    studies: [
      { title: 'Rapamycin extends median and maximal lifespan in genetically heterogeneous mice', journal: 'Aging Cell', year: 2011, pmid: '21276122' },
      { title: 'Metformin in longevity study (TAME) protocol', journal: 'Aging Cell', year: 2019, pmid: '31012539' },
      { title: 'NMN supplementation elevates NAD+ levels in healthy adults', journal: 'GeroScience', year: 2022, pmid: '36482258' },
    ],
    rationale:
      'Educational reference for the most discussed clinical longevity protocol. Rapamycin inhibits mTORC1 promoting autophagy; metformin activates AMPK. The OTC support stack (GlyNAC, NMN, Ca-AKG) addresses complementary hallmarks. This stack is NOT self-prescribable — included for informed physician discussions only.',
    breakdown: [
      { compoundId: 'glynac', role: 'Antioxidant foundation', mechanism: 'Protects against oxidative stress during metabolic reprogramming' },
      { compoundId: 'nmn', role: 'NAD+ support', mechanism: 'Counters potential NAD+ pathway interactions with metformin' },
      { compoundId: 'cakg', role: 'Metabolic intermediate', mechanism: 'TCA cycle support during mTOR/AMPK metabolic shift' },
    ],
    warnings: [
      'PRESCRIPTION DRUGS — physician supervision mandatory',
      'Rapamycin is immunosuppressive — infection risk with continuous high dosing',
      'Not for immunocompromised individuals',
      'Metformin + NMN interaction requires physician guidance',
      'This entry is educational — TNiC does not prescribe or source Rx compounds',
      'Contraindicated: active infections, wound healing, live vaccines during rapamycin use',
    ],
    featured: true,
    durationWeeks: 'Ongoing with quarterly physician review',
  },
  {
    id: 'ultimate-longevity',
    slug: 'ultimate-longevity',
    name: 'Ultimate Longevity',
    tagline: 'All six TNiC compounds — maximum hallmark coverage',
    goal: 'longevity',
    compoundIds: ['glynac', 'sulforaphane', 'rala', 'cakg', 'nmn', 'resveratrol'],
    costTier: 'premium',
    costMonthlyUsd: { low: 200, high: 345 },
    simplicity: 'advanced',
    simplicityScore: 6,
    synergyRating: 100,
    evidenceTier: 'A',
    evidenceSummary:
      'Complete catalog utilization. Six compounds, maximum synergy score (100), broadest hallmark coverage. The reference protocol for advanced practitioners with physician oversight.',
    hallmarkCoverage: ['mito', 'proteostasis', 'inflammation', 'genomic', 'epigenetic', 'senescence', 'stem', 'autophagy', 'nutrient'],
    dosingSchedule: [
      {
        period: 'AM',
        time: '6:30 AM',
        items: [
          { compoundId: 'glynac', dose: '600mg glycine + 600mg NAC' },
          { compoundId: 'sulforaphane', dose: '10–35mg glucoraphanin' },
        ],
        rationale: 'NRF2 + glutathione morning activation.',
      },
      {
        period: 'AM',
        time: '7:00 AM',
        items: [
          { compoundId: 'nmn', dose: '500mg NMN' },
          { compoundId: 'cakg', dose: '1–2g Ca-AKG' },
        ],
        rationale: 'NAD+ and TCA cycle stack.',
      },
      {
        period: 'AM',
        time: '7:30 AM',
        items: [{ compoundId: 'rala', dose: '300–600mg R-ALA', notes: 'With breakfast' }],
        rationale: 'Redox cycling with dietary fat.',
      },
      {
        period: 'PM',
        time: '8:00 PM',
        items: [{ compoundId: 'resveratrol', dose: '250–500mg trans-resveratrol', notes: 'With dinner' }],
        rationale: 'Circadian SIRT1 activation.',
      },
    ],
    monitoring: [
      'Full longevity biomarker panel every 6 months',
      'Epigenetic clock (TruDiagnostic/GlycanAge) annually',
      'Physician review with exported protocol',
      'Quarterly subjective healthspan assessment (energy, recovery, cognition)',
    ],
    biomarkers: ['gsh', 'nad', 'hscrp', 'akg', 'oxldl', '8ohdg'],
    studies: [
      { title: 'GlyNAC supplementation improves glutathione deficiency in aging humans', journal: 'J Gerontol A', year: 2021, pmid: '34129059' },
      { title: 'NMN supplementation elevates NAD+ levels in healthy adults', journal: 'GeroScience', year: 2022, pmid: '36482258' },
      { title: 'Alpha-ketoglutarate extends lifespan in mice', journal: 'Cell Metab', year: 2020, pmid: '33027664' },
      { title: 'Resveratrol and NAD+ precursors synergize for mitochondrial health', journal: 'Cell Metab', year: 2019, pmid: '30930169' },
    ],
    rationale:
      'The ceiling of what TNiC\'s evidence-graded catalog can deliver. Every compound, every pathway, AM/PM circadian optimization. Build toward this over 6–8 weeks from Starter Elite. Synergy score maxes at 100.',
    breakdown: [
      { compoundId: 'glynac', role: 'GSH foundation', mechanism: 'Master antioxidant restoration' },
      { compoundId: 'sulforaphane', role: 'NRF2 switch', mechanism: '200+ gene cytoprotection' },
      { compoundId: 'rala', role: 'Redox recycler', mechanism: 'Mitochondrial enzyme support' },
      { compoundId: 'nmn', role: 'NAD+ restoration', mechanism: 'Sirtuin/PARP cofactor' },
      { compoundId: 'cakg', role: 'TCA/epigenetic', mechanism: 'Krebs cycle + TET support' },
      { compoundId: 'resveratrol', role: 'SIRT1 activator', mechanism: 'Caloric restriction mimetic' },
    ],
    warnings: [
      'Advanced users only — titrate from simpler stacks over 6+ weeks',
      'Highest interaction surface area — pharmacist review recommended',
      'Premium cost — $200–345/month',
    ],
    featured: true,
    durationWeeks: '24+ weeks (ongoing)',
  },
];

export function getStackBySlug(slug: string): EliteStack | undefined {
  return eliteStacks.find((s) => s.slug === slug);
}

export function getStacksByGoal(goal: StackGoal): EliteStack[] {
  return eliteStacks.filter((s) => s.goal === goal);
}

export function getFeaturedStacks(): EliteStack[] {
  return eliteStacks.filter((s) => s.featured);
}