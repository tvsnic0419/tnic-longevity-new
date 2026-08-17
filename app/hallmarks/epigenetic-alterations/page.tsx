import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Dna } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/epigenetic-alterations' },
  title: 'Epigenetic Alterations | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into epigenetic alterations — the aging clock written in methylation. Mechanisms, Horvath clock, evidence-graded interventions (Ca-AKG, NMN, resveratrol), and tracking templates.',
  openGraph: {
    title: 'Epigenetic Alterations — Hallmark #3 of Aging | TNiC',
    description: 'How DNA methylation drifts with age, what epigenetic clocks measure, and which compounds have clinical evidence for epigenetic rejuvenation.',
  },
};

const BIOMARKERS = [
  { name: 'Horvath DNAmAge (blood)', normal: 'Biological age ≤ chronological age', note: 'TruAge, GrimAge, or Elysium Index — gold standard epigenetic clock; annual retesting' },
  { name: 'GrimAge (mortality predictor)', normal: 'Acceleration ≤ 0 years', note: 'Best predictor of all-cause mortality among all clocks; tracks SASP-linked methylation sites' },
  { name: 'DunedinPACE', normal: '< 1.0 (pace of aging per year)', note: 'Longitudinal aging rate measure — more sensitive to intervention than single-timepoint clocks' },
  { name: 'Plasma AKG levels', normal: 'Research context; declining with age', note: 'Tracks cofactor availability for TET demethylases — specialist metabolomics panels' },
  { name: 'NAD+ (whole blood)', normal: '20–50 µM', note: 'Substrate for SIRT1/6 epigenetic maintenance; Jinfiniti or LabCorp panel' },
];

export default function EpigeneticAlterationsPage() {
  const hallmark = getHallmarkBySlug('epigenetic-alterations')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="cyan"
        theme="cyan"
        icon={Dna}
        lead="Your DNA sequence doesn't change — but which genes are active does. Methylation patterns drift with age, silencing youthful genes and reactivating pro-aging ones. Horvath's clock reads this drift to the year."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-cyan mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">The epigenetic clock — and why it&rsquo;s partially reversible</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                Epigenetic aging is the progressive drift of DNA methylation patterns away from youthful states.
                CpG sites — dinucleotide positions where a cytosine precedes a guanine — can be methylated
                (gene-silencing) or unmethylated (gene-activating). In young cells, this pattern is tightly regulated
                by DNMT3 (methylation) and TET (demethylation) enzymes.
              </p>
              <p>
                With age, three disruptions occur simultaneously: <strong className="text-foreground">global hypomethylation</strong>
                — transposable elements and repetitive sequences are de-repressed, fueling genomic instability;
                <strong className="text-foreground"> promoter hypermethylation</strong> — tumor suppressors and longevity genes
                are silenced; and <strong className="text-foreground">heterochromatin dissolution</strong> — structural chromatin
                loses its H3K9me3 marks as SIRT1 activity falls with NAD+.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Steve Horvath&rsquo;s 2013 discovery (Genome Biology) identified 353 CpG sites whose methylation state
                predicts age with a median error of 3.6 years across all tissues. Subsequent clocks (GrimAge, DunedinPACE)
                refined this to predict mortality and pace of aging respectively.
              </p>
              <p>
                The most important finding: <strong className="text-foreground">epigenetic age is partially reversible.</strong>
                {' '}Yamanaka factor reprogramming (Oct4, Sox2, Klf4) resets methylation to embryonic patterns in mice —
                restoring vision and cognition. The Horvath/Sinclair &ldquo;Information Theory of Aging&rdquo; frames this as
                recoverable signal, not irreversible entropy. AKG supplementation in humans already shows 8-year
                epigenetic age reduction in a controlled trial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50 bg-card/10">
        <div className="container-page max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent-cyan" aria-hidden="true" />
            <p className="text-label text-accent-cyan">Monitoring</p>
          </div>
          <h2 className="heading-section text-foreground mb-6">Epigenetic clocks and biomarkers</h2>
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
          <h2 className="heading-section text-foreground mb-2">Epigenetic reprogramming with clinical evidence</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-cyan mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">Slow your epigenetic clock.</h2>
          <p className="text-body mb-8">Build a Ca-AKG + NMN + resveratrol protocol and track your biological age with the Bio Age Engine.</p>
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
