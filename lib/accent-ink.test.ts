import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The light theme's accent tokens are fill values. Read as text they were, and
 * for a long time had been, below WCAG AA: cyan 3.52:1 on the page ground,
 * emerald 3.60:1, amber 3.04:1 — and amber is Tier C, so all three
 * evidence-tier colours failed as body text in the theme half the readers may
 * be using. `audit:ui` only surfaced two nodes of it, because most accent text
 * on the site happens to be bold or large enough for the 3:1 threshold; the
 * tokens themselves were the problem.
 *
 * `--accent-*-ink` is what an accent becomes when it is text. This test reads
 * the real values out of globals.css — not a copy of them — and holds them to
 * the two pairings that were failing.
 */

const css = readFileSync(resolve(__dirname, '../app/globals.css'), 'utf8');

const LIGHT_BLOCK = css.slice(
  css.indexOf('[data-theme="light"] {'),
  css.indexOf('@theme {'),
);

function token(name: string): string {
  const m = LIGHT_BLOCK.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`light theme does not define --${name}`);
  return m[1];
}

function luminance(hex: string): number {
  const c = hex.replace('#', '');
  const channels = [0, 2, 4]
    .map((i) => parseInt(c.substr(i, 2), 16) / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Composite `fg` at `alpha` over `bg` — how a 15% accent tint actually paints. */
function over(fg: string, alpha: number, bg: string): string {
  const f = fg.replace('#', '');
  const b = bg.replace('#', '');
  let out = '#';
  for (let i = 0; i < 3; i += 1) {
    const F = parseInt(f.substr(i * 2, 2), 16);
    const B = parseInt(b.substr(i * 2, 2), 16);
    out += Math.round(F * alpha + B * (1 - alpha)).toString(16).padStart(2, '0');
  }
  return out;
}

const INKS = [
  'accent-cyan-ink',
  'accent-emerald-ink',
  'accent-violet-ink',
  'accent-rose-ink',
  'accent-amber-ink',
  'signal-elite-ink',
] as const;

const FILL_OF: Record<string, string> = {
  'accent-cyan-ink': 'accent-cyan',
  'accent-emerald-ink': 'accent-emerald',
  'accent-violet-ink': 'accent-violet',
  'accent-rose-ink': 'accent-rose',
  'accent-amber-ink': 'accent-amber',
  'signal-elite-ink': 'signal-elite',
};

describe('light-theme accent ink', () => {
  const ground = token('color-bg-base');
  const card = '#ffffff'; // --color-bg-elevated

  it('reads its values from the shipped stylesheet', () => {
    expect(ground.toLowerCase()).toBe('#f8fafc');
    for (const ink of INKS) expect(token(ink)).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('clears AA as body text on the page ground and on a card', () => {
    for (const ink of INKS) {
      const hex = token(ink);
      expect(contrast(hex, ground), `${ink} on page ground`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(hex, card), `${ink} on a card`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("clears AA on its own accent's 15% tint — the pairing that was failing", () => {
    for (const ink of INKS) {
      const hex = token(ink);
      const fill = token(FILL_OF[ink]);
      for (const [surface, bg] of [['page', ground], ['card', card]] as const) {
        expect(
          contrast(hex, over(fill, 0.15, bg)),
          `${ink} on a 15% ${FILL_OF[ink]} tint over the ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('is darker than the fill it belongs to, never lighter', () => {
    for (const ink of INKS) {
      expect(luminance(token(ink)), ink).toBeLessThanOrEqual(luminance(token(FILL_OF[ink])));
    }
  });

  it('leaves the dark theme alone — ink aliases the accent there', () => {
    const darkBlock = css.slice(0, css.indexOf('[data-theme="light"] {'));
    for (const ink of INKS) {
      expect(darkBlock, ink).toContain(`--${ink}: var(--${FILL_OF[ink]})`);
    }
  });

  it('routes the text utilities to ink without outranking their variants', () => {
    // Unlayered would beat `hover:text-accent-*` outright and freeze hovers.
    const idx = css.indexOf('.text-accent-cyan { color: var(--accent-cyan-ink); }');
    expect(idx).toBeGreaterThan(-1);
    const layerStart = css.lastIndexOf('@layer utilities {', idx);
    expect(layerStart).toBeGreaterThan(-1);
    expect(css.slice(layerStart, idx)).not.toContain('}\n');
  });
});

describe('light-theme neutral text ladder', () => {
  /**
   * Found the same way and on the same run: `--color-text-faint` was #7c8ba1,
   * 3.46:1 on a white card. `.text-label` renders it at 11px normal weight —
   * the type scale's own floor — so it is body text by WCAG's reckoning and
   * owes 4.5:1. Nothing had ever measured it, because nothing had ever run the
   * sweep in light.
   */
  const ground = token('color-bg-base');
  const card = '#ffffff';
  const LADDER = ['color-text-primary', 'color-text-secondary', 'color-text-muted', 'color-text-faint'] as const;

  it('clears AA at every step, on the ground and on a card', () => {
    for (const name of LADDER) {
      const hex = token(name);
      expect(contrast(hex, ground), `${name} on page ground`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(hex, card), `${name} on a card`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('stays a ladder — each step lighter than the one above it', () => {
    const lums = LADDER.map((n) => luminance(token(n)));
    for (let i = 1; i < lums.length; i += 1) {
      expect(lums[i], `${LADDER[i]} vs ${LADDER[i - 1]}`).toBeGreaterThan(lums[i - 1]);
    }
  });
});
