'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  FlaskConical,
  Activity,
} from 'lucide-react';
import { biomarkers } from '@/lib/data';
import { usePlatform } from '@/context/PlatformContext';
import { useToolsStore } from '@/stores/toolsStore';
import {
  runBiomarkerDashboard,
  getDemoLabEntries,
} from '@/lib/tools/biomarker-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ToolDisclaimer } from './ToolDisclaimer';
import { cn } from '@/lib/utils';

const statusBadge = (s: string) => {
  if (s === 'optimal') return 'success' as const;
  if (s === 'watch') return 'warning' as const;
  if (s === 'critical') return 'danger' as const;
  return 'default' as const;
};

const trendIcon = (t: string) => {
  if (t === 'improving') return <TrendingUp className="w-4 h-4 text-accent-emerald" />;
  if (t === 'declining') return <TrendingDown className="w-4 h-4 text-accent-rose" />;
  if (t === 'stable') return <Minus className="w-4 h-4 text-muted-foreground" />;
  return <Activity className="w-4 h-4 text-muted-foreground" />;
};

export function BiomarkerDashboardTool() {
  const { labs, selected } = usePlatform();
  const {
    dashboardMarkerId,
    forecastHorizonWeeks,
    showForecastBands,
    setDashboardMarkerId,
    setForecastHorizonWeeks,
    setShowForecastBands,
  } = useToolsStore();

  const [useDemo, setUseDemo] = useState(labs.length === 0);

  const entries = useMemo(() => (useDemo ? getDemoLabEntries() : labs), [useDemo, labs]);

  const dashboard = useMemo(
    () =>
      runBiomarkerDashboard(entries, selected, dashboardMarkerId, forecastHorizonWeeks),
    [entries, selected, dashboardMarkerId, forecastHorizonWeeks],
  );

  const activeSeries = dashboard.series.find((s) => s.markerId === dashboard.selectedMarkerId);
  const primaryForecast = dashboard.forecasts[0];
  const topIntervention = dashboard.forecasts.find((f) => f.category !== 'baseline');

  const trendChartData = activeSeries?.points.map((p) => ({
    date: p.date.slice(5),
    value: p.value,
    status: p.status,
  }));

  const forecastChartData = useMemo(() => {
    if (!primaryForecast || !topIntervention) return [];
    const weeks = new Set([
      ...primaryForecast.baseline.map((p) => p.week),
      ...topIntervention.projected.map((p) => p.week),
    ]);
    return [...weeks].sort((a, b) => a - b).map((week) => {
      const baseline = primaryForecast.baseline.find((p) => p.week === week);
      const projected = topIntervention.projected.find((p) => p.week === week);
      return {
        week: `W${week}`,
        baseline: baseline?.value,
        projected: projected?.value,
        bandLow: projected?.bandLow,
        bandHigh: projected?.bandHigh,
      };
    });
  }, [primaryForecast, topIntervention]);

  return (
    <div className="space-y-6">
      <ToolDisclaimer variant="warning" />

      <div className="rounded-xl border border-accent-amber/30 bg-accent-amber/5 p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground/90">Forecast disclaimer:</strong>{' '}
          {dashboard.globalDisclaimer}
        </p>
      </div>

      {labs.length === 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">No labs logged yet.</p>
          <Button
            variant={useDemo ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setUseDemo(true)}
          >
            Load demo data
          </Button>
          <Link href="/labs" className="text-sm text-accent-cyan hover:text-accent-emerald">
            Add your labs →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-accent-cyan">{dashboard.healthspanScore}</p>
          <p className="text-[9px] font-mono text-muted-foreground">HEALTHSPAN SCORE</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-accent-emerald">{dashboard.dataCompleteness}%</p>
          <p className="text-[9px] font-mono text-muted-foreground">PANEL COMPLETE</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-semibold text-accent-rose truncate">{dashboard.topConcern ?? '—'}</p>
          <p className="text-[9px] font-mono text-muted-foreground">TOP CONCERN</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-semibold text-accent-emerald truncate">{dashboard.topWin ?? '—'}</p>
          <p className="text-[9px] font-mono text-muted-foreground">TOP WIN</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-5">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Marker selector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Biomarker"
                value={dashboardMarkerId}
                onChange={setDashboardMarkerId}
                options={biomarkers.map((b) => ({ value: b.id, label: b.name }))}
              />
              <Select
                label="Forecast horizon"
                value={String(forecastHorizonWeeks)}
                onChange={(v) => setForecastHorizonWeeks(Number(v) as 12 | 24 | 36)}
                options={[
                  { value: '12', label: '12 weeks' },
                  { value: '24', label: '24 weeks' },
                  { value: '36', label: '36 weeks' },
                ]}
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={showForecastBands}
                  onChange={(e) => setShowForecastBands(e.target.checked)}
                  className="rounded border-border"
                />
                Show uncertainty bands
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">All markers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-80 overflow-y-auto scroll-region">
              {dashboard.series
                .filter((s) => s.points.length > 0)
                .map((s) => (
                  <button
                    key={s.markerId}
                    type="button"
                    onClick={() => setDashboardMarkerId(s.markerId)}
                    className={cn(
                      'focus-ring w-full text-left p-3 rounded-xl transition-all',
                      s.markerId === dashboardMarkerId
                        ? 'bg-accent-cyan/10 border border-accent-cyan/30'
                        : 'glass hover:border-border',
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">{s.markerName}</span>
                      {trendIcon(s.trend)}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {s.latestValue !== null && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {s.latestValue} {s.unit}
                        </span>
                      )}
                      {s.latestStatus !== 'none' && (
                        <Badge variant={statusBadge(s.latestStatus)}>{s.latestStatus}</Badge>
                      )}
                    </div>
                  </button>
                ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-5">
          {activeSeries && activeSeries.points.length > 0 ? (
            <>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-accent-cyan" />
                    {activeSeries.markerName} — historical trend
                  </CardTitle>
                  <CardDescription>
                    Optimal: {activeSeries.optimal} {activeSeries.unit} · Slope{' '}
                    {activeSeries.slopePerMonth > 0 ? '+' : ''}
                    {activeSeries.slopePerMonth}/mo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={trendChartData}>
                      <XAxis dataKey="date" tick={{ fill: 'var(--color-text-faint)', fontSize: 10 }} />
                      <YAxis tick={{ fill: 'var(--color-text-faint)', fontSize: 10 }} width={40} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--color-bg-elevated)',
                          border: '1px solid var(--color-border-subtle)',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent-cyan)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--accent-cyan)', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {forecastChartData.length > 0 && topIntervention && (
                <Card className="border border-accent-violet/20">
                  <CardHeader>
                    <CardTitle className="text-base">Intervention impact forecast</CardTitle>
                    <CardDescription>
                      Scenario: {topIntervention.interventionName} · Impact score{' '}
                      {topIntervention.impactScore} · Expected Δ {topIntervention.expectedDelta}{' '}
                      {activeSeries.unit} over {forecastHorizonWeeks}w
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <ComposedChart data={forecastChartData}>
                        <XAxis dataKey="week" tick={{ fill: 'var(--color-text-faint)', fontSize: 10 }} />
                        <YAxis tick={{ fill: 'var(--color-text-faint)', fontSize: 10 }} width={40} />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {showForecastBands && (
                          <Area
                            type="monotone"
                            dataKey="bandHigh"
                            stroke="none"
                            fill="var(--accent-violet)"
                            fillOpacity={0.08}
                          />
                        )}
                        <Line
                          type="monotone"
                          dataKey="baseline"
                          name="Current trajectory"
                          stroke="var(--color-text-faint)"
                          strokeDasharray="4 4"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="projected"
                          name="With intervention"
                          stroke="var(--accent-emerald)"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <p className="text-caption mt-4 border-t border-border pt-3">
                      {topIntervention.disclaimer}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ranked intervention scenarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboard.forecasts.map((f) => (
                    <div
                      key={f.id}
                      className={cn(
                        'rounded-xl p-4 border',
                        f.category === 'baseline' ? 'border-border bg-muted/20' : 'border-border',
                      )}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{f.interventionName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Expected Δ {f.expectedDelta > 0 ? '+' : ''}
                            {f.expectedDelta} over {f.timeframeWeeks} weeks
                          </p>
                        </div>
                        {f.category !== 'baseline' && (
                          <Badge variant="info">{f.impactScore}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                Log lab entries in the{' '}
                <Link href="/labs" className="text-accent-cyan">
                  Labs hub
                </Link>{' '}
                or load demo data to see trends and forecasts.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}