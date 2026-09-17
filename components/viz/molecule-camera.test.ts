import { describe, it, expect } from 'vitest';
import { GENERATED_GEOMETRY } from './molecule-geometry.generated';
import { REGISTRY, cameraFit, labelForAtom, heteroatomSummary, type Geometry } from './molecule';

/**
 * Guards on the two things that were silently wrong in the molecular artwork
 * for as long as it has shipped. Both are pure-geometry questions, so they are
 * answerable here rather than by looking at a canvas.
 */

const ALL: [string, Geometry][] = [
  ...Object.entries(GENERATED_GEOMETRY),
  ...Object.entries(REGISTRY).map(([id, build]) => [id, build()] as [string, Geometry]),
];

describe('molecule camera fit', () => {
  it('ships structures to test against', () => {
    expect(ALL.length).toBeGreaterThan(50);
  });

  /**
   * The failure this replaces: a fixed `min(w,h)/7.2` scale and a fixed 6-unit
   * eye meant every structure projected past the half-extent it had to fit in
   * at some point in its own rotation — resveratrol to 384px against 210px,
   * pterostilbene to 428px. Measured the same way, against the same margin the
   * renderer uses.
   */
  it('keeps every structure inside the stage through a full rotation', () => {
    const HALF = 210; // half of a representative 419px stage
    const MARGIN = 0.94; // must match MoleculeStage's `unit` computation
    const clipped: string[] = [];

    for (const [id, geom] of ALL) {
      const fit = cameraFit(geom);
      const unit = (HALF * MARGIN) / fit.radius;
      let worst = 0;
      // A finer sweep than cameraFit's own, so this cannot pass by sampling the
      // same orientations the fit happened to measure.
      for (let i = 0; i < 37; i += 1) {
        const ry = (i / 37) * Math.PI * 2;
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        for (let j = 0; j < 19; j += 1) {
          const rx = (j / 19) * Math.PI * 2;
          const cosX = Math.cos(rx), sinX = Math.sin(rx);
          for (const a of geom.atoms) {
            const ax = a.x - fit.cx, ay = a.y - fit.cy, az = a.z - fit.cz;
            const x = ax * cosY - az * sinY;
            let z = ax * sinY + az * cosY;
            const y = ay * cosX - z * sinX;
            z = ay * sinX + z * cosX;
            const r = Math.hypot(x, y) * (fit.eye / (fit.eye + z)) * unit;
            if (r > worst) worst = r;
          }
        }
      }
      // 1.02 absorbs the finer sweep finding an orientation between the fit's
      // samples; anything past that is a structure the camera does not hold.
      if (worst > HALF * 1.02) clipped.push(`${id} (${worst.toFixed(0)}px of ${HALF})`);
    }

    expect(clipped).toEqual([]);
  });

  it('turns each structure about its own centre', () => {
    for (const [id, geom] of ALL) {
      const fit = cameraFit(geom);
      let cx = 0, cy = 0, cz = 0;
      for (const a of geom.atoms) { cx += a.x; cy += a.y; cz += a.z; }
      const n = geom.atoms.length;
      expect(Math.hypot(fit.cx - cx / n, fit.cy - cy / n, fit.cz - cz / n), id).toBeLessThan(1e-9);
    }
  });

  it('keeps near-side magnification consistent across the set', () => {
    // A fixed 6-unit eye magnified the compact molecules 2.2x and the long ones
    // 5.5x, so the set had no shared depth language. Scaling the eye to each
    // structure's radius holds it in a narrow band.
    const mags = ALL.map(([, geom]) => {
      const fit = cameraFit(geom);
      let maxR = 0;
      for (const a of geom.atoms) {
        maxR = Math.max(maxR, Math.hypot(a.x - fit.cx, a.y - fit.cy, a.z - fit.cz));
      }
      return fit.eye / (fit.eye - maxR);
    });
    expect(Math.max(...mags) - Math.min(...mags)).toBeLessThan(0.6);
  });
});

describe('heteroatom labelling', () => {
  /**
   * The renderer printed "OH" over every oxygen in every structure. Across the
   * shipped set that captioned 242 oxygens that are not hydroxyls — carbonyls,
   * ethers, esters, phosphate oxygens — including every oxygen in CoQ10 and
   * berberine, neither of which has a hydroxyl at all. These structures carry
   * no hydrogens, so nothing in the data can tell a hydroxyl from a
   * deprotonated oxygen; the label has to stay at the element.
   */
  it('never claims a functional group the geometry does not record', () => {
    for (const [, geom] of ALL) {
      for (const atom of geom.atoms) {
        const label = labelForAtom(atom.el);
        if (label === null) continue;
        expect(label).toBe(atom.el);
      }
    }
  });

  it('leaves carbon to the backbone and letters every heteroatom', () => {
    expect(labelForAtom('C')).toBeNull();
    for (const el of ['O', 'N', 'S', 'P', 'Se', 'Co', 'F', 'Cl'] as const) {
      expect(labelForAtom(el)).toBe(el);
    }
  });

  it('gives every structure a text tally for the symbols it draws', () => {
    for (const [id, geom] of ALL) {
      const hetero = geom.atoms.filter((a) => a.el !== 'C').length;
      const summary = heteroatomSummary(geom);
      if (hetero === 0) {
        expect(summary, id).toBe('');
      } else {
        const counted = [...summary.matchAll(/(\d+) /g)].reduce((n, m) => n + Number(m[1]), 0);
        expect(counted, id).toBe(hetero);
      }
    }
  });
});
