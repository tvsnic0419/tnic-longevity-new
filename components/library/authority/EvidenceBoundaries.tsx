import { ScaleIcon } from 'lucide-react';
import type { SourceCitation as CitationType } from '@/lib/types';
import { SourceCitation } from '@/components/trust/SourceCitation';

/**
 * EvidenceBoundaries — the intellectual-honesty section of a compound page.
 *
 * Pairs the strongest *human* evidence with an explicit "what the evidence does
 * NOT support" list. The juxtaposition — best available human data next to a
 * precise statement of its limits — is what reads as rigor rather than sales
 * copy. Every boundary is sourced from authored data (see lib/authority-profiles.ts).
 */
export function EvidenceBoundaries({
  boundaries,
  citations = [],
}: {
  boundaries: string[];
  citations?: CitationType[];
}) {
  if (boundaries.length === 0) return null;

  return (
    <section
      aria-labelledby="evidence-boundaries-heading"
      className="rounded-xl border border-border bg-card/40 p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <ScaleIcon className="h-4 w-4 text-accent-amber" aria-hidden="true" />
        <p className="text-label">Intellectual honesty</p>
      </div>

      {citations.length > 0 && (
        <div className="mb-6">
          <h3 className="heading-card mb-3">Strongest human evidence</h3>
          <div className="space-y-3">
            {citations.map((c) => (
              <SourceCitation key={c.id} citation={c} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 id="evidence-boundaries-heading" className="heading-card mb-2">
          What the evidence does <span className="text-accent-amber">not</span> support
        </h3>
        <p className="text-body-sm mb-4">
          No compound here has randomized human evidence for hard longevity endpoints — all-cause
          mortality or extended lifespan. Those trials don&rsquo;t exist yet. Here is where this
          intervention&rsquo;s evidence stops:
        </p>
        <ul className="space-y-2.5">
          {boundaries.map((b, i) => (
            <li key={i} className="flex gap-3 text-body-sm">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-amber/70"
                aria-hidden="true"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
