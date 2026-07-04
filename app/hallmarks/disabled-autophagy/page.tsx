import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disabled Autophagy | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into disabled autophagy — cellular recycling that fails with age. mTOR/AMPK axis, evidence-graded interventions (spermidine, NMN, resveratrol, fasting), and biomarkers.',
  openGraph: {
    title: 'Disabled Autophagy — Hallmark #5 of Aging | TNiC',
    description: 'How the cellular recycling system shuts down with age, and which compounds have clinical evidence for restoring it.',
  },
};

const INTERVENTIONS = [
  {
    name: 'Time-Restricted Eating (16:8+)',
    tier: 'A',
    dose: 'Eating window ≤ 8 hours daily; 24–72h fasts monthly for deeper autophagy',
    mechanism:
      'The most accessible autophagy inducer. During the fasting window, falling insulin/IGF-1 suppresses mTORC1, releasing the brake on autophagy. AMPK activates ULK1 — the autophagy initiation kinase. Multiple human trials (PMID: 31601727) confirm autophagy induction via LC3-II elevation and p62 reduction in peripheral blood cells during 24h fasting.',
    pmids: ['31601727', '27411588'],
    tier_color: 'emerald',
  },
  {
    name: 'Spermidine',
    tier: 'B',
    dose: '1–3 mg daily (wheat germ extract or SpermidineLIFE)',
    mechanism:
      'Spermidine induces autophagy via EP300 histone acetyltransferase inhibition — independently of mTOR — making it combinable with other autophagy inducers without redundancy. A 2021 German RCT (PMID: 33932338) showed improved cognitive performance in older adults at risk for dementia, attributed to autophagy-mediated neuronal maintenance.',
    pmids: ['33932338', '26822811'],
    tier_color: 'amber',
  },
  {
    name: 'Resveratrol → AMPK Activation',
    tier: 'B',
    dose: '250–500 mg daily, preferably with a fat-containing meal',
    mechanism:
      'Resveratrol activates AMPK (and indirectly SIRT1) — both upstream activators of autophagy. AMPK phosphorylates ULK1 at Ser317 and Ser777, activating the autophagy initiation complex. SIRT1 deacetylates ATG5, ATG7, and LC3, promoting autophagosome maturation.',
    pmids: ['21360229'],
    tier_color: 'amber',
  },
  {
    name: 'NMN → SIRT1 Autophagy Axis',
    tier: 'B',
    dose: '500–1000 mg NMN daily',
    mechanism:
      'SIRT1 requires NAD+ as substrate to deacetylate autophagy regulators. Age-related NAD+ decline reduces SIRT1 activity, impairing autophagosome formation and lysosomal biogenesis. NMN restores NAD+ and reactivates the SIRT1-autophagy connection.',
    pmids: ['34272067'],
    tier_color: 'amber',
  },
];

const BIOMARKERS = [
  { name: 'LC3-II/LC3-I ratio (PBMCs)', normal: 'Higher ratio = more autophagy; research labs only', note: 'Gold standard autophagy flux marker; requires fasting state sampling' },
  { name: 'p62/SQSTM1 (plasma)', normal: 'Lower is better — p62 accumulates when autophagy fails', note: 'Accessible via specialist labs; rises with autophagy impairment' },
  { name: 'Fasting glucose', normal: '70–90 mg/dL', note: 'mTOR is suppressed when glucose is low — fasting glucose tracks nutrient sensing tone' },
  { name: 'Ketone bodies (β-OHB)', normal: '> 0.5 mM during fasting window', note: 'Marker of active fat oxidation + autophagy induction; measurable with home ketone meter' },
  { name: 'Fasting insulin', normal: '< 5 µIU/mL', note: 'Low fasting insulin = mTOR suppressed = autophagy uninhibited; most important proxy' },
];

export default function DisabledAutophagyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-emerald)_8%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-emerald-400">Disabled Autophagy</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400 tracking-widest uppercase">Hallmark #5 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Disabled<br /><span className="text-emerald-400">Autophagy</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Autophagy is cellular housekeeping — it digests damaged organelles, protein aggregates, and invading pathogens.
              mTOR chronically suppresses it with age. The result: junk accumulates inside every cell.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/bio-age" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Assess My Bio Age</Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">mTOR vs AMPK — the switch aging breaks</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Autophagy is controlled by a molecular switch: <strong className="text-foreground">mTORC1 suppresses it</strong>
                  (nutrient-sensing kinase active when amino acids and glucose are abundant) and
                  <strong className="text-foreground"> AMPK activates it</strong> (energy-sensing kinase active when AMP/ATP ratio rises).
                  In youth, these balance: fed state = growth (mTOR on); fasted state = cleanup (AMPK on).
                </p>
                <p>
                  Aging biases this balance toward chronic mTOR overactivation. Reduced insulin sensitivity
                  paradoxically keeps mTOR active even in fasted states. AMPK activity declines because
                  mitochondria maintain a higher baseline AMP/ATP ratio (less efficient). NAD+ decline
                  reduces SIRT1, which deacetylates and activates AMPK upstream regulators.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  The practical consequence: <strong className="text-foreground">autophagy flux slows by ~60% between
                  ages 40 and 70</strong> in liver — the most studied tissue. Damaged mitochondria
                  (which should be cleared via mitophagy), protein aggregates, and lipid droplets accumulate.
                  This directly drives all other hallmarks via cellular toxicity and inflammation.
                </p>
                <p>
                  The therapeutic insight: autophagy can be induced <em>without</em> starving. Spermidine
                  bypasses mTOR entirely via EP300 inhibition. Resveratrol and NMN activate SIRT1/AMPK.
                  Strategic fasting windows deliver the biggest signal. Combining two or three of these
                  approaches produces synergistic autophagy induction with clinical data supporting each.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Biomarkers that track autophagy status</h2>
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
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Autophagy inducers with clinical evidence</h2>
            <p className="text-muted-foreground mb-8">Tier A = human RCT evidence. Tier B = at least one human trial + mechanistic data.</p>
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
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Restart your cellular cleanup.</h2>
            <p className="text-muted-foreground mb-8">Combine fasting windows with spermidine and resveratrol — the Stack Architect shows synergy and optimal timing.</p>
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
