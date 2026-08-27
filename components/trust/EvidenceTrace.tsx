'use client';

import Link from 'next/link';
import { ArrowUpRight, FileCheck2 } from 'lucide-react';
import type { EvidenceTier } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

const tierCopy: Record<EvidenceTier, { label: string; tone: string }> = {
  A: { label: 'Human evidence', tone: 'text-accent-emerald' },
  B: { label: 'Emerging human evidence', tone: 'text-accent-cyan' },
  C: { label: 'Preclinical evidence', tone: 'text-accent-amber' },
};

interface EvidenceTraceProps {
  tier: EvidenceTier;
  /** Number of named sources or human studies represented by this surface. */
  sourceCount?: number;
  /** A compact transparency cue, such as a review date or methodology status. */
  reviewedLabel?: string;
  /** Internal destination where the visitor can inspect the underlying evidence. */
  href?: string;
  /** A non-personal surface label used only to measure evidence inspection. */
  surface?: string;
  className?: string;
}

/**
 * A small, reusable provenance rail. It deliberately describes what can be
 * inspected rather than implying that a tier alone is a recommendation.
 */
export function EvidenceTrace({
  tier,
  sourceCount,
  reviewedLabel,
  href = '/trust/methodology',
  surface = 'unspecified',
  className = '',
}: EvidenceTraceProps) {
  const meta = tierCopy[tier];
  const sourceLabel = sourceCount === undefined
    ? 'Evidence traceable'
    : `${sourceCount} ${sourceCount === 1 ? 'source' : 'sources'} cited`;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg border border-border/65 bg-background/30 px-3 py-2 text-micro font-mono ${className}`}
      aria-label={`Evidence trace: Tier ${tier}, ${meta.label}, ${sourceLabel}`}
    >
      <FileCheck2 className={`h-3.5 w-3.5 shrink-0 ${meta.tone}`} aria-hidden="true" />
      <span className={`font-semibold uppercase tracking-[0.1em] ${meta.tone}`}>Tier {tier}</span>
      <span className="h-3 w-px bg-border/80" aria-hidden="true" />
      <span className="text-muted-foreground">{sourceLabel}</span>
      {reviewedLabel && (
        <>
          <span className="h-3 w-px bg-border/80" aria-hidden="true" />
          <span className="text-muted-foreground">{reviewedLabel}</span>
        </>
      )}
      <Link
        href={href}
        onClick={() => trackEvent(ANALYTICS_EVENTS.evidenceTraceOpened, { surface })}
        className="focus-ring ml-auto inline-flex items-center gap-1 rounded text-foreground transition-colors hover:text-accent-cyan"
      >
        Inspect
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </div>
  );
}
