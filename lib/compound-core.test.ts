import { describe, expect, it } from 'vitest';
import { compounds } from './data';
import { compoundCore, compoundTierCount, isStackCompoundId } from './compound-core';

// Guardrail: lib/compound-core.ts is a hand-maintained compact mirror of the
// stack-buildable compounds (id + evidence tier) so always-mounted surfaces
// don't import the full data layer. This test locks the 1:1 sync — if it
// fails, a compound was added/removed/regraded in lib/data.ts without
// updating compound-core.ts (or vice versa) in the same commit.
describe('compound-core mirror', () => {
  it('lists exactly the lib/data.ts compound ids, in the same order', () => {
    expect(compoundCore.map((c) => c.id)).toEqual(compounds.map((c) => c.id));
  });

  it('matches every evidence tier in lib/data.ts', () => {
    const tierById = new Map(compounds.map((c) => [c.id, c.evidence]));
    for (const entry of compoundCore) {
      expect(entry.evidence, `evidence tier for ${entry.id}`).toBe(tierById.get(entry.id));
    }
  });

  it('validates stack-buildable ids and rejects unknown/library-only ids', () => {
    expect(isStackCompoundId('glynac')).toBe(true);
    expect(isStackCompoundId('nmn')).toBe(true);
    expect(isStackCompoundId('not-a-compound')).toBe(false);
    // Library-only deep-dives (no lib/data.ts entry) must not validate.
    expect(isStackCompoundId('ashwagandha')).toBe(false);
  });

  it('tier counts agree with lib/data.ts', () => {
    for (const tier of ['A', 'B', 'C'] as const) {
      expect(compoundTierCount(tier)).toBe(
        compounds.filter((c) => c.evidence === tier).length,
      );
    }
  });
});
