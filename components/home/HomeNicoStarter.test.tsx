// @vitest-environment jsdom
/**
 * Guards the specific defect this component was rebuilt to fix.
 *
 * The previous starter spread NICO_DEFAULT_ANSWERS and overrode only age,
 * movement and goals — so it sent `safety: []` on every run. The engine reads
 * an empty list as "nothing to avoid", which meant SAFETY_EXCLUDE never fired
 * (flagging pregnancy removes 13 compounds), the "Safety notes" panel could
 * never render, and the section copy promised a safety screen the code did not
 * run. These tests exist so that cannot silently come back: the safety step
 * must be reachable and must refuse to compute on a blank answer.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { HomeNicoStarter } from '@/components/home/HomeNicoStarter';
import { NICO_SAFETY_OPTIONS, NICO_SCALE_LABELS } from '@/lib/nico-questionnaire';

expect.extend(toHaveNoViolations);
afterEach(() => cleanup());

// The section is wrapped in RevealItem, whose framer-motion viewport feature
// needs an IntersectionObserver that jsdom does not provide. A no-op stub is
// enough: nothing here asserts on reveal animation.
class NoopIO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds: number[] = [];
}
(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = NoopIO;

/** Click a button in the console by its visible label prefix. */
function press(container: HTMLElement, text: string) {
  const btn = within(container)
    .getAllByRole('button')
    .find((b) => b.textContent?.trim().startsWith(text));
  if (!btn) throw new Error(`no button starting with "${text}"`);
  fireEvent.click(btn);
  return btn;
}

function computeButton(container: HTMLElement) {
  return within(container)
    .getAllByRole('button')
    .find((b) => b.textContent?.includes('Compute')) as HTMLButtonElement | undefined;
}

describe('HomeNicoStarter', () => {
  it('walks three steps and reaches the safety screen', () => {
    const { container } = render(<HomeNicoStarter />);
    expect(container.querySelectorAll('.nico-step')).toHaveLength(3);
    press(container, 'Continue');
    press(container, 'Continue');
    // Every safety flag the engine knows about is offered.
    for (const o of NICO_SAFETY_OPTIONS) {
      expect(container.textContent).toContain(o.label);
    }
  });

  it('refuses to compute until the safety question has a real answer', () => {
    const { container } = render(<HomeNicoStarter />);
    press(container, 'Continue');
    press(container, 'Continue');

    // Blank answer must not be treated as "no contraindications".
    expect(computeButton(container)?.disabled).toBe(true);

    press(container, 'None of these apply');
    expect(computeButton(container)?.disabled).toBe(false);
  });

  it('accepts a flag as an answer too, not only the explicit "none"', () => {
    const { container } = render(<HomeNicoStarter />);
    press(container, 'Continue');
    press(container, 'Continue');
    press(container, NICO_SAFETY_OPTIONS[0].label);
    expect(computeButton(container)?.disabled).toBe(false);
  });

  it('asks the lifestyle pillars the engine actually scores, using its own wording', () => {
    const { container } = render(<HomeNicoStarter />);
    press(container, 'Continue');
    // Sourced from NICO_SCALE_LABELS so the starter cannot drift from /nico.
    for (const pillar of ['sleep', 'energy', 'stress', 'diet'] as const) {
      expect(container.textContent).toContain(NICO_SCALE_LABELS[pillar].question);
    }
  });

  it('has no axe violations on the first step', async () => {
    const { container } = render(<HomeNicoStarter />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
