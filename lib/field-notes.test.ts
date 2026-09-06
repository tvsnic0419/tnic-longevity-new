import { describe, it, expect } from 'vitest';
import { FIELD_NOTES } from './field-notes';
import { compounds } from './data';

describe('field notes ("Good to know")', () => {
  it('resolves every note to a real compound in lib/data.ts', () => {
    for (const n of FIELD_NOTES) {
      const compound = compounds.find((c) => c.id === n.compoundId);
      expect(compound, `note "${n.title}" → ${n.compoundId}`).toBeDefined();
      expect(n.compoundName).toBe(compound!.name);
      expect(n.tier).toBe(compound!.evidence);
      expect(n.href).toBe(`/library/compounds/${n.compoundId}`);
    }
  });

  it('each note is traceable — its compound carries at least one hallmark', () => {
    for (const n of FIELD_NOTES) {
      const compound = compounds.find((c) => c.id === n.compoundId)!;
      expect(compound.hallmarks.length, `note "${n.title}"`).toBeGreaterThan(0);
    }
  });

  it('has substantive, non-empty copy on every note', () => {
    for (const n of FIELD_NOTES) {
      expect(n.stat.trim().length).toBeGreaterThan(0);
      expect(n.title.trim().length).toBeGreaterThan(0);
      expect(n.body.trim().length).toBeGreaterThan(40);
      expect(n.source.trim().length).toBeGreaterThan(0);
    }
  });
});
