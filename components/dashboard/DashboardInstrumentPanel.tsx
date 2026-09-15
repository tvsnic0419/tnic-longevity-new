'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Activity } from 'lucide-react';
import { BiologicalAgeGauge } from '@/components/ui/BiologicalAgeGauge';
import { DepthBarChart } from '@/components/ui/DepthBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { usePlatform } from '@/context/PlatformContext';
import { analyzeStack, hallmarkDisplayNames } from '@/lib/stack-analysis';
import { compounds } from '@/lib/data';
import { ToolEmptyState } from '@/components/ui/ToolEmptyState';

/**
 * Dashboard instrument panel — bio-age gauge + hallmark coverage depth bars
 * from the user's live stack (compound→hallmark counts, not invented grades).
 */
export function DashboardInstrumentPanel() {
  const { selected, profile, defenseProfile, setProfile } = usePlatform();
  const analysis = useMemo(() => analyzeStack(selected), [selected]);

  const hallmarkBars = useMemo(() => {
    if (selected.length === 0) return [];
    const active = compounds.filter((c) => selected.includes(c.id));
    const counts = new Map<string, number>();
    for (const c of active) {
      for (const h of c.hallmarks) {
        counts.set(h, (counts.get(h) ?? 0) + 1);
      }
    }
    const max = Math.max(1, ...counts.values());
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, n], i) => ({
        name: (hallmarkDisplayNames[id] ?? id).slice(0, 14),
        fullName: `${hallmarkDisplayNames[id] ?? id} · ${n} compound${n === 1 ? '' : 's'} in stack`,
        value: Math.round((n / max) * 100),
        color:
          i < 3 ? 'var(--accent-emerald)' : i < 6 ? 'var(--accent-cyan)' : 'var(--accent-violet)',
      }));
  }, [selected]);

  const chrono = profile.age;
  const bio = profile.scanned ? defenseProfile.biologicalAge : chrono;
  const defense = profile.scanned ? defenseProfile.defenseScore : 0;

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-label text-accent-emerald mb-1">Command instruments</p>
            <CardTitle as="h2">Live stack & bio-age panel</CardTitle>
            <p className="text-body-sm text-muted-foreground mt-1">
              Derived from your local stack and defense scan — educational instruments, not clinical
              verdicts.
            </p>
          </div>
          <Link
            href="/tools?tab=healthspan"
            className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-accent-emerald"
          >
            Healthspan tool <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {selected.length === 0 && !profile.scanned ? (
          <ToolEmptyState
            icon={Activity}
            theme="emerald"
            title="No instruments lit yet"
            detail="Add compounds to your stack or run a defense scan to populate the gauge and hallmark depth chart."
            ctaLabel="Open Stack Architect"
            ctaHref="/stacks"
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 rounded-2xl border border-border/50 bg-gradient-to-b from-accent-rose/[0.06] to-transparent p-4">
              <BiologicalAgeGauge
                chronoAge={chrono}
                bioAge={bio}
                defenseScore={defense}
                scanned={profile.scanned}
                size="sm"
                onScan={() => setProfile({ scanned: true })}
              />
              {!profile.scanned && (
                <button
                  type="button"
                  onClick={() => setProfile({ scanned: true })}
                  className="focus-ring mt-3 w-full rounded-full border border-accent-rose/30 bg-accent-rose/10 px-3 py-2 text-xs font-semibold text-accent-rose"
                >
                  Mark defense scan complete
                </button>
              )}
            </div>
            <div className="lg:col-span-8 rounded-2xl border border-border/50 bg-gradient-to-b from-accent-violet/[0.05] to-transparent p-4">
              {hallmarkBars.length > 0 ? (
                <>
                  <p className="text-label text-accent-violet mb-1">
                    Hallmark coverage · {analysis.hallmarkCount}/12
                  </p>
                  <p className="text-caption text-muted-foreground mb-3">
                    Relative compound count per hallmark in your active stack (synergy{' '}
                    {analysis.score})
                  </p>
                  <DepthBarChart
                    layout="vertical"
                    data={hallmarkBars}
                    height={Math.max(160, hallmarkBars.length * 28)}
                    valueLabel="Relative coverage"
                    max={100}
                    color="var(--accent-violet)"
                  />
                </>
              ) : (
                <ToolEmptyState
                  theme="violet"
                  title="Stack has no hallmark edges yet"
                  detail="Select compounds with hallmark mappings to light the coverage instrument."
                  ctaLabel="Build stack"
                  ctaHref="/stacks"
                  className="!border-0 !bg-transparent !p-4"
                />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
