import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, FlaskConical, Microscope, Shield, Zap, Leaf, Recycle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { SUPPLEMENT_GUIDES } from '@/lib/guides';
import { themes } from '@/lib/design-system';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { RevealItem } from '@/components/ui/RevealItem';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';

export const metadata: Metadata = buildPageMetadata({
  title: 'Longevity Supplement Guides 2026 — Evidence-Based Deep Dives | TNiC',
  description:
    'Comprehensive supplement guides covering NAD+, GlyNAC, berberine, taurine, sulforaphane, and more. Each guide covers the clinical evidence, optimal dosing, and how each compound targets specific hallmarks of aging.',
  path: '/supplement-guides',
  keywords: [
    'supplement guides',
    'longevity supplements guide',
    'evidence-based supplements',
    'supplement dosing guide',
    'anti-aging supplements',
    'healthspan supplements',
    'best supplements 2026',
    'NAD supplement guide',
    'GlyNAC guide',
    'berberine guide',
    'taurine supplement',
    'sulforaphane guide',
    'longevity stack',
    'PubMed supplement research',
  ],
});

// The guide list itself now lives in lib/guides.ts (single source of truth,
// shared with the in-context cross-links and the coverage guard). Only the
// per-guide icon stays here, since it's a React component, keyed by route.
const GUIDE_ICONS: Record<string, LucideIcon> = {
  '/longevity-supplements-guide': BookOpen,
  '/nad-supplement-guide': Zap,
  '/glynac-supplement-guide': Microscope,
  '/berberine-supplement-guide': Shield,
  '/taurine-supplement-guide': FlaskConical,
  '/sulforaphane-supplement-guide': Leaf,
  '/spermidine-supplement-guide': Recycle,
};

const comparisons = [
  { href: '/library/compare/nmn-vs-nr', label: 'NMN vs NR', desc: 'The definitive NAD+ precursor showdown' },
  { href: '/library/compare/berberine-vs-metformin', label: 'Berberine vs Metformin', desc: 'AMPK activation head-to-head' },
  { href: '/library/compare/rapamycin-vs-metformin', label: 'Rapamycin vs Metformin', desc: 'Two most-discussed longevity drugs' },
  { href: '/library/compare/coq10-vs-ubiquinol', label: 'CoQ10 vs Ubiquinol', desc: 'Oxidized vs reduced form absorption' },
  { href: '/library/compare/omega3-vs-krill-oil', label: 'Omega-3 vs Krill Oil', desc: 'EPA+DHA delivery systems compared' },
  { href: '/library/compare/fisetin-vs-quercetin', label: 'Fisetin vs Quercetin', desc: 'Senolytic flavonoids compared' },
  { href: '/library/compare/sulforaphane-vs-curcumin', label: 'Sulforaphane vs Curcumin', desc: 'NRF2 vs NF-κB pathways' },
  { href: '/library/compare/taurine-vs-nmn', label: 'Taurine vs NMN', desc: "Two of 2023's most-studied compounds" },
];

const compoundDeepDives = [
  { href: '/library/compounds/nmn', label: 'NMN' },
  { href: '/library/compounds/nr', label: 'NR (Nicotinamide Riboside)' },
  { href: '/library/compounds/glynac', label: 'GlyNAC' },
  { href: '/library/compounds/sulforaphane', label: 'Sulforaphane' },
  { href: '/library/compounds/taurine', label: 'Taurine' },
  { href: '/library/compounds/berberine', label: 'Berberine' },
  { href: '/library/compounds/spermidine', label: 'Spermidine' },
  { href: '/library/compounds/cakg', label: 'Ca-AKG (Alpha-Ketoglutarate)' },
  { href: '/library/compounds/urolithin-a', label: 'Urolithin A' },
  { href: '/library/compounds/rapamycin', label: 'Rapamycin' },
  { href: '/library/compounds/pterostilbene', label: 'Pterostilbene' },
];

const collectionSchema = buildCollectionPageSchema({
  name: 'Longevity Supplement Guides — TNiC',
  description: 'Evidence-based supplement guides covering NAD+, GlyNAC, berberine, taurine, sulforaphane, spermidine, and top longevity compounds. Each guide is built on PubMed citations and includes honest dosing protocols.',
  path: '/supplement-guides',
  itemCount: SUPPLEMENT_GUIDES.length,
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Supplement Guides', path: '/supplement-guides' },
]);

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'TNiC Longevity Supplement Guides',
  description: 'Comprehensive evidence-based guides for each major longevity supplement compound.',
  url: `${SITE.url}/supplement-guides`,
  numberOfItems: SUPPLEMENT_GUIDES.length,
  itemListElement: SUPPLEMENT_GUIDES.map((g, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: g.label,
    url: `${SITE.url}${g.href}`,
    description: g.short,
  })),
};

export default function SupplementGuidesPage() {
  return (
    <SubPageLayout hideStackReadout>
      <StructuredData schemas={[collectionSchema, breadcrumbSchema, itemListSchema]} />

      <div className="bg-bg-base">
        {/* Hero */}
        <section className="py-20 md:py-28 border-b border-border section-mesh">
          <div className="container-page text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              Evidence-Based · PubMed-Cited · Updated 2026
            </div>
            <h1 className="heading-page mb-5 max-w-4xl mx-auto">
              Longevity Supplement Guides
            </h1>
            <p className="text-body max-w-2xl mx-auto mb-8 text-muted-foreground">
              Deep-dive guides for the compounds with the strongest evidence in aging science.
              Every claim is cited. Every protocol is honest about limitations. Affiliate links never drive the rankings.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/longevity-supplements-guide"
                className="focus-ring interactive inline-flex items-center gap-2 tnic-button-accent px-5 py-3 rounded-xl text-sm"
              >
                Start with the Master Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/library/compounds/nmn"
                className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
              >
                Compound Library
              </Link>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="border-b border-border py-8">
          <div className="container-page">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                // Derived from the live arrays so these can never drift below
                // what the page actually lists (the coherence principle the
                // footer/hero stats already follow).
                { stat: String(SUPPLEMENT_GUIDES.length), label: 'In-depth guides' },
                { stat: String(compoundDeepDives.length), label: 'Compound profiles' },
                { stat: String(comparisons.length), label: 'Head-to-head comparisons' },
                { stat: '50+', label: 'PubMed citations' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-3xl font-bold text-accent-cyan mb-1">{item.stat}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guide cards */}
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container-page">
            <div className="mb-10">
              <p className="text-label mb-2">Deep-dive guides</p>
              <h2 className="heading-section mb-3">Supplement-by-Supplement Coverage</h2>
              <p className="text-body-sm text-muted-foreground max-w-2xl">
                Each guide covers the mechanism, key human trial data, dosing protocol, and honest cautions —
                structured around the 12 Hallmarks of Aging framework.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {SUPPLEMENT_GUIDES.map((guide, i) => {
                const Icon = GUIDE_ICONS[guide.href] ?? BookOpen;
                const accent = themes[guide.accent].cssVar;
                return (
                  <RevealItem key={guide.href} index={i} className="h-full">
                  <Link
                    href={guide.href}
                    style={{ ['--card-accent' as string]: accent }}
                    className="premium-card focus-ring group h-full p-6"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl border"
                        style={{
                          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                          borderColor: `color-mix(in srgb, ${accent} 28%, transparent)`,
                        }}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" style={{ color: accent }} />
                      </span>
                      <span
                        className="rounded-full border px-2 py-0.5 font-mono text-micro font-medium"
                        style={{
                          color: accent,
                          borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
                          background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                        }}
                      >
                        {guide.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-medium leading-tight tracking-tight text-foreground transition-colors group-hover:[color:var(--card-accent)]">
                      {guide.label}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{guide.short}</p>
                    <p className="mt-3 mb-4 flex-1 text-body-sm leading-relaxed text-muted-foreground">
                      {guide.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {guide.pills.map((pill) => (
                        <span
                          key={pill}
                          className="rounded-full border border-border/60 bg-white/[0.02] px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <EvidenceTag tier={guide.tier} size="sm" />
                      <span className="inline-flex items-center gap-1 text-sm font-semibold [color:var(--card-accent)]">
                        Read guide
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                  </RevealItem>
                );
              })}
            </div>
          </div>
        </section>

        {/* Head-to-head comparisons */}
        <section className="py-16 md:py-20 border-b border-border section-mesh">
          <div className="container-page">
            <div className="mb-8">
              <p className="text-label mb-2">Head-to-head</p>
              <h2 className="heading-section mb-3">Supplement Comparisons</h2>
              <p className="text-body-sm text-muted-foreground max-w-xl">
                Can’t decide between two options? Our structured comparison pages score each compound
                on 6–10 dimensions with evidence-tier ratings.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {comparisons.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group p-4 rounded-xl border border-border/60 bg-card hover:border-accent-violet/40 hover:bg-accent-violet/[0.04] transition-all duration-200"
                >
                  <p className="font-semibold text-sm text-foreground mb-1">{c.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{c.desc}</p>
                  <ArrowRight className="w-3.5 h-3.5 mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>

            <Link
              href="/library/compare"
              className="inline-flex items-center gap-1.5 text-sm text-accent-violet hover:text-accent-violet/80 transition-colors font-mono"
            >
              View all comparisons
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Compound deep-dives */}
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container-page">
            <div className="mb-8">
              <p className="text-label mb-2">Compound library</p>
              <h2 className="heading-section mb-3">Individual Compound Profiles</h2>
              <p className="text-body-sm text-muted-foreground max-w-xl">
                Each compound page covers mechanism, evidence tier, hallmarks targeted, synergies, and protocol.
                Tightly structured for fast review.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {compoundDeepDives.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="px-3 py-1.5 rounded-lg border border-border/60 bg-card text-sm text-muted-foreground hover:text-foreground hover:border-accent-cyan/40 transition-all"
                >
                  {c.label}
                </Link>
              ))}
            </div>

            <Link
              href="/library"
              className="inline-flex items-center gap-1.5 text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors font-mono"
            >
              Explore the full compound library
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA / navigation */}
        <section className="py-16 md:py-20">
          <div className="container-page">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-border/60 bg-card">
                <p className="text-label mb-2">Not sure where to start?</p>
                <h3 className="font-bold text-foreground mb-3">Take the NICO Starter Questionnaire</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Answer 7 questions about your health goals, lifestyle, and budget. Get a
                  personalized supplement stack ranked by evidence and synergy.
                </p>
                <Link
                  href="/nico"
                  className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
                >
                  Start the NICO Starter Questionnaire
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl border border-border/60 bg-card">
                <p className="text-label mb-2">After you pick your compounds</p>
                <h3 className="font-bold text-foreground mb-3">Build your stack</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The Stack Architect checks compound synergies and flags timing conflicts.
                  Add compounds one by one and see your full protocol score.
                </p>
                <Link
                  href="/stacks"
                  className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
                >
                  Open Stack Architect
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl border border-border/60 bg-card">
                <p className="text-label mb-2">Understand the science</p>
                <h3 className="font-bold text-foreground mb-3">Hallmarks of Aging</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Every supplement recommendation on TNiC is mapped to specific hallmarks of aging.
                  The library explains each mechanism in plain language.
                </p>
                <Link
                  href="/learn"
                  className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
                >
                  Explore the library
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SubPageLayout>
  );
}
