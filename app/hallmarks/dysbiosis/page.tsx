import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Activity, ArrowRight, FlaskConical, ShieldCheck, BookOpen, Radio, Pill, Library } from 'lucide-react';
import { getCompoundsForHallmark } from '@/lib/library-graph';

export const metadata: Metadata = {
  title: 'Dysbiosis | Hallmarks of Aging | TNiC',
  description:
    'Deep-dive into dysbiosis — the gut microbiome crisis driving inflammaging. Mechanisms, leaky gut, SCFA decline, evidence-graded interventions (fermented foods, fiber, sulforaphane), and biomarkers.',
  openGraph: {
    title: 'Dysbiosis — Hallmark #11 of Aging | TNiC',
    description: 'How the gut microbiome changes with age, why it drives systemic inflammation, and what has clinical evidence for restoring microbiome health.',
  },
};

const INTERVENTIONS = [
  {
    name: 'Diverse Plant Fiber (30+ species/week)',
    tier: 'A',
    dose: '30+ distinct plant species per week; 30–50g total dietary fiber daily',
    mechanism:
      'The most evidence-backed microbiome intervention. Diverse fiber feeds SCFA-producing taxa (Faecalibacterium prausnitzii, Roseburia, Bifidobacterium) that ferment fiber to butyrate, propionate, and acetate. Butyrate is the primary fuel for colonocytes, the main HDAC inhibitor in the gut, and a direct inducer of colonic regulatory T-cells (suppressing intestinal inflammation). APC guidelines recommend 30+ species/week.',
    pmids: ['34702753'],
    tier_color: 'emerald',
  },
  {
    name: 'Fermented Foods Daily',
    tier: 'A',
    dose: '6 servings/day (yogurt, kefir, kimchi, sauerkraut, kombucha) — Stanford trial protocol',
    mechanism:
      'The landmark 2021 Sonnenburg/Gardner Stanford trial (PMID: 34432955) compared high-fiber vs high-fermented food diets in adults for 17 weeks. Fermented food increased microbiome diversity, reduced 19 inflammatory markers including IL-6 and IL-12, and expanded novel bacterial strains. The fiber arm showed no diversity increase — fermented foods outperformed.',
    pmids: ['34432955'],
    tier_color: 'emerald',
  },
  {
    name: 'Sulforaphane (Gut NRF2 / Barrier)',
    tier: 'B',
    dose: '30–60 mg glucoraphanin or 10–30 mg SFN daily',
    mechanism:
      'NRF2 is highly expressed in gut epithelial cells. Sulforaphane activates NRF2 in colonocytes and enterocytes, upregulating tight junction proteins (ZO-1, claudin-3) and reducing epithelial ROS — the primary driver of gut barrier permeability. Also selectively favors Lactobacillus/Bifidobacterium over pro-inflammatory species in preclinical models.',
    pmids: ['28515065'],
    tier_color: 'amber',
  },
  {
    name: 'Targeted Probiotics (Akkermansia, Bifidobacterium)',
    tier: 'B',
    dose: 'Akkermansia muciniphila (10^9 CFU pasteurized) or Bifidobacterium longum BB536 (10^9 CFU)',
    mechanism:
      'Akkermansia muciniphila — the gut barrier guardian — declines from 4% in young adults to near 0% in the elderly. A 2019 Belgian RCT (PMID: 31792544) showed pasteurized Akkermansia improved insulin sensitivity, reduced liver inflammation markers, and decreased gut permeability in overweight adults. Bifidobacterium longum reduces anxiety-linked cortisol and IL-6.',
    pmids: ['31792544'],
    tier_color: 'amber',
  },
];

const BIOMARKERS = [
  { name: 'Zonulin (serum)', normal: '< 35 ng/mL', note: 'Tight junction regulator; elevated = leaky gut; LabCorp, Quest, or ZRT Lab' },
  { name: 'Calprotectin (fecal)', normal: '< 50 µg/g', note: 'Neutrophil activation marker in gut; sensitive to intestinal inflammation' },
  { name: 'Microbiome diversity (Shannon index)', normal: 'Higher is better; > 3.5 Shannon', note: 'Viome, Thorne, or Genova GI Effects; annual baseline + post-intervention' },
  { name: 'LPS-binding protein (LBP)', normal: '< 7.2 µg/mL', note: 'Tracks bacterial endotoxin translocation from leaky gut; specialist labs' },
  { name: 'Short-chain fatty acids (fecal)', normal: 'Lab-dependent; butyrate > 10 mmol/kg stool', note: 'Fermentation capacity proxy; Genova or Doctor\'s Data GI panel' },
];

const EVIDENCE_BADGE: Record<string, string> = {
  A: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  B: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  C: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

export default function DysbiosisPage() {
  const targetingCompounds = getCompoundsForHallmark('dysbiosis');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--accent-emerald)_8%,transparent),transparent)]" />
          <div className="relative container-page max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/hallmarks" className="hover:text-foreground transition-colors">Hallmarks</Link>
              <span>/</span>
              <span className="text-emerald-400">Dysbiosis</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400 tracking-widest uppercase">Hallmark #11 of 12</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
              Dysbiosis
              <br /><span className="text-emerald-400">& the Aging Gut</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Your gut hosts 38 trillion microorganisms — more than your own cells. By age 70, microbial diversity
              drops ~30%, SCFA production collapses, and gut permeability rises, flooding the body with bacterial
              endotoxins that drive systemic inflammation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Build My Stack <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/labs" className="inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Track Zonulin</Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container-page max-w-4xl">
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium mb-4">The Mechanism</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">The gut-inflammaging axis — three failure cascades</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Aging microbiome shifts follow a predictable pattern: <strong className="text-foreground">Faecalibacterium
                  prausnitzii</strong> (the primary butyrate producer and anti-inflammatory organism) and
                  <strong className="text-foreground"> Bifidobacterium</strong> (short-chain fatty acid producer, barrier
                  maintainer) decline. <strong className="text-foreground">Proteobacteria</strong> (gram-negative LPS-rich bacteria)
                  expand. The result: less butyrate to fuel colonocytes, more LPS to trigger systemic TLR4 activation.
                </p>
                <p>
                  <strong className="text-foreground">Leaky gut</strong> follows: tight junction proteins (ZO-1, occludin)
                  require butyrate for expression. As SCFA production falls, tight junctions weaken. Bacterial
                  LPS and peptidoglycans translocate into portal circulation — driving hepatic NF-κB activation,
                  systemic IL-6 production, and metabolic endotoxemia.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  The gut also produces <strong className="text-foreground">~90% of systemic serotonin</strong> and
                  hosts the enteric nervous system — 500 million neurons communicating bidirectionally with
                  the brain via the vagus nerve. Dysbiosis disrupts gut-brain axis signaling, driving
                  neuroinflammation, altered mood, and impaired cognitive function independently of systemic
                  cytokine effects.
                </p>
                <p>
                  The microbiome also regulates NAD+ metabolism via the kynurenine pathway. Age-related dysbiosis
                  shifts tryptophan metabolism away from serotonin/NAD+ production toward inflammatory kynurenines —
                  reducing NAD+ precursor availability and amplifying neuroinflammation simultaneously.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50 bg-card/10">
          <div className="container-page max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Monitoring</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Gut health biomarkers</h2>
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
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Microbiome restoration with clinical evidence</h2>
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
              <p className="text-xs text-cyan-400 uppercase tracking-widest font-medium">TNiC Library</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Compounds in the TNiC library that target this hallmark</h2>
            <p className="text-muted-foreground mb-8">Structured compound profiles — dosing, mechanism, and evidence tier — for library compounds tagged as targeting dysbiosis.</p>
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
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Rebuild your microbiome.</h2>
            <p className="text-muted-foreground mb-8">30 plant species a week + daily fermented foods is the highest-ROI gut intervention. Sulforaphane protects the barrier. Track zonulin in the Labs.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/stacks" className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Stack Architect <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/hallmarks" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><BookOpen className="w-4 h-4" />All Hallmarks</Link>
              <Link href="/library/dysbiosis" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><Library className="w-4 h-4" />View in Library</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
