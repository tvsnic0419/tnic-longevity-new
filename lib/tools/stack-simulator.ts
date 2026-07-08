import { compounds, safetyNotes } from '../data';
import {
  analyzeStack,
  stackInteractions,
  type StackAnalysis,
  type StackInteraction,
} from '../stack-analysis';
import type { EvidenceTier } from '../types';

export interface PersonalizedDose {
  compoundId: string;
  name: string;
  baseDose: string;
  adjustedDose: string;
  timing: 'AM' | 'PM' | 'AM/PM';
  adjustmentReason?: string;
  evidence: EvidenceTier;
}

export interface SideEffectRisk {
  id: string;
  compoundId: string;
  compoundName: string;
  risk: string;
  severity: 'low' | 'medium' | 'high';
  category: 'caution' | 'avoid' | 'consult' | 'interaction';
  evidenceNote: string;
}

export interface HallmarkRadarPoint {
  hallmark: string;
  coverage: number;
  fullMark: 100;
}

export interface StackSimulatorResult {
  analysis: StackAnalysis;
  personalizedDoses: PersonalizedDose[];
  sideEffectRisks: SideEffectRisk[];
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
  hallmarkRadar: HallmarkRadarPoint[];
  dosingSchedule: { am: PersonalizedDose[]; pm: PersonalizedDose[] };
  summaryVerdict: string;
}

const HALLMARK_LABELS: Record<string, string> = {
  genomic: 'Genomic',
  telomeres: 'Telomeres',
  epigenetic: 'Epigenetic',
  proteostasis: 'Proteostasis',
  autophagy: 'Autophagy',
  mito: 'Mitochondrial',
  senescence: 'Senescence',
  stem: 'Stem cells',
  signaling: 'Signaling',
  inflammation: 'Inflammation',
  gut: 'Microbiome',
  nutrient: 'Nutrient sensing',
};

function adjustDoseForAge(compoundId: string, baseDose: string, age: number): { dose: string; reason?: string } {
  if (age >= 70) {
    if (compoundId === 'nmn') return { dose: '250 mg NMN', reason: 'Conservative start ≥70 — trial dose lower bound' };
    if (compoundId === 'cakg') return { dose: '1 g Ca-AKG', reason: 'Reduced Ca-AKG for older adults — titrate up' };
    if (compoundId === 'rala') return { dose: '300 mg R-ALA', reason: 'Lower R-ALA entry at ≥70' };
  }
  if (age >= 55 && compoundId === 'nmn') {
    return { dose: '250–500 mg NMN', reason: 'Standard trial range for 55+' };
  }
  if (age < 35 && compoundId === 'nmn') {
    return { dose: '250 mg NMN', reason: 'Younger baseline — start at trial minimum' };
  }
  return { dose: baseDose };
}

function buildSideEffectRisks(selectedIds: string[], interactions: StackInteraction[]): SideEffectRisk[] {
  const risks: SideEffectRisk[] = [];

  selectedIds.forEach((id) => {
    const compound = compounds.find((c) => c.id === id);
    const note = safetyNotes.find((n) => n.compoundId === id);
    if (!compound || !note) return;

    note.cautions.forEach((c, i) => {
      risks.push({
        id: `${id}-caution-${i}`,
        compoundId: id,
        compoundName: compound.name,
        risk: c,
        severity: 'low',
        category: 'caution',
        evidenceNote: `Tier ${compound.evidence} — listed in TNiC safety profile`,
      });
    });
    note.avoidIf.forEach((a, i) => {
      risks.push({
        id: `${id}-avoid-${i}`,
        compoundId: id,
        compoundName: compound.name,
        risk: a,
        severity: 'high',
        category: 'avoid',
        evidenceNote: 'Absolute caution — consult physician before use',
      });
    });
    note.consultIf.forEach((c, i) => {
      risks.push({
        id: `${id}-consult-${i}`,
        compoundId: id,
        compoundName: compound.name,
        risk: c,
        severity: 'medium',
        category: 'consult',
        evidenceNote: 'Physician consultation recommended',
      });
    });
  });

  interactions
    .filter((i) => i.type !== 'synergy')
    .forEach((i, idx) => {
      const names = i.compoundIds.map((id) => compounds.find((c) => c.id === id)?.name ?? id).join(' + ');
      risks.push({
        id: `interaction-${idx}`,
        compoundId: i.compoundIds.join(','),
        compoundName: names,
        risk: `${i.title}: ${i.detail}`,
        severity: i.severity,
        category: 'interaction',
        evidenceNote: 'Pair-level interaction from TNiC interaction database',
      });
    });

  return risks.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });
}

function computeRiskScore(risks: SideEffectRisk[]): { score: number; level: StackSimulatorResult['riskLevel'] } {
  const score = risks.reduce((sum, r) => {
    if (r.severity === 'high') return sum + 25;
    if (r.severity === 'medium') return sum + 12;
    return sum + 4;
  }, 0);
  const capped = Math.min(100, score);
  let level: StackSimulatorResult['riskLevel'] = 'low';
  if (capped >= 60) level = 'high';
  else if (capped >= 35) level = 'elevated';
  else if (capped >= 15) level = 'moderate';
  return { score: capped, level };
}

function buildHallmarkRadar(selectedIds: string[]): HallmarkRadarPoint[] {
  const selected = compounds.filter((c) => selectedIds.includes(c.id));
  const covered = new Set(selected.flatMap((c) => c.hallmarks));

  return Object.entries(HALLMARK_LABELS).map(([id, label]) => ({
    hallmark: label,
    coverage: covered.has(id) ? 100 : 0,
    fullMark: 100,
  }));
}

export function simulateStack(
  selectedIds: string[],
  age: number = 48,
): StackSimulatorResult {
  const analysis = analyzeStack(selectedIds);
  const selected = compounds.filter((c) => selectedIds.includes(c.id));

  const personalizedDoses: PersonalizedDose[] = selected.map((c) => {
    const { dose, reason } = adjustDoseForAge(c.id, c.dose, age);
    return {
      compoundId: c.id,
      name: c.name,
      baseDose: c.dose,
      adjustedDose: dose,
      timing: c.timing,
      adjustmentReason: reason,
      evidence: c.evidence,
    };
  });

  const sideEffectRisks = buildSideEffectRisks(selectedIds, analysis.interactions);
  const { score: riskScore, level: riskLevel } = computeRiskScore(sideEffectRisks);

  const am = personalizedDoses.filter((d) => d.timing === 'AM' || d.timing === 'AM/PM');
  const pm = personalizedDoses.filter((d) => d.timing === 'PM');

  let summaryVerdict: string;
  if (selectedIds.length === 0) {
    summaryVerdict = 'Select compounds to simulate synergy, dosing, and risk profile.';
  } else if (analysis.score >= 75 && riskLevel === 'low') {
    summaryVerdict = 'Strong synergy with low interaction risk. Evidence-graded protocol suitable for physician review.';
  } else if (riskLevel === 'high' || riskLevel === 'elevated') {
    summaryVerdict = 'Elevated interaction or contraindication risk — resolve cautions with your physician before starting.';
  } else if (analysis.score < 50) {
    summaryVerdict = 'Limited synergy detected. Consider adding complementary compounds from synergy guides.';
  } else {
    summaryVerdict = 'Moderate stack profile. Review personalized dosing and monitoring checklist.';
  }

  return {
    analysis,
    personalizedDoses,
    sideEffectRisks,
    riskScore,
    riskLevel,
    hallmarkRadar: buildHallmarkRadar(selectedIds),
    dosingSchedule: { am, pm },
    summaryVerdict,
  };
}

export function formatSimulatorExport(
  result: StackSimulatorResult,
  shareUrl: string,
  age: number,
): string {
  const { analysis, dosingSchedule, riskLevel, riskScore } = result;
  const am = dosingSchedule.am;
  const pm = dosingSchedule.pm;

  const lines = [
    '═══════════════════════════════════════',
    '  TNiC STACK SIMULATOR EXPORT',
    '  tnic.help/tools — Educational only',
    '═══════════════════════════════════════',
    '',
    `Age (dose adjustment): ${age}`,
    `Synergy Score: ${analysis.score}/100`,
    `Risk Index: ${riskScore}/100 (${riskLevel})`,
    `Evidence Tier: ${analysis.evidenceTier}`,
    `Hallmark Coverage: ${analysis.hallmarkCount}/12`,
    `Est. Monthly Cost: $${analysis.monthlyCost.low}–$${analysis.monthlyCost.high}`,
    `Share URL: ${shareUrl}`,
    '',
    '── AM PROTOCOL (age-adjusted) ──',
    ...(am.length ? am.map((d) => `  • ${d.name} — ${d.adjustedDose}${d.adjustmentReason ? ` (${d.adjustmentReason})` : ''}`) : ['  (none)']),
    '',
    '── PM PROTOCOL (age-adjusted) ──',
    ...(pm.length ? pm.map((d) => `  • ${d.name} — ${d.adjustedDose}`) : ['  (none)']),
    '',
    '── TOP RISKS ──',
    ...(result.sideEffectRisks.slice(0, 8).length
      ? result.sideEffectRisks.slice(0, 8).map((r) => `  [${r.severity}] ${r.compoundName}: ${r.risk}`)
      : ['  (none flagged)']),
    '',
    result.summaryVerdict,
    '',
    'Not medical advice. Consult your physician before starting any protocol.',
    `Exported: ${new Date().toISOString()}`,
  ];

  return lines.join('\n');
}

export { stackInteractions, HALLMARK_LABELS };