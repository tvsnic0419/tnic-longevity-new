import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/** Consistent wrapper for /labs, /stacks, /library hub pages */
export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div className={`hub-shell py-16 md:py-24 lg:py-28 section-mesh ${className}`}>
      <div className="relative container-page">{children}</div>
    </div>
  );
}