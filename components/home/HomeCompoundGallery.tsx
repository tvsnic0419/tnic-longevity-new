import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { compoundModules, getModulePath, COMPOUND_COUNT } from '@/lib/library-modules';
import { hasGeometry } from '@/components/viz/molecule';
import { MoleculeStage } from '@/components/viz/MoleculeStage';
import { signatureHue } from '@/components/viz/tokens';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';

/**
 * A preview of the compound library — a real ball-and-stick structure where
 * one has been hand-verified (see components/viz/molecule.ts), an
 * honestly-labeled illustrative orbital field otherwise. Never a fabricated
 * structure passed off as literal; MoleculeStage/CompoundHero already enforce
 * that same rule on each compound's own deep-dive page.
 *
 * This used to render every module in the library. Each tile is a canvas
 * renderer, so the landing page was mounting ~56 of them — the single largest
 * source of work on the page, for a wall of near-identical thumbnails that
 * conveys nothing the first dozen don't. The full set lives one click away at
 * /library/compounds, which is the right place to browse. Keep this a
 * preview; the copy below states the real library size rather than implying
 * the grid is exhaustive.
 */
const PREVIEW_COUNT = 12;

export function HomeCompoundGallery() {
  return (
    <section
      aria-labelledby="home-compound-gallery-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider hue="var(--accent-cyan)" index="06" label="The compounds" />
      <div className="container-page">
        <div className="mb-10 items-center gap-10 lg:mb-14 lg:grid lg:grid-cols-12">
          <RevealItem className="lg:col-span-7">
            <p className="text-label mb-3 text-accent-cyan">The compounds, rendered</p>
            <h2 id="home-compound-gallery-heading" className="heading-section mb-3">
              {COMPOUND_COUNT} compounds — every one graded, every one linked to its deep-dive.
            </h2>
            <p className="text-body mb-4">
              Real hand-verified structures where we have them; an honestly-labeled illustrative
              field otherwise. Click any compound for mechanism, dosing, and citations.
            </p>
            <Link
              href="/library/compounds"
              className="focus-ring group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan transition-colors hover:text-accent-emerald"
            >
              Browse all {COMPOUND_COUNT} compounds
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </RevealItem>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {compoundModules.slice(0, PREVIEW_COUNT).map((m, i) => {
            const structured = m.compoundId ? hasGeometry(m.compoundId) : false;
            const hue = signatureHue(m.compoundId ?? m.slug);
            return (
              <RevealItem key={m.slug} index={i} className="h-full">
                <Link
                  href={getModulePath(m)}
                  /* This grid renders one link per compound. Next.js prefetches
                     every in-viewport Link by default, so the homepage was
                     speculatively downloading and compiling ~470 KB of route
                     payloads for pages the visitor may never open. The tiles
                     are a gallery, not a primary nav path — fetch on click. */
                  prefetch={false}
                  className="focus-ring interactive group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-colors hover:border-accent-cyan/40"
                >
                  <div className="relative aspect-square w-full bg-black/20">
                    <MoleculeStage
                      geometryId={structured ? m.compoundId : undefined}
                      hue={hue}
                      interactive={false}
                      animate={false}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <span className="truncate text-sm font-semibold text-foreground group-hover:text-accent-cyan transition-colors">
                      {m.title.replace(/\s*\(.*\)\s*$/, '')}
                    </span>
                    <EvidenceTag tier={m.evidenceTier} size="sm" className="shrink-0" />
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/library/compounds"
            className="focus-ring group inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
          >
            See all {COMPOUND_COUNT} compounds
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
