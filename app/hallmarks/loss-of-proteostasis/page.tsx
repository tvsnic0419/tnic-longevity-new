import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Brain } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkHeroVisual } from '@/components/hallmarks/HallmarkHeroVisual';

export const metadata: Metadata = {
  title: 'Loss of Proteostasis | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into loss of proteostasis — the protein folding crisis underlying neurodegeneration. Mechanisms, chaperones, ubiquitin-proteasome, evidence-graded interventions (GlyNAC, sulforaphane, R-ALA), and biomarkers.',
  openGraph: {
    title: 'Loss of Proteostasis — Hallmark #4 of Aging | TNiC',
    description: 'How misfolded proteins accumulate with age, why it drives Alzheimer\'s and Parkinson\'s, and which compounds restore cellular cleanup capacity.',
  },
};

const BIOMARKERS = [
  { name: 'Protein carbonylation (plasma)', normal: '< 0.5 nmol/mg protein', note: 'Primary oxidative damage marker on proteins; specialist metabolomics labs' },
  { name: 'GSH/GSSG ratio', normal: '> 10:1 (reduced:oxidized glutathione)', note: 'Tracks cellular antioxidant capacity; SpectraCell or Vibrant Wellness labs' },
  { name: 'HSP70 (serum)', normal: 'Research context; baseline + post-intervention', note: 'Chaperone activity proxy; rises after heat exposure; falls chronically with age' },
  { name: 'p62 / SQSTM1 (tissue)', normal: 'Specialist labs only', note: 'Autophagy receptor that shuttles protein aggregates; accumulates when autophagy fails' },
  { name: 'Urinary 8-OHdG', normal: '< 15 ng/mg creatinine', note: 'Oxidative stress marker; elevated when protein + DNA oxidation is high' },
];

export default function LossOfProteostasisPage() {
  const hallmark = getHallmarkBySlug('loss-of-proteostasis')!;

  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-amber)_8%,transparent),transparent)]" />
          <div className="relative container-page max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-amber-400">Loss of Proteostasis</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Brain className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 tracking-widest uppercase">Hallmark #4 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Loss of<br /><span className="text-amber-400">Proteostasis</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Misfolded proteins are the substrate of Alzheimer’s, Parkinson’s, and ALS. The proteostasis
              network — chaperones, proteasome, autophagy — keeps proteins folded correctly. With age, it fails.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-amber-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/bio-age" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Assess My Bio Age</Link>
            </div>
            </div>
            <div className="lg:col-span-5">
              <HallmarkHeroVisual hallmark={hallmark} />
            </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-amber-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Three failure modes of the proteostasis network</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  The proteostasis network has three layers of defense. <strong className="text-foreground">Molecular chaperones</strong>
                  (HSP70, HSP90, small HSPs) recognize hydrophobic patches on unfolded proteins and shepherd them
                  to correct folding. When chaperone capacity is exceeded, misfolded proteins are tagged with
                  ubiquitin chains and delivered to the <strong className="text-foreground">26S proteasome</strong> for degradation.
                  When both fail, <strong className="text-foreground">selective autophagy</strong> (aggrephagy) captures protein
                  aggregates in autophagosomes and degrades them in lysosomes.
                </p>
                <p>
                  With age, all three fail simultaneously. Chaperone expression declines because HSF1 — the master
                  transcription factor for the heat shock response — becomes increasingly suppressed by SIRT1 loss
                  (which itself results from NAD+ decline). Proteasome activity drops ~30% between ages 30 and 70.
                  Autophagy becomes impaired as mTOR is chronically overactivated and AMPK underactivated.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  The consequence is <strong className="text-foreground">protein aggregate accumulation</strong>: amyloid-β and
                  tau in neurons (Alzheimer’s), α-synuclein in dopaminergic neurons (Parkinson’s), TDP-43 in
                  motor neurons (ALS), and Lewy bodies across multiple cell types. These aggregates are not
                  merely passive markers of disease — they actively inhibit proteasome function, spread via
                  prion-like mechanisms, and drive neuroinflammation.
                </p>
                <p>
                  Outside the brain, proteostasis failure drives: cataracts (crystallin aggregation), atherosclerosis
                  (oxidized LDL accumulation), and muscle wasting (impaired myosin/actin turnover). Maintaining
                  proteostasis is the upstream intervention for cognitive longevity — and it starts with the
                  redox environment that determines how many proteins oxidize in the first place.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <p className="text-xs text-amber-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Biomarkers that track proteostasis health</h2>
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
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Proteostasis support with clinical evidence</h2>
            <p className="text-muted-foreground mb-8">Tier A = human RCT evidence. Tier B = at least one human trial + mechanistic data.</p>
            <InterventionCards interventions={hallmark.interventions} />
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Protect cognitive longevity.</h2>
            <p className="text-muted-foreground mb-8">Build a proteostasis-targeted protocol: GlyNAC + sulforaphane + heat exposure, mapped to hallmark coverage in real time.</p>
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
