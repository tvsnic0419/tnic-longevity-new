'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
// The canonical tier colour map. The score bar's fill follows the TIER, not the
// score, so a bar can never imply a grade the site has not given.
import { TIER_COLOR_VAR } from '@/lib/trust';
import type { EvidenceRow } from '@/lib/evidence-index';
import type { EvidenceTier } from '@/lib/types';

/**
 * The evidence index, as one sortable table.
 *
 * A client component, but deliberately a plain `useState` one — no
 * `useSearchParams()`. That distinction is the whole reason this renders at
 * all in the initial HTML: a search-param read would bail the enclosing
 * Suspense boundary to client-side rendering and the hundred rows would be
 * invisible to a crawler (STYLE_GUIDE §14). Sorting and filtering are
 * enhancements layered over rows that ship server-rendered in their default
 * order.
 */

type SortKey = 'default' | 'score' | 'title' | 'hallmarks';

const TIER_LABEL: Record<EvidenceTier, string> = {
  A: 'Clinical',
  B: 'Emerging',
  C: 'Preclinical',
};

const CONFIDENCE_LABEL: Record<string, string> = {
  high: 'High',
  moderate: 'Moderate',
  limited: 'Limited',
};

const TIER_RANK: Record<EvidenceTier, number> = { A: 0, B: 1, C: 2 };

export function EvidenceIndexTable({
  rows,
  hallmarks,
}: {
  rows: EvidenceRow[];
  hallmarks: string[];
}) {
  const [sort, setSort] = useState<SortKey>('default');
  const [tier, setTier] = useState<EvidenceTier | 'all'>('all');
  const [hallmark, setHallmark] = useState<string>('all');
  const [scoredOnly, setScoredOnly] = useState(false);

  const view = useMemo(() => {
    let out = rows;
    if (tier !== 'all') out = out.filter((r) => r.tier === tier);
    if (hallmark !== 'all') out = out.filter((r) => r.hallmarkTitles.includes(hallmark));
    if (scoredOnly) out = out.filter((r) => r.score !== null);
    if (sort === 'default') return out;
    const sorted = out.slice();
    if (sort === 'score') {
      // Unscored rows sink rather than sorting as zero — they are unknown, not bad.
      sorted.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.title.localeCompare(b.title));
    } else if (sort === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort(
        (a, b) =>
          b.hallmarkTitles.length - a.hallmarkTitles.length ||
          TIER_RANK[a.tier] - TIER_RANK[b.tier] ||
          a.title.localeCompare(b.title),
      );
    }
    return sorted;
  }, [rows, sort, tier, hallmark, scoredOnly]);

  const filtered = view.length !== rows.length;

  return (
    <div>
      {/* ── Controls ───────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-4">
        <div>
          <label htmlFor="ei-sort" className="text-label mb-1.5 block text-[var(--color-text-faint)]">
            Sort
          </label>
          <select
            id="ei-sort"
            className="input-base min-h-11 w-44"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="default">Tier, then score</option>
            <option value="score">TNiC Score</option>
            <option value="title">Name (A–Z)</option>
            <option value="hallmarks">Hallmark breadth</option>
          </select>
        </div>

        <div>
          <label htmlFor="ei-tier" className="text-label mb-1.5 block text-[var(--color-text-faint)]">
            Evidence tier
          </label>
          <select
            id="ei-tier"
            className="input-base min-h-11 w-44"
            value={tier}
            onChange={(e) => setTier(e.target.value as EvidenceTier | 'all')}
          >
            <option value="all">All tiers</option>
            <option value="A">Tier A — Clinical</option>
            <option value="B">Tier B — Emerging</option>
            <option value="C">Tier C — Preclinical</option>
          </select>
        </div>

        <div>
          <label htmlFor="ei-hallmark" className="text-label mb-1.5 block text-[var(--color-text-faint)]">
            Hallmark
          </label>
          <select
            id="ei-hallmark"
            className="input-base min-h-11 w-56"
            value={hallmark}
            onChange={(e) => setHallmark(e.target.value)}
          >
            <option value="all">All hallmarks</option>
            {hallmarks.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <label className="focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-1 text-body-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[var(--accent-cyan)]"
            checked={scoredOnly}
            onChange={(e) => setScoredOnly(e.target.checked)}
          />
          Scored only
        </label>
      </div>

      <p className="text-body-sm mb-4 text-muted-foreground" aria-live="polite">
        Showing <span className="font-mono font-semibold text-foreground">{view.length}</span> of{' '}
        {rows.length} graded compounds
        {filtered && (
          <>
            {' · '}
            <button
              type="button"
              onClick={() => {
                setTier('all');
                setHallmark('all');
                setScoredOnly(false);
              }}
              className="action-link focus-ring rounded text-accent-cyan hover:underline"
            >
              Clear filters
            </button>
          </>
        )}
      </p>

      {/* ── The table ──────────────────────────────────────────────────── */}
      <div className="scroll-region rounded-2xl border border-border bg-[var(--card-ground)]">
        <table className="table-base min-w-[52rem]">
          <caption className="sr-only">
            Every graded compound in the TNiC library with its evidence tier, TNiC Score, score
            confidence, and the hallmarks of aging it acts on. Sortable and filterable.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[30%]">Compound</th>
              <th scope="col" className="w-[12%]">Tier</th>
              <th scope="col" className="w-[18%]">TNiC Score</th>
              <th scope="col" className="w-[14%]">Confidence</th>
              <th scope="col">Hallmarks</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.slug}>
                <th scope="row" className="align-top">
                  <Link
                    href={r.href}
                    className="action-link focus-ring rounded text-body-sm font-semibold text-foreground hover:text-accent-cyan"
                  >
                    {r.title}
                  </Link>
                  <span className="text-caption mt-0.5 block max-w-[34ch] text-muted-foreground">
                    {r.tagline}
                  </span>
                </th>
                <td className="align-top whitespace-nowrap">
                  <EvidenceTag tier={r.tier} size="sm" />
                  <span className="sr-only">{TIER_LABEL[r.tier]}</span>
                </td>
                <td className="align-top whitespace-nowrap">
                  {r.score === null ? (
                    <span
                      className="text-caption text-muted-foreground"
                      title={r.methodologyNote ?? 'No scored evidence source is available yet.'}
                    >
                      Not scored
                    </span>
                  ) : (
                    <span className="inline-flex w-full max-w-[9rem] flex-col gap-1">
                      <span className="font-mono text-body-sm font-semibold tabular-nums text-foreground">
                        {Math.round(r.score)}
                        <span className="text-caption text-muted-foreground">/100</span>
                      </span>
                      <span
                        className="h-1 w-full overflow-hidden rounded-full bg-white/10"
                        aria-hidden="true"
                      >
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${Math.max(2, Math.min(100, r.score))}%`,
                            background: TIER_COLOR_VAR[r.tier],
                          }}
                        />
                      </span>
                    </span>
                  )}
                </td>
                <td className="align-top">
                  <span className="text-caption text-muted-foreground">
                    {r.confidence ? CONFIDENCE_LABEL[r.confidence] : '—'}
                  </span>
                </td>
                <td className="align-top">
                  {/* The hallmark names used to sit here as a joined string:
                      the row named the mechanism and then refused to take the
                      reader to it. They are links now — the ids were always
                      one lookup from a real route. Kept as text-sized inline
                      links rather than chips so a hundred rows stay a table
                      and not a wall of pills. */}
                  {r.hallmarks.length === 0 ? (
                    <span className="text-caption text-muted-foreground">—</span>
                  ) : (
                    <span className="text-caption text-muted-foreground">
                      {r.hallmarks.map((h, i) => (
                        <span key={h.key}>
                          {i > 0 && <span aria-hidden="true"> · </span>}
                          <Link
                            href={h.href}
                            className="focus-ring rounded underline-offset-2 transition-colors hover:text-accent-violet hover:underline"
                          >
                            {h.label}
                          </Link>
                        </span>
                      ))}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {view.length === 0 && (
        <p className="premium-card mt-6 p-6 text-center text-body-sm text-muted-foreground">
          No compound in the library matches that combination yet.
        </p>
      )}
    </div>
  );
}
