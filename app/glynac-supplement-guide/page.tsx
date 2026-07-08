import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, TrendingUp, Zap, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'GlyNAC Supplement Guide 2026 — Glycine + NAC for Aging, Dosing & Evidence',
  description:
    'Complete GlyNAC guide: why Glycine + N-Acetylcysteine reverses 9 hallmarks of aging in humans, the Sekhar 2021 RCT results, optimal dosing protocol, and where GlyNAC fits in a longevity stack.',
  path: '/glynac-supplement-guide',
  keywords: [
    'GlyNAC supplement guide',
    'glycine NAC supplement',
    'GlyNAC aging',
    'GlyNAC dosage',
    'glycine n-acetylcysteine longevity',
    'GlyNAC trial results',
    'best glutathione supplement',
    'GlyNAC vs glutathione',
    'NAC supplement benefits',
    'GlyNAC for mitochondria',
  ],
});

const HALLMARKS_REVERSED = [
  { name: 'Mitochondrial dysfunction', detail: 'Restored mitochondrial fuel oxidation (MFO) to young adult levels' },
  { name: 'Oxidative stress', detail: 'Glutathione levels normalized; RBC GSH up 94.6% vs placebo' },
  { name: 'Inflammation', detail: 'IL-6, TNF-α, hsCRP significantly reduced at 16 weeks' },
  { name: 'Genomic instability', detail: 'DNA damage markers (8-OHdG) reduced vs placebo' },
  { name: 'Nutrient sensing dysregulation', detail: 'mTOR pathway: 58% reduction in insulin resistance (HOMA-IR)' },
  { name: 'Stem cell exhaustion', detail: 'Grip strength +1.5 kg; physical function scores normalized' },
  { name: 'Epigenetic alterations', detail: 'Transcriptomic profile shifted toward younger adults' },
  { name: 'Loss of proteostasis', detail: 'Reduced unfolded protein response markers' },
  { name: 'Altered intercellular communication', detail: 'Endothelial function improved (FMD) in pilot arm' },
];

const FAQ = [
  {
    q: 'What is GlyNAC?',
    a: 'GlyNAC is a combination supplement pairing Glycine and N-Acetylcysteine (NAC). Both are precursors to glutathione — the body\'s master antioxidant. Aging depletes both amino acids, causing glutathione to drop 50–60% by age 70. Supplementing them together restores glutathione more effectively than either alone.',
  },
  {
    q: 'What does the human trial evidence show?',
    a: 'The key trial is Sekhar 2021 (PMID 34741609), a randomized controlled trial in older adults (71–80) vs young adults (21–30). After 24 weeks of GlyNAC: glutathione levels normalized, mitochondrial fuel oxidation restored, grip strength improved, cognitive scores improved, gait speed increased, and 9 hallmarks of aging were reversed. The 2022 extension (PMID 35970308) confirmed epigenetic aging reversal of ~3.7 years.',
  },
  {
    q: 'What is the correct GlyNAC dosage?',
    a: 'The Sekhar 2021 protocol used 0.1 g/kg/day of each component. For a 70 kg adult: ~7 g Glycine + 7 g NAC daily. This is a high dose. Many longevity practitioners start at 3–4 g of each and titrate up. Key point: Glycine and NAC must be taken together for optimal glutathione synthesis — NAC alone raises cysteine but without glycine, glutathione synthesis remains rate-limited.',
  },
  {
    q: 'Can I get GlyNAC effects from glutathione directly?',
    a: 'Oral glutathione supplements have poor bioavailability — most is broken down in the gut before reaching tissues. GlyNAC supplements the two rate-limiting precursors, allowing cells to synthesize glutathione endogenously. This approach achieves superior intracellular levels and is supported by the RCT data.',
  },
  {
    q: 'Is GlyNAC safe?',
    a: 'The Sekhar trials showed excellent safety with no serious adverse events at the 0.1 g/kg/day dose. NAC can interact with blood thinners and nitroglycerin. High-dose glycine is generally well-tolerated but may cause mild GI discomfort in some. Always consult your physician before starting, particularly at doses above 4 g/day of NAC.',
  },
  {
    q: 'How does GlyNAC compare to liposomal glutathione?',
    a: 'GlyNAC is supported by multiple RCTs in older adults with clear mechanistic data. Liposomal glutathione has some bioavailability advantage over standard oral glutathione, but lacks the same depth of RCT evidence in aging-specific endpoints. TNiC rates GlyNAC as Tier A evidence for the mitochondrial and glutathione depletion pathways.',
  },
  {
    q: 'Should I add taurine to my GlyNAC stack?',
    a: 'Yes — the TNiC Foundation Stack pairs GlyNAC with Taurine (1–2 g/day). Taurine also declines dramatically with age (80% by 60) and complements GlyNAC via separate pathways: taurine supports mitochondrial membrane integrity, bile acid conjugation, and was shown to extend median lifespan 10–12% in Singh 2023 (Science). Together they address overlapping but distinct age-related deficiencies.',
  },
];

function buildGlyNACSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a GlyNAC Supplement Protocol',
    description:
      'Step-by-step guide to safely starting GlyNAC (Glycine + N-Acetylcysteine) supplementation for longevity and glutathione restoration, based on the Sekhar 2021 RCT protocol.',
    path: '/glynac-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Establish your baseline',
        text: 'Get a CBC with metabolic panel and optional glutathione blood test before starting. This lets you track actual improvements in oxidative stress markers over 3–6 months.',
      },
      {
        name: 'Start with a low dose (week 1–2)',
        text: 'Begin at 2 g Glycine + 2 g NAC daily, split into 2 doses (morning and evening with food). This allows your GI system to adjust and avoids NAC-related nausea at high doses.',
      },
      {
        name: 'Titrate to the research dose (week 3–8)',
        text: 'Increase by 1 g per component every 1–2 weeks toward the Sekhar protocol target of 0.1 g/kg/day. A 70 kg adult targets ~7 g each. Most benefits are detectable at 4–5 g/day of each.',
      },
      {
        name: 'Time your doses correctly',
        text: 'Take GlyNAC with meals (NAC on empty stomach can cause nausea). Morning dose supports daytime oxidative stress; evening dose supports nocturnal repair and mitochondrial biogenesis.',
      },
      {
        name: 'Add synergistic compounds and re-test at 12 weeks',
        text: 'Stack with Taurine (1–2 g/day) and Apigenin (50 mg/day). Re-run labs at 12 weeks to confirm glutathione improvement. Most participants in the Sekhar trial showed measurable changes by week 8.',
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
    headline: 'GlyNAC Supplement Guide 2026 — Glycine + NAC for Aging, Dosing & Evidence',
    description:
      'Complete GlyNAC guide covering the Sekhar 2021 RCT, dosing protocol, and how Glycine + NAC reverses 9 hallmarks of aging.',
    url: `${SITE.url}/glynac-supplement-guide`,
    dateModified: '2026-06-28',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      { '@type': 'MedicalSubstance', name: 'Glycine', description: 'Non-essential amino acid; rate-limiting glutathione precursor depleted with age' },
      { '@type': 'MedicalSubstance', name: 'N-Acetylcysteine', description: 'NAC; cysteine prodrug and rate-limiting glutathione cofactor' },
      { '@type': 'MedicalSubstance', name: 'Glutathione', description: 'Master intracellular antioxidant; declines 50-60% by age 70' },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Deficiency of a root cause of aging in humans leads to multifaceted defects that are corrected by supplementing GlyNAC',
        author: 'Sekhar RV',
        datePublished: '2021',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '34741609' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/34741609/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'GlyNAC supplementation corrects muscle aging in older adults — 2022 extension',
        author: 'Sekhar RV',
        datePublished: '2022',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '35970308' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/35970308/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'GlyNAC Supplement Guide', path: '/glynac-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function GlyNACGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildGlyNACSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-cyan" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider">Evidence Tier A · GlyNAC</span>
          </div>

          <h1 className="heading-hero mb-4">
            GlyNAC Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Glycine + N-Acetylcysteine is the only supplement combination proven in a human RCT to reverse 9 hallmarks of aging simultaneously — by restoring the glutathione your body stopped making.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '9', label: 'Hallmarks reversed', color: 'text-accent-cyan' },
              { value: '50%', label: 'Glutathione lost by 70', color: 'text-accent-violet' },
              { value: '94.6%', label: 'GSH increase (RCT)', color: 'text-accent-emerald' },
              { value: '3.7yr', label: 'Epigenetic reversal', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/glynac"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-cyan text-bg-base font-semibold text-sm hover:bg-accent-cyan/90 transition"
            >
              Deep-dive compound page
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/quiz"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
            >
              Build my GlyNAC stack
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why glutathione matters */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Why Glutathione — and Why It Runs Out</h2>
          <p className="text-body mb-8 max-w-2xl">
            Glutathione is the cell&apos;s primary redox buffer — it neutralizes reactive oxygen species (ROS), recycles vitamins C and E, and drives Phase II detoxification. Every mitochondrion depends on it. By age 70, most adults have lost 50–60% of their peak glutathione.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                icon: Zap,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'The Synthesis Problem',
                body: 'Glutathione is built from three amino acids: glycine, cysteine, and glutamate. Aging depletes glycine (poor diet absorption) and cysteine (oxidative demand). Without both precursors, synthesis stalls — even if the enzymes are intact.',
              },
              {
                icon: TrendingUp,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'The Cascade Effect',
                body: 'Low glutathione → mitochondria cannot neutralize ROS → electron transport chain dysfunction → less ATP → muscle weakness, cognitive fog, metabolic dysfunction. This is the core aging cascade GlyNAC interrupts.',
              },
              {
                icon: ShieldCheck,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Why NAC Alone Falls Short',
                body: 'N-Acetylcysteine raises cysteine levels but glutathione synthesis also requires glycine as a co-substrate. Without glycine, the reaction bottlenecks. This is why GlyNAC outperforms NAC alone in every head-to-head measure in the Sekhar trials.',
              },
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border p-5 ${card.badge} bg-card/50`}>
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border mb-3 ${card.badge}`}>
                  <card.icon className={`w-4.5 h-4.5 ${card.color}`} aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sekhar 2021 trial */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-2">The Sekhar 2021 RCT — What They Found</h2>
          <p className="text-body-sm text-muted-foreground mb-8">
            PMID:{' '}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/34741609/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan hover:underline inline-flex items-center gap-1"
            >
              34741609 <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>{' '}
            · Journal of Nutrition · 2021 · 24-week RCT, older adults (71–80) vs young controls (21–30)
          </p>

          <div className="rounded-2xl border border-accent-cyan/20 bg-accent-cyan/[0.04] p-6 mb-8">
            <p className="font-mono text-sm text-accent-cyan mb-2">KEY FINDING</p>
            <p className="text-lg font-semibold">
              24 weeks of GlyNAC at 0.1 g/kg/day reversed <span className="text-accent-cyan">9 hallmarks of aging</span> in older adults, with glutathione rising 94.6% in red blood cells and mitochondrial fuel oxidation returning to young-adult levels.
            </p>
          </div>

          <h3 className="font-semibold text-lg mb-4">Hallmarks Addressed</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            {HALLMARKS_REVERSED.map((h, i) => (
              <div key={h.name} className="flex gap-3 items-start rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-mono text-accent-cyan">{i + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{h.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-accent-violet/20 bg-accent-violet/[0.04] p-5">
            <p className="font-mono text-xs text-accent-violet mb-1">2022 EXTENSION (PMID 35970308)</p>
            <p className="text-sm text-muted-foreground">
              A follow-up trial specifically targeting muscle aging confirmed strength gains, improved physical function, and found epigenetic age reversal of approximately{' '}
              <strong className="text-foreground">3.7 years</strong> in older adults after 24 weeks of GlyNAC.
            </p>
          </div>
        </div>
      </section>

      {/* Dosing protocol */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Dosing Protocol</h2>
          <p className="text-body mb-8 max-w-2xl">
            The research protocol uses weight-based dosing. Most practitioners start lower and titrate up over several weeks to minimize NAC-related GI discomfort.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">PHASE</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">GLYCINE</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">NAC</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">TIMING</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { phase: 'Start (weeks 1–2)', gly: '2 g/day', nac: '2 g/day', timing: '2× with meals' },
                  { phase: 'Build (weeks 3–6)', gly: '4 g/day', nac: '4 g/day', timing: '2× with meals' },
                  { phase: 'Maintenance', gly: '5–7 g/day', nac: '5–7 g/day', timing: '2× with meals' },
                  { phase: 'Research dose (70 kg)', gly: '7 g/day', nac: '7 g/day', timing: '2× with meals' },
                ].map((row) => (
                  <tr key={row.phase} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium">{row.phase}</td>
                    <td className="p-4 font-mono text-accent-cyan">{row.gly}</td>
                    <td className="p-4 font-mono text-accent-violet">{row.nac}</td>
                    <td className="p-4 text-muted-foreground text-xs">{row.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-accent-emerald/20 bg-accent-emerald/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
                <p className="font-semibold text-accent-emerald text-sm">Do</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Take Glycine and NAC <strong className="text-foreground">together</strong> — they work synergistically</li>
                <li>· Always take with food to minimize nausea</li>
                <li>· Take 2× daily (morning + evening) for steady precursor availability</li>
                <li>· Re-test glutathione or oxidative stress markers at 12 weeks</li>
                <li>· Pair with Taurine (1–2 g/day) for additive mitochondrial support</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Caution</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· NAC can interact with blood thinners — check with physician</li>
                <li>· High-dose NAC (&gt;4 g/day) may cause nausea if taken without food</li>
                <li>· Not a substitute for clinical care if you have known mitochondrial disease</li>
                <li>· Avoid if you have active kidney disease without physician guidance</li>
                <li>· Don&apos;t take NAC alongside activated charcoal — it reduces absorption</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HowTo steps */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How to Start: 5 Steps</h2>
          <p className="text-body-sm text-muted-foreground mb-8">Based on the Sekhar 2021 RCT protocol, adapted for safe self-directed supplementation.</p>

          <div className="space-y-4">
            {[
              {
                n: '01',
                title: 'Establish your baseline labs',
                body: 'Get a basic metabolic panel and optional red blood cell (RBC) glutathione test before starting. Tracking baseline oxidative stress markers (8-OHdG, hsCRP) lets you verify the intervention is working at 12 weeks.',
              },
              {
                n: '02',
                title: 'Start low: 2 g of each (weeks 1–2)',
                body: 'Begin at 2 g Glycine + 2 g NAC daily split across 2 meals. This lets your body adjust and avoids NAC-induced nausea, which is dose-dependent and largely preventable with food.',
              },
              {
                n: '03',
                title: 'Titrate up over 4–6 weeks',
                body: 'Add 1 g of each component every 1–2 weeks, targeting 5–7 g per day of each. Adjust to bodyweight: the research dose is 0.1 g/kg/day for each compound.',
              },
              {
                n: '04',
                title: 'Add synergistic stack components',
                body: 'Taurine (1–2 g/day) addresses overlapping age-related depletion via different pathways. Apigenin (50 mg/day) inhibits CD38 to protect NAD+ — a separate but complementary mechanism to GlyNAC\'s glutathione restoration.',
              },
              {
                n: '05',
                title: 'Re-test and adjust at 12–24 weeks',
                body: 'The Sekhar trial showed measurable changes by week 8 and plateaued around week 24. Repeat baseline tests at 12 weeks. If RBC glutathione hasn\'t improved, consider dose adjustment or checking for malabsorption.',
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                  <span className="text-xs font-mono text-accent-cyan">{step.n}</span>
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
          <h2 className="heading-section mb-8">GlyNAC FAQ</h2>
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
          <div className="rounded-2xl border border-accent-cyan/20 bg-accent-cyan/[0.04] p-8 md:p-10 text-center">
            <h2 className="heading-section mb-3">Build Your GlyNAC Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              GlyNAC is a foundation-layer compound in most TNiC protocol presets. The quiz matches you to the right preset based on your goal, age, and experience.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/quiz"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-cyan text-bg-base font-semibold text-sm hover:bg-accent-cyan/90 transition"
              >
                Take the 3-min quiz
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/glynac"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
              >
                GlyNAC compound page
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compare/glynac-vs-liposomal-glutathione"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                GlyNAC vs liposomal glutathione
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/nad-supplement-guide"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
              >
                NAD+ guide
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Educational content only — not medical advice. GlyNAC is a dietary supplement, not FDA-approved to treat or prevent any disease. Consult your physician before starting any supplement regimen, especially at research doses.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
