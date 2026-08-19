'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * A small, unobtrusive "back to top" control for long pages. Appears only once
 * the visitor has scrolled past the first viewport, sits out of the way in the
 * bottom-right, and honors prefers-reduced-motion (jumps instead of smooth-
 * scrolling). Purely additive — keyboard-focusable, labeled, and inert until
 * it's actually useful.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      // aria-hidden + tabindex track visibility so the control isn't reachable
      // (by pointer or keyboard) while it's faded out.
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={[
        'focus-ring fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full',
        'border border-border/70 bg-card/80 text-foreground shadow-lg backdrop-blur',
        'transition-all duration-300 hover:border-accent-cyan/50 hover:text-accent-cyan',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      ].join(' ')}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
