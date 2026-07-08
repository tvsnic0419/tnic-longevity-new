'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { COMMAND_PALETTE_EVENT } from '@/components/os/CommandPalette';

export function SiteSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/library?q=${encodeURIComponent(q)}`);
      setQuery('');
      return;
    }
    window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT));
  };

  return (
    <form onSubmit={submit} className="relative hidden md:block">
      <label htmlFor="site-search" className="sr-only">
        Search library or open command palette
      </label>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search library… ⌘K"
        className="focus-ring w-44 xl:w-52 pl-9 pr-3 py-2 rounded-full text-sm glass border border-border bg-transparent placeholder:text-caption"
      />
    </form>
  );
}