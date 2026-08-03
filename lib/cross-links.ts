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
  ...HALLMARKS.map((h) => ({ names: [h.name], href: `/library/${h.slug}` })),
];

/**
 * Flattened {name, href} pairs sorted longest-name-first so multi-word names
 * (e.g. "Nicotinamide Mononucleotide") match before their shorter aliases.
 */
export const crossLinkTerms: Array<{ name: string; href: string }> = crossLinks
  .flatMap((c) => c.names.map((name) => ({ name, href: c.href })))
  .sort((a, b) => b.name.length - a.name.length);
