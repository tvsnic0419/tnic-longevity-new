import Link from 'next/link';
import { CalendarCheck, ShieldCheck } from 'lucide-react';
import type { EvidenceTier } from '@/lib/types';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

/**
 * MethodReviewStrip — the authority header for a compound deep-dive.
 *
 * Surfaces three trust signals up front: the evidence grade, when the page was
 * last reviewed, and a one-line note on how the grade is reached (linking to the
 * full methodology). Restrained hairline surface, per the v2 design system.
 */
export function MethodReviewStrip({
  tier,
  lastReviewed,
  methodNote,
}: {
  tier: EvidenceTier;
  lastReviewed: string;
  methodNote: string;
}) {
  const reviewedLabel = formatReviewDate(lastReviewed);

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="text-label">Evidence grade</span>
          <EvidenceTag tier={tier} size="lg" />
        </div>
        <div className="flex items-center gap-2 text-body-sm">
          <CalendarCheck className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>
            Last reviewed{' '}
            <time dateTime={lastReviewed} className="text-foreground/90 font-medium">
              {reviewedLabel}
            </time>
          </span>
        </div>
      </div>
      <p className="mt-3 flex items-start gap-2 text-caption leading-relaxed">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span>
          {methodNote}{' '}
          <Link href="/trust/methodology" className="text-accent-cyan hover:text-accent-emerald">
            How we grade evidence
          </Link>
        </span>
      </p>
    </div>
  );
}

function formatReviewDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
