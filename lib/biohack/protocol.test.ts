import { describe, expect, it } from 'vitest';
import { BIOHACK_CARDS, BIOHACK_STACKS, BIOHACK_TIERS, previewCards } from './protocol';

describe('BIOHACK 100 protocol', () => {
  it('has 40 uniquely numbered cards', () => {
    expect(BIOHACK_CARDS).toHaveLength(40);
    const nums = BIOHACK_CARDS.map((c) => c.num);
    expect(new Set(nums).size).toBe(40);
    expect(Math.min(...nums)).toBe(1);
    expect(Math.max(...nums)).toBe(40);
  });

  it('gives every card a dose, target, synergy, and when', () => {
    for (const card of BIOHACK_CARDS) {
      expect(card.name.length).toBeGreaterThan(2);
      expect(card.dose.length).toBeGreaterThan(2);
      expect(card.targets.length).toBeGreaterThan(2);
      expect(card.body.length).toBeGreaterThan(20);
      expect(card.synergy.length).toBeGreaterThan(8);
      expect(card.when.length).toBeGreaterThan(4);
    }
  });

  it('keeps Mucuna and 5-HTP off-period only', () => {
    const mucuna = BIOHACK_CARDS.find((c) => c.num === 5);
    const htp = BIOHACK_CARDS.find((c) => c.num === 34);
    expect(mucuna?.when.toLowerCase()).toMatch(/off/);
    expect(htp?.when.toLowerCase()).toMatch(/off/);
  });

  it('has nine tiers and seven stacks', () => {
    expect(BIOHACK_TIERS).toHaveLength(9);
    expect(BIOHACK_STACKS).toHaveLength(7);
  });

  it('previews only the first two cards', () => {
    expect(previewCards().map((c) => c.num)).toEqual([1, 2]);
  });
});
