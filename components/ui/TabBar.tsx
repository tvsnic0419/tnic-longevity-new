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
  /** Equal-width tabs — no horizontal scroll at ~390px (stacks mobile). */
  equalWidth?: boolean;
}

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  theme = 'cyan',
  ariaLabel,
  className = '',
  equalWidth = false,
}: TabBarProps<T>) {
  const t = themes[theme];

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        equalWidth
          ? 'surface-track grid w-full grid-cols-3 gap-1.5'
          : 'surface-track overflow-x-auto scroll-region',
        className,
      )}
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
              'focus-ring interactive flex items-center justify-center gap-2 px-3 py-3 min-h-[var(--space-touch)] rounded-xl text-sm font-semibold',
              equalWidth ? 'min-w-0 w-full' : 'shrink-0 px-4',
              isActive
                ? `${t.bgSolid} text-primary-foreground`
                : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]',
            )}
          >
            {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-label opacity-90">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
