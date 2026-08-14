import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { CONFIDENCE_META, type TnicScoreConfidence } from '@/lib/tnic-score';
import { cn } from '@/lib/utils';

/**
 * Confidence = data completeness behind a TNiC Score, never a clinical claim.
 * Presentational + server-safe. The three levels map to the three source layers
 * in lib/tnic-score.ts (LQ / engine / canonical).
 */

const meta: Record<
  TnicScoreConfidence,
  { icon: typeof Shield; text: string; ring: string }
> = {
  high: { icon: ShieldCheck, text: 'text-accent-emerald', ring: 'border-accent-emerald/30 bg-accent-emerald/5' },
  moderate: { icon: Shield, text: 'text-accent-cyan', ring: 'border-accent-cyan/30 bg-accent-cyan/5' },
  limited: { icon: ShieldAlert, text: 'text-accent-amber', ring: 'border-accent-amber/30 bg-accent-amber/5' },
};

export function ConfidenceIndicator({
  confidence,
  className = '',
}: {
  confidence: TnicScoreConfidence;
  className?: string;
}) {
  const m = meta[confidence];
  const Icon = m.icon;
  const label = CONFIDENCE_META[confidence].label;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-semibold',
        m.ring,
        m.text,
        className,
      )}
      title={CONFIDENCE_META[confidence].description}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
