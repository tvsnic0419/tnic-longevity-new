import { describe, it, expect } from 'vitest';
import {
  computeNicoStack,
  NICO_DEFAULT_ANSWERS,
  type NicoAnswers,
} from './nico-questionnaire';
import { compounds } from './data';

const base: NicoAnswers = { ...NICO_DEFAULT_ANSWERS };

describe('NICO questionnaire engine', () => {
  it('computes a non-empty personalized stack', () => {
    const r = computeNicoStack({ ...base, goals: ['longevity'] });
    expect(r.compoundIds.length).toBeGreaterThanOrEqual(3);
    expect(r.protocolName).toBeTruthy();
    expect(r.synergy).toBeGreaterThan(0);
    expect(r.hallmarksCovered).toBeGreaterThan(0);
    expect(r.estMonthlyCost).toBeGreaterThan(0);
  });

  it('every recommended compound exists in the graded library', () => {
    const r = computeNicoStack({ ...base, goals: ['energy'], focus: ['mito'] });
    for (const id of r.compoundIds) {
      expect(compounds.some((c) => c.id === id)).toBe(true);
    }
  });

  it('two distinct runs return two different stacks', () => {
    const energy = computeNicoStack({
      ...base,
      goals: ['energy'],
      energy: 1,
      focus: ['mito'],
    });
    const sleepStress = computeNicoStack({
      ...base,
      goals: ['sleep'],
      sleep: 1,
      stress: 5,
      focus: ['inflammation'],
    });
    expect(energy.compoundIds).not.toEqual(sleepStress.compoundIds);
    // Energy-led run should surface an NAD+/mito compound; sleep-led should surface a sleep aid.
    expect(energy.compoundIds).toContain('nmn');
    expect(sleepStress.compoundIds.some((id) => ['magnesium', 'glycine', 'melatonin'].includes(id))).toBe(
      true,
    );
  });

  it('safety filters exclude flagged compounds', () => {
    const r = computeNicoStack({
      ...base,
      goals: ['inflammation'],
      safety: ['anticoagulant'],
    });
    expect(r.compoundIds).not.toContain('omega3');
    expect(r.compoundIds).not.toContain('vitamin-k2');
    expect(r.safetyNotes.length).toBeGreaterThan(0);
  });

  it('statin flag prioritizes CoQ10', () => {
    const r = computeNicoStack({ ...base, goals: ['energy'], safety: ['statin'] });
    expect(r.compoundIds).toContain('coq10');
  });
});
