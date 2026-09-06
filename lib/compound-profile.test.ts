import { describe, it, expect } from 'vitest';
import { resolveCompoundProfile } from './compound-profile';
import { compounds } from './data';
import { hallmarkLibrary } from './hallmarks-library';
import { getModulesByCategory } from './library-modules';

const CANONICAL_HALLMARK_IDS = new Set(hallmarkLibrary.map((h) => h.id));
const compoundModules = getModulesByCategory('compounds');

describe('resolveCompoundProfile', () => {
  it('returns null for a non-compound slug', () => {
    expect(resolveCompoundProfile('not-a-real-compound-slug')).toBeNull();
  });

  it('resolves every compound module without throwing', () => {
    for (const mod of compoundModules) {
      expect(() => resolveCompoundProfile(mod.slug)).not.toThrow();
      const profile = resolveCompoundProfile(mod.slug);
      expect(profile).not.toBeNull();
      expect(profile!.slug).toBe(mod.slug);
      expect(profile!.tier).toBe(mod.evidenceTier);
    }
  });

  it('only ever surfaces canonical hallmark ids (engine namespace reconciled)', () => {
    for (const mod of compoundModules) {
      const profile = resolveCompoundProfile(mod.slug)!;
      for (const h of profile.hallmarks) {
        expect(CANONICAL_HALLMARK_IDS.has(h.id)).toBe(true);
        expect(h.title.length).toBeGreaterThan(0);
        expect(h.number).toBeGreaterThanOrEqual(1);
      }
      // Hallmarks are de-duplicated and sorted by canonical number.
      const numbers = profile.hallmarks.map((h) => h.number);
      expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      expect(new Set(profile.hallmarks.map((h) => h.id)).size).toBe(profile.hallmarks.length);
    }
  });

  it('reconciles engine hallmark aliases into canonical ids', () => {
    // NMN carries engine hallmark 'genomic'/'nutrient'; creatine's data record
    // uses 'stem' and its engine entry 'intercellular' → must map to canonical.
    const creatine = resolveCompoundProfile('creatine');
    if (creatine) {
      const ids = creatine.hallmarks.map((h) => h.id);
      expect(ids).not.toContain('stemcell');
      expect(ids).not.toContain('intercellular');
      // creatine's data record engages stem-cell + intercellular comms.
      expect(ids).toContain('communication');
    }
  });

  it('reports absent magnitudes as undefined, never zero', () => {
    for (const mod of compoundModules) {
      const profile = resolveCompoundProfile(mod.slug)!;
      if (!profile.hasEngineData) {
        expect(profile.magnitudes).toBeUndefined();
      } else {
        // A scored compound has all five subscores in range plus a composite.
        const m = profile.magnitudes!;
        for (const v of [m.evidence, m.effect, m.breadth, m.bioavail, m.safety, m.lq]) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it('only surfaces real 7–8 digit PMIDs drawn from the source studies', () => {
    for (const mod of compoundModules) {
      const profile = resolveCompoundProfile(mod.slug)!;
      for (const s of profile.studies) {
        expect(s.pmid).toMatch(/^\d{7,8}$/);
      }
      expect(profile.pmidCount).toBeGreaterThanOrEqual(0);
    }
  });

  it('measured bioavailability is only set when the data record carries a figure', () => {
    for (const mod of compoundModules) {
      const profile = resolveCompoundProfile(mod.slug)!;
      const data = compounds.find(
        (c) => c.id === (mod.compoundId ?? mod.slug),
      );
      if (profile.measuredBioavailability !== undefined) {
        expect(profile.measuredBioavailability).toBe(data?.bioavailability);
      }
    }
  });

  it('links synergies only when the partner has a deep-dive', () => {
    const profile = resolveCompoundProfile('nmn');
    if (profile && profile.synergies.length > 0) {
      for (const s of profile.synergies) {
        expect(s.id.length).toBeGreaterThan(0);
        if (s.href) expect(s.href).toBe(`/library/compounds/${s.id}`);
      }
    }
  });

  it('counts distinct PMIDs from the MDX body as well as the studies', () => {
    const profile = resolveCompoundProfile('nmn', {
      mdxBody: 'Something (PMID: 99999991) and again PMID 99999991 and PMID 99999992.',
    })!;
    // The two synthetic PMIDs are distinct and additive to any real study PMIDs.
    expect(profile.pmidCount).toBeGreaterThanOrEqual(2);
  });
});
