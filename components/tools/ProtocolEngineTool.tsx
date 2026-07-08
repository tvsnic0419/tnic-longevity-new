'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Sun, Moon, Brain, Sparkles, ChevronRight, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { useToolsStore } from '@/stores/toolsStore';
import {
  runProtocolEngine,
  protocolGoalOptions,
} from '@/lib/tools/protocol-engine';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { ToolDisclaimer } from './ToolDisclaimer';
import { cn } from '@/lib/utils';

export function ProtocolEngineTool() {
  const { profile, setProfile, labs, selected, setSelected } = usePlatform();
  const {
    protocolGoals,
    protocolBudget,
    protocolComplexity,
    toggleProtocolGoal,
    setProtocolBudget,
    setProtocolComplexity,
  } = useToolsStore();

  const result = useMemo(
    () =>
      runProtocolEngine({
        age: profile.age,
        goals: protocolGoals,
        stress: profile.stress,
        sleep: profile.sleep,
        exercise: profile.exercise,
        budget: protocolBudget,
        complexity: protocolComplexity,
        labEntries: labs,
        existingStack: selected,
      }),
    [profile, protocolGoals, protocolBudget, protocolComplexity, labs, selected],
  );

  const chartData = result.hallmarkPriorities.map((h) => ({
    name: `#${h.number}`,
    score: h.score,
    title: h.title,
  }));

  return (
    <div className="space-y-6">
      <ToolDisclaimer />

      <div className="rounded-xl border border-accent-violet/25 bg-accent-violet/5 p-4 flex gap-3">
        <Brain className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-foreground">Protocol Recommendation Engine</p>
          <p className="text-xs text-muted-foreground mt-1">
            Rule-based multi-pathway planner — not generative AI. Transparent reasoning chain shows
            exactly which inputs drove each recommendation.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-5">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Your inputs</CardTitle>
              <CardDescription>
                Goals, lifestyle, labs, and constraints feed the rule engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Slider
                label="Age"
                value={profile.age}
                onChange={(v) => setProfile({ age: v })}
                min={25}
                max={85}
              />
              <Slider
                label="Sleep quality"
                value={profile.sleep}
                onChange={(v) => setProfile({ sleep: v })}
                min={0}
                max={100}
                unit="%"
              />
              <Slider
                label="Exercise level"
                value={profile.exercise}
                onChange={(v) => setProfile({ exercise: v })}
                min={0}
                max={100}
                unit="%"
              />
              <Slider
                label="Stress load"
                value={profile.stress}
                onChange={(v) => setProfile({ stress: v })}
                min={0}
                max={100}
                unit="%"
              />
              <Select
                label="Budget tier"
                value={protocolBudget}
                onChange={(v) => setProtocolBudget(v as typeof protocolBudget)}
                options={[
                  { value: 'budget', label: 'Budget ($80–120/mo)' },
                  { value: 'moderate', label: 'Moderate ($120–200/mo)' },
                  { value: 'premium', label: 'Premium ($200+/mo)' },
                ]}
              />
              <Select
                label="Complexity"
                value={protocolComplexity}
                onChange={(v) => setProtocolComplexity(v as typeof protocolComplexity)}
                options={[
                  { value: 'minimal', label: 'Minimal (2 compounds)' },
                  { value: 'standard', label: 'Standard (3 pathways)' },
                  { value: 'advanced', label: 'Advanced (full coverage)' },
                ]}
              />
              {labs.length > 0 && (
                <p className="text-xs text-accent-emerald">
                  ✓ {labs.length} lab entries integrated
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Health goals</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {protocolGoalOptions.map((g) => {
                const active = protocolGoals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleProtocolGoal(g.id)}
                    className={cn(
                      'focus-ring interactive px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all',
                      active
                        ? 'bg-accent-violet/15 border border-accent-violet/40 text-accent-violet'
                        : 'glass text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {g.label}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-5">
          <Card variant="elevated" className="border-l-2 border-l-accent-violet">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>Recommended plan</CardTitle>
                  <CardDescription className="mt-1">{result.summary}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="info">Confidence {result.confidence}%</Badge>
                  <EvidenceTag tier={result.evidenceTier} size="sm" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-accent-amber" />
                    <span className="text-label text-accent-amber">AM master</span>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {result.amMasterSchedule.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4 text-accent-violet" />
                    <span className="text-label text-accent-violet">PM master</span>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {result.pmMasterSchedule.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                variant="secondary"
                theme="violet"
                onClick={() => {
                  const ids = [
                    ...new Set(
                      result.phases.flatMap((ph) =>
                        ph.pathways.flatMap((p) => p.compounds.map((c) => c.compoundId)),
                      ),
                    ),
                  ];
                  setSelected(ids);
                }}
              >
                Apply recommended compounds to stack
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {result.phases.map((phase, pi) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pi * 0.08 }}
              >
                <Card variant="scientific">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-accent-cyan/40">{pi + 1}</span>
                      <div>
                        <CardTitle className="text-base">
                          {phase.label}
                          <span className="text-caption font-normal ml-2">Weeks {phase.weeks}</span>
                        </CardTitle>
                        <CardDescription>{phase.objectives.join(' · ')}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {phase.pathways.map((pathway) => (
                      <div key={pathway.id} className="rounded-xl border border-border p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-foreground">{pathway.name}</p>
                            <p className="text-xs text-muted-foreground">{pathway.description}</p>
                          </div>
                          <Badge variant="info">{pathway.confidence}%</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {pathway.compounds.map((c) => (
                            <span
                              key={c.compoundId}
                              className="text-xs glass px-2 py-1 rounded-lg"
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                        <ul className="mt-2 text-xs text-caption space-y-0.5">
                          {pathway.lifestyleActions.map((a) => (
                            <li key={a}>• {a}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <p className="text-caption">
                      Checkpoints: {phase.checkpoints.join(' · ')}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                Reasoning chain
              </CardTitle>
              <CardDescription>Transparent rule trace — how inputs became recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.reasoningChain.map((step, i) => (
                  <li key={step.id} className="flex gap-3 text-sm">
                    <span className="text-caption font-mono shrink-0 w-6">{i + 1}.</span>
                    <div className="flex-1">
                      <p className="font-mono text-[10px] text-accent-cyan uppercase">{step.rule}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">In: {step.input}</p>
                      <p className="text-foreground/90 mt-1 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-accent-emerald" />
                        {step.conclusion}
                      </p>
                      <p className="text-caption mt-0.5">
                        Weight {(step.weight * 100).toFixed(0)}% · Confidence {step.confidence}%
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hallmark priorities</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 8 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-text-faint)', fontSize: 10 }} width={28} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v) => [`${v}`, 'Priority']}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.title ?? ''}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill="var(--accent-violet)" fillOpacity={0.7 - i * 0.08} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" />
                  Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Panel:</span>{' '}
                  {result.monitoringPanel.join(', ')}
                </p>
                <p>
                  <span className="text-muted-foreground">Retest:</span> {result.retestCadence}
                </p>
                <Link href="/labs" className="text-accent-cyan text-xs hover:text-accent-emerald">
                  Open Labs hub →
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="text-caption border border-border rounded-xl p-4 bg-muted/20">
            {result.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}