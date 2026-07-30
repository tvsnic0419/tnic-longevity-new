import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Phase 3 guardrail: the credibility rollout adds an honest "evidence
 * limitations" disclosure. These tests keep that disclosure present on the
 * flagship guide and prompted for in the template, so future content keeps
 * surfacing uncertainty rather than quietly dropping it.
 */
describe('evidence-limitations disclosure', () => {
  it('the systems longevity stack guide discloses where the evidence is limited', () => {
    const body = readFileSync(
      resolve(process.cwd(), 'content/synergies/systems-longevity-stack.mdx'),
      'utf8',
    );
    expect(body).toMatch(/:::limitations/);
    // Names the central honest caveat — no trial tests the full combination.
    expect(body.toLowerCase()).toMatch(/no trial tests the whole stack|never been tested end-to-end/);
  });

  it('the synergy template prompts authors to disclose limitations', () => {
    const tpl = readFileSync(
      resolve(process.cwd(), 'content/_templates/TEMPLATE-synergy-stack.mdx'),
      'utf8',
    );
    expect(tpl).toMatch(/:::limitations/);
  });
});
