import { describe, expect, it } from 'vitest';
import { compounds } from './data';
import {
  DEFAULT_LAB_CONFIG,
  HYPOTHESIS_LABEL,
  LAB_SYSTEMS,
  UNCERTAIN_LABEL,
  cloneLabConfig,
  computeLabScore,
  computeMarginal,
  computePairRelationship,
  computeRelationships,
  hallmarkLabel,
  pairKey,
  sanitizeLabConfig,
  simulateRemovals,
} from './combination-lab';

const ALL_IDS = compounds.map((c) => c.id);

describe('combination lab — empty and single-compound edge cases', () => {
  it('computeLabScore on an empty stack returns a neutral zeroed result without throwing', () => {
    const result = computeLabScore([]);
    expect(result.overall).toBe(0);
    expect(result.contributions).toHaveLength(0);
    expect(result.relationships).toHaveLength(0);
    expect(result.counts.compounds).toBe(0);
  });

  it('computeLabScore on a single compound scores it without relationship terms', () => {
    const id = ALL_IDS[0]!;
    const result = computeLabScore([id]);
    expect(result.relationships).toHaveLength(0);
    expect(result.counts.compounds).toBe(1);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it('computeRelationships on 0 or 1 compounds returns no pairs', () => {
    expect(computeRelationships([])).toHaveLength(0);
    expect(computeRelationships([ALL_IDS[0]!])).toHaveLength(0);
  });

  it('simulateRemovals on an empty stack returns no rows', () => {
    expect(simulateRemovals([])).toHaveLength(0);
  });

  it('computeMarginal against an empty rest-of-stack still scores the addition', () => {
    const id = ALL_IDS[0]!;
    const m = computeMarginal([id], id);
    expect(m).not.toBeNull();
    expect(m?.againstIds).toHaveLength(0);
    expect(m?.scoreBefore).toBe(0);
  });

  it('unknown compound ids are ignored rather than throwing', () => {
    expect(() => computeLabScore(['not-a-real-id'])).not.toThrow();
    expect(computeLabScore(['not-a-real-id']).counts.compounds).toBe(0);
    expect(computeMarginal([], 'not-a-real-id')).toBeNull();
  });
});

describe('pairKey', () => {
  it('is symmetric', () => {
    expect(pairKey('a', 'b')).toBe(pairKey('b', 'a'));
  });

  it('is stable and distinguishes different pairs', () => {
    expect(pairKey('a', 'b')).toBe('a::b');
    expect(pairKey('a', 'b')).not.toBe(pairKey('a', 'c'));
  });
});

describe('honesty contract — every classified pair across the full library', () => {
  // O(n^2) sweep over the real catalog (100 compounds -> 4,950 pairs) — cheap
  // pure computation, and the strongest regression guard available: a future
  // edit to the classification precedence that blurs demonstrated-vs-
  // hypothesis gets caught across every real pair, not just a hand-picked one.
  const allRelationships = computeRelationships(ALL_IDS);

  it('classifies the full pairwise sweep (sanity check the sweep actually ran)', () => {
    expect(allRelationships.length).toBeGreaterThan(1000);
  });

  it('curated-sourced relationships are always demonstrated with no limitation', () => {
    const curated = allRelationships.filter((r) =>
      (['curated-interaction', 'curated-matrix', 'declared-synergy'] as const).includes(
        r.source as 'curated-interaction' | 'curated-matrix' | 'declared-synergy',
      ),
    );
    expect(curated.length).toBeGreaterThan(0);
    for (const r of curated) {
      expect(r.demonstrated).toBe(true);
      expect(r.limitation).toBeNull();
    }
  });

  it('ontology-derived relationships are always hypotheses, never demonstrated', () => {
    const derived = allRelationships.filter((r) =>
      (['pathway-ontology', 'hallmark-ontology'] as const).includes(
        r.source as 'pathway-ontology' | 'hallmark-ontology',
      ),
    );
    expect(derived.length).toBeGreaterThan(0);
    for (const r of derived) {
      expect(r.demonstrated).toBe(false);
      expect(r.limitation).toBe(HYPOTHESIS_LABEL);
    }
  });

  it('pairs with no curated or ontological basis are honestly uncertain', () => {
    const none = allRelationships.filter((r) => r.source === 'none');
    for (const r of none) {
      expect(r.type).toBe('uncertain');
      expect(r.demonstrated).toBe(false);
      expect(r.limitation).toBe(UNCERTAIN_LABEL);
    }
  });

  it('antagonism and interaction-caution types only ever come from curated data, never invented', () => {
    // The classifier has no ontology-derived path to either type. Confirmed
    // across the real catalog rather than just by code inspection — if a
    // future edit adds one, this fails loud instead of silently shipping an
    // "antagonism" that was never actually curated.
    const flagged = allRelationships.filter((r) => r.type === 'antagonism' || r.type === 'interaction');
    for (const r of flagged) {
      expect(r.source).toBe('curated-interaction');
      expect(r.demonstrated).toBe(true);
    }
  });
});

describe('known real-data classifications (regression lock)', () => {
  it('a documented curated synergy pair classifies as synergy/demonstrated', () => {
    const rel = computePairRelationship('glynac', 'sulforaphane');
    expect(rel?.type).toBe('synergy');
    expect(rel?.demonstrated).toBe(true);
    expect(rel?.source).toBe('curated-interaction');
  });

  it('a documented "redundant" curated caution classifies as redundancy/excessive', () => {
    const rel = computePairRelationship('pterostilbene', 'resveratrol');
    expect(rel?.type).toBe('redundancy');
    expect(rel?.demonstrated).toBe(true);
    expect(rel?.redundancyGrade).toBe('excessive');
  });

  it('an unknown or self-paired id returns null rather than a fabricated relationship', () => {
    expect(computePairRelationship('glynac', 'not-a-real-id')).toBeNull();
    expect(computePairRelationship('glynac', 'glynac')).toBeNull();
  });
});

describe('scoring purity', () => {
  it('computeLabScore is deterministic — identical input twice gives identical output', () => {
    const ids = ALL_IDS.slice(0, 6);
    expect(computeLabScore(ids)).toEqual(computeLabScore(ids));
  });

  it('never mutates DEFAULT_LAB_CONFIG', () => {
    const snapshot = JSON.parse(JSON.stringify(DEFAULT_LAB_CONFIG)) as typeof DEFAULT_LAB_CONFIG;
    computeLabScore(ALL_IDS.slice(0, 8));
    simulateRemovals(ALL_IDS.slice(0, 8));
    computeMarginal(ALL_IDS.slice(0, 8), ALL_IDS[0]!);
    const cloned = cloneLabConfig(DEFAULT_LAB_CONFIG);
    cloned.baseWeight = 999;
    cloned.tierMultipliers.A = 0;
    cloned.caps.synergy = 0;
    expect(DEFAULT_LAB_CONFIG).toEqual(snapshot);
  });

  it('sanitizeLabConfig never throws on garbage and always yields a complete config', () => {
    for (const garbage of [null, undefined, 42, 'nope', [], { baseWeight: 'nan' }, { caps: 'nope' }]) {
      const cfg = sanitizeLabConfig(garbage);
      expect(cfg.baseWeight).toBe(DEFAULT_LAB_CONFIG.baseWeight);
      expect(cfg.caps.synergy).toBe(DEFAULT_LAB_CONFIG.caps.synergy);
    }
  });

  it('sanitizeLabConfig preserves valid overrides and falls back per-field', () => {
    const cfg = sanitizeLabConfig({ baseWeight: 12, tierMultipliers: { A: 0.5 } });
    expect(cfg.baseWeight).toBe(12);
    expect(cfg.tierMultipliers.A).toBe(0.5);
    expect(cfg.tierMultipliers.B).toBe(DEFAULT_LAB_CONFIG.tierMultipliers.B);
  });
});

describe('LAB_SYSTEMS / hallmark labeling', () => {
  it('covers all 12 canonical hallmarks, including dysbiosis', () => {
    expect(LAB_SYSTEMS).toHaveLength(12);
    expect(LAB_SYSTEMS.find((s) => s.id === 'dysbiosis')?.label).toBe('Dysbiosis');
  });

  it('resolves every hallmark id real compounds carry to a real label, never the raw id', () => {
    const usedIds = new Set(compounds.flatMap((c) => c.hallmarks));
    expect(usedIds.size).toBeGreaterThan(0);
    for (const id of usedIds) {
      expect(hallmarkLabel(id)).not.toBe(id);
    }
  });
});
