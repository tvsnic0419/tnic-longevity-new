'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount effect flips client-only entrance flags (JS-present and
   scrolled-into-view) that cannot be derived during SSR; this is the same
   progressive-enhancement idiom as components/ui/CountUp.tsx. */

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Progressive-enhancement wrapper for the TNiC Score reveal. The children are
 * server-rendered at their *final* values (the ring offset and dimension-bar
 * widths are in the SSR HTML, so the score stays crawlable and correct with no
 * JS). This wrapper only adds two data-attributes:
 *
 *   data-enhanced  — set on mount, so the "start empty → grow" CSS applies only
 *                    when JS is present (no-JS renders the finished score).
 *   data-revealed  — set once the card scrolls into view (or immediately under
 *                    reduced-motion), which drives the CSS transition to final.
 *
 * All animation lives in globals.css (`.score-reveal[...]`), so this component
 * ships almost no JS and the scoring libs stay server-side.
 */
export function ScoreReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnhanced(true);

    if (prefersReduced) {
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
      { rootMargin: '-12% 0px', threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-enhanced={enhanced ? '' : undefined}
      data-revealed={revealed ? '' : undefined}
    >
      {children}
    </div>
  );
}
