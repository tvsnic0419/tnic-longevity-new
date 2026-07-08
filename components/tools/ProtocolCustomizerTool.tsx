'use client';

import { useMemo, useState } from 'react';
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
import { Sun, Moon, Target, FlaskConical, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import {
  generateProtocol,
  protocolGoalOptions,
  type ProtocolGoal,
} from '@/lib/tools/protocol-customizer';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ToolDisclaimer } from './ToolDisclaimer';

export function ProtocolCustomizerTool() {
  const { profile, setProfile, labs, applyPreset } = usePlatform();
  const [goals, setGoals] = useState<ProtocolGoal[]>(['longevity', 'energy']);

  const toggleGoal = (g: ProtocolGoal) => {
    setGoals((prev) =>
      prev.includes(g) ? (prev.length > 1 ? prev.filter((x) => x !== g) : prev) : [...prev, g],
    );
  };

  const protocol = useMemo(
    () =>
      generateProtocol({
        age: profile.age,
        goals,
        stress: profile.stress,
        sleep: profile.sleep,
        exercise: profile.exercise,
        labEntries: labs,
      }),
    [profile, goals, labs],
  );

  const chartData = protocol.hallmarkPriorities.map((h) => ({
    name: `#${h.number}`,
    score: h.score,
    title: h.title,
  }));

  return (
    <div className="space-y-6">
      <ToolDisclaimer />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          <Card elevated>
            <CardHeader>
              <CardTitle>Your profile</CardTitle>
              <CardDescription>
                Age, lifestyle, and goals drive hallmark prioritization. Labs from the Labs hub auto-integrate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Slider label="Age" value={profile.age} onChange={(v) => setProfile({ age: v })} min={25} max={85} unit="" />
              <Slider label="Sleep quality" value={profile.sleep} onChange={(v) => setProfile({ sleep: v })} min={0} max={100} unit="%" hint="Subjective or wearable-derived" />
              <Slider label="Exercise level" value={profile.exercise} onChange={(v) => setProfile({ exercise: v })} min={0} max={100} unit="%" />
              <Slider label="Stress load" value={profile.stress} onChange={(v) => setProfile({ stress: v })} min={0} max={100} unit="%" />
              {labs.length > 0 && (
                <p className="text-xs text-accent-emerald">
                  ✓ {labs.length} lab entries integrated from Labs hub
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Goals (multi-select)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {protocolGoalOptions.map((g) => {
                const active = goals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`focus-ring interactive text-left p-3 rounded-xl text-sm ${
                      active ? 'bg-accent-emerald/10 border border-accent-emerald/30' : 'glass glass-hover'
                    }`}
                  >
                    <span className="font-semibold">{g.label}</span>
                    <p className="text-caption text-muted-foreground mt-0.5">{g.desc}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card elevated>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle>{protocol.presetLabel} Protocol</CardTitle>
                  <EvidenceTag tier={protocol.evidenceTier} />
                  <Badge variant="info">Defense {protocol.defenseScore}</Badge>
                  <Badge variant="success">Bio age {protocol.biologicalAge}</Badge>
                </div>
                <CardDescription>{protocol.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-label text-accent-cyan mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Hallmark priorities
                  </p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} width={28} />
                      <Tooltip
                        contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.title ?? ''}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? '#34d399' : '#22d3ee'} fillOpacity={1 - i * 0.12} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-label text-accent-amber mb-2 flex items-center gap-2">
                      <Sun className="w-4 h-4" /> AM schedule
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {protocol.amSchedule.map((s) => (
                        <li key={s}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-label text-accent-violet mb-2 flex items-center gap-2">
                      <Moon className="w-4 h-4" /> PM schedule
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {protocol.pmSchedule.map((s) => (
                        <li key={s}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-label text-accent-emerald mb-2">Recommended compounds</p>
                <div className="space-y-2 mb-6">
                  {protocol.compounds.map((c) => (
                    <div key={c.compoundId} className="glass rounded-lg p-3 flex gap-3">
                      <span className="text-accent-cyan font-mono text-xs shrink-0">#{c.priority}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{c.name}</span>
                          <EvidenceTag tier={c.evidence} size="sm" />
                        </div>
                        <p className="text-caption text-muted-foreground mt-1">{c.rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-label text-accent-violet mb-2 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" /> Lifestyle pillars
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mb-6">
                  {protocol.lifestyle.map((l) => (
                    <div key={l.pillar} className="glass rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{l.pillar}</span>
                        <EvidenceTag tier={l.evidence} size="sm" />
                      </div>
                      <ul className="text-caption text-muted-foreground space-y-0.5">
                        {l.actions.map((a) => (
                          <li key={a}>• {a}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 glass rounded-lg p-3 mb-6">
                  <FlaskConical className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-foreground/80">Monitoring: {protocol.monitoringPanel.join(' · ')}</p>
                    <p className="text-caption text-muted-foreground mt-1">{protocol.retestCadence}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => applyPreset(protocol.presetKey)} theme="emerald">
                    Apply to Stack Architect
                  </Button>
                  <Link href="/library/guides/testing-and-monitoring">
                    <Button variant="secondary">Testing guide</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}