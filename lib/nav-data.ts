// Primary-navigation config, split out of lib/data.ts so the always-mounted
// shell (Nav, ScrollProgress) doesn't drag the full compound data layer into
// every page's client bundle. lib/data.ts re-exports both for back-compat.

export const navLinks = [
  { href: '/products', label: 'Products', mod: 'MOD-PRD-16' },
  { href: '/library', label: 'Library', mod: 'MOD-LIB-13' },
  // No separate "Compounds" nav item: /library/compounds duplicates the
  // CompoundExplorer section already embedded on /library (same dataset,
  // same tier filter). The route stays — it's load-bearing for every
  // /library/compounds/<slug> deep-dive — just not double-billed in nav.
  { href: '/peptides', label: 'Peptides', mod: 'MOD-PEP-15' },
  { href: '/sirtuin-atlas', label: 'Sirtuins', mod: 'MOD-SIRT-01' },
  { href: '/learn', label: 'Learn', mod: 'MOD-LRN-09' },
  { href: '/stacks', label: 'Stacks', mod: 'MOD-ARC-04' },
  { href: '/labs', label: 'Labs', mod: 'MOD-LAB-11' },
  { href: '/tools', label: 'Tools', mod: 'MOD-TOL-14' },
  // Single-noun label to match the rest of the bar and keep the row from
  // wrapping at lg — the full "Compound Engine" name is used in the footer,
  // the breadcrumb, and every cross-link card, where there is room for it.
  { href: '/compound-engine', label: 'Engine', mod: 'MOD-ENG-18' },
];

/**
 * The same destinations as `navLinks`, grouped by intent so the primary nav
 * reads as three-to-four labeled clusters instead of nine undifferentiated
 * links — a newcomer can tell reference (Learn) from builders (Build) from
 * personal data (Track) from buying (Shop). Consumed by the Nav for both the
 * desktop row (divider between groups) and the mobile drawer (labeled sections).
 */
export const navGroups = [
  {
    label: 'Learn',
    links: [
      { href: '/library', label: 'Library' },
      { href: '/peptides', label: 'Peptides' },
      { href: '/sirtuin-atlas', label: 'Sirtuins' },
      { href: '/insights', label: 'Insights' },
      { href: '/learn', label: 'Learn' },
    ],
  },
  {
    label: 'Build',
    links: [
      { href: '/stacks', label: 'Stacks' },
      // Combination Lab (/stacks/lab) is deliberately NOT here. It rendered as
      // "Lab" four items away from "Labs" (/labs, biomarker tracking) in the
      // same bar — two near-identical labels for unrelated things. It is a
      // sub-page of Stacks, promoted at the top of the /stacks hub and in the
      // sitemap, so it loses nothing by staying out of the top-level row.
      { href: '/protocols', label: 'Protocols' },
      { href: '/tools', label: 'Tools' },
      { href: '/compound-engine', label: 'Engine' },
    ],
  },
  {
    label: 'Track',
    links: [{ href: '/labs', label: 'Labs' }],
  },
  {
    label: 'Shop',
    links: [{ href: '/products', label: 'Products' }],
  },
] as const;
