import { cn } from '@/lib/utils';
import type { RelationType, RelationStrength } from '@/lib/relations';

interface RelationBadgeProps {
  type: RelationType;
  strength: RelationStrength;
  className?: string;
  showStrength?: boolean;
}

const typeConfig: Record<RelationType, { label: string; accent: string; bg: string; border: string }> = {
  amplifies:      { label: 'Amplifies',      accent: 'text-accent-rose',    bg: 'bg-accent-rose/10',    border: 'border-accent-rose/25' },
  suppresses:     { label: 'Suppresses',     accent: 'text-accent-cyan',    bg: 'bg-accent-cyan/10',    border: 'border-accent-cyan/25' },
  bidirectional:  { label: 'Bidirectional',  accent: 'text-accent-violet',  bg: 'bg-accent-violet/10',  border: 'border-accent-violet/25' },
  'pathway-shared': { label: 'Shared Pathway', accent: 'text-accent-amber', bg: 'bg-accent-amber/10',  border: 'border-accent-amber/25' },
};

const strengthDots: Record<RelationStrength, number> = {
  strong: 3,
  moderate: 2,
  weak: 1,
};

export function RelationBadge({ type, strength, className, showStrength = true }: RelationBadgeProps) {
  const cfg = typeConfig[type];
  const dots = strengthDots[strength];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border',
        cfg.accent, cfg.bg, cfg.border,
        className,
      )}
    >
      {cfg.label}
      {showStrength && (
        <span className="flex gap-0.5 items-center" aria-label={`${strength} strength`}>
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                'w-1 h-1 rounded-full',
                i <= dots ? cfg.accent.replace('text-', 'bg-') : 'bg-current opacity-20',
              )}
            />
          ))}
        </span>
      )}
    </span>
  );
}
