import { describe, it, expect } from 'vitest';
import { protocols } from './protocols';
import { compoundModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';

/**
 * Guards the Protocol Library against dangling references: every step must point
 * at a real compound module (so its /library/compounds/<slug> link resolves) and
 * every hallmark id must be real. A renamed or removed compound fails here rather
 * than shipping a broken protocol.
 */
describe('protocols — every reference resolves', () => {
  const compoundSlugs = new Set(compoundModules.map((m) => m.slug));
  const hallmarkIds = new Set(hallmarkLibrary.map((h) => h.id));

  it('has unique protocol slugs', () => {
    const slugs = protocols.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every step references a real compound module', () => {
    for (const p of protocols) {
      expect(p.steps.length, `${p.slug} has no steps`).toBeGreaterThan(0);
      for (const step of p.steps) {
        expect(compoundSlugs.has(step.slug), `${p.slug} → unknown compound "${step.slug}"`).toBe(true);
        expect(step.role.length, `${p.slug} → ${step.slug} has no role`).toBeGreaterThan(0);
      }
    }
  });

  it('every hallmark id is real', () => {
    for (const p of protocols) {
      expect(p.hallmarkIds.length, `${p.slug} has no hallmarks`).toBeGreaterThan(0);
      for (const id of p.hallmarkIds) {
        expect(hallmarkIds.has(id), `${p.slug} → unknown hallmark "${id}"`).toBe(true);
      }
    }
  });

  it('every protocol carries a benefit-forward goal and pitch', () => {
    for (const p of protocols) {
      expect(p.goal.length, `${p.slug} missing goal`).toBeGreaterThan(0);
      expect(p.pitch.length, `${p.slug} pitch too thin`).toBeGreaterThan(60);
    }
  });
});
