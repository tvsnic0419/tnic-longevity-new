'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import type { HeadToHeadOption } from '@/lib/head-to-head';

// ─────────────────────────────────────────────────────────────────────────────
// HeadToHeadPicker — the only client-side piece of the comparison surface.
//
// Selection lives in the URL (?a=&b=) rather than in component state, so every
// comparison is a real, shareable, server-rendered, indexable address. This
// deliberately reads nothing from useSearchParams(): the page reads its own
// searchParams prop on the server instead, which is what keeps the whole
// surface out of the client-side-rendering bailout documented in CLAUDE.md §3.
// The current values arrive as plain props.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  options: HeadToHeadOption[];
  a: string;
  b: string;
}

export function HeadToHeadPicker({ options, a, b }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const go = (next: { a?: string; b?: string }) => {
    const nextA = next.a ?? a;
    const nextB = next.b ?? b;
    startTransition(() => {
      router.push(`/library/compare/head-to-head?a=${nextA}&b=${nextB}`, { scroll: false });
    });
  };

  const selectClass =
    'focus-ring interactive w-full rounded-lg border border-white/15 bg-[var(--color-bg-elevated)] px-3 py-2.5 text-body-sm text-foreground';

  return (
    <div className="premium-card p-5 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-end">
        <div>
          <label htmlFor="h2h-a" className="block text-micro font-mono uppercase tracking-wide text-accent-cyan mb-1.5">
            First compound
          </label>
          <select
            id="h2h-a"
            className={selectClass}
            value={a}
            onChange={(e) => go({ a: e.target.value })}
          >
            {options.map((o) => (
              <option key={o.id} value={o.id} disabled={o.id === b}>
                {o.name} — Tier {o.tier}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => go({ a: b, b: a })}
          className="focus-ring interactive self-end mb-0.5 inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-body-sm hover:bg-white/5"
          aria-label="Swap the two compounds"
        >
          <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
          <span className="md:hidden">Swap</span>
        </button>

        <div>
          <label htmlFor="h2h-b" className="block text-micro font-mono uppercase tracking-wide text-accent-violet mb-1.5">
            Second compound
          </label>
          <select
            id="h2h-b"
            className={selectClass}
            value={b}
            onChange={(e) => go({ b: e.target.value })}
          >
            {options.map((o) => (
              <option key={o.id} value={o.id} disabled={o.id === a}>
                {o.name} — Tier {o.tier}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-micro text-muted-foreground/80 mt-3" aria-live="polite">
        {isPending
          ? 'Loading comparison…'
          : `Comparing any two of ${options.length} evidence-graded compounds. This comparison has its own shareable link.`}
      </p>
    </div>
  );
}
