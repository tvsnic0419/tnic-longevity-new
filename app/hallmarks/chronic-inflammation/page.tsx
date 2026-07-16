import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Shield, Pill, Library } from 'lucide-react';
import { getCompoundsForHallmark } from '@/lib/library-graph';

export const metadata: Metadata = {
  title: 'Chronic Inflammation (Inflammaging) | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into chronic inflammation — the "inflammaging" hallmark driving cardiovascular disease, cancer, and neurodegeneration. Mechanisms, hs-CRP targets, evidence-graded interventions, and biomarkers.',
  openGraph: {
    title: 'Chronic Inflammation (Inflammaging) — Hallmark #10 | TNiC',
    description: 'How low-grade inflammation accumulates with age, why hs-CRP predicts mortality, and which compounds have the strongest clinical evidence for reducing inflammaging.',
  },
};

const INTERVENTIONS = [
  {
    name: 'Sulforaphane (NRF2 / NF-κB)',
    tier: 'A',
    dose: '30–60 mg glucoraphanin or 10–30 mg SFN daily; best from fresh broccoli sprouts or standardized extract',
    mechanism:
      'The most mechanistically complete anti-inflammatory compound with human evidence. NRF2 activation upregulates HO-1, NQO1, and GCLC — which neutralize the ROS that drive NF-κB activation. Simultaneously, NRF2 directly suppresses NF-κB transcriptional activity via IκBα. A human airway study (PMID: 19028145) demonstrated significant CRP and IL-6 reduction.',
    pmids: ['19028145', '28515065'],
    tier_color: 'emerald',
  },
  {
    name: 'GlyNAC (Glutathione / Oxidative Stress)',
    tier: 'A',
    dose: '600 mg glycine + 600 mg NAC daily',
    mechanism:
      'Oxidative stress is the upstream activator of NF-κB. When ROS oxidize IκB kinase (IKK), it phosphorylates IκB, releasing NF-κB to the nucleus. GlyNAC rebuilds glutathione — the primary intracellular ROS scavenger — breaking this chain at its root. Two human RCTs confirm reduced inflammatory markers alongside oxidative stress restoration.',
    pmids: ['33783984', '35975308'],
    tier_color: 'emerald',
  },
  {
    name: 'Omega-3 (EPA + DHA)',
    tier: 'A',
    dose: '2–4 g EPA+DHA daily; fish oil or algae-based',
    mechanism:
      'EPA and DHA are precursors to specialized pro-resolving mediators (SPMs): resolvins, protectins, and maresins. SPMs actively terminate inflammation by clearing cellular debris, reducing neutrophil infiltration, and reprogramming macrophages from M1 (pro-inflammatory) to M2 (resolving) phenotype. The REDUCE-IT trial (PMID: 30415628) showed 25% reduction in MACE with 4g icosapentaenoic acid.',
    pmids: ['30415628', '33167080'],
    tier_color: 'emerald',
  },
  {
    name: 'Zone 2 + Resistance Exercise',
    tier: 'A',
    dose: '150+ min/week Zone 2; 2–3× resistance training',
    mechanism:
      'Exercise has a biphasic inflammatory effect: acute transient IL-6 spike triggers sustained anti-inflammatory IL-10 and IL-1Ra. Chronic training reprograms macrophage phenotype, reduces visceral adipose (major SASP source), and upregulates NRF2 in skeletal muscle. Sedentary individuals have 30–50% higher hs-CRP than aerobically fit age-matched controls.',
    pmids: ['29204594'],
    tier_color: 'emerald',
  },
  {
    name: 'Resveratrol (SIRT1 / NF-κB)',
    tier: 'B',
    dose: '250–500 mg daily',
    mechanism:
      'SIRT1 deacetylates the p65 subunit of NF-κB at K310, suppressing its transcriptional activity without blocking upstream signaling. This is a particularly targeted anti-inflammatory mechanism — it reduces chronic NF-κB output while preserving acute inflammatory responses needed for infection defense.',
    pmids: ['17086191'],
    tier_color: 'amber',
  },
];

const BIOMARKERS = [
  { name: 'hs-CRP', normal: '< 1.0 mg/L (optimal longevity); < 3.0 mg/L (low CV risk)', note: 'Most accessible inflammaging marker; included in standard lipid panels; re-test quarterly' },
  { name: 'IL-6 (serum)', normal: '< 3.0 pg/mL', note: 'Primary driver of CRP production in liver; tracks SASP intensity more directly than CRP' },
  { name: 'Homocysteine', normal: '< 9 µmol/L', note: 'Pro-inflammatory via endothelial NF-κB activation; reduced by B12, folate, B6, TMG' },
  { name: 'Fibrinogen', normal: '200–350 mg/dL', note: 'Acute phase protein; rises with chronic NF-κB activity; cardiovascular risk amplifier' },
  { name: 'Omega-3 index (RBC EPA+DHA)', normal: '> 8%', note: 'SPM precursor pool; the single most modifiable anti-inflammatory biomarker in most people' },
  { name: 'Visceral adipose (DEXA)', normal: 'VAT < 100 cm² (men); < 80 cm² (women)', note: 'Major SASP source; tracks with waist circumference and metabolic health' },
];

const EVIDENCE_BADGE: Record<string, string> = {
  A: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  B: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  C: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

export default function ChronicInflammationPage() {
  const targetingCompounds = getCompoundsForHallmark('inflammation');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-rose)_10%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-rose-400">Chronic Inflammation</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-medium text-rose-400 tracking-widest uppercase">Hallmark #10 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Chronic<br /><span className="text-rose-400">Inflammation</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              “Inflammaging” — the slow-burning systemic inflammation that accumulates with age — predicts cardiovascular
              events, cancer risk, and cognitive decline more reliably than almost any other single biomarker.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-rose-500 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-rose-400 transition-colors">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/labs" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Track hs-CRP</Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-rose-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">NF-κB — the master inflammatory switch of aging</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Inflammaging has five converging sources. <strong className="text-foreground">SASP</strong> from senescent
                  cells is the largest — secreting IL-6, IL-1β, and TNF-α continuously into surrounding tissue.
                  <strong className="text-foreground"> Gut permeability</strong> allows bacterial LPS to enter circulation,
                  triggering TLR4/NF-κB. <strong className="text-foreground">Mitochondrial ROS</strong> activate the
                  NLRP3 inflammasome, producing IL-1β. <strong className="text-foreground">Immune senescence</strong>
                  (exhausted T-cells, skewed macrophages) impairs resolution. <strong className="text-foreground">Visceral adipose</strong>
                  acts as a SASP-like endocrine organ.
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

        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-rose-400" />
              <p className="text-xs text-rose-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Inflammaging biomarker panel</h2>
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
            <p className="text-xs text-muted-foreground mt-4">
              Log hs-CRP, IL-6, and homocysteine in the <Link href="/labs" className="text-rose-400 hover:underline">Lab Tracker</Link> to monitor trend over time.
            </p>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Evidence-Graded Interventions</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Anti-inflammaging interventions with human evidence</h2>
            <p className="text-muted-foreground mb-8">Tier A = multiple human RCTs. Tier B = at least one human trial + mechanistic data.</p>
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
            <p className="text-muted-foreground mb-8">Structured compound profiles — dosing, mechanism, and evidence tier — for library compounds tagged as targeting chronic inflammation.</p>
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
            <ShieldCheck className="w-10 h-10 text-rose-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Extinguish inflammaging.</h2>
            <p className="text-muted-foreground mb-8">Build a multi-angle NF-κB suppression protocol: NRF2 + SIRT1 + omega-3. Track hs-CRP quarterly in the Lab Tracker.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Stack Architect <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/hallmarks" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><BookOpen className="w-4 h-4" />All Hallmarks</Link>
              <Link href="/library/chronic-inflammation" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><Library className="w-4 h-4" />View in Library</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
