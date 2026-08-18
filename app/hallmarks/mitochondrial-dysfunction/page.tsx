import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Zap } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

// Metadata's hallmark number was previously stale (said #9; the library — the
// single source of truth — pins this at #6). The rendered kicker in the hero
// now derives from `hallmark.number` directly, so drift is impossible.
export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/mitochondrial-dysfunction' },
  title: 'Mitochondrial Dysfunction | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into mitochondrial dysfunction — the energy crisis underlying aging. Mechanisms, electron transport chain decline, NAD+/AMPK axes, evidence-graded interventions (GlyNAC, NMN, CoQ10, urolithin A), and monitoring biomarkers.',
  openGraph: {
    title: 'Mitochondrial Dysfunction — Hallmark #6 of Aging | TNiC',
    description:
      'How mitochondria decline with age, why it matters across every organ, and which compounds have clinical evidence for mitochondrial rejuvenation.',
  },
};

const BIOMARKERS = [
  { name: 'NAD+ (whole blood)', normal: '20–50 µM; higher is better', note: 'Direct ETC fuel proxy; Jinfiniti Intracellular NAD+ test preferred' },
  { name: 'Lactate / pyruvate ratio', normal: '< 10:1', note: 'Elevated ratio = impaired OxPhos, forced anaerobic shift; specialist labs' },
  { name: 'GDF-15 (serum)', normal: '< 1200 pg/mL', note: 'Mitokine; rises with mitochondrial stress; tracks aging and metabolic disease' },
  { name: 'FGF21 (fasting serum)', normal: '< 300 pg/mL', note: 'Mitochondrial stress hormone; chronically elevated = mito dysfunction signal' },
  { name: 'Citrate synthase activity (PBMC)', normal: 'Age-adjusted; specialist labs', note: 'Direct mitochondrial density marker; declines ~30% between ages 30–70' },
  { name: 'VO2 max (cardiopulmonary testing)', normal: '>= age-matched 75th percentile', note: 'Best non-invasive whole-body mitochondrial function proxy' },
];

const MOLECULAR_AXES = [
  { axis: 'NAD+ → SIRT3', effect: 'Activates OxPhos enzymes, IDH2, SOD2; declined by ~50% by age 60' },
  { axis: 'AMPK → PGC-1α', effect: 'Drives mitochondrial biogenesis; suppressed by mTORC1 hyperactivation in aging' },
  { axis: 'PINK1 / Parkin', effect: 'Mitophagy quality control; removes depolarized mitochondria; declines with age' },
];

export default function MitochondrialDysfunctionPage() {
  const hallmark = getHallmarkBySlug('mitochondrial-dysfunction')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="amber"
        theme="amber"
        icon={Zap}
        lead="Mitochondria are your cells' power plants. By age 70, OxPhos efficiency drops ~30%, NAD+ falls ~50%, and mitochondrial ROS leaks accelerate damage across every hallmark of aging. Fixing this is foundational."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-amber mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">The energy crisis — and why it cascades</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                Mitochondrial decline is driven by three converging failures. First, <strong className="text-foreground">mtDNA mutation accumulation</strong>:
                mitochondrial DNA (37 genes) has no histone protection and minimal repair capacity. mtDNA mutation rate
                is 10–17× higher than nuclear DNA. By age 70, some cell types have mutation rates &gt;20% in respiratory
                chain genes.
              </p>
              <p>
                Second, <strong className="text-foreground">NAD+ depletion</strong>: NAD+ is both the electron carrier feeding Complex I and the
                substrate for SIRT3 — the deacetylase that activates mitochondrial metabolic enzymes. As NAD+ drops,
                Complex I stalls, the ETC backs up, and electrons leak to oxygen, forming superoxide instead of
                being efficiently coupled to ATP synthesis.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Third, <strong className="text-foreground">impaired mitophagy</strong>: damaged mitochondria are normally cleared by the PINK1/Parkin
                pathway — a quality control system that tags depolarized mitochondria for autophagy. With age, PINK1
                expression declines and Parkin activity decreases, allowing damaged mitochondria to accumulate and
                continue secreting ROS and pro-apoptotic factors.
              </p>
              <p>
                The consequence is <strong className="text-foreground">mitohormesis disruption</strong>: mild mitochondrial stress is normally
                beneficial (hormesis), triggering adaptive responses via PGC-1α, AMPK, and NRF2. Severe, chronic
                mitochondrial stress overwhelms these pathways and drives the inflammatory phenotype, mtDNA
                release into cytoplasm (activating cGAS-STING), and systemic age acceleration.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6">
            <p className="text-label text-muted-foreground mb-4">Key Molecular Axes</p>
            <div className="grid sm:grid-cols-3 gap-4 text-body-sm">
              {MOLECULAR_AXES.map((item) => (
                <div key={item.axis} className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <p className="font-bold text-foreground text-caption font-mono mb-1">{item.axis}</p>
                  <p className="text-caption text-muted-foreground">{item.effect}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50 bg-card/10">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent-amber" aria-hidden="true" />
            <p className="text-label text-accent-amber">Monitoring</p>
          </div>
          <h2 className="heading-section text-foreground mb-6">Biomarkers that track mitochondrial health</h2>
          <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-3 border-b border-border/40 text-label text-muted-foreground">
              <span>Marker</span>
              <span>Reference range</span>
              <span>Clinical note</span>
            </div>
            {BIOMARKERS.map((b) => (
              <div key={b.name} className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border/40 last:border-0 text-body-sm">
                <span className="font-medium text-foreground">{b.name}</span>
                <span className="text-muted-foreground font-mono text-caption">{b.normal}</span>
                <span className="text-muted-foreground text-caption">{b.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
            <p className="text-label text-accent-emerald">Evidence-Graded Interventions</p>
          </div>
          <h2 className="heading-section text-foreground mb-2">Mitochondrial interventions with human evidence</h2>
          <EvidenceTagLegend className="mb-2" />
          <p className="text-body mb-8">Listed in order of evidence strength.</p>
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-amber mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">
            Build a mitochondrial protocol.
          </h2>
          <p className="text-body mb-8">
            The Stack Architect maps your energy and mitochondrial goals to evidence-graded compounds
            and shows which hallmarks each compound targets.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/stacks" className="focus-ring tnic-button-accent [--btn-accent:var(--accent-amber)] inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
              Stack Architect <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href="/hallmarks" className="focus-ring tnic-button-outline inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              All Hallmarks
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
