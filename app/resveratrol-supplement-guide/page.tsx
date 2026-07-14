import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, TrendingUp, Zap, CheckCircle2, AlertTriangle, ExternalLink, Activity, Dna } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Resveratrol Supplement Guide 2026 — Dosage, SIRT1 Evidence & the Human-Trial Reality Check',
  description:
    'Complete trans-resveratrol guide: what the science actually shows about SIRT1 activation, the landmark Baur 2006 mouse study, dosing and timing, the NMN stack rationale, and why no human resveratrol outcome RCT exists yet.',
  path: '/resveratrol-supplement-guide',
  keywords: [
    'resveratrol supplement guide',
    'trans-resveratrol dosage',
    'resveratrol SIRT1',
    'resveratrol vs pterostilbene',
    'resveratrol NMN stack',
    'resveratrol bioavailability',
    'resveratrol longevity',
    'resveratrol side effects',
    'micronized resveratrol',
    'best resveratrol supplement 2026',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Lifespan / survival (mouse)',
    finding:
      'The foundational Baur 2006 study found resveratrol significantly improved health and survival in mice fed a high-calorie diet, via SIRT1 activation. This is the landmark finding that launched resveratrol longevity research — but it is a mouse study, not a human trial.',
    quality: 'Strong (animal)',
    pmid: '17086191',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'SIRT1 activation mechanism',
    finding:
      'The same landmark study demonstrated the mechanism: resveratrol allosterically activates SIRT1, increasing its affinity for acetylated substrates and driving the downstream PGC-1α / FOXO3a / NF-κB effects described below. Demonstrated in the mouse model, not confirmed in a dedicated human PBMC or tissue-biopsy RCT.',
    quality: 'Strong (animal)',
    pmid: '17086191',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Metabolic health effects (high-calorie diet)',
    finding:
      'Baur 2006 also reported that resveratrol shifted several metabolic markers in mice on a high-calorie diet toward those of mice on a standard diet — consistent with a caloric-restriction-mimetic effect. Again: mouse data only.',
    quality: 'Strong (animal)',
    pmid: '17086191',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Human SIRT1/FOXO3a activation',
    finding:
      'No verified, dedicated human RCT in this library confirms resveratrol activates SIRT1 or FOXO3a in human PBMCs or other tissue at any specific dose. Claims to this effect exist widely in supplement marketing — treat them as unverified until a specific citable trial is available.',
    quality: 'Not established in humans',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    endpoint: 'Bioavailability / absorption',
    finding:
      'Well-characterized pharmacokinetic finding across the resveratrol literature: standard powder is glucuronidated in the intestinal wall, limiting systemic bioavailability to roughly 1%. Micronized and liposomal formulations achieve several-fold higher peak plasma concentration. This is established pharmacology rather than a single-trial claim.',
    quality: 'Established pharmacology',
    pmid: undefined,
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'Human longevity / outcome RCTs',
    finding:
      'No human longevity-endpoint RCT exists for resveratrol as of 2026. The NMN + resveratrol combination in particular has strong mechanistic rationale (see below) but has not been tested together in a dedicated human trial. Do not let marketing imply otherwise.',
    quality: 'Not established',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
];

const FAQ = [
  {
    q: 'Has resveratrol actually been shown to extend human lifespan?',
    a: "No. The landmark finding — resveratrol improving health and survival — comes from Baur et al. 2006 (Nature, PMID 17086191), a mouse study in animals fed a high-calorie diet. It is the foundational study behind resveratrol's longevity reputation, and it is genuinely important mechanistic evidence, but it is not a human trial and does not establish a human lifespan effect. No human longevity-outcome RCT for resveratrol exists as of 2026. Anyone claiming resveratrol has been 'proven' to extend human life is overstating the evidence.",
  },
  {
    q: 'Is there a human trial showing resveratrol activates SIRT1?',
    a: "Not a dedicated, verified one that this guide can point to. The SIRT1-activation mechanism is extremely well characterized in the Baur 2006 mouse model and in cell-free biochemical assays, but a specific human PBMC or tissue-biopsy RCT confirming SIRT1/FOXO3a activation at a defined resveratrol dose is not part of the verified evidence base here. Be skeptical of any source citing such a trial without a real PMID attached — this is exactly the kind of unverifiable claim that gets fabricated in supplement marketing.",
  },
  {
    q: 'What is the correct resveratrol dosage?',
    a: 'The commonly used range is 150–500mg of trans-resveratrol daily. Because standard powder has roughly 1% oral bioavailability (intestinal glucuronidation degrades most of the dose before it reaches circulation), many practitioners prefer micronized or liposomal formulations, which achieve 3–5x higher peak plasma concentration for the same milligram dose. Take with a fat-containing meal — resveratrol is fat-soluble and absorption improves substantially with dietary fat present.',
  },
  {
    q: 'Should I take resveratrol in the morning or at night?',
    a: 'Evening (PM) dosing is generally preferred. SIRT1 expression follows a circadian rhythm that peaks later in the day, so PM timing is thought to align resveratrol\'s SIRT1-activating effect with the body\'s own expression pattern. Pair it with a fat-containing dinner to improve absorption.',
  },
  {
    q: 'Does stacking resveratrol with NMN actually work?',
    a: "The mechanistic logic is sound and widely cited: NMN restores the NAD+ substrate pool that SIRT1 depends on, while resveratrol increases SIRT1's catalytic affinity for that substrate by an estimated 8–13x. In principle, raising both substrate availability and enzyme affinity at once should produce more sirtuin output than either compound alone. That said, this specific combination has not been tested together in a dedicated human RCT — the case for stacking them is mechanistic reasoning extrapolated from separate lines of evidence, not a proven combined-outcome trial. Say this plainly to yourself before treating the stack as clinically validated.",
  },
  {
    q: 'What are the main resveratrol side effects and interactions?',
    a: 'Resveratrol is generally well tolerated at typical supplemental doses, with mild GI upset (nausea, loose stool) reported at higher doses in some users. It has documented antiplatelet activity, so caution is warranted if you take blood thinners or have surgery scheduled — stop at least two weeks before any procedure. It may also affect the metabolism of drugs processed by certain CYP enzymes. Discuss with your physician before combining with any prescription medication.',
  },
  {
    q: 'Resveratrol or pterostilbene — which should I actually buy?',
    a: "They share the same core SIRT1/AMPK mechanism, but pterostilbene's two methoxy groups (versus resveratrol's two hydroxyl groups) dramatically reduce intestinal glucuronidation, giving it roughly 82% bioavailability versus resveratrol's much lower native absorption, plus a longer plasma half-life. Resveratrol has the deeper research history and the single landmark mouse longevity study; pterostilbene has a human safety trial (dose-escalation, not efficacy) supporting its tolerability up to 250mg/day. See the full head-to-head comparison for the complete picture.",
  },
];

function buildResveratrolSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Trans-Resveratrol Supplement Protocol Safely',
    description:
      'Evidence-based protocol for starting trans-resveratrol supplementation, grounded in the mechanistic rationale established by the Baur 2006 mouse study and current pharmacokinetic understanding of resveratrol bioavailability.',
    path: '/resveratrol-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Choose a bioavailable formulation',
        text: 'Standard resveratrol powder has roughly 1% oral bioavailability due to intestinal glucuronidation. Look for micronized or liposomal trans-resveratrol, which achieve 3–5x higher plasma concentration for the same dose.',
      },
      {
        name: 'Check for interactions and bleeding risk first',
        text: 'Resveratrol has antiplatelet activity. If you take blood thinners, have surgery scheduled, or take medications metabolized by CYP enzymes, talk to your physician or pharmacist before starting.',
      },
      {
        name: 'Start at 150mg with an evening meal',
        text: 'Begin at the low end of the 150–500mg range, taken with a fat-containing dinner to improve absorption and aligned with the evening peak in SIRT1 expression.',
      },
      {
        name: 'Titrate toward 300–500mg if well tolerated',
        text: 'After 1–2 weeks without GI discomfort, most protocols move toward the upper end of the 150–500mg range for a stronger SIRT1-activation signal, still dosed in the evening with food.',
      },
      {
        name: 'Consider pairing with NMN, understanding the limits of the evidence',
        text: 'NMN raises the NAD+ substrate that SIRT1 acts on; resveratrol increases SIRT1 affinity for that substrate. The combination has strong mechanistic rationale but has not been tested together in a dedicated human RCT — treat it as a reasoned stack, not a proven one.',
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
    headline: 'Resveratrol Supplement Guide 2026 — Dosage, SIRT1 Evidence & the Human-Trial Reality Check',
    description:
      'Complete evidence guide to trans-resveratrol: the Baur 2006 mouse longevity study, SIRT1/AMPK mechanism, bioavailability limitations, dosing protocol, and an honest look at what has — and has not — been shown in humans.',
    url: `${SITE.url}/resveratrol-supplement-guide`,
    dateModified: '2026-07-14',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      {
        '@type': 'MedicalSubstance',
        name: 'Trans-Resveratrol',
        description: 'Stilbene polyphenol; allosteric SIRT1 activator with AMPK-agonist and anti-inflammatory properties',
      },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Resveratrol improves health and survival of mice on a high-calorie diet',
        author: 'Baur JA et al.',
        datePublished: '2006',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '17086191' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/17086191/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Resveratrol Supplement Guide', path: '/resveratrol-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function ResveratrolGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildResveratrolSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-violet" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-violet uppercase tracking-wider">Evidence Tier B · Trans-Resveratrol</span>
          </div>

          <h1 className="heading-hero mb-4">
            Resveratrol Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Resveratrol&rsquo;s reputation rests on one landmark mouse study. That study is genuinely important — but it is not a human trial. Here is the mechanism, the dosing protocol, and an honest accounting of what has and has not been shown in people.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '8–13×', label: 'SIRT1 affinity boost', color: 'text-accent-emerald' },
              { value: '72%', label: 'Bioavailability (micronized)', color: 'text-accent-violet' },
              { value: '150–500mg', label: 'Evidence-informed dose', color: 'text-accent-cyan' },
              { value: 'Tier B', label: 'Longevity evidence', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/resveratrol"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-violet text-bg-base font-semibold text-sm hover:bg-accent-violet/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/resveratrol-vs-pterostilbene"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
            >
              Resveratrol vs Pterostilbene
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check / comparison */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Resveratrol vs Pterostilbene: Same Target, Different Bioavailability</h2>
          <p className="text-body mb-6 max-w-2xl">
            Both compounds activate the same SIRT1/AMPK machinery. The real-world question is which one actually gets into your bloodstream — and what the human evidence supports for each.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-violet">RESVERATROL</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">PTEROSTILBENE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Native oral bioavailability',
                    resv: '~1% (standard powder) before glucuronidation losses',
                    ptero: 'Substantially higher — methoxy groups resist glucuronidation',
                    winner: 'ptero',
                  },
                  {
                    metric: 'Plasma half-life',
                    resv: '~14 minutes',
                    ptero: '~105 minutes',
                    winner: 'ptero',
                  },
                  {
                    metric: 'Longest human evidence trail',
                    resv: 'Foundational mouse longevity study (Baur 2006) driving decades of interest',
                    ptero: 'Human dose-escalation safety trial up to 250mg/day (Riche 2013)',
                    winner: 'different',
                  },
                  {
                    metric: 'Human efficacy RCT',
                    resv: 'None verified for a specific outcome endpoint',
                    ptero: 'None — the human trial available is safety-only, not efficacy',
                    winner: 'tie',
                  },
                  {
                    metric: 'Unique mechanism add-on',
                    resv: 'None beyond shared SIRT1/AMPK pathway',
                    ptero: 'PPARα activation — lipid oxidation / ketogenesis support',
                    winner: 'ptero',
                  },
                  {
                    metric: 'Typical dose',
                    resv: '150–500mg trans-resveratrol',
                    ptero: '50–150mg (lower dose achieves comparable exposure)',
                    winner: 'context',
                  },
                  {
                    metric: 'TNiC stack integration',
                    resv: 'Native PM pairing with NMN in the SIRT1 preset',
                    ptero: 'Reasonable substitution; same PM timing logic',
                    winner: 'tie',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className={`p-4 text-xs ${row.winner === 'resv' ? 'text-accent-violet font-semibold' : 'text-muted-foreground'}`}>{row.resv}</td>
                    <td className={`p-4 text-xs ${row.winner === 'ptero' ? 'text-accent-cyan font-semibold' : 'text-muted-foreground'}`}>{row.ptero}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The verdict</p>
            <p className="text-sm text-muted-foreground">
              Neither compound has a human longevity-outcome RCT behind it. Resveratrol carries the deeper history and the single landmark mouse study that started the sirtuin field; pterostilbene carries a human safety trial and a meaningfully better absorption profile per milligram. If bioavailability and GI tolerance matter most to you, pterostilbene is the reasonable upgrade to evaluate. See our <Link href="/pterostilbene-supplement-guide" className="text-accent-cyan hover:underline">full pterostilbene guide</Link> and the <Link href="/library/compare/resveratrol-vs-pterostilbene" className="text-accent-cyan hover:underline">head-to-head comparison</Link> for the complete breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence table */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Evidence Summary by Endpoint</h2>
          <p className="text-body-sm text-muted-foreground mb-8">Click each PMID to view the source study on PubMed. Resveratrol has exactly one verified landmark citation in this guide — we are deliberately not padding the evidence table with unverifiable claims.</p>

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
                {item.pmid ? (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs font-mono inline-flex items-center gap-1 ${item.color} hover:underline`}
                  >
                    PMID {item.pmid} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-muted-foreground">No dedicated citation available</span>
                )}
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
            A conservative, tolerability-first ramp based on the commonly used 150–500mg trans-resveratrol range and established bioavailability pharmacology.
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
                  { phase: 'Week 1–2 (ramp)', dose: '150mg/day', timing: 'PM, with a fat-containing meal', note: 'Assess GI tolerance' },
                  { phase: 'Week 3+ (maintenance)', dose: '300–500mg/day', timing: 'PM, with dinner', note: 'Aligns with circadian SIRT1 peak' },
                  { phase: 'Formulation choice', dose: 'Micronized or liposomal preferred', timing: 'Same PM window', note: '3–5× higher plasma Cmax vs standard powder' },
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
                <li>· Choose micronized or liposomal resveratrol — standard powder loses most of its dose to intestinal glucuronidation</li>
                <li>· Take in the evening (PM) with a fat-containing meal to align with circadian SIRT1 expression and improve absorption</li>
                <li>· Pair with NMN if using an AM/PM sirtuin stack — understand this is mechanistic reasoning, not a proven combined-trial result</li>
                <li>· Give it 8–12 weeks before evaluating subjective effects</li>
                <li>· Source third-party-tested trans-resveratrol specifically (not the cis isomer, which is far less active)</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Antiplatelet activity — stop at least two weeks before any scheduled surgery</li>
                <li>· Caution if on blood thinners (warfarin, aspirin, clopidogrel) — discuss with your physician first</li>
                <li>· May interact with drugs metabolized by certain CYP enzymes</li>
                <li>· Not established as safe in pregnancy or nursing — avoid</li>
                <li>· Do not treat the NMN + resveratrol stack as clinically proven — it is a reasoned combination, not a tested one</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Resveratrol Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Activity,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Allosteric SIRT1 Activation',
                body: "Resveratrol binds SIRT1 at a site distinct from its catalytic pocket, inducing a conformational change that increases SIRT1's affinity for acetylated substrates by roughly 8–13×. This mimics caloric restriction: SIRT1 deacetylates PGC-1α (mitochondrial biogenesis), FOXO3a (antioxidant defense and autophagy genes), and NF-κB/RelA (suppressing inflammatory gene expression).",
              },
              {
                icon: Zap,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'AMPK Activation via CAMKK2',
                body: 'Independent of the SIRT1 pathway, resveratrol activates AMPK through CAMKK2 signaling — adding a second mechanism for mTOR suppression and autophagy induction. This dual SIRT1/AMPK action is why resveratrol is often framed as a caloric-restriction mimetic rather than a single-pathway compound.',
              },
              {
                icon: TrendingUp,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Bioavailability Bottleneck',
                body: 'Glucuronidation in the intestinal wall limits standard-powder bioavailability to roughly 1%. This is the central practical challenge with resveratrol supplementation — the mechanism is compelling, but getting an effective dose into circulation requires a formulation built to work around first-pass metabolism.',
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

      {/* Hallmarks of Aging */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Resveratrol Addresses the Hallmarks of Aging</h2>
          <p className="text-body mb-8 max-w-2xl">
            Resveratrol&rsquo;s SIRT1/AMPK mechanism maps onto three of the twelve Hallmarks of Aging. The mechanistic rationale below is well-established biochemistry; treat the human-outcome strength as separate from the mechanism itself.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Mitochondrial Dysfunction',
                body: 'SIRT1-mediated deacetylation of PGC-1α is the master switch for mitochondrial biogenesis. Combined with independent AMPK activation via CAMKK2, resveratrol\'s mechanism supports both making more mitochondria and improving the metabolic efficiency of existing ones — the well-established rationale behind its caloric-restriction-mimetic reputation.',
                href: '/library/mitochondrial-dysfunction',
                label: 'Mitochondrial Dysfunction hallmark',
              },
              {
                icon: ShieldCheck,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Chronic Inflammation',
                body: 'SIRT1 deacetylates the RelA subunit of NF-κB, the master transcription factor driving inflammatory gene expression. By suppressing NF-κB activity, resveratrol\'s mechanism provides a plausible route to dampening low-grade chronic inflammation ("inflammaging") — a mechanistic pathway, not a human-outcome-trial finding for resveratrol specifically.',
                href: '/library/chronic-inflammation',
                label: 'Chronic Inflammation hallmark',
              },
              {
                icon: Dna,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Cellular Senescence',
                body: 'FOXO3a activation via SIRT1 deacetylation switches on autophagy and antioxidant-defense genes, both of which are mechanistically linked to reducing the accumulation of dysfunctional, senescence-prone cells. This is an extrapolated mechanistic connection — there is no dedicated senescence-clearance trial for resveratrol in humans.',
                href: '/library/cellular-senescence',
                label: 'Cellular Senescence hallmark',
              },
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border p-5 ${card.badge} bg-card/50 flex flex-col`}>
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border mb-3 ${card.badge}`}>
                  <card.icon className={`w-4.5 h-4.5 ${card.color}`} aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{card.body}</p>
                <Link href={card.href} className={`text-xs font-mono inline-flex items-center gap-1 ${card.color} hover:underline`}>
                  {card.label} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
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
                title: 'Choose a bioavailable formulation first',
                body: 'Standard resveratrol powder loses roughly 99% of its dose to intestinal glucuronidation. Micronized or liposomal trans-resveratrol achieves 3–5× higher plasma concentration for the same milligram amount — this decision matters more than the exact dose you pick.',
              },
              {
                n: '02',
                title: 'Check bleeding risk and interactions',
                body: 'Resveratrol has antiplatelet activity. If you take blood thinners, have surgery scheduled within two weeks, or take medications with CYP-mediated metabolism, talk to your physician before starting.',
              },
              {
                n: '03',
                title: 'Start at 150mg in the evening with food',
                body: 'Take your first dose with a fat-containing dinner. Evening dosing is preferred because SIRT1 expression follows a circadian rhythm that peaks later in the day.',
              },
              {
                n: '04',
                title: 'Titrate to 300–500mg if well tolerated',
                body: 'After one to two weeks without GI discomfort, move toward the upper end of the 150–500mg range for a stronger SIRT1-activation signal — still in the evening, still with food.',
              },
              {
                n: '05',
                title: 'Consider the NMN pairing, with realistic expectations',
                body: "If building a sirtuin-focused stack, NMN in the morning plus resveratrol in the evening is the standard TNiC pairing. Remember: the mechanistic case is strong (more substrate, more affinity for that substrate), but this specific combination hasn't been validated in a dedicated human RCT. Track your own biomarkers rather than assuming a guaranteed effect.",
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
          <h2 className="heading-section mb-8">Resveratrol FAQ</h2>
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
                  Resveratrol has documented antiplatelet activity. If you take blood thinners, have a bleeding disorder, or have surgery scheduled, talk to your physician before starting — and stop at least two weeks before any procedure. TNiC content is educational and not a substitute for medical advice.
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
            <h2 className="heading-section mb-3">Build Your Sirtuin Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Resveratrol pairs with NMN and Ca-AKG in TNiC&rsquo;s SIRT1-focused presets. Take the quiz to get a personalized protocol.
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
                href="/library/compare/resveratrol-vs-pterostilbene"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Resveratrol vs Pterostilbene
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/nmn"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                NMN compound deep-dive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/cakg"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
              >
                Ca-AKG compound deep-dive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Educational content only — not medical advice. Resveratrol is a dietary supplement, not FDA-approved to treat or prevent any disease. The Baur 2006 findings are from an animal study; no human longevity-outcome trial exists for resveratrol as of 2026. Consult your physician before starting, especially if you take blood thinners or have surgery scheduled.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
