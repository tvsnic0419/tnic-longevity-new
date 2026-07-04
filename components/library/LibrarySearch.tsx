'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import {
  searchLibrary,
  librarySearchKindLabels,
  librarySearchSuggestions,
  type LibrarySearchItem,
} from '@/lib/library-search';
import { cn } from '@/lib/utils';

function highlightQuery(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent-cyan/20 text-foreground rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function LibrarySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  const [input, setInput] = useState(urlQuery);
  const results = useMemo(() => searchLibrary(urlQuery), [urlQuery]);

  useEffect(() => {
    setInput(urlQuery);
  }, [urlQuery]);

  const setQuery = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = q.trim();
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
      const qs = params.toString();
      router.replace(qs ? `/library?${qs}` : '/library', { scroll: false });
    },
    [router, searchParams],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input);
  };

  return (
    <section
      className="border-b border-border bg-gradient-to-b from-accent-cyan/[0.04] to-transparent"
      aria-label="Library search"
    >
      <div className="container-page py-8 md:py-10">
        <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
          <label htmlFor="library-search" className="sr-only">
            Search library
          </label>
          <div className="relative flex items-center gap-2 glass rounded-2xl border border-border px-4 py-3 focus-within:border-accent-cyan/40 transition-colors">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
            <input
              id="library-search"
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search hallmarks, compounds, comparisons, brief…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-caption"
              autoComplete="off"
            />
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput('');
                  setQuery('');
                }}
                className="focus-ring p-1 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="focus-ring hidden sm:inline-flex items-center gap-1 rounded-lg bg-accent-emerald/10 border border-accent-emerald/25 px-3 py-1.5 text-xs font-semibold text-accent-emerald hover:bg-accent-emerald/15"
            >
              Search
            </button>
          </div>
        </form>

        {!urlQuery && (
          <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
            {librarySearchSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setInput(s);
                  setQuery(s);
                }}
                className="focus-ring text-caption font-mono rounded-full border border-border px-3 py-1 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {urlQuery && (
          <div className="mt-8">
            <p className="text-body-sm text-muted-foreground mb-4">
              {results.length === 0 ? (
                <>No results for &ldquo;{urlQuery}&rdquo;. Try NRF2, GlyNAC, or mitochondrial.</>
              ) : (
                <>
                  <span className="font-mono text-accent-cyan">{results.length}</span> result
                  {results.length === 1 ? '' : 's'} for &ldquo;{urlQuery}&rdquo;
                </>
              )}
            </p>

            {results.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.map((item) => (
                  <SearchResultCard key={item.id} item={item} query={urlQuery} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function SearchResultCard({ item, query }: { item: LibrarySearchItem; query: string }) {
  const kindAccent: Record<LibrarySearchItem['kind'], string> = {
    hallmark: 'text-accent-violet',
    module: 'text-accent-cyan',
    compound: 'text-accent-emerald',
    compare: 'text-accent-amber',
    brief: 'text-accent-rose',
  };

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          'focus-ring glass glass-hover rounded-xl p-4 flex flex-col h-full group border border-border',
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={cn('text-[10px] font-mono uppercase', kindAccent[item.kind])}>
            {librarySearchKindLabels[item.kind]}
          </span>
          {item.evidenceTier && (
            <span className="text-[10px] font-mono text-caption">Tier {item.evidenceTier}</span>
          )}
        </div>
        <p className="font-semibold text-sm leading-snug group-hover:text-accent-cyan transition-colors">
          {highlightQuery(item.title, query)}
        </p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{item.subtitle}</p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-accent-emerald mt-3">
          Open <ArrowRight className="w-3 h-3" />
        </span>
      </Link>
    </li>
  );
}