import { stackPresets, type PresetKey } from './presets';
import { getQuizResult, type QuizAnswers } from './homepage';
import { buildShopPresetUrl } from './stack-url';

export interface QuizProfile {
  goal?: string;
  age?: string;
  experience?: string;
  preset: string;
}

export function getHeroPersonalization(quiz: QuizProfile | null | undefined) {
  if (!quiz?.preset || !(quiz.preset in stackPresets)) {
    return {
      line1: 'Understand what supplements may do.',
      line2: 'Then model the longevity impact.',
      subcopy:
        'TNiC turns supplement research into clear, cited projections: what each compound targets, how strong the evidence is, which biomarkers may move, and what that could mean for healthspan. Your data stays in your browser.',
      primary: { href: '/quiz', label: 'Start 3-Min Quiz' },
      secondary: { href: '/dashboard', label: 'Open Forecast Hub' },
      contextNext:
        'Take the 3-min quiz for a mechanism-matched supplement path, or open the dashboard to compare modeled effects against your own labs and goals.',
    };
  }

  const preset = quiz.preset as PresetKey;
  const stack = stackPresets[preset];
  const answers: QuizAnswers = {
    goal: quiz.goal,
    age: quiz.age,
    experience: quiz.experience,
  };
  const result = getQuizResult(answers);

  return {
    line1: 'Welcome back.',
    line2: `${stack.label} is ready.`,
    subcopy: result.insight,
    primary: { href: `/stacks?preset=${preset}`, label: `Resume ${stack.label}` },
    secondary: { href: buildShopPresetUrl(preset), label: 'Verify picks at Shop' },
    contextNext: `Load ${stack.label} in Stack Architect (${stack.ids.length} compounds), review modeled pathway effects, log baseline labs, then verify brands with stack-filtered COA checklists.`,
  };
}

const OS_HREF_ORDER: Record<string, string[]> = {
  learn: ['/library', '/dashboard', '/stacks', '/labs', '/tools'],
  defense: ['/tools', '/stacks', '/labs', '/library', '/dashboard'],
  energy: ['/stacks', '/labs', '/dashboard', '/library', '/tools'],
  full: ['/dashboard', '/stacks', '/labs', '/library', '/tools'],
};

export function getOsFunnelOrder(goal?: string): string[] {
  return OS_HREF_ORDER[goal ?? ''] ?? OS_HREF_ORDER.full;
}

export function getPresetCompoundIds(preset?: string): string[] {
  if (preset && preset in stackPresets) {
    return [...stackPresets[preset as PresetKey].ids];
  }
  return [];
}
