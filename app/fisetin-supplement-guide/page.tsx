import Link from 'next/link';
import {
  ArrowRight,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Beaker,
  Waves,
  Repeat,
  Heart,
  Network,
  Activity,
} from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Fisetin Supplement Guide 2026 — Dosage, Evidence & the Human Trial Reality Check',
  description:
    "Complete fisetin guide: what the 2018 mouse senolytic study actually found, why pulse-dosing is used, and the honest truth about human trial status — Mayo Clinic's published pilots used dasatinib+quercetin, not fisetin alone. Dosing protocol, fisetin vs quercetin, and safety.",
  path: '/fisetin-supplement-guide',
  keywords: [
    'fisetin supplement guide',
    'fisetin dosage',
    'fisetin vs quercetin',
    'fisetin senolytic',
    'fisetin clinical trial',
    'fisetin side effects',
    'best fisetin supplement 2026',
    'fisetin pulse dosing',
    'fisetin human trial',
    'senolytic supplements',
  ],
});

const EVIDENCE_TABLE = [
  {
    endpoint: 'Senolytic potency vs. other flavonoids (mice, cells)',
    finding:
      'In a screen of 10 flavonoids, fisetin emerged as the single most potent senolytic tested — the basis for its reputation as the leading flavonoid senolytic candidate. This head-to-head screening design is what distinguishes fisetin\'s evidence from a simple "flavonoids are healthy" claim; it was specifically compared against nine other structurally related compounds and came out on top.',
    quality: 'Strong (preclinical)',
    pmid: '30279143',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Senescence marker clearance across tissues (mice)',
    finding:
      'Both acute and intermittent ("pulse") dosing reduced senescence markers across multiple tissues in aged mice — the origin of the pulse-dosing protocol used in most fisetin regimens today. The fact that senescence markers dropped across multiple tissue types, rather than just one, is part of what made this result notable within the senolytic field.',
    quality: 'Strong (preclinical)',
    pmid: '30279143',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Lifespan extension (mice)',
    finding:
      'Fisetin extended both median and maximum lifespan in mice relative to untreated controls in the same study. Extending maximum — not just median — lifespan is a more demanding bar in aging research, since it implies an effect on the upper limit of the lifespan distribution rather than simply improving average outcomes.',
    quality: 'Strong (preclinical)',
    pmid: '30279143',
    color: 'text-accent-emerald',
    badge: 'bg-accent-emerald/10 border-accent-emerald/20',
  },
  {
    endpoint: 'Human senolytic outcomes — fisetin monotherapy',
    finding:
      'No completed, published human trial of fisetin alone has reported senolytic outcome data as of this writing. Registered trials exist (e.g. NCT03675724, NCT04733534) but their results are not yet confirmed reported — do not treat this as "pending good news." A registered trial only tells you a question is being asked, not what the answer will be.',
    quality: 'Human evidence: not yet published',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    endpoint: 'Human senolytic evidence — the drug class generally',
    finding:
      "Mayo Clinic's published human senolytic pilot trials to date used a dasatinib+quercetin (D+Q) combination — not fisetin. Any claim that fisetin has been through the same human pilot process as D+Q is incorrect, even though the two are frequently conflated in consumer-facing content because both are flavonoid-adjacent senolytics.",
    quality: 'Different compound',
    pmid: undefined,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/20',
  },
];

const FAQ = [
  {
    q: 'Has fisetin actually been tested in humans as a senolytic?',
    a: "Not with published results, as of this writing. The landmark fisetin senolytic study (Yousefzadeh et al. 2018, PMID 30279143) was conducted entirely in mice, plus supporting cell-based work. Dedicated human trials of fisetin alone are registered on clinicaltrials.gov — for example NCT03675724 and NCT04733534 — which means researchers are actively pursuing the question, but no confirmed published results from a completed fisetin-monotherapy human trial exist yet. Be skeptical of any source that states specific human results for fisetin alone; if you see a specific percentage or outcome attributed to a human fisetin trial, ask for the citation and check it yourself.",
  },
  {
    q: "Didn't Mayo Clinic already run human senolytic trials?",
    a: 'Yes, but not with fisetin. Mayo Clinic\'s published human senolytic pilot trials used a combination of dasatinib and quercetin (D+Q) — a different drug pairing entirely. It is a common and understandable mix-up, since fisetin and quercetin are both flavonoid senolytics and get discussed together, but the actual human pilot data belongs to the D+Q combination, not to fisetin monotherapy. This distinction matters if you\'re deciding how much clinical confidence to place in fisetin specifically — the D+Q pilot data cannot be borrowed to support fisetin claims just because the two compounds are chemically related.',
  },
  {
    q: 'Why is fisetin taken for only 2 days a month instead of daily?',
    a: 'This "pulse dosing" or "hit-and-run" approach comes directly from the mouse study design (PMID 30279143), where intermittent dosing was shown to clear senescent cells effectively — the underlying idea is that senolytics work by triggering apoptosis in the existing pool of senescent cells during the dosing window, rather than requiring continuous exposure to suppress an ongoing process. Continuous daily dosing was not the protocol that produced the reported mouse results, so most fisetin protocols in practice mirror the pulsed design rather than inventing a new one. Practically, this also means you should not expect — or look for — a daily subjective effect from fisetin the way you might with a stimulant or an acute-acting compound.',
  },
  {
    q: 'Is fisetin better than quercetin as a senolytic?',
    a: "Honestly, neither has strong monotherapy human RCT evidence to lean on yet. Fisetin has the edge in preclinical potency — it was identified as the most potent senolytic among 10 flavonoids screened head-to-head in mice. Quercetin's real-world human evidence comes almost entirely from the dasatinib+quercetin combination, not quercetin alone, which makes an apples-to-apples human comparison difficult. If someone tells you one is definitively \"better\" than the other based on human outcomes, ask which specific human trial they're referring to — there's a good chance the answer is that no such head-to-head human trial exists yet. See our full breakdown at Fisetin vs Quercetin for the complete picture, including where each compound's evidence actually comes from.",
  },
  {
    q: 'What are the side effects and who should avoid fisetin?',
    a: 'Reported cautions include potential inhibition of platelet aggregation and CYP-metabolizing enzymes at higher pulse doses. If you have scheduled surgery within two weeks, are pregnant or nursing, avoid fisetin. If you take blood thinners (warfarin, aspirin), are undergoing chemotherapy, or take any CYP-metabolized medication, consult your physician before starting — the interaction risk profile has not been extensively characterized in humans given how limited fisetin-specific human research is to date. When in doubt, treat fisetin the way you would any compound with a thin human safety record: disclose it to your care team rather than assuming it is inert simply because it is sold over the counter.',
  },
  {
    q: 'Can I stack fisetin with resveratrol or NMN?',
    a: "Yes — this is a common pairing because the mechanisms are complementary rather than redundant. Fisetin selectively induces apoptosis in senescent cells by inhibiting BCL-2/BCL-XL survival signaling; resveratrol activates the SIRT1 pathway involved in stress resistance and metabolic regulation; NMN raises NAD+ availability supporting sirtuin and PARP activity broadly. None of the three has been tested as a combined stack in a human trial, so treat the synergy as mechanistically plausible rather than clinically proven — a reasonable framing is that they address different, complementary parts of the aging process rather than reinforcing the exact same pathway.",
  },
  {
    q: 'How much fisetin should I take and in what form?',
    a: "The typical range is 100–500mg fisetin, with 2 consecutive days per month (pulse dosing) as the preferred protocol over daily use. Fisetin has relatively poor natural bioavailability (~40%), so liposomal formulations or taking it with a fat-containing meal are commonly used to improve absorption — this is a general bioavailability strategy for poorly soluble flavonoids, not a claim backed by a fisetin-specific pharmacokinetic trial. Some practitioners instead use a weight-based dose in the range of roughly 20mg/kg for 2 days, mirroring the dosing paradigm used in the mouse literature — but treat this as a research-derived extrapolation rather than a separately validated human protocol.",
  },
];

function buildFisetinSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Fisetin Pulse-Dosing Protocol',
    description:
      'Evidence-based pulse-dosing protocol for fisetin as a senolytic, based on the Yousefzadeh 2018 mouse senolytic study — with an explicit distinction from human D+Q senolytic trials.',
    path: '/fisetin-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Understand what pulse dosing means and why it is used',
        text: 'Fisetin\'s mouse evidence used intermittent, not daily, dosing to clear senescent cells. Before starting, understand that this is a periodic protocol, not a daily supplement.',
      },
      {
        name: 'Choose your dose: 100–500mg fisetin',
        text: 'Select a dose within the studied range. Pair it with a fat-containing meal or use a liposomal formulation, since fisetin has relatively poor natural bioavailability (~40%).',
      },
      {
        name: 'Take it on 2 consecutive days',
        text: 'Dose in the morning on two consecutive days. This mirrors the intermittent dosing pattern from the mouse senolytic literature.',
      },
      {
        name: 'Stand down for the remainder of the month',
        text: 'Do not dose daily. The pulse protocol specifically relies on periods without exposure between dosing windows.',
      },
      {
        name: 'Reassess periodically and check interactions before surgery',
        text: 'There is no validated human blood biomarker yet that confirms senolytic effect from fisetin specifically. Track general wellbeing, and always disclose fisetin use to a physician before any scheduled surgery, given its potential effect on platelet aggregation.',
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
    headline: 'Fisetin Supplement Guide 2026 — Dosage, Evidence & the Human Trial Reality Check',
    description:
      'Complete evidence guide to fisetin: BCL-2/BCL-XL senolytic mechanism, the 2018 mouse lifespan study, pulse-dosing rationale, comparison to quercetin, and an honest accounting of human trial status.',
    url: `${SITE.url}/fisetin-supplement-guide`,
    dateModified: '2026-07-14',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      {
        '@type': 'MedicalSubstance',
        name: 'Fisetin',
        description: 'Dietary flavonol; senolytic that selectively induces apoptosis in senescent cells via BCL-2/BCL-XL inhibition',
      },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Fisetin is a senotherapeutic that extends health and lifespan',
        author: 'Yousefzadeh MJ et al.',
        datePublished: '2018',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '30279143' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/30279143/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Fisetin Supplement Guide', path: '/fisetin-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function FisetinGuidePage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildFisetinSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-accent-violet" aria-hidden="true" />
            <span className="text-xs font-mono text-accent-violet uppercase tracking-wider">Evidence Tier B (Senolytic) · Fisetin</span>
          </div>

          <h1 className="heading-hero mb-4">
            Fisetin Supplement Guide 2026
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Fisetin is the most potent senolytic identified in a landmark mouse study — and one of the most overstated compounds in longevity marketing. Here is exactly what the mouse data shows, why pulse dosing exists, and the honest truth about human trials that haven&rsquo;t happened yet, including the specific mix-up between fisetin and the dasatinib+quercetin combination that Mayo Clinic actually tested in people.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: 'Tier B', label: 'Evidence tier', color: 'text-accent-violet' },
              { value: '100–500mg', label: 'Pulse dose', color: 'text-accent-cyan' },
              { value: '2 days/mo', label: 'Preferred protocol', color: 'text-accent-emerald' },
              { value: 'Mice only', label: 'Lifespan-extension data', color: 'text-accent-rose' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/compounds/fisetin"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-violet text-bg-base font-semibold text-sm hover:bg-accent-violet/90 transition"
            >
              Compound deep-dive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library/compare/fisetin-vs-quercetin"
              className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
            >
              Fisetin vs Quercetin
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reality check / context section */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Fisetin vs Quercetin: Two Flavonoid Senolytics, Very Different Human Evidence</h2>
          <p className="text-body mb-6 max-w-2xl">
            These two flavonoids get lumped together constantly. Here is an honest comparison of what each one&rsquo;s evidence base actually contains.
          </p>
          <p className="text-body text-muted-foreground mb-6 max-w-2xl">
            Senolytics are a genuinely new drug and supplement category: compounds designed to selectively clear senescent (&ldquo;zombie&rdquo;) cells rather than to prevent damage or slow a process, the way most longevity interventions do. That novelty is part of why the evidence landscape is so easy to misrepresent — the field is young, the human data is thin relative to the hype, and two structurally similar flavonoids (fisetin and quercetin) get discussed as if they were interchangeable when their actual evidence bases diverge in important ways. Untangling which claims belong to which compound, and which belong to mice rather than people, is the whole point of this comparison.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/50">
                  <th className="text-left p-4 font-mono text-xs text-muted-foreground">METRIC</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-violet">FISETIN</th>
                  <th className="text-left p-4 font-mono text-xs text-accent-cyan">QUERCETIN</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: 'Preclinical senolytic potency',
                    fisetin: 'Most potent of 10 flavonoids screened (PMID 30279143)',
                    quercetin: 'Screened alongside fisetin; less potent alone in the same comparison',
                    winner: 'fisetin',
                  },
                  {
                    metric: 'Mouse lifespan data',
                    fisetin: 'Extended median and maximum lifespan (PMID 30279143)',
                    quercetin: 'Typically studied in combination with dasatinib, not as monotherapy',
                    winner: 'fisetin',
                  },
                  {
                    metric: 'Published human senolytic pilot data',
                    fisetin: 'None published for fisetin alone as of this writing',
                    quercetin: 'None published for quercetin alone either — existing pilots used dasatinib+quercetin (D+Q)',
                    winner: 'tie',
                  },
                  {
                    metric: 'Registered human monotherapy trials',
                    fisetin: 'Yes — e.g. NCT03675724, NCT04733534 (results not yet confirmed reported)',
                    quercetin: 'Less common as a standalone senolytic monotherapy trial design',
                    winner: 'fisetin',
                  },
                  {
                    metric: 'Typical protocol',
                    fisetin: '100–500mg, pulsed 2 consecutive days/month',
                    quercetin: 'Often combined with dasatinib in a similar intermittent pulse schedule',
                    winner: 'different',
                  },
                  {
                    metric: 'Bioavailability',
                    fisetin: '~40% — liposomal or fat-based delivery preferred',
                    quercetin: 'Also limited; commonly formulated with bioavailability enhancers',
                    winner: 'tie',
                  },
                ].map((row) => (
                  <tr key={row.metric} className="border-b border-border/40 last:border-0">
                    <td className="p-4 font-medium text-xs">{row.metric}</td>
                    <td className={`p-4 text-xs ${row.winner === 'fisetin' ? 'text-accent-violet font-semibold' : 'text-muted-foreground'}`}>{row.fisetin}</td>
                    <td className={`p-4 text-xs ${row.winner === 'quercetin' ? 'text-accent-cyan font-semibold' : 'text-muted-foreground'}`}>{row.quercetin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <p className="font-semibold text-amber-400 mb-2">The verdict</p>
            <p className="text-sm text-muted-foreground">
              Fisetin has a genuine edge in preclinical potency — it was identified as the strongest of 10 flavonoids screened. But neither compound has published human monotherapy senolytic trial results. Quercetin&rsquo;s real human evidence belongs to the dasatinib+quercetin combination, not quercetin alone, so a fair comparison has to acknowledge that both flavonoids are, individually, still waiting on human confirmation. Neither &ldquo;fisetin is proven in humans&rdquo; nor &ldquo;quercetin is proven in humans&rdquo; is an accurate statement as of this writing — the honest framing is that the preclinical case for fisetin specifically is strong, and the human case for the senolytic drug class generally rests on a different combination entirely. See the full breakdown at Fisetin vs Quercetin.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence table */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Evidence Summary by Endpoint</h2>
          <p className="text-body-sm text-muted-foreground mb-8">Click each PMID to view the source study on PubMed. Notice how many rows below point back to the same single paper — that is intentional, and it reflects how thin the fisetin-specific evidence base currently is outside of that one mouse study.</p>

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
            Pulse dosing — not daily use — is the preferred protocol, following the intermittent dosing design from the mouse senolytic literature.
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
                  { phase: 'Pulse days 1–2 (monthly)', dose: '100–500 mg/day', timing: 'AM, with a fat-containing meal', note: 'Core protocol — 2 consecutive days only, repeated once per month' },
                  { phase: 'Remaining ~28 days', dose: 'None', timing: '—', note: 'No dosing — the "off" period is intentional, not optional, and is part of the pulse design itself' },
                  { phase: 'Weight-based alternative (research-style)', dose: '~20 mg/kg × 2 days', timing: 'AM, with food', note: 'Mirrors the dosing paradigm used in the mouse literature, extrapolated by body weight rather than a flat dose' },
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
                <li>· Use pulse dosing (2 consecutive days/month) rather than daily use — this is the studied protocol, and there is no evidence basis for a continuous daily regimen</li>
                <li>· Choose liposomal or fat-based delivery — fisetin&rsquo;s natural bioavailability (~40%) is limited, and absorption strategies matter more here than for many other flavonoids</li>
                <li>· Take in the morning, with a fat-containing meal, on both pulse days, to maximize absorption during the dosing window</li>
                <li>· Stack with resveratrol or NMN if pursuing a broader senescence/NAD+ protocol, since the mechanisms are complementary rather than overlapping</li>
                <li>· Disclose fisetin use to any physician or surgeon, even though dosing is infrequent — the platelet and CYP-enzyme considerations apply during the pulse window regardless of how few days a month you take it</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                <p className="font-semibold text-accent-rose text-sm">Cautions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Avoid if scheduled for surgery within 2 weeks — potential effect on platelet aggregation that could complicate bleeding risk</li>
                <li>· Avoid if pregnant or nursing — not studied in these populations</li>
                <li>· Consult a physician first if taking blood thinners (warfarin, aspirin) — the interaction has not been formally characterized in a human pharmacokinetic study</li>
                <li>· Consult a physician first if undergoing chemotherapy — potential interactions with treatments that rely on modulating cell survival and apoptosis pathways</li>
                <li>· Consult a physician if taking any CYP-metabolized medication — potential CYP inhibition at higher pulse doses could alter how those medications are cleared</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Fisetin Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Beaker,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'BCL-2/BCL-XL Inhibition (Selective Apoptosis)',
                body: 'Senescent cells uniquely depend on BCL-2 and BCL-XL anti-apoptotic proteins to avoid self-destructing despite their damaged state. Fisetin inhibits these proteins, triggering apoptosis specifically in senescent cells. Normal, healthy cells don\'t rely on this same survival pathway, so they are spared — this selectivity is the defining property of a senolytic, and it is what separates this category from a general antioxidant or anti-inflammatory supplement.',
              },
              {
                icon: Waves,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Reduced SASP Signaling (Mechanistic Rationale)',
                body: "Senescent cells secrete inflammatory signaling molecules collectively known as the senescence-associated secretory phenotype (SASP). Clearing senescent cells should, mechanistically, reduce this inflammatory signaling burden. This rationale is well-established in the senescence field broadly, but it has not been directly confirmed as a human outcome specific to fisetin — the mouse study measured senescence markers and lifespan, not circulating SASP cytokines in people.",
              },
              {
                icon: Repeat,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Pulse-Dosing ("Hit-and-Run") Rationale',
                body: 'Because senolytics act by triggering apoptosis rather than by continuously suppressing a process, the mouse literature established an intermittent dosing model: clear the existing senescent cell pool during a short dosing window, then stand down. This is why fisetin protocols use 2 consecutive days per month rather than daily dosing — continuous exposure was not the design that produced the reported mouse results, so there is no evidence basis for dosing it like a typical daily supplement.',
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
              Fisetin&rsquo;s apoptosis-based mechanism is mechanistically distinct from sirtuin activation and NAD+ repletion, making it a frequent companion in broader longevity protocols. Because fisetin is pulsed monthly rather than taken daily, it slots in alongside daily-use compounds without requiring you to change their schedule.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/library/compounds/resveratrol"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card text-sm font-medium hover:border-accent-violet/30 transition"
              >
                Resveratrol
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/nmn"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card text-sm font-medium hover:border-accent-violet/30 transition"
              >
                NMN
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hallmarks of Aging */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Fisetin Addresses the Hallmarks of Aging</h2>
          <p className="text-body mb-8 max-w-2xl">
            Fisetin&rsquo;s senolytic mechanism maps onto three of the twelve recognized hallmarks of aging. These connections are mechanistic and supported by mouse data — human confirmation for fisetin specifically is still pending.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Heart,
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
                title: 'Cellular Senescence',
                href: '/library/cellular-senescence',
                body: 'This is the hallmark fisetin targets most directly. By selectively inducing apoptosis in senescent ("zombie") cells via BCL-2/BCL-XL inhibition, fisetin reduces the senescent cell burden — the mechanism demonstrated in the 2018 mouse study across multiple tissue types, using both acute and pulsed dosing regimens.',
              },
              {
                icon: Network,
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                title: 'Altered Intercellular Communication',
                href: '/library/altered-intercellular-communication',
                body: 'Senescent cells drive dysregulated intercellular signaling largely through SASP factor secretion. Clearing senescent cells is a plausible mechanistic route to reducing this signaling disruption — again, this is mechanistic rationale extrapolated from the senescence-clearance data, not a directly measured human outcome for fisetin. It is one of several reasons senolytics are of interest well beyond any single organ system.',
              },
              {
                icon: Activity,
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                title: 'Chronic Inflammation',
                href: '/library/chronic-inflammation',
                body: 'SASP secretion from senescent cells is a recognized driver of "inflammaging," the chronic low-grade inflammation that accumulates with age. Reducing senescent cell burden is mechanistically linked to reducing this inflammatory driver, based on the broader senolytic literature rather than a fisetin-specific human inflammation trial — an important distinction to hold onto given how often this connection gets stated as settled fact.',
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
                title: 'Understand what pulse dosing means — and why',
                body: 'Fisetin\'s mouse evidence used intermittent, not daily, dosing to clear senescent cells. This is a periodic protocol you cycle through monthly, not a daily supplement you take indefinitely.',
              },
              {
                n: '02',
                title: 'Choose your dose: 100–500mg fisetin',
                body: 'Select a dose within the studied range. Pair it with a fat-containing meal or a liposomal formulation — fisetin has relatively poor natural bioavailability (~40%).',
              },
              {
                n: '03',
                title: 'Take it on 2 consecutive days, in the morning',
                body: 'Dose on back-to-back days rather than spreading it across the month. This mirrors the intermittent dosing pattern from the mouse senolytic study.',
              },
              {
                n: '04',
                title: 'Stand down for the remainder of the month',
                body: 'Do not dose daily. The pulse protocol specifically relies on extended periods without exposure between dosing windows — this is not a missed step, it is the design.',
              },
              {
                n: '05',
                title: 'Reassess periodically and disclose use before any surgery',
                body: 'There is no validated human blood biomarker that confirms senolytic effect from fisetin specifically, so resist the temptation to order a lab panel expecting a clear readout. Track general wellbeing over successive monthly pulses instead, and always tell a physician or surgeon you take fisetin given its potential effect on platelet aggregation, even though the dosing window is brief.',
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
          <h2 className="heading-section mb-8">Fisetin FAQ</h2>
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
                  Fisetin may inhibit platelet aggregation and CYP-metabolizing enzymes at higher pulse doses. Avoid it if you have surgery scheduled within 2 weeks, or if you are pregnant or nursing. If you take blood thinners, are undergoing chemotherapy, or take any CYP-metabolized medication, talk to your physician before starting. Human research on fisetin specifically remains limited — the pulse-dosing protocol itself is derived from mouse data rather than a human dose-finding study — so err on the side of caution with any existing medical condition, and disclose fisetin use even though you only take it a few days a month. TNiC content is educational and not a substitute for medical advice.
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
            <h2 className="heading-section mb-3">Build Your Senolytic Protocol</h2>
            <p className="text-xs text-muted-foreground mb-4 max-w-xl mx-auto uppercase tracking-wide">Evidence tier B · mouse-model senolytic, human trials pending</p>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Fisetin pairs naturally with resveratrol and NMN in TNiC&rsquo;s senescence-focused protocols — a monthly pulse alongside daily foundational compounds. Take the quiz to get a personalized stack that fits your goals and current supplement routine.
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
                href="/library/compare/fisetin-vs-quercetin"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Fisetin vs Quercetin
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/fisetin"
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
            Educational content only — not medical advice. Fisetin is a dietary supplement, not FDA-approved to treat or prevent any disease. Human trial data specific to fisetin alone is limited — the strongest evidence remains a mouse study — and no completed fisetin-monotherapy human trial has published results as of this writing. Consult your physician before starting, especially if you take blood thinners, are scheduled for surgery, or are undergoing chemotherapy.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
