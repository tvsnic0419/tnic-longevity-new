'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface RevealItemProps {
  /** Position within its grid — drives the stagger delay, capped so long lists don't feel sluggish. */
  index?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Restrained scroll-reveal stagger for homepage card grids — fades/lifts in once,
 * the first time the item scrolls into view. CSS-driven (see `.reveal-item` in
 * globals.css) with an IntersectionObserver trigger, so it carries no
 * animation-library weight. Reduced motion is honored purely in CSS.
 */
export function RevealItem({ index = 0, children, className }: RevealItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // No IntersectionObserver (very old browsers) → reveal immediately so content is never stranded hidden.
    if (!el || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: '-80px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { '--reveal-delay': `${Math.min(index, 6) * 0.06}s` } as CSSProperties;

  return (
    <div
      ref={ref}
      className={className ? `reveal-item ${className}` : 'reveal-item'}
      data-revealed={revealed ? 'true' : undefined}
      style={style}
    >
      {children}
    </div>
  );
}
