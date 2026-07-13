import { cn } from '@/lib/utils';
import { GlassPanel, type GlassPanelProps } from './GlassPanel';

/** A GlassPanel with sensible content padding — the default card surface. */
export function GlassCard({ className, depth = 2, ...rest }: GlassPanelProps) {
  return <GlassPanel depth={depth} className={cn('p-5 md:p-6', className)} {...rest} />;
}
