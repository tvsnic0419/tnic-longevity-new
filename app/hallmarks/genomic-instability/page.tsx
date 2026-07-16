import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Dna, ArrowRight, FlaskConical, Activity, ShieldCheck, BookOpen, Pill, Library } from 'lucide-react';
import { getCompoundsForHallmark } from '@/lib/library-graph';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  title: 'Genomic Instability | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into genomic instability — the first hallmark of aging. Mechanisms, biomarkers, evidence-graded interventions (NMN, sulforaphane, GlyNAC), and a monitoring template.',
  openGraph: {
    title: 'Genomic Instability — Hallmark #1 of Aging | TNiC',
    description:
      'Understand how DNA damage accumulates with age, what biomarkers track it, and which compounds have clinical evidence for slowing genomic degradation.',
  },
};

const INTERVENTIONS = [
  {
    name: 'NMN / NR (NAD+ precursors)',
    tier: 'A',
    dose: '500–1000 mg NMN or 300–1000 mg NR daily',
    mechanism:
      'NAD+ fuels PARP1 and SIRT1/SIRT6, the two primary DNA-repair enzymes. By age 50, NAD+ drops ~50%, crippling PARP-mediated single-strand break repair.',
    pmids: ['31272867', '34272067'],
    color: 'emerald',
  },
  {
    name: 'Sulforaphane (SFN)',
    tier: 'B',
    dose: '30–60 mg glucoraphanin or 10–30 mg SFN daily',
    mechanism:
      'Activates NRF2 → upregulates Phase II detox enzymes (NQO1, HMOX1) that neutralize reactive oxygen species before they cause DNA strand breaks. Also induces autophagy of oxidatively damaged proteins.',
    pmids: ['28515065', '31920436'],
    color: 'cyan',
  },
  {
    name: 'GlyNAC (Glycine + NAC)',
    tier: 'A',
    dose: '600 mg glycine + 600 mg NAC daily',
    mechanism:
      'Rebuilds glutathione — the cell\'s primary antioxidant defense. Depleted glutathione permits mitochondrial ROS to escape and damage nuclear DNA. Two human RCTs confirm restoration within 16 weeks.',
    pmids: ['33783984', '35975308'],
    color: 'violet',
  },
  {
    name: 'Resveratrol',
    tier: 'B',
    dose: '100–500 mg daily with fat-containing meal',
    mechanism:
      'Allosteric SIRT1 activator. SIRT1 deacetylates H3K9ac at double-strand break sites, recruiting DNA repair machinery (BRCA1, FANCD2). Bioavailability is low — pterostilbene or micronized forms preferred.',
    pmids: ['25927007'],
    color: 'amber',
  },
];

const BIOMARKERS = [
  { name: '8-OHdG (urine or serum)', normal: '< 15 ng/mg creatinine', note: 'Oxidative DNA damage marker — most accessible clinical proxy' },
  { name: 'γ-H2AX foci (PBMC)', normal: 'Lab-dependent', note: 'Gold standard for double-strand break quantification; available via specialty labs' },
  { name: 'Telomere length (leucocyte)', normal: 'Age-adjusted Z-score > −1.0', note: 'Tracks cumulative replication stress; available via LifeLength, Repeat Diagnostics' },
  { name: 'Micronuclei frequency', normal: '< 1.0 per 1000 cells', note: 'Structural chromosomal instability marker; research labs only' },
  { name: 'NAD+ (whole blood)', normal: '20–50 µM (declines ~1% per year after 30)', note: 'Tracks PARP repair capacity; Jinfiniti or LabCorp NAD+ panel' },
];

export default function GenomicInstabilityPage() {
  const compoundsForHallmark = getCompoundsForHallmark('genomic');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>

        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-cyan)_10%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/library" className="hover:text-foreground transition-colors">Library</Link>
              <span>/</span>
              <span>Hallmarks</span>
              <span>/</span>
              <span className="text-cyan-400">Genomic Instability</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Dna className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400 tracking-widest uppercase">Hallmark #1 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Genomic
              <br />
              <span className="text-cyan-400">Instability</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Your DNA suffers ~10,000 lesions per cell per day. Young cells repair most of them. Aging cells don’t —
              and the accumulation of unrepaired damage is arguably the most upstream driver of every other hallmark.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-cyan-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-cyan-400 transition-colors">
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
            <p className="text-xs text-cyan-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Why DNA damage accumulates with age</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  DNA damage comes from two directions: <strong className="text-foreground">endogenous sources</strong> (mitochondrial reactive oxygen species,
                  replication errors, hydrolysis) and <strong className="text-foreground">exogenous sources</strong> (UV, ionizing radiation, chemical mutagens).
                  A healthy 20-year-old repairs the overwhelming majority within hours via base excision repair (BER),
                  nucleotide excision repair (NER), and homologous recombination (HR).
                </p>
                <p>
                  The critical failure mode of aging is not increased damage rate — it’s <strong className="text-foreground">declining repair capacity</strong>.
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
                  changing the sequence. This is the substrate of Horvath’s epigenetic clock — the ratio of maintained
                  vs. drifted CpG sites directly tracks biological age.
                </p>
              </div>
            </div>

            {/* Cascade diagram (text-based) */}
            <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-4">Damage Cascade</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {['ROS / UV / Replication errors', '→', 'DNA lesions (10k/cell/day)', '→', 'PARP + SIRT1 consume NAD+', '→', 'NAD+ depleted (~50% by age 60)', '→', 'Repair backlog accumulates', '→', 'Mutations / chromosomal rearrangements', '→', 'Senescence + cancer risk'].map((step, i) => (
                  <span key={i} className={step === '→' ? 'text-muted-foreground/40' : 'px-2.5 py-1 rounded-lg bg-card border border-border/60 text-foreground font-medium text-xs'}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Biomarkers */}
        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <p className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Biomarkers that track genomic health</h2>
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
            <p className="text-xs text-muted-foreground mt-4">
              Track these in the <Link href="/labs" className="text-cyan-400 hover:underline">Lab Tracker</Link> — upload results and get trend analysis.
            </p>
          </div>
        </section>

        {/* Interventions */}
        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Evidence-Graded Interventions</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">What actually works</h2>
            <p className="text-muted-foreground mb-8">
              Tier A = human RCT evidence. Tier B = at least one human trial + strong mechanistic data. We don’t list Tier C here.
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
              <Pill className="w-5 h-5 text-cyan-400" />
              <p className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Compound Library</p>
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
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 hover:border-cyan-500/40 transition-colors"
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
            <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">
              Build a DNA-repair protocol.
            </h2>
            <p className="text-muted-foreground mb-8">
              The Stack Architect maps your goals to evidence-graded compounds, checks for interactions,
              and shows hallmark coverage in real time.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
                Stack Architect <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/library" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="w-4 h-4" />
                All Hallmarks
              </Link>
              <Link href="/library/genomic-instability" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
