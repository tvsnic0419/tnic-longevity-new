import Link from 'next/link';
import { ShieldCheck, CalendarClock, Users } from 'lucide-react';

/**
 * Authorship + freshness byline for content deep-dives — a core E-E-A-T signal
 * for a health (YMYL) library. Shows who authored the page, when it was last
 * updated, and links to the transparent evidence-grading methodology.
 *
 * The `reviewer` line is an honest independent-clinical-review signal: it only
 * renders when a real reviewer name is supplied (via MDX frontmatter). Until
 * then nothing is claimed — matching the site's editorial-policy disclosure.
 */
export function ContentByline({
  author = 'TNiC Research Team',
  lastUpdated,
  reviewer,
  className = '',
}: {
  author?: string;
  lastUpdated?: string;
  reviewer?: string;
  className?: string;
}) {
  const formatted = formatDate(lastUpdated);
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground ${className}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-accent-cyan" aria-hidden="true" />
        By <span className="text-foreground font-medium">{author}</span>
      </span>
      {formatted && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="w-3.5 h-3.5 text-accent-cyan" aria-hidden="true" />
          Updated <time dateTime={lastUpdated}>{formatted}</time>
        </span>
      )}
      {reviewer && (
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" aria-hidden="true" />
          Medically reviewed by <span className="text-foreground font-medium">{reviewer}</span>
        </span>
      )}
      <Link
        href="/trust/methodology"
        className="inline-flex items-center gap-1.5 text-accent-cyan hover:text-accent-emerald transition focus-ring rounded"
      >
        How we grade evidence →
      </Link>
    </div>
  );
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
