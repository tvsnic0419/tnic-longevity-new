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
  { key: 'R', label: 'Risk Penalty', w: LQ_WEIGHTS.R, desc: 'Adverse events, drug interactions', penalty: true },
];
