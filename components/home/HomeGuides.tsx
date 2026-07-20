import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';

/**
 * A curated set of high-intent guides. Rendered as real server-side <a> links so
 * crawlers pick up the internal linking, and readers get an inviting entry point
 * into the depth of the library. One guide — the ranked shortlist, the natural
 * "start here" for anyone new — is laid out as a featured card rather than an
 * equal-weight tile; the rest read as a supporting list, not a duplicate grid.
 */

const featured = {
  href: '/longevity-supplements-guide',
  label: 'Best Longevity Supplements 2026',
  kicker: 'The evidence-ranked shortlist',
};

const guides: { href: string; label: string; kicker: string }[] = [
  {
    href: '/nad-supplement-guide',
    label: 'NAD+ Supplement Guide',
    kicker: 'NMN, NR & precursors, compared',
  },
  {
    href: '/glynac-supplement-guide',
    label: 'GlyNAC Supplement Guide',
    kicker: 'The most-studied aging RCT pair',
  },
  {
    href: '/berberine-supplement-guide',
    label: "Berberine — Nature's Ozempic?",
    kicker: 'A reality check on the hype',
  },
  {
    href: '/taurine-supplement-guide',
    label: 'Taurine Longevity Guide',
    kicker: 'What the 2023 Science paper showed',
  },
  {
    href: '/sulforaphane-supplement-guide',
    label: 'Sulforaphane & NRF2 Guide',
    kicker: "The body's master antioxidant switch",
  },
  {
    href: '/spermidine-supplement-guide',
    label: 'Spermidine & Autophagy',
    kicker: 'Cellular cleanup, and the ITP data',
  },
  {
    href: '/elite-8',
    label: 'The Elite 8 Ranking',
    kicker: 'Our highest-conviction compounds',
  },
];

export function HomeGuides() {
  return (
    <section
      aria-labelledby="home-guides-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider />
      <div className="container-page">
        <RevealItem className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-label mb-3 text-accent-violet">Start reading</p>
            <h2 id="home-guides-heading" className="heading-section mb-3">
              Deep, sourced guides — not sales copy.
            </h2>
            <p className="text-body">
              Each guide walks the mechanism, the human data, and the honest limits before
              it ever mentions a dose.
            </p>
          </div>
          <Link
            href="/supplement-guides"
            className="focus-ring group hidden shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Browse all guides
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </RevealItem>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <RevealItem index={0} className="lg:col-span-5">
            <GlassPanel depth="mid" className="glass-hover h-full overflow-hidden rounded-2xl">
              <Link
                href={featured.href}
                className="focus-ring group flex h-full min-h-[220px] flex-col justify-between gap-8 p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-label text-accent-violet">Start here</span>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-cyan"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-caption mb-2 text-accent-violet">{featured.kicker}</p>
                  <h3 className="heading-section text-2xl leading-snug">{featured.label}</h3>
                </div>
              </Link>
            </GlassPanel>
          </RevealItem>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {guides.map(({ href, label, kicker }, i) => (
              <RevealItem key={href} index={i + 1}>
                <Link
                  href={href}
                  className="focus-ring interactive group flex h-full flex-col justify-between gap-4 rounded-xl border border-border/60 bg-card/40 p-4 hover:border-accent-violet/30"
                >
                  <ArrowUpRight
                    className="h-3.5 w-3.5 self-end text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-cyan"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-caption mb-1 text-accent-violet">{kicker}</p>
                    <h4 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-cyan">
                      {label}
                    </h4>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
