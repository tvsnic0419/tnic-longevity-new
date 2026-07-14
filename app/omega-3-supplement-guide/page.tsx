import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, TrendingUp, CheckCircle2, AlertTriangle, ExternalLink, HeartPulse, Waves, Network, Timer } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Omega-3 (EPA + DHA) Supplement Guide 2026 — Dosage, REDUCE-IT Evidence & Krill Oil Reality Check',
  description:
    'Complete omega-3 guide: what the REDUCE-IT trial actually showed, EPA vs DHA, specialized pro-resolving mediators, dosing protocol, and whether krill oil is worth the premium over fish oil.',
  path: '/omega-3-supplement-guide',
  keywords: [
    'omega-3 supplement guide',
    'epa dha dosage',
    'omega-3 vs krill oil',
    'reduce-it trial',
    'icosapent ethyl vs fish oil',
    'omega-3 inflammation',
    'omega-3 telomere',
    'fish oil dosage',
    'omega-3 side effects',
    'best omega-3 supplement 2026',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Major adverse cardiovascular events (MACE)',
    finding:
      'The REDUCE-IT trial found 4g/day icosapent ethyl — a purified, prescription EPA-only formulation (brand name Vascepa) — reduced major adverse cardiovascular events by 25% relative risk versus mineral-oil placebo, in high-risk patients with elevated triglycerides already on statin therapy. This is the largest cardiovascular benefit demonstrated for a supplement-derived agent to date, but it used a purified prescription drug, not generic OTC fish oil — do not assume the same magnitude applies to a standard EPA+DHA supplement.',
    quality: 'Strong (RCT, Rx formulation)',
    pmid: '30415628',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Leukocyte telomere length',
    finding:
      'A randomized controlled trial in healthy adults found omega-3 supplementation reduced oxidative stress markers and preserved leukocyte telomere length relative to placebo over the study period.',
    quality: 'Good (RCT)',
    pmid: '23010452',
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'Active inflammation resolution (SPMs)',
    finding:
      'The mechanistic rationale is well-established: EPA and DHA are enzymatic precursors to resolvins, protectins, and maresins — lipid mediators that actively terminate inflammatory cascades rather than just suppressing them. Neither trial cited on this page measured specialized pro-resolving mediator levels as a primary endpoint, so no dedicated citation is given for this mechanism itself.',
    quality: 'Mechanistic',
    pmid: undefined,
    color: 'text-accent-violet',
    badge: 'bg-accent-violet/10 border-accent-violet/20',
  },
  {
    endpoint: 'Generic fish oil vs prescription icosapent ethyl',
    finding:
      'An important caveat, not a separate benefit: REDUCE-IT tested a purified, single-molecule prescription EPA drug at a specific 4g/day dose. Combined EPA+DHA supplements sold over the counter have not been shown to replicate that specific cardiovascular outcome at that magnitude — treat the two as related but distinct interventions.',
    quality: 'Important caveat',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    endpoint: 'Systemic inflammatory marker reduction (general)',
    finding:
      'Omega-3&rsquo;s anti-inflammatory reputation is broad and well established in the literature generally, but neither of the two studies cited on this page reports hs-CRP or IL-6 as a primary outcome, so TNiC does not attach a specific marker-reduction statistic here.',
    quality: 'Established pharmacology (no dedicated PMID here)',
    pmid: undefined,
    color: 'text-accent-violet',
    badge: 'bg-accent-violet/10 border-accent-violet/20',
  },
  {
    endpoint: 'Longevity / lifespan',
    finding:
      'Mechanistic rationale via inflammation resolution and telomere preservation; no dedicated human longevity-extension RCT exists among the studies cited on this page.',
    quality: 'Mechanistic / no direct longevity RCT',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
];

const FAQ = [
  {
    q: 'Does fish oil really reduce heart attack risk, or is that just the Vascepa trial?',
    a: 'The strongest cardiovascular outcome data — the REDUCE-IT trial&rsquo;s 25% relative-risk reduction in major adverse cardiovascular events — comes from icosapent ethyl (Vascepa), a purified, prescription-only, EPA-only drug tested at 4g/day in high-risk patients with elevated triglycerides who were already on statin therapy. That is a meaningfully different product from the combined EPA+DHA fish oil capsules sold over the counter. Generic fish oil has a long track record of triglyceride-lowering and cardiovascular-risk-factor support, but you should not assume it replicates REDUCE-IT&rsquo;s specific 25% MACE reduction — that number belongs to the purified prescription formulation studied in that trial.',
  },
  {
    q: 'What is the difference between EPA and DHA?',
    a: 'Both are omega-3 fatty acids, but they specialize. EPA (eicosapentaenoic acid) is the primary precursor for resolvin-mediated inflammation resolution and competes directly with arachidonic acid for the COX-2 enzyme, producing less-inflammatory prostanoids. DHA (docosahexaenoic acid) is structurally important in neuronal and retinal cell membranes and is also a precursor to protectins and maresins. Most combined supplements provide both because they serve complementary, not redundant, roles.',
  },
  {
    q: 'What is the correct omega-3 dosage?',
    a: 'A reasonable general-health range is 1–2g/day combined EPA+DHA. For a more anti-inflammatory-focused or longevity-oriented protocol, 2–4g/day combined EPA+DHA is a commonly used range in the research literature. Take it with a fat-containing meal — absorption is meaningfully better with dietary fat present, and the triglyceride (re-esterified) form of fish oil generally absorbs better than the ethyl ester form regardless of when you take it.',
  },
  {
    q: 'What are the main omega-3 side effects?',
    a: 'The most common complaints are fishy aftertaste/burps and mild GI upset, both of which are reduced by taking capsules with food or choosing enteric-coated or triglyceride-form products. At higher doses (4g/day range), omega-3s have a mild blood-thinning effect — anyone on anticoagulants or anticipating surgery should discuss this with their physician. Icosapent ethyl specifically carries a small increased risk of atrial fibrillation noted in its prescribing information; this is a consideration for the prescription form, not necessarily generic OTC fish oil at typical consumer doses.',
  },
  {
    q: 'Does omega-3 protect telomeres?',
    a: 'One randomized controlled trial in healthy adults found omega-3 supplementation reduced oxidative stress markers and preserved leukocyte telomere length relative to placebo. That is a genuine, citable finding — but it is a single RCT on a surrogate biomarker (telomere length), not proof that omega-3 extends lifespan or prevents age-related disease. Telomere attrition is one of several recognized hallmarks of aging, which is why this finding is notable, but treat it as one data point rather than a settled outcome.',
  },
  {
    q: 'Can I stack omega-3 with resveratrol or sulforaphane?',
    a: 'Yes — omega-3 is commonly paired with resveratrol and sulforaphane in anti-inflammatory-focused stacks. The mechanisms are complementary rather than redundant: omega-3&rsquo;s resolvins/protectins actively resolve inflammation, resveratrol modulates SIRT1 and NF-κB signaling, and sulforaphane activates the NRF2 antioxidant response pathway. There is no known adverse interaction between these three compounds, though as always, discuss any new supplement combination with your physician if you take prescription medication.',
  },
  {
    q: 'Should I take omega-3 with or without food?',
    a: 'With food, and ideally a meal containing some fat. Absorption of both EPA and DHA improves with dietary fat present, and taking capsules with a meal substantially reduces the fishy burps and GI discomfort some people experience. If you take a higher combined dose (3–4g/day), splitting it across two meals (AM/PM) is a reasonable way to improve tolerability.',
  },
];

function buildOmega3Schemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start an Omega-3 (EPA + DHA) Supplement Protocol Safely',
    description:
      'Evidence-based protocol for starting omega-3 supplementation for cardiovascular risk reduction, inflammation resolution, and telomere preservation, based on the REDUCE-IT trial and a telomere-length RCT.',
    path: '/omega-3-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Determine your risk profile',
        text: 'If you have elevated triglycerides and are already on statin therapy, discuss prescription icosapent ethyl (Vascepa) with your physician — this is the specific formulation and dose studied in the REDUCE-IT cardiovascular outcomes trial. For general health maintenance, an over-the-counter combined EPA+DHA supplement is the appropriate starting point.',
      },
      {
        name: 'Choose triglyceride-form fish oil over ethyl ester',
        text: 'Triglyceride (re-esterified) form fish oil generally achieves superior absorption compared to the ethyl ester form. Check the supplement facts panel — this is usually disclosed on the label.',
      },
      {
        name: 'Start at 1–2g/day combined EPA+DHA with a meal',
        text: 'Take with a fat-containing meal to maximize absorption and minimize fishy aftertaste or GI upset. This is a reasonable general-health starting dose.',
      },
      {
        name: 'Titrate to 2–4g/day for an anti-inflammatory-focused protocol',
        text: 'This range reflects doses commonly used in the inflammation and lipid research literature. Split across AM/PM meals if tolerability is a concern at the higher end.',
      },
      {
        name: 'Reassess periodically with bloodwork',
        text: 'Triglyceride levels and, if accessible, an omega-3 index test can help confirm you are in an evidence-supported response range. If you are on the prescription icosapent ethyl protocol, follow your physician&rsquo;s monitoring schedule.',
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
    headline: 'Omega-3 (EPA + DHA) Supplement Guide 2026 — Dosage, REDUCE-IT Evidence & Krill Oil Reality Check',
    description:
      'Complete evidence guide to omega-3: specialized pro-resolving mediator mechanism, the REDUCE-IT cardiovascular trial, telomere-length RCT data, correct dosing, and fish oil vs krill oil.',
    url: `${SITE.url}/omega-3-supplement-guide`,
    dateModified: '2026-07-14',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      {
        '@type': 'MedicalSubstance',
        name: 'Omega-3 (EPA + DHA)',
        description: 'Long-chain polyunsaturated fatty acids; precursors to specialized pro-resolving inflammatory mediators',
      },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Cardiovascular Risk Reduction with Icosapent Ethyl for Hypertriglyceridemia',
        author: 'Bhatt DL et al.',
        datePublished: '2019',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '30415628' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/30415628/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Omega-3 fatty acids, oxidative stress, and leukocyte telomere length: A randomized controlled trial',
        author: 'Kiecolt-Glaser JK et al.',
        datePublished: '2013',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '23010452' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/23010452/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Omega-3 Supplement Guide', path: '/omega-3-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function Omega3GuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildOmega3Schemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-violet" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-violet uppercase tracking-wider">Evidence Tier A · Omega-3 (EPA + DHA)</span>
          </div>

          <h1 className="heading-hero mb-4">
            Omega-3 (EPA + DHA) Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Omega-3 has the strongest cardiovascular outcome trial of any compound on this site — but that trial used a prescription drug, not the fish oil capsule in your cabinet. Here is what the evidence actually supports, and where the marketing gets ahead of it.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '73%', label: 'Bioavailability', color: 'text-accent-emerald' },
              { value: '−25% MACE', label: 'REDUCE-IT (icosapent ethyl)', color: 'text-accent-violet' },
              { value: '2–4 g/day', label: 'Evidence dose', color: 'text-accent-cyan' },
              { value: 'Tier A', label: 'Overall evidence', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/omega3"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-violet text-bg-base font-semibold text-sm hover:bg-accent-violet/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/omega3-vs-krill-oil"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
            >
              Omega-3 vs Krill Oil
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check: Omega-3 vs Krill Oil */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Omega-3 vs Krill Oil: Does the Bioavailability Premium Pay Off?</h2>
          <p className="text-body mb-6 max-w-2xl">
            Krill oil is marketed as the &ldquo;superior absorption&rdquo; omega-3 source. The absorption edge is real — but so is the price. Here is the honest tradeoff.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-violet">FISH OIL (TRIGLYCERIDE-FORM)</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">KRILL OIL</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Lipid carrier structure',
                    fish: 'Triglyceride form (re-esterified) after processing — good absorption',
                    krill: 'Naturally phospholipid-bound EPA/DHA — reported absorption edge in some studies',
                    winner: 'krill',
                  },
                  {
                    metric: 'EPA + DHA per serving',
                    fish: 'Typically higher total EPA+DHA per dollar and per capsule',
                    krill: 'Typically lower total EPA+DHA per capsule — you need more capsules for an equivalent dose',
                    winner: 'fish',
                  },
                  {
                    metric: 'Cost per gram of EPA+DHA delivered',
                    fish: 'Substantially lower cost per gram of active omega-3',
                    krill: 'Meaningfully higher cost per gram of active omega-3 — the absorption edge comes at a real price premium',
                    winner: 'fish',
                  },
                  {
                    metric: 'Outcome trial evidence',
                    fish: 'The REDUCE-IT cardiovascular outcomes trial used a purified EPA fish-oil-derived drug (icosapent ethyl)',
                    krill: 'No equivalent large cardiovascular outcomes trial exists for krill oil',
                    winner: 'fish',
                  },
                  {
                    metric: 'Fishy aftertaste',
                    fish: 'Present in lower-quality or non-enteric-coated capsules',
                    krill: 'Often reported as milder due to phospholipid structure',
                    winner: 'krill',
                  },
                  {
                    metric: 'Astaxanthin content',
                    fish: 'Not present unless separately added',
                    krill: 'Contains astaxanthin, a carotenoid antioxidant, as a co-occurring compound',
                    winner: 'krill',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className={`p-4 text-xs ${row.winner === 'fish' ? 'text-accent-violet font-semibold' : 'text-muted-foreground'}`}>{row.fish}</td>
                    <td className={`p-4 text-xs ${row.winner === 'krill' ? 'text-accent-cyan font-semibold' : 'text-muted-foreground'}`}>{row.krill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The verdict</p>
            <p className="text-sm text-muted-foreground">
              Krill oil&rsquo;s phospholipid-bound structure does appear to offer an absorption edge in comparative studies, and that is a real, honest advantage. But it typically delivers less EPA+DHA per capsule than triglyceride-form fish oil, at a meaningfully higher cost per gram of active omega-3. For most people prioritizing total EPA+DHA intake per dollar — which is what drove the outcome data in trials like REDUCE-IT — triglyceride-form fish oil is the more evidence-efficient choice. Krill oil is a reasonable pick if the fishy aftertaste of fish oil is a dealbreaker for you, or if you specifically want the co-occurring astaxanthin. See our full <Link href="/library/compare/omega3-vs-krill-oil" className="text-accent-violet hover:underline">Omega-3 vs Krill Oil comparison</Link> for the detailed breakdown.
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
            Dosing ranges span general-health maintenance through the higher, more clinically studied anti-inflammatory range. The prescription REDUCE-IT protocol is listed separately since it requires a physician.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">USE CASE</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">DOSE</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">TIMING</th>
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">NOTE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { use: 'General health maintenance', dose: '1–2g/day combined EPA+DHA', timing: '1× AM with a fat-containing meal', note: 'Reasonable baseline for most adults' },
                  { use: 'Anti-inflammatory / longevity-focused', dose: '2–4g/day combined EPA+DHA', timing: '2× split, AM/PM with meals', note: 'Commonly used research-literature range' },
                  { use: 'Elevated triglycerides + high CV risk (Rx)', dose: '4g/day icosapent ethyl', timing: 'Per physician direction', note: 'REDUCE-IT protocol; prescription only, not OTC fish oil' },
                  { use: 'Form selection', dose: 'Triglyceride-form preferred', timing: 'Consistent daily timing', note: 'Superior absorption vs ethyl ester form' },
                ].map((row) => (
                  <tr key={row.use} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium">{row.use}</td>
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
                <li>· Always take with a fat-containing meal — improves absorption and reduces fishy aftertaste</li>
                <li>· Prefer triglyceride-form (re-esterified) over ethyl ester for better absorption</li>
                <li>· Split higher doses (3g+) into AM/PM to improve tolerability</li>
                <li>· If you have elevated triglycerides and are on a statin, ask your physician about prescription icosapent ethyl</li>
                <li>· Look for third-party purity testing (heavy metals, oxidation/TOTOX value)</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Mild blood-thinning effect at higher doses — discuss with your physician if on anticoagulants or before surgery</li>
                <li>· Icosapent ethyl carries a noted increased atrial fibrillation risk in its prescribing information</li>
                <li>· Do not assume generic fish oil replicates the REDUCE-IT trial&rsquo;s specific cardiovascular outcome</li>
                <li>· Choose reputable brands — fish oil is prone to oxidation (rancidity) if poorly stored or low quality</li>
                <li>· Shellfish-derived krill oil is not appropriate for those with shellfish allergies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Omega-3 Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Waves,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Specialized Pro-resolving Mediators (SPMs)',
                body: 'EPA and DHA are enzymatic precursors to resolvins, protectins, and maresins — lipid mediators that actively terminate inflammatory cascades by clearing cellular debris and reprogramming macrophages from a pro-inflammatory M1 phenotype toward a tissue-repairing M2 phenotype. This is an active resolution process, not passive anti-inflammatory suppression.',
              },
              {
                icon: HeartPulse,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'COX-2 Competition',
                body: 'EPA competes directly with arachidonic acid for the COX-2 enzyme, shifting eicosanoid production toward less-inflammatory prostanoids. This is a distinct mechanism from the SPM resolution pathway and contributes independently to omega-3&rsquo;s anti-inflammatory profile.',
              },
              {
                icon: TrendingUp,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Form Matters for Absorption',
                body: 'Triglyceride-form (re-esterified) fish oil achieves superior absorption compared to the ethyl ester form used in many older or lower-cost products. Since the clinical benefit of omega-3 depends on actually raising tissue EPA/DHA levels, the chemical form you take is not a cosmetic detail — it materially affects how much active compound you absorb per dose.',
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
          <h2 className="heading-section mb-3">How Omega-3 Addresses the Hallmarks of Aging</h2>
          <p className="text-body mb-8 max-w-2xl">
            Omega-3&rsquo;s evidence base maps onto three of the twelve recognized hallmarks of aging — most directly chronic inflammation.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Waves,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Chronic Inflammation',
                body: 'This is omega-3&rsquo;s primary hallmark. The SPM pathway (resolvins, protectins, maresins) actively resolves inflammatory cascades rather than merely suppressing them, and EPA&rsquo;s COX-2 competition independently shifts eicosanoid production toward less-inflammatory prostanoids. This is a well-established mechanistic picture; the two trials cited on this page tested cardiovascular outcomes and telomere length, not inflammatory markers directly.',
                href: '/library/chronic-inflammation',
                label: 'Chronic Inflammation',
              },
              {
                icon: Network,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Altered Intercellular Communication',
                body: 'Resolvins and protectins function as intercellular signaling molecules — they reprogram macrophage phenotype and coordinate tissue-level responses to injury and inflammation. This lipid-mediator signaling system is a clear mechanistic link to the intercellular communication hallmark, though it is described here as established mechanism rather than a claim from either PMID cited on this page.',
                href: '/library/altered-intercellular-communication',
                label: 'Altered Intercellular Communication',
              },
              {
                icon: Timer,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Telomere Attrition',
                body: 'The Kiecolt-Glaser et al. RCT (PMID 23010452) found omega-3 supplementation reduced oxidative stress and preserved leukocyte telomere length versus placebo in healthy adults — one of the more direct human-trial links between a specific supplement and a specific aging biomarker on this entire site.',
                href: '/library/telomere-attrition',
                label: 'Telomere Attrition',
              },
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border p-5 ${card.badge} bg-card/50 flex flex-col`}>
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border mb-3 ${card.badge}`}>
                  <card.icon className={`w-4.5 h-4.5 ${card.color}`} aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{card.body}</p>
                <Link href={card.href} className={`text-xs font-mono inline-flex items-center gap-1 ${card.color} hover:underline`}>
                  Read the hallmark: {card.label}
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
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
                title: 'Determine your risk profile',
                body: 'If you have elevated triglycerides and are already on statin therapy, discuss prescription icosapent ethyl (Vascepa) with your physician — this is the specific formulation and dose studied in the REDUCE-IT cardiovascular outcomes trial. For general health maintenance, an over-the-counter combined EPA+DHA supplement is the right starting point.',
              },
              {
                n: '02',
                title: 'Choose triglyceride-form fish oil over ethyl ester',
                body: 'Check the supplement facts panel — triglyceride (re-esterified) form generally achieves superior absorption compared to ethyl ester form, meaning more of what you swallow actually reaches your tissues.',
              },
              {
                n: '03',
                title: 'Start at 1–2g/day combined EPA+DHA with a meal',
                body: 'Take with a fat-containing meal to maximize absorption and reduce fishy aftertaste or GI upset. This is a reasonable general-health starting point for most adults.',
              },
              {
                n: '04',
                title: 'Titrate to 2–4g/day for an anti-inflammatory-focused protocol',
                body: "This range reflects doses commonly referenced in the inflammation and lipid research literature. Split across AM/PM meals if you're at the higher end of the range.",
              },
              {
                n: '05',
                title: 'Reassess periodically with bloodwork',
                body: 'Triglyceride levels and, where available, an omega-3 index test can help confirm you are in an evidence-supported response range. If you are on the prescription icosapent ethyl protocol, follow your physician&rsquo;s monitoring schedule instead.',
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
          <h2 className="heading-section mb-8">Omega-3 FAQ</h2>
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
                  Omega-3 supplements have a mild blood-thinning effect at higher doses. If you take anticoagulant or antiplatelet medication, or have upcoming surgery, tell your physician before starting or increasing your dose. The prescription formulation icosapent ethyl carries a noted increased atrial fibrillation risk in its prescribing information — this is a physician-managed medication, not an OTC decision. TNiC content is educational and not a substitute for medical advice.
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
            <h2 className="heading-section mb-3">Build Your Anti-Inflammatory Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Omega-3 pairs with resveratrol and sulforaphane in TNiC&rsquo;s anti-inflammatory-focused stacks. Take the quiz to get a personalized protocol.
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
                href="/library/compare/omega3-vs-krill-oil"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Omega-3 vs Krill Oil
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/omega3"
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
            Educational content only — not medical advice. Omega-3 is a dietary supplement, not FDA-approved to treat or prevent any disease. Icosapent ethyl (Vascepa) is a prescription drug and requires physician oversight. Consult your physician before starting, especially if you take anticoagulant medication or have elevated triglycerides.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
