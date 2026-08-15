import { compounds } from './data';
import { pathways } from './pathways';
import { hallmarkLibrary } from './hallmarks-library';
import type { EvidenceTier } from './types';

/**
 * Derived analytics for the /insights page ("Longevity by the Numbers").
 *
 * Every number here is COMPUTED from the primary data — `lib/data.ts`
 * (`compounds`), `lib/pathways.ts`, and `lib/hallmarks-library.ts` — never a
 * literal. That is the honesty contract: a stat on the page can never drift
 * above (or below) what the library actually contains, because it is the
 * library, counted. `insights.test.ts` locks the headline totals so a data
 * edit that changes them fails the build rather than silently misreporting.
 *
 * Scope note: the fully-populated per-compound fields (bioavailability, timing,
 * studies, synergies) live on the `compounds` set in `lib/data.ts`. The page is
 * explicit that it describes THAT graded set, and links out to the broader
 * module library. Where a field is optional (bioavailability), only compounds
 * that carry it are included, and the copy says so.
 */

export const EVIDENCE_TIERS: EvidenceTier[] = ['A', 'B', 'C'];

/** Canonical evidence-tier accents — must match EvidenceTag / trust.ts. */
export const TIER_ACCENT: Record<EvidenceTier, string> = {
  A: 'var(--accent-emerald)',
  B: 'var(--accent-cyan)',
  C: 'var(--accent-amber)',
};

export interface TierSlice {
  tier: EvidenceTier;
  count: number;
  /** Share of the graded set, 0–1. */
  share: number;
}

export const TIER_SPLIT: TierSlice[] = EVIDENCE_TIERS.map((tier) => {
  const count = compounds.filter((c) => c.evidence === tier).length;
  return { tier, count, share: count / compounds.length };
});

export interface HallmarkCoverage {
  id: string;
  number: number;
  title: string;
  slug: string;
  /** Graded compounds that act on this hallmark. */
  count: number;
  compoundIds: string[];
}

/** How many graded compounds act on each of the 12 hallmarks, most-covered first. */
export const HALLMARK_COVERAGE: HallmarkCoverage[] = hallmarkLibrary
  .map((h) => {
    const acting = compounds.filter((c) => c.hallmarks.includes(h.id));
    return {
      id: h.id,
      number: h.number,
      title: h.title,
      slug: h.slug,
      count: acting.length,
      compoundIds: acting.map((c) => c.id),
    };
  })
  .sort((a, b) => b.count - a.count || a.number - b.number);

export interface BioavailabilityRow {
  id: string;
  name: string;
  value: number;
  tier: EvidenceTier;
}

/** Graded compounds that carry an oral-bioavailability figure, highest first. */
export const BIOAVAILABILITY_RANK: BioavailabilityRow[] = compounds
  .filter((c): c is typeof c & { bioavailability: number } => typeof c.bioavailability === 'number')
  .map((c) => ({ id: c.id, name: c.name, value: c.bioavailability, tier: c.evidence }))
  .sort((a, b) => b.value - a.value);

export interface TimingSlice {
  key: 'AM' | 'AM/PM' | 'PM';
  label: string;
  count: number;
  share: number;
}

const TIMING_LABEL: Record<TimingSlice['key'], string> = {
  AM: 'Morning',
  'AM/PM': 'Twice daily',
  PM: 'Evening',
};

/** When each graded compound is dosed — a circadian read on the library. */
export const DOSING_TIME: TimingSlice[] = (['AM', 'AM/PM', 'PM'] as const).map((key) => {
  const count = compounds.filter((c) => c.timing === key).length;
  return { key, label: TIMING_LABEL[key], count, share: count / compounds.length };
});

export interface CitedRow {
  id: string;
  name: string;
  studyCount: number;
  tier: EvidenceTier;
}

/** Graded compounds ranked by count of cited human/clinical studies. */
export const MOST_CITED: CitedRow[] = compounds
  .map((c) => ({ id: c.id, name: c.name, studyCount: c.studies?.length ?? 0, tier: c.evidence }))
  .sort((a, b) => b.studyCount - a.studyCount || a.name.localeCompare(b.name));

/** Headline totals for the stat band. All derived, never literals. */
export const INSIGHTS_TOTALS = {
  compounds: compounds.length,
  studies: compounds.reduce((s, c) => s + (c.studies?.length ?? 0), 0),
  pathways: pathways.length,
  hallmarks: hallmarkLibrary.length,
  tierA: TIER_SPLIT.find((t) => t.tier === 'A')?.count ?? 0,
  withBioavailability: BIOAVAILABILITY_RANK.length,
  medianBioavailability: (() => {
    const vals = BIOAVAILABILITY_RANK.map((r) => r.value).sort((a, b) => a - b);
    if (!vals.length) return 0;
    const mid = Math.floor(vals.length / 2);
    return vals.length % 2 ? vals[mid] : Math.round((vals[mid - 1] + vals[mid]) / 2);
  })(),
} as const;

/* ── Compound × Pathway × Hallmark matrix ──────────────────────────────────
   The clean, structured link between the three layers. Rows are graded
   compounds (each carrying its pathway "verb" and evidence tier); columns are
   the 12 hallmarks; a cell is on when the compound acts on that hallmark
   (compound.hallmarks). Sorted by hallmark breadth so the widest-acting
   compounds lead. */

export interface MatrixHallmark {
  id: string;
  number: number;
  title: string;
  slug: string;
}

export interface MatrixCompound {
  id: string;
  name: string;
  pathway: string;
  tier: EvidenceTier;
  hallmarkIds: string[];
  breadth: number;
}

export const MATRIX_HALLMARKS: MatrixHallmark[] = [...hallmarkLibrary]
  .sort((a, b) => a.number - b.number)
  .map((h) => ({ id: h.id, number: h.number, title: h.title, slug: h.slug }));

export const MATRIX_COMPOUNDS: MatrixCompound[] = compounds
  .map((c) => ({
    id: c.id,
    name: c.name,
    pathway: c.pathway,
    tier: c.evidence,
    hallmarkIds: c.hallmarks,
    breadth: c.hallmarks.length,
  }))
  .sort((a, b) => b.breadth - a.breadth || a.name.localeCompare(b.name));

/** Pathways that link a compound to the hallmarks it moves — the "verb layer". */
export const PATHWAY_LINKS = pathways
  .map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    compoundCount: p.compoundSlugs.length,
    hallmarkCount: p.hallmarkIds.length,
  }))
  .sort((a, b) => b.compoundCount - a.compoundCount);
