'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { compoundModules } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import type { EvidenceTier } from '@/lib/types';

/**
 * The compound grid the library's facet filters were always meant to drive.
 *
 * `LibraryFacetFilters` writes `?tiers=` and `?hallmarks=` to the URL, but until
 * now nothing on the page consumed them — the chips set state that never
 * rendered a result. This is that missing surface: it reads the same two params
 * so those chips finally filter something, and it adds its own clickable
 * tier-count pills so a reader can click "8 · Tier A" and immediately see those
 * eight compounds. Counts are derived from `compoundModules` (the single source
 * of truth), so they can never drift from what's actually published.
 *
 * Every card links to the compound's evidence module; its hallmark chips are
 * sibling links (never nested inside the card link) into the hallmark pages, so
 * the grid is a two-way junction between compounds and the mechanisms they act
 * on rather than a dead end.
 */

const TIER_ORDER: EvidenceTier[] = ['A', 'B', 'C'];

const TIER_LABEL: Record<EvidenceTier, string> = {
  A: 'Human RCT evidence',
  B: 'Emerging human data',
  C: 'Preclinical / early',
};

// number (1–12, as the facet chips emit) → hallmark id (as compounds store).
const HALLMARK_BY_NUMBER = new Map(hallmarkLibrary.map((h) => [h.number, h]));
const HALLMARK_BY_ID = new Map(hallmarkLibrary.map((h) => [h.id, h]));

const TIER_COUNTS: Record<EvidenceTier, number> = compoundModules.reduce(
  (acc, m) => {
    acc[m.evidenceTier] = (acc[m.evidenceTier] ?? 0) + 1;
    return acc;
  },
  { A: 0, B: 0, C: 0 } as Record<EvidenceTier, number>,
);

export function CompoundExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTiers = useMemo(
    () =>
      (searchParams.get('tiers') || '')
        .split(',')
        .filter(Boolean)
        .filter((t): t is EvidenceTier => TIER_ORDER.includes(t as EvidenceTier)),
    [searchParams],
  );

  const activeHallmarkIds = useMemo(() => {
    const nums = (searchParams.get('hallmarks') || '').split(',').filter(Boolean).map(Number);
    return nums.map((n) => HALLMARK_BY_NUMBER.get(n)?.id).filter((id): id is string => Boolean(id));
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      compoundModules.filter(
        (m) =>
          (activeTiers.length === 0 || activeTiers.includes(m.evidenceTier)) &&
          (activeHallmarkIds.length === 0 ||
            m.relatedHallmarkIds.some((id) => activeHallmarkIds.includes(id))),
      ),
    [activeTiers, activeHallmarkIds],
  );

  const toggleTier = useCallback(
    (tier: EvidenceTier) => {
      const params = new URLSearchParams(searchParams.toString());
      const next = activeTiers.includes(tier)
        ? activeTiers.filter((t) => t !== tier)
        : [...activeTiers, tier];
      if (next.length) params.set('tiers', next.join(','));
      else params.delete('tiers');
      const qs = params.toString();
      router.replace(qs ? `/library?${qs}` : '/library', { scroll: false });
    },
    [activeTiers, router, searchParams],
  );

  const activeHallmarkTitle =
    activeHallmarkIds.length === 1 ? HALLMARK_BY_ID.get(activeHallmarkIds[0])?.title : undefined;

  return (
    <section aria-labelledby="compound-explorer-heading" className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-1">
        <h2 id="compound-explorer-heading" className="heading-card text-lg">
          Browse compounds by evidence tier
        </h2>
        <div className="heading-accent-rule" aria-hidden="true" />
      </div>

      {/* Clickable tier-count pills — the primary affordance. Each shows how many
          compounds sit at that tier and toggles the shared `tiers` URL param, so
          clicking "8 · Tier A" filters the grid below to exactly those eight. */}
      <div className="flex flex-wrap items-center gap-2">
        {TIER_ORDER.map((tier) => {
          const isActive = activeTiers.includes(tier);
          return (
            <button
              key={tier}
              type="button"
              onClick={() => toggleTier(tier)}
              aria-pressed={isActive}
              className={`focus-ring interactive group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                isActive
                  ? 'border-accent-cyan/50 bg-accent-cyan/10 text-foreground'
                  : 'border-border/70 text-muted-foreground hover:border-border hover:text-foreground'
              }`}
              title={`${TIER_COUNTS[tier]} compounds · ${TIER_LABEL[tier]}`}
            >
              <span className="tnic-tabular font-mono text-base font-bold tabular-nums text-foreground">
                {TIER_COUNTS[tier]}
              </span>
              <EvidenceTag tier={tier} size="sm" showTooltip={false} />
            </button>
          );
        })}
        {(activeTiers.length > 0 || activeHallmarkIds.length > 0) && (
          <Link
            href="/library"
            scroll={false}
            className="focus-ring ml-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-accent-rose"
          >
            Clear
          </Link>
        )}
      </div>

      <p className="mt-4 text-body-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-mono font-semibold text-foreground">{filtered.length}</span> of{' '}
        {compoundModules.length} graded compounds
        {activeTiers.length > 0 && (
          <> at Tier {activeTiers.slice().sort().join(', ')}</>
        )}
        {activeHallmarkTitle && <> acting on {activeHallmarkTitle}</>}.
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-body-sm text-muted-foreground">
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
              .slice(0, 3);
            return (
              <li
                key={m.slug}
                className="glass glass-hover group relative flex h-full flex-col rounded-xl border border-border p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <EvidenceTag tier={m.evidenceTier} size="sm" />
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-cyan"
                    aria-hidden="true"
                  />
                </div>
                {/* The card's primary link. Sits under the hallmark chips in the
                    DOM but is stretched over the whole card via ::before, so the
                    chips (rendered after) stay independently clickable. */}
                <Link
                  href={`/library/compounds/${m.slug}`}
                  className="focus-ring before:absolute before:inset-0 before:rounded-xl"
                >
                  <h3 className="heading-card text-sm leading-snug group-hover:text-accent-cyan">
                    {m.title}
                  </h3>
                </Link>
                <p className="mt-1 line-clamp-2 flex-1 text-xs text-muted-foreground">{m.tagline}</p>
                {chips.length > 0 && (
                  <div className="relative z-10 mt-3 flex flex-wrap gap-1">
                    {chips.map((h) => (
                      <Link
                        key={h.id}
                        href={`/hallmarks/${h.slug}`}
                        className="focus-ring rounded border border-border/60 bg-card/40 px-1.5 py-0.5 text-micro font-medium text-muted-foreground transition-colors hover:border-accent-violet/40 hover:text-accent-violet"
                      >
                        {h.title}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
