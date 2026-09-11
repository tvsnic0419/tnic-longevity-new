import { describe, expect, it } from 'vitest';
import { compounds } from './data';
import { libraryModules } from './library-modules';
import {
  describeGeometry,
  getGeometry,
  getGeometryProvenance,
  hasGeometry,
} from '@/components/viz/molecule';
import { GENERATED_GEOMETRY } from '@/components/viz/molecule-geometry.generated';
import { MOLECULE_SOURCE_BY_ID } from '@/components/viz/molecule-sources';

/**
 * Molecular-structure integrity guard.
 *
 * The compound hero renders a 3D molecule, and for a long time only eight
 * compounds had one — every other page fell back to an abstract orbital field
 * that looked identical from compound to compound. The fix was to source real
 * coordinates from PubChem, which makes the failure mode worse if it goes
 * wrong: a plausible-looking structure for the WRONG molecule is as damaging
 * as a mis-attributed PMID, and far harder for a reader to catch.
 *
 * So these are the invariants:
 *
 *  1. Every compound is explicitly classified. A compound with no structure
 *     must SAY it has none (kind 'none') rather than silently fall through to
 *     the orbital field — that silence is what hid the original problem.
 *  2. Every shipped structure is geometrically valid (atoms, bonds in range).
 *  3. Anything that is not the compound's own molecule — an extract's principal
 *     constituent, a polymer's repeat unit — names what it is in the caption.
 *     A mixture must never read as though one constituent were the product.
 *  4. Coverage only ratchets up.
 */

// Structures currently shipped. Raise as coverage grows; never lower it to
// accommodate a regression — same convention as the other floors in this repo.
const STRUCTURE_FLOOR = 71;

/**
 * The library ships more compound PAGES than lib/data.ts has structured
 * entries, and the extra ones (NR, rapamycin, metformin…) render the same hero.
 * Auditing only `compounds` is what let 19 of them sit on the generic orbital
 * field unnoticed, so the classification check runs over every module.
 */
const compoundModuleIds = libraryModules
  .filter((m) => m.category === 'compounds')
  .map((m) => m.compoundId ?? m.slug);

describe('molecule coverage', () => {
  it('every compound is explicitly classified — structure or a stated reason', () => {
    const unclassified = compoundModuleIds.filter(
      (id) => !hasGeometry(id) && MOLECULE_SOURCE_BY_ID.get(id)?.kind !== 'none',
    );

    expect(
      unclassified,
      `These compounds silently fall back to the generic orbital field. Add a ` +
        `molecule-sources.ts entry — a real molecule, its principal constituent, ` +
        `or kind:'none' with a note saying why there isn't one: ${unclassified.join(', ')}`,
    ).toEqual([]);
  });

  it('holds the structure-coverage floor', () => {
    const withStructure = compounds.filter((c) => hasGeometry(c.id)).length;
    expect(withStructure).toBeGreaterThanOrEqual(STRUCTURE_FLOOR);
  });

  it('every shipped structure is geometrically valid', () => {
    for (const c of compounds) {
      if (!hasGeometry(c.id)) continue;
      const g = getGeometry(c.id);
      expect(g, `${c.id} reports geometry but resolves to null`).toBeTruthy();
      expect(g!.atoms.length, `${c.id} has too few atoms`).toBeGreaterThan(1);
      expect(g!.bonds.length, `${c.id} has no bonds`).toBeGreaterThan(0);
      for (const [a, b] of g!.bonds) {
        expect(a, `${c.id} bond index ${a} out of range`).toBeLessThan(g!.atoms.length);
        expect(b, `${c.id} bond index ${b} out of range`).toBeLessThan(g!.atoms.length);
        expect(a).not.toBe(b);
      }
    }
  });

  it('never presents a constituent or repeat unit as the compound itself', () => {
    for (const c of compounds) {
      const prov = getGeometryProvenance(c.id);
      if (!prov || prov.kind === 'self') continue;

      // The caption must name the molecule actually drawn...
      expect(prov.as, `${c.id} is kind '${prov.kind}' but names no molecule`).toBeTruthy();

      const caption = describeGeometry(c.id, c.name);
      expect(caption).toContain(prov.as!);
      // ...and must not use the bare wording reserved for a compound's own molecule.
      expect(
        caption.startsWith('Rendered structure'),
        `${c.id} is a ${prov.kind} but its caption reads as its own structure`,
      ).toBe(false);
    }
  });

  it('every generated structure records the PubChem identity it came from', () => {
    for (const [id, g] of Object.entries(GENERATED_GEOMETRY)) {
      expect(g.cid, `${id} has no PubChem CID`).toBeGreaterThan(0);
      expect(g.formula, `${id} has no molecular formula`).toBeTruthy();
      expect(['2d', '3d']).toContain(g.dims);
    }
  });

  it('compounds marked as having no structure really render none', () => {
    for (const [id, src] of MOLECULE_SOURCE_BY_ID) {
      if (src.kind !== 'none') continue;
      expect(hasGeometry(id), `${id} is marked 'none' but has geometry`).toBe(false);
      expect(src.note, `${id} is marked 'none' without saying why`).toBeTruthy();
    }
  });
});
