import { describe, expect, it } from 'vitest';
import {
  desktopPrimaryLinks,
  exploreGroups,
  flattenNavGroups,
  navGroups,
  navLinks,
} from './nav-data';

describe('nav IA is a single source of truth', () => {
  it('keeps the desktop bar to four primary jobs', () => {
    expect(desktopPrimaryLinks.map((l) => l.href)).toEqual([
      '/library',
      '/stacks',
      '/labs',
      '/products',
    ]);
  });

  it('uses the same four destinations for the scroll rail', () => {
    expect(navLinks).toEqual(desktopPrimaryLinks);
  });

  it('does not list a destination twice inside one group', () => {
    for (const group of navGroups) {
      const hrefs = group.links.map((l) => l.href);
      expect(hrefs).toEqual([...new Set(hrefs)]);
    }
  });

  it('puts Explore at Learn + Build only — Track and Shop already sit in the bar', () => {
    expect(exploreGroups.map((g) => g.label)).toEqual(['Learn', 'Build']);
  });

  it('labels the /learn hub Start here so it does not collide with the Learn cluster', () => {
    const learn = navGroups.find((g) => g.label === 'Learn');
    expect(learn?.links.find((l) => l.href === '/learn')?.label).toBe('Start here');
  });

  it('flattenNavGroups de-dupes routes that appear in more than one list', () => {
    const flat = flattenNavGroups();
    expect(flat.map((l) => l.href)).toEqual([...new Set(flat.map((l) => l.href))]);
  });
});
