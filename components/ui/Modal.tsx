'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible dialog title (rendered in the header and wired to aria-labelledby). */
  title: string;
  /** Optional supporting line under the title (wired to aria-describedby). */
  description?: string;
  children: ReactNode;
  /** Optional footer row (right-aligned actions). */
  footer?: ReactNode;
  /** Extra classes for the panel — e.g. a wider `max-w-2xl`. */
  className?: string;
}

/**
 * Shared accessible dialog. Handles the things the hand-rolled overlays each
 * did differently or skipped: role="dialog"/aria-modal + labelled/described-by,
 * Escape to close, a Tab focus-trap, initial focus into the panel, body
 * scroll-lock, and focus restoration to the trigger on close.
 */
export function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const FOCUSABLE =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

    requestAnimationFrame(() => {
      const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel)?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable?.length) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/92" aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg glass rounded-2xl border border-border shadow-2xl overflow-hidden focus:outline-none',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-lg font-bold">{title}</h2>
          {description && (
            <p id={descId} className="text-body-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {children}
        {footer && (
          <div className="border-t border-border px-5 py-3 flex items-center justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}
