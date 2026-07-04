import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-muted/50 text-muted-foreground border-border',
  success: 'badge-optimal',
  warning: 'badge-watch',
  danger: 'badge-critical',
  info: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30',
  outline: 'border-border bg-transparent text-muted-foreground',
};

export function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}