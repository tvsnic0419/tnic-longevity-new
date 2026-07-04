'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface LibraryFacetFiltersProps {
  className?: string;
}

// 12 Hallmarks (simplified for chips)
const HALLMARKS = [
  { num: 1, label: 'Genomic Instability' },
  { num: 2, label: 'Telomere Attrition' },
  { num: 3, label: 'Epigenetic Alterations' },
  { num: 4, label: 'Loss of Proteostasis' },
  { num: 5, label: 'Deregulated Nutrient Sensing' },
  { num: 6, label: 'Mitochondrial Dysfunction' },
  { num: 7, label: 'Cellular Senescence' },
  { num: 8, label: 'Stem Cell Exhaustion' },
  { num: 9, label: 'Altered Intercellular Communication' },
  { num: 10, label: 'Chronic Inflammation' },
  { num: 11, label: 'Dysbiosis' },
  { num: 12, label: 'Disabled Macroautophagy' },
];

const TIERS = ['A', 'B', 'C'] as const;

type Tier = typeof TIERS[number];

export const LibraryFacetFilters: React.FC<LibraryFacetFiltersProps> = ({ className = '' }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeHallmarks = (searchParams.get('hallmarks') || '').split(',').filter(Boolean).map(Number);
  const activeTiers = (searchParams.get('tiers') || '').split(',').filter(Boolean) as Tier[];

  const updateParams = (newHallmarks: number[], newTiers: Tier[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newHallmarks.length > 0) {
      params.set('hallmarks', newHallmarks.join(','));
    } else {
      params.delete('hallmarks');
    }

    if (newTiers.length > 0) {
      params.set('tiers', newTiers.join(','));
    } else {
      params.delete('tiers');
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const toggleHallmark = (num: number) => {
    const newSet = activeHallmarks.includes(num)
      ? activeHallmarks.filter(n => n !== num)
      : [...activeHallmarks, num].sort((a, b) => a - b);
    updateParams(newSet, activeTiers);
  };

  const toggleTier = (tier: Tier) => {
    const newSet = activeTiers.includes(tier)
      ? activeTiers.filter(t => t !== tier)
      : [...activeTiers, tier];
    updateParams(activeHallmarks, newSet);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('hallmarks');
    params.delete('tiers');
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters = activeHallmarks.length > 0 || activeTiers.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hallmark Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-label text-[var(--color-text-muted)]">Filter by Hallmark</div>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[var(--color-text-faint)] hover:text-[var(--accent-rose)] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {HALLMARKS.map(h => {
            const isActive = activeHallmarks.includes(h.num);
            return (
              <button
                key={h.num}
                onClick={() => toggleHallmark(h.num)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all focus-ring touch-target ${isActive 
                  ? 'bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)] text-[var(--accent-cyan)]' 
                  : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-focus)] text-[var(--color-text-secondary)]'}`}
              >
                #{h.num} {h.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Evidence Tier Chips */}
      <div>
        <div className="text-label text-[var(--color-text-muted)] mb-2">Evidence Tier</div>
        <div className="flex gap-2">
          {TIERS.map(tier => {
            const isActive = activeTiers.includes(tier);
            const tierColor = tier === 'A' ? 'emerald' : tier === 'B' ? 'amber' : 'rose';
            return (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                className={`px-4 py-1.5 text-xs rounded-full border transition-all focus-ring touch-target ${isActive 
                  ? `bg-[var(--accent-${tierColor})]/10 border-[var(--accent-${tierColor})] text-[var(--accent-${tierColor})]` 
                  : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-focus)] text-[var(--color-text-secondary)]'}`}
              >
                Tier {tier}
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="text-[10px] text-[var(--color-text-faint)]">
          Active filters applied to search results. Combine with text search for precise discovery.
        </div>
      )}
    </div>
  );
};
