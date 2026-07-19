import type { ThemeAccent } from './design-system';

/**
 * TNiC organizes primary content by compound (content/compounds) and by
 * hallmark (content/hallmarks) — but neither axis lets a reader explore
 * "everything that touches AMPK" as its own artifact. Compound.pathway in
 * lib/data.ts is a one-off label per compound; hallmark keyMolecules embed
 * the same shared molecules (AMPK, NRF2, SIRT1...) once per hallmark, in
 * prose, with no cross-hallmark aggregation. This file is that missing
 * cross-cutting axis: the six molecular pathways interventions on this site
 * actually converge on, each with every compound/peptide lever that engages
 * it and the hallmarks it feeds into.
 */

export type PathwayLeverStrength = 'primary' | 'secondary';

export interface PathwayLever {
  /** Set when the lever is a compound — links to /library/compounds/{id}. */
  compoundId?: string;
  /** Set when the lever is a peptide — links to /peptides/{id}. */
  peptideId?: string;
  /** Display name when the lever has no dedicated module (e.g. Rx-only). */
  name?: string;
  /** Link override for levers with no compound/peptide module (e.g. rapamycin, metformin). */
  href?: string;
  role: string;
  strength: PathwayLeverStrength;
  evidenceTier: 'A' | 'B' | 'C';
}

/** Mirrors components/library/PathwayDiagram.tsx's node/edge props — kept as
 * a local shape here rather than importing from components/ so lib/ stays
 * free of component dependencies. */
export interface PathwayDiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  accent?: ThemeAccent;
  /** Grid column (0-based). Set on any node to switch to the branched layout. */
  col?: number;
  /** Grid row within the column (0-based, default 0). */
  row?: number;
}

export interface PathwayDiagramEdge {
  from: string;
  to: string;
  label?: string;
  /** Render as a feedback/crosstalk arc below the nodes. */
  feedback?: boolean;
}

export interface Pathway {
  slug: string;
  name: string;
  tagline: string;
  theme: ThemeAccent;
  keyMolecules: string[];
  diagramNodes: PathwayDiagramNode[];
  diagramEdges: PathwayDiagramEdge[];
  synthesis: string[];
  whyItMatters: string;
  levers: PathwayLever[];
  relatedHallmarkIds: string[];
  relatedSynergySlugs: string[];
  furtherReading: { label: string; href: string }[];
}

export const pathways: Pathway[] = [
  {
    slug: 'ampk-activation',
    name: 'AMPK Activation',
    tagline: 'The cell\'s energy-deficit alarm — switches metabolism from growth to repair',
    theme: 'amber',
    keyMolecules: ['AMPK', 'LKB1', 'ACC', 'PGC-1α', 'mTORC1', 'ULK1'],
    diagramNodes: [
      { id: 'deficit', label: 'Energy deficit', sublabel: 'AMP:ATP ↑', accent: 'rose', col: 0, row: 1 },
      { id: 'ampk', label: 'AMPK active', sublabel: 'fuel gauge', accent: 'amber', col: 1, row: 1 },
      { id: 'mtor', label: 'mTORC1 ↓', sublabel: 'growth brake off', accent: 'violet', col: 2, row: 0 },
      { id: 'autophagy', label: 'Autophagy', sublabel: 'ULK1', accent: 'emerald', col: 2, row: 1 },
      { id: 'biogenesis', label: 'Mito biogenesis', sublabel: 'PGC-1α', accent: 'cyan', col: 2, row: 2 },
      { id: 'sirt', label: 'SIRT1 / NAD+', sublabel: 'crosstalk', accent: 'rose', col: 2, row: 3 },
    ],
    diagramEdges: [
      { from: 'deficit', to: 'ampk', label: 'berberine, metformin' },
      { from: 'ampk', to: 'mtor', label: 'suppresses' },
      { from: 'ampk', to: 'autophagy', label: 'activates ULK1' },
      { from: 'ampk', to: 'biogenesis', label: 'PGC-1α' },
      { from: 'ampk', to: 'sirt', label: 'raises NAD+' },
      { from: 'sirt', to: 'ampk', label: 'deacetylates LKB1', feedback: true },
    ],
    synthesis: [
      'AMP-activated protein kinase (AMPK) is the cell\'s fuel gauge. When the AMP:ATP ratio rises — from fasting, exercise, or a mild metabolic stressor — AMPK phosphorylates a cascade of downstream targets that collectively shift the cell from energy-spending growth programs toward energy-conserving repair programs: it inhibits acetyl-CoA carboxylase (ACC) to redirect fat toward oxidation, activates PGC-1α to drive mitochondrial biogenesis, phosphorylates ULK1 to initiate autophagy, and suppresses mTORC1, releasing the brake mTOR normally holds on cellular cleanup.',
      'Berberine is this pathway\'s most direct lever on this site: it mildly inhibits mitochondrial Complex I, which is exactly the kind of energy-deficit signal (lower ATP output) that activates AMPK — the same mechanism, incidentally, that metformin uses. That\'s why berberine\'s human trial data (a head-to-head RCT matching metformin on glycemic control) reads as a plausible proxy for what AMPK activation does downstream, even though berberine and metformin are structurally unrelated.',
      'AMPK doesn\'t act alone — it runs a bidirectional feedback loop with the sirtuin/NAD+ axis (see that pathway page): AMPK activation raises the NAD+/NADH ratio SIRT1 needs, and SIRT1-mediated deacetylation of LKB1 re-activates AMPK. That crosstalk is why berberine and resveratrol are paired as a dedicated stack on this site rather than treated as redundant.',
    ],
    whyItMatters: 'AMPK is upstream of both mTOR suppression and autophagy induction — it is arguably the single highest-leverage node for deregulated nutrient sensing, the hallmark most directly tied to caloric restriction\'s lifespan effects in every model organism tested. A reader whose primary hallmark is nutrient sensing or metabolic dysfunction should understand AMPK before choosing compounds, not after.',
    levers: [
      { compoundId: 'berberine', role: 'Mild Complex I inhibition raises AMP:ATP ratio — the most direct AMPK trigger on this site, with real human glycemic-control RCT data', strength: 'primary', evidenceTier: 'A' },
      { name: 'Metformin', href: '/library/compare/rapamycin-vs-metformin', role: 'Same Complex I → AMPK mechanism as berberine, but prescription-only with a 60-year human safety record and the TAME trial rationale built around it', strength: 'primary', evidenceTier: 'B' },
      { peptideId: 'mots-c', role: 'Mitochondrial-DNA-encoded peptide that activates AMPK directly in mouse models — no human interventional trial exists yet', strength: 'secondary', evidenceTier: 'C' },
      { compoundId: 'resveratrol', role: 'Downstream SIRT1 activation feeds back to re-activate AMPK via LKB1 deacetylation — crosstalk partner, not an independent AMPK trigger', strength: 'secondary', evidenceTier: 'B' },
      { compoundId: 'spermidine', role: 'Autophagy induction (via EP300 inhibition) converges on the same ULK1 node AMPK activates, through a parallel entry point', strength: 'secondary', evidenceTier: 'B' },
    ],
    relatedHallmarkIds: ['nutrient', 'mito', 'inflammation'],
    relatedSynergySlugs: ['berberine-resveratrol-ampk-sirt1'],
    furtherReading: [
      { label: 'AMPK/SIRT1 Crosstalk Pair', href: '/library/synergies/berberine-resveratrol-ampk-sirt1' },
      { label: 'Rapamycin vs Metformin', href: '/library/compare/rapamycin-vs-metformin' },
      { label: 'Disabled Macroautophagy hallmark', href: '/library/disabled-macroautophagy' },
    ],
  },
  {
    slug: 'nrf2-keap1-antioxidant-response',
    name: 'NRF2/KEAP1 Antioxidant Response',
    tagline: 'The master switch for 200+ cytoprotective genes — activated by controlled stress, not brute-force antioxidants',
    theme: 'emerald',
    keyMolecules: ['NRF2', 'KEAP1', 'NQO1', 'GCLC/GCLM', 'HO-1', 'GST', 'ARE'],
    diagramNodes: [
      { id: 'bound', label: 'KEAP1–NRF2', sublabel: 'bound, degraded', accent: 'rose' },
      { id: 'electrophile', label: 'Sulforaphane', sublabel: 'cysteine mod.', accent: 'amber' },
      { id: 'nrf2', label: 'NRF2 free', sublabel: 'nuclear', accent: 'violet' },
      { id: 'are', label: '200+ ARE genes', sublabel: 'NQO1, GCLC, HO-1', accent: 'cyan' },
      { id: 'output', label: 'GSH + detox capacity', sublabel: '+ GlyNAC substrate', accent: 'emerald' },
    ],
    diagramEdges: [
      { from: 'bound', to: 'electrophile', label: 'KEAP1 modified' },
      { from: 'electrophile', to: 'nrf2', label: 'releases NRF2' },
      { from: 'nrf2', to: 'are', label: 'transcribes' },
      { from: 'are', to: 'output', label: 'GlyNAC + R-ALA' },
    ],
    synthesis: [
      'Under normal conditions, KEAP1 continuously binds NRF2 and marks it for degradation, keeping the antioxidant response off. Electrophilic compounds that covalently modify specific cysteine residues on KEAP1 — sulforaphane\'s isothiocyanate group is the textbook example — disrupt that binding, letting NRF2 accumulate, translocate to the nucleus, and bind antioxidant response elements (ARE) to transcribe over 200 genes at once: NQO1 (quinone detoxification), GCLC/GCLM (the rate-limiting enzymes for glutathione synthesis), HO-1 (heme catabolism with anti-inflammatory effects), and GST (glutathione conjugation for phase-II detox).',
      'This is a fundamentally different mechanism from "an antioxidant" in the vitamin-C sense — sulforaphane doesn\'t neutralize free radicals directly, it reprograms gene transcription so the cell builds its own defense enzymes at scale. That\'s also why the pathway synergizes so cleanly with substrate-supply compounds: NRF2 activation upregulates the ENZYMES that make glutathione, but GlyNAC supplies the RAW MATERIALS (glycine and cysteine) those enzymes need. One without the other is a partial fix — the enzyme induction has nothing to work with, or the substrate has no upregulated machinery to use it efficiently.',
      'NRF2 also directly suppresses NF-κB, the master inflammatory transcription factor, giving this pathway reach into chronic inflammation independent of its detox function. That crosstalk is the mechanistic basis for the NRF2 Defense Triad (GlyNAC + sulforaphane + R-ALA) being this site\'s flagship stack — three orthogonal entry points into one gene program.',
    ],
    whyItMatters: 'NRF2 activation is the single highest-leverage lever for genomic instability (fewer oxidative DNA lesions reach the genome in the first place) and reaches into loss of proteostasis, chronic inflammation, and dysbiosis simultaneously — the broadest cross-hallmark reach of any pathway on this site.',
    levers: [
      { compoundId: 'sulforaphane', role: 'Direct KEAP1 cysteine modification — the canonical NRF2 activator, with three independent human trials showing target-gene induction', strength: 'primary', evidenceTier: 'A' },
      { compoundId: 'glynac', role: 'Supplies glycine + cysteine, the rate-limiting substrates for the glutathione-synthesis enzymes NRF2 activation upregulates', strength: 'primary', evidenceTier: 'A' },
      { compoundId: 'rala', role: 'Regenerates spent glutathione and other antioxidants back to their reduced form, keeping the NRF2-built defense network cycling rather than depleting', strength: 'secondary', evidenceTier: 'B' },
      { compoundId: 'omega3', role: 'Parallel, non-NRF2 anti-inflammatory axis (specialized pro-resolving mediators) that complements rather than duplicates NRF2\'s NF-κB suppression', strength: 'secondary', evidenceTier: 'A' },
    ],
    relatedHallmarkIds: ['genomic', 'inflammation', 'proteostasis'],
    relatedSynergySlugs: ['glynac-nrf2-triad'],
    furtherReading: [
      { label: 'NRF2 Defense Triad', href: '/library/synergies/glynac-nrf2-triad' },
      { label: 'Genomic Instability hallmark', href: '/library/genomic-instability' },
      { label: 'Sulforaphane vs Curcumin', href: '/library/compare/sulforaphane-vs-curcumin' },
    ],
  },
  {
    slug: 'sirtuin-nad-axis',
    name: 'Sirtuin / NAD+ Axis',
    tagline: 'Seven NAD+-dependent deacetylases that fail together when the NAD+ pool runs dry',
    theme: 'cyan',
    keyMolecules: ['SIRT1–7', 'NAD+', 'NAMPT', 'PARP1/2', 'CD38', 'PGC-1α'],
    diagramNodes: [
      { id: 'decline', label: 'NAD+ decline', sublabel: '↓50% by 60', accent: 'rose' },
      { id: 'nmn', label: 'NMN', sublabel: 'NAMPT bypass', accent: 'cyan' },
      { id: 'sirtuins', label: 'SIRT1–7 active', sublabel: 'cosubstrate restored', accent: 'violet' },
      { id: 'output', label: 'Biogenesis + repair + chromatin', sublabel: 'PGC-1α, PARP, SIRT6', accent: 'emerald' },
    ],
    diagramEdges: [
      { from: 'decline', to: 'nmn', label: 'precursor restores pool' },
      { from: 'nmn', to: 'sirtuins', label: 'resveratrol amplifies' },
      { from: 'sirtuins', to: 'output', label: 'deacetylation' },
    ],
    synthesis: [
      'Sirtuins (SIRT1 through SIRT7) are deacetylases — they remove acetyl groups from target proteins to switch them on or off — but every one of them is strictly NAD+-dependent. NAD+ isn\'t optional fuel for sirtuins, it\'s a consumed cosubstrate: each deacetylation reaction converts one NAD+ into nicotinamide, which must be recycled back through NAMPT (the rate-limiting salvage enzyme) or replenished from a precursor. NAD+ pools decline roughly 50% between ages 40 and 60, both because NAMPT activity falls and because CD38, an NAD+-consuming ectoenzyme, rises with age and inflammation — a pincer that starves every sirtuin simultaneously, not just one.',
      'This is why NAD+ precursors (NMN) and sirtuin activators (resveratrol, pterostilbene) are complementary rather than redundant: a precursor refills the tank, an activator makes the engine run more efficiently on the fuel that\'s there. Neither substitutes for the other — NMN alone can raise NAD+ without SIRT1 activity rising proportionally, and resveratrol\'s allosteric SIRT1 activation has nothing to work with if the NAD+ pool is empty.',
      'PARP1/2, the DNA-repair enzymes, compete with sirtuins for the same NAD+ pool — during heavy DNA damage, PARP activity can consume enough NAD+ to stall sirtuin function elsewhere in the cell. That\'s the mechanistic link between this pathway and genomic instability: restoring NAD+ isn\'t just a sirtuin story, it\'s simultaneously a DNA-repair-capacity story.',
    ],
    whyItMatters: 'This pathway has the broadest single-axis reach on the site — mitochondrial dysfunction (SIRT3 mitophagy), epigenetic alterations (SIRT1/SIRT6 chromatin regulation), genomic instability (PARP/SIRT6 competition for NAD+), and stem cell exhaustion (NAD+-dependent stem cell maintenance) all trace back to the same NAD+ pool.',
    levers: [
      { compoundId: 'nmn', role: 'Direct NAD+ precursor, bypassing the NAMPT rate-limiting step — the strongest human NAD+-elevation data on this site', strength: 'primary', evidenceTier: 'A' },
      { compoundId: 'resveratrol', role: 'Allosteric SIRT1 activator — amplifies sirtuin activity but requires the NAD+ pool NMN restores to have anything to work with', strength: 'primary', evidenceTier: 'B' },
      { compoundId: 'pterostilbene', role: 'Resveratrol analog with materially higher oral bioavailability; same SIRT1 mechanism', strength: 'secondary', evidenceTier: 'B' },
      { compoundId: 'cakg', role: 'TCA-cycle and epigenetic cofactor that supports the same mitochondrial/epigenetic output this axis drives, one step downstream', strength: 'secondary', evidenceTier: 'B' },
    ],
    relatedHallmarkIds: ['mito', 'epigenetic', 'genomic', 'stem'],
    relatedSynergySlugs: ['nmn-resveratrol-sirt1', 'nad-mito-stack'],
    furtherReading: [
      { label: 'SIRT1 Activation Pair', href: '/library/synergies/nmn-resveratrol-sirt1' },
      { label: 'NAD+ Mitochondrial Stack', href: '/library/synergies/nad-mito-stack' },
      { label: 'NMN vs NR', href: '/library/compare/nmn-vs-nr' },
    ],
  },
  {
    slug: 'mtor-nutrient-sensing',
    name: 'mTOR / Nutrient Sensing',
    tagline: 'The growth-vs-repair master switch — the most-replicated pharmacological lifespan lever in mammals',
    theme: 'rose',
    keyMolecules: ['mTORC1', 'ULK1', 'S6K1', '4E-BP1', 'FKBP12', 'AMPK'],
    diagramNodes: [
      { id: 'growth', label: 'Growth signals', sublabel: 'amino acids, glucose', accent: 'amber' },
      { id: 'mtor', label: 'mTORC1 active', sublabel: 'chronic with age', accent: 'rose' },
      { id: 'blocked', label: 'ULK1 inhibited', sublabel: 'autophagy OFF', accent: 'violet' },
      { id: 'brake', label: 'Rapamycin / AMPK', sublabel: 'FKBP12, berberine', accent: 'cyan' },
      { id: 'output', label: 'Autophagy restored', sublabel: 'repair-heavy state', accent: 'emerald' },
    ],
    diagramEdges: [
      { from: 'growth', to: 'mtor', label: 'activates' },
      { from: 'mtor', to: 'blocked', label: 'phosphorylates' },
      { from: 'blocked', to: 'brake', label: 'intervention point' },
      { from: 'brake', to: 'output', label: 'releases brake' },
    ],
    synthesis: [
      'mTOR Complex 1 (mTORC1) is the cell\'s growth-signal integrator — when amino acids, glucose, and growth factors are abundant, mTORC1 activity is high, and it phosphorylates targets (S6K1, 4E-BP1) that drive protein synthesis and cell growth while simultaneously phosphorylating and inhibiting ULK1, the kinase that initiates autophagy. In plain terms: when the cell thinks it\'s well-fed, it stops cleaning house. With age, this balance skews toward chronically elevated mTORC1 signaling even without genuine nutrient abundance, suppressing autophagy exactly when damaged-protein clearance matters most.',
      'Rapamycin (sirolimus) is the direct pharmacological lever here — it binds FKBP12, and that complex inhibits mTORC1 specifically, mimicking the repair-heavy state of caloric restriction without requiring actual fasting. It has the strongest replicated lifespan-extension data of any pharmacological intervention in mammals (the Interventions Testing Program\'s late-life-start mouse studies), but it is prescription-only, immunosuppressive at continuous doses, and has no completed human longevity endpoint trial — which is why this site treats it as an educational reference, not a Stack Architect toggle.',
      'The OTC compounds on this site approach the same mTOR/autophagy axis from upstream: AMPK activation (berberine) suppresses mTORC1 indirectly, and sirtuin activation (NMN/resveratrol) shifts the SIRT1/mTOR balance without directly inhibiting the complex. None of them replicate rapamycin\'s direct, potent mTORC1 inhibition — they\'re a different, gentler entry point into the same growth-vs-repair switch.',
    ],
    whyItMatters: 'This is the mechanistic core of deregulated nutrient sensing and disabled macroautophagy — the hallmark most directly validated by caloric restriction\'s lifespan effects across every model organism tested, from yeast to primates.',
    levers: [
      { name: 'Rapamycin (Rx)', href: '/library/compounds/rapamycin', role: 'Direct FKBP12-mediated mTORC1 inhibition — the reference-standard nutrient-sensing lever, physician-supervised only, not a Stack Architect toggle', strength: 'primary', evidenceTier: 'B' },
      { compoundId: 'berberine', role: 'AMPK activation suppresses mTORC1 indirectly — the OTC compound closest to rapamycin\'s mechanism, though far less potent', strength: 'secondary', evidenceTier: 'A' },
      { compoundId: 'spermidine', role: 'EP300 inhibition induces autophagy through a pathway parallel to, not dependent on, mTOR suppression', strength: 'secondary', evidenceTier: 'B' },
      { compoundId: 'nmn', role: 'SIRT1 activation counterbalances mTOR signaling as NAD+ decline removes that brake with age', strength: 'secondary', evidenceTier: 'B' },
    ],
    relatedHallmarkIds: ['nutrient', 'autophagy', 'senescence'],
    relatedSynergySlugs: [],
    furtherReading: [
      { label: 'Rapamycin compound module', href: '/library/compounds/rapamycin' },
      { label: 'Rapamycin vs Metformin', href: '/library/compare/rapamycin-vs-metformin' },
      { label: 'Disabled Macroautophagy hallmark', href: '/library/disabled-macroautophagy' },
    ],
  },
  {
    slug: 'mitochondrial-quality-control',
    name: 'Mitochondrial Quality Control',
    tagline: 'Electron transport, redox defense, and selective recycling of damaged organelles',
    theme: 'violet',
    keyMolecules: ['Complex I–IV', 'CoQ10', 'PINK1/Parkin', 'PGC-1α', 'ROS'],
    diagramNodes: [
      { id: 'leak', label: 'ETC electron leak', sublabel: 'ROS ↑ with age', accent: 'rose' },
      { id: 'buffer', label: 'CoQ10 + R-ALA', sublabel: 'membrane defense', accent: 'cyan' },
      { id: 'damaged', label: 'Damaged mitochondria', sublabel: 'tagged for removal', accent: 'amber' },
      { id: 'pink1', label: 'PINK1/Parkin', sublabel: 'urolithin A', accent: 'violet' },
      { id: 'output', label: 'Mitophagy clearance', sublabel: 'quality control', accent: 'emerald' },
    ],
    diagramEdges: [
      { from: 'leak', to: 'buffer', label: 'neutralizes ROS' },
      { from: 'leak', to: 'damaged', label: 'unbuffered damage' },
      { from: 'damaged', to: 'pink1', label: 'activates' },
      { from: 'pink1', to: 'output', label: 'selective recycling' },
    ],
    synthesis: [
      'Mitochondria fail with age through three compounding mechanisms: the electron transport chain leaks more reactive oxygen species as its components degrade, biogenesis signaling (PGC-1α) weakens so fewer new mitochondria replace damaged ones, and mitophagy — the selective autophagic clearance of dysfunctional mitochondria, tagged for removal by the PINK1/Parkin system — backs up, letting damaged organelles accumulate instead of being recycled. The metabolic signature is measurable: aging tissue shifts toward glycolysis even when well-oxygenated, because oxidative phosphorylation capacity has genuinely declined.',
      'CoQ10 sits directly in the electron transport chain as an electron shuttle between Complex I/II and Complex III, and doubles as the primary lipid-phase antioxidant protecting the membrane it\'s embedded in — but once oxidized, it depends on recycling systems (including R-ALA\'s reduced form, dihydrolipoic acid) to return to active form. Urolithin A works downstream of that, directly activating PINK1/Parkin-mediated mitophagy — the first compound on this site with genuine human RCT evidence (a Phase 2 trial) for stimulating mitochondrial clearance specifically, not just protecting existing mitochondria from damage.',
      'Humanin, a mitochondrial-DNA-encoded peptide, adds a third layer — cytoprotective, anti-apoptotic signaling that keeps stressed mitochondria from triggering cell death prematurely. Human evidence here is observational only (circulating levels correlate with age), not interventional.',
    ],
    whyItMatters: 'Mitochondrial dysfunction has the highest TNiC intervention coverage of any hallmark (95%) precisely because this pathway has multiple, mechanistically distinct entry points — substrate protection, electron transport support, and active clearance — that don\'t compete with each other for the same molecular target.',
    levers: [
      { compoundId: 'coq10', role: 'Electron transport chain Complex I–III cofactor and primary lipid-phase membrane antioxidant', strength: 'primary', evidenceTier: 'B' },
      { compoundId: 'urolithina', role: 'Direct PINK1/Parkin mitophagy activator — Phase 2 RCT evidence for stimulating clearance of damaged mitochondria specifically', strength: 'primary', evidenceTier: 'A' },
      { compoundId: 'rala', role: 'Dual aqueous/lipid antioxidant at the inner mitochondrial membrane; regenerates oxidized CoQ10 and glutathione', strength: 'secondary', evidenceTier: 'B' },
      { compoundId: 'nmn', role: 'NAD+ restoration fuels SIRT3, the mitochondrial sirtuin that deacetylates and activates the PINK1/Parkin quality-control machinery', strength: 'secondary', evidenceTier: 'A' },
      { peptideId: 'humanin', role: 'Cytoprotective, anti-apoptotic signaling in stressed mitochondria — human evidence is observational, not interventional', strength: 'secondary', evidenceTier: 'C' },
    ],
    relatedHallmarkIds: ['mito'],
    relatedSynergySlugs: ['coq10-rala-redox-recycling', 'nad-mito-stack'],
    furtherReading: [
      { label: 'Redox Recycling Pair', href: '/library/synergies/coq10-rala-redox-recycling' },
      { label: 'NAD+ Mitochondrial Stack', href: '/library/synergies/nad-mito-stack' },
      { label: 'Mitochondrial Dysfunction hallmark', href: '/library/mitochondrial-dysfunction' },
    ],
  },
  {
    slug: 'senescence-clearance',
    name: 'Senescence Clearance',
    tagline: 'Selectively removing zombie cells versus just suppressing what they secrete',
    theme: 'rose',
    keyMolecules: ['p16INK4a', 'p21', 'SASP', 'BCL-2/BCL-XL', 'NF-κB'],
    diagramNodes: [
      { id: 'stress', label: 'DNA / replicative stress', sublabel: 'p16, p21 rise', accent: 'rose' },
      { id: 'arrest', label: 'Senescent arrest', sublabel: 'stops dividing', accent: 'amber' },
      { id: 'survival', label: 'BCL-2/BCL-XL', sublabel: 'blocks apoptosis', accent: 'violet' },
      { id: 'fisetin', label: 'Fisetin (pulsed)', sublabel: 'inhibits survival proteins', accent: 'cyan' },
      { id: 'output', label: 'Selective apoptosis', sublabel: 'SASP source cleared', accent: 'emerald' },
    ],
    diagramEdges: [
      { from: 'stress', to: 'arrest', label: 'p53/p21 signaling' },
      { from: 'arrest', to: 'survival', label: 'upregulates' },
      { from: 'survival', to: 'fisetin', label: 'target for inhibition' },
      { from: 'fisetin', to: 'output', label: 'unblocks apoptosis' },
    ],
    synthesis: [
      'Senescent cells stop dividing but refuse to die — they persist and secrete a cocktail of inflammatory cytokines, proteases, and growth factors called the Senescence-Associated Secretory Phenotype (SASP), which damages surrounding healthy tissue and can even induce senescence in neighboring cells. Senescent cells survive by upregulating anti-apoptotic proteins, particularly BCL-2 and BCL-XL, that block the death signals a normal damaged cell would respond to. Senolytics are compounds that selectively disable those survival proteins, letting the cell\'s already-primed apoptotic machinery finish the job — clearing the cell rather than merely quieting what it secretes.',
      'Fisetin is this site\'s most-evidenced senolytic: it inhibits BCL-2/BCL-XL, and a Mayo Clinic pilot RCT using an intermittent high-dose pulse protocol (not daily dosing) reduced p16INK4a and p21 senescence markers in older adults while improving physical function — genuinely different from continuous-dosing supplements, and the protocol difference matters clinically, not just academically.',
      'Two upstream levers reduce the rate of NEW senescent cells forming rather than clearing existing ones: rapamycin\'s mTOR inhibition slows the stress signaling that pushes cells into senescence in the first place, and urolithin A / spermidine\'s autophagy induction clears sub-lethally damaged cells before they commit to the senescent, SASP-secreting state. Combined with a true senolytic, that\'s three distinct time points in the same process — prevent, intercept, clear — rather than three redundant attempts at one.',
    ],
    whyItMatters: 'Cellular senescence is a genuine amplifier hallmark — SASP output accelerates chronic inflammation, proteostasis collapse, and stem-cell-niche exhaustion in surrounding tissue, so clearing senescent cells has outsized leverage relative to the fraction of total cells they represent.',
    levers: [
      { compoundId: 'fisetin', role: 'BCL-2/BCL-XL inhibition → selective senescent-cell apoptosis, pulsed protocol — Mayo Clinic pilot RCT evidence', strength: 'primary', evidenceTier: 'B' },
      { name: 'Rapamycin (Rx)', href: '/library/compounds/rapamycin', role: 'mTOR inhibition slows the rate of new senescent-cell formation — prevention, not clearance', strength: 'secondary', evidenceTier: 'B' },
      { compoundId: 'urolithina', role: 'Mitophagy reduces the mitochondrial stress signaling that pushes damaged cells toward senescence', strength: 'secondary', evidenceTier: 'A' },
      { compoundId: 'spermidine', role: 'Autophagy clears sub-lethally damaged, pre-senescent cells before they commit to the SASP-secreting state', strength: 'secondary', evidenceTier: 'B' },
    ],
    relatedHallmarkIds: ['senescence', 'communication'],
    relatedSynergySlugs: [],
    furtherReading: [
      { label: 'Cellular Senescence hallmark', href: '/library/cellular-senescence' },
      { label: 'Fisetin vs Quercetin', href: '/library/compare/fisetin-vs-quercetin' },
      { label: 'Fisetin compound module', href: '/library/compounds/fisetin' },
    ],
  },
];

export function getPathwayBySlug(slug: string): Pathway | undefined {
  return pathways.find((p) => p.slug === slug);
}

export function getAllPathwaySlugs(): string[] {
  return pathways.map((p) => p.slug);
}
