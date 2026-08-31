import type { Metadata } from 'next';
import Link from 'next/link';
import { Dna, ArrowRight, FlaskConical, Activity, ShieldCheck, BookOpen } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/genomic-instability' },
  title: 'Genomic Instability | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into genomic instability — the first hallmark of aging. Mechanisms, biomarkers, evidence-graded interventions (NMN, sulforaphane, GlyNAC), and a monitoring template.',
  openGraph: {
    title: 'Genomic Instability — Hallmark #1 of Aging | TNiC',
    description:
      'Understand how DNA damage accumulates with age, what biomarkers track it, and which compounds have clinical evidence for slowing genomic degradation.',
  },
};

const BIOMARKERS = [
  { name: '8-OHdG (urine or serum)', normal: '< 15 ng/mg creatinine', note: 'Oxidative DNA damage marker — most accessible clinical proxy' },
  { name: 'γ-H2AX foci (PBMC)', normal: 'Lab-dependent', note: 'Gold standard for double-strand break quantification; available via specialty labs' },
  { name: 'Telomere length (leucocyte)', normal: 'Age-adjusted Z-score > −1.0', note: 'Tracks cumulative replication stress; available via LifeLength, Repeat Diagnostics' },
  { name: 'Micronuclei frequency', normal: '< 1.0 per 1000 cells', note: 'Structural chromosomal instability marker; research labs only' },
  { name: 'NAD+ (whole blood)', normal: '20–50 µM (declines ~1% per year after 30)', note: 'Tracks PARP repair capacity; Jinfiniti or LabCorp NAD+ panel' },
];

const CASCADE_STEPS = [
  'ROS / UV / Replication errors',
  '→',
  'DNA lesions (10k/cell/day)',
  '→',
  'PARP + SIRT1 consume NAD+',
  '→',
  'NAD+ depleted (~50% by age 60)',
  '→',
  'Repair backlog accumulates',
  '→',
  'Mutations / chromosomal rearrangements',
  '→',
  'Senescence + cancer risk',
];

export default function GenomicInstabilityPage() {
  const hallmark = getHallmarkBySlug('genomic-instability')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="cyan"
        theme="cyan"
        icon={Dna}
        lead="DNA suffers ~10,000 lesions per cell per day. Young cells repair almost all of them. Aging cells don't — and the accumulation of unrepaired damage is arguably the most upstream driver of every other hallmark."
      />

      {/* Mechanism */}
      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-cyan mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">Why DNA damage accumulates with age</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                DNA damage comes from two directions: <strong className="text-foreground">endogenous sources</strong> (mitochondrial reactive oxygen species,
                replication errors, hydrolysis) and <strong className="text-foreground">exogenous sources</strong> (UV, ionizing radiation, chemical mutagens).
                A healthy 20-year-old repairs the overwhelming majority within hours via base excision repair (BER),
                nucleotide excision repair (NER), and homologous recombination (HR).
              </p>
              <p>
                The critical failure mode of aging is not increased damage rate — it&rsquo;s <strong className="text-foreground">declining repair capacity</strong>.
                PARP1 and SIRT1, the sentinel repair enzymes, both consume NAD+ as substrate. As NAD+ falls ~50% between
                age 20 and 60, repair throughput collapses. Misrepaired breaks → chromosomal rearrangements → oncogenic
                mutations → senescent cells → systemic inflammation.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Telomere erosion is a specialized form of genomic instability. Telomeres shorten by ~50–200 bp per
                replication cycle because DNA polymerase cannot replicate the lagging strand end. After enough replications,
                telomeres reach the Hayflick limit — cells either senesce or mis-repair telomere ends as double-strand
                breaks, causing chromosomal fusions and further instability.
              </p>
              <p>
                The third axis is <strong className="text-foreground">epigenomic instability</strong>: oxidative damage to histones and aberrant DNMT3a
                activity scramble methylation patterns, silencing tumor suppressors and activating oncogenes without
                changing the sequence. This is the substrate of Horvath&rsquo;s epigenetic clock — the ratio of maintained
                vs. drifted CpG sites directly tracks biological age.
              </p>
            </div>
          </div>

          {/* Cascade diagram (text-based) */}
          <div className="premium-card mt-10 p-6">
            <p className="text-label text-muted-foreground mb-4">Damage Cascade</p>
            <div className="flex flex-wrap items-center gap-2 text-body-sm">
              {CASCADE_STEPS.map((step, i) => (
                <span key={i} className={step === '→' ? 'text-[var(--color-text-faint)]' : 'px-2.5 py-1 rounded-lg bg-card border border-border/60 text-foreground font-medium text-caption'}>
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Biomarkers */}
      <section className="py-16 md:py-20 border-t border-border/50 bg-card/10">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent-cyan" aria-hidden="true" />
            <p className="text-label text-accent-cyan">Monitoring</p>
          </div>
          <h2 className="heading-section text-foreground mb-6">Biomarkers that track genomic health</h2>
          <div className="premium-card">
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
          <p className="text-caption text-muted-foreground mt-4">
            Track these in the{' '}
            <Link href="/labs" className="text-accent-cyan link-underline focus-ring rounded">
              Lab Tracker
            </Link>
            {' '}— upload results and get trend analysis.
          </p>
        </div>
      </section>

      {/* Interventions */}
      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
            <p className="text-label text-accent-emerald">Evidence-Graded Interventions</p>
          </div>
          <h2 className="heading-section text-foreground mb-2">What actually works</h2>
          <EvidenceTagLegend className="mb-2" />
          <p className="text-body mb-8">We don&rsquo;t list Tier C interventions on this page.</p>
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-cyan mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">
            Build a DNA-repair protocol.
          </h2>
          <p className="text-body mb-8">
            The Stack Architect maps your goals to evidence-graded compounds, checks for interactions,
            and shows hallmark coverage in real time.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/stacks" className="focus-ring tnic-button-accent [--btn-accent:var(--accent-cyan)] inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
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
