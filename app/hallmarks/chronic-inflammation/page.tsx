import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Shield } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/chronic-inflammation' },
  title: 'Chronic Inflammation (Inflammaging) | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into chronic inflammation — the "inflammaging" hallmark driving cardiovascular disease, cancer, and neurodegeneration. Mechanisms, hs-CRP targets, evidence-graded interventions, and biomarkers.',
  openGraph: {
    title: 'Chronic Inflammation (Inflammaging) — Hallmark #10 | TNiC',
    description: 'How low-grade inflammation accumulates with age, why hs-CRP predicts mortality, and which compounds have the strongest clinical evidence for reducing inflammaging.',
  },
};

const BIOMARKERS = [
  { name: 'hs-CRP', normal: '< 1.0 mg/L (optimal longevity); < 3.0 mg/L (low CV risk)', note: 'Most accessible inflammaging marker; included in standard lipid panels; re-test quarterly' },
  { name: 'IL-6 (serum)', normal: '< 3.0 pg/mL', note: 'Primary driver of CRP production in liver; tracks SASP intensity more directly than CRP' },
  { name: 'Homocysteine', normal: '< 9 µmol/L', note: 'Pro-inflammatory via endothelial NF-κB activation; reduced by B12, folate, B6, TMG' },
  { name: 'Fibrinogen', normal: '200–350 mg/dL', note: 'Acute phase protein; rises with chronic NF-κB activity; cardiovascular risk amplifier' },
  { name: 'Omega-3 index (RBC EPA+DHA)', normal: '> 8%', note: 'SPM precursor pool; the single most modifiable anti-inflammatory biomarker in most people' },
  { name: 'Visceral adipose (DEXA)', normal: 'VAT < 100 cm² (men); < 80 cm² (women)', note: 'Major SASP source; tracks with waist circumference and metabolic health' },
];

export default function ChronicInflammationPage() {
  const hallmark = getHallmarkBySlug('chronic-inflammation')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="rose"
        theme="rose"
        icon={Shield}
        lead={'"Inflammaging" — the slow-burning systemic inflammation that accumulates with age — predicts cardiovascular events, cancer risk, and cognitive decline more reliably than almost any other single biomarker.'}
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-rose mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">NF-κB — the master inflammatory switch of aging</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                Inflammaging has five converging sources. <strong className="text-foreground">SASP</strong> from senescent
                cells is the largest — secreting IL-6, IL-1β, and TNF-α continuously into surrounding tissue.
                <strong className="text-foreground"> Gut permeability</strong> allows bacterial LPS to enter circulation,
                triggering TLR4/NF-κB. <strong className="text-foreground">Mitochondrial ROS</strong> activate the
                NLRP3 inflammasome, producing IL-1β. <strong className="text-foreground">Immune senescence</strong>
                {' '}(exhausted T-cells, skewed macrophages) impairs resolution. <strong className="text-foreground">Visceral adipose</strong>
                {' '}acts as a SASP-like endocrine organ.
              </p>
              <p>
                The convergence point is <strong className="text-foreground">NF-κB</strong>. It integrates all these signals
                and transcribes the inflammatory gene program: COX-2 (prostaglandins), iNOS (nitric oxide),
                IL-6, IL-1β, TNF-α, and MMP-3/9 (ECM-degrading). Targeting NF-κB upstream — via NRF2, SIRT1,
                or SPM precursors — is more durable than targeting individual cytokines downstream.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-foreground">hs-CRP is the clinical readout</strong>. C-reactive protein is produced
                by the liver in response to IL-6 — making it a downstream integrator of systemic NF-κB activity.
                Values above 3.0 mg/L independently predict cardiovascular events (JUPITER trial), all-cause
                mortality (Ridker et al.), and accelerated cognitive decline.
              </p>
              <p>
                The good news: inflammaging is highly modifiable. Omega-3 index moving from 4% to 8% reduces
                hs-CRP ~30%. Sulforaphane reduces CRP in human airway models within 4 weeks. Exercise training
                reduces hs-CRP ~20% in sedentary adults at 3 months. The TNiC stack targets NF-κB
                from three independent angles — NRF2 (upstream ROS), SIRT1 (direct NF-κB deacetylation),
                and SPM precursors (active resolution).
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
          <h2 className="heading-section text-foreground mb-6">Inflammaging biomarker panel</h2>
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
          <p className="text-caption text-muted-foreground mt-4">
            Log hs-CRP, IL-6, and homocysteine in the{' '}
            <Link href="/labs" className="text-accent-rose link-underline focus-ring rounded">
              Lab Tracker
            </Link>
            {' '}to monitor trend over time.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
            <p className="text-label text-accent-emerald">Evidence-Graded Interventions</p>
          </div>
          <h2 className="heading-section text-foreground mb-2">Anti-inflammaging interventions with human evidence</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-rose mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">Extinguish inflammaging.</h2>
          <p className="text-body mb-8">Build a multi-angle NF-κB suppression protocol: NRF2 + SIRT1 + omega-3. Track hs-CRP quarterly in the Lab Tracker.</p>
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
