import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The canonical icon-only control. Before this existed, every icon button on
 * the site was hand-rolled — the nav's own search and menu buttons sat side by
 * side in one cluster with different icon sizes (w-5 vs w-6), no press state,
 * and no `type`, while the theme toggle two elements away had all three. This
 * is one recipe so a control cluster reads as deliberate.
 *
 * Sizing follows the brief's 40–44px band. `size="md"` is the default and
 * resolves to the site's own `--space-touch` (44px) via `.touch-target`, so
 * the icon can stay visually compact while the hit area stays honest.
 *
 * `label` is required and does double duty as the accessible name and the
 * native tooltip — an icon button with neither is unlabeled for everyone, so
 * the type system refuses to build one.
 */

export type IconButtonSize = 'sm' | 'md';
export type IconButtonVariant = 'quiet' | 'surface';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'title'> {
  icon: LucideIcon;
  /** Accessible name. Also rendered as the native tooltip unless `tooltip={false}`. */
  label: string;
  /** Set false for controls whose label would be redundant on hover (e.g. inside a labelled group). */
  tooltip?: boolean;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
}

/** 40px compact / 44px standard — both clear the brief's minimum band. */
const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'h-10 w-10',
  md: 'touch-target',
};

/** Icons stay one step smaller than the control so the hit area is generous. */
const iconStyles: Record<IconButtonSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
};

const variantStyles: Record<IconButtonVariant, string> = {
  quiet: 'text-muted-foreground hover:text-accent-cyan',
  surface:
    'border border-border/70 bg-card/80 text-foreground backdrop-blur hover:border-accent-cyan/50 hover:text-accent-cyan',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon: Icon, label, tooltip = true, size = 'md', variant = 'quiet', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={tooltip ? label : undefined}
      className={cn(
        'focus-ring interactive inline-flex items-center justify-center rounded-lg',
        'disabled:opacity-40 disabled:pointer-events-none',
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <Icon className={cn(iconStyles[size], 'shrink-0')} aria-hidden="true" />
    </button>
  );
});
