import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { getHallmarkVisual } from '@/lib/hallmark-visuals';
import { HallmarkIcon } from '@/components/library/HallmarkIcon';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { HallmarksConstellation } from '@/components/ui/HallmarksConstellation';

/**
 * The homepage's evidence surface: all 12 hallmarks of aging, each paired
 * with its top-ranked interventions. Replaces the old trust-narrative
 * section — the case for TNiC is the interventions themselves, not a pitch
 * about the platform.
 *
 * Each card is a color-coded instrument tile: its frame carries the hallmark's
 * own accent (`--card-accent`), while the ranked-intervention rows carry the
 * canonical evidence-tier colors (A/emerald · B/cyan · C/amber) — the frame says
 * *which mechanism*, the chips say *how strong the evidence*.
 */

// Map each hallmark's theme accent to the CSS custom property the .hm-card frame
// reads. Kept explicit (not string-built) so the accent set stays a closed,
// auditable list rather than an arbitrary interpolation.
const ACCENT_VAR: Record<string, string> = {
  cyan: 'var(--accent-cyan)',
  emerald: 'var(--accent-emerald)',
  violet: 'var(--accent-violet)',
  amber: 'var(--accent-amber)',
  rose: 'var(--accent-rose)',
};

export function HomeHallmarks() {
  return (
    <section
      id="mechanisms"
      aria-labelledby="home-hallmarks-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider hue="var(--accent-emerald)" index="04" label="Mechanisms" />
      <div className="container-page">
        <div className="mb-10 items-center gap-10 lg:mb-14 lg:grid lg:grid-cols-12">
          <RevealItem className="lg:col-span-7">
            <p className="text-label mb-3 text-accent-emerald">04 / Mechanisms</p>
            <h2 id="home-hallmarks-heading" className="heading-section mb-3">
              Twelve mechanisms of aging. A ranked, cited intervention for each.
            </h2>
            <div className="heading-accent-rule mb-4" aria-hidden="true" />
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
            const topInterventions = [...h.interventions].sort((a, b) => a.rank - b.rank).slice(0, 3);

            return (
              <RevealItem key={h.id} index={i}>
                <Link
                  href={`/hallmarks/${h.slug}`}
                  className="hm-card focus-ring group"
                  style={{ '--card-accent': ACCENT_VAR[theme] ?? 'var(--accent-cyan)' } as CSSProperties}
                >
                  <div className="hm-card__head">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl icon-badge-${theme}`}>
                      <HallmarkIcon type={h.visual} size={20} ring={false} />
                    </span>
                    <span className="hm-card__num" aria-hidden="true">
                      {String(h.number).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="hm-card__title">{h.title}</h3>
                  <ul className="hm-card__rows">
                    {topInterventions.map((iv) => (
                      <li key={iv.id} className="hm-row">
                        <span className={`hm-tier hm-tier--${iv.evidence}`} aria-hidden="true">
                          {iv.evidence}
                        </span>
                        <span className="hm-row__name">
                          <span className="sr-only">Tier {iv.evidence}: </span>
                          {iv.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <span className="hm-card__go">
                    View mechanism
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
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
