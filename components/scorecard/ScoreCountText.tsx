'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The layout effect below intentionally resets the SSR-final value to 0 before
   first paint so the count-up has somewhere to travel from; this is a
   client-only entrance animation, not a value derivable during render. */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * The big score digits inside the ring. Server-renders the *final* value (so the
 * score is in the SSR HTML and crawlable), then — only when JS is present and
 * motion is allowed — counts up from 0 the first time it scrolls into view, in
 * lockstep with the ring draw. Reduced motion shows the final value immediately.
 * Rendered inside an SVG <text>, so it returns a bare string.
 */
export function ScoreCountText({ value, duration = 1000 }: { value: number; duration?: number }) {
  const ref = useRef<SVGTSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const animate = useRef(false);

  // Before first paint, drop to 0 so there's no flash of the final number.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animate.current = true;
    setDisplay(0);
  }, []);

  useEffect(() => {
    if (!animate.current) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(eased * value));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { rootMargin: '-12% 0px', threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <tspan ref={ref}>{display}</tspan>;
}
