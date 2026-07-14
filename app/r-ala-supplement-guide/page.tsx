import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, TrendingUp, Zap, CheckCircle2, AlertTriangle, ExternalLink, Activity, Dna } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'R-ALA (R-Alpha Lipoic Acid) Supplement Guide 2026 — Dosage, Evidence & Racemic ALA Reality Check',
  description:
    'Complete R-ALA guide: the mitochondrial redox-cofactor mechanism, correct 300-600mg dosing protocol, and why plain "alpha lipoic acid" on a label usually means you are getting half the effective dose.',
  path: '/r-ala-supplement-guide',
  keywords: [
    'r-ala supplement guide',
    'r-alpha lipoic acid',
    'r-ala vs alpha lipoic acid',
    'r-ala dosage',
    'stabilized r-lipoic acid',
    'r-ala mitochondria',
    'alpha lipoic acid enantiomer',
    'r-ala glutathione',
    'best r-ala supplement 2026',
    'r-ala side effects',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Mitochondrial redox-cofactor recycling (TCA cycle)',
    finding:
      'A 2007 mechanistic review describes how ALA/DHLA function as a redox couple that recycles the cofactors mitochondria need for pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase activity in aging tissue. This is a review of mechanism, not a human clinical-outcomes trial.',
    quality: 'Mechanistic review',
    pmid: '17476591',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Antioxidant network regeneration (vitamin C / vitamin E)',
    finding:
      'Established redox biochemistry: the ALA/DHLA couple can reduce oxidized ascorbate and tocopherol back to their active forms. This is well-characterized cell biology; no dedicated human RCT is cited in this guide for the specific magnitude of the effect.',
    quality: 'Established mechanism',
    pmid: undefined,
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'Glutathione (GSH) cycle support',
    finding:
      'DHLA (the reduced form of ALA) can reduce oxidized glutathione (GSSG) back to GSH, indirectly amplifying the glutathione cycle. This is the mechanistic basis for stacking R-ALA with GlyNAC. No dedicated outcomes citation is used here.',
    quality: 'Established mechanism',
    pmid: undefined,
    color: 'text-accent-violet',
    badge: 'bg-accent-violet/10 border-accent-violet/20',
  },
  {
    endpoint: 'Human clinical / longevity outcomes',
    finding:
      'Dedicated human longevity-outcome RCTs for R-ALA specifically are limited. The case for R-ALA is mechanistic — TCA cycle cofactor recycling and antioxidant regeneration — rather than a large human outcome-trial base. Be skeptical of any source citing a specific human lifespan or biological-age figure for R-ALA.',
    quality: 'Preclinical / mechanistic only',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
];

const FAQ = [
  {
    q: 'What is the actual difference between R-ALA and regular alpha lipoic acid?',
    a: "Alpha lipoic acid (ALA) has two mirror-image forms — R and S — because the molecule has a chiral carbon. Only the R-enantiomer occurs naturally in the body and fits the binding pocket of mitochondrial enzymes like pyruvate dehydrogenase. Most inexpensive ALA supplements are racemic: a roughly 50/50 R/S mixture made by lower-cost synthesis. S-ALA is not mitochondrially active, and worse, it competes with R-ALA for the same intestinal transporters and enzyme binding sites — so a racemic supplement does not just waste the S-half, it can actively reduce uptake of the R-half. 'R-ALA' or 'stabilized R-lipoic acid' on a label means you are getting the bioactive form without that competition.",
  },
  {
    q: 'Is R-ALA proven to extend human lifespan or slow aging?',
    a: 'No — and it is important to be precise here. The verified science on R-ALA is mechanistic: it is a genuine cofactor for two rate-limiting TCA cycle enzymes and a genuine antioxidant recycler. That is real, established biochemistry. What does not exist is a dedicated human RCT showing R-ALA supplementation extends lifespan or reverses a biological-age marker. TNiC rates R-ALA Tier B — a strong mechanistic case, not a large human outcomes trial base. Anyone citing a specific human longevity result for R-ALA is going beyond what the literature currently shows.',
  },
  {
    q: 'What is the correct R-ALA dosage?',
    a: 'The commonly used range is 300–600mg of R-ALA per day, taken roughly 30 minutes before a meal on an empty stomach to maximize intestinal absorption. Many protocols start at 300mg once in the morning for 1–2 weeks, then split to 300mg AM and 300mg PM (600mg/day total) if well tolerated. There is no dedicated long-term dose-ranging RCT for R-ALA specifically, so this protocol is derived from absorption pharmacokinetics and general lipoic acid dosing practice rather than a single definitive trial.',
  },
  {
    q: 'Can I take R-ALA with GlyNAC or NMN?',
    a: "Yes — R-ALA is commonly stacked with both. R-ALA's glutathione-cycle support (via DHLA reducing GSSG back to GSH) pairs mechanistically with GlyNAC, which supplies the raw amino acids (glycine and cysteine) glutathione synthesis needs. R-ALA's role as a TCA cycle cofactor also complements NMN's NAD+ restoration — one supports mitochondrial fuel flux, the other supports the NAD+-dependent enzymes that use that fuel. There is no known adverse interaction between the three.",
  },
  {
    q: 'What are R-ALA side effects and who should be cautious?',
    a: 'ALA lowers blood glucose, so anyone on insulin or sulfonylureas should monitor closely — combining them can cause hypoglycemia. In individuals with unrecognized thiamine (vitamin B1) deficiency, lipoic acid supplementation has been flagged as a caution in clinical nutrition literature, since ALA metabolism has some overlap with thiamine-dependent pathways. At the higher end of the dose range, especially fasted, some people experience GI upset (nausea, cramping). Safety data in pregnancy and nursing is limited, so avoid without physician guidance. As with most supplements, there is no dedicated multi-year human safety RCT for R-ALA specifically at supplemental doses.',
  },
  {
    q: 'Why is R-ALA so much more expensive than regular alpha lipoic acid?',
    a: "Two reasons. First, isolating the single R-enantiomer instead of manufacturing a cheap racemic mixture is a more complex synthesis. Second, unstabilized R-lipoic acid is chemically less stable at room temperature than the racemic form, so manufacturers use stabilized complexes (such as an R-lipoic acid sodium salt) which add further cost. The tradeoff is that a 300mg R-ALA dose delivers roughly the mitochondrially active load of a much larger racemic dose — so the higher price per label-milligram is not necessarily a higher price per effective milligram.",
  },
  {
    q: 'Should R-ALA be taken with food or on an empty stomach?',
    a: 'On an empty stomach, roughly 30 minutes before a meal, is the standard recommendation — food in the gut competes with lipoic acid for intestinal absorption and can meaningfully reduce uptake. This differs from berberine or Ca-AKG dosing logic; R-ALA absorption specifically benefits from an empty stomach. If GI upset occurs at this timing, some people move to just before a very light meal rather than fully fasted, accepting a modest absorption tradeoff for tolerability.',
  },
];

function buildRAlaSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start an R-ALA (R-Alpha Lipoic Acid) Supplement Protocol',
    description:
      'Evidence-informed protocol for starting R-ALA supplementation, based on its role as a TCA cycle cofactor and antioxidant recycler.',
    path: '/r-ala-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Confirm the label actually says R-ALA',
        text: "Look for 'R-ALA', 'R-alpha lipoic acid', or 'stabilized R-lipoic acid' on the supplement facts panel. A product labeled simply 'Alpha Lipoic Acid' or 'ALA' with no enantiomer specified should be assumed racemic (50/50 R/S) unless stated otherwise.",
      },
      {
        name: 'Start at 300mg once daily, 30 minutes before breakfast',
        text: 'Take on an empty stomach — food competes with lipoic acid for intestinal absorption. Starting at the lower end for 1–2 weeks allows you to assess tolerance before increasing the dose.',
      },
      {
        name: 'Titrate to an AM/PM split if well tolerated',
        text: 'Increase to 300mg in the morning and 300mg in the early evening (600mg/day total), each roughly 30 minutes before a meal, if the starting dose was well tolerated and you want the higher end of the evidence-informed range.',
      },
      {
        name: 'Consider stacking with GlyNAC or NMN',
        text: "R-ALA's glutathione-cycle support mechanistically complements GlyNAC, and its TCA cofactor role complements NMN's NAD+ restoration. There is no known adverse interaction between the three.",
      },
      {
        name: 'Reassess at 8–12 weeks, especially if on glucose-lowering medication',
        text: 'ALA lowers blood glucose. If you take insulin or a sulfonylurea, monitor glucose closely after starting and discuss the combination with your physician. For everyone else, an 8–12 week check-in is a reasonable point to evaluate whether to continue, adjust dose, or stop.',
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
    headline: 'R-ALA (R-Alpha Lipoic Acid) Supplement Guide 2026 — Dosage, Evidence & Racemic ALA Reality Check',
    description:
      'Complete evidence guide to R-ALA: mitochondrial redox-cofactor mechanism, correct dosing, why the R-enantiomer matters versus racemic alpha lipoic acid, and honest limits of the human evidence base.',
    url: `${SITE.url}/r-ala-supplement-guide`,
    dateModified: '2026-07-14',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      {
        '@type': 'MedicalSubstance',
        name: 'R-Alpha Lipoic Acid (R-ALA)',
        description: 'Bio-active enantiomer of alpha lipoic acid; mitochondrial TCA cycle cofactor and antioxidant-network regenerator',
      },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Mitochondrial ageing and the beneficial role of alpha-lipoic acid',
        author: 'Liu J',
        datePublished: '2007',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '17476591' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/17476591/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'R-ALA Supplement Guide', path: '/r-ala-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function RAlaGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildRAlaSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-emerald" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-emerald uppercase tracking-wider">Evidence Tier B · Redox Cycling · R-ALA</span>
          </div>

          <h1 className="heading-hero mb-4">
            R-ALA (R-Alpha Lipoic Acid) Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            R-ALA is the mitochondrially active form of alpha lipoic acid — a TCA cycle cofactor and antioxidant-network recycler. Here is what the evidence actually supports, and why the letter &ldquo;R&rdquo; on the label determines whether you&rsquo;re getting the real thing or half of it.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '85%', label: 'Bioavailability (R-ALA)', color: 'text-accent-emerald' },
              { value: '300–600mg', label: 'Evidence-informed dose', color: 'text-accent-cyan' },
              { value: '3', label: 'Distinct redox roles', color: 'text-accent-violet' },
              { value: 'Tier B', label: 'Mechanistic evidence', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/rala"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-emerald text-bg-base font-semibold text-sm hover:bg-accent-emerald/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compounds/glynac"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
            >
              R-ALA + GlyNAC synergy
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check: enantiomer matters */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">R-ALA vs Racemic (R/S) Alpha Lipoic Acid: Why the Enantiomer Matters</h2>
          <p className="text-body mb-6 max-w-2xl">
            Alpha lipoic acid has a chiral carbon, which means it exists as two mirror-image forms — R and S. Only the R-enantiomer is produced naturally in the body and fits the binding pocket of mitochondrial enzymes. Most inexpensive ALA supplements are racemic: a roughly 50/50 R/S mixture that is cheaper and more stable to manufacture than the isolated R-form.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-emerald">R-ALA (STABILIZED)</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">RACEMIC (R/S) ALA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Mitochondrial activity',
                    ra: 'Fully active — the endogenous form; fits the PDH and AKG dehydrogenase binding pocket',
                    racemic: 'Only the R-fraction (roughly half the mixture) is mitochondrially active',
                    winner: 'ra',
                  },
                  {
                    metric: 'S-ALA interference',
                    ra: 'None — no competing enantiomer present',
                    racemic: 'S-ALA competes with R-ALA for the same intestinal transporters and enzyme binding sites, reducing net uptake of the active form',
                    winner: 'ra',
                  },
                  {
                    metric: 'Effective dose at same label dose',
                    ra: 'A 300mg label roughly equals 300mg of active R-ALA',
                    racemic: 'A 600mg label roughly delivers the R-ALA load of a 300mg R-ALA product — a unit-dose estimate, not a measured clinical head-to-head',
                    winner: 'ra',
                  },
                  {
                    metric: 'Chemical stability',
                    ra: 'Less stable at room temperature unless complexed — look for a stabilized salt form',
                    racemic: 'More chemically stable and cheaper to produce, part of why it remains the market default',
                    winner: 'racemic',
                  },
                  {
                    metric: 'Cost per effective mg',
                    ra: 'Higher price per label-mg, but each mg is active',
                    racemic: 'Lower price per label-mg, but roughly half the mixture is inert for mitochondrial purposes and may compete with the active half',
                    winner: 'ra',
                  },
                  {
                    metric: 'Label clarity',
                    ra: "States 'R-ALA', 'R-lipoic acid', or 'stabilized R-lipoic acid' explicitly",
                    racemic: "Often just says 'Alpha Lipoic Acid' or 'ALA' with no enantiomer specified — assume racemic unless stated",
                    winner: 'ra',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className={`p-4 text-xs ${row.winner === 'ra' ? 'text-accent-emerald font-semibold' : 'text-muted-foreground'}`}>{row.ra}</td>
                    <td className={`p-4 text-xs ${row.winner === 'racemic' ? 'text-accent-cyan font-semibold' : 'text-muted-foreground'}`}>{row.racemic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The verdict</p>
            <p className="text-sm text-muted-foreground">
              Racemic ALA is not a scam — the R-fraction inside it is genuinely active, and racemic ALA still has real, independently documented antioxidant activity. But a supplement labeled simply &ldquo;alpha lipoic acid&rdquo; without specifying R-ALA or stabilized R-lipoic acid is very likely delivering roughly half the mitochondrially active dose you would assume from the label — and the S-ALA in the mixture may be actively competing with the R-fraction for uptake. If your goal is the TCA-cofactor and mitochondrial-recycling mechanism specifically, pay for the enantiomer, not just the milligrams.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence table */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Evidence Summary by Endpoint</h2>
          <p className="text-body-sm text-muted-foreground mb-8">Click the PMID to view the source paper on PubMed.</p>

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
            R-ALA absorption is time-sensitive: taking it 30 minutes before a meal, on an empty stomach, meaningfully improves uptake versus taking it with food. This protocol reflects that pharmacokinetic reality rather than a single definitive dose-ranging RCT, since none exists for R-ALA specifically.
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
                  { phase: 'Week 1–2 (start)', dose: '300mg/day', timing: '1×, 30 min before breakfast', note: 'Confirm GI tolerance fasted' },
                  { phase: 'Week 3+ (maintenance)', dose: '300–600mg/day', timing: 'AM/PM split, 30 min before meals', note: 'Higher end for higher oxidative load' },
                  { phase: 'Long-term', dose: '300–600mg/day', timing: 'Ongoing, same timing', note: 'No established need to cycle; review periodically with a physician' },
                ].map((row) => (
                  <tr key={row.phase} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium">{row.phase}</td>
                    <td className="p-4 font-mono text-accent-emerald">{row.dose}</td>
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
                <li>· Confirm the label says &ldquo;R-ALA&rdquo; or &ldquo;stabilized R-lipoic acid&rdquo; — plain &ldquo;alpha lipoic acid&rdquo; is very likely racemic</li>
                <li>· Take 30 minutes before meals on an empty stomach — food in the gut competes for absorption</li>
                <li>· Split into AM/PM doses (e.g. 300mg + 300mg) at the higher end of the range rather than one large dose</li>
                <li>· Pair with GlyNAC or NAC if the goal is glutathione support — R-ALA amplifies GSH recycling, GlyNAC supplies the raw materials</li>
                <li>· Store stabilized R-lipoic acid per label instructions — some forms are less heat/humidity stable than racemic ALA</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· ALA lowers blood glucose — monitor closely if on insulin or a sulfonylurea; combined use risks hypoglycemia</li>
                <li>· In unrecognized thiamine (vitamin B1) deficiency, lipoic acid supplementation is a flagged caution in clinical nutrition literature</li>
                <li>· GI upset (nausea, cramping) is possible at the top of the dose range, especially fully fasted</li>
                <li>· Pregnancy/nursing safety data is limited — avoid without physician guidance</li>
                <li>· No dedicated multi-year human safety RCT exists for R-ALA specifically at supplemental doses</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How R-ALA Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'TCA Cycle Cofactor',
                body: 'R-ALA is a required prosthetic group for pyruvate dehydrogenase (PDH) and alpha-ketoglutarate dehydrogenase — two rate-limiting enzyme complexes in the TCA cycle. Without adequate ALA availability, these enzymes cannot efficiently hand off acetyl groups, slowing mitochondrial fuel oxidation at its source.',
              },
              {
                icon: TrendingUp,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Direct Antioxidant / Redox Recycler',
                body: 'Beyond its cofactor role, R-ALA acts as a direct antioxidant via a thioredoxin-like mechanism, reducing oxidized vitamin C and vitamin E back to their active, radical-scavenging forms. This extends the working lifespan of the antioxidant vitamins already circulating in your system.',
              },
              {
                icon: Activity,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Glutathione Cycle Amplifier',
                body: 'R-ALA reduces to dihydrolipoic acid (DHLA), which in turn reduces oxidized glutathione (GSSG) back to its active form (GSH). This makes R-ALA an indirect glutathione precursor/recycler — the mechanistic basis for stacking it with direct GSH-building compounds like GlyNAC.',
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
          <h2 className="heading-section mb-3">How R-ALA Addresses the Hallmarks of Aging</h2>
          <p className="text-body mb-8 max-w-2xl">
            Of the twelve hallmarks of aging, R-ALA&rsquo;s redox chemistry maps most directly onto two: mitochondrial dysfunction and loss of proteostasis. Both connections follow from the same core mechanism — R-ALA&rsquo;s role as a mitochondrial cofactor and cellular redox regulator — rather than from separate, unrelated pathways.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-accent-emerald/20 bg-accent-emerald/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4.5 h-4.5 text-accent-emerald" aria-hidden="true" />
                <h3 className="font-semibold text-accent-emerald">Mitochondrial Dysfunction</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Aging mitochondria show declining efficiency in the TCA cycle enzymes that convert nutrients into usable energy. Because R-ALA is a required prosthetic group for PDH and alpha-ketoglutarate dehydrogenase, adequate R-ALA availability directly supports the rate-limiting steps of mitochondrial fuel oxidation — the mechanistic rationale underpinning its use in mitochondrial-support stacks.
              </p>
              <Link
                href="/library/mitochondrial-dysfunction"
                className="focus-ring interactive inline-flex items-center gap-1.5 text-xs font-mono text-accent-emerald hover:underline"
              >
                Mitochondrial Dysfunction hallmark <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
            <div className="rounded-xl border border-accent-violet/20 bg-accent-violet/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Dna className="w-4.5 h-4.5 text-accent-violet" aria-hidden="true" />
                <h3 className="font-semibold text-accent-violet">Loss of Proteostasis</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Protein folding and disulfide-bond formation are redox-sensitive processes, and oxidative damage to proteins is a documented contributor to proteostasis decline. By regenerating the glutathione and antioxidant-vitamin pools that help buffer cellular redox state, R-ALA supports the broader antioxidant environment that protein quality-control systems depend on — a mechanistic rationale, not a claim backed by a dedicated proteostasis-outcome trial.
              </p>
              <Link
                href="/library/loss-of-proteostasis"
                className="focus-ring interactive inline-flex items-center gap-1.5 text-xs font-mono text-accent-violet hover:underline"
              >
                Loss of Proteostasis hallmark <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
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
                title: 'Confirm the label actually says R-ALA',
                body: "Look for 'R-ALA', 'R-alpha lipoic acid', or 'stabilized R-lipoic acid' on the supplement facts panel. Plain 'Alpha Lipoic Acid' or 'ALA' with no enantiomer specified should be assumed racemic (50/50 R/S) unless the manufacturer states otherwise.",
              },
              {
                n: '02',
                title: 'Start at 300mg once daily, 30 minutes before breakfast',
                body: 'Take on an empty stomach — food competes with lipoic acid for intestinal absorption. A 1–2 week starting period at this dose lets you confirm tolerance before increasing.',
              },
              {
                n: '03',
                title: 'Titrate to an AM/PM split if well tolerated',
                body: 'Increase to 300mg in the morning and 300mg in the early evening (600mg/day total), each roughly 30 minutes before a meal, if the starting dose caused no GI issues and you want the higher end of the range.',
              },
              {
                n: '04',
                title: 'Consider stacking with GlyNAC or NMN',
                body: "R-ALA's glutathione-cycle support mechanistically complements GlyNAC's glutathione precursors, and its TCA cofactor role complements NMN's NAD+ restoration. No adverse interaction between the three is known.",
              },
              {
                n: '05',
                title: 'Reassess at 8–12 weeks, especially on glucose-lowering medication',
                body: 'ALA lowers blood glucose — if you take insulin or a sulfonylurea, monitor glucose closely and involve your physician. For everyone else, 8–12 weeks is a reasonable point to evaluate whether to continue, adjust dose, or stop.',
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
          <h2 className="heading-section mb-8">R-ALA FAQ</h2>
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
                  R-ALA lowers blood glucose. If you take diabetes medications (insulin, sulfonylureas, or other glucose-lowering drugs), combining R-ALA without physician guidance can cause hypoglycemia. Individuals with unrecognized thiamine deficiency should also exercise caution, per established clinical nutrition guidance. TNiC content is educational and not a substitute for medical advice — talk to your physician before starting, especially if pregnant, nursing, or on any glucose-affecting medication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-page max-w-4xl">
          <div className="rounded-2xl border border-accent-emerald/20 bg-accent-emerald/[0.04] p-8 md:p-10 text-center">
            <h2 className="heading-section mb-3">Build Your Mitochondrial Redox Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              R-ALA is a component in TNiC&rsquo;s NRF2 and Full-Spectrum presets, commonly paired with GlyNAC and NMN. Take the quiz to get a personalized protocol.
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
                href="/library/compounds/rala"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
              >
                Compound deep-dive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/glynac"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
              >
                GlyNAC compound page
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/longevity-supplements-guide"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
              >
                Full supplement guide
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Educational content only — not medical advice. R-ALA is a dietary supplement, not FDA-approved to treat or prevent any disease. Consult your physician before starting, especially if you take glucose-lowering medications or have a diagnosed thiamine deficiency.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
