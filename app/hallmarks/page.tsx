import type { Metadata } from 'next';
import Link from 'next/link';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { citationRegistry } from '@/lib/trust';
import { ArrowRight, Dna, FlaskConical } from 'lucide-react';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealItem } from '@/components/ui/RevealItem';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  title: '12 Hallmarks of Aging | TNiC Longevity Science',
  description:
    'The complete guide to all 12 hallmarks of aging — genomic instability, telomere attrition, epigenetic alterations, and more. Evidence-graded interventions and biomarker monitoring for each.',
  openGraph: {
    title: '12 Hallmarks of Aging — Evidence Guide | TNiC',
    description:
      'Mechanism maps, PMID-cited interventions, and biomarker tracking templates for all 12 molecular causes of aging.',
  },
};

const EDITORIAL_SLUGS = new Set([
  'genomic-instability',
  'telomere-attrition',
  'epigenetic-alterations',
  'loss-of-proteostasis',
  'disabled-autophagy',
  'mitochondrial-dysfunction',
  'cellular-senescence',
  'stem-cell-exhaustion',
  'altered-intercellular-communication',
  'chronic-inflammation',
  'dysbiosis',
  'deregulated-nutrient-sensing',
]);

// Coverage keeps its semantic green→amber→rose signal (how well TNiC covers the
// hallmark), resolved to the design-system status tokens so it matches the rest
// of the instrument. Returned as a CSS color string so it can drive both the
// percentage label and the premium-meter fill (via --card-accent).
const COVERAGE_COLOR = (pct: number) =>
  pct >= 80
    ? 'var(--status-optimal)'
    : pct >= 60
    ? 'var(--status-watch)'
    : 'var(--status-critical)';

export default function HallmarksIndexPage() {
  // Derived from the live library so the rail can never drift from what's
  // published: unique compounds with Tier A/B evidence mapped to a hallmark.
  const tierABCompounds = new Set(
    hallmarkLibrary
      .flatMap((h) => h.interventions)
      .filter((i) => (i.evidence === 'A' || i.evidence === 'B') && i.compoundId)
      .map((i) => i.compoundId as string),
  ).size;

  return (
    <>
      <CinematicHubHero
        hue="emerald"
        kicker="Longevity Science"
        title={<>The molecular <em>causes</em> of aging.</>}
        lead="Twelve cellular mechanisms drive how we age — each paired here with the PMID-cited interventions that move it. This is the map every rational protocol is built on."
        stats={[
          { value: String(hallmarkLibrary.length), label: 'Hallmarks mapped' },
          { value: String(citationRegistry.length), label: 'PMID citations' },
          { value: String(tierABCompounds), label: 'Tier A/B compounds' },
        ]}
        primary={{ href: '/stacks', label: 'Build my stack' }}
        secondary={{ href: '/library', label: 'Interactive library' }}
      />

      {/* Semantic page title + framework attribution */}
      <section className="pt-12 md:pt-16 pb-2 relative">
        <div className="relative container-page">
          <PageHeader
            icon={Dna}
            eyebrow="Longevity Science"
            title="The 12 Hallmarks of Aging"
            description="First systematized by López-Otín et al. (2013, updated 2023), the hallmarks are the molecular and cellular mechanisms that cause organisms to age. Understanding them is the prerequisite for any rational anti-aging protocol."
            theme="emerald"
          />
        </div>
      </section>

        {/* Hallmark grid */}
        <section className="py-20">
          <div className="container-page max-w-5xl">
            <p className="text-label text-accent-emerald mb-3">All 12 Hallmarks</p>
            <h2 className="heading-section mb-10">
              The complete molecular map of aging.
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hallmarkLibrary.map((h, i) => {
                const hasEditorial = EDITORIAL_SLUGS.has(h.slug);
                const topIntervention = [...h.interventions].sort((a, b) => a.rank - b.rank)[0];
                const coverageColor = COVERAGE_COLOR(h.coverage);
                return (
                  <RevealItem key={h.id} index={i} className="h-full">
                    <div
                      className="premium-card h-full p-5"
                      style={{ ['--card-accent' as string]: 'var(--accent-emerald)' }}
                    >
                      {/* Header */}
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs text-muted-foreground">#{h.number}</span>
                          <h3 className="mt-0.5 font-display text-lg font-medium tracking-tight text-foreground">
                            {h.title}
                          </h3>
                        </div>
                        <span
                          className="shrink-0 font-mono text-xs font-bold tabular-nums"
                          style={{ color: coverageColor }}
                        >
                          {h.coverage}%
                        </span>
                      </div>

                      <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">{h.tagline}</p>

                      {/* Coverage bar — semantic status color, premium fill */}
                      <div className="mb-3">
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="premium-meter transition-[width] duration-500"
                            style={{ width: `${h.coverage}%`, ['--card-accent' as string]: coverageColor }}
                          />
                        </div>
                        <p className="mt-1 text-micro text-muted-foreground">TNiC coverage</p>
                      </div>

                      {/* Biomarkers */}
                      <div className="mb-4 flex flex-wrap gap-1">
                        {h.biomarkers.slice(0, 2).map((b) => (
                          <span key={b} className="rounded-md border border-border/60 bg-white/[0.02] px-2 py-0.5 text-xs text-muted-foreground">
                            {b}
                          </span>
                        ))}
                        {h.biomarkers.length > 2 && (
                          <span className="rounded-md border border-border/60 bg-white/[0.02] px-2 py-0.5 text-xs text-muted-foreground">
                            +{h.biomarkers.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Top intervention — reuse the shared EvidenceTag */}
                      {topIntervention && (
                        <div className="mb-4 flex items-center gap-2 text-xs">
                          <EvidenceTag tier={topIntervention.evidence} size="sm" />
                          <span className="truncate text-muted-foreground">{topIntervention.name}</span>
                        </div>
                      )}

                      {/* Links */}
                      <div className="mt-auto flex gap-2">
                        <Link
                          href={`/library/${h.slug}`}
                          className="focus-ring flex-1 rounded-lg border border-border bg-white/[0.02] py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                        >
                          Library →
                        </Link>
                        {hasEditorial && (
                          <Link
                            href={`/hallmarks/${h.slug}`}
                            className="focus-ring flex-1 rounded-lg border border-accent-emerald/30 bg-accent-emerald/[0.06] py-2 text-center text-xs font-medium text-accent-emerald transition-colors hover:bg-accent-emerald/12"
                          >
                            Deep Dive →
                          </Link>
                        )}
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </div>
          </div>
        </section>

        {/* López-Otín attribution */}
        <section className="py-12 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-3xl text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">Scientific Foundation</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The hallmarks framework was first published in{' '}
              <a href="https://pubmed.ncbi.nlm.nih.gov/22768836/" target="_blank" rel="noopener noreferrer" className="text-accent-emerald hover:underline">
                Cell 2013 (PMID: 22768836)
              </a>{' '}
              by López-Otín et al. and expanded to 12 hallmarks in the{' '}
              <a href="https://pubmed.ncbi.nlm.nih.gov/36599349/" target="_blank" rel="noopener noreferrer" className="text-accent-emerald hover:underline">
                2023 update (PMID: 36599349)
              </a>.{' '}
              TNiC maps interventions to this framework using Tier A/B/C evidence grading. The hallmarks are a descriptive
              framework, not a complete mechanistic theory — causality between hallmarks is bidirectional and context-dependent.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <FlaskConical className="w-10 h-10 text-emerald-400 mx-auto mb-5" />
            <h2 className="heading-section mb-4">
              Target multiple hallmarks at once.
            </h2>
            <p className="text-muted-foreground mb-8">
              The Stack Architect shows hallmark coverage for every compound combination in real time —
              so you know exactly which aging mechanisms your protocol addresses.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="focus-ring group inline-flex items-center gap-2 tnic-button-accent [--btn-accent:var(--accent-emerald)] rounded-xl px-6 py-3 text-sm">
                Stack Architect <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/bio-age" className="focus-ring inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
                Calculate Bio Age
              </Link>
            </div>
          </div>
        </section>
    </>
  );
}
