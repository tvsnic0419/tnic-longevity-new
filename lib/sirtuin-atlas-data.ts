export type SirtuinId = 'SIRT1' | 'SIRT2' | 'SIRT3' | 'SIRT4' | 'SIRT5' | 'SIRT6' | 'SIRT7';
export type TargetMode = 'direct' | 'nad' | 'expression' | 'uncertain';
export type Availability = 'consumer' | 'rx' | 'research';
export type EvidenceStage = 'human-target' | 'human-pathway' | 'human-nad' | 'preclinical-direct' | 'preclinical-indirect';

export interface AtlasCitation {
  pmid: string;
  label: string;
  year: number;
  url: string;
}

export interface SirtuinProfile {
  id: SirtuinId;
  location: string;
  shorthand: string;
  color: string;
  jobs: string[];
  strongestLever: string;
  evidenceBoundary: string;
}

export interface SirtuinTarget {
  sirtuin: SirtuinId;
  mode: TargetMode;
  confidence: 'high' | 'moderate' | 'low';
  note: string;
}

export interface SirtuinCandidate {
  id: string;
  name: string;
  category: string;
  availability: Availability;
  evidenceStage: EvidenceStage;
  score: number;
  verdict: string;
  humanEvidence: string;
  caveat: string;
  targets: SirtuinTarget[];
  citations: AtlasCitation[];
}

const pubmed = (pmid: string, label: string, year: number): AtlasCitation => ({
  pmid,
  label,
  year,
  url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
});

export const SIRTUINS: SirtuinProfile[] = [
  {
    id: 'SIRT1',
    location: 'Nucleus ↔ cytosol',
    shorthand: 'Metabolic + stress-response coordinator',
    color: '#22d3ee',
    jobs: ['PGC-1α / mitochondrial biogenesis', 'FOXO stress signaling', 'NF-κB inflammatory restraint', 'DNA repair and circadian control'],
    strongestLever: 'SRT2104 has human pharmacology as a research SIRT1 activator. For consumer compounds, NAD+ precursors are the cleanest substrate-support strategy.',
    evidenceBoundary: 'Resveratrol is not a universally direct SIRT1 switch. Activation is substrate-dependent in biochemical work, while the 2025 RCT meta-analysis found no significant overall increase in human SIRT1 gene, protein, or serum measures.',
  },
  {
    id: 'SIRT2',
    location: 'Cytosol ↔ nucleus',
    shorthand: 'Cell-cycle + proteostasis regulator',
    color: '#a78bfa',
    jobs: ['α-tubulin deacetylation', 'Cell-cycle control', 'Genome stability', 'Redox / stress adaptation'],
    strongestLever: 'Resveratrol can enhance SIRT2 activity against specific substrates in purified-enzyme and cell experiments.',
    evidenceBoundary: 'There is no convincing selective OTC SIRT2 activator with replicated human target-engagement data. SIRT2 biology is context-dependent, and inhibition is also actively studied.',
  },
  {
    id: 'SIRT3',
    location: 'Mitochondria',
    shorthand: 'Mitochondrial deacetylation hub',
    color: '#34d399',
    jobs: ['SOD2 / redox defense', 'Electron transport chain regulation', 'Fatty-acid oxidation', 'Mitochondrial protein quality control'],
    strongestLever: 'Honokiol is the best-known natural direct SIRT3 activator in preclinical models; NR/NMN can support SIRT3 indirectly by restoring NAD+ availability.',
    evidenceBoundary: 'Honokiol has strong mechanistic and animal evidence but no robust human trial showing selective SIRT3 activation and anti-aging benefit.',
  },
  {
    id: 'SIRT4',
    location: 'Mitochondria',
    shorthand: 'Nutrient-routing + metabolic brake',
    color: '#f59e0b',
    jobs: ['Glutamine metabolism', 'Insulin secretion', 'Fatty-acid handling', 'Mitochondrial stress signaling'],
    strongestLever: 'Maintain NAD+ availability; no selective consumer activator is established.',
    evidenceBoundary: 'SIRT4 is comparatively under-drugged. Current literature is dominated by genetic and disease-mechanism studies rather than validated activator pharmacology.',
  },
  {
    id: 'SIRT5',
    location: 'Mitochondria > cytosol',
    shorthand: 'Desuccinylation + metabolic enzyme control',
    color: '#fb7185',
    jobs: ['Lysine desuccinylation', 'Urea-cycle control', 'Fatty-acid oxidation', 'Respiratory-chain regulation'],
    strongestLever: 'NR is unusually interesting here: a 2023 biochemical study reported NR as a SIRT5-selective allosteric activator in vitro.',
    evidenceBoundary: 'That SIRT5-specific NR effect has not been established as meaningful target engagement in human supplementation trials.',
  },
  {
    id: 'SIRT6',
    location: 'Nucleus',
    shorthand: 'Genome-maintenance specialist',
    color: '#60a5fa',
    jobs: ['H3K9/H3K56 deacylation', 'DNA double-strand break repair', 'Telomere / genome stability', 'Inflammatory and glucose regulation'],
    strongestLever: 'MDL-800 is a potent research-only allosteric activator. Among natural compounds, cyanidin is a striking in-vitro activator.',
    evidenceBoundary: 'Neither MDL-800 nor cyanidin has human anti-aging target-engagement evidence sufficient to call SIRT6 pharmacologically solved.',
  },
  {
    id: 'SIRT7',
    location: 'Nucleolus / nucleus',
    shorthand: 'Ribosome + genome-stability regulator',
    color: '#f472b6',
    jobs: ['rDNA transcription / ribosome biogenesis', 'Chromatin regulation', 'DNA repair', 'Stress and metabolic adaptation'],
    strongestLever: 'General NAD+ sufficiency is biologically relevant, but no selective supplement activator is established.',
    evidenceBoundary: 'SIRT7 remains one of the least tractable sirtuins pharmacologically. Claims of a dependable OTC SIRT7 activator are ahead of the evidence.',
  },
];

const ALL_SIRTS: SirtuinId[] = ['SIRT1', 'SIRT2', 'SIRT3', 'SIRT4', 'SIRT5', 'SIRT6', 'SIRT7'];

export const SIRTUIN_CANDIDATES: SirtuinCandidate[] = [
  {
    id: 'nr',
    name: 'Nicotinamide riboside (NR)',
    category: 'NAD+ precursor',
    availability: 'consumer',
    evidenceStage: 'human-nad',
    score: 88,
    verdict: 'Best-supported broad sirtuin substrate support; intriguing direct SIRT5 signal.',
    humanEvidence: 'Oral NR reliably raises NAD+ in multiple human studies. Human immune-cell work also supports SIRT3-dependent biology, while a 2023 biochemical paper identified direct allosteric activation of SIRT5.',
    caveat: 'Raising NAD+ is not the same as selectively activating every sirtuin, and clinical anti-aging outcomes are not established.',
    targets: [
      ...ALL_SIRTS.map((sirtuin) => ({ sirtuin, mode: 'nad' as const, confidence: 'high' as const, note: 'NAD+ substrate support' })),
      { sirtuin: 'SIRT5', mode: 'direct', confidence: 'moderate', note: 'Allosteric activation reported in vitro' },
      { sirtuin: 'SIRT3', mode: 'expression', confidence: 'moderate', note: 'Human translational SIRT3-dependent signaling' },
    ],
    citations: [
      pubmed('37289138', 'NR activates SIRT5 deacetylation', 2023),
      pubmed('38474420', 'NR and SIRT3-mediated signaling in human macrophages', 2024),
      pubmed('41357333', 'NR raises NAD+ in a randomized human trial', 2025),
    ],
  },
  {
    id: 'nmn',
    name: 'Nicotinamide mononucleotide (NMN)',
    category: 'NAD+ precursor',
    availability: 'consumer',
    evidenceStage: 'human-nad',
    score: 84,
    verdict: 'Strong NAD+ restoration lever; family-wide support rather than a direct selective activator.',
    humanEvidence: 'Human supplementation studies show increased circulating NMN/NAD+ and metabolic signals. Sirtuin activation is usually inferred from greater NAD+ availability rather than directly measured target engagement.',
    caveat: 'NMN does not “activate resveratrol,” and resveratrol is not required for NMN to raise NAD+. The often-cited 2021 insulin-sensitivity RCT also drew a published critique about baseline liver-fat imbalance, so that clinical signal should not be treated as settled proof.',
    targets: ALL_SIRTS.map((sirtuin) => ({ sirtuin, mode: 'nad' as const, confidence: 'high' as const, note: 'NAD+ substrate support' })),
    citations: [
      pubmed('37344088', 'NMN intake raises plasma NMN and NAD+', 2023),
      pubmed('33888596', 'NMN insulin-sensitivity randomized trial', 2021),
      pubmed('34326206', 'Published critique of the NMN insulin-sensitivity trial', 2021),
      pubmed('36499074', 'NMN / NAD+ / SIRT3 pathway in senescent cells', 2022),
    ],
  },
  {
    id: 'resveratrol',
    name: 'Trans-resveratrol',
    category: 'Polyphenol / STAC candidate',
    availability: 'consumer',
    evidenceStage: 'human-pathway',
    score: 62,
    verdict: 'Real sirtuin biology, but much messier than “direct SIRT1 activator” marketing implies.',
    humanEvidence: 'Some individual trials report higher circulating or cellular SIRT1. However, a 2025 meta-analysis of 11 RCTs found no significant overall effect on SIRT1 gene expression, protein expression, or serum levels.',
    caveat: 'Biochemical activation is substrate-dependent, and earlier native-substrate studies found no universal direct SIRT1 activation. It should be labeled “mixed / substrate-dependent,” not “proven SIRT1 switch.”',
    targets: [
      { sirtuin: 'SIRT1', mode: 'direct', confidence: 'moderate', note: 'Substrate-dependent allosteric activation; human expression evidence mixed' },
      { sirtuin: 'SIRT2', mode: 'direct', confidence: 'low', note: 'Purified-enzyme and cell evidence' },
    ],
    citations: [
      pubmed('40158656', '2025 meta-analysis of resveratrol and human SIRT1', 2025),
      pubmed('23471411', 'Common allosteric mechanism for SIRT1 STACs', 2013),
      pubmed('20061378', 'Native-substrate challenge to direct SIRT1 activation', 2010),
      pubmed('29125735', 'Resveratrol activates SIRT2 against Prx1', 2017),
    ],
  },
  {
    id: 'honokiol',
    name: 'Honokiol',
    category: 'Magnolia lignan',
    availability: 'consumer',
    evidenceStage: 'preclinical-direct',
    score: 48,
    verdict: 'Most compelling natural SIRT3-directed candidate, still preclinical for target engagement.',
    humanEvidence: 'The strongest evidence is biochemical, cellular, and animal. Honokiol increases SIRT3 expression/activity and reduces acetylation of mitochondrial SIRT3 substrates in multiple models.',
    caveat: 'No high-quality human trial has yet shown selective SIRT3 activation with clinically meaningful aging outcomes.',
    targets: [{ sirtuin: 'SIRT3', mode: 'direct', confidence: 'moderate', note: 'Binding/activity plus SIRT3-dependent animal effects' }],
    citations: [
      pubmed('25871545', 'Honokiol activates mitochondrial SIRT3', 2015),
      pubmed('40590114', '2025 review of honokiol targeting SIRT3', 2025),
    ],
  },
  {
    id: 'cyanidin',
    name: 'Cyanidin / anthocyanidins',
    category: 'Anthocyanidin',
    availability: 'consumer',
    evidenceStage: 'preclinical-direct',
    score: 36,
    verdict: 'A fascinating SIRT6 lead, not a clinically validated SIRT6 intervention.',
    humanEvidence: 'In vitro screening found cyanidin to be the strongest natural SIRT6 activator tested, producing a large activity increase and increasing SIRT6 expression in Caco-2 cells.',
    caveat: 'Cell-free and cell-culture potency does not establish oral human target engagement, optimal dosing, or longevity benefit.',
    targets: [{ sirtuin: 'SIRT6', mode: 'direct', confidence: 'low', note: 'Strong in-vitro activation signal' }],
    citations: [pubmed('29515203', 'Natural polyphenols as SIRT6 modulators', 2018)],
  },
  {
    id: 'curcumin',
    name: 'Curcumin',
    category: 'Polyphenol signaling modulator',
    availability: 'consumer',
    evidenceStage: 'preclinical-indirect',
    score: 30,
    verdict: 'Potential SIRT1/SIRT3 expression-signaling modulator; not a clean direct activator.',
    humanEvidence: 'Most sirtuin-specific claims come from preclinical pathway studies and reviews rather than direct human enzyme target engagement.',
    caveat: 'Broad pleiotropy makes it difficult to assign clinical effects specifically to a sirtuin mechanism.',
    targets: [
      { sirtuin: 'SIRT1', mode: 'expression', confidence: 'low', note: 'Preclinical signaling/expression' },
      { sirtuin: 'SIRT3', mode: 'expression', confidence: 'low', note: 'Preclinical signaling/expression' },
    ],
    citations: [pubmed('37630770', 'Natural phytochemicals as SIRT activators', 2023)],
  },
  {
    id: 'berberine',
    name: 'Berberine',
    category: 'AMPK / metabolic signaling',
    availability: 'consumer',
    evidenceStage: 'preclinical-indirect',
    score: 28,
    verdict: 'Indirect SIRT1-axis candidate, primarily through upstream metabolic signaling.',
    humanEvidence: 'SIRT1 is a plausible downstream node, but direct human SIRT1 activation is not established as the main mechanism of berberine.',
    caveat: 'Treat this as pathway modulation, not as a selective SIRT1 agonist.',
    targets: [{ sirtuin: 'SIRT1', mode: 'expression', confidence: 'low', note: 'Indirect AMPK/SIRT1 signaling' }],
    citations: [pubmed('37630770', 'Natural phytochemicals as SIRT activators', 2023)],
  },
  {
    id: 'pterostilbene',
    name: 'Pterostilbene',
    category: 'Stilbene',
    availability: 'consumer',
    evidenceStage: 'human-pathway',
    score: 24,
    verdict: 'More bioavailable than resveratrol, but weaker direct evidence for reliable human SIRT1 activation.',
    humanEvidence: 'Human NR + pterostilbene studies demonstrate NAD+ changes and safety signals, not proof that pterostilbene itself directly activates SIRT1 in humans.',
    caveat: 'Higher bioavailability does not automatically mean stronger or better-validated SIRT1 target engagement.',
    targets: [{ sirtuin: 'SIRT1', mode: 'uncertain', confidence: 'low', note: 'Often marketed as STAC; human target engagement unproven' }],
    citations: [pubmed('32791973', 'NR + pterostilbene randomized AKI safety study', 2020)],
  },
  {
    id: 'metformin',
    name: 'Metformin',
    category: 'AMPK-linked prescription drug',
    availability: 'rx',
    evidenceStage: 'human-pathway',
    score: 57,
    verdict: 'Human evidence can show higher SIRT1 activity, but the mechanism is indirect rather than a clean SIRT1-binding agonist.',
    humanEvidence: 'A randomized placebo-controlled trial in people with prediabetes measured PBMC longevity-pathway markers and found metformin increased AMPK activation and SIRT1 activity alongside other signaling changes.',
    caveat: 'This does not make metformin a selective SIRT1 activator or establish an anti-aging indication. It is a prescription drug whose risk-benefit depends on the clinical context.',
    targets: [{ sirtuin: 'SIRT1', mode: 'expression', confidence: 'moderate', note: 'Human AMPK–SIRT1 pathway activation; indirect pharmacology' }],
    citations: [pubmed('25921843', 'Metformin and SIRT1 activity in a randomized human trial', 2015)],
  },
  {
    id: 'quercetin',
    name: 'Quercetin / isoquercetin',
    category: 'Flavonoid SIRT6 modulator',
    availability: 'consumer',
    evidenceStage: 'preclinical-direct',
    score: 39,
    verdict: 'Structurally validated SIRT6 allosteric modulation, with isoquercetin showing greater site selectivity in vitro.',
    humanEvidence: 'Structural and biochemical work shows quercetin can activate SIRT6 through an isoform-specific allosteric site; isoquercetin can discriminate the activating site more selectively.',
    caveat: 'Quercetin can activate or inhibit SIRT6 depending on compound, concentration and assay context. Oral human SIRT6 target engagement has not been established.',
    targets: [
      { sirtuin: 'SIRT6', mode: 'direct', confidence: 'moderate', note: 'Structural and biochemical allosteric activation; concentration dependent' },
      { sirtuin: 'SIRT1', mode: 'expression', confidence: 'low', note: 'Preclinical signaling claims; not validated selective activation' },
    ],
    citations: [
      pubmed('31844103', 'Structural basis of SIRT6 activation by quercetin derivatives', 2019),
      pubmed('26607666', 'Quercetin and luteolin show concentration-dependent SIRT6 modulation', 2015),
    ],
  },
  {
    id: 'srt2104',
    name: 'SRT2104',
    category: 'Selective SIRT1 research drug',
    availability: 'research',
    evidenceStage: 'human-target',
    score: 91,
    verdict: 'The strongest human-tested selective SIRT1 pharmacology in this atlas.',
    humanEvidence: 'Phase I/II studies in older adults, healthy volunteers, psoriasis, diabetes and inflammatory challenge show oral exposure and biological effects consistent with SIRT1 activation, though efficacy has varied by endpoint.',
    caveat: 'Research drug, not a supplement and not an approved anti-aging therapy.',
    targets: [{ sirtuin: 'SIRT1', mode: 'direct', confidence: 'high', note: 'Human-tested selective activator' }],
    citations: [
      pubmed('23284689', 'SRT2104 phase I trial in elderly volunteers', 2013),
      pubmed('25978169', 'SRT2104 reduces endotoxin-induced cytokine release', 2015),
      pubmed('24446723', 'SRT2104 phase II trial in type 2 diabetes', 2014),
    ],
  },
  {
    id: 'mdl800',
    name: 'MDL-800',
    category: 'Selective SIRT6 research activator',
    availability: 'research',
    evidenceStage: 'preclinical-direct',
    score: 68,
    verdict: 'Potent and selective SIRT6 tool compound with convincing allosteric biochemistry.',
    humanEvidence: 'MDL-800 increased SIRT6 deacetylase activity up to ~22-fold in the discovery work and has extensive cell/animal follow-up.',
    caveat: 'No human anti-aging trial; later work also shows off-target biology in some systems, so “SIRT6 activation = benefit” cannot be assumed universally.',
    targets: [{ sirtuin: 'SIRT6', mode: 'direct', confidence: 'high', note: 'Selective allosteric activation in preclinical systems' }],
    citations: [
      pubmed('30374165', 'Identification of cellularly active SIRT6 activator MDL-800', 2018),
      pubmed('40199556', 'MDL-800 off-target metabolic effects in hepatocytes', 2025),
    ],
  },
  {
    id: 'ubcs039',
    name: 'UBCS039',
    category: 'Selective SIRT6 research activator',
    availability: 'research',
    evidenceStage: 'preclinical-direct',
    score: 63,
    verdict: 'A well-established SIRT6 chemical probe with SIRT6-dependent effects across cell and animal models.',
    humanEvidence: 'UBCS039 has been used to pharmacologically activate SIRT6 in mechanistic studies, including SIRT6-dependent autophagy and more recent liver-metabolism models.',
    caveat: 'No human anti-aging target-engagement or safety program establishes UBCS039 as a therapeutic intervention.',
    targets: [{ sirtuin: 'SIRT6', mode: 'direct', confidence: 'high', note: 'Selective pharmacological activation in preclinical systems' }],
    citations: [
      pubmed('30250025', 'UBCS039 pharmacological SIRT6 activation', 2018),
      pubmed('41265217', 'UBCS039 and SIRT6-dependent hepatic lipogenesis', 2026),
    ],
  },
  {
    id: 'dhp35',
    name: '1,4-dihydropyridine SIRT3/5 activators',
    category: 'Research chemical class',
    availability: 'research',
    evidenceStage: 'preclinical-direct',
    score: 56,
    verdict: 'Important proof that SIRT3 and SIRT5 can be directly pharmacologically activated.',
    humanEvidence: 'Biochemical and cellular studies identified pan-sirtuin and isoform-selective activators for SIRT3 and SIRT5.',
    caveat: 'Chemical probes, not consumer products; human safety and efficacy are unknown.',
    targets: [
      { sirtuin: 'SIRT3', mode: 'direct', confidence: 'moderate', note: 'Selective chemical activators in vitro/cells' },
      { sirtuin: 'SIRT5', mode: 'direct', confidence: 'moderate', note: 'Selective chemical activators in vitro/cells' },
    ],
    citations: [pubmed('36228194', 'Potent and specific activators for SIRT3 and SIRT5', 2022)],
  },
];

export const EVIDENCE_STAGE_META: Record<EvidenceStage, {
  label: string;
  short: string;
  description: string;
  rank: number;
}> = {
  'human-target': { label: 'Human target engagement', short: 'HT', description: 'Human pharmacology with direct or selective target evidence.', rank: 5 },
  'human-pathway': { label: 'Human pathway signal', short: 'HP', description: 'Human biological signal consistent with the pathway, without clean selective target proof.', rank: 4 },
  'human-nad': { label: 'Human NAD+ restoration', short: 'HN', description: 'Human evidence for increasing NAD+ substrate availability; family-wide rather than isoform-selective.', rank: 4 },
  'preclinical-direct': { label: 'Preclinical direct', short: 'PD', description: 'Direct enzyme/allosteric activation established in biochemical, cell, or animal systems.', rank: 3 },
  'preclinical-indirect': { label: 'Preclinical indirect', short: 'PI', description: 'Expression or upstream/downstream signaling evidence without clean direct activation.', rank: 2 },
};

export const MODE_LABELS: Record<TargetMode, { short: string; label: string; description: string }> = {
  direct: { short: 'D', label: 'Direct', description: 'Evidence of direct enzyme activation or allosteric stimulation.' },
  nad: { short: 'N', label: 'NAD+', description: 'Raises/provides NAD+, the required sirtuin cosubstrate; not isoform-selective.' },
  expression: { short: 'E', label: 'Expression / signaling', description: 'Changes expression or upstream/downstream pathway signaling rather than clean direct activation.' },
  uncertain: { short: '?', label: 'Uncertain', description: 'Commonly claimed or mechanistically plausible, but target engagement is not established.' },
};

export const CORE_SOURCES: AtlasCitation[] = [
  pubmed('36581622', 'The sirtuin family in health and disease', 2022),
  pubmed('40158656', 'Meta-analysis: resveratrol and human SIRT1', 2025),
  pubmed('37289138', 'NR activates SIRT5 deacetylation', 2023),
  pubmed('25871545', 'Honokiol activates SIRT3', 2015),
  pubmed('29515203', 'Natural polyphenols as SIRT6 modulators', 2018),
  pubmed('30374165', 'MDL-800 as a selective SIRT6 activator', 2018),
  pubmed('31844103', 'Quercetin / isoquercetin SIRT6 structural activation', 2019),
  pubmed('25921843', 'Metformin and human SIRT1 activity', 2015),
  pubmed('23284689', 'SRT2104 in elderly volunteers', 2013),
];
