import type { ButtonHTMLAttributes, ReactNode } from 'react';
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

export function Button({
  variant = 'primary',
  theme = 'cyan',
  size = 'md',
  icon: Icon,
  children,
  fullWidth,
  className = '',
  ...props
}: ButtonProps) {
  const t = themes[theme];
  const accentPrimary =
    variant === 'primary' && theme !== 'cyan'
      ? `${t.bgSolid} text-primary-foreground hover:opacity-90`
      : '';

  return (
    <button
      className={cn(
        'focus-ring interactive inline-flex items-center justify-center gap-2 rounded-xl font-semibold disabled:opacity-40 disabled:pointer-events-none',
        buttonSizes[size],
        variantStyles[variant],
        accentPrimary,
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
}