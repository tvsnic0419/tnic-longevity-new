import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CompareMetric {
  label: string;
  before: string;
  after: string;
  improved?: boolean;
}

interface InterventionCompareProps {
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
  metrics: CompareMetric[];
  summary?: string;
  className?: string;
}

/** Before/after intervention panel — scientific, hopeful framing */
export function InterventionCompare({
  title = 'Expected trajectory',
  beforeLabel = 'Baseline',
  afterLabel = 'With protocol',
  metrics,
  summary,
  className = '',
}: InterventionCompareProps) {
  return (
    <figure className={cn('rounded-xl border border-border overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        <span className="text-label text-accent-emerald">{title}</span>
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-0">
        <div className="p-4 md:p-5 bg-card/40">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-accent-rose" aria-hidden="true" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {beforeLabel}
            </span>
          </div>
          <ul className="space-y-3">
            {metrics.map((m) => (
              <li key={m.label}>
                <p className="text-caption mb-0.5">{m.label}</p>
                <p className="text-sm font-medium text-foreground/80">{m.before}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:flex items-center justify-center px-3 bg-background border-x border-border">
          <ArrowRight className="w-5 h-5 text-accent-cyan" aria-hidden="true" />
        </div>

        <div className="p-4 md:p-5 bg-accent-emerald/5 border-t md:border-t-0 border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-emerald">
              {afterLabel}
            </span>
          </div>
          <ul className="space-y-3">
            {metrics.map((m) => (
              <li key={m.label}>
                <p className="text-caption mb-0.5">{m.label}</p>
                <p
                  className={cn(
                    'text-sm font-medium',
                    m.improved !== false ? 'text-accent-emerald' : 'text-foreground/80',
                  )}
                >
                  {m.after}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {summary && (
        <figcaption className="px-4 py-3 text-body-sm border-t border-border bg-muted/20">
          {summary}
        </figcaption>
      )}
    </figure>
  );
}