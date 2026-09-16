'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { SelectableChip } from '@/components/ui/SelectableChip';
import { compoundModules } from '@/lib/library-modules';
import type { EvidenceTier } from '@/lib/types';

const TIER_ORDER: EvidenceTier[] = ['A', 'B', 'C'];

const TIER_LABEL: Record<EvidenceTier, string> = {
  A: 'Human RCT evidence',
  B: 'Emerging human data',
  C: 'Preclinical / early',
};

const TIER_COUNTS: Record<EvidenceTier, number> = compoundModules.reduce(
  (acc, m) => {
    acc[m.evidenceTier] = (acc[m.evidenceTier] ?? 0) + 1;
    return acc;
  },
  { A: 0, B: 0, C: 0 } as Record<EvidenceTier, number>,
);

export function CompoundExplorerFilters({
  activeTiers,
  hasHallmarkFilter,
}: {
  activeTiers: EvidenceTier[];
  hasHallmarkFilter: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <div className="chip-row items-center">
      {TIER_ORDER.map((tier) => {
        const isActive = activeTiers.includes(tier);
        return (
          <SelectableChip
            key={tier}
            selected={isActive}
            onSelect={() => toggleTier(tier)}
            label={`${TIER_COUNTS[tier]} compounds · ${TIER_LABEL[tier]}`}
            className="px-3 py-1.5"
          >
            <span className="tnic-tabular font-mono text-base font-bold tabular-nums text-foreground">
              {TIER_COUNTS[tier]}
            </span>
            <EvidenceTag tier={tier} size="sm" showTooltip={false} />
          </SelectableChip>
        );
      })}
      {(activeTiers.length > 0 || hasHallmarkFilter) && (
        <Link
          href="/library"
          scroll={false}
          className="focus-ring ml-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-accent-rose"
        >
          Clear
        </Link>
      )}
    </div>
  );
}
