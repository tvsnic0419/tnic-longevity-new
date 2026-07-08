import Link from 'next/link';
import { ArrowRight, FlaskConical, ExternalLink, CheckCircle2, AlertTriangle, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Taurine Supplement Guide 2026 — Longevity, Dosage & the Science 2023 Paper',
  description:
    'Complete taurine guide: the Singh 2023 Science paper explaining 80% age-related decline, 10-12% lifespan extension in mice, human taurine dosing protocol, and how it fits your longevity stack.',
  path: '/taurine-supplement-guide',
  keywords: [
    'taurine supplement guide',
    'taurine longevity',
    'taurine aging Science paper 2023',
    'taurine deficiency aging',
    'taurine dosage',
    'taurine lifespan extension',
    'taurine for mitochondria',
    'best taurine supplement 2026',
    'taurine vs NMN',
    'taurine benefits',
  ],
});

const FAQ = [
  {
    q: 'What is taurine and why does it matter for aging?',
    a: 'Taurine is a conditionally essential sulfur amino acid found in the brain, heart, retina, and skeletal muscle. Unlike most amino acids, it is not incorporated into proteins — it functions as an osmolyte, mitochondrial regulator, antioxidant, and bile acid conjugator. The 2023 Singh et al. Science paper showed that taurine levels decline 80% by age 60, and that restoring taurine with supplementation extended median lifespan 10–12% in middle-aged mice and improved health markers in monkeys. It is now considered a primary longevity nutrient.',
  },
  {
    q: 'What did the Singh 2023 Science paper show?',
    a: 'Singh et al. (2023, PMID 37289936) demonstrated three key findings: (1) Taurine declines 80% by age 60 in humans, mice, and monkeys — this is not a diet issue but a metabolic production decline. (2) Taurine supplementation extended median lifespan 10–12% in middle-aged mice and improved muscle function, bone density, immune health, and cognitive performance. (3) In monkeys, taurine restored markers of epigenetic age, telomere length, insulin sensitivity, and reduced inflammation. This is landmark evidence for a simple, safe, low-cost supplement.',
  },
  {
    q: 'What is the correct taurine dosage for longevity?',
    a: 'The Singh 2023 mouse equivalent dose translates to approximately 3–6 g/day in humans based on body weight scaling. The most commonly cited longevity protocol is 3 g/day (1 g with each of 3 meals, or 1.5 g twice daily). Some practitioners use 1–2 g/day for general metabolic support. Taurine has a very wide safety window — clinical trials have used up to 6 g/day with no significant adverse effects. The theoretical upper safety limit is much higher.',
  },
  {
    q: 'Does taurine work differently from NMN?',
    a: 'Yes — taurine and NMN target different but complementary pathways. NMN restores intracellular NAD+ (via SIRT1 activation, DNA repair, and mitochondrial biogenesis). Taurine addresses a separate set of age-related declines: mitochondrial membrane stabilization, osmotic regulation, antioxidant defense, and bile acid metabolism. The 2023 Singh paper explicitly positions taurine as a "longevity nutrient" independent of NAD+ biology. This is why TNiC stacks taurine + NMN — they address different nodes.',
  },
  {
    q: 'What are taurine\'s main mechanisms in aging?',
    a: 'Taurine operates through multiple pathways: (1) Mitochondrial: stabilizes the inner membrane and mitochondrial taurine-modified uridine (5-taurinomethyluridine) residues needed for proper mitochondrial protein translation. (2) Osmotic: acts as the main osmolyte in many cell types — aging depletes it, causing osmotic stress. (3) Antioxidant: conjugates with hypochlorous acid to form non-toxic taurine chloramine; modulates intracellular calcium. (4) Gut: conjugates bile acids — taurine-conjugated bile acids have better digestive profiles than glycine-conjugated ones. (5) Immune: modulates macrophage and neutrophil function.',
  },
  {
    q: 'Can I take taurine with caffeine?',
    a: "Yes — in fact, most energy drinks pair taurine with caffeine. There is no known negative interaction. Taurine may partially counteract some of caffeine's adverse cardiovascular effects. However, energy drink taurine doses (typically 50–250 mg per drink) are well below the longevity protocol dose of 1–3 g. Use a standalone taurine supplement at proper longevity doses rather than relying on energy drinks.",
  },
  {
    q: 'Is taurine safe long-term?',
    a: 'Yes — taurine is one of the best-characterized amino acids for safety. Clinical trials have administered 3–6 g/day for months without adverse events. Taurine is naturally present in meat, seafood, and breast milk. The FDA classifies it as generally recognized as safe (GRAS). No toxic dose has been established in humans at normal supplemental ranges. Preliminary reports about taurine and cancer from animal studies used non-physiological doses — the Singh 2023 paper did not find cancer risk at longevity-relevant doses.',
  },
];

function buildTaurineSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Taurine Longevity Supplement Protocol',
    description:
      'Evidence-based protocol for taurine supplementation based on the Singh 2023 Science paper, for adults seeking to restore age-related taurine decline and support longevity.',
    path: '/taurine-supplement-guide',
    totalTime: 'PT5M',
    steps: [
      {
        name: 'Choose your taurine form',
        text: 'Use pure L-taurine powder or capsules — not energy drinks. Standard free-form L-taurine is the form studied in longevity research. Pharmaceutical or food-grade L-taurine is identical in structure; no need for special chelated or sustained-release forms.',
      },
      {
        name: 'Start at 1 g/day (week 1)',
        text: 'Begin with 1 g/day to assess tolerance, though taurine is well-tolerated by nearly everyone. Take with food or water at any time. Taurine has no stimulant effect — it can be taken at any hour without affecting sleep.',
      },
      {
        name: 'Increase to the longevity protocol dose (2–3 g/day)',
        text: 'The Singh 2023 mouse-to-human dose translation supports 3 g/day for longevity protocols. Take in 2–3 divided doses (1 g with meals). This is the dose most longevity practitioners use. Some use up to 6 g/day without adverse effects.',
      },
      {
        name: 'Stack with complementary longevity compounds',
        text: 'Taurine pairs exceptionally well with NMN (complementary pathways: taurine restores mitochondrial membrane function; NMN restores NAD+ for biogenesis), GlyNAC (three-way glutathione/taurine/NAD+ restoration), and apigenin (CD38 inhibitor protecting NAD+). Together these address the major non-senolytic longevity nodes.',
      },
      {
        name: 'No re-testing required — but track energy and recovery markers',
        text: "Taurine doesn't have a single biomarker to track (unlike HbA1c for berberine or glutathione for GlyNAC). Instead track subjective markers: muscle recovery after exercise, cognitive clarity, sleep quality, and exercise tolerance. These are the endpoints where taurine shows the clearest subjective effects in human studies.",
      },
    ],
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Taurine Supplement Guide 2026 — Longevity, Dosage & the Science 2023 Paper',
    description:
      'Complete guide to taurine supplementation for longevity, covering the Singh 2023 Science paper, 80% age-related decline, 10-12% lifespan extension, and the human dosing protocol.',
    url: `${SITE.url}/taurine-supplement-guide`,
    dateModified: '2026-06-28',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      { '@type': 'MedicalSubstance', name: 'Taurine', description: 'Sulfur amino acid; declines 80% by age 60; longevity nutrient per Singh 2023 Science' },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Taurine deficiency as a driver of aging',
        author: 'Singh P, Gollapalli K, Mangiola S et al.',
        datePublished: '2023',
        isPartOf: { '@type': 'Periodical', name: 'Science' },
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '37289936' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/37289936/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Taurine Supplement Guide', path: '/taurine-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function TaurineGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildTaurineSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-emerald" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-emerald uppercase tracking-wider">Evidence Tier A · Taurine · Singh 2023 Science</span>
          </div>

          <h1 className="heading-hero mb-4">
            Taurine Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            A 2023 paper in <em>Science</em> showed taurine declines 80% by age 60 — and that restoring it extended median lifespan 10–12% in mice. Here is everything you need to know about taurine for human longevity.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '80%', label: 'Decline by age 60', color: 'text-accent-rose' },
              { value: '10–12%', label: 'Lifespan extension (mice)', color: 'text-accent-emerald' },
              { value: '3 g/day', label: 'Evidence-based dose', color: 'text-accent-cyan' },
              { value: 'Science', label: '2023 journal', color: 'text-accent-violet' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/taurine"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-emerald text-bg-base font-semibold text-sm hover:bg-accent-emerald/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/taurine-vs-nmn"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
            >
              Taurine vs NMN comparison
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Science paper */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">The Landmark Study — Singh 2023 in Science</h2>
          <p className="text-body-sm text-muted-foreground mb-8">
            PMID:{' '}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/37289936/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-emerald hover:underline inline-flex items-center gap-1"
            >
              37289936 <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>{' '}
            · Science · 2023 · Singh P, Gollapalli K, Mangiola S et al.
          </p>

          <div className="rounded-2xl border border-accent-emerald/20 bg-accent-emerald/[0.04] p-6 mb-8">
            <p className="font-mono text-sm text-accent-emerald mb-2">HEADLINE FINDING</p>
            <p className="text-lg font-semibold">
              Taurine supplementation in middle-aged mice extended median lifespan by{' '}
              <span className="text-accent-emerald">10–12%</span>, compressed morbidity, and improved muscle strength, bone density, cognitive function, gut health, and immune response simultaneously — with zero observed toxicity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                title: 'Discovery 1: Taurine declines with age',
                body: 'The study measured taurine in blood samples from humans (ages 5–85), mice, and monkeys. By age 60, taurine levels had fallen ~80% from young adult baseline. This is not a diet issue — it reflects a fundamental age-related decline in taurine synthesis and recycling efficiency.',
                color: 'text-accent-rose',
                badge: 'bg-accent-rose/10 border-accent-rose/20',
              },
              {
                title: 'Discovery 2: Lifespan extension in mice',
                body: 'Middle-aged mice (1.5 years, equivalent to ~45 human years) given taurine in drinking water showed 10% longer median lifespan in males and 12% in females. Healthspan improvements were across-the-board — not just survival.',
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
              },
              {
                title: 'Discovery 3: Monkey data confirms human relevance',
                body: "In rhesus monkeys (most relevant model for humans), taurine restored epigenetic age markers, reduced inflammation, improved bone density, reduced liver fat, and improved insulin sensitivity. Monkeys' physiological similarity to humans makes this particularly meaningful.",
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
              },
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border p-5 ${card.badge} bg-card/50`}>
                <h3 className={`font-semibold mb-2 text-sm ${card.color}`}>{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Taurine Fights Aging — 5 Pathways</h2>
          <div className="space-y-4">
            {[
              {
                icon: Zap,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Mitochondrial function',
                body: 'Taurine is incorporated into mitochondrial tRNA as a modified uridine (5-taurinomethyluridine). Without sufficient taurine, mitochondrial protein translation becomes impaired — specifically the proteins of the electron transport chain. Taurine deficiency = mitochondrial dysfunction, even if NAD+ is adequate. This pathway is distinct from and complementary to NMN/NAD+ biology.',
              },
              {
                icon: ShieldCheck,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Antioxidant and anti-inflammatory',
                body: 'Taurine is one of the most abundant intracellular organic acids. It reacts with hypochlorous acid (HOCl, produced by immune cells during inflammation) to form taurine chloramine — a far less reactive species. This reduces neutrophil-driven tissue damage. Taurine also modulates NF-κB, a master switch for inflammaging.',
              },
              {
                icon: TrendingUp,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Osmotic regulation',
                body: 'Taurine is the primary organic osmolyte in many tissues — it regulates cell volume under osmotic stress. Age-related taurine decline impairs this function, causing cells to handle volume stress less effectively. This contributes to the performance decline in muscle, kidney, and brain tissue observed in aging.',
              },
              {
                icon: ArrowRight,
                color: 'text-accent-rose',
                badge: 'bg-accent-rose/10 border-accent-rose/20',
                title: 'Gut and bile acid health',
                body: 'Taurine conjugates bile acids in the liver (forming taurocholate, taurochenodeoxycholate). Taurine-conjugated bile acids are more water-soluble and have better antimicrobial properties in the gut than glycine-conjugated forms. Age-related taurine decline shifts the bile acid pool toward glycine conjugates, potentially worsening gut dysbiosis.',
              },
              {
                icon: FlaskConical,
                color: 'text-amber-400',
                badge: 'bg-amber-400/10 border-amber-400/20',
                title: 'DNA and epigenetic protection',
                body: 'Taurine supplementation in the Singh 2023 monkey study restored epigenetic age markers — lower methylation at aging-associated CpG sites. The mechanism is not fully characterized, but likely involves reduced oxidative damage to DNA (via antioxidant function) and indirect epigenetic effects from improved mitochondrial function and reduced inflammation.',
              },
            ].map((item) => (
              <div key={item.title} className={`flex gap-4 rounded-xl border p-5 ${item.badge} bg-card/50`}>
                <div className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border ${item.badge}`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dosing */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Dosing Protocol</h2>
          <p className="text-body mb-8 max-w-2xl">
            Taurine is one of the safest supplements available. The dosing question is mainly about reaching effective levels — not about safety ceiling.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">USE CASE</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">DOSE</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">TIMING</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">SOURCE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { use: 'General metabolic support', dose: '1–2 g/day', timing: 'Any time, with food or water', source: 'Clinical safety studies' },
                  { use: 'Longevity protocol (TNiC)', dose: '2–3 g/day', timing: 'Split across 2–3 meals', source: 'Singh 2023 mouse scaling' },
                  { use: 'Clinical trials (heart failure)', dose: '3 g/day × 6 months', timing: '1 g × 3 with meals', source: 'Multiple HF RCTs' },
                  { use: 'Upper studied dose (safe)', dose: '6 g/day', timing: '2 g × 3 with meals', source: 'Clinical trial safety data' },
                ].map((row) => (
                  <tr key={row.use} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium">{row.use}</td>
                    <td className="p-4 font-mono text-accent-emerald">{row.dose}</td>
                    <td className="p-4 text-muted-foreground text-xs">{row.timing}</td>
                    <td className="p-4 text-muted-foreground text-xs">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-accent-emerald/20 bg-accent-emerald/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
                <p className="font-semibold text-accent-emerald text-sm">Best practices</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· L-taurine powder is the cheapest form — mix in water or juice</li>
                <li>· No need for food timing — taurine is well-absorbed with or without meals</li>
                <li>· Can be taken at any time of day including evening (not a stimulant)</li>
                <li>· Pairs well with NMN, GlyNAC, and apigenin in a foundation stack</li>
                <li>· No known upper toxic dose at supplemental ranges; widely safe</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <p className="font-semibold text-amber-400 text-sm">Context</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· No prescription interactions known; safe with most medications</li>
                <li>· The mouse lifespan data cannot be directly extrapolated to humans — human longevity RCT data is pending</li>
                <li>· A 2023 preliminary report (Bhaskaran et al.) suggested taurine may promote cancer progression in some models — Singh et al. and others did not replicate this at longevity doses</li>
                <li>· If you have a known cancer diagnosis, discuss with your oncologist before starting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HowTo */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-8">5-Step Start Protocol</h2>
          <div className="space-y-4">
            {[
              {
                n: '01',
                title: 'Choose pure L-taurine (powder or capsule)',
                body: "Use pure L-taurine — not from energy drinks (underdosed) and not proprietary blends. Powder is the most cost-effective: 1 kg of pharmaceutical-grade L-taurine costs ~$15–25 and provides a year's supply at 3 g/day.",
              },
              {
                n: '02',
                title: 'Start at 1 g/day — titrate to 2–3 g/day over 2 weeks',
                body: 'Taurine is so well-tolerated that most people can start at the full dose immediately. However, starting at 1 g for the first week is standard practice and lets you confirm no individual sensitivities.',
              },
              {
                n: '03',
                title: 'Take in 2–3 split doses with meals',
                body: "Divide your daily dose across 2–3 meals: 1 g at breakfast + 1 g at dinner is a simple protocol. This maintains steady taurine availability throughout the day. There's no critical timing window — take when it's convenient.",
              },
              {
                n: '04',
                title: 'Stack with your NAD+ protocol',
                body: 'Taurine is most powerful when combined with NMN or NR (NAD+ precursors), GlyNAC (glutathione restoration), and apigenin (CD38 inhibition). Together these compounds address taurine depletion, NAD+ decline, glutathione decline, and NAD+ consumption — the four major age-related metabolic deficits.',
              },
              {
                n: '05',
                title: 'Track subjective health metrics at 30 and 90 days',
                body: "Unlike berberine (check HbA1c) or GlyNAC (check glutathione), taurine doesn't have a simple single biomarker to track. Instead, monitor exercise recovery speed, subjective energy levels, muscle soreness duration, and sleep quality. The Singh 2023 monkeys showed measurable physical improvements within 6 months.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center">
                  <span className="text-xs font-mono text-accent-emerald">{step.n}</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-8">Taurine FAQ</h2>
          <div className="space-y-4">
            {FAQ.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-border/60 bg-card/50">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-sm list-none">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0 ml-4" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-page max-w-4xl">
          <div className="rounded-2xl border border-accent-emerald/20 bg-accent-emerald/[0.04] p-8 md:p-10 text-center">
            <h2 className="heading-section mb-3">Add Taurine to Your Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Taurine is included in TNiC&rsquo;s Foundation, Mito-NAD+, and Full-Spectrum presets. Take the quiz to get your personalized protocol.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/quiz"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-emerald text-bg-base font-semibold text-sm hover:bg-accent-emerald/90 transition"
              >
                Take the 3-min quiz
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/taurine"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
              >
                Taurine compound page
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compare/taurine-vs-nmn"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
              >
                Taurine vs NMN
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/nad-supplement-guide"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                NAD+ supplement guide
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Educational content only — not medical advice. Taurine is a dietary supplement, not FDA-approved to treat or prevent any disease. Discuss with your physician if you have a known medical condition, especially active cancer.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
