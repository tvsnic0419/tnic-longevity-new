/**
 * Canonical product-name strings.
 *
 * One source of truth for the words TNiC uses to name its own tools. Every
 * hardcoded reference to `Stack Architect` / `Stack Builder` /
 * `Compound Intelligence Engine` / `My Longevity OS` etc. across `app/`,
 * `components/`, and `lib/` should re-export or interpolate from this file.
 *
 * Why this file exists — earlier surfaces of the same feature drifted:
 *
 *   - `Stack Architect` (SEO title, hero, breadcrumb, command palette) vs
 *     `Stack Builder` (NICO copy, gettingStartedSteps, hub-context "next",
 *     dashboard "Quick tools") — often in the same handoff sentence.
 *   - `Compound Intelligence Engine` vs `Compound Engine` vs bare `Engine`.
 *   - `My Longevity OS` shipped on ~9 live surfaces (Dashboard h1, SEO title,
 *     OnboardingStrip, export kit, hub context, command palette, milestones,
 *     JSON-LD, dashboard hub hero) despite the `HomeOSComingSoon` docstring
 *     stating the name was reserved for future brand expansion and should
 *     NOT be marketed yet. Retracted here: the successor label for the
 *     personal dashboard is `TNiC Dashboard` (short) / `My Dashboard`
 *     (possessive form used in h1s and the command palette).
 *
 * A companion Vitest gate (`tests/canonical-names.test.ts`) fails the build
 * if a raw literal for any of the retired strings appears in the source tree
 * outside this file or the DEPRECATED_ALIASES allowlist.
 */

// Canonical tool / surface names — the words a reader sees.
export const STACK_ARCHITECT = 'Stack Architect';
export const COMPOUND_ENGINE = 'Compound Engine';
export const COMPOUND_ENGINE_FULL = 'Compound Intelligence Engine';
export const PATHWAY_ARCHITECT = 'Pathway Architect';

// NICO — the starter questionnaire. Two accepted forms:
//   full  → 'NICO Starter Questionnaire' (first use on a page, SEO, hero)
//   short → 'NICO' (subsequent references, breadcrumb, CTA labels)
export const NICO = 'NICO';
export const NICO_FULL = 'NICO Starter Questionnaire';

// The personal dashboard — successor to the retired 'Longevity OS' brand.
//   canonical      → 'TNiC Dashboard' (SEO, JSON-LD, export headers)
//   possessive     → 'My Dashboard' (h1 on /dashboard, command palette)
//   bare/generic   → 'Dashboard' (in-copy, hub-context "next" sentences)
export const TNIC_DASHBOARD = 'TNiC Dashboard';
export const MY_DASHBOARD = 'My Dashboard';
export const DASHBOARD = 'Dashboard';

// Umbrella site name — kept in sync with SITE.name in lib/site.ts.
// Re-exported here so name-canon consumers don't have to import both files.
export const TNIC = 'TNiC';

/**
 * Strings that MUST NOT reappear anywhere in the source tree outside this
 * file. The canonical-names guard test greps for each and fails the build
 * if it finds one. Comments name the successor.
 */
export const DEPRECATED_ALIASES = [
  // 'Longevity OS' → TNIC_DASHBOARD (or DASHBOARD in possessive contexts)
  'Longevity OS',
  'My Longevity OS',
  'TNiC Longevity OS',
  // 'Stack Builder' → STACK_ARCHITECT
  'Stack Builder',
] as const;

export type DeprecatedAlias = (typeof DEPRECATED_ALIASES)[number];
