import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, FlaskConical, Microscope, Shield, Zap, Leaf, Recycle, Battery, Sparkles, Flame, Heart, Atom, Dna, Grape, TrendingUp } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

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

const guides = [
  {
    href: '/longevity-supplements-guide',
    icon: BookOpen,
    iconBadge: 'icon-badge-cyan',
    iconText: 'text-accent-cyan',
    badge: 'Master Guide',
    badgeColor: 'bg-accent-cyan/15 text-accent-cyan',
    title: 'Best Longevity Supplements 2026',
    subtitle: 'The complete ranked guide to evidence-backed longevity compounds',
    description:
      'Start here. Our master guide ranks 12+ compounds by evidence quality, covers the Hallmarks of Aging framework, explains synergy principles, and includes honest cautions. Built on 50+ PubMed citations.',
    pills: ['12+ compounds', 'Tier A–D ranking', '50+ citations'],
    evidenceTier: 'A',
    glowHover: 'glow-hover-cyan',
    borderHover: 'hover:border-accent-cyan/40',
  },
  {
    href: '/nad-supplement-guide',
    icon: Zap,
    iconBadge: 'icon-badge-violet',
    iconText: 'text-accent-violet',
    badge: 'High Interest',
    badgeColor: 'bg-accent-violet/15 text-accent-violet',
    title: 'NAD+ Supplement Guide 2026',
    subtitle: 'NMN vs NR, precursor hierarchy, and the NAD+ decline curve',
    description:
      'NAD+ declines 50% by age 60. This guide compares NMN, NR, and niacin riboside as precursors — covering bioavailability data, optimal dosing windows, and why the form you choose matters for tissue distribution.',
    pills: ['NMN vs NR vs Niacin', '50% decline by 60', 'Dosing by age'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-violet',
    borderHover: 'hover:border-accent-violet/40',
  },
  {
    href: '/glynac-supplement-guide',
    icon: Microscope,
    iconBadge: 'icon-badge-emerald',
    iconText: 'text-accent-emerald',
    badge: 'Landmark RCT',
    badgeColor: 'bg-accent-emerald/15 text-accent-emerald',
    title: 'GlyNAC Supplement Guide',
    subtitle: '9 hallmarks of aging reversed in a 24-week human RCT',
    description:
      'Two independent human RCTs (Sekhar group, Baylor) found GlyNAC (glycine + NAC) restores glutathione deficiency, reduces oxidative stress, and improves mitochondrial dysfunction, inflammation, and physical function in older adults. This guide covers the evidence and the protocol.',
    pills: ['2 human RCTs', 'Glutathione restored', 'Multiple hallmarks'],
    evidenceTier: 'A',
    glowHover: 'glow-hover-emerald',
    borderHover: 'hover:border-accent-emerald/40',
  },
  {
    href: '/berberine-supplement-guide',
    icon: Shield,
    iconBadge: 'icon-badge-rose',
    iconText: 'text-accent-rose',
    badge: "Nature's Ozempic?",
    badgeColor: 'bg-accent-rose/15 text-accent-rose',
    title: "Berberine Guide — Nature's Ozempic Reality Check",
    subtitle: 'AMPK activation, metabolic evidence, and honest semaglutide comparison',
    description:
      "Berberine activates AMPK — the cell's master energy switch — with meta-analytic evidence for HbA1c reduction (−0.72%) and LDL lowering (−0.65 mmol/L). A rigorous 7-row honest comparison with semaglutide tells you what it can and cannot do.",
    pills: ['AMPK activation', 'HbA1c −0.72%', 'vs Semaglutide'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-rose',
    borderHover: 'hover:border-accent-rose/40',
  },
  {
    href: '/taurine-supplement-guide',
    icon: FlaskConical,
    iconBadge: 'icon-badge-amber',
    iconText: 'text-accent-amber',
    badge: 'Science 2023',
    badgeColor: 'bg-amber-500/15 text-amber-400',
    title: 'Taurine Longevity Guide — Singh 2023',
    subtitle: '80% decline by age 60 and 10–12% lifespan extension in mammals',
    description:
      'The landmark Singh et al. 2023 Science paper found taurine declines 80% by age 60 and that supplementation extended lifespan 10–12% in worms and mice, plus reversed epigenetic age in monkeys. Covers 5 longevity mechanisms and dosing protocol.',
    pills: ['Singh 2023 Science', '80% decline by 60', '+10–12% lifespan'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-amber',
    borderHover: 'hover:border-amber-500/40',
  },
  {
    href: '/sulforaphane-supplement-guide',
    icon: Leaf,
    iconBadge: 'icon-badge-cyan',
    iconText: 'text-accent-cyan',
    badge: 'NRF2 Activator',
    badgeColor: 'bg-accent-cyan/15 text-accent-cyan',
    title: 'Sulforaphane & NRF2 Guide',
    subtitle: 'Broccoli sprout extract, form selection, and Keap1-NRF2 mechanism',
    description:
      'Sulforaphane from broccoli sprouts alkylates Keap1 cysteine residues, releasing NRF2 to upregulate 200+ cytoprotective genes. Covers human trial data (H. pylori, NAFLD, ASD, air pollution), form hierarchy, and the NRF2 Triad stack.',
    pills: ['200+ NRF2 genes', '4 human trials', 'Form hierarchy'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-cyan',
    borderHover: 'hover:border-accent-cyan/40',
  },
  {
    href: '/spermidine-supplement-guide',
    icon: Recycle,
    iconBadge: 'icon-badge-emerald',
    iconText: 'text-accent-emerald',
    badge: 'ITP Mouse Data',
    badgeColor: 'bg-accent-emerald/15 text-accent-emerald',
    title: 'Spermidine Guide — Autophagy & ITP Data',
    subtitle: '~10% ITP lifespan extension and 40% cardiovascular mortality reduction',
    description:
      'Spermidine is one of the few OTC longevity compounds with NIA Interventions Testing Program lifespan data (~10% in female mice). The Kiechl 2018 20-year cohort found a 40% reduction in cardiovascular mortality in the highest dietary spermidine tertile. Covers EP300 inhibition mechanism, dosing, and the autophagy triad.',
    pills: ['ITP mouse data', 'Kiechl 2018 cohort', 'EP300 inhibition'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-emerald',
    borderHover: 'hover:border-accent-emerald/40',
  },
  {
    href: '/urolithin-a-supplement-guide',
    icon: Battery,
    iconBadge: 'icon-badge-violet',
    iconText: 'text-accent-violet',
    badge: 'Mitophagy',
    badgeColor: 'bg-accent-violet/15 text-accent-violet',
    title: 'Urolithin A Supplement Guide',
    subtitle: 'The first oral compound with human evidence for activating mitophagy',
    description:
      'Only 30–40% of adults have gut microbiota that convert dietary ellagitannins into urolithin A. Andreux et al. 2019 was the first human evidence that an oral compound stimulates a mitophagy-associated molecular signature; a 2022 randomized trial confirmed improved muscle strength and exercise performance.',
    pills: ['First human mitophagy trial', 'Muscle strength RCT', 'Tier A'],
    evidenceTier: 'A',
    glowHover: 'glow-hover-violet',
    borderHover: 'hover:border-accent-violet/40',
  },
  {
    href: '/fisetin-supplement-guide',
    icon: Sparkles,
    iconBadge: 'icon-badge-rose',
    iconText: 'text-accent-rose',
    badge: 'Senolytic',
    badgeColor: 'bg-accent-rose/15 text-accent-rose',
    title: 'Fisetin Supplement Guide',
    subtitle: 'The most potent senolytic flavonoid tested in mice — human data still emerging',
    description:
      'Fisetin was identified as the most potent senolytic among 10 flavonoids screened, extending lifespan in mice. This guide is honest about what is and isn\'t proven: Mayo Clinic\'s published human senolytic pilots used dasatinib+quercetin, not fisetin alone — dedicated human fisetin trials are registered but not yet reported.',
    pills: ['Most potent in mouse screen', 'Human trials pending', 'Tier B'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-rose',
    borderHover: 'hover:border-accent-rose/40',
  },
  {
    href: '/coq10-supplement-guide',
    icon: Flame,
    iconBadge: 'icon-badge-cyan',
    iconText: 'text-accent-cyan',
    badge: 'Statin Depletion',
    badgeColor: 'bg-accent-cyan/15 text-accent-cyan',
    title: 'CoQ10 (Ubiquinol) Supplement Guide',
    subtitle: 'Electron transport chain cofactor that statins deplete',
    description:
      'CoQ10 biosynthesis declines ~50% by age 60, and statins block the same mevalonate pathway that produces it. Covers the statin-depletion evidence, a meta-analysis showing reduced hs-CRP and IL-6, and ubiquinol vs ubiquinone form selection.',
    pills: ['Statin depletion evidence', 'hs-CRP / IL-6 meta-analysis', 'Tier B'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-cyan',
    borderHover: 'hover:border-accent-cyan/40',
  },
  {
    href: '/omega-3-supplement-guide',
    icon: Heart,
    iconBadge: 'icon-badge-emerald',
    iconText: 'text-accent-emerald',
    badge: 'REDUCE-IT',
    badgeColor: 'bg-accent-emerald/15 text-accent-emerald',
    title: 'Omega-3 (EPA + DHA) Supplement Guide',
    subtitle: 'The largest cardiovascular benefit shown for a supplement-derived agent',
    description:
      'The REDUCE-IT trial showed icosapent ethyl reduced major cardiovascular events by 25% relative risk versus placebo. Covers the resolvin/protectin resolution mechanism, a telomere-preservation RCT, and triglyceride vs ethyl-ester form selection.',
    pills: ['REDUCE-IT: −25% MACE', 'Telomere RCT', 'Tier A'],
    evidenceTier: 'A',
    glowHover: 'glow-hover-emerald',
    borderHover: 'hover:border-accent-emerald/40',
  },
  {
    href: '/r-ala-supplement-guide',
    icon: Atom,
    iconBadge: 'icon-badge-amber',
    iconText: 'text-accent-amber',
    badge: 'Redox Cycling',
    badgeColor: 'bg-amber-500/15 text-amber-400',
    title: 'R-ALA Supplement Guide',
    subtitle: 'Why the enantiomer matters — R-ALA vs racemic alpha-lipoic acid',
    description:
      'R-ALA is a TCA cycle cofactor and glutathione-cycle amplifier — but most cheap alpha-lipoic-acid supplements are racemic R/S mixtures where the S-form competes with R-ALA for uptake. Covers the mitochondrial redox mechanism and why form selection roughly doubles effective dose.',
    pills: ['TCA cycle cofactor', 'Enantiomer matters', 'Tier B'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-amber',
    borderHover: 'hover:border-amber-500/40',
  },
  {
    href: '/ca-akg-supplement-guide',
    icon: Dna,
    iconBadge: 'icon-badge-violet',
    iconText: 'text-accent-violet',
    badge: 'Epigenetic Substrate',
    badgeColor: 'bg-accent-violet/15 text-accent-violet',
    title: 'Ca-AKG Supplement Guide',
    subtitle: 'Mouse lifespan data is strong — human epigenetic-age results are not yet published',
    description:
      'Ca-AKG extended median lifespan 12–14% in mice as a TCA cycle fuel and TET/JMJD dioxygenase cofactor. The registered human ABLE trial testing epigenetic-age effects has not yet reported results — this guide is explicit about that distinction rather than citing an unverified figure.',
    pills: ['12–14% mouse lifespan', 'Human trial pending', 'Tier B'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-violet',
    borderHover: 'hover:border-accent-violet/40',
  },
  {
    href: '/resveratrol-supplement-guide',
    icon: Grape,
    iconBadge: 'icon-badge-rose',
    iconText: 'text-accent-rose',
    badge: 'Sirtuin Activation',
    badgeColor: 'bg-accent-rose/15 text-accent-rose',
    title: 'Resveratrol Supplement Guide',
    subtitle: 'The foundational SIRT1 mouse study — and what human evidence actually shows',
    description:
      'Baur et al. 2006 showed resveratrol improved health and survival in mice via SIRT1 activation — the study that launched the sirtuin field. Covers the NMN + resveratrol stack rationale, bioavailability limits, and honest framing of what remains unproven in humans.',
    pills: ['Baur 2006 landmark', 'NMN stack rationale', 'Tier B'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-rose',
    borderHover: 'hover:border-accent-rose/40',
  },
  {
    href: '/pterostilbene-supplement-guide',
    icon: TrendingUp,
    iconBadge: 'icon-badge-cyan',
    iconText: 'text-accent-cyan',
    badge: 'Bioavailability Upgrade',
    badgeColor: 'bg-accent-cyan/15 text-accent-cyan',
    title: 'Pterostilbene Supplement Guide',
    subtitle: 'Resveratrol\'s methoxylated cousin — human safety established, efficacy still preclinical',
    description:
      'Pterostilbene\'s methoxy groups cut first-pass glucuronidation, giving it a longer half-life and higher plasma levels than resveratrol at equivalent doses. A human dose-escalation trial established safety up to 250mg/day — this guide is clear that trial covered safety, not efficacy endpoints.',
    pills: ['Human safety trial', 'Higher bioavailability', 'Tier B'],
    evidenceTier: 'B',
    glowHover: 'glow-hover-cyan',
    borderHover: 'hover:border-accent-cyan/40',
  },
];

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
  { href: '/library/compounds/urolithina', label: 'Urolithin A' },
  { href: '/library/compounds/rapamycin', label: 'Rapamycin' },
  { href: '/library/compounds/pterostilbene', label: 'Pterostilbene' },
  { href: '/library/compounds/resveratrol', label: 'Resveratrol' },
  { href: '/library/compounds/fisetin', label: 'Fisetin' },
  { href: '/library/compounds/coq10', label: 'CoQ10' },
  { href: '/library/compounds/omega3', label: 'Omega-3' },
  { href: '/library/compounds/rala', label: 'R-ALA' },
];

const collectionSchema = buildCollectionPageSchema({
  name: 'Longevity Supplement Guides — TNiC',
  description: 'Evidence-based supplement guides covering NAD+, GlyNAC, berberine, taurine, sulforaphane, spermidine, and top longevity compounds. Each guide is built on PubMed citations and includes honest dosing protocols.',
  path: '/supplement-guides',
  itemCount: guides.length,
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
  numberOfItems: guides.length,
  itemListElement: guides.map((g, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: g.title,
    url: `${SITE.url}${g.href}`,
    description: g.subtitle,
  })),
};

export default function SupplementGuidesPage() {
  return (
    <>
      <StructuredData schemas={[collectionSchema, breadcrumbSchema, itemListSchema]} />

      <main className="min-h-screen bg-bg-base">
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
              Every claim is cited. Every protocol is honest about limitations. No affiliate rankings.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/longevity-supplements-guide"
                className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-cyan text-bg-base font-semibold text-sm hover:bg-accent-cyan/90 transition"
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
                { stat: '15', label: 'In-depth guides' },
                { stat: '14', label: 'Compound profiles' },
                { stat: '8+', label: 'Head-to-head comparisons' },
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
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className={`group rounded-2xl p-6 border border-border/60 card-premium bg-card transition-all duration-300 ${guide.glowHover} ${guide.borderHover} flex flex-col`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${guide.iconBadge}`}>
                        <Icon className={`w-5 h-5 ${guide.iconText}`} />
                      </div>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${guide.badgeColor}`}>
                        {guide.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-foreground mb-1 leading-tight">{guide.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono mb-3">{guide.subtitle}</p>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">{guide.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {guide.pills.map((pill) => (
                        <span
                          key={pill}
                          className="text-xs px-2 py-0.5 rounded-full bg-card/50 border border-border text-muted-foreground"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        Evidence Tier {guide.evidenceTier}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        Read guide
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </span>
                    </div>
                  </Link>
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
                <h3 className="font-bold text-foreground mb-3">Take the 3-min quiz</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Answer 7 questions about your health goals, lifestyle, and budget. Get a
                  personalized supplement stack ranked by evidence and synergy.
                </p>
                <Link
                  href="/quiz"
                  className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
                >
                  Start the quiz
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
      </main>
    </>
  );
}
