import Link from 'next/link';
import {
  ArrowRight,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Recycle,
  GitCompare,
  Leaf,
  Zap,
  Scale,
  Heart,
} from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Urolithin A Supplement Guide 2026 — Mitopure Dosage, Evidence & Mitophagy Explained',
  description:
    "Complete urolithin A guide: what the Andreux 2019 and Singh 2022 human trials actually show about mitophagy, muscle strength, and mitochondrial health. Dosing protocol, Urolithin A vs CoQ10, and the gut-conversion problem it's designed to solve.",
  path: '/urolithin-a-supplement-guide',
  keywords: [
    'urolithin a supplement guide',
    'urolithin a dosage',
    'urolithin a vs coq10',
    'mitopure review',
    'urolithin a mitophagy',
    'urolithin a clinical trial',
    'urolithin a side effects',
    'best urolithin a supplement 2026',
    'urolithin a muscle strength',
    'urolithin a bioavailability',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Mitochondrial & cellular health signature (muscle, humans)',
    finding:
      'First human clinical evidence that an oral compound induces a molecular signature of improved mitochondrial and cellular health in skeletal muscle of older/middle-aged adults. This was a safety and biomarker-signature trial — not a muscle-strength outcome study.',
    quality: 'Strong',
    pmid: '32694802',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Muscle strength & exercise performance (humans)',
    finding:
      'Randomized, placebo-controlled trial in middle-aged adults reporting improved muscle strength and exercise performance alongside favorable biomarkers of mitochondrial health versus placebo — the first urolithin A trial with genuine functional outcomes, not just biomarkers.',
    quality: 'Strong',
    pmid: '35584623',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Safety & tolerability (humans)',
    finding:
      'The 2019 human safety trial found oral urolithin A well tolerated across the doses tested, with no serious treatment-related adverse events reported versus placebo.',
    quality: 'Strong',
    pmid: '32694802',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Mitophagy induction & lifespan (preclinical)',
    finding:
      'In C. elegans, urolithin A induced mitophagy and extended lifespan; in rodents it increased muscle function. This is worm and rodent mechanistic evidence establishing the pathway — it is not human outcome data.',
    quality: 'Preclinical only',
    pmid: '27400265',
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    endpoint: 'Natural gut conversion vs. direct supplementation',
    finding:
      'Only an estimated 30–40% of adults carry gut microbiota capable of converting dietary ellagitannins (from pomegranate, walnuts) into urolithin A themselves. This variability — not a deficiency in the ellagitannin-rich foods themselves — is the core rationale for supplementing the metabolite directly.',
    quality: 'Established mechanism',
    pmid: undefined,
    color: 'text-accent-violet',
    badge: 'bg-accent-violet/10 border-accent-violet/20',
  },
];

const FAQ = [
  {
    q: "Is 'Mitopure' just a marketing name, or does it matter which form I take?",
    a: 'It genuinely matters here. Mitopure is the standardized, purified urolithin A form manufactured by Amazentis — and it is the exact form used in both human clinical trials (Andreux 2019, PMID 32694802; Singh 2022, PMID 35584623). Mentioning it isn\'t an endorsement of any specific retailer; it\'s a factual statement that the clinical evidence for urolithin A was generated using this standardized ingredient, not an arbitrary pomegranate extract with unverified urolithin A content. If you buy a non-standardized "pomegranate ellagitannin" product instead, you are no longer working from the same evidence base.',
  },
  {
    q: 'What is actually different between the two human urolithin A studies?',
    a: "The 2019 Andreux trial (PMID 32694802) was primarily a safety and pharmacology study: it confirmed urolithin A is well tolerated and showed a molecular signature consistent with improved mitochondrial function in muscle tissue — but it did not measure strength or performance outcomes. The 2022 Singh trial (PMID 35584623) is the one with real functional endpoints: a randomized, placebo-controlled design in middle-aged adults that found improvements in muscle strength and exercise performance alongside favorable mitochondrial biomarkers. Together they answer two different questions — 'is it safe and does it do something at the molecular level' and 'does that translate into a measurable functional benefit' — and both came back positive, which is unusually clean for a supplement.",
  },
  {
    q: 'Does the C. elegans and rodent lifespan data apply to humans?',
    a: "Not directly, and it shouldn't be presented that way. The Ryu 2016 paper (PMID 27400265) is preclinical: it showed urolithin A induces mitophagy and extends lifespan in C. elegans and improves muscle function in rodents. That's the mechanistic discovery paper — it established the PINK1/Parkin mitophagy pathway as the reason urolithin A might matter for human aging, which the two later human trials then went on to test directly in people. Worm lifespan extension is not evidence of human lifespan extension; treat it as the mechanistic origin story, not a human result.",
  },
  {
    q: 'Should I just eat more pomegranates and walnuts instead of supplementing?',
    a: "You can, but it may not work the way you'd expect. Urolithin A isn't present in pomegranates or walnuts directly — it's produced when your gut bacteria metabolize the ellagitannins those foods contain. Only an estimated 30–40% of adults carry the specific gut microbiota needed to make that conversion efficiently. If you're not a 'producer,' eating ellagitannin-rich foods may deliver little to no urolithin A regardless of quantity. Direct supplementation with a standardized urolithin A product bypasses this variability entirely — which is precisely why the clinical trials dosed the metabolite itself rather than pomegranate extract.",
  },
  {
    q: 'How does urolithin A compare to CoQ10 for mitochondrial health?',
    a: "They target different parts of the same problem. CoQ10 supports the electron transport chain directly — it's a cofactor mitochondria need to generate ATP, and levels decline with age and statin use. Urolithin A doesn't power up existing mitochondria; it triggers mitophagy, the selective removal of damaged mitochondria, which is a prerequisite for healthy mitochondrial turnover. See our full breakdown at Urolithin A vs CoQ10 for the complete mechanism-by-mechanism comparison — the honest answer is that these are complementary strategies, not competing ones.",
  },
  {
    q: 'Can I stack urolithin A with NMN or spermidine?',
    a: 'Yes — these are frequently stacked because they act on distinct but related pathways. NMN raises NAD+ availability, which supports the sirtuin and PARP pathways involved in cellular energy metabolism and DNA repair. Spermidine independently triggers autophagic flux via EP300 inhibition, working further upstream of general cellular cleanup than urolithin A\'s mitochondria-specific mitophagy. None of the three studies cited here tested a combination directly, so the synergy rationale is mechanistic rather than clinically proven as a stack — but the three pathways do not appear to compete with or cancel each other out.',
  },
  {
    q: 'What are the safety considerations and who should be cautious?',
    a: 'Both human trials to date found urolithin A well tolerated, with no dedicated population identified where it should be avoided outright. That said, if you are pregnant or nursing, undergoing active cancer treatment, or taking immunomodulating therapy, talk to your physician before starting — mitophagy and cellular clearance pathways can intersect with treatments that rely on modulating cell survival, and none of the existing trials specifically enrolled these populations. As always, this is educational content, not a substitute for individualized medical advice.',
  },
];

function buildUrolithinASchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Urolithin A Supplement Protocol',
    description:
      'Evidence-based protocol for starting urolithin A (Mitopure-standardized) supplementation for mitochondrial health, based on the Andreux 2019 safety trial and the Singh 2022 randomized functional-outcomes trial.',
    path: '/urolithin-a-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Choose a Mitopure-standardized product',
        text: 'The human trials used purified, standardized urolithin A (Mitopure), not raw pomegranate or walnut extract. Confirm the product specifies a standardized urolithin A content — this is what connects your supplement to the actual clinical evidence.',
      },
      {
        name: 'Start at 500mg once daily in the morning',
        text: 'Take with a meal that contains some fat — absorption of urolithin A, like other fat-soluble mitochondrial compounds, is improved with food rather than on an empty stomach.',
      },
      {
        name: 'Maintain consistent daily dosing',
        text: 'Both human trials used sustained daily dosing over several months, not occasional or pulsed use. Consistency matters more than timing precision for this compound.',
      },
      {
        name: 'Consider titrating toward 1000mg/day',
        text: 'The evidence-supported dose range spans 500–1000mg/day. Some people increase toward the upper end of this range, particularly during periods of higher training load, though the core functional-outcomes trial demonstrated benefit within this same range.',
      },
      {
        name: 'Reassess at several months using strength or performance markers',
        text: 'Because the human evidence for functional benefit (muscle strength, exercise performance) came from a multi-month trial, evaluate your own response over a comparable timeframe rather than expecting a rapid or acute effect.',
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
    headline: 'Urolithin A Supplement Guide 2026 — Mitopure Dosage, Evidence & Mitophagy Explained',
    description:
      'Complete evidence guide to urolithin A: mitophagy mechanism, the two human clinical trials, comparison to CoQ10, correct dosing, and the gut-conversion bioavailability problem direct supplementation solves.',
    url: `${SITE.url}/urolithin-a-supplement-guide`,
    dateModified: '2026-07-14',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      {
        '@type': 'MedicalSubstance',
        name: 'Urolithin A',
        description: 'Gut-derived ellagitannin metabolite; mitophagy activator acting via the PINK1/Parkin axis',
      },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'The mitophagy activator urolithin A is safe and induces a molecular signature of improved mitochondrial and cellular health in humans',
        author: 'Andreux PA et al.',
        datePublished: '2019',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '32694802' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/32694802/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Urolithin A improves muscle strength, exercise performance, and biomarkers of mitochondrial health in a randomized trial in middle-aged adults',
        author: 'Singh NA et al.',
        datePublished: '2022',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '35584623' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/35584623/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Urolithin A induces mitophagy and prolongs lifespan in C. elegans and increases muscle function in rodents',
        author: 'Ryu D et al.',
        datePublished: '2016',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '27400265' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/27400265/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Urolithin A Supplement Guide', path: '/urolithin-a-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function UrolithinAGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildUrolithinASchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-violet" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-violet uppercase tracking-wider">Evidence Tier A (Mitochondrial) · Urolithin A</span>
          </div>

          <h1 className="heading-hero mb-4">
            Urolithin A Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Urolithin A is the first orally administered compound shown, in a human trial, to trigger a molecular signature of improved mitochondrial health. Here is exactly what the two human studies found, what the worm and rodent data does and doesn&rsquo;t tell us, and why most adults can&rsquo;t make enough of it on their own.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '45%', label: 'Bioavailability', color: 'text-accent-emerald' },
              { value: '500–1000mg', label: 'Evidence dose (Mitopure)', color: 'text-accent-violet' },
              { value: 'Tier A', label: 'Mitochondrial evidence', color: 'text-accent-cyan' },
              { value: '30–40%', label: 'Adults who convert it naturally', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/urolithina"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-violet text-bg-base font-semibold text-sm hover:bg-accent-violet/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/urolithina-vs-coq10"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
            >
              Urolithin A vs CoQ10
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check / context section */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Urolithin A vs CoQ10 — Two Different Mitochondrial Strategies</h2>
          <p className="text-body mb-6 max-w-2xl">
            Both compounds get marketed under the same &ldquo;mitochondrial support&rdquo; banner, which obscures how differently they actually work. Here is the honest breakdown.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-violet">UROLITHIN A</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">COQ10</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Core mechanism',
                    ua: 'Induces mitophagy — clears damaged mitochondria via PINK1/Parkin',
                    coq10: 'Electron transport chain cofactor — supports ATP synthesis in existing mitochondria',
                    winner: 'different',
                  },
                  {
                    metric: 'What it targets',
                    ua: 'Mitochondrial quality control and turnover',
                    coq10: 'Mitochondrial energy output and antioxidant buffering',
                    winner: 'different',
                  },
                  {
                    metric: 'Strongest human evidence',
                    ua: 'RCT with muscle strength & exercise performance outcomes (PMID 35584623)',
                    coq10: 'Long-established cofactor supplementation, especially for statin-depleted CoQ10',
                    winner: 'tie',
                  },
                  {
                    metric: 'Bioavailability challenge',
                    ua: '~45%; only 30–40% of adults convert dietary precursors themselves',
                    coq10: 'Historically poor for ubiquinone; ubiquinol form improves absorption',
                    winner: 'tie',
                  },
                  {
                    metric: 'Evidence dose',
                    ua: '500–1000mg/day (Mitopure standardized)',
                    coq10: 'Typically 100–300mg/day (ubiquinol or ubiquinone)',
                    winner: 'different',
                  },
                  {
                    metric: 'Best paired with',
                    ua: 'NMN, spermidine — upstream/downstream cellular cleanup and energy pathways',
                    coq10: 'R-ALA — recycles CoQ10 in situ, extending its antioxidant activity',
                    winner: 'different',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className="p-4 text-xs text-muted-foreground">{row.ua}</td>
                    <td className="p-4 text-xs text-muted-foreground">{row.coq10}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The verdict</p>
            <p className="text-sm text-muted-foreground">
              This isn&rsquo;t a competition — it&rsquo;s a division of labor. CoQ10 keeps existing mitochondria running efficiently; urolithin A clears out the damaged ones so healthy mitochondrial biogenesis has room to happen. Someone optimizing mitochondrial health broadly has a reasonable case for both, not either/or. See the full mechanism-by-mechanism breakdown at Urolithin A vs CoQ10.
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
            The dose range used across both human trials, adapted into a practical daily protocol.
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
                  { phase: 'Starting dose', dose: '500 mg/day', timing: 'AM, with a fat-containing meal', note: 'Within the studied 500–1000mg range' },
                  { phase: 'Maintenance', dose: '500–1000 mg/day', timing: 'AM, consistent daily use', note: 'Full evidence-supported range' },
                  { phase: 'Evaluation window', dose: 'Unchanged', timing: 'Reassess at several months', note: 'Matches the timeframe of the functional-outcomes trial' },
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
                <li>· Choose a Mitopure-standardized product — the exact form used in both human trials</li>
                <li>· Take with a fat-containing meal to support absorption</li>
                <li>· Dose consistently every day — both trials used sustained daily dosing, not pulsing</li>
                <li>· Treat ellagitannin-rich foods (pomegranate, walnuts) as a complement, not a substitute, given the 30–40% natural-conversion issue</li>
                <li>· Give it several months before judging response — the functional-outcomes trial ran over a multi-month period</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Consult a physician first if pregnant or nursing — not specifically studied in these populations</li>
                <li>· Consult a physician if undergoing active cancer treatment — mitophagy pathways can intersect with cell-survival mechanisms relevant to treatment</li>
                <li>· Consult a physician if taking immunomodulating therapy</li>
                <li>· No dedicated drug-interaction studies exist yet — flag it to your pharmacist if you take multiple prescriptions</li>
                <li>· Not a substitute for addressing underlying metabolic or cardiovascular risk factors</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Urolithin A Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Recycle,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'PINK1/Parkin-Mediated Mitophagy',
                body: 'Urolithin A activates the PINK1/Parkin axis, the cell\'s quality-control system for identifying and selectively degrading damaged mitochondria. This is mitophagy — a specialized, targeted form of autophagy focused specifically on the mitochondrial network rather than general cellular debris.',
              },
              {
                icon: GitCompare,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Independent of AMPK and mTOR',
                body: 'Unlike many longevity compounds that route through AMPK activation or mTOR inhibition, urolithin A triggers mitophagy through a distinct pathway. This matters practically: it means urolithin A\'s mechanism does not directly overlap with compounds like berberine or metformin, making mechanistic redundancy less of a concern when stacking.',
              },
              {
                icon: Leaf,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Gut-Derived Metabolite, Standardized Dosing',
                body: 'Urolithin A is naturally produced by gut bacteria metabolizing ellagitannins from pomegranate and walnuts — but only in adults whose microbiome supports the conversion. Supplementing with a standardized form (Mitopure, the form used in both human trials) delivers a consistent dose regardless of your personal gut-microbiome profile.',
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

          <div className="mt-8 rounded-xl border border-border/60 bg-card/50 p-5">
            <p className="font-semibold text-sm mb-3">Common stacking pairs</p>
            <p className="text-sm text-muted-foreground mb-4">
              Because mitophagy sits mechanistically apart from NAD+ and general-autophagy pathways, urolithin A is frequently combined with compounds that act earlier or later in cellular energy maintenance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/library/compounds/nmn"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card text-sm font-medium hover:border-accent-violet/30 transition"
              >
                NMN
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/spermidine"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card text-sm font-medium hover:border-accent-violet/30 transition"
              >
                Spermidine
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hallmarks of Aging */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Urolithin A Addresses the Hallmarks of Aging</h2>
          <p className="text-body mb-8 max-w-2xl">
            Urolithin A&rsquo;s mitophagy mechanism maps onto three of the twelve recognized hallmarks of aging. The first is directly supported by human trial data; the other two follow from the same underlying mechanism.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Mitochondrial Dysfunction',
                href: '/library/mitochondrial-dysfunction',
                body: 'This is the hallmark urolithin A targets most directly. Removing damaged mitochondria via mitophagy is the mechanistic basis for the improved mitochondrial-health signature and functional outcomes seen in the two human trials.',
              },
              {
                icon: Scale,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Disabled Autophagy',
                href: '/library/disabled-autophagy',
                body: 'Mitophagy is a specialized subtype of autophagy. As general autophagic capacity declines with age, urolithin A\'s ability to selectively activate this specific arm of the cleanup machinery is mechanistically relevant to restoring autophagic flux, at least within the mitochondrial compartment.',
              },
              {
                icon: Heart,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Cellular Senescence',
                href: '/library/cellular-senescence',
                body: 'Damaged, dysfunctional mitochondria are a known contributor to the senescent cell phenotype. Clearing them via mitophagy is a plausible mechanistic route to reducing this contribution — this is mechanistic rationale, not a claim that either human trial directly measured senescence markers.',
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`focus-ring interactive rounded-xl border p-5 ${card.badge} bg-card/50 block hover:border-opacity-60 transition`}
              >
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border mb-3 ${card.badge}`}>
                  <card.icon className={`w-4.5 h-4.5 ${card.color}`} aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{card.body}</p>
                <span className={`text-xs font-mono inline-flex items-center gap-1 ${card.color}`}>
                  View hallmark <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </Link>
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
                title: 'Choose a Mitopure-standardized product',
                body: 'Both human trials used purified, standardized urolithin A (Mitopure) — not raw pomegranate extract, and not a product with unverified urolithin A content. Confirm the label specifies a standardized dose before you buy.',
              },
              {
                n: '02',
                title: 'Start at 500mg once daily in the morning',
                body: 'Take it with a meal containing some fat. This falls at the lower end of the evidence-supported 500–1000mg range and matches the general timing pattern used in the clinical trials.',
              },
              {
                n: '03',
                title: 'Dose consistently — every day, not pulsed',
                body: 'Unlike some senolytics that use intermittent pulse dosing, urolithin A\'s trials used sustained daily use. Consistency over time is what the evidence supports.',
              },
              {
                n: '04',
                title: 'Consider titrating toward 1000mg/day',
                body: 'The full evidence-supported range spans 500–1000mg/day. Some people move toward the higher end, particularly during periods of higher physical training load.',
              },
              {
                n: '05',
                title: 'Reassess at several months using strength or performance markers',
                body: "Because the human functional-outcomes evidence (muscle strength, exercise performance) emerged over a multi-month randomized trial, give your own protocol a comparable window before deciding whether it's working for you.",
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
          <h2 className="heading-section mb-8">Urolithin A FAQ</h2>
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
                  Urolithin A has been well tolerated in the human trials conducted to date, with no dedicated population identified where it must be avoided outright. Still, if you are pregnant or nursing, undergoing active cancer treatment, or taking immunomodulating therapy, talk to your physician before starting — these populations were not specifically studied. TNiC content is educational and not a substitute for medical advice.
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
            <h2 className="heading-section mb-3">Build Your Mitochondrial Health Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Urolithin A pairs naturally with NMN and spermidine in TNiC&rsquo;s mitochondrial-health protocols. Take the quiz to get a personalized stack.
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
                href="/library/compare/urolithina-vs-coq10"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Urolithin A vs CoQ10
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/urolithina"
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
            Educational content only — not medical advice. Urolithin A is a dietary supplement, not FDA-approved to treat or prevent any disease. Consult your physician before starting, especially if pregnant, nursing, undergoing active cancer treatment, or taking immunomodulating therapy.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
