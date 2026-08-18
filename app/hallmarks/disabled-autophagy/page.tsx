import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Layers } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/disabled-autophagy' },
  title: 'Disabled Autophagy | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into disabled autophagy — cellular recycling that fails with age. mTOR/AMPK axis, evidence-graded interventions (spermidine, NMN, resveratrol, fasting), and biomarkers.',
  openGraph: {
    title: 'Disabled Autophagy — Hallmark #5 of Aging | TNiC',
    description: 'How the cellular recycling system shuts down with age, and which compounds have clinical evidence for restoring it.',
  },
};

const BIOMARKERS = [
  { name: 'LC3-II/LC3-I ratio (PBMCs)', normal: 'Higher ratio = more autophagy; research labs only', note: 'Gold standard autophagy flux marker; requires fasting state sampling' },
  { name: 'p62/SQSTM1 (plasma)', normal: 'Lower is better — p62 accumulates when autophagy fails', note: 'Accessible via specialist labs; rises with autophagy impairment' },
  { name: 'Fasting glucose', normal: '70–90 mg/dL', note: 'mTOR is suppressed when glucose is low — fasting glucose tracks nutrient sensing tone' },
  { name: 'Ketone bodies (β-OHB)', normal: '> 0.5 mM during fasting window', note: 'Marker of active fat oxidation + autophagy induction; measurable with home ketone meter' },
  { name: 'Fasting insulin', normal: '< 5 µIU/mL', note: 'Low fasting insulin = mTOR suppressed = autophagy uninhibited; most important proxy' },
];

export default function DisabledAutophagyPage() {
  const hallmark = getHallmarkBySlug('disabled-autophagy')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="emerald"
        theme="emerald"
        icon={Layers}
        lead="Autophagy is cellular housekeeping — it digests damaged organelles, protein aggregates, and invading pathogens. mTOR chronically suppresses it with age. The result: junk accumulates inside every cell."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-emerald mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">mTOR vs AMPK — the switch aging breaks</h2>
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

      <section className="py-16 md:py-20 border-t border-border/50 bg-card/10">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
            <p className="text-label text-accent-emerald">Monitoring</p>
          </div>
          <h2 className="heading-section text-foreground mb-6">Biomarkers that track autophagy status</h2>
          <div className="premium-card">
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
          <h2 className="heading-section text-foreground mb-2">Autophagy inducers with clinical evidence</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-emerald mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">Restart your cellular cleanup.</h2>
          <p className="text-body mb-8">
            Combine fasting windows with spermidine and resveratrol — the Stack Architect shows synergy and optimal timing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/stacks" className="focus-ring tnic-button-accent [--btn-accent:var(--accent-emerald)] inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
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
