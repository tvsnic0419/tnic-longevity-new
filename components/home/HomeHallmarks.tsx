'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { getHallmarkVisual } from '@/lib/hallmark-visuals';
import { HallmarkIcon } from '@/components/library/HallmarkIcon';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { HallmarksConstellation } from '@/components/ui/HallmarksConstellation';

/**
 * The homepage's evidence surface: all 12 hallmarks of aging, each paired
 * with its top-ranked interventions. The case for TNiC is the interventions
 * themselves, not a pitch about the platform.
 *
 * Selecting a hallmark now opens a **persistent detail panel in place** rather
 * than navigating straight out to a deep-dive — the visitor can compare
 * several mechanisms before committing to a route.
 *
 * Crawlability is preserved deliberately: all twelve detail panels are
 * rendered into the HTML and only the selected one is shown, exactly as the
 * elite grid does with its filter. If the cards were buttons and the panel
 * were conditionally rendered, the homepage would ship one hallmark link
 * instead of twelve.
 */

export function HomeHallmarks() {
  const [activeId, setActiveId] = useState(hallmarkLibrary[0]?.id ?? '');

  return (
    <section
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

        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="group"
          aria-label="The 12 hallmarks of aging"
        >
          {hallmarkLibrary.map((h, i) => {
            const { theme } = getHallmarkVisual(h.visual);
            const isActive = h.id === activeId;

            return (
              <RevealItem key={h.id} index={i} className="h-full">
                <GlassPanel
                  depth="mid"
                  className={`glass-hover h-full overflow-hidden rounded-2xl transition-colors ${
                    isActive ? 'ring-1 ring-accent-emerald/50' : ''
                  }`}
                >
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-controls={`hallmark-detail-${h.id}`}
                    onClick={() => setActiveId(h.id)}
                    className="focus-ring group flex h-full w-full flex-col p-5 text-left"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg icon-badge-${theme}`}>
                        <HallmarkIcon type={h.visual} size={18} ring={false} />
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">#{h.number}</span>
                    </div>
                    <h3 className="heading-card mb-1.5 text-sm">{h.title}</h3>
                    {/* The one-line description. `tagline` was already authored
                        and rendered on /hallmarks, but never here. */}
                    <p className="text-body-sm mb-3 line-clamp-2 leading-snug text-muted-foreground">
                      {h.tagline}
                    </p>
                    <ul className="mt-auto space-y-1.5">
                      {[...h.interventions]
                        .sort((a, b) => a.rank - b.rank)
                        .slice(0, 2)
                        .map((iv) => (
                          <li key={iv.id} className="text-body-sm flex items-center gap-1.5 leading-snug">
                            <EvidenceTag tier={iv.evidence} size="sm" showTooltip={false} />
                            <span className="line-clamp-1">{iv.name}</span>
                          </li>
                        ))}
                    </ul>
                  </button>
                </GlassPanel>
              </RevealItem>
            );
          })}
        </div>

        {/* Persistent detail panel. Every hallmark's panel is in the HTML — only
            the selected one is shown — so all 24 routes below stay crawlable
            from the homepage. */}
        <div className="mt-6">
          {hallmarkLibrary.map((h) => {
            const isActive = h.id === activeId;
            const ranked = [...h.interventions].sort((a, b) => a.rank - b.rank).slice(0, 4);

            return (
              <div
                key={h.id}
                id={`hallmark-detail-${h.id}`}
                className={`premium-card p-6 md:p-7 ${isActive ? 'block' : 'hidden'}`}
                style={{ ['--card-accent' as string]: 'var(--accent-emerald)' }}
              >
                <p className="text-label mb-2 text-accent-emerald">
                  Hallmark {h.number} · {ranked.length} ranked interventions
                </p>
                <h3 className="heading-card mb-1.5 text-lg">{h.title}</h3>
                <p className="text-body mb-5 max-w-[60ch]">{h.tagline}</p>

                <ul className="mb-6 grid gap-2 sm:grid-cols-2">
                  {ranked.map((iv) => (
                    <li
                      key={iv.id}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-white/[0.02] px-3 py-2"
                    >
                      <span className="tnic-tabular shrink-0 font-mono text-micro font-bold text-muted-foreground">
                        {String(iv.rank).padStart(2, '0')}
                      </span>
                      <EvidenceTag tier={iv.evidence} size="sm" showTooltip={false} />
                      <span className="text-body-sm line-clamp-1">{iv.name}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/hallmarks/${h.slug}`}
                    className="focus-ring tnic-button-tonal [--btn-accent:var(--accent-emerald)] inline-flex min-h-[var(--space-touch)] items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm"
                  >
                    Read the {h.title} deep dive
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/library/${h.slug}`}
                    className="focus-ring tnic-button-outline inline-flex min-h-[var(--space-touch)] items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Library module
                  </Link>
                </div>
              </div>
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
