'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Scan } from 'lucide-react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { estimateHealthspan } from '@/lib/tools/healthspan-estimator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { ToolDisclaimer } from './ToolDisclaimer';

export function HealthspanEstimatorTool() {
  const { profile, setProfile, selected, labs, defenseProfile } = usePlatform();

  const estimate = useMemo(
    () =>
      estimateHealthspan({
        age: profile.age,
        stress: profile.stress,
        sleep: profile.sleep,
        exercise: profile.exercise,
        stackIds: selected,
        labEntries: labs,
      }),
    [profile, selected, labs],
  );

  const chartData = estimate.projections.map((p) => ({
    name: p.label,
    healthspan: p.healthspanScore,
    bioAge: p.biologicalAge,
  }));

  return (
    <div className="space-y-6">
      <ToolDisclaimer variant={estimate.dataConfidence < 50 ? 'warning' : 'info'} />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-5">
          <Card elevated>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>
                Uses your platform profile, active stack, and any logged labs. More data = higher confidence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Slider label="Age" value={profile.age} onChange={(v) => setProfile({ age: v })} min={25} max={85} />
              <Slider label="Sleep" value={profile.sleep} onChange={(v) => setProfile({ sleep: v })} min={0} max={100} unit="%" />
              <Slider label="Exercise" value={profile.exercise} onChange={(v) => setProfile({ exercise: v })} min={0} max={100} unit="%" />
              <Slider label="Stress" value={profile.stress} onChange={(v) => setProfile({ stress: v })} min={0} max={100} unit="%" />
              <div className="text-xs space-y-1 pt-2 border-t border-border">
                <p className="text-muted-foreground">
                  Stack: <span className="text-accent-violet">{selected.length} compounds</span>
                </p>
                <p className="text-muted-foreground">
                  Labs: <span className="text-accent-cyan">{labs.length} entries</span>
                </p>
                <p className="text-muted-foreground">
                  Confidence: <span className="text-accent-emerald">{estimate.dataConfidence}%</span>
                </p>
                {profile.scanned && (
                  <p className="text-muted-foreground">
                    Bio age:{' '}
                    <span className="text-accent-rose font-mono">{defenseProfile.biologicalAge}</span>
                  </p>
                )}
              </div>
              <Button
                theme="rose"
                icon={Scan}
                fullWidth
                onClick={() => setProfile({ scanned: true })}
              >
                {profile.scanned ? 'Defense scan complete' : 'Execute defense scan'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projection drivers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {estimate.drivers.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{d.label}</span>
                    <span className={d.direction === 'positive' ? 'text-accent-emerald' : 'text-accent-amber'}>
                      {d.impact}
                    </span>
                  </div>
                  <Progress
                    value={d.impact}
                    color={d.direction === 'positive' ? 'emerald' : 'amber'}
                    showValue={false}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card elevated className="text-center">
              <p className="text-label text-accent-cyan mb-1">Healthspan score</p>
              <p className="text-4xl font-bold text-foreground">{estimate.currentHealthspanScore}</p>
              <p className="text-caption text-muted-foreground mt-1">
                12w → {estimate.projectedHealthspanScore12w} · 24w → {estimate.projectedHealthspanScore24w}
              </p>
            </Card>
            <Card elevated className="text-center">
              <p className="text-label text-accent-violet mb-1">Biological age</p>
              <p className="text-4xl font-bold text-foreground">{estimate.biologicalAge}</p>
              <p className="text-caption text-muted-foreground mt-1">Chrono {estimate.chronologicalAge}</p>
            </Card>
            <Card elevated className="text-center">
              <p className="text-label text-accent-emerald mb-1">Age delta</p>
              <p className="text-4xl font-bold text-accent-emerald flex items-center justify-center gap-1">
                {estimate.ageDelta >= 0 ? (
                  <TrendingDown className="w-6 h-6" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-accent-amber" />
                )}
                {Math.abs(estimate.ageDelta)}y
              </p>
              <p className="text-caption text-muted-foreground mt-1">
                24w proj. {estimate.projectedAgeDelta24w}y
              </p>
            </Card>
          </div>

          <Card elevated>
            <CardHeader>
              <CardTitle>24-week projection</CardTitle>
              <CardDescription>
                Model based on trial timelines (GlyNAC 24wk, NMN 12wk) and lifestyle adherence assumptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} />
                  <YAxis yAxisId="left" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: '#71717a', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="healthspan" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399' }} name="Healthspan" />
                  <Line yAxisId="right" type="monotone" dataKey="bioAge" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa' }} name="Bio age" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-body-sm mt-4">{estimate.summary}</p>
              <p className="text-caption text-caption mt-2">{estimate.disclaimer}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent-cyan" /> Improve confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {estimate.dataConfidence < 70 && (
                  <Badge variant="warning">Add lab data for +30% confidence</Badge>
                )}
                {selected.length < 3 && (
                  <Badge variant="info">Build a 3+ compound stack</Badge>
                )}
                {profile.sleep < 65 && (
                  <Badge variant="warning">Sleep is limiting projection</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link href="/labs" className="text-sm text-accent-cyan hover:text-accent-emerald">
                  Log labs →
                </Link>
                <Link href="/tools?tab=protocol" className="text-sm text-accent-cyan hover:text-accent-emerald">
                  Customize protocol →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}