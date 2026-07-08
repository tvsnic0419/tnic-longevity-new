import { describe, expect, it } from 'vitest';
import { runBiomarkerDashboard, getDemoLabEntries } from './biomarker-dashboard';

describe('biomarker forecast — plausible trajectory shape', () => {
  const entries = getDemoLabEntries();
  const result = runBiomarkerDashboard(entries, ['glynac'], 'gsh', 24);

  it('produces a baseline trajectory plus at least one intervention forecast', () => {
    expect(result.forecasts.length).toBeGreaterThanOrEqual(2);
    expect(result.forecasts.some((f) => f.category === 'baseline')).toBe(true);
    expect(result.forecasts.some((f) => f.category !== 'baseline')).toBe(true);
  });

  it('the untreated baseline drifts ~linearly (constant per-step change)', () => {
    const baseline = result.forecasts.find((f) => f.category === 'baseline')!;
    const pts = baseline.projected;
    const steps = pts.slice(1).map((p, i) => p.value - pts[i].value);
    // Every step of a linear drift is equal, up to 2-decimal value rounding.
    for (const s of steps) {
      expect(Math.abs(s - steps[0])).toBeLessThanOrEqual(0.011);
    }
  });

  it('an intervention effect is front-loaded and plateaus (diminishing returns, not linear)', () => {
    const intervention = result.forecasts.find((f) => f.category !== 'baseline')!;
    const pts = intervention.projected;
    const stepMag = pts.slice(1).map((p, i) => Math.abs(p.value - pts[i].value));
    // Monotonic movement in one direction.
    const dirs = pts.slice(1).map((p, i) => Math.sign(p.value - pts[i].value)).filter((d) => d !== 0);
    expect(new Set(dirs).size).toBeLessThanOrEqual(1);
    // Front-loaded: the first step moves more than the last step.
    expect(stepMag[0]).toBeGreaterThan(stepMag[stepMag.length - 1]);
  });
});
