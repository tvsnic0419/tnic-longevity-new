import { biomarkers, calculateDefenseProfile, degradationMetrics } from '../data';
import { analyzeStack } from '../stack-analysis';
import { getLabStatus, type LabEntry } from '../labs';

export interface HealthspanInput {
  age: number;
  stress: number;
  sleep: number;
  exercise: number;
  stackIds: string[];
  labEntries?: LabEntry[];
}

export interface ProjectionPoint {
  week: number;
  label: string;
  healthspanScore: number;
  biologicalAge: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface HealthspanEstimate {
  currentHealthspanScore: number;
  projectedHealthspanScore12w: number;
  projectedHealthspanScore24w: number;
  biologicalAge: number;
  chronologicalAge: number;
  ageDelta: number;
  projectedAgeDelta12w: number;
  projectedAgeDelta24w: number;
  projections: ProjectionPoint[];
  drivers: { label: string; impact: number; direction: 'positive' | 'negative' }[];
  dataConfidence: number;
  summary: string;
  disclaimer: string;
}

function labHealthspanContribution(entries: LabEntry[]): { score: number; completeness: number } {
  if (!entries.length) return { score: 0, completeness: 0 };

  const latest = new Map<string, LabEntry>();
  entries.forEach((e) => {
    const prev = latest.get(e.markerId);
    if (!prev || e.date > prev.date) latest.set(e.markerId, e);
  });

  let optimal = 0;
  let watch = 0;
  let critical = 0;

  latest.forEach((entry, markerId) => {
    const status = getLabStatus(markerId, entry.value);
    if (status === 'optimal') optimal++;
    else if (status === 'watch') watch++;
    else critical++;
  });

  const tracked = latest.size;
  const completeness = tracked / biomarkers.length;
  const markerScore = tracked > 0
    ? Math.round(((optimal * 100 + watch * 55 + critical * 15) / tracked))
    : 50;

  return { score: markerScore, completeness };
}

export function estimateHealthspan(input: HealthspanInput): HealthspanEstimate {
  const defense = calculateDefenseProfile(input.age, input.stress, input.sleep, input.exercise);
  const stack = analyzeStack(input.stackIds);
  const degradation = degradationMetrics(input.age);
  const lab = labHealthspanContribution(input.labEntries ?? []);

  const lifestyleScore = Math.round(
    (input.sleep * 0.35 + input.exercise * 0.35 + (100 - input.stress) * 0.3),
  );

  const stackBoost = Math.min(18, stack.score * 0.15 + stack.hallmarkCount * 1.2);
  const labBoost = lab.score > 0 ? (lab.score - 50) * 0.2 * lab.completeness : 0;

  const currentHealthspanScore = Math.round(
    Math.min(95, Math.max(20,
      defense.defenseScore * 0.45 +
      lifestyleScore * 0.3 +
      degradation.defense * 0.15 +
      stackBoost +
      labBoost,
    )),
  );

  const weeklyGain = (stackIds: string[]) => {
    let gain = 0;
    if (stackIds.length >= 3) gain += 0.35;
    if (input.sleep >= 70) gain += 0.2;
    if (input.exercise >= 60) gain += 0.25;
    if (input.stress <= 45) gain += 0.15;
    if (lab.completeness >= 0.5) gain += 0.1;
    return gain;
  };

  const gain = weeklyGain(input.stackIds);
  const score12 = Math.min(98, Math.round(currentHealthspanScore + gain * 12));
  const score24 = Math.min(98, Math.round(currentHealthspanScore + gain * 20));

  const bioAgeNow = defense.biologicalAge;
  const bioAge12 = Math.round(bioAgeNow - gain * 12 * 0.08);
  const bioAge24 = Math.round(bioAgeNow - gain * 20 * 0.1);

  const ageDelta = input.age - bioAgeNow;
  const projectedAgeDelta12w = input.age - bioAge12;
  const projectedAgeDelta24w = input.age - bioAge24;

  const dataConfidence = Math.round(
    (input.labEntries?.length ? 30 : 0) +
    (input.stackIds.length ? 25 : 0) +
    25 +
    (input.sleep > 0 ? 10 : 0) +
    (input.exercise > 0 ? 10 : 0),
  );

  const projections: ProjectionPoint[] = [
    { week: 0, label: 'Now', healthspanScore: currentHealthspanScore, biologicalAge: bioAgeNow, confidence: 'high' },
    { week: 4, label: 'Week 4', healthspanScore: Math.round(currentHealthspanScore + gain * 3), biologicalAge: Math.round(bioAgeNow - gain * 3 * 0.05), confidence: 'medium' },
    { week: 12, label: 'Week 12', healthspanScore: score12, biologicalAge: bioAge12, confidence: 'medium' },
    { week: 24, label: 'Week 24', healthspanScore: score24, biologicalAge: bioAge24, confidence: dataConfidence >= 60 ? 'medium' : 'low' },
  ];

  const drivers: HealthspanEstimate['drivers'] = [
    { label: 'Lifestyle (sleep, exercise, stress)', impact: lifestyleScore, direction: lifestyleScore >= 60 ? 'positive' : 'negative' },
    { label: 'Stack synergy & coverage', impact: stack.score, direction: stack.score >= 50 ? 'positive' : 'negative' },
    { label: 'Age-related degradation', impact: degradation.defense, direction: degradation.defense >= 50 ? 'positive' : 'negative' },
  ];
  if (lab.completeness > 0) {
    drivers.push({ label: 'Lab biomarker status', impact: lab.score, direction: lab.score >= 60 ? 'positive' : 'negative' });
  }

  let summary: string;
  if (currentHealthspanScore >= 75) {
    summary = `Strong healthspan foundation at age ${input.age}. Projected ${projectedAgeDelta24w - ageDelta >= 1 ? `+${projectedAgeDelta24w - ageDelta} year` : 'modest'} biological age improvement over 24 weeks with protocol adherence.`;
  } else if (currentHealthspanScore >= 55) {
    summary = `Moderate healthspan profile. Biggest levers: ${input.sleep < 65 ? 'sleep' : input.exercise < 55 ? 'exercise' : 'stack optimization'}. Projections assume consistent adherence — not guaranteed outcomes.`;
  } else {
    summary = `Significant room for improvement. Prioritize lifestyle pillars before expanding stack. Biological age estimate: ${bioAgeNow} (chrono ${input.age}).`;
  }

  return {
    currentHealthspanScore,
    projectedHealthspanScore12w: score12,
    projectedHealthspanScore24w: score24,
    biologicalAge: bioAgeNow,
    chronologicalAge: input.age,
    ageDelta,
    projectedAgeDelta12w,
    projectedAgeDelta24w,
    projections,
    drivers,
    dataConfidence,
    summary,
    disclaimer:
      'Educational model only — not a medical prediction. Based on published trial timelines and TNiC mechanistic scoring. Individual results vary. Consult your physician.',
  };
}