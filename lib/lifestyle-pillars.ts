import type { ThemeAccent } from './design-system';

export type LifestyleSlug = 'sleep' | 'exercise' | 'nutrition' | 'stress';

export interface LifestyleLabTieIn {
  markerId: string;
  label: string;
  cadence: string;
  target: string;
  rationale: string;
}

export interface LifestyleWearableSignal {
  label: string;
  target: string;
  frequency: string;
}

export interface LifestyleHallmarkWeight {
  hallmarkId: string;
  impact: 'primary' | 'secondary';
  mechanism: string;
}

export interface LifestylePillarMeta {
  slug: LifestyleSlug;
  accent: ThemeAccent;
  priority: number;
  headline: string;
  decisionSummary: string;
  hallmarkWeights: LifestyleHallmarkWeight[];
  labTieIns: LifestyleLabTieIn[];
  wearableSignals: LifestyleWearableSignal[];
  stackPrerequisite: string;
}

export const lifestylePillars: Record<LifestyleSlug, LifestylePillarMeta> = {
  sleep: {
    slug: 'sleep',
    accent: 'cyan',
    priority: 1,
    headline: 'Repair window — no compound replaces 7–9 hours',
    decisionSummary: 'Start with fixed wake time ±30 min. If <6.5h persists, rule out OSA before stacking supplements.',
    hallmarkWeights: [
      { hallmarkId: 'genomic', impact: 'primary', mechanism: 'PARP/BER DNA repair peaks in slow-wave sleep' },
      { hallmarkId: 'proteostasis', impact: 'primary', mechanism: 'Glymphatic protein clearance during deep sleep' },
      { hallmarkId: 'inflammation', impact: 'primary', mechanism: 'Sleep restriction elevates hs-CRP within weeks' },
      { hallmarkId: 'telomeres', impact: 'secondary', mechanism: 'Chronic restriction accelerates telomere attrition' },
      { hallmarkId: 'communication', impact: 'secondary', mechanism: 'Cortisol normalization restores intercellular signaling' },
    ],
    labTieIns: [
      {
        markerId: 'hscrp',
        label: 'hs-CRP',
        cadence: 'Baseline + quarterly',
        target: '<1.0 mg/L',
        rationale: 'Sleep restriction elevates inflammatory markers in human trials.',
      },
      {
        markerId: '8ohdg',
        label: '8-OHdG',
        cadence: 'Baseline + 12 weeks',
        target: '<15 ng/mg creatinine',
        rationale: 'Oxidative DNA damage rises with chronic sleep debt.',
      },
    ],
    wearableSignals: [
      { label: 'Total sleep', target: '7–9 h/night', frequency: 'Daily' },
      { label: 'Deep sleep', target: '≥60 min/night', frequency: 'Weekly avg' },
      { label: 'Wake time SD', target: '<30 min', frequency: 'Weekly' },
    ],
    stackPrerequisite: 'Lock wake time 2+ weeks before PM longevity compounds.',
  },
  exercise: {
    slug: 'exercise',
    accent: 'emerald',
    priority: 2,
    headline: 'Highest multi-hallmark signal — compounds are adjuvants',
    decisionSummary: 'Sedentary? Start 3×30 min walks. HRV collapsed? Deload before adding stack compounds.',
    hallmarkWeights: [
      { hallmarkId: 'mito', impact: 'primary', mechanism: 'Zone 2 drives PGC-1α mitochondrial biogenesis' },
      { hallmarkId: 'senescence', impact: 'primary', mechanism: 'Myokines support senescence clearance signaling' },
      { hallmarkId: 'telomeres', impact: 'primary', mechanism: 'Aerobic training linked to longer leukocyte telomeres' },
      { hallmarkId: 'autophagy', impact: 'secondary', mechanism: 'AMPK activation from energy stress' },
      { hallmarkId: 'inflammation', impact: 'secondary', mechanism: 'Training lowers hs-CRP independent of weight loss' },
      { hallmarkId: 'stem', impact: 'secondary', mechanism: 'Resistance load activates satellite cells' },
    ],
    labTieIns: [
      {
        markerId: 'hscrp',
        label: 'hs-CRP',
        cadence: 'Baseline + 12 weeks',
        target: '<1.0 mg/L',
        rationale: 'Exercise lowers CRP in meta-analyses — track response to training load.',
      },
      {
        markerId: 'nad',
        label: 'NAD+ index',
        cadence: 'Baseline + 6 months',
        target: '80–100 relative',
        rationale: 'Training + NMN stack synergy — verify NAD+ trend with consistent Zone 2.',
      },
    ],
    wearableSignals: [
      { label: 'Zone 2 minutes', target: '≥150 min/week', frequency: 'Weekly' },
      { label: 'Resting HR', target: '↓ 2–5 bpm over 3 mo', frequency: 'Daily avg' },
      { label: 'HRV (rMSSD)', target: '↑ trend', frequency: '7-day avg' },
    ],
    stackPrerequisite: '4 weeks Zone 2 base before NAD+ Mito Stack spend.',
  },
  nutrition: {
    slug: 'nutrition',
    accent: 'amber',
    priority: 3,
    headline: 'Daily mTOR/AMPK input — food outranks pills for nutrient sensing',
    decisionSummary: 'Fiber <25g? Fix eating window first. On NMN? Methyl donor checklist is non-negotiable.',
    hallmarkWeights: [
      { hallmarkId: 'nutrient', impact: 'primary', mechanism: 'TRE modulates mTOR/insulin nutrient sensing' },
      { hallmarkId: 'dysbiosis', impact: 'primary', mechanism: 'Fiber + fermented foods diversify microbiome' },
      { hallmarkId: 'epigenetic', impact: 'primary', mechanism: 'Methyl donors support TET/JMJ maintenance' },
      { hallmarkId: 'autophagy', impact: 'secondary', mechanism: 'Fasting windows support autophagy induction' },
      { hallmarkId: 'inflammation', impact: 'secondary', mechanism: 'Fermented foods lower inflammatory proteins' },
    ],
    labTieIns: [
      {
        markerId: 'hscrp',
        label: 'hs-CRP',
        cadence: 'Baseline + 12 weeks',
        target: '<1.0 mg/L',
        rationale: 'Fermented food trials show CRP reductions over 10 weeks.',
      },
      {
        markerId: 'akg',
        label: 'Alpha-Ketoglutarate',
        cadence: 'Baseline + 12 weeks',
        target: '15–25 μmol/L',
        rationale: 'Epigenetic cofactor — dietary protein supports endogenous AKG pools.',
      },
    ],
    wearableSignals: [
      { label: 'Eating window', target: '16:8+ fasted', frequency: 'Daily' },
      { label: 'Fiber', target: '30–40 g/day', frequency: 'Daily' },
      { label: 'Plant species', target: '30+/week', frequency: 'Weekly' },
    ],
    stackPrerequisite: 'Lock TRE + fiber 4 weeks before supplement stack escalation.',
  },
  stress: {
    slug: 'stress',
    accent: 'violet',
    priority: 4,
    headline: 'HPA axis brake — chronic stress negates supplement ROI',
    decisionSummary: 'Stress ≥7/10 for 2+ weeks? Mental health support first. Low HRV? Audit sleep and training load.',
    hallmarkWeights: [
      { hallmarkId: 'telomeres', impact: 'primary', mechanism: 'Cortisol accelerates telomere attrition' },
      { hallmarkId: 'inflammation', impact: 'primary', mechanism: 'NF-κB-driven inflammaging under chronic stress' },
      { hallmarkId: 'genomic', impact: 'secondary', mechanism: 'Stress diverts resources from DNA repair' },
      { hallmarkId: 'communication', impact: 'secondary', mechanism: 'HPA dysregulation alters intercellular signaling' },
      { hallmarkId: 'senescence', impact: 'secondary', mechanism: 'SASP amplification under inflammatory stress' },
    ],
    labTieIns: [
      {
        markerId: 'hscrp',
        label: 'hs-CRP',
        cadence: 'Baseline + 8 weeks',
        target: '<1.0 mg/L',
        rationale: 'Meditation/breathwork trials show measurable CRP reductions.',
      },
      {
        markerId: 'gsh',
        label: 'Glutathione (GSH)',
        cadence: 'Baseline + 12 weeks',
        target: '5.0–8.5 μmol/L',
        rationale: 'Oxidative stress rises under chronic HPA activation — GSH tracks recovery.',
      },
    ],
    wearableSignals: [
      { label: 'HRV (rMSSD)', target: '↑ 10–20% over 8 wk', frequency: '7-day avg' },
      { label: 'Stress score', target: '≤5/10', frequency: 'Daily' },
      { label: 'Resting HR', target: '↓ 2–5 bpm trend', frequency: 'Daily' },
    ],
    stackPrerequisite: '8 weeks stress protocol before NRF2 triad for CRP — not vice versa.',
  },
};

export const lifestylePillarOrder: LifestyleSlug[] = ['sleep', 'exercise', 'nutrition', 'stress'];

export function getLifestylePillar(slug: string): LifestylePillarMeta | undefined {
  return lifestylePillars[slug as LifestyleSlug];
}

export function getLabsDeepLink(markerId: string): string {
  return `/labs?marker=${markerId}&tab=input`;
}