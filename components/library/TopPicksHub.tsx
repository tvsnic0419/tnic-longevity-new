import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Dna } from 'lucide-react';
import { compounds } from '@/lib/data';
import { topPickCategories } from '@/lib/top-picks';
import { themes } from '@/lib/design-system';
import { getHubContext } from '@/lib/hub-context';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { ContextRail } from '@/components/ui/ContextRail';

/**
 * Server-rendered — every category/pick is real crawlable markup, matching
 * the homepage/peptides-hub pattern rather than the client-only shell some
 * older library pages use.
 */
export function TopPicksHub() {
  const ctx = getHubContext('topPicks');

  return (
    <div className="py-8 md:py-10">
      <div className="container-page">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <p className="text-label mb-3 text-accent-violet">Editorial Curation</p>
          <h1 className="heading-page mb-4">Top TNiC picks by pathway.</h1>
          <p className="text-body mx-auto max-w-2xl">
            Sirtuin activation, PARP-mediated DNA repair, and NRF2 antioxidant signaling share more
            biology than their names suggest — NAD+ fuels the first two, and glutathione status
            underwrites the third. Here are TNiC&apos;s highest-conviction picks for each, and the
            mechanistic reason each one made the list.
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-3xl md:mb-16">
          <ContextRail what={ctx.what} why={ctx.why} next={ctx.next} theme={ctx.theme} variant="compact" />
        </div>

        <div className="space-y-14">
          {topPickCategories.map((category) => {
            const t = themes[category.theme];
            return (
              <section key={category.id} aria-labelledby={`${category.id}-heading`}>
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <span className={t.sectionBadge}>
                      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} aria-hidden="true" />
                      {category.pathwayTag}
                    </span>
                    <h2 id={`${category.id}-heading`} className="heading-section mt-3 mb-2 text-xl md:text-2xl">
                      {category.label}
                    </h2>
                    <p className="text-body-sm leading-relaxed">{category.summary}</p>
                  </div>
                </div>

                <ol className="space-y-3">
                  {category.picks.map((pick) => {
                    const compound = compounds.find((c) => c.id === pick.compoundId);
                    if (!compound) return null;
                    return (
                      <li key={`${category.id}-${pick.compoundId}`}>
                        <Link
                          href={`/library/compounds/${compound.id}`}
                          className="focus-ring interactive glass glass-hover group flex items-start gap-4 rounded-2xl p-5"
                        >
                          <span
                            className={`font-mono text-2xl font-black leading-none shrink-0 ${t.text}`}
                            aria-hidden="true"
                          >
                            {String(pick.rank).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="font-semibold text-base">{compound.name}</span>
                              <EvidenceTag tier={compound.evidence} size="sm" />
                              <span className="text-caption">{compound.pathway}</span>
                            </div>
                            <p className="text-body-sm mt-1.5 leading-relaxed">{pick.why}</p>
                          </div>
                          <ArrowUpRight
                            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <Link
            href="/library/systems"
            className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-accent-violet glass glass-hover px-5 py-2.5 rounded-full glow-hover-violet transition"
          >
            <Dna className="h-4 w-4" aria-hidden="true" />
            See how these pathways interact — Systems Map
          </Link>
          <p className="text-caption mt-4">
            Editorial synthesis from peer-reviewed literature already cited on each compound&apos;s
            evidence page — not a new evidence claim. See{' '}
            <Link href="/trust/methodology" className="text-accent-cyan hover:underline">
              evidence tier grading
            </Link>{' '}
            for study-level detail.
          </p>
        </div>
      </div>
    </div>
  );
}
