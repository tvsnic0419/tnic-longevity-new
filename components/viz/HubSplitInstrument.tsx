import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Shared hub-hero instrument — a real data figure, not atmosphere.
 *
 * Eleven hubs used to fill the right column with the decorative molecular
 * field. The library was the first to pass a derived split; this is that
 * panel as a primitive so every other hub with a countable set can do the
 * same. Counts are the caller's problem: this component never invents a
 * number, never hardcodes a colour. No heading — the page h1 lives in the
 * hero title beside this.
 */

export type HubSplitRow = {
  key: string;
  label: string;
  count: number;
  /** Bar fill. */
  color: string;
  /**
   * Label colour, when it has to differ from the bar. An accent that is right
   * as a 6px bar on a light ground is not necessarily legible as 14px text on
   * it — all three evidence-tier accents fail AA as light-theme body text, so
   * callers pass `TIER_INK_VAR` here beside `TIER_COLOR_VAR` above. Defaults
   * to `color`, which is correct wherever the two agree (every dark-theme
   * render, and any caller whose accent is already ink-safe).
   */
  ink?: string;
};

/** Hub theme name → CSS accent token. Used when a registry already names a theme. */
export const HUB_ACCENT_VAR: Record<string, string> = {
  cyan: 'var(--accent-cyan)',
  violet: 'var(--accent-violet)',
  emerald: 'var(--accent-emerald)',
  amber: 'var(--accent-amber)',
  rose: 'var(--accent-rose)',
  teal: 'var(--accent-emerald)',
  indigo: 'var(--accent-violet)',
  gold: 'var(--accent-amber)',
};

export function HubSplitInstrument({
  kicker,
  total,
  totalLabel,
  rows,
  footer,
  href,
  hrefLabel,
}: {
  kicker: string;
  total: number;
  totalLabel: string;
  rows: readonly HubSplitRow[];
  footer?: ReactNode;
  href?: string;
  hrefLabel?: string;
}) {
  const compact = rows.length > 4;
  const labelled = `${kicker}: ${total} ${totalLabel}`;

  return (
    <div className={`flex h-full min-h-[16rem] flex-col justify-between p-1 ${compact ? 'gap-3' : 'gap-5'}`}>
      <div>
        <p className="text-label text-[var(--color-text-faint)]">{kicker}</p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {total}
          <span className="ml-2 text-micro font-medium uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
            {totalLabel}
          </span>
        </p>
      </div>

      {/* `flex-1` + centred, not a plain block between two `justify-between`
          joints. A hub with three tiers in a panel stretched to the copy
          column's height left roughly 160px of dead space above the first bar
          and 90px below the last — measured on /insights at 1440x900 — so the
          count, the bars and the footnote read as three unrelated fragments
          floating in a box rather than one instrument. Taking the leftover
          height and centring in it puts the rows on the panel's optical middle
          at any row count, which is what the sixteen hubs that share this
          primitive all needed. */}
      <ul
        className={
          compact
            // Five or more rows already fill the panel; centring a list that
            // can outgrow its box would clip it at both ends instead of one.
            ? 'flex flex-col gap-2'
            : 'flex flex-1 flex-col justify-center gap-4'
        }
        aria-label={labelled}
      >
        {rows.map((row) => {
          const pct = total ? (row.count / total) * 100 : 0;
          return (
            <li key={row.key}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-body-sm font-semibold" style={{ color: row.ink ?? row.color }}>
                  {row.label}
                </span>
                {/* The count is the figure's whole payload, and it used to be
                    the smallest, faintest thing in the panel — 11px muted mono
                    against a 14px semibold coloured label. On a hub that grades
                    evidence, the reader's eye should land on "71", not on the
                    word next to it. Value type, full-contrast, with the share
                    of the whole beside it so the bar's length has a number. */}
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-foreground">
                  {row.count}
                  {total > 0 && (
                    <span className="ml-1.5 text-micro font-medium text-[var(--color-text-faint)]">
                      {Math.round(pct)}%
                    </span>
                  )}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: row.color,
                    minWidth: row.count > 0 ? '0.25rem' : 0,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {(footer || href) && (
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t border-[var(--color-border-subtle)] pt-3">
          {footer ? (
            <p className="text-micro text-[var(--color-text-muted)]">{footer}</p>
          ) : (
            <span />
          )}
          {href && hrefLabel ? (
            <Link
              href={href}
              className="action-link focus-ring rounded text-micro font-semibold text-accent-cyan hover:underline"
            >
              {hrefLabel}
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
