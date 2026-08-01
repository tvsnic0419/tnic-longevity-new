import Link from 'next/link';
import { ArrowRight, ExternalLink, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { GuideHeroPanel } from '@/components/guides/GuideHeroPanel';
import { StructuredData } from '@/components/seo/StructuredData';
import { LinkedText } from '@/components/ui/LinkedText';
import { buildPageMetadata, buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Sulforaphane Supplement Guide 2026 — NRF2 Activation, Broccoli Sprouts & Evidence',
  description:
    'Complete sulforaphane guide: how broccoli sprout extract activates NRF2 and 200+ cytoprotective genes, the best form (glucoraphanin vs active sulforaphane), dosing protocol, and clinical trial evidence.',
  path: '/sulforaphane-supplement-guide',
  keywords: [
    'sulforaphane supplement guide',
    'sulforaphane NRF2',
    'broccoli sprout extract supplement',
    'sulforaphane benefits',
    'sulforaphane dosage',
    'glucoraphanin vs sulforaphane',
    'sulforaphane cancer prevention',
    'sulforaphane autism research',
    'NRF2 activator supplement',
    'best sulforaphane supplement 2026',
  ],
});

const NRF2_TARGETS = [
  { gene: 'NQO1', function: 'Quinone oxidoreductase — detoxifies carcinogens', context: 'Cancer prevention pathway' },
  { gene: 'HMOX1', function: 'Heme oxygenase — degrades pro-oxidant heme', context: 'Anti-inflammatory, cytoprotective' },
  { gene: 'GCLC/GCLM', function: 'Glutamate-cysteine ligase — rate-limiting step in GSH synthesis', context: 'Pairs with GlyNAC for max glutathione' },
  { gene: 'TXNRD1', function: 'Thioredoxin reductase — reduces oxidized proteins', context: 'Redox homeostasis' },
  { gene: 'SRXN1', function: 'Sulfiredoxin — repairs oxidized peroxiredoxins', context: 'Mitochondrial antioxidant defense' },
  { gene: 'FTH1/FTL', function: 'Ferritin heavy/light chain — sequesters pro-oxidant free iron', context: 'Iron overload protection' },
];

const FAQ = [
  {
    q: 'What is sulforaphane and where does it come from?',
    a: "Sulforaphane is an isothiocyanate — a sulfur-containing phytochemical produced when glucoraphanin (a glucosinolate precursor) is hydrolyzed by the enzyme myrosinase. This reaction happens when you chew or blend broccoli sprouts — the plant stores glucoraphanin and myrosinase separately, and they mix when cells are damaged. Mature broccoli has 10–100× less glucoraphanin than 3-day-old broccoli sprouts. Supplements supply either glucoraphanin (with or without myrosinase), active sulforaphane stabilized in various forms, or broccoli sprout extract standardized to a specific sulforaphane equivalent.",
  },
  {
    q: 'How does sulforaphane activate NRF2?',
    a: "Sulforaphane works via a Keap1-NRF2 release mechanism. Normally, Keap1 protein keeps NRF2 bound in the cytoplasm, marking it for proteasomal degradation. Sulforaphane reacts directly with cysteine residues on Keap1, changing its conformation and releasing NRF2. Free NRF2 then translocates to the nucleus and binds antioxidant response elements (AREs) — activating 200+ cytoprotective genes including NQO1, HMOX1, GCLC (glutathione synthesis), and the ferritin genes. This is the broadest single-compound induction of cellular defense in known pharmacology.",
  },
  {
    q: 'Glucoraphanin vs sulforaphane — which supplement form is better?',
    a: "Glucoraphanin (the precursor) requires your gut microbiome to produce the myrosinase enzyme to convert it to active sulforaphane. This conversion is unreliable — studies show 0–60% inter-individual variation based on gut flora. Active sulforaphane (from stabilized extracts or fresh sprout juice) is directly bioavailable. For supplements: prefer products that include myrosinase (or daikon radish extract, a myrosinase source) alongside glucoraphanin, or choose stabilized sulforaphane preparations like GS-Broccomax or Prostaphane. Fresh broccoli sprout juice (3-day-old sprouts, blended raw) remains the most bioavailable and cheapest form.",
  },
  {
    q: 'What is the correct sulforaphane dosage?',
    a: "The key human trials used 50–200 µmol/day of sulforaphane equivalent — which translates roughly to 50–200 mg/day of a standardized broccoli sprout extract at 0.1% sulforaphane content, or 40–80 g of fresh 3-day broccoli sprouts. The Fahey/Talalay group (Johns Hopkins) typically used ~100 µmol/day. For the autism RCT (Singh 2014), doses were weight-based: 50–150 µmol/day. Most practitioners use 30–100 mg/day of a standardized extract. Start low — sulforaphane can cause GI discomfort (sulfurous compounds, flatulence) at high doses.",
  },
  {
    q: 'Does sulforaphane prevent cancer?',
    a: "There is strong preclinical evidence and meaningful phase II/III clinical trial data for sulforaphane in cancer prevention — particularly for prostate, breast, colon, and lung cancers. The AIFA RCT (Traka 2019, PMID 31375680) showed sulforaphane reduced prostate cancer progression markers. The Fahey 2002 H. pylori trial (PMID 12226120) showed broccoli sprout reduction of gastric cancer risk markers. However: sulforaphane is NOT FDA-approved for cancer prevention, and the evidence standard for claiming cancer prevention is very high. It rates Tier A for NRF2 activation and Tier B for cancer risk reduction — meaningful evidence, but not a proven cancer preventive.",
  },
  {
    q: 'Can I grow my own broccoli sprouts instead of buying supplements?',
    a: "Yes — and this is the cheapest, most bioavailable approach. Buy organic broccoli sprouting seeds, soak 2 tbsp overnight, drain and rinse twice daily for 3 days. At day 3–4 (when the tiny yellow leaves appear), rinse, refrigerate, and blend raw with water before consuming. Add mustard seed powder if cooking (provides myrosinase). One tablespoon (~15g) of fresh broccoli sprout powder contains roughly 35–75 µmol glucoraphanin. Growing your own costs ~$5/month vs $30–80/month for quality supplements.",
  },
  {
    q: 'Should I take sulforaphane with GlyNAC?',
    a: "Yes — this is one of the most evidence-backed stacking decisions here. GlyNAC provides glycine and NAC, both precursors for glutathione synthesis. Sulforaphane upregulates GCLC/GCLM (the rate-limiting enzymes in glutathione synthesis) via NRF2. They work via complementary mechanisms: GlyNAC supplies the substrate; sulforaphane increases the enzymatic capacity to use it. The combination produces higher glutathione than either alone. This is the foundation of the NRF2 Defense Triad: Sulforaphane + GlyNAC + R-ALA.",
  },
];

function buildSulforaphaneSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start a Sulforaphane Supplement Protocol',
    description:
      'Evidence-based guide to sulforaphane supplementation for NRF2 activation and longevity, covering form selection, dosing, and stacking strategies.',
    path: '/sulforaphane-supplement-guide',
    totalTime: 'PT10M',
    steps: [
      {
        name: 'Choose your sulforaphane source',
        text: 'Option 1 (cheapest): Grow your own 3-day broccoli sprouts (60–100 µmol per 30g). Option 2: Buy a standardized broccoli sprout extract with both glucoraphanin AND myrosinase listed on the label. Option 3: Fresh broccoli sprout powder standardized to glucoraphanin content. Avoid products listing only glucoraphanin without myrosinase — gut conversion is unreliable.',
      },
      {
        name: 'Start at a low dose (week 1)',
        text: 'Begin with 25–50 µmol sulforaphane equivalent per day (~30g fresh sprouts or 30 mg standardized extract). Sulforaphane produces sulfurous gas in the gut — starting low reduces flatulence and GI discomfort that causes many people to quit.',
      },
      {
        name: 'Take in the morning, fasted if possible',
        text: 'Sulforaphane NRF2 activation is transient (peaks 2–4 hours post-dose, normalizes in 24h). Morning dosing allows the NRF2 peak to overlap with the day\'s highest oxidative stress exposure. Fasted state may improve absorption. Avoid heat — cooking destroys both sulforaphane and myrosinase; eat sprouts raw or take supplements with water.',
      },
      {
        name: 'Stack with GlyNAC and R-ALA for the NRF2 Triad',
        text: 'The NRF2 Defense Triad pairs sulforaphane (NRF2 inducer) + GlyNAC (glutathione precursors) + R-ALA (NRF2 inducer + cofactor). Sulforaphane upregulates glutathione synthesis genes; GlyNAC provides the substrate; R-ALA amplifies NRF2 via a complementary cysteine alkylation pathway. Together, these three address cellular redox capacity more completely than any single compound.',
      },
      {
        name: 'Take sulforaphane 5 days on, 2 days off',
        text: "NRF2 signaling adapts (downregulates) with continuous stimulation — this is the hormetic principle. Cycling 5 days on, 2 days off maintains sensitivity. Some practitioners do 5 weeks on, 1 week off at the monthly level. Fresh sprout rotation naturally provides this cycling if you grow in batches.",
      },
    ],
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Sulforaphane Supplement Guide 2026 — NRF2 Activation, Broccoli Sprouts & Evidence',
    description:
      'Complete guide to sulforaphane supplementation: NRF2 mechanism, glucoraphanin vs active sulforaphane, dosing, broccoli sprout growing guide, and clinical trial evidence.',
    url: `${SITE.url}/sulforaphane-supplement-guide`,
    dateModified: '2026-06-28',
    author: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'TNiC', url: SITE.url },
    about: [
      { '@type': 'MedicalSubstance', name: 'Sulforaphane', description: 'Isothiocyanate NRF2 activator from broccoli glucoraphanin + myrosinase hydrolysis' },
    ],
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Cancer chemoprotective activity of broccoli sprouts',
        author: 'Fahey JW, Zhang Y, Talalay P',
        datePublished: '1997',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '9294217' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/9294217/',
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Sulforaphane-rich broccoli sprout extract improves hepatic abnormalities in male subjects',
        author: 'Shimizu T et al.',
        datePublished: '2018',
        identifier: { '@type': 'PropertyValue', propertyID: 'PMID', value: '29621900' },
        url: 'https://pubmed.ncbi.nlm.nih.gov/29621900/',
      },
    ],
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Sulforaphane Supplement Guide', path: '/sulforaphane-supplement-guide' },
  ]);

  return [howTo, faqSchema, articleSchema, breadcrumb];
}

export default function SulforaphaneGuidePage() {
  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={buildSulforaphaneSchemas()} />

      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container-page max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" aria-hidden="true" />
                <span className="text-xs font-mono text-accent-emerald uppercase tracking-wider">Evidence Tier A · NRF2 Activator · Sulforaphane</span>
              </div>

              <h1 className="heading-hero mb-4">
                Sulforaphane Supplement Guide 2026
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                The most potent known natural activator of NRF2 — the transcription factor that switches on 200+ cytoprotective genes. Here is what broccoli sprout extract actually does, how to take it, and why form matters enormously.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/library/compounds/sulforaphane"
                  className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-emerald text-bg-base font-semibold text-sm hover:bg-accent-emerald/90 transition"
                >
                  Compound deep-dive
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/library/compare/sulforaphane-vs-curcumin"
                  className="focus-ring interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
                >
                  Sulforaphane vs Curcumin
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <GuideHeroPanel
                glowColor="var(--accent-emerald)"
                stats={[
                  { value: '200+', label: 'Genes activated via NRF2', colorClass: 'text-accent-emerald' },
                  { value: '10–100×', label: 'Sprouts vs. mature broccoli', colorClass: 'text-accent-cyan' },
                  { value: '~4h', label: 'NRF2 peak post-dose', colorClass: 'text-accent-violet' },
                  { value: 'Tier A', label: 'Evidence tier', colorClass: 'text-accent-rose' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* NRF2 mechanism */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">How Sulforaphane Activates NRF2</h2>
          <p className="text-body mb-8 max-w-2xl">
            NRF2 (Nuclear Factor Erythroid 2-Related Factor 2) is the master regulator of cellular antioxidant defense — it controls the transcription of over 200 cytoprotective genes. Sulforaphane is the most potent known natural NRF2 activator.
          </p>

          <div className="rounded-2xl border border-accent-emerald/20 bg-accent-emerald/[0.04] p-6 mb-8">
            <p className="font-mono text-sm text-accent-emerald mb-2">THE MECHANISM</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Normally, Keap1 protein keeps NRF2 bound in the cytoplasm and marks it for degradation. Sulforaphane reacts covalently with cysteine residues on Keap1 (particularly C151, C273, C288), changing its shape. Keap1 releases NRF2, which translocates to the nucleus, binds antioxidant response elements (AREs), and activates the cytoprotective gene battery — including enzymes for glutathione synthesis, detoxification, heme catabolism, and anti-inflammatory signaling.
            </p>
          </div>

          <h3 className="font-semibold text-lg mb-4">Key NRF2 Target Genes Induced by Sulforaphane</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            {NRF2_TARGETS.map((t) => (
              <div key={t.gene} className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-accent-emerald">{t.gene}</span>
                  <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-full border border-border/60">{t.context}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t.function}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form comparison */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-3">Form Guide — Which Sulforaphane Product to Choose</h2>
          <p className="text-body-sm text-muted-foreground mb-8">
            Form choice is the most important decision in sulforaphane supplementation — bioavailability varies dramatically.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {[
              {
                form: 'Fresh Broccoli Sprouts',
                rating: '★★★★★',
                ratingColor: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
                pros: ['Highest bioavailability — active sulforaphane + myrosinase together', 'Cheapest per dose (~$5/month)', 'No supply chain quality concerns'],
                cons: ['Time to grow (3 days)', 'Requires correct protocol (raw only, chew well)'],
                dose: '30–60g raw (2–4 tbsp fresh sprouts)',
              },
              {
                form: 'Glucoraphanin + Myrosinase',
                rating: '★★★★',
                ratingColor: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
                pros: ['Good bioavailability when myrosinase is present', 'Stable shelf life', 'Easy dosing'],
                cons: ['Must verify label includes myrosinase or daikon radish powder', 'More expensive than sprouts (~$30–60/month)'],
                dose: '200–400 mg extract standardized to glucoraphanin',
              },
              {
                form: 'Glucoraphanin Alone',
                rating: '★★',
                ratingColor: 'text-accent-rose',
                badge: 'bg-accent-rose/10 border-accent-rose/20',
                pros: ['Stable, long shelf life', 'Widely available'],
                cons: ['Gut conversion to sulforaphane varies 0–60% between individuals', 'Without myrosinase, many people convert very little', 'Most cheap broccoli supplements fall into this category'],
                dose: 'Unreliable — avoid without myrosinase unless testing serum levels',
              },
            ].map((f) => (
              <div key={f.form} className={`rounded-xl border p-5 ${f.badge} bg-card/50`}>
                <h3 className="font-semibold mb-1">{f.form}</h3>
                <p className={`font-mono text-sm mb-3 ${f.ratingColor}`}>{f.rating}</p>
                <div className="mb-3">
                  <p className="text-[10px] font-mono text-muted-foreground mb-1">PROS</p>
                  <ul className="space-y-1">
                    {f.pros.map((p) => (
                      <li key={p} className="text-xs text-muted-foreground flex gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-accent-emerald flex-shrink-0 mt-0.5" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <p className="text-[10px] font-mono text-muted-foreground mb-1">CONS</p>
                  <ul className="space-y-1">
                    {f.cons.map((c) => (
                      <li key={c} className="text-xs text-muted-foreground flex gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-accent-rose flex-shrink-0 mt-0.5" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground mt-3 border-t border-border/40 pt-2">
                  {f.dose}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HowTo */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-8">5-Step Protocol</h2>
          <div className="space-y-4">
            {[
              {
                n: '01',
                title: 'Choose your source: fresh sprouts (best) or standardized extract with myrosinase',
                body: 'Fresh 3-day broccoli sprouts are the gold standard for bioavailability and cost. If using a supplement, require that the label lists myrosinase or daikon radish powder alongside glucoraphanin. A product listing only glucoraphanin is likely to have poor and unpredictable conversion to active sulforaphane.',
              },
              {
                n: '02',
                title: 'Start at half the target dose (week 1)',
                body: 'Begin at ~25 µmol/day (~15–20g fresh sprouts or 20–30mg extract). Sulforaphane produces sulfurous compounds in the gut that can cause flatulence and GI discomfort. Starting low for 1 week significantly reduces this. Your gut microbiome also adapts to the new glucosinolate load.',
              },
              {
                n: '03',
                title: 'Take in the morning, fasted, raw (never cooked)',
                body: 'Sulforaphane NRF2 activation peaks ~2–4 hours post-dose. Morning fasted dosing aligns NRF2 activation with daytime oxidative stress exposure. Critical: heat above 60°C (140°F) destroys both sulforaphane and myrosinase. Always take supplements with cold water; always eat sprouts raw. Adding mustard powder to cooked broccoli restores some myrosinase activity.',
              },
              {
                n: '04',
                title: 'Cycle 5 days on, 2 days off',
                body: "NRF2 has a built-in negative feedback loop (KEAP1 is re-expressed after NRF2 activation). Continuous daily stimulation can blunt the response over weeks. A 5-on, 2-off cycle maintains hormetic sensitivity. Some practitioners also take 1 week off per month. Broccoli sprouts grown in weekly batches naturally create a cycle.",
              },
              {
                n: '05',
                title: 'Stack with GlyNAC and R-ALA for the NRF2 Triad',
                body: 'Sulforaphane upregulates GCLC (rate-limiting glutathione enzyme). GlyNAC provides the glycine + cysteine substrate. R-ALA activates NRF2 via a separate cysteine alkylation pathway. Together: sulforaphane turns on the glutathione factory genes; GlyNAC provides the raw materials; R-ALA adds another NRF2 input. This is the mechanistic basis for the NRF2 Defense Triad.',
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center">
                  <span className="text-xs font-mono text-accent-emerald">{step.n}</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical evidence */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-8">Key Human Trial Evidence</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: 'H. pylori and gastric cancer risk',
                pmid: '12226120',
                result: 'Broccoli sprouts (70g/day × 8 weeks) reduced H. pylori colonization 40% and reduced gastric cancer biomarkers in infected subjects',
                authors: 'Fahey JW et al. · 2002',
                color: 'text-accent-cyan',
                badge: 'bg-accent-cyan/10 border-accent-cyan/20',
              },
              {
                title: 'Non-alcoholic liver disease (NAFLD)',
                pmid: '29621900',
                result: '30mg sulforaphane/day × 12 weeks improved liver enzymes (ALT, AST) and reduced steatosis grade in NAFLD patients',
                authors: 'Shimizu T et al. · 2018',
                color: 'text-accent-violet',
                badge: 'bg-accent-violet/10 border-accent-violet/20',
              },
              {
                title: 'Autism spectrum disorder (ASD)',
                pmid: '25313065',
                result: '50–150 µmol/day sulforaphane × 18 weeks significantly improved behavioral measures in young men with ASD (randomized, double-blind, placebo-controlled)',
                authors: 'Singh K et al. · 2014',
                color: 'text-accent-emerald',
                badge: 'bg-accent-emerald/10 border-accent-emerald/20',
              },
              {
                title: 'Air pollution oxidative stress',
                pmid: '24467923',
                result: 'Broccoli sprout extract increased benzene, acrolein, and crotonaldehyde excretion 20–61% in highly polluted air (Qidong, China) — rapid Phase 2 detoxification',
                authors: 'Egner PA et al. · 2014',
                color: 'text-accent-rose',
                badge: 'bg-accent-rose/10 border-accent-rose/20',
              },
            ].map((trial) => (
              <div key={trial.title} className={`rounded-xl border p-5 ${trial.badge} bg-card/50`}>
                <h3 className="font-semibold text-sm mb-2">{trial.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{trial.result}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono text-muted-foreground">{trial.authors}</p>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${trial.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs font-mono inline-flex items-center gap-1 ${trial.color} hover:underline`}
                  >
                    PMID {trial.pmid} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 border-b border-border">
        <div className="container-page max-w-4xl">
          <h2 className="heading-section mb-8">Sulforaphane FAQ</h2>
          <div className="space-y-4">
            {FAQ.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-border/60 bg-card/50">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-sm list-none">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0 ml-4" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                  <LinkedText text={faq.a} excludeNames={['Sulforaphane']} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-page max-w-4xl">
          <div className="rounded-2xl border border-accent-emerald/20 bg-accent-emerald/[0.04] p-8 md:p-10 text-center">
            <h2 className="heading-section mb-3">Build the NRF2 Defense Triad</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              Sulforaphane is the anchor of the NRF2 Defense preset. Pair it with GlyNAC and R-ALA for the complete antioxidant defense stack.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/quiz"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-emerald text-bg-base font-semibold text-sm hover:bg-accent-emerald/90 transition"
              >
                Take the Nico Starter Questionnaire
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compounds/sulforaphane"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-emerald/30 transition"
              >
                Compound deep-dive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/glynac-supplement-guide"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-cyan/30 transition"
              >
                GlyNAC guide
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/library/compare/sulforaphane-vs-curcumin"
                className="focus-ring interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-medium text-sm hover:border-accent-violet/30 transition"
              >
                Sulforaphane vs Curcumin
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Educational content only — not medical advice. Sulforaphane is a dietary phytochemical, not FDA-approved to treat or prevent any disease. Broccoli sprouts may contain harmful bacteria if grown improperly — follow safe sprouting protocols.
          </p>
        </div>
      </section>
    </SubPageLayout>
  );
}
