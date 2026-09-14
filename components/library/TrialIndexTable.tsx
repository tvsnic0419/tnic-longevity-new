'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import {
  DESIGN_CLASS_LABEL,
  EVIDENCE_BASE_LABEL,
  type TrialRecord,
  type TrialDesignClass,
  type TrialEvidenceBase,
} from '@/lib/trial-index';
import type { EvidenceTier } from '@/lib/types';

/**
 * The trial index, as one filterable table.
 *
 * Plain `useState`, deliberately — no `useSearchParams()`. A search-param read
 * would bail the enclosing Suspense boundary to client-side rendering and all
 * 363 rows would be invisible to a crawler (STYLE_GUIDE §14). On a page whose
 * entire value is that the rows are machine-readable, that would defeat the
 * point. Filtering is an enhancement over rows that ship server-rendered in
 * their default order.
 *
 * On what each column is allowed to say: `design`, `participants`, `duration`,
 * `dose` and `outcome` are printed exactly as the compound's own deep-dive wrote
 * them, and a cell the source table never had renders as an em-dash rather than
 * being filled from a neighbour. The one derived value on screen — the design
 * class under the authored design text — is visually subordinate and labelled as
 * TNiC's classification in the legend, so it can never be mistaken for a claim
 * the source made.
 */

type SortKey = 'default' | 'year-desc' | 'year-asc' | 'compound';

const EVIDENCE_BASE_ORDER: TrialEvidenceBase[] = ['human', 'mixed', 'preclinical', 'unclear'];

const DESIGN_ORDER: TrialDesignClass[] = [
  'rct', 'meta-analysis', 'crossover', 'observational', 'open-label',
  'pharmacokinetic', 'mechanistic', 'review', 'preclinical', 'unclassified',
];

export function TrialIndexTable({ rows }: { rows: TrialRecord[] }) {
  const [sort, setSort] = useState<SortKey>('default');
  const [base, setBase] = useState<TrialEvidenceBase | 'all'>('all');
  const [design, setDesign] = useState<TrialDesignClass | 'all'>('all');
  const [tier, setTier] = useState<EvidenceTier | 'all'>('all');
  const [pmidOnly, setPmidOnly] = useState(false);
  const [query, setQuery] = useState('');

  const view = useMemo(() => {
    let out = rows;
    if (base !== 'all') out = out.filter((r) => r.evidenceBase === base);
    if (design !== 'all') out = out.filter((r) => r.designClass === design);
    if (tier !== 'all') out = out.filter((r) => r.tier === tier);
    if (pmidOnly) out = out.filter((r) => r.pmid !== null);
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter((r) =>
        [r.compoundTitle, r.citation, r.design, r.outcome, r.population]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q)),
      );
    }
    if (sort === 'default') return out;
    const sorted = out.slice();
    if (sort === 'compound') {
      sorted.sort((a, b) => a.compoundTitle.localeCompare(b.compoundTitle) || a.id.localeCompare(b.id));
    } else {
      // Undated rows sink in both directions — an unknown year is not an old one.
      const dir = sort === 'year-desc' ? -1 : 1;
      sorted.sort((a, b) => {
        if (a.year === null && b.year === null) return a.id.localeCompare(b.id);
        if (a.year === null) return 1;
        if (b.year === null) return -1;
        return (a.year - b.year) * dir || a.compoundTitle.localeCompare(b.compoundTitle);
      });
    }
    return sorted;
  }, [rows, sort, base, design, tier, pmidOnly, query]);

  const filtered = view.length !== rows.length;

  const clear = () => {
    setBase('all');
    setDesign('all');
    setTier('all');
    setPmidOnly(false);
    setQuery('');
  };

  return (
    <div>
      {/* ── Controls ───────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-4">
        <div>
          <label htmlFor="ti-q" className="text-label mb-1.5 block text-[var(--color-text-faint)]">
            Search
          </label>
          <input
            id="ti-q"
            type="search"
            className="input-base min-h-11 w-56"
            placeholder="Compound, author, outcome…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="ti-base" className="text-label mb-1.5 block text-[var(--color-text-faint)]">
            Studied in
          </label>
          <select
            id="ti-base"
            className="input-base min-h-11 w-40"
            value={base}
            onChange={(e) => setBase(e.target.value as TrialEvidenceBase | 'all')}
          >
            <option value="all">All</option>
            {EVIDENCE_BASE_ORDER.map((b) => (
              <option key={b} value={b}>{EVIDENCE_BASE_LABEL[b]}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ti-design" className="text-label mb-1.5 block text-[var(--color-text-faint)]">
            Design
          </label>
          <select
            id="ti-design"
            className="input-base min-h-11 w-48"
            value={design}
            onChange={(e) => setDesign(e.target.value as TrialDesignClass | 'all')}
          >
            <option value="all">All designs</option>
            {DESIGN_ORDER.map((d) => (
              <option key={d} value={d}>{DESIGN_CLASS_LABEL[d]}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ti-tier" className="text-label mb-1.5 block text-[var(--color-text-faint)]">
            Row tier
          </label>
          <select
            id="ti-tier"
            className="input-base min-h-11 w-32"
            value={tier}
            onChange={(e) => setTier(e.target.value as EvidenceTier | 'all')}
          >
            <option value="all">All tiers</option>
            <option value="A">Tier A</option>
            <option value="B">Tier B</option>
            <option value="C">Tier C</option>
          </select>
        </div>

        <div>
          <label htmlFor="ti-sort" className="text-label mb-1.5 block text-[var(--color-text-faint)]">
            Sort
          </label>
          <select
            id="ti-sort"
            className="input-base min-h-11 w-44"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="default">By compound (library order)</option>
            <option value="year-desc">Newest first</option>
            <option value="year-asc">Oldest first</option>
            <option value="compound">Compound A–Z</option>
          </select>
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-body-sm text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            className="size-4 accent-[var(--accent-cyan)]"
            checked={pmidOnly}
            onChange={(e) => setPmidOnly(e.target.checked)}
          />
          PMID-linked only
        </label>
      </div>

      <p className="text-body-sm mb-4 text-muted-foreground" aria-live="polite">
        Showing <strong className="text-foreground">{view.length}</strong> of {rows.length} study rows
        {filtered && (
          <>
            {' · '}
            <button
              type="button"
              onClick={clear}
              className="action-link focus-ring rounded text-accent-cyan hover:underline"
            >
              Clear filters
            </button>
          </>
        )}
      </p>

      {/* ── The table ──────────────────────────────────────────────────── */}
      <div className="scroll-region rounded-2xl border border-border bg-[var(--card-ground)]">
        <table className="table-base min-w-[64rem]">
          <caption className="sr-only">
            Every study row cited by a TNiC compound deep-dive: the citation, the design, who was
            studied, for how long, what was reported, and the tier the deep-dive assigned it.
            Filterable and sortable.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[22%]">Study</th>
              <th scope="col" className="w-[17%]">Design</th>
              <th scope="col" className="w-[10%]">Studied in</th>
              <th scope="col" className="w-[9%]">Duration</th>
              <th scope="col">Reported outcome</th>
              <th scope="col" className="w-[11%]">Tier</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id}>
                <th scope="row" className="align-top">
                  <span className="text-body-sm font-semibold text-foreground">{r.citation}</span>
                  {/* Both links carry a 24px floor rather than `.tap-expand-y`.
                      That helper is vertical-only and works by an absolutely
                      positioned pseudo-element, which its own note warns not to
                      use where neighbours sit closer than 44px — these two links
                      share a line. A short compound name ("Zinc") measured 23px
                      wide and failed the tap-target gate, so the control is made
                      genuinely 24px instead of merely feeling like it: in normal
                      flow the two boxes sit side by side and cannot steal each
                      other's taps. */}
                  <span className="text-caption mt-0.5 block text-muted-foreground">
                    <Link
                      href={r.href}
                      className="action-link focus-ring inline-flex min-h-6 min-w-6 items-center rounded underline-offset-2 hover:text-accent-cyan hover:underline"
                    >
                      {r.compoundTitle}
                    </Link>
                    {r.pmid && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring inline-flex min-h-6 min-w-6 items-center rounded font-mono underline-offset-2 hover:text-accent-cyan hover:underline"
                        >
                          PMID {r.pmid}
                        </a>
                      </>
                    )}
                  </span>
                </th>

                <td className="align-top">
                  {/* Authored text first and at reading size; the derived class
                      sits under it in caption type so the hierarchy itself says
                      which of the two the library actually wrote. */}
                  <span className="text-body-sm text-[var(--color-text-secondary)]">
                    {r.design ?? <span className="text-muted-foreground">—</span>}
                  </span>
                  {r.designClass !== 'unclassified' && (
                    <span className="text-caption mt-0.5 block text-muted-foreground">
                      {DESIGN_CLASS_LABEL[r.designClass]}
                    </span>
                  )}
                </td>

                <td className="align-top">
                  <span className="text-caption text-[var(--color-text-secondary)]">
                    {EVIDENCE_BASE_LABEL[r.evidenceBase]}
                  </span>
                  {(r.participants || r.population) && (
                    <span className="text-caption mt-0.5 block text-muted-foreground">
                      {r.population ?? null}
                      {r.population && r.participants ? ' · ' : null}
                      {r.participants ? `n=${r.participants}` : null}
                    </span>
                  )}
                </td>

                <td className="align-top whitespace-nowrap">
                  <span className="text-caption text-[var(--color-text-secondary)]">
                    {r.duration ?? <span className="text-muted-foreground">—</span>}
                  </span>
                  {r.dose && (
                    <span className="text-caption mt-0.5 block text-muted-foreground">{r.dose}</span>
                  )}
                </td>

                <td className="align-top">
                  <span className="text-body-sm text-[var(--color-text-secondary)]">
                    {r.outcome ?? <span className="text-muted-foreground">—</span>}
                  </span>
                </td>

                {/* No `whitespace-nowrap` on the cell: the qualifier is often a
                    short phrase ("contradicts positive trials") and holding it on
                    one line clipped it at the column edge. The badge keeps its
                    own nowrap; the qualifier under it is free to wrap. */}
                <td className="align-top">
                  {r.tier ? (
                    <>
                      <span className="block whitespace-nowrap">
                        <EvidenceTag tier={r.tier} size="sm" />
                      </span>
                      {/* The qualifier is the point: "A (for the combination)"
                          and a bare "A" are not the same claim. */}
                      {r.tierLabel && r.tierLabel !== r.tier && (
                        <span className="text-caption mt-0.5 block text-balance text-muted-foreground">
                          {r.tierLabel.replace(/^[ABC]\s*/, '')}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-caption text-muted-foreground">{r.tierLabel ?? '—'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {view.length === 0 && (
        <p className="text-body-sm mt-5 text-muted-foreground">
          No study rows match those filters.{' '}
          <button
            type="button"
            onClick={clear}
            className="action-link focus-ring rounded text-accent-cyan hover:underline"
          >
            Clear them
          </button>
          .
        </p>
      )}
    </div>
  );
}
