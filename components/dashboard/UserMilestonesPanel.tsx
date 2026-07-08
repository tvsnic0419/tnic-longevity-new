'use client';

import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { milestoneEvidenceLevel } from '@/lib/milestone-engine';
import EvidenceBadge from '@/components/trust/EvidenceBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const kindAccent: Record<string, string> = {
  'onboarding-complete': 'border-accent-emerald',
  'labs-baseline': 'border-accent-cyan',
  'labs-retest': 'border-accent-cyan',
  'defense-scanned': 'border-accent-rose',
  'synergy-70': 'border-accent-violet',
  'hallmark-5': 'border-accent-violet',
  'stack-built': 'border-accent-amber',
  'first-compound': 'border-accent-emerald',
};

export function UserMilestonesPanel() {
  const { milestones } = usePlatform();
  const recent = [...milestones].slice(-6).reverse();

  if (recent.length === 0) {
    return (
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent-amber" aria-hidden="true" />
            Your milestones
          </CardTitle>
          <p className="text-body-sm text-muted-foreground mt-1">
            Auto-tracked as you build stacks, log labs, and run scans.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add compounds or log baseline labs to earn your first milestone.
          </p>
          <Link
            href="/stacks"
            className="focus-ring interactive inline-flex items-center gap-1 text-xs font-semibold text-accent-emerald mt-3"
          >
            Build stack
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="default">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent-amber" aria-hidden="true" />
            Your milestones
          </CardTitle>
          <p className="text-body-sm text-muted-foreground mt-1">
            {milestones.length} earned — your N=1 journey, separate from founder notes.
          </p>
        </div>
        <Link
          href="/trust/journey"
          className="focus-ring interactive inline-flex items-center justify-center gap-2 rounded-xl font-semibold border border-border px-3 py-2 text-xs shrink-0 hover:border-accent-emerald/40"
        >
          Founder journey
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent.map((m) => (
            <div
              key={m.id}
              className={cn('border-l-4 pl-4 py-1', kindAccent[m.kind] ?? 'border-accent-emerald')}
            >
              <EvidenceBadge level={milestoneEvidenceLevel(m.kind)} size="sm" />
              <p className="text-caption text-muted-foreground mt-2">{m.date}</p>
              <p className="font-medium mt-1 text-sm leading-relaxed">{m.title}</p>
              <p className="text-body-sm text-muted-foreground mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}