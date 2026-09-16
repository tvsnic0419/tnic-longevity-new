'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { openCommandPalette } from '@/components/os/os-events';

/**
 * The header search box.
 *
 * Submitting hands the query to the command palette rather than navigating to
 * `/library?q=`. The library's own search only looks at compounds; the palette
 * searches the whole knowledge system — compounds, pathways, hallmarks,
 * guides, peptides, comparisons, tools — and labels each result with the kind
 * of thing it is, which is what someone typing "NRF2" into a site-wide box
 * actually wants. `/library?q=` still works as a route and still backs the
 * WebSite SearchAction in the JSON-LD; it is just no longer the only answer.
 *
 * The ⌘K listener that used to live here was removed rather than lost:
 * `OsOverlays` already registers one, so both fired on every press.
 */
export function SiteSearch() {
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    openCommandPalette(query.trim());
    setQuery('');
  };

  return (
    <form onSubmit={submit} className="relative hidden md:block" role="search">
      <label htmlFor="site-search" className="sr-only">
        Search the TNiC knowledge system
      </label>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search TNiC… ⌘K"
        autoComplete="off"
        className="focus-ring w-48 lg:w-56 min-h-[var(--space-touch)] pl-9 pr-3 py-2 rounded-full text-sm glass border border-border bg-transparent placeholder:text-caption"
      />
    </form>
  );
}
