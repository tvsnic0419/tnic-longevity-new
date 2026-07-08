import { biomarkers } from '../data';
import { analyzeLabs } from '../lab-analysis';
import { getLabStatus, isTrendGood, type LabEntry } from '../labs';
import { calculateBiomarkerImpact } from './biomarker-impact';
import type {
  BiomarkerDashboardResult,
  ForecastPoint,
  InterventionForecast,
  MarkerTrendSeries,
  TrendPoint,
} from './types';

const FORECAST_DISCLAIMER =
  'Illustrative trend projection based on published effect sizes and TNiC impact weights — NOT a clinical prediction. Actual biomarker response depends on genetics, adherence, comorbidities, and lab methodology. Use for educational planning only; always interpret with your physician.';

const GLOBAL_DISCLAIMER =
  'Dynamic biomarker dashboard for educational trend exploration. Forecasts are modeled scenarios, not guarantees. Never use for diagnosis, treatment, or medication decisions.';

/** Weekly impact coefficients (conservative, evidence-discounted) */
const weeklyImpactCoeff: Record<string, number> = {
  gsh: 0.018,
  nad: 0.012,
  hscrp: -0.025,
  oxldl: -0.015,
  akg: 0.01,
  '8ohdg': -0.02,
};

function buildTrendSeries(entries: LabEntry[], markerId: string): MarkerTrendSeries {
  const b = biomarkers.find((x) => x.id === markerId)!;
  const sorted = entries
    .filter((e) => e.markerId === markerId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const points: TrendPoint[] = sorted.map((e) => ({
    date: e.date,
    value: e.value,
    status: getLabStatus(markerId, e.value),
  }));

  let slopePerMonth = 0;
  let trend: MarkerTrendSeries['trend'] = 'unknown';

  if (sorted.length >= 2) {
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const months =
      (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (months > 0) {
      slopePerMonth = (last.value - first.value) / months;
    }
    if (last.value === first.value) trend = 'stable';
    else {
      const direction = last.value > first.value ? 'up' : 'down';
      trend = isTrendGood(markerId, direction) ? 'improving' : 'declining';
    }
  }

  const latest = sorted[sorted.length - 1];

  return {
    markerId,
    markerName: b.name,
    unit: b.unit,
    optimal: b.optimal,
    points,
    trend,
    slopePerMonth: Math.round(slopePerMonth * 1000) / 1000,
    latestValue: latest?.value ?? null,
    latestStatus: latest ? getLabStatus(markerId, latest.value) : 'none',
  };
}

function generateForecastPoints(
  startValue: number,
  markerId: string,
  weeklyDelta: number,
  horizonWeeks: number,
  uncertainty: number,
): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  for (let w = 0; w <= horizonWeeks; w += horizonWeeks <= 12 ? 2 : 4) {
    const drift = weeklyDelta * w;
    const value = Math.max(0, startValue + drift);
    const band = uncertainty * Math.sqrt(w / 4 + 1);
    points.push({
      week: w,
      value: Math.round(value * 100) / 100,
      bandLow: Math.round((value - band) * 100) / 100,
      bandHigh: Math.round((value + band) * 100) / 100,
    });
  }
  return points;
}

function buildForecasts(
  series: MarkerTrendSeries,
  selectedCompoundIds: string[],
  horizonWeeks: number,
): InterventionForecast[] {
  const impact = calculateBiomarkerImpact(series.markerId);
  if (!impact || series.latestValue === null) return [];

  const forecasts: InterventionForecast[] = [];
  const startValue = series.latestValue;
  const coeff = weeklyImpactCoeff[series.markerId] ?? 0.01;
  const baselineSlope = series.slopePerMonth / 4.33;

  forecasts.push({
    id: `baseline-${series.markerId}`,
    markerId: series.markerId,
    interventionName: 'Current trajectory (no change)',
    category: 'baseline',
    impactScore: 0,
    expectedDelta: Math.round(baselineSlope * horizonWeeks * 4.33 * 100) / 100,
    timeframeWeeks: horizonWeeks,
    disclaimer: FORECAST_DISCLAIMER,
    baseline: generateForecastPoints(startValue, series.markerId, baselineSlope, horizonWeeks, 0.15),
    projected: generateForecastPoints(startValue, series.markerId, baselineSlope, horizonWeeks, 0.2),
  });

  const topInterventions = [...impact.interventions, ...impact.lifestyleModifiers]
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3);

  topInterventions.forEach((intervention) => {
    const impactMultiplier = intervention.impactScore / 100;
    const weeklyDelta =
      coeff * impactMultiplier * (intervention.expectedDirection === 'decrease' ? -1 : 1);
    const alreadyActive =
      intervention.category === 'compound' &&
      intervention.compoundId &&
      selectedCompoundIds.includes(intervention.compoundId);

    const effectiveDelta = alreadyActive ? weeklyDelta * 0.6 : weeklyDelta;

    forecasts.push({
      id: `forecast-${series.markerId}-${intervention.id}`,
      markerId: series.markerId,
      interventionName: alreadyActive
        ? `${intervention.name} (already in stack — diminished marginal gain)`
        : intervention.name,
      category: intervention.category,
      impactScore: intervention.impactScore,
      expectedDelta: Math.round(effectiveDelta * horizonWeeks * 100) / 100,
      timeframeWeeks: horizonWeeks,
      disclaimer: FORECAST_DISCLAIMER,
      baseline: generateForecastPoints(startValue, series.markerId, baselineSlope, horizonWeeks, 0.15),
      projected: generateForecastPoints(
        startValue,
        series.markerId,
        baselineSlope + effectiveDelta,
        horizonWeeks,
        0.25 * impactMultiplier,
      ),
    });
  });

  return forecasts;
}

export function runBiomarkerDashboard(
  entries: LabEntry[],
  selectedCompoundIds: string[],
  selectedMarkerId: string,
  horizonWeeks: 12 | 24 | 36 = 24,
): BiomarkerDashboardResult {
  const analysis = analyzeLabs(entries, selectedCompoundIds);

  const series = biomarkers.map((b) => buildTrendSeries(entries, b.id));

  const activeSeries = series.find((s) => s.markerId === selectedMarkerId) ?? series[0];
  const forecasts = activeSeries
    ? buildForecasts(activeSeries, selectedCompoundIds, horizonWeeks)
    : [];

  return {
    generatedAt: new Date().toISOString(),
    healthspanScore: analysis.healthspanScore,
    dataCompleteness: analysis.dataCompleteness,
    series,
    forecasts,
    selectedMarkerId: activeSeries?.markerId ?? selectedMarkerId,
    topConcern: analysis.topConcern,
    topWin: analysis.topWin,
    globalDisclaimer: GLOBAL_DISCLAIMER,
  };
}

/** Seed demo data when user has no labs */
export function getDemoLabEntries(): LabEntry[] {
  return [
    { id: 'demo-1', markerId: 'gsh', value: 4.2, date: '2025-10-15' },
    { id: 'demo-2', markerId: 'gsh', value: 4.8, date: '2026-01-20' },
    { id: 'demo-3', markerId: 'gsh', value: 5.1, date: '2026-04-10' },
    { id: 'demo-4', markerId: 'hscrp', value: 2.4, date: '2025-10-15' },
    { id: 'demo-5', markerId: 'hscrp', value: 1.6, date: '2026-01-20' },
    { id: 'demo-6', markerId: 'hscrp', value: 1.1, date: '2026-04-10' },
    { id: 'demo-7', markerId: 'nad', value: 62, date: '2026-01-20' },
    { id: 'demo-8', markerId: 'nad', value: 71, date: '2026-04-10' },
  ];
}