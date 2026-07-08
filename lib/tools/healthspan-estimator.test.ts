import { describe, expect, it } from 'vitest';
import { estimateHealthspan, type HealthspanInput } from './healthspan-estimator';

// A profile with a real stack and solid lifestyle so the model produces a
// positive (improving) trajectory to test the shape of.
const improvingInput: HealthspanInput = {
  age: 48,
  stress: 35,
  sleep: 78,
  exercise: 65,
  stackIds: ['nmn', 'glynac', 'sulforaphane'],
  labEntries: [],
};

describe('healthspan estimator — biologically plausible projection', () => {
  const est = estimateHealthspan(improvingInput);
  const weeks = est.projections;

  it('projects the standard 0/4/12/24 week horizon', () => {
    expect(weeks.map((p) => p.week)).toEqual([0, 4, 12, 24]);
  });

  it('week 0 equals the current state (no phantom gains at baseline)', () => {
    expect(weeks[0].healthspanScore).toBe(est.currentHealthspanScore);
    expect(weeks[0].biologicalAge).toBe(est.biologicalAge);
  });

  it('healthspan rises monotonically and biological age falls monotonically', () => {
    for (let i = 1; i < weeks.length; i++) {
      expect(weeks[i].healthspanScore).toBeGreaterThanOrEqual(weeks[i - 1].healthspanScore);
      expect(weeks[i].biologicalAge).toBeLessThanOrEqual(weeks[i - 1].biologicalAge);
    }
  });

  it('gains are front-loaded — marginal improvement diminishes over time (plateau, not linear/accelerating)', () => {
    const perWeek = (a: number, b: number, span: number) => (weeks[b].healthspanScore - weeks[a].healthspanScore) / span;
    const early = perWeek(0, 1, 4);   // weeks 0→4
    const mid = perWeek(1, 2, 8);     // weeks 4→12
    const late = perWeek(2, 3, 12);   // weeks 12→24
    // Diminishing returns: each phase's per-week gain is no greater than the prior phase.
    expect(early).toBeGreaterThanOrEqual(mid - 1e-9);
    expect(mid).toBeGreaterThanOrEqual(late - 1e-9);
    // And the late phase must actually be slowing, not linear.
    expect(late).toBeLessThan(early);
  });

  it('projections stay within the model ceiling', () => {
    for (const p of weeks) {
      expect(p.healthspanScore).toBeLessThanOrEqual(98);
      expect(p.healthspanScore).toBeGreaterThanOrEqual(0);
    }
  });

  it('an empty stack with poor lifestyle produces no improvement trajectory', () => {
    const flat = estimateHealthspan({
      age: 60, stress: 90, sleep: 40, exercise: 10, stackIds: [], labEntries: [],
    });
    const first = flat.projections[0].healthspanScore;
    const last = flat.projections[flat.projections.length - 1].healthspanScore;
    expect(last - first).toBeLessThanOrEqual(1); // no meaningful phantom gains without inputs
  });
});
