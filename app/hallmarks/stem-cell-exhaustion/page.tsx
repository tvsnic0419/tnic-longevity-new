import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Heart } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/stem-cell-exhaustion' },
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
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="rose"
        theme="rose"
        icon={Heart}
        lead="Stem cells are your body's repair crews. By age 70, muscle stem cell numbers drop 50% and bone marrow output narrows. Wounds heal slower, muscle wastes, and immunity narrows to a smaller repertoire."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-rose mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">How stem cells exhaust — and why the niche matters as much as the cells</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                Tissue-specific stem cells maintain their pools through balanced <strong className="text-foreground">self-renewal</strong>
                {' '}(symmetric division → two stem cells) and <strong className="text-foreground">differentiation</strong>
                {' '}(asymmetric division → one stem cell + one progenitor). Aging shifts this balance toward
                differentiation and quiescence failure — stem cells divide less, differentiate abnormally,
                or enter senescence themselves.
              </p>
              <p>
                Three cell-intrinsic factors drive exhaustion: <strong className="text-foreground">epigenetic drift</strong>
                {' '}(methylation silences self-renewal genes like Wnt targets); <strong className="text-foreground">DNA damage
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
                and it&rsquo;s free.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50 bg-card/10">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent-rose" aria-hidden="true" />
            <p className="text-label text-accent-rose">Monitoring</p>
          </div>
          <h2 className="heading-section text-foreground mb-6">Biomarkers that track stem cell reserve</h2>
          <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-3 border-b border-border/40 text-label text-muted-foreground">
              <span>Marker</span><span>Reference range</span><span>Clinical note</span>
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
          <h2 className="heading-section text-foreground mb-2">Stem cell support with clinical evidence</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-rose mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">Preserve your regenerative reserve.</h2>
          <p className="text-body mb-8">Build a protocol targeting stem cell niches: Ca-AKG + NMN + anti-inflammatory stack, with resistance training as the cornerstone.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/stacks" className="focus-ring tnic-button-accent [--btn-accent:var(--accent-rose)] inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
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
