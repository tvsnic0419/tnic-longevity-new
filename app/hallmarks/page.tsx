import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { ArrowRight, Dna, FlaskConical } from 'lucide-react';

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
  'disabled-macroautophagy',
]);

const COVERAGE_COLOR = (pct: number) =>
  pct >= 80
    ? 'text-emerald-400'
    : pct >= 60
    ? 'text-amber-400'
    : 'text-rose-400';

const COVERAGE_BG = (pct: number) =>
  pct >= 80
    ? 'bg-emerald-500'
    : pct >= 60
    ? 'bg-amber-500'
    : 'bg-rose-500';

export default function HallmarksIndexPage() {
  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>

        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-emerald)_10%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Dna className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400 tracking-widest uppercase">Longevity Science</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              The 12 Hallmarks
              <br />
              <span className="text-emerald-400">of Aging</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              First systematized by López-Otín et al. (2013, updated 2023), the hallmarks are the molecular and cellular
              mechanisms that cause organisms to age. Understanding them is the prerequisite for any rational anti-aging protocol.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
                Build My Stack <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/library" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Interactive Library
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 border-y border-border/50 bg-card/20">
          <div className="container-page">
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
              <div>
                <p className="text-4xl font-black font-mono text-emerald-400 mb-1">12</p>
                <p className="text-sm font-medium text-foreground">Hallmarks mapped</p>
                <p className="text-xs text-muted-foreground mt-0.5">López-Otín 2023 framework</p>
              </div>
              <div>
                <p className="text-4xl font-black font-mono text-cyan-400 mb-1">150+</p>
                <p className="text-sm font-medium text-foreground">PMIDs indexed</p>
                <p className="text-xs text-muted-foreground mt-0.5">Human trial evidence only in Tier A/B</p>
              </div>
              <div>
                <p className="text-4xl font-black font-mono text-violet-400 mb-1">9</p>
                <p className="text-sm font-medium text-foreground">Tier A/B compounds</p>
                <p className="text-xs text-muted-foreground mt-0.5">With full dosing + synergy profiles</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hallmark grid */}
        <section className="py-20">
          <div className="container-page max-w-5xl">
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium mb-3">All 12 Hallmarks</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-10">
              The complete molecular map of aging.
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hallmarkLibrary.map((h) => {
                const hasEditorial = EDITORIAL_SLUGS.has(h.slug);
                const topIntervention = [...h.interventions].sort((a, b) => a.rank - b.rank)[0];
                return (
                  <div key={h.id} className="rounded-2xl border border-border/60 bg-card/40 p-5 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-xs font-mono text-muted-foreground/60">#{h.number}</span>
                        <h3 className="font-bold text-foreground mt-0.5">{h.title}</h3>
                      </div>
                      <span className={`shrink-0 text-xs font-bold font-mono ${COVERAGE_COLOR(h.coverage)}`}>
                        {h.coverage}%
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{h.tagline}</p>

                    {/* Coverage bar */}
                    <div className="mb-3">
                      <div className="h-1 rounded-full bg-border/40 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${COVERAGE_BG(h.coverage)} transition-all`}
                          style={{ width: `${h.coverage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground/60 mt-1">TNiC coverage</p>
                    </div>

                    {/* Biomarkers */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {h.biomarkers.slice(0, 2).map((b) => (
                        <span key={b} className="text-xs px-2 py-0.5 rounded-md bg-card border border-border/60 text-muted-foreground">
                          {b}
                        </span>
                      ))}
                      {h.biomarkers.length > 2 && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-card border border-border/60 text-muted-foreground/60">
                          +{h.biomarkers.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Top intervention */}
                    {topIntervention && (
                      <div className="mb-4 flex items-center gap-2 text-xs">
                        <span
                          className={`shrink-0 px-1.5 py-0.5 rounded font-bold ${
                            topIntervention.evidence === 'A'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : topIntervention.evidence === 'B'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          Tier {topIntervention.evidence}
                        </span>
                        <span className="truncate text-muted-foreground">{topIntervention.name}</span>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-2">
                      <Link
                        href={`/library/${h.slug}`}
                        className="flex-1 text-center text-xs py-2 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors font-medium"
                      >
                        Library →
                      </Link>
                      {hasEditorial && (
                        <Link
                          href={`/hallmarks/${h.slug}`}
                          className="flex-1 text-center text-xs py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 transition-colors font-medium"
                        >
                          Deep Dive →
                        </Link>
                      )}
                    </div>
                  </div>
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
              <a href="https://pubmed.ncbi.nlm.nih.gov/22768836/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                Cell 2013 (PMID: 22768836)
              </a>{' '}
              by López-Otín et al. and expanded to 12 hallmarks in the{' '}
              <a href="https://pubmed.ncbi.nlm.nih.gov/36599349/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
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
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">
              Target multiple hallmarks at once.
            </h2>
            <p className="text-muted-foreground mb-8">
              The Stack Architect shows hallmark coverage for every compound combination in real time —
              so you know exactly which aging mechanisms your protocol addresses.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
                Stack Architect <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/bio-age" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Calculate Bio Age
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
