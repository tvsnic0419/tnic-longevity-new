import { describe, expect, it } from 'vitest';
import { HERO_NETWORK_EDGES } from './hero-network';
import {
  SYNERGY_MECHANISMS,
  getSynergyMechanism,
  invalidSynergyMechanismIds,
} from './synergy-mechanisms';

/**
 * Integrity guards for the authored synergy-mechanism table. The prose is
 * only as trustworthy as its links: an entry for a compound that doesn't
 * exist, or for a pair that isn't a real synergy edge, is drift — it would
 * show text for a relationship the catalog doesn't actually claim.
 */

describe('synergy-mechanisms — integrity', () => {
  it('references only real compound ids', () => {
    expect(invalidSynergyMechanismIds()).toEqual([]);
  });

  it('every entry corresponds to a real network edge (undirected)', () => {
    const edgeKeys = new Set(HERO_NETWORK_EDGES.map((e) => [e.a, e.b].sort().join('::')));
    for (const key of SYNERGY_MECHANISMS.keys()) {
      expect(edgeKeys.has(key)).toBe(true);
    }
  });

  it('every entry has non-empty prose', () => {
    for (const text of SYNERGY_MECHANISMS.values()) {
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  it('lookup is order-independent', () => {
    const [a, b] = [...HERO_NETWORK_EDGES]
      .map((e) => [e.a, e.b])
      .find(([a, b]) => getSynergyMechanism(a, b) !== undefined)!;
    expect(getSynergyMechanism(a, b)).toBe(getSynergyMechanism(b, a));
  });
});
