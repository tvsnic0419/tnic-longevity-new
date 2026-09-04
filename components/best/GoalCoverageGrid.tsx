import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { bestForGoals } from '@/lib/best-for';

// ─────────────────────────────────────────────────────────────────────────────
// GoalCoverageGrid — an orientation panel for the "best for [goal]" hub. Each
// goal is ranked evidence over a set of hallmarks; this shows, per goal, how
// many aging hallmarks it spans and how many graded compounds are mapped to it,
// so a visitor can pick a goal by mechanistic breadth, not just its name.
// Derived from `bestForGoals` (hallmarkIds / boost). Server-safe.
// ─────────────────────────────────────────────────────────────────────────────

const HALLMARK_TOTAL = 12;

/** Trim the SEO "Best Supplements for " prefix down to the goal itself. */
function shortGoal(title: string): string {
  return title
    .replace(/^Best\s+(Longevity\s+&\s+Anti-Aging\s+)?Supplements?\s+(for\s+|to\s+)?/i, '')
    .replace(/\s+—.*$/, '')
    .trim() || title;
}

export function GoalCoverageGrid({ className = '' }: { className?: string }) {
  const goals = bestForGoals
    .map((g) => ({
      slug: g.slug,
      name: shortGoal(g.title),
      hallmarks: g.hallmarkIds.length,
      compounds: g.boost.length,
    }))
    .sort((a, b) => b.hallmarks - a.hallmarks);

  if (goals.length === 0) return null;

  return (
    <section
      className={`premium-card p-5 sm:p-7 ${className}`}
      style={{ ['--card-accent' as string]: 'var(--accent-cyan)' }}
      aria-label={`Goal coverage: ${goals.length} goals, each mapped to aging hallmarks and graded compounds`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-label text-[var(--color-text-faint)]">Goal coverage</p>
          <h2 className="heading-card mt-1 text-foreground">
            {goals.length} goals, by mechanistic breadth
          </h2>
        </div>
        <p className="font-mono text-micro text-[var(--color-text-faint)]">Hallmarks spanned · compounds ranked</p>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/best/${g.slug}`}
              className="focus-ring group flex h-full flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--accent-cyan)_40%,transparent)]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-body-sm font-semibold text-foreground transition-colors group-hover:text-accent-cyan">
                  {g.name}
                </span>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-accent-cyan motion-reduce:transition-none" aria-hidden="true" />
              </div>

              {/* Hallmark span dots */}
              <div className="mt-3 flex items-center gap-2">
                <span className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: HALLMARK_TOTAL }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background:
                          i < g.hallmarks
                            ? 'var(--accent-cyan)'
                            : 'color-mix(in srgb, var(--color-text-primary) 12%, transparent)',
                      }}
                    />
                  ))}
                </span>
                <span className="font-mono text-micro text-[var(--color-text-muted)]">
                  {g.hallmarks}/{HALLMARK_TOTAL}
                </span>
              </div>

              <div className="mt-2 font-mono text-micro text-[var(--color-text-faint)]">
                {g.compounds} compound{g.compounds === 1 ? '' : 's'} ranked
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
