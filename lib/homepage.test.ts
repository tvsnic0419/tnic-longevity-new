import { describe, expect, it } from 'vitest';
import { getQuizPreset, getQuizResult, type QuizAnswers } from './homepage';
import { stackPresets } from './presets';

describe('getQuizPreset', () => {
  it('maps each goal to its mechanism preset', () => {
    expect(getQuizPreset({ goal: 'learn' })).toBe('starter');
    expect(getQuizPreset({ goal: 'defense' })).toBe('nrf2');
    expect(getQuizPreset({ goal: 'energy' })).toBe('mito');
    expect(getQuizPreset({ goal: 'longevity' })).toBe('longevity');
    expect(getQuizPreset({ goal: 'metabolic' })).toBe('metabolic');
  });

  it('scales the complete-protocol goal by experience', () => {
    expect(getQuizPreset({ goal: 'full', experience: 'new' })).toBe('starter');
    expect(getQuizPreset({ goal: 'full', experience: 'some' })).toBe('hybrid');
    expect(getQuizPreset({ goal: 'full', experience: 'advanced' })).toBe('full');
    // No experience answered yet → sensible middle default.
    expect(getQuizPreset({ goal: 'full' })).toBe('hybrid');
  });

  it('falls back to the foundation stack for missing or unknown goals', () => {
    expect(getQuizPreset({})).toBe('starter');
    expect(getQuizPreset({ goal: 'nonsense' })).toBe('starter');
  });

  it('never broadens a brand-new user past their goal-specific base, regardless of age', () => {
    expect(getQuizPreset({ goal: 'defense', age: '60+', experience: 'new' })).toBe('nrf2');
    expect(getQuizPreset({ goal: 'metabolic', age: '60+', experience: 'new' })).toBe('metabolic');
  });

  it('never broadens the learn goal — it stays on fundamentals regardless of age/experience', () => {
    expect(getQuizPreset({ goal: 'learn', age: '60+', experience: 'advanced' })).toBe('starter');
  });

  it('takes the softer hybrid rung for a two-rung goal on a single readiness signal', () => {
    // Some experience alone (young age) isn't enough to broaden...
    expect(getQuizPreset({ goal: 'defense', age: '30-40', experience: 'some' })).toBe('nrf2');
    // ...but some experience *and* an accelerated-decline age band is.
    expect(getQuizPreset({ goal: 'defense', age: '60+', experience: 'some' })).toBe('hybrid');
    expect(getQuizPreset({ goal: 'energy', age: '51-60', experience: 'some' })).toBe('hybrid');
  });

  it('takes the full rung for a two-rung goal only when both signals are strongest', () => {
    expect(getQuizPreset({ goal: 'defense', age: '60+', experience: 'advanced' })).toBe('full');
    expect(getQuizPreset({ goal: 'energy', age: '51-60', experience: 'advanced' })).toBe('full');
    // Advanced alone (young age) only earns the softer rung.
    expect(getQuizPreset({ goal: 'energy', age: '30-40', experience: 'advanced' })).toBe('hybrid');
  });

  it('only broadens a single-rung goal (metabolic, longevity) on the strongest combined signal', () => {
    // Advanced experience alone isn't enough — there's no gentle mid-tier for these goals.
    expect(getQuizPreset({ goal: 'metabolic', age: '30-40', experience: 'advanced' })).toBe('metabolic');
    expect(getQuizPreset({ goal: 'longevity', age: '60+', experience: 'some' })).toBe('longevity');
    // Advanced + accelerated age together jump straight to the full spectrum.
    expect(getQuizPreset({ goal: 'metabolic', age: '60+', experience: 'advanced' })).toBe('full');
    expect(getQuizPreset({ goal: 'longevity', age: '51-60', experience: 'advanced' })).toBe('full');
  });

  it('lets the complete-protocol goal reach full spectrum via age, not just experience', () => {
    expect(getQuizPreset({ goal: 'full', age: '60+', experience: 'some' })).toBe('full');
    expect(getQuizPreset({ goal: 'full', age: '30-40', experience: 'some' })).toBe('hybrid');
  });

  it('never lets age alone (experience not yet answered) preview a bigger stack than "new" would give', () => {
    // Regression: the live quiz preview calls getQuizPreset mid-flow with age
    // known but experience not yet picked. Age must not borrow the "some"
    // upgrade path on its own, or the preview promises Full-Spectrum and
    // then drops to Foundation the instant the user answers "Brand new".
    expect(getQuizPreset({ goal: 'full', age: '60+' })).toBe('hybrid');
    expect(getQuizPreset({ goal: 'full', age: '51-60' })).toBe('hybrid');
  });
});

describe('getQuizResult', () => {
  const base: QuizAnswers = { goal: 'energy', age: '41-50', experience: 'some' };

  it('returns the preset stack and a goal-specific next step', () => {
    const result = getQuizResult(base);
    expect(result.preset).toBe('mito');
    expect(result.stack).toBe(stackPresets.mito);
    expect(result.primary.href).toBe('/library?q=mitochondrial');
  });

  it('never describes a stack the user was not given', () => {
    // Regression: the energy goal used to fall through to insight copy naming the
    // Hybrid preset and GlyNAC — neither is in the Mitochondrial stack it loads.
    const insight = getQuizResult({ goal: 'energy', experience: 'new' }).insight;
    expect(insight).toContain('Mitochondrial');
    expect(insight).not.toContain('Hybrid');
    expect(insight).not.toContain('GlyNAC');
  });

  it('personalizes the closing line by age and experience', () => {
    expect(getQuizResult({ goal: 'defense', age: '60+' }).insight).toContain('60+');
    expect(getQuizResult({ goal: 'defense', experience: 'new' }).insight).toContain('phase these in');
    expect(getQuizResult({ goal: 'defense', experience: 'advanced' }).insight).toContain('Stack Architect');
  });

  it('routes the complete-protocol goal to a stack sized to experience', () => {
    expect(getQuizResult({ goal: 'full', experience: 'new' }).stack).toBe(stackPresets.starter);
    expect(getQuizResult({ goal: 'full', experience: 'advanced' }).stack).toBe(stackPresets.full);
  });

  it('explains it in the insight when age/experience broadened the stack beyond the goal base', () => {
    const broadened = getQuizResult({ goal: 'defense', age: '60+', experience: 'advanced' });
    expect(broadened.preset).toBe('full');
    expect(broadened.insight).toContain('broadened');
    expect(broadened.insight).toContain('NRF2 Defense');
  });

  it('says nothing about broadening when the user stayed on the goal-specific base', () => {
    const unbroadened = getQuizResult({ goal: 'defense', age: '30-40', experience: 'new' });
    expect(unbroadened.preset).toBe('nrf2');
    expect(unbroadened.insight).not.toContain('broadened');
  });
});
