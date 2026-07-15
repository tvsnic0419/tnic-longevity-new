import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { getHallmarkVisual } from '@/lib/hallmark-visuals';
import { HallmarkIcon } from '@/components/library/HallmarkIcon';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { HallmarksConstellation } from '@/components/ui/HallmarksConstellation';

/**
 * The homepage's evidence surface: all 12 hallmarks of aging, each paired
 * with its top-ranked interventions. Replaces the old trust-narrative
 * section — the case for TNiC is the interventions themselves, not a pitch
 * about the platform.
 */

const TIER_TEXT: Record<'A' | 'B' | 'C', string> = {
  A: 'text-emerald-400',
  B: 'text-amber-400',
  C: 'text-rose-400',
};

export function HomeHallmarks() {
  return (
    <section
      aria-labelledby="home-hallmarks-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider />
      <div className="container-page">
        <div className="mb-10 items-center gap-10 lg:mb-14 lg:grid lg:grid-cols-12">
          <RevealItem className="lg:col-span-7">
            <p className="text-label mb-3 text-accent-emerald">Interventions by hallmark</p>
            <h2 id="home-hallmarks-heading" className="heading-section mb-3">
              Twelve mechanisms of aging. A ranked, cited intervention for each.
            </h2>
            <p className="text-body mb-4">
              Every hallmark links to its highest-evidence levers — compounds, lifestyle
              changes, and clinical options — ranked by impact and traced to PubMed, not
              marketing copy.
            </p>
            <Link
              href="/hallmarks"
              className="focus-ring group hidden items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              See all 12 hallmarks
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </RevealItem>

          {/* Orbital map of all 12 hallmarks — hover/focus any node for a live
              preview. Same data as the grid below, browsable at a glance
              instead of read serially; the grid stays for anyone who wants
              the full ranked detail on every one. */}
          <div className="mt-8 lg:col-span-5 lg:mt-0">
            <HallmarksConstellation />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hallmarkLibrary.map((h, i) => {
            const { theme } = getHallmarkVisual(h.visual);
            const topInterventions = [...h.interventions].sort((a, b) => a.rank - b.rank).slice(0, 2);

            return (
              <RevealItem key={h.id} index={i}>
                <GlassPanel depth="mid" className="glass-hover h-full overflow-hidden rounded-2xl">
                  <Link href={`/hallmarks/${h.slug}`} className="focus-ring group flex h-full flex-col p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg icon-badge-${theme}`}>
                        <HallmarkIcon type={h.visual} size={18} ring={false} />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground/60">
                          #{h.number}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <h3 className="heading-card mb-3 text-sm">{h.title}</h3>
                    <ul className="mt-auto space-y-1.5">
                      {topInterventions.map((iv) => (
                        <li key={iv.id} className="text-body-sm flex items-baseline gap-1.5 leading-snug">
                          <span className={`shrink-0 font-mono text-[10px] font-bold ${TIER_TEXT[iv.evidence]}`}>
                            {iv.evidence}
                          </span>
                          <span className="line-clamp-1">{iv.name}</span>
                        </li>
                      ))}
                    </ul>
                  </Link>
                </GlassPanel>
              </RevealItem>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/hallmarks"
            className="focus-ring group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            See all 12 hallmarks
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
