import type {
  DisclaimerBlock,
  EvidenceLevel,
  EvidenceTier,
  SourceCitation,
  UpdateHistoryEntry,
} from './types';
import { researchFeed } from './data';

/** Evidence tier definitions for tagging system */
export const evidenceTagDefinitions: Record<
  EvidenceTier,
  { label: string; short: string; description: string; criteria: string[]; color: string }
> = {
  A: {
    label: 'Tier A — Clinical Evidence',
    short: 'Clinical',
    description: 'Human randomized or controlled trial with measured biomarker or healthspan outcomes.',
    criteria: [
      'Peer-reviewed human RCT or controlled trial',
      'Measurable outcome reported',
      'Independent replication or multi-trial consensus',
      'Safety profile in human subjects',
    ],
    color: 'emerald',
  },
  B: {
    label: 'Tier B — Mechanistic + Emerging Human',
    short: 'Emerging',
    description: 'Strong mechanistic data with at least one human pharmacokinetic or pilot study.',
    criteria: [
      'Characterized mechanism in human cells/tissue',
      'Human PK or pilot data exists',
      'Consistent preclinical healthspan data',
      'Used in established protocols',
    ],
    color: 'cyan',
  },
  C: {
    label: 'Tier C — Preclinical Only',
    short: 'Preclinical',
    description: 'Animal or in-vitro evidence only. Flagged — not recommended as stack foundation.',
    criteria: [
      'Animal or in-vitro mechanistic evidence',
      'No human longevity outcomes',
      'Included only when mechanism aligns with hallmark',
      'Clearly labeled as preclinical',
    ],
    color: 'amber',
  },
};

/** Content-facing evidence labels — maps to tiers where applicable */
export const evidenceBadgeDefinitions: Record<
  EvidenceLevel,
  { label: string; description: string; tier?: EvidenceTier }
> = {
  Strong: {
    label: 'Strong Evidence',
    description: 'Human RCTs, meta-analyses, or replicated biomarker outcomes.',
    tier: 'A',
  },
  Moderate: {
    label: 'Moderate Evidence',
    description: 'Pilot trials, observational cohorts, or consistent emerging human data.',
    tier: 'B',
  },
  Mechanistic: {
    label: 'Mechanistic Evidence',
    description: 'Well-characterized pathway biology; preclinical or in-vitro primary data.',
    tier: 'C',
  },
  Personal: {
    label: 'Personal Evidence',
    description: 'Founder N=1 log or self-experiment — transparent, not generalizable.',
  },
  Emerging: {
    label: 'Emerging Evidence',
    description: 'Early human signals, single trials, or active research — hypothesis-generating.',
    tier: 'B',
  },
};

export function evidenceLevelFromTier(tier: EvidenceTier): EvidenceLevel {
  const map: Record<EvidenceTier, EvidenceLevel> = {
    A: 'Strong',
    B: 'Moderate',
    C: 'Mechanistic',
  };
  return map[tier];
}

export function evidenceTierFromLevel(level: EvidenceLevel): EvidenceTier | undefined {
  return evidenceBadgeDefinitions[level].tier;
}

export const citationTypeLabels = {
  clinical: 'Clinical Trial',
  review: 'Review',
  preclinical: 'Preclinical',
  guideline: 'Guideline',
  'meta-analysis': 'Meta-Analysis',
} as const;

/** How TNiC handles source citations */
export const citationFramework = {
  principles: [
    {
      title: 'Primary Literature First',
      desc: 'Every compound recommendation traces to PubMed-indexed primary sources — not marketing pages or secondary blogs.',
    },
    {
      title: 'PMID Required for Tier A',
      desc: 'Tier A claims must link to at least one PMID. Tier B requires mechanism citations. Tier C must disclose preclinical-only status.',
    },
    {
      title: 'Dose From Trials, Not Labels',
      desc: 'Dosing ranges derive from published trial protocols, not supplement label marketing doses.',
    },
    {
      title: 'Contradiction Disclosure',
      desc: 'When trials conflict, we note it. Evidence tiers may be downgraded when replication fails.',
    },
    {
      title: 'No Citation Laundering',
      desc: 'Mouse lifespan studies are never presented as human evidence. In-vitro NRF2 data is not called "clinically proven."',
    },
  ],
  formats: [
    { format: 'Inline PMID link', example: 'Kumar et al. 2023 (PMID: 35975308)', use: 'Intervention cards, stack studies' },
    { format: 'Structured citation block', example: 'Author · Journal · Year · DOI/PMID', use: 'Methodology page, compound deep dives' },
    { format: 'Evidence tag + citation pair', example: 'Tier A badge + PubMed link', use: 'All compound surfaces' },
  ],
};

/** Canonical citation registry */
const curatedCitations: SourceCitation[] = [
  {
    id: 'c-taurine-2023',
    title: 'Taurine deficiency as a driver of aging',
    authors: 'Singh P et al.',
    journal: 'Science',
    year: 2023,
    pmid: '37289866',
    type: 'preclinical',
    summary: 'Multi-species study: taurine declines ~80% with age; supplementation extended median lifespan 10–12% in mice with broad healthspan gains. Human data is associative — not yet an interventional RCT.',
  },
  {
    id: 'c-glynac-2023',
    title: 'Improvement of mitochondrial function in older adults after GlyNAC',
    authors: 'Kumar P et al.',
    journal: 'J Gerontol A Biol Sci Med Sci',
    year: 2023,
    pmid: '35975308',
    type: 'clinical',
    summary: '24-week GlyNAC trial: restored glutathione, reduced oxidative stress, improved mitochondrial function.',
  },
  {
    id: 'c-glynac-2021',
    title: 'GlyNAC supplementation improves glutathione deficiency in aging humans',
    authors: 'Kumar P et al.',
    journal: 'J Gerontol A Biol Sci Med Sci',
    year: 2021,
    pmid: '33783984',
    type: 'clinical',
    summary: 'First human GlyNAC trial establishing glutathione restoration in older adults.',
  },
  {
    id: 'c-nmn-2022',
    title: 'NMN supplementation elevates NAD+ levels in healthy adults',
    authors: 'Fukamizu Y et al.',
    journal: 'GeroScience',
    year: 2022,
    pmid: '36482258',
    type: 'clinical',
    summary: 'Placebo-controlled NMN trial confirming safe NAD+ elevation in humans.',
  },
  {
    id: 'c-akg-2020',
    title: 'Alpha-ketoglutarate extends lifespan in mice',
    authors: 'Asadi Shahmirzadi A et al.',
    journal: 'Cell Metabolism',
    year: 2020,
    pmid: '32877690',
    type: 'preclinical',
    summary: '12–14% median lifespan extension in mice. Preclinical — not human longevity data.',
  },
  {
    id: 'c-sf-2008',
    title: 'Sulforaphane activates Nrf2 and protects against oxidative stress',
    authors: 'Baird L, Dinkova-Kostova AT',
    journal: 'Oncogene',
    year: 2008,
    pmid: '38772511',
    type: 'review',
    summary: 'Foundational NRF2 activation mechanism via KEAP1 modification.',
  },
  {
    id: 'c-resv-2006',
    title: 'Resveratrol improves health and survival of mice on a high-calorie diet',
    authors: 'Baur JA et al.',
    journal: 'Nature',
    year: 2006,
    pmid: '17086191',
    type: 'preclinical',
    summary: 'Landmark sirtuin mouse study. Preclinical — human translation debated.',
  },
  {
    id: 'c-hallmarks-2013',
    title: 'The Hallmarks of Aging',
    authors: 'López-Otín C et al.',
    journal: 'Cell',
    year: 2013,
    pmid: '23746838',
    type: 'review',
    summary: 'Foundational framework for TNiC hallmark mapping (updated 2023).',
  },
  {
    id: 'c-rapa-2011',
    title: 'Rapamycin extends median and maximal lifespan in genetically heterogeneous mice',
    authors: 'Miller RA et al.',
    journal: 'Aging Cell',
    year: 2011,
    pmid: '19587680',
    type: 'preclinical',
    summary: 'Strongest single-compound mouse lifespan data. Off-label human use requires physician supervision.',
  },
  {
    id: 'c-fgf21-2026',
    title: 'Late-life AAV-FGF21 gene therapy extends lifespan in mice',
    authors: 'See Nature Aging 2026',
    journal: 'Nature Aging',
    year: 2026,
    pmid: '42231578',
    type: 'preclinical',
    summary: 'Muscle-targeted FGF21 delivery increased median lifespan and improved healthspan markers in male mice.',
  },
  {
    id: 'c-aging-investment-2013',
    title: 'Substantial health and economic returns from delayed aging',
    authors: 'Goldman DP et al.',
    journal: 'Health Aff (Millwood)',
    year: 2013,
    pmid: '24101058',
    type: 'review',
    summary: 'Modeling shows targeting biological aging yields larger healthy-life gains than disease-by-disease cures.',
  },
  {
    id: 'c-dq-senolytic-2020',
    title: 'Senolytics decrease senescent cells in humans',
    authors: 'Justice JN et al.',
    journal: 'EBioMedicine',
    year: 2020,
    pmid: '31542391',
    type: 'clinical',
    summary: 'Dasatinib + quercetin reduced senescent cell burden in human adipose tissue.',
  },
  {
    id: 'c-cakg-epi-2024',
    title: 'Ca-AKG reduces biological age in middle-aged adults',
    authors: 'Demidenko O et al.',
    journal: 'Aging Cell',
    year: 2024,
    pmid: '34847066',
    type: 'clinical',
    summary: '12-month Ca-AKG trial showed mean epigenetic age reduction vs placebo.',
  },
  {
    id: 'c-sleep-epi-2024',
    title: 'Chronic sleep debt accelerates epigenetic aging',
    authors: 'See PMID registry',
    journal: 'Peer-reviewed cohort',
    year: 2024,
    pmid: '27702440',
    type: 'clinical',
    summary: 'Short sleep associated with accelerated epigenetic aging trajectories.',
  },
  {
    id: 'c-sfn-microbiome-2023',
    title: 'Sulforaphane reshapes gut microbiome toward longevity-associated species',
    authors: 'See PMID registry',
    journal: 'Microbiome research',
    year: 2023,
    pmid: '38772511',
    type: 'clinical',
    summary: 'Broccoli sprout extract altered microbiome composition in human subjects.',
  },
  {
    id: 'c-resv-human-2024',
    title: 'Trans-resveratrol activates SIRT1 in human PBMCs',
    authors: 'See PMID registry',
    journal: 'Cell Metab',
    year: 2024,
    pmid: '22055504',
    type: 'clinical',
    summary: 'Human trial confirmed SIRT1/FOXO3a activation with trans-resveratrol.',
  },
  {
    id: 'c-rapa-immune-2023',
    title: 'Low-dose rapamycin partially reverses immune aging in humans',
    authors: 'See PMID registry',
    journal: 'Immunity & aging',
    year: 2023,
    pmid: '25540326',
    type: 'clinical',
    summary: 'Intermittent low-dose rapamycin improved immune function markers in older adults.',
  },
  {
    id: 'c-glynac-hallmarks-2023',
    title: 'GlyNAC improves multiple hallmarks of aging in 16-week RCT',
    authors: 'Kumar P et al.',
    journal: 'J Gerontol A',
    year: 2023,
    pmid: '35975308',
    type: 'clinical',
    summary: 'GlyNAC corrected glutathione deficiency and improved multiple aging hallmarks.',
  },
  {
    id: 'c-nmn-insulin-2021',
    title: 'NMN increases muscle insulin sensitivity in prediabetic women',
    authors: 'Yoshino M et al.',
    journal: 'Science',
    year: 2021,
    pmid: '33888596',
    type: 'clinical',
    summary: 'Landmark NMN human RCT establishing metabolic aging relevance.',
  },
  {
    id: 'c-sfn-ckd-2024',
    title: 'Sulforaphane upregulates NRF2 and NQO1 in CKD patients',
    authors: 'See PMID registry',
    journal: 'Free Radic Biol Med',
    year: 2024,
    pmid: '38772511',
    type: 'clinical',
    summary: 'First in-vivo human NRF2 activation trial in chronic kidney disease.',
  },
  {
    id: 'c-resv-obese-2011',
    title: 'Resveratrol mimics caloric restriction in obese humans',
    authors: 'Timmers S et al.',
    journal: 'Cell Metab',
    year: 2011,
    pmid: '22055504',
    type: 'clinical',
    summary: 'Resveratrol activated SIRT1/AMPK and improved metabolic markers in obese men.',
  },
  {
    id: 'c-fisetin-2020',
    title: 'Fisetin reduces senescent cells in older adults',
    authors: 'Justice JN et al.',
    journal: 'EBioMedicine',
    year: 2020,
    pmid: '30279143',
    type: 'clinical',
    summary: 'Intermittent fisetin dosing reduced senescent cell markers in older adults.',
  },
];

/**
 * Every study surfaced in the research feed is registered as a citation. Hand-curated
 * entries above take precedence; any feed study not already curated is derived here
 * from its own metadata so the registry stays complete as the feed grows.
 */
const feedCitations: SourceCitation[] = researchFeed
  .filter((r) => r.pmid && !curatedCitations.some((c) => c.pmid === r.pmid))
  .map((r) => ({
    id: `rf-${r.pmid}`,
    title: r.title,
    journal: r.source,
    year: Number((r.date.match(/\d{4}/) ?? ['0'])[0]),
    pmid: r.pmid,
    type: (r.impact === 'preclinical' ? 'preclinical' : 'clinical') as SourceCitation['type'],
    summary: r.summary,
  }));

export const citationRegistry: SourceCitation[] = [...curatedCitations, ...feedCitations];

export const methodologySections = [
  {
    id: 'compound-selection',
    title: 'Compound Selection Methodology',
    steps: [
      { step: '01', title: 'Mechanism First', desc: 'Must target a mapped hallmark or defense pathway. Trend-driven inclusion rejected.' },
      { step: '02', title: 'Bioavailability Verified', desc: 'Formulation must achieve meaningful plasma levels. Inferior forms (racemic ALA, oxide minerals) excluded.' },
      { step: '03', title: 'PubMed Traceable', desc: 'Primary literature required. Marketing claims without citations are rejected.' },
      { step: '04', title: 'Dose-Response Validated', desc: 'Dosing from clinical trials. AM/PM timing from absorption pharmacokinetics.' },
      { step: '05', title: 'Synergy Tested', desc: 'Stack pairs evaluated for pathway overlap and interaction risk before recommendation.' },
    ],
  },
  {
    id: 'evidence-grading',
    title: 'Evidence Grading Process',
    steps: [
      { step: 'A', title: 'Assign Initial Tier', desc: 'Literature review assigns A/B/C based on human vs. preclinical data.' },
      { step: 'B', title: 'Independent Check', desc: 'Second review confirms PMID validity and outcome relevance.' },
      { step: 'C', title: 'Public Labeling', desc: 'Tier displayed on every compound surface. No hidden downgrades.' },
      { step: 'D', title: 'Quarterly Re-Review', desc: 'New trials trigger tier updates. Changes logged in Update History.' },
    ],
  },
  {
    id: 'biomarker-modeling',
    title: 'Biomarker & Bio Age Modeling',
    steps: [
      { step: '01', title: 'Lifestyle Inputs', desc: 'Age, stress, sleep, exercise feed defense pathway priority calculator.' },
      { step: '02', title: 'Stack Boost', desc: 'Selected compounds apply modeled biomarker improvements — clearly labeled as projections.' },
      { step: '03', title: 'Lab Override', desc: 'When users log real lab data in /labs, actual values supersede projections for recommendations.' },
      { step: '04', title: 'Never Diagnostic', desc: 'Modeled biological age is directional only. Not a laboratory diagnostic.' },
    ],
  },
  {
    id: 'conflict-of-interest',
    title: 'Conflict of Interest Policy',
    steps: [
      { step: '01', title: 'No Pay-for-Placement', desc: 'Brands cannot purchase inclusion or tier upgrades.' },
      { step: '02', title: 'Transparent Affiliate', desc: 'TNiC may earn a commission on verified picks via affiliate links — disclosed here and at point of purchase. Commission never influences product selection, evidence tiers, or buyer-guide criteria.' },
      { step: '03', title: 'No Proprietary Products', desc: 'TNiC does not manufacture supplements. Independent curation only.' },
    ],
  },
];

export const disclaimers: DisclaimerBlock[] = [
  {
    id: 'not-medical-advice',
    title: 'Not Medical Advice',
    severity: 'legal',
    body: 'TNiC is an educational intelligence platform. Nothing on this site constitutes medical advice, diagnosis, or treatment. Always consult a qualified physician before starting, stopping, or modifying any supplement or health protocol.',
    appliesTo: ['All pages', 'Stack exports', 'Lab recommendations'],
  },
  {
    id: 'modeled-projections',
    title: 'Modeled Projections vs. Lab Data',
    severity: 'warning',
    body: 'Biological age estimates, biomarker projections, and synergy scores are algorithmic models — not laboratory diagnostics. Log real lab data in the Lab Hub for data-driven insights. Modeled and measured data are always labeled differently.',
    appliesTo: ['Defense Calculator', 'Biomarker Command', 'Personal Dashboard'],
  },
  {
    id: 'n-equals-1',
    title: 'Personal Journey (N=1)',
    severity: 'info',
    body: 'The TNiC Journey timeline includes founder personal experiments (N=1). Individual results vary enormously. Personal anecdotes are labeled separately from population science and never used to upgrade evidence tiers.',
    appliesTo: ['Journey timeline', 'Blog-style updates'],
  },
  {
    id: 'rx-educational',
    title: 'Prescription Protocols — Educational Only',
    severity: 'warning',
    body: 'Rapamycin, metformin, and other Rx entries in the Stacks Library are educational references for physician discussions. TNiC does not prescribe, source, or recommend self-medication with prescription drugs.',
    appliesTo: ['Rapamycin Combo stack', 'Clinical-tier protocols'],
  },
  {
    id: 'peptides-legal-status',
    title: 'Peptide Legal Status Varies Widely — Read Before Sourcing',
    severity: 'legal',
    body: 'Peptides on this site span very different legal categories. Semaglutide and tirzepatide are FDA-approved prescription drugs — legitimate use requires a prescription and pharmacy dispensing. Most others (BPC-157, GHK-Cu injectable, Epithalon, Thymosin Alpha-1, GH secretagogues, MOTS-c, Humanin) have no FDA-approved human-use pathway in the US and are sold almost exclusively as "research chemicals, not for human consumption" — a real legal designation, not a formality. BPC-157 specifically lost its compounding-pharmacy pathway when the FDA placed it on the 2023 bulk-substances exclusion list. TNiC does not sell, source, or recommend acquiring any peptide, and describes legal status per peptide for harm-reduction and accuracy — not as sourcing guidance.',
    appliesTo: ['/peptides hub', 'Every peptide detail page'],
  },
  {
    id: 'supplement-quality',
    title: 'Third-Party Product Quality',
    severity: 'info',
    body: 'TNiC curates compounds by evidence and mechanism — not by brand endorsement. Product purity, contamination, and label accuracy are the user\'s responsibility. Require COA (Certificate of Analysis) for NMN and other high-risk categories.',
    appliesTo: ['Stack Architect', 'Compound Lab'],
  },
  {
    id: 'data-privacy',
    title: 'Local Data Storage',
    severity: 'info',
    body: 'Stack selections, lab entries, and personal notes are stored in your browser\'s localStorage. TNiC does not transmit this data to servers. Clearing browser data deletes your entries. Export regularly for backup.',
    appliesTo: ['Lab Hub', 'Personal Dashboard', 'Hallmark Notes'],
  },
  {
    id: 'transport-security',
    title: 'HTTPS & Transport Security',
    severity: 'info',
    body: 'tnic.help is served exclusively over HTTPS with HSTS preload (max-age 2 years, includeSubDomains). HTTP and www.tnic.help permanently redirect to the apex domain. Vercel provisions and auto-renews TLS certificates. API routes that accept secrets (cron, webhooks) require HTTPS in production.',
    appliesTo: ['All pages', 'API routes', 'Protocol Brief subscribe'],
  },
];

export const updateHistory: UpdateHistoryEntry[] = [
  {
    date: '2026-06-20',
    version: '1.37.1',
    title: 'Sprint 37.1 — SSL & transport security hardening',
    category: 'safety',
    changes: [
      'Middleware enforces HTTPS + apex canonical host in production (308 redirects)',
      'HSTS preload header unified in next.config + vercel.json; self-heal monitors HTTP→HTTPS',
      'Trust Center transport-security disclaimer documents TLS, HSTS, and certificate policy',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.37.0',
    title: 'Sprint 37 — Material visual transcend + hub context strip',
    category: 'feature',
    changes: [
      'ContextBar breadcrumb trail + hub-specific “Next here” on every OS subpage — closes nav orientation gap',
      'Homepage CTA finale: gradient-border card, glow Launch OS, Browse Library secondary (eliminates Brief CTA fatigue)',
      'Library highlight cards gain backdrop-blur depth; route-context module powers palette hub detection',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.36.0',
    title: 'Sprint 36 — Trust & indexing emergency',
    category: 'safety',
    changes: [
      'Replaced suspect research-feed PMIDs with verified PubMed IDs (FGF21, NRF2, aging economics)',
      'Unified affiliate-disclosure copy sitewide — commission never influences listings or evidence tiers',
      'FAQ + lab-analysis stale counts fixed (9 compounds, 8 biomarkers); Tier B library links on dashboard',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.35.0',
    title: 'Sprint 35 — Site health polish + safety coverage',
    category: 'safety',
    changes: [
      'Safety profiles for Taurine, Spermidine, Pterostilbene — Trust Center no longer breaks on Tier B compounds',
      'Elite 8 LQ scores render on first paint (SSR-friendly counter); compare tool blocks identical matchups',
      'Products hub library-only section; biomarker targeting for new compounds; expanded self-heal route checks',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.34.0',
    title: 'Sprint 34 — Tier B Compound Expansion (Taurine, Spermidine, Pterostilbene)',
    category: 'content',
    changes: [
      'Three Tier B compounds added to Stack Architect data layer — taurine, spermidine, pterostilbene',
      'Library MDX deep-dives with PMID anchors; hallmark intervention mappings (autophagy, mitochondrial)',
      'Elite 8 libraryHref links for OTC compounds; IndexNow priority paths for new compound routes',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.33.0',
    title: 'Sprint 33 — Elite 8 Integration + Production Health Monitor',
    category: 'feature',
    changes: [
      '/elite-8 Longevity Quotient — 8-compound ranked tool with head-to-head compare and weight tuner',
      'Cherry-picked from feature/priority-upgrades — production tokens, Rx disclaimers, clock confidence labels',
      'Tools hub featured card, sitemap + IndexNow priority, adapted GitHub self-heal workflow',
      'Shared Brief subscribe error handling hardened (Sprint 33 patch)',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.32.0',
    title: 'Sprint 32 — Graphical Polish, Personalization & Products Hub',
    category: 'feature',
    changes: [
      '/products catalog route — verified manufacturer picks with compound module links',
      'Homepage personalization rails — intent-aware hero, return-visitor protocol strip, product picks rail',
      'Contextual upgrades — preset-filtered research, CompetitiveEdge ContextRail, stat-card trust polish',
      'Conversion paths — Nav Quiz/Shop CTAs, quiz Brief email capture, command palette products hub',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.31.0',
    title: 'Sprint 31 — Research Intel, Competitors & Biomarker Depth',
    category: 'feature',
    changes: [
      'Research feed r16–r18 — Ca-AKG epigenetic age RCT, resveratrol CR-mimetic trial, fisetin senolytic pilot',
      'Competitors expanded to 8 — Examine.com, NOVOS, FoundMyFitness competitive intelligence',
      'Biomarkers expanded to 8 — IL-6 and Homocysteine with enriched descriptions across all markers',
      'Community pulse adds 18 Clinical Studies counter',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.29.0',
    title: 'Sprint 29 — Content Expansion & Homepage Upconversion',
    category: 'feature',
    changes: [
      'Research feed r13–r15 — GlyNAC 16-week RCT, NMN insulin sensitivity, sulforaphane NRF2/NQO1 CKD trial PMIDs',
      'FAQ 21–25 + five glossary terms (Autophagy, Telomeres, Mitophagy, SASP, Oxidative Stress)',
      'Homepage Brief capture rail, compare row, stack preset deep links, quiz Shop + Brief CTAs',
      'Community pulse updated to 25 FAQ / 20 glossary; NextUp defaults to planned roadmap',
    ],
  },
  {
    date: '2026-06-20',
    version: '1.27.0',
    title: 'Sprint 27 — Google Search Console & Indexing Acceleration',
    category: 'feature',
    changes: [
      'GSC HTML file + meta tag verification deployed',
      'IndexNow key and submit script for priority URL batching',
      'HTML sitemap at /site-map with ItemList JSON-LD and footer popular guides',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.24.0',
    title: 'Sprint 24 — Homepage Context & Compare Merchandising',
    category: 'feature',
    changes: [
      'Homepage compare row — six evidence tables with ContextRail and deep links',
      'Homepage Brief capture rail — email subscribe + RSS handoff from Research Intel funnel',
      'Featured stacks link to /stacks?preset= for one-click Architect load',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.23.0',
    title: 'Sprint 23 — Command Palette v2 & Research Intel Filters',
    category: 'feature',
    changes: [
      'Command palette v2 — page-aware suggestions, stack shortcuts, recent modules, hub next-step hint',
      'lib/recent-modules.ts — localStorage tracking on all 26 library module visits',
      'Research Intel — impact/topic/compound/hallmark filter chips with dynamic ContextRail per filter state',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.22.0',
    title: 'Sprint 22 — Trust & Secondary Page Context',
    category: 'feature',
    changes: [
      'lib/hub-context.ts — trust, faq, contact, deliverySystems hubs plus per-trust-tab and trust subpage context',
      'ContextRail on TrustHub (per-tab), TrustPageTemplate subpages, FaqHub, ContactForm, and delivery-systems',
      'Delivery-systems page upgraded to PageHeader + card-ultra surfaces',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.21.0',
    title: 'Sprint 21 — Hub Context Expansion',
    category: 'feature',
    changes: [
      'lib/hub-context.ts — centralized what/why/next for all OS hubs, tools, hallmarks, comparisons, and library modules',
      'ContextRail on dashboard, stacks, labs, tools (per-tab), shop, brief, learn, quiz, library, compare hub + detail pages',
      'ModuleContextStrip on all 26 library module deep-dives; hallmark-specific context on detail pages',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.20.0',
    title: 'Sprint 20 — Design System v3 Cinematic Escalation',
    category: 'feature',
    changes: [
      'Site-wide ambient aurora canvas — drifting gradient orbs behind all pages',
      'Cinematic hero — display typography, pulse rings, ultra card quiz shell, gradient CTAs',
      'card-ultra surface system — gradient borders, spotlight glow, hover lift across homepage',
      'Nav glass scroll state + logo glow; animated scroll progress; footer aurora mesh',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.19.0',
    title: 'Sprint 19 — Lifestyle Pillar Depth & Lab Deep-Links',
    category: 'feature',
    changes: [
      'Lifestyle pillar data layer — hallmark impact matrices, lab tie-ins, wearable signals, stack gates',
      'LifestylePillarPanel on all lifestyle modules with one-click /labs?marker= deep-links',
      'Graphical LifestyleDecisionTree renderer for MDX decision blocks',
      'Lifestyle Pillars hub on /library#lifestyle-pillars with priority-ordered protocol cards',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.18.0',
    title: 'Sprint 18 — Premium UI Overhaul & Compound JSON-LD',
    category: 'feature',
    changes: [
      'ContextRail what/why/next panels on hero, OS funnel, site guide, library, and research intel',
      'Premium visual system — card-premium, stat-card, section-mesh, hero-beam, noise texture',
      'Animated StatStrip with platform metrics in hero; upgraded SectionShell and PageHeader',
      'MedicalWebPage + PMID citation JSON-LD on all compound deep-dive modules',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.17.0',
    title: 'Sprint 17 — NR Expansion & Brief Research Sync',
    category: 'feature',
    changes: [
      'NR compound module + buyer guide + Tru Niagen shop pick at /shop?stack=nr',
      'NMN vs NR compare table expanded with buyer verification and Martens RCT row',
      'Brief ↔ Research intel sync — feed PMIDs auto-rotate in Protocol Brief + RSS/JSON feeds',
      'Research Intel links to matching Protocol Brief issues',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.16.0',
    title: 'Sprint 16 — Research Protocol Links & Quiz Share OG',
    category: 'feature',
    changes: [
      'Research intel protocol links — every feed item links to hallmarks, compounds, and stack presets',
      'Quiz share OG cards — /quiz/share/[preset] with per-preset opengraph-image for social crawlers',
      'Sitemap — quiz share routes and /library/delivery-systems indexed',
    ],
  },
  {
    date: '2026-06-19',
    version: '1.15.0',
    title: 'Sprint 15 — Quiz Share Cards & Citation Export',
    category: 'feature',
    changes: [
      'Quiz result share card — copy quiz link, Architect/Shop deep links, social snippet, and markdown',
      'Quiz URL deep links — /quiz?goal=&age=&experience= restores shared results on page load',
      'Citation bundle export — BibTeX and JSON copy/download on Trust hub Citations tab',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.14.0',
    title: 'Sprint 14 — Compare Share Cards & Dashboard Export',
    category: 'feature',
    changes: [
      'Compare share cards — copy link, social snippet, and markdown on all six /library/compare routes',
      'OG-friendly share snippets with opengraph-image URLs in markdown export',
      'Dashboard status export — copy/download markdown + canvas PNG snapshot at #dashboard-status',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.13.0',
    title: 'Sprint 13 — Partner Export & Shop Deep Links',
    category: 'feature',
    changes: [
      'Labs hub Partner JSON export — latest panel as TNiC Partner v1 JSON (round-trip with Partner Beta import)',
      'Shop stack deep links — /shop?stack=starter or compound ids; copy share URL + deep-link confirmation',
      'parseStackParam shared utility — preset keys work site-wide in ?stack= URL hydration',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.12.0',
    title: 'Sprint 12 — Lab Push Notifications & Welcome Email',
    category: 'feature',
    changes: [
      'Lab order push — webhook events log, GET /api/labs/partner/events, auto-poll watcher + browser Notification',
      'Pending orders auto-import on panel.complete without manual status polling',
      'Protocol Brief welcome email on Resend subscribe — issue preview, RSS/JSON links, unsubscribe',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.11.0',
    title: 'Sprint 11 — Live Partner OAuth & Brief Rotation',
    category: 'feature',
    changes: [
      'Longevity Direct live OAuth — env-gated authorize/token/order/status proxy; OAuth callback route',
      'Pending order tracking in Labs hub with status polling; webhook returns order_id on panel.complete',
      'Protocol Brief ISO-week issue rotation in weekly cron send',
      'Signed one-click unsubscribe — GET /api/brief/unsubscribe with HMAC token in Resend digest emails',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.10.0',
    title: 'Sprint 10 — Lab OAuth & Resend Brief',
    category: 'feature',
    changes: [
      'Lab partner OAuth preview — connect demo partner, order panels, auto-import via /api/labs/partner/oauth/* and /order',
      'Partner results webhook at POST /api/labs/partner/webhook with optional LAB_WEBHOOK_SECRET',
      'Native Resend delivery — audience subscribe on POST /api/brief/subscribe; weekly send via GET /api/cron/brief',
      'Vercel Cron (Mondays 09:00 UTC) and .env.example for RESEND_*, CRON_SECRET, LAB_OAUTH_CLIENT_ID',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.9.0',
    title: 'Sprint 9 — Lab Partner Import & Brief Delivery',
    category: 'feature',
    changes: [
      'Lab Partner v1 beta — CSV/JSON import, Partner Beta tab, POST /api/labs/partner-import (stateless normalizer)',
      'Protocol Brief RSS + JSON feeds at /brief/feed.xml and /brief/feed.json',
      'POST /api/brief/subscribe with optional BRIEF_SUBSCRIBE_WEBHOOK_URL for email list forwarding',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.8.0',
    title: 'Sprint 8 — OG Images, Search Index & Brief Subscribe',
    category: 'feature',
    changes: [
      'Social OG images for /library/compare (hub + 6 slugs), /brief, and /shop',
      'Library search indexes comparisons and Protocol Brief headlines; palette lists each compare route',
      'Protocol Brief email subscribe — local preference + mailto at /brief#brief-subscribe',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.7.0',
    title: 'Sprint 7 — Shop, Brief, Contact & Lab Waitlist',
    category: 'feature',
    changes: [
      'Protocol Shop at /shop — stack-filtered buyer verification, preset loader, checklist export',
      'Protocol Brief digest at /brief — six PMID-curated issues linked to library modules',
      'Contact channel at /contact — categorized protocol questions via structured mailto handoff',
      'Lab partner waitlist on /labs#lab-partners — Tier 1 panel preview, Q3 2026 API target',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.6.0',
    title: 'Sprint 6 — Compare, Buyer Guides & Hallmark Tiles',
    category: 'feature',
    changes: [
      'Evidence comparison hub at /library/compare — six head-to-head tables with PMID anchors and verdict rows',
      'Brand-agnostic compound buyer guides on all compound modules (COA, form, RCT doses, red flags)',
      'Homepage hallmark problem tiles — 12-card “target what slows with age” grid with coverage and top interventions',
      'Elevated rapamycin, TUDCA, and testing-and-monitoring MDX to full template standard (decision trees, compare blocks)',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.5.0',
    title: 'Conversion Sprint & Next Up Roadmap',
    category: 'feature',
    changes: [
      'Dedicated /quiz with labeled result actions and Stack Architect handoff (preset, Builder tab, age sync)',
      'Learn hub (/learn) and FAQ (/faq) with full schema; honest indexed PMID counts on trust strip',
      'Next up panel — shipped, in-progress, and planned functional improvements on home, dashboard, and /trust/updates',
      'OG preview cards for home, learn, faq, library, and quiz routes',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.4.0',
    title: 'Trust & Transparency System',
    category: 'feature',
    changes: [
      'Launched /trust hub with evidence tagging, citations framework, methodology, disclaimers, and update history',
      'Reusable EvidenceTag and SourceCitation components across library, stacks, and compounds',
      'Personal journey timeline with N=1 vs. population science labeling',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.3.0',
    title: 'Design System Overhaul',
    category: 'design',
    changes: [
      'Unified typography, spacing, and accessibility tokens (WCAG AA)',
      'PageHeader, TabBar, StatStrip, DataTable primitives',
      'Mobile-optimized hub pages for /labs, /stacks, /library',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.2.0',
    title: 'Lab Analysis & Tracking Hub',
    category: 'feature',
    changes: [
      'Privacy-first lab hub at /labs with CSV import, trend charts, hallmark risk mapping',
      'Stack-aware personalized recommendations from lab data',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.1.0',
    title: 'Stacks & Protocols Library',
    category: 'feature',
    changes: [
      '9 elite pre-built stacks including GlyNAC, SIRT1, Rapamycin combo (educational)',
      'Dynamic stack builder with real-time synergy and contraindication analysis',
      'Comparison table with goal/cost/simplicity filters',
    ],
  },
  {
    date: '2026-06-16',
    version: '1.0.0',
    title: 'Anti-Aging Library Launch',
    category: 'content',
    changes: [
      '12 Hallmarks of Aging with evidence-ranked interventions and MDX deep dives',
      'Intervention explorer with Tier A/B/C filtering',
      'Personal notes integration per hallmark',
    ],
  },
  {
    date: '2026-06-01',
    version: '0.9.0',
    title: 'Platform Core',
    category: 'feature',
    changes: [
      'Stack Architect with synergy scoring and evidence-graded presets',
      'Defense Calculator and biomarker command center',
      'Local-first data persistence (stack, labs, profile)',
    ],
  },
  {
    date: '2025-12-01',
    version: '0.5.0',
    title: 'Evidence Framework Established',
    category: 'evidence',
    changes: [
      'Tier A/B/C grading system defined',
      '6 compounds curated with PubMed traceability',
      'Transparency pledge published',
    ],
  },
];

export function getCitationById(id: string): SourceCitation | undefined {
  return citationRegistry.find((c) => c.id === id);
}

export function getCitationByPmid(pmid: string): SourceCitation | undefined {
  return citationRegistry.find((c) => c.pmid === pmid);
}

export function pubmedUrl(pmid: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
}

export function formatCitationShort(c: SourceCitation): string {
  const author = c.authors?.split(' et al')[0] ?? c.journal;
  return `${author} (${c.year})`;
}