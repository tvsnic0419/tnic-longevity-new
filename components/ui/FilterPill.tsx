import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FilterPillTone = 'cyan' | 'emerald' | 'violet' | 'amber';

interface FilterPillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  active: boolean;
  tone?: FilterPillTone;
  children: ReactNode;
}

const toneStyles: Record<FilterPillTone, { active: string; idle: string }> = {
  cyan: {
    active: 'border-accent-cyan/55 bg-accent-cyan/10 text-accent-cyan shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
    idle: 'border-border/80 bg-background/25 text-muted-foreground hover:border-accent-cyan/35 hover:text-foreground',
  },
  emerald: {
    active: 'border-accent-emerald/55 bg-accent-emerald/10 text-accent-emerald shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
    idle: 'border-border/80 bg-background/25 text-muted-foreground hover:border-accent-emerald/35 hover:text-foreground',
  },
  violet: {
    active: 'border-accent-violet/55 bg-accent-violet/10 text-accent-violet shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
    idle: 'border-border/80 bg-background/25 text-muted-foreground hover:border-accent-violet/35 hover:text-foreground',
  },
  amber: {
    active: 'border-accent-amber/55 bg-accent-amber/10 text-accent-amber shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
    idle: 'border-border/80 bg-background/25 text-muted-foreground hover:border-accent-amber/35 hover:text-foreground',
  },
};

/**
 * A compact filter control with a visible selected state. Keep the semantic
 * pressed state on the native button so filter groups remain legible to both
 * keyboard users and assistive technology.
 */
export function FilterPill({ active, tone = 'cyan', children, className, ...props }: FilterPillProps) {
  const styles = toneStyles[tone];

  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'focus-ring interactive min-h-[var(--space-touch)] rounded-full border px-3 text-caption font-semibold transition-[border-color,background-color,color,box-shadow] duration-200',
        active ? styles.active : styles.idle,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
