import { cn } from '@/lib/utils';

/** A single metric: value over a mono label. Data as the visual identity. */
export function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-border px-4 py-3', className)}>
      <p className="text-lg font-bold font-mono tabular-nums leading-none">{value}</p>
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1.5">{label}</p>
    </div>
  );
}
