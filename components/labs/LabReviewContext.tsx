'use client';

import Link from 'next/link';
import { ArrowRight, CalendarClock, FlaskConical, Layers3, ShieldCheck } from 'lucide-react';
import type { LabEntry } from '@/lib/labs';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

function formatDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed);
}

function getReviewMaturity(entries: LabEntry[]): { label: string; description: string; accent: string } {
  const markerCounts = new Map<string, number>();
  entries.forEach((entry) => markerCounts.set(entry.markerId, (markerCounts.get(entry.markerId) ?? 0) + 1));
  const trendReady = [...markerCounts.values()].filter((count) => count >= 2).length;

  if (entries.length === 0) {
    return {
      label: 'Baseline not logged',
      description: 'A result you already have can become a private starting point for later review.',
      accent: 'text-accent-cyan',
    };
  }
  if (trendReady === 0) {
    return {
      label: 'Snapshot stage',
      description: 'One reading provides context. A later comparable reading is needed before a trend can be inspected.',
      accent: 'text-accent-amber',
    };
  }
  return {
    label: `${trendReady} marker${trendReady === 1 ? '' : 's'} ready to trend`,
    description: 'Compare readings by date, source, and context. This view organizes a review; it does not diagnose or establish cause.',
    accent: 'text-accent-emerald',
  };
}

/**
 * A compact local-first review frame. It deliberately reports data maturity and
 * chronology rather than turning a personal record into a treatment conclusion.
 */
export function LabReviewContext({ labs, selectedCount }: { labs: LabEntry[]; selectedCount: number }) {
  const maturity = getReviewMaturity(labs);
  const latestDate = labs.length > 0
    ? labs.reduce((latest, entry) => entry.date > latest ? entry.date : latest, labs[0].date)
    : null;
  const uniqueMarkers = new Set(labs.map((entry) => entry.markerId)).size;

  return (
    <section className="card-floating relative mb-8 overflow-hidden rounded-2xl p-5 md:p-6" aria-labelledby="lab-review-context-title">
      <div className="pointer-events-none absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-accent-rose/10 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-rose/25 bg-accent-rose/[0.06] px-3 py-1.5">
              <CalendarClock className="h-3.5 w-3.5 text-accent-rose" aria-hidden="true" />
              <span className="text-micro font-mono uppercase tracking-[0.12em] text-accent-rose">Review context</span>
            </div>
            <h2 id="lab-review-context-title" className="mt-3 text-xl font-bold tracking-tight">Make the next review more intelligible.</h2>
            <p className="mt-2 text-body-sm text-muted-foreground">{maturity.description}</p>
          </div>
          <Link
            href={labs.length > 0 ? '/labs?tab=trends' : '/labs?mode=single'}
            onClick={() => trackEvent(ANALYTICS_EVENTS.labReviewOpened, { state: labs.length > 0 ? 'review' : 'baseline' })}
            className="focus-ring inline-flex min-h-[var(--space-touch)] shrink-0 items-center justify-center gap-2 rounded-xl border border-accent-rose/30 bg-accent-rose/[0.08] px-4 py-3 text-sm font-bold text-accent-rose transition-colors hover:bg-accent-rose/[0.14]"
          >
            {labs.length > 0 ? 'Open trend review' : 'Log a baseline'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3" aria-label="Local review context">
          <div className="rounded-xl border border-border/65 bg-background/25 p-3.5">
            <div className="flex items-center gap-2 text-muted-foreground"><FlaskConical className="h-3.5 w-3.5" aria-hidden="true" /><span className="text-micro font-mono uppercase tracking-[0.1em]">Data</span></div>
            <p className="mt-2 text-sm font-semibold text-foreground">{labs.length > 0 ? `${uniqueMarkers} marker${uniqueMarkers === 1 ? '' : 's'} · ${labs.length} reading${labs.length === 1 ? '' : 's'}` : 'No readings yet'}</p>
          </div>
          <div className="rounded-xl border border-border/65 bg-background/25 p-3.5">
            <div className="flex items-center gap-2 text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /><span className="text-micro font-mono uppercase tracking-[0.1em]">Latest</span></div>
            <p className="mt-2 text-sm font-semibold text-foreground">{latestDate ? formatDate(latestDate) : 'Awaiting baseline'}</p>
          </div>
          <div className="rounded-xl border border-border/65 bg-background/25 p-3.5">
            <div className="flex items-center gap-2 text-muted-foreground"><Layers3 className="h-3.5 w-3.5" aria-hidden="true" /><span className="text-micro font-mono uppercase tracking-[0.1em]">Context</span></div>
            <p className="mt-2 text-sm font-semibold text-foreground">{selectedCount > 0 ? `${selectedCount} active compound${selectedCount === 1 ? '' : 's'}` : 'No active stack'}</p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-accent-violet/20 bg-accent-violet/[0.04] px-3.5 py-3 text-caption text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-violet" aria-hidden="true" />
          <p>Local by default. The timeline helps organize readings and questions; it does not determine personal suitability, diagnose, or prove that any intervention caused a change.</p>
        </div>
      </div>
    </section>
  );
}
