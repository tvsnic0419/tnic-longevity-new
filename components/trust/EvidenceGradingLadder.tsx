import { CheckCircle2 } from 'lucide-react';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { evidenceTagDefinitions } from '@/lib/trust';
import { compoundModules } from '@/lib/library-modules';
import type { EvidenceTier } from '@/lib/types';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// EvidenceGradingLadder — the visual centerpiece of /trust/methodology. Turns
// the flat A/B/C legend into an actual grading ladder: strongest tier on top,
// each rung carrying its signal-strength meter, the criteria a compound must
// meet to earn it, and the LIVE count (and share) of the graded library that
// currently sits at that tier. Nothing is asserted — tier meaning comes from
// the canonical `evidenceTagDefinitions`, counts from `compoundModules`, so the
// ladder can never drift from what's published. Server-safe, no client JS.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT: Record<EvidenceTier, string> = {
  A: 'var(--tier-a)',
  B: 'var(--tier-b)',
  C: 'var(--tier-c)',
  D: 'var(--tier-d)',
};

const ORDER: EvidenceTier[] = ['A', 'B', 'C', 'D'];

export function EvidenceGradingLadder({ className = '' }: { className?: string }) {
  const total = compoundModules.length;
  const counts = Object.fromEntries(
    ORDER.map((t) => [t, compoundModules.filter((m) => m.evidenceTier === t).length]),
  ) as Record<EvidenceTier, number>;

  return (
    <section className={cn('space-y-3', className)} aria-label="Evidence grading ladder">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label text-[var(--color-text-faint)]">The grading ladder</p>
        <p className="font-mono text-micro text-[var(--color-text-faint)]">
          {total} graded compounds · re-evaluated quarterly
        </p>
      </div>

      {ORDER.map((tier) => {
        const def = evidenceTagDefinitions[tier];
        const color = ACCENT[tier];
        const count = counts[tier];
        const pct = total ? Math.round((count / total) * 100) : 0;
        return (
          <div
            key={tier}
            className="premium-card items-stretch p-5 sm:p-6"
            style={{ ['--card-accent' as string]: color }}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* Identity + count */}
              <div className="flex shrink-0 items-center gap-4 sm:w-56 sm:flex-col sm:items-start">
                <EvidenceTag tier={tier} size="lg" showTooltip={false} />
                <div>
                  <div
                    className="font-display text-3xl font-semibold leading-none tabular-nums"
                    style={{ color }}
                  >
                    {count}
                    <span className="ml-1.5 font-mono text-sm font-normal text-[var(--color-text-faint)]">
                      / {total}
                    </span>
                  </div>
                  <div className="mt-1.5 text-micro text-[var(--color-text-muted)]">
                    {pct}% of the graded library
                  </div>
                  {/* Share meter */}
                  <div
                    className="mt-2 h-1.5 w-32 max-w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px -1px ${color}` }}
                    />
                  </div>
                </div>
              </div>

              {/* Meaning + criteria */}
              <div className="min-w-0 flex-1">
                <h3 className="heading-card" style={{ color }}>
                  {def.label}
                </h3>
                <p className="mt-1 text-body-sm text-muted-foreground">{def.description}</p>
                <ul className="mt-3 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
                  {def.criteria.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-body-sm">
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        style={{ color }}
                        aria-hidden="true"
                      />
                      <span className="text-[var(--color-text-secondary)]">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
