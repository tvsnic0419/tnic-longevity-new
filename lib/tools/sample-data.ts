/**
 * Sample data structures for TNiC advanced tools.
 * Use for tests, Storybook, or API contract documentation.
 */

import type {
  ProtocolEngineOutput,
  StackNetworkGraph,
  BiomarkerDashboardResult,
  ReasoningStep,
} from './types';

export const sampleReasoningChain: ReasoningStep[] = [
  {
    id: 'r1',
    rule: 'GOAL_HALLMARK_MAP',
    input: 'Goals: inflammation, energy',
    conclusion: 'Prioritize NRF2 + mitochondrial hallmarks (+36 priority score)',
    weight: 0.25,
    confidence: 88,
  },
  {
    id: 'r2',
    rule: 'LAB_CRITICAL_BOOST',
    input: 'hs-CRP 2.4 mg/L (watch)',
    conclusion: 'Elevate inflammation pathway to phase-1 foundation',
    weight: 0.2,
    confidence: 82,
  },
  {
    id: 'r3',
    rule: 'LIFESTYLE_GAP',
    input: 'Sleep 52%, stress 68%',
    conclusion: 'Add sleep + HRV blocks before compound escalation',
    weight: 0.15,
    confidence: 90,
  },
];

export const sampleProtocolOutput: Partial<ProtocolEngineOutput> = {
  confidence: 84,
  summary:
    'Three-phase NRF2 → mitochondrial protocol for age 48 targeting inflammation and energy. Foundation weeks 1–4 emphasize GlyNAC + sulforaphane with sleep stabilization.',
  phases: [
    {
      id: 'foundation',
      label: 'Foundation',
      weeks: '1–4',
      objectives: ['Stabilize NRF2 axis', 'Establish AM/PM cadence', 'Baseline labs'],
      pathways: [
        {
          id: 'nrf2',
          name: 'NRF2 Defense',
          description: 'Glutathione restoration + phase II enzyme induction',
          hallmarkIds: ['inflammation', 'proteostasis', 'mito'],
          compounds: [
            {
              compoundId: 'glynac',
              name: 'GlyNAC ET',
              dose: '600mg glycine + 600mg NAC',
              timing: 'AM',
              evidence: 'A',
              rationale: 'Tier A human data for GSH restoration',
            },
          ],
          lifestyleActions: ['7–9h sleep window', '10 min breathwork daily'],
          confidence: 91,
          priority: 1,
          reasoning: sampleReasoningChain.slice(0, 2),
        },
      ],
      checkpoints: ['Week 2: adherence check', 'Week 4: hs-CRP retest'],
    },
  ],
  disclaimer:
    'Educational model only. Not a prescription. Physician review required before starting any protocol.',
};

export const sampleNetworkGraph: Partial<StackNetworkGraph> = {
  stats: {
    synergyCount: 8,
    cautionCount: 4,
    contraindicationCount: 0,
    activeSynergyCount: 3,
    activeConflictCount: 1,
    networkDensity: 0.42,
  },
};

export const sampleDashboardResult: Partial<BiomarkerDashboardResult> = {
  healthspanScore: 72,
  dataCompleteness: 67,
  globalDisclaimer:
    'Forecasts are illustrative trend models based on published trial effect sizes — NOT clinical predictions. Individual response varies widely. Never use for diagnosis or treatment decisions.',
  forecasts: [
    {
      id: 'forecast-gsh-glynac',
      markerId: 'gsh',
      interventionName: 'GlyNAC ET (add to stack)',
      category: 'compound',
      impactScore: 85,
      expectedDelta: 1.4,
      timeframeWeeks: 24,
      disclaimer: 'Based on Kumar et al. 2023 trial trajectory — not guaranteed.',
      baseline: [
        { week: 0, value: 4.2, bandLow: 4.0, bandHigh: 4.4 },
        { week: 12, value: 4.5, bandLow: 4.2, bandHigh: 4.8 },
      ],
      projected: [
        { week: 0, value: 4.2, bandLow: 4.0, bandHigh: 4.4 },
        { week: 12, value: 5.2, bandLow: 4.6, bandHigh: 5.8 },
        { week: 24, value: 5.8, bandLow: 5.0, bandHigh: 6.6 },
      ],
    },
  ],
};