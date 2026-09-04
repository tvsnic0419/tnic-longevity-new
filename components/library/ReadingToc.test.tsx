// @vitest-environment jsdom
/**
 * ReadingToc guardrail. This component exists because the long-form pages run
 * ~24,000px on a phone and their only in-page navigation scrolled away in the
 * first ~5%; the properties worth protecting are therefore (a) the inline panel
 * still server-renders every section link — that is what keeps the section
 * anchors in the HTML for crawlers and for no-JS readers — and (b) the docked
 * control does NOT appear before the reader has scrolled past the inline panel.
 *
 * Scroll-spy itself is deliberately not asserted here: jsdom reports every
 * getBoundingClientRect as zeroes, so a "which section is active" test would be
 * asserting jsdom's geometry stub rather than real behaviour. That path was
 * verified against a real production build in Chromium instead.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReadingToc, type TocHeading } from '@/components/library/ReadingToc';

expect.extend(toHaveNoViolations);

// RTL's auto-cleanup is not wired up globally in this project, so containers
// would otherwise accumulate in document.body across tests.
afterEach(() => cleanup());

const headings: TocHeading[] = [
  { id: 'what-it-does', text: 'What it does', level: 2 },
  { id: 'mechanism', text: 'Mechanism', level: 2 },
  { id: 'dosing', text: 'Dosing protocol', level: 2 },
  { id: 'full-day', text: 'Full-day schedule', level: 3 },
];

describe('ReadingToc', () => {
  it('renders a link for every heading, in order', () => {
    const { container } = render(<ReadingToc headings={headings} readingMinutes={9} />);
    const links = [...container.querySelectorAll('nav[aria-label="On this page"] a')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '#what-it-does',
      '#mechanism',
      '#dosing',
      '#full-day',
    ]);
    expect(links.map((a) => a.textContent)).toEqual([
      'What it does',
      'Mechanism',
      'Dosing protocol',
      'Full-day schedule',
    ]);
  });

  it('indents sub-headings so the hierarchy is visible, not flattened', () => {
    const { container } = render(<ReadingToc headings={headings} readingMinutes={9} />);
    const items = [...container.querySelectorAll('nav[aria-label="On this page"] li')];
    expect(items[3].className).toContain('ml-4'); // the level-3 entry
    expect(items[0].className).not.toContain('ml-4');
  });

  it('surfaces the reading estimate', () => {
    const { container } = render(<ReadingToc headings={headings} readingMinutes={9} />);
    expect(within(container).getByText('~9 min read')).toBeTruthy();
  });

  it('does not dock the floating control before the reader has scrolled past', () => {
    const { container } = render(<ReadingToc headings={headings} readingMinutes={9} />);
    // jsdom rects are all zero, so the inline panel is never "above the reading
    // line" — the dock must stay closed rather than float over the hero.
    expect(container.querySelector('.reading-toc-dock')).toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ReadingToc headings={headings} readingMinutes={9} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
