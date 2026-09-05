import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, FlaskConical, Microscope, Shield, Zap, Leaf, Recycle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildCollectionPageSchema, buildBreadcrumbSchema, buildFaqPageSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { SUPPLEMENT_GUIDES } from '@/lib/guides';
import { themes } from '@/lib/design-system';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { RevealItem } from '@/components/ui/RevealItem';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';

export const metadata: Metadata = buildPageMetadata({
  title: 'Longevity Supplement Guides 2026 — Evidence-Based Deep Dives',
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

const GUIDE_SELECTION_FAQS = [
  {
    question: 'Where should I start if I am new to longevity supplements?',
    answer:
      'Begin with the Master Guide for orientation, then move to the guide that matches the specific compound or comparison you are evaluating. Evidence tiers describe the strength and type of available research; they are not personal medical recommendations.',
  },
  {
    question: 'Do these guides provide personal dosing instructions?',
    answer:
      'No. Study sections report the form and amount used in cited research for context. They do not select an amount, schedule, or duration for an individual.',
  },
  {
    question: 'How should I evaluate a product after reading a guide?',
    answer:
      'Treat the research question and the product-verification question separately. Compare the label’s form and amount with the evidence context, then use the product pages to review manufacturer information and quality checks.',
  },
  {
    question: 'When should I involve a clinician or pharmacist?',
    answer:
      'Discuss any supplement you are considering with a qualified health professional if you take medicines, are pregnant or breastfeeding, or are preparing for surgery. Bring the complete list of medicines and supplements you use.',
  },
] as const;

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

const guideSelectionFaqSchema = buildFaqPageSchema([...GUIDE_SELECTION_FAQS]);

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
      <StructuredData
        schemas={[
          collectionSchema,
          breadcrumbSchema,
          itemListSchema,
          ...(guideSelectionFaqSchema ? [guideSelectionFaqSchema] : []),
        ]}
      />

      <div className="bg-bg-base">
        {/* Cinematic hub hero — decorative band; the semantic <h1> is the
            PageHeader below. Stat rail derives from the live arrays (no
            hardcoded literals) so it can never drift below what's listed. */}
        <CinematicHubHero
          hue="cyan"
          kicker="Evidence-Based · PubMed-Cited · 2026"
          title={<>The evidence, <em>compound by compound</em>.</>}
          lead="Deep dives on the molecules with the strongest human data in aging science — mechanism, key trials, dosing, and honest cautions. Cited throughout; affiliate links never drive the rankings."
          stats={[
            { value: String(SUPPLEMENT_GUIDES.length), label: 'In-depth guides' },
            { value: String(compoundDeepDives.length), label: 'Compound profiles', href: '/library/compounds' },
            { value: String(comparisons.length), label: 'Head-to-head comparisons', href: '/library/compare' },
          ]}
          primary={{ href: '/longevity-supplements-guide', label: 'Start with the Master Guide' }}
          secondary={{ href: '/library', label: 'Compound library' }}
        />

        {/* Semantic page title */}
        <section className="pt-12 md:pt-16 pb-2">
          <div className="container-page">
            <PageHeader
              icon={BookOpen}
              eyebrow="Supplement Guides"
              title="Longevity Supplement Guides"
              description="Mechanism, key human-trial data, dosing protocol, and honest cautions for each major longevity compound — structured around the 12 Hallmarks of Aging."
              theme="cyan"
            />
          </div>
        </section>

        {/* A decision framework turns a card index into a guided reading path.
            It intentionally separates research context, product-label comparison,
            and personalized safety review — the key distinctions that readers need
            before interpreting any individual guide. */}
        <section aria-labelledby="guide-reading-path" className="relative overflow-hidden border-b border-border bg-[radial-gradient(100%_90%_at_12%_0%,color-mix(in_srgb,var(--accent-cyan)_7%,transparent),transparent_54%)] py-16 md:py-20">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
              <div className="max-w-xl">
                <p className="text-label mb-3 text-accent-cyan">A better way to use this library</p>
                <h2 id="guide-reading-path" className="heading-section mb-4">Move from a question to a well-framed decision.</h2>
                <p className="text-body text-muted-foreground">
                  You do not need to read the library in order. Start with the question you are trying to answer, then move from the evidence to the product context and finally to the safety questions that only your full health picture can answer.
                </p>
                <p className="mt-4 text-body-sm text-muted-foreground">
                  The purpose is not to assemble the longest stack. It is to understand what a compound is being studied for, how strong that evidence is, and what information is still missing before you act.
                </p>
                <Link href="/trust/methodology" className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan">
                  See how TNiC grades evidence
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <ol className="grid gap-3 sm:grid-cols-2" aria-label="How to use the supplement guide library">
                {[
                  {
                    step: '01',
                    title: 'Start with the decision',
                    body: 'Use the Master Guide for broad orientation, a compound guide for depth, or a comparison when two options are competing for the same role.',
                    href: '/longevity-supplements-guide',
                    link: 'Open the Master Guide',
                    accent: 'var(--accent-cyan)',
                  },
                  {
                    step: '02',
                    title: 'Read the evidence before the product',
                    body: 'Check the evidence tier, study context, and stated limitations first. Product pages are a separate verification step, not proof that an outcome is guaranteed.',
                    href: '/trust/methodology',
                    link: 'Review the methodology',
                    accent: 'var(--accent-violet)',
                  },
                  {
                    step: '03',
                    title: 'Compare the form and label',
                    body: 'Use each guide’s study context to understand the form and amount being discussed, then compare it with the Supplement Facts label rather than relying on marketing language alone.',
                    href: '/shop',
                    link: 'Use the product checklist',
                    accent: 'var(--accent-emerald)',
                  },
                  {
                    step: '04',
                    title: 'Keep the full routine visible',
                    body: 'Use the Stack Architect to organize your research. A complete list of medicines and supplements is the useful starting point for a clinician or pharmacist review.',
                    href: '/stacks',
                    link: 'Open Stack Architect',
                    accent: 'var(--accent-amber)',
                  },
                ].map((item) => (
                  <li key={item.step}>
                    <Link
                      href={item.href}
                      style={{ ['--card-accent' as string]: item.accent }}
                      className="premium-card focus-ring group h-full min-h-48 p-5"
                    >
                      <span className="mb-7 font-mono text-xs font-semibold tracking-[0.18em] [color:var(--card-accent)]">{item.step}</span>
                      <h3 className="font-display text-xl font-medium tracking-tight text-foreground">{item.title}</h3>
                      <p className="mt-2 flex-1 text-body-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold [color:var(--card-accent)]">
                        {item.link}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
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

        {/* Product interpretation and safety checkpoint. The source-backed
            distinctions below are intentionally visible before product-oriented
            next steps, but they do not make individualized treatment claims. */}
        <section aria-labelledby="guide-safety-checkpoint" className="border-b border-border bg-[radial-gradient(80%_100%_at_92%_100%,color-mix(in_srgb,var(--accent-amber)_8%,transparent),transparent_58%)] py-16 md:py-20">
          <div className="container-page">
            <div className="premium-card overflow-visible p-6 md:p-8" style={{ ['--card-accent' as string]: 'var(--accent-amber)' }}>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div>
                  <p className="text-label mb-3 text-accent-amber">Safety and quality checkpoint</p>
                  <h2 id="guide-safety-checkpoint" className="font-display text-3xl font-medium tracking-tight text-foreground md:text-4xl">Evidence, identity, and personal safety are three different checks.</h2>
                  <p className="mt-4 text-body-sm leading-relaxed text-muted-foreground">
                    A guide can help you understand the research. The label helps you identify the ingredient form and amount per serving. Neither replaces a conversation about your medicines, health history, or upcoming care.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/60 bg-white/[0.025] p-4">
                    <p className="text-label mb-2 text-accent-cyan">Research context</p>
                    <p className="text-body-sm text-muted-foreground">Read the evidence tier, study design, and limitations before deciding what a result means.</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-white/[0.025] p-4">
                    <p className="text-label mb-2 text-accent-emerald">Label and quality</p>
                    <p className="text-body-sm text-muted-foreground">Supplement Facts identifies active ingredients and amounts. Quality testing can support identity and label accuracy; it does not establish effectiveness. <a className="link-underline text-accent-emerald" href="https://ods.od.nih.gov/factsheets/WYNTK-Consumer/" target="_blank" rel="noopener noreferrer">[1]</a></p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-white/[0.025] p-4">
                    <p className="text-label mb-2 text-accent-amber">Personal safety</p>
                    <p className="text-body-sm text-muted-foreground">Before starting or changing a supplement, involve a qualified professional if you take medicines, are pregnant or breastfeeding, or are preparing for surgery. <a className="link-underline text-accent-amber" href="https://www.fda.gov/consumers/consumer-updates/mixing-medications-and-dietary-supplements-can-endanger-your-health" target="_blank" rel="noopener noreferrer">[2]</a></p>
                  </div>
                </div>
              </div>
              <div className="mt-7 flex flex-col gap-3 border-t border-border/60 pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>For label research, the NIH Dietary Supplement Label Database catalogs U.S. product-label information. <a className="link-underline text-accent-cyan" href="https://dsld.od.nih.gov" target="_blank" rel="noopener noreferrer">[3]</a></p>
                <Link href="/trust" className="link-underline shrink-0 font-semibold text-accent-cyan">Visit the Trust Center</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Short, directly answered questions make the index more useful without
            duplicating the 40-question FAQ hub or generating new therapeutic claims. */}
        <section aria-labelledby="guide-faq-heading" className="border-b border-border py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="text-label mb-3 text-accent-violet">Guide selection FAQ</p>
              <h2 id="guide-faq-heading" className="heading-section mb-4">Four decisions to make before you go deeper.</h2>
              <p className="text-body-sm text-muted-foreground">These answers explain how to use the content on this page; they are not a substitute for individualized medical advice.</p>
            </div>
            <dl className="mt-8 grid gap-4 md:grid-cols-2">
              {GUIDE_SELECTION_FAQS.map((faq) => (
                <div key={faq.question} className="premium-card p-5" style={{ ['--card-accent' as string]: 'var(--accent-violet)' }}>
                  <dt className="font-display text-lg font-medium tracking-tight text-foreground">{faq.question}</dt>
                  <dd className="mt-3 text-body-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-caption leading-relaxed text-muted-foreground">
              <strong className="text-foreground">References.</strong> <a className="link-underline text-accent-cyan" href="https://ods.od.nih.gov/factsheets/WYNTK-Consumer/" target="_blank" rel="noopener noreferrer">[1] NIH Office of Dietary Supplements, Dietary Supplements: What You Need to Know.</a>{' '}<a className="link-underline text-accent-cyan" href="https://www.fda.gov/consumers/consumer-updates/mixing-medications-and-dietary-supplements-can-endanger-your-health" target="_blank" rel="noopener noreferrer">[2] U.S. FDA, Mixing Medications and Dietary Supplements Can Endanger Your Health.</a>{' '}<a className="link-underline text-accent-cyan" href="https://ods.od.nih.gov/Research/Dietary_Supplement_Label_Database.aspx" target="_blank" rel="noopener noreferrer">[3] NIH Office of Dietary Supplements, Dietary Supplement Label Database.</a>
            </p>
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
