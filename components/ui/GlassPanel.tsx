import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Deep Glass System — depth via layered planes, not blur alone.
 * See app/globals.css "Design System v8 — Deep Glass" for the token bundle
 * each plane draws from. Reserve glass for one or two moments per page —
 * most surfaces on the site should stay non-glass.
 */
export type GlassDepth = 'field' | 'mid' | 'content' | 'float';

interface GlassPanelProps {
  depth?: GlassDepth;
  /** Contrast scrim behind children so text over the glass clears WCAG AA. */
  scrim?: boolean;
  className?: string;
  children: ReactNode;
}

export function GlassPanel({ depth = 'content', scrim = false, className, children }: GlassPanelProps) {
  return (
    <div className={cn('glass-deep', `glass-plane-${depth}`, className)}>
      {scrim && <div className="glass-scrim" aria-hidden="true" />}
      {children}
    </div>
  );
}

interface GlassCardProps {
  depth?: GlassDepth;
  scrim?: boolean;
  rounded?: string;
  className?: string;
  children: ReactNode;
}

/** GlassPanel with card-shaped defaults — padding + rounding — for cards/sections. */
export function GlassCard({ depth = 'mid', scrim, rounded = 'rounded-2xl', className, children }: GlassCardProps) {
  return (
    <GlassPanel depth={depth} scrim={scrim} className={cn(rounded, 'p-6', className)}>
      {children}
    </GlassPanel>
  );
}
