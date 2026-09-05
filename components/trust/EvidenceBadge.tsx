'use client';

import { Badge } from '@/components/ui/Badge';
import type { EvidenceLevel, EvidenceTier } from '@/lib/types';
import {
  evidenceBadgeDefinitions,
  evidenceLevelFromTier,
} from '@/lib/trust';
import { cn } from '@/lib/utils';

// AXIS NOTE — read before using this component.
//
// `Emerging` / `Personal` are evidence *type*, and this badge is the right
// component for them. `Strong` / `Moderate` / `Mechanistic` mirror Tier A/B/C
// and are the evidence *grade* — for those, render `<EvidenceTag>` instead.
// EvidenceTag carries the tier letter, its descriptor, and a three-bar
// strength meter, so a grade is never communicated by color alone; this badge
// has no shape channel. The site used to run both vocabularies side by side
// ("Strong Evidence" here, "Tier A · Clinical" there) for the same underlying
// grade. The remaining callers are all on the type axis.
//
// Colors stay aligned with lib/trust.ts's canonical map either way, so a
// Tier-C compound can never show amber on one page and violet on another.
const levelStyles: Record<EvidenceLevel, string> = {
  // The three grade-mirroring levels keep the canonical tier hues (A/B/C).
  Strong: 'bg-accent-emerald/90 text-white border-accent-emerald/40',
  Moderate: 'bg-accent-cyan/90 text-white border-accent-cyan/40',
  Mechanistic: 'bg-accent-amber/90 text-white border-accent-amber/40',
  // Type axis — deliberately off the tier scale.
  Personal: 'bg-accent-violet/90 text-white border-accent-violet/40',
  Emerging: 'bg-muted text-muted-foreground border-border',
};

export interface EvidenceBadgeProps {
  level: EvidenceLevel;
  sources?: string;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
  className?: string;
}

export function EvidenceBadge({
  level,
  sources,
  size = 'md',
  showTooltip = true,
  className,
}: EvidenceBadgeProps) {
  const def = evidenceBadgeDefinitions[level];

  return (
    <Badge
      className={cn(
        'normal-case tracking-normal font-sans font-medium',
        levelStyles[level],
        size === 'sm' ? 'text-micro px-2 py-0.5' : 'text-xs px-2.5 py-1',
        className,
      )}
      title={showTooltip ? def.description : undefined}
      aria-label={`${def.label}${sources ? `: ${sources}` : ''}`}
    >
      {level} Evidence
      {sources && <span className="ml-1 opacity-75 font-normal">({sources})</span>}
    </Badge>
  );
}

/** Convenience wrapper: Tier A/B/C → Strong/Moderate/Mechanistic */
export function EvidenceBadgeFromTier({
  tier,
  sources,
  ...props
}: Omit<EvidenceBadgeProps, 'level'> & { tier: EvidenceTier }) {
  return <EvidenceBadge level={evidenceLevelFromTier(tier)} sources={sources} {...props} />;
}

export function EvidenceBadgeLegend({ className }: { className?: string }) {
  const levels: EvidenceLevel[] = ['Strong', 'Moderate', 'Mechanistic', 'Emerging', 'Personal'];

  return (
    <div
      className={cn('flex flex-wrap gap-3', className)}
      role="list"
      aria-label="Evidence level legend"
    >
      {levels.map((level) => (
        <div key={level} role="listitem" className="flex items-center gap-2">
          <EvidenceBadge level={level} size="sm" showTooltip={false} />
          <span className="text-caption hidden md:inline">
            {evidenceBadgeDefinitions[level].description}
          </span>
        </div>
      ))}
    </div>
  );
}

export default EvidenceBadge;