import type { ReactNode } from 'react';

/**
 * Shared control recipe for text inputs / selects / textareas, so form fields
 * across the site render on one consistent surface instead of each re-declaring
 * the border/background/padding. Spread onto the control's className.
 */
export const fieldControlClass =
  'w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus-ring';

interface FieldProps {
  /** Must match the control's id so the label associates with it. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  /** The control (input/select/textarea) — give it id={id} and fieldControlClass. */
  children: ReactNode;
}

/** Label + control + hint/error layout for a form field. Pairs the label to the
 *  control via the shared id and renders an error (or hint) line beneath it. */
export function Field({ id, label, hint, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-label block mb-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-caption text-accent-rose mt-1.5">{error}</p>
      ) : hint ? (
        <p className="text-caption text-muted-foreground mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}
