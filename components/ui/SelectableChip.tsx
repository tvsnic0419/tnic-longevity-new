'use client';

import { useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The canonical selection control — one grammar for every filter, toggle, and
 * questionnaire answer on the site.
 *
 * This replaces eight hand-rolled recipes that had drifted into three
 * different "selected" colors (the homepage NICO starter was violet, the full
 * NICO flow's chips were emerald while its own 1–5 scale in the same flow was
 * cyan, the elite filter was emerald) and hit areas as short as 30px. The
 * reference grammar is the elite-interventions filter chip — readable accent,
 * soft tinted surface, clear border — which the brief singled out as the
 * strongest starting point on the site.
 *
 * Selected always means emerald, drawn from `--surface-selected`, because
 * emerald is the site's "chosen / advance" signal. Pass `accent` only where a
 * section genuinely owns a different hue.
 *
 * Two shapes:
 *   `chip` — compact pill for filter rows. Stays visually small; the 44px tap
 *            area comes from `.tap-expand`, not from padding it out.
 *   `card` — a real selection card with a title, an explanatory line, and a
 *            checkmark. Used by the questionnaire and the selectable grids.
 */

export type SelectableChipShape = 'chip' | 'card';

export interface SelectableChipProps {
  selected: boolean;
  onSelect: () => void;
  label: string;
  /** Second line. Rendered on `card` only — a chip is not the place for prose. */
  description?: string;
  shape?: SelectableChipShape;
  /**
   * When set, the control is inert and this explains WHY (e.g. "You can pick
   * up to 3"). Rendered into an sr-only node wired via aria-describedby, and
   * applied as `aria-disabled` rather than `disabled` so the control keeps its
   * place in the tab order and the reason is actually reachable.
   */
  disabledReason?: string;
  /** Force the check indicator on `chip`. `card` always shows one. */
  showCheck?: boolean;
  /** Override the selected hue for a section that owns a different accent. */
  accent?: string;
  /**
   * Replaces the rendered label for chips whose label is *composed* — a count
   * beside an `EvidenceTag`, say. `label` is still required and becomes the
   * accessible name. Not an escape hatch for prose: a chip is still not the
   * place for explanatory content.
   */
  children?: React.ReactNode;
  className?: string;
}

const shapeStyles: Record<SelectableChipShape, string> = {
  chip: 'tap-expand rounded-full border px-3.5 py-1.5 font-mono text-micro font-semibold uppercase tracking-[0.12em]',
  card: 'min-h-[var(--space-touch)] w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold',
};

export function SelectableChip({
  selected,
  onSelect,
  label,
  description,
  shape = 'chip',
  disabledReason,
  showCheck,
  accent,
  children,
  className,
}: SelectableChipProps) {
  const reasonId = useId();
  const inert = Boolean(disabledReason);
  const withCheck = shape === 'card' || showCheck;

  return (
    <>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={children ? label : undefined}
        aria-disabled={inert || undefined}
        aria-describedby={inert ? reasonId : undefined}
        onClick={() => {
          if (!inert) onSelect();
        }}
        style={accent ? ({ '--selected-accent': accent } as React.CSSProperties) : undefined}
        className={cn(
          'focus-ring interactive inline-flex items-center gap-2 transition-all',
          shapeStyles[shape],
          selected
            ? 'border-[var(--surface-selected-border)] bg-[var(--surface-selected)] text-accent-emerald'
            : 'border-border/70 bg-card/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground',
          selected && accent && 'text-[var(--selected-accent)]',
          inert && 'cursor-not-allowed opacity-40',
          className,
        )}
      >
        {withCheck && (
          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 items-center justify-center rounded-md transition-all',
              shape === 'card' ? 'h-5 w-5' : 'h-4 w-4',
              selected
                ? 'bg-[var(--selected-accent,var(--accent-emerald))] text-[#04110c]'
                : 'border border-border',
            )}
          >
            {selected && <Check className={shape === 'card' ? 'h-3 w-3' : 'h-2.5 w-2.5'} />}
          </span>
        )}
        {children ?? (
          <span className="min-w-0">
            <span className="block">{label}</span>
            {description && shape === 'card' && (
              <span className="text-micro mt-0.5 block font-normal text-muted-foreground">
                {description}
              </span>
            )}
          </span>
        )}
      </button>
      {inert && (
        <span id={reasonId} className="sr-only">
          {disabledReason}
        </span>
      )}
    </>
  );
}
