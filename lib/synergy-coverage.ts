import { HERO_NETWORK_EDGES, HERO_NETWORK_NODES, getEdgeExplanation, getHeroCompound } from './hero-network';

/**
 * Editorial coverage report for the compound-synergy network.
 *
 * Every edge resolves to *some* "why" text (lib/hero-network.test.ts enforces
 * that), but the three sources are not equal: `emergent` and `synergy-link`
 * are authored prose about that specific pair, while `derived` is a true but
 * generic sentence assembled from shared hallmarks or pathway.
 *
 * The `derived` edges are therefore the content backlog — the pairs a visitor
 * can click today and get an honest but shallow answer for. Ranking them by
 * how prominent the pair is (combined node degree) puts the most-seen gaps
 * first, so authoring effort goes where it is noticed.
 */

export type SynergySource = 'emergent' | 'synergy-link' | 'authored' | 'derived';

export interface SynergyCoverageGap {
  a: string;
  b: string;
  /** Display names, for a readable backlog. */
  label: string;
  /** Combined degree of both endpoints — higher means more visible in the graph. */
  prominence: number;
  text: string;
}

export interface SynergyCoverageReport {
  totalEdges: number;
  bySource: Record<SynergySource, number>;
  /** Share of edges backed by pair-specific authored prose. */
  authoredShare: number;
  /** Generic-fallback edges, most prominent first. */
  gaps: SynergyCoverageGap[];
}

export function buildSynergyCoverageReport(): SynergyCoverageReport {
  const degree = new Map(HERO_NETWORK_NODES.map((n) => [n.id, n.degree]));
  const bySource: Record<SynergySource, number> = { emergent: 0, 'synergy-link': 0, authored: 0, derived: 0 };
  const gaps: SynergyCoverageGap[] = [];

  for (const e of HERO_NETWORK_EDGES) {
    const explanation = getEdgeExplanation(e.a, e.b);
    bySource[explanation.source] += 1;
    if (explanation.source !== 'derived') continue;

    const nameA = getHeroCompound(e.a)?.name ?? e.a;
    const nameB = getHeroCompound(e.b)?.name ?? e.b;
    gaps.push({
      a: e.a,
      b: e.b,
      label: `${nameA} + ${nameB}`,
      prominence: (degree.get(e.a) ?? 0) + (degree.get(e.b) ?? 0),
      text: explanation.text,
    });
  }

  // Prominence descending, then label so equal-prominence rows stay stable
  // across runs — a shifting backlog order is noise in a diff.
  gaps.sort((x, y) => y.prominence - x.prominence || x.label.localeCompare(y.label));

  const totalEdges = HERO_NETWORK_EDGES.length;
  const authored = bySource.emergent + bySource['synergy-link'] + bySource.authored;

  return {
    totalEdges,
    bySource,
    authoredShare: totalEdges === 0 ? 0 : authored / totalEdges,
    gaps,
  };
}

/** Human-readable report — printed by `npm run synergy:coverage`. */
export function formatSynergyCoverageReport(report: SynergyCoverageReport): string {
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
  const lines: string[] = [
    'Compound-synergy edge coverage',
    '='.repeat(46),
    `Total edges:            ${report.totalEdges}`,
    `  authored (emergent):  ${report.bySource.emergent}`,
    `  authored (stack):     ${report.bySource['synergy-link']}`,
    `  authored (mechanism): ${report.bySource.authored}`,
    `  generic (derived):    ${report.bySource.derived}`,
    `Pair-specific coverage: ${pct(report.authoredShare)}`,
    '',
  ];

  if (report.gaps.length === 0) {
    lines.push('No generic fallbacks — every pair has authored prose.');
    return lines.join('\n');
  }

  lines.push(`Backlog — ${report.gaps.length} pairs on the generic fallback, most visible first:`);
  lines.push('');
  for (const gap of report.gaps) {
    lines.push(`  [${String(gap.prominence).padStart(3)}] ${gap.label}`);
    lines.push(`        ${gap.text}`);
  }
  lines.push('');
  lines.push('To fix one: add an entry to lib/synergy-mechanisms.ts (prose');
  lines.push('only, no scoring impact). The hero widget and every other');
  lines.push('synergy surface pick it up automatically.');

  return lines.join('\n');
}
