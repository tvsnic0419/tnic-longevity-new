'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';

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
    <IconButton
      icon={ArrowUp}
      label="Back to top"
      variant="surface"
      onClick={toTop}
      // aria-hidden + tabindex track visibility so the control isn't reachable
      // (by pointer or keyboard) while it's faded out.
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={[
        'fixed bottom-6 right-6 z-40 rounded-full shadow-lg transition-all duration-300',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      ].join(' ')}
    />
  );
}
