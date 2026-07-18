import Link from 'next/link';
import { Layers, ArrowUpRight } from 'lucide-react';
import { eliteStacks, goalLabels } from '@/lib/stacks-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

const topStacks = [...eliteStacks].sort((a, b) => b.synergyRating - a.synergyRating).slice(0, 3);

/**
 * Page-specific replacement for the generic What/Why/Next context rail —
 * the three highest-synergy elite stacks as visual cards, so the value of
 * "pre-built protocols with synergy scoring" is shown, not described.
 */
export function StacksShowcase() {
  return (
    <div className="mt-8" role="group" aria-label="Top elite stacks">
      <p className="text-label mb-4">Highest-synergy elite stacks</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {topStacks.map((stack) => (
          <Link
            key={stack.id}
            href={`/stacks#${stack.slug}`}
            className="focus-ring interactive group flex flex-col gap-4 rounded-2xl glass glass-hover p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-violet/10 border border-accent-violet/25">
                <Layers className="h-4 w-4 text-accent-violet" aria-hidden="true" />
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="font-bold text-sm text-foreground">{stack.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{stack.tagline}</p>
            </div>

            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Synergy score</span>
                <span className="font-mono font-bold text-accent-violet">{stack.synergyRating}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-violet"
                  style={{ width: `${stack.synergyRating}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-caption">
                  {stack.compoundIds.length} compound{stack.compoundIds.length === 1 ? '' : 's'} · {goalLabels[stack.goal]}
                </span>
                <EvidenceTag tier={stack.evidenceTier} size="sm" showTooltip={false} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
