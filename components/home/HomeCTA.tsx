import Link from 'next/link';
import { Library, ClipboardList, ArrowRight } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { RevealItem } from '@/components/ui/RevealItem';

/** Final conversion band — one confident ask, server-rendered. */
export function HomeCTA() {
  return (
    <section
      aria-labelledby="home-cta-heading"
      className="relative overflow-hidden border-t border-border/50 py-24 md:py-32"
    >
      <CellularDivider hue="var(--accent-cyan)" label="Begin" />
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-cyan)_16%,transparent),transparent_65%)] blur-2xl" />
      </div>

      <div className="container-page">
        <RevealItem className="mx-auto max-w-2xl text-center">
          <p className="text-label mb-4 text-accent-cyan">Your first move</p>
          <h2 id="home-cta-heading" className="heading-section mb-4">
            See what the evidence actually supports.
          </h2>
          <p className="text-body mx-auto mb-9 max-w-xl">
            Browse the library by hallmark or compound, or take the NICO Starter Questionnaire for a
            personalized stack. Private, free, and no account — ever.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/library"
              className="btn-gradient focus-ring group justify-center rounded-full text-base"
            >
              <Library className="h-5 w-5" aria-hidden="true" />
              Explore the evidence
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <GlassPanel depth="float" className="glass-hover rounded-full">
              <Link
                href="/nico"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-foreground"
              >
                <ClipboardList className="h-5 w-5 text-accent-cyan" aria-hidden="true" />
                Take the NICO Starter Questionnaire
              </Link>
            </GlassPanel>
          </div>
        </RevealItem>
      </div>
    </section>
  );
}
