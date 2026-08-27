'use client';

import { useSyncExternalStore } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import type { LibraryModule } from '@/lib/library-modules';
import {
  getResearchQueueSnapshot,
  removeResearchModule,
  saveResearchModule,
  subscribeToResearchQueue,
} from '@/lib/research-queue';

function getServerSnapshot() {
  return '';
}

/** Saves only a module title, route, category, and timestamp in the visitor's browser. */
export function ResearchQueueButton({ module, href }: { module: Pick<LibraryModule, 'slug' | 'title' | 'category'>; href: string }) {
  const queueRaw = useSyncExternalStore(subscribeToResearchQueue, getResearchQueueSnapshot, getServerSnapshot);
  const saved = (() => {
    if (!queueRaw) return false;
    try {
      const queue = JSON.parse(queueRaw) as { slug?: string }[];
      return Array.isArray(queue) && queue.some((entry) => entry.slug === module.slug);
    } catch {
      return false;
    }
  })();

  const toggle = () => {
    if (saved) removeResearchModule(module.slug);
    else saveResearchModule(module, href);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`focus-ring interactive inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
        saved
          ? 'border-accent-violet/35 bg-accent-violet/[0.10] text-accent-violet hover:bg-accent-violet/[0.16]'
          : 'border-border/70 bg-background/30 text-muted-foreground hover:border-accent-violet/35 hover:text-accent-violet'
      }`}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
      {saved ? 'Saved to research queue' : 'Save for later'}
    </button>
  );
}
