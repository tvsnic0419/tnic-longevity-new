'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { EvidenceTier } from '@/lib/types';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { AddToProtocol } from '@/components/ui/AddToProtocol';

export interface LeaderboardPick {
  id: string;
  name: string;
  evidence: EvidenceTier;
  /** Mechanism label (compound.pathway) — the one-line "why it's here". */
  pathway: string;
  dose: string;
  timing: string;
  pmidCount: number;
}

/**
 * BestLeaderboard — the "best supplements for <goal>" ranking as a premium
 * instrument, replacing a flat row list. Each entry is a numbered card; #1
 * wears the gold "elite/rank" accent and the rest carry the page's emerald, so
 * the ranking reads at a glance. The compound name is a stretched link over the
 * whole card (one big tap target to the deep-dive), with the AddToProtocol
 * action lifted above it — so a reader can bank the pick without leaving the
 * page. Ranking + copy are unchanged; this is the visual + conversion layer.
 */
export function BestLeaderboard({ picks }: { picks: LeaderboardPick[] }) {
  return (
    <ol className="mb-12 space-y-3">
      {picks.map((p, i) => {
        const rank = i + 1;
        const accent = rank === 1 ? 'var(--elite-rim)' : 'var(--tier-a)';
        return (
          <li
            key={p.id}
            className="premium-card group relative p-4 sm:p-5"
            style={{ ['--card-accent' as string]: accent } as CSSProperties}
          >
            <div className="flex items-center gap-3.5 sm:gap-4">
              {/* Rank medallion — gold for the top pick, emerald below. */}
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-mono text-lg font-black tabular-nums"
                style={{
                  color: accent,
                  background: rank === 1 ? '#0b1220' : `color-mix(in srgb, ${accent} 12%, transparent)`,
                  border: rank === 1 ? '2px solid var(--elite-rim)' : `1px solid color-mix(in srgb, ${accent} 32%, transparent)`,
                }}
                aria-hidden="true"
              >
                {rank}
              </span>

              {/* Content — the name is a stretched link over the whole card. */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/library/compounds/${p.id}`}
                    className="focus-ring rounded text-base font-bold text-foreground transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-accent-emerald"
                  >
                    {p.name}
                  </Link>
                  <EvidenceTag tier={p.evidence} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">{p.pathway}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-micro font-mono text-muted-foreground">
                  <span>{p.dose}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.timing}</span>
                  {p.pmidCount > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {p.pmidCount} PMID{p.pmidCount === 1 ? '' : 's'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action zone — lifted above the stretched link (z-10). */}
              <div className="relative z-10 flex shrink-0 items-center gap-2">
                <AddToProtocol compoundId={p.id} name={p.name} size="sm" className="hidden sm:inline-flex" />
                <ArrowRight
                  className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent-emerald"
                  aria-hidden="true"
                />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
