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
  /**
   * Affiliate URL for this product. When set, /api/go/[productId] redirects
   * here instead of purchaseUrl. Leave undefined until affiliate program is active.
   */
  affiliateUrl?: string;
  /** Brand homepage */
  brandWebsite: string;
  /** Optional second product (e.g. GlyNAC needs glycine + NAC) */
  companionPurchase?: {
    label: string;
    purchaseUrl: string;
    /** Affiliate URL for the companion product */
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
    brand: 'Codeage',
    productName: 'Liposomal Glycine + Liposomal NAC',
    imageSrc: `${PRODUCTS}/glynac.jpg`,
    fallbackImageSrc: `${PRODUCTS}/glynac.svg`,
    purchaseUrl:
      'https://www.codeage.com/products/liposomal-glycine-free-form-amino-acid-capsules',
    brandWebsite: 'https://www.codeage.com',
    companionPurchase: {
      label: 'Also add: Codeage Liposomal NAC',
      purchaseUrl:
        'https://www.codeage.com/products/liposomal-nac-n-acetyl-l-cysteine-capsules',
      imageSrc: `${PRODUCTS}/glynac.jpg`,
      fallbackImageSrc: `${PRODUCTS}/glynac.svg`,
    },
    linkVerifiedAt: '2026-06-18',
    whyThisPick:
      'Matched pair from one manufacturer — liposomal delivery, clear dosing, widely available.',
    doseNote: 'Target ~7g glycine + ~600mg NAC daily (split doses). Buy both products.',
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
    compoundName: 'Sulforaphane',
    brand: 'Avmacol',
    productName: 'Avmacol Extra Strength',
    imageSrc: `${PRODUCTS}/sulforaphane.png`,
    fallbackImageSrc: `${PRODUCTS}/sulforaphane.svg`,
    purchaseUrl: 'https://www.avmacol.com/products/avmacol-extra-strength',
    brandWebsite: 'https://www.avmacol.com',
    linkVerifiedAt: '2026-06-18',
    whyThisPick:
      'Clinically studied sulforaphane glucosinolate (TrueBroc®). Standard reference product.',
    doseNote: '1–2 tablets daily with food (provides SGS equivalent).',
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
    brand: 'DoNotAge',
    productName: 'Pure Ca-AKG',
    imageSrc: `${PRODUCTS}/cakg.png`,
    fallbackImageSrc: `${PRODUCTS}/cakg.svg`,
    purchaseUrl: 'https://donotage.org/ca-akg',
    brandWebsite: 'https://donotage.org',
    linkVerifiedAt: '2026-06-18',
    whyThisPick:
      'Direct from the longevity research brand. Pure calcium alpha-ketoglutarate.',
    doseNote: 'Typical research dose: ~1g Ca-AKG daily.',
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
    brand: 'NOW Foods',
    productName: 'Taurine 1000mg',
    imageSrc: `${PRODUCTS}/taurine.svg`,
    fallbackImageSrc: `${PRODUCTS}/taurine.svg`,
    purchaseUrl: 'https://www.nowfoods.com/products/supplements/taurine-1000-mg-veg-capsules',
    brandWebsite: 'https://www.nowfoods.com',
    linkVerifiedAt: '2026-06-23',
    whyThisPick:
      'Pure pharmaceutical-grade taurine from a USP-verified manufacturer. Taurine supplementation declined dramatically with age in the Singh 2023 Science study — 1–4g/day is the human-applicable range. NOW Foods is NSF-certified; no fillers.',
    doseNote: '1–4g taurine daily, split with AM and PM meals. Shown to decline 80% with aging in blood.',
  },
  spermidine: {
    compoundId: 'spermidine',
    compoundName: 'Spermidine',
    brand: 'Oxford Healthspan',
    productName: 'Primeadine Original',
    imageSrc: `${PRODUCTS}/spermidine.svg`,
    fallbackImageSrc: `${PRODUCTS}/spermidine.svg`,
    purchaseUrl: 'https://oxfordhealthspan.com/products/primeadine-original',
    brandWebsite: 'https://oxfordhealthspan.com',
    linkVerifiedAt: '2026-06-23',
    whyThisPick:
      'Primeadine is standardized to 1mg spermidine per capsule from whole wheat germ extract — the same polyamine profile as the Kiechl 2018 cohort diet (n=829). Oxford Healthspan formulates with longevity researchers; also contains spermine and putrescine for full polyamine support.',
    doseNote: '1–2mg spermidine daily (1–2 capsules). Can also achieve via wheat germ: 1 tbsp ≈ 1mg spermidine.',
  },
  pterostilbene: {
    compoundId: 'pterostilbene',
    compoundName: 'Pterostilbene',
    brand: 'Life Extension',
    productName: 'Pterostilbene 100mg',
    imageSrc: `${PRODUCTS}/pterostilbene.svg`,
    fallbackImageSrc: `${PRODUCTS}/pterostilbene.svg`,
    purchaseUrl: 'https://www.lifeextension.com/vitamins-supplements/item02009/pterostilbene',
    brandWebsite: 'https://www.lifeextension.com',
    linkVerifiedAt: '2026-06-23',
    whyThisPick:
      'Contains pTeroPure® (ChromaDex-licensed synthetic pterostilbene) — the same standardized compound used in clinical bioavailability studies showing 4× longer plasma half-life than resveratrol. 100mg matches the dose used in the 2014 human blood pressure RCT.',
    doseNote: '50–150mg/day with food. Often paired with resveratrol in the SIRT1 protocol for additive effect.',
  },
  berberine: {
    compoundId: 'berberine',
    compoundName: 'Berberine HCl',
    brand: 'Pure Encapsulations',
    productName: 'Berberine 500mg',
    imageSrc: `${PRODUCTS}/berberine.svg`,
    fallbackImageSrc: `${PRODUCTS}/berberine.svg`,
    purchaseUrl: 'https://www.pureencapsulations.com/berberine-500-mg.html',
    brandWebsite: 'https://www.pureencapsulations.com',
    linkVerifiedAt: '2026-06-23',
    whyThisPick:
      'Clinical-grade berberine HCl from Pure Encapsulations — pharmaceutical-quality manufacturing, verified purity. 500mg matches the RCT dose (Zhang 2008, metformin-equivalent trial).',
    doseNote: '500mg TID with meals (3×/day). Start 500mg once daily for 1 week to assess GI tolerance.',
  },
  urolithina: {
    compoundId: 'urolithina',
    compoundName: 'Urolithin A (Mitopure)',
    brand: 'Timeline Nutrition',
    productName: 'Mitopure Softgels 500mg',
    imageSrc: `${PRODUCTS}/urolithina.svg`,
    fallbackImageSrc: `${PRODUCTS}/urolithina.svg`,
    purchaseUrl: 'https://www.timelinenutrition.com/shop/mitopure-softgels',
    brandWebsite: 'https://www.timelinenutrition.com',
    linkVerifiedAt: '2026-06-23',
    whyThisPick:
      'Mitopure is the standardized urolithin A form used in both published Phase 1 and Phase 2 RCTs (Cell Metabolism 2019, Cell Reports Medicine 2022). No other OTC product is backed by this human trial data.',
    doseNote: '500mg once daily in AM. Exact dose validated in Ryu 2022 Phase 2 trial (PMID 35391504).',
  },
  fisetin: {
    compoundId: 'fisetin',
    compoundName: 'Fisetin',
    brand: 'Life Extension',
    productName: 'Bio-Fisetin 100mg',
    imageSrc: `${PRODUCTS}/fisetin.svg`,
    fallbackImageSrc: `${PRODUCTS}/fisetin.svg`,
    purchaseUrl: 'https://www.lifeextension.com/vitamins-supplements/item01979/bio-fisetin',
    brandWebsite: 'https://www.lifeextension.com',
    linkVerifiedAt: '2026-06-23',
    whyThisPick:
      'Life Extension Bio-Fisetin provides 100mg with Novuseol® fisetin from Japanese wax tree bark — the same botanical source used in research. Pulse-dose protocol (20mg/kg over 2 consecutive days/month) based on Mayo Clinic pilot data (PMID 31760212).',
    doseNote: 'Pulse-dose: 20mg/kg over 2 consecutive days monthly. For 70kg adult ≈ 1,400mg/pulse (14 × 100mg capsules per dose day).',
  },
  coq10: {
    compoundId: 'coq10',
    compoundName: 'CoQ10 (Ubiquinol)',
    brand: 'Jarrow Formulas',
    productName: 'QH-Absorb Ubiquinol 100mg',
    imageSrc: `${PRODUCTS}/coq10.svg`,
    fallbackImageSrc: `${PRODUCTS}/coq10.svg`,
    purchaseUrl: 'https://www.jarrow.com/products/qh-absorb-ubiquinol-100-mg',
    brandWebsite: 'https://www.jarrow.com',
    linkVerifiedAt: '2026-06-23',
    whyThisPick:
      'Ubiquinol (reduced form, not ubiquinone) — 3–5× superior bioavailability, especially important in people over 50 where conversion from ubiquinone declines. Jarrow QH-Absorb uses KANEKA QH® the same pharmaceutical-grade ubiquinol used in Q-SYMBIO trial design references.',
    doseNote: '100–200mg ubiquinol daily with a fat-containing meal. Statin users: start immediately at 100mg.',
  },
  omega3: {
    compoundId: 'omega3',
    compoundName: 'Omega-3 (EPA + DHA)',
    brand: 'Nordic Naturals',
    productName: 'Ultimate Omega 2X 2150mg',
    imageSrc: `${PRODUCTS}/omega3.svg`,
    fallbackImageSrc: `${PRODUCTS}/omega3.svg`,
    purchaseUrl: 'https://www.nordicnaturals.com/consumers/ultimate-omega-2x',
    brandWebsite: 'https://www.nordicnaturals.com',
    linkVerifiedAt: '2026-06-23',
    whyThisPick:
      'Re-esterified triglyceride (rTG) form — the gold-standard for bioavailability. Nordic Naturals is IFOS 5-star certified (oxidation, purity, potency tested). 2150mg EPA+DHA per serving approaches the REDUCE-IT trial dose (4g/day Vascepa). Check your omega-3 index (goal: ≥8%) at baseline.',
    doseNote: '2–4g EPA+DHA daily with fat-containing meal. Target omega-3 index ≥8%; retest at 12 weeks.',
  },
};

export const productPicks: ProductPick[] = Object.values(PRODUCT_PICKS);

export function getProductPick(compoundId: string): ProductPick | undefined {
  return PRODUCT_PICKS[compoundId];
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
    pteropropure: 'pterostilbene',
    berberine: 'berberine',
    berberinehcl: 'berberine',
    urolithina: 'urolithina',
    urolithina_a: 'urolithina',
    mitopure: 'urolithina',
    fisetin: 'fisetin',
    coq10: 'coq10',
    ubiquinol: 'coq10',
    coenzymeq10: 'coq10',
    omega3: 'omega3',
    epadha: 'omega3',
    fishoil: 'omega3',
  };
  const id = aliases[key];
  return id ? PRODUCT_PICKS[id] : undefined;
}