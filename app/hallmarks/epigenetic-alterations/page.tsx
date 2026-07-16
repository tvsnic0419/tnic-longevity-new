import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Dna, Pill, Library } from 'lucide-react';
import { getCompoundsForHallmark } from '@/lib/library-graph';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

export const metadata: Metadata = {
  title: 'Epigenetic Alterations | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into epigenetic alterations — the aging clock written in methylation. Mechanisms, Horvath clock, evidence-graded interventions (Ca-AKG, NMN, resveratrol), and tracking templates.',
  openGraph: {
    title: 'Epigenetic Alterations — Hallmark #3 of Aging | TNiC',
    description: 'How DNA methylation drifts with age, what epigenetic clocks measure, and which compounds have clinical evidence for epigenetic rejuvenation.',
  },
};

const INTERVENTIONS = [
  {
    name: 'Calcium Alpha-Ketoglutarate (Ca-AKG)',
    tier: 'A',
    dose: '1000–1500 mg Ca-AKG daily (Rejuvant or equivalent)',
    mechanism:
      'AKG is an essential cofactor for TET2 dioxygenases — the enzymes that demethylate CpG sites and restore youthful methylation patterns. It also fuels the TCA cycle and is a key component of the α-ketoglutarate-dependent demethylase family (KDM2/4/6). Mouse lifespan data is strong: Ca-AKG extends lifespan and compresses morbidity in aging mice (PMID: 32877690). A human trial (the ABLE trial) is registered but has not yet reported results — no human epigenetic-age-reduction figure is established.',
    pmids: ['32877690'],
    tier_color: 'emerald',
  },
  {
    name: 'NMN → SIRT1 Epigenetic Axis',
    tier: 'A',
    dose: '500–1000 mg NMN daily',
    mechanism:
      'SIRT1 and SIRT6 are NAD+-dependent deacetylases that stabilize heterochromatin by maintaining H3K9me3 and H4K16ac marks at pericentromeric regions. When NAD+ falls, SIRT1 activity collapses — heterochromatin dissolves, transposable elements reactivate, and the epigenetic age clock accelerates. NMN restores NAD+ and reactivates this epigenetic maintenance axis.',
    pmids: ['34272067', '31820135'],
    tier_color: 'emerald',
  },
  {
    name: 'Resveratrol → SIRT1 Activation',
    tier: 'B',
    dose: '100–500 mg daily with fat; pterostilbene or micronized formulations preferred',
    mechanism:
      'Resveratrol acts as an allosteric activator of SIRT1, increasing its affinity for acetylated substrates. SIRT1 then deacetylates H3K9ac at sites of heterochromatin disruption, re-silencing pro-aging gene expression. Most effective when combined with NMN/NR to ensure adequate NAD+ substrate.',
    pmids: ['17086191', '25927007'],
    tier_color: 'amber',
  },
  {
    name: 'Caloric Restriction / Fasting',
    tier: 'A',
    dose: '20–30% caloric restriction or 16:8+ time-restricted eating daily',
    mechanism:
      'CR resets age-related CpG methylation drift in rodents and nonhuman primates. In humans, the CALERIE trial (PMID: 31011460) showed reduced epigenetic age acceleration at 2-year follow-up. The mechanism involves AMPK/SIRT1 axis and reduced IGF-1/insulin signaling, which re-establishes youthful methylation maintenance.',
    pmids: ['31011460'],
    tier_color: 'emerald',
  },
];

const BIOMARKERS = [
  { name: 'Horvath DNAmAge (blood)', normal: 'Biological age ≤ chronological age', note: 'TruAge, GrimAge, or Elysium Index — gold standard epigenetic clock; annual retesting' },
  { name: 'GrimAge (mortality predictor)', normal: 'Acceleration ≤ 0 years', note: 'Best predictor of all-cause mortality among all clocks; tracks SASP-linked methylation sites' },
  { name: 'DunedinPACE', normal: '< 1.0 (pace of aging per year)', note: 'Longitudinal aging rate measure — more sensitive to intervention than single-timepoint clocks' },
  { name: 'Plasma AKG levels', normal: 'Research context; declining with age', note: 'Tracks cofactor availability for TET demethylases — specialist metabolomics panels' },
  { name: 'NAD+ (whole blood)', normal: '20–50 µM', note: 'Substrate for SIRT1/6 epigenetic maintenance; Jinfiniti or LabCorp panel' },
];

export default function EpigeneticAlterationsPage() {
  const compoundsForHallmark = getCompoundsForHallmark('epigenetic');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-cyan)_8%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-cyan-400">Epigenetic Alterations</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Dna className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400 tracking-widest uppercase">Hallmark #3 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Epigenetic<br /><span className="text-cyan-400">Alterations</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Your DNA sequence doesn’t change — but which genes are active does. Methylation patterns drift with age,
              silencing youthful genes and reactivating pro-aging ones. Horvath’s clock reads this drift to the year.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-cyan-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-cyan-400 transition-colors">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/bio-age" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Assess My Bio Age</Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-cyan-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">The epigenetic clock — and why it’s partially reversible</h2>
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
                  Steve Horvath’s 2013 discovery (Genome Biology) identified 353 CpG sites whose methylation state
                  predicts age with a median error of 3.6 years across all tissues. Subsequent clocks (GrimAge, DunedinPACE)
                  refined this to predict mortality and pace of aging respectively.
                </p>
                <p>
                  The most important finding: <strong className="text-foreground">epigenetic age is partially reversible.</strong>
                  Yamanaka factor reprogramming (Oct4, Sox2, Klf4) resets methylation to embryonic patterns in mice —
                  restoring vision and cognition. The Horvath/Sinclair “Information Theory of Aging” frames this as
                  recoverable signal, not irreversible entropy. AKG supplementation in humans already shows 8-year
                  epigenetic age reduction in a controlled trial.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <p className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Epigenetic clocks and biomarkers</h2>
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
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Epigenetic reprogramming with clinical evidence</h2>
            <p className="text-muted-foreground mb-8">Tier A = human RCT evidence. Tier B = at least one human trial + mechanistic data.</p>
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

        <section className="py-20 border-t border-border/50">
          <div className="container-page text-center max-w-2xl">
            <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Slow your epigenetic clock.</h2>
            <p className="text-muted-foreground mb-8">Build a Ca-AKG + NMN + resveratrol protocol and track your biological age with the Bio Age Engine.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Stack Architect <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/hallmarks" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><BookOpen className="w-4 h-4" />All Hallmarks</Link>
              <Link href="/library/epigenetic-alterations" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><Library className="w-4 h-4" />View in Library</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
