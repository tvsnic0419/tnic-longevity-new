import { cloneElement, isValidElement } from 'react';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';
import { buttonSizes, themes } from '@/lib/design-system';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = keyof typeof buttonSizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  theme?: ThemeAccent;
  size?: ButtonSize;
  icon?: LucideIcon;
  children: ReactNode;
  fullWidth?: boolean;
  /**
   * Render the button's styling onto the single child element instead of a
   * <button> — for <Link>/<a> CTAs that should share the exact same primary /
   * ghost / outline treatment. The child keeps its own props; only className
   * and the optional leading icon are merged in.
   */
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'btn-gradient !text-[#030712] shadow-sm border-0',
  secondary:
    'glass text-muted-foreground hover:text-foreground hover:border-accent-cyan/30',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-muted/50 hover:border-accent-cyan/30',
  ghost: 'text-muted-foreground hover:text-accent-cyan bg-transparent',
  danger: 'text-muted-foreground hover:text-accent-rose bg-transparent',
};

/**
 * Shared class recipe for the button treatment. Exported so link-shaped CTAs
 * can opt into the exact same styling without re-deriving it inline.
 */
export function buttonClasses({
  variant = 'primary',
  theme = 'cyan',
  size = 'md',
  fullWidth = false,
}: {
  variant?: ButtonVariant;
  theme?: ThemeAccent;
  size?: ButtonSize;
  fullWidth?: boolean;
} = {}): string {
  const t = themes[theme];
  const accentPrimary =
    variant === 'primary' && theme !== 'cyan'
      ? `${t.bgSolid} text-primary-foreground hover:opacity-90`
      : '';
  return cn(
    'focus-ring interactive inline-flex items-center justify-center gap-2 rounded-xl font-semibold disabled:opacity-40 disabled:pointer-events-none',
    buttonSizes[size],
    variantStyles[variant],
    accentPrimary,
    fullWidth && 'w-full',
  );
}

export function Button({
  variant = 'primary',
  theme = 'cyan',
  size = 'md',
  icon: Icon,
  children,
  fullWidth,
  asChild = false,
  className = '',
  ...props
}: ButtonProps) {
  const classes = cn(buttonClasses({ variant, theme, size, fullWidth }), className);
  const inner = (
    <>
      {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      {children}
    </>
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    return cloneElement(
      child,
      { className: cn(classes, child.props.className) },
      <>
        {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
        {child.props.children}
      </>,
    );
  }

  return (
    <button className={classes} {...props}>
      {inner}
    </button>
  );
}
