import { compoundModules } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { resolveHallmarks } from './entity-graph';
import type { GraphEntity } from './entity-graph';
import { computeTnicScore, type TnicScoreConfidence, type TnicScoreSource } from '@/lib/tnic-score';
import type { EvidenceTier } from '@/lib/types';

/**
 * The evidence index — every graded compound as one row.
 *
 * Nothing here is authored. Each field is read from a registry that already
 * publishes it on the compound's own page (`compoundModules` for identity and
 * tier, `computeTnicScore` for the composite and its provenance,
 * `hallmarkLibrary` for the mechanism labels), so the table can never assert
 * something the deep-dive does not.
 *
 * That includes the gaps. 20 of the 100 modules have no computable score —
 * either no `compoundId` to resolve, or no scored source behind it — and they
 * stay in the index with `score: null` rather than being dropped or given a
 * placeholder number. A table of 80 that calls itself the library would be a
 * quieter lie than a missing row.
 */

export interface EvidenceRow {
  slug: string;
  title: string;
  tagline: string;
  tier: EvidenceTier;
  /** 0–100 composite, or null where no source can score it. */
  score: number | null;
  confidence: TnicScoreConfidence | null;
  source: TnicScoreSource | null;
  /** Why the score is what it is — shown verbatim, never paraphrased. */
  methodologyNote: string | null;
  hallmarkTitles: string[];
  /**
   * The same hallmarks as linkable entities. The table printed the titles as
   * dead text while the ids sat one map lookup away from a real route — the
   * row named the mechanism and then refused to take the reader to it.
   * Parallel to `hallmarkTitles` rather than replacing it, because the filter
   * facets match on title and `evidence-index.test.ts` guards that.
   */
  hallmarks: GraphEntity[];
  href: string;
}

/** Tier order for the default sort: strongest human evidence first. */
const TIER_RANK: Record<EvidenceTier, number> = { A: 0, B: 1, C: 2 };

const hallmarkTitleById = new Map(hallmarkLibrary.map((h) => [h.id, h.title]));

function buildRows(): EvidenceRow[] {
  const rows = compoundModules.map((m): EvidenceRow => {
    const scored = m.compoundId ? computeTnicScore(m.compoundId) : null;
    return {
      slug: m.slug,
      title: m.title,
      tagline: m.tagline,
      tier: m.evidenceTier,
      score: scored?.score ?? null,
      confidence: scored?.confidence ?? null,
      source: scored?.source ?? null,
      methodologyNote: scored?.methodologyNote ?? null,
      hallmarkTitles: m.relatedHallmarkIds
        .map((id) => hallmarkTitleById.get(id))
        .filter((t): t is string => Boolean(t)),
      hallmarks: resolveHallmarks(m.relatedHallmarkIds),
      href: `/library/compounds/${m.slug}`,
    };
  });

  // Default order: tier first, then score, then title. Tier leads because it is
  // the claim the site actually stands behind — the composite is a derived
  // convenience and 57 of these rows carry it at "limited" confidence.
  return rows.sort(
    (a, b) =>
      TIER_RANK[a.tier] - TIER_RANK[b.tier] ||
      (b.score ?? -1) - (a.score ?? -1) ||
      a.title.localeCompare(b.title),
  );
}

export const evidenceRows: EvidenceRow[] = buildRows();

export interface EvidenceIndexStats {
  total: number;
  scored: number;
  unscored: number;
  byTier: Record<EvidenceTier, number>;
  byConfidence: Record<TnicScoreConfidence, number>;
}

/** Counts derived from the rows themselves, so a figure on the page can never
 *  drift from the table beneath it. */
export function evidenceIndexStats(rows: EvidenceRow[] = evidenceRows): EvidenceIndexStats {
  const byTier: Record<EvidenceTier, number> = { A: 0, B: 0, C: 0 };
  const byConfidence: Record<TnicScoreConfidence, number> = { high: 0, moderate: 0, limited: 0 };
  let scored = 0;
  for (const r of rows) {
    byTier[r.tier] += 1;
    if (r.confidence) byConfidence[r.confidence] += 1;
    if (r.score !== null) scored += 1;
  }
  return { total: rows.length, scored, unscored: rows.length - scored, byTier, byConfidence };
}

/** Every distinct hallmark present in the index, for the filter control. */
export function evidenceHallmarkFacets(rows: EvidenceRow[] = evidenceRows): string[] {
  return [...new Set(rows.flatMap((r) => r.hallmarkTitles))].sort((a, b) => a.localeCompare(b));
}
