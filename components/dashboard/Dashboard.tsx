'use client';

import Link from 'next/link';
import { ArrowRight, Activity, FlaskConical, LayoutDashboard } from 'lucide-react';
import { LongevityGaugeArc } from '@/components/ui/LongevityGaugeArc';
import { usePlatform } from '@/context/PlatformContext';
import { analyzeStack } from '@/lib/stack-analysis';
import { runBiomarkerDashboard } from '@/lib/tools/biomarker-dashboard';
import { journeyMilestones } from '@/lib/journey';
import type { EvidenceLevel } from '@/lib/types';
import StackBuilder from '@/components/stacks/StackBuilder';
import { HallmarkCoverageGrid } from '@/components/os/HallmarkCoverageGrid';
import { UserMilestonesPanel } from '@/components/dashboard/UserMilestonesPanel';
import EvidenceBadge from '@/components/trust/EvidenceBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageShell } from '@/components/ui/PageShell';
import { cn } from '@/lib/utils';
import { EXPORT_KIT_EVENT } from '@/components/os/os-events';
import { NextUpPanel } from '@/components/os/NextUpPanel';
import { DashboardStatusExport } from '@/components/dashboard/DashboardStatusExport';
import { OnboardingStrip } from '@/components/dashboard/OnboardingStrip';
import { UserNextStepsPanel } from '@/components/dashboard/UserNextStepsPanel';
import { ContextRail } from '@/components/ui/ContextRail';
import { getHubContext } from '@/lib/hub-context';

function formatDaysAgo(dateStr: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function milestoneEvidenceLevel(type: string): EvidenceLevel {
  if (type === 'personal' || type === 'experiment') return 'Personal';
  if (type === 'protocol') return 'Strong';
  return 'Emerging';
}

const highlightAccent: Record<string, string> = {
  personal: 'border-accent-emerald',
  experiment: 'border-accent-cyan',
  protocol: 'border-accent-violet',
  platform: 'border-accent-amber',
};

export function Dashboard() {
  const { selected, selectedCompounds, score, profile, defenseProfile, labs, quizResult } = usePlatform();
  const analysis = analyzeStack(selected);

  const activeProtocol =
    selectedCompounds.length > 0
      ? selectedCompounds.map((c) => c.name.split(' ')[0]).join(' + ')
      : 'No active stack';

  const latestLabDate =
    labs.length > 0
      ? labs.reduce((max, e) => (e.date > max ? e.date : max), labs[0].date)
      : null;

  const dashboardInsights =
    labs.length > 0 ? runBiomarkerDashboard(labs, selected, 'gsh', 24) : null;

  const founderHighlights = journeyMilestones.filter((m) => !m.personal).slice(-2).reverse();

  const dynamicHighlight =
    dashboardInsights?.topWin
      ? {
          evidence: 'Personal' as const,
          text: dashboardInsights.topWin,
          accent: 'border-accent-emerald',
        }
      : score >= 70
        ? {
            evidence: 'Personal' as const,
            text: `Stack synergy score ${score} — ${analysis.hallmarkCount} hallmarks covered`,
            accent: 'border-accent-violet',
          }
        : null;

  const goalLabels: Record<string, string> = {
    learn: 'Learning the science',
    defense: 'Cellular defense',
    energy: 'Mitochondrial energy',
    full: 'Full longevity optimization',
    longevity: 'Senolytic & healthspan focus',
    metabolic: 'Cardio-metabolic health',
  };

  return (
    <PageShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 section-header-mesh">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 card-ultra rounded-full px-4 py-2 mb-4 text-body-sm">
            <LayoutDashboard className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
            <span>Personal command center</span>
          </div>
          <h1 className="heading-page">My Longevity OS</h1>
          <p className="text-body text-muted-foreground mt-3 max-w-2xl">
            {quizResult
              ? `Goal: ${goalLabels[quizResult.goal] ?? quizResult.goal} — stack, labs, and journey in one place.`
              : 'Your anti-aging operating system — stack, labs, and journey in one place. Data stays local unless you export it.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(EXPORT_KIT_EVENT))}
          className="focus-ring btn-ghost-premium text-xs !py-2 !px-3 !min-h-0"
        >
          Export kit
        </button>
      </header>

      <ContextRail {...getHubContext('dashboard')} theme="emerald" className="mb-8" />

      <OnboardingStrip />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div id="dashboard-status" className="lg:col-span-1">
        <Card variant="elevated" className="h-full">
          <CardHeader>
            <CardTitle>Current status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-caption text-muted-foreground">Active protocol</p>
              <p className="text-2xl font-bold mt-1 leading-snug">{activeProtocol}</p>
              <p className="text-body-sm text-muted-foreground mt-1">
                {selected.length} compound{selected.length === 1 ? '' : 's'} · Tier {analysis.evidenceTier}
              </p>
            </div>

            <div>
              <p className="text-caption text-muted-foreground">Last lab update</p>
              <p className="text-2xl font-bold mt-1">
                {latestLabDate ? formatDaysAgo(latestLabDate) : 'Not logged yet'}
              </p>
              {latestLabDate && (
                <p className="text-body-sm text-muted-foreground mt-1 font-mono">{latestLabDate}</p>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <div className="max-w-[180px] mx-auto">
                <LongevityGaugeArc
                  score={score}
                  color="var(--accent-violet)"
                  label="SYNERGY"
                  sublabel={`${analysis.hallmarkCount}/12 hallmarks`}
                  size={150}
                  immediate
                />
              </div>
              {profile.scanned && (
                <div className="flex items-center justify-center gap-2 mt-2 glass rounded-xl px-3 py-2">
                  <Activity className="w-3.5 h-3.5 text-accent-rose shrink-0" aria-hidden="true" />
                  <p className="text-caption text-muted-foreground">Bio age</p>
                  <p className="font-bold font-mono text-accent-rose">{defenseProfile.biologicalAge}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/labs"
                className="focus-ring interactive inline-flex items-center justify-center gap-2 rounded-xl font-semibold border border-border bg-transparent text-foreground hover:bg-muted/50 px-3 py-2 text-xs w-full"
              >
                <FlaskConical className="w-4 h-4" aria-hidden="true" />
                {labs.length === 0 ? 'Log baseline labs' : 'Update labs'}
              </Link>
              {!profile.scanned && (
                <Link
                  href="/tools?tab=healthspan"
                  className="focus-ring interactive inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-muted-foreground hover:text-accent-cyan px-3 py-2 text-xs w-full"
                >
                  Run defense scan
                </Link>
              )}
            </div>

            <DashboardStatusExport />
          </CardContent>
        </Card>
        </div>

        <Card variant="scientific" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick tools</CardTitle>
            <p className="text-body-sm text-muted-foreground mt-1">
              Add or remove compounds — syncs with Stack Architect and share URLs.
            </p>
          </CardHeader>
          <CardContent>
            <StackBuilder compact />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <HallmarkCoverageGrid coveredIds={analysis.hallmarkCoverage} />
        </div>

        {dynamicHighlight && (
          <Card variant="default" className="lg:col-span-3">
            <CardContent className="pt-6">
              <div className={cn('border-l-4 pl-5', dynamicHighlight.accent)}>
                <EvidenceBadge level={dynamicHighlight.evidence} size="sm" href="/trust/methodology" />
                <p className="font-medium mt-3 text-sm leading-relaxed">{dynamicHighlight.text}</p>
                <p className="text-caption text-muted-foreground mt-2">Live insight from your data</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="lg:col-span-3">
          <UserMilestonesPanel />
        </div>

        <Card variant="default" className="lg:col-span-3">
          <CardContent className="pt-6">
            <UserNextStepsPanel />
          </CardContent>
        </Card>

        <Card variant="default" className="lg:col-span-3">
          <CardContent className="pt-6">
            <NextUpPanel compact defaultFilter="in_progress" limit={3} showFilters={false} />
          </CardContent>
        </Card>

        <Card variant="default" className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Founder journey (TNiC platform)</CardTitle>
              <p className="text-body-sm text-muted-foreground mt-1">
                Public N=1 transparency from the TNiC build — not your personal milestones.
              </p>
            </div>
            <Link
              href="/trust/journey"
              className="focus-ring interactive inline-flex items-center justify-center gap-2 rounded-xl font-semibold border border-border px-3 py-2 text-xs shrink-0 hover:border-accent-emerald/40"
            >
              Full journey
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {founderHighlights.map((m) => (
                <div
                  key={`${m.date}-${m.title}`}
                  className={cn('border-l-4 pl-5', highlightAccent[m.type] ?? 'border-accent-emerald')}
                >
                  <EvidenceBadge level={milestoneEvidenceLevel(m.type)} size="sm" href="/trust/methodology" />
                  <p className="text-caption text-muted-foreground mt-2">{m.date}</p>
                  <p className="font-medium mt-1 text-sm leading-relaxed">{m.title}</p>
                  <p className="text-body-sm text-muted-foreground mt-2">{m.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

export default Dashboard;