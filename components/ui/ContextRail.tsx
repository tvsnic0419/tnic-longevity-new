'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { HelpCircle, Lightbulb, ArrowRight } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';
import { themes } from '@/lib/design-system';

export interface ContextItem {
  label: string;
  text: string;
  icon?: LucideIcon;
}

interface ContextRailProps {
  what: string;
  why: string;
  next?: string;
  theme?: ThemeAccent;
  className?: string;
}

const defaultIcons = [HelpCircle, Lightbulb, ArrowRight] as const;

export function ContextRail({ what, why, next, theme = 'cyan', className = '' }: ContextRailProps) {
  const t = themes[theme];
  const items: ContextItem[] = [
    { label: 'What this is', text: what, icon: HelpCircle },
    { label: 'Why it matters', text: why, icon: Lightbulb },
    ...(next ? [{ label: 'What to do next', text: next, icon: ArrowRight }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      className={`context-rail ${className}`}
      role="group"
      aria-label="Section context"
    >
      {items.map((item, i) => {
        const Icon = item.icon ?? defaultIcons[i] ?? HelpCircle;
        return (
          <div key={item.label} className="context-rail-item">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={`w-3.5 h-3.5 ${t.text}`} aria-hidden="true" />
              <p className={`context-rail-label ${t.text}`}>{item.label}</p>
            </div>
            <p className="text-body-sm leading-relaxed">{item.text}</p>
          </div>
        );
      })}
    </motion.div>
  );
}