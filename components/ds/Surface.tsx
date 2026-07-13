import { cn } from '@/lib/utils';

/**
 * The one canonical card surface: a hairline border on a faint fill. Replaces
 * the gradient-border-on-everything look with restraint — spacing and content
 * do the work, not effects.
 */
export function Surface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-2xl border border-border bg-background/40', className)}>
      {children}
    </div>
  );
}
