'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Command, ArrowRight, Lightbulb } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { getPaletteResults, paletteKindLabels } from '@/lib/command-palette-context';
import type { PaletteItem } from '@/lib/command-palette-index';
import { readRecentModules } from '@/lib/recent-modules';
import { cn } from '@/lib/utils';
import { EXPORT_KIT_EVENT } from './ExportKitModal';

export const COMMAND_PALETTE_EVENT = 'tnic:command-palette-open';

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { exportAll, selected } = usePlatform();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentModules, setRecentModules] = useState(readRecentModules);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const palette = useMemo(
    () =>
      getPaletteResults({
        pathname,
        query,
        stackIds: selected,
        recentModules,
        limit: 14,
      }),
    [pathname, query, selected, recentModules],
  );

  const { flat: results, groups, hubHint } = palette;
  const hasQuery = query.trim().length > 0;

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const runItem = useCallback(
    (item: PaletteItem) => {
      close();
      if (item.actionId === 'export-kit') {
        window.dispatchEvent(new Event(EXPORT_KIT_EVENT));
        return;
      }
      if (item.actionId === 'export-json') {
        const blob = new Blob([exportAll()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tnic-platform-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
      if (item.href) {
        if (item.href.startsWith('/#')) {
          window.location.href = item.href;
        } else {
          router.push(item.href);
        }
      }
    },
    [close, exportAll, router],
  );

  useEffect(() => {
    const onOpen = () => {
      setRecentModules(readRecentModules());
      setOpen(true);
    };
    window.addEventListener(COMMAND_PALETTE_EVENT, onOpen);
    return () => window.removeEventListener(COMMAND_PALETTE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      setRecentModules(readRecentModules());
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (!open) {
        if (
          e.key === '/' &&
          !(e.target instanceof HTMLInputElement) &&
          !(e.target instanceof HTMLTextAreaElement)
        ) {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        runItem(results[activeIndex]);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, results, activeIndex, runItem]);

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh] md:pt-[15vh]"
      role="presentation"
      onClick={close}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl glass rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-autocomplete="list"
            placeholder="Search or pick a contextual shortcut…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-caption"
          />
          <kbd className="hidden sm:inline text-[10px] font-mono text-caption border border-border px-1.5 py-0.5 rounded">
            esc
          </kbd>
        </div>

        {!hasQuery && hubHint?.next && (
          <div className="px-4 py-2.5 border-b border-border/60 flex items-start gap-2 bg-accent-cyan/5">
            <Lightbulb className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="text-accent-cyan font-semibold">Next on this hub: </span>
              {hubHint.next}
            </p>
          </div>
        )}

        <ul
          id="command-palette-list"
          ref={listRef}
          role="listbox"
          className="max-h-[min(50vh,360px)] overflow-y-auto py-2"
        >
          {results.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted-foreground text-center">
              No results. Try &quot;NRF2&quot;, &quot;GlyNAC&quot;, or &quot;protocol&quot;.
            </li>
          ) : hasQuery ? (
            results.map((item, i) => (
              <li key={item.id} role="option" aria-selected={i === activeIndex}>
                <PaletteRow
                  item={item}
                  active={i === activeIndex}
                  onSelect={() => runItem(item)}
                  onHover={() => setActiveIndex(i)}
                />
              </li>
            ))
          ) : (
            groups.map((group) => {
              const groupItems = group.items.filter((item) => results.some((r) => r.id === item.id));
              if (groupItems.length === 0) return null;
              return (
                <li key={group.label} role="presentation">
                  <p className="px-4 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-caption">
                    {group.label}
                  </p>
                  <ul role="group" aria-label={group.label}>
                    {groupItems.map((item) => {
                      const i = flatIndex++;
                      return (
                        <li key={item.id} role="option" aria-selected={i === activeIndex}>
                          <PaletteRow
                            item={item}
                            active={i === activeIndex}
                            onSelect={() => runItem(item)}
                            onHover={() => setActiveIndex(i)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })
          )}
        </ul>

        <div className="border-t border-border px-4 py-2 flex flex-wrap gap-3 text-[10px] font-mono text-caption">
          <span className="inline-flex items-center gap-1">
            <Command className="w-3 h-3" aria-hidden="true" />K open
          </span>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>/ quick open</span>
        </div>
      </div>
    </div>
  );
}

function PaletteRow({
  item,
  active,
  onSelect,
  onHover,
}: {
  item: PaletteItem;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        'focus-ring w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
        active ? 'bg-accent-cyan/10' : 'hover:bg-muted/40',
      )}
    >
      <span className="text-[10px] font-mono uppercase text-accent-cyan w-16 shrink-0">
        {paletteKindLabels[item.kind]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{item.title}</p>
        {item.subtitle && (
          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
        )}
      </div>
      <ArrowRight
        className={cn(
          'w-3.5 h-3.5 shrink-0 text-muted-foreground',
          active && 'text-accent-cyan',
        )}
        aria-hidden="true"
      />
    </button>
  );
}