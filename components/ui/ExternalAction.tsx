import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The canonical off-site action — the brief's fourth action primitive.
 *
 * Every commercial exit on the site used to hand-roll this, and the `rel`
 * attribute had drifted into five variants across the eight buy-link sites,
 * including two that shipped `rel="noreferrer"` with no `noopener` and one
 * with a different token order. `rel` is now decided here, once, and callers
 * cannot get it wrong.
 *
 * The external arrow is always present and always decorative; the accessible
 * name always says where the link goes and that it leaves the site, so a
 * screen-reader user gets the same warning a sighted user gets from the icon.
 *
 * Visual weight is the caller's call — `variant` covers the two treatments
 * already in use. This component deliberately does NOT decide whether the
 * retailer action outranks the on-site one; that is a per-surface decision.
 */

export type ExternalActionVariant = 'solid' | 'outline' | 'inline';

export interface ExternalActionProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel' | 'href' | 'children'> {
  href: string;
  /** Visible label, e.g. "Buy on Thorne". */
  children: ReactNode;
  /**
   * What the visitor is about to open, e.g. "Creatine Monohydrate from Thorne".
   * Rendered into the accessible name with the off-site warning appended.
   */
  destination: string;
  variant?: ExternalActionVariant;
  /** Set false for a link that is not commercial (a citation, a brand homepage). */
  sponsored?: boolean;
}

const variantStyles: Record<ExternalActionVariant, string> = {
  solid:
    'inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent-emerald/15 px-4 py-2.5 text-sm font-semibold text-accent-emerald transition-colors hover:bg-accent-emerald/25 min-h-[var(--space-touch)]',
  outline:
    'inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan min-h-[var(--space-touch)]',
  inline: 'inline-flex items-center gap-1 text-xs text-accent-emerald',
};

export function ExternalAction({
  href,
  children,
  destination,
  variant = 'solid',
  sponsored = true,
  className,
  ...props
}: ExternalActionProps) {
  return (
    <a
      href={href}
      target="_blank"
      // One canonical value. `noopener` is the security-relevant half and was
      // missing at two of the sites this replaces.
      rel={sponsored ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
      aria-label={`${destination} — opens the manufacturer's site in a new tab`}
      className={cn('focus-ring group/ext', variantStyles[variant], className)}
      {...props}
    >
      {children}
      <ExternalLink
        className={cn(
          'shrink-0 transition-transform duration-200',
          variant === 'inline' ? 'h-3 w-3' : 'h-3.5 w-3.5',
          'group-hover/ext:-translate-y-0.5 group-hover/ext:translate-x-0.5',
        )}
        aria-hidden="true"
      />
    </a>
  );
}
