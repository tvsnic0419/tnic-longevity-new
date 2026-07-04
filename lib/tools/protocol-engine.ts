import { biomarkers, compounds, calculateDefenseProfile } from '../data';
import { getLabStatus, type LabEntry } from '../labs';
import { stackPresets } from '../presets';
import type { EvidenceTier } from '../types';
import {
  generateProtocol,
  protocolGoalOptions,
  type ProtocolGoal,
  type ProtocolInput,
} from './protocol-customizer';
import type {
  PathwayId,
  PathwayPlan,
  ProtocolEngineInput,
  ProtocolEngineOutput,
  ProtocolPhase,
  ReasoningStep,
} from './types';

export { protocolGoalOptions, type ProtocolGoal };

const pathwayMeta: Record<
  PathwayId,
  { name: string; description: string; hallmarkIds: string[]; compoundIds: string[] }
> = {
  nrf2: {
    name: 'NRF2 Defense',
    description: 'Glutathione restoration, phase II detox, antioxidant reserve',
    hallmarkIds: ['inflammation', 'proteostasis', 'genomic'],
    compoundIds: ['glynac', 'sulforaphane', 'rala'],
  },
  mito: {
    name: 'Mitochondrial Renewal',
    description: 'NAD+ repletion, TCA support, mitochondrial biogenesis',
    hallmarkIds: ['mito', 'nutrient', 'senescence'],
    compoundIds: ['nmn', 'cakg', 'rala'],
  },
  epigenetic: {
    name: 'Epigenetic Support',
    description: 'Sirtuin activation, methylation donors, biological age',
    hallmarkIds: ['epigenetic', 'stem', 'genomic'],
    compoundIds: ['cakg', 'nmn', 'resveratrol'],
  },
  inflammation: {
    name: 'Inflammaging Control',
    description: 'hs-CRP reduction, SASP mitigation, immune tone',
    hallmarkIds: ['inflammation', 'senescence', 'communication'],
    compoundIds: ['glynac', 'sulforaphane', 'resveratrol'],
  },
  proteostasis: {
    name: 'Proteostasis & Autophagy',
    description: 'Protein quality control, autophagy flux, ER stress',
    hallmarkIds: ['proteostasis', 'autophagy'],
    compoundIds: ['glynac', 'sulforaphane', 'resveratrol'],
  },
  nutrient: {
    name: 'Nutrient Sensing',
    description: 'mTOR/AMPK balance, caloric signaling, metabolic flexibility',
    hallmarkIds: ['nutrient', 'mito', 'autophagy'],
    compoundIds: ['resveratrol', 'cakg', 'nmn'],
  },
};

const goalPathwayBoost: Record<ProtocolGoal, PathwayId[]> = {
  energy: ['mito', 'nutrient'],
  inflammation: ['nrf2', 'inflammation'],
  cognitive: ['mito', 'proteostasis'],
  longevity: ['nrf2', 'mito', 'epigenetic'],
  recovery: ['nrf2', 'mito'],
  epigenetic: ['epigenetic', 'nutrient'],
};

function scorePathways(input: ProtocolEngineInput): Map<PathwayId, number> {
  const scores = new Map<PathwayId, number>();
  (Object.keys(pathwayMeta) as PathwayId[]).forEach((id) => scores.set(id, 40));

  input.goals.forEach((g) => {
    goalPathwayBoost[g].forEach((pid) => {
      scores.set(pid, (scores.get(pid) ?? 0) + 22);
    });
  });

  const defense = calculateDefenseProfile(input.age, input.stress, input.sleep, input.exercise);
  if (defense.recommendation === 'nrf2') scores.set('nrf2', (scores.get('nrf2') ?? 0) + 15);
  if (defense.recommendation === 'mito') scores.set('mito', (scores.get('mito') ?? 0) + 15);

  if (input.sleep < 60) scores.set('nrf2', (scores.get('nrf2') ?? 0) + 12);
  if (input.stress > 60) scores.set('inflammation', (scores.get('inflammation') ?? 0) + 18);
  if (input.exercise < 50) scores.set('mito', (scores.get('mito') ?? 0) + 14);

  input.labEntries?.forEach((entry) => {
    const status = getLabStatus(entry.markerId, entry.value);
    const weight = status === 'critical' ? 20 : status === 'watch' ? 10 : 0;
    const b = biomarkers.find((x) => x.id === entry.markerId);
    b?.compounds.forEach((cid) => {
      const c = compounds.find((x) => x.id === cid);
      c?.hallmarks.forEach((hid) => {
        (Object.entries(pathwayMeta) as [PathwayId, (typeof pathwayMeta)[PathwayId]][]).forEach(
          ([pid, meta]) => {
            if (meta.hallmarkIds.includes(hid)) {
              scores.set(pid, Math.min(100, (scores.get(pid) ?? 0) + weight));
            }
          },
        );
      });
    });
  });

  if (input.budget === 'budget') {
    scores.set('nrf2', (scores.get('nrf2') ?? 0) + 8);
  }
  if (input.complexity === 'minimal') {
    scores.set('nrf2', (scores.get('nrf2') ?? 0) + 5);
    scores.set('mito', (scores.get('mito') ?? 0) - 5);
  }

  return scores;
}

function buildReasoningChain(
  input: ProtocolEngineInput,
  pathwayScores: Map<PathwayId, number>,
): ReasoningStep[] {
  const steps: ReasoningStep[] = [];
  let idx = 0;

  steps.push({
    id: `r${++idx}`,
    rule: 'PROFILE_BASELINE',
    input: `Age ${input.age}, sleep ${input.sleep}%, stress ${input.stress}%, exercise ${input.exercise}%`,
    conclusion: calculateDefenseProfile(input.age, input.stress, input.sleep, input.exercise).recommendation
      ? `Defense scan favors ${calculateDefenseProfile(input.age, input.stress, input.sleep, input.exercise).recommendation.toUpperCase()} pathway`
      : 'Balanced profile — multi-pathway approach',
    weight: 0.12,
    confidence: 85,
  });

  input.goals.forEach((g) => {
    const label = protocolGoalOptions.find((o) => o.id === g)?.label ?? g;
    steps.push({
      id: `r${++idx}`,
      rule: 'GOAL_PATHWAY_MAP',
      input: `Goal: ${label}`,
      conclusion: `Boost ${goalPathwayBoost[g].join(' + ')} pathways`,
      weight: 0.18,
      confidence: 88,
    });
  });

  if (input.labEntries?.length) {
    const latest = new Map<string, LabEntry>();
    input.labEntries.forEach((e) => {
      const prev = latest.get(e.markerId);
      if (!prev || e.date > prev.date) latest.set(e.markerId, e);
    });
    latest.forEach((entry, markerId) => {
      const b = biomarkers.find((x) => x.id === markerId);
      const status = getLabStatus(markerId, entry.value);
      if (status !== 'optimal' && b) {
        steps.push({
          id: `r${++idx}`,
          rule: 'LAB_STATUS_BOOST',
          input: `${b.name}: ${entry.value} (${status})`,
          conclusion: `Elevate pathways linked to ${b.name}`,
          weight: status === 'critical' ? 0.22 : 0.14,
          confidence: status === 'critical' ? 90 : 78,
        });
      }
    });
  }

  const topPathway = [...pathwayScores.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topPathway) {
    steps.push({
      id: `r${++idx}`,
      rule: 'PATHWAY_RANK',
      input: 'Weighted pathway scores computed',
      conclusion: `Primary pathway: ${pathwayMeta[topPathway[0]].name} (score ${Math.round(topPathway[1])})`,
      weight: 0.2,
      confidence: Math.min(95, Math.round(topPathway[1])),
    });
  }

  return steps.sort((a, b) => b.weight - a.weight);
}

function buildPathwayPlan(
  pathwayId: PathwayId,
  score: number,
  input: ProtocolEngineInput,
  reasoning: ReasoningStep[],
): PathwayPlan {
  const meta = pathwayMeta[pathwayId];
  const maxCompounds = input.complexity === 'minimal' ? 2 : input.complexity === 'advanced' ? 4 : 3;

  let compoundIds = meta.compoundIds.filter((id) => {
    if (input.budget === 'budget' && ['resveratrol', 'cakg'].includes(id)) return false;
    if (input.existingStack?.includes(id)) return false;
    return true;
  });

  if (input.existingStack?.length) {
    compoundIds = [...new Set([...input.existingStack.filter((id) => meta.compoundIds.includes(id)), ...compoundIds])];
  }

  if (pathwayId === 'nrf2') compoundIds = [...new Set([...stackPresets.nrf2.ids, ...compoundIds])];
  if (pathwayId === 'mito') compoundIds = [...new Set([...stackPresets.mito.ids, ...compoundIds])];

  compoundIds = compoundIds.slice(0, maxCompounds);

  const lifestyleActions: string[] = [];
  if (input.sleep < 70) lifestyleActions.push('7–9h sleep with fixed wake time');
  if (input.exercise < 60) lifestyleActions.push('150+ min Zone 2 weekly + 2× resistance');
  if (input.stress > 55) lifestyleActions.push('10 min daily HRV / breathwork');
  if (lifestyleActions.length === 0) lifestyleActions.push('Maintain protein 1.2–1.6 g/kg + 30g fiber');

  return {
    id: pathwayId,
    name: meta.name,
    description: meta.description,
    hallmarkIds: meta.hallmarkIds,
    compounds: compoundIds.map((id) => {
      const c = compounds.find((x) => x.id === id)!;
      return {
        compoundId: id,
        name: c.name,
        dose: c.dose,
        timing: c.timing,
        evidence: c.evidence,
        rationale: `${meta.name} core — ${c.pathway}`,
      };
    }),
    lifestyleActions,
    confidence: Math.min(98, Math.round(score)),
    priority: Math.round(score),
    reasoning: reasoning.filter((r) => r.rule.includes('GOAL') || r.rule.includes('LAB') || r.rule.includes('PATHWAY')).slice(0, 3),
  };
}

function averageTier(items: EvidenceTier[]): EvidenceTier {
  if (!items.length) return 'C';
  const avg = items.reduce((s, t) => s + (t === 'A' ? 3 : t === 'B' ? 2 : 1), 0) / items.length;
  if (avg >= 2.5) return 'A';
  if (avg >= 1.5) return 'B';
  return 'C';
}

const GLOBAL_DISCLAIMER =
  'Rule-based educational protocol — not AI diagnosis or medical advice. Outputs derive from TNiC evidence tiers, hallmark maps, and published dose ranges. Physician review required before implementation.';

export function runProtocolEngine(input: ProtocolEngineInput): ProtocolEngineOutput {
  const base = generateProtocol(input as ProtocolInput);
  const pathwayScores = scorePathways(input);
  const reasoningChain = buildReasoningChain(input, pathwayScores);

  const rankedPathways = [...pathwayScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, input.complexity === 'minimal' ? 2 : 3);

  const pathwayPlans = rankedPathways.map(([id, score]) =>
    buildPathwayPlan(id, score, input, reasoningChain),
  );

  const foundationPathways = pathwayPlans.slice(0, 1);
  const optimizationPathways = pathwayPlans.slice(0, 2);
  const maintenancePathways = pathwayPlans;

  const phases: ProtocolPhase[] = [
    {
      id: 'foundation',
      label: 'Foundation',
      weeks: '1–4',
      objectives: [
        'Establish AM/PM cadence',
        'Stabilize top-priority pathway',
        'Baseline subjective metrics (energy, sleep, recovery)',
      ],
      pathways: foundationPathways,
      checkpoints: ['Week 2: adherence review', 'Week 4: tolerance check'],
    },
    {
      id: 'optimization',
      label: 'Optimization',
      weeks: '5–12',
      objectives: [
        'Add secondary pathway compounds',
        'Titrate doses per physician guidance',
        'First lab retest window',
      ],
      pathways: optimizationPathways,
      checkpoints: ['Week 8: lifestyle adherence', 'Week 12: priority biomarker retest'],
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      weeks: '13–24',
      objectives: [
        'Consolidate effective interventions',
        'Prune non-responders',
        'Quarterly hallmark review',
      ],
      pathways: maintenancePathways,
      checkpoints: ['Week 16: stack synergy re-score', 'Week 24: full panel retest'],
    },
  ];

  const allCompounds = [...new Set(pathwayPlans.flatMap((p) => p.compounds.map((c) => c.compoundId)))];
  const compoundObjs = allCompounds.map((id) => compounds.find((c) => c.id === id)!);

  const amMasterSchedule = compoundObjs
    .filter((c) => c.timing === 'AM' || c.timing === 'AM/PM')
    .map((c) => `${c.name} — ${c.dose}`);
  const pmMasterSchedule = compoundObjs
    .filter((c) => c.timing === 'PM')
    .map((c) => `${c.name} — ${c.dose}`);

  const avgConfidence = Math.round(
    reasoningChain.reduce((s, r) => s + r.confidence * r.weight, 0) /
      reasoningChain.reduce((s, r) => s + r.weight, 0),
  );

  return {
    generatedAt: new Date().toISOString(),
    confidence: avgConfidence,
    summary: `Multi-pathway plan for age ${input.age}: ${pathwayPlans.map((p) => p.name).join(' → ')}. ${base.summary}`,
    phases,
    hallmarkPriorities: base.hallmarkPriorities,
    amMasterSchedule,
    pmMasterSchedule: pmMasterSchedule.length ? pmMasterSchedule : ['No PM compounds in current plan'],
    monitoringPanel: base.monitoringPanel,
    retestCadence: input.labEntries?.length ? '12-week priority markers, 24-week full panel' : base.retestCadence,
    evidenceTier: averageTier(compoundObjs.map((c) => c.evidence)),
    reasoningChain,
    disclaimer: GLOBAL_DISCLAIMER,
  };
}