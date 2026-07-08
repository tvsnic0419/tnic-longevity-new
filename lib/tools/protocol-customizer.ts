import { biomarkers, compounds, calculateDefenseProfile } from '../data';
import { hallmarkLibrary } from '../hallmarks-library';
import { getLabStatus, type LabEntry } from '../labs';
import { stackPresets } from '../presets';
import type { EvidenceTier } from '../types';

export type ProtocolGoal =
  | 'energy'
  | 'inflammation'
  | 'cognitive'
  | 'longevity'
  | 'recovery'
  | 'epigenetic';

export interface ProtocolInput {
  age: number;
  goals: ProtocolGoal[];
  stress: number;
  sleep: number;
  exercise: number;
  labEntries?: LabEntry[];
}

export interface ProtocolCompound {
  compoundId: string;
  name: string;
  dose: string;
  timing: 'AM' | 'PM' | 'AM/PM';
  rationale: string;
  evidence: EvidenceTier;
  priority: number;
}

export interface LifestyleBlock {
  pillar: string;
  actions: string[];
  hallmarkIds: string[];
  evidence: EvidenceTier;
}

export interface ProtocolOutput {
  presetKey: keyof typeof stackPresets;
  presetLabel: string;
  compounds: ProtocolCompound[];
  lifestyle: LifestyleBlock[];
  hallmarkPriorities: { id: string; title: string; score: number; number: number }[];
  amSchedule: string[];
  pmSchedule: string[];
  monitoringPanel: string[];
  retestCadence: string;
  evidenceTier: EvidenceTier;
  defenseScore: number;
  biologicalAge: number;
  summary: string;
}

const goalHallmarkMap: Record<ProtocolGoal, string[]> = {
  energy: ['mito', 'nutrient', 'proteostasis'],
  inflammation: ['inflammation', 'senescence', 'communication'],
  cognitive: ['proteostasis', 'mito', 'inflammation'],
  longevity: ['mito', 'genomic', 'epigenetic', 'autophagy', 'senescence'],
  recovery: ['proteostasis', 'mito', 'inflammation'],
  epigenetic: ['epigenetic', 'nutrient', 'stem'],
};

const goalCompoundBoost: Record<ProtocolGoal, string[]> = {
  energy: ['nmn', 'cakg', 'rala'],
  inflammation: ['glynac', 'sulforaphane', 'resveratrol'],
  cognitive: ['nmn', 'glynac', 'cakg'],
  longevity: ['glynac', 'nmn', 'cakg', 'sulforaphane'],
  recovery: ['glynac', 'nmn', 'rala'],
  epigenetic: ['cakg', 'nmn', 'resveratrol'],
};

const lifestyleBlocks: LifestyleBlock[] = [
  {
    pillar: 'Sleep',
    actions: ['7–9 hours with fixed wake time', 'No screens 60 min before bed', 'Cool bedroom (65–68°F)'],
    hallmarkIds: ['genomic', 'proteostasis', 'inflammation'],
    evidence: 'A',
  },
  {
    pillar: 'Exercise',
    actions: ['150+ min Zone 2 aerobic weekly', '2× resistance training sessions', '1× VO2max interval session'],
    hallmarkIds: ['mito', 'senescence', 'telomeres', 'nutrient'],
    evidence: 'A',
  },
  {
    pillar: 'Nutrition',
    actions: ['1.2–1.6 g/kg protein daily', '30g+ fiber', 'Methyl donors: B12, folate, choline'],
    hallmarkIds: ['nutrient', 'epigenetic', 'dysbiosis'],
    evidence: 'A',
  },
  {
    pillar: 'Stress',
    actions: ['10 min daily HRV/breathwork', 'Track hs-CRP every 6 months', 'Reduce training load when HRV low'],
    hallmarkIds: ['telomeres', 'inflammation', 'communication'],
    evidence: 'A',
  },
];

function scoreHallmarks(input: ProtocolInput): Map<string, number> {
  const scores = new Map<string, number>();
  const defense = calculateDefenseProfile(input.age, input.stress, input.sleep, input.exercise);

  hallmarkLibrary.forEach((h) => {
    let score = 50;
    input.goals.forEach((g) => {
      if (goalHallmarkMap[g].includes(h.id)) score += 18;
    });
    if (h.id === 'mito' && defense.mito > 60) score += 15;
    if (h.id === 'inflammation' && input.stress > 60) score += 20;
    if (h.id === 'genomic' && input.sleep < 60) score += 15;
    if (h.id === 'mito' && input.exercise < 50) score += 12;
    scores.set(h.id, Math.min(100, score));
  });

  if (input.labEntries?.length) {
    const latest = new Map<string, LabEntry>();
    input.labEntries.forEach((e) => {
      const prev = latest.get(e.markerId);
      if (!prev || e.date > prev.date) latest.set(e.markerId, e);
    });
    latest.forEach((entry, markerId) => {
      const status = getLabStatus(markerId, entry.value);
      const b = biomarkers.find((x) => x.id === markerId);
      if (!b) return;
      b.compounds.forEach(() => {});
      const weight = status === 'critical' ? 25 : status === 'watch' ? 12 : 0;
      biomarkers
        .find((x) => x.id === markerId)
        ?.compounds.forEach((cid) => {
          const c = compounds.find((x) => x.id === cid);
          c?.hallmarks.forEach((hid) => {
            scores.set(hid, Math.min(100, (scores.get(hid) ?? 50) + weight));
          });
        });
    });
  }

  return scores;
}

function rankCompounds(input: ProtocolInput, hallmarkScores: Map<string, number>): ProtocolCompound[] {
  const compoundScores = new Map<string, number>();

  compounds.forEach((c) => {
    let score = 0;
    c.hallmarks.forEach((h) => {
      score += (hallmarkScores.get(h) ?? 0) * 0.15;
    });
    input.goals.forEach((g) => {
      if (goalCompoundBoost[g].includes(c.id)) score += 20;
    });
    if (c.evidence === 'A') score += 10;
    else if (c.evidence === 'B') score += 5;
    compoundScores.set(c.id, score);
  });

  const ranked = [...compoundScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return ranked.map(([id, score], i) => {
    const c = compounds.find((x) => x.id === id)!;
    const topHallmark = c.hallmarks
      .map((h) => ({ h, s: hallmarkScores.get(h) ?? 0 }))
      .sort((a, b) => b.s - a.s)[0];
    const lib = hallmarkLibrary.find((h) => h.id === topHallmark?.h);
    return {
      compoundId: id,
      name: c.name,
      dose: c.dose,
      timing: c.timing,
      rationale: `Targets ${lib?.title ?? topHallmark?.h} (priority score ${Math.round(topHallmark?.s ?? 0)}). Rank score: ${Math.round(score)}.`,
      evidence: c.evidence,
      priority: i + 1,
    };
  });
}

function pickPreset(input: ProtocolInput): keyof typeof stackPresets {
  const defense = calculateDefenseProfile(input.age, input.stress, input.sleep, input.exercise);
  if (input.goals.includes('longevity') || input.goals.length >= 3) return 'hybrid';
  if (input.goals.includes('inflammation') || input.goals.includes('recovery')) return 'nrf2';
  if (input.goals.includes('energy') || input.goals.includes('cognitive')) return 'mito';
  return defense.recommendation === 'mito' ? 'mito' : defense.recommendation === 'nrf2' ? 'nrf2' : 'hybrid';
}

function averageTier(items: EvidenceTier[]): EvidenceTier {
  const avg = items.reduce((s, t) => s + (t === 'A' ? 3 : t === 'B' ? 2 : 1), 0) / items.length;
  if (avg >= 2.5) return 'A';
  if (avg >= 1.5) return 'B';
  return 'C';
}

export function generateProtocol(input: ProtocolInput): ProtocolOutput {
  const hallmarkScores = scoreHallmarks(input);
  const sortedHallmarks = hallmarkLibrary
    .map((h) => ({
      id: h.id,
      title: h.title,
      number: h.number,
      score: hallmarkScores.get(h.id) ?? 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const presetKey = pickPreset(input);
  const preset = stackPresets[presetKey];
  const rankedCompounds = rankCompounds(input, hallmarkScores);

  const presetCompounds = preset.ids.map((id, i) => {
    const c = compounds.find((x) => x.id === id)!;
    const ranked = rankedCompounds.find((r) => r.compoundId === id);
    return {
      compoundId: id,
      name: c.name,
      dose: c.dose,
      timing: c.timing,
      rationale: ranked?.rationale ?? `Core ${preset.label} protocol compound.`,
      evidence: c.evidence,
      priority: i + 1,
    };
  });

  const defense = calculateDefenseProfile(input.age, input.stress, input.sleep, input.exercise);

  const amSchedule = presetCompounds
    .filter((c) => c.timing === 'AM' || c.timing === 'AM/PM')
    .map((c) => `${c.name} — ${c.dose}`);
  const pmSchedule = presetCompounds
    .filter((c) => c.timing === 'PM')
    .map((c) => `${c.name} — ${c.dose}`);

  const monitoringPanel = ['GSH', 'NAD+ index', 'hs-CRP'];
  if (input.goals.includes('inflammation')) monitoringPanel.push('oxLDL');
  if (input.goals.includes('epigenetic')) monitoringPanel.push('AKG');
  if (input.goals.includes('longevity')) monitoringPanel.push('8-OHdG');

  const lifestyle = lifestyleBlocks.filter((block) => {
    if (input.sleep < 70 && block.pillar === 'Sleep') return true;
    if (input.exercise < 60 && block.pillar === 'Exercise') return true;
    if (input.stress > 55 && block.pillar === 'Stress') return true;
    if (input.goals.includes('longevity') || input.goals.includes('epigenetic')) return true;
    return block.pillar === 'Nutrition';
  });

  return {
    presetKey,
    presetLabel: preset.label,
    compounds: presetCompounds,
    lifestyle,
    hallmarkPriorities: sortedHallmarks,
    amSchedule,
    pmSchedule: pmSchedule.length ? pmSchedule : ['No PM compounds in this preset'],
    monitoringPanel: [...new Set(monitoringPanel)],
    retestCadence: input.labEntries?.length ? 'Retest priority markers at 12 weeks' : 'Baseline panel, then 12-week retest',
    evidenceTier: averageTier(presetCompounds.map((c) => c.evidence)),
    defenseScore: defense.defenseScore,
    biologicalAge: defense.biologicalAge,
    summary: `Tailored ${preset.label} protocol for age ${input.age} targeting ${input.goals.join(', ')}. Top hallmark priority: ${sortedHallmarks[0]?.title}. Educational only — bring to your physician.`,
  };
}

export const protocolGoalOptions: { id: ProtocolGoal; label: string; desc: string }[] = [
  { id: 'energy', label: 'Energy & mitochondrial', desc: 'NAD+, ATP production, fatigue' },
  { id: 'inflammation', label: 'Inflammation reduction', desc: 'hs-CRP, inflammaging' },
  { id: 'cognitive', label: 'Cognitive clarity', desc: 'Proteostasis, brain fog' },
  { id: 'longevity', label: 'Full longevity', desc: 'Multi-hallmark coverage' },
  { id: 'recovery', label: 'Recovery & resilience', desc: 'Exercise, oxidative stress' },
  { id: 'epigenetic', label: 'Epigenetic support', desc: 'Biological age, methylation' },
];