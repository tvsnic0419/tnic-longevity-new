'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { Sun, Moon, AlertTriangle, Sparkles, ShieldAlert } from 'lucide-react';
import { simulateStack } from '@/lib/tools/stack-simulator';
import { usePlatform, useStack } from '@/context/PlatformContext';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { CompoundSelectorGrid } from '@/components/stacks/CompoundSelectorGrid';
import { SynergyScorePanel } from '@/components/stacks/SynergyScorePanel';
import { StackInteractionsPanel } from '@/components/stacks/StackInteractionsPanel';
import { StackPresetsBar } from '@/components/stacks/StackPresetsBar';
import { StackExport } from '@/components/stacks/StackExport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { ToolDisclaimer } from './ToolDisclaimer';

const riskVariant = (l: string): 'success' | 'warning' | 'danger' | 'info' => {
  if (l === 'low') return 'success';
  if (l === 'moderate') return 'info';
  if (l === 'elevated') return 'warning';
  return 'danger';
};

export function StackSimulatorTool() {
  const { profile, setProfile } = usePlatform();
  const { selected, toggle, applyPreset } = useStack();
  const age = profile.age;

  const result = useMemo(() => simulateStack(selected, age), [selected, age]);

  const radarData = result.hallmarkRadar.filter((d) => d.coverage > 0);

  return (
    <div className="space-y-6">
      <ToolDisclaimer />

      <StackPresetsBar selected={selected} onApply={applyPreset} />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Compound selector</CardTitle>
              <CardDescription>
                Toggle compounds to see live synergy scoring, interaction checks, and age-adjusted dosing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 max-w-sm">
                <Slider
                  label="Your age (dose adjustment)"
                  value={age}
                  onChange={(v) => setProfile({ age: v })}
                  min={25}
                  max={85}
                  unit=" yrs"
                />
              </div>
              <CompoundSelectorGrid selected={selected} onToggle={toggle} />
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {selected.length > 0 ? (
              <motion.div
                key={selected.join(',')}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <StackInteractionsPanel analysis={result.analysis} />

                <Card>
                  <CardHeader>
                    <CardTitle>Personalized dosing</CardTitle>
                    <CardDescription>
                      Age-adjusted from published trial ranges — not prescriptions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.dosingSchedule.am.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sun className="w-4 h-4 text-accent-amber" aria-hidden="true" />
                          <span className="text-label text-accent-amber">AM protocol</span>
                        </div>
                        <ul className="space-y-2">
                          {result.dosingSchedule.am.map((d) => (
                            <li key={d.compoundId} className="glass rounded-lg p-3 text-sm">
                              <div className="flex justify-between gap-2">
                                <span className="font-semibold text-foreground">{d.name}</span>
                                <EvidenceTag tier={d.evidence} size="sm" />
                              </div>
                              <p className="text-accent-cyan font-mono text-xs mt-1">{d.adjustedDose}</p>
                              {d.baseDose !== d.adjustedDose && (
                                <p className="text-caption mt-0.5 line-through opacity-60">{d.baseDose}</p>
                              )}
                              {d.adjustmentReason && (
                                <p className="text-caption mt-1">{d.adjustmentReason}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.dosingSchedule.pm.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Moon className="w-4 h-4 text-accent-violet" aria-hidden="true" />
                          <span className="text-label text-accent-violet">PM protocol</span>
                        </div>
                        <ul className="space-y-2">
                          {result.dosingSchedule.pm.map((d) => (
                            <li key={d.compoundId} className="glass rounded-lg p-3 text-sm">
                              <span className="font-semibold text-foreground">{d.name}</span>
                              <p className="text-accent-violet font-mono text-xs mt-1">{d.adjustedDose}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <StackExport
                  stackName="Simulator Stack"
                  simulatorResult={result}
                  age={age}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <p className="text-muted-foreground text-sm">
                  Select compounds or apply a preset to simulate synergy, dosing, and risk profile.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <SynergyScorePanel
            score={result.analysis.score}
            analysis={result.analysis}
            verdict={result.summaryVerdict}
          />

          {selected.length > 0 && radarData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Hallmark coverage
                  <span className="ml-2 text-caption font-normal">
                    {result.analysis.hallmarkCount}/12
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border-subtle)" />
                    <PolarAngleAxis
                      dataKey="hallmark"
                      tick={{ fill: 'var(--color-text-faint)', fontSize: 9 }}
                    />
                    <Radar
                      dataKey="coverage"
                      stroke="var(--accent-violet)"
                      fill="var(--accent-violet)"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">Side effect & interaction risks</CardTitle>
                <Badge variant={riskVariant(result.riskLevel)}>{result.riskLevel} risk</Badge>
              </div>
              <Progress value={result.riskScore} max={100} label="Risk index" color="amber" />
            </CardHeader>
            <CardContent>
              {result.sideEffectRisks.length === 0 ? (
                <p className="text-body-sm">Select compounds to surface risks.</p>
              ) : (
                <ul className="space-y-2 max-h-72 overflow-y-auto scroll-region">
                  {result.sideEffectRisks.slice(0, 14).map((r) => (
                    <li key={r.id} className="flex gap-2 text-xs p-2 rounded-lg bg-muted/30">
                      {r.category === 'interaction' ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-accent-rose shrink-0 mt-0.5" aria-hidden="true" />
                      ) : r.severity === 'high' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-accent-rose shrink-0 mt-0.5" aria-hidden="true" />
                      ) : r.category === 'caution' ? (
                        <Sparkles className="w-3.5 h-3.5 text-accent-amber shrink-0 mt-0.5" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-accent-amber shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      <div>
                        <span className="text-foreground/80">{r.risk}</span>
                        <p className="text-caption mt-0.5">{r.compoundName}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}