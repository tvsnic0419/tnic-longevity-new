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
});
