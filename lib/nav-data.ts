// Primary-navigation config, split out of lib/data.ts so the always-mounted
// shell (Nav, ScrollProgress, Footer) doesn't drag the full compound data
// layer into every page's client bundle. lib/data.ts re-exports both for
// back-compat.
//
// One list. Every chrome surface reads from here. Do not re-declare destinations
// in Nav.tsx or Footer.tsx — that is how Library/Learn/Shop/Products drifted.

export type NavLink = {
  href: string;
  label: string;
  mod?: string;
};

export type NavGroup = {
  label: string;
  links: readonly NavLink[];
};

/** Desktop header row — four jobs, then Explore. */
export const desktopPrimaryLinks: readonly NavLink[] = [
  { href: '/library', label: 'Library', mod: 'MOD-LIB-13' },
  { href: '/stacks', label: 'Stacks', mod: 'MOD-ARC-04' },
  { href: '/labs', label: 'Labs', mod: 'MOD-LAB-11' },
  { href: '/products', label: 'Products', mod: 'MOD-PRD-16' },
];

/**
 * Drawer + footer taxonomy. Learn / Build / Track / Shop.
 * "Learn" the hub is labelled "Start here" so it does not collide with the
 * cluster name or with Library.
 */
export const navGroups: readonly NavGroup[] = [
  {
    label: 'Learn',
    links: [
      { href: '/library', label: 'Library' },
      { href: '/hallmarks', label: 'Hallmarks' },
      { href: '/peptides', label: 'Peptides' },
      { href: '/sirtuin-atlas', label: 'Sirtuins' },
      { href: '/insights', label: 'Insights' },
      { href: '/learn', label: 'Start here' },
    ],
  },
  {
    label: 'Build',
    links: [
      { href: '/stacks', label: 'Stacks' },
      { href: '/protocols', label: 'Protocols' },
      { href: '/tools', label: 'Tools' },
      { href: '/compound-engine', label: 'Engine' },
      { href: '/biohack-100', label: 'Bio Bible' },
    ],
  },
  {
    label: 'Track',
    links: [
      { href: '/labs', label: 'Labs' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    label: 'Shop',
    links: [
      { href: '/products', label: 'Verified products' },
      { href: '/shop', label: 'Verify a buy' },
    ],
  },
];

/** Desktop Explore panel — secondary Learn + Build only (Track/Shop already in the bar). */
export const exploreGroups: readonly NavGroup[] = navGroups.filter(
  (group) => group.label === 'Learn' || group.label === 'Build',
);

/**
 * Scroll-rail + legacy consumers. Same destinations as the desktop bar so the
 * right-rail dots match what the header already promises.
 */
export const navLinks: readonly NavLink[] = desktopPrimaryLinks;

export function flattenNavGroups(groups: readonly NavGroup[] = navGroups): NavLink[] {
  const seen = new Set<string>();
  const out: NavLink[] = [];
  for (const group of groups) {
    for (const link of group.links) {
      if (seen.has(link.href)) continue;
      seen.add(link.href);
      out.push(link);
    }
  }
  return out;
}
