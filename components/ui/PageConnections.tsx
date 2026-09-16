import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PageCluster } from '@/lib/page-connections';

/**
 * The contextual next-steps rail for pages the entity graph cannot reach —
 * trust, editorial, policy and the client-islanded tools. See
 * `lib/page-connections.ts` for why these are declared rather than generated.
 *
 * Visually the sibling of `EntityChips`: same `.premium-card` ground, same
 * label treatment. It renders as cards rather than chips because these
 * destinations need a clause of explanation ("What Tier A, B and C each
 * require") where an entity chip only needs a name.
 *
 * Server component, no client bundle. Renders nothing when the cluster is
 * empty, so a one-member cluster viewed from its only member disappears
 * instead of leaving an empty heading.
 */
// Static map, not an interpolated class name: Tailwind scans source text, so
// `text-accent-${accent}` would be purged and every rail would render with the
// default foreground colour.
const ACCENT: Record<string, string> = {
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
  emerald: 'text-accent-emerald',
  amber: 'text-accent-amber',
  rose: 'text-accent-rose',
};

export function PageConnections({
  cluster,
  className = '',
  accent = 'cyan',
  id = 'page-connections',
}: {
  cluster: PageCluster;
  className?: string;
  accent?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  /** Disambiguates the heading id when a page mounts more than one rail. */
  id?: string;
}) {
  if (cluster.members.length === 0) return null;
  return (
    <section aria-labelledby={`${id}-heading`} className={`mt-14 ${className}`}>
      <div className="premium-card p-5 md:p-7">
        <p className={`text-label mb-2 ${ACCENT[accent]}`}>{cluster.title}</p>
        <h2 id={`${id}-heading`} className="heading-section mb-2 text-xl md:text-2xl">
          {cluster.intro}
        </h2>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {cluster.members.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="focus-ring group rounded-2xl border border-border/60 bg-background/25 p-4 transition-colors hover:border-accent-cyan/40 hover:bg-accent-cyan/[0.07]"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground group-hover:text-accent-cyan">
                  {m.label}
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-1 block text-caption leading-relaxed">{m.detail}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
