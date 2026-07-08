import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  caption?: string;
  children: ReactNode;
  className?: string;
}

export function DataTable({ caption, children, className = '' }: DataTableProps) {
  return (
    <div className={cn('scroll-region rounded-2xl border border-border bg-card/40', className)}>
      <table className="table-base min-w-[36rem]">
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}