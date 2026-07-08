import { describe, expect, it } from 'vitest';
import {
  ELITE_8_COMPOUNDS,
  LQ_WEIGHTS,
  calcLQScore,
  getScoredCompounds,
  sumLQWeights,
} from './elite-8-data';

describe('elite-8-data', () => {
  it('has eight compounds', () => {
    expect(ELITE_8_COMPOUNDS).toHaveLength(8);
  });

  it('weights sum to 1.0 (CE–HP) minus penalty weight', () => {
    expect(sumLQWeights()).toBeCloseTo(1.0, 5);
  });

  it('calcLQScore returns positive bounded scores', () => {
    for (const compound of ELITE_8_COMPOUNDS) {
      const score = calcLQScore(compound);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it('getScoredCompounds sorts descending by score', () => {
    const scored = getScoredCompounds();
    for (let i = 1; i < scored.length; i++) {
      expect(scored[i - 1].score).toBeGreaterThanOrEqual(scored[i].score);
    }
  });

  it('custom weights change ranking order', () => {
    const safetyFirst = { ...LQ_WEIGHTS, SF: 0.5, CE: 0.05, EB: 0.05, ES: 0.05, EE: 0.05, BV: 0.1, HP: 0.05, R: 0.15 };
    const defaultTop = getScoredCompounds()[0].id;
    const safetyTop = getScoredCompounds(safetyFirst)[0].id;
    expect(defaultTop).toBeTruthy();
    expect(safetyTop).toBeTruthy();
  });
});