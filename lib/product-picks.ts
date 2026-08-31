/**
 * Curated product picks — one recommended brand per compound with verified buy links.
 * Images are served locally from /public/products/ with SVG fallbacks per compound.
 */

export interface ProductPick {
  compoundId: string;
  compoundName: string;
  brand: string;
  productName: string;
  /** Local product photo (primary) */
  imageSrc: string;
  /** Illustrated fallback if primary fails to load */
  fallbackImageSrc: string;
  /** Manufacturer product / buy page */
  purchaseUrl: string;
  /** Optional legacy redirect target; prefer purchaseUrl for new picks */
  affiliateUrl?: string;
  /** Brand homepage */
  brandWebsite: string;
  /** Optional second product (e.g. GlyNAC needs glycine + NAC) */
  companionPurchase?: {
    label: string;
    purchaseUrl: string;
    affiliateUrl?: string;
    imageSrc?: string;
    fallbackImageSrc?: string;
  };
  /** ISO date when purchaseUrl was last verified */
  linkVerifiedAt?: string;
  whyThisPick: string;
  doseNote: string;
}

const PRODUCTS = '/products';

export const PRODUCT_PICKS: Record<string, ProductPick> = {
  glynac: {
    compoundId: 'glynac',
    compoundName: 'GlyNAC',
    brand: 'Nutri',
    productName: 'GlyNAC-ET 1800/375mg Extra Strength',
    imageSrc: `${PRODUCTS}/nutri-glynac-et.jpg`,
    fallbackImageSrc: `${PRODUCTS}/glynac.svg`,
    purchaseUrl:
      'https://www.gnc.com/brain-memory-support/580824.html',
    brandWebsite: 'https://www.gnc.com/brands/natures-fusions',
    linkVerifiedAt: '2026-07-05',
    whyThisPick:
      'Single-bottle GlyNAC-ET formula from Nutri/Nature’s Fusions with glycine plus NAC ethyl ester in one serving.',
    doseNote: 'Label serving: 3 capsules provides 1,800mg glycine + 375mg NAC ethyl ester; compare against protocol targets.',
  },
  nmn: {
    compoundId: 'nmn',
    compoundName: 'NMN',
    brand: 'Codeage Amen',
    productName: 'NMN Nicotinamide Mononucleotide 500mg',
    imageSrc: `${PRODUCTS}/nmn.jpg`,
    fallbackImageSrc: `${PRODUCTS}/nmn.svg`,
    purchaseUrl: 'https://www.codeage.com/products/amen-nmn-supplement',
    brandWebsite: 'https://www.codeage.com',
    linkVerifiedAt: '2026-06-18',
    whyThisPick:
      '500mg per capsule — matches common longevity protocol doses. Third-party tested.',
    doseNote: 'Typical: 500mg–1g daily. Start at 500mg.',
  },
  nr: {
    compoundId: 'nr',
    compoundName: 'NR (Nicotinamide Riboside)',
    brand: 'Tru Niagen',
    productName: 'Niagen® 300mg NR-Cl',
    imageSrc: `${PRODUCTS}/nmn.jpg`,
    fallbackImageSrc: `${PRODUCTS}/nmn.svg`,
    purchaseUrl: 'https://www.truniagen.com/products/tru-niagen',
    brandWebsite: 'https://www.truniagen.com',
    linkVerifiedAt: '2026-06-19',
    whyThisPick:
      'Pharmaceutical-grade NR-Cl (Niagen®) — the molecule used in published human NAD+ trials. Clear 300mg dose per capsule.',
    doseNote: 'Typical: 300–1000 mg/day NR. Start 300mg; retest NAD+ at week 4.',
  },
  sulforaphane: {
    compoundId: 'sulforaphane',
    compoundName: 'NRF2 / Sulforaphane',
    brand: 'Allergy Research Group',
    productName: 'Nrf2 Renew®',
    imageSrc: `${PRODUCTS}/nrf2-renew.png`,
    fallbackImageSrc: `${PRODUCTS}/sulforaphane.svg`,
    purchaseUrl: 'https://allergyresearchgroup.com/products/rf2-renew-120-vegetarian-capsules',
    brandWebsite: 'https://allergyresearchgroup.com',
    linkVerifiedAt: '2026-07-05',
    whyThisPick:
      'Broad NRF2 formula featuring sulforaphane plus green tea, green coffee, pomegranate, olive leaf, ginkgo, and milk thistle extracts.',
    doseNote: 'Label serving: 2 capsules daily provides 50mg sulforaphane plus botanicals; compare against protocol targets.',
  },
  resveratrol: {
    compoundId: 'resveratrol',
    compoundName: 'Resveratrol',
    brand: 'Thorne',
    productName: 'ResveraCel',
    imageSrc: `${PRODUCTS}/resveratrol.jpg`,
    fallbackImageSrc: `${PRODUCTS}/resveratrol.svg`,
    purchaseUrl: 'https://www.thorne.com/products/dp/resveracel',
    brandWebsite: 'https://www.thorne.com',
    linkVerifiedAt: '2026-06-18',
    whyThisPick:
      'Resveratrol + nicotinamide riboside stack. Thorne is a trusted clinical brand.',
    doseNote: 'Per label — typically 1–2 capsules daily.',
  },
  cakg: {
    compoundId: 'cakg',
    compoundName: 'Ca-AKG',
    brand: 'Toniiq',
    productName: 'Calcium AKG 1500',
    imageSrc: `${PRODUCTS}/toniiq-cakg.jpg`,
    fallbackImageSrc: `${PRODUCTS}/cakg.svg`,
    purchaseUrl: 'https://www.toniiq.com/products/calcium-akg',
    brandWebsite: 'https://www.toniiq.com',
    linkVerifiedAt: '2026-07-05',
    whyThisPick:
      'Manufacturer-direct Ca-AKG with 99%+ purity language, COA access, and third-party testing details.',
    doseNote: 'Label serving: 3 capsules daily for 1,500mg Ca-AKG. Compare with protocol target before use.',
  },
  rala: {
    compoundId: 'rala',
    compoundName: 'R-ALA',
    brand: 'GeroNova',
    productName: 'Bio-Enhanced R-Lipoic Acid 300mg',
    imageSrc: `${PRODUCTS}/rala.png`,
    fallbackImageSrc: `${PRODUCTS}/rala.svg`,
    purchaseUrl:
      'https://geronova.com/product/bio-enhanced-r-lipoic-acid-vegcaps-300mg-60caps/',
    brandWebsite: 'https://geronova.com',
    linkVerifiedAt: '2026-06-18',
    whyThisPick:
      'Stabilized R-form (not racemic ALA). 300mg matches common protocol doses.',
    doseNote: '300mg R-ALA daily, often split AM/PM.',
  },
  taurine: {
    compoundId: 'taurine',
    compoundName: 'Taurine',
    brand: 'Life Extension',
    productName: 'Taurine 1000 mg',
    imageSrc: `${PRODUCTS}/life-extension-taurine.png`,
    fallbackImageSrc: `${PRODUCTS}/nmn.svg`,
    purchaseUrl: 'https://www.lifeextension.com/vitamins-supplements/item01827/taurine',
    brandWebsite: 'https://www.lifeextension.com',
    linkVerifiedAt: '2026-07-05',
    whyThisPick:
      'Simple 1,000mg taurine capsule from an established clinical supplement brand, with gluten-free, Non-GMO, vegetarian labeling.',
    doseNote: 'Label: 1,000mg per capsule; many protocols use 1-3g/day, adjusted for diet and tolerance.',
  },
  spermidine: {
    compoundId: 'spermidine',
    compoundName: 'Spermidine',
    brand: 'Oxford Healthspan',
    productName: 'Primeadine® Original',
    imageSrc: `${PRODUCTS}/primeadine-original.jpg`,
    fallbackImageSrc: `${PRODUCTS}/resveratrol.svg`,
    purchaseUrl:
      'https://oxfordhealthspan.com/products/whole-food-spermidine-supplement-primeadine-original-1-bottle-30-day-supply',
    brandWebsite: 'https://oxfordhealthspan.com',
    linkVerifiedAt: '2026-07-05',
    whyThisPick:
      'Whole-food spermidine from concentrated Japanese wheat germ extract, with posted COA links and third-party testing language.',
    doseNote: 'Label serving: 3 capsules daily provides 1mg whole-food spermidine; avoid if wheat/gluten is unsuitable.',
  },
  pterostilbene: {
    compoundId: 'pterostilbene',
    compoundName: 'Pterostilbene',
    brand: 'Double Wood',
    productName: 'Pterostilbene Supplement',
    imageSrc: `${PRODUCTS}/double-wood-pterostilbene.jpg`,
    fallbackImageSrc: `${PRODUCTS}/resveratrol.svg`,
    purchaseUrl: 'https://doublewoodsupplements.com/products/pterostilbene',
    brandWebsite: 'https://doublewoodsupplements.com',
    linkVerifiedAt: '2026-07-05',
    whyThisPick:
      'Single-ingredient pterostilbene with manufacturer COA/test-result links and third-party testing for identity, potency, and contaminants.',
    doseNote: 'Label guidance centers on 100-200mg/day with food; monitor lipids if using long term.',
  },
  tudca: {
    compoundId: 'tudca',
    compoundName: 'TUDCA',
    brand: 'Double Wood',
    productName: 'TUDCA Supplement',
    imageSrc: `${PRODUCTS}/double-wood-tudca.jpg`,
    fallbackImageSrc: `${PRODUCTS}/rala.svg`,
    purchaseUrl: 'https://doublewoodsupplements.com/products/tudca',
    brandWebsite: 'https://doublewoodsupplements.com',
    linkVerifiedAt: '2026-07-05',
    whyThisPick:
      'Synthetic, non-animal TUDCA with batch COA/test-result links and cGMP plus third-party testing language.',
    doseNote: 'Label: 250mg per capsule; standard serving is 2 capsules for 500mg/day, preferably on an empty stomach.',
  },
};

export const productPicks: ProductPick[] = Object.values(PRODUCT_PICKS);

export function getProductPick(compoundId: string): ProductPick | undefined {
  return PRODUCT_PICKS[compoundId];
}

/**
 * Resolve the verified product picks referenced by a comparison slug of the
 * form `a-vs-b` (e.g. `nmn-vs-nr`). Each side is matched against the pick
 * registry; a side with no curated pick (e.g. `liposomal-glutathione`,
 * `metformin`, `coq10`) is simply omitted. Order is preserved (side A before
 * side B) and duplicates are dropped, so a comparison surfaces 0, 1, or 2 buy
 * paths and never a fabricated one. Stack/form slugs (`…-triad-vs-…-stack`)
 * resolve to nothing, which is the intended no-op.
 */
export function getComparePicks(slug: string): ProductPick[] {
  const seen = new Set<string>();
  const picks: ProductPick[] = [];
  for (const id of slug.split('-vs-')) {
    const pick = PRODUCT_PICKS[id];
    if (pick && !seen.has(id)) {
      seen.add(id);
      picks.push(pick);
    }
  }
  return picks;
}

export function getProductPickByName(compoundName: string): ProductPick | undefined {
  const key = compoundName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const aliases: Record<string, string> = {
    glynac: 'glynac',
    nmn: 'nmn',
    nicotinamidemononucleotide: 'nmn',
    sulforaphane: 'sulforaphane',
    resveratrol: 'resveratrol',
    caakg: 'cakg',
    calciumalphaketoglutarate: 'cakg',
    rala: 'rala',
    rlipoicacid: 'rala',
    rlipoic: 'rala',
    taurine: 'taurine',
    spermidine: 'spermidine',
    pterostilbene: 'pterostilbene',
    tudca: 'tudca',
  };
  const id = aliases[key];
  return id ? PRODUCT_PICKS[id] : undefined;
}
