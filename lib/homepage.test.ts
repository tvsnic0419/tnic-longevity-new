import { describe, expect, it } from 'vitest';
import { getPersonalizedAdditions, getQuizPreset, getQuizResult, type QuizAnswers } from './homepage';
import { stackPresets } from './presets';
import { compounds, safetyNotes } from './data';

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
    // upgrade path on its own, or the preview promises Full-Spectrum 14 and
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

describe('lean budget caps preset broadening', () => {
  it('overrides age/experience broadening back to the goal base', () => {
    // Without a budget answer this combination broadens all the way to 'full' (see the
    // 'takes the full rung' test above) — a lean budget must undo that entirely.
    expect(getQuizPreset({ goal: 'defense', age: '60+', experience: 'advanced', budget: 'lean' })).toBe('nrf2');
    expect(getQuizPreset({ goal: 'metabolic', age: '60+', experience: 'advanced', budget: 'lean' })).toBe('metabolic');
  });

  it('caps the open-ended "full" goal at its minimal starter tier', () => {
    expect(getQuizPreset({ goal: 'full', experience: 'advanced', budget: 'lean' })).toBe('starter');
  });

  it('does not affect resolution when budget is unanswered or not lean', () => {
    expect(getQuizPreset({ goal: 'defense', age: '60+', experience: 'advanced' })).toBe('full');
    expect(getQuizPreset({ goal: 'defense', age: '60+', experience: 'advanced', budget: 'standard' })).toBe('full');
    expect(getQuizPreset({ goal: 'defense', age: '60+', experience: 'advanced', budget: 'no-limit' })).toBe('full');
  });
});

describe('getPersonalizedAdditions', () => {
  it('returns nothing for a blank lifestyle profile', () => {
    expect(getPersonalizedAdditions({ goal: 'learn' })).toEqual([]);
  });

  it('adds sleep-support compounds for poor sleep', () => {
    expect(getPersonalizedAdditions({ goal: 'learn', sleep: 'poor' })).toEqual(['melatonin', 'glycine']);
    expect(getPersonalizedAdditions({ goal: 'learn', sleep: 'inconsistent' })).toEqual(['magnesium']);
  });

  it('adds NAC under high stress', () => {
    expect(getPersonalizedAdditions({ goal: 'learn', stress: 'high' })).toEqual(['nac']);
    expect(getPersonalizedAdditions({ goal: 'learn', stress: 'low' })).toEqual([]);
  });

  it('adds diet-gap compounds for plant-forward and low-carb diets', () => {
    expect(getPersonalizedAdditions({ goal: 'learn', diet: 'plant-forward' })).toEqual(['creatine', 'zinc']);
    expect(getPersonalizedAdditions({ goal: 'learn', diet: 'low-carb' })).toEqual(['magnesium']);
    expect(getPersonalizedAdditions({ goal: 'learn', diet: 'omnivore' })).toEqual([]);
  });

  it('adds training-support compounds for athlete-level training', () => {
    expect(getPersonalizedAdditions({ goal: 'learn', training: 'athlete' })).toEqual(['creatine', 'glucosamine']);
  });

  it('combines and de-duplicates across multiple lifestyle signals, capped at 3', () => {
    const additions = getPersonalizedAdditions({
      goal: 'learn', sleep: 'poor', stress: 'high', diet: 'plant-forward', training: 'athlete',
    });
    expect(additions.length).toBeLessThanOrEqual(3);
    expect(new Set(additions).size).toBe(additions.length);
  });

  it('never adds a compound already present in the resolved base preset', () => {
    // Full-Spectrum already includes glynac/sulforaphane/nmn/etc — none of the
    // lifestyle add-on ids should ever collide with a preset's own membership.
    for (const key of Object.keys(stackPresets) as (keyof typeof stackPresets)[]) {
      const additions = getPersonalizedAdditions({
        goal: 'full', experience: 'advanced', sleep: 'poor', stress: 'high', diet: 'plant-forward', training: 'athlete',
      });
      const baseIds = new Set<string>(stackPresets[key].ids);
      for (const id of additions) expect(baseIds.has(id)).toBe(false);
    }
  });

  it('caps additions to a single highest-priority pick on a lean budget', () => {
    const additions = getPersonalizedAdditions({
      goal: 'learn', sleep: 'poor', stress: 'high', diet: 'plant-forward', training: 'athlete', budget: 'lean',
    });
    expect(additions.length).toBe(1);
  });

  it('every addition id is a real, safety-profiled catalog compound', () => {
    const additions = getPersonalizedAdditions({
      goal: 'learn', sleep: 'poor', stress: 'high', diet: 'plant-forward', training: 'athlete',
    });
    for (const id of additions) {
      expect(compounds.some((c) => c.id === id), `${id} missing from compounds`).toBe(true);
      expect(safetyNotes.some((n) => n.compoundId === id), `${id} missing a safety profile`).toBe(true);
    }
  });
});

describe('getQuizResult additions', () => {
  it('threads personalized additions through into the result', () => {
    const result = getQuizResult({ goal: 'learn', sleep: 'poor' });
    expect(result.additions).toEqual(['melatonin', 'glycine']);
  });

  it('defaults to no additions when lifestyle questions are unanswered', () => {
    const result = getQuizResult({ goal: 'defense', age: '30-40', experience: 'new' });
    expect(result.additions).toEqual([]);
  });
});
