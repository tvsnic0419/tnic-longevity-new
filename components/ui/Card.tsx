import type { ReactNode } from 'react';
import { cardVariants } from '@/lib/design-system';
import { cn } from '@/lib/utils';

type CardVariant = keyof typeof cardVariants;

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  /** @deprecated use variant="elevated" */
  elevated?: boolean;
  /** Opt-in accent hover-lift + glow (uses the existing `.card-depth-hover`
   *  treatment) — for interactive card grids that should feel alive on hover. */
  hover?: boolean;
}

export function Card({ children, className = '', variant, elevated = false, hover = false }: CardProps) {
  const resolved = variant ?? (elevated ? 'elevated' : 'default');

  return (
    <div className={cn(cardVariants[resolved], 'p-5 md:p-6', hover && 'card-depth-hover', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

/**
 * `as` lets a caller pick the heading level that fits its page outline —
 * a card sitting directly under the page `<h1>` needs an `<h2>`, not the
 * default `<h3>`. Styling is identical either way; only the level changes.
 */
export function CardTitle({
  children,
  className = '',
  as: Tag = 'h3',
}: {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
}) {
  return <Tag className={cn('heading-card text-lg', className)}>{children}</Tag>;
}

export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-body-sm mt-1', className)}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}