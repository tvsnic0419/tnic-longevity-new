import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Zap, ArrowRight, FlaskConical, Activity, ShieldCheck, BookOpen } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkHeroVisual } from '@/components/hallmarks/HallmarkHeroVisual';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/library/cellular-senescence' },
  title: 'Cellular Senescence | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into cellular senescence — the zombie cell crisis driving chronic inflammation and tissue dysfunction. Mechanisms, SASP, evidence-graded senolytics (fisetin, quercetin + dasatinib), and monitoring biomarkers.',
  openGraph: {
    title: 'Cellular Senescence — Hallmark #6 of Aging | TNiC',
    description:
      'How zombie cells accumulate with age, why the SASP makes them so damaging, and what the clinical evidence says about senolytics.',
  },
};

const BIOMARKERS = [
  { name: 'p16INK4a (T-cells)', normal: 'Lower is better; age-adjusted', note: 'Best blood-based senescence burden marker; available via Iollo, Elysium Index' },
  { name: 'IL-6 (serum)', normal: '< 3.0 pg/mL', note: 'Primary SASP cytokine; rises linearly with senescent cell burden' },
  { name: 'IL-1β (serum)', normal: '< 5.0 pg/mL', note: 'NLRP3 inflammasome product; amplifies SASP paracrine signaling' },
  { name: 'GDF-15 (serum)', normal: '< 1200 pg/mL', note: 'Mitokine elevated by stressed/senescent mitochondria; correlates with all-cause mortality' },
  { name: 'hs-CRP', normal: '< 1.0 mg/L (optimal longevity range)', note: 'Downstream of SASP; accessible in any standard lipid panel' },
  { name: 'Caveolin-1 (plasma)', normal: 'Research use only', note: 'Senescence-associated plasma marker under development at Buck Institute' },
];

export default function CellularSenescencePage() {
  const hallmark = getHallmarkBySlug('cellular-senescence')!;

  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>

        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-rose)_10%,transparent),transparent)]" />
          <div className="relative container-page max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/library" className="hover:text-foreground transition-colors">Library</Link>
              <span>/</span>
              <span>Hallmarks</span>
              <span>/</span>
              <span className="text-rose-400">Cellular Senescence</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-medium text-rose-400 tracking-widest uppercase">Hallmark #6 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Cellular
              <br />
              <span className="text-rose-400">Senescence</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Senescent cells refuse to die and refuse to do their jobs. They secrete a toxic inflammatory cocktail called
              the SASP — and after age 60, they accumulate fast enough to drive tissue dysfunction across every organ system.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-rose-500 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-rose-400 transition-colors">
                Build My Stack <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/bio-age" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Assess My Bio Age
              </Link>
            </div>
            </div>
            <div className="lg:col-span-5">
              <HallmarkHeroVisual hallmark={hallmark} />
            </div>
            </div>
          </div>
        </section>

        {/* Mechanism */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-rose-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">The zombie cell crisis — and why the SASP is the real problem</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Cellular senescence is a tumor suppression mechanism gone wrong at scale. When a cell sustains irreparable
                  DNA damage, excessive oxidative stress, or oncogene activation, p53 and p16INK4a trigger permanent cell
                  cycle arrest — the cell stops dividing, preventing it from passing on mutations.
                </p>
                <p>
                  In youth, immune surveillance (NK cells, macrophages) efficiently clear senescent cells within days.
                  After age 40, immune clearance declines — and senescent cells <strong className="text-foreground">accumulate exponentially</strong>.
                  By age 70, senescent cells constitute 8–10% of cells in some tissues, up from under 1% at 30.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  The <strong className="text-foreground">Senescence-Associated Secretory Phenotype (SASP)</strong> is what makes
                  senescent cells dangerous neighbors. They secrete IL-6, IL-1β, TNF-α, MMP-3, MMP-9, and dozens
                  of other pro-inflammatory factors — converting surrounding healthy cells to senescence in a
                  paracrine cascade known as the “bystander effect.”
                </p>
                <p>
                  SASP drives: tissue fibrosis (via TGF-β), cancer microenvironment formation (via MMP-mediated ECM breakdown),
                  adipose inflammation (via PAI-1), and neuroinflammation (via astrocyte senescence and microglial priming).
                  Virtually every age-related disease has senescent cell accumulation as a contributing driver.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-4">Two Therapeutic Strategies</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                  <p className="font-bold text-foreground mb-1 text-sm">Senolytics</p>
                  <p className="text-xs text-muted-foreground">Kill senescent cells by blocking their survival pathways (BCL-2, PI3K/AKT). Goal: reduce total burden. Examples: Fisetin, D+Q, ABT-263.</p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="font-bold text-foreground mb-1 text-sm">Senomorphics</p>
                  <p className="text-xs text-muted-foreground">Suppress SASP secretion without killing senescent cells. Goal: reduce inflammatory output. Examples: Rapamycin (mTOR), Navitoclax (BCL-2), Metformin (NF-κB).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biomarkers */}
        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-rose-400" />
              <p className="text-xs text-rose-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Biomarkers that track senescent burden</h2>
            <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
              <div className="grid grid-cols-3 px-6 py-3 border-b border-border/40 text-xs text-muted-foreground uppercase tracking-wide font-medium">
                <span>Marker</span>
                <span>Reference range</span>
                <span>Clinical note</span>
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

        {/* Interventions */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Evidence-Graded Interventions</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Senolytics & senomorphics with clinical evidence</h2>
            <EvidenceTagLegend className="mb-8" />
            <InterventionCards interventions={hallmark.interventions} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-rose-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">
              Build a senolytic protocol.
            </h2>
            <p className="text-muted-foreground mb-8">
              The Stack Architect shows which compounds target cellular senescence, their evidence tiers,
              and interactions with everything else in your stack.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
                Stack Architect <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/library" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="w-4 h-4" />
                All Hallmarks
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
