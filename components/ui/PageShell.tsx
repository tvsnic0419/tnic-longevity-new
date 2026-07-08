import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/** Consistent wrapper for /labs, /stacks, /library hub pages.
 * Asymmetric vertical rhythm: a nav bar and context rail already sit above
 * every hub, so the top gap is kept tight while the bottom keeps generous
 * separation before the next section. */
export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div className={`hub-shell pt-10 md:pt-12 lg:pt-14 pb-16 md:pb-20 lg:pb-24 section-mesh ${className}`}>
      <div className="relative container-page">{children}</div>
    </div>
  );
}