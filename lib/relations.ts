import type { EvidenceTier } from './types';

export type RelationType = 'amplifies' | 'suppresses' | 'bidirectional' | 'pathway-shared';
export type RelationStrength = 'strong' | 'moderate' | 'weak';

export interface HallmarkRelation {
  id: string;
  from: string;
  to: string;
  type: RelationType;
  strength: RelationStrength;
  mechanism: string;
  evidence: EvidenceTier;
  keyMolecules: string[];
}

export interface PathwayGroup {
  id: string;
  name: string;
  tagline: string;
  accent: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';
  hallmarkIds: string[];
  compoundIds: string[];
  keyMolecules: string[];
  synergy: string;
}

export interface ImpactPropagation {
  hallmarkId: string;
  leverageScore: number;
  directEffects: { hallmarkId: string; mechanism: string; strength: RelationStrength; type: RelationType }[];
  secondaryEffects: { hallmarkId: string; via: string; mechanism: string }[];
  pathway: string;
}

export interface EmergentEffect {
  id: string;
  title: string;
  tagline: string;
  compoundIds: string[];
  hallmarkIds: string[];
  mechanism: string;
  emergentBenefit: string;
  synergyMultiplier: number;
  evidence: EvidenceTier;
}

// ─── Relations ───────────────────────────────────────────────────────────────

export const hallmarkRelations: HallmarkRelation[] = [
  {
    id: 'mito-senescence',
    from: 'mito',
    to: 'senescence',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Dysfunctional mitochondria release excess ROS and mtDNA fragments that activate the cGAS-STING pathway, triggering the senescent transcriptional program.',
    evidence: 'A',
    keyMolecules: ['ROS', 'mtDNA', 'cGAS', 'STING', 'p21'],
  },
  {
    id: 'senescence-inflammation',
    from: 'senescence',
    to: 'inflammation',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Senescent cells secrete the SASP — a cocktail of IL-6, IL-8, MMP-3, and TGF-β — that drives sterile chronic inflammation in surrounding tissue.',
    evidence: 'A',
    keyMolecules: ['IL-6', 'IL-8', 'MMP-3', 'TGF-β', 'NF-κB', 'SASP'],
  },
  {
    id: 'autophagy-mito',
    from: 'autophagy',
    to: 'mito',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Mitophagy selectively clears damaged mitochondria via PINK1-Parkin, preventing ROS propagation and maintaining the healthy mitochondrial pool.',
    evidence: 'A',
    keyMolecules: ['PINK1', 'Parkin', 'LC3', 'p62', 'BNIP3'],
  },
  {
    id: 'genomic-senescence',
    from: 'genomic',
    to: 'senescence',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Double-strand breaks activate ATM/ATR kinases that phosphorylate p53, triggering irreversible p21-mediated cell cycle arrest.',
    evidence: 'A',
    keyMolecules: ['ATM', 'ATR', 'p53', 'p21', 'γH2AX'],
  },
  {
    id: 'telomeres-senescence',
    from: 'telomeres',
    to: 'senescence',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Critically short telomeres (< 4 kb) are recognized as DNA damage, engaging the same p53-p21 axis as double-strand breaks.',
    evidence: 'A',
    keyMolecules: ['TRF2', 'p53', 'p21', 'CDK4', 'RB'],
  },
  {
    id: 'dysbiosis-inflammation',
    from: 'dysbiosis',
    to: 'inflammation',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Disrupted tight-junction proteins allow bacterial LPS to translocate into portal circulation, activating TLR4 on macrophages and driving systemic NF-κB signaling.',
    evidence: 'A',
    keyMolecules: ['LPS', 'TLR4', 'NF-κB', 'TNF-α', 'IL-1β'],
  },
  {
    id: 'inflammation-epigenetic',
    from: 'inflammation',
    to: 'epigenetic',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Chronic NF-κB activation recruits DNMT3A/3B to inflammatory gene promoters, accelerating the epigenetic clock as measured by Horvath methylation arrays.',
    evidence: 'B',
    keyMolecules: ['NF-κB', 'DNMT3A', 'DNMT3B', 'H3K27me3'],
  },
  {
    id: 'nutrient-autophagy',
    from: 'nutrient',
    to: 'autophagy',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'AMPK activation during low-nutrient states phosphorylates ULK1, initiating autophagy. mTORC1 suppression during fasting relieves the inhibitory brake.',
    evidence: 'A',
    keyMolecules: ['AMPK', 'mTORC1', 'ULK1', 'Beclin-1', 'ATG13'],
  },
  {
    id: 'autophagy-proteostasis',
    from: 'autophagy',
    to: 'proteostasis',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Macro-autophagy engulfs and degrades protein aggregates that escape the proteasome, including tau oligomers and α-synuclein protofibrils.',
    evidence: 'A',
    keyMolecules: ['LC3-II', 'p62/SQSTM1', 'Ubiquitin', 'HDAC6'],
  },
  {
    id: 'senescence-stem',
    from: 'senescence',
    to: 'stem',
    type: 'suppresses',
    strength: 'strong',
    mechanism: 'SASP cytokines (IL-6, TGF-β) paracrinally inhibit Wnt signaling in neighboring stem cells, impairing self-renewal and committing progenitors to premature differentiation.',
    evidence: 'A',
    keyMolecules: ['IL-6', 'TGF-β', 'Wnt', 'FOXO', 'NOTCH'],
  },
  {
    id: 'inflammation-stem',
    from: 'inflammation',
    to: 'stem',
    type: 'suppresses',
    strength: 'strong',
    mechanism: 'Chronic TNF-α and IL-1β create a hostile stem cell niche, activating NF-κB in HSCs and satellite cells to exhaust their regenerative reserve.',
    evidence: 'A',
    keyMolecules: ['TNF-α', 'IL-1β', 'NF-κB', 'p38 MAPK'],
  },
  {
    id: 'epigenetic-stem',
    from: 'epigenetic',
    to: 'stem',
    type: 'amplifies',
    strength: 'moderate',
    mechanism: 'Epigenetic drift with age silences key pluripotency and regeneration genes (OCT4, SOX2 promoters), reducing the functional stem cell pool.',
    evidence: 'B',
    keyMolecules: ['H3K4me3', 'H3K27me3', 'DNMT3A', 'OCT4', 'SOX2'],
  },
  {
    id: 'mito-epigenetic',
    from: 'mito',
    to: 'epigenetic',
    type: 'amplifies',
    strength: 'moderate',
    mechanism: 'Mitochondria-derived acetyl-CoA, alpha-ketoglutarate, and NAD+ are direct substrates for HATs, TET enzymes, and sirtuins — linking energy status to epigenetic marks.',
    evidence: 'B',
    keyMolecules: ['Acetyl-CoA', 'α-KG', 'NAD+', 'SIRT1', 'TET2'],
  },
  {
    id: 'mito-nutrient',
    from: 'mito',
    to: 'nutrient',
    type: 'bidirectional',
    strength: 'moderate',
    mechanism: 'Mitochondrial ATP output modulates AMPK activity; conversely, AMPK drives mitochondrial biogenesis via PGC-1α. This bidirectional loop maintains metabolic homeostasis.',
    evidence: 'B',
    keyMolecules: ['ATP', 'AMPK', 'PGC-1α', 'SIRT3', 'mTORC1'],
  },
  {
    id: 'epigenetic-proteostasis',
    from: 'epigenetic',
    to: 'proteostasis',
    type: 'amplifies',
    strength: 'moderate',
    mechanism: 'Epigenetic silencing of proteasome subunit genes (PSMA, PSMB families) and HSP70 chaperones reduces proteostasis capacity with advancing age.',
    evidence: 'B',
    keyMolecules: ['PSMA5', 'PSMB5', 'HSP70', 'HSF1', 'SIRT2'],
  },
  {
    id: 'inflammation-mito',
    from: 'inflammation',
    to: 'mito',
    type: 'suppresses',
    strength: 'moderate',
    mechanism: 'Chronic NF-κB signaling suppresses PGC-1α transcription, reducing mitochondrial biogenesis and electron transport chain assembly.',
    evidence: 'B',
    keyMolecules: ['NF-κB', 'PGC-1α', 'mtDNA', 'Complex I', 'TNF-α'],
  },
  {
    id: 'autophagy-senescence',
    from: 'autophagy',
    to: 'senescence',
    type: 'suppresses',
    strength: 'strong',
    mechanism: 'Autophagy degrades key SASP mediators and senescence-promoting factors including p62, NF-κB activators, and damaged organelles that trigger the senescent state.',
    evidence: 'B',
    keyMolecules: ['p62', 'NF-κB', 'LC3-II', 'mTOR', 'ATM'],
  },
  {
    id: 'nutrient-epigenetic',
    from: 'nutrient',
    to: 'epigenetic',
    type: 'amplifies',
    strength: 'moderate',
    mechanism: 'NAD+ (mTOR/SIRT1 substrate) and alpha-KG (TET enzyme cofactor) directly link nutrient sensing to epigenetic regulation of aging genes.',
    evidence: 'A',
    keyMolecules: ['NAD+', 'α-KG', 'SIRT1', 'TET1', 'mTOR'],
  },
  {
    id: 'telomeres-genomic',
    from: 'telomeres',
    to: 'genomic',
    type: 'amplifies',
    strength: 'moderate',
    mechanism: 'Eroded telomeres undergo end-joining repair that fuses chromosomes, creating breakage-fusion-bridge cycles amplifying genomic rearrangements.',
    evidence: 'B',
    keyMolecules: ['TRF2', 'MRN complex', 'NHEJ', 'BFB cycle'],
  },
  {
    id: 'senescence-epigenetic',
    from: 'senescence',
    to: 'epigenetic',
    type: 'amplifies',
    strength: 'moderate',
    mechanism: 'SASP-mediated paracrine signaling induces epigenetic reprogramming in bystander cells, spreading age-associated methylation patterns.',
    evidence: 'B',
    keyMolecules: ['SASP', 'IL-6', 'DNMT3B', 'H2A.J histone'],
  },
  {
    id: 'proteostasis-stem',
    from: 'proteostasis',
    to: 'stem',
    type: 'amplifies',
    strength: 'moderate',
    mechanism: 'High proteasome activity is required for stem cell fate decisions and pluripotency maintenance. Proteostasis failure shifts stem cells toward quiescence or apoptosis.',
    evidence: 'B',
    keyMolecules: ['PSMD11', 'Ubiquitin-ligases', 'HSP90', 'Oct4'],
  },
  {
    id: 'genomic-stem',
    from: 'genomic',
    to: 'stem',
    type: 'suppresses',
    strength: 'moderate',
    mechanism: 'Accumulated mutations in stem cell genomes impair self-renewal programs and reduce clonal fitness of the regenerative pool.',
    evidence: 'B',
    keyMolecules: ['p53', 'PUMA', 'Bax', 'DNMT3A somatic mutations'],
  },
  {
    id: 'communication-inflammation',
    from: 'communication',
    to: 'inflammation',
    type: 'amplifies',
    strength: 'strong',
    mechanism: 'Age-altered exosomal cargo and circulating miRNAs dysregulate macrophage polarization, amplifying inflammatory M1 activation and reducing anti-inflammatory M2 responses.',
    evidence: 'B',
    keyMolecules: ['miR-21', 'miR-146a', 'exosome cargo', 'M1/M2 ratio'],
  },
  {
    id: 'communication-stem',
    from: 'communication',
    to: 'stem',
    type: 'suppresses',
    strength: 'moderate',
    mechanism: 'Exosomes from senescent cells deliver pro-senescence miRNAs and proteins to adjacent stem cells, impairing niche function.',
    evidence: 'C',
    keyMolecules: ['miR-34a', 'SASP exosomes', 'p16 mRNA'],
  },
  {
    id: 'dysbiosis-nutrient',
    from: 'dysbiosis',
    to: 'nutrient',
    type: 'suppresses',
    strength: 'moderate',
    mechanism: 'Gut dysbiosis impairs production of short-chain fatty acids, B-vitamins, and urolithins that fuel AMPK/SIRT pathways, creating nutrient-sensing deficits.',
    evidence: 'B',
    keyMolecules: ['SCFA', 'Butyrate', 'Urolithin A', 'B12', 'AMPK'],
  },
  {
    id: 'proteostasis-genomic',
    from: 'proteostasis',
    to: 'genomic',
    type: 'amplifies',
    strength: 'moderate',
    mechanism: 'Misfolded DNA repair proteins (BRCA1/2, RAD51 aggregates) sequester into toxic aggregates, impairing DNA damage response capability.',
    evidence: 'B',
    keyMolecules: ['BRCA1', 'RAD51', 'Hsp90 chaperones', 'PARP1'],
  },
];

// ─── Pathway Groups ───────────────────────────────────────────────────────────

export const pathwayGroups: PathwayGroup[] = [
  {
    id: 'nrf2',
    name: 'NRF2 Defense Axis',
    tagline: 'Master antioxidant regulator that shields DNA, proteins, and mitochondria',
    accent: 'cyan',
    hallmarkIds: ['genomic', 'proteostasis', 'autophagy', 'mito'],
    compoundIds: ['sulforaphane', 'glynac', 'rala'],
    keyMolecules: ['NRF2', 'KEAP1', 'HO-1', 'NQO1', 'Glutathione'],
    synergy: 'Sulforaphane activates NRF2 transcription while GlyNAC replenishes the glutathione pool NRF2 mobilizes — creating a feed-forward defense cascade.',
  },
  {
    id: 'nad-sirtuin',
    name: 'NAD⁺/Sirtuin Axis',
    tagline: 'Central metabolic regulator linking energy status to epigenetic age',
    accent: 'emerald',
    hallmarkIds: ['epigenetic', 'mito', 'genomic', 'nutrient'],
    compoundIds: ['nmn', 'resveratrol', 'cakg'],
    keyMolecules: ['NAD+', 'SIRT1', 'SIRT3', 'PARP1', 'PGC-1α'],
    synergy: 'NMN restores NAD+ substrate while resveratrol activates SIRT1 allosterically — together they amplify sirtuin output beyond either alone.',
  },
  {
    id: 'mtor-ampk',
    name: 'mTOR/AMPK Axis',
    tagline: 'Nutrient-sensing switch that controls cellular cleanup and regeneration',
    accent: 'violet',
    hallmarkIds: ['nutrient', 'autophagy', 'mito', 'senescence'],
    compoundIds: ['resveratrol', 'cakg', 'spermidine'],
    keyMolecules: ['mTORC1', 'AMPK', 'ULK1', 'S6K1', 'Raptor'],
    synergy: 'Ca-AKG and resveratrol synergize to suppress mTOR while activating AMPK — the combination mimics caloric restriction signaling more completely than either compound alone.',
  },
  {
    id: 'sasp-inflammation',
    name: 'SASP/Inflammation Cascade',
    tagline: 'Senescence-driven inflammatory loop accelerating multi-hallmark decline',
    accent: 'rose',
    hallmarkIds: ['senescence', 'inflammation', 'communication', 'stem'],
    compoundIds: ['fisetin', 'quercetin', 'omega3'],
    keyMolecules: ['IL-6', 'TNF-α', 'NF-κB', 'MMP-9', 'p38 MAPK'],
    synergy: 'Senolytic clearance (fisetin) removes the SASP source; omega-3 EPA/DHA resolve the resulting inflammatory debris — sequential targeting breaks the senescence-inflammation feedback loop.',
  },
  {
    id: 'epigenetic-homeostasis',
    name: 'Epigenetic Homeostasis Axis',
    tagline: 'Reversible reprogramming of the epigenetic clock toward youthful patterns',
    accent: 'violet',
    hallmarkIds: ['epigenetic', 'telomeres', 'stem', 'genomic'],
    compoundIds: ['cakg', 'nmn', 'resveratrol'],
    keyMolecules: ['TET enzymes', 'α-KG', 'DNMT3A', 'H3K4me3', 'SAM'],
    synergy: 'Ca-AKG feeds TET demethylases while NMN/SIRT1 controls histone acetylation — together they address both DNA methylation and chromatin compaction arms of epigenetic aging.',
  },
  {
    id: 'gut-immune',
    name: 'Gut–Immune Axis',
    tagline: 'Microbiome integrity as the upstream controller of systemic inflammation',
    accent: 'amber',
    hallmarkIds: ['dysbiosis', 'inflammation', 'communication', 'nutrient'],
    compoundIds: ['urolithina', 'omega3'],
    keyMolecules: ['LPS', 'SCFA', 'Butyrate', 'TLR4', 'Treg cells'],
    synergy: 'Restoring microbial diversity lowers LPS translocation while urolithin A (gut-converted) directly triggers mitophagy in intestinal and muscle cells — a gut-to-tissue signaling cascade.',
  },
];

// ─── Impact Propagation ───────────────────────────────────────────────────────

export const impactPropagations: ImpactPropagation[] = [
  {
    hallmarkId: 'mito',
    leverageScore: 92,
    pathway: 'Mitochondria sit at the convergence of energy production, ROS generation, and metabolite supply — intervention here propagates broadly.',
    directEffects: [
      { hallmarkId: 'senescence', mechanism: 'mtDNA/ROS trigger cGAS-STING senescence pathway', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'epigenetic', mechanism: 'Acetyl-CoA and NAD+ from mitochondria control epigenetic marks', strength: 'moderate', type: 'amplifies' },
      { hallmarkId: 'nutrient', mechanism: 'ATP/ADP ratio directly gates AMPK activity', strength: 'moderate', type: 'bidirectional' },
    ],
    secondaryEffects: [
      { hallmarkId: 'inflammation', via: 'senescence', mechanism: 'mito→senescence→SASP→inflammation cascade' },
      { hallmarkId: 'stem', via: 'senescence', mechanism: 'Senescent SASP paracrinally exhausts stem niches' },
      { hallmarkId: 'autophagy', via: 'nutrient', mechanism: 'AMPK upregulation triggers mitophagy feedback loop' },
    ],
  },
  {
    hallmarkId: 'senescence',
    leverageScore: 88,
    pathway: 'Senescent cells act as inflammatory hubs. Clearing them (senostasis) reduces SASP burden across stem cell niches and tissue environments.',
    directEffects: [
      { hallmarkId: 'inflammation', mechanism: 'SASP cytokine storm (IL-6, IL-8, MMP-3) drives chronic inflammation', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'stem', mechanism: 'SASP paracrine signaling impairs stem cell renewal via Wnt/TGF-β', strength: 'strong', type: 'suppresses' },
      { hallmarkId: 'epigenetic', mechanism: 'SASP spreads aberrant methylation to bystander cells', strength: 'moderate', type: 'amplifies' },
    ],
    secondaryEffects: [
      { hallmarkId: 'mito', via: 'inflammation', mechanism: 'Chronic NF-κB suppresses PGC-1α and mitochondrial biogenesis' },
      { hallmarkId: 'dysbiosis', via: 'inflammation', mechanism: 'Systemic inflammation alters gut epithelial integrity and microbiome composition' },
      { hallmarkId: 'genomic', via: 'stem', mechanism: 'Impaired stem cells accumulate more DNA damage per division' },
    ],
  },
  {
    hallmarkId: 'inflammation',
    leverageScore: 85,
    pathway: 'Chronic low-grade inflammation ("inflammaging") is both a cause and consequence — resolving it breaks feedback loops across most hallmarks.',
    directEffects: [
      { hallmarkId: 'epigenetic', mechanism: 'NF-κB accelerates the epigenetic clock via DNMT3A recruitment', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'stem', mechanism: 'Inflammatory cytokines exhaust stem cell reserves via p38 MAPK', strength: 'strong', type: 'suppresses' },
      { hallmarkId: 'mito', mechanism: 'NF-κB suppresses PGC-1α, reducing mitochondrial biogenesis', strength: 'moderate', type: 'suppresses' },
    ],
    secondaryEffects: [
      { hallmarkId: 'telomeres', via: 'mito', mechanism: 'Reduced mitochondrial function increases ROS-driven telomere attrition' },
      { hallmarkId: 'proteostasis', via: 'epigenetic', mechanism: 'Epigenetic silencing of proteasome genes impairs protein quality control' },
      { hallmarkId: 'nutrient', via: 'mito', mechanism: 'Mitochondrial dysfunction impairs AMPK/mTOR sensing accuracy' },
    ],
  },
  {
    hallmarkId: 'epigenetic',
    leverageScore: 82,
    pathway: 'The epigenetic clock is both a readout of cumulative damage and a driver — reversing it experimentally restores youthful transcriptional programs.',
    directEffects: [
      { hallmarkId: 'stem', mechanism: 'Silencing of OCT4/SOX2 promoters depletes functional stem pool', strength: 'moderate', type: 'amplifies' },
      { hallmarkId: 'proteostasis', mechanism: 'DNMT-mediated silencing of proteasome subunit genes', strength: 'moderate', type: 'amplifies' },
      { hallmarkId: 'communication', mechanism: 'Epigenetic changes alter secretory profile and exosome cargo', strength: 'moderate', type: 'amplifies' },
    ],
    secondaryEffects: [
      { hallmarkId: 'senescence', via: 'stem', mechanism: 'Epigenetic-depleted stem cells enter premature senescence under stress' },
      { hallmarkId: 'inflammation', via: 'communication', mechanism: 'Altered signaling amplifies inflammatory macrophage polarization' },
      { hallmarkId: 'autophagy', via: 'proteostasis', mechanism: 'Proteostasis failure increases autophagy burden' },
    ],
  },
  {
    hallmarkId: 'autophagy',
    leverageScore: 80,
    pathway: 'Autophagy is the master recycler — it maintains mitochondria, clears SASP-driving aggregates, and enables stem cell quiescence.',
    directEffects: [
      { hallmarkId: 'mito', mechanism: 'Mitophagy clears damaged mitochondria via PINK1-Parkin', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'proteostasis', mechanism: 'Macro-autophagy degrades protein aggregates escaping the proteasome', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'senescence', mechanism: 'Autophagy degrades SASP mediators and p62/NF-κB activators', strength: 'strong', type: 'suppresses' },
    ],
    secondaryEffects: [
      { hallmarkId: 'epigenetic', via: 'mito', mechanism: 'Healthier mitochondria restore acetyl-CoA/NAD+ supply for epigenetic enzymes' },
      { hallmarkId: 'stem', via: 'senescence', mechanism: 'Reduced SASP burden protects stem cell niches' },
      { hallmarkId: 'inflammation', via: 'senescence', mechanism: 'Fewer senescent cells means lower SASP-driven inflammation' },
    ],
  },
  {
    hallmarkId: 'nutrient',
    leverageScore: 78,
    pathway: 'Nutrient sensing pathways (AMPK/mTOR/insulin) are master integrators that regulate autophagy, mitochondrial biogenesis, and protein synthesis.',
    directEffects: [
      { hallmarkId: 'autophagy', mechanism: 'AMPK activates ULK1; mTOR suppression removes autophagy brake', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'mito', mechanism: 'AMPK drives PGC-1α-mediated mitochondrial biogenesis', strength: 'moderate', type: 'bidirectional' },
      { hallmarkId: 'epigenetic', mechanism: 'NAD+ and α-KG from metabolism directly fuel sirtuin/TET enzyme systems', strength: 'moderate', type: 'amplifies' },
    ],
    secondaryEffects: [
      { hallmarkId: 'senescence', via: 'autophagy', mechanism: 'Autophagy induction reduces senescent cell burden' },
      { hallmarkId: 'proteostasis', via: 'autophagy', mechanism: 'Autophagy-driven clearance supports overall proteostasis network' },
      { hallmarkId: 'genomic', via: 'mito', mechanism: 'Healthier mitochondria reduce ROS-driven DNA damage' },
    ],
  },
  {
    hallmarkId: 'genomic',
    leverageScore: 75,
    pathway: 'DNA integrity is foundational — mutations cascade into dysfunction across all downstream hallmarks over decades.',
    directEffects: [
      { hallmarkId: 'senescence', mechanism: 'DSBs trigger ATM-p53-p21 senescence checkpoint', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'proteostasis', mechanism: 'Damaged repair proteins form aggregates impairing DDR', strength: 'moderate', type: 'amplifies' },
      { hallmarkId: 'stem', mechanism: 'Accumulated mutations reduce clonal fitness of stem pools', strength: 'moderate', type: 'suppresses' },
    ],
    secondaryEffects: [
      { hallmarkId: 'inflammation', via: 'senescence', mechanism: 'DNA-damage-induced senescent SASP drives inflammation' },
      { hallmarkId: 'epigenetic', via: 'senescence', mechanism: 'Senescent SASP spreads aberrant methylation patterns' },
      { hallmarkId: 'telomeres', via: 'senescence', mechanism: 'Shared senescence checkpoint connects telomere and genomic damage responses' },
    ],
  },
  {
    hallmarkId: 'dysbiosis',
    leverageScore: 70,
    pathway: 'The gut microbiome is an upstream controller of systemic inflammation and local producer of longevity-relevant metabolites.',
    directEffects: [
      { hallmarkId: 'inflammation', mechanism: 'LPS translocation via leaky gut activates TLR4/NF-κB systemically', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'nutrient', mechanism: 'Loss of SCFA production (butyrate, propionate) impairs AMPK signaling', strength: 'moderate', type: 'suppresses' },
      { hallmarkId: 'communication', mechanism: 'Dysbiotic microbiome alters circulating metabolite signals and immune education', strength: 'moderate', type: 'amplifies' },
    ],
    secondaryEffects: [
      { hallmarkId: 'epigenetic', via: 'inflammation', mechanism: 'Gut-driven inflammation accelerates epigenetic clock' },
      { hallmarkId: 'autophagy', via: 'nutrient', mechanism: 'Impaired AMPK signaling reduces autophagy induction' },
      { hallmarkId: 'mito', via: 'inflammation', mechanism: 'Systemic NF-κB suppresses mitochondrial biogenesis' },
    ],
  },
  {
    hallmarkId: 'proteostasis',
    leverageScore: 65,
    pathway: 'Protein quality control failure creates toxic aggregates that impair other cellular systems, particularly in post-mitotic neurons.',
    directEffects: [
      { hallmarkId: 'genomic', mechanism: 'Aggregated DNA repair proteins impair DDR capacity', strength: 'moderate', type: 'amplifies' },
      { hallmarkId: 'stem', mechanism: 'High proteasome activity is required for stem cell potency maintenance', strength: 'moderate', type: 'amplifies' },
      { hallmarkId: 'autophagy', mechanism: 'Aggregate overload increases demand on autophagy clearance pathways', strength: 'moderate', type: 'amplifies' },
    ],
    secondaryEffects: [
      { hallmarkId: 'mito', via: 'autophagy', mechanism: 'Autophagy overload reduces mitophagy efficiency' },
      { hallmarkId: 'senescence', via: 'genomic', mechanism: 'Genomic damage from aggregates triggers senescence cascade' },
    ],
  },
  {
    hallmarkId: 'communication',
    leverageScore: 60,
    pathway: 'Altered intercellular signaling amplifies age phenotypes through paracrine and endocrine networks.',
    directEffects: [
      { hallmarkId: 'inflammation', mechanism: 'Dysregulated exosomal miRNAs shift macrophages toward M1 inflammatory phenotype', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'stem', mechanism: 'Pro-senescence miRNA cargo delivered to adjacent stem cells via exosomes', strength: 'moderate', type: 'suppresses' },
      { hallmarkId: 'epigenetic', mechanism: 'Circulating signals alter methylation patterns in target cell populations', strength: 'moderate', type: 'amplifies' },
    ],
    secondaryEffects: [
      { hallmarkId: 'senescence', via: 'inflammation', mechanism: 'Amplified inflammation drives bystander senescence' },
      { hallmarkId: 'genomic', via: 'stem', mechanism: 'Impaired stem cell renewal increases mutation accumulation' },
    ],
  },
  {
    hallmarkId: 'stem',
    leverageScore: 58,
    pathway: 'Stem cell exhaustion is the downstream integrator of upstream hallmark damage — it limits tissue regeneration capacity.',
    directEffects: [
      { hallmarkId: 'communication', mechanism: 'Exhausted stem cells alter paracrine signaling in local tissue niches', strength: 'moderate', type: 'amplifies' },
      { hallmarkId: 'proteostasis', mechanism: 'Reduced stem cell renewal outputs affect proteostasis network breadth', strength: 'weak', type: 'amplifies' },
    ],
    secondaryEffects: [
      { hallmarkId: 'inflammation', via: 'communication', mechanism: 'Altered niche signaling sustains low-grade inflammation' },
      { hallmarkId: 'dysbiosis', via: 'communication', mechanism: 'Impaired gut stem renewal accelerates intestinal barrier dysfunction' },
    ],
  },
  {
    hallmarkId: 'telomeres',
    leverageScore: 55,
    pathway: 'Telomere shortening acts as a cell-autonomous clock, with effects primarily channeled through the senescence checkpoint.',
    directEffects: [
      { hallmarkId: 'senescence', mechanism: 'Critically short telomeres activate p53-p21 senescence program', strength: 'strong', type: 'amplifies' },
      { hallmarkId: 'genomic', mechanism: 'Telomere end-joining drives chromosomal rearrangements', strength: 'moderate', type: 'amplifies' },
    ],
    secondaryEffects: [
      { hallmarkId: 'inflammation', via: 'senescence', mechanism: 'Telomere-induced senescent cells contribute SASP inflammatory load' },
      { hallmarkId: 'stem', via: 'senescence', mechanism: 'SASP from short-telomere senescent cells exhausts stem niches' },
    ],
  },
];

// ─── Emergent Effects ─────────────────────────────────────────────────────────

export const emergentEffects: EmergentEffect[] = [
  {
    id: 'nad-epigenetic-mito-loop',
    title: 'NAD⁺ Epigenetic–Mitochondrial Loop',
    tagline: 'NMN + Ca-AKG creates a self-reinforcing sirtuin activation cascade',
    compoundIds: ['nmn', 'cakg', 'resveratrol'],
    hallmarkIds: ['mito', 'epigenetic', 'nutrient', 'genomic'],
    mechanism: 'NMN restores NAD+ substrate for SIRT1/3. Ca-AKG supplies α-KG for TET demethylation. Together they create a positive feedback loop: restored mitochondrial function increases NAD+ production, which further amplifies sirtuin activity.',
    emergentBenefit: 'Multi-tissue epigenetic clock reversal exceeding either compound alone — animal data shows 25–40% greater effect size when combined vs individual administration.',
    synergyMultiplier: 1.8,
    evidence: 'B',
  },
  {
    id: 'nrf2-systems-shield',
    title: 'NRF2 Systems Shield',
    tagline: 'Sulforaphane + GlyNAC creates a unified defense across DNA, protein, and mitochondria',
    compoundIds: ['sulforaphane', 'glynac', 'rala'],
    hallmarkIds: ['genomic', 'proteostasis', 'mito', 'autophagy'],
    mechanism: 'Sulforaphane activates NRF2 transcription of defense genes; GlyNAC replenishes the glutathione pool those genes require; R-ALA regenerates oxidized glutathione and vitamin C/E. The three compounds address upstream activation, substrate availability, and recycling simultaneously.',
    emergentBenefit: 'Clinical GlyNAC trials in older adults showed 80th-percentile improvements in oxidative stress, muscle strength, mitochondrial function, and cognition — effects spanning four hallmarks from a single protocol.',
    synergyMultiplier: 2.1,
    evidence: 'A',
  },
  {
    id: 'senostatic-rejuvenation',
    title: 'Senostatic Rejuvenation',
    tagline: 'Clearance + resolution of the SASP–inflammation feedback loop',
    compoundIds: ['fisetin', 'quercetin', 'omega3'],
    hallmarkIds: ['senescence', 'inflammation', 'stem', 'communication'],
    mechanism: 'Fisetin selectively clears senescent cells (senolysis via PI3K/AKT inhibition). Omega-3 EPA/DHA then resolve the residual SASP inflammatory mediators via SPM (specialized pro-resolving mediators). Sequential targeting removes the source then resolves the downstream signal.',
    emergentBenefit: 'Proof-of-concept human data (Mayo Clinic fisetin pilot) plus established omega-3 resolution biology — the combination is predicted to restore stem cell niche competency beyond senolysis alone by resolving the inflammatory microenvironment.',
    synergyMultiplier: 1.6,
    evidence: 'B',
  },
  {
    id: 'autophagy-proteostasis-cascade',
    title: 'Autophagy–Proteostasis Cascade',
    tagline: 'AMPK activation + glutathione restoration creates a cellular deep-clean event',
    compoundIds: ['nmn', 'glynac', 'resveratrol'],
    hallmarkIds: ['autophagy', 'proteostasis', 'mito', 'senescence'],
    mechanism: 'Resveratrol activates AMPK and SIRT1, inducing autophagy. GlyNAC provides glutathione to manage the increased oxidative load from lysosomal activity during bulk autophagy. NMN ensures the NAD+ substrate pool is not depleted by increased PARP/SIRT demand.',
    emergentBenefit: 'Simultaneous targeting of autophagy induction and oxidative defense creates a cleanup event that reduces aggregate load, damaged mitochondria, and senescence-prone cells — addressing proteostasis, mito health, and senescence burden in a single protocol window.',
    synergyMultiplier: 1.7,
    evidence: 'B',
  },
];

// ─── Query Helpers ────────────────────────────────────────────────────────────

export function getRelationsFor(hallmarkId: string): HallmarkRelation[] {
  return hallmarkRelations.filter((r) => r.from === hallmarkId || r.to === hallmarkId);
}

export function getOutgoingRelations(hallmarkId: string): HallmarkRelation[] {
  return hallmarkRelations.filter((r) => r.from === hallmarkId);
}

export function getIncomingRelations(hallmarkId: string): HallmarkRelation[] {
  return hallmarkRelations.filter((r) => r.to === hallmarkId);
}

export function getImpactPropagation(hallmarkId: string): ImpactPropagation | undefined {
  return impactPropagations.find((p) => p.hallmarkId === hallmarkId);
}

export function getPathwaysForHallmark(hallmarkId: string): PathwayGroup[] {
  return pathwayGroups.filter((g) => g.hallmarkIds.includes(hallmarkId));
}

export function getEmergentEffectsForHallmark(hallmarkId: string): EmergentEffect[] {
  return emergentEffects.filter((e) => e.hallmarkIds.includes(hallmarkId));
}

export function getEmergentEffectsForCompound(compoundId: string): EmergentEffect[] {
  return emergentEffects.filter((e) => e.compoundIds.includes(compoundId));
}

export function getPathwaysForCompound(compoundId: string): PathwayGroup[] {
  return pathwayGroups.filter((g) => g.compoundIds.includes(compoundId));
}

export function getRelatedHallmarks(hallmarkId: string): string[] {
  const ids = new Set<string>();
  hallmarkRelations.forEach((r) => {
    if (r.from === hallmarkId) ids.add(r.to);
    if (r.to === hallmarkId) ids.add(r.from);
  });
  return Array.from(ids);
}
