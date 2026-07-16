import type { ReactNode } from 'react';
import { RevealItem } from './RevealItem';
import { GlassPanel, type GlassDepth } from './GlassPanel';

interface RevealCardProps {
  /** Position within its grid — drives RevealItem's stagger delay. */
  index?: number;
  depth?: GlassDepth;
  /** Applied to the RevealItem wrapper itself (e.g. "h-full" when the grid item must stretch). */
  itemClassName?: string;
  /** Applied to the GlassPanel — rounding, height, hover state, etc. */
  className?: string;
  children: ReactNode;
}

/**
 * RevealItem + GlassPanel, fused. Every homepage grid section hand-rolled
 * this same two-level wrapper; one primitive instead of re-deriving it at
 * each call site.
 */
export function RevealCard({ index, depth = 'mid', itemClassName, className, children }: RevealCardProps) {
  return (
    <RevealItem index={index} className={itemClassName}>
      <GlassPanel depth={depth} className={className}>
        {children}
      </GlassPanel>
    </RevealItem>
  );
}
