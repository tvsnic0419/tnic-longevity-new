import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, TrendingUp, Zap, CheckCircle2, AlertTriangle, ExternalLink, Activity } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: "Berberine Supplement Guide 2026 — Dosage, Evidence & Nature's Ozempic Reality Check",
  description:
    "Complete berberine guide: what the science actually says about blood sugar, weight loss, AMPK activation, and longevity. Dosing protocol, comparison to metformin, and the truth about 'nature's Ozempic'.",
  path: '/berberine-supplement-guide',
  keywords: [
    'berberine supplement guide',
    "berberine nature's ozempic",
    'berberine vs metformin',
    'berberine dosage',
    'berberine for blood sugar',
    'berberine longevity',
    'berberine weight loss',
    'berberine AMPK',
    'berberine side effects',
    'best berberine supplement 2026',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Blood glucose (HbA1c)',
    finding: '−0.5 to −0.9% HbA1c reduction in T2D patients',
    quality: 'Strong',
    pmid: '19800084',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Fasting blood glucose',
    finding: '−0.84 mmol/L fasting glucose reduction (meta-analysis)',
    quality: 'Strong',
    pmid: '23118876',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'LDL cholesterol',
    finding: '−12–23 mg/dL LDL reduction; −35% triglycerides in some trials',
    quality: 'Good',
    pmid: '15735277',
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'Weight / BMI',
    finding: '−1.5 to −2.5 kg body weight in 3-month trials; no head-to-head GLP-1 data',
    quality: 'Moderate',
    pmid: '23118876',
    color: 'text-accent-violet',
    badge: 'bg-accent-violet/10 border-accent-violet/20',
  },
  {
    endpoint: 'AMPK activation',
    finding: 'Dose-dependent AMPK activation in cell/animal models; human mechanistic data limited',
    quality: 'Moderate',
    pmid: '16439621',
    color: 'text-accent-violet',
    badge: 'bg-accent-violet/10 border-accent-violet/20',
  },
  {
    endpoint: 'Longevity / lifespan',
    finding: 'Preclinical: extended lifespan in C. elegans and Drosophila; no human longevity RCTs',
    quality: 'Preclinical only',
    pmid: '26186647',
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
];

const FAQ = [
  {
    q: "Is berberine really 'nature's Ozempic'?",
    a: "The comparison is misleading. GLP-1 agonists like semaglutide (Ozempic/Wegovy) produce 15–20% body weight reduction in RCTs. The best berberine trials show 1.5–2.5 kg over 3 months — a meaningful effect for metabolic health, but not remotely comparable to GLP-1 results. Berberine's mechanisms also differ entirely from GLP-1 agonism. The 'nature's Ozempic' label is marketing hype. Berberine is a legitimately useful metabolic compound — it doesn't need the comparison to be valuable.",
  },
  {
    q: 'How does berberine compare to metformin?',
    a: "Several head-to-head RCTs show berberine achieves similar HbA1c reductions to metformin 500mg twice daily. The AMPK mechanism is similar. However: metformin has 60+ years of safety data, is the subject of the TAME longevity trial, and is the only compound with TAME backing as a longevity pharmaceutical. Berberine has poor bioavailability vs metformin's well-characterized pharmacokinetics. Berberine is an OTC option; metformin requires a prescription. Both are valid — metformin wins on evidence depth, berberine on accessibility.",
  },
  {
    q: 'What is the correct berberine dosage?',
    a: 'The most-studied protocol is 500 mg three times daily with meals (1.5 g/day total). This was used in the key Zhang 2008 T2D trial (PMID 19800084). Some practitioners use 500 mg twice daily (1 g/day) with good results. Take with meals — berberine bioavailability improves with food and the GI effects are reduced. Doses above 1.5 g/day rarely provide additional benefit and increase GI side effects.',
  },
  {
    q: 'What are the main berberine side effects?',
    a: "GI discomfort (nausea, constipation, flatulence) in 10–30% of users at 500mg TID — the main reason for dose splits with meals. Berberine inhibits CYP3A4 and CYP2D6 enzymes, creating interaction risk with drugs metabolized by these pathways (certain statins, blood thinners, some antibiotics). Not recommended in pregnancy or nursing. Not for children. Check interactions if on any prescription medications.",
  },
  {
    q: 'Does berberine extend lifespan?',
    a: 'In C. elegans and Drosophila: yes, meaningfully. In mammals: the data is promising but limited — berberine activates AMPK (the same pathway as metformin and caloric restriction) and reduces inflammaging markers in animal models. No human longevity RCTs exist as of 2026. The longevity case for berberine is mechanistic and extrapolated, not proven by outcome data in humans. TNiC rates it Tier B for longevity and Tier A for metabolic health endpoints.',
  },
  {
    q: 'Can I stack berberine with NMN or GlyNAC?',
    a: "Yes — berberine is a standard component in TNiC's Foundation and Full-Spectrum stacks. It doesn't directly interact with NMN or GlyNAC. Note that berberine + metformin is generally not recommended (redundant mechanism + additive hypoglycemia risk). Berberine + resveratrol is a reasonable combination — both activate AMPK/SIRT1 pathway with partially distinct mechanisms. Always check with your physician if on blood sugar medications.",
  },
  {
    q: 'Should I take berberine with or without food?',
    a: 'Always with food. Berberine has poor inherent bioavailability (~36%). Taken with meals: (1) food increases absorption, (2) GI side effects (nausea, cramping) are significantly reduced, (3) glucose-lowering effect is appropriately timed to postprandial glucose spike. The standard clinical dosing is 500 mg 15–30 minutes before or during each main meal.',
  },
];

function buildBerberineSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Berberine Supplement Protocol Safely',
    description:
      'Evidence-based protocol for starting berberine supplementation for metabolic health and longevity, based on the Zhang 2008 RCT and subsequent meta-analyses.',
    path: '/berberine-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Check for drug interactions first',
        text: 'Berberine inhibits CYP3A4 and CYP2D6 liver enzymes. If you take any prescription medications — especially statins, blood thinners, or antibiotics — check for interactions with your pharmacist before starting. This is non-negotiable.',
      },
      {
        name: 'Start at a lower dose (week 1–2)',
        text: 'Begin with 500 mg once daily with your largest meal. This allows your GI system to adjust. The most common reason people stop berberine is GI discomfort at full dose from day one.',
      },
      {
        name: 'Titrate to 500mg with each main meal (week 3+)',
        text: 'Increase to 500 mg with breakfast, 500 mg with lunch, 500 mg with dinner (1.5 g/day total). This matches the Zhang 2008 RCT protocol — the landmark trial showing comparable HbA1c reduction to metformin.',
      },
      {
        name: 'Cycle your dosing if taking long-term',
        text: 'Many practitioners recommend cycling berberine: 8 weeks on, 4 weeks off. Continuous use may cause gut microbiome adaptation. The cycling approach is conservative and widely used — though no RCT has directly compared continuous vs cyclic dosing.',
      },
      {
        name: 'Monitor fasting glucose and HbA1c at 3 months',
        text: 'Get a fasting blood glucose and HbA1c at baseline and repeat at 12 weeks. The clinical trial evidence shows the primary metabolic effects emerge within 8–12 weeks. Tracking confirms you are in the evidence-supported response window.',
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
    headline: "Berberine Supplement Guide 2026 — Dosage, Evidence & Nature's Ozempic Reality Check",
    description:
      "Complete evidence guide to berberine: metabolic endpoints, AMPK mechanism, comparison to metformin, correct dosing, and the truth about the 'nature's Ozempic' claim.",
    url: `${SITE.url}/berberine-supplement-guide`,
    dateModified: '2026-06-28',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      { '@type': 'MedicalSubstance', name: 'Berberine', description: 'Isoquinoline alkaloid; AMPK activator with metabolic and anti-inflammatory properties' },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Efficacy of berberine in patients with type 2 diabetes mellitus',
        author: 'Zhang Y et al.',
        datePublished: '2008',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '19800084' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/19800084/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Berberine in the treatment of type 2 diabetes mellitus: a systematic review and meta-analysis',
        author: 'Dong H et al.',
        datePublished: '2012',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '23118876' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/23118876/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Berberine Supplement Guide', path: '/berberine-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function BerberineGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildBerberineSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-violet" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-violet uppercase tracking-wider">Evidence Tier A (Metabolic) · Berberine</span>
          </div>

          <h1 className="heading-hero mb-4">
            Berberine Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Berberine is a legitimately evidence-backed metabolic compound. But before you buy the &ldquo;nature&rsquo;s Ozempic&rdquo; version: here is what the science actually shows — and what it doesn&rsquo;t.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '−0.9%', label: 'HbA1c reduction', color: 'text-accent-emerald' },
              { value: '≈Metformin', label: 'Effect size vs drug', color: 'text-accent-violet' },
              { value: '1.5 g/day', label: 'Evidence dose', color: 'text-accent-cyan' },
              { value: 'Tier A', label: 'Metabolic evidence', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/berberine"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-violet text-bg-base font-semibold text-sm hover:bg-accent-violet/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/berberine-vs-metformin"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
            >
              Berberine vs Metformin
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check on "nature's Ozempic" */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">The &ldquo;Nature&rsquo;s Ozempic&rdquo; Claim — What&rsquo;s True, What&rsquo;s Hype</h2>
          <p className="text-body mb-6 max-w-2xl">
            TikTok made berberine famous as &ldquo;nature&rsquo;s Ozempic.&rdquo; Here is an honest comparison.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-violet">BERBERINE</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">SEMAGLUTIDE (OZEMPIC)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Weight loss (3 months)',
                    berberine: '−1.5 to −2.5 kg',
                    sema: '−5 to −9 kg (Wegovy dose at 3 months)',
                    winner: 'sema',
                  },
                  {
                    metric: 'Weight loss (1 year)',
                    berberine: '~2–3 kg (extrapolated)',
                    sema: '−14.9% body weight (STEP-1 RCT)',
                    winner: 'sema',
                  },
                  {
                    metric: 'Blood glucose (HbA1c)',
                    berberine: '−0.5 to −0.9% (strong RCT data)',
                    sema: '−1.2 to −2.0%',
                    winner: 'sema',
                  },
                  {
                    metric: 'Mechanism',
                    berberine: 'AMPK activation, gut microbiome, glucose uptake',
                    sema: 'GLP-1 receptor agonist — appetite suppression, gastric emptying',
                    winner: 'different',
                  },
                  {
                    metric: 'OTC accessibility',
                    berberine: '✓ Available without prescription',
                    sema: '✗ Prescription only; often $900+/month without insurance',
                    winner: 'berberine',
                  },
                  {
                    metric: 'Side effects',
                    berberine: 'GI discomfort (10–30%); drug interactions via CYP enzymes',
                    sema: 'Nausea (44%), vomiting, diarrhea; rare pancreatitis risk',
                    winner: 'tie',
                  },
                  {
                    metric: 'Longevity evidence',
                    berberine: 'AMPK-mediated; preclinical lifespan data; no human longevity RCT',
                    sema: 'No longevity RCTs; cardiovascular outcome trials in T2D (positive)',
                    winner: 'tie',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className={`p-4 text-xs ${row.winner === 'berberine' ? 'text-accent-violet font-semibold' : 'text-muted-foreground'}`}>{row.berberine}</td>
                    <td className={`p-4 text-xs ${row.winner === 'sema' ? 'text-accent-cyan font-semibold' : 'text-muted-foreground'}`}>{row.sema}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The verdict</p>
            <p className="text-sm text-muted-foreground">
              Berberine is a real metabolic compound with legitimate glucose and lipid evidence. The &ldquo;nature&rsquo;s Ozempic&rdquo; label is marketing — berberine does not activate GLP-1 receptors and produces a fraction of the weight loss effect. Berberine stands on its own merits as a metabolic health supplement and potential longevity tool. It does not need to be compared to Ozempic.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence table */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Evidence Summary by Endpoint</h2>
          <p className="text-body-sm text-muted-foreground mb-8">Click each PMID to view the source trial on PubMed.</p>

          <div className="grid md:grid-cols-2 gap-4">
            {EVIDENCE_TABLE.map((item) => (
              <div key={item.endpoint} className={`rounded-xl border p-5 bg-card/50 ${item.badge}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{item.endpoint}</p>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${item.badge} ${item.color}`}>
                    {item.quality}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.finding}</p>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-mono inline-flex items-center gap-1 ${item.color} hover:underline`}
                >
                  PMID {item.pmid} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dosing protocol */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Dosing Protocol</h2>
          <p className="text-body mb-8 max-w-2xl">
            The standard protocol used in the landmark Zhang 2008 RCT and subsequent meta-analyses.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">PHASE</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">DOSE</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">TIMING</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">NOTE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { phase: 'Week 1–2 (ramp)', dose: '500 mg/day', timing: '1× with dinner', note: 'Allow GI adaptation' },
                  { phase: 'Week 3+ (maintenance)', dose: '1.5 g/day', timing: '500 mg × 3 meals', note: 'Evidence dose' },
                  { phase: 'Cycling (optional)', dose: '1.5 g/day', timing: '8 weeks on, 4 off', note: 'Prevents adaptation' },
                ].map((row) => (
                  <tr key={row.phase} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium">{row.phase}</td>
                    <td className="p-4 font-mono text-accent-violet">{row.dose}</td>
                    <td className="p-4 text-muted-foreground text-xs">{row.timing}</td>
                    <td className="p-4 text-muted-foreground text-xs">{row.note}</td>
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
                <li>· Always take with food — improves absorption and reduces GI effects</li>
                <li>· Take 15–30 min before meals for best glucose-timing effect</li>
                <li>· Check for drug interactions (CYP3A4/2D6) before starting</li>
                <li>· Look for dihydroberberine or phytosome forms for better absorption</li>
                <li>· Monitor fasting glucose and HbA1c at 3-month intervals</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Not safe in pregnancy or nursing — crosses placenta</li>
                <li>· Can lower blood sugar below normal if combined with diabetes drugs</li>
                <li>· CYP3A4 inhibition — interacts with many statins, cyclosporine, some antibiotics</li>
                <li>· Do not combine with metformin without physician oversight (additive hypoglycemia)</li>
                <li>· Not recommended in children or with known severe liver disease</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Berberine Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Activity,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'AMPK Activation',
                body: "Berberine activates AMP-activated protein kinase (AMPK) — the same pathway targeted by metformin and exercise. AMPK is the cell's energy sensor: when activated, it switches on fat burning, glucose uptake, and autophagy, while switching off fat synthesis and gluconeogenesis.",
              },
              {
                icon: TrendingUp,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Gut Microbiome Modulation',
                body: 'A significant part of berberine\'s metabolic effect comes from reshaping the gut microbiome — increasing butyrate-producing bacteria and reducing LPS-producing species. This may explain why berberine works better in some people than others: gut microbiome composition predicts response.',
              },
              {
                icon: Zap,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Glucose Transporter Upregulation',
                body: 'Berberine increases GLUT4 glucose transporter expression on muscle cells — allowing more glucose uptake independent of insulin signaling. This contributes to fasting glucose reduction beyond the AMPK pathway.',
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

      {/* HowTo steps */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-8">5-Step Start Protocol</h2>
          <div className="space-y-4">
            {[
              {
                n: '01',
                title: 'Check drug interactions before anything else',
                body: 'Berberine inhibits CYP3A4 and CYP2D6 — two major liver enzymes. Many drugs are metabolized by these pathways. Use a drug interaction checker or ask your pharmacist before starting. This is the most commonly skipped step.',
              },
              {
                n: '02',
                title: 'Start at 500 mg once daily with dinner',
                body: 'The most common reason people abandon berberine is GI discomfort (nausea, cramps, diarrhea) when they start at full dose. One week at 500 mg gives your gut microbiome time to adjust.',
              },
              {
                n: '03',
                title: 'Titrate to 500 mg × 3 meals (1.5 g/day)',
                body: "This is the Zhang 2008 RCT dose — the landmark trial showing HbA1c reduction equivalent to metformin at 1500 mg/day. Take it with or 15–30 min before each main meal. Don't skip doses.",
              },
              {
                n: '04',
                title: 'Consider cycling: 8 weeks on, 4 weeks off',
                body: "Continuous berberine may lead to gut adaptation that reduces efficacy over time. Many longevity practitioners cycle it. This isn't proven by direct RCT comparison but is a conservative approach for long-term use.",
              },
              {
                n: '05',
                title: 'Re-test at 12 weeks: fasting glucose + HbA1c',
                body: "If you started with elevated fasting glucose or HbA1c, re-test at 3 months. The RCT data shows the primary metabolic effect plateaus around 12 weeks. If you haven't seen a response by then, reassess the dose or form.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center">
                  <span className="text-xs font-mono text-accent-violet">{step.n}</span>
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
          <h2 className="heading-section mb-8">Berberine FAQ</h2>
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

      {/* Safety callout */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="rounded-2xl border border-accent-rose/20 bg-accent-rose/[0.04] p-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-accent-rose flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-accent-rose mb-2">Important safety note</h3>
                <p className="text-sm text-muted-foreground">
                  Berberine lowers blood glucose. If you take diabetes medications (metformin, sulfonylureas, insulin), combining berberine without physician guidance can cause hypoglycemia. This is not a minor concern — blood sugar can drop to dangerous levels. Inform your physician before starting. TNiC content is educational and not a substitute for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-page max-w-4xl">
          <div className="rounded-2xl border border-accent-violet/20 bg-accent-violet/[0.04] p-8 md:p-10 text-center">
            <h2 className="heading-section mb-3">Build Your Berberine Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Berberine is a component in TNiC&rsquo;s Foundation, NRF2, and Full-Spectrum presets. Take the quiz to get a personalized protocol.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/quiz"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-violet text-bg-base font-semibold text-sm hover:bg-accent-violet/90 transition"
              >
                Take the 3-min quiz
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compare/berberine-vs-metformin"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Berberine vs Metformin
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/berberine"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Compound deep-dive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/longevity-supplements-guide"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
              >
                Full supplement guide
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Educational content only — not medical advice. Berberine is a dietary supplement, not FDA-approved to treat or prevent any disease. Consult your physician before starting, especially if you take medications metabolized by CYP3A4 or CYP2D6 enzymes, or any blood sugar medications.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
