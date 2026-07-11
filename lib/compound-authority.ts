import { compounds, safetyNotes, evidenceStandards } from './data';
import { hallmarkLibrary } from './hallmarks-library';
import type { Compound, EvidenceTier } from './types';

/** Every compound id — drives static generation of /library/compounds/[id]. */
export const allCompoundIds: string[] = compounds.map((c) => c.id);

export function getCompound(id: string): Compound | undefined {
  return compounds.find((c) => c.id === id);
}

export function getSafetyNote(id: string) {
  return safetyNotes.find((n) => n.compoundId === id) ?? null;
}

// Resolve a compound's hallmark id to its live library page. Only ids that map
// to a real hallmark page are returned, so interlinks never 404.
const hallmarkById = new Map(
  hallmarkLibrary.map((h) => [h.id, { slug: h.slug, title: h.title } as const]),
);

export function getHallmarkLink(hallmarkId: string): { slug: string; title: string } | null {
  return hallmarkById.get(hallmarkId) ?? null;
}

export function getHallmarkLinks(compound: Compound): Array<{ slug: string; title: string }> {
  return compound.hallmarks
    .map((h) => getHallmarkLink(h))
    .filter((h): h is { slug: string; title: string } => Boolean(h));
}

/** Synergistic compounds that resolve to real compounds (for the interlink rail). */
export function getRelatedCompounds(compound: Compound): Compound[] {
  return compound.synergies
    .map((sid) => compounds.find((c) => c.id === sid))
    .filter((c): c is Compound => Boolean(c));
}

/** The authored grading rubric row for a tier — used to explain the grade honestly. */
export function getEvidenceStandard(tier: EvidenceTier) {
  return evidenceStandards.find((s) => s.tier === tier) ?? evidenceStandards[0];
}

/** Most recent cited study year — a real "last evidence" anchor, never fabricated. */
export function latestStudyYear(compound: Compound): number | null {
  if (compound.studies.length === 0) return null;
  return compound.studies.reduce((max, s) => Math.max(max, s.year), 0);
}
