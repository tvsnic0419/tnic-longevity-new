import Link from 'next/link';
import { ELITE_COUNT } from '@/lib/stats';
import { ArrowRight, FlaskConical, ShieldCheck, Clock, ExternalLink, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { GuideHeroPanel } from '@/components/guides/GuideHeroPanel';
import { StructuredData } from '@/components/seo/StructuredData';
import { LinkedText } from '@/components/ui/LinkedText';
import { buildPageMetadata } from '@/lib/seo';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'NAD+ Supplement Guide 2026 — NMN vs NR vs Niacin, Dosing & Evidence',
  description:
    'Complete guide to NAD+ supplements: why NAD+ declines 50% by age 60, what NMN, NR, and niacin actually do, human trial evidence for each, dosing protocols, and the PMID-cited research behind common NAD+ stacks.',
  path: '/nad-supplement-guide',
  keywords: [
    'NAD+ supplement guide',
    'best NAD+ supplements 2026',
    'NMN vs NR',
    'how to increase NAD+ levels',
    'nicotinamide mononucleotide dosing',
    'NAD+ decline aging',
    'NAD+ precursor guide',
    'NMN supplement benefits',
    'nicotinamide riboside',
    'NAD+ restoration',
  ],
});

const NAD_PRECURSORS = [
  {
    name: 'NMN',
    full: 'Nicotinamide Mononucleotide',
    tier: 'A' as const,
    dose: '250–500 mg/day',
    timing: 'Morning, fasted or with light protein',
    mechanism: 'Direct NAD+ precursor in salvage pathway — bypasses NAMPT rate-limiting step',
    keyStudy: 'Igarashi et al. 2022: 250 mg/day raised whole-blood NAD+ 38%, improved muscle function in 65+ adults',
    pmid: '36482258',
    pros: ['Strongest RCT footprint', 'NAMPT bypass advantage', 'Easy stack integration', 'AM/PM synergy with resveratrol'],
    cons: ['Higher cost vs NR', 'Bioavailability varies by form (sublingual > capsule)', 'Not FDA-regulated supplement'],
    verdict: 'Best choice for NAD+/mitochondrial stack integration and sirtuin activation',
    color: '#00e0ff',
  },
  {
    name: 'NR',
    full: 'Nicotinamide Riboside',
    tier: 'A' as const,
    dose: '300–1000 mg/day',
    timing: 'Morning, with or without food',
    mechanism: 'Converts NMN → NAD+ via NRK enzymes — extra phosphorylation step vs NMN',
    keyStudy: 'Brennan et al. 2019: NR raised blood NAD+ metabolites in healthy older adults; multiple safety RCTs',
    pmid: '30940148',
    pros: ['Longer commercial track record', 'Multiple safety studies', 'TruNiagen branded capsules with QA', 'Physician familiarity'],
    cons: ['Extra enzymatic step (NRK-dependent)', 'Higher dose range needed vs NMN', 'Less common in NAD+ stack presets'],
    verdict: 'Defensible alternative — choose if physician prefers NR literature or you respond well',
    color: '#c084fc',
  },
  {
    name: 'Niacin (NAM)',
    full: 'Nicotinamide / Niacinamide',
    tier: 'B' as const,
    dose: '500–1500 mg/day',
    timing: 'Split across meals',
    mechanism: 'Enters NAD+ synthesis via NAMPT pathway — same as NMN/NR but from simpler precursor',
    keyStudy: 'Dollerup et al. 2018: niacinamide raised NAD+ in skeletal muscle, but with GI side effects at high doses',
    pmid: '30065671',
    pros: ['Extremely low cost', 'Long safety history at 500 mg', 'Generic availability'],
    cons: ['Flushing at 500+ mg (nicotinic acid form)', 'CD38 still degrades NAD+ regardless', 'Less precise than NMN/NR for longevity stack'],
    verdict: 'Budget-accessible entry point — upgrade to NMN for serious longevity stacking',
    color: '#fbbf24',
  },
];

const GUIDE_FAQS = [
  {
    question: 'Why does NAD+ decline with age?',
    answer: 'NAD+ levels drop approximately 50% between ages 20 and 60. Two main drivers: (1) NAMPT enzyme activity declines, reducing de novo synthesis, and (2) CD38 enzyme activity increases with age and inflammaging, aggressively consuming NAD+. The net result is a systemic energy and repair deficit across every cell in the body.',
  },
  {
    question: 'Which NAD+ supplement raises blood NAD+ the most — NMN or NR?',
    answer: 'Head-to-head human comparisons show both raise blood NAD+ metabolites. NMN at 250 mg/day raised whole-blood NAD+ 38% in the Igarashi 2022 RCT. NR studies generally show similar magnitudes but at higher dose ranges (300–1000 mg). Mechanistically, NMN bypasses the rate-limiting NAMPT step that NR still requires — which may give NMN an efficiency advantage in older adults with depleted NAMPT. See our NMN vs NR comparison for a full breakdown.',
  },
  {
    question: 'What is the best dose of NMN for longevity?',
    answer: 'The most-studied dose is 250–500 mg/day. The Liao 2021 double-blind RCT confirmed muscle/physical performance benefits at 300 mg/day. Most protocols use 250–500 mg in the morning, typically fasted or with a light protein source. Higher doses (600–1000 mg) exist in some commercial products but lack proportional RCT evidence for greater benefit — and cost significantly more.',
  },
  {
    question: 'Should I take NMN with resveratrol?',
    answer: "This is one of the most evidence-adjacent pairings in longevity: NMN raises NAD+, which is the cofactor sirtuins (SIRT1) require to function. Resveratrol is a SIRT1 activator — it amplifies sirtuin activity but requires NAD+ to do so. Together they create a substrate + activator combination. A common SIRT1 stack pairs 250–500 mg NMN (AM, fasted) with 150–500 mg trans-resveratrol (PM, with fat). This is a Tier B synergy with mechanistic support.",
  },
  {
    question: 'Does NAD+ supplementation affect the epigenetic clock?',
    answer: 'Pilot data suggests yes. A small NMN intervention study showed an average Horvath DNAmAge reduction of 2.1 years. This is not yet confirmed in large-scale replication. NAD+ is required by SIRT1/SIRT3, which regulate histone deacetylation and DNA methylation patterns — the biological mechanism exists. Expect more robust epigenetic clock data from NMN as the TAME-adjacent trials report.',
  },
  {
    question: 'Is NMN safe to take long-term?',
    answer: 'All published human trials to date report no serious adverse events. NMN is an endogenous metabolite naturally present in small amounts in foods (edamame, avocado, broccoli). The longest-running trials are approximately 12 months. No long-term (5+ year) human data exists yet. TNiC rates NMN Tier A for efficacy and assigns a very low risk score (R=2.0 on a 1–10 scale). As with any supplement, discuss with your physician if you take medications — particularly SIRT1-sensitive drugs.',
  },
  {
    question: 'Can I stack NMN with taurine, GlyNAC, and spermidine?',
    answer: 'Yes — these four compounds target four completely different nodes with no known antagonistic interactions. NMN replenishes NAD+. GlyNAC restores glutathione. Taurine addresses the multi-system deficiency described in Singh 2023 (Science). Spermidine induces autophagy via EP300 inhibition. This combination (with Sulforaphane as a 5th addition) matches the broadest evidence-graded preset available in the stack builder.',
  },
];

function buildNadGuideSchemas() {
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Choose the Right NAD+ Supplement',
    description: 'Step-by-step guide to selecting the correct NAD+ precursor for your longevity protocol.',
    totalTime: 'PT10M',
    url: `${SITE.url}/nad-supplement-guide`,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Identify your primary goal',
        text: 'NAD+ for mitochondrial energy and SIRT1 activation → NMN (250–500 mg). NAD+ for general repletion with physician NR preference → NR (300–1000 mg). Budget constraint with baseline support → Niacinamide (500 mg).',
      },
      {
        '@type': 'HowToStep',
        name: 'Check your stack integration',
        text: 'If you use one of the preset stacks (Mito-NAD+, Full Hybrid, SIRT1 Stack), NMN is the native choice. If pairing with resveratrol, take NMN in the morning fasted and resveratrol in the evening with fat.',
      },
      {
        '@type': 'HowToStep',
        name: 'Verify the product COA',
        text: 'Confirm: purity ≥98% NMN or NR, mass spectrometry verification, no heavy metal contamination. Most quality brands publish third-party COA on their website. Verified picks are listed at /products.',
      },
      {
        '@type': 'HowToStep',
        name: 'Set baseline labs before starting',
        text: 'Establish baseline NAD+ metabolites (urine or blood) if available, plus CBC and metabolic panel. This lets you measure real response at 90 days. Not required, but dramatically improves protocol iteration.',
      },
      {
        '@type': 'HowToStep',
        name: 'Combine with CD38 inhibitors for maximum effect',
        text: 'CD38 enzyme aggressively degrades NAD+ and increases with age. Quercetin is a weak CD38 inhibitor; apigenin (from chamomile) is stronger. Adding a CD38 inhibitor can amplify NAD+ repletion from NMN by reducing degradation rate.',
      },
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GUIDE_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'NAD+ Supplement Guide 2026 — NMN vs NR vs Niacin',
    description:
      'Evidence-based comparison of NAD+ precursors for longevity: NMN, NR, and niacin mechanisms, human trial data, dosing protocols, and stack integration.',
    url: `${SITE.url}/nad-supplement-guide`,
    datePublished: '2026-06-01',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      { '@type': 'MedicalSubstance', name: 'NMN (Nicotinamide Mononucleotide)' },
      { '@type': 'MedicalSubstance', name: 'NR (Nicotinamide Riboside)' },
      { '@type': 'MedicalSubstance', name: 'NAD+' },
    ],
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'NAD+ Supplement Guide', path: '/nad-supplement-guide' },
  ]);

  return [howTo, faqPage, article, breadcrumb];
}

export default function NadSupplementGuidePage() {
  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={buildNadGuideSchemas()} />

      {/* Hero */}
      <section className="py-14 md:py-20 border-b border-border bg-[#020811]">
        <div className="container-page max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-micro font-mono font-semibold uppercase tracking-widest text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1 rounded-full">
                  Evidence Guide · Updated 2026
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-[1.1]">
                NAD<span className="text-accent-cyan">+</span> Supplement Guide 2026
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                NAD+ declines ~50% by age 60. Restoring it activates sirtuins, accelerates DNA repair,
                and supports mitochondrial energy production — but only if you choose the right precursor
                at the right dose. Here’s what the human trials actually show.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/library/compare/nmn-vs-nr"
                  className="inline-flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-cyan/20 transition"
                >
                  NMN vs NR — full comparison <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/library/compounds/nmn"
                  className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition"
                >
                  NMN deep dive <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <GuideHeroPanel
                glowColor="var(--accent-cyan)"
                headline={{ score: 50, label: 'NAD+ DECLINE', sublabel: 'by age 60', color: 'var(--accent-cyan)' }}
                stats={[
                  { value: '38%', label: 'NAD+ boost — NMN 250 mg/day (Igarashi 2022)', colorClass: 'text-accent-cyan' },
                  { value: 'Tier A', label: 'Evidence grade for NMN + NR', colorClass: 'text-accent-cyan' },
                  { value: '3', label: 'Human-studied NAD+ precursors reviewed', colorClass: 'text-accent-cyan' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why NAD+ Matters */}
      <section className="py-12 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Why NAD+ is central to longevity</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            NAD<sup>+</sup> (Nicotinamide Adenine Dinucleotide) is a coenzyme present in every living cell.
            It acts as an electron carrier in metabolism and as a substrate for longevity enzymes.
            Without adequate NAD+, these key longevity processes stall:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                title: 'Sirtuin activation (SIRT1–7)',
                desc: 'Sirtuins require NAD+ as a cofactor. They regulate histone deacetylation, DNA repair, mitochondrial biogenesis, and inflammation suppression. When NAD+ drops, sirtuin activity drops proportionally.',
                color: 'text-accent-cyan',
              },
              {
                title: 'PARP-1 DNA repair',
                desc: 'PARP-1 uses NAD+ to detect and repair DNA strand breaks. NAD+ depletion in aging cells leaves DNA damage unrepaired — a driver of genomic instability and cancer risk.',
                color: 'text-accent-violet',
              },
              {
                title: 'Mitochondrial energy (Complex I)',
                desc: 'NAD+ is the electron acceptor at Complex I of the electron transport chain. Low NAD+ = reduced ATP production = cellular energy crisis, especially in muscle and brain.',
                color: 'text-accent-emerald',
              },
              {
                title: 'CD38 enzyme competition',
                desc: 'CD38 is an NAD+ consumer that increases with age and inflammation. It outcompetes SIRT1 for NAD+. Supplementation must overcome CD38 degradation — which is why higher doses are sometimes needed.',
                color: 'text-accent-amber',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border/60 bg-card/30 p-5">
                <h3 className={`font-bold text-sm mb-2 ${item.color}`}>{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/[0.05] p-5">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-accent-cyan">The key number: </span>
              Zhu et al. 2015 (Cell Metabolism) showed NAD+ levels in skeletal muscle decline ~50% from age 20 to 50 in humans.
              Restoring NAD+ with NMN in aging mice reversed multiple metabolic hallmarks of aging within weeks.{' '}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/26669683/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-cyan hover:underline inline-flex items-center gap-1"
              >
                PMID: 26669683 <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 border-b border-border">
        <div className="container-page max-w-5xl">
          <h2 className="text-2xl font-bold mb-2">NAD+ Precursor Comparison</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Three human-studied NAD+ precursors, ranked for longevity stack integration.
          </p>
          <div className="space-y-4">
            {NAD_PRECURSORS.map((p, i) => (
              <div
                key={p.name}
                className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden"
                style={{ borderColor: i === 0 ? `${p.color}33` : undefined }}
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                        style={{ background: `${p.color}18`, color: p.color }}
                      >
                        #{i + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{p.name}</h3>
                          <span
                            className="text-micro font-mono font-semibold px-2 py-0.5 rounded-full border"
                            style={{ color: p.color, background: `${p.color}12`, borderColor: `${p.color}30` }}
                          >
                            Tier {p.tier}
                          </span>
                          {i === 0 && (
                            <span className="text-micro font-semibold text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-2 py-0.5 rounded-full">
                              Top Pick
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{p.full}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-muted-foreground">Dose</p>
                      <p className="text-sm font-bold" style={{ color: p.color }}>{p.dose}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    <span className="font-semibold text-foreground">Mechanism: </span>
                    {p.mechanism}
                  </p>

                  <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3 mb-4 text-xs">
                    <FlaskConical className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" />
                    <p>
                      <span className="font-semibold text-accent-emerald">Key study: </span>
                      {p.keyStudy}{' '}
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-cyan hover:underline inline-flex items-center gap-0.5"
                      >
                        PMID: {p.pmid} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-micro font-mono text-accent-emerald uppercase mb-2">Advantages</p>
                      {p.pros.map((pro) => (
                        <div key={pro} className="flex items-start gap-1.5 text-xs text-foreground/80 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-accent-emerald shrink-0 mt-0.5" />
                          {pro}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-micro font-mono text-accent-rose uppercase mb-2">Limitations</p>
                      {p.cons.map((con) => (
                        <div key={con} className="flex items-start gap-1.5 text-xs text-muted-foreground mb-1">
                          <AlertTriangle className="w-3 h-3 text-accent-rose/70 shrink-0 mt-0.5" />
                          {con}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="rounded-lg p-3 text-xs font-semibold"
                    style={{ background: `${p.color}10`, color: p.color }}
                  >
                    Verdict: {p.verdict}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Choose — HowTo section */}
      <section className="py-12 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="text-2xl font-bold mb-2">How to choose the right NAD+ supplement</h2>
          <p className="text-muted-foreground text-sm mb-8">A 5-step decision framework based on your goals, budget, and stack.</p>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Identify your primary goal',
                body: 'NAD+ for mitochondrial energy + SIRT1 activation → NMN (250–500 mg). General NAD+ repletion with physician NR preference → NR (300–1000 mg). Budget supplement with baseline support → Niacinamide (500 mg, avoid nicotinic acid form to prevent flushing).',
              },
              {
                step: 2,
                title: 'Match to your stack preset',
                body: 'If you use one of the preset stacks (Mito-NAD+, Full Hybrid, SIRT1 Stack), NMN is the native choice. Running a standalone NAD+ protocol? Either NMN or NR work — NMN is preferred for NAMPT bypass in older adults.',
              },
              {
                step: 3,
                title: 'Add a CD38 inhibitor for multiplied effect',
                body: "CD38 enzyme activity rises with age and destroys NAD+ aggressively. Adding apigenin (chamomile extract) or quercetin helps reduce CD38-driven degradation — amplifying the effect of any NAD+ precursor. This is why well-built NAD+ stacks include flavonoids.",
              },
              {
                step: 4,
                title: 'Pair with resveratrol for SIRT1 activation',
                body: 'NAD+ is the fuel. Resveratrol is the activator. NMN (AM, fasted) + resveratrol (PM, with fat) is the gold-standard SIRT1 pair supported by mechanistic and preclinical data. Human SIRT1 activity measurement is not yet routine, but the pathway logic is well-established.',
              },
              {
                step: 5,
                title: 'Verify the product COA',
                body: 'Look for: purity ≥98% NMN or NR verified by HPLC, third-party mass spectrometry, no heavy metal contamination, no NMN oxide impurities. Most quality brands publish COA on their site. Verified picks are listed at /products.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-xl border border-border/60 p-5 bg-card/20">
                <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-sm font-black text-accent-cyan shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timing Protocol */}
      <section className="py-12 border-b border-border bg-[#050a14]/50">
        <div className="container-page max-w-4xl">
          <h2 className="text-2xl font-bold mb-2">Optimal NAD+ supplement timing</h2>
          <p className="text-muted-foreground text-sm mb-8">Based on published protocol research and chronobiology data on NAD+ metabolism.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                time: 'Morning (AM)',
                items: ['NMN 250–500 mg — fasted or with light protein', 'Take 30–60 min before breakfast', 'NAD+ peaks AM → aligns with circadian SIRT1 activity'],
                icon: Zap,
                color: 'text-accent-cyan',
                bg: 'bg-accent-cyan/[0.05] border-accent-cyan/20',
              },
              {
                time: 'Evening (PM)',
                items: ['Trans-resveratrol 150–500 mg — with fatty meal', 'Activates SIRT1 with dietary fat co-ingestion', 'SIRT3 peak in late PM → mitochondrial support'],
                icon: ShieldCheck,
                color: 'text-accent-violet',
                bg: 'bg-accent-violet/[0.05] border-accent-violet/20',
              },
              {
                time: 'Daily (anytime)',
                items: ['GlyNAC — AM/PM split (pairs with NAD+ pathway)', 'Taurine — with any meal', 'Apigenin — AM to reduce CD38 degradation of NAD+'],
                icon: Clock,
                color: 'text-accent-emerald',
                bg: 'bg-accent-emerald/[0.05] border-accent-emerald/20',
              },
            ].map((slot) => (
              <div key={slot.time} className={`rounded-xl border p-5 ${slot.bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <slot.icon className={`w-4 h-4 ${slot.color}`} />
                  <p className={`text-sm font-bold ${slot.color}`}>{slot.time}</p>
                </div>
                <ul className="space-y-2">
                  {slot.items.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                      <span className="text-foreground/40 shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">NAD+ Supplement FAQ</h2>
          <div className="space-y-5">
            {GUIDE_FAQS.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-border/60 p-5">
                <h3 className="font-bold text-sm mb-2 text-accent-cyan">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed"><LinkedText text={faq.answer} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container-page max-w-4xl">
          <div className="rounded-2xl border border-accent-cyan/20 bg-accent-cyan/[0.04] p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Ready to start your NAD+ protocol?</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">
              Take The Nico Starter Questionnaire to get a personalized stack preset — including NAD+ precursor timing
              choreographed with resveratrol, GlyNAC, and your other compounds.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-emerald text-black px-6 py-3 rounded-xl font-semibold text-sm"
              >
                Take Nico → get your stack
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/library/compare/nmn-vs-nr"
                className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-sm text-accent-cyan"
              >
                NMN vs NR deep dive
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Link
              href="/library/compounds/nmn"
              className="group block rounded-xl border border-border/60 p-4 hover:border-accent-cyan/30 hover:bg-accent-cyan/[0.03] transition"
            >
              <p className="text-xs font-mono text-accent-cyan mb-1">DEEP DIVE</p>
              <p className="font-semibold text-sm group-hover:text-accent-cyan transition">NMN Evidence Module →</p>
              <p className="text-xs text-muted-foreground mt-1">Full PMID-cited compound review</p>
            </Link>
            <Link
              href="/library/compounds/nr"
              className="group block rounded-xl border border-border/60 p-4 hover:border-accent-violet/30 hover:bg-accent-violet/[0.03] transition"
            >
              <p className="text-xs font-mono text-accent-violet mb-1">DEEP DIVE</p>
              <p className="font-semibold text-sm group-hover:text-accent-violet transition">NR Evidence Module →</p>
              <p className="text-xs text-muted-foreground mt-1">Nicotinamide riboside full review</p>
            </Link>
            <Link
              href="/longevity-supplements-guide"
              className="group block rounded-xl border border-border/60 p-4 hover:border-accent-emerald/30 hover:bg-accent-emerald/[0.03] transition"
            >
              <p className="text-xs font-mono text-accent-emerald mb-1">GUIDE</p>
              <p className="font-semibold text-sm group-hover:text-accent-emerald transition">Best Longevity Supplements 2026 →</p>
              <p className="text-xs text-muted-foreground mt-1">All {ELITE_COUNT} elite compounds ranked</p>
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-10 font-mono leading-relaxed max-w-2xl mx-auto">
            Educational platform — not medical advice. NAD+ supplement dosing should be discussed with
            your physician, especially if you take medications. All citations link directly to PubMed.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
