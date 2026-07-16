import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, TrendingUp, Zap, CheckCircle2, AlertTriangle, ExternalLink, Activity, Dna } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Pterostilbene Supplement Guide 2026 — Dosage, Safety Data & the Bioavailability Upgrade',
  description:
    'Complete pterostilbene guide: the human safety trial up to 250mg/day, the methoxy-group mechanism that improves on resveratrol absorption, dosing and timing, and an honest look at what the evidence does — and does not — show.',
  path: '/pterostilbene-supplement-guide',
  keywords: [
    'pterostilbene supplement guide',
    'pterostilbene dosage',
    'pterostilbene vs resveratrol',
    'pterostilbene safety',
    'pterostilbene bioavailability',
    'pterostilbene SIRT1',
    'pterostilbene longevity',
    'pterostilbene side effects',
    'blueberry stilbenoid supplement',
    'best pterostilbene supplement 2026',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Human safety / tolerability (up to 250mg/day)',
    finding:
      'A human dose-escalation safety trial (Riche 2013) evaluated pterostilbene up to 250mg/day over 6–8 weeks and established a favorable human safety and tolerability profile. This is a safety trial, not an efficacy trial — it did not test or confirm cognitive, longevity, or other benefit endpoints. Dose-escalation designs like this exist specifically to establish a tolerable upper range before anyone attempts a larger efficacy trial — it is a necessary early step, not a final verdict on whether the compound works.',
    quality: 'Established (safety only)',
    pmid: '23431291',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Human efficacy / outcome endpoints',
    finding:
      'No verified human efficacy or outcome RCT exists for pterostilbene in this guide. The Riche 2013 trial establishes safety only — do not interpret it as evidence of cognitive, metabolic, or longevity benefit. This is the single most important distinction in this entire guide: a compound can be well tolerated in humans without yet having demonstrated a specific human benefit, and pterostilbene currently sits in exactly that position.',
    quality: 'Not established',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    endpoint: 'Bioavailability vs resveratrol',
    finding:
      "Pterostilbene's two methoxy groups (versus resveratrol's two hydroxyl groups) substantially reduce intestinal glucuronidation, the primary bottleneck limiting resveratrol's oral bioavailability. This is a preclinical/mechanistic pharmacokinetic finding, not a head-to-head human bioavailability RCT. In practice, this is why pterostilbene's effective dose range (50–150mg) sits so much lower than resveratrol's (150–500mg) — less compound is lost before it reaches systemic circulation.",
    quality: 'Preclinical / mechanistic',
    pmid: undefined,
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'Plasma half-life',
    finding:
      'Pterostilbene\'s added lipophilicity extends plasma half-life to roughly 105 minutes, compared with roughly 14 minutes for resveratrol — a pharmacokinetic advantage established in preclinical models. A longer half-life generally means more consistent target engagement between doses, which is one reason pterostilbene is sometimes framed as the more "forgiving" of the two compounds if a dose is taken slightly off-schedule.',
    quality: 'Preclinical / mechanistic',
    pmid: undefined,
    color: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    endpoint: 'SIRT1 / AMPK activation mechanism',
    finding:
      'Mechanistically similar to resveratrol: allosteric SIRT1 activation and AMPK agonism via CAMKK2 signaling. This is well-established mechanistic pharmacology carried over from the broader stilbenoid literature, not a pterostilbene-specific human outcome trial. Because the mechanism is shared with resveratrol, most of what is known about resveratrol\'s downstream signaling (PGC-1α, FOXO3a, NF-κB) is reasonably assumed to apply to pterostilbene as well — though it has not been independently re-confirmed in a pterostilbene-specific human trial.',
    quality: 'Established pharmacology',
    pmid: undefined,
    color: 'text-accent-violet',
    badge: 'bg-accent-violet/10 border-accent-violet/20',
  },
  {
    endpoint: 'Human longevity RCTs',
    finding: 'No human longevity-endpoint trial exists for pterostilbene as of 2026. The evidence base here is a human safety trial plus preclinical mechanistic data — not a proven longevity outcome. Anyone using pterostilbene for longevity purposes should understand they are acting on a reasoned mechanistic bet, informed by a real safety trial, rather than a demonstrated human longevity benefit.',
    quality: 'Not established',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
];

const FAQ = [
  {
    q: 'Has pterostilbene actually been tested in humans?',
    a: "Yes, for safety. Riche et al. 2013 (Journal of Toxicology, PMID 23431291) conducted a human dose-escalation trial of pterostilbene up to 250mg/day over 6–8 weeks. It established a favorable human safety and tolerability profile at that dose range. It is important to be precise about what this trial did and did not show: it was a safety trial, not an efficacy trial. It did not test cognitive performance, metabolic outcomes, or longevity endpoints — so do not treat it as evidence that pterostilbene 'works' for any specific benefit. It tells you the compound is reasonably well tolerated at up to 250mg/day in humans, which is valuable information, just not the same thing as proof of a benefit.",
  },
  {
    q: 'Is pterostilbene actually more bioavailable than resveratrol?',
    a: "The mechanistic case is strong: pterostilbene's two methoxy groups resist the intestinal glucuronidation that degrades most of an oral resveratrol dose, and its added lipophilicity extends plasma half-life to roughly 105 minutes versus roughly 14 minutes for resveratrol. This pharmacokinetic advantage is well-supported in the preclinical literature. What does not yet exist is a dedicated human head-to-head bioavailability RCT directly comparing the two compounds at matched doses — so treat the bioavailability edge as mechanistically well-established rather than confirmed by a specific human comparison trial. In everyday terms: expect to need a meaningfully smaller milligram dose of pterostilbene than resveratrol to reach a comparable effect.",
  },
  {
    q: 'What is the correct pterostilbene dosage?',
    a: 'The commonly used range is 50–150mg of pterostilbene daily — notably lower than resveratrol\'s 150–500mg range, because pterostilbene achieves higher plasma concentrations per milligram. The human safety trial evaluated doses up to 250mg/day over 6–8 weeks without significant tolerability issues, which provides reasonable confidence for staying within or below that ceiling. There is no established evidence that doses above this range provide additional benefit, so there is little reason to push higher.',
  },
  {
    q: 'Does pterostilbene help with cognition or memory?',
    a: 'There is a plausible mechanistic pathway — pterostilbene has preclinical data suggesting BDNF upregulation, which is linked to neuronal support and memory function in animal models. However, this is preclinical/mechanistic evidence, not a confirmed human cognitive-outcome finding. The one verified human pterostilbene trial in this guide is a safety trial and did not measure cognitive endpoints. Be skeptical of marketing that presents the cognition angle as proven in humans — it is a reasonable hypothesis worth watching for future trials, not an established fact.',
  },
  {
    q: 'Does pterostilbene do anything resveratrol does not?',
    a: 'Yes — pterostilbene uniquely activates PPARα (peroxisome proliferator-activated receptor alpha) in addition to the SIRT1/AMPK mechanisms it shares with resveratrol. PPARα activation supports lipid oxidation and ketogenesis-adjacent metabolism, a mechanistic feature resveratrol lacks. This is established mechanistic pharmacology, not a human-outcome trial finding specific to pterostilbene, but it is a genuine structural difference between the two compounds rather than marketing distinction without substance.',
  },
  {
    q: 'What are the main pterostilbene side effects and interactions?',
    a: 'The human safety trial up to 250mg/day found pterostilbene generally well tolerated over 6–8 weeks. Like resveratrol, it may affect blood lipids and glucose at higher doses and carries a theoretical antiplatelet effect similar to other stilbenoids — monitor lipids if you are on statins, and use caution if you take blood thinners or have surgery scheduled within two weeks. Discuss with your physician before combining with any prescription medication, particularly if you are also taking other supplements with overlapping mechanisms.',
  },
  {
    q: 'Should I choose pterostilbene instead of resveratrol?',
    a: "If GI tolerance or convenience of a lower effective dose matters to you, pterostilbene's absorption profile makes it a reasonable choice — you need less of it to reach comparable plasma exposure, and it has a specific human safety trial behind it. Resveratrol has the deeper research history and the foundational mouse longevity study that anchors the entire sirtuin-activator category. Neither has a human longevity-outcome RCT. In practice, many people choose based on cost, product availability, and personal tolerance rather than a clear evidence-based winner. See the full comparison for the complete picture.",
  },
];

function buildPterostilbeneSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Pterostilbene Supplement Protocol Safely',
    description:
      'Evidence-based protocol for starting pterostilbene supplementation, grounded in the human safety trial (Riche 2013) and the mechanistic bioavailability advantage over resveratrol.',
    path: '/pterostilbene-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Understand what the human trial does and does not show',
        text: 'The Riche 2013 dose-escalation trial (PMID 23431291) established human safety up to 250mg/day over 6–8 weeks. It did not test efficacy endpoints — treat any benefit claim as mechanistic/preclinical, not proven by that trial.',
      },
      {
        name: 'Check for interactions and bleeding risk first',
        text: 'Pterostilbene may have a mild antiplatelet effect and can affect lipids and glucose at higher doses. If you take blood thinners, statins, or have surgery scheduled, talk to your physician before starting.',
      },
      {
        name: 'Start at 50mg in the evening with food',
        text: 'Begin at the low end of the 50–150mg range, taken in the evening (PM) in line with the same circadian SIRT1-expression rationale used for resveratrol.',
      },
      {
        name: 'Titrate toward 100–150mg if well tolerated',
        text: 'After 1–2 weeks without side effects, most protocols move toward the middle-to-upper end of the 50–150mg range, staying comfortably within the 250mg/day ceiling evaluated in the human safety trial.',
      },
      {
        name: 'Consider pairing with NMN, understanding the limits of the evidence',
        text: 'Pterostilbene shares the same SIRT1/AMPK mechanistic rationale for pairing with NMN that resveratrol has. This is reasoned mechanistic logic, not a combination tested in a dedicated human RCT.',
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
    headline: 'Pterostilbene Supplement Guide 2026 — Dosage, Safety Data & the Bioavailability Upgrade',
    description:
      'Complete evidence guide to pterostilbene: the Riche 2013 human safety trial, the methoxy-group mechanism behind its bioavailability advantage over resveratrol, dosing protocol, and an honest look at what has — and has not — been shown.',
    url: `${SITE.url}/pterostilbene-supplement-guide`,
    dateModified: '2026-07-14',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      {
        '@type': 'MedicalSubstance',
        name: 'Pterostilbene',
        description: 'Trans-stilbenoid found naturally in blueberries; methylated SIRT1 activator with improved bioavailability over resveratrol',
      },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Analysis of Safety from a Human Clinical Trial with Pterostilbene',
        author: 'Riche DM et al.',
        datePublished: '2013',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '23431291' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/23431291/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Pterostilbene Supplement Guide', path: '/pterostilbene-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function PterostilbeneGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildPterostilbeneSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-cyan" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider">Evidence Tier B · Pterostilbene</span>
          </div>

          <h1 className="heading-hero mb-4">
            Pterostilbene Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Pterostilbene is resveratrol&rsquo;s methylated cousin — with a real human safety trial behind it and a mechanistic bioavailability edge. Here is exactly what that trial showed, what it didn&rsquo;t, and how to dose it correctly, without overstating a safety study into a claim of proven benefit. This guide separates the human safety data from the preclinical mechanism so you can decide with clear eyes rather than marketing shorthand.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: '105 min', label: 'Plasma half-life', color: 'text-accent-emerald' },
              { value: '82%', label: 'Bioavailability', color: 'text-accent-cyan' },
              { value: '50–150mg', label: 'Evidence-informed dose', color: 'text-accent-violet' },
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
              href="/library/compounds/pterostilbene"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-cyan text-bg-base font-semibold text-sm hover:bg-accent-cyan/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/resveratrol-vs-pterostilbene"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
            >
              Pterostilbene vs Resveratrol
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check / comparison */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Pterostilbene vs Resveratrol: Is the Bioavailability Upgrade Worth It?</h2>
          <p className="text-body mb-4 max-w-2xl">
            Same core SIRT1/AMPK mechanism, different absorption profile — and a different type of human evidence behind each.
          </p>
          <p className="text-body mb-6 max-w-2xl">
            The two compounds are close chemical relatives — pterostilbene is essentially resveratrol with two hydroxyl groups swapped for methoxy groups. That single structural change is what drives nearly every practical difference between them: how much survives first-pass intestinal metabolism, how long it circulates before clearance, and how large a dose you actually need to reach a comparable tissue concentration. Understanding that one change explains most of the table below.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">PTEROSTILBENE</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-violet">RESVERATROL</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Oral bioavailability',
                    ptero: 'Substantially higher — methoxy groups resist intestinal glucuronidation',
                    resv: '~1% (standard powder) before glucuronidation losses',
                    winner: 'ptero',
                  },
                  {
                    metric: 'Plasma half-life',
                    ptero: '~105 minutes',
                    resv: '~14 minutes',
                    winner: 'ptero',
                  },
                  {
                    metric: 'Effective dose range',
                    ptero: '50–150mg (lower dose, comparable exposure)',
                    resv: '150–500mg trans-resveratrol',
                    winner: 'ptero',
                  },
                  {
                    metric: 'Human trial type available',
                    ptero: 'Dose-escalation safety trial up to 250mg/day (Riche 2013)',
                    resv: 'Foundational mouse longevity study (Baur 2006) — not human',
                    winner: 'different',
                  },
                  {
                    metric: 'Human efficacy RCT',
                    ptero: 'None — the human trial is safety-only',
                    resv: 'None verified for a specific outcome endpoint',
                    winner: 'tie',
                  },
                  {
                    metric: 'Unique mechanism add-on',
                    ptero: 'PPARα activation — lipid oxidation / ketogenesis support',
                    resv: 'None beyond shared SIRT1/AMPK pathway',
                    winner: 'ptero',
                  },
                  {
                    metric: 'Research history / depth',
                    ptero: 'Newer to the supplement market; fewer total studies',
                    resv: 'Decades of research anchored by the landmark 2006 study',
                    winner: 'resv',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className={`p-4 text-xs ${row.winner === 'ptero' ? 'text-accent-cyan font-semibold' : 'text-muted-foreground'}`}>{row.ptero}</td>
                    <td className={`p-4 text-xs ${row.winner === 'resv' ? 'text-accent-violet font-semibold' : 'text-muted-foreground'}`}>{row.resv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The verdict</p>
            <p className="text-sm text-muted-foreground">
              The bioavailability upgrade is real and mechanistically well-supported — you need less pterostilbene to reach comparable plasma exposure, and it comes with an actual human safety trial rather than relying entirely on animal data. What it doesn&rsquo;t have is resveratrol&rsquo;s decades-deep research base or a human efficacy trial of its own. If absorption and tolerability are your priority, pterostilbene is a reasonable upgrade to evaluate. If you already tolerate resveratrol well and have an established stack, there is no urgent mechanistic reason to switch — the underlying pathway is identical either way. Read the full <Link href="/resveratrol-supplement-guide" className="text-accent-violet hover:underline">resveratrol guide</Link> and the <Link href="/library/compare/resveratrol-vs-pterostilbene" className="text-accent-violet hover:underline">head-to-head comparison</Link> before deciding.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence table */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Evidence Summary by Endpoint</h2>
          <p className="text-body-sm text-muted-foreground mb-8">Click the PMID to view the source study on PubMed. Pterostilbene has exactly one verified human citation in this guide — a safety trial — and we are careful not to overstate what it showed. Every other row below is explicitly labeled as preclinical, mechanistic, or not yet established, so you always know the strength of the claim you are reading.</p>

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
            A conservative ramp based on the commonly used 50–150mg range, staying well within the 250mg/day ceiling evaluated in the human safety trial. Because pterostilbene reaches meaningfully higher plasma concentrations per milligram than resveratrol, there is little reason to push toward the upper end of the studied range unless you have a specific, physician-discussed reason to do so — more is not automatically better once adequate target engagement is reached.
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
                  { phase: 'Week 1–2 (ramp)', dose: '50mg/day', timing: 'PM, with a meal', note: 'Assess tolerance' },
                  { phase: 'Week 3+ (maintenance)', dose: '100–150mg/day', timing: 'PM, with dinner', note: 'Within human safety trial range' },
                  { phase: 'Upper ceiling (trial-tested)', dose: 'Up to 250mg/day', timing: 'PM', note: 'Evaluated in Riche 2013 dose-escalation trial — not a benefit dose, a tested safety ceiling' },
                ].map((row) => (
                  <tr key={row.phase} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium">{row.phase}</td>
                    <td className="p-4 font-mono text-accent-cyan">{row.dose}</td>
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
                <li>· Take in the evening (PM) — same circadian SIRT1-expression rationale as resveratrol</li>
                <li>· Start low (50mg) and titrate to 100–150mg over 1–2 weeks</li>
                <li>· Stay within the 250mg/day ceiling evaluated in the human safety trial</li>
                <li>· Pair with a meal for consistent absorption</li>
                <li>· Give it 8–12 weeks before evaluating subjective effects, and don&rsquo;t expect the human safety trial to predict a specific benefit</li>
                <li>· If switching from resveratrol, reduce the milligram dose substantially rather than substituting on a 1:1 basis — pterostilbene is more concentrated in effect per milligram</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· May lower LDL and blood glucose at higher doses — monitor labs if on statins or glucose-lowering medication</li>
                <li>· Theoretical antiplatelet effect similar to other stilbenoids — caution with blood thinners</li>
                <li>· Stop at least two weeks before any scheduled surgery</li>
                <li>· Not established as safe in pregnancy or nursing — avoid</li>
                <li>· Do not treat the human safety trial as evidence of a specific benefit — it tested tolerability, not outcomes</li>
                <li>· If combining with resveratrol or other stilbenoids, discuss total stilbenoid exposure with your physician rather than simply adding doses together</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Pterostilbene Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Activity,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Methoxy Groups Beat Glucuronidation',
                body: "Pterostilbene carries two methoxy groups where resveratrol has two hydroxyl groups. This structural difference dramatically reduces glucuronidation in the intestinal wall — the primary reason resveratrol has poor oral bioavailability — while also increasing lipophilicity for better cellular membrane penetration. In effect, the same enzymes that would normally tag resveratrol for rapid elimination have a much harder time recognizing pterostilbene as a substrate, so more of the original dose survives intact.",
              },
              {
                icon: Zap,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Shared SIRT1 / AMPK Pathway',
                body: 'Mechanistically similar to resveratrol: allosteric SIRT1 activation and AMPK agonism via CAMKK2 signaling. Because more of an oral dose survives first-pass metabolism, pterostilbene reaches several-fold higher plasma concentrations per equivalent milligram dose. This is why the effective dose range for pterostilbene sits so much lower than resveratrol\'s — the same downstream pathway is being engaged, just with less compound lost along the way.',
              },
              {
                icon: TrendingUp,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'PPARα Activation (Unique to Pterostilbene)',
                body: 'Beyond the SIRT1/AMPK mechanisms it shares with resveratrol, pterostilbene also activates PPARα (peroxisome proliferator-activated receptor alpha), adding a lipid-oxidation and ketogenesis-supporting effect that resveratrol lacks. This receptor plays a central role in switching cellular metabolism toward burning fat for fuel, which is the mechanistic basis for pterostilbene sometimes being discussed alongside compounds used in metabolic and lipid-focused protocols.',
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
          <h2 className="heading-section mb-3">How Pterostilbene Addresses the Hallmarks of Aging</h2>
          <p className="text-body mb-8 max-w-2xl">
            Pterostilbene&rsquo;s mechanism maps onto three of the twelve Hallmarks of Aging — largely mirroring resveratrol&rsquo;s pathway, with an added epigenetic angle from its methylation chemistry. The rationale below is well-established mechanistic pharmacology; the human efficacy evidence for pterostilbene specifically remains limited to the safety trial described above. Because the underlying SIRT1/AMPK biology is shared with resveratrol, most of the mechanistic reasoning here draws on the broader stilbenoid literature rather than pterostilbene-only findings — we flag that distinction throughout rather than blurring it.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Mitochondrial Dysfunction',
                body: 'Shared SIRT1/AMPK activation supports mitochondrial biogenesis and metabolic efficiency through the same PGC-1α-linked pathway resveratrol uses, plus PPARα activation adding a direct lipid-oxidation route that supports mitochondrial fuel utilization. The combination of better absorption and an added lipid-metabolism mechanism is why pterostilbene is sometimes discussed as a more complete mitochondrial-support compound than resveratrol alone, even without a dedicated pterostilbene-specific human trial confirming the difference.',
                href: '/library/mitochondrial-dysfunction',
                label: 'Mitochondrial Dysfunction hallmark',
              },
              {
                icon: ShieldCheck,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Chronic Inflammation',
                body: 'NF-κB suppression via the shared SIRT1 mechanism provides the same mechanistic rationale for dampening chronic low-grade inflammation that resveratrol carries — again, a mechanistic pathway rather than a pterostilbene-specific human-outcome finding. Because pterostilbene achieves higher and more sustained plasma concentrations, the mechanistic case for consistent NF-κB engagement over a dosing interval is, in theory, somewhat stronger — though this has not been tested head-to-head in humans.',
                href: '/library/chronic-inflammation',
                label: 'Chronic Inflammation hallmark',
              },
              {
                icon: Dna,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Epigenetic Alterations',
                body: "Pterostilbene's SIRT1-mediated deacetylase activity influences histone acetylation states relevant to epigenetic maintenance. Its higher plasma exposure per dose means more consistent target engagement over time — a mechanistic argument for epigenetic-pathway relevance, not a confirmed human epigenetic-clock outcome. Preclinical work also points to BDNF upregulation as a downstream effect of this pathway, which is the basis for pterostilbene's cognitive-support reputation — again, mechanistic reasoning rather than a confirmed human cognitive trial result.",
                href: '/library/epigenetic-alterations',
                label: 'Epigenetic Alterations hallmark',
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
                title: 'Know what the human trial actually tested',
                body: 'The Riche 2013 dose-escalation trial (PMID 23431291) established safety up to 250mg/day over 6–8 weeks. It did not measure cognitive, metabolic, or longevity outcomes — treat any benefit claim as preclinical or mechanistic reasoning, not proven by that trial. This distinction is the single most important thing to internalize before starting.',
              },
              {
                n: '02',
                title: 'Check bleeding risk, statins, and glucose medications',
                body: 'Pterostilbene may lower LDL and blood glucose at higher doses and carries a theoretical antiplatelet effect. Talk to your physician first if you take statins, glucose-lowering medications, or blood thinners. Do not assume a natural, blueberry-derived compound is automatically free of interaction risk.',
              },
              {
                n: '03',
                title: 'Start at 50mg in the evening with food',
                body: 'Take your first dose with dinner. Evening dosing mirrors the same circadian SIRT1-expression rationale used for resveratrol. Note how you feel over the first week — most people tolerate this starting dose without any noticeable side effects.',
              },
              {
                n: '04',
                title: 'Titrate to 100–150mg if well tolerated',
                body: 'After one to two weeks without side effects, move toward the middle of the 50–150mg range — well within the 250mg/day ceiling the human safety trial evaluated. There is little rationale for exceeding this range without a specific, physician-discussed reason.',
              },
              {
                n: '05',
                title: 'Track your own biomarkers rather than assuming a benefit',
                body: "Because the only verified human trial for pterostilbene is a safety trial, your own lipid panel, fasting glucose, and subjective response over 8–12 weeks are your best evidence of individual effect. Don't rely on marketing claims that imply proven efficacy — let your own tracked data, not a supplement label, tell you whether it's working for you.",
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
          <h2 className="heading-section mb-8">Pterostilbene FAQ</h2>
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
                  Pterostilbene may lower LDL cholesterol and blood glucose at higher doses. If you take statins or glucose-lowering medications, monitor labs and inform your physician before starting. It also carries a theoretical antiplatelet effect — stop at least two weeks before any scheduled surgery. As with any compound sold over the counter, the absence of a prescription requirement does not mean the absence of interaction risk — treat it with the same seriousness you would a new prescription medication. TNiC content is educational and not a substitute for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-page max-w-4xl">
          <div className="rounded-2xl border border-accent-cyan/20 bg-accent-cyan/[0.04] p-8 md:p-10 text-center">
            <h2 className="heading-section mb-3">Build Your Sirtuin Stack</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Pterostilbene pairs with NMN in TNiC&rsquo;s SIRT1-focused presets as a higher-bioavailability alternative to resveratrol. Take the quiz to get a personalized protocol based on your current stack, goals, and any contraindications you flag along the way.
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
                href="/resveratrol-supplement-guide"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
              >
                Resveratrol supplement guide
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/nmn"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
              >
                NMN compound deep-dive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/resveratrol"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Resveratrol compound deep-dive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Educational content only — not medical advice. Pterostilbene is a dietary supplement, not FDA-approved to treat or prevent any disease. The human trial cited here (Riche 2013) evaluated safety only, not efficacy. Consult your physician before starting, especially if you take statins, glucose-lowering medications, or blood thinners.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
