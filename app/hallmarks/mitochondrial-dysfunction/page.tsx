import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Zap, Pill, Library } from 'lucide-react';
import { getCompoundsForHallmark } from '@/lib/library-graph';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  title: 'Mitochondrial Dysfunction | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into mitochondrial dysfunction — the energy crisis underlying aging. Mechanisms, electron transport chain decline, NAD+/AMPK axes, evidence-graded interventions (GlyNAC, NMN, CoQ10, urolithin A), and monitoring biomarkers.',
  openGraph: {
    title: 'Mitochondrial Dysfunction — Hallmark #9 of Aging | TNiC',
    description:
      'How mitochondria decline with age, why it matters across every organ, and which compounds have clinical evidence for mitochondrial rejuvenation.',
  },
};

const INTERVENTIONS = [
  {
    name: 'GlyNAC (Glycine + NAC)',
    tier: 'A',
    dose: '600 mg glycine + 600 mg NAC daily (split AM/PM)',
    mechanism:
      'Two RCTs (Mayo Clinic) demonstrate GlyNAC directly restores mitochondrial function in older adults: it rebuilds glutathione, reduces mitochondrial ROS, improves OxPhos efficiency, and increases mitochondrial biogenesis markers (PGC-1α). Only compound with multiple human RCTs specifically measuring mitochondrial function restoration.',
    pmids: ['33783984', '35975308'],
    color: 'emerald',
  },
  {
    name: 'Urolithin A',
    tier: 'A',
    dose: '500–1000 mg daily (Mitopure or equivalent)',
    mechanism:
      'Urolithin A is the most clinically-validated mitophagy inducer. It activates PINK1/Parkin pathway — the mitochondrial quality control system that tags damaged mitochondria for autophagy. The 2022 Amazentis RCT (PMID: 35922106) showed improved muscle endurance and mitochondrial gene expression in older adults at 4 months.',
    pmids: ['35922106', '31806338'],
    color: 'amber',
  },
  {
    name: 'NMN / NR (NAD+ precursors)',
    tier: 'A',
    dose: '500–1000 mg NMN or 300–1000 mg NR daily',
    mechanism:
      'NAD+ is the electron carrier that feeds Complex I of the electron transport chain. As NAD+ drops ~50% by age 60, mitochondrial respiration efficiency collapses. NMN/NR restore NAD+, improve OxPhos coupling efficiency, reduce mitochondrial ROS leak, and activate SIRT1/SIRT3 — which deacetylate and activate mitochondrial enzymes.',
    pmids: ['34272067', '31820135'],
    color: 'cyan',
  },
  {
    name: 'CoQ10 (Ubiquinol form)',
    tier: 'B',
    dose: '200–400 mg ubiquinol daily with fat-containing meal',
    mechanism:
      'CoQ10 is the mobile electron carrier between Complex I/II and Complex III of the ETC. Plasma CoQ10 declines ~40% between ages 20 and 80 — and statin use accelerates depletion another 20–40%. Ubiquinol (reduced form) shows superior bioavailability. The Q-SYMBIO trial (PMID: 25282031) demonstrated 43% reduction in major cardiovascular events.',
    pmids: ['25282031', '26177482'],
    color: 'violet',
  },
  {
    name: 'Alpha-Lipoic Acid (R-ALA)',
    tier: 'B',
    dose: '300–600 mg R-ALA daily',
    mechanism:
      'R-ALA is a cofactor for pyruvate dehydrogenase and α-ketoglutarate dehydrogenase — both mitochondrial enzyme complexes that feed the TCA cycle. It also recycles CoQ10, Vitamin C, and glutathione. As a mitochondrial antioxidant, R-ALA is 10× more potent than α-tocopherol at the inner mitochondrial membrane.',
    pmids: ['22563875'],
    color: 'rose',
  },
];

const BIOMARKERS = [
  { name: 'NAD+ (whole blood)', normal: '20–50 µM; higher is better', note: 'Direct ETC fuel proxy; Jinfiniti Intracellular NAD+ test preferred' },
  { name: 'Lactate / pyruvate ratio', normal: '< 10:1', note: 'Elevated ratio = impaired OxPhos, forced anaerobic shift; specialist labs' },
  { name: 'GDF-15 (serum)', normal: '< 1200 pg/mL', note: 'Mitokine; rises with mitochondrial stress; tracks aging and metabolic disease' },
  { name: 'FGF21 (fasting serum)', normal: '< 300 pg/mL', note: 'Mitochondrial stress hormone; chronically elevated = mito dysfunction signal' },
  { name: 'Citrate synthase activity (PBMC)', normal: 'Age-adjusted; specialist labs', note: 'Direct mitochondrial density marker; declines ~30% between ages 30–70' },
  { name: 'VO2 max (cardiopulmonary testing)', normal: '>= age-matched 75th percentile', note: 'Best non-invasive whole-body mitochondrial function proxy' },
];

export default function MitochondrialDysfunctionPage() {
  const compoundsForHallmark = getCompoundsForHallmark('mito');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>

        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-amber)_10%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/library" className="hover:text-foreground transition-colors">Library</Link>
              <span>/</span>
              <span>Hallmarks</span>
              <span>/</span>
              <span className="text-amber-400">Mitochondrial Dysfunction</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 tracking-widest uppercase">Hallmark #6 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Mitochondrial
              <br />
              <span className="text-amber-400">Dysfunction</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Mitochondria are your cells’ power plants. By age 70, OxPhos efficiency drops ~30%, NAD+ falls ~50%,
              and mitochondrial ROS leaks accelerate damage across every hallmark of aging. Fixing this is foundational.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-amber-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors">
                Build My Stack <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/bio-age" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Assess My Bio Age
              </Link>
            </div>
          </div>
        </section>

        {/* Mechanism */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-amber-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">The energy crisis — and why it cascades</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Mitochondrial decline is driven by three converging failures. First, <strong className="text-foreground">mtDNA mutation accumulation</strong>:
                  mitochondrial DNA (37 genes) has no histone protection and minimal repair capacity. mtDNA mutation rate
                  is 10–17× higher than nuclear DNA. By age 70, some cell types have mutation rates &gt;20% in respiratory
                  chain genes.
                </p>
                <p>
                  Second, <strong className="text-foreground">NAD+ depletion</strong>: NAD+ is both the electron carrier feeding Complex I and the
                  substrate for SIRT3 — the deacetylase that activates mitochondrial metabolic enzymes. As NAD+ drops,
                  Complex I stalls, the ETC backs up, and electrons leak to oxygen, forming superoxide instead of
                  being efficiently coupled to ATP synthesis.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Third, <strong className="text-foreground">impaired mitophagy</strong>: damaged mitochondria are normally cleared by the PINK1/Parkin
                  pathway — a quality control system that tags depolarized mitochondria for autophagy. With age, PINK1
                  expression declines and Parkin activity decreases, allowing damaged mitochondria to accumulate and
                  continue secreting ROS and pro-apoptotic factors.
                </p>
                <p>
                  The consequence is <strong className="text-foreground">mitohormesis disruption</strong>: mild mitochondrial stress is normally
                  beneficial (hormesis), triggering adaptive responses via PGC-1α, AMPK, and NRF2. Severe, chronic
                  mitochondrial stress overwhelms these pathways and drives the inflammatory phenotype, mtDNA
                  release into cytoplasm (activating cGAS-STING), and systemic age acceleration.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-4">Key Molecular Axes</p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                {[
                  { axis: 'NAD+ → SIRT3', effect: 'Activates OxPhos enzymes, IDH2, SOD2; declined by ~50% by age 60' },
                  { axis: 'AMPK → PGC-1α', effect: 'Drives mitochondrial biogenesis; suppressed by mTORC1 hyperactivation in aging' },
                  { axis: 'PINK1 / Parkin', effect: 'Mitophagy quality control; removes depolarized mitochondria; declines with age' },
                ].map((item) => (
                  <div key={item.axis} className="rounded-xl border border-border/60 bg-card/60 p-4">
                    <p className="font-bold text-foreground text-xs font-mono mb-1">{item.axis}</p>
                    <p className="text-xs text-muted-foreground">{item.effect}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Biomarkers */}
        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <p className="text-xs text-amber-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Biomarkers that track mitochondrial health</h2>
            <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
              <div className="grid grid-cols-3 px-6 py-3 border-b border-border/40 text-xs text-muted-foreground uppercase tracking-wide font-medium">
                <span>Marker</span>
                <span>Reference range</span>
                <span>Clinical note</span>
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

        {/* Interventions */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Evidence-Graded Interventions</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Mitochondrial interventions with human evidence</h2>
            <p className="text-muted-foreground mb-8">
              Tier A = multiple human RCTs. Tier B = at least one human trial + mechanistic data. Listed in order of evidence strength.
            </p>
            <div className="space-y-5">
              {INTERVENTIONS.map((iv) => (
                <div key={iv.name} className="rounded-2xl border border-border/60 bg-card/40 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-bold text-foreground text-lg">{iv.name}</h3>
                    <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      iv.tier === 'A'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      Tier {iv.tier}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{iv.mechanism}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-muted-foreground">
                      <strong className="text-foreground">Dose:</strong> {iv.dose}
                    </span>
                    {iv.pmids.map((pmid) => (
                      <a
                        key={pmid}
                        href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-cyan-400 hover:border-cyan-500/40 transition-colors"
                      >
                        PMID {pmid}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compound Library */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-5 h-5 text-amber-400" />
              <p className="text-xs text-amber-400 uppercase tracking-widest font-medium">Compound Library</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">
              Compounds in the TNiC library that target this hallmark
            </h2>
            <p className="text-muted-foreground mb-8">
              Cross-referenced from the structured compound library, ranked by evidence tier.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {compoundsForHallmark.map((compound) => (
                <Link
                  key={compound.slug}
                  href={`/library/compounds/${compound.slug}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 hover:border-amber-500/40 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{compound.name}</span>
                  <EvidenceTag tier={compound.evidence} size="sm" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">
              Build a mitochondrial protocol.
            </h2>
            <p className="text-muted-foreground mb-8">
              The Stack Architect maps your energy and mitochondrial goals to evidence-graded compounds
              and shows which hallmarks each compound targets.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
                Stack Architect <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/library" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="w-4 h-4" />
                All Hallmarks
              </Link>
              <Link href="/library/mitochondrial-dysfunction" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Library className="w-4 h-4" />
                View in Library
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
