import { describe, expect, it } from 'vitest';
import { compounds } from './data';
import {
  HERO_NETWORK_EDGES,
  HERO_NETWORK_NODES,
  getEdgeExplanation,
  getHeroCompound,
  getPartnerIds,
} from './hero-network';

/**
 * Guardrails for the hero widget's click-to-explore data layer. The widget
 * surfaces real compound data to visitors — a blank or undefined "why" line
 * would ship as a visibly broken info panel, so every edge is checked here,
 * not just a sample.
 */

describe('hero-network — partner lookup', () => {
  it('getPartnerIds matches the union of synergies-derived edges for every node', () => {
    for (const node of HERO_NETWORK_NODES) {
      const expected = new Set<string>();
      for (const e of HERO_NETWORK_EDGES) {
        if (e.a === node.id) expected.add(e.b);
        if (e.b === node.id) expected.add(e.a);
      }
      expect(new Set(getPartnerIds(node.id))).toEqual(expected);
    }
  });

  it('returns an empty array for an unknown id', () => {
    expect(getPartnerIds('not-a-real-compound')).toEqual([]);
  });
});

describe('hero-network — compound lookup', () => {
  it('getHeroCompound matches compounds.find for every node id', () => {
    for (const node of HERO_NETWORK_NODES) {
      expect(getHeroCompound(node.id)).toBe(compounds.find((c) => c.id === node.id));
    }
  });

  it('returns undefined for an unknown id', () => {
    expect(getHeroCompound('not-a-real-compound')).toBeUndefined();
  });
});

describe('hero-network — edge explanations', () => {
  it('every edge in the live network has non-empty explanation text', () => {
    for (const e of HERO_NETWORK_EDGES) {
      const explanation = getEdgeExplanation(e.a, e.b);
      expect(explanation.text.trim().length).toBeGreaterThan(0);
      expect(['emergent', 'synergy-link', 'derived']).toContain(explanation.source);
    }
  });

  it('is symmetric — order of ids does not change the source tier', () => {
    for (const e of HERO_NETWORK_EDGES) {
      const forward = getEdgeExplanation(e.a, e.b);
      const backward = getEdgeExplanation(e.b, e.a);
      expect(backward.source).toBe(forward.source);
    }
  });

  it('falls back gracefully for a pair with no data at all', () => {
    const explanation = getEdgeExplanation('not-a-real-compound', 'also-not-real');
    expect(explanation.source).toBe('derived');
    expect(explanation.text.trim().length).toBeGreaterThan(0);
  });
});
