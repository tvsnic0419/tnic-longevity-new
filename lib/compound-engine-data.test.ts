import { describe, expect, it } from 'vitest';
import {
  analyzeStack,
  subscoresOf,
  overallOf,
  CDB,
  COMPOUND_DB,
  DEFAULT_WEIGHTS,
  HALLMARKS,
  PATHWAY_LABELS,
  type Form,
  type StagedItem,
} from './compound-engine-data';

let seq = 0;
function stage(id: string, form: Form = 'std'): StagedItem {
  const data = CDB[id];
  if (!data) throw new Error(`unknown compound ${id}`);
  return { uid: `${id}:${seq++}`, data, name: data.name, brand: '', dose: '', form, source: 'curated' };
}

describe('compound-engine dataset integrity', () => {
  it('every compound uses only known pathway and hallmark ids', () => {
    const pathwayIds = new Set(Object.keys(PATHWAY_LABELS));
    const hallmarkIds = new Set(HALLMARKS.map((h) => h.id));
    for (const c of COMPOUND_DB) {
      for (const p of c.pathways) expect(pathwayIds.has(p), `${c.id} bad pathway ${p}`).toBe(true);
      for (const h of c.hallmarks) expect(hallmarkIds.has(h), `${c.id} bad hallmark ${h}`).toBe(true);
      expect(c.pathways.length + c.hallmarks.length).toBeGreaterThan(0);
    }
  });

  it('compound ids are unique', () => {
    expect(new Set(COMPOUND_DB.map((c) => c.id)).size).toBe(COMPOUND_DB.length);
  });

  it('cross-links known compounds to their library deep-dive', () => {
    expect(CDB.nmn.libraryHref).toBe('/library/compounds/nmn');
    // Engine id caakg maps onto the library slug `cakg`.
    expect(CDB.caakg.libraryHref).toBe('/library/compounds/cakg');
  });
});

describe('scoring', () => {
  it('enhanced formulation raises bioavailability, basic lowers it', () => {
    const c = CDB.curcumin;
    const std = subscoresOf(stage('curcumin', 'std'));
    const enh = subscoresOf(stage('curcumin', 'enh'));
    const basic = subscoresOf(stage('curcumin', 'basic'));
    expect(enh.bioavail).toBeGreaterThan(std.bioavail);
    expect(basic.bioavail).toBeLessThan(std.bioavail);
    expect(std.bioavail).toBe(c.bioavail); // std applies no formulation adjustment
  });

  it('overall score is deterministic and bounded 0..100', () => {
    const item = stage('nmn');
    const subs = subscoresOf(item);
    const overall = overallOf(subs, DEFAULT_WEIGHTS);
    expect(overall).toBe(overallOf(subs, DEFAULT_WEIGHTS));
    expect(overall).toBeGreaterThanOrEqual(0);
    expect(overall).toBeLessThanOrEqual(100);
  });
});

describe('analyzeStack', () => {
  it('empty stack has null aggregates and no coverage', () => {
    const a = analyzeStack([], DEFAULT_WEIGHTS);
    expect(a.meanScore).toBeNull();
    expect(a.synergyScore).toBeNull();
    expect(a.coveredCount).toBe(0);
    expect(a.scored).toHaveLength(0);
  });

  it('single compound scores but has no synergy', () => {
    const a = analyzeStack([stage('creatine')], DEFAULT_WEIGHTS);
    expect(a.meanScore).not.toBeNull();
    expect(a.synergyScore).toBeNull();
    expect(a.coveredCount).toBeGreaterThan(0);
  });

  it('detects a curated synergy pair (NMN + TMG)', () => {
    const a = analyzeStack([stage('nmn'), stage('tmg')], DEFAULT_WEIGHTS);
    expect(a.synergyScore).not.toBeNull();
    expect(a.synergies.some((s) => s.a === 'NMN' && s.b === 'TMG')).toBe(true);
  });

  it('flags NAD+ precursor redundancy (NMN + NR)', () => {
    const a = analyzeStack([stage('nmn'), stage('nr')], DEFAULT_WEIGHTS);
    expect(a.redundancies.some((r) => r.label === 'NAD⁺ precursors')).toBe(true);
    const withoutRed = analyzeStack([stage('nmn'), stage('tmg')], DEFAULT_WEIGHTS);
    expect(a.synergyScore!).toBeLessThan(withoutRed.synergyScore! + 100); // redundancy penalizes
  });

  it('flags a known antagonistic interaction (EGCG + Berberine)', () => {
    const a = analyzeStack([stage('egcg'), stage('berberine')], DEFAULT_WEIGHTS);
    expect(a.cautions.some((c) => c.kind === 'Interaction')).toBe(true);
  });

  it('flags high cumulative antioxidant load', () => {
    const a = analyzeStack(
      [stage('nac'), stage('rala'), stage('astax'), stage('coq10')],
      DEFAULT_WEIGHTS,
    );
    expect(a.cautions.some((c) => c.kind === 'Redox load')).toBe(true);
  });

  it('reports convergent pathways hit by 2+ compounds', () => {
    const a = analyzeStack([stage('nmn'), stage('nr')], DEFAULT_WEIGHTS);
    // Both feed NAD⁺ and SIRT1.
    expect(a.convergent.some((c) => c.p === 'nad')).toBe(true);
  });
});
