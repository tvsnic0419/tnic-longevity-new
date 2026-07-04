import type { EvidenceTier } from '@/lib/types';
import { evidenceTagDefinitions } from '@/lib/trust';
import { cn } from '@/lib/utils';

const tierStyles: Record<EvidenceTier, string> = {
  A: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/30',
  B: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30',
  C: 'text-accent-amber bg-accent-amber/10 border-accent-amber/30',
};

interface EvidenceTagProps {
  tier: EvidenceTier;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-2.5 py-1',
};

export function EvidenceTag({ tier, size = 'md', showTooltip = true, className = '' }: EvidenceTagProps) {
  const def = evidenceTagDefinitions[tier];

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-bold rounded border',
        tierStyles[tier],
        sizeStyles[size],
        className,
      )}
      title={showTooltip ? def.description : undefined}
      aria-label={`Evidence tier ${tier}: ${def.label}`}
    >
      Tier {tier}
      {size !== 'sm' && (
        <span className="hidden sm:inline font-normal opacity-70 ml-1">· {def.short}</span>
      )}
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