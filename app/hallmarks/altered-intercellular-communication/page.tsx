import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Network } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/altered-intercellular-communication' },
  title: 'Altered Intercellular Communication | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into altered intercellular communication — the signaling breakdown driving inflammaging. SASP, hormonal decline, insulin resistance, evidence-graded interventions, and biomarkers.',
  openGraph: {
    title: 'Altered Intercellular Communication — Hallmark #9 of Aging | TNiC',
    description: 'How aging disrupts hormonal, neuronal, and immune signaling networks — and which interventions restore coordinated tissue communication.',
  },
};

const BIOMARKERS = [
  { name: 'IL-6 (serum)', normal: '< 3.0 pg/mL', note: 'Primary SASP signaling cytokine; rises with age; predicts frailty and mortality' },
  { name: 'TNF-α (serum)', normal: '< 8.1 pg/mL', note: 'Amplifies NF-κB in target cells; disrupts insulin and leptin signaling' },
  { name: 'HOMA-IR (fasting glucose × insulin / 405)', normal: '< 1.5', note: 'Insulin resistance index; captures master signaling dysregulator' },
  { name: 'Cortisol rhythm (salivary 4-point)', normal: 'High AM, declining through day; low PM', note: 'Disrupted pattern = HPA axis dysregulation; common with sleep restriction and chronic stress' },
  { name: 'SHBG (sex hormone binding globulin)', normal: '20–80 nmol/L men; 40–120 nmol/L women', note: 'Low SHBG = high free insulin → further hormone binding suppression → downstream signaling collapse' },
];

export default function AlteredIntercellularCommunicationPage() {
  const hallmark = getHallmarkBySlug('altered-intercellular-communication')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="violet"
        theme="violet"
        icon={Network}
        lead="Cells coordinate via hormones, cytokines, and neural signals. With age, SASP floods the channels with inflammatory noise, hormones desync, and insulin resistance disrupts every downstream pathway."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-violet mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">Three channels of communication failure</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                Intercellular communication uses three channels: <strong className="text-foreground">endocrine signals</strong>
                {' '}(hormones traveling through blood), <strong className="text-foreground">paracrine signals</strong>
                {' '}(cytokines acting locally between adjacent cells), and <strong className="text-foreground">neuronal signals</strong>
                {' '}(electrochemical messages via synapses and neurotransmitters). Aging degrades all three.
              </p>
              <p>
                Endocrine failure: GH and IGF-1 decline ~14% per decade after 30 (somatopause). Testosterone and
                estrogen fall sharply after 40–50. DHEA drops from 30 onwards. These changes impair tissue
                maintenance, immune function, and metabolic regulation.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Paracrine failure is dominated by the <strong className="text-foreground">SASP</strong>: senescent cells
                secrete IL-6, IL-1β, TNF-α, and MMP into their microenvironment, recruiting macrophages,
                inducing neighboring cell senescence, and disrupting normal growth factor signaling. A
                single senescent cell can convert multiple surrounding cells to senescence via paracrine
                NF-κB activation.
              </p>
              <p>
                The master systemic amplifier is <strong className="text-foreground">insulin resistance</strong>. Hyperinsulinemia
                suppresses SHBG (reducing free sex hormones), activates mTOR (suppressing autophagy),
                drives adipose inflammation (amplifying SASP), and desensitizes downstream hormone receptors.
                Fixing insulin sensitivity has the broadest cross-hallmark impact of any metabolic intervention.
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
          <h2 className="heading-section text-foreground mb-6">Biomarkers that track intercellular signaling</h2>
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
          <h2 className="heading-section text-foreground mb-2">Restoring signaling fidelity</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-violet mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">Restore cellular coordination.</h2>
          <p className="text-body mb-8">Reduce SASP, fix insulin sensitivity, optimize circadian rhythm. The Stack Architect maps your protocol across all 12 hallmarks.</p>
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
