'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MATRIX_COMPOUNDS, MATRIX_HALLMARKS, TIER_ACCENT } from '@/lib/insights';
import type { EvidenceTier } from '@/lib/types';

/**
 * Compound × Pathway × Hallmark map. Rows are the fully-graded compounds (the
 * lib/data.ts set that carries a pathway) rather than the whole deep-dive
 * library — each
 * carrying its pathway "verb" and evidence tier — and the 12 columns are the
 * hallmarks of aging. A filled cell means the compound acts on that hallmark
 * (lib/data.ts `hallmarks`), painted in the compound's tier color so evidence
 * strength reads across the grid. Rows link to the compound module; column
 * headers link to the hallmark. Rendered as a real table (scope + captions) and
 * wrapped in a scroll region so the 12 columns never push the page sideways.
 */
export function ConnectionMatrix() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-label text-muted-foreground">Evidence tier</span>
        {(['A', 'B', 'C'] as EvidenceTier[]).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <span className="h-3 w-3 rounded-[3px]" style={{ background: TIER_ACCENT[t] }} aria-hidden="true" />
            Tier {t}
          </span>
        ))}
        <span className="ml-auto text-caption text-muted-foreground">
          Filled = the compound acts on that hallmark
        </span>
      </div>

      <div className="scroll-region rounded-2xl border border-border/70 bg-card/30">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Fully-graded compounds (rows, with their pathway and evidence tier) mapped to the twelve
            hallmarks of aging (columns). A filled cell means the compound acts on that hallmark.
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-[var(--color-bg-elevated)] px-3 py-3 text-label text-muted-foreground"
              >
                Compound
                <span className="block font-sans text-micro font-normal normal-case tracking-normal text-faint">
                  pathway · tier
                </span>
              </th>
              {MATRIX_HALLMARKS.map((h) => (
                <th key={h.id} scope="col" className="px-1 py-3 text-center align-bottom">
                  <Link
                    href={`/hallmarks/${h.slug}`}
                    className="focus-ring group inline-flex flex-col items-center gap-1"
                    title={h.title}
                  >
                    <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground group-hover:text-accent-cyan">
                      {String(h.number).padStart(2, '0')}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_COMPOUNDS.map((c) => {
              const acting = new Set(c.hallmarkIds);
              const color = TIER_ACCENT[c.tier];
              return (
                <tr key={c.id} className="group border-t border-border/50 hover:bg-white/[0.02]">
                  <th scope="row" className="sticky left-0 z-10 bg-[var(--color-bg-elevated)] px-3 py-2.5 font-normal">
                    <Link href={`/library/compounds/${c.id}`} className="focus-ring block">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-micro font-bold" style={{ color }}>{c.tier}</span>
                        <span className="text-body-sm font-medium text-foreground group-hover:text-accent-cyan">
                          {c.name}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-micro text-faint">{c.pathway}</span>
                    </Link>
                  </th>
                  {MATRIX_HALLMARKS.map((h) => {
                    const on = acting.has(h.id);
                    return (
                      <td key={h.id} className="px-1 py-2.5 text-center">
                        {on ? (
                          <span
                            className="mx-auto block h-3.5 w-3.5 rounded-[4px]"
                            style={{ background: color, boxShadow: `0 0 8px ${color}55` } as CSSProperties}
                          >
                            <span className="sr-only">acts on {h.title}</span>
                          </span>
                        ) : (
                          <span className="mx-auto block h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
