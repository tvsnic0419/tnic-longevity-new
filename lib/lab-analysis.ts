import { biomarkers, compounds, hallmarks } from './data';
import { hallmarkLibrary } from './hallmarks-library';
import {
  biomarkerHallmarkMap,
  getLabStatus,
  getLatestByMarker,
  getMarkerTrend,
  type LabEntry,
} from './labs';

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high';

export interface MarkerSnapshot {
  markerId: string;
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'watch' | 'critical';
  trend: 'improving' | 'declining' | 'stable' | 'unknown';
  date: string;
  readingCount: number;
}

export interface HallmarkRisk {
  hallmarkId: string;
  hallmarkTitle: string;
  hallmarkNumber: number;
  riskLevel: RiskLevel;
  riskScore: number;
  drivingMarkers: { markerId: string; name: string; status: string; value: number }[];
  prognosis: string;
  priorityInterventions: string[];
}

export interface LabRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'compound' | 'lifestyle' | 'monitoring' | 'clinical';
  title: string;
  rationale: string;
  action: string;
  compoundId?: string;
  hallmarkIds: string[];
}

export interface LabAnalysisResult {
  healthspanScore: number;
  dataCompleteness: number;
  markersTracked: number;
  markersOptimal: number;
  markersWatch: number;
  markersCritical: number;
  snapshots: MarkerSnapshot[];
  hallmarkRisks: HallmarkRisk[];
  recommendations: LabRecommendation[];
  topConcern: string | null;
  topWin: string | null;
}

const statusWeight = { optimal: 0, watch: 45, critical: 85 };

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 70) return 'high';
  if (score >= 45) return 'elevated';
  if (score >= 20) return 'moderate';
  return 'low';
}

function buildSnapshots(entries: LabEntry[]): MarkerSnapshot[] {
  const latest = getLatestByMarker(entries);
  return biomarkers
    .map((b) => {
      const entry = latest.get(b.id);
      if (!entry) return null;
      const markerEntries = entries.filter((e) => e.markerId === b.id);
      return {
        markerId: b.id,
        name: b.name,
        value: entry.value,
        unit: b.unit,
        status: getLabStatus(b.id, entry.value),
        trend: getMarkerTrend(entries, b.id),
        date: entry.date,
        readingCount: markerEntries.length,
      };
    })
    .filter((x): x is MarkerSnapshot => x !== null);
}

function buildHallmarkRisks(snapshots: MarkerSnapshot[]): HallmarkRisk[] {
  const hallmarkIds = [...new Set(Object.values(biomarkerHallmarkMap).flat())];

  const results: HallmarkRisk[] = [];

  for (const hallmarkId of hallmarkIds) {
    const lib = hallmarkLibrary.find((h) => h.id === hallmarkId);
    const hallmarkMeta = hallmarks.find((h) => h.id === hallmarkId);
    const drivingMarkers = snapshots.filter((s) =>
      biomarkerHallmarkMap[s.markerId]?.includes(hallmarkId),
    );

    if (drivingMarkers.length === 0) continue;

    const riskScore = Math.round(
      drivingMarkers.reduce((sum, m) => sum + statusWeight[m.status], 0) / drivingMarkers.length,
    );

    const worst = [...drivingMarkers].sort(
      (a, b) => statusWeight[b.status] - statusWeight[a.status],
    )[0];

    const interventions = lib?.interventions
      .filter((i) => i.tnicAvailable)
      .slice(0, 3)
      .map((i) => i.name) ?? [];

    let prognosis: string;
    const level = riskLevelFromScore(riskScore);
    if (level === 'high') {
      prognosis = `${hallmarkMeta?.title ?? hallmarkId} is under significant stress. ${worst.name} at ${worst.value} ${worst.unit} is the primary driver. Address within 4–8 weeks to prevent compounding damage across related hallmarks.`;
    } else if (level === 'elevated') {
      prognosis = `${hallmarkMeta?.title ?? hallmarkId} shows early warning signals. Trend monitoring recommended — ${worst.trend === 'declining' ? 'current trajectory is unfavorable' : worst.trend === 'improving' ? 'recent trend is positive' : 'stable but not yet optimal'}.`;
    } else if (level === 'moderate') {
      prognosis = `${hallmarkMeta?.title ?? hallmarkId} is in acceptable range with room for optimization. Maintenance protocol appropriate.`;
    } else {
      prognosis = `${hallmarkMeta?.title ?? hallmarkId} biomarkers are well-supported. Continue current protocol and re-test in 3–6 months.`;
    }

    results.push({
      hallmarkId,
      hallmarkTitle: lib?.title ?? hallmarkMeta?.title ?? hallmarkId,
      hallmarkNumber: lib?.number ?? 0,
      riskLevel: level,
      riskScore,
      drivingMarkers: drivingMarkers.map((m) => ({
        markerId: m.markerId,
        name: m.name,
        status: m.status,
        value: m.value,
      })),
      prognosis,
      priorityInterventions: interventions,
    });
  }

  return results.sort((a, b) => b.riskScore - a.riskScore);
}

function buildRecommendations(
  snapshots: MarkerSnapshot[],
  selectedCompoundIds: string[],
  hallmarkRisks: HallmarkRisk[],
): LabRecommendation[] {
  const recs: LabRecommendation[] = [];

  for (const snap of snapshots) {
    const b = biomarkers.find((x) => x.id === snap.markerId)!;
    const linkedHallmarks = biomarkerHallmarkMap[snap.markerId] ?? [];

    if (snap.status === 'critical') {
      const missingCompounds = b.compounds.filter((id) => !selectedCompoundIds.includes(id));
      for (const compoundId of missingCompounds.slice(0, 2)) {
        const compound = compounds.find((c) => c.id === compoundId);
        if (!compound) continue;
        recs.push({
          id: `crit-${snap.markerId}-${compoundId}`,
          priority: 'high',
          category: 'compound',
          title: `Add ${compound.name} for ${snap.name}`,
          rationale: `${snap.name} is critical at ${snap.value} ${snap.unit} (optimal: ${b.optimal}). ${compound.name} directly targets this marker via ${compound.pathway}.`,
          action: `Consider ${compound.dose} (${compound.timing}) — consult physician first.`,
          compoundId,
          hallmarkIds: linkedHallmarks,
        });
      }
      recs.push({
        id: `clinical-${snap.markerId}`,
        priority: 'high',
        category: 'clinical',
        title: `Physician review for ${snap.name}`,
        rationale: `Critical ${snap.name} may indicate underlying pathology beyond supplementation scope.`,
        action: 'Share TNiC lab export with your clinician within 2 weeks.',
        hallmarkIds: linkedHallmarks,
      });
    }

    if (snap.status === 'watch') {
      const targeting = b.compounds.find((id) => selectedCompoundIds.includes(id));
      if (targeting) {
        recs.push({
          id: `watch-maintain-${snap.markerId}`,
          priority: 'medium',
          category: 'monitoring',
          title: `Maintain ${compounds.find((c) => c.id === targeting)?.name} for ${snap.name}`,
          rationale: `${snap.name} is in watch range. Your active stack already targets this marker — consistency for 8–12 weeks before adjusting.`,
          action: 'Re-test at 12 weeks. Log weekly subjective energy/recovery.',
          hallmarkIds: linkedHallmarks,
        });
      } else {
        const topCompound = b.compounds[0];
        const compound = compounds.find((c) => c.id === topCompound);
        if (compound) {
          recs.push({
            id: `watch-add-${snap.markerId}`,
            priority: 'medium',
            category: 'compound',
            title: `Consider ${compound.name} for ${snap.name}`,
            rationale: `${snap.name} at ${snap.value} ${snap.unit} is below optimal. Not currently in your active stack.`,
            action: `Evaluate adding ${compound.name} (${compound.dose}).`,
            compoundId: topCompound,
            hallmarkIds: linkedHallmarks,
          });
        }
      }
    }

    if (snap.trend === 'declining' && snap.status !== 'optimal') {
      recs.push({
        id: `trend-${snap.markerId}`,
        priority: 'medium',
        category: 'monitoring',
        title: `${snap.name} trending unfavorably`,
        rationale: `Latest reading (${snap.value} ${snap.unit}) is moving away from optimal. Early intervention prevents hallmark cascade.`,
        action: 'Review dosing consistency, sleep, and stress. Re-test in 4–6 weeks.',
        hallmarkIds: linkedHallmarks,
      });
    }

    if (snap.trend === 'improving') {
      recs.push({
        id: `win-${snap.markerId}`,
        priority: 'low',
        category: 'monitoring',
        title: `${snap.name} improving — stay the course`,
        rationale: `Positive trend detected. Current protocol appears effective for ${snap.name}.`,
        action: 'Maintain current stack. Document what changed (dose, timing, lifestyle).',
        hallmarkIds: linkedHallmarks,
      });
    }
  }

  const highRiskHallmarks = hallmarkRisks.filter((h) => h.riskLevel === 'high' || h.riskLevel === 'elevated');
  for (const hr of highRiskHallmarks.slice(0, 2)) {
    if (!recs.some((r) => r.hallmarkIds.includes(hr.hallmarkId) && r.priority === 'high')) {
      recs.push({
        id: `hallmark-${hr.hallmarkId}`,
        priority: hr.riskLevel === 'high' ? 'high' : 'medium',
        category: 'lifestyle',
        title: `Address ${hr.hallmarkTitle} risk`,
        rationale: hr.prognosis,
        action: hr.priorityInterventions.length
          ? `Priority interventions: ${hr.priorityInterventions.join(' · ')}`
          : 'Review hallmark deep dive in Anti-Aging Library.',
        hallmarkIds: [hr.hallmarkId],
      });
    }
  }

  if (snapshots.length < 3) {
    recs.push({
      id: 'complete-panel',
      priority: 'low',
      category: 'monitoring',
      title: 'Expand your biomarker panel',
      rationale: `Only ${snapshots.length} of 8 TNiC longevity markers logged. Broader data improves hallmark risk accuracy.`,
      action: 'Add hs-CRP, glutathione, and NAD+ index from your next blood draw.',
      hallmarkIds: [],
    });
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recs
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 12);
}

export function analyzeLabs(
  entries: LabEntry[],
  selectedCompoundIds: string[] = [],
): LabAnalysisResult {
  const snapshots = buildSnapshots(entries);
  const hallmarkRisks = buildHallmarkRisks(snapshots);
  const recommendations = buildRecommendations(snapshots, selectedCompoundIds, hallmarkRisks);

  const markersOptimal = snapshots.filter((s) => s.status === 'optimal').length;
  const markersWatch = snapshots.filter((s) => s.status === 'watch').length;
  const markersCritical = snapshots.filter((s) => s.status === 'critical').length;

  const healthspanScore = snapshots.length
    ? Math.round(
        snapshots.reduce((sum, s) => sum + (100 - statusWeight[s.status]), 0) / snapshots.length,
      )
    : 0;

  const dataCompleteness = Math.round((snapshots.length / biomarkers.length) * 100);

  const topConcern = snapshots
    .sort((a, b) => statusWeight[b.status] - statusWeight[a.status])[0];
  const topWin = snapshots.find((s) => s.status === 'optimal' && s.trend === 'improving');

  return {
    healthspanScore,
    dataCompleteness,
    markersTracked: snapshots.length,
    markersOptimal,
    markersWatch,
    markersCritical,
    snapshots,
    hallmarkRisks,
    recommendations,
    topConcern: topConcern
      ? `${topConcern.name} (${topConcern.status})`
      : null,
    topWin: topWin ? `${topWin.name} improving` : null,
  };
}