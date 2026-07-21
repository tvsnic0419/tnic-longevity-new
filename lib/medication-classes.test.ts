import { describe, expect, it } from 'vitest';
import { safetyNotes } from './data';
import { medicationClasses, medicationFlags, checkMedicationFlags } from './medication-classes';

describe('medicationFlags', () => {
  it('every flag references a compound that actually has a safetyNotes entry', () => {
    const safetyIds = new Set(safetyNotes.map((n) => n.compoundId));
    for (const f of medicationFlags) {
      expect(safetyIds.has(f.compoundId), `${f.compoundId} has no safetyNotes entry`).toBe(true);
    }
  });

  it('every flag references a known medication class id', () => {
    const classIds = new Set(medicationClasses.map((m) => m.id));
    for (const f of medicationFlags) {
      expect(classIds.has(f.medicationClassId), `unknown class ${f.medicationClassId}`).toBe(true);
    }
  });

  it('every flag note is a verbatim substring of that compound\'s published safety text', () => {
    for (const f of medicationFlags) {
      const note = safetyNotes.find((n) => n.compoundId === f.compoundId)!;
      const allText = [...note.cautions, ...note.avoidIf, ...note.consultIf];
      expect(allText, `"${f.note}" not found verbatim in ${f.compoundId} safetyNotes`).toContain(f.note);
    }
  });

  it('has no exact duplicate compound+class rows', () => {
    const keys = medicationFlags.map((f) => `${f.compoundId}|${f.medicationClassId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('checkMedicationFlags', () => {
  it('returns nothing when no compounds are selected', () => {
    expect(checkMedicationFlags([], ['anticoagulants'])).toEqual([]);
  });

  it('returns nothing when no medications are selected', () => {
    expect(checkMedicationFlags(['omega3'], [])).toEqual([]);
  });

  it('matches a known compound + medication class pair with the exact source note', () => {
    const matches = checkMedicationFlags(['omega3'], ['anticoagulants']);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      compoundId: 'omega3',
      medicationClassId: 'anticoagulants',
      medicationLabel: 'Blood thinners / antiplatelets',
      note: 'Blood thinners (warfarin, aspirin, clopidogrel)',
    });
  });

  it('does not match a medication class the compound has no flag for', () => {
    expect(checkMedicationFlags(['omega3'], ['thyroid'])).toEqual([]);
  });

  it('matches across multiple selected compounds and classes independently', () => {
    const matches = checkMedicationFlags(['berberine', 'coq10'], ['glucose-lowering', 'antihypertensives']);
    const pairs = matches.map((m) => `${m.compoundId}:${m.medicationClassId}`).sort();
    expect(pairs).toEqual(['berberine:antihypertensives', 'berberine:glucose-lowering', 'coq10:antihypertensives']);
  });

  it('ignores unselected compounds even if they would otherwise flag', () => {
    expect(checkMedicationFlags(['nmn'], ['anticoagulants'])).toEqual([]);
  });
});
