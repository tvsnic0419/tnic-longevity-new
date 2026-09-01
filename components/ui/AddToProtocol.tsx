'use client';

import { Plus, Check } from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { isStackCompoundId } from '@/lib/compound-core';
import { cn } from '@/lib/utils';

interface AddToProtocolProps {
  /** Stack compound id (must resolve via isStackCompoundId, or nothing renders). */
  compoundId: string;
  /** Compound display name — used for the accessible label. */
  name?: string;
  size?: 'sm' | 'md';
  /** 'chip' (pill, default) or 'block' (full-width button). */
  variant?: 'chip' | 'block';
  className?: string;
}

/**
 * AddToProtocol — the site's one canonical "add this compound to my protocol"
 * control. Wired to the sitewide stack (useStack), it feeds the persistent
 * StackDock, so a reader can turn a single evidence decision — on a compound
 * deep-dive, a "best for" leaderboard row, or a comparison verdict — into their
 * accumulating protocol without leaving the page. Matches the homepage elite
 * grid's add/remove idiom (Plus → Check, emerald when active).
 *
 * Renders nothing for an id the stack can't resolve (isStackCompoundId guard),
 * so it can never leave the StackDock in a count-without-chip state.
 */
export function AddToProtocol({
  compoundId,
  name,
  size = 'md',
  variant = 'chip',
  className,
}: AddToProtocolProps) {
  const { selected, toggle } = useStack();

  if (!isStackCompoundId(compoundId)) return null;

  const inStack = selected.includes(compoundId);
  const label = inStack ? 'In protocol' : 'Add to protocol';
  const Icon = inStack ? Check : Plus;

  return (
    <button
      type="button"
      onClick={() => toggle(compoundId)}
      aria-pressed={inStack}
      aria-label={name ? `${label}: ${name}` : label}
      className={cn(
        'focus-ring interactive inline-flex items-center justify-center gap-1.5 font-semibold transition-colors',
        size === 'sm' ? 'text-xs px-2.5 py-1.5' : 'text-sm px-3.5 py-2',
        variant === 'block' ? 'w-full rounded-xl' : 'rounded-full',
        inStack
          ? 'border border-accent-emerald/45 bg-accent-emerald/[0.08] text-accent-emerald'
          : 'border border-border/70 text-foreground/85 hover:border-accent-emerald/45 hover:text-accent-emerald',
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      {label}
    </button>
  );
}
