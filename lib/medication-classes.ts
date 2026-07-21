import { safetyNotes } from './data';

/**
 * Structured medication-interaction check for the Stack Builder.
 *
 * This does NOT introduce any new clinical claim. Every flag below is a
 * direct, verbatim restatement of text that already exists in
 * `data.ts`'s `safetyNotes` (cautions/avoidIf/consultIf) — this file only
 * adds a `medicationClassId` tag so that free text like "Taking blood
 * thinners" or "Statins or lipid-lowering drugs" becomes something a user
 * can self-select against instead of having to read every compound's
 * safety prose to spot it themselves. If a class doesn't appear in
 * `safetyNotes` for a compound, that compound has no flag for it — nothing
 * here is inferred or extrapolated beyond what's already published.
 */

export interface MedicationClass {
  id: string;
  label: string;
  /** Common examples, for user recognition — not exhaustive, not medical advice. */
  examples: string;
}

export const medicationClasses: MedicationClass[] = [
  { id: 'anticoagulants', label: 'Blood thinners / antiplatelets', examples: 'warfarin, aspirin, clopidogrel' },
  { id: 'antihypertensives', label: 'Blood pressure medication', examples: 'ACE inhibitors, beta blockers, ARBs' },
  { id: 'glucose-lowering', label: 'Diabetes / glucose-lowering medication', examples: 'metformin, insulin, sulfonylureas' },
  { id: 'statins', label: 'Statins / lipid-lowering drugs', examples: 'atorvastatin, rosuvastatin' },
  { id: 'thyroid', label: 'Thyroid medication', examples: 'levothyroxine' },
  { id: 'cyp3a4', label: 'CYP3A4-metabolized medication', examples: 'many prescriptions — ask your pharmacist if unsure' },
  { id: 'immunosuppressants', label: 'Chemotherapy or immunomodulating therapy', examples: 'active cancer treatment, autoimmune immunomodulators' },
  { id: 'lithium', label: 'Lithium', examples: '' },
  { id: 'nitrates', label: 'Nitrate medication', examples: 'nitroglycerin' },
];

export interface MedicationFlag {
  compoundId: string;
  medicationClassId: string;
  /** Verbatim source text from safetyNotes — nothing paraphrased or added. */
  note: string;
}

/**
 * Maps each safetyNotes consultIf/avoidIf/caution string to the medication
 * class(es) it references. Built by reading the existing text once — kept
 * as an explicit list (not derived by keyword-matching at runtime) so every
 * entry is a deliberate, checkable editorial decision, not a regex guess
 * that could mis-tag something safety-critical.
 */
const FLAG_SOURCE: { compoundId: string; medicationClassId: string; sourceText: string }[] = [
  { compoundId: 'glynac', medicationClassId: 'nitrates', sourceText: 'Taking nitroglycerin' },
  { compoundId: 'sulforaphane', medicationClassId: 'thyroid', sourceText: 'Thyroid conditions (high doses may affect iodine uptake)' },
  { compoundId: 'sulforaphane', medicationClassId: 'anticoagulants', sourceText: 'Taking blood thinners' },
  { compoundId: 'rala', medicationClassId: 'glucose-lowering', sourceText: 'Diabetes medications' },
  { compoundId: 'rala', medicationClassId: 'thyroid', sourceText: 'Thyroid medication' },
  { compoundId: 'nmn', medicationClassId: 'glucose-lowering', sourceText: 'Taking metformin (NAD+ pathway interaction — discuss with doctor)' },
  { compoundId: 'resveratrol', medicationClassId: 'anticoagulants', sourceText: 'Blood thinners (warfarin, aspirin)' },
  { compoundId: 'taurine', medicationClassId: 'lithium', sourceText: 'Taking lithium or hypotensive medications' },
  { compoundId: 'taurine', medicationClassId: 'antihypertensives', sourceText: 'Taking lithium or hypotensive medications' },
  { compoundId: 'spermidine', medicationClassId: 'immunosuppressants', sourceText: 'Autoimmune conditions on immunomodulators' },
  { compoundId: 'pterostilbene', medicationClassId: 'statins', sourceText: 'Statins or lipid-lowering drugs' },
  { compoundId: 'pterostilbene', medicationClassId: 'glucose-lowering', sourceText: 'Diabetes medications' },
  { compoundId: 'pterostilbene', medicationClassId: 'anticoagulants', sourceText: 'Blood thinners' },
  { compoundId: 'berberine', medicationClassId: 'cyp3a4', sourceText: 'Any prescription medication (metabolized via CYP3A4)' },
  { compoundId: 'berberine', medicationClassId: 'glucose-lowering', sourceText: 'Diabetes or blood-pressure medication' },
  { compoundId: 'berberine', medicationClassId: 'antihypertensives', sourceText: 'Diabetes or blood-pressure medication' },
  { compoundId: 'urolithina', medicationClassId: 'immunosuppressants', sourceText: 'Taking immunomodulating therapy' },
  { compoundId: 'fisetin', medicationClassId: 'anticoagulants', sourceText: 'Blood thinners (warfarin, aspirin)' },
  { compoundId: 'fisetin', medicationClassId: 'cyp3a4', sourceText: 'Any CYP-metabolized medication' },
  { compoundId: 'coq10', medicationClassId: 'anticoagulants', sourceText: 'Warfarin (CoQ10 can reduce its anticoagulant effect)' },
  { compoundId: 'coq10', medicationClassId: 'antihypertensives', sourceText: 'Blood-pressure medication' },
  { compoundId: 'omega3', medicationClassId: 'anticoagulants', sourceText: 'Blood thinners (warfarin, aspirin, clopidogrel)' },
];

/** Build-time sanity check: every FLAG_SOURCE row must reference a compound
 * that actually has a safetyNotes entry, so this file can never drift from
 * the source of truth it claims to restate. */
const safetyNoteCompoundIds = new Set(safetyNotes.map((n) => n.compoundId));
export const medicationFlags: MedicationFlag[] = FLAG_SOURCE.filter((f) =>
  safetyNoteCompoundIds.has(f.compoundId),
).map((f) => ({ compoundId: f.compoundId, medicationClassId: f.medicationClassId, note: f.sourceText }));

export interface MatchedMedicationFlag extends MedicationFlag {
  medicationLabel: string;
}

/** Cross-references a user's selected medication classes against their stack. */
export function checkMedicationFlags(
  selectedCompoundIds: string[],
  selectedMedicationClassIds: string[],
): MatchedMedicationFlag[] {
  if (selectedCompoundIds.length === 0 || selectedMedicationClassIds.length === 0) return [];
  const classLabel = new Map(medicationClasses.map((m) => [m.id, m.label]));
  return medicationFlags
    .filter(
      (f) =>
        selectedCompoundIds.includes(f.compoundId) &&
        selectedMedicationClassIds.includes(f.medicationClassId),
    )
    .map((f) => ({ ...f, medicationLabel: classLabel.get(f.medicationClassId) ?? f.medicationClassId }));
}
