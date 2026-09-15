import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  /**
   * How wide the content column may run.
   *
   * `hub` (default) keeps the full 80rem container the dense hub pages are
   * built for — grids, tables and instrument panels all want the width.
   *
   * `reading` narrows it to a real editorial measure. The long-form pages
   * (trust, methodology, legal, policy) set every child to `max-w-4xl` but
   * sat inside the 80rem hub container, so at 1440px a 56rem column hugged
   * the left edge with 24rem of empty page beside it and nothing in it. The
   * measure was right; the frame around it was not. Narrowing the *shell*
   * rather than re-widening the prose keeps the line length where it should
   * be and lets the column sit centred in the viewport.
   */
  measure?: 'hub' | 'reading';
}

/** Consistent wrapper for /labs, /stacks, /library hub pages.
 * Asymmetric vertical rhythm: a nav bar and context rail already sit above
 * every hub, so the top gap is kept tight while the bottom keeps generous
 * separation before the next section. */
export function PageShell({ children, className = '', measure = 'hub' }: PageShellProps) {
  return (
    <div className={`hub-shell pt-10 md:pt-12 lg:pt-14 pb-16 md:pb-20 lg:pb-24 section-mesh ${className}`}>
      <div
        className={`relative container-page${measure === 'reading' ? ' container-page--reading' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}
