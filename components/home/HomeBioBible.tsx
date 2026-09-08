import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { GlassPanel } from '@/components/ui/GlassPanel';

const PREVIEW = [
  {
    num: 1,
    name: 'N-Acetyl Cysteine (NAC)',
    dose: '600–1200 mg twice daily',
    targets: 'Meth, Smoke',
    color: '#8b6ad6',
    line: 'Cysteine donor to γ-glutamylcysteine ligase — the rate-limiting step that rebuilds glutathione after dual-exposure collapse.',
  },
  {
    num: 2,
    name: 'Alpha Lipoic Acid — R-ALA',
    dose: '300–600 mg daily',
    targets: 'Meth, Smoke',
    color: '#8b6ad6',
    line: 'Blood–brain–permeant disulfide reductase. Restores ascorbate, α-tocopherol, and glutathione across aqueous and lipid compartments.',
  },
] as const;

export function HomeBioBible() {
  return (
    <section
      id="bio-bible"
      aria-labelledby="home-bio-bible-heading"
      className="relative scroll-mt-24 border-t border-border/50 py-16 md:py-24"
    >
      <CellularDivider hue="var(--accent-cyan)" index="BB" label="Bio Bible" />
      <div className="container-page">
        <RevealItem className="mb-10 max-w-3xl">
          <p className="text-label mb-3 text-accent-cyan">Paid intelligence</p>
          <h2 id="home-bio-bible-heading" className="heading-section mb-3">
            Intelligence they prefer unindexed.
          </h2>
          <div className="heading-accent-rule mb-4" aria-hidden="true" />
          <p className="text-body">
            The open library observes the decorum of conventional longevity publishing.
            Bio Bible does not. It is a dual-exposure cartography — forty compounds,
            nine tiers, seven load-bearing combinations — drawn against the enzymatic
            and organelle lesions inflicted by methamphetamine and tobacco. Two cards
            are disclosed. The remainder is sold as a monograph.
          </p>
          <p className="mt-4 text-body-sm text-muted-foreground">
            Assembled through more than eight hundred hours of machine-assisted
            literature interrogation, then reviewed by fourteen certified nutritionist
            experts and six board-certified, licensed physicians for working ranges,
            chronobiology, and duration. An educational reference — neither a clinical
            trial nor a prescription.
          </p>
        </RevealItem>

        <div className="grid gap-4 md:grid-cols-2">
          {PREVIEW.map((card) => (
            <GlassPanel key={card.num} depth="content" className="relative overflow-hidden rounded-2xl">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1.5"
                style={{ backgroundColor: card.color }}
              />
              <div className="p-5 pl-6">
                <p className="font-mono text-xs text-accent-cyan">CARD {String(card.num).padStart(2, '0')}</p>
                <h3 className="mt-1 font-display text-lg text-foreground">{card.name}</h3>
                <p className="mt-2 text-sm text-accent-cyan">
                  DOSE {card.dose}
                  <span className="mx-2 text-muted-foreground/50">·</span>
                  TARGETS {card.targets}
                </p>
                <p className="mt-3 text-body-sm">{card.line}</p>
              </div>
            </GlassPanel>
          ))}
        </div>

        <p className="mt-4 text-caption">Thirty-eight cards remain behind acquisition.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/biohack-100"
            className="focus-ring tnic-button-primary group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm"
          >
            Acquire the monograph
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/biohack-100/preview"
            className="focus-ring elite-section-secondary-action inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Inspect the public folio
          </Link>
        </div>
      </div>
    </section>
  );
}
