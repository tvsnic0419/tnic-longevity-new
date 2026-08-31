'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { FlaskConical, ShoppingBag, SlidersHorizontal, X, ChevronDown, Trash2 } from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { buildShopStackUrl } from '@/lib/stack-url';

/**
 * StackDock — the persistent "Your Protocol" tray.
 *
 * The sitewide stack already exists (PlatformContext / `useStack`, persisted to
 * localStorage and shareable via `?stack=`), and the Stack Builder, Combination
 * Lab and Protocol Shop all read it — but until now it was invisible while
 * browsing. This dock surfaces it globally: as compounds are added anywhere, it
 * accumulates them, shows synergy + hallmark coverage, and hands the whole set
 * off to the Stack Builder or the Protocol Shop in one action — turning
 * scattered per-compound buys into a single protocol decision.
 *
 * Renders nothing until the stack is non-empty, so it never intrudes on a fresh
 * visit. Bottom-centred to avoid the bottom-right BackToTop control.
 */
export function StackDock() {
  const { selected, selectedCompounds, score, toggle, setSelected } = useStack();
  const [open, setOpen] = useState(false);

  if (selected.length === 0) return null;

  const coverage = new Set(selectedCompounds.flatMap((c) => c.hallmarks)).size;
  const accent = 'var(--accent-emerald)';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto w-full max-w-md" style={{ ['--card-accent' as string]: accent } as CSSProperties}>
        {open && (
          <div className="premium-card mb-2 p-4" role="region" aria-label="Your protocol">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-label text-accent-emerald">Your protocol</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Collapse protocol tray"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Live stats — count · synergy · hallmark coverage */}
            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { v: String(selected.length), k: 'Compounds' },
                { v: String(Math.round(score)), k: 'Synergy' },
                { v: `${coverage}/12`, k: 'Hallmarks' },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-border/60 bg-white/[0.025] px-2.5 py-2 text-center">
                  <p className="font-mono text-lg font-bold tabular-nums text-foreground">{s.v}</p>
                  <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground">{s.k}</p>
                </div>
              ))}
            </div>

            {/* Removable compound chips */}
            <ul className="mb-4 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
              {selectedCompounds.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => toggle(c.id)}
                    className="focus-ring group inline-flex items-center gap-1 rounded-full border border-accent-emerald/25 bg-accent-emerald/[0.08] py-1 pl-2.5 pr-1.5 text-xs text-foreground/85 transition-colors hover:border-accent-rose/40 hover:text-accent-rose"
                    aria-label={`Remove ${c.name} from your protocol`}
                  >
                    {c.name.replace(/\s*\(.*\)$/, '')}
                    <X className="h-3 w-3 opacity-60 group-hover:opacity-100" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Actions — tune in the builder, or shop the whole protocol */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/stacks?stack=${selected.join(',')}`}
                className="tnic-button-secondary focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Tune stack
              </Link>
              <Link
                href={buildShopStackUrl(selected)}
                className="tnic-button-primary focus-ring group inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Shop protocol
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setSelected([])}
              className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded text-micro font-medium text-muted-foreground hover:text-accent-rose"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear protocol
            </button>
          </div>
        )}

        {/* Collapsed pill — always the entry point when a protocol exists */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="premium-card focus-ring group flex w-full items-center justify-between gap-3 px-4 py-3"
        >
          <span className="flex items-center gap-2.5">
            <span className="icon-badge-emerald grid h-8 w-8 place-items-center rounded-xl">
              <FlaskConical className="h-4 w-4 text-accent-emerald" aria-hidden="true" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-foreground">Your protocol</span>
              <span className="block text-micro text-muted-foreground">
                {selected.length} compound{selected.length === 1 ? '' : 's'} · {coverage}/12 hallmarks
              </span>
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-emerald">
            {open ? 'Close' : 'Review'}
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? '' : 'rotate-180'}`} aria-hidden="true" />
          </span>
        </button>
      </div>
    </div>
  );
}
