import { describe, it, expect } from 'vitest';
import { getStackShopItems, getUnmatchedStackCompounds } from './protocol-shop';

/**
 * Guards the Protocol Shop funnel invariant. getStackShopItems() only returns a
 * card for compounds that have a verified pick (compoundModuleMap); every other
 * stack compound is reported by getUnmatchedStackCompounds(). The /shop
 * "stack loaded · no verified picks yet" state relies on this exact split — a
 * loaded stack whose compounds are all unmatched must yield zero items AND a
 * non-empty unmatched list, so Shop can explain the gap instead of falsely
 * showing the "no stack loaded" empty state.
 */
describe('protocol-shop funnel invariants', () => {
  it('an all-unmatched stack yields no items but a full unmatched list', () => {
    const stack = ['magnesium', 'glycine', 'melatonin'];
    expect(getStackShopItems(stack)).toHaveLength(0);
    expect(getUnmatchedStackCompounds(stack).map((c) => c.compoundId).sort()).toEqual(
      [...stack].sort(),
    );
  });

  it('a fully-matched stack yields items and no unmatched entries', () => {
    const stack = ['glynac', 'nmn', 'sulforaphane'];
    expect(getStackShopItems(stack)).toHaveLength(3);
    expect(getUnmatchedStackCompounds(stack)).toHaveLength(0);
  });

  it('a mixed stack splits cleanly between items and unmatched', () => {
    const stack = ['nmn', 'magnesium'];
    expect(getStackShopItems(stack).map((i) => i.compoundId)).toEqual(['nmn']);
    expect(getUnmatchedStackCompounds(stack).map((c) => c.compoundId)).toEqual(['magnesium']);
  });
});
