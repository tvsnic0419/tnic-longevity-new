import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Scale, Pill, Library } from 'lucide-react';
import { getCompoundsForHallmark } from '@/lib/library-graph';

export const metadata: Metadata = {
  title: 'Deregulated Nutrient Sensing | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into deregulated nutrient sensing — the mTOR/AMPK axis that controls whether cells grow or clean. Rapamycin, resveratrol, NMN, metformin, and clinical evidence.',
  openGraph: {
    title: 'Deregulated Nutrient Sensing — Hallmark #12 of Aging | TNiC',
    description: 'How mTOR overactivation and AMPK decline disable cellular cleanup — and what the clinical evidence says about restoring nutrient sensing.',
  },
};

const INTERVENTIONS = [
  {
    name: 'Caloric Restriction / Strategic Fasting',
    tier: 'A',
    dose: '20–30% CR or 16:8 TRE daily; 2–5 day extended fast quarterly',
    mechanism:
      'The most replicated lifespan intervention across species. CR suppresses mTORC1 (via reduced amino acid and glucose signaling through Rag GTPases and DEPTOR), activates AMPK (via rising AMP/ATP), and derepresses autophagy, SIRT1/3, and mitophagy simultaneously. The CALERIE human trial (PMID: 27544442) confirmed favorable metabolic and inflammatory changes at 2 years.',
    pmids: ['27544442', '27411588'],
    tier_color: 'emerald',
  },
  {
    name: 'Resveratrol → AMPK / Sirtuin Axis',
    tier: 'B',
    dose: '250–500 mg daily; pterostilbene or micronized forms preferred for bioavailability',
    mechanism:
      'Resveratrol activates AMPK directly (via LKB1 pathway) and SIRT1 allosterically — both upstream activators of autophagy and mitochondrial biogenesis. AMPK phosphorylates ULK1 (autophagy initiation) and TFEB (lysosome biogenesis). SIRT1 deacetylates PGC-1α, driving mitochondrial renewal. Acts as a CR-mimetic compound.',
    pmids: ['21360229', '17086191'],
    tier_color: 'amber',
  },
  {
    name: 'NMN → SIRT1 / mTOR Counterbalance',
    tier: 'B',
    dose: '500–1000 mg NMN daily',
    mechanism:
      'Sirtuins (SIRT1, SIRT3, SIRT6) counterbalance mTOR signaling: SIRT1 suppresses mTORC1 via TSC2 deacetylation; SIRT6 deacetylates H3K9 to suppress ribosomal gene expression (the downstream target of mTOR). As NAD+ falls with age, this sirtuin brake on mTOR is lost — restoring NAD+ via NMN reactivates it.',
    pmids: ['34272067'],
    tier_color: 'amber',
  },
  {
    name: 'Rapamycin (mTOR Inhibitor)',
    tier: 'B',
    dose: '5–6 mg weekly (physician-supervised); PEARL trial using 5 mg/week in healthy adults',
    mechanism:
      'Rapamycin is the most replicated life-extending drug across species — extending median lifespan 9–14% in aged mice even when started late (Harrison et al., Nature 2009, PMID: 19587683). It allosterically inhibits mTORC1, inducing autophagy, senescent cell clearance, and immune rejuvenation. Immunosuppressive risks at daily dosing are largely avoided with weekly administration.',
    pmids: ['19587683', '36855074'],
    tier_color: 'amber',
  },
  {
    name: 'Metformin (AMPK Activator)',
    tier: 'B',
    dose: '500–1000 mg daily (prescription required); TAME trial ongoing',
    mechanism:
      'Metformin inhibits mitochondrial Complex I, raising the AMP/ATP ratio and activating AMPK — mimicking caloric restriction at the molecular level. It also suppresses hepatic gluconeogenesis and mTOR. The TAME (Targeting Aging with Metformin) trial is the first FDA-endorsed aging intervention trial, expected to complete ~2027.',
    pmids: ['26579537'],
    tier_color: 'amber',
  },
];

const BIOMARKERS = [
  { name: 'Fasting insulin', normal: '< 5 µIU/mL', note: 'Most sensitive mTOR suppression proxy; standard lab, ideally alongside fasting glucose' },
  { name: 'IGF-1 (fasting serum)', normal: '100–200 ng/mL (age-adjusted)', note: 'mTOR activator and CR-responsive; declines with dietary restriction — optimal ≠ always lowest' },
  { name: 'HOMA-IR', normal: '< 1.5', note: 'Insulin resistance index = (glucose × insulin) / 405; tracks nutrient sensing capacity' },
  { name: 'Ketone bodies (β-OHB)', normal: '> 0.3 mM in fasted state (4–8h fast)', note: 'Signal of mTOR suppression and AMPK activation; home ketone meters make this daily-trackable' },
  { name: 'Triglycerides', normal: '< 100 mg/dL', note: 'Elevated triglycerides = chronic insulin/mTOR overactivation; very sensitive to dietary change' },
];

const EVIDENCE_BADGE: Record<string, string> = {
  A: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  B: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  C: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

export default function NutrientSensingPage() {
  const targetingCompounds = getCompoundsForHallmark('nutrient');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-amber)_8%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-amber-400">Deregulated Nutrient Sensing</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 tracking-widest uppercase">Hallmark #12 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Deregulated<br /><span className="text-amber-400">Nutrient Sensing</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              mTOR — the master growth switch — stays on chronically in aging, suppressing the cellular cleanup
              that health requires. Rapamycin is the most replicated lifespan drug in mammals. The question is
              how to deliver the same signal without side effects.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-amber-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/bio-age" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Assess My Bio Age</Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-amber-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">The growth-vs-cleanup switch — and why it gets stuck</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  mTORC1 (mechanistic Target of Rapamycin Complex 1) integrates nutrient abundance signals —
                  amino acids (via Rag GTPases), glucose (via PI3K/Akt), and growth factors (via Rheb) —
                  and, when active, drives protein synthesis while blocking autophagy via ULK1 phosphorylation.
                  AMPK does the opposite: activated by low energy (high AMP/ATP ratio), it suppresses mTOR
                  and activates ULK1, turning on cellular recycling.
                </p>
                <p>
                  Aging creates <strong className="text-foreground">permanent mTOR bias</strong>: insulin resistance
                  (elevated insulin even when fasted) keeps mTORC1 basally active. Reduced AMPK activity
                  (from mitochondrial inefficiency and NAD+ decline) removes the counter-signal. The result
                  is cells that never fully enter the cleanup state — accumulating damaged proteins,
                  dysfunctional organelles, and lipid droplets.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  The therapeutic insight from rapamycin research: <strong className="text-foreground">it is never too late</strong>
                  to suppress mTOR and extend healthspan. Harrison et al. (Nature 2009) started rapamycin
                  in mice at 20 months (equivalent to ~60 human years) and extended median lifespan 9–14%.
                  This suggests mTOR inhibition acts on reversible aging processes, not just developmental ones.
                </p>
                <p>
                  Non-pharmaceutical mTOR suppression stack: <strong className="text-foreground">fasting windows</strong>
                  (suppress via amino acid depletion), <strong className="text-foreground">resveratrol</strong> (AMPK/SIRT1),
                  <strong className="text-foreground"> NMN</strong> (sirtuin counterbalance to mTOR), and
                  <strong className="text-foreground"> low refined carbohydrate diet</strong> (insulin/IGF-1 reduction).
                  Combined, these approximate ~40% of rapamycin’s mTOR inhibition without immunosuppressive risk.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <p className="text-xs text-amber-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Nutrient sensing biomarkers</h2>
            <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
              <div className="grid grid-cols-3 px-6 py-3 border-b border-border/40 text-xs text-muted-foreground uppercase tracking-wide font-medium">
                <span>Marker</span><span>Reference range</span><span>Clinical note</span>
              </div>
              {BIOMARKERS.map((b, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border/40 last:border-0 text-sm">
                  <span className="font-medium text-foreground">{b.name}</span>
                  <span className="text-muted-foreground font-mono text-xs">{b.normal}</span>
                  <span className="text-muted-foreground text-xs">{b.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Evidence-Graded Interventions</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">mTOR suppression — from lifestyle to clinical</h2>
            <p className="text-muted-foreground mb-8">Tier A = multiple human RCTs. Tier B = at least one human trial + mechanistic data. Listed from most to least accessible.</p>
            <div className="space-y-5">
              {INTERVENTIONS.map((iv) => (
                <div key={iv.name} className="rounded-2xl border border-border/60 bg-card/40 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-bold text-foreground text-lg">{iv.name}</h3>
                    <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${iv.tier === 'A' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                      Tier {iv.tier}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{iv.mechanism}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-muted-foreground"><strong className="text-foreground">Dose:</strong> {iv.dose}</span>
                    {iv.pmids.map((pmid) => (
                      <a key={pmid} href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-cyan-400 hover:border-cyan-500/40 transition-colors">PMID {pmid}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-5 h-5 text-cyan-400" />
              <p className="text-xs text-cyan-400 uppercase tracking-widest font-medium">TNiC Library</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Compounds in the TNiC library that target this hallmark</h2>
            <p className="text-muted-foreground mb-8">Structured compound profiles — dosing, mechanism, and evidence tier — for library compounds tagged as targeting nutrient sensing.</p>
            {targetingCompounds.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {targetingCompounds.map((compound) => (
                  <Link
                    key={compound.slug}
                    href={`/library/compounds/${compound.slug}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 hover:border-cyan-500/40 transition-colors"
                  >
                    <span className="text-sm font-semibold text-foreground truncate">{compound.name}</span>
                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold border ${EVIDENCE_BADGE[compound.evidence]}`}>
                      Tier {compound.evidence}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No compounds in the library are currently tagged for this specific hallmark — see the interventions above, or explore the full{' '}
                <Link href="/library" className="text-cyan-400 hover:underline">compound library</Link>.
              </p>
            )}
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Flip the switch back to cleanup mode.</h2>
            <p className="text-muted-foreground mb-8">Fasting + resveratrol + NMN is the OTC rapamycin-mimic stack. Build it, track fasting insulin, and watch mTOR tone normalize.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Stack Architect <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/hallmarks" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><BookOpen className="w-4 h-4" />All Hallmarks</Link>
              <Link href="/library/nutrient-sensing" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><Library className="w-4 h-4" />View in Library</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
