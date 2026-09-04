import Link from 'next/link';
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
  level: 1 | 2 | 3 | 4;
  color: string;
}

const tierMeta: Record<EvidenceTier, TierMeta> = {
  A: { level: 4, color: 'var(--tier-a)' },
  B: { level: 3, color: 'var(--tier-b)' },
  C: { level: 2, color: 'var(--tier-c)' },
  D: { level: 1, color: 'var(--tier-d)' },
};

interface SizeSpec {
  chip: string;
  /** [bar width, gap] and the four ascending bar heights, all in px. */
  barW: number;
  barGap: number;
  barH: [number, number, number, number];
  label: string;
}

const sizeSpec: Record<'sm' | 'md' | 'lg', SizeSpec> = {
  sm: { chip: 'gap-1.5 text-micro px-1.5 py-0.5', barW: 2.5, barGap: 1.5, barH: [4, 6, 8, 10], label: 'text-micro' },
  md: { chip: 'gap-2 text-xs px-2 py-1', barW: 3, barGap: 2, barH: [5, 7, 10, 13], label: 'text-xs' },
  lg: { chip: 'gap-2 text-sm px-2.5 py-1.5', barW: 3.5, barGap: 2.5, barH: [6, 9, 12, 16], label: 'text-sm' },
};

function TierMeter({ level, color, spec }: { level: number; color: string; spec: SizeSpec }) {
  const max = spec.barH[3];
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
  /**
   * When set, the chip becomes a link to the grading rubric (typically
   * `/trust/methodology`), making evidence-tier transparency one click away from
   * wherever a tier is shown. OMIT when the tag already sits inside an `<a>` —
   * nesting anchors is invalid HTML.
   */
  href?: string;
}

export function EvidenceTag({
  tier,
  size = 'md',
  showTooltip = true,
  className = '',
  href,
}: EvidenceTagProps) {
  const def = evidenceTagDefinitions[tier];
  const meta = tierMeta[tier];
  const spec = sizeSpec[size];

  const shell = cn(
    'inline-flex items-center rounded-md border bg-[var(--color-bg-muted)] font-mono font-bold leading-none',
    spec.chip,
    href && 'focus-ring cursor-pointer transition hover:brightness-110',
    className,
  );

  const inner = (
    <>
      <TierMeter level={meta.level} color={meta.color} spec={spec} />
      <span className="inline-flex items-baseline gap-1" style={{ color: meta.color }}>
        Tier {tier}
        {size !== 'sm' && (
          <span className="hidden font-normal opacity-70 sm:inline">· {def.short}</span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={shell}
        style={{ borderColor: `color-mix(in srgb, ${meta.color} 35%, transparent)`, color: meta.color }}
        title={showTooltip ? `${def.description} — see grading methodology` : undefined}
        aria-label={`Evidence tier ${tier}: ${def.label}. See grading methodology.`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <span
      className={shell}
      style={{ borderColor: `color-mix(in srgb, ${meta.color} 35%, transparent)`, color: meta.color }}
      title={showTooltip ? def.description : undefined}
      aria-label={`Evidence tier ${tier}: ${def.label}`}
    >
      {inner}
    </span>
  );
}

export function EvidenceTagLegend({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)} role="list" aria-label="Evidence tier legend">
      {(['A', 'B', 'C', 'D'] as EvidenceTier[]).map((tier) => (
        <div key={tier} role="listitem" className="flex items-center gap-2">
          <EvidenceTag tier={tier} size="sm" showTooltip={false} />
          <span className="text-caption hidden md:inline">{evidenceTagDefinitions[tier].description}</span>
        </div>
      ))}
    </div>
  );
}

/** Rank mark — a rim, never a fill. Not an evidence tier. */
export function EliteChip({ label = 'Elite', size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) {
  const pad = size === 'lg' ? 'px-2.5 py-1.5 text-sm' : size === 'sm' ? 'px-1.5 py-0.5 text-micro' : 'px-2 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center rounded-md bg-[#0b1220] font-mono font-bold leading-none ${pad}`}
      style={{ border: '2px solid var(--elite-rim)', color: 'var(--elite-rim)' }}
    >
      {label}
    </span>
  );
}

/** Caution mark — hue #E0575F, used for watch-state only. */
export function CautionChip({ label = 'Caution', size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) {
  const pad = size === 'lg' ? 'px-2.5 py-1.5 text-sm' : size === 'sm' ? 'px-1.5 py-0.5 text-micro' : 'px-2 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center rounded-md font-mono font-bold leading-none ${pad}`}
      style={{
        color: 'var(--status-caution)',
        border: '1px solid color-mix(in srgb, var(--status-caution) 40%, transparent)',
        background: 'color-mix(in srgb, var(--status-caution) 10%, transparent)',
      }}
    >
      {label}
    </span>
  );
}
