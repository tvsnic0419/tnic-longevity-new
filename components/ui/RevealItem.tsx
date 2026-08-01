import type { CSSProperties, ReactNode } from 'react';

interface RevealItemProps {
  /** Position within its grid — drives the stagger delay, capped so long lists don't feel sluggish. */
  index?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Restrained scroll-reveal stagger for homepage card grids — fades/lifts in
 * once, the first time the item scrolls into view.
 *
 * This is deliberately a *server* component: it renders a plain div and the
 * entrance is pure CSS, triggered by the single shared observer in
 * RevealScript. It was previously a framer-motion `motion.div`, which forced
 * a client boundary into every section that used it and hydrated ~100 motion
 * components on the homepage alone — the dominant share of a measured 4.2s of
 * main-thread time. Keep it server-only; if a specific card needs real motion,
 * reach for framer-motion in that component rather than reinstating it here.
 */
export function RevealItem({ index = 0, children, className }: RevealItemProps) {
  const delay = Math.min(index, 6) * 0.06;

  return (
    <div
      className={className ? `reveal-item ${className}` : 'reveal-item'}
      style={delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
