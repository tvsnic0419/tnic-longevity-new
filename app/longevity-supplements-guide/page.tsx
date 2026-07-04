import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, Clock, ExternalLink, CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildHowToSchema, buildGuidePageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { getScoredCompounds } from '@/lib/elite-8-data';

export const metadata = seoRoutes.longevityGuide();

const GUIDE_FAQS = [
  {
    question: 'What are the best longevity supplements backed by human trials?',
    answer:
      'The compounds with the strongest human RCT evidence for longevity-relevant outcomes are: NMN (NAD+ restoration, Igarashi 2022), GlyNAC (glutathione restoration, Kumar 2021–2023 Baylor), Metformin (AMPK activation, population data), Berberine (AMPK), Taurine (Singh 2023 Science paper — lifespan + muscle), Spermidine (Madeo 2021 Cell — memory/autophagy), Urolithin A (mitophagy, Singh 2022 Cell Metabolism), and Sulforaphane (NRF2, multiple CKD and airway RCTs). Rapamycin has the strongest preclinical lifespan data in mammals and early human signals. All have PMID-citable human evidence.',
  },
  {
    question: 'Is NMN or NR better for NAD+ supplementation?',
    answer:
      'Both raise blood NAD+ metabolites in humans. NMN (250–500 mg/day) has a stronger mechanistic case for NAMPT-bypass and is integrated into most TNiC stacks. NR (300–1000 mg/day) has a longer commercial track record. A tie on core NAD+ restoration — choose NMN for TNiC stack integration or NR if your physician prefers that literature. Do not combine high doses of both. Full comparison: tnic.help/library/compare/nmn-vs-nr',
  },
  {
    question: 'How do I know if a longevity supplement is evidence-graded Tier A?',
    answer:
      'TNiC defines Tier A as: ≥2 independent RCTs with consistent primary endpoints, human participants, N ≥ 20 per arm, published in peer-reviewed journals with PubMed indexing. Tier B = 1 RCT or multiple high-quality human pilots. Tier C = animal or in-vitro data only. Every compound in our library has its evidence tier clearly labeled with the underlying PMIDs.',
  },
  {
    question: 'Should I take NMN, GlyNAC, and Sulforaphane together?',
    answer:
      'Yes — this is the NRF2 + NAD+ dual-pathway stack and is one of TNiC\'s best-evidenced combinations. GlyNAC restores glutathione (GSH); Sulforaphane activates NRF2 and transcribes 200+ cytoprotective genes; NMN replenishes NAD+ for sirtuin and PARP function. These three target distinct but complementary nodes with zero known antagonistic interactions. Timing: GlyNAC AM/PM; Sulforaphane AM fasted; NMN AM.',
  },
  {
    question: 'What is the safest longevity supplement to start with?',
    answer:
      'Taurine has the highest safety score in TNiC\'s LQ ranking — virtually no adverse events reported at 3–6g/day, backs by the landmark Singh 2023 Science study showing ~80% taurine decline with age and lifespan extension in multiple models. GlyNAC is equally safe (amino acid precursors). Both are excellent starting points before moving to NAD+ precursors or mTOR modulators.',
  },
  {
    question: 'Is rapamycin safe for longevity use in healthy adults?',
    answer:
      'Rapamycin is a prescription mTOR inhibitor with the strongest lifespan extension data in mammals (14% median extension, Harrison 2009 ITP). Low-dose intermittent protocols (2–6 mg weekly) show manageable side effect profiles in several small human trials. However, it is NOT over-the-counter and requires physician supervision. It is categorized as Rx-only on TNiC with a safety score of 5.5/10 — lower than OTC options. Consult a longevity-focused physician before considering it.',
  },
  {
    question: 'Do longevity supplements actually work in humans, or just in mice?',
    answer:
      'Several compounds have strong human RCT data: GlyNAC (restored GSH, improved mitochondrial function in 3 Baylor RCTs); NMN (raised NAD+ 38%, improved muscle in Igarashi 2022); Taurine (Singh 2023 Science, human epidemiological signal + animal data); Spermidine (Madeo 2021 Cell, improved memory in older adults). Berberine and Metformin have large population datasets. Rapamycin has mouse lifespan data and early human signals. The key is matching the compound to a mechanism with human trial evidence — which is exactly what TNiC\'s Tier A/B system does.',
  },
];

const HOW_TO_STEPS = [
  {
    name: 'Take the 3-minute Starter Quiz',
    text: 'Answer three questions — your primary goal (energy, cognition, or longevity), age range, and experience level. The quiz matches you to one of 6 evidence-graded stack presets (NRF2 Defense, NAD+ Restoration, Mitochondrial Health, Senolytic Protocol, Foundation, or Elite Protocol).',
  },
  {
    name: 'Choose your first compound based on hallmark targeting',
    text: 'Identify which of the 12 Hallmarks of Aging is your primary concern. Mitochondrial decline → start with NMN or GlyNAC. Oxidative stress/inflammation → Sulforaphane + GlyNAC. Cellular senescence → Fisetin or quercetin. Autophagy decline → Spermidine or Urolithin A.',
  },
  {
    name: 'Verify evidence tier before purchasing',
    text: 'Only proceed with Tier A (≥2 RCTs) or Tier B (1 RCT or robust pilots) compounds. Check the TNiC compound library for the underlying PMIDs. Every compound page links directly to the PubMed studies it cites — read the abstracts.',
  },
  {
    name: 'Get baseline labs before starting',
    text: 'Order a baseline panel: CBC, comprehensive metabolic panel, hs-CRP (inflammation), and optionally NAD+ metabolites (for NMN) or glutathione (for GlyNAC). This gives you real data to measure outcomes at 90 days — not guesses.',
  },
  {
    name: 'Build your stack in the Stack Architect tool',
    text: 'Use TNiC\'s free Stack Architect at tnic.help/stacks to assemble your compounds, see synergy connections, check for contraindications, and export a printable protocol. The tool runs locally — your data never leaves your browser.',
  },
  {
    name: 'Retest at 90 days',
    text: 'Most interventions require 90 days to show measurable changes in epigenetic markers (methylation clocks), inflammatory cytokines (hs-CRP), or oxidative stress (8-OHdG). Compare to baseline. Adjust protocol based on data, not marketing.',
  },
];

export default function LongevitySupplementsGuidePage() {
  const scored = getScoredCompounds();

  const schemas = [
    ...buildGuidePageSchema({
      title: 'Best Longevity Supplements 2026 — Evidence-Ranked Guide',
      description:
        'Ranked by clinical evidence, epigenetic clock data, and biological mechanism. NMN, GlyNAC, Rapamycin, Spermidine, Taurine, and more with dosing, synergies, and Tier A/B grading.',
      path: '/longevity-supplements-guide',
      keywords: ['best longevity supplements', 'anti-aging supplements 2026', 'NMN guide', 'GlyNAC dosing', 'evidence-based longevity'],
      faqs: GUIDE_FAQS,
    }),
    buildHowToSchema({
      name: 'How to Build a Longevity Supplement Stack',
      description: 'A 6-step evidence-based process for choosing, dosing, and tracking longevity supplements using the TNiC Longevity OS.',
      path: '/longevity-supplements-guide',
      totalTime: 'PT90D',
      steps: HOW_TO_STEPS,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Longevity Supplements Guide', path: '/longevity-supplements-guide' },
    ]),
  ];

  return (
    <SubPageLayout>
      <StructuredData schemas={schemas} />

      {/* Hero */}
      <section className="relative py-16 md:py-24 border-b border-border overflow-hidden" style={{ background: '#020811' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,224,255,0.10)_0%,transparent_60%)] pointer-events-none" aria-hidden />
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 font-mono" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent-cyan transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Longevity Supplements Guide</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent-cyan border border-accent-cyan/20 bg-accent-cyan/[0.06] px-4 py-2 rounded-full mb-6">
              <FlaskConical className="w-3 h-3" />
              Evidence-Ranked · 2026 Edition
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-[1.05]">
              Best Longevity{' '}
              <span style={{ color: 'var(--accent-cyan)' }}>Supplements</span>{' '}
              2026
            </h1>

            <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-8 max-w-2xl">
              Ranked by composite LQ score across 8 evidence dimensions: clinical trials, epigenetic
              biomarkers, effect size, evolutionary depth, safety, bioavailability, and human
              population data. Every claim linked to a PubMed ID.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-accent-cyan text-black hover:bg-accent-cyan/90 transition-all focus-ring"
              >
                Get Your Personalized Stack <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold border border-white/15 text-white/80 hover:border-white/30 hover:text-white transition-all focus-ring"
              >
                Browse Full Library
              </Link>
            </div>

            <p className="mt-6 text-xs text-white/30 font-mono">
              Educational only · Not medical advice · All citations PubMed-verified
            </p>
          </div>
        </div>
      </section>

      {/* Quick context: what makes this different */}
      <section className="py-12 border-b border-border bg-background">
        <div className="container-page">
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl">
            {[
              { icon: ShieldCheck, color: 'var(--accent-emerald)', title: 'Human trials only', body: 'Every Tier A/B compound here has at least one peer-reviewed human RCT. No mice-only claims.' },
              { icon: Clock, color: 'var(--accent-cyan)', title: 'Epigenetic clock data', body: 'Where available, we show estimated biological age delta from methylation clock studies.' },
              { icon: Star, color: 'var(--accent-amber)', title: 'LQ composite score', body: '8-dimensional weighted score (0–100): CE · EB · ES · EE · SF · BV · HP minus Risk penalty.' },
            ].map(({ icon: Icon, color, title, body }) => (
              <div key={title} className="rounded-2xl p-5 border border-border/60 bg-card/40">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranked Compound Table */}
      <section className="py-16 md:py-20 border-b border-border bg-background">
        <div className="container-page">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ranked: Best Longevity Supplements 2026
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Sorted by composite LQ score. Click any compound to read the full evidence deep-dive with PMIDs, dosing protocols, and monitoring checklists.
          </p>

          <div className="space-y-4">
            {scored.map((c, i) => {
              const score = Math.max(0, Math.min(100, c.score));
              const scoreColor = score >= 78 ? '#34d399' : score >= 68 ? '#00e0ff' : '#fbbf24';
              const tier = c.evidenceTier ?? 'B';
              const tierColor = tier === 'A' ? 'text-accent-emerald' : tier === 'B' ? 'text-accent-amber' : 'text-accent-rose';
              const tierBg = tier === 'A' ? 'bg-accent-emerald/10 border-accent-emerald/25' : tier === 'B' ? 'bg-accent-amber/10 border-accent-amber/25' : 'bg-accent-rose/10 border-accent-rose/25';

              return (
                <div key={c.id} className="rounded-2xl border border-border/60 bg-card/30 p-5 sm:p-6 hover:border-border transition-all">
                  <div className="grid sm:grid-cols-12 gap-4 items-start">
                    {/* Rank + Name */}
                    <div className="sm:col-span-5 flex items-start gap-4">
                      <span className="text-2xl font-black text-white/15 tabular-nums w-8 shrink-0 leading-none mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{c.name}</h3>
                          {c.isRx && (
                            <span className="text-[9px] font-mono font-bold text-accent-rose bg-accent-rose/10 border border-accent-rose/25 px-1.5 py-0.5 rounded">Rx</span>
                          )}
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${tierColor} ${tierBg}`}>
                            Tier {tier}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{c.category} · {c.full}</p>
                        <p className="text-xs text-white/55 leading-relaxed">{c.mechanism}</p>
                      </div>
                    </div>

                    {/* LQ Score */}
                    <div className="sm:col-span-2 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
                      <span className="text-[10px] font-mono text-muted-foreground sm:mb-1 hidden sm:block">LQ Score</span>
                      <div className="text-2xl font-black tabular-nums" style={{ color: scoreColor }}>{score.toFixed(1)}</div>
                      <div className="flex-1 sm:w-full">
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden sm:w-full w-24">
                          <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
                        </div>
                      </div>
                    </div>

                    {/* Clock estimate */}
                    <div className="sm:col-span-3">
                      <p className="text-[10px] font-mono text-muted-foreground mb-1 hidden sm:block">Clock estimate</p>
                      <p className="text-xs text-white/60 font-mono leading-relaxed">{c.clock}</p>
                      <p className="text-[9px] text-white/30 mt-1">{c.clockConfidence} confidence</p>
                    </div>

                    {/* CTA */}
                    <div className="sm:col-span-2 flex sm:justify-end items-start">
                      {c.libraryHref ? (
                        <Link
                          href={c.libraryHref}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors px-3 py-1.5 rounded-lg border"
                          style={{ color: c.color, borderColor: `${c.color}30`, background: `${c.color}0e` }}
                        >
                          Deep-dive <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-[10px] font-mono text-muted-foreground px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                          Library soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top study */}
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <p className="text-[10px] text-muted-foreground font-mono">
                      <span className="text-accent-amber font-bold">Key study:</span>{' '}
                      {c.topStudy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How-to Guide Section */}
      <section className="py-16 md:py-20 border-b border-border" style={{ background: 'linear-gradient(to bottom, #020811, #060d1a)' }}>
        <div className="container-page max-w-4xl">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent-violet border border-accent-violet/20 bg-accent-violet/[0.06] px-4 py-2 rounded-full mb-5">
              Step-by-Step Protocol
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              How to Build a Longevity Supplement Stack
            </h2>
            <p className="text-muted-foreground">
              Six steps from zero to a data-driven, evidence-graded protocol — no guesswork, no marketing bias.
            </p>
          </div>

          <div className="space-y-4">
            {HOW_TO_STEPS.map((step, i) => (
              <div key={step.name} className="flex gap-4 rounded-2xl border border-border/50 bg-white/[0.02] p-5">
                <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'rgba(0,224,255,0.12)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,224,255,0.2)' }}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5">{step.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-accent-cyan text-black hover:bg-accent-cyan/90 transition focus-ring">
              Start Step 1 — Take the Quiz <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/stacks" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/15 text-white/80 hover:border-white/30 transition focus-ring">
              Step 5 — Stack Architect
            </Link>
          </div>
        </div>
      </section>

      {/* Red flags to avoid */}
      <section className="py-16 border-b border-border bg-background">
        <div className="container-page max-w-4xl">
          <h2 className="text-2xl font-black text-white mb-3">Red Flags to Avoid When Buying</h2>
          <p className="text-muted-foreground mb-8">Most supplement marketing is misleading. These are the concrete signals of low-quality products:</p>

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {[
              'No Certificate of Analysis (COA) from a third-party lab',
              'S-NMN or racemic ALA (only R-enantiomer is mitochondrially active)',
              '"Proprietary blend" — you can\'t verify doses',
              'Dosing below RCT-matched levels (e.g. 50mg NMN vs 250mg used in trials)',
              'Claims of "reversing aging" without citing a human trial PMID',
              '"Liposomal" without verified encapsulation efficiency data',
              'Product not sold direct-to-consumer (resellers can break cold chain)',
              'Expiration dates over 24 months (NMN degrades — freshness matters)',
            ].map((flag) => (
              <div key={flag} className="flex items-start gap-3 rounded-xl p-4 border border-accent-rose/15 bg-accent-rose/[0.04]">
                <AlertTriangle className="w-4 h-4 text-accent-rose shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">{flag}</p>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-emerald hover:text-accent-cyan transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Full verification checklists in the Protocol Shop
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-black text-white mb-10">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {GUIDE_FAQS.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-border/60 bg-card/30 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-sm text-foreground group-open:text-accent-cyan transition-colors">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90 text-muted-foreground group-open:text-accent-cyan" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-accent-cyan/15 bg-accent-cyan/[0.04] p-6 text-center">
            <p className="text-sm text-white/70 mb-4">
              More detailed answers — mechanism deep-dives, dosing nuances, interaction warnings — are in the TNiC Library.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan hover:underline">
                Full FAQ (25+ questions) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/library" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-violet hover:underline">
                Compound Library <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/library/compare" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-emerald hover:underline">
                All Comparisons <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Deep-dive guide links */}
          <div className="mt-8">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center">Compound-specific guides</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { href: '/nad-supplement-guide', label: 'NAD+ Supplement Guide', desc: 'NMN vs NR, precursor dosing, and the NAD+ decline curve' },
                { href: '/glynac-supplement-guide', label: 'GlyNAC Guide', desc: '9 hallmarks reversed in 24-week RCT — Sekhar 2021' },
                { href: '/berberine-supplement-guide', label: 'Berberine Guide', desc: "The real evidence behind 'nature's Ozempic'" },
                { href: '/taurine-supplement-guide', label: 'Taurine Guide', desc: '80% decline by 60 — the Singh 2023 Science paper explained' },
                { href: '/sulforaphane-supplement-guide', label: 'Sulforaphane Guide', desc: 'NRF2 activation, form guide, and broccoli sprout protocol' },
                { href: '/spermidine-supplement-guide', label: 'Spermidine Guide', desc: 'ITP mouse data + Kiechl 2018 — the autophagy activator case' },
                { href: '/supplement-guides', label: 'All Supplement Guides', desc: 'Hub for every compound guide on TNiC' },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-xl border border-border/50 bg-card/40 hover:border-accent-cyan/30 hover:bg-accent-cyan/[0.03] p-4 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-foreground group-hover:text-accent-cyan transition-colors">{g.label}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent-cyan transition-colors" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-muted-foreground">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SubPageLayout>
  );
}
