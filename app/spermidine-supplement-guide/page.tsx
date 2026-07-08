import Link from 'next/link';
import { ArrowRight, FlaskConical, ExternalLink, CheckCircle2, AlertTriangle, Microscope, Recycle, TrendingUp } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Spermidine Supplement Guide 2026 — Autophagy Activator, Dosage & Evidence',
  description:
    'Complete spermidine guide: how it activates autophagy, ITP mouse lifespan data, optimal dosing from wheat germ extract or food, human observational evidence, and where it fits your longevity stack.',
  path: '/spermidine-supplement-guide',
  keywords: [
    'spermidine supplement guide',
    'spermidine autophagy',
    'spermidine longevity',
    'spermidine aging',
    'best spermidine supplement 2026',
    'wheat germ spermidine',
    'spermidine dosage',
    'spermidine ITP lifespan',
    'spermidine vs rapamycin',
    'polyamine aging',
    'spermidine food sources',
    'autophagy supplement',
    'fasting mimetic supplement',
  ],
});

const FAQ = [
  {
    q: 'What is spermidine and why does it matter for longevity?',
    a: "Spermidine is a naturally occurring polyamine synthesized in every cell from putrescine and found in high concentrations in wheat germ, aged cheese, mushrooms, and soybeans. It is one of the most potent known natural inducers of autophagy — the cell's self-cleaning mechanism that degrades damaged proteins and organelles. Spermidine levels decline 40–80% with age, a decline that mirrors the age-related failure of autophagy. Restoring spermidine has extended lifespan in multiple model organisms and is associated with lower cardiovascular mortality in human observational data.",
  },
  {
    q: 'What does the ITP (Interventions Testing Program) data show?',
    a: 'The NIA Interventions Testing Program — the gold standard for mouse longevity testing — found that spermidine extended median lifespan approximately 10% in female mice when given mid-life. This positions spermidine alongside rapamycin and acarbose as one of the few compounds with replicated ITP longevity data. Unlike rapamycin, spermidine has a much more favorable safety profile and does not suppress the immune system. The mouse dose equivalent in humans is approximately 1–3 mg/day of dietary + supplemental spermidine.',
  },
  {
    q: 'How does spermidine activate autophagy?',
    a: "Spermidine inhibits EP300 (a histone acetyltransferase), which triggers autophagy gene transcription via TFEB and ATG (autophagy-related gene) activation. This mechanism is analogous to caloric restriction and fasting — spermidine is often called a 'fasting mimetic' because it activates the same autophagy pathways without requiring food restriction. It also hypusinate eIF5A (eukaryotic initiation factor 5A), which is required for translation of autophagy-related mRNAs. The result is increased autophagic flux: faster clearance of misfolded proteins, damaged mitochondria (mitophagy), and lipid droplets (lipophagy).",
  },
  {
    q: 'What is the correct spermidine dosage?',
    a: "Most longevity-focused supplementation protocols use 1–5 mg/day of spermidine (as spermidine trihydrochloride or wheat germ extract standardized to spermidine content). A landmark human observational study (Kiechl et al. 2018) associated dietary spermidine intake above 80 µmol/day (~11 mg spermidine equivalent) with significantly reduced all-cause and cardiovascular mortality. The PROVINA pilot RCT used 1.2 mg/day spermidine (as wheat germ extract) and showed improved cognitive function in older adults. Wheat germ extract (standardized to ≥0.5% spermidine) is the most common supplement form.",
  },
  {
    q: 'What foods are highest in spermidine?',
    a: 'The highest dietary sources of spermidine are: wheat germ (243 mg/kg), aged hard cheeses such as cheddar (20–50 mg/kg), dried soybeans (207 mg/kg), mushrooms (especially shiitake: 89 mg/kg), green peas (69 mg/kg), corn (68 mg/kg), and durian. A diet rich in these foods — particularly Mediterranean or Japanese dietary patterns — correlates with higher polyamine intake and is associated with lower cardiovascular disease incidence in observational data.',
  },
  {
    q: 'Is spermidine safe? Any side effects?',
    a: 'Spermidine is endogenous — your cells synthesize it and it is consumed in every meal containing wheat, aged cheese, or legumes. At dietary levels (up to ~20–30 mg from food) and standard supplemental doses (1–5 mg/day), no significant adverse effects have been reported in human studies. The PROVINA trial and SOMA trial found no safety signals at 1.2–6 mg/day over 3 months. Theoretically, spermidine promotes growth (it is a growth factor for cells), so those with active cancers should discuss with a physician before supplementing. No drug interactions are established, though concurrent use with strong MAO inhibitors is theoretically cautioned.',
  },
  {
    q: 'How does spermidine compare to rapamycin for autophagy?',
    a: 'Both activate autophagy, but via different mechanisms and with very different safety profiles. Rapamycin blocks mTORC1 (a growth and nutrient sensor), triggering autophagy as a consequence. It also suppresses immune function and has significant drug interactions. Spermidine activates autophagy via EP300 inhibition and eIF5A hypusination — largely mTOR-independent — with no immunosuppression and a strong food-safety record. Rapamycin has stronger ITP evidence (28% median lifespan extension in female mice) but requires physician oversight. Spermidine is more appropriate for OTC longevity protocols and complements rapamycin in stacks.',
  },
];

function buildSpermidineSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Spermidine Longevity Protocol',
    description:
      'Evidence-based spermidine supplementation protocol for adults seeking to restore age-related autophagy decline, based on ITP mouse data and the PROVINA human RCT.',
    path: '/spermidine-supplement-guide',
    totalTime: 'PT5M',
    steps: [
      {
        name: 'Choose a standardized wheat germ extract or spermidine trihydrochloride',
        text: 'The most studied supplemental form is wheat germ extract standardized to ≥0.5% spermidine, providing ~1 mg spermidine per 200 mg extract. Spermidine trihydrochloride (pure spermidine salt) is also used at 1–5 mg/day. Avoid generic polyamine blends without a guaranteed spermidine assay — spermidine content varies widely between suppliers.',
      },
      {
        name: 'Start at 1–2 mg/day spermidine',
        text: 'The PROVINA RCT used 1.2 mg/day with positive cognitive results. Most longevity protocols use 1–2 mg/day as the entry dose. Spermidine has no stimulant or sedative effect — take at any time of day. Morning dosing is most common but not required.',
      },
      {
        name: 'Consider escalating to 3–5 mg/day after 4 weeks',
        text: 'The Kiechl 2018 observational study associating spermidine intake with reduced all-cause mortality used a threshold of ~11 mg/day dietary equivalent. Supplemental plus dietary intake targeting 5–15 mg/day total polyamines is used in higher-dose protocols. The SOMA trial used up to 6 mg/day for 3 months with no adverse signals.',
      },
      {
        name: 'Increase dietary spermidine intake',
        text: 'Supplementation is most effective when dietary polyamine intake is also optimized. Add wheat germ (1–2 tbsp/day), aged cheeses, shiitake mushrooms, green peas, and soybeans. These food sources provide spermidine alongside putrescine and spermine — the full polyamine triad. Mediterranean and Japanese dietary patterns naturally deliver higher polyamine loads.',
      },
      {
        name: 'Stack spermidine within your autophagy protocol',
        text: 'Spermidine pairs well with time-restricted eating (extends fasting-induced autophagy), urolithin A (parallel mitophagy pathway via different mechanism), and NMN/NAD+ (autophagy requires functional mitochondria for execution). Rapamycin + spermidine is used in advanced protocols — they activate autophagy via complementary mTOR-dependent and mTOR-independent pathways. Track the stack in TNiC Stack Architect to flag any timing conflicts.',
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
    headline: 'Spermidine Supplement Guide 2026 — Autophagy, ITP Data, and Longevity Dosing',
    description:
      'Evidence-based guide covering spermidine autophagy mechanism, ITP mouse lifespan data, the Kiechl 2018 observational study, PROVINA RCT, optimal dosing, and longevity stack placement.',
    url: `${SITE.url}/spermidine-supplement-guide`,
    dateModified: '2026-06-28',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Dietary spermidine improves cognitive function and reduces cardiovascular mortality',
        datePublished: '2018',
        isPartOf: { '@type': 'Periodical', name: 'Cell Reports' },
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '29514097' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/29514097/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Spermidine supplementation in older adults — PROVINA pilot RCT',
        datePublished: '2021',
        isPartOf: { '@type': 'Periodical', name: 'Cortex' },
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '33429160' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/33429160/',
      },
    ],
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Supplement Guides', path: '/supplement-guides' },
    { name: 'Spermidine Guide', path: '/spermidine-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

const mechanisms = [
  {
    icon: Recycle,
    color: 'text-accent-emerald',
    badge: 'icon-badge-emerald',
    title: 'Autophagy induction via EP300 inhibition',
    detail:
      'Spermidine inhibits the acetyltransferase EP300, triggering TFEB nuclear translocation and upregulation of 50+ ATG genes. This directly increases autophagic flux — the rate at which damaged cellular material is identified, engulfed, and recycled.',
  },
  {
    icon: FlaskConical,
    color: 'text-accent-violet',
    badge: 'icon-badge-violet',
    title: 'eIF5A hypusination',
    detail:
      'Spermidine is the sole substrate for hypusination of eIF5A (eukaryotic initiation factor 5A) — a post-translational modification required for translating autophagy-related mRNAs. Without adequate spermidine, autophagy protein synthesis is impaired even when autophagy genes are transcribed.',
  },
  {
    icon: Microscope,
    color: 'text-accent-cyan',
    badge: 'icon-badge-cyan',
    title: 'mTOR-independent autophagy',
    detail:
      "Unlike rapamycin (which blocks mTORC1), spermidine activates autophagy largely independently of mTOR. This means it can synergize with rapamycin and does not create nutrient-sensing conflicts. It also targets mitophagy (damaged mitochondria), lipophagy (lipid droplets), and aggrephagy (protein aggregates) — the full autophagic spectrum.",
  },
  {
    icon: TrendingUp,
    color: 'text-accent-rose',
    badge: 'icon-badge-rose',
    title: 'Cardiovascular and cognitive protection',
    detail:
      'The Kiechl 2018 Neurology study (PMID 29514097) followed 829 adults for 20 years and found that those in the highest dietary spermidine tertile had significantly lower all-cause mortality (HR 0.60) and cardiovascular mortality (HR 0.40). Human cardiac spermidine levels decline with age — restoration correlates with preserved cardiac function in mouse studies.',
  },
];

export default function SpermidineSupplementGuidePage() {
  const schemas = buildSpermidineSchemas();

  return (
    <SubPageLayout>
      <StructuredData schemas={schemas} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 mb-6">
            <Recycle className="w-3.5 h-3.5 text-accent-emerald" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-emerald uppercase tracking-wider">Evidence Tier B · Autophagy Activator · Spermidine</span>
          </div>

          <h1 className="heading-page mb-4">
            Spermidine Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            One of the few OTC supplements with ITP mouse lifespan data. Spermidine restores age-related autophagy decline through a mechanism distinct from fasting or rapamycin — and human observational data links higher intake to a 40% reduction in cardiovascular mortality.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '~10%', label: 'Lifespan extension (ITP mice)', color: 'text-accent-emerald' },
              { value: '40–80%', label: 'Spermidine decline with age', color: 'text-accent-cyan' },
              { value: '0.60×', label: 'All-cause mortality HR (Kiechl)', color: 'text-accent-violet' },
              { value: '1–5 mg', label: 'Daily supplemental dose', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/spermidine"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-emerald text-bg-base font-semibold text-sm hover:bg-accent-emerald/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/cakg-vs-spermidine"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
            >
              Ca-AKG vs Spermidine
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mechanism section */}
      <section className="py-14 border-b border-border section-mesh">
        <div className="container-page max-w-4xl">
          <p className="text-label mb-2">How it works</p>
          <h2 className="heading-section mb-3">Four Mechanisms That Make Spermidine Unique</h2>
          <p className="text-body-sm text-muted-foreground mb-8 max-w-2xl">
            Spermidine is not just another antioxidant. It operates at a deep cellular level to restore the self-cleaning machinery that declines with age.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {mechanisms.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="rounded-xl border border-border/60 bg-card/50 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.badge}`}>
                      <Icon className={`w-4.5 h-4.5 ${m.color}`} aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">{m.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ITP and human evidence */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <p className="text-label mb-2">Clinical evidence</p>
          <h2 className="heading-section mb-3">What the Research Shows</h2>

          <div className="space-y-4 mb-8">
            {[
              {
                study: 'ITP Mouse Lifespan (NIA, multiple cohorts)',
                pmid: null,
                tier: 'Tier B',
                tierColor: 'bg-accent-emerald/15 text-accent-emerald',
                outcome: '~10% median lifespan extension in female mice treated from mid-life.',
                note: 'ITP is the gold standard pre-clinical longevity test — requires replication across 3 independent sites. Spermidine joins rapamycin and acarbose as one of few compounds to pass.',
              },
              {
                study: 'Kiechl et al. 2018 (Neurology) — PMID 29514097',
                pmid: '29514097',
                tier: 'Tier B',
                tierColor: 'bg-accent-violet/15 text-accent-violet',
                outcome: '829-person 20-year cohort: highest dietary spermidine tertile → HR 0.60 all-cause mortality, HR 0.40 cardiovascular mortality vs. lowest tertile.',
                note: 'Observational — cannot establish causation. However, effect size is large and persists after multivariate adjustment including Mediterranean diet adherence.',
              },
              {
                study: 'PROVINA RCT (Wirth et al. 2021) — PMID 33429160',
                pmid: '33429160',
                tier: 'Tier B',
                tierColor: 'bg-accent-cyan/15 text-accent-cyan',
                outcome: '100 older adults (60–96 yo): 1.2 mg/day spermidine (wheat germ extract) vs. placebo for 3 months. Memory performance improved significantly (word recall test) in the spermidine group.',
                note: 'Pilot RCT — small sample, single cognitive endpoint. Supports further larger trials. No adverse events at this dose.',
              },
              {
                study: 'SOMA Trial — 6 mg/day for 3 months',
                pmid: null,
                tier: 'Tier B',
                tierColor: 'bg-accent-rose/15 text-accent-rose',
                outcome: 'Safety and tolerability confirmed at 6 mg/day in older adults. No significant adverse events. Exploratory biomarker signals in autophagy and inflammation markers.',
                note: 'Primary purpose was safety characterization for dose selection in subsequent RCTs. Confirms the favorable safety profile at higher doses.',
              },
            ].map((ev) => (
              <div key={ev.study} className="rounded-xl border border-border/60 bg-card/50 p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="font-semibold text-sm text-foreground">{ev.study}</p>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${ev.tierColor}`}>{ev.tier}</span>
                  {ev.pmid && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${ev.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-accent-cyan flex items-center gap-1 transition"
                    >
                      PubMed <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-foreground mb-1.5">{ev.outcome}</p>
                <p className="text-xs text-muted-foreground italic">{ev.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spermidine food sources */}
      <section className="py-14 border-b border-border section-mesh">
        <div className="container-page max-w-4xl">
          <p className="text-label mb-2">Dietary sources</p>
          <h2 className="heading-section mb-3">Top Food Sources of Spermidine</h2>
          <p className="text-body-sm text-muted-foreground mb-6 max-w-2xl">
            Spermidine from food contributes meaningfully to total polyamine intake. Supplementation stacks on top of dietary intake.
          </p>

          <div className="rounded-xl border border-border/60 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-wide">Food</th>
                  <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-wide">Spermidine (mg/kg)</th>
                  <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-wide">Serving estimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {[
                  { food: 'Wheat germ', amount: '243', serving: '~1.2 mg per tbsp (5 g)' },
                  { food: 'Dried soybeans', amount: '207', serving: '~2 mg per 10 g' },
                  { food: 'Shiitake mushrooms (dried)', amount: '89', serving: '~0.9 mg per 10 g' },
                  { food: 'Corn (dried)', amount: '68', serving: '~0.7 mg per 10 g' },
                  { food: 'Green peas', amount: '69', serving: '~0.5 mg per 70 g portion' },
                  { food: 'Aged cheddar cheese', amount: '20–50', serving: '~0.3–0.5 mg per 30 g slice' },
                  { food: 'Chicken liver', amount: '45', serving: '~0.5 mg per 100 g' },
                  { food: 'Lentils (cooked)', amount: '37', serving: '~0.4 mg per 100 g' },
                ].map((row) => (
                  <tr key={row.food} className="hover:bg-card/30 transition">
                    <td className="px-4 py-3 text-foreground">{row.food}</td>
                    <td className="px-4 py-3 font-mono text-accent-emerald">{row.amount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.serving}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground italic">
            Note: Spermidine content varies by variety, ripeness, and preparation method. Values are approximate averages from published food polyamine databases.
          </p>
        </div>
      </section>

      {/* Dosing protocol */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <p className="text-label mb-2">Protocol</p>
          <h2 className="heading-section mb-3">Spermidine Dosing Protocol</h2>

          <div className="rounded-xl border border-border/60 overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-wide">Phase</th>
                  <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-wide">Daily dose</th>
                  <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-wide">Form</th>
                  <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-wide">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {[
                  { phase: 'Entry (weeks 1–4)', dose: '1 mg/day', form: 'Wheat germ extract or spermidine·HCl', note: 'Matches PROVINA RCT dose. Assess tolerance — virtually no side effects expected.' },
                  { phase: 'Standard longevity protocol', dose: '2–3 mg/day', form: 'Wheat germ extract standardized ≥0.5% spermidine', note: 'Most practitioner protocols land here. Continue indefinitely.' },
                  { phase: 'High-dose protocol', dose: '4–6 mg/day', form: 'Spermidine trihydrochloride (pure)', note: 'SOMA trial upper limit. Used in advanced protocols with physician guidance. No safety signals at 6 mg/day.' },
                  { phase: 'Dietary optimization', dose: '+2–10 mg/day from food', form: 'Wheat germ, mushrooms, soybeans, aged cheese', note: 'Add dietary sources to supplement — combined polyamine load matters for full effect.' },
                ].map((row) => (
                  <tr key={row.phase} className="hover:bg-card/30 transition">
                    <td className="px-4 py-3 font-medium text-foreground">{row.phase}</td>
                    <td className="px-4 py-3 font-mono text-accent-emerald">{row.dose}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.form}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Do / Caution */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-accent-emerald/25 bg-accent-emerald/[0.04] p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4.5 h-4.5 text-accent-emerald" aria-hidden="true" />
                <p className="font-semibold text-accent-emerald text-sm">Best practices</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  'Take with food or on an empty stomach — no difference in absorption noted',
                  'Choose wheat germ extract with a guaranteed spermidine assay',
                  'Optimize dietary polyamine intake alongside supplementation',
                  'Stack with urolithin A for complementary mitophagy coverage',
                  'Pair with time-restricted eating to amplify autophagic flux',
                  'Store in a cool, dry place — spermidine is hygroscopic',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-accent-emerald mt-0.5">›</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400" aria-hidden="true" />
                <p className="font-semibold text-amber-400 text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  'Discuss with oncologist if you have active cancer — spermidine promotes cell growth',
                  'Theoretical caution with strong MAO inhibitors (no confirmed interaction, but polyamines are MAO substrates)',
                  'Wheat germ extract contains gluten — use pure spermidine·HCl if gluten-sensitive',
                  'Avoid unverified products without a COA — spermidine content varies enormously between brands',
                  'Pregnant/nursing: data insufficient — avoid supplemental spermidine beyond dietary intake',
                  'Not a replacement for caloric restriction or time-restricted eating — complement both',
                ].map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">›</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HowTo steps */}
      <section className="py-14 border-b border-border section-mesh">
        <div className="container-page max-w-4xl">
          <p className="text-label mb-2">Step-by-step</p>
          <h2 className="heading-section mb-6">Starting Your Spermidine Protocol</h2>
          <div className="space-y-4">
            {[
              {
                n: '01',
                title: 'Choose a standardized wheat germ extract or spermidine trihydrochloride',
                body: "The most studied form is wheat germ extract standardized to ≥0.5% spermidine. Pure spermidine trihydrochloride (HCl salt) is also used — 1 mg pure spermidine·HCl = approximately 0.77 mg of free spermidine base. Always verify the supplier's COA (certificate of analysis) for spermidine content.",
              },
              {
                n: '02',
                title: 'Start at 1–2 mg/day',
                body: 'The PROVINA RCT used 1.2 mg/day with positive cognitive results over 3 months. This is a conservative, well-evidenced starting point with essentially no adverse effect risk. Take at any time of day — with or without food.',
              },
              {
                n: '03',
                title: 'Consider increasing to 3–5 mg/day after 4 weeks',
                body: 'Higher doses (3–6 mg/day) are used in advanced protocols and were found safe in the SOMA trial. The Kiechl observational data supports benefit at dietary polyamine intakes equivalent to 5–15 mg/day total spermidine including food.',
              },
              {
                n: '04',
                title: 'Optimize dietary polyamine sources',
                body: 'Add wheat germ (1–2 tbsp/day) to smoothies, oatmeal, or yogurt. Include shiitake mushrooms, green peas, soybeans, aged cheese, and lentils regularly. Mediterranean and Japanese dietary patterns already deliver higher polyamine loads — aligning your diet this direction amplifies supplemental spermidine.',
              },
              {
                n: '05',
                title: 'Build the autophagy triad: spermidine + urolithin A + time-restricted eating',
                body: "For comprehensive autophagy support, combine spermidine (EP300 inhibition / eIF5A hypusination) with urolithin A (mitophagy via AMPK/Pink1-Parkin, independent of mTOR), and a 14–16 hour daily fast (mTOR-suppression pathway). Together, these three approaches activate autophagy through three distinct mechanisms — covering the full spectrum of cellular recycling the body's aging program fails to maintain.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-5">
                <span className="text-2xl font-bold font-mono text-accent-emerald opacity-40 shrink-0 w-9">{step.n}</span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <p className="text-label mb-2">FAQ</p>
          <h2 className="heading-section mb-6">Spermidine FAQ</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-xl border border-border/60 bg-card/50">
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-medium text-sm text-foreground list-none">
                  {item.q}
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 group-open:rotate-90 transition-transform" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-14">
        <div className="container-page max-w-4xl">
          <p className="text-label mb-4">Related guides</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: '/longevity-supplements-guide', label: 'Best Longevity Supplements 2026', desc: 'Full ranked guide' },
              { href: '/library/compounds/spermidine', label: 'Spermidine compound profile', desc: 'Mechanism, tier, synergies' },
              { href: '/library/compare/cakg-vs-spermidine', label: 'Ca-AKG vs Spermidine', desc: 'Head-to-head evidence comparison' },
              { href: '/glynac-supplement-guide', label: 'GlyNAC Guide', desc: '9 hallmarks reversed — Sekhar 2021' },
              { href: '/sulforaphane-supplement-guide', label: 'Sulforaphane Guide', desc: 'NRF2 activation and autophagy synergy' },
              { href: '/supplement-guides', label: 'All Supplement Guides', desc: 'Complete guide hub' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-4 rounded-xl border border-border/60 bg-card hover:border-accent-emerald/30 transition-all"
              >
                <p className="font-medium text-sm text-foreground mb-1">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
                <ArrowRight className="w-3.5 h-3.5 mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SubPageLayout>
  );
}
