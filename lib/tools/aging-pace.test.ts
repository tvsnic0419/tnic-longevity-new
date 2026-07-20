import { describe, expect, it } from 'vitest';
import { projectAgingPace, type AgingPaceIntake } from './aging-pace';

const goodLifestyle: AgingPaceIntake = {
  age: 48,
  sex: 'female',
  sleep: 80,
  exercise: 70,
  diet: 75,
  stress: 30,
  substances: 5,
};

const poorLifestyle: AgingPaceIntake = {
  age: 60,
  sex: 'male',
  sleep: 40,
  exercise: 15,
  diet: 30,
  stress: 85,
  substances: 70,
};

describe('aging-pace engine', () => {
  it('empty stack produces no pace reduction and an inviting headline', () => {
    const r = projectAgingPace({ intake: goodLifestyle, stackIds: [] });
    expect(r.effectiveStackReduction).toBe(0);
    expect(r.yearsReclaimedByStack).toBe(0);
    expect(r.paceOfAging).toBeCloseTo(r.baselinePace, 5);
    expect(r.headline.toLowerCase()).toContain('add your supplements');
  });

  it('a healthy lifestyle has a lower baseline pace than a poor one', () => {
    const good = projectAgingPace({ intake: goodLifestyle, stackIds: [] });
    const poor = projectAgingPace({ intake: poorLifestyle, stackIds: [] });
    expect(good.baselinePace).toBeLessThan(poor.baselinePace);
    expect(poor.baselinePace).toBeGreaterThan(1.0);
    expect(good.baselinePace).toBeLessThan(1.0);
  });

  it('adding a stack always lowers the forward pace and reclaims ≥ 0 years', () => {
    const noStack = projectAgingPace({ intake: goodLifestyle, stackIds: [] });
    const withStack = projectAgingPace({ intake: goodLifestyle, stackIds: ['glynac', 'nmn', 'sulforaphane'] });
    expect(withStack.paceOfAging).toBeLessThan(noStack.paceOfAging);
    expect(withStack.yearsReclaimedByStack).toBeGreaterThan(0);
    expect(withStack.verdict).toBe('slowing');
  });

  it('contributions sum to the effective stack reduction and rank descending', () => {
    const r = projectAgingPace({ intake: goodLifestyle, stackIds: ['glynac', 'nmn', 'rala'] });
    const sumPct = r.contributions.reduce((s, c) => s + c.paceReductionPct, 0);
    // Each bar is rounded to 0.1, so the sum drifts up to ~0.15pp from the exact total.
    expect(sumPct).toBeCloseTo(r.effectiveStackReduction * 100, 0);
    for (let i = 1; i < r.contributions.length; i++) {
      expect(r.contributions[i].paceReductionPct).toBeLessThanOrEqual(r.contributions[i - 1].paceReductionPct);
    }
  });

  it('caps at 10 supplements and never exceeds the reduction ceiling', () => {
    const eleven = ['glynac', 'nmn', 'sulforaphane', 'cakg', 'rala', 'resveratrol', 'taurine', 'spermidine', 'berberine', 'omega3', 'fisetin'];
    const r = projectAgingPace({ intake: goodLifestyle, stackIds: eleven });
    expect(r.contributions.length).toBe(10);
    expect(r.effectiveStackReduction).toBeLessThanOrEqual(0.35 + 1e-9);
  });

  it('trajectory: chronological rises 1/yr; on-stack bio age stays below baseline and diverges', () => {
    const r = projectAgingPace({ intake: goodLifestyle, stackIds: ['glynac', 'nmn'], horizonYears: 10 });
    expect(r.points).toHaveLength(11);
    expect(r.points[0].chronoAge).toBe(48);
    expect(r.points[10].chronoAge).toBe(58);
    // on-stack is always ≤ baseline, and the gap widens over time
    const gap = (i: number) => r.points[i].baselineBioAge - r.points[i].stackBioAge;
    expect(gap(0)).toBeCloseTo(0, 5);
    expect(gap(10)).toBeGreaterThan(gap(2));
  });

  it('conservative ≤ expected ≤ optimistic reclaim range', () => {
    const r = projectAgingPace({ intake: goodLifestyle, stackIds: ['glynac', 'nmn', 'sulforaphane'] });
    expect(r.yearsReclaimedRange[0]).toBeLessThanOrEqual(r.yearsReclaimedByStack);
    expect(r.yearsReclaimedByStack).toBeLessThanOrEqual(r.yearsReclaimedRange[1]);
  });

  it('lower adherence yields less reclaimed benefit', () => {
    const full = projectAgingPace({ intake: goodLifestyle, stackIds: ['glynac', 'nmn', 'cakg'], adherence: 1 });
    const partial = projectAgingPace({ intake: goodLifestyle, stackIds: ['glynac', 'nmn', 'cakg'], adherence: 0.7 });
    expect(partial.yearsReclaimedByStack).toBeLessThan(full.yearsReclaimedByStack);
  });
});
