import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Timer } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/telomere-attrition' },
  title: 'Telomere Attrition | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into telomere attrition — the molecular clock at chromosome ends. Mechanisms, biomarkers, evidence-graded interventions (NMN, omega-3, stress reduction), and monitoring templates.',
  openGraph: {
    title: 'Telomere Attrition — Hallmark #2 of Aging | TNiC',
    description: 'How telomeres shorten with each cell division, what accelerates attrition, and what the clinical evidence says about slowing it.',
  },
};

const BIOMARKERS = [
  { name: 'Leukocyte telomere length (qPCR)', normal: 'Age-adjusted Z-score > −1.0 SD', note: 'LifeLength, Repeat Diagnostics, or TeloYears — compares vs age-matched reference population' },
  { name: 'Telomerase activity (TRAP assay)', normal: 'Specialist labs only', note: 'Functional measure; elevated post-exercise and MBSR practice; declining with chronic stress' },
  { name: 'hs-CRP', normal: '< 1.0 mg/L', note: 'Inflammation is the primary extrinsic accelerator of telomere shortening' },
  { name: 'Cortisol (AM serum or salivary)', normal: '10–20 µg/dL AM; circadian pattern intact', note: 'Chronic elevation predicts telomere attrition in longitudinal cohorts' },
  { name: 'Omega-3 index (EPA+DHA in RBCs)', normal: '> 8%', note: 'Higher index associated with slower shortening rate; easily modified with supplementation' },
];

export default function TelomereAttritionPage() {
  const hallmark = getHallmarkBySlug('telomere-attrition')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="violet"
        theme="violet"
        icon={Timer}
        lead="Every cell division shortens your telomeres by 50–200 base pairs. When they hit critical length, cells either senesce or die — limiting tissue repair, immunity, and healthspan."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-violet mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">The replication problem — and what makes it worse</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                DNA polymerase cannot replicate the 3&rsquo; end of the lagging strand — the &ldquo;end replication problem.&rdquo;
                Each replication cycle truncates telomeres by 50–200 bp. Telomerase, a reverse transcriptase
                enzyme, extends them in germ cells and stem cells — but is silenced in most somatic tissue.
                The result: <strong className="text-foreground">a finite replication counter built into every cell.</strong>
              </p>
              <p>
                When telomeres reach a critical length (~4–5 kb), they lose their T-loop protective structure.
                The cell detects exposed chromosome ends as double-strand breaks — triggering p53/p21-mediated
                senescence or apoptosis. This Hayflick limit is ~50–70 divisions for human fibroblasts.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Three extrinsic factors dramatically accelerate attrition beyond replication alone.
                <strong className="text-foreground"> Oxidative stress</strong> causes base oxidation (8-OHdG) preferentially
                at telomere GGG triplets — which are 10× more oxidation-sensitive than random genomic sequence.
                <strong className="text-foreground"> Chronic cortisol</strong> suppresses telomerase activity and drives
                oxidative damage. <strong className="text-foreground"> Inflammation</strong> (NF-κB / ROS) attacks telomere
                integrity between replications.
              </p>
              <p>
                The clinical significance: leukocyte telomere length (LTL) predicts all-cause mortality,
                cardiovascular disease, and biological age independent of chronological age. Individuals
                in the shortest LTL quartile have 2–3× higher cardiovascular risk than those in the longest
                quartile (Codd et al., Nat Genet 2013).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50 bg-card/10">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent-violet" aria-hidden="true" />
            <p className="text-label text-accent-violet">Monitoring</p>
          </div>
          <h2 className="heading-section text-foreground mb-6">Biomarkers that track telomere health</h2>
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
          <h2 className="heading-section text-foreground mb-2">What slows telomere shortening</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-violet mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">Protect your cellular lifespan.</h2>
          <p className="text-body mb-8">The Stack Architect maps stress-reduction, anti-inflammatory, and NAD+ compounds into a coordinated telomere-protective protocol.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/stacks" className="focus-ring tnic-button-accent [--btn-accent:var(--accent-violet)] inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
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
