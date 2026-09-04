import { describe, it, expect } from 'vitest';
import {
  buildHeadToHead,
  comparableCompounds,
  isComparableId,
  DEFAULT_PAIR,
  TIE_BAND,
} from './head-to-head';
import { compounds } from './data';
import { getAllComparisonSlugs } from './comparisons';

describe('head-to-head comparison', () => {
  it('offers every graded compound, alphabetized, with no duplicates', () => {
    const options = comparableCompounds();
    expect(options.length).toBe(compounds.length);
    const names = options.map((o) => o.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(new Set(options.map((o) => o.id)).size).toBe(options.length);
  });

  it('resolves the default pair', () => {
    expect(isComparableId(DEFAULT_PAIR.a)).toBe(true);
    expect(isComparableId(DEFAULT_PAIR.b)).toBe(true);
    expect(buildHeadToHead(DEFAULT_PAIR.a, DEFAULT_PAIR.b)).not.toBeNull();
  });

  it('hands off to the curated in-depth page when one exists for the pair', () => {
    // Both orderings must resolve to the same authored comparison.
    const forward = buildHeadToHead('resveratrol', 'pterostilbene')!;
    const reverse = buildHeadToHead('pterostilbene', 'resveratrol')!;
    expect(forward.curatedSlug).toBe('resveratrol-vs-pterostilbene');
    expect(reverse.curatedSlug).toBe('resveratrol-vs-pterostilbene');
  });

  it('reports no curated page for a pairing nobody has written up', () => {
    expect(buildHeadToHead('creatine', 'iodine')!.curatedSlug).toBeNull();
  });

  it('only ever points at a curated slug that really exists', () => {
    for (const c of compounds) {
      if (c.id === 'nmn') continue;
      const slug = buildHeadToHead('nmn', c.id)!.curatedSlug;
      if (slug !== null) expect(getAllComparisonSlugs()).toContain(slug);
    }
  });

  it('refuses an unknown id or a self-comparison rather than half-rendering', () => {
    expect(buildHeadToHead('nmn', 'not-a-compound')).toBeNull();
    expect(buildHeadToHead('not-a-compound', 'nmn')).toBeNull();
    expect(buildHeadToHead('nmn', 'nmn')).toBeNull();
  });

  it('builds a comparison for every graded compound against the default', () => {
    for (const c of compounds) {
      if (c.id === DEFAULT_PAIR.a) continue;
      const result = buildHeadToHead(DEFAULT_PAIR.a, c.id);
      expect(result, `${c.id} failed to compare`).not.toBeNull();
      expect(result!.dimensions.length).toBe(6);
    }
  });

  // ── Honesty contract ──────────────────────────────────────────────────────

  it('never declares a leader when either side is unscored', () => {
    for (const c of compounds.slice(0, 25)) {
      if (c.id === DEFAULT_PAIR.a) continue;
      const r = buildHeadToHead(DEFAULT_PAIR.a, c.id)!;
      for (const d of r.dimensions) {
        if (d.a === null || d.b === null) {
          expect(d.leader).toBe('insufficient');
          expect(d.delta).toBeNull();
        }
      }
    }
  });

  it('respects the tie band — a gap inside it is never called a win', () => {
    for (const c of compounds) {
      if (c.id === DEFAULT_PAIR.a) continue;
      const r = buildHeadToHead(DEFAULT_PAIR.a, c.id)!;
      for (const d of r.dimensions) {
        if (d.delta !== null && d.delta <= TIE_BAND) {
          expect(d.leader).toBe('tie');
        }
      }
    }
  });

  it('reports an undocumented pairing as an absence of record, not as safety', () => {
    // Two compounds with no documented synergy between them.
    const pair = compounds.find(
      (c) => c.id !== 'nmn' && !c.synergies.includes('nmn') && !compounds.find((x) => x.id === 'nmn')!.synergies.includes(c.id),
    )!;
    const r = buildHeadToHead('nmn', pair.id)!;
    expect(r.relation.kind).toBe('undocumented');
    expect(r.relation.detail).toMatch(/not evidence that the pairing is safe/i);
  });

  it('detects a documented synergy in both directions', () => {
    // glynac lists sulforaphane; assert the pairing reads as synergy either way.
    expect(buildHeadToHead('glynac', 'sulforaphane')!.relation.kind).toBe('synergy');
    expect(buildHeadToHead('sulforaphane', 'glynac')!.relation.kind).toBe('synergy');
  });

  it('partitions hallmarks into shared and unique without loss', () => {
    const r = buildHeadToHead('glynac', 'sulforaphane')!;
    const aTotal = r.sharedHallmarks.length + r.uniqueA.length;
    const bTotal = r.sharedHallmarks.length + r.uniqueB.length;
    expect(aTotal).toBe(r.a.hallmarks.length);
    expect(bTotal).toBe(r.b.hallmarks.length);
    // Shared and unique must not overlap.
    const sharedIds = new Set(r.sharedHallmarks.map((h) => h.id));
    expect(r.uniqueA.some((h) => sharedIds.has(h.id))).toBe(false);
    expect(r.uniqueB.some((h) => sharedIds.has(h.id))).toBe(false);
  });

  it('counts comparable dimensions honestly', () => {
    const r = buildHeadToHead('glynac', 'sulforaphane')!;
    expect(r.comparableDimensions).toBe(
      r.dimensions.filter((d) => d.a !== null && d.b !== null).length,
    );
  });
});
