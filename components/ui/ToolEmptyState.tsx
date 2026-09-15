'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ToolEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  detail: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
  theme?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

const themeAccent = {
  cyan: 'text-accent-cyan border-accent-cyan/25 from-accent-cyan/[0.08]',
  violet: 'text-accent-violet border-accent-violet/25 from-accent-violet/[0.08]',
  emerald: 'text-accent-emerald border-accent-emerald/25 from-accent-emerald/[0.08]',
  amber: 'text-accent-amber border-accent-amber/25 from-accent-amber/[0.08]',
  rose: 'text-accent-rose border-accent-rose/25 from-accent-rose/[0.08]',
} as const;

/**
 * Premium empty state for tools — skeleton shimmer + CTA, not bare text.
 */
export function ToolEmptyState({
  icon: Icon,
  title,
  detail,
  ctaLabel,
  ctaHref,
  onCta,
  theme = 'cyan',
  className,
}: ToolEmptyStateProps) {
  const accent = themeAccent[theme];
  return (
    <div
      role="status"
      className={cn(
        'premium-card relative overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-8 md:p-10 text-center',
        accent,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden="true" />
      <div className="mx-auto mb-5 grid max-w-sm grid-cols-3 gap-2 opacity-60" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2 rounded-xl border border-border/50 p-3">
            <div className="skeleton h-2 w-10 rounded-full" />
            <div className="skeleton h-8 w-full rounded-lg" />
            <div className="skeleton h-2 w-16" />
          </div>
        ))}
      </div>
      {Icon && (
        <div className={cn('mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border bg-background/40', accent)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-body-sm text-muted-foreground">{detail}</p>
      {(ctaLabel && ctaHref) || (ctaLabel && onCta) ? (
        <div className="mt-5 flex justify-center">
          {ctaHref ? (
            <Button asChild theme={theme === 'amber' ? 'cyan' : theme} size="sm">
              <Link href={ctaHref}>
                {ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button theme={theme === 'amber' ? 'cyan' : theme} size="sm" onClick={onCta}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
