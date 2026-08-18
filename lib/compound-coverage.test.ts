import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compoundModules, COMPOUND_COUNT, libraryModules } from './library-modules';

/**
 * Coverage guardrail for the compound library.
 *
 * The compound deep-dives have gone missing before — stranded on an unmerged
 * branch, or dropped when a surface silently switched to a smaller dataset. This
 * suite fails the build the moment that recurs, so a regression is caught in CI
 * instead of on the live site. If compounds are *intentionally* added or removed,
 * update EXPECTED_COMPOUND_COUNT in the same commit — that edit is the paper trail.
 *
 * Aug 2026: bumped 65 → 100 as the "photo-informed expansion batch" landed
 * (Mucuna, Ginkgo, Panax, Theobromine, Capsaicin, Pumpkin-seed, SOD, BioPerine,
 * MCT from the founder's Irwin Naturals label; plus a longevity-relevance
 * backlog of B-vitamin actives, mushroom polysaccharides, adaptogens, and
 * connective-tissue support).
 */

const EXPECTED_COMPOUND_COUNT = 100;
const COMPOUNDS_DIR = resolve(process.cwd(), 'content/compounds');

function mdxSlugs(): string[] {
  return readdirSync(COMPOUNDS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
    .sort();
}

describe('compound library coverage — the 55 never silently disappear', () => {
  it(`exposes exactly ${EXPECTED_COMPOUND_COUNT} compound modules`, () => {
    expect(COMPOUND_COUNT).toBe(EXPECTED_COMPOUND_COUNT);
    expect(compoundModules).toHaveLength(EXPECTED_COMPOUND_COUNT);
  });

  it('has one MDX deep-dive file per compound module and vice versa (1:1)', () => {
    const moduleSlugs = compoundModules.map((m) => m.mdxSlug).sort();
    const files = mdxSlugs();
    expect(moduleSlugs).toEqual(files);
    expect(files).toHaveLength(EXPECTED_COMPOUND_COUNT);
  });

  it('every compound module resolves to an existing MDX file', () => {
    for (const m of compoundModules) {
      const path = resolve(COMPOUNDS_DIR, `${m.mdxSlug}.mdx`);
      expect(existsSync(path), `${m.slug} → ${m.mdxSlug}.mdx is missing`).toBe(true);
    }
  });

  it('every compound module carries the fields the glance panel + hallmark graph rely on', () => {
    for (const m of compoundModules) {
      expect(m.evidenceTier, `${m.slug} has no evidence tier`).toMatch(/^[ABC]$/);
      expect(m.tagline.length, `${m.slug} has no tagline`).toBeGreaterThan(0);
      expect(
        Array.isArray(m.relatedHallmarkIds) && m.relatedHallmarkIds.length > 0,
        `${m.slug} maps to no hallmark — it would be invisible on hallmark pages`,
      ).toBe(true);
    }
  });

  it('compound module slugs are unique', () => {
    const slugs = compoundModules.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('no non-compound module leaks into the compound set', () => {
    expect(compoundModules.every((m) => m.category === 'compounds')).toBe(true);
    // sanity: the filter and the raw list agree
    expect(compoundModules.length).toBe(
      libraryModules.filter((m) => m.category === 'compounds').length,
    );
  });
});
