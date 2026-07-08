export type ClockConfidence = 'high' | 'moderate' | 'low' | 'modeled';

export type LQDimensionKey = 'CE' | 'EB' | 'ES' | 'EE' | 'SF' | 'BV' | 'HP' | 'R';

export interface LQCompound {
  id: string;
  name: string;
  full: string;
  category: string;
  mechanism: string;
  CE: number;
  EB: number;
  ES: number;
  EE: number;
  SF: number;
  BV: number;
  HP: number;
  R: number;
  topStudy: string;
  clock: string;
  clockConfidence: ClockConfidence;
  color: string;
  isRx: boolean;
  libraryHref?: string;
  evidenceTier?: 'A' | 'B' | 'C';
}

export const LQ_WEIGHTS: Record<LQDimensionKey, number> = {
  CE: 0.22,
  EB: 0.18,
  ES: 0.16,
  EE: 0.14,
  SF: 0.12,
  BV: 0.1,
  HP: 0.05,
  R: 0.03,
};

export const LQ_DIMENSIONS: {
  key: LQDimensionKey;
  label: string;
  w: number;
  desc: string;
  penalty?: boolean;
}[] = [
  { key: 'CE', label: 'Clinical Evidence', w: LQ_WEIGHTS.CE, desc: 'RCT quality, meta-analyses, N-size' },
  { key: 'EB', label: 'Epigenetic Biomarkers', w: LQ_WEIGHTS.EB, desc: 'Methylation clock improvements' },
  { key: 'ES', label: 'Effect Size', w: LQ_WEIGHTS.ES, desc: "Magnitude of benefit (Cohen's d equiv)" },
  { key: 'EE', label: 'Evolutionary Evidence', w: LQ_WEIGHTS.EE, desc: 'Conserved pathway target across species' },
  { key: 'SF', label: 'Safety Profile', w: LQ_WEIGHTS.SF, desc: 'Tolerability, adverse event rate' },
  { key: 'BV', label: 'Bioavailability', w: LQ_WEIGHTS.BV, desc: 'Absorption, delivery, formulation quality' },
  { key: 'HP', label: 'Human Population Data', w: LQ_WEIGHTS.HP, desc: 'Observational cohort / epidemiological signal' },
  { key: 'R', label: 'Risk Penalty', w: LQ_WEIGHTS.R, desc: 'Adverse events, drug interactions (subtracted)', penalty: true },
];

export const RX_COMPOUND_IDS = ['rapamycin', 'metformin', 'senolytics'] as const;

export const ELITE_8_COMPOUNDS: LQCompound[] = [
  {
    id: 'nmn',
    name: 'NMN',
    full: 'Nicotinamide Mononucleotide',
    category: 'NAD+ Precursor',
    mechanism: 'Replenishes NAD+ → activates sirtuins, PARP repair, mitochondrial biogenesis',
    CE: 7.2,
    EB: 8.1,
    ES: 7.8,
    EE: 9.2,
    SF: 8.5,
    BV: 6.8,
    HP: 6.5,
    R: 2.0,
    topStudy: 'Igarashi et al. 2022 — oral NMN raised NAD+ 38%, improved muscle function in older adults',
    clock: 'Horvath DNAmAge −2.1yr avg (pilot)',
    clockConfidence: 'moderate',
    color: '#22d3ee',
    isRx: false,
    libraryHref: '/library/compounds/nmn',
    evidenceTier: 'A',
  },
  {
    id: 'rapamycin',
    name: 'Rapamycin',
    full: 'Rapamycin (Sirolimus)',
    category: 'mTOR Inhibitor',
    mechanism: 'Inhibits mTORC1 → induces autophagy, reduces senescent cell burden, extends lifespan in 25+ model organisms',
    CE: 8.8,
    EB: 7.4,
    ES: 9.1,
    EE: 9.8,
    SF: 5.5,
    BV: 7.5,
    HP: 5.8,
    R: 5.5,
    topStudy: 'Harrison et al. 2009 (ITP) — 14% lifespan extension in mice; multiple human trials ongoing',
    clock: 'PhenoAge −3.4yr (Mannick 2022 cohort)',
    clockConfidence: 'moderate',
    color: '#fbbf24',
    isRx: true,
    libraryHref: '/library/compounds/rapamycin',
  },
  {
    id: 'metformin',
    name: 'Metformin',
    full: 'Metformin HCl',
    category: 'AMPK Activator',
    mechanism: 'Activates AMPK, inhibits Complex I → mimics caloric restriction, reduces IGF-1 signaling',
    CE: 9.2,
    EB: 6.8,
    ES: 7.2,
    EE: 8.5,
    SF: 7.8,
    BV: 8.9,
    HP: 9.1,
    R: 2.8,
    topStudy: 'TAME Trial (ongoing) — observational: diabetics on metformin outlive matched non-diabetic controls',
    clock: 'GrimAge −1.8yr (epidemiological estimate)',
    clockConfidence: 'low',
    isRx: true,
    color: '#10b981',
  },
  {
    id: 'spermidine',
    name: 'Spermidine',
    full: 'Spermidine',
    category: 'Autophagy Inducer',
    mechanism: 'Polyamine → induces autophagy via eIF5A hypusination; epigenetically modulates histones',
    CE: 7.0,
    EB: 7.9,
    ES: 7.3,
    EE: 8.7,
    SF: 9.0,
    BV: 7.2,
    HP: 7.4,
    R: 1.5,
    topStudy: 'Madeo et al. 2021 (Cell) — wheat germ extract RCT: improved memory in older adults',
    clock: 'DunedinPACE −0.12 units (Schroeder 2021)',
    clockConfidence: 'low',
    color: '#a78bfa',
    isRx: false,
    evidenceTier: 'B',
    libraryHref: '/library/compounds/spermidine',
  },
  {
    id: 'senolytics',
    name: 'D+Q',
    full: 'Dasatinib + Quercetin',
    category: 'Senolytic Combo',
    mechanism: 'Clears senescent cells via pro-apoptotic pathway restoration → reduces SASP, tissue rejuvenation',
    CE: 7.8,
    EB: 8.6,
    ES: 8.4,
    EE: 8.1,
    SF: 6.2,
    BV: 6.5,
    HP: 5.5,
    R: 4.2,
    topStudy: 'Kirkland 2023 — intermittent D+Q improved frailty index in IPF patients; multiple phase 2 trials',
    clock: 'Horvath −3.2yr (Mayo Clinic pilot, n=9)',
    clockConfidence: 'low',
    color: '#fb7185',
    isRx: true,
  },
  {
    id: 'glycine_nac',
    name: 'GlyNAC',
    full: 'Glycine + N-Acetylcysteine',
    category: 'Glutathione Precursor',
    mechanism: 'Restores glutathione → combats oxidative stress, mitochondrial dysfunction, hallmarks of aging',
    CE: 7.5,
    EB: 8.2,
    ES: 8.0,
    EE: 7.6,
    SF: 9.3,
    BV: 8.4,
    HP: 6.8,
    R: 1.2,
    topStudy: 'Kumar et al. 2023 (JNutr) — GlyNAC in older adults: GSH +139%, mitochondrial function +71%',
    clock: 'Biological age markers −3.0yr equiv (functional)',
    clockConfidence: 'moderate',
    color: '#fb923c',
    isRx: false,
    libraryHref: '/library/compounds/glynac',
    evidenceTier: 'A',
  },
  {
    id: 'taurine',
    name: 'Taurine',
    full: 'Taurine',
    category: 'Sulfonic Amino Acid',
    mechanism:
      'Declines ~80% with age; supplementation activates longevity pathways, reduces DNA damage, extends C. elegans/mouse lifespan',
    CE: 7.6,
    EB: 7.1,
    ES: 7.5,
    EE: 8.4,
    SF: 9.5,
    BV: 9.0,
    HP: 7.2,
    R: 1.0,
    topStudy: 'Singh et al. 2023 (Science) — taurine deficiency drives aging; supplementation +10% lifespan in mice',
    clock: 'GlycoAge −2.4yr (glycan estimate)',
    clockConfidence: 'low',
    color: '#38bdf8',
    isRx: false,
    evidenceTier: 'B',
    libraryHref: '/library/compounds/taurine',
  },
  {
    id: 'resveratrol_pterostilbene',
    name: 'Pterostilbene',
    full: 'Pterostilbene (Resveratrol analog)',
    category: 'SIRT1 Activator',
    mechanism: 'Methylated resveratrol → 4× bioavailability; activates SIRT1, induces autophagy, anti-inflammatory',
    CE: 6.8,
    EB: 7.3,
    ES: 7.0,
    EE: 8.0,
    SF: 8.8,
    BV: 9.2,
    HP: 6.2,
    R: 1.8,
    topStudy: 'Kapetanovic et al. 2011 — superior bioavailability vs resveratrol; human safety confirmed 350mg/day',
    clock: 'Horvath est. −1.5yr (extrapolated from animal models)',
    clockConfidence: 'modeled',
    color: '#c084fc',
    isRx: false,
    libraryHref: '/library/compounds/pterostilbene',
    evidenceTier: 'B',
  },
];

export type ScoredLQCompound = LQCompound & { score: number };

export function calcLQScore(compound: LQCompound, weights: Record<LQDimensionKey, number> = LQ_WEIGHTS): number {
  return (
    (weights.CE * compound.CE +
      weights.EB * compound.EB +
      weights.ES * compound.ES +
      weights.EE * compound.EE +
      weights.SF * compound.SF +
      weights.BV * compound.BV +
      weights.HP * compound.HP -
      weights.R * compound.R) *
    10
  );
}

export function getScoredCompounds(weights: Record<LQDimensionKey, number> = LQ_WEIGHTS): ScoredLQCompound[] {
  return [...ELITE_8_COMPOUNDS]
    .map((p) => ({ ...p, score: calcLQScore(p, weights) }))
    .sort((a, b) => b.score - a.score);
}

export function sumLQWeights(weights: Record<LQDimensionKey, number> = LQ_WEIGHTS): number {
  return Object.values(weights).reduce((a, b) => a + b, 0);
}

export const CLOCK_CONFIDENCE_LABELS: Record<ClockConfidence, string> = {
  high: 'high confidence',
  moderate: 'moderate confidence',
  low: 'low confidence',
  modeled: 'modeled estimate',
};