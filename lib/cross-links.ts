/**
 * Prose cross-link map for the MDX renderer. The first on-page mention of a
 * compound or hallmark name (outside existing links, headings, and code) is
 * linked to its deep-dive — the automatic half of the site's topical-cluster
 * interlinking, complementing the hand-authored synergy/related sections.
 *
 * Kept deliberately conservative: canonical names + a few well-known aliases
 * only, one link per term per page, and never a self-link (the current page's
 * own href is excluded at render time). `cross-links.test.ts` asserts every
 * href here resolves to a real compound or hallmark route, so an entry can
 * never rot into a dead link.
 */
export interface CrossLink {
  /** Prose forms to match, case-insensitive, on a word boundary. */
  names: string[];
  href: string;
}

/** slug → extra prose names for compounds whose display name isn't the slug. */
const COMPOUND_NAMES: Record<string, string[]> = {
  nmn: ['NMN', 'Nicotinamide Mononucleotide'],
  nr: ['NR', 'Nicotinamide Riboside'],
  glynac: ['GlyNAC'],
  cakg: ['Ca-AKG', 'Calcium Alpha-Ketoglutarate'],
  rala: ['R-ALA', 'R-Alpha Lipoic Acid', 'R-Lipoic Acid'],
  nac: ['NAC', 'N-Acetylcysteine'],
  pqq: ['PQQ', 'Pyrroloquinoline Quinone'],
  coq10: ['CoQ10', 'Ubiquinol', 'Coenzyme Q10'],
  egcg: ['EGCG'],
  tudca: ['TUDCA'],
  tmg: ['TMG', 'Trimethylglycine', 'Betaine'],
  'urolithin-a': ['Urolithin A'],
  'l-citrulline': ['L-Citrulline', 'Citrulline'],
  'l-carnosine': ['L-Carnosine', 'Carnosine'],
  omega3: ['Omega-3', 'Omega-3 (EPA + DHA)'],
  'vitamin-d3': ['Vitamin D3', 'Cholecalciferol'],
  'vitamin-k2': ['Vitamin K2', 'MK-7'],
  '17a-estradiol': ['17-alpha-Estradiol', '17α-Estradiol'],
  grapeseed: ['Grape Seed Extract', 'Grape Seed'],
  'hyaluronic-acid': ['Hyaluronic Acid'],
  canagliflozin: ['Canagliflozin'],
  gynostemma: ['Gynostemma'],
  boswellia: ['Boswellia'],
  lithium: ['Low-Dose Lithium'],
  tocotrienols: ['Tocotrienols'],
  // The 2026 library expansion — distinctive prose forms only (bare "cocoa",
  // "collagen", "nitrate" are too generic and would over-match).
  'aged-garlic': ['Aged Garlic Extract', 'Aged Garlic'],
  'beetroot-nitrate': ['Beetroot Nitrate', 'Dietary Nitrate', 'Beetroot'],
  bergamot: ['Citrus Bergamot', 'Bergamot'],
  citicoline: ['Citicoline', 'CDP-Choline'],
  'cocoa-flavanols': ['Cocoa Flavanols', 'Cocoa Flavanol'],
  'collagen-peptides': ['Collagen Peptides', 'Collagen Peptide', 'Collagen Hydrolysate'],
  'l-theanine': ['L-Theanine', 'Theanine'],
  'lions-mane': ["Lion's Mane", 'Lions Mane', 'Hericium erinaceus'],
  mitoq: ['MitoQ', 'Mitoquinol'],
  nattokinase: ['Nattokinase'],
};

/** Compounds linked by their title-cased slug when no custom name is needed. */
const SIMPLE_COMPOUNDS = [
  'apigenin', 'ashwagandha', 'astaxanthin', 'berberine', 'butyrate', 'creatine',
  'curcumin', 'dasatinib', 'ergothioneine', 'fisetin', 'glucosamine', 'glycine',
  'hesperidin', 'inulin', 'luteolin', 'magnesium', 'melatonin', 'metformin',
  'nicotinamide', 'pterostilbene', 'quercetin', 'rapamycin', 'resveratrol',
  'rhodiola', 'selenium', 'spermidine', 'sulforaphane', 'taurine', 'zinc',
  'acarbose',
];

/** Peptide deep-dives — distinctive names, low false-positive risk. Bridges the
 * peptide library into the same prose interlink graph as compounds/hallmarks. */
const PEPTIDE_NAMES: Record<string, string[]> = {
  'bpc-157': ['BPC-157'],
  'ghk-cu': ['GHK-Cu'],
  epithalon: ['Epithalon', 'Epitalon'],
  'thymosin-alpha-1': ['Thymosin Alpha-1', 'Thymosin α-1'],
  'gh-secretagogues': ['Ipamorelin', 'CJC-1295'],
  'mots-c': ['MOTS-c'],
  'glp1-longevity': ['Semaglutide', 'Tirzepatide'],
  humanin: ['Humanin'],
};

/** Molecular pathways (lib/pathways.ts) — slug → prose aliases. These are the
 * mechanistic actors that saturate mechanism prose, so linking them is the
 * highest-density interlinking win. Kept in sync with pathways.ts by
 * cross-links.test.ts. */
const PATHWAY_NAMES: Record<string, string[]> = {
  'nad-plus': ['NAD+', 'NAD⁺'],
  sirt1: ['SIRT1', 'Sirtuin 1'],
  sirt3: ['SIRT3', 'Sirtuin 3'],
  sirt6: ['SIRT6', 'Sirtuin 6'],
  parp: ['PARP1/2', 'PARP-1', 'PARP1', 'PARP'],
  cd38: ['CD38'],
  mtor: ['mTORC1', 'mTOR'],
  ampk: ['AMPK'],
  foxo3: ['FOXO3', 'FOXO'],
  'pink1-parkin': ['PINK1/Parkin', 'PINK1', 'Parkin'],
  'pgc-1-alpha': ['PGC-1α', 'PGC-1alpha', 'PGC1α', 'PGC-1a'],
  tfeb: ['TFEB'],
  ulk1: ['ULK1'],
  nrf2: ['NRF2/KEAP1', 'NRF2', 'KEAP1'],
  'nf-kb': ['NF-κB', 'NF-kappaB', 'NF-kB', 'NFkB'],
  nlrp3: ['NLRP3', 'inflammasome'],
  glutathione: ['Glutathione', 'GSH'],
  'enos-no': ['eNOS', 'nitric oxide'],
  'gsk-3-beta': ['GSK-3β', 'GSK-3', 'GSK3'],
};

const HALLMARKS: Array<{ name: string; slug: string }> = [
  { name: 'Genomic Instability', slug: 'genomic-instability' },
  { name: 'Telomere Attrition', slug: 'telomere-attrition' },
  { name: 'Epigenetic Alterations', slug: 'epigenetic-alterations' },
  { name: 'Loss of Proteostasis', slug: 'loss-of-proteostasis' },
  { name: 'Disabled Autophagy', slug: 'disabled-autophagy' },
  { name: 'Mitochondrial Dysfunction', slug: 'mitochondrial-dysfunction' },
  { name: 'Cellular Senescence', slug: 'cellular-senescence' },
  { name: 'Stem Cell Exhaustion', slug: 'stem-cell-exhaustion' },
  { name: 'Altered Intercellular Communication', slug: 'altered-intercellular-communication' },
  { name: 'Chronic Inflammation', slug: 'chronic-inflammation' },
  { name: 'Dysbiosis', slug: 'dysbiosis' },
  { name: 'Disabled Macroautophagy', slug: 'disabled-macroautophagy' },
];

function titleCase(slug: string): string {
  return slug.replace(/(^|-)([a-z])/g, (_m, sep, c) => (sep ? ' ' : '') + c.toUpperCase()).trim();
}

export const crossLinks: CrossLink[] = [
  ...Object.entries(COMPOUND_NAMES).map(([slug, names]) => ({
    names,
    href: `/library/compounds/${slug}`,
  })),
  ...SIMPLE_COMPOUNDS.map((slug) => ({
    names: [titleCase(slug)],
    href: `/library/compounds/${slug}`,
  })),
  ...Object.entries(PEPTIDE_NAMES).map(([slug, names]) => ({
    names,
    href: `/peptides/${slug}`,
  })),
  ...Object.entries(PATHWAY_NAMES).map(([slug, names]) => ({
    names,
    href: `/pathways/${slug}`,
  })),
  ...HALLMARKS.map((h) => ({ names: [h.name], href: `/library/${h.slug}` })),
];

/**
 * Flattened {name, href} pairs sorted longest-name-first so multi-word names
 * (e.g. "Nicotinamide Mononucleotide") match before their shorter aliases.
 */
export const crossLinkTerms: Array<{ name: string; href: string }> = crossLinks
  .flatMap((c) => c.names.map((name) => ({ name, href: c.href })))
  .sort((a, b) => b.name.length - a.name.length);
