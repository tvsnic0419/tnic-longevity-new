/**
 * Real retail products per compound — the "where to buy" list that replaces the
 * illustrative molecule motif in the compound deep-dive overture.
 *
 * Honesty rules (this is the site's brand):
 *  - Every entry is a REAL product from a REAL brand, researched Aug 2026. No
 *    fabricated brands, products, or buy links.
 *  - Links point at the brand's official site (a stable manufacturer domain or a
 *    known product page) — never an invented deep link. Confirm the current
 *    formulation and its third-party COA before purchase.
 *  - `verified: true` marks the one pick TNiC already curates in
 *    lib/product-picks.ts (kept in sync there). It is NOT a lab-testing claim —
 *    it is our default recommendation. No brand pays for placement or ranking.
 *
 * Kept intentionally small and hand-curated: only the compounds whose deep-dive
 * renders a CompoundHero. `getCompoundProducts` returns up to `max` items.
 */

export interface CompoundRetailProduct {
  brand: string;
  product: string;
  /** Per-serving amount as labeled, e.g. "500 mg / capsule". */
  dose?: string;
  /** Official brand site or a known product page. */
  url: string;
  /** One short, factual note (form, standardization, testing). */
  note?: string;
  /** True for the compound's curated TNiC pick (mirrors lib/product-picks.ts). */
  verified?: boolean;
  /** The single recommended product when there is no curated `verified` pick. */
  recommended?: boolean;
}

/** The one product to highlight for a compound — the verified pick, else the recommended one. */
export function isTopPick(p: CompoundRetailProduct): boolean {
  return Boolean(p.verified || p.recommended);
}

export const COMPOUND_PRODUCTS: Record<string, CompoundRetailProduct[]> = {
  nmn: [
    { brand: 'Codeage', product: 'Amen NMN 500mg', dose: '500 mg / capsule', url: 'https://www.codeage.com/products/amen-nmn-supplement', note: 'Third-party tested; TNiC default pick.', verified: true },
    { brand: 'ProHealth Longevity', product: 'NMN Pro (Uthever®)', dose: '500 mg / capsule', url: 'https://www.prohealth.com', note: 'Uthever® NMN, 99%+ purity on published COAs.' },
    { brand: 'Nutricost', product: 'NMN', dose: '500 mg / serving', url: 'https://nutricost.com', note: 'ISO-lab third-party tested; budget option.' },
    { brand: 'Double Wood', product: 'NMN', dose: '500 mg / serving', url: 'https://doublewoodsupplements.com', note: 'US GMP facility, third-party tested.' },
    { brand: 'Omre', product: 'NMN + Trans-Resveratrol', dose: '500 mg NMN', url: 'https://omre.co', note: 'Pairs NMN with micronized resveratrol.' },
  ],
  resveratrol: [
    { brand: 'Thorne', product: 'ResveraCel', dose: 'per label', url: 'https://www.thorne.com/products/dp/resveracel', note: 'Resveratrol + NR + quercetin; NSF facility. TNiC default pick.', verified: true },
    { brand: 'PartiQlar', product: 'Pure Resveratrol', dose: '500 mg / capsule', url: 'https://partiqlar.com', note: 'Trans-resveratrol from Japanese knotweed.' },
    { brand: 'ProHealth Longevity', product: 'Trans-Resveratrol', dose: '1000 mg / serving', url: 'https://www.prohealth.com', note: 'Independent third-party lab tested.' },
    { brand: 'Momentous', product: 'Resveratrol', dose: 'per label', url: 'https://www.livemomentous.com', note: 'Clean formulation, third-party tested.' },
    { brand: 'Double Wood', product: 'Resveratrol', dose: '500 mg / serving', url: 'https://doublewoodsupplements.com', note: 'Trans-resveratrol, US GMP.' },
  ],
  berberine: [
    { brand: 'Thorne', product: 'Berberine', dose: '500 mg / capsule', url: 'https://www.thorne.com', note: 'NSF Contents Certified.', recommended: true },
    { brand: 'Double Wood', product: 'Berberine HCl', dose: '500 mg / capsule', url: 'https://doublewoodsupplements.com', note: 'US GMP facility, third-party tested.' },
    { brand: 'Nutricost', product: 'Berberine HCl', dose: '500 mg / capsule', url: 'https://nutricost.com', note: 'Third-party tested; budget option.' },
    { brand: 'Vitality Pro', product: 'Advanced Berberine', dose: '500 mg + milk thistle', url: 'https://vitality-pro.com', note: 'Adds 125 mg milk thistle; GMP.' },
    { brand: 'Best Naturals', product: 'Berberine', dose: '500 mg / capsule', url: 'https://www.bestnaturals.com', note: 'US GMP, third-party lab tested.' },
  ],
  coq10: [
    { brand: 'Momentous', product: 'Ubiquinol (Kaneka®)', dose: 'per label', url: 'https://www.livemomentous.com', note: 'NSF Certified for Sport; Kaneka Ubiquinol®.', recommended: true },
    { brand: 'Qunol', product: 'Ultra CoQ10', dose: '100 mg / softgel', url: 'https://qunol.com', note: 'Water/fat-soluble absorption form.' },
    { brand: 'Nordic Naturals', product: 'CoQ10 Ubiquinol', dose: '100 mg / softgel', url: 'https://www.nordicnaturals.com', note: 'Per-batch COA available.' },
    { brand: 'Healthy Origins', product: 'Ubiquinol (Kaneka®)', dose: '100 mg / softgel', url: 'https://www.healthyorigins.com', note: 'ConsumerLab-approved value pick.' },
    { brand: 'Thorne', product: 'CoQ10', dose: 'per label', url: 'https://www.thorne.com', note: 'NSF facility, third-party tested.' },
  ],
  omega3: [
    { brand: 'Nordic Naturals', product: 'Ultimate Omega', dose: '1280 mg EPA+DHA', url: 'https://www.nordicnaturals.com', note: 'Triglyceride form; third-party purity tested.', recommended: true },
    { brand: 'Thorne', product: 'Omega-3 with CoQ10', dose: 'per label', url: 'https://www.thorne.com', note: 'Independent + in-house testing.' },
    { brand: 'Carlson', product: 'Maximum Omega 2000', dose: '2000 mg EPA+DHA', url: 'https://carlsonlabs.com', note: 'High-potency triglyceride form.' },
    { brand: 'NOW Foods', product: 'Ultra Omega-3', dose: '750 mg EPA+DHA', url: 'https://www.nowfoods.com', note: 'GMP A-rated; value option.' },
    { brand: 'Metagenics', product: 'OmegaGenics EPA-DHA', dose: '1000 mg EPA+DHA', url: 'https://www.metagenics.com', note: 'Practitioner brand.' },
  ],
  fisetin: [
    { brand: 'Double Wood', product: 'Fisetin', dose: '100 mg / capsule', url: 'https://doublewoodsupplements.com/products/fisetin', note: 'Real 100 mg (not a blend); US third-party tested.', recommended: true },
    { brand: 'Omre', product: 'Quercetin + Fisetin', dose: '100 mg fisetin', url: 'https://omre.co', note: '98% purity; adds quercetin phytosome.' },
    { brand: 'Nutricost', product: 'Fisetin', dose: '100 mg / capsule', url: 'https://nutricost.com', note: 'Third-party tested; budget option.' },
    { brand: 'ProHealth Longevity', product: 'Fisetin', dose: '100 mg / capsule', url: 'https://www.prohealth.com', note: 'Third-party lab tested.' },
    { brand: 'Jinfiniti', product: 'SenoAid', dose: '170 mg fisetin', url: 'https://www.jinfiniti.com', note: 'Higher-dose fisetin + quercetin.' },
  ],
  'urolithin-a': [
    { brand: 'Timeline', product: 'Mitopure®', dose: '500 mg / serving', url: 'https://www.timeline.com', note: 'The urolithin A used in most human trials; NSF for Sport.', recommended: true },
    { brand: 'Neurogan Health', product: 'Urolithin A', dose: '500 mg / serving', url: 'https://neuroganhealth.com/collections/urolithin-a-supplements', note: 'COAs posted on site.' },
    { brand: 'Omre', product: 'Urolithin A', dose: '500 mg / serving', url: 'https://omre.co', note: 'Same clinical dose, lower cost.' },
    { brand: 'Double Wood', product: 'Urolithin A', dose: '500 mg / serving', url: 'https://doublewoodsupplements.com', note: 'US GMP, third-party tested.' },
    { brand: 'ProHealth Longevity', product: 'Urolithin A', dose: '500 mg / serving', url: 'https://www.prohealth.com', note: 'Third-party lab tested.' },
  ],
  spermidine: [
    { brand: 'Oxford Healthspan', product: 'Primeadine® Original', dose: '1 mg / 3 caps', url: 'https://oxfordhealthspan.com', note: 'Whole-food wheat-germ spermidine; COAs posted. TNiC default pick.', verified: true },
    { brand: 'Omre', product: 'Spermidine', dose: '10 mg / serving', url: 'https://omre.co', note: 'Natural wheat-germ extract, third-party tested.' },
    { brand: 'ProHealth Longevity', product: 'Pure Spermidine', dose: 'per label', url: 'https://www.prohealth.com', note: 'Triple lab tested.' },
    { brand: 'Double Wood', product: 'Spermidine', dose: 'per label', url: 'https://doublewoodsupplements.com', note: 'US GMP, third-party tested.' },
    { brand: 'PartiQlar', product: 'Spermidine', dose: 'per label', url: 'https://partiqlar.com', note: 'Third-party tested.' },
  ],
  cakg: [
    { brand: 'Toniiq', product: 'Calcium AKG 1500', dose: '1500 mg / serving', url: 'https://www.toniiq.com/products/calcium-akg', note: '99%+ purity; COA access. TNiC default pick.', verified: true },
    { brand: 'ProHealth Longevity', product: 'Calcium AKG Longevity', dose: '1000 mg / serving', url: 'https://www.prohealth.com', note: 'Batch third-party tested in US labs.' },
    { brand: 'Vitality Pro', product: 'CaAKG', dose: '500 mg / capsule', url: 'https://vitality-pro.com', note: '98%+ purity; ISO-lab tested.' },
    { brand: 'DoNotAge', product: 'Pure Ca-AKG', dose: '1000 mg / serving', url: 'https://donotage.org', note: 'Longevity-focused brand; COAs posted.' },
    { brand: 'Renue By Science', product: 'Ca-AKG', dose: '1000 mg / serving', url: 'https://renuebyscience.com', note: 'Longevity brand; COAs posted.' },
  ],
  taurine: [
    { brand: 'Life Extension', product: 'Taurine', dose: '1000 mg / capsule', url: 'https://www.lifeextension.com/vitamins-supplements/item01827/taurine', note: 'Established clinical brand. TNiC default pick.', verified: true },
    { brand: 'Nutricost', product: 'Taurine', dose: '1000 mg / capsule', url: 'https://nutricost.com', note: 'Third-party tested; GMP.' },
    { brand: 'NOW Foods', product: 'Taurine Double Strength', dose: '1000 mg / capsule', url: 'https://www.nowfoods.com', note: 'GMP A-rated.' },
    { brand: 'Pure Encapsulations', product: 'Taurine', dose: '1000 mg / capsule', url: 'https://www.pureencapsulations.com', note: 'Hypoallergenic, no fillers.' },
    { brand: 'Double Wood', product: 'Taurine', dose: '1000 mg / serving', url: 'https://doublewoodsupplements.com', note: 'US GMP, third-party tested.' },
  ],
  glynac: [
    { brand: 'Nutri', product: 'GlyNAC-ET Extra Strength', dose: '1800 mg glycine + 375 mg NACET', url: 'https://www.gnc.com/brain-memory-support/580824.html', note: 'Single-bottle glycine + NAC ethyl ester. TNiC default pick.', verified: true },
    { brand: 'Utzy Naturals', product: 'GlyNAC+', dose: 'glycine + NAC + B2', url: 'https://www.utzy.com/products/glynac', note: 'Clinically studied ratio + riboflavin.' },
    { brand: 'Vitality Pro', product: 'GlyNAC', dose: 'glycine + NAC', url: 'https://vitality-pro.com/product/glynac/', note: 'Third-party tested for purity.' },
    { brand: 'Omre', product: 'Glycine + NAC', dose: 'per label', url: 'https://omre.co', note: 'Doctor-developed, batch tested.' },
    { brand: 'Biostack Labs', product: 'GlyNAC+', dose: '3000 mg glycine + 1200 mg NAC', url: 'https://biostacklabs.com', note: 'Higher-ratio glycine:NAC serving.' },
  ],
  pterostilbene: [
    { brand: 'Double Wood', product: 'Pterostilbene', dose: '100 mg / capsule', url: 'https://doublewoodsupplements.com/products/pterostilbene', note: 'Trans-pterostilbene, no Mg stearate. TNiC default pick.', verified: true },
    { brand: 'Nutricost', product: 'Pterostilbene', dose: '100 mg / capsule', url: 'https://nutricost.com', note: 'Clean, third-party tested, budget.' },
    { brand: 'Vitality Pro', product: 'Advanced Pterostilbene', dose: 'per label', url: 'https://vitality-pro.com/product/advanced-pterostilbene-60/', note: 'ISO 17025-lab tested.' },
    { brand: 'ProHealth Longevity', product: 'Pterostilbene', dose: 'per label', url: 'https://www.prohealth.com', note: 'Third-party lab tested.' },
    { brand: 'Toniiq', product: 'Pterostilbene', dose: '100 mg / capsule', url: 'https://www.toniiq.com', note: 'High-purity; COA access.' },
  ],
  rala: [
    { brand: 'GeroNova', product: 'Bio-Enhanced R-Lipoic Acid', dose: '300 mg / capsule', url: 'https://geronova.com/product/bio-enhanced-r-lipoic-acid-vegcaps-300mg-60caps/', note: 'Stabilized R-form (not racemic). TNiC default pick.', verified: true },
    { brand: 'Life Extension', product: 'Super R-Lipoic Acid', dose: '240 mg sodium R-lipoate', url: 'https://www.lifeextension.com', note: 'Stabilized sodium R-lipoate.' },
    { brand: 'Thorne', product: 'Alpha-Lipoic Acid', dose: 'per label', url: 'https://www.thorne.com', note: 'NSF Certified for Sport.' },
    { brand: 'NatureBell', product: 'Stabilized R-ALA', dose: '1200 mg / serving', url: 'https://www.naturebell.com', note: 'R-form only, excludes S-ALA.' },
    { brand: 'Nutricost', product: 'Alpha Lipoic Acid', dose: 'per label', url: 'https://nutricost.com', note: 'Third-party tested; budget.' },
  ],
  sulforaphane: [
    { brand: 'Allergy Research Group', product: 'Nrf2 Renew®', dose: '50 mg SGS / 2 caps', url: 'https://allergyresearchgroup.com', note: 'Sulforaphane + NRF2 botanicals. TNiC default pick.', verified: true },
    { brand: 'Avmacol', product: 'Sulforaphane Production', dose: 'glucoraphanin + myrosinase', url: 'https://avmacol.com', note: 'Most-researched sulforaphane brand in human trials.' },
    { brand: 'Nutricost', product: 'Sulforaphane (SGS)', dose: '50 mg SGS / capsule', url: 'https://nutricost.com', note: 'Broccoli seed extract; third-party tested.' },
    { brand: 'Jarrow Formulas', product: 'BroccoMax', dose: 'glucoraphanin + myrosinase', url: 'https://www.jarrow.com', note: 'Delayed-release with active myrosinase.' },
    { brand: 'Broc Shot', product: 'Broc Shot', dose: '≥12 mg active sulforaphane', url: 'https://brocshot.com', note: 'Guaranteed active sulforaphane per serving.' },
  ],
};

/** Up to `max` real retail products for a compound (verified pick first). */
export function getCompoundProducts(compoundId: string, max = 5): CompoundRetailProduct[] {
  const list = COMPOUND_PRODUCTS[compoundId] ?? [];
  // The top pick (verified, else recommended) always leads; otherwise authored order.
  const ordered = [...list].sort((a, b) => Number(isTopPick(b)) - Number(isTopPick(a)));
  return ordered.slice(0, max);
}

export function hasCompoundProducts(compoundId: string): boolean {
  return (COMPOUND_PRODUCTS[compoundId]?.length ?? 0) > 0;
}
