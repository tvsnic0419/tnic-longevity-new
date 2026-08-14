import type { CSSProperties } from 'react';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOTAL_HALLMARKS = 12;

/**
 * Compact "N / 12 hallmarks of aging" coverage readout — twelve segments, the
 * covered ones filled in the card accent. Presentational + server-safe; a
 * lightweight sibling of components/ui/HallmarkCoverageRing for inline use.
 */
export function HallmarkCoverage({
  count,
  accentVar,
  className = '',
}: {
  count: number;
  accentVar: string;
  className?: string;
}) {
  const covered = Math.max(0, Math.min(TOTAL_HALLMARKS, count));
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Target className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div
        className="flex gap-1"
        role="img"
        aria-label={`Targets ${covered} of ${TOTAL_HALLMARKS} hallmarks of aging`}
      >
        {Array.from({ length: TOTAL_HALLMARKS }).map((_, i) => (
          <span
            key={i}
            className="h-3.5 w-1.5 rounded-full"
            style={
              {
                background: i < covered ? accentVar : 'currentColor',
                opacity: i < covered ? 1 : 0.16,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <span className="text-body-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{covered}</span> / {TOTAL_HALLMARKS} hallmarks
      </span>
    </div>
  );
}
