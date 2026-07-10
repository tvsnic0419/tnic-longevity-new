import type { EvidenceTier } from './types';
import { getCitationById } from './trust';

/**
 * Authority profiles for the flagship compound deep-dives (Phase 1).
 *
 * These add the two elements that read as scientific authority to a
 * science-literate reader but were missing from the deep-dive pages:
 *
 *  1. A **method + last-reviewed strip** — the evidence grade, when the page
 *     was last reviewed, and a one-line note on how TNiC grades.
 *  2. **"What the evidence does NOT support"** — the intellectual-honesty
 *     section. Every boundary here is sourced from already-authored data
 *     (the citation registry summaries in `lib/trust.ts` and the Elite-8
 *     clock-confidence labels), never invented. This is deliberately the
 *     section that resists overclaiming.
 *
 * INTEGRITY RULES (guarded by authority-profiles.test.ts):
 *  - `moduleSlug` must resolve to a real compound page.
 *  - Every id in `humanEvidenceCitationIds` must exist in the citation
 *    registry (no fabricated citations).
 *  - `lastReviewed` must be an ISO date matching the compound MDX frontmatter.
 *  - `boundaries` must be non-empty.
 */
export interface AuthorityProfile {
  /** Compound module slug — resolves to /library/compounds/<slug>. */
  moduleSlug: string;
  evidenceTier: EvidenceTier;
  /** ISO date; kept in sync with the compound MDX `last_updated` frontmatter. */
  lastReviewed: string;
  /** One line on how this grade was reached. */
  methodNote: string;
  /** Registry citation ids for the strongest *human* evidence, human-first. */
  humanEvidenceCitationIds: string[];
  /** "What the evidence does NOT support" — honest, sourced boundaries. */
  boundaries: string[];
}

const REVIEW_METHOD_NOTE =
  'Graded A/B/C on human vs. preclinical data, with an independent PMID check and quarterly re-review.';

export const authorityProfiles: AuthorityProfile[] = [
  {
    moduleSlug: 'glynac',
    evidenceTier: 'A',
    lastReviewed: '2026-06-16',
    methodNote: REVIEW_METHOD_NOTE,
    humanEvidenceCitationIds: ['c-glynac-2021', 'c-glynac-2023', 'c-glynac-hallmarks-2023'],
    boundaries: [
      'The human RCTs are small (roughly two dozen older adults each) — enough to move biomarkers, not powered for hard outcomes.',
      'Measured endpoints are glutathione, oxidative-stress markers, mitochondrial function and insulin sensitivity — not mortality or added healthspan years.',
      'Benefits are demonstrated in older adults with baseline glutathione deficiency; they do not establish the same effect in healthy younger people.',
    ],
  },
  {
    moduleSlug: 'nmn',
    evidenceTier: 'A',
    lastReviewed: '2026-06-16',
    methodNote: REVIEW_METHOD_NOTE,
    humanEvidenceCitationIds: ['c-nmn-insulin-2021', 'c-nmn-2022'],
    boundaries: [
      'Human trials confirm NMN raises NAD+ and can improve metabolic and functional markers over weeks to months — none has measured lifespan or all-cause mortality.',
      'Reported epigenetic-clock reversal is pilot-level and not yet replicated in large randomized trials.',
      'NMN has not been shown superior to NR for aging outcomes; head-to-head human outcome data is limited.',
    ],
  },
  {
    moduleSlug: 'taurine',
    evidenceTier: 'B',
    lastReviewed: '2026-06-20',
    methodNote: REVIEW_METHOD_NOTE,
    humanEvidenceCitationIds: ['c-taurine-2023'],
    boundaries: [
      'The headline lifespan and healthspan gains are in mice; the human data is associative (cross-sectional), not a randomized interventional trial.',
      'No human RCT has shown that taurine supplementation slows aging or extends healthspan.',
      'Causality in humans is unestablished — the associative signal cannot separate taurine from overall health status.',
    ],
  },
  {
    moduleSlug: 'spermidine',
    evidenceTier: 'B',
    lastReviewed: '2026-06-20',
    methodNote: REVIEW_METHOD_NOTE,
    humanEvidenceCitationIds: ['c-spermidine-memory-2021'],
    boundaries: [
      'The strongest human RCT measured a cognitive (memory) endpoint in older adults — not lifespan or biological-age reversal.',
      'Longevity associations come from dietary-intake cohorts, which are observational and confounded rather than causal.',
      'The epigenetic-clock signal is low-confidence and has not been confirmed in a dedicated randomized trial.',
    ],
  },
  {
    moduleSlug: 'pterostilbene',
    evidenceTier: 'B',
    lastReviewed: '2026-06-20',
    methodNote: REVIEW_METHOD_NOTE,
    humanEvidenceCitationIds: ['c-pterostilbene-pk-2011'],
    boundaries: [
      'Human evidence establishes bioavailability and short-term safety — not longevity or aging-biomarker outcomes.',
      'The epigenetic-age figure is a modeled estimate extrapolated from animal models, not a measured human result.',
      'SIRT1 activation at practical supplement doses is inferred from the resveratrol literature, not directly demonstrated for pterostilbene in humans.',
    ],
  },
  {
    moduleSlug: 'rapamycin',
    evidenceTier: 'B',
    lastReviewed: '2026-06-16',
    methodNote: REVIEW_METHOD_NOTE,
    humanEvidenceCitationIds: ['c-rapa-immune-2023', 'c-rapa-2011'],
    boundaries: [
      'Lifespan extension is established in mice and other model organisms — not in humans.',
      'Human trials to date measured immune-function and biomarker endpoints (e.g., low-dose intermittent dosing), not lifespan or mortality.',
      'It is a prescription immunosuppressant: off-label longevity use is unproven and carries real risks, so dosing and monitoring must be physician-managed.',
    ],
  },
];

const bySlug = new Map(authorityProfiles.map((p) => [p.moduleSlug, p]));

export function getAuthorityProfile(moduleSlug: string): AuthorityProfile | undefined {
  return bySlug.get(moduleSlug);
}

/** Resolve the human-evidence citations for a profile, dropping any that don't exist. */
export function getAuthorityCitations(profile: AuthorityProfile) {
  return profile.humanEvidenceCitationIds
    .map((id) => getCitationById(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
}
