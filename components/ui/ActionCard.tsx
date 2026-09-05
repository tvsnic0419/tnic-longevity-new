import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, type LucideIcon } from 'lucide-react';
import { themes, type ThemeAccent } from '@/lib/design-system';
import { cn } from '@/lib/utils';

export interface ActionCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent?: ThemeAccent;
  meta?: string;
  featured?: boolean;
  className?: string;
}

/**
 * A high-signal destination card for the first consequential choice on a hub.
 * The component deliberately separates the action’s purpose, title, supporting
 * detail, and outcome so dense research experiences can stay calm and legible.
 */
export function ActionCard({
  eyebrow,
  title,
  description,
  href,
  icon: Icon,
  accent = 'cyan',
  meta,
  featured = false,
  className,
}: ActionCardProps) {
  const accentVar = themes[accent].cssVar;

  return (
    <Link
      href={href}
      className={cn('action-card focus-ring interactive group', featured && 'action-card--featured', className)}
      style={{ '--action-card-accent': accentVar } as CSSProperties}
    >
      <span className="action-card__topline">
        <span className="action-card__icon" aria-hidden="true">
          <Icon className="h-4 w-4" />
        </span>
        <span className="action-card__eyebrow">{eyebrow}</span>
        {featured && (
          <span className="action-card__featured-label">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Recommended
          </span>
        )}
      </span>
      <span className="action-card__content">
        <span className="action-card__title">{title}</span>
        <span className="action-card__description">{description}</span>
      </span>
      <span className="action-card__footer">
        <span>{meta ?? 'Open path'}</span>
        <span className="action-card__arrow" aria-hidden="true">
          <ArrowRight className="h-4 w-4" />
        </span>
      </span>
    </Link>
  );
}
