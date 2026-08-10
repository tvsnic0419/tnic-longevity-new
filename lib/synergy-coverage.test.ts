import { describe, expect, it } from 'vitest';
import { HERO_NETWORK_EDGES } from './hero-network';
import { buildSynergyCoverageReport, formatSynergyCoverageReport } from './synergy-coverage';

/**
 * Doubles as the editorial coverage report:
 *
 *   npm run synergy:coverage
 *
 * runs this file with output shown, printing the ranked backlog of compound
 * pairs still on the generic derived fallback. The assertions below are the
 * guardrail; the printed report is the working artifact.
 */

const report = buildSynergyCoverageReport();

describe('synergy coverage', () => {
  it('accounts for every edge exactly once', () => {
    const counted =
      report.bySource.emergent + report.bySource['synergy-link'] + report.bySource.derived;
    expect(report.totalEdges).toBe(HERO_NETWORK_EDGES.length);
    expect(counted).toBe(report.totalEdges);
  });

  it('lists exactly the derived edges as gaps', () => {
    expect(report.gaps).toHaveLength(report.bySource.derived);
  });

  it('ranks the backlog by prominence, descending', () => {
    const prominences = report.gaps.map((g) => g.prominence);
    expect([...prominences].sort((a, b) => b - a)).toEqual(prominences);
  });

  it('gives every gap a readable label and non-empty text', () => {
    for (const gap of report.gaps) {
      expect(gap.label).toContain('+');
      expect(gap.text.trim().length).toBeGreaterThan(0);
    }
  });

  // Ratchet: authored coverage may rise freely, but a drop means an authored
  // pair was deleted or a compound's synergies changed underneath it. Raise
  // this floor as coverage improves — that edit is the paper trail, same
  // convention as EXPECTED_COMPOUND_COUNT in compound-coverage.test.ts.
  const AUTHORED_EDGE_FLOOR = 6;

  it(`keeps at least ${AUTHORED_EDGE_FLOOR} pair-specific authored edges`, () => {
    const authored = report.bySource.emergent + report.bySource['synergy-link'];
    expect(authored).toBeGreaterThanOrEqual(AUTHORED_EDGE_FLOOR);
  });

  it('prints the coverage report', () => {
    console.log('\n' + formatSynergyCoverageReport(report) + '\n');
    expect(report.totalEdges).toBeGreaterThan(0);
  });
});
