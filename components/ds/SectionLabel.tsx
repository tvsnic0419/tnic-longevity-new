import { cn } from '@/lib/utils';

/**
 * The signature small-label: mono, uppercase, wide tracking. One consistent
 * treatment for every section eyebrow across the platform.
 */
export function SectionLabel({
  children,
  className,
  as: Tag = 'p',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'h2' | 'h3';
}) {
  return (
    <Tag className={cn('text-[11px] font-mono uppercase tracking-[0.18em] text-accent-cyan', className)}>
      {children}
    </Tag>
  );
}
