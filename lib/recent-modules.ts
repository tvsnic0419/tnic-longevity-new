import type { LibraryModule } from './library-modules';
import { getModulePath } from './library-modules';

export interface RecentModuleEntry {
  slug: string;
  title: string;
  href: string;
  category: LibraryModule['category'];
  visitedAt: string;
}

const STORAGE_KEY = 'tnic:recent-modules';
const MAX_RECENT = 8;

export function recordModuleVisit(module: LibraryModule): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = readRecentModules();
    const entry: RecentModuleEntry = {
      slug: module.slug,
      title: module.title,
      href: getModulePath(module),
      category: module.category,
      visitedAt: new Date().toISOString(),
    };
    const deduped = [entry, ...existing.filter((e) => e.slug !== module.slug)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
  } catch {
    /* ignore quota */
  }
}

export function readRecentModules(): RecentModuleEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentModuleEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}