import Link from 'next/link';
import { ArrowRight, BookOpen, GitCompareArrows, Dna } from 'lucide-react';
import { getSiblingGuides, getCompoundSlugsForGuide, getHallmarksForGuide } from '@/lib/guides';
import { getComparisonsForCompound, type ComparisonLink } from '@/lib/comparison-relations';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

/**
 * In-context cross-links for a supplement-guide landing page: sibling guides
 * and the head-to-head comparisons that feature the compound(s) this guide
 * covers. Both are DERIVED — siblings from the guide registry, comparisons by
 * inverting the compound→guide map and reusing getComparisonsForCompound — so
 * the guide never becomes a dead end and the links can never drift from the
 * library graph. Closes the guide→sibling-guide / guide→comparison loops that
 * previously leaned on the footer's popular-guides list.
 */
export function GuideCrossLinks({ currentHref }: { currentHref: string }) {
  const siblings = getSiblingGuides(currentHref);

  // Comparisons that feature any compound this guide covers, de-duplicated.
  const seen = new Set<string>();
  const comparisons: ComparisonLink[] = [];
  for (const slug of getCompoundSlugsForGuide(currentHref)) {
    for (const c of getComparisonsForCompound(slug)) {
      if (!seen.has(c.slug)) {
        seen.add(c.slug);
        comparisons.push(c);
      }
    }
  }

  const hallmarks = getHallmarksForGuide(currentHref);

  if (siblings.length === 0 && comparisons.length === 0 && hallmarks.length === 0) return null;

  return (
    <section aria-labelledby="guide-cross-links-heading" className="border-t border-border/50 py-14 md:py-16">
      <div className="container-page">
        <p className="text-label mb-2 text-accent-cyan">Keep exploring</p>
        <h2 id="guide-cross-links-heading" className="heading-section mb-8">
          Related guides &amp; comparisons
        </h2>

        {siblings.length > 0 && (
          <div className="mb-10">
            <p className="text-label mb-4 flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Other supplement guides
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {siblings.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  style={{ ['--card-accent' as string]: 'var(--accent-cyan)' }}
                  className="premium-card focus-ring group h-full p-5"
                >
                  <div className="mb-2">
                    <EvidenceTag tier={g.tier} size="sm" />
                  </div>
                  <h3 className="font-display text-base font-medium leading-tight tracking-tight text-foreground transition-colors group-hover:[color:var(--card-accent)]">
                    {g.label}
                  </h3>
                  <p className="mt-1 text-body-sm flex-1 text-muted-foreground">{g.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold [color:var(--card-accent)]">
                    Read guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {hallmarks.length > 0 && (
          <div className="mb-10">
            <p className="text-label mb-4 flex items-center gap-2 text-muted-foreground">
              <Dna className="h-3.5 w-3.5" aria-hidden="true" />
              Hallmarks of aging it targets
            </p>
            <div className="flex flex-wrap gap-2">
              {hallmarks.map((h) => (
                <Link
                  key={h.slug}
                  href={`/library/${h.slug}`}
                  className="focus-ring group inline-flex items-center gap-2 rounded-full border border-accent-emerald/25 bg-accent-emerald/[0.06] px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent-emerald/50 hover:bg-accent-emerald/12"
                >
                  <span className="font-mono text-[11px] text-accent-emerald">
                    {String(h.number).padStart(2, '0')}
                  </span>
                  {h.title}
                  <ArrowRight className="h-3.5 w-3.5 text-accent-emerald opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {comparisons.length > 0 && (
          <div>
            <p className="text-label mb-4 flex items-center gap-2 text-muted-foreground">
              <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" />
              Head-to-head comparisons
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comparisons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/library/compare/${c.slug}`}
                  style={{ ['--card-accent' as string]: 'var(--accent-violet)' }}
                  className="premium-card focus-ring group h-full p-5"
                >
                  <h3 className="font-display text-base font-medium tracking-tight text-foreground transition-colors group-hover:[color:var(--card-accent)]">
                    {c.labelA} <span className="text-muted-foreground">vs</span> {c.labelB}
                  </h3>
                  <p className="mt-1 text-body-sm flex-1 text-muted-foreground">{c.title}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold [color:var(--card-accent)]">
                    Compare
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
