import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Network } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkHeroVisual } from '@/components/hallmarks/HallmarkHeroVisual';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/library/altered-intercellular-communication' },
  title: 'Altered Intercellular Communication | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into altered intercellular communication — the signaling breakdown driving inflammaging. SASP, hormonal decline, insulin resistance, evidence-graded interventions, and biomarkers.',
  openGraph: {
    title: 'Altered Intercellular Communication — Hallmark #9 of Aging | TNiC',
    description: 'How aging disrupts hormonal, neuronal, and immune signaling networks — and which interventions restore coordinated tissue communication.',
  },
};

const BIOMARKERS = [
  { name: 'IL-6 (serum)', normal: '< 3.0 pg/mL', note: 'Primary SASP signaling cytokine; rises with age; predicts frailty and mortality' },
  { name: 'TNF-α (serum)', normal: '< 8.1 pg/mL', note: 'Amplifies NF-κB in target cells; disrupts insulin and leptin signaling' },
  { name: 'HOMA-IR (fasting glucose × insulin / 405)', normal: '< 1.5', note: 'Insulin resistance index; captures master signaling dysregulator' },
  { name: 'Cortisol rhythm (salivary 4-point)', normal: 'High AM, declining through day; low PM', note: 'Disrupted pattern = HPA axis dysregulation; common with sleep restriction and chronic stress' },
  { name: 'SHBG (sex hormone binding globulin)', normal: '20–80 nmol/L men; 40–120 nmol/L women', note: 'Low SHBG = high free insulin → further hormone binding suppression → downstream signaling collapse' },
];

export default function AlteredIntercellularCommunicationPage() {
  const hallmark = getHallmarkBySlug('altered-intercellular-communication')!;

  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-violet)_8%,transparent),transparent)]" />
          <div className="relative container-page max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-violet-400">Altered Intercellular Communication</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Network className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium text-violet-400 tracking-widest uppercase">Hallmark #9 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Altered Intercellular<br /><span className="text-violet-400">Communication</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Cells coordinate via hormones, cytokines, and neural signals. With age, SASP floods the channels
              with inflammatory noise, hormones desync, and insulin resistance disrupts every downstream pathway.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-violet-500 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-violet-400 transition-colors">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
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
            <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Three channels of communication failure</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Intercellular communication uses three channels: <strong className="text-foreground">endocrine signals</strong>
                  (hormones traveling through blood), <strong className="text-foreground">paracrine signals</strong>
                  (cytokines acting locally between adjacent cells), and <strong className="text-foreground">neuronal signals</strong>
                  (electrochemical messages via synapses and neurotransmitters). Aging degrades all three.
                </p>
                <p>
                  Endocrine failure: GH and IGF-1 decline ~14% per decade after 30 (somatopause). Testosterone and
                  estrogen fall sharply after 40–50. DHEA drops from 30 onwards. These changes impair tissue
                  maintenance, immune function, and metabolic regulation.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Paracrine failure is dominated by the <strong className="text-foreground">SASP</strong>: senescent cells
                  secrete IL-6, IL-1β, TNF-α, and MMP into their microenvironment, recruiting macrophages,
                  inducing neighboring cell senescence, and disrupting normal growth factor signaling. A
                  single senescent cell can convert multiple surrounding cells to senescence via paracrine
                  NF-κB activation.
                </p>
                <p>
                  The master systemic amplifier is <strong className="text-foreground">insulin resistance</strong>. Hyperinsulinemia
                  suppresses SHBG (reducing free sex hormones), activates mTOR (suppressing autophagy),
                  drives adipose inflammation (amplifying SASP), and desensitizes downstream hormone receptors.
                  Fixing insulin sensitivity has the broadest cross-hallmark impact of any metabolic intervention.
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
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Biomarkers that track intercellular signaling</h2>
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
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Restoring signaling fidelity</h2>
            <EvidenceTagLegend className="mb-8" />
            <InterventionCards interventions={hallmark.interventions} />
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-violet-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Restore cellular coordination.</h2>
            <p className="text-muted-foreground mb-8">Reduce SASP, fix insulin sensitivity, optimize circadian rhythm. The Stack Architect maps your protocol across all 12 hallmarks.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 tnic-button-accent [--btn-accent:var(--accent-emerald)] focus-ring px-6 py-3 rounded-xl text-sm">Stack Architect <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/hallmarks" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><BookOpen className="w-4 h-4" />All Hallmarks</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
