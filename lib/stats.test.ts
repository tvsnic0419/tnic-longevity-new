import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  COMPOUND_COUNT,
  STACK_BUILDABLE_COUNT,
  HALLMARK_COUNT,
  ELITE_COUNT,
  TIER_COUNTS,
} from './stats';

/**
 * Guards the counts the site states out loud.
 *
 * The NAD+ guide advertised "8 elite compounds" while the homepage stat rail
 * said 9, because each surface counted for itself. lib/stats.ts derives every
 * figure from the data layer; this suite checks those derivations stay
 * internally consistent, and that no source file reintroduces a hand-typed
 * count for the stats we publish.
 */
describe('published stats', () => {
  it('derives counts consistently from the data layer', () => {
    expect(COMPOUND_COUNT).toBeGreaterThan(0);
    expect(HALLMARK_COUNT).toBe(12);
    expect(ELITE_COUNT).toBeGreaterThan(0);
    // The stack-buildable set is a deliberate subset of the library.
    expect(STACK_BUILDABLE_COUNT).toBeLessThanOrEqual(COMPOUND_COUNT);
  });

  it('tier counts sum to the compound total', () => {
    const sum = TIER_COUNTS.A + TIER_COUNTS.B + TIER_COUNTS.C;
    expect(sum).toBe(COMPOUND_COUNT);
  });

  it('no source file hardcodes the elite-intervention count in copy', () => {
    // The drift this module exists to prevent: a literal "N elite compounds"
    // typed into prose, which goes stale the moment the ranking changes.
    const offenders: string[] = [];
    const roots = ['app', 'components'].map((d) => resolve(process.cwd(), d));

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = resolve(dir, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (entry.name.endsWith('.tsx')) {
          const src = readFileSync(path, 'utf8');
          if (/\b\d+\s+elite\s+(compounds|interventions)\b/i.test(src)) {
            offenders.push(path.replace(process.cwd(), ''));
          }
        }
      }
    };
    roots.forEach(walk);

    expect(offenders, `hardcoded elite count — import ELITE_COUNT from lib/stats instead`).toEqual(
      [],
    );
  });
});
