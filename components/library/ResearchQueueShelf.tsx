'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, BookmarkCheck, BookmarkPlus, X } from 'lucide-react';
import type { ResearchQueueEntry } from '@/lib/research-queue';
import { getResearchQueueSnapshot, removeResearchModule, subscribeToResearchQueue } from '@/lib/research-queue';

const categoryLabel: Record<ResearchQueueEntry['category'], string> = {
  compounds: 'Compound',
  synergies: 'Synergy',
  lifestyle: 'Lifestyle',
  guides: 'Guide',
};

function getServerSnapshot() {
  return '';
}

function parseQueue(raw: string): ResearchQueueEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ResearchQueueEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** The Library-facing complement to the dashboard Research Passport. */
export function ResearchQueueShelf() {
  const queueRaw = useSyncExternalStore(subscribeToResearchQueue, getResearchQueueSnapshot, getServerSnapshot);
  const queue = useMemo(() => parseQueue(queueRaw), [queueRaw]);

  return (
    <section id="research-queue" className="container-page pb-8" aria-labelledby="research-queue-title">
      <div className="card-floating card-shine relative overflow-hidden rounded-2xl p-5 md:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent-cyan/12 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
                <p className="text-micro font-mono uppercase tracking-[0.14em] text-accent-cyan">Research Queue</p>
              </div>
              <h2 id="research-queue-title" className="mt-2 text-xl font-bold tracking-tight">Keep the modules worth returning to.</h2>
              <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">Save a deep-dive as you browse. Your queue stays only in this browser and is separate from health or protocol data.</p>
            </div>
            {queue.length > 0 && <p className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">{queue.length} saved {queue.length === 1 ? 'module' : 'modules'}</p>}
          </div>

          {queue.length > 0 ? (
            <div className="mt-5 grid gap-2 md:grid-cols-3">
              {queue.slice(0, 3).map((entry) => (
                <div key={entry.slug} className="group relative rounded-xl border border-border/70 bg-background/25 p-4 transition-colors hover:border-accent-cyan/35 hover:bg-accent-cyan/[0.04]">
                  <Link href={entry.href} className="focus-ring block pr-7">
                    <p className="text-micro font-mono uppercase tracking-[0.1em] text-accent-cyan">{categoryLabel[entry.category]}</p>
                    <p className="mt-2 text-sm font-semibold leading-snug text-foreground group-hover:text-accent-cyan">{entry.title}</p>
                    <p className="mt-2 text-caption text-muted-foreground">Resume deep-dive <ArrowRight className="inline h-3 w-3" aria-hidden="true" /></p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeResearchModule(entry.slug)}
                    className="focus-ring absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                    aria-label={`Remove ${entry.title} from research queue`}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
              {queue.length > 3 && (
                <Link href="/dashboard" className="focus-ring flex min-h-28 items-center justify-center rounded-xl border border-dashed border-accent-cyan/30 bg-accent-cyan/[0.035] p-4 text-center text-sm font-semibold text-accent-cyan hover:bg-accent-cyan/[0.08]">
                  View all {queue.length} saved modules in your dashboard <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-5 grid gap-2 md:grid-cols-3">
              <Link href="/library/compare" className="focus-ring group rounded-xl border border-border/70 bg-background/20 p-4 hover:border-accent-violet/35 hover:bg-accent-violet/[0.04]">
                <p className="text-micro font-mono uppercase tracking-[0.1em] text-accent-violet">Compare</p>
                <p className="mt-2 text-sm font-semibold">Start with a decision</p>
                <p className="mt-1 text-caption text-muted-foreground">Inspect two evidence paths side by side.</p>
              </Link>
              <Link href="/elite-8" className="focus-ring group rounded-xl border border-border/70 bg-background/20 p-4 hover:border-accent-amber/35 hover:bg-accent-amber/[0.04]">
                <p className="text-micro font-mono uppercase tracking-[0.1em] text-accent-amber">Prioritize</p>
                <p className="mt-2 text-sm font-semibold">Review the Elite Eight</p>
                <p className="mt-1 text-caption text-muted-foreground">See the highest-ranked interventions first.</p>
              </Link>
              <Link href="/hallmarks" className="focus-ring group rounded-xl border border-border/70 bg-background/20 p-4 hover:border-accent-cyan/35 hover:bg-accent-cyan/[0.04]">
                <p className="text-micro font-mono uppercase tracking-[0.1em] text-accent-cyan">Map</p>
                <p className="mt-2 text-sm font-semibold">Follow a hallmark</p>
                <p className="mt-1 text-caption text-muted-foreground">Start with the biology before the product.</p>
              </Link>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-caption text-muted-foreground"><BookmarkPlus className="h-3.5 w-3.5 text-accent-cyan" aria-hidden="true" /> Save any deep-dive from its Evidence Trace to add it here.</div>
        </div>
      </div>
    </section>
  );
}
