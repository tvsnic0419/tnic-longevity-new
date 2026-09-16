import type { EvidenceTier } from './types';

/**
 * Bio Bible — the dual-exposure monograph.
 *
 * Editorial contract (NOTES-COMPOUND-LIBRARY.md, CLAUDE.md §2): every clinical
 * field on this page — dose strings, mechanism lines, evidence tiers — traces
 * verbatim to already-authored source content in `content/compounds/*.mdx`.
 * Nothing here is authored fresh. The `source` field on each folio card names
 * the exact file and section the text came from, so a reviewer can diff it.
 *
 * The full forty-compound protocol is the PRODUCT, not a route. This module
 * backs the public acquisition surface at `/biohack-100`, which discloses two
 * folio cards and sells the remainder as a monograph.
 */

/** Commerce configuration — see `.env.example` for the Stripe wiring. */
export const BIO_BIBLE_COMMERCE = {
  /**
   * Stripe Payment Link URL. Public by design (it is the checkout address).
   * When unset, the acquisition CTA renders as an inert notice rather than a
   * dead link — same invariant as `GuideVerifiedPick`: never show a buy
   * control that goes nowhere.
   */
  paymentUrl: process.env.NEXT_PUBLIC_BIO_BIBLE_PAYMENT_URL ?? '',
  /**
   * Display price. NOT derived from Stripe at build time (that would need a
   * secret key in the client bundle) — set this to match the Stripe price
   * exactly. A mismatch between this string and the Stripe checkout total is a
   * consumer-protection problem, so keep them in sync.
   */
  price: process.env.NEXT_PUBLIC_BIO_BIBLE_PRICE ?? '',
  /** Where Stripe returns the buyer. Must match the Payment Link redirect. */
  downloadPath: '/bio-bible/download',
} as const;

export const BIO_BIBLE = {
  /** Meta + hero headline. Supplied verbatim by the operator. */
  headline: 'Intelligence they prefer unindexed.',
  overline: 'Folio 001 · Dual-exposure cartography',
  lead:
    'The open library observes the decorum of conventional longevity publishing. Bio Bible does not. It is a dual-exposure cartography drawn against the enzymatic and organelle lesions of methamphetamine and tobacco. Two cards are disclosed. The remainder is sold as a monograph.',
  ctaPrimary: 'Acquire the monograph',
  ctaSecondary: 'Inspect the public folio',
  /**
   * Harm-reduction notice. Verbatim from the operator brief. Rendered as
   * editorial apparatus — hairline rule, small caps — never as a red alert
   * box. Restraint is the register.
   */
  notice:
    'No supplement stack eliminates the damage caused by methamphetamine or tobacco. This protocol minimizes damage using the best available science. Addressing the source is the only path to genuine longevity.',
} as const;

/** The nine-tier mandate. Names supplied by the operator; contents are the monograph. */
export interface MonographTier {
  n: number;
  name: string;
  /** Count of compounds in this tier within the full monograph. */
  compounds: number;
}

export const MONOGRAPH_TIERS: readonly MonographTier[] = [
  { n: 1, name: 'Neural Armor', compounds: 5 },
  { n: 2, name: 'Oxidative Fire Suppression', compounds: 5 },
  { n: 3, name: 'Cardiovascular Fortress', compounds: 6 },
  { n: 4, name: 'Lung Shield', compounds: 4 },
  { n: 5, name: 'Liver & Detox Command', compounds: 4 },
  { n: 6, name: 'Longevity Core', compounds: 6 },
  { n: 7, name: 'Brain Rebuild & Neurogenesis', compounds: 4 },
  { n: 8, name: 'Immune & DNA Defense', compounds: 3 },
  { n: 9, name: 'Foundation Stack', compounds: 3 },
] as const;

export const MONOGRAPH_COMPOUND_COUNT = MONOGRAPH_TIERS.reduce(
  (sum, tier) => sum + tier.compounds,
  0,
);

/** A disclosed folio card — the two compounds shown publicly. */
export interface FolioCard {
  n: number;
  name: string;
  /** The molecular node this compound acts on. */
  node: string;
  /** Dose string — verbatim from authored source. */
  dose: string;
  /** Mechanism — verbatim from authored source. */
  mechanism: string;
  /** Provenance: which tier of the monograph this card belongs to. */
  tier: number;
  evidenceTier: EvidenceTier;
  /** Library cross-link — verified to resolve against `libraryModules`. */
  librarySlug: string;
  /** Audit trail: the authored file + section this text was extracted from. */
  source: string;
}

/**
 * The two disclosed cards. Both are extractions, not compositions —
 * see `source` on each. GlyNAC is the substrate leg of the NRF2 Defense Triad
 * already published at /library/synergies/glynac-nrf2-triad; R-ALA is its
 * recycling leg. They are disclosed together because the monograph's argument
 * depends on the pairing, and a single card would misrepresent it.
 */
export const DISCLOSED_FOLIO: readonly FolioCard[] = [
  {
    n: 6,
    name: 'GlyNAC (Glycine + NAC)',
    node: 'GCLC / GCLM — glutamate-cysteine ligase subunits',
    dose: '600 mg glycine + 600 mg NAC each morning',
    mechanism:
      'The chemistry all runs through one group: the cysteine thiol (–SH). That sulfhydryl is the reactive end of glutathione — the site that donates electrons to neutralize oxidants and cycles between reduced (GSH) and oxidized (GSSG) states. Glycine and glutamate complete the tripeptide, but the thiol is what does the redox work, which is why cysteine availability — supplied here as NAC — is so often the rate-limiting factor.',
    tier: 2,
    evidenceTier: 'A',
    librarySlug: 'glynac',
    source: 'content/compounds/glynac.mdx §2 (mechanism), §4 (dosing table)',
  },
  {
    n: 8,
    name: 'R-Alpha Lipoic Acid (R-ALA)',
    node: 'GSSG → GSH disulfide reduction, via the thioredoxin pathway',
    dose: '300 mg with a fat-containing breakfast; stabilized R-form only',
    mechanism:
      'The mitochondrial respiratory chain produces ROS as a byproduct of ATP synthesis. Without ongoing recycling, oxidized antioxidants pile up — vitamin C becomes dehydroascorbate, vitamin E becomes the tocopheroxyl radical, and glutathione (GSSG) accumulates. R-ALA interrupts this at every level simultaneously.',
    tier: 2,
    evidenceTier: 'B',
    librarySlug: 'rala',
    source: 'content/compounds/rala.mdx §1 (overview), §2 (mechanism table), §4 (dosing)',
  },
] as const;

/** Chronobiology note — verbatim from the authored NRF2 triad choreography. */
export const FOLIO_CHOREOGRAPHY =
  'Spacing matters: sulforaphane induces GCLC/GCLM transcription 2–6 hours post-dose; R-ALA recycles the GSH that those enzymes are synthesizing. The sequence is mechanistically meaningful.';

export const FOLIO_CHOREOGRAPHY_SOURCE = 'content/compounds/rala.mdx §5 (NRF2 triad choreography)';
