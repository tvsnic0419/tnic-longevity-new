import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Heart } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkHeroVisual } from '@/components/hallmarks/HallmarkHeroVisual';

export const metadata: Metadata = {
  title: 'Stem Cell Exhaustion | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into stem cell exhaustion — the regenerative decline driving muscle loss, immune aging, and poor wound healing. Mechanisms, evidence-graded interventions (Ca-AKG, NMN, exercise), and biomarkers.',
  openGraph: {
    title: 'Stem Cell Exhaustion — Hallmark #8 of Aging | TNiC',
    description: 'How stem cell pools decline with age, why tissue regeneration fails, and which interventions have clinical evidence for supporting stem cell function.',
  },
};

const BIOMARKERS = [
  { name: 'CD34+ cell count (blood)', normal: '1–4 cells/µL; declining with age', note: 'Hematopoietic progenitor cells; tracks bone marrow stem cell output; CBC differential' },
  { name: 'Grip strength (dynamometry)', normal: '≥ 35 kg men, ≥ 20 kg women; preserve vs decline', note: 'Best functional proxy for muscle stem cell (satellite cell) maintenance; sarcopenia predictor' },
  { name: 'Wound healing time', normal: 'Skin wounds closing in < 7 days', note: 'Qualitative self-tracking; reflects dermal fibroblast and keratinocyte stem cell activity' },
  { name: 'IGF-1 (serum, fasting)', normal: '100–250 ng/mL age-adjusted', note: 'Stem cell niche growth factor; low IGF-1 = impaired satellite cell activation' },
  { name: 'Muscle mass (DEXA or BIA)', normal: 'Skeletal muscle index ≥ 7.0 kg/m² men, ≥ 5.5 kg/m² women', note: 'Annual tracking; decline > 1% per year signals sarcopenia trajectory' },
];

export default function StemCellExhaustionPage() {
  const hallmark = getHallmarkBySlug('stem-cell-exhaustion')!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-rose)_8%,transparent),transparent)]" />
          <div className="relative container-page max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-rose-400">Stem Cell Exhaustion</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-medium text-rose-400 tracking-widest uppercase">Hallmark #8 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Stem Cell<br /><span className="text-rose-400">Exhaustion</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Stem cells are your body’s repair crews. By age 70, muscle stem cell numbers drop 50% and bone marrow
              output narrows. Wounds heal slower, muscle wastes, and immunity narrows to a smaller repertoire.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-rose-500 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-rose-400 transition-colors">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
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
            <p className="text-xs text-rose-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">How stem cells exhaust — and why the niche matters as much as the cells</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Tissue-specific stem cells maintain their pools through balanced <strong className="text-foreground">self-renewal</strong>
                  (symmetric division → two stem cells) and <strong className="text-foreground">differentiation</strong>
                  (asymmetric division → one stem cell + one progenitor). Aging shifts this balance toward
                  differentiation and quiescence failure — stem cells divide less, differentiate abnormally,
                  or enter senescence themselves.
                </p>
                <p>
                  Three cell-intrinsic factors drive exhaustion: <strong className="text-foreground">epigenetic drift</strong>
                  (methylation silences self-renewal genes like Wnt targets); <strong className="text-foreground">DNA damage
                  accumulation</strong> (stem cells replicate rarely but are exposed to decades of ROS); and
                  <strong className="text-foreground"> metabolic reprogramming</strong> (stem cells require glycolysis for
                  self-renewal but age-related mTOR overactivation pushes them toward OxPhos and differentiation).
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  The niche — the cellular and ECM microenvironment surrounding stem cells — is equally critical.
                  <strong className="text-foreground"> Inflammaging</strong> (SASP from senescent niche cells) converts
                  the niche from a permissive to an inhibitory environment. NF-κB activation suppresses Wnt
                  and Notch signaling that stem cells need for self-renewal decisions. Even young stem cells
                  transplanted into an aged niche show impaired function.
                </p>
                <p>
                  The most tractable intervention: <strong className="text-foreground">mechanical loading activates satellite
                  cells</strong> (muscle stem cells) directly, bypassing niche dependence. Resistance training is the
                  only Tier A intervention with robust human RCT evidence for stem cell activation in aging muscle —
                  and it’s free.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-rose-400" />
              <p className="text-xs text-rose-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Biomarkers that track stem cell reserve</h2>
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
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Stem cell support with clinical evidence</h2>
            <p className="text-muted-foreground mb-8">Tier A = human RCT evidence. Tier B = at least one human trial + mechanistic data.</p>
            <InterventionCards interventions={hallmark.interventions} />
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-rose-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Preserve your regenerative reserve.</h2>
            <p className="text-muted-foreground mb-8">Build a protocol targeting stem cell niches: Ca-AKG + NMN + anti-inflammatory stack, with resistance training as the cornerstone.</p>
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
