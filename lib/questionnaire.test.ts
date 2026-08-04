import { describe, it, expect } from 'vitest';
import {
  quizSteps,
  getQuizPreset,
  scoreBurden,
  resolveQuestionnaireResult,
  isCompleteAnswers,
  SAFETY_FLAGS,
  QUESTIONNAIRE_NAME,
  type QuestionnaireAnswers,
} from './questionnaire';
import { stackPresets, type PresetKey } from './presets';
import { compounds, safetyNotes } from './data';
import { buildResultsQuery, parseResultsSearchParams } from './quiz-share';

const GOALS = quizSteps[0].options.map((o) => o.id);
const AGES = quizSteps[1].options.map((o) => o.id);
const EXPERIENCES = quizSteps[2].options.map((o) => o.id);
const PRESET_KEYS = Object.keys(stackPresets) as PresetKey[];

describe('questionnaire shape', () => {
  it('is the nine-question assessment, not the old three-question quiz', () => {
    expect(quizSteps).toHaveLength(9);
  });

  it('names itself consistently', () => {
    expect(QUESTIONNAIRE_NAME).toBe('The NICO Starter Questionnaire');
  });

  it('ends on the safety screen, which is the only multi-select step', () => {
    expect(quizSteps.at(-1)?.id).toBe('safety');
    expect(quizSteps.filter((s) => s.kind === 'multi').map((s) => s.id)).toEqual(['safety']);
  });

  it('gives every step a unique id and at least two options', () => {
    const ids = quizSteps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const step of quizSteps) {
      expect(step.options.length, `${step.id} needs options`).toBeGreaterThan(1);
      const optionIds = step.options.map((o) => o.id);
      expect(new Set(optionIds).size, `${step.id} has duplicate options`).toBe(optionIds.length);
    }
  });

  it('only reports complete once every question is answered', () => {
    const answers: QuestionnaireAnswers = {};
    expect(isCompleteAnswers(answers)).toBe(false);
    expect(
      isCompleteAnswers({
        goal: 'energy',
        age: '41-50',
        experience: 'some',
        sex: 'male',
        sleep: 'good',
        energy: 'good',
        stress: 'low',
        movement: 'active',
        safety: ['none'],
      }),
    ).toBe(true);
  });
});

describe('preset resolution', () => {
  it('resolves every goal × age × experience combination to a real preset', () => {
    for (const goal of GOALS) {
      for (const age of AGES) {
        for (const experience of EXPERIENCES) {
          const preset = getQuizPreset({ goal, age, experience });
          expect(PRESET_KEYS, `${goal}/${age}/${experience}`).toContain(preset);
        }
      }
    }
  });

  it('falls back to the foundation preset for an unanswered or unknown goal', () => {
    expect(getQuizPreset({})).toBe('starter');
    expect(getQuizPreset({ goal: 'not-a-real-goal' })).toBe('starter');
  });

  it('keeps a brand-new user on fundamentals regardless of age or burden', () => {
    const preset = getQuizPreset({
      goal: 'defense',
      age: '60+',
      experience: 'new',
      sleep: 'poor',
      energy: 'low',
      stress: 'high',
      movement: 'sedentary',
    });
    expect(preset).toBe('nrf2');
  });

  it('never broadens the "understand the science" path', () => {
    for (const age of AGES) {
      for (const experience of EXPERIENCES) {
        expect(getQuizPreset({ goal: 'learn', age, experience, sleep: 'poor', stress: 'high' })).toBe('starter');
      }
    }
  });
});

describe('lifestyle burden', () => {
  it('scores one point per flagged signal', () => {
    expect(scoreBurden({}).score).toBe(0);
    expect(scoreBurden({ sleep: 'poor' }).score).toBe(1);
    expect(scoreBurden({ sleep: 'poor', energy: 'low', stress: 'high', movement: 'sedentary' }).score).toBe(4);
  });

  it('implicates only hallmark ids that real compounds actually carry', () => {
    const known = new Set(compounds.flatMap((c) => c.hallmarks));
    const burden = scoreBurden({ sleep: 'poor', energy: 'low', stress: 'high', movement: 'sedentary' });
    expect(burden.priorityHallmarks.length).toBeGreaterThan(0);
    for (const h of burden.priorityHallmarks) expect(known).toContain(h);
  });

  it('broadens the stack for an experienced user under sustained load', () => {
    const base = { goal: 'defense', age: '41-50', experience: 'some' };
    const calm = getQuizPreset({ ...base, sleep: 'good', energy: 'good', stress: 'low', movement: 'active' });
    const loaded = getQuizPreset({ ...base, sleep: 'poor', energy: 'low', stress: 'high', movement: 'sedentary' });

    expect(calm).toBe('nrf2');
    expect(loaded).not.toBe(calm);
    expect(stackPresets[loaded].ids.length).toBeGreaterThan(stackPresets[calm].ids.length);
  });

  it('reorders the stack so the implicated pathways come first', () => {
    const answers: QuestionnaireAnswers = {
      goal: 'full',
      age: '41-50',
      experience: 'advanced',
      sleep: 'good',
      energy: 'good',
      stress: 'low',
      movement: 'active',
      safety: ['none'],
    };
    const calm = resolveQuestionnaireResult(answers);
    const loaded = resolveQuestionnaireResult({ ...answers, energy: 'low', sleep: 'poor' });

    expect(loaded.recommended.map((c) => c.id)).not.toEqual(calm.recommended.map((c) => c.id));
    expect(new Set(loaded.recommended.map((c) => c.id))).toEqual(new Set(calm.recommended.map((c) => c.id)));
  });
});

describe('recommendation integrity', () => {
  const everyCombination: QuestionnaireAnswers[] = GOALS.flatMap((goal) =>
    AGES.flatMap((age) =>
      EXPERIENCES.map((experience) => ({
        goal,
        age,
        experience,
        sleep: 'poor',
        energy: 'low',
        stress: 'high',
        movement: 'sedentary',
        safety: ['none'],
      })),
    ),
  );

  it('only ever recommends compounds that exist in the library data', () => {
    const known = new Set(compounds.map((c) => c.id));
    for (const answers of everyCombination) {
      for (const c of resolveQuestionnaireResult(answers).recommended) {
        expect(known, `unknown compound ${c.id}`).toContain(c.id);
      }
    }
  });

  it('always returns a non-empty stack when no safety flags are declared', () => {
    for (const answers of everyCombination) {
      expect(resolveQuestionnaireResult(answers).recommended.length).toBeGreaterThan(0);
    }
  });

  it('never both recommends and excludes the same compound', () => {
    for (const answers of everyCombination) {
      const r = resolveQuestionnaireResult({ ...answers, safety: ['anticoagulant', 'glucose'] });
      const recommended = new Set(r.recommended.map((c) => c.id));
      for (const e of r.excluded) expect(recommended).not.toContain(e.id);
    }
  });

  it('gives a phase-in plan whenever anything is recommended', () => {
    for (const answers of everyCombination) {
      const r = resolveQuestionnaireResult(answers);
      if (r.recommended.length > 0) expect(r.phasing.length).toBeGreaterThan(0);
    }
  });
});

describe('safety screen', () => {
  const ALL_FLAGS = SAFETY_FLAGS.filter((f) => f.id !== 'none').map((f) => f.id);

  /**
   * The load-bearing guard. Everything the safety screen tells a visitor must
   * be a string the curated `safetyNotes` data already asserts — this module is
   * not allowed to author a medical claim of its own.
   */
  it('sources every excluded and flagged reason verbatim from safetyNotes', () => {
    const curated = new Set(safetyNotes.flatMap((n) => [...n.avoidIf, ...n.consultIf]));

    for (const goal of GOALS) {
      for (const flag of ALL_FLAGS) {
        const r = resolveQuestionnaireResult({
          goal,
          age: '51-60',
          experience: 'advanced',
          safety: [flag],
        });
        for (const finding of [...r.excluded, ...r.flagged]) {
          expect(curated, `fabricated reason: "${finding.reason}"`).toContain(finding.reason);
        }
      }
    }
  });

  it('attributes each reason to the compound it actually belongs to', () => {
    const r = resolveQuestionnaireResult({
      goal: 'full',
      age: '51-60',
      experience: 'advanced',
      safety: ALL_FLAGS,
    });
    for (const finding of [...r.excluded, ...r.flagged]) {
      const notes = safetyNotes.find((n) => n.compoundId === finding.id);
      expect(notes, `no safety profile for ${finding.id}`).toBeDefined();
      expect([...(notes?.avoidIf ?? []), ...(notes?.consultIf ?? [])]).toContain(finding.reason);
    }
  });

  it('finds nothing when the visitor declares no conditions', () => {
    for (const safety of [undefined, [], ['none']]) {
      const r = resolveQuestionnaireResult({ goal: 'full', age: '51-60', experience: 'advanced', safety });
      expect(r.excluded).toEqual([]);
      expect(r.flagged).toEqual([]);
    }
  });

  it('caps a declared pregnancy to the smallest stack and flags what remains', () => {
    const r = resolveQuestionnaireResult({
      goal: 'full',
      age: '41-50',
      experience: 'advanced',
      safety: ['pregnancy'],
    });
    expect(r.preset).toBe('starter');
    expect(r.safetyCapped).toBe(true);
    expect(r.excluded.length + r.flagged.length).toBeGreaterThan(0);
    expect(r.insight).toContain('pregnancy or nursing');
  });

  it('actually removes or flags something for an anticoagulant declaration', () => {
    const r = resolveQuestionnaireResult({
      goal: 'longevity',
      age: '51-60',
      experience: 'advanced',
      safety: ['anticoagulant'],
    });
    expect(r.excluded.length + r.flagged.length).toBeGreaterThan(0);
  });

  it('keeps every safety flag reachable — no dead options in the screen', () => {
    for (const flag of ALL_FLAGS) {
      const hits = GOALS.map((goal) =>
        resolveQuestionnaireResult({ goal, age: '51-60', experience: 'advanced', safety: [flag] }),
      ).reduce((n, r) => n + r.excluded.length + r.flagged.length, 0);
      expect(hits, `safety flag "${flag}" never matches any curated safety note`).toBeGreaterThan(0);
    }
  });
});

describe('/results URL codec', () => {
  const answers: QuestionnaireAnswers = {
    goal: 'energy',
    age: '51-60',
    experience: 'some',
    sex: 'female',
    sleep: 'poor',
    energy: 'low',
    stress: 'high',
    movement: 'sedentary',
    safety: ['anticoagulant', 'thyroid'],
  };

  it('round-trips all nine answers', () => {
    expect(parseResultsSearchParams(buildResultsQuery(answers))).toEqual(answers);
  });

  it('resolves to the same recommendation after a round-trip', () => {
    const decoded = parseResultsSearchParams(buildResultsQuery(answers));
    expect(decoded).not.toBeNull();
    expect(resolveQuestionnaireResult(decoded!)).toEqual(resolveQuestionnaireResult(answers));
  });

  it('reads Next.js searchParams objects as well as query strings', () => {
    expect(parseResultsSearchParams({ goal: 'energy', safety: 'thyroid' })).toMatchObject({
      goal: 'energy',
      safety: ['thyroid'],
    });
  });

  it('returns null without a goal, so /results can redirect instead of inventing one', () => {
    expect(parseResultsSearchParams('')).toBeNull();
    expect(parseResultsSearchParams('age=51-60&experience=some')).toBeNull();
  });

  it('still accepts a legacy three-answer link', () => {
    const legacy = parseResultsSearchParams('goal=defense&age=41-50&experience=some');
    expect(legacy).toMatchObject({ goal: 'defense', age: '41-50', experience: 'some' });
    expect(resolveQuestionnaireResult(legacy!).recommended.length).toBeGreaterThan(0);
  });
});
