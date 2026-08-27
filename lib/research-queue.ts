import type { LibraryModule, LibraryModuleCategory } from './library-modules';

const STORAGE_KEY = 'tnic:research-queue';
const UPDATE_EVENT = 'tnic:research-queue-updated';
const MAX_SAVED = 12;

export interface ResearchQueueEntry {
  slug: string;
  title: string;
  href: string;
  category: LibraryModuleCategory;
  savedAt: string;
}

function isResearchQueueEntry(value: unknown): value is ResearchQueueEntry {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ResearchQueueEntry>;
  return typeof item.slug === 'string'
    && typeof item.title === 'string'
    && typeof item.href === 'string'
    && typeof item.category === 'string'
    && typeof item.savedAt === 'string';
}

export function readResearchQueue(): ResearchQueueEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isResearchQueueEntry).slice(0, MAX_SAVED) : [];
  } catch {
    return [];
  }
}

export function getResearchQueueSnapshot() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function saveResearchModule(module: Pick<LibraryModule, 'slug' | 'title' | 'category'>, href: string) {
  if (typeof window === 'undefined') return;
  try {
    const entry: ResearchQueueEntry = {
      slug: module.slug,
      title: module.title,
      category: module.category,
      href,
      savedAt: new Date().toISOString(),
    };
    const next = [entry, ...readResearchQueue().filter((item) => item.slug !== entry.slug)].slice(0, MAX_SAVED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Local saving is a convenience; browsing remains fully usable if storage is unavailable.
  }
}

export function removeResearchModule(slug: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readResearchQueue().filter((item) => item.slug !== slug)));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Ignore unavailable local storage.
  }
}

export function subscribeToResearchQueue(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('storage', callback);
  window.addEventListener('focus', callback);
  window.addEventListener(UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('focus', callback);
    window.removeEventListener(UPDATE_EVENT, callback);
  };
}
