import { describe, expect, it } from 'vitest';
import {
  computeTnicScore,
  scoreBand,
  DIMENSION_META,
  type TnicDimensionKey,
} from './tnic-score';
import { compounds } from './data';

const DIM_KEYS = Object.keys(DIMENSION_META) as TnicDimensionKey[];

describe('computeTnicScore', () => {
  it('is deterministic — same input yields identical output', () => {
    const a = computeTnicScore('nmn');
    const b = computeTnicScore('nmn');
    expect(a).toEqual(b);
  });

  it('always returns all six canonical dimensions in order', () => {
    for (const id of ['nmn', 'berberine', 'creatine']) {
      const s = computeTnicScore(id);
      expect(s.dimensions.map((d) => d.key)).toEqual(DIM_KEYS);
    }
  });

  it('keeps composite and every dimension within 0–100', () => {
    for (const c of compounds) {
      const s = computeTnicScore(c.id);
      if (s.score != null) {
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
      }
      for (const d of s.dimensions) {
        if (d.value != null) {
          expect(d.value).toBeGreaterThanOrEqual(0);
          expect(d.value).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it('selects the LQ (high-confidence) source for an Elite-8 compound', () => {
    // nmn has a matching LQCompound → highest-fidelity source.
    const s = computeTnicScore('nmn');
    expect(s.source).toBe('lq');
    expect(s.confidence).toBe('high');
    expect(s.score).not.toBeNull();
  });

  it('maps a diverging id (glynac → glycine_nac) to the LQ model', () => {
    const s = computeTnicScore('glynac');
    expect(s.source).toBe('lq');
    expect(s.score).not.toBeNull();
  });

  it('selects the engine (moderate-confidence) source when no LQ entry exists', () => {
    // berberine is in the engine DB but not the Elite-8 LQ set.
    const s = computeTnicScore('berberine');
    expect(s.source).toBe('engine');
    expect(s.confidence).toBe('moderate');
  });

  it('returns a null score for an unknown compound id', () => {
    const s = computeTnicScore('not-a-real-compound');
    expect(s.score).toBeNull();
    expect(s.dimensions.every((d) => d.value == null)).toBe(true);
  });

  it('marks unsupported dimensions as null rather than fabricating them', () => {
    // A canonical-only compound (no LQ, no engine) exercises the limited path.
    const canonicalOnly = compounds.find(
      (c) => computeTnicScore(c.id).source === 'canonical',
    );
    // The dataset should contain at least one canonical-only compound.
    expect(canonicalOnly).toBeDefined();
    if (canonicalOnly) {
      const s = computeTnicScore(canonicalOnly.id);
      expect(s.confidence).toBe('limited');
      // The limited path deliberately leaves mechanistic/clinical/safety null.
      const nullKeys = s.dimensions.filter((d) => d.value == null).map((d) => d.key);
      expect(nullKeys).toContain('mechanisticStrength');
    }
  });
});

describe('scoreBand', () => {
  it('buckets scores into qualitative bands', () => {
    expect(scoreBand(88)).toBe('exceptional');
    expect(scoreBand(70)).toBe('strong');
    expect(scoreBand(52)).toBe('moderate');
    expect(scoreBand(40)).toBe('emerging');
    expect(scoreBand(null)).toBeNull();
  });
});
