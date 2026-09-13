import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The type scale is only a scale if everything is on it.
 *
 * An audit of the codebase found 138 font-size declarations bypassing the
 * scale in FORTY distinct spellings — six ways to write ~11px, five for
 * 13–14px, four for 15px, three for 16px, plus one-offs at 1.9rem, 1.55rem
 * and 0.76rem. The scale was not missing; it was being routed around one
 * component at a time, because the t-shirt names had gaps at 13px and 15px
 * and nobody wanted to round to the wrong one.
 *
 * The fixed rungs are now named by their pixel size (`--type-13`), so there is
 * no judgement call left in picking one. This guards that: a raw px/rem
 * font-size anywhere in the styled surface is a new spelling of a size the
 * ladder already has, and it fails here rather than being found by the next
 * audit.
 *
 * Source-level rather than browser-level on purpose: this catches a bypass the
 * moment it is written, including in a component no audited page renders.
 */

const ROOTS = ['app', 'components', 'lib'];
const FIXED = /font-size:\s*([\d.]+(?:px|rem))/g;

/**
 * SVG <text> inside a scaled viewBox is exempt, and only this one selector
 * qualifies: its computed font-size is in user units rather than screen
 * pixels, and it annotates molecular geometry whose size is set by the bonds.
 * Its accessibility answer is the text fallback every visualization owes
 * (CLAUDE.md §12), not a rung on a scale that does not apply to it.
 */
const EXEMPT_SELECTORS = ['.molecule-atoms'];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|css)$/.test(name)) out.push(p);
  }
  return out;
}

/** The ladder's own definitions in :root are the one place raw values belong. */
function stripLadder(src: string): string {
  const start = src.indexOf('--type-11:');
  const end = src.indexOf('--type-6xl:');
  return start !== -1 && end > start ? src.slice(0, start) + src.slice(end) : src;
}

describe('type scale', () => {
  const files = ROOTS.flatMap((r) => walk(r));

  it('scans a meaningful number of files, so a passing result means something', () => {
    expect(files.length).toBeGreaterThan(200);
  });

  it('has no font-size that bypasses the ladder', () => {
    const offenders: string[] = [];
    for (const f of files) {
      let src = readFileSync(f, 'utf8');
      if (f.endsWith(join('app', 'globals.css'))) src = stripLadder(src);
      const lines = src.split('\n');
      // Track the enclosing rule, because the exempt selector sits on the line
      // ABOVE its declaration in a multi-line rule.
      let selector = '';
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (trimmed.endsWith('{')) selector = trimmed.slice(0, -1).trim();
        for (const m of line.matchAll(FIXED)) {
          const inlineRule = trimmed.includes('{') ? trimmed.split('{')[0] : '';
          const scope = `${selector} ${inlineRule} ${line}`;
          if (EXEMPT_SELECTORS.some((sel) => scope.includes(sel))) continue;
          offenders.push(`${f}:${i + 1}  font-size: ${m[1]}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  it('keeps every t-shirt alias pointing at a numeric rung, so the two schemes cannot disagree', () => {
    const css = readFileSync(join('app', 'globals.css'), 'utf8');
    for (const alias of ['micro', 'xs', 'sm', 'base', 'lg']) {
      const m = css.match(new RegExp(`--type-${alias}:\\s*([^;]+);`));
      expect(m, `--type-${alias} is defined`).not.toBeNull();
      expect(m![1].trim()).toMatch(/^var\(--type-\d+\)$/);
    }
  });

  it('defines every rung the ladder claims', () => {
    const css = readFileSync(join('app', 'globals.css'), 'utf8');
    for (const px of [11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30, 32, 36, 48]) {
      expect(css).toContain(`--type-${px}:`);
    }
  });
});
