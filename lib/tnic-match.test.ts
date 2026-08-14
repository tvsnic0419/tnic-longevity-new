import { describe, expect, it } from 'vitest';
import { computeTnicMatch } from './tnic-match';
import { PRODUCT_PICKS } from './product-picks';

describe('computeTnicMatch', () => {
  it('is deterministic and time-independent', () => {
    const pick = PRODUCT_PICKS.nmn;
    expect(computeTnicMatch(pick)).toEqual(computeTnicMatch(pick));
  });

  it('scores every curated pick within 0–100 with five criteria', () => {
    for (const pick of Object.values(PRODUCT_PICKS)) {
      const m = computeTnicMatch(pick);
      expect(m.score).toBeGreaterThanOrEqual(0);
      expect(m.score).toBeLessThanOrEqual(100);
      expect(m.criteria).toHaveLength(5);
    }
  });

  it('awards the compound-match points only when a graded compound joins', () => {
    for (const pick of Object.values(PRODUCT_PICKS)) {
      const m = computeTnicMatch(pick);
      const compoundCriterion = m.criteria.find((c) => c.key === 'compound');
      // A curated pick with a graded compound scores comfortably; the compound
      // criterion alone is worth 30 points.
      if (compoundCriterion?.met) {
        expect(m.score).toBeGreaterThanOrEqual(30);
      }
    }
  });

  it('rewards a fully-qualified pick with a high match score', () => {
    // glynac has a graded compound, dose note with units, brand + website, and a
    // verified link — it should clear the "strong match" bar.
    const m = computeTnicMatch(PRODUCT_PICKS.glynac);
    expect(m.score).toBeGreaterThanOrEqual(75);
  });

  it('marks unmet criteria without inflating the score', () => {
    const pick = { ...PRODUCT_PICKS.nmn, brandWebsite: '', linkVerifiedAt: undefined, doseNote: 'take daily' };
    const m = computeTnicMatch(pick);
    expect(m.criteria.find((c) => c.key === 'manufacturer')?.met).toBe(false);
    expect(m.criteria.find((c) => c.key === 'verified')?.met).toBe(false);
    expect(m.criteria.find((c) => c.key === 'dose')?.met).toBe(false);
    // Only compound + evidence points remain.
    expect(m.score).toBeLessThan(75);
  });
});
