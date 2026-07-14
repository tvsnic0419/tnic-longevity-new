import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, TrendingUp, Zap, CheckCircle2, AlertTriangle, ExternalLink, Activity, Dna, Battery } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'CoQ10 (Ubiquinol) Supplement Guide 2026 — Dosage, Statin Depletion & Evidence',
  description:
    'Complete CoQ10 guide: what the science actually says about mitochondrial energy, statin-induced depletion, inflammation markers, and whether ubiquinol is worth the upgrade over ubiquinone.',
  path: '/coq10-supplement-guide',
  keywords: [
    'coq10 supplement guide',
    'ubiquinol vs ubiquinone',
    'coq10 dosage',
    'coq10 statins',
    'coq10 for mitochondria',
    'coq10 longevity',
    'ubiquinol dosage',
    'coq10 inflammation',
    'coq10 side effects',
    'best coq10 supplement 2026',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Statin-induced CoQ10 & mitochondrial depletion',
    finding:
      'Controlled study found statin therapy significantly reduced skeletal muscle CoQ10 content and mitochondrial OXPHOS (oxidative phosphorylation) capacity, alongside worsened glucose tolerance — direct evidence for why statin users are treated as a depletion-risk group. This trial studied statin effects, not CoQ10 supplementation itself.',
    quality: 'Strong (mechanism)',
    pmid: '23287371',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Inflammatory markers (hs-CRP, IL-6)',
    finding:
      'Systematic review and meta-analysis of randomized controlled trials confirmed statistically significant reductions in hs-CRP and IL-6 with CoQ10 supplementation versus placebo.',
    quality: 'Strong',
    pmid: '28179205',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Age-related biosynthesis decline',
    finding:
      'Narrative review summarizing that endogenous CoQ10 biosynthesis peaks in the 20s–30s and declines substantially with age, laying out the biological rationale for supplementation in older adults rather than presenting new trial data.',
    quality: 'Established (review)',
    pmid: '29459830',
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'Cellular ATP production / bioenergetics',
    finding:
      'The mechanistic rationale is well-established: CoQ10 is a required electron carrier in Complex I/II→III transfer. None of the three trials cited on this page report exercise capacity or ATP output as a primary endpoint, so no dedicated citation is given here.',
    quality: 'Mechanistic',
    pmid: undefined,
    color: 'text-accent-violet',
    badge: 'bg-accent-violet/10 border-accent-violet/20',
  },
  {
    endpoint: 'Heart failure / cardiac outcomes',
    finding:
      'Some heart-failure trials have studied CoQ10 for cardiac outcomes. TNiC does not cite a specific mortality-reduction statistic or trial here because it was not independently re-verified — treat any specific figure you see elsewhere with skepticism until you check the primary source.',
    quality: 'Unverified figure withheld',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    endpoint: 'Longevity / lifespan',
    finding:
      'Mechanistic rationale via mitochondrial and antioxidant support; no dedicated human longevity RCT exists among the studies cited on this page, and no lifespan-extension citation is claimed for CoQ10 specifically.',
    quality: 'Preclinical / mechanistic only',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
];

const FAQ = [
  {
    q: 'Do I need CoQ10 if I take a statin?',
    a: "This is the single strongest evidence-based reason to consider CoQ10. Statins work by inhibiting HMG-CoA reductase in the mevalonate pathway — the same pathway your cells use to synthesize CoQ10. A controlled study (PMID 23287371) found statin therapy reduced skeletal muscle CoQ10 content and mitochondrial oxidative phosphorylation capacity. That study did not test whether supplementing CoQ10 reverses the deficit, but the mechanistic logic for replacing what the drug depletes is well-established, which is why many clinicians recommend 200–300mg/day of ubiquinol for statin users. Talk to your prescribing physician before adding it.",
  },
  {
    q: 'Ubiquinol vs ubiquinone — does the form actually matter?',
    a: "Ubiquinol is the reduced, physiologically active antioxidant form; ubiquinone is the oxidized form that your body must convert to ubiquinol before it can be used as an antioxidant (it still participates in electron transport either way). Ubiquinol formulations tend to achieve higher plasma concentrations in absorption studies, particularly in people over 40 whose conversion capacity has declined. Whether that translates into a meaningfully different clinical outcome is a separate question — see our full comparison for the honest answer.",
  },
  {
    q: 'What is the correct CoQ10 dosage?',
    a: 'For general mitochondrial support, 100mg/day of ubiquinol is a reasonable baseline. For statin users specifically, 200–300mg/day (often split AM/PM) is the range referenced in the depletion literature. Take it with a fat-containing meal — CoQ10 is fat-soluble, and absorption without dietary fat is poor regardless of which form (ubiquinol or ubiquinone) you choose.',
  },
  {
    q: 'What are the main CoQ10 side effects?',
    a: 'CoQ10 is generally well tolerated. The most commonly reported effects are mild GI symptoms (nausea, upset stomach) at higher doses, and rare reports of insomnia if taken late in the day (some people prefer AM-only dosing for this reason). CoQ10 can theoretically reduce the effectiveness of warfarin due to structural similarity to vitamin K — anyone on anticoagulants should discuss this with their physician before starting. It is not a substitute for cholesterol-lowering therapy.',
  },
  {
    q: 'Does CoQ10 extend lifespan?',
    a: "There is no dedicated human longevity RCT for CoQ10 among the studies referenced on this page, and TNiC is not aware of one that meets our citation bar. The longevity case rests on mechanism: CoQ10 supports the electron transport chain responsible for roughly 95% of cellular ATP production, and functions as the only fat-soluble antioxidant your cells synthesize endogenously. Mitochondrial dysfunction is one of the recognized hallmarks of aging, which is why CoQ10 sits in most longevity stacks — but that is an extrapolation from mechanism, not a proven outcome in a human aging trial. TNiC rates it Tier B overall, with stronger (Tier A-adjacent) evidence specifically for statin-associated depletion and inflammatory marker reduction. If a longevity-specific human trial for CoQ10 is published in the future, this page will be updated to reflect it — until then, treat the lifespan-extension framing as a reasonable hypothesis, not an established fact.",
  },
  {
    q: 'Can I stack CoQ10 with NMN or R-ALA?',
    a: "Yes. CoQ10 is commonly paired with NMN (which supports the NAD+ side of mitochondrial metabolism) and R-alpha lipoic acid (R-ALA, which recycles other antioxidant systems and supports mitochondrial enzyme complexes). The three compounds act on complementary parts of the same mitochondrial network rather than duplicating each other's mechanism, which is the rationale for combining them in mitochondria-focused stacks.",
  },
  {
    q: 'Should I take CoQ10 with or without food?',
    a: 'Always with a meal that contains some fat. CoQ10 is highly lipophilic (fat-soluble) and absorption on an empty stomach is substantially reduced regardless of form. Splitting a higher total dose into an AM and PM serving, each taken with a meal, is a reasonable way to keep plasma levels steadier across the day, though this has not been directly compared to once-daily dosing in a dedicated trial.',
  },
  {
    q: 'How long does CoQ10 take to work, and how will I know?',
    a: "Plasma CoQ10 levels rise within days to weeks, but the outcomes people actually care about — reduced statin-associated muscle discomfort, or measurable change in inflammatory markers like hs-CRP — take longer to show up. The inflammatory-marker meta-analysis behind this guide reflects trials that ran for a number of weeks, not days, so an 8–12 week evaluation window is a reasonable expectation to set before deciding whether it is working for you. There is no fast way to shortcut this; taking a much higher dose does not appear to accelerate the timeline based on the available evidence.",
  },
];

function buildCoQ10Schemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a CoQ10 (Ubiquinol) Supplement Protocol Safely',
    description:
      'Evidence-based protocol for starting CoQ10 supplementation for mitochondrial support, statin-associated depletion, and inflammatory marker reduction.',
    path: '/coq10-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Identify whether you are in a depletion-risk group',
        text: 'Statin users are the clearest evidence-based case for supplementation, since statins block the same mevalonate pathway used to synthesize CoQ10. Anyone over 40 is also a reasonable candidate given the well-documented age-related decline in endogenous biosynthesis.',
      },
      {
        name: 'Choose ubiquinol over ubiquinone if budget allows',
        text: 'Ubiquinol is the already-reduced, active antioxidant form and tends to achieve higher plasma concentrations in absorption studies, especially in older adults with reduced conversion capacity. Ubiquinone is cheaper and still functions in the electron transport chain, so it is not a wrong choice — just a lower-absorption one.',
      },
      {
        name: 'Start at 100mg/day with a fat-containing meal',
        text: 'This is a reasonable general baseline dose. Take it with breakfast or your largest meal of the day, since CoQ10 is fat-soluble and poorly absorbed on an empty stomach.',
      },
      {
        name: 'Increase to 200–300mg/day if you take a statin',
        text: 'Split into two doses (AM/PM) with meals. This range reflects the dose commonly used to address statin-associated CoQ10 and mitochondrial OXPHOS depletion. Confirm with your physician, especially if you are also on anticoagulants.',
      },
      {
        name: 'Reassess at 8–12 weeks',
        text: 'Track any statin-associated muscle symptoms and, if accessible, inflammatory markers such as hs-CRP. The inflammatory-marker meta-analysis evidence supports an 8-week-plus supplementation window as a reasonable point to evaluate response.',
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
    headline: 'CoQ10 (Ubiquinol) Supplement Guide 2026 — Dosage, Statin Depletion & Evidence',
    description:
      'Complete evidence guide to CoQ10: mitochondrial electron transport mechanism, statin-induced depletion, inflammatory marker reduction, ubiquinol vs ubiquinone, and correct dosing.',
    url: `${SITE.url}/coq10-supplement-guide`,
    dateModified: '2026-07-14',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      {
        '@type': 'MedicalSubstance',
        name: 'Coenzyme Q10 (Ubiquinol)',
        description: 'Lipophilic electron carrier and endogenous antioxidant used in mitochondrial electron transport',
      },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Simvastatin Effects on Skeletal Muscle: Relation to Decreased Mitochondrial Function and Glucose Intolerance',
        author: 'Larsen S et al.',
        datePublished: '2013',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '23287371' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/23287371/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Effects of coenzyme Q10 supplementation on inflammatory markers: A systematic review and meta-analysis of randomized controlled trials',
        author: 'Fan L et al.',
        datePublished: '2017',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '28179205' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/28179205/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Coenzyme Q10 Supplementation in Aging and Disease',
        author: 'Hernández-Camacho JD et al.',
        datePublished: '2018',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '29459830' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/29459830/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'CoQ10 Supplement Guide', path: '/coq10-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function CoQ10GuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildCoQ10Schemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-violet" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-violet uppercase tracking-wider">Evidence Tier B · CoQ10 (Ubiquinol)</span>
          </div>

          <h1 className="heading-hero mb-4">
            CoQ10 (Ubiquinol) Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            CoQ10 is the mitochondrial electron carrier your cells stop making as much of after your 30s — and statins deplete it further. Here is what the evidence actually supports, and whether the &ldquo;upgraded&rdquo; ubiquinol form is worth paying more for.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '58%', label: 'Bioavailability', color: 'text-accent-emerald' },
              { value: '~95%', label: 'Of cellular ATP relies on it', color: 'text-accent-violet' },
              { value: '100–300mg', label: 'Evidence dose range', color: 'text-accent-cyan' },
              { value: 'Tier B', label: 'Overall evidence', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/coq10"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-violet text-bg-base font-semibold text-sm hover:bg-accent-violet/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/coq10-vs-ubiquinol"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
            >
              CoQ10 vs Ubiquinol
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check: CoQ10 vs Ubiquinol */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">CoQ10 vs Ubiquinol: Does the Upgraded Form Matter?</h2>
          <p className="text-body mb-6 max-w-2xl">
            Every CoQ10 bottle is either &ldquo;ubiquinone&rdquo; (oxidized, the older/cheaper form) or &ldquo;ubiquinol&rdquo; (reduced, the newer/pricier form). Marketing copy often implies ubiquinone is basically inert by comparison — that overstates the case. Both forms participate in the electron transport chain; the real question is which one gets more CoQ10 into your bloodstream per dollar spent, and whether that matters for you specifically. Here is the honest comparison.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">UBIQUINONE (Q)</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-violet">UBIQUINOL (QH2)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Chemical state',
                    q: 'Oxidized form — must be converted in vivo before it can act as an antioxidant',
                    qh2: 'Already reduced — the physiologically active antioxidant form',
                    winner: 'qh2',
                  },
                  {
                    metric: 'Electron transport role',
                    q: 'Fully functional as an electron carrier in Complex I/II→III',
                    qh2: 'Fully functional as an electron carrier in Complex I/II→III',
                    winner: 'tie',
                  },
                  {
                    metric: 'Absorption in trials',
                    q: 'Lower plasma concentrations reported vs ubiquinol in absorption studies',
                    qh2: 'Higher plasma concentrations reported, particularly in adults over 40',
                    winner: 'qh2',
                  },
                  {
                    metric: 'Cost per mg',
                    q: 'Lower cost, widely available in generic multivitamins and stand-alone capsules',
                    qh2: 'Meaningfully higher cost per mg (branded forms like Kaneka Ubiquinol)',
                    winner: 'q',
                  },
                  {
                    metric: 'Best evidence base',
                    q: 'Longer track record in older trials; still used in many published studies',
                    qh2: 'Increasingly the form used in newer supplementation and absorption research',
                    winner: 'tie',
                  },
                  {
                    metric: 'Who benefits most from upgrading',
                    q: 'Younger adults with intact conversion capacity may see little practical difference',
                    qh2: 'Older adults, statin users, and anyone prioritizing plasma level per dollar',
                    winner: 'qh2',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className={`p-4 text-xs ${row.winner === 'q' ? 'text-accent-cyan font-semibold' : 'text-muted-foreground'}`}>{row.q}</td>
                    <td className={`p-4 text-xs ${row.winner === 'qh2' ? 'text-accent-violet font-semibold' : 'text-muted-foreground'}`}>{row.qh2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The verdict</p>
            <p className="text-sm text-muted-foreground">
              Ubiquinol&rsquo;s absorption edge in plasma studies is real, and it makes physiological sense given that it is already in the active reduced state. Whether that edge is worth the price premium depends on your situation: if you are over 40, on a statin, or simply want the highest plasma concentration per dose, ubiquinol is the more defensible pick. If budget is the constraint, ubiquinone still functions in the electron transport chain and is not a &ldquo;fake&rdquo; or ineffective form — it is simply a lower-absorption one, and younger adults with intact endogenous conversion capacity may not notice a practical difference between the two. Neither form has a dedicated head-to-head longevity outcome trial behind it; the case for choosing ubiquinol is a pharmacokinetic one (plasma concentration achieved per milligram dosed), not a claim that ubiquinol produces a different clinical outcome than ubiquinone at an equivalent absorbed dose. See our full <Link href="/library/compare/coq10-vs-ubiquinol" className="text-accent-violet hover:underline">CoQ10 vs Ubiquinol comparison</Link> for the detailed breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence table */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Evidence Summary by Endpoint</h2>
          <p className="text-body-sm text-muted-foreground mb-8">Click each PMID to view the source trial on PubMed. The quality tags below distinguish between direct randomized-trial findings, review-level rationale, and mechanistic reasoning that has not been tested as a primary endpoint in a dedicated human trial — the distinction matters more than the headline claim.</p>

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
            Dosing ranges reflect the general-support and statin-depletion literature — there is no single universally &ldquo;correct&rdquo; dose, but these ranges are consistently used across trials and clinical practice. As with most fat-soluble compounds, more is not automatically better beyond the range studied; the goal is to replace what age and, if applicable, statin therapy have depleted, not to maximize plasma levels indefinitely.
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
                  { use: 'General mitochondrial support', dose: '100mg/day', timing: '1× AM with a fat-containing meal', note: 'Reasonable baseline for most adults' },
                  { use: 'Statin users (depletion offset)', dose: '200–300mg/day', timing: '2× split, AM/PM with meals', note: 'Addresses statin-associated CoQ10 loss' },
                  { use: 'Form selection', dose: 'Ubiquinol preferred', timing: 'Consistent daily timing', note: 'Higher plasma levels in absorption studies, esp. 40+' },
                  { use: 'Reassessment', dose: 'Same dose', timing: 'At 8–12 weeks', note: 'Evaluate symptoms and, if available, hs-CRP' },
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
                <li>· Always take with a fat-containing meal — CoQ10 is lipophilic and poorly absorbed without dietary fat</li>
                <li>· Statin users: prioritize this compound above most other mitochondrial supplements given the documented depletion mechanism</li>
                <li>· Prefer ubiquinol if budget allows, especially if you are over 40 and conversion capacity has declined</li>
                <li>· Split higher doses (200mg+) into AM/PM to keep plasma levels steadier across the day</li>
                <li>· Store away from heat and light — CoQ10 can degrade in poor storage conditions, reducing potency before you even take it</li>
                <li>· Give it 8–12 weeks before judging whether it is working — this is not a fast-acting compound</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· May reduce warfarin&rsquo;s effectiveness due to structural similarity to vitamin K — discuss with your physician if anticoagulated</li>
                <li>· Not a substitute for statin therapy or physician-directed cholesterol management</li>
                <li>· High doses taken late in the day may cause insomnia in some people — consider AM-only dosing if this happens</li>
                <li>· Limited safety data in pregnancy and nursing — consult your physician before starting</li>
                <li>· Mild GI upset possible at higher doses; take with food to minimize this</li>
                <li>· May modestly lower blood pressure — use caution if combined with antihypertensive medication</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How CoQ10 Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Battery,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Electron Transport Shuttle',
                body: 'CoQ10 ferries electrons between Complex I/II and Complex III in the mitochondrial inner membrane — a required step in the electron transport chain that ultimately drives ATP synthase. This single carrier function underlies roughly 95% of cellular ATP production, which is why CoQ10 depletion shows up as fatigue and reduced exercise tolerance in deficiency states. Tissues with the highest energy demand — heart, skeletal muscle, and liver — carry the largest CoQ10 reserves and are also the most sensitive to its decline.',
              },
              {
                icon: ShieldCheck,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'The Only Fat-Soluble Antioxidant You Make Yourself',
                body: 'Ubiquinol (the reduced QH2 form) is the sole fat-soluble antioxidant your cells synthesize endogenously. It quenches lipid peroxides in cell membranes and lipoproteins — damage the water-soluble glutathione system cannot reach because it operates in the aqueous cytoplasm rather than inside lipid bilayers. Ubiquinone (the oxidized Q form) must first be converted to ubiquinol before it can perform this antioxidant role, a conversion step whose efficiency itself declines with age.',
              },
              {
                icon: TrendingUp,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Endogenous Synthesis Decline & the Statin Connection',
                body: 'Endogenous CoQ10 biosynthesis peaks around age 20–30 and declines substantially by age 60. Statins inhibit HMG-CoA reductase in the mevalonate pathway — the same upstream pathway your body uses to make both cholesterol and CoQ10 — which is the biochemical basis for statin-associated CoQ10 depletion documented in muscle tissue studies. This shared-pathway relationship is why CoQ10 supplementation is discussed specifically in the context of statin therapy rather than as a generic anti-aging additive.',
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
          <h2 className="heading-section mb-3">How CoQ10 Addresses the Hallmarks of Aging</h2>
          <p className="text-body mb-8 max-w-2xl">
            CoQ10&rsquo;s evidence base maps onto three of the twelve recognized hallmarks of aging — most directly the mitochondrial one. The strength of the connection varies: mitochondrial dysfunction is a direct, mechanistic fit, inflammation has meta-analysis-level human trial support, and genomic instability is a plausible downstream consequence of CoQ10&rsquo;s antioxidant role rather than something tested directly in the studies cited on this page.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Mitochondrial Dysfunction',
                body: 'This is CoQ10&rsquo;s primary hallmark. As the electron carrier between Complex I/II and Complex III, CoQ10 is structurally required for oxidative phosphorylation. The statin-depletion study (PMID 23287371) directly measured reduced mitochondrial OXPHOS capacity alongside reduced muscle CoQ10 — concrete human evidence that CoQ10 status and mitochondrial function move together, even though the study itself examined a drug effect rather than a supplementation outcome.',
                href: '/library/mitochondrial-dysfunction',
                label: 'Mitochondrial Dysfunction',
              },
              {
                icon: Activity,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Chronic Inflammation',
                body: 'The Fan et al. meta-analysis (PMID 28179205) found CoQ10 supplementation significantly reduced hs-CRP and IL-6 — two of the most widely used inflammaging biomarkers. Lower systemic inflammation is one of the more human-trial-backed longevity mechanisms for this compound, and this meta-analysis-level evidence is a meaningfully stronger evidence tier than the mechanistic-only reasoning behind some of CoQ10&rsquo;s other proposed benefits.',
                href: '/library/chronic-inflammation',
                label: 'Chronic Inflammation',
              },
              {
                icon: Dna,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Genomic Instability',
                body: 'As the only fat-soluble antioxidant your cells make internally, ubiquinol quenches lipid peroxides before they propagate into oxidative damage that can reach mitochondrial and nuclear DNA. This is a mechanistic connection to genomic stability rather than a claim backed by a dedicated CoQ10 DNA-damage trial in the citations above.',
                href: '/library/genomic-instability',
                label: 'Genomic Instability',
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
                title: 'Identify whether you are in a depletion-risk group',
                body: 'Statin users have the clearest evidence-based reason to supplement, since statins block the same mevalonate pathway used to synthesize CoQ10. Anyone over 40 is also a reasonable candidate given the well-documented age-related decline in endogenous biosynthesis. If neither applies to you, CoQ10 is still a reasonable general mitochondrial-support supplement, just with a less urgent case behind it.',
              },
              {
                n: '02',
                title: 'Choose ubiquinol over ubiquinone if budget allows',
                body: 'Ubiquinol is already in the active, reduced antioxidant state and tends to reach higher plasma concentrations in absorption studies — particularly relevant for older adults whose conversion capacity has declined. Ubiquinone still works in the electron transport chain; it is a budget option, not a broken one. If cost is the deciding factor, ubiquinone at a modestly higher dose is a reasonable substitute.',
              },
              {
                n: '03',
                title: 'Start at 100mg/day with a fat-containing meal',
                body: 'This is a reasonable general baseline. Take it with breakfast or your largest meal — CoQ10 is fat-soluble and its absorption without dietary fat is poor no matter which form you choose. Consistency matters more than perfect timing: pick a meal you eat reliably every day and anchor the dose there.',
              },
              {
                n: '04',
                title: 'Increase to 200–300mg/day if you take a statin',
                body: 'Split into two doses with meals (AM/PM). This range reflects doses referenced in the statin-depletion literature and commonly used in clinical practice. Confirm with your physician, especially if you are also on anticoagulant medication or have low blood pressure, since CoQ10 can have a mild additive effect in both areas.',
              },
              {
                n: '05',
                title: 'Reassess at 8–12 weeks',
                body: 'Track any statin-associated muscle symptoms, and if you have access to lab work, consider checking hs-CRP. The inflammatory-marker meta-analysis supports an 8-week-plus window as a reasonable point to evaluate whether supplementation is doing anything measurable for you. If you notice no change in symptoms or markers by 12 weeks, it is reasonable to reconsider the dose, the form, or whether CoQ10 is the right tool for your specific situation.',
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
          <h2 className="heading-section mb-8">CoQ10 FAQ</h2>
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
                  CoQ10 can reduce the anticoagulant effectiveness of warfarin due to a structural similarity to vitamin K. If you are on blood thinners, inform your physician before starting CoQ10. CoQ10 is also not a substitute for statin therapy or physician-directed cholesterol management — it addresses a side effect of statins, not the underlying condition the statin is prescribed for. Stopping or reducing a prescribed statin because you have added CoQ10 is not supported by any evidence discussed on this page and should never be done without your prescribing physician&rsquo;s explicit guidance. TNiC content is educational and not a substitute for medical advice.
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
            <h2 className="heading-section mb-3">Build Your Mitochondrial Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              CoQ10 pairs with NMN and R-ALA in TNiC&rsquo;s mitochondria-focused stacks — three compounds addressing complementary parts of the same energy-production and antioxidant network rather than duplicating one another. Take the quiz to get a personalized protocol based on your age, medication list, and goals.
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
                href="/library/compare/coq10-vs-ubiquinol"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                CoQ10 vs Ubiquinol
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/coq10"
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
            Educational content only — not medical advice. CoQ10 is a dietary supplement, not FDA-approved to treat or prevent any disease. Consult your physician before starting, especially if you take statins, warfarin, or other anticoagulant medications. Nothing on this page should be interpreted as a recommendation to start, stop, or change any prescription medication.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
