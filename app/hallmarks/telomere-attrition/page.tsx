import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Timer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Telomere Attrition | Hallmarks of Aging',
  description:
    'Deep-dive into telomere attrition — the molecular clock at chromosome ends. Mechanisms, biomarkers, evidence-graded interventions (NMN, omega-3, stress reduction), and monitoring templates.',
  openGraph: {
    title: 'Telomere Attrition — Hallmark #2 of Aging | TNiC',
    description: 'How telomeres shorten with each cell division, what accelerates attrition, and what the clinical evidence says about slowing it.',
  },
};

const INTERVENTIONS = [
  {
    name: 'Stress Reduction / HRV Training',
    tier: 'A',
    dose: 'Daily practice: 10–20 min meditation, breathwork, or biofeedback. Target HRV trend improvement.',
    mechanism:
      'Chronic cortisol directly accelerates telomere attrition via oxidative stress and reduced telomerase activity. Multiple RCTs on mindfulness-based stress reduction (MBSR) show measurable telomerase activity increases in PBMCs — the immune cells where telomere length is most clinically tracked (PMID: 20166168).',
    pmids: ['20166168', '24727492'],
    tier_color: 'emerald',
  },
  {
    name: 'Aerobic Exercise (Consistent, Moderate)',
    tier: 'A',
    dose: '150 min/week moderate intensity (Zone 2) + 2× strength training',
    mechanism:
      'Meta-analyses consistently show longer leukocyte telomeres in aerobically active vs sedentary adults — independent of age, BMI, and smoking status. Proposed mechanisms: reduced oxidative stress, increased telomerase activity, and lower cortisol chronically. Endurance athletes show the largest effect.',
    pmids: ['28367216', '26166433'],
    tier_color: 'emerald',
  },
  {
    name: 'NMN / NR (NAD+ precursors)',
    tier: 'B',
    dose: '500–1000 mg NMN or 300–1000 mg NR daily',
    mechanism:
      'NAD+-dependent SIRT1 deacetylates and activates TERT (telomerase reverse transcriptase) — the enzyme that extends telomeres. Additionally, PARP-mediated DNA repair at telomere ends depends on adequate NAD+. Age-related NAD+ decline may directly impair telomerase function.',
    pmids: ['34272067'],
    tier_color: 'amber',
  },
  {
    name: 'Omega-3 (EPA + DHA)',
    tier: 'B',
    dose: '2–4 g EPA+DHA daily from fish oil or algae source',
    mechanism:
      'Two large observational studies link higher plasma omega-3 index with slower telomere shortening rate. The proposed mechanism is reduced oxidative stress and NF-κB-mediated inflammation — both of which consume telomere length. VITAL trial subgroup analysis suggests cardiovascular protection.',
    pmids: ['25552792', '33167080'],
    tier_color: 'amber',
  },
];

const BIOMARKERS = [
  { name: 'Leukocyte telomere length (qPCR)', normal: 'Age-adjusted Z-score > −1.0 SD', note: 'LifeLength, Repeat Diagnostics, or TeloYears — compares vs age-matched reference population' },
  { name: 'Telomerase activity (TRAP assay)', normal: 'Specialist labs only', note: 'Functional measure; elevated post-exercise and MBSR practice; declining with chronic stress' },
  { name: 'hs-CRP', normal: '< 1.0 mg/L', note: 'Inflammation is the primary extrinsic accelerator of telomere shortening' },
  { name: 'Cortisol (AM serum or salivary)', normal: '10–20 µg/dL AM; circadian pattern intact', note: 'Chronic elevation predicts telomere attrition in longitudinal cohorts' },
  { name: 'Omega-3 index (EPA+DHA in RBCs)', normal: '> 8%', note: 'Higher index associated with slower shortening rate; easily modified with supplementation' },
];

export default function TelomereAttritionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-violet)_10%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-violet-400">Telomere Attrition</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Timer className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium text-violet-400 tracking-widest uppercase">Hallmark #2 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Telomere<br /><span className="text-violet-400">Attrition</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Every cell division shortens your telomeres by 50–200 base pairs. When they hit critical length,
              cells either senesce or die — limiting tissue repair, immunity, and healthspan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-violet-500 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-violet-400 transition-colors">
                Build My Stack <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/bio-age" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Assess My Bio Age
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">The replication problem — and what makes it worse</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  DNA polymerase cannot replicate the 3’ end of the lagging strand — the “end replication problem.”
                  Each replication cycle truncates telomeres by 50–200 bp. Telomerase, a reverse transcriptase
                  enzyme, extends them in germ cells and stem cells — but is silenced in most somatic tissue.
                  The result: <strong className="text-foreground">a finite replication counter built into every cell.</strong>
                </p>
                <p>
                  When telomeres reach a critical length (~4–5 kb), they lose their T-loop protective structure.
                  The cell detects exposed chromosome ends as double-strand breaks — triggering p53/p21-mediated
                  senescence or apoptosis. This Hayflick limit is ~50–70 divisions for human fibroblasts.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Three extrinsic factors dramatically accelerate attrition beyond replication alone.
                  <strong className="text-foreground"> Oxidative stress</strong> causes base oxidation (8-OHdG) preferentially
                  at telomere GGG triplets — which are 10× more oxidation-sensitive than random genomic sequence.
                  <strong className="text-foreground"> Chronic cortisol</strong> suppresses telomerase activity and drives
                  oxidative damage. <strong className="text-foreground"> Inflammation</strong> (NF-κB / ROS) attacks telomere
                  integrity between replications.
                </p>
                <p>
                  The clinical significance: leukocyte telomere length (LTL) predicts all-cause mortality,
                  cardiovascular disease, and biological age independent of chronological age. Individuals
                  in the shortest LTL quartile have 2–3× higher cardiovascular risk than those in the longest
                  quartile (Codd et al., Nat Genet 2013).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-violet-400" />
              <p className="text-xs text-violet-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Biomarkers that track telomere health</h2>
            <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
              <div className="grid grid-cols-3 px-6 py-3 border-b border-border/40 text-xs text-muted-foreground uppercase tracking-wide font-medium">
                <span>Marker</span><span>Reference range</span><span>Clinical note</span>
              </div>
              {BIOMARKERS.map((b, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border/40 last:border-0 text-sm">
                  <span className="font-medium text-foreground">{b.name}</span>
                  <span className="text-muted-foreground font-mono text-xs">{b.normal}</span>
                  <span className="text-muted-foreground text-xs">{b.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Evidence-Graded Interventions</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">What slows telomere shortening</h2>
            <p className="text-muted-foreground mb-8">Tier A = human RCT evidence. Tier B = at least one human trial + strong mechanistic data.</p>
            <div className="space-y-5">
              {INTERVENTIONS.map((iv) => (
                <div key={iv.name} className="rounded-2xl border border-border/60 bg-card/40 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-bold text-foreground text-lg">{iv.name}</h3>
                    <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${iv.tier === 'A' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                      Tier {iv.tier}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{iv.mechanism}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-muted-foreground"><strong className="text-foreground">Dose:</strong> {iv.dose}</span>
                    {iv.pmids.map((pmid) => (
                      <a key={pmid} href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-cyan-400 hover:border-cyan-500/40 transition-colors">PMID {pmid}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-violet-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Protect your cellular lifespan.</h2>
            <p className="text-muted-foreground mb-8">The Stack Architect maps stress-reduction, anti-inflammatory, and NAD+ compounds into a coordinated telomere-protective protocol.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Stack Architect <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/hallmarks" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><BookOpen className="w-4 h-4" />All Hallmarks</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
