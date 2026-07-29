import type { EvidenceTier } from './types';

/**
 * Content provenance — the honest trust metadata surfaced on every content page.
 *
 * Integrity rule: attribution reflects the *real* editorial/evidence-grading
 * process only. We never fabricate a named reviewer or a medical credential
 * ("Reviewed by Dr. X, MD") — the maintainer is the TNiC editorial team, the
 * date is the content's real `last_updated`, and grading is explained on the
 * methodology page. If a real, named expert reviewer is ever added, credit them
 * explicitly via `maintainer`/`reviewer` — but never invent one.
 */
export const CONTENT_MAINTAINER = 'TNiC editorial';
export const METHODOLOGY_HREF = '/trust/methodology';

export interface ContentProvenance {
  maintainer: string;
  /** ISO date (YYYY-MM-DD) the content was last updated — from MDX frontmatter. */
  lastUpdated?: string;
  /** Human-readable form of `lastUpdated`, or undefined when missing/invalid. */
  lastUpdatedLabel?: string;
  evidenceTier?: EvidenceTier;
  /** Unique PMIDs cited in the page body; undefined when there are none. */
  citationCount?: number;
  methodologyHref: string;
}

/** Unique 7–8 digit PMIDs cited in an MDX body, as a set. Mirrors MdxRenderer's PMID pattern. */
export function collectPmids(mdxBody?: string | null): Set<string> {
  const set = new Set<string>();
  if (!mdxBody) return set;
  for (const m of mdxBody.match(/\bPMID:?\s*(\d{7,8})\b/g) ?? []) set.add(m.replace(/\D/g, ''));
  return set;
}

/** Count unique PMIDs cited in an MDX body. */
export function countCitations(mdxBody?: string | null): number {
  return collectPmids(mdxBody).size;
}

/** Format an ISO date as "Mon D, YYYY" in UTC; undefined for a missing/invalid date. */
export function formatUpdatedDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Assemble honest provenance for a content page. Zero/negative citation counts are dropped. */
export function buildContentProvenance(input: {
  lastUpdated?: string;
  evidenceTier?: EvidenceTier;
  citationCount?: number;
  maintainer?: string;
}): ContentProvenance {
  const count = input.citationCount && input.citationCount > 0 ? input.citationCount : undefined;
  return {
    maintainer: input.maintainer ?? CONTENT_MAINTAINER,
    lastUpdated: input.lastUpdated,
    lastUpdatedLabel: formatUpdatedDate(input.lastUpdated),
    evidenceTier: input.evidenceTier,
    citationCount: count,
    methodologyHref: METHODOLOGY_HREF,
  };
}
