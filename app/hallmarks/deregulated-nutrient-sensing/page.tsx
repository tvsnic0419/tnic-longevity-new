import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Scale } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/deregulated-nutrient-sensing' },
  title: 'Deregulated Nutrient Sensing | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into deregulated nutrient sensing — the mTOR/AMPK axis that controls whether cells grow or clean. Rapamycin, resveratrol, NMN, metformin, and clinical evidence.',
  openGraph: {
    title: 'Deregulated Nutrient Sensing — Hallmark #12 of Aging | TNiC',
    description:
      'How mTOR overactivation and AMPK decline disable cellular cleanup — and what the clinical evidence says about restoring nutrient sensing.',
  },
};

const BIOMARKERS = [
  { name: 'Fasting insulin', normal: '< 5 µIU/mL', note: 'Most sensitive mTOR suppression proxy; standard lab, ideally alongside fasting glucose' },
  { name: 'IGF-1 (fasting serum)', normal: '100–200 ng/mL (age-adjusted)', note: 'mTOR activator and CR-responsive; declines with dietary restriction — optimal ≠ always lowest' },
  { name: 'HOMA-IR', normal: '< 1.5', note: 'Insulin resistance index = (glucose × insulin) / 405; tracks nutrient sensing capacity' },
  { name: 'Ketone bodies (β-OHB)', normal: '> 0.3 mM in fasted state (4–8h fast)', note: 'Signal of mTOR suppression and AMPK activation; home ketone meters make this daily-trackable' },
  { name: 'Triglycerides', normal: '< 100 mg/dL', note: 'Elevated triglycerides = chronic insulin/mTOR overactivation; very sensitive to dietary change' },
];

export default function DeregulatedNutrientSensingPage() {
  const hallmark = getHallmarkBySlug('deregulated-nutrient-sensing')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="amber"
        theme="amber"
        icon={Scale}
        lead="Two nutrient-sensing kinases — mTOR and AMPK — decide whether cells grow or clean up. Aging tips the balance toward chronic mTOR overdrive: growth signals never rest, cleanup never runs, damaged organelles pile up."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-amber mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">mTOR growth vs AMPK cleanup — the switch aging jams</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                Two antagonistic kinase complexes implement nutrient sensing.
                <strong className="text-foreground"> mTORC1</strong> (activated by amino acids and growth factors)
                promotes protein synthesis and directly phosphorylates ULK1 at Ser757 to suppress autophagy.
                <strong className="text-foreground"> AMPK</strong> (activated when AMP/ATP rises) counteracts mTORC1
                by phosphorylating Raptor and activating ULK1 at Ser317/777 to switch cleanup back on.
              </p>
              <p>
                With age, mTORC1 becomes chronically hyperactivated via three mechanisms: impaired AMPK
                sensitivity as mitochondrial efficiency declines, elevated branched-chain amino acids from
                sarcopenic muscle catabolism, and broken S6K1 negative feedback (S6K1 normally limits insulin
                signaling; chronic activity converts this into pathological insulin resistance).
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-foreground">Rapamycin</strong> inhibits mTORC1 via FKBP12 complex
                formation — the most replicated longevity drug in mammals, extending lifespan 10–15% across
                20+ studies. Metformin and berberine activate AMPK via Complex I inhibition, raising AMP/ATP.
                Caloric restriction works by reducing Ragulator amino-acid sensing — all three restore
                autophagy through the same AMPK/mTOR balance.
              </p>
              <p>
                The consumer-accessible equivalent is optimizing the fasting/feeding cycle: even 14–16 hours
                of fasting allows AMPK to suppress mTOR, trigger autophagy, and initiate cellular maintenance
                programs that continuous eating blocks. Fasting insulin and ketone bodies are the two most
                accessible clinical readouts of that balance.
              </p>
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
          <h2 className="heading-section text-foreground mb-6">Biomarkers that track nutrient sensing tone</h2>
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
            <FlaskConical className="w-5 h-5 text-accent-amber" aria-hidden="true" />
            <p className="text-label text-accent-amber">Evidence-Graded Interventions</p>
          </div>
          <h2 className="heading-section text-foreground mb-2">mTOR / AMPK modulators with clinical evidence</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-amber mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">Retune the growth-vs-cleanup switch.</h2>
          <p className="text-body mb-8">Time your eating window, layer AMPK activators, and the Stack Architect will surface synergy and contraindications for the compounds above.</p>
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
