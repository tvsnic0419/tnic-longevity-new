import { describe, expect, it } from 'vitest';
import {
  getLifestylePillar,
  getLabsDeepLink,
  lifestylePillarOrder,
  lifestylePillars,
} from './lifestyle-pillars';

describe('lifestyle-pillars', () => {
  it('covers all four lifestyle modules', () => {
    expect(lifestylePillarOrder).toHaveLength(4);
    expect(Object.keys(lifestylePillars)).toHaveLength(4);
  });

  it('each pillar has hallmark weights and lab tie-ins', () => {
    for (const slug of lifestylePillarOrder) {
      const pillar = lifestylePillars[slug];
      expect(pillar.hallmarkWeights.length).toBeGreaterThanOrEqual(3);
      expect(pillar.labTieIns.length).toBeGreaterThanOrEqual(2);
      expect(pillar.wearableSignals.length).toBeGreaterThanOrEqual(3);
      expect(pillar.decisionSummary.length).toBeGreaterThan(20);
    }
  });

  it('getLifestylePillar returns undefined for unknown slug', () => {
    expect(getLifestylePillar('cardio')).toBeUndefined();
    expect(getLifestylePillar('sleep')?.slug).toBe('sleep');
  });

  it('getLabsDeepLink encodes marker and tab', () => {
    expect(getLabsDeepLink('hscrp')).toBe('/labs?marker=hscrp&tab=input');
  });
});