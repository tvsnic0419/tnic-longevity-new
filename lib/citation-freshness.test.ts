import { describe, it, expect } from 'vitest';
import { compounds } from './data';

/**
 * Citation freshness + coverage guard. On a site whose whole claim is
 * "PubMed-backed," a compound with no citations — or one whose newest citation
 * has quietly gone stale — is the failure mode that matters most. This test does
 * two things:
 *
 *  1. Hard invariants: every structured compound carries ≥1 study, and every
 *     study year is plausible (no typos like 2205 or 1899).
 *  2. A ratchet on staleness: it counts compounds whose newest citation predates
 *     STALE_BEFORE_YEAR and holds that count at or below a budget, printing an
 *     oldest-first review queue. The budget only ever ratchets DOWN as citations
 *     are refreshed — same convention as AUTHORED_EDGE_FLOOR and
 *     EXPECTED_COMPOUND_COUNT. It is a review queue, not an auto-updater.
 */

const STALE_BEFORE_YEAR = 2015;
// Current count of structured compounds whose newest citation predates
// STALE_BEFORE_YEAR. Recalibrated 2026-08 when the structured set grew 27→81
// (many long-established nutrients — vitamin C, phosphatidylserine, ginkgo —
// genuinely have older foundational RCTs, not neglect). Ratchet DOWN as
// citations are refreshed with real, verified newer literature; never raise
// it to silently accommodate a newly-stale entry.
const STALE_CITATION_BUDGET = 20;

interface Freshness {
  id: string;
  newestYear: number;
  studyCount: number;
}

const freshness: Freshness[] = compounds
  .map((c) => {
    const years = (c.studies ?? []).map((s) => s.year).filter((y): y is number => typeof y === 'number');
    return {
      id: c.id,
      newestYear: years.length ? Math.max(...years) : 0,
      studyCount: years.length,
    };
  })
  .sort((a, b) => a.newestYear - b.newestYear);

describe('citation freshness + coverage', () => {
  it('every structured compound carries at least one study', () => {
    for (const f of freshness) {
      expect(f.studyCount, `${f.id} has no structured studies`).toBeGreaterThan(0);
    }
  });

  it('every study year is plausible (1970 .. now+1)', () => {
    // Floor is 1970, not a stricter "recent" cutoff — some compounds
    // legitimately cite landmark historical trials (e.g. the Coronary Drug
    // Project niacin follow-ups, 1986/1991). This only catches real
    // data-entry errors like `year: 0`, not old-but-real citations.
    const maxYear = new Date().getFullYear() + 1;
    for (const c of compounds) {
      for (const s of c.studies ?? []) {
        expect(
          s.year >= 1970 && s.year <= maxYear,
          `${c.id} cites an implausible study year: ${s.year}`,
        ).toBe(true);
      }
    }
  });

  it(`no more than ${STALE_CITATION_BUDGET} compounds have their newest citation before ${STALE_BEFORE_YEAR}`, () => {
    const stale = freshness.filter((f) => f.newestYear < STALE_BEFORE_YEAR);
    if (stale.length > 0) {
      // Surface the review queue in test output (oldest first).
      const queue = stale.map((f) => `  ${f.newestYear}  ${f.id} (${f.studyCount} studies)`).join('\n');
      // eslint-disable-next-line no-console
      console.log(`\nCitation review queue (newest citation before ${STALE_BEFORE_YEAR}):\n${queue}\n`);
    }
    expect(
      stale.length,
      `${stale.length} compounds have a newest citation before ${STALE_BEFORE_YEAR} (budget ${STALE_CITATION_BUDGET}). ` +
        `Refresh the oldest citations or, if intended, ratchet STALE_CITATION_BUDGET to ${stale.length}.`,
    ).toBeLessThanOrEqual(STALE_CITATION_BUDGET);
  });
});
