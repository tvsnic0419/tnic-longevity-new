'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FIELD_NOTES } from '@/lib/field-notes';
import { TIER_ACCENT } from '@/lib/insights';
import type { CSSProperties } from 'react';

/**
 * "Good to know" field-note cards. Each leads with the figure (Fraunces display,
 * the site's headline face), then the claim and why it matters, and links to the
 * compound whose sourced page carries the citation. The tier badge and stat use
 * the canonical evidence color so provenance reads before the prose.
 */
export function FieldNotes() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FIELD_NOTES.map((n, i) => {
        const accent = TIER_ACCENT[n.tier];
        return (
          <li key={n.title}>
            <Link
              href={n.href}
              className="focus-ring group flex h-full flex-col rounded-2xl border border-border/70 bg-gradient-to-b from-card/60 to-card/20 p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent-cyan/40"
              style={{ '--card-accent': accent } as CSSProperties}
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="font-mono text-micro font-bold tracking-widest text-faint">
                  FIELD NOTE · {String(i + 1).padStart(2, '0')}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-cyan"
                  aria-hidden="true"
                />
              </div>

              <p
                className="font-display text-3xl font-medium leading-none tracking-tight tabular-nums"
                style={{ color: accent }}
              >
                {n.stat}
              </p>
              <h3 className="heading-card mt-3 text-base leading-snug group-hover:text-accent-cyan">
                {n.title}
              </h3>
              <p className="text-body-sm mt-2 flex-1 leading-relaxed text-muted-foreground">{n.body}</p>

              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
                  <span className="font-mono text-micro font-bold" style={{ color: accent }}>
                    {n.tier}
                  </span>
                  {n.compoundName}
                </span>
                <span className="text-micro font-mono text-faint">{n.source}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
