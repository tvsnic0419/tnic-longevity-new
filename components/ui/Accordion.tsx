'use client';

import { useState, useId, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  theme?: 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald';
}

const badgeColors = {
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
  rose: 'text-accent-rose',
  amber: 'text-accent-amber',
  emerald: 'text-accent-emerald',
};

export function Accordion({
  title,
  children,
  defaultOpen = false,
  badge,
  theme = 'cyan',
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const headerId = useId();

  return (
    <div className="card-base overflow-hidden">
      <button
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="focus-ring w-full flex items-center justify-between gap-4 p-5 text-left interactive hover:bg-muted/30"
      >
        <div className="min-w-0">
          <h3 className="heading-card">{title}</h3>
          {badge && (
            <span className={`text-label mt-1 block ${badgeColors[theme]}`}>{badge}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
        className="px-5 pb-5 border-t border-border"
      >
        <div className="pt-5 text-body-sm">{children}</div>
      </div>
    </div>
  );
}