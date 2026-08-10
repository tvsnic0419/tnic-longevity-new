import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Shared disclosure/accordion — native <details>/<summary> under the hood, so
 * it works with zero JS and is keyboard/screen-reader accessible out of the box.
 * Replaces the hand-rolled <details> FAQ markup that was duplicated across the
 * supplement-guide pages with divergent chevrons and surfaces.
 */
interface AccordionItemProps {
  /** Summary/trigger content. */
  question: ReactNode;
  /** Panel body. */
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({ question, children, defaultOpen, className }: AccordionItemProps) {
  return (
    <details open={defaultOpen} className={cn('group card-base overflow-hidden', className)}>
      <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium">
        <span className="flex-1">{question}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-border/40 px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </details>
  );
}

/** Vertical stack wrapper for a set of AccordionItems. */
export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
}
