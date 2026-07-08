'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Circle, Loader2, Rocket } from 'lucide-react';
import { nextUpImprovements } from '@/lib/next-up';
import type { NextUpItem, NextUpStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

type Filter = 'all' | NextUpStatus;

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'Next up' },
  { id: 'planned', label: 'Planned' },
  { id: 'shipped', label: 'Shipped' },
];

const statusMeta: Record<
  NextUpStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  shipped: {
    label: 'Shipped',
    icon: CheckCircle2,
    className: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
  },
  in_progress: {
    label: 'In progress',
    icon: Loader2,
    className: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  },
  planned: {
    label: 'Planned',
    icon: Circle,
    className: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
  },
};

function NextUpRow({ item, compact }: { item: NextUpItem; compact?: boolean }) {
  const meta = statusMeta[item.status];
  const Icon = meta.icon;

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 transition-colors',
        item.href ? 'glass glass-hover hover:border-accent-cyan/20' : 'glass',
        compact && 'p-3',
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4 shrink-0 mt-0.5',
          item.status === 'shipped' && 'text-accent-emerald',
          item.status === 'in_progress' && 'text-accent-cyan',
          item.status === 'planned' && 'text-accent-violet',
        )}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className={cn('font-semibold', compact ? 'text-xs' : 'text-sm')}>{item.title}</p>
          <span
            className={cn(
              'text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border',
              meta.className,
            )}
          >
            {meta.label}
          </span>
          {item.sprint && (
            <span className="text-[10px] font-mono text-muted-foreground">{item.sprint}</span>
          )}
        </div>
        {!compact && (
          <p className="text-body-sm text-muted-foreground leading-relaxed">{item.desc}</p>
        )}
        {item.tags && !compact && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {item.href && (
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" aria-hidden="true" />
      )}
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="focus-ring block rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}

interface NextUpPanelProps {
  compact?: boolean;
  defaultFilter?: Filter;
  limit?: number;
  showFilters?: boolean;
  id?: string;
  changelogHref?: string;
  changelogLabel?: string;
}

export function NextUpPanel({
  compact = false,
  defaultFilter = 'in_progress',
  limit,
  showFilters = true,
  id = 'next-up',
  changelogHref = '/trust/updates',
  changelogLabel = 'Full changelog →',
}: NextUpPanelProps) {
  const [filter, setFilter] = useState<Filter>(defaultFilter);

  const items =
    filter === 'all'
      ? nextUpImprovements
      : nextUpImprovements.filter((i) => i.status === filter);

  const visible = limit ? items.slice(0, limit) : items;

  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="w-4 h-4 text-accent-violet" aria-hidden="true" />
            <p className="text-label text-accent-violet">Product roadmap</p>
          </div>
          <h2 id={`${id}-heading`} className={cn('font-bold', compact ? 'text-base' : 'text-xl')}>
            Next up — functional improvements
          </h2>
          {!compact && (
            <p className="text-body-sm text-muted-foreground mt-1 max-w-2xl">
              What we just shipped, what we&apos;re building now, and what&apos;s queued. Long-horizon
              research milestones live in the horizon roadmap.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/brief"
            className="focus-ring text-xs font-semibold text-accent-violet hover:underline rounded"
          >
            Protocol Brief →
          </Link>
          <Link
            href={changelogHref}
            className="focus-ring text-xs font-semibold text-accent-cyan hover:underline rounded"
          >
            {changelogLabel}
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Filter improvements">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'focus-ring px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                filter === f.id
                  ? 'bg-accent-violet/20 text-accent-violet border border-accent-violet/30'
                  : 'glass text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
              <span className="ml-1.5 font-mono opacity-70">
                {f.id === 'all'
                  ? nextUpImprovements.length
                  : nextUpImprovements.filter((i) => i.status === f.id).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className={cn('space-y-2', !compact && 'space-y-3')}>
        {visible.map((item) => (
          <NextUpRow key={item.id} item={item} compact={compact} />
        ))}
      </div>
    </section>
  );
}