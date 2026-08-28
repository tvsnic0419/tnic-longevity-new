'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, ArrowRight, BookmarkCheck, BookmarkPlus, X } from 'lucide-react';
import type { ResearchQueueEntry } from '@/lib/research-queue';
import { getResearchQueueSnapshot, removeResearchModule, subscribeToResearchQueue } from '@/lib/research-queue';
import { evidenceComparisons } from '@/lib/comparisons';

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
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const selectedEntries = queue.filter((entry) => compareSlugs.includes(entry.slug)).slice(0, 2);
  const matchedComparison = useMemo(() => {
    if (selectedEntries.length !== 2) return null;
    const selectedHrefs = new Set(selectedEntries.map((entry) => entry.href.split('#')[0]));
    return evidenceComparisons.find((comparison) =>
      comparison.relatedHrefs.filter((related) => selectedHrefs.has(related.href.split('#')[0])).length >= 2,
    ) ?? null;
  }, [selectedEntries]);

  const toggleCompare = (slug: string) => {
    setCompareSlugs((current) => {
      const active = current.filter((item) => queue.some((entry) => entry.slug === item));
      if (active.includes(slug)) return active.filter((item) => item !== slug);
      return active.length >= 2 ? active : [...active, slug];
    });
  };

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
                    onClick={() => toggleCompare(entry.slug)}
                    aria-pressed={compareSlugs.includes(entry.slug)}
                    className={compareSlugs.includes(entry.slug)
                      ? 'focus-ring mt-3 inline-flex items-center gap-1.5 rounded-lg border border-accent-violet/40 bg-accent-violet/10 px-2 py-1 text-micro font-semibold text-accent-violet'
                      : 'focus-ring mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/30 px-2 py-1 text-micro font-semibold text-muted-foreground hover:border-accent-violet/35 hover:text-accent-violet'}
                  >
                    <ArrowLeftRight className="h-3 w-3" aria-hidden="true" />
                    {compareSlugs.includes(entry.slug) ? 'Selected' : 'Compare'}
                  </button>
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
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-border/70 bg-background/15 px-4 py-3 text-caption text-muted-foreground">
              <BookmarkPlus className="h-3.5 w-3.5 shrink-0 text-accent-cyan" aria-hidden="true" />
              <p>Save any deep-dive from its Evidence Trace and your private research queue will appear here.</p>
            </div>
          )}
          {queue.length > 0 && (
            <div className="mt-4 rounded-xl border border-accent-violet/20 bg-accent-violet/[0.035] p-3" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="h-3.5 w-3.5 text-accent-violet" aria-hidden="true" />
                  <p className="text-caption text-muted-foreground">
                    <span className="font-semibold text-foreground">Research decision tray</span> · choose up to two saved modules to look for an authored comparison.
                  </p>
                </div>
                <span className="text-micro font-mono uppercase tracking-[0.1em] text-accent-violet">{selectedEntries.length}/2 selected</span>
              </div>
              {selectedEntries.length === 1 && <p className="mt-2 text-caption text-muted-foreground">Choose one more saved module to inspect an available evidence comparison.</p>}
              {selectedEntries.length === 2 && (
                matchedComparison ? (
                  <Link href={`/library/compare/${matchedComparison.slug}`} className="focus-ring mt-3 flex items-center justify-between gap-3 rounded-lg border border-accent-violet/30 bg-background/20 px-3 py-2.5 text-sm font-semibold text-foreground hover:border-accent-violet/50 hover:text-accent-violet">
                    <span>Open authored comparison: {matchedComparison.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                ) : (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/20 px-3 py-2.5">
                    <p className="text-caption text-muted-foreground">No authored head-to-head exists for this pair yet. Browse the neutral comparison library instead.</p>
                    <Link href="/library/compare" className="focus-ring shrink-0 text-xs font-semibold text-accent-violet hover:text-foreground">Browse comparisons <ArrowRight className="inline h-3.5 w-3.5" aria-hidden="true" /></Link>
                  </div>
                )
              )}
            </div>
          )}
          {queue.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-caption text-muted-foreground">
              <BookmarkPlus className="h-3.5 w-3.5 text-accent-cyan" aria-hidden="true" />
              Save any deep-dive from its Evidence Trace to add it here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
