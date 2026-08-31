'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, Lightbulb, Trash2 } from 'lucide-react';
import { getResearchQueueSnapshot, subscribeToResearchQueue, type ResearchQueueEntry } from '@/lib/research-queue';
import { clearResearchIntent, getResearchIntentSnapshot, subscribeToResearchIntent, writeResearchIntent } from '@/lib/research-intent';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

const MAX_INTENT_LENGTH = 140;

function getServerSnapshot() {
  return '';
}

function parseResearchQueue(raw: string): ResearchQueueEntry[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed as ResearchQueueEntry[] : [];
  } catch {
    return [];
  }
}

/**
 * A visitor-authored research question, deliberately isolated from health,
 * stack, and lab state. It gives saved reading a purpose without creating an
 * opaque recommendation model or collecting personal data.
 */
export function ResearchIntentPanel() {
  const savedIntent = useSyncExternalStore(
    subscribeToResearchIntent,
    getResearchIntentSnapshot,
    getServerSnapshot,
  );
  const queueRaw = useSyncExternalStore(
    subscribeToResearchQueue,
    getResearchQueueSnapshot,
    getServerSnapshot,
  );
  const queue = parseResearchQueue(queueRaw);
  const [draft, setDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const value = isEditing ? draft : savedIntent;
  const hasIntent = Boolean(savedIntent.trim());

  const saveIntent = () => {
    const next = value.trim().slice(0, MAX_INTENT_LENGTH);
    const saved = next ? writeResearchIntent(next) : (clearResearchIntent(), true);
    if (!saved) return;
    setDraft('');
    setIsEditing(false);
    trackEvent(ANALYTICS_EVENTS.researchIntentSet, {
      action: next ? (hasIntent ? 'updated' : 'set') : 'cleared',
      has_saved_research: queue.length > 0,
    });
  };

  const clearIntent = () => {
    clearResearchIntent();
    setDraft('');
    setIsEditing(false);
    trackEvent(ANALYTICS_EVENTS.researchIntentSet, { action: 'cleared', has_saved_research: queue.length > 0 });
  };

  return (
    <section className="card-floating card-shine relative overflow-hidden rounded-2xl p-6 md:p-7" aria-labelledby="research-intent-title">
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-accent-amber/10 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-amber/25 bg-accent-amber/[0.06] px-3 py-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-accent-amber" aria-hidden="true" />
              <span className="text-micro font-mono uppercase tracking-[0.12em] text-accent-amber">Research intent</span>
            </div>
            <h2 id="research-intent-title" className="mt-3 text-xl font-bold tracking-tight">Keep the question in view.</h2>
            <p className="mt-2 text-body-sm text-muted-foreground">
              Save the question you are researching, not a health claim. It stays only in this browser and gives your reading queue a deliberate next step.
            </p>
          </div>
          {hasIntent && (
            <button
              type="button"
              onClick={clearIntent}
              className="focus-ring interactive inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-caption font-semibold text-muted-foreground hover:bg-background/45 hover:text-foreground"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        <label htmlFor="research-intent" className="sr-only">Your research question</label>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            id="research-intent"
            type="text"
            value={value}
            maxLength={MAX_INTENT_LENGTH}
            onChange={(event) => {
              setDraft(event.target.value);
              setIsEditing(true);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                saveIntent();
              }
            }}
            placeholder="For example: Which evidence path should I inspect for mitochondrial support?"
            className="input-base min-w-0 flex-1"
          />
          <button
            type="button"
            onClick={saveIntent}
            className="focus-ring inline-flex min-h-[var(--space-touch)] items-center justify-center gap-2 rounded-xl bg-accent-amber px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-accent-amber/90"
          >
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
            {hasIntent ? 'Update question' : 'Save question'}
          </button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Research continuation options">
          <Link href="/library" className="focus-ring interactive rounded-xl border border-border/65 bg-background/25 p-3 text-sm font-semibold text-foreground transition-colors hover:border-accent-cyan/35 hover:bg-accent-cyan/[0.04]">
            <span className="text-micro font-mono uppercase tracking-[0.1em] text-accent-cyan">Explore</span>
            <span className="mt-1.5 flex items-center justify-between gap-2">Follow a hallmark <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
          </Link>
          <Link href="/library/systems" className="focus-ring interactive rounded-xl border border-border/65 bg-background/25 p-3 text-sm font-semibold text-foreground transition-colors hover:border-accent-violet/35 hover:bg-accent-violet/[0.04]">
            <span className="text-micro font-mono uppercase tracking-[0.1em] text-accent-violet">Connect</span>
            <span className="mt-1.5 flex items-center justify-between gap-2">Map the biology <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
          </Link>
          <Link href="/library#research-queue" className="focus-ring interactive rounded-xl border border-border/65 bg-background/25 p-3 text-sm font-semibold text-foreground transition-colors hover:border-accent-emerald/35 hover:bg-accent-emerald/[0.04]">
            <span className="text-micro font-mono uppercase tracking-[0.1em] text-accent-emerald">Review</span>
            <span className="mt-1.5 flex items-center justify-between gap-2">{queue.length > 0 ? `${queue.length} saved item${queue.length === 1 ? '' : 's'}` : 'Build a research queue'} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
