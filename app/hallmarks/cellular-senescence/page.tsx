import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, ArrowRight, FlaskConical, Activity, ShieldCheck, BookOpen } from 'lucide-react';
import { getHallmarkBySlug } from '@/lib/hallmarks-library';
import { InterventionCards } from '@/components/hallmarks/InterventionCards';
import { HallmarkPageHero } from '@/components/hallmarks/HallmarkPageHero';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';

// Previous OpenGraph title said "#6" — library pins this at #7. The hero
// kicker now derives from hallmark.number so drift can't return.
export const metadata: Metadata = {
  alternates: { canonical: '/hallmarks/cellular-senescence' },
  title: 'Cellular Senescence | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into cellular senescence — the zombie cell crisis driving chronic inflammation and tissue dysfunction. Mechanisms, SASP, evidence-graded senolytics (fisetin, quercetin + dasatinib), and monitoring biomarkers.',
  openGraph: {
    title: 'Cellular Senescence — Hallmark #7 of Aging | TNiC',
    description:
      'How zombie cells accumulate with age, why the SASP makes them so damaging, and what the clinical evidence says about senolytics.',
  },
};

const BIOMARKERS = [
  { name: 'p16INK4a (T-cells)', normal: 'Lower is better; age-adjusted', note: 'Best blood-based senescence burden marker; available via Iollo, Elysium Index' },
  { name: 'IL-6 (serum)', normal: '< 3.0 pg/mL', note: 'Primary SASP cytokine; rises linearly with senescent cell burden' },
  { name: 'IL-1β (serum)', normal: '< 5.0 pg/mL', note: 'NLRP3 inflammasome product; amplifies SASP paracrine signaling' },
  { name: 'GDF-15 (serum)', normal: '< 1200 pg/mL', note: 'Mitokine elevated by stressed/senescent mitochondria; correlates with all-cause mortality' },
  { name: 'hs-CRP', normal: '< 1.0 mg/L (optimal longevity range)', note: 'Downstream of SASP; accessible in any standard lipid panel' },
  { name: 'Caveolin-1 (plasma)', normal: 'Research use only', note: 'Senescence-associated plasma marker under development at Buck Institute' },
];

export default function CellularSenescencePage() {
  const hallmark = getHallmarkBySlug('cellular-senescence')!;

  return (
    <>
      <HallmarkPageHero
        hallmark={hallmark}
        hue="rose"
        theme="rose"
        icon={Zap}
        lead="Senescent cells refuse to die and refuse to do their jobs. They secrete a toxic inflammatory cocktail called the SASP — and after age 60, they accumulate fast enough to drive tissue dysfunction across every organ system."
      />

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page max-w-4xl">
          <p className="text-label text-accent-rose mb-4">The Mechanism</p>
          <h2 className="heading-section text-foreground mb-6">The zombie cell crisis — and why the SASP is the real problem</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                Cellular senescence is a tumor suppression mechanism gone wrong at scale. When a cell sustains irreparable
                DNA damage, excessive oxidative stress, or oncogene activation, p53 and p16INK4a trigger permanent cell
                cycle arrest — the cell stops dividing, preventing it from passing on mutations.
              </p>
              <p>
                In youth, immune surveillance (NK cells, macrophages) efficiently clear senescent cells within days.
                After age 40, immune clearance declines — and senescent cells <strong className="text-foreground">accumulate exponentially</strong>.
                By age 70, senescent cells constitute 8–10% of cells in some tissues, up from under 1% at 30.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                The <strong className="text-foreground">Senescence-Associated Secretory Phenotype (SASP)</strong> is what makes
                senescent cells dangerous neighbors. They secrete IL-6, IL-1β, TNF-α, MMP-3, MMP-9, and dozens
                of other pro-inflammatory factors — converting surrounding healthy cells to senescence in a
                paracrine cascade known as the &ldquo;bystander effect.&rdquo;
              </p>
              <p>
                SASP drives: tissue fibrosis (via TGF-β), cancer microenvironment formation (via MMP-mediated ECM breakdown),
                adipose inflammation (via PAI-1), and neuroinflammation (via astrocyte senescence and microglial priming).
                Virtually every age-related disease has senescent cell accumulation as a contributing driver.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6">
            <p className="text-label text-muted-foreground mb-4">Two Therapeutic Strategies</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-accent-rose/25 bg-accent-rose/5 p-4">
                <p className="font-bold text-foreground mb-1 heading-card">Senolytics</p>
                <p className="text-caption text-muted-foreground">Kill senescent cells by blocking their survival pathways (BCL-2, PI3K/AKT). Goal: reduce total burden. Examples: Fisetin, D+Q, ABT-263.</p>
              </div>
              <div className="rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4">
                <p className="font-bold text-foreground mb-1 heading-card">Senomorphics</p>
                <p className="text-caption text-muted-foreground">Suppress SASP secretion without killing senescent cells. Goal: reduce inflammatory output. Examples: Rapamycin (mTOR), Navitoclax (BCL-2), Metformin (NF-κB).</p>
              </div>
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
          <h2 className="heading-section text-foreground mb-6">Biomarkers that track senescent burden</h2>
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
          <h2 className="heading-section text-foreground mb-2">Senolytics &amp; senomorphics with clinical evidence</h2>
          <EvidenceTagLegend className="mb-8" />
          <InterventionCards interventions={hallmark.interventions} />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container-page text-center max-w-2xl">
          <ShieldCheck className="w-10 h-10 text-accent-rose mx-auto mb-5" aria-hidden="true" />
          <h2 className="heading-section text-foreground mb-4">
            Build a senolytic protocol.
          </h2>
          <p className="text-body mb-8">
            The Stack Architect shows which compounds target cellular senescence, their evidence tiers,
            and interactions with everything else in your stack.
          </p>
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
