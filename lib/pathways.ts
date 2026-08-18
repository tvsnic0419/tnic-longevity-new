/**
 * Molecular pathway registry — the mechanistic actors (PINK1/Parkin, SIRT3,
 * NRF2, AMPK, mTOR, NAD+ …) that compounds engage and that connect to the
 * hallmarks of aging. This is the "verb" layer between compounds (what you
 * take) and hallmarks (what ages): the pathway is *how* a compound moves a
 * hallmark. Every relationship below is established biology, cross-referenced
 * against the compound `pathway` fields (lib/data.ts) and hallmark
 * `keyMolecules` (lib/hallmarks-library.ts). `pathways.test.ts` guards that
 * every referenced hallmark id and compound slug resolves.
 */

export type PathwayCategory = 'sirtuins' | 'sensing' | 'mitophagy' | 'defense' | 'signaling';

export interface Pathway {
  slug: string;
  name: string;
  /** Prose forms matched by the cross-linker (case-insensitive, word-boundary). */
  aliases: string[];
  category: PathwayCategory;
  /** One-line "what it is". */
  summary: string;
  /** 2–3 sentence role in aging biology. */
  role: string;
  /** Hallmark ids (lib/hallmarks-library.ts) this pathway acts on. */
  hallmarkIds: string[];
  /** Compound module slugs that engage this pathway. */
  compoundSlugs: string[];
}

export const pathwayCategoryMeta: Record<PathwayCategory, { label: string; description: string; theme: string }> = {
  sirtuins: {
    label: 'NAD⁺ & Sirtuins',
    description: 'The NAD⁺-dependent deacetylases and repair enzymes that translate energy status into DNA repair, mitophagy, and epigenetic maintenance.',
    theme: 'cyan',
  },
  sensing: {
    label: 'Nutrient Sensing',
    description: 'The growth-vs-repair switches — mTOR, AMPK, FOXO — that decide whether a cell builds or maintains.',
    theme: 'violet',
  },
  mitophagy: {
    label: 'Mitochondrial Quality',
    description: 'Mitophagy and biogenesis pathways that clear damaged mitochondria and build new ones.',
    theme: 'emerald',
  },
  defense: {
    label: 'Cellular Defense',
    description: 'The antioxidant and inflammatory master switches — NRF2, NF-κB, the inflammasome — that set redox and inflammatory tone.',
    theme: 'amber',
  },
  signaling: {
    label: 'Signaling & Repair',
    description: 'Vascular, neuronal, and proteostasis signaling nodes that compounds act through.',
    theme: 'rose',
  },
};

export const pathways: Pathway[] = [
  // ── NAD⁺ & Sirtuins ──────────────────────────────────────────────────────
  {
    slug: 'nad-plus',
    name: 'NAD⁺',
    aliases: ['NAD+', 'NAD⁺'],
    category: 'sirtuins',
    summary: 'The central redox and signaling coenzyme every sirtuin and PARP depends on — and it falls ~50% between ages 40 and 60.',
    role: 'NAD⁺ is the fuel, not the enzyme: sirtuins (SIRT1–7), PARPs, and CD38 all consume it. As NAD⁺ declines with age, mitophagy, DNA repair, and epigenetic maintenance all lose their power source at once — which is why restoring the pool is one of the highest-leverage single targets in longevity biochemistry.',
    hallmarkIds: ['mito', 'genomic', 'epigenetic', 'senescence', 'nutrient'],
    compoundSlugs: ['nmn', 'nr', 'nicotinamide', 'tmg'],
  },
  {
    slug: 'sirt1',
    name: 'SIRT1',
    aliases: ['SIRT1', 'Sirtuin 1'],
    category: 'sirtuins',
    summary: 'The NAD⁺-dependent deacetylase that couples energy status to epigenetic maintenance, autophagy, and inflammatory restraint.',
    role: 'SIRT1 deacetylates histones and metabolic regulators (PGC-1α, FOXO, NF-κB), linking a healthy NAD⁺ pool to slower epigenetic drift and calmer inflammaging. It is the node resveratrol and pterostilbene are best known for activating.',
    hallmarkIds: ['epigenetic', 'senescence', 'autophagy', 'nutrient', 'stem'],
    compoundSlugs: ['resveratrol', 'pterostilbene', 'nmn', 'nr'],
  },
  {
    slug: 'sirt3',
    name: 'SIRT3',
    aliases: ['SIRT3', 'Sirtuin 3'],
    category: 'sirtuins',
    summary: 'The mitochondrial sirtuin that deacetylates metabolic enzymes and enables mitochondrial quality control.',
    role: 'SIRT3 tunes the mitochondrial acetylome — activating SOD2 antioxidant defense and enzymes of fat oxidation and the TCA cycle. Because it runs on NAD⁺, restoring NAD⁺ is the primary lever on SIRT3 activity.',
    hallmarkIds: ['mito', 'genomic'],
    compoundSlugs: ['nmn', 'nr', 'cakg'],
  },
  {
    slug: 'sirt6',
    name: 'SIRT6',
    aliases: ['SIRT6', 'Sirtuin 6'],
    category: 'sirtuins',
    summary: 'The chromatin sirtuin governing DNA double-strand-break repair, telomere maintenance, and genome stability.',
    role: 'SIRT6 stabilizes telomeric chromatin and promotes double-strand-break repair; its decline links genomic instability to telomere attrition. Like all sirtuins it is NAD⁺-dependent.',
    hallmarkIds: ['genomic', 'telomeres', 'epigenetic'],
    compoundSlugs: ['nmn', 'nr'],
  },
  {
    slug: 'parp',
    name: 'PARP1/2',
    aliases: ['PARP1', 'PARP-1', 'PARP1/2', 'PARP'],
    category: 'sirtuins',
    summary: 'DNA-damage sensors that repair strand breaks by consuming large amounts of NAD⁺.',
    role: 'When DNA damage accumulates, PARP1/2 activation burns through the NAD⁺ pool to drive repair — competing with sirtuins for the same fuel. This is why genomic instability and NAD⁺ decline reinforce each other with age.',
    hallmarkIds: ['genomic'],
    compoundSlugs: ['nmn', 'nr'],
  },
  {
    slug: 'cd38',
    name: 'CD38',
    aliases: ['CD38'],
    category: 'sirtuins',
    summary: 'An NAD⁺-degrading ectoenzyme that rises with age and inflammation, draining the NAD⁺ pool.',
    role: 'CD38 expression climbs with inflammaging and is a major consumer of NAD⁺ — so lowering CD38 activity is a complementary strategy to adding precursors. Several flavonoids (apigenin, quercetin) are studied as CD38 inhibitors.',
    hallmarkIds: ['inflammation', 'mito'],
    compoundSlugs: ['apigenin', 'quercetin', 'luteolin'],
  },
  // ── Nutrient sensing ─────────────────────────────────────────────────────
  {
    slug: 'mtor',
    name: 'mTOR',
    aliases: ['mTOR', 'mTORC1'],
    category: 'sensing',
    summary: 'The master growth kinase — when active it builds; when inhibited, cells shift to repair and autophagy.',
    role: 'mTORC1 senses nutrients and growth signals and, when chronically overactive with age, suppresses autophagy and drives cellular aging. Rapamycin is its direct inhibitor; caloric restriction, exercise, and AMPK activators dial it down indirectly.',
    hallmarkIds: ['nutrient', 'autophagy', 'proteostasis', 'stem'],
    compoundSlugs: ['rapamycin', 'berberine', 'resveratrol'],
  },
  {
    slug: 'ampk',
    name: 'AMPK',
    aliases: ['AMPK'],
    category: 'sensing',
    summary: 'The cellular low-energy sensor that switches on fat burning, mitochondrial biogenesis, and autophagy.',
    role: 'AMPK is the metabolic counterweight to mTOR: high AMPK + low mTOR puts a cell into maintenance mode. It is activated by exercise and caloric restriction and mimicked by berberine and metformin.',
    hallmarkIds: ['nutrient', 'autophagy', 'mito'],
    compoundSlugs: ['berberine', 'metformin', 'glucosamine', 'resveratrol'],
  },
  {
    slug: 'foxo3',
    name: 'FOXO3',
    aliases: ['FOXO3', 'FOXO'],
    category: 'sensing',
    summary: 'A longevity-associated transcription factor that turns on stress-resistance, antioxidant, and repair genes.',
    role: 'FOXO3 (one of the few genes consistently linked to human longevity) is activated downstream of AMPK and sirtuins to upregulate antioxidant defense, autophagy, and DNA repair — a broad "maintenance program" transcription factor.',
    hallmarkIds: ['proteostasis', 'genomic', 'senescence'],
    compoundSlugs: ['resveratrol', 'berberine', 'spermidine'],
  },
  // ── Mitochondrial quality ────────────────────────────────────────────────
  {
    slug: 'pink1-parkin',
    name: 'PINK1/Parkin',
    aliases: ['PINK1', 'Parkin', 'PINK1/Parkin'],
    category: 'mitophagy',
    summary: 'The sensor–tag pair that marks damaged mitochondria for selective recycling (mitophagy).',
    role: 'PINK1 accumulates on depolarized (damaged) mitochondria and recruits Parkin to tag them for autophagic clearance. Failing mitophagy lets dysfunctional mitochondria accumulate, leaking ROS and driving inflammaging — the gap urolithin A is studied to address.',
    hallmarkIds: ['mito', 'autophagy'],
    compoundSlugs: ['urolithin-a', 'spermidine'],
  },
  {
    slug: 'pgc-1-alpha',
    name: 'PGC-1α',
    aliases: ['PGC-1α', 'PGC-1alpha', 'PGC1α', 'PGC-1a'],
    category: 'mitophagy',
    summary: 'The master regulator of mitochondrial biogenesis — the making of new mitochondria.',
    role: 'PGC-1α (activated via CREB, AMPK, and SIRT1) drives the transcriptional program that builds new mitochondria. Pairing biogenesis (make new) with mitophagy (clear old) is the core of mitochondrial quality control.',
    hallmarkIds: ['mito'],
    compoundSlugs: ['pqq', 'cakg', 'coq10'],
  },
  {
    slug: 'tfeb',
    name: 'TFEB',
    aliases: ['TFEB'],
    category: 'mitophagy',
    summary: 'The transcription factor that switches on the autophagy–lysosome clearance program.',
    role: 'TFEB is the master switch for lysosomal biogenesis and autophagy gene expression; it is held back by mTORC1 and released when mTOR is inhibited or during fasting — coordinating the cell\'s whole recycling apparatus.',
    hallmarkIds: ['autophagy', 'proteostasis'],
    compoundSlugs: ['spermidine', 'resveratrol'],
  },
  {
    slug: 'ulk1',
    name: 'ULK1',
    aliases: ['ULK1'],
    category: 'mitophagy',
    summary: 'The kinase that initiates autophagosome formation — the first committed step of autophagy.',
    role: 'ULK1 sits directly downstream of the mTOR/AMPK balance: AMPK activates it and mTOR inhibits it, making ULK1 the on-switch that converts nutrient-sensing status into actual autophagy flux.',
    hallmarkIds: ['autophagy'],
    compoundSlugs: ['spermidine', 'resveratrol'],
  },
  // ── Cellular defense ─────────────────────────────────────────────────────
  {
    slug: 'nrf2',
    name: 'NRF2',
    aliases: ['NRF2', 'Nrf2', 'KEAP1', 'NRF2/KEAP1'],
    category: 'defense',
    summary: 'The master antioxidant switch that turns on 200+ cytoprotective and detoxification genes.',
    role: 'Held inactive by KEAP1 until a mild oxidative signal releases it, NRF2 then upregulates glutathione synthesis, NQO1, HO-1, and the wider antioxidant network. It is the hormetic target behind sulforaphane and the "activate your own defenses" strategy.',
    hallmarkIds: ['proteostasis', 'inflammation', 'genomic'],
    compoundSlugs: ['sulforaphane', 'curcumin', 'grapeseed', 'egcg', 'astaxanthin', 'luteolin'],
  },
  {
    slug: 'nf-kb',
    name: 'NF-κB',
    aliases: ['NF-κB', 'NF-kB', 'NFkB', 'NF-kappaB'],
    category: 'defense',
    summary: 'The central pro-inflammatory transcription factor whose chronic activation drives inflammaging.',
    role: 'NF-κB integrates stress, infection, and senescence signals into inflammatory gene expression. Its chronic low-grade activation is a core engine of inflammaging and the SASP — so dialing it down is the shared goal of most anti-inflammatory compounds.',
    hallmarkIds: ['inflammation', 'senescence', 'communication'],
    compoundSlugs: ['curcumin', 'boswellia', 'omega3', 'luteolin', 'tocotrienols', 'sulforaphane'],
  },
  {
    slug: 'nlrp3',
    name: 'NLRP3 inflammasome',
    aliases: ['NLRP3', 'inflammasome'],
    category: 'defense',
    summary: 'The innate-immune sensor complex that releases IL-1β and IL-18 — a key inflammaging amplifier.',
    role: 'The NLRP3 inflammasome converts cellular stress signals (including from senescent cells and damaged mitochondria) into potent inflammatory cytokines. Suppressing it is a targeted way to lower the inflammatory tone that accelerates most hallmarks.',
    hallmarkIds: ['inflammation', 'senescence'],
    compoundSlugs: ['sulforaphane', 'omega3', 'luteolin'],
  },
  {
    slug: 'glutathione',
    name: 'Glutathione (GSH)',
    aliases: ['Glutathione', 'GSH'],
    category: 'defense',
    summary: 'The body\'s most abundant endogenous antioxidant — depleted ~10–15% per decade after age 20.',
    role: 'Glutathione is the master intracellular redox buffer, made from glycine, cysteine, and glutamate. Restoring it (by supplying the rate-limiting precursors, as in GlyNAC) is foundational because so many downstream defenses depend on adequate GSH.',
    hallmarkIds: ['proteostasis', 'inflammation', 'genomic'],
    compoundSlugs: ['glynac', 'nac', 'glycine', 'rala', 'selenium'],
  },
  // ── Signaling & repair ───────────────────────────────────────────────────
  {
    slug: 'enos-no',
    name: 'eNOS / Nitric Oxide',
    aliases: ['eNOS', 'nitric oxide'],
    category: 'signaling',
    summary: 'The endothelial enzyme that makes nitric oxide — the signal that relaxes blood vessels.',
    role: 'Endothelial nitric-oxide synthase converts L-arginine to nitric oxide, driving vasodilation and healthy endothelial function. Age-related decline in NO availability underlies much vascular aging — the axis L-citrulline is studied to support.',
    hallmarkIds: ['communication', 'mito'],
    compoundSlugs: ['l-citrulline', 'taurine', 'magnesium'],
  },
  {
    slug: 'gsk-3-beta',
    name: 'GSK-3β',
    aliases: ['GSK-3β', 'GSK3', 'GSK-3'],
    category: 'signaling',
    summary: 'A multifunction kinase whose inhibition promotes autophagy and reduces tau phosphorylation.',
    role: 'GSK-3β sits at the crossroads of metabolism, autophagy, and neuronal maintenance; inhibiting it enhances autophagic clearance and lowers tau pathology — the mechanistic basis for interest in low-dose lithium.',
    hallmarkIds: ['autophagy', 'communication'],
    compoundSlugs: ['lithium'],
  },
];

export function getPathwayBySlug(slug: string): Pathway | undefined {
  return pathways.find((p) => p.slug === slug);
}

export function getPathwaysByCategory(category: PathwayCategory): Pathway[] {
  return pathways.filter((p) => p.category === category);
}

export function getAllPathwaySlugs(): string[] {
  return pathways.map((p) => p.slug);
}

/** Pathways a given compound engages (by module slug) — for compound pages. */
export function getPathwaysForCompound(compoundSlug: string): Pathway[] {
  return pathways.filter((p) => p.compoundSlugs.includes(compoundSlug));
}

/**
 * The molecular pathways that drive a given hallmark (by id), inverting
 * `pathway.hallmarkIds`. These resolve to linkable `/pathways/<slug>` deep-dives.
 * Named distinctly from `relations.ts`'s `getPathwaysForHallmark` (which returns
 * the high-level `PathwayGroup`s that have no pages) so the hallmark hub can link
 * down into the mechanistic layer it currently only receives links from.
 */
export function getMolecularPathwaysForHallmark(hallmarkId: string): Pathway[] {
  return pathways.filter((p) => p.hallmarkIds.includes(hallmarkId));
}

export const pathwayCategoryOrder: PathwayCategory[] = [
  'sirtuins',
  'sensing',
  'mitophagy',
  'defense',
  'signaling',
];
