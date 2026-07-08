'use client';

import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import Link from 'next/link';
import { ArrowRight, Pill, HeartPulse } from 'lucide-react';
import { biomarkers } from '@/lib/data';
import {
  calculateBiomarkerImpact,
  getHallmarkLabelsForMarker,
} from '@/lib/tools/biomarker-impact';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { ToolDisclaimer } from './ToolDisclaimer';

const impactColor = (label: string) => {
  if (label === 'primary') return '#34d399';
  if (label === 'secondary') return '#22d3ee';
  return '#a78bfa';
};

export function BiomarkerImpactTool() {
  const [markerId, setMarkerId] = useState(biomarkers[0].id);

  const result = useMemo(() => calculateBiomarkerImpact(markerId), [markerId]);

  const chartData = useMemo(() => {
    if (!result) return [];
    return [...result.interventions, ...result.lifestyleModifiers]
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 8)
      .map((i) => ({
        name: i.name.length > 22 ? `${i.name.slice(0, 20)}…` : i.name,
        fullName: i.name,
        score: i.impactScore,
        type: i.category,
        label: i.impactLabel,
      }));
  }, [result]);

  if (!result) return null;

  return (
    <div className="space-y-6">
      <ToolDisclaimer />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-5">
          <Card elevated>
            <CardHeader>
              <CardTitle>Select biomarker</CardTitle>
              <CardDescription>
                See which compounds and lifestyle interventions have the strongest evidence-weighted impact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                label="Biomarker"
                value={markerId}
                onChange={setMarkerId}
                options={biomarkers.map((b) => ({ value: b.id, label: b.name }))}
              />
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Optimal:</span>{' '}
                  <span className="text-accent-emerald font-mono">{result.optimal}</span>{' '}
                  {result.unit}
                </p>
                <p className="text-body-sm">{result.desc}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {getHallmarkLabelsForMarker(markerId).map((h) => (
                    <Badge key={h} variant="info">{h}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {result.topPick && (
            <Card className="border-accent-emerald/20">
              <CardHeader>
                <CardTitle className="text-base">Top intervention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  {result.topPick.category === 'compound' ? (
                    <Pill className="w-4 h-4 text-accent-emerald" />
                  ) : (
                    <HeartPulse className="w-4 h-4 text-accent-cyan" />
                  )}
                  <span className="font-semibold">{result.topPick.name}</span>
                  <EvidenceTag tier={result.topPick.evidence} size="sm" />
                </div>
                <p className="text-body-sm mb-2">{result.topPick.mechanism}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="success">Impact {result.topPick.impactScore}</Badge>
                  <Badge variant="default">{result.topPick.timeframe}</Badge>
                  <Badge variant="info">
                    {result.topPick.expectedDirection === 'increase' ? '↑' : '↓'} target
                  </Badge>
                </div>
                {result.topPick.compoundId && (
                  <Link
                    href={`/library/compounds/${result.topPick.compoundId}`}
                    className="inline-flex items-center gap-1 text-xs text-accent-cyan mt-3 hover:text-accent-emerald"
                  >
                    Compound deep dive <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interpretation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm">{result.interpretationGuide}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-5">
          <Card elevated>
            <CardHeader>
              <CardTitle>Impact ranking</CardTitle>
              <CardDescription>
                Scores weight evidence tier, mechanistic relevance, and primary vs supportive role. Not clinical efficacy guarantees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ bottom: 48, left: 8, right: 8 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    formatter={(v) => [`${v}`, 'Impact score']}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
                  />
                  <Legend />
                  <Bar dataKey="score" name="Impact score" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.type === 'lifestyle' ? '#22d3ee' : impactColor(entry.label)}
                        fillOpacity={entry.type === 'lifestyle' ? 0.7 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Pill className="w-4 h-4 text-accent-violet" /> Compounds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.interventions.map((i) => (
                    <li key={i.id} className="text-sm border-b border-border pb-2 last:border-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{i.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={i.impactLabel === 'primary' ? 'success' : 'info'}>
                            {i.impactScore}
                          </Badge>
                          <EvidenceTag tier={i.evidence} size="sm" />
                        </div>
                      </div>
                      <p className="text-caption text-muted-foreground mt-1">{i.mechanism.slice(0, 100)}…</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-accent-cyan" /> Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.lifestyleModifiers.length === 0 ? (
                  <p className="text-body-sm">No lifestyle modifiers mapped for this marker yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {result.lifestyleModifiers.map((i) => (
                      <li key={i.id} className="text-sm border-b border-border pb-2 last:border-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">{i.name}</span>
                          <Badge variant="info">{i.impactScore}</Badge>
                        </div>
                        <p className="text-caption text-muted-foreground mt-1">{i.mechanism}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/labs">
              <span className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-sm font-semibold text-accent-cyan">
                Log this marker in Labs hub
              </span>
            </Link>
            <Link href="/library/guides/testing-and-monitoring">
              <span className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-semibold text-foreground/80">
                Full testing guide
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}