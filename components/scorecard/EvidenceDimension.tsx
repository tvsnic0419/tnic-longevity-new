import type { CSSProperties } from 'react';
import type { TnicDimension } from '@/lib/tnic-score';
import { cn } from '@/lib/utils';

/**
 * One row of the TNiC Score breakdown: a labeled 0–100 bar. A dimension the
 * underlying data cannot support renders an honest "Insufficient evidence"
 * state with a dashed, unfilled track — never a fabricated value. Presentational
 * and server-safe (matches the bioavailability-bar idiom in CompoundGlancePanel).
 */
export function EvidenceDimension({
  dimension,
  accentVar,
  className = '',
}: {
  dimension: TnicDimension;
  /** CSS color for the filled portion, e.g. 'var(--accent-emerald)'. */
  accentVar: string;
  className?: string;
}) {
  const { label, value, note } = dimension;
  const hasValue = value != null;

  return (
    <div className={cn('group', className)} title={note}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-body-sm font-medium text-foreground">{label}</span>
        {hasValue ? (
          <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{value}</span>
        ) : (
          <span className="text-micro font-medium uppercase tracking-wide text-muted-foreground">
            Insufficient evidence
          </span>
        )}
      </div>
      <div
        className={cn(
          'h-1.5 overflow-hidden rounded-full',
          hasValue ? 'bg-muted/40' : 'border border-dashed border-border/70 bg-transparent',
        )}
        role="img"
        aria-label={hasValue ? `${label}: ${value} out of 100` : `${label}: insufficient evidence`}
      >
        {hasValue && (
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={
              {
                width: `${value}%`,
                background: `linear-gradient(90deg, color-mix(in srgb, ${accentVar} 55%, transparent), ${accentVar})`,
              } as CSSProperties
            }
          />
        )}
      </div>
    </div>
  );
}
