import type { EvidenceTier } from '@/lib/types';
import { evidenceTagDefinitions } from '@/lib/trust';
import { cn } from '@/lib/utils';

/**
 * Evidence tier as a signal-strength meter — the site's signature credibility
 * mark. Every tier renders three ascending bars filled to its level (A=3 / B=2
 * / C=1), so relative strength is legible at a glance before the label is even
 * read. Same public API as before (tier / size / showTooltip / className) so it
 * stays a drop-in across the ~20 surfaces that render it.
 */

interface TierMeta {
  level: 1 | 2 | 3;
  /** CSS custom property for the tier accent (matches globals.css tokens). */
  color: string;
  /** Tailwind classes for the chip's tinted-glass shell. */
  shell: string;
}

const tierMeta: Record<EvidenceTier, TierMeta> = {
  A: { level: 3, color: 'var(--accent-emerald)', shell: 'text-accent-emerald border-accent-emerald/25' },
  B: { level: 2, color: 'var(--accent-cyan)', shell: 'text-accent-cyan border-accent-cyan/25' },
  C: { level: 1, color: 'var(--accent-amber)', shell: 'text-accent-amber border-accent-amber/25' },
};

interface SizeSpec {
  chip: string;
  /** [bar width, gap] and the three ascending bar heights, all in px. */
  barW: number;
  barGap: number;
  barH: [number, number, number];
  label: string;
}

const sizeSpec: Record<'sm' | 'md' | 'lg', SizeSpec> = {
  sm: { chip: 'gap-1.5 text-[10px] px-1.5 py-0.5', barW: 2.5, barGap: 1.5, barH: [5, 7, 9], label: 'text-[10px]' },
  md: { chip: 'gap-2 text-xs px-2 py-1', barW: 3, barGap: 2, barH: [6, 9, 12], label: 'text-xs' },
  lg: { chip: 'gap-2 text-sm px-2.5 py-1.5', barW: 3.5, barGap: 2.5, barH: [7, 11, 15], label: 'text-sm' },
};

function TierMeter({ level, color, spec }: { level: number; color: string; spec: SizeSpec }) {
  const max = spec.barH[2];
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-end shrink-0"
      style={{ gap: spec.barGap, height: max }}
    >
      {spec.barH.map((h, i) => {
        const on = i < level;
        return (
          <span
            key={i}
            style={{
              width: spec.barW,
              height: h,
              borderRadius: 1,
              background: on ? color : 'currentColor',
              opacity: on ? 1 : 0.18,
            }}
          />
        );
      })}
    </span>
  );
}

interface EvidenceTagProps {
  tier: EvidenceTier;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function EvidenceTag({ tier, size = 'md', showTooltip = true, className = '' }: EvidenceTagProps) {
  const def = evidenceTagDefinitions[tier];
  const meta = tierMeta[tier];
  const spec = sizeSpec[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border bg-[var(--color-bg-muted)] font-mono font-bold leading-none',
        meta.shell,
        spec.chip,
        className,
      )}
      title={showTooltip ? def.description : undefined}
      aria-label={`Evidence tier ${tier}: ${def.label}`}
    >
      <TierMeter level={meta.level} color={meta.color} spec={spec} />
      <span className="inline-flex items-baseline gap-1">
        Tier {tier}
        {size !== 'sm' && (
          <span className="hidden font-normal opacity-70 sm:inline">· {def.short}</span>
        )}
      </span>
    </span>
  );
}

export function EvidenceTagLegend({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)} role="list" aria-label="Evidence tier legend">
      {(['A', 'B', 'C'] as EvidenceTier[]).map((tier) => (
        <div key={tier} role="listitem" className="flex items-center gap-2">
          <EvidenceTag tier={tier} size="sm" showTooltip={false} />
          <span className="text-caption hidden md:inline">{evidenceTagDefinitions[tier].description}</span>
        </div>
      ))}
    </div>
  );
}
