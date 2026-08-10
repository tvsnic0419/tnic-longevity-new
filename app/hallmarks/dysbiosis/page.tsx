import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Radio } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkHeroVisual } from '@/components/hallmarks/HallmarkHeroVisual';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/library/dysbiosis' },
  title: 'Dysbiosis | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into dysbiosis — the gut microbiome crisis driving inflammaging. Mechanisms, leaky gut, SCFA decline, evidence-graded interventions (fermented foods, fiber, sulforaphane), and biomarkers.',
  openGraph: {
    title: 'Dysbiosis — Hallmark #11 of Aging | TNiC',
    description: 'How the gut microbiome changes with age, why it drives systemic inflammation, and what has clinical evidence for restoring microbiome health.',
  },
};

const BIOMARKERS = [
  { name: 'Zonulin (serum)', normal: '< 35 ng/mL', note: 'Tight junction regulator; elevated = leaky gut; LabCorp, Quest, or ZRT Lab' },
  { name: 'Calprotectin (fecal)', normal: '< 50 µg/g', note: 'Neutrophil activation marker in gut; sensitive to intestinal inflammation' },
  { name: 'Microbiome diversity (Shannon index)', normal: 'Higher is better; > 3.5 Shannon', note: 'Viome, Thorne, or Genova GI Effects; annual baseline + post-intervention' },
  { name: 'LPS-binding protein (LBP)', normal: '< 7.2 µg/mL', note: 'Tracks bacterial endotoxin translocation from leaky gut; specialist labs' },
  { name: 'Short-chain fatty acids (fecal)', normal: 'Lab-dependent; butyrate > 10 mmol/kg stool', note: 'Fermentation capacity proxy; Genova or Doctor\'s Data GI panel' },
];

export default function DysbiosisPage() {
  const hallmark = getHallmarkBySlug('dysbiosis')!;

  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-emerald)_8%,transparent),transparent)]" />
          <div className="relative container-page max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-emerald-400">Dysbiosis</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400 tracking-widest uppercase">Hallmark #11 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Dysbiosis
              <br /><span className="text-emerald-400">& the Aging Gut</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Your gut hosts 38 trillion microorganisms — more than your own cells. By age 70, microbial diversity
              drops ~30%, SCFA production collapses, and gut permeability rises, flooding the body with bacterial
              endotoxins that drive systemic inflammation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 tnic-button-accent [--btn-accent:var(--accent-emerald)] focus-ring px-5 py-3 rounded-xl text-sm">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/labs" className="inline-flex items-center gap-2 tnic-button-outline focus-ring px-5 py-3 rounded-xl text-sm font-medium">Track Zonulin</Link>
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
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="heading-section text-foreground mb-6">The gut-inflammaging axis — three failure cascades</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Aging microbiome shifts follow a predictable pattern: <strong className="text-foreground">Faecalibacterium
                  prausnitzii</strong> (the primary butyrate producer and anti-inflammatory organism) and
                  <strong className="text-foreground"> Bifidobacterium</strong> (short-chain fatty acid producer, barrier
                  maintainer) decline. <strong className="text-foreground">Proteobacteria</strong> (gram-negative LPS-rich bacteria)
                  expand. The result: less butyrate to fuel colonocytes, more LPS to trigger systemic TLR4 activation.
                </p>
                <p>
                  <strong className="text-foreground">Leaky gut</strong> follows: tight junction proteins (ZO-1, occludin)
                  require butyrate for expression. As SCFA production falls, tight junctions weaken. Bacterial
                  LPS and peptidoglycans translocate into portal circulation — driving hepatic NF-κB activation,
                  systemic IL-6 production, and metabolic endotoxemia.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  The gut also produces <strong className="text-foreground">~90% of systemic serotonin</strong> and
                  hosts the enteric nervous system — 500 million neurons communicating bidirectionally with
                  the brain via the vagus nerve. Dysbiosis disrupts gut-brain axis signaling, driving
                  neuroinflammation, altered mood, and impaired cognitive function independently of systemic
                  cytokine effects.
                </p>
                <p>
                  The microbiome also regulates NAD+ metabolism via the kynurenine pathway. Age-related dysbiosis
                  shifts tryptophan metabolism away from serotonin/NAD+ production toward inflammatory kynurenines —
                  reducing NAD+ precursor availability and amplifying neuroinflammation simultaneously.
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
            <h2 className="heading-section text-foreground mb-6">Gut health biomarkers</h2>
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
            <h2 className="heading-section text-foreground mb-2">Microbiome restoration with clinical evidence</h2>
            <EvidenceTagLegend className="mb-8" />
            <InterventionCards interventions={hallmark.interventions} />
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-5" />
            <h2 className="heading-section text-foreground mb-4">Rebuild your microbiome.</h2>
            <p className="text-muted-foreground mb-8">30 plant species a week + daily fermented foods is the highest-ROI gut intervention. Sulforaphane protects the barrier. Track zonulin in the Labs.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 tnic-button-accent [--btn-accent:var(--accent-emerald)] focus-ring px-6 py-3 rounded-xl text-sm">Stack Architect <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/hallmarks" className="inline-flex items-center gap-2 tnic-button-outline focus-ring px-6 py-3 rounded-xl text-sm font-medium"><BookOpen className="w-4 h-4" />All Hallmarks</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
