/** Canonical production URL — apex domain, no trailing slash */
export const CANONICAL_SITE_URL = 'https://tnic.help';

/** Resolve site URL per environment (preview uses deployment URL) */
export function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_ENV === 'production') {
    return CANONICAL_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : CANONICAL_SITE_URL;
}

/** Public profiles — used in Organization JSON-LD sameAs and social metadata */
export const SOCIAL_PROFILES = [
  'https://github.com/tvsnic0419/tnic-longevity-new',
  'https://x.com/tnic_help',
] as const;

/** Canonical site configuration — single source for URLs and branding */
export const SITE = {
  name: 'TNiC',
  fullName: 'TNiC — Transformative Nutrition in Cell-Health',
  /**
   * What the name stands for. TNiC is, and has always been, Transformative
   * Nutrition in Cell-Health — this is the brand's meaning, not a strapline,
   * and it is what the nav descriptor and the logo's accessible name carry.
   */
  tagline: 'Transformative Nutrition in Cell-Health',
  /**
   * The positioning line, distinct from `tagline` above. It describes what the
   * platform IS — a connected, queryable model over the evidence: 100 compound
   * deep-dives, 12 hallmarks, the pathway graph and 363 indexed study rows, all
   * cross-linked and derived rather than asserted.
   *
   * Deliberately NOT a claim about the unshipped personal workspace. See the
   * note in `components/home/HomeOSComingSoon.tsx`: the Longevity OS *product*
   * is still reserved and unmounted. This slogan names the system that already
   * exists; it must not be used to imply software that does not.
   */
  slogan: 'The Longevity Intelligence OS',
  url: resolveSiteUrl(),
  locale: 'en_US',
  twitter: '@tnic_help',
  contactEmail: 'protocol@tnic.help',
  sameAs: SOCIAL_PROFILES,
  briefRssUrl: `${resolveSiteUrl()}/brief/feed.xml`,
} as const;

/**
 * Editorial author shown on content deep-dives and emitted as the JSON-LD
 * `author`. TNiC content is written and maintained by an in-house editorial
 * team — an honest, named organizational entity (not a fabricated individual).
 * The separate *reviewer* signal (independent clinical review) is deliberately
 * left unset until a real named reviewer exists; see app/editorial-policy.
 */
export const EDITORIAL_AUTHOR = {
  name: 'TNiC Research Team',
  url: `${resolveSiteUrl()}/editorial-policy`,
} as const;

export const LONGEVITY_KEYWORDS = [
  'transformative nutrition',
  'nutrition for cell-health',
  'cell-health',
  'cell-health nutrition',
  'nutraceuticals',
  'longevity',
  'healthspan',
  'anti-aging',
  'hallmarks of aging',
  'biological age',
  'biohacking',
  'NAD+',
  'NMN',
  'GlyNAC',
  'glutathione',
  'NRF2',
  'sulforaphane',
  'resveratrol',
  'supplement stack',
  'longevity protocol',
  'biomarker tracking',
  'epigenetic clock',
  'mitochondrial health',
  'cellular senescence',
  'rapamycin longevity',
] as const;