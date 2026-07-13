import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type GlassDepth = 1 | 2 | 3;

export interface GlassPanelProps {
  /** Depth plane: 1 = far/subtle, 2 = mid, 3 = raised foreground. */
  depth?: GlassDepth;
  /** Adds the hover lift + deepened shadow. */
  interactive?: boolean;
  /** Small floating-accent chip preset (tighter radius, raised blur). */
  chip?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  role?: string;
  'aria-hidden'?: boolean;
}

/**
 * The one deep-glass surface. Every glass moment on the site composes this so
 * fills, refractive rim, stacked shadows, and blur stay consistent — the look
 * is defined once in the `.dg-*` tokens in globals.css, never per-component.
 */
export function GlassPanel({
  depth = 2,
  interactive = false,
  chip = false,
  className,
  style,
  children,
  ...rest
}: GlassPanelProps) {
  return (
    <div
      className={cn('dg-panel', `dg-${depth}`, interactive && 'dg-interactive', chip && 'dg-chip', className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
