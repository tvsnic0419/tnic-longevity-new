import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { eliteInterventions, eliteTierCounts } from '@/lib/elite-interventions';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { HomeEliteGrid } from '@/components/home/HomeEliteGrid';

/**
 * Section 03 — INTERVENTIONS. The homepage centrepiece: the elite-interventions
 * showcase.
 *
 * Products first — but every card is anchored to real evidence. Each pulls its
 * brand + verified buy link from lib/product-picks.ts and its evidence tier,
 * pathway, dose, and PMID count from lib/data.ts (joined in
 * lib/elite-interventions.ts). The cards + hallmark filter render in the
 * HomeEliteGrid client island; the header, disclosure, and section CTAs stay
 * server-rendered so crawlers see real product markup and internal links.
 */

export function HomeEliteInterventions() {
  const tierA = eliteTierCounts.A ?? 0;

  return (
    <section
      id="elite-interventions"
      aria-labelledby="home-elite-heading"
      className="relative scroll-mt-24 border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider hue="var(--accent-emerald)" index="03" label="Interventions" />
      <div className="container-page">
        <RevealItem className="mb-10 max-w-3xl md:mb-14">
          <p className="text-label mb-3 text-accent-emerald">03 / Interventions</p>
          <h2 id="home-elite-heading" className="heading-section mb-3">
            The compounds with the strongest human evidence — and where to buy them well.
          </h2>
          <div className="heading-accent-rule mb-4" aria-hidden="true" />
          <p className="text-body">
            {eliteInterventions.length} nutrients that act on the hallmarks of aging, each graded by
            the strength of human trials ({tierA} at Tier A), paired with one verified product that
            matches the dose and form used in the studies. Filter by hallmark, or open any card for
            the full evidence.
          </p>
        </RevealItem>

        <RevealItem className="elite-briefing-grid mb-8">
          <div>
            <span className="elite-briefing-label">Evidence threshold</span>
            <strong>{tierA} Tier A</strong>
            <p>Selections led by human clinical evidence.</p>
          </div>
          <div>
            <span className="elite-briefing-label">Match standard</span>
            <strong>Dose-matched</strong>
            <p>Products aligned to the studied form and amount.</p>
          </div>
          <div>
            <span className="elite-briefing-label">Buying posture</span>
            <strong>Verify first</strong>
            <p>Manufacturer link, evidence trace, and COA guidance.</p>
          </div>
        </RevealItem>

        <HomeEliteGrid />

        {/* Disclosure — required because this section leads with product buys */}
        <div className="elite-disclosure premium-card mt-8 p-4 text-sm" style={{ '--card-accent': 'var(--accent-amber)' } as CSSProperties}>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-amber" aria-hidden="true" />
            <p className="leading-relaxed text-muted-foreground">
              <strong className="text-foreground">How to read this.</strong> TNiC doesn&apos;t sell or
              stock supplements. Picks link to the manufacturer and may carry an affiliate token — at
              no extra cost to you, and commission never influences which products are listed or their
              evidence tier. This is educational information, not medical advice; talk to a clinician
              before starting anything, and always request a Certificate of Analysis before you buy.
            </p>
          </div>
        </div>

        {/* Section-scoped actions. The signature gradient primary is reserved
            site-wide for the one newcomer job (NICO), so these product/shop
            destinations use the accent + neutral-outline skins — one shared
            pill radius with the nav and footer CTAs. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="tnic-button-accent focus-ring group inline-flex min-h-[var(--space-touch)] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm [--btn-accent:var(--accent-emerald)]"
          >
            See all recommended products
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/shop"
            className="tnic-button-outline focus-ring inline-flex min-h-[var(--space-touch)] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
          >
            Verify a product before you buy
          </Link>
        </div>
      </div>
    </section>
  );
}
