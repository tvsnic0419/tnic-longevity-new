'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HallmarkCoverageRingProps {
  covered: number;
  total?: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function HallmarkCoverageRing({
  covered,
  total = 12,
  size = 'sm',
  showLabel = true,
  className,
}: HallmarkCoverageRingProps) {
  const pct = total > 0 ? Math.min(100, Math.round((covered / total) * 100)) : 0;
  const r = size === 'sm' ? 14 : 18;
  const stroke = size === 'sm' ? 3 : 4;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  const tone =
    pct >= 67 ? 'text-accent-emerald' : pct >= 40 ? 'text-accent-cyan' : 'text-accent-amber';

  return (
    <Link
      href="/stacks"
      className={cn(
        'focus-ring interactive inline-flex items-center gap-2 rounded-lg px-1 py-0.5 hover:bg-muted/40',
        className,
      )}
      title={`${covered} of ${total} hallmarks addressed by your stack`}
    >
      <svg
        width={size === 'sm' ? 36 : 44}
        height={size === 'sm' ? 36 : 44}
        viewBox="0 0 40 40"
        className={cn('-rotate-90', tone)}
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={stroke}
        />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <span className="font-mono text-[10px] md:text-xs leading-tight">
          <span className={cn('font-bold', tone)}>
            {covered}/{total}
          </span>
          <span className="block text-muted-foreground">hallmarks</span>
        </span>
      )}
    </Link>
  );
}