import { describe, expect, it } from 'vitest';
import {
  buildQuizShareUrl,
  buildQuizSharePath,
  buildQuizOgImageUrl,
  buildQuizStacksUrl,
  buildQuizShopUrl,
  buildQuizShareText,
  isCompleteQuizAnswers,
  parseQuizSearchParams,
} from './quiz-share';

const sampleAnswers = {
  goal: 'energy',
  age: '41-50',
  experience: 'some',
} as const;

describe('quiz-share', () => {
  it('detects complete quiz answers', () => {
    expect(isCompleteQuizAnswers(sampleAnswers)).toBe(true);
    expect(isCompleteQuizAnswers({ goal: 'energy' })).toBe(false);
  });

  it('builds OG-friendly share path and URL', () => {
    const path = buildQuizSharePath(sampleAnswers);
    expect(path).toContain('/quiz/share/mito?');
    expect(path).toContain('goal=energy');
    const url = buildQuizShareUrl(sampleAnswers);
    expect(url).toBe(`https://tnic.help${path}`);
    expect(buildQuizOgImageUrl('mito')).toBe('https://tnic.help/quiz/share/mito/opengraph-image');
  });

  it('builds stacks and shop deep links', () => {
    expect(buildQuizStacksUrl('mito')).toBe('https://tnic.help/stacks?from=quiz&preset=mito');
    expect(buildQuizShopUrl('mito')).toBe('https://tnic.help/shop?stack=mito');
  });

  it('parses quiz search params', () => {
    const parsed = parseQuizSearchParams('?goal=energy&age=41-50&experience=some');
    expect(parsed).toEqual(sampleAnswers);
  });

  it('includes stack info in share text', () => {
    const text = buildQuizShareText(sampleAnswers);
    expect(text).toContain('Mitochondrial');
    expect(text).toContain('Stack Architect');
    expect(text).toContain('#longevity');
  });
});