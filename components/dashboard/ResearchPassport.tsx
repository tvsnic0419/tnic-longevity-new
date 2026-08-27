'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, BookmarkCheck, BookMarked, Compass, Map } from 'lucide-react';
import type { RecentModuleEntry } from '@/lib/recent-modules';
import { getResearchQueueSnapshot, subscribeToResearchQueue, type ResearchQueueEntry } from '@/lib/research-queue';

const categoryLabel: Record<RecentModuleEntry['category'], string> = {
  compounds: 'Compound',
  synergies: 'Synergy',
  lifestyle: 'Lifestyle',
  guides: 'Guide',
};

function subscribeToResearchTrail(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('focus', callback);
  window.addEventListener('tnic:research-passport-updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('focus', callback);
    window.removeEventListener('tnic:research-passport-updated', callback);
  };
}

function getResearchTrailSnapshot() {
  return localStorage.getItem('tnic:recent-modules') ?? '';
}

function getServerSnapshot() {
  return '';
}

/**
 * An intentionally local-only record of research exploration. It maps the
 * pages a visitor chose to inspect, never their physiology or adherence.
 */
export function ResearchPassport() {
  const recentModulesRaw = useSyncExternalStore(
    subscribeToResearchTrail,
    getResearchTrailSnapshot,
    getServerSnapshot,
  );
  const entries = useMemo<RecentModuleEntry[]>(() => {
    if (!recentModulesRaw) return [];
    try {
      const parsed = JSON.parse(recentModulesRaw) as RecentModuleEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [recentModulesRaw]);
  const queueRaw = useSyncExternalStore(subscribeToResearchQueue, getResearchQueueSnapshot, getServerSnapshot);
  const queue = useMemo<ResearchQueueEntry[]>(() => {
    if (!queueRaw) return [];
    try {
      const parsed = JSON.parse(queueRaw) as ResearchQueueEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [queueRaw]);
  const categories = useMemo(() => new Set(entries.map((entry) => entry.category)).size, [entries]);
  const latest = entries.slice(0, 3);

  return (
    <section className="card-floating card-shine relative overflow-hidden rounded-2xl p-6 md:p-7" aria-labelledby="research-passport-title">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-cyan/10 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent-cyan/25 bg-accent-cyan/[0.06] px-3 py-1.5">
              <Map className="h-3.5 w-3.5 text-accent-cyan" aria-hidden="true" />
              <span className="text-micro font-mono uppercase tracking-[0.12em] text-accent-cyan">Research Passport</span>
            </div>
            <h2 id="research-passport-title" className="text-xl font-bold tracking-tight">Your evidence trail</h2>
            <p className="mt-2 max-w-2xl text-body-sm text-muted-foreground">
              A private record of the modules you chose to inspect. Your trail stays on this device unless you export it.
            </p>
          </div>
          <Link
            href="/library"
            className="focus-ring interactive inline-flex items-center gap-2 rounded-xl border border-accent-cyan/25 bg-accent-cyan/[0.06] px-3.5 py-2.5 text-xs font-semibold text-accent-cyan hover:bg-accent-cyan/[0.12]"
          >
            Explore the atlas
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background/25 p-4">
            <p className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Modules explored</p>
            <p className="mt-1 font-display text-3xl text-foreground">{entries.length}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/25 p-4">
            <p className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Research lenses</p>
            <p className="mt-1 font-display text-3xl text-foreground">{categories}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/25 p-4">
            <p className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Saved for later</p>
            <p className="mt-1 font-display text-3xl text-foreground">{queue.length}</p>
          </div>
        </div>

        {latest.length > 0 ? (
          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-accent-violet" aria-hidden="true" />
              <p className="text-label text-accent-violet">Continue your research</p>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {latest.map((entry) => (
                <Link
                  key={entry.slug}
                  href={entry.href}
                  className="focus-ring group rounded-xl border border-border/70 bg-background/20 p-4 transition-colors hover:border-accent-cyan/35 hover:bg-accent-cyan/[0.04]"
                >
                  <p className="text-micro font-mono uppercase tracking-[0.1em] text-accent-cyan">{categoryLabel[entry.category]}</p>
                  <p className="mt-2 text-sm font-semibold leading-snug text-foreground group-hover:text-accent-cyan">{entry.title}</p>
                  <p className="mt-2 text-caption text-muted-foreground">Open module →</p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-accent-cyan/30 bg-accent-cyan/[0.035] p-5">
            <div className="flex gap-3">
              <Compass className="h-5 w-5 shrink-0 text-accent-cyan" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Start a research trail</p>
                <p className="mt-1 text-body-sm text-muted-foreground">Open a hallmark, compound, or guide in the Library. TNiC will keep the latest pages here so you can continue thoughtfully.</p>
              </div>
            </div>
          </div>
        )}

        {queue.length > 0 && (
          <div className="mt-5 rounded-xl border border-accent-violet/20 bg-accent-violet/[0.04] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-accent-violet" aria-hidden="true" />
                <p className="text-label text-accent-violet">Your saved research</p>
              </div>
              <Link href="/library#research-queue" className="focus-ring text-caption font-semibold text-accent-violet hover:underline">Open queue →</Link>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {queue.slice(0, 3).map((entry) => (
                <Link key={entry.slug} href={entry.href} className="focus-ring rounded-lg border border-accent-violet/15 bg-background/25 p-3 text-sm font-semibold text-foreground transition-colors hover:border-accent-violet/35 hover:text-accent-violet">
                  {entry.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
