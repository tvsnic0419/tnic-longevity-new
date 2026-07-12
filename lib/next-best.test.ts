import { describe, expect, it } from 'vitest';
import {
  getNextBestForCompound,
  getNextBestForHallmark,
  getNextBestForStack,
  getNextBestForComparison,
  getNextBestForGuide,
} from './next-best';
import { libraryModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { eliteStacks } from './stacks-library';
import { evidenceComparisons } from './comparisons';
import { getMappedGuideHrefs } from './library-graph';

const compoundModuleSlugs = libraryModules
  .filter((m) => m.category === 'compounds')
  .map((m) => m.slug);

/**
 * "No dead ends" — every entity page this rail is wired into must resolve to
 * at least one real next step. Every href returned must also be well-formed
 * (a real route or a real /library/compounds/, /library/, /library/compare/,
 * or /stacks?preset= link) so the rail never renders a broken link.
 */
describe('next-best rail — no dead ends', () => {
  it.each(compoundModuleSlugs)('compound %s has a non-empty next-best rail', (slug) => {
    const items = getNextBestForCompound(slug);
    expect(items.length, `${slug} has no next-best links — dead end`).toBeGreaterThan(0);
  });

  it.each(hallmarkLibrary.map((h) => h.id))('hallmark %s has a non-empty next-best rail', (id) => {
    const items = getNextBestForHallmark(id);
    expect(items.length, `hallmark ${id} has no next-best links — dead end`).toBeGreaterThan(0);
  });

  it.each(eliteStacks.map((s) => s.slug))('stack %s has a non-empty next-best rail', (slug) => {
    const items = getNextBestForStack(slug);
    expect(items.length, `stack ${slug} has no next-best links — dead end`).toBeGreaterThan(0);
  });

  it.each(evidenceComparisons.map((c) => c.slug))('comparison %s has a non-empty next-best rail', (slug) => {
    const items = getNextBestForComparison(slug);
    expect(items.length, `comparison ${slug} has no next-best links — dead end`).toBeGreaterThan(0);
  });

  it.each(getMappedGuideHrefs())('guide %s has a non-empty next-best rail', (href) => {
    const items = getNextBestForGuide(href);
    expect(items.length, `guide ${href} has no next-best links — dead end`).toBeGreaterThan(0);
  });
});

describe('next-best rail — well-formed hrefs', () => {
  const hrefPattern = /^\/(library\/compounds\/[a-z0-9-]+|library\/[a-z0-9-]+|library\/compare\/[a-z0-9-]+|stacks\?preset=[a-z0-9-]+|[a-z0-9-]+-supplement-guide)$/;

  it.each(compoundModuleSlugs)('compound %s rail links are well-formed', (slug) => {
    for (const item of getNextBestForCompound(slug)) {
      expect(item.href, `${slug} -> ${item.type}:${item.slug} has a malformed href ${item.href}`).toMatch(
        hrefPattern,
      );
    }
  });

  it('rail respects the limit parameter', () => {
    const items = getNextBestForHallmark('mito', 2);
    expect(items.length).toBeLessThanOrEqual(2);
  });

  it('rail has no duplicate type:slug entries', () => {
    for (const slug of compoundModuleSlugs) {
      const items = getNextBestForCompound(slug, 20);
      const keys = items.map((i) => `${i.type}:${i.slug}`);
      expect(new Set(keys).size, `${slug} rail has duplicate entries`).toBe(keys.length);
    }
  });
});
