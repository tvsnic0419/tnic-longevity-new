import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** A linked hallmark pill — hairline border, accent on hover. Never a dead end. */
export function HallmarkChip({
  slug,
  title,
  className,
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  return (
    <Link
      href={`/library/${slug}`}
      className={cn(
        'focus-ring group inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors',
        className,
      )}
    >
      {title}
      <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
    </Link>
  );
}
