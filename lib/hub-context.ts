import type { ThemeAccent } from './design-system';
import type { ToolId } from './registry';
import type { LibraryModule, LibraryModuleCategory } from './library-modules';
import type { HallmarkLibraryEntry, Peptide } from './types';
import type { EvidenceComparison } from './comparisons';
import { consumerFAQ } from './data';

export interface HubContext {
  what: string;
  why: string;
  next: string;
}

export interface HubContextEntry extends HubContext {
  theme: ThemeAccent;
}

export type TrustTab =
  | 'overview'
  | 'evidence'
  | 'citations'
  | 'journey'
  | 'methodology'
  | 'disclaimers'
  | 'sponsorship'
  | 'updates';

export type TrustPageKey = 'methodology' | 'disclaimers' | 'journey' | 'sponsorship' | 'updates';

export const hubContexts: Record<
  | 'dashboard'
  | 'stacks'
  | 'labs'
  | 'tools'
  | 'shop'
  | 'products'
  | 'brief'
  | 'learn'
  | 'compare'
  | 'quiz'
  | 'library'
  | 'libraryModules'
  | 'trust'
  | 'faq'
  | 'contact'
  | 'deliverySystems'
  | 'peptides'
  | 'topPicks'
  | 'pathwayArchitect',
  HubContextEntry
> = {
  dashboard: {
    theme: 'emerald',
    what: 'Your personal longevity command center — stack status, labs, hallmark coverage, milestones, and export kit in one view.',
    why: 'Fragmented tracking leads to bad decisions. The OS unifies what you are taking, what your labs show, and what to do next.',
    next: 'Complete the onboarding strip, then log baseline labs and load a stack preset from the quiz or Stack Architect.',
  },
  stacks: {
    theme: 'violet',
    what: 'Evidence-graded protocol catalog plus a live stack builder with synergy scoring, interactions, and shareable URLs.',
    why: 'Random supplement lists ignore interactions and evidence tiers. Build stacks with transparent synergy math before you spend.',
    next: 'Start from an elite preset in Catalog, customize in Builder, then verify picks at Protocol Shop.',
  },
  labs: {
    theme: 'rose',
    what: 'Local biomarker logging with trend charts, hallmark risk mapping, and stack-aware recommendations.',
    why: 'Supplements without labs is guessing. Track hs-CRP, GSH, NAD+ index, and related markers to see if your protocol is working.',
    next: 'Log a baseline panel on the Input tab, then check Trends after your second reading — lifestyle modules link here directly.',
  },
  tools: {
    theme: 'violet',
    what: 'Six rule-based calculators plus Elite 8 Longevity Quotient ranking — simulator, network graph, protocol engine, biomarker forecasts, impact ranking, and defense scan.',
    why: 'Library knowledge stays abstract until you model it. These tools turn evidence into dose schedules, composite rankings, and projected outcomes — locally, no AI black box.',
    next: 'Run the Stack Simulator on your current compounds, or open Elite 8 LQ to compare interventions head-to-head.',
  },
  shop: {
    theme: 'amber',
    what: 'Stack-filtered buyer verification — COA demands, dose anchors, form requirements, and red flags. Affiliate links disclosed; commission never influences what is listed.',
    why: 'Most longevity sites are affiliate stores in disguise. This is an intelligence checklist, not a catalog — verify before you buy.',
    next: 'Share your preset stack link, export the checklist, and cross-check against compound deep-dives in the library.',
  },
  products: {
    theme: 'emerald',
    what: 'Verified manufacturer product catalog — one evidence-aligned pick per compound with dose notes and compound module links.',
    why: 'Random marketplace listings hide purity and form gaps. TNiC picks match trial-matched doses and link to PMID-graded deep-dives.',
    next: 'Open a product card, read the compound module, then cross-check COA requirements at Protocol Shop for your stack.',
  },
  brief: {
    theme: 'violet',
    what: 'PMID-curated research digest — weekly issues synced from Research Intel with links to hallmarks, compounds, and stacks.',
    why: 'Headlines without protocol context waste time. Every Brief issue maps studies to actionable TNiC modules.',
    next: 'Read the latest issue, follow protocol links, then subscribe for RSS/JSON feeds or email delivery.',
  },
  learn: {
    theme: 'cyan',
    what: 'Consumer education hub — getting started path, glossary, outcome timelines, red flags, and 15 curated FAQ answers.',
    why: 'Intelligent consumers ask hard questions first. Learn the science and safety rails before building a stack.',
    next: 'Complete the Start Here checklist, read Red Flags, then take the 3-min quiz for a personalized stack handoff.',
  },
  compare: {
    theme: 'cyan',
    what: 'Neutral head-to-head evidence tables — compounds, stacks, and delivery forms with PMID anchors and honest gap rows.',
    why: 'Marketing comparisons hide preclinical-only data. TNiC tables show what human trials actually say — and what they do not.',
    next: 'Pick the comparison matching your decision (e.g. NMN vs NR), then open linked compound modules and buyer guides.',
  },
  quiz: {
    theme: 'emerald',
    what: 'A 3-question intake that maps your goal, age window, and experience to an evidence-graded stack preset.',
    why: 'One-size-fits-all stacks fail. The quiz routes beginners to fundamentals and advanced users to compare-and-stack paths.',
    next: 'Answer all three questions, load your preset in Stack Architect, and open your OS dashboard to track progress.',
  },
  library: {
    theme: 'emerald',
    what: 'The 12 Hallmarks of Aging — each with visuals, ranked interventions, PubMed citations, and personal notes.',
    why: 'Longevity science is organized by biological problems, not brand names. Start from the hallmark that matches your symptoms.',
    next: 'Select your primary hallmark, review top interventions, then open linked compound or lifestyle modules.',
  },
  libraryModules: {
    theme: 'emerald',
    what: '20 evidence-graded MDX modules — compounds, synergies, lifestyle pillars, and testing guides with personal tracking templates.',
    why: 'Shallow blog posts cannot support protocol decisions. Every module includes dosing, monitoring, decision trees, and PMID citations.',
    next: 'Search by compound or hallmark, read the decision tree, then log relevant labs and add compounds to your stack.',
  },
  trust: {
    theme: 'emerald',
    what: 'Trust & transparency hub — evidence tiers, citation registry, methodology, disclaimers, and public update history.',
    why: 'Longevity sites hide conflicts of interest and evidence gaps. TNiC publishes how every recommendation is graded, cited, and revised.',
    next: 'Read the Evidence tab for A/B/C tier criteria, then export citations from the Citations tab for physician discussions.',
  },
  faq: {
    theme: 'cyan',
    what: `${consumerFAQ.length} curated answers on protocols, safety, evidence tiers, and how TNiC differs from supplement stores.`,
    why: 'Smart consumers ask hard questions before spending on compounds. Honest FAQ beats marketing copy every time.',
    next: 'Filter by your concern (Safety or Products), then follow links to the Learn hub or Protocol Shop verification.',
  },
  contact: {
    theme: 'cyan',
    what: 'Structured contact channel for stack, lab, and library questions — educational only, never medical advice.',
    why: 'Generic contact forms waste time. Category routing helps TNiC respond with the right module links and disclaimers.',
    next: 'Pick your category, include relevant labs or stack URL, then send via the pre-filled mailto handoff.',
  },
  deliverySystems: {
    theme: 'emerald',
    what: 'Comparison guide for lipid delivery technologies — liposomes, phytosomes, NLCs, and LNPs — and when each improves bioavailability.',
    why: 'Premium brands charge more for liposomal labels that may not improve absorption. Delivery chemistry determines whether dose dollars work.',
    next: 'Match your compound to phytosome or NLC rows, then verify branded forms at Protocol Shop before buying.',
  },
  peptides: {
    theme: 'rose',
    what: 'Eight of the most-discussed anti-aging peptides — evidence tier, mechanism, and legal status (FDA-approved vs. compounding-restricted vs. research-use-only) stated plainly for each.',
    why: 'Peptides span a wider legal and evidence range than oral supplements in one catalog. Sorting by pathway alone hides that a Tier-A prescription drug and an unregulated research chemical are very different decisions.',
    next: 'Read the legal-status banner on any peptide before anything else, then check its related hallmark for compounds with a deeper human evidence base.',
  },
  topPicks: {
    theme: 'emerald',
    what: "TNiC's highest-conviction compound picks across three overlapping pathways — sirtuin activation, PARP/DNA-repair support, and NRF2 antioxidant signaling.",
    why: 'The same NAD+ pool fuels both sirtuins and PARP, and NRF2 activation both switches on antioxidant genes and reduces the DNA damage those repair pathways face — picks here reflect that shared biology instead of treating each pathway in isolation.',
    next: 'Open a pick to read its full compound module, then check the Systems Map for how these pathways interact with the rest of the hallmarks.',
  },
  pathwayArchitect: {
    theme: 'amber',
    what: 'Build a protocol compound-by-compound and watch synergy, caution, redundancy, and hallmark coverage update live as you add each one.',
    why: 'A stack is more than a compound list — the pathways it converges on and the interactions between its members determine whether it compounds or cancels itself out.',
    next: 'Start from a starter stack or add compounds individually, then open any card\'s library link to read the mechanism behind a synergy.',
  },
};

const trustTabContexts: Record<TrustTab, HubContext> = {
  overview: {
    what: 'Transparency pledge, evidence tag legend, and the primary site-wide disclaimer in one view.',
    why: 'Trust starts with stated principles — not buried footnotes. Overview sets the rules before you read details.',
    next: 'Open the Evidence tab to learn tier criteria, then bookmark deep-links to Methodology and Disclaimers.',
  },
  evidence: {
    what: 'Tier A/B/C definitions with inclusion criteria, real examples, and quarterly re-evaluation policy.',
    why: 'Marketing tiers are meaningless without published criteria. Every compound and stack on TNiC maps to these definitions.',
    next: 'Note which tier your current stack compounds carry, then open linked library modules to verify PMID anchors.',
  },
  citations: {
    what: 'Citation principles, format guide, BibTeX/JSON export, and the full indexed PMID registry.',
    why: 'Traceability is the antidote to hype. Export citations when sharing protocols with physicians or research partners.',
    next: 'Export your citation bundle, cross-check PMIDs on PubMed, then link sources in your personal journey notes.',
  },
  journey: {
    what: 'TNiC platform evolution timeline plus a personal journey template with N=1 vs. population labeling.',
    why: 'Anecdotes upgrade evidence tiers in most longevity content. TNiC separates founder N=1 from population science explicitly.',
    next: 'Read platform milestones for context, then start your personal journey log — label every entry N=1 or cited.',
  },
  methodology: {
    what: 'How compounds are selected, evidence is graded, biomarkers are modeled, and conflicts of interest are managed.',
    why: 'Methodology transparency lets you audit recommendations instead of trusting a brand voice.',
    next: 'Read compound selection and tier assignment sections, then open the full methodology page for complete detail.',
  },
  disclaimers: {
    what: 'Every limitation of the TNiC platform — medical advice, Rx protocols, supplement quality, and local data storage.',
    why: 'Informed consent requires knowing what TNiC cannot do. Disclaimers apply site-wide even when not repeated inline.',
    next: 'Read Rx and supplement-quality disclaimers before loading clinical-tier stacks, then export your lab data regularly.',
  },
  sponsorship: {
    what: 'Commercial integrity rules for sponsorships, affiliate links, brand-supported education, and user data boundaries.',
    why: 'Partnerships can help fund education only if sponsors cannot silently influence evidence grades, rankings, or methodology.',
    next: 'Read the principles, then open Partnerships for acceptable collaboration categories and contact instructions.',
  },
  updates: {
    what: 'Public changelog of platform releases, evidence tier revisions, and the Next Up improvement roadmap.',
    why: 'Silent updates erode trust. Every significant change is versioned and logged with sprint-level detail.',
    next: 'Check the latest sprint entry, review in-progress items on Next Up, then subscribe to Brief for research sync.',
  },
};

const trustPageContexts: Record<TrustPageKey, HubContext> = {
  methodology: {
    what: 'Full published methodology — compound curation, evidence grading rubric, biomarker modeling, and conflict-of-interest policy.',
    why: 'Hub tab summaries are not enough for physician or researcher review. This page is the complete audit document.',
    next: 'Read tier assignment criteria, then cross-check your stack compounds against the Evidence tab definitions.',
  },
  disclaimers: {
    what: 'Standalone page with every site-wide disclaimer — medical, Rx, supplement quality, N=1, and data privacy.',
    why: 'Legal clarity should not require tab-hopping. This page is the canonical reference before protocol decisions.',
    next: 'Read Rx and emergency disclaimers first, then proceed to Stack Architect only with physician oversight where required.',
  },
  sponsorship: {
    what: 'Standalone policy for sponsorship, advertising, affiliate, editorial, and user-data boundaries.',
    why: 'Sponsor readiness requires visible guardrails before any external brand asks how influence is handled.',
    next: 'Review non-negotiables, then use the Partnerships page for collaboration inquiries.',
  },
  journey: {
    what: 'Expanded journey timeline — platform milestones and a personal protocol log template with honest N=1 labeling.',
    why: 'Your protocol history matters for retest timing and spend decisions. Population science and personal anecdotes stay separated.',
    next: 'Review platform milestones for TNiC context, then log your first personal entry with biomarker snapshots from Labs.',
  },
  updates: {
    what: 'Complete version history plus the Next Up panel showing shipped, in-progress, and planned improvements.',
    why: 'Roadmap transparency shows where TNiC is headed — and what already shipped. No vaporware promises.',
    next: 'Filter Next Up by in-progress, read the latest changelog entry, then open linked modules to verify new features.',
  },
};

const toolContexts: Record<ToolId, HubContext> = {
  simulator: {
    what: 'Live synergy scoring and pair-level interaction checks for your selected compounds.',
    why: 'Two safe compounds together can still conflict. See the math before you commit to a daily protocol.',
    next: 'Add compounds from Stack Architect, review the risk index, then export or share your stack URL.',
  },
  network: {
    what: 'Interactive graph of compound synergies, cautions, and contraindication edges.',
    why: 'Linear stack lists hide network effects. Visualize how NAD+, NRF2, and mTOR pathways interact.',
    next: 'Identify red edges first, remove conflicting pairs, then re-run the Simulator for an updated score.',
  },
  protocol: {
    what: 'Rule-based multi-phase protocol planner from goals, labs, and lifestyle inputs.',
    why: 'Phased ramp-in prevents overwhelm and catches interactions early. Full reasoning trace — not generative AI.',
    next: 'Enter your quiz goal and lab snapshot, review phase 1 compounds, then load into Stack Architect.',
  },
  biomarker: {
    what: 'Lab trend visualization with intervention impact forecasts and ranked scenarios.',
    why: 'Single lab values lie — trends tell the story. Models use published effect sizes with clear disclaimers.',
    next: 'Import labs from Lab Hub, pick a target marker, and compare forecast scenarios side by side.',
  },
  impact: {
    what: 'Ranks which interventions in your stack likely move each biomarker most.',
    why: 'When multiple compounds affect the same marker, prioritization matters for retest timing and spend.',
    next: 'Select your highest watch marker from Labs, then adjust stack order based on impact ranking.',
  },
  healthspan: {
    what: 'Lifestyle-based biological age estimate and antioxidant defense scan — sets your OS profile locally.',
    why: 'Subjective wellness needs a baseline. The scan anchors your dashboard bio-age and defense score.',
    next: 'Complete the scan, review your OS profile on the dashboard, then fix sleep and exercise pillars first.',
  },
  inventory: {
    what: 'Adherence-weighted supply projection for your active stack over a full 24-week cycle.',
    why: 'Protocols fail when compounds run out mid-cycle. Plan container counts and reorder cadence before you commit.',
    next: 'Set your realistic adherence, review per-compound container counts, then stock or schedule reorders.',
  },
};

const moduleCategoryDefaults: Record<LibraryModuleCategory, HubContext> = {
  compounds: {
    what: 'A deep-dive module covering mechanism, human evidence tier, dosing protocol, monitoring checklist, and personal results template.',
    why: 'Compound marketing hides preclinical-only claims. TNiC grades every statement and links PMIDs you can verify.',
    next: 'Read the decision tree, log baseline labs from the monitoring table, then verify buyer picks at Protocol Shop.',
  },
  synergies: {
    what: 'A multi-compound synergy guide with mechanistic rationale, timing choreography, and contraindication notes.',
    why: 'Stacks fail from timing and pathway conflicts, not just ingredient choice. Synergy guides choreograph the full day.',
    next: 'Load the stack preset in Architect, run Simulator for interaction checks, then track combined biomarkers in Labs.',
  },
  lifestyle: {
    what: 'An evidence-graded lifestyle protocol with hallmark mapping, decision tree, lab tie-ins, and wearable signals.',
    why: 'Lifestyle provides the signal; supplements provide substrate. Fix pillars before escalating compound spend.',
    next: 'Follow the week-one implementation block, log labs at baseline, then revisit stack decisions after 4–8 weeks.',
  },
  guides: {
    what: 'A testing and monitoring roadmap — what to order, retest cadence, trend interpretation, and stack-adjustment triggers.',
    why: 'Expensive panels without context waste money. Guides tie each marker to hallmarks and protocol decisions.',
    next: 'Order the baseline panel, log results in Lab Hub, and set retest reminders from the cadence table.',
  },
};

const moduleSlugOverrides: Partial<Record<string, Partial<HubContext>>> = {
  nmn: {
    next: 'Compare the NMN vs NR table first if undecided, then verify Tru Niagen or NMN form in the Protocol Shop.',
  },
  nr: {
    next: 'Read the NMN vs NR comparison, then open the Protocol Shop for the NR-Cl verification checklist.',
  },
  glynac: {
    next: 'Pair with NRF2 Triad synergy guide, log GSH and 8-OHdG in Labs, verify glycine/NAC forms at shop.',
  },
  'nad-mito-stack': {
    next: 'Ramp Ca-AKG per module schedule, simulate full stack in Tools, log NAD+ index at 12 weeks.',
  },
  'glynac-nrf2-triad': {
    next: 'Run the AM choreography (GlyNAC → 20 min → sulforaphane → breakfast + R-ALA) for 24 weeks; log GSH and hs-CRP at baseline, week 12, and week 24 in Labs.',
  },
  'nmn-resveratrol-sirt1': {
    next: 'Titrate NMN AM fasted and resveratrol PM with fat over 4 weeks; log a baseline NAD+ index now and retest at week 4.',
  },
  exercise: {
    next: 'Establish your Zone 2 heart-rate zone with one 30-minute session this week, then log resting HR and hs-CRP in Labs before adding resistance or VO2max work.',
  },
  sleep: {
    next: 'Fix your wake time first — don’t touch bedtime yet — and log actual sleep duration nightly; add outdoor AM light on day 4.',
  },
  nutrition: {
    next: 'Log your current eating window and fiber grams for 3 days with no other changes, then tighten to a 10-hour window and add one high-fiber food.',
  },
  stress: {
    next: 'Record a 7-day HRV baseline each morning in the same position, then add one 5-minute box-breathing session before extending to full biofeedback.',
  },
  'testing-and-monitoring': {
    next: 'Order the Tier 1 baseline panel first, log results in Lab Hub, and set retest reminders from the cadence matrix before adding Tier 2 markers.',
  },
  rapamycin: {
    what: 'Educational deep-dive on mTORC1 inhibition — prescription-only, physician-supervised contexts only.',
    why: 'Rapamycin has the strongest preclinical lifespan data but serious immunosuppressive risks. This module is for informed physician discussions.',
    next: 'Complete physician checklist in module, do not self-source — read disclaimers before any discussion.',
  },
  sulforaphane: {
    next: 'See how this ranks against other NRF2 and PARP-support picks at /library/top-picks, then verify broccoli-sprout-extract form at shop.',
  },
  resveratrol: {
    next: 'Compare against Pterostilbene\'s bioavailability advantage at /library/top-picks before choosing a form.',
  },
  pterostilbene: {
    next: 'See the full Sirtuin Activation ranking at /library/top-picks, then verify micronized/liposomal form at shop.',
  },
  rala: {
    next: 'See how this ranks for NRF2 support at /library/top-picks, then log GSH alongside 8-OHdG in Labs.',
  },
  tudca: {
    next: 'Simulate alongside NAD+/mitochondrial compounds in Stack Architect, then verify UDCA-content purity at Protocol Shop.',
  },
  grapeseed: {
    next: 'Log hs-CRP and a lipid panel in Labs — the endothelial and oxidative markers this compound is meant to move.',
  },
  cakg: {
    next: 'Compare against Spermidine\'s autophagy-first approach at the Ca-AKG vs Spermidine comparison, then verify calcium-salt form at Protocol Shop.',
  },
  taurine: {
    next: 'Compare against NMN\'s approach to the same mitochondrial-buffer hallmark at Taurine vs NMN, then verify pharmaceutical-grade sourcing at Protocol Shop.',
  },
  spermidine: {
    next: 'Compare against Ca-AKG\'s epigenetic-cofactor approach at Ca-AKG vs Spermidine, then verify wheat-germ-extract purity at Protocol Shop.',
  },
  berberine: {
    next: 'See the metformin head-to-head at Berberine vs Metformin, then verify dihydroberberine form (5x bioavailability) at Protocol Shop.',
  },
  urolithina: {
    next: 'Compare against CoQ10\'s electron-transport-chain approach at Urolithin A vs CoQ10, then verify Mitopure-licensed form at Protocol Shop.',
  },
  fisetin: {
    next: 'See the quercetin comparison at Fisetin vs Quercetin, then verify the pulse-dose protocol (2 consecutive days/month) at Protocol Shop.',
  },
  coq10: {
    next: 'Compare ubiquinol vs ubiquinone forms at CoQ10 vs Ubiquinol, then verify statin-interaction dosing at Protocol Shop.',
  },
  omega3: {
    next: 'Compare against krill oil\'s phospholipid-bound form at Omega-3 vs Krill Oil, then verify EPA:DHA ratio and third-party oxidation testing at Protocol Shop.',
  },
};

export function getHubContext(
  key: keyof typeof hubContexts,
): HubContextEntry {
  return hubContexts[key];
}

export function getTrustTabContext(tab: TrustTab): HubContext {
  return trustTabContexts[tab];
}

export function getTrustPageContext(page: TrustPageKey): HubContext {
  return trustPageContexts[page];
}

export function getToolContext(toolId: ToolId): HubContext {
  return toolContexts[toolId];
}

export function getModuleContext(module: LibraryModule): HubContext {
  const base = moduleCategoryDefaults[module.category];
  const override = moduleSlugOverrides[module.slug];
  return {
    what: override?.what ?? `${base.what} (${module.title})`,
    why: override?.why ?? `${module.summary.slice(0, 140)}…`,
    next: override?.next ?? base.next,
  };
}

export function getHallmarkContext(hallmark: HallmarkLibraryEntry): HubContext {
  const top = hallmark.interventions[0];
  return {
    what: `Hallmark #${hallmark.number} of 12 — ${hallmark.title}: ${hallmark.tagline}`,
    why: hallmark.whyItMatters,
    next: top
      ? `Top intervention: ${top.name} (Tier ${top.evidence}). Open linked module, add to stack, log ${hallmark.biomarkers.slice(0, 2).join(' or ') || 'relevant markers'} in Labs.`
      : 'Review ranked interventions below, then open linked library modules.',
  };
}

export function getPeptideContext(peptide: Peptide): HubContext {
  const legalNote =
    peptide.legalStatus === 'fda-approved-rx'
      ? 'It is FDA-approved for a specific indication — the longevity use discussed here is off-label.'
      : peptide.legalStatus === 'compounding-restricted'
        ? 'It has no legal US compounding pathway — sourcing means an unregulated research-chemical vendor.'
        : 'It has no FDA-approved human-use pathway — sourcing means an unregulated research-chemical vendor.';

  return {
    what: `${peptide.name} (Tier ${peptide.evidenceTier}) — ${peptide.tagline}`,
    why: `${legalNote} Evidence quality and legal status are independent questions; both are covered in full below.`,
    next:
      peptide.relatedHallmarkIds.length > 0
        ? 'Read the mechanism and safety sections below, then check the related hallmark for compounds with a deeper human evidence base.'
        : 'Read the mechanism and safety sections below before treating this as anything more than exploratory.',
  };
}

export function getCompareContext(comp: EvidenceComparison): HubContext {
  return {
    what: `Head-to-head evidence table: ${comp.labelA} vs ${comp.labelB} (${comp.category}).`,
    why: comp.summary,
    next:
      comp.category === 'compound'
        ? `Use the verdict row to pick a primary compound, then open both deep-dives and /shop verification checklists.`
        : `Load the winning stack preset in Architect and simulate interactions before purchasing.`,
  };
}
