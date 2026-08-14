import type { TnicDimension } from '@/lib/tnic-score';
import { EvidenceDimension } from './EvidenceDimension';

/**
 * The dimension collection of a TNiC Score — six canonical dimensions rendered
 * consistently on every scorecard. Presentational + server-safe.
 */
export function ScoreBreakdown({
  dimensions,
  accentVar,
  className = '',
}: {
  dimensions: TnicDimension[];
  accentVar: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-label text-muted-foreground">Evidence dimensions</p>
        <span className="text-micro font-mono text-muted-foreground">of 100</span>
      </div>
      <div className="grid gap-3.5">
        {dimensions.map((d) => (
          <EvidenceDimension key={d.key} dimension={d} accentVar={accentVar} />
        ))}
      </div>
    </div>
  );
}
