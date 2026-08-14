import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Radio } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/dysbiosis' },
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
  { name: 'Short-chain fatty acids (fecal)', normal: "Lab-dependent; butyrate > 10 mmol/kg stool", note: "Fermentation capacity proxy; Genova or Doctor's Data GI panel" },
];

export default function DysbiosisPage() {
  const hallmark = getHallmarkBySlug('dysbiosis')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="emerald"
        theme="emerald"
        icon={Radio}
        lead="Your gut hosts 38 trillion microorganisms — more than your own cells. By age 70, microbial diversity drops ~30%, SCFA production collapses, and gut permeability rises, flooding the body with bacterial endotoxins that drive systemic inflammation."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-emerald mb-4">The Mechanism</p>
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

      <section className="py-16 md:py-20 border-t border-border/50 bg-card/10">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
            <p className="text-label text-accent-emerald">Monitoring</p>
          </div>
          <h2 className="heading-section text-foreground mb-6">Gut health biomarkers</h2>
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
          <h2 className="heading-section text-foreground mb-2">Microbiome restoration with clinical evidence</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-emerald mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">Rebuild your microbiome.</h2>
          <p className="text-body mb-8">30 plant species a week + daily fermented foods is the highest-ROI gut intervention. Sulforaphane protects the barrier. Track zonulin in the Labs.</p>
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
