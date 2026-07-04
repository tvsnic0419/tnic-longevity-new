'use client';

import type { LucideIcon } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';
import { themes } from '@/lib/design-system';
import { cn } from '@/lib/utils';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: LucideIcon;
  badge?: string;
}

interface TabBarProps<T extends string> {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  theme?: ThemeAccent;
  ariaLabel: string;
  className?: string;
}

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  theme = 'cyan',
  ariaLabel,
  className = '',
}: TabBarProps<T>) {
  const t = themes[theme];

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex gap-2 overflow-x-auto scroll-region pb-1 -mx-1 px-1', className)}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              'focus-ring interactive shrink-0 flex items-center gap-2 px-4 py-3 min-h-[var(--space-touch)] rounded-xl text-sm font-semibold',
              isActive
                ? `${t.bgSolid} text-primary-foreground`
                : 'glass text-muted-foreground hover:text-foreground',
            )}
          >
            {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[10px] font-mono opacity-70">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}