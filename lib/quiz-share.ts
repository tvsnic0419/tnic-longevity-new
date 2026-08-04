import { compounds } from './data';
import { getQuizResult, quizSteps, type QuizAnswers } from './homepage';
import { type QuestionnaireAnswers } from './questionnaire';
import { buildShopPresetUrl } from './stack-url';
import { SITE } from './site';
import { stackPresets, type PresetKey } from './presets';

export const PRESET_OG_ACCENTS: Record<PresetKey, string> = {
  starter: '#34d399',
  nrf2: '#22d3ee',
  mito: '#a78bfa',
  hybrid: '#f472b6',
  longevity: '#fb923c',
  metabolic: '#4ade80',
  full: '#818cf8',
};

export const PRESET_KEYS = Object.keys(stackPresets) as PresetKey[];

function labelFor(stepId: keyof QuizAnswers, optionId: string): string {
  const step = quizSteps.find((s) => s.id === stepId);
  const opt = step?.options.find((o) => o.id === optionId);
  return opt?.label ?? optionId;
}

export function isCompleteQuizAnswers(answers: QuizAnswers): answers is Required<QuizAnswers> {
  return Boolean(answers.goal && answers.age && answers.experience);
}

export function buildQuizSharePath(answers: QuizAnswers): string {
  const result = getQuizResult(answers);
  const params = new URLSearchParams();
  if (answers.goal) params.set('goal', answers.goal);
  if (answers.age) params.set('age', answers.age);
  if (answers.experience) params.set('experience', answers.experience);
  const qs = params.toString();
  return `/quiz/share/${result.preset}${qs ? `?${qs}` : ''}`;
}

/** OG-friendly share URL — social crawlers hit /quiz/share/[preset]/opengraph-image */
export function buildQuizShareUrl(answers: QuizAnswers): string {
  return `${SITE.url}${buildQuizSharePath(answers)}`;
}

export function buildQuizOgImageUrl(preset: PresetKey): string {
  return `${SITE.url}/quiz/share/${preset}/opengraph-image`;
}

export function buildQuizStacksUrl(preset: PresetKey): string {
  return `${SITE.url}/stacks?from=quiz&preset=${preset}`;
}

export function buildQuizShopUrl(preset: PresetKey): string {
  return `${SITE.url}${buildShopPresetUrl(preset)}`;
}

/* ── /results codec ───────────────────────────────────────────────────────
   The full nine-answer round-trip. Answers live in the URL so a result
   survives a refresh, can be bookmarked and shared, and can be recomputed on
   the server — none of which the old inline-only result could do.

   The first three keys keep their original names so existing /quiz/share
   links and any bookmarked three-answer URLs still resolve. */

const SAFETY_SEPARATOR = ',';

export function buildResultsQuery(answers: QuestionnaireAnswers): string {
  const params = new URLSearchParams();
  if (answers.goal) params.set('goal', answers.goal);
  if (answers.age) params.set('age', answers.age);
  if (answers.experience) params.set('experience', answers.experience);
  if (answers.sex) params.set('sex', answers.sex);
  if (answers.sleep) params.set('sleep', answers.sleep);
  if (answers.energy) params.set('energy', answers.energy);
  if (answers.stress) params.set('stress', answers.stress);
  if (answers.movement) params.set('movement', answers.movement);
  if (answers.safety?.length) params.set('safety', answers.safety.join(SAFETY_SEPARATOR));
  return params.toString();
}

export function buildResultsPath(answers: QuestionnaireAnswers): string {
  const qs = buildResultsQuery(answers);
  return `/results${qs ? `?${qs}` : ''}`;
}

export function buildResultsUrl(answers: QuestionnaireAnswers): string {
  return `${SITE.url}${buildResultsPath(answers)}`;
}

/** Decode answers from `/results` search params. Returns null when nothing usable is present. */
export function parseResultsSearchParams(
  input: string | URLSearchParams | Record<string, string | string[] | undefined>,
): QuestionnaireAnswers | null {
  const get = (key: string): string | undefined => {
    if (typeof input === 'string') return new URLSearchParams(input).get(key) ?? undefined;
    if (input instanceof URLSearchParams) return input.get(key) ?? undefined;
    const value = input[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const safetyRaw = get('safety');
  const answers: QuestionnaireAnswers = {
    goal: get('goal'),
    age: get('age'),
    experience: get('experience'),
    sex: get('sex'),
    sleep: get('sleep'),
    energy: get('energy'),
    stress: get('stress'),
    movement: get('movement'),
    safety: safetyRaw ? safetyRaw.split(SAFETY_SEPARATOR).filter(Boolean) : undefined,
  };

  // The goal is the only answer the recommendation cannot be resolved without —
  // everything else has a documented neutral default.
  return answers.goal ? answers : null;
}

export function parseQuizSearchParams(search: string): QuizAnswers | null {
  const params = new URLSearchParams(search);
  const goal = params.get('goal') ?? undefined;
  const age = params.get('age') ?? undefined;
  const experience = params.get('experience') ?? undefined;
  const answers: QuizAnswers = { goal, age, experience };
  return isCompleteQuizAnswers(answers) ? answers : null;
}

export function buildQuizShareText(answers: QuizAnswers): string {
  const result = getQuizResult(answers);
  const compoundNames = result.stack.ids
    .map((id) => compounds.find((c) => c.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  return [
    `My TNiC longevity quiz result: ${result.stack.label}`,
    '',
    `Goal: ${labelFor('goal', answers.goal!)}`,
    `Age: ${labelFor('age', answers.age!)}`,
    `Experience: ${labelFor('experience', answers.experience!)}`,
    '',
    `Recommended stack: ${compoundNames}`,
    result.insight,
    '',
    `Load in Stack Architect: ${buildQuizStacksUrl(result.preset as PresetKey)}`,
    `Shop verified picks: ${buildQuizShopUrl(result.preset as PresetKey)}`,
    `Retake or view: ${buildQuizShareUrl(answers)}`,
    '',
    '#longevity #TNiC #healthspan',
  ].join('\n');
}

export function buildQuizShareMarkdown(answers: QuizAnswers): string {
  const result = getQuizResult(answers);
  const stacksUrl = buildQuizStacksUrl(result.preset as PresetKey);
  const shopUrl = buildQuizShopUrl(result.preset as PresetKey);
  const quizUrl = buildQuizShareUrl(answers);

  const compoundList = result.stack.ids
    .map((id) => {
      const c = compounds.find((x) => x.id === id);
      return c ? `- **${c.name}** — Tier ${c.evidence}, ${c.dose}` : null;
    })
    .filter(Boolean)
    .join('\n');

  return `# TNiC Quiz Result — ${result.stack.label}

> ${result.insight}

| Profile | Value |
| --- | --- |
| Goal | ${labelFor('goal', answers.goal!)} |
| Age range | ${labelFor('age', answers.age!)} |
| Experience | ${labelFor('experience', answers.experience!)} |
| Preset | ${result.stack.label} |

## Recommended compounds

${compoundList}

## Next steps

- [Load stack in Architect](${stacksUrl})
- [Shop verified picks](${shopUrl})
- [Retake quiz](${quizUrl})

![${result.stack.label} quiz result](${buildQuizOgImageUrl(result.preset as PresetKey)})

---
*Generated by [TNiC](${SITE.url}) — evidence-graded longevity intelligence.*
`;
}