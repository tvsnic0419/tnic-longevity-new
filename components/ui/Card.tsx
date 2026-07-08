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
}

export function Card({ children, className = '', variant, elevated = false }: CardProps) {
  const resolved = variant ?? (elevated ? 'elevated' : 'default');

  return (
    <div className={cn(cardVariants[resolved], 'p-5 md:p-6', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('heading-card text-lg', className)}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-body-sm mt-1', className)}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}