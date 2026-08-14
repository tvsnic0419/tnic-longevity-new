import { Check, Minus } from 'lucide-react';
import type { TnicMatch } from '@/lib/tnic-match';
import { cn } from '@/lib/utils';

/**
 * The TNiC Match presentation for a verified product: a prominent NN/100 score
 * plus the transparent qualification checklist it was built from. Presentational
 * + server-safe. The score is a criteria-fit index, not a quality or lab claim —
 * every row states exactly which criterion was or wasn't met.
 */

function scoreAccent(score: number): { var: string; text: string } {
  if (score >= 85) return { var: 'var(--accent-emerald)', text: 'text-accent-emerald' };
  if (score >= 70) return { var: 'var(--accent-cyan)', text: 'text-accent-cyan' };
  return { var: 'var(--accent-amber)', text: 'text-accent-amber' };
}

export function TnicMatchChecklist({
  match,
  className = '',
}: {
  match: TnicMatch;
  className?: string;
}) {
  const accent = scoreAccent(match.score);
  return (
    <div className={cn('rounded-xl border border-border/60 bg-white/[0.02] p-3.5', className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-label text-muted-foreground">TNiC Match</span>
        <span className={cn('font-mono text-lg font-bold tabular-nums', accent.text)}>
          {match.score}
          <span className="text-xs font-medium text-muted-foreground"> / 100</span>
        </span>
      </div>
      <ul className="grid gap-1.5">
        {match.criteria.map((c) => (
          <li key={c.key} className="flex items-center gap-2 text-micro" title={c.detail}>
            {c.met ? (
              <Check className="h-3.5 w-3.5 shrink-0" style={{ color: accent.var }} aria-hidden="true" />
            ) : (
              <Minus className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" aria-hidden="true" />
            )}
            <span className={c.met ? 'text-muted-foreground' : 'text-muted-foreground/60 line-through'}>
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
