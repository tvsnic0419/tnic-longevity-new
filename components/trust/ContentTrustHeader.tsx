import Link from 'next/link';
import { ShieldCheck, Clock, BookMarked, ArrowRight } from 'lucide-react';
import type { EvidenceTier } from '@/lib/types';
import { EvidenceBadgeFromTier } from '@/components/trust/EvidenceBadge';
import { CONTENT_MAINTAINER, METHODOLOGY_HREF, formatUpdatedDate } from '@/lib/content-provenance';
import { cn } from '@/lib/utils';

export interface ContentTrustHeaderProps {
  /** Who maintains the page. Honest editorial framing — never a fabricated individual. */
  maintainer?: string;
  /** ISO date (YYYY-MM-DD) the content was last updated. */
  lastUpdated?: string;
  evidenceTier?: EvidenceTier;
  citationCount?: number;
  methodologyHref?: string;
  className?: string;
}

function Divider() {
  return (
    <span className="text-border/80" aria-hidden="true">
      ·
    </span>
  );
}

/**
 * A compact provenance strip rendered under a content page's title:
 * "Maintained by TNiC editorial · Last updated <date> · Tier X · N citations · How we grade →".
 *
 * A trust signal that must stay truthful — it reflects real editorial stewardship,
 * the real `last_updated` date, and links to the published grading methodology.
 * Theme-aware and WCAG-AA; wraps on narrow screens.
 */
export function ContentTrustHeader({
  maintainer = CONTENT_MAINTAINER,
  lastUpdated,
  evidenceTier,
  citationCount,
  methodologyHref = METHODOLOGY_HREF,
  className,
}: ContentTrustHeaderProps) {
  const updated = formatUpdatedDate(lastUpdated);
  const hasCitations = typeof citationCount === 'number' && citationCount > 0;

  return (
    <div
      className={cn(
        'not-prose flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs text-muted-foreground',
        className,
      )}
      aria-label="Content provenance and evidence summary"
    >
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
        <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" aria-hidden="true" />
        Maintained by {maintainer}
      </span>

      {updated && (
        <>
          <Divider />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent-cyan" aria-hidden="true" />
            Last updated <time dateTime={lastUpdated}>{updated}</time>
          </span>
        </>
      )}

      {evidenceTier && (
        <>
          <Divider />
          <EvidenceBadgeFromTier tier={evidenceTier} size="sm" />
        </>
      )}

      {hasCitations && (
        <>
          <Divider />
          <span className="inline-flex items-center gap-1.5">
            <BookMarked className="h-3.5 w-3.5 text-accent-violet" aria-hidden="true" />
            {citationCount} {citationCount === 1 ? 'citation' : 'citations'}
          </span>
        </>
      )}

      <Divider />
      <Link
        href={methodologyHref}
        className="focus-ring inline-flex items-center gap-1 font-medium text-accent-cyan transition-colors hover:text-accent-emerald"
      >
        How we grade
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default ContentTrustHeader;
