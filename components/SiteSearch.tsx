'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Search } from 'lucide-react';
import { COMMAND_PALETTE_EVENT } from '@/components/os/os-events';

// Platform modifier glyph for the keycap — static per device, so subscribe is a
// no-op. useSyncExternalStore keeps it SSR-safe (server renders ⌘) with no
// hydration warning and no setState-inside-effect.
const noopSubscribe = () => () => {};
function getModifier() {
  if (typeof navigator === 'undefined') return '⌘';
  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl';
}

/**
 * Desktop nav search affordance — a command-palette trigger, not an inline
 * input. Clicking it (or pressing ⌘K / Ctrl-K anywhere) opens the site command
 * palette, which owns the actual search UX. Reuses COMMAND_PALETTE_EVENT so the
 * palette wiring is shared with the mobile search button in Nav.tsx.
 */
export function SiteSearch() {
  // Show the platform-correct modifier glyph once mounted (SSR-safe default: ⌘).
  const mod = useSyncExternalStore(noopSubscribe, getModifier, () => '⌘');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))}
      aria-label="Search — open command palette"
      aria-keyshortcuts="Meta+K Control+K"
      className="focus-ring interactive group hidden md:inline-flex items-center gap-2 rounded-full border border-border/80 bg-[var(--color-bg-muted)] py-1.5 pl-3 pr-1.5 text-sm text-muted-foreground transition-colors hover:border-accent-cyan/40 hover:text-foreground"
    >
      <Search className="w-4 h-4 shrink-0 transition-colors group-hover:text-accent-cyan" aria-hidden="true" />
      <span className="hidden xl:inline">Search</span>
      <span aria-hidden="true" className="ml-1 hidden items-center gap-1 sm:inline-flex">
        <kbd className="inline-flex min-w-[1.25rem] items-center justify-center rounded-md border border-border/70 bg-[var(--color-bg-base)] px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-muted-foreground/80 transition-colors group-hover:border-accent-cyan/40">
          {mod}
        </kbd>
        <kbd className="inline-flex min-w-[1.25rem] items-center justify-center rounded-md border border-border/70 bg-[var(--color-bg-base)] px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-muted-foreground/80 transition-colors group-hover:border-accent-cyan/40">
          K
        </kbd>
      </span>
    </button>
  );
}
