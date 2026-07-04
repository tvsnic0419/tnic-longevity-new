'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';
  showValue?: boolean;
}

const colorMap = {
  cyan: 'from-accent-cyan to-accent-emerald',
  emerald: 'from-accent-emerald to-accent-cyan',
  violet: 'from-accent-violet to-accent-cyan',
  amber: 'from-accent-amber to-accent-rose',
  rose: 'from-accent-rose to-accent-amber',
};

export function Progress({ value, max = 100, label, color = 'cyan', showValue = true }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
          {showValue && <span className="text-xs font-mono text-muted-foreground">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full bg-gradient-to-r rounded-full', colorMap[color])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}