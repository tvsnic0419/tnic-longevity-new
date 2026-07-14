import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, TrendingUp, Zap, CheckCircle2, AlertTriangle, ExternalLink, Activity, Dna, Sprout } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Ca-AKG Supplement Guide 2026 — Dosage, Mouse Lifespan Data & the Human Epigenetic-Age Reality Check',
  description:
    'Complete Ca-AKG (calcium alpha-ketoglutarate) guide: the Cell Metabolism 2020 mouse lifespan study, the TCA-cycle and TET/JMJD dioxygenase mechanism, dosing protocol, and an honest look at the registered human ABLE trial — protocol published, results not yet available.',
  path: '/ca-akg-supplement-guide',
  keywords: [
    'ca-akg supplement guide',
    'calcium alpha-ketoglutarate',
    'ca-akg dosage',
    'ca-akg vs spermidine',
    'alpha-ketoglutarate longevity',
    'ca-akg epigenetic age',
    'able trial ca-akg',
    'ca-akg mouse lifespan study',
    'ca-akg side effects',
    'best ca-akg supplement 2026',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Median lifespan extension (mice)',
    finding:
      'Ca-AKG supplementation extended median lifespan by 12–14% in aged mice, attributed to increased TCA cycle carbon flux and restored dioxygenase (TET/JMJD) cofactor supply. This is a real, verified rodent lifespan-extension finding — one of the stronger single-compound datasets in this library.',
    quality: 'Strong (animal)',
    pmid: '32877690',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Morbidity compression (mice)',
    finding:
      'The same study reported compressed morbidity alongside the lifespan gain — treated mice spent a smaller share of their remaining life in visibly declining health, not just a marginal extension of lifespan at the end.',
    quality: 'Strong (animal)',
    pmid: '32877690',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'TCA cycle & dioxygenase cofactor mechanism',
    finding:
      'Well-characterized biochemistry underlying the mouse result: AKG is generated from isocitrate by isocitrate dehydrogenase and is an obligate cofactor for the TET1/2/3, PHD1/2/3, and JMJD dioxygenase families. This mechanism — not marketing language — is what motivates the lifespan and morbidity findings above.',
    quality: 'Established biochemistry',
    pmid: '32877690',
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'Collagen synthesis (prolyl hydroxylase cofactor)',
    finding:
      'AKG also serves as the required cofactor for prolyl hydroxylase, the enzyme that stabilizes collagen\'s triple helix — a plausible mechanistic link to connective-tissue integrity discussed alongside the lifespan findings, though no dedicated human collagen-outcome trial exists for Ca-AKG specifically.',
    quality: 'Mechanistic (animal)',
    pmid: '32877690',
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'Human epigenetic / biological age reduction',
    finding:
      'No published human trial establishes this. A registered protocol — the ABLE trial — is testing whether Ca-AKG slows epigenetic aging in humans; the protocol was published in GeroScience in 2023, but results have not been reported as of this writing. Treat any specific "years younger" figure attached to Ca-AKG as unverified until a results paper exists.',
    quality: 'Protocol registered — no results yet',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    endpoint: 'Human efficacy / dose-ranging RCT',
    finding:
      'No large dedicated human efficacy RCT for longevity endpoints has been published for Ca-AKG. The calcium-salt bioavailability advantage (88% vs. lower absorption for the free acid) is pharmacology and formulation data, not a clinical-trial finding.',
    quality: 'Not established',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
];

const FAQ = [
  {
    q: 'Does Ca-AKG actually reduce human epigenetic or biological age?',
    a: 'Not according to any published human trial. The widely cited mouse study (Asadi Shahmirzadi A et al., 2020, Cell Metabolism, PMID 32877690) found a real 12–14% median lifespan extension and compressed morbidity in aged mice — genuinely one of the stronger single-compound rodent longevity datasets available. But that is a mouse study. In humans, a registered trial called the ABLE trial has a published protocol (GeroScience, 2023) specifically designed to test whether Ca-AKG slows epigenetic aging — and as of this writing, no results have been published. Any specific figure claiming Ca-AKG "reduces epigenetic age by X years" in humans is not supported by a real, checkable citation. Treat it as unverified.',
  },
  {
    q: 'What is the ABLE trial, exactly?',
    a: 'The ABLE trial is a registered human randomized controlled trial designed to test whether Ca-AKG supplementation slows epigenetic aging, as measured by a DNA-methylation clock. Its protocol was published in the journal GeroScience in 2023. A published protocol means the trial design, endpoints, and methodology have been peer-reviewed and registered — it does not mean the trial has finished or reported results. Until a results paper is published, the human epigenetic-age question for Ca-AKG is open, not answered.',
  },
  {
    q: 'What is the correct Ca-AKG dosage?',
    a: 'The commonly used consumer range is 1–2g of Ca-AKG per day, taken in the morning on an empty stomach — ideally 30–60 minutes before breakfast or any protein-containing meal. This timing is not drawn from a dedicated human dose-ranging RCT (none has been published); it follows from AKG\'s biochemistry, since dietary protein supplies competing carbon sources that reduce AKG absorption.',
  },
  {
    q: 'Why does Ca-AKG need to be taken fasted?',
    a: 'AKG shares uptake and metabolic handling with amino acids and other carbon sources supplied by protein-rich meals. Taking Ca-AKG with or shortly after a high-protein meal means it is competing with dietary amino acids for the same transporters and metabolic pathways, which reduces how much reaches systemic circulation intact. Taking it fasted, away from protein, is the standard practical workaround — an AM, empty-stomach dose is the most common protocol for this reason.',
  },
  {
    q: 'Ca-AKG or spermidine — which should I take first?',
    a: "They target different hallmarks and are not mutually exclusive. Ca-AKG's strongest evidence is a real mouse lifespan-extension and morbidity-compression finding tied to TCA cycle and dioxygenase cofactor mechanisms; its human epigenetic-age case is mechanistically plausible but not yet confirmed (the ABLE trial is pending). Spermidine's mechanism is more direct — EP300 inhibition triggers autophagy at low milligram doses — and it has its own separate human evidence base. If epigenetic and mitochondrial support is the priority, start with Ca-AKG; if autophagy and proteostasis is the priority, start with spermidine. See the full head-to-head comparison for the complete breakdown.",
  },
  {
    q: 'What are the main Ca-AKG side effects and safety considerations?',
    a: "Ca-AKG is generally well tolerated in the 1–2g/day range; mild GI effects (bloating, loose stool) are the most commonly reported issue, particularly toward the top of the dose range. Because it is a calcium salt, it contributes elemental calcium — factor this in if you take separate calcium supplements, and discuss with your physician if you have a history of kidney stones or kidney disease. It has not been established as safe in pregnancy or nursing. This is educational content, not medical advice.",
  },
  {
    q: 'Can I stack Ca-AKG with NMN or resveratrol?',
    a: "Yes — Ca-AKG is a component in TNiC's mitochondrial-focused presets alongside NMN and resveratrol. The stacking logic is coherent: Ca-AKG restores TCA cycle and dioxygenase cofactor supply, NMN restores the NAD+ substrate pool, and resveratrol increases SIRT1's affinity for that NAD+. None of these three together have been tested in a dedicated combined-outcome human RCT — treat the stack as mechanistically reasoned, not clinically proven as a combination.",
  },
];

function buildCaAkgSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Ca-AKG Supplement Protocol Safely',
    description:
      'Evidence-based protocol for starting Ca-AKG (calcium alpha-ketoglutarate) supplementation, grounded in the mechanistic rationale and mouse lifespan data from the Asadi Shahmirzadi 2020 Cell Metabolism study, with an honest accounting of the pending human ABLE trial.',
    path: '/ca-akg-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: "Confirm there's no reason to avoid calcium loading",
        text: 'Ca-AKG delivers elemental calcium alongside the AKG itself. If you have a history of kidney stones, take other calcium supplements, or have kidney disease, talk to your physician before starting — this is the most commonly overlooked safety check for this specific compound.',
      },
      {
        name: 'Start at 1g once daily, fasted',
        text: 'Take your first dose in the morning, at least 30–60 minutes before breakfast or any protein-containing food. This establishes a tolerance baseline before increasing the dose.',
      },
      {
        name: 'Titrate to 1–2g/day, still fasted',
        text: 'After about a week without GI discomfort, move toward the 1–2g range used in most longevity-retail formulations. Keep the fasted, protein-free window — dietary protein provides competing carbon sources that reduce AKG uptake.',
      },
      {
        name: 'Consider pairing with NMN and/or resveratrol',
        text: "Ca-AKG (AM) alongside NMN (AM) and resveratrol (PM) is a reasonable mitochondrial and epigenetic stack on paper. None of these pairings have been tested together in a dedicated human RCT — treat it as informed stacking, not proven combination therapy.",
      },
      {
        name: "Don't expect an epigenetic-age readout to confirm it's working",
        text: "Because no human trial has yet reported an epigenetic-age effect for Ca-AKG, don't use a commercial methylation-clock test as a before/after validation tool for this specific compound. Track standard labs your physician recommends and watch for the ABLE trial's results when they publish.",
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
    headline: 'Ca-AKG Supplement Guide 2026 — Dosage, Mouse Lifespan Data & the Human Epigenetic-Age Reality Check',
    description:
      'Complete evidence guide to Ca-AKG (calcium alpha-ketoglutarate): the Cell Metabolism 2020 mouse lifespan study, TCA cycle and dioxygenase cofactor mechanism, dosing protocol, and the current, honest status of human epigenetic-age evidence (ABLE trial protocol registered, results pending).',
    url: `${SITE.url}/ca-akg-supplement-guide`,
    dateModified: '2026-07-14',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      {
        '@type': 'MedicalSubstance',
        name: 'Ca-AKG (Calcium Alpha-Ketoglutarate)',
        description: 'Calcium salt of the TCA-cycle intermediate alpha-ketoglutarate; dioxygenase (TET/JMJD/PHD) cofactor',
      },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Alpha-Ketoglutarate, an Endogenous Metabolite, Extends Lifespan and Compresses Morbidity in Aging Mice',
        author: 'Asadi Shahmirzadi A et al.',
        datePublished: '2020',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '32877690' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/32877690/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Ca-AKG Supplement Guide', path: '/ca-akg-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function CaAkgGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildCaAkgSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-violet" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-violet uppercase tracking-wider">Evidence Tier B · Ca-AKG (Calcium Alpha-Ketoglutarate)</span>
          </div>

          <h1 className="heading-hero mb-4">
            Ca-AKG Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Ca-AKG has one of the strongest mouse lifespan datasets of any single longevity compound — and one of the most overstated human claims. Here is what the Cell Metabolism 2020 mouse trial actually showed, what the registered human ABLE trial has (and has not) reported, and how to dose Ca-AKG correctly in the meantime.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '12–14%', label: 'Mouse median lifespan gain', color: 'text-accent-emerald' },
              { value: '88%', label: 'Bioavailability (Ca salt)', color: 'text-accent-violet' },
              { value: '1–2 g', label: 'Evidence-informed dose', color: 'text-accent-cyan' },
              { value: 'Tier B', label: 'Evidence tier', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/cakg"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-violet text-bg-base font-semibold text-sm hover:bg-accent-violet/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/cakg-vs-spermidine"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
            >
              Ca-AKG vs Spermidine
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check / comparison */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Ca-AKG vs Spermidine: Epigenetic Substrate vs Autophagy Inducer</h2>
          <p className="text-body mb-6 max-w-2xl">
            Both compounds are frequently mentioned in the same breath as emerging longevity tools with strong preclinical data. They work on entirely different nodes — and the human evidence behind each is at a different stage.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-violet">CA-AKG</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">SPERMIDINE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Core mechanism',
                    cakg: 'TCA cycle carbon backbone + TET/JMJD/PHD dioxygenase cofactor — supplies the substrate DNA-demethylation and histone-modifying enzymes need',
                    sperm: 'EP300 acetyltransferase inhibitor — triggers autophagy flux directly at low milligram doses',
                    winner: 'different',
                  },
                  {
                    metric: 'Best verified evidence',
                    cakg: '12–14% median lifespan extension + compressed morbidity in aged mice (Cell Metab 2020, PMID 32877690)',
                    sperm: 'Separate autophagy-induction and human observational data — see full comparison for citations',
                    winner: 'context',
                  },
                  {
                    metric: 'Human epigenetic/biological-age RCT',
                    cakg: 'None published. Registered protocol (the ABLE trial, GeroScience 2023) is testing this exact question — results pending',
                    sperm: 'Not a direct target of the mechanism; any epigenetic benefit would be indirect, via improved proteostasis',
                    winner: 'context',
                  },
                  {
                    metric: 'mTOR modulation',
                    cakg: 'Strong mTORC1 suppression — AKG competes at the glutamine-sensing node',
                    sperm: 'Indirect, via AMPK-related signaling',
                    winner: 'a',
                  },
                  {
                    metric: 'Autophagy induction',
                    cakg: 'Indirect — via mTOR suppression',
                    sperm: 'Direct — EP300 inhibition at mg-level dosing',
                    winner: 'b',
                  },
                  {
                    metric: 'Typical dosing',
                    cakg: '1–2g Ca-AKG, AM, fasted',
                    sperm: 'Low-milligram range (or dietary wheat germ extract), AM',
                    winner: 'context',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className={`p-4 text-xs ${row.winner === 'a' ? 'text-accent-violet font-semibold' : 'text-muted-foreground'}`}>{row.cakg}</td>
                    <td className={`p-4 text-xs ${row.winner === 'b' ? 'text-accent-cyan font-semibold' : 'text-muted-foreground'}`}>{row.sperm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The honest verdict</p>
            <p className="text-sm text-muted-foreground">
              Ca-AKG&rsquo;s mouse data (Cell Metabolism 2020, PMID 32877690) is genuinely one of the stronger rodent longevity datasets available for any single compound in this library — a real median lifespan extension with compressed morbidity, not just a biomarker shift. What it does not yet have is human confirmation of the claim marketing often implies: that it measurably reduces human epigenetic or biological age. The ABLE trial is specifically designed to test that question and has a public, peer-reviewed protocol, but as of this writing it has not published results. Spermidine, by contrast, leads on mechanistic directness for autophagy and has its own separate human evidence base. See the <Link href="/library/compare/cakg-vs-spermidine" className="text-accent-cyan hover:underline">full Ca-AKG vs Spermidine comparison</Link> for the complete breakdown, including citations.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence table */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Evidence Summary by Endpoint</h2>
          <p className="text-body-sm text-muted-foreground mb-8">
            Click each PMID to view the source study on PubMed. Ca-AKG has exactly one verified landmark citation in this guide — we are deliberately not padding the evidence table with unverifiable claims, especially for the human epigenetic-age endpoint.
          </p>

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
            The commonly used consumer range is 1–2g of Ca-AKG daily, taken fasted in the morning. This timing is drawn from AKG&rsquo;s biochemistry — not from a dedicated human dose-ranging RCT, since none has been published.
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
                  { phase: 'Week 1–2 (ramp)', dose: '1 g/day', timing: 'AM, 30–60 min fasted before breakfast', note: 'Assess GI tolerance before increasing' },
                  { phase: 'Week 3+ (maintenance)', dose: '1–2 g/day', timing: 'AM, fasted', note: 'Matches the range used by longevity-focused retailers such as Do Not Age' },
                  { phase: 'Meal-timing rule', dose: 'Same 1–2 g/day', timing: 'Keep 3+ hours from high-protein meals', note: 'Protein supplies competing carbon sources that reduce AKG uptake' },
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
                <li>· Take fasted, at least 30–60 minutes before any high-protein meal — protein competes with AKG for absorption</li>
                <li>· Start at 1 g/day for the first 1–2 weeks and confirm tolerance before moving to 2 g</li>
                <li>· Choose the calcium salt (Ca-AKG) form over free-acid AKG — meaningfully better oral bioavailability (~88%)</li>
                <li>· Consider pairing with NMN (AM) and/or resveratrol (PM) as a mitochondrial + epigenetic stack — mechanistic rationale, not a tested combined-trial result</li>
                <li>· Track standard labs and how you feel; there is no validated at-home biomarker that confirms an epigenetic effect from Ca-AKG specifically</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Ca-AKG contributes elemental calcium — account for this if you take separate calcium supplements</li>
                <li>· Discuss with your physician first if you have kidney disease or a history of calcium-oxalate kidney stones</li>
                <li>· Not established as safe in pregnancy or nursing</li>
                <li>· No human RCT has demonstrated an epigenetic-age or biological-age benefit — don&rsquo;t let this substitute for evidence-backed interventions elsewhere in your stack</li>
                <li>· Avoid dosing within a few hours of a high-protein meal — it meaningfully blunts absorption per the mechanism above</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Ca-AKG Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Activity,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'TCA Cycle Carbon Backbone',
                body: 'AKG is produced from isocitrate by isocitrate dehydrogenase and feeds forward to succinate via the AKG dehydrogenase complex — a rate-limiting step in mitochondrial respiration. Supplementing AKG directly increases the carbon flux available to the TCA cycle, the core energy-generating pathway inside every mitochondrion.',
              },
              {
                icon: Dna,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Dioxygenase Cofactor: TET, JMJD & PHD Enzymes',
                body: 'AKG is an obligate cofactor for the dioxygenase superfamily: TET1/2/3 enzymes that actively demethylate DNA, JMJD histone demethylases that maintain chromatin state, and PHD1/2/3 enzymes that regulate the HIF-1α hypoxia response. As AKG availability declines with age, this entire enzyme family loses substrate — a proposed contributor to the drift in DNA methylation patterns used to calculate epigenetic clocks.',
              },
              {
                icon: TrendingUp,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Calcium Salt Bioavailability',
                body: 'Free AKG acid is poorly and inconsistently absorbed. Binding it to calcium (Ca-AKG) meaningfully improves oral bioavailability — roughly 88% in the formulations used in longevity retail products — which is why virtually every commercial Ca-AKG product uses the calcium salt rather than the free acid form.',
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
          <h2 className="heading-section mb-3">How Ca-AKG Addresses the Hallmarks of Aging</h2>
          <p className="text-body mb-8 max-w-2xl">
            Ca-AKG&rsquo;s TCA-cycle and dioxygenase-cofactor mechanism maps onto three of the twelve Hallmarks of Aging. As with the rest of this guide: the mechanistic case below is well-established biochemistry, and the human-outcome strength — especially for the epigenetic hallmark — is a separate, much earlier-stage question.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Dna,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Epigenetic Alterations',
                body: "This is Ca-AKG's flagship hallmark. TET1/2/3 enzymes require AKG to actively strip methyl groups from DNA; JMJD enzymes require it to remove repressive histone marks. Both processes decline with age partly because AKG availability declines. The mouse data (Cell Metab 2020) is consistent with this mechanism producing real biological effects, and it's exactly what the registered ABLE trial is designed to test in humans — but no human epigenetic-age result has been published yet. This is the one hallmark where the mechanism is ahead of the evidence.",
                href: '/library/epigenetic-alterations',
                label: 'Epigenetic Alterations hallmark',
              },
              {
                icon: Zap,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Mitochondrial Dysfunction',
                body: "AKG's primary job before any dioxygenase role is TCA cycle fuel. Restoring AKG supply supports mitochondrial respiration directly — the same aged-mouse study that reported the lifespan extension was built on the premise of improving TCA cycle flux in aging tissue. This is the most direct, least speculative mechanism Ca-AKG has.",
                href: '/library/mitochondrial-dysfunction',
                label: 'Mitochondrial Dysfunction hallmark',
              },
              {
                icon: Sprout,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Stem Cell Exhaustion',
                body: 'Dioxygenase cofactor availability — the same TET/JMJD enzymes discussed above — also governs the epigenetic state stem cells rely on to maintain proper differentiation potential and self-renewal capacity. This connection is mechanistic and plausible, extrapolated from the broader AKG-dioxygenase literature rather than demonstrated in a dedicated stem-cell-outcome trial for Ca-AKG.',
                href: '/library/stem-cell-exhaustion',
                label: 'Stem Cell Exhaustion hallmark',
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
                title: "Confirm there's no reason to avoid calcium loading",
                body: 'Ca-AKG delivers elemental calcium alongside the AKG itself. If you have a history of kidney stones, take other calcium supplements, or have kidney disease, talk to your physician before starting — this is the most commonly overlooked safety check for this specific compound.',
              },
              {
                n: '02',
                title: 'Start at 1g once daily, fasted',
                body: 'Take your first dose in the morning, at least 30–60 minutes before breakfast or any protein-containing food. This gives you a baseline read on tolerance before increasing the dose.',
              },
              {
                n: '03',
                title: 'Titrate to 1–2g/day, still fasted',
                body: 'After about a week without GI discomfort, move toward the 1–2g range used in most longevity-retail formulations. Keep the fasted, protein-free window — dietary protein provides competing carbon sources that reduce AKG uptake.',
              },
              {
                n: '04',
                title: 'Consider pairing with NMN and/or resveratrol',
                body: "Ca-AKG (AM) alongside NMN (AM) and resveratrol (PM) is a reasonable mitochondrial and epigenetic stack on paper — AKG feeds TCA flux and dioxygenase cofactor supply, NMN restores the NAD+ pool, resveratrol increases SIRT1's affinity for that NAD+. None of these pairings have been tested together in a dedicated human RCT; treat it as informed stacking, not proven combination therapy.",
              },
              {
                n: '05',
                title: "Don't expect an epigenetic-age readout to confirm it's working",
                body: "Because no human trial has yet reported an epigenetic-age effect for Ca-AKG, don't use a commercial methylation-clock test as a before/after validation tool for this specific compound. Track standard labs your physician recommends, and watch for the ABLE trial's results when they eventually publish.",
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
          <h2 className="heading-section mb-8">Ca-AKG FAQ</h2>
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
                  Ca-AKG (calcium alpha-ketoglutarate) delivers elemental calcium alongside its active AKG component. If you have a history of kidney stones, kidney disease, or already take separate calcium supplementation, talk to your physician before adding Ca-AKG — the combined calcium load is the main safety consideration specific to this compound, not the AKG itself. Ca-AKG is not established as safe in pregnancy or nursing. TNiC content is educational and not a substitute for medical advice.
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
            <h2 className="heading-section mb-3">Build Your Mitochondrial + Epigenetic Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Ca-AKG pairs with NMN and resveratrol in TNiC&rsquo;s mitochondrial-focused presets. Take the quiz to get a personalized protocol.
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
                href="/library/compare/cakg-vs-spermidine"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Ca-AKG vs Spermidine
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/cakg"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Ca-AKG compound deep-dive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/resveratrol-supplement-guide"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
              >
                Resveratrol guide
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Educational content only — not medical advice. Ca-AKG is a dietary supplement, not FDA-approved to treat or prevent any disease. The 12–14% mouse lifespan finding is from an animal study; no human epigenetic-age or biological-age trial has published results for Ca-AKG as of 2026 (the ABLE trial&rsquo;s protocol is registered, but its results are pending). Consult your physician before starting, especially if you have kidney disease, a history of kidney stones, or take other calcium supplements.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
