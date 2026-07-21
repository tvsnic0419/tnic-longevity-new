'use client';

import { useState, useMemo } from 'react';
import { Filter, ArrowUpRight, Sparkles } from 'lucide-react';
import type { HallmarkIntervention } from '@/lib/types';
import { compounds } from '@/lib/data';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PmidLink } from '@/components/trust/SourceCitation';

const categoryLabels = {
  compound: 'Compound',
  lifestyle: 'Lifestyle',
  clinical: 'Clinical',
  emerging: 'Emerging',
};

/** Slim 10-step meter that reads impact strength at a glance, matching the
 *  evidence-tier meter's visual language. */
function ImpactMeter({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(10, value)) / 10;
  return (
    <span className="inline-flex items-center gap-1.5" title={`Impact ${value} of 10`}>
      <span className="text-label text-[10px] text-[var(--color-text-faint)]">Impact</span>
      <span
        aria-hidden="true"
        className="relative h-1.5 w-16 overflow-hidden rounded-full bg-[var(--color-bg-muted)]"
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct * 100}%`,
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))',
          }}
        />
      </span>
      <span className="font-mono text-[11px] font-semibold tabular-nums text-[var(--color-text-secondary)]">
        {value}
        <span className="text-[var(--color-text-faint)]">/10</span>
      </span>
    </span>
  );
}

export function InterventionExplorer({
  interventions,
  hallmarkTitle,
  compoundHrefs = {},
}: {
  interventions: HallmarkIntervention[];
  hallmarkTitle: string;
  /** compound id -> module slug, for compounds that have a library page. */
  compoundHrefs?: Record<string, string>;
}) {
  const [filter, setFilter] = useState<'all' | HallmarkIntervention['category']>('all');
  const [tnicOnly, setTnicOnly] = useState(false);

  const sorted = useMemo(() => {
    let list = [...interventions].sort((a, b) => a.rank - b.rank);
    if (filter !== 'all') list = list.filter((i) => i.category === filter);
    if (tnicOnly) list = list.filter((i) => i.tnicAvailable);
    return list;
  }, [interventions, filter, tnicOnly]);

  return (
    <div>
      {/* Filter toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-3">
        <Filter className="h-4 w-4 text-[var(--color-text-faint)]" aria-hidden="true" />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter interventions by category">
          {(['all', 'compound', 'lifestyle', 'clinical', 'emerging'] as const).map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(cat)}
                className={`focus-ring interactive rounded-full border px-3 py-1.5 text-xs font-medium ${
                  isActive
                    ? 'border-accent-cyan/40 bg-accent-cyan/12 text-accent-cyan'
                    : 'border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {cat === 'all' ? 'All' : categoryLabels[cat]}
              </button>
            );
          })}
        </div>
        <label className="focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] ml-auto flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border-subtle)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]">
          <input
            type="checkbox"
            checked={tnicOnly}
            onChange={(e) => setTnicOnly(e.target.checked)}
            className="h-3.5 w-3.5 accent-[var(--accent-cyan)]"
          />
          TNiC compounds only
        </label>
      </div>

      {/* Intervention rows */}
      <ol className="space-y-2.5">
        {sorted.map((item) => {
          const compound = item.compoundId ? compounds.find((c) => c.id === item.compoundId) : undefined;
          const compoundHref = item.compoundId ? compoundHrefs[item.compoundId] : undefined;
          return (
            <li
              key={item.id}
              className={`interactive relative overflow-hidden rounded-2xl border bg-[var(--glass-bg)] p-4 pl-5 md:p-5 md:pl-6 ${
                item.tnicAvailable
                  ? 'border-accent-cyan/20'
                  : 'border-[var(--color-border-subtle)]'
              } hover:border-[var(--color-border-strong)]`}
            >
              {/* Accent spine for TNiC-stocked interventions */}
              {item.tnicAvailable && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{
                    background:
                      'linear-gradient(180deg, color-mix(in srgb, var(--accent-cyan) 80%, transparent), color-mix(in srgb, var(--accent-emerald) 55%, transparent))',
                  }}
                />
              )}

              <div className="flex gap-4">
                {/* Rank */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] font-mono text-sm font-bold tabular-nums text-[var(--color-text-secondary)]">
                  {item.rank}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Title row */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] md:text-base">
                      {item.name}
                    </h4>
                    <EvidenceTag tier={item.evidence} size="sm" />
                    <span className="text-label text-[10px] text-[var(--color-text-faint)]">
                      {categoryLabels[item.category]}
                    </span>
                    {item.tnicAvailable && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-cyan/10 px-2 py-0.5 text-[10px] font-semibold text-accent-cyan">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        In TNiC stack
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {item.description}
                  </p>

                  {/* Meta row */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <ImpactMeter value={item.impact} />
                    {compound && compoundHref && (
                      <a
                        href={`/library/compounds/${compoundHref}`}
                        className="focus-ring interactive inline-flex items-center gap-1 rounded text-xs font-medium text-accent-violet hover:text-accent-cyan"
                      >
                        View {compound.name}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                    {item.pmid && <PmidLink pmid={item.pmid} />}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {sorted.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">
          No interventions match filters for {hallmarkTitle}.
        </p>
      )}
    </div>
  );
}
