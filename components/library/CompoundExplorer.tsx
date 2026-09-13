import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { compoundModules } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { computeTnicScore } from '@/lib/tnic-score';
import { TIER_COLOR_VAR } from '@/lib/trust';
import { MoleculeThumb } from '@/components/viz/MoleculeThumb';
import { CompoundExplorerFilters } from './CompoundExplorerFilters';
import type { EvidenceTier } from '@/lib/types';

/**
 * The compound grid the library's facet filters drive.
 *
 * Filters write `?tiers=` and `?hallmarks=` to the URL. This surface reads
 * those params on the server so the 100-card grid — including a unique
 * molecule thumbnail per compound — ships in the initial HTML. The tier-count
 * pills stay a client island so toggling a filter does not require a full
 * module reload of the geometry data.
 *
 * Every card links to the compound's evidence module; hallmark chips are
 * sibling links (never nested inside the card link).
 */

const TIER_ORDER: EvidenceTier[] = ['A', 'B', 'C'];

const HALLMARK_BY_NUMBER = new Map(hallmarkLibrary.map((h) => [h.number, h]));
const HALLMARK_BY_ID = new Map(hallmarkLibrary.map((h) => [h.id, h]));

const TIER_ACCENT = TIER_COLOR_VAR;

export function parseExplorerParams(searchParams: {
  tiers?: string;
  hallmarks?: string;
}): {
  activeTiers: EvidenceTier[];
  activeHallmarkIds: string[];
} {
  const activeTiers = (searchParams.tiers || '')
    .split(',')
    .filter(Boolean)
    .filter((t): t is EvidenceTier => TIER_ORDER.includes(t as EvidenceTier));

  const activeHallmarkIds = (searchParams.hallmarks || '')
    .split(',')
    .filter(Boolean)
    .map(Number)
    .map((n) => HALLMARK_BY_NUMBER.get(n)?.id)
    .filter((id): id is string => Boolean(id));

  return { activeTiers, activeHallmarkIds };
}

export function CompoundExplorer({
  activeTiers,
  activeHallmarkIds,
}: {
  activeTiers: EvidenceTier[];
  activeHallmarkIds: string[];
}) {
  const filtered = compoundModules.filter(
    (m) =>
      (activeTiers.length === 0 || activeTiers.includes(m.evidenceTier)) &&
      (activeHallmarkIds.length === 0 ||
        m.relatedHallmarkIds.some((id) => activeHallmarkIds.includes(id))),
  );

  const activeHallmarkTitle =
    activeHallmarkIds.length === 1 ? HALLMARK_BY_ID.get(activeHallmarkIds[0])?.title : undefined;

  return (
    <section id="compound-explorer" aria-labelledby="compound-explorer-heading" className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-1">
        <h2 id="compound-explorer-heading" className="heading-card text-lg">
          Browse compounds by evidence tier
        </h2>
        <div className="heading-accent-rule" aria-hidden="true" />
      </div>

      <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-white/5" />}>
        <CompoundExplorerFilters
          activeTiers={activeTiers}
          hasHallmarkFilter={activeHallmarkIds.length > 0}
        />
      </Suspense>

      <p className="mt-4 text-body-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-mono font-semibold text-foreground">{filtered.length}</span> of{' '}
        {compoundModules.length} graded compounds
        {activeTiers.length > 0 && <> at Tier {activeTiers.slice().sort().join(', ')}</>}
        {activeHallmarkTitle && <> acting on {activeHallmarkTitle}</>}.
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 premium-card p-8 text-center text-body-sm text-muted-foreground">
          No compounds match this filter yet.{' '}
          <Link href="/library" scroll={false} className="focus-ring text-accent-cyan hover:underline">
            Clear the filter
          </Link>{' '}
          to see all {compoundModules.length}.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => {
            const chips = m.relatedHallmarkIds
              .map((id) => HALLMARK_BY_ID.get(id))
              .filter((h): h is NonNullable<typeof h> => Boolean(h))
              .slice(0, 2);
            const extraChips = Math.max(0, m.relatedHallmarkIds.length - chips.length);
            const tnic = m.compoundId ? computeTnicScore(m.compoundId) : null;
            const scoreAccent = TIER_ACCENT[m.evidenceTier];
            const thumbId = m.compoundId ?? m.slug;
            return (
              <li
                key={m.slug}
                className="glass glass-hover group relative flex h-full items-stretch gap-3 rounded-xl border border-border p-3"
              >
                <MoleculeThumb
                  id={thumbId}
                  className="relative z-0 h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-border/50 bg-[color-mix(in_srgb,var(--color-bg-elevated)_80%,transparent)] text-foreground/80"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <EvidenceTag tier={m.evidenceTier} size="sm" />
                      {tnic && tnic.score !== null && (
                        <span
                          className="relative z-10 inline-flex items-baseline gap-0.5 rounded-full border px-1.5 py-0.5 font-mono text-micro font-semibold tabular-nums"
                          style={{
                            color: scoreAccent,
                            borderColor: `color-mix(in srgb, ${scoreAccent} 30%, transparent)`,
                            background: `color-mix(in srgb, ${scoreAccent} 8%, transparent)`,
                          }}
                          title={`TNiC Score ${Math.round(tnic.score)} / 100`}
                        >
                          {Math.round(tnic.score)}
                          <span className="text-micro text-[var(--color-text-muted)]">/100</span>
                          <span className="sr-only"> TNiC Score</span>
                        </span>
                      )}
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-cyan"
                      aria-hidden="true"
                    />
                  </div>
                  <Link
                    href={`/library/compounds/${m.slug}`}
                    className="focus-ring before:absolute before:inset-0 before:rounded-xl"
                  >
                    <h3 className="heading-card text-sm leading-snug group-hover:text-accent-cyan">
                      {m.title}
                    </h3>
                  </Link>
                  <p className="mt-0.5 line-clamp-2 flex-1 text-xs text-muted-foreground">{m.tagline}</p>
                  {chips.length > 0 && (
                    <div className="relative z-10 mt-2 flex flex-wrap gap-x-1 gap-y-1.5">
                      {chips.map((h) => (
                        <Link
                          key={h.id}
                          href={`/hallmarks/${h.slug}`}
                          className="focus-ring inline-flex min-h-6 items-center rounded border border-border/60 bg-card/40 px-2 py-0.5 text-micro font-medium text-muted-foreground transition-colors hover:border-accent-violet/40 hover:text-accent-violet"
                        >
                          {h.title}
                        </Link>
                      ))}
                      {extraChips > 0 && (
                        <span className="inline-flex min-h-6 items-center px-1.5 text-micro text-muted-foreground">
                          +{extraChips}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
