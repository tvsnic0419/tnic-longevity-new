import { cn } from '@/lib/utils';
import type { EvidenceTier } from '@/lib/types';

// The evidence scale IS the visual identity — a fixed, legible mapping used
// wherever a grade appears. Distinct from the interactive accent (cyan).
const TIER: Record<EvidenceTier, { label: string; dot: string; text: string; ring: string }> = {
  A: { label: 'Strong', dot: 'bg-accent-emerald', text: 'text-accent-emerald', ring: 'border-accent-emerald/30' },
  B: { label: 'Moderate', dot: 'bg-accent-cyan', text: 'text-accent-cyan', ring: 'border-accent-cyan/30' },
  C: { label: 'Preclinical', dot: 'bg-accent-violet', text: 'text-accent-violet', ring: 'border-accent-violet/30' },
};

export function EvidenceGrade({
  tier,
  showLabel = true,
  className,
}: {
  tier: EvidenceTier;
  showLabel?: boolean;
  className?: string;
}) {
  const s = TIER[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border bg-background/40 px-2.5 py-1 text-[11px] font-semibold',
        s.ring,
        s.text,
        className,
      )}
      title={`Tier ${tier} — ${s.label} evidence`}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} aria-hidden="true" />
      Tier {tier}{showLabel && <span className="opacity-70 font-medium">· {s.label}</span>}
    </span>
  );
}
