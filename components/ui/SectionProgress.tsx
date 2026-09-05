'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The homepage's location rail.
 *
 * Replaces the bespoke five-item rail that lived inside `HomeDescent`, which
 * covered only the cinematic overture and had two states (on / not-on), no
 * numerals, **no `aria-current`**, a ~25px hit area, no focus style of its own,
 * and `display: none` below 721px with nothing in its place.
 *
 * Three things changed beyond the state model:
 *
 *  - It now spans the **whole** page rather than the overture, which is what
 *    makes the numerals mean something: they are the page's own 01–06 chapter
 *    spine, the same numbers the section eyebrows and `CellularDivider` print.
 *    A rail numbered 1–5 over the overture would have contradicted a visible
 *    "01 / System" three inches away.
 *  - Steps already passed get a **complete** state — a state the old rail had
 *    no concept of.
 *  - On small screens it becomes a horizontally scrollable strip instead of
 *    disappearing, with the active step scrolled into view.
 *
 * `ScrollProgress` suppresses its own route rail on `/` precisely so the two
 * don't collide. That contract still holds — this is the only rail on the
 * homepage.
 */

export interface SectionProgressStep {
  /** The `id` of the section this step scrolls to. */
  targetId: string;
  /** Short label — one or two words. */
  label: string;
  /** Chapter numeral, e.g. "01". Omit for the overture scenes that have none. */
  numeral?: string;
}

export function SectionProgress({
  steps,
  ariaLabel = 'Page sections',
}: {
  steps: SectionProgressStep[];
  ariaLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // The mobile strip is fixed to the bottom edge, where BackToTop and the
  // toast region already live. Rather than hardcoding an offset into those
  // sitewide components — the strip only exists on the homepage — mark the
  // body while it is mounted and let one CSS block move everything out of the
  // way. See the `.has-section-strip` rules in globals.css.
  useEffect(() => {
    document.body.classList.add('has-section-strip');
    return () => document.body.classList.remove('has-section-strip');
  }, []);

  useEffect(() => {
    const els = steps
      .map((s, i) => ({ el: document.getElementById(s.targetId), i }))
      .filter((x): x is { el: HTMLElement; i: number } => Boolean(x.el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // The topmost intersecting section wins, so a tall section that
        // overlaps the next one doesn't flip the rail back and forth.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const hit = els.find((x) => x.el === visible.target);
        if (hit) setActive(hit.i);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((x) => io.observe(x.el));
    return () => io.disconnect();
  }, [steps]);

  // Keep the active step in view on the mobile strip — the whole point of a
  // strip is lost if the current position scrolls off the end of it.
  useEffect(() => {
    const strip = stripRef.current;
    const item = itemRefs.current[active];
    if (!strip || !item) return;
    if (strip.scrollWidth <= strip.clientWidth) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    item.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [active]);

  const goTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const item = (step: SectionProgressStep, i: number, layout: 'rail' | 'strip') => {
    const state = i === active ? 'active' : i < active ? 'complete' : 'default';
    return (
      <button
        key={step.targetId}
        ref={(el) => {
          if (layout === 'strip') itemRefs.current[i] = el;
        }}
        type="button"
        onClick={() => goTo(step.targetId)}
        // The old rail conveyed the current scene visually and only visually.
        aria-current={state === 'active' ? 'step' : undefined}
        className={cn(
          'focus-ring interactive group flex shrink-0 items-center gap-2.5',
          layout === 'rail'
            // A REAL 44px height, not `.tap-expand-y`. The rail is a column
            // with nothing beside it, so the control can simply be 44px —
            // and it must be: at the tick's natural 14px height the expanded
            // hit areas of adjacent steps overlapped so badly that clicking
            // one step activated another. Same failure the chip rows hit;
            // `.tap-expand-y` is for controls that genuinely cannot grow.
            ? 'min-h-[var(--space-touch)] w-full justify-end rounded px-1 text-right'
            : 'min-h-[var(--space-touch)] rounded-lg px-2.5',
          state === 'active'
            ? 'text-accent-cyan'
            : state === 'complete'
              ? 'text-accent-emerald'
              : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {layout === 'rail' ? (
          <>
            {/* Fixed-width and truncated rather than wrapping: labels like
                "04 MECHANISMS" used to wrap and clip against the rail's width.
                The plate now reserves room for them, so they stay on one line. */}
            <span
              className={cn(
                'text-label pointer-events-none w-[92px] shrink-0 truncate text-right transition-opacity duration-300',
                // main's rail kept labels legible at rest (opacity .54) rather
                // than hiding them until hover; that reads better and is kept.
                state === 'active'
                  ? 'opacity-100'
                  : 'opacity-55 group-hover:opacity-100 group-focus-visible:opacity-100',
              )}
            >
              {step.numeral ? `${step.numeral} ` : ''}
              {step.label.toUpperCase()}
            </span>
            {/* Complete gets a mark, not just a color — the same
                never-color-alone rule the evidence badges follow. */}
            {state === 'complete' ? (
              <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  'block h-0.5 shrink-0 rounded-full bg-current transition-all duration-300',
                  state === 'active' ? 'w-11 shadow-[0_0_12px_currentColor]' : 'w-6',
                )}
              />
            )}
          </>
        ) : (
          <>
            {state === 'complete' ? (
              <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full bg-current',
                  state === 'active' && 'shadow-[0_0_8px_currentColor]',
                )}
              />
            )}
            <span className="text-label whitespace-nowrap">
              {step.numeral ? `${step.numeral} ` : ''}
              {step.label.toUpperCase()}
            </span>
          </>
        )}
        <span className="sr-only">
          {state === 'complete' ? ' — passed' : state === 'active' ? ' — current section' : ''}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Desktop: a compact vertical rail pinned to the viewport's middle. */}
      <nav
        aria-label={ariaLabel}
        // Only as wide as the widest tick (44px) plus breathing room — the
        // labels float outside it, so a wider column would block clicks on
        // page content for no benefit.
        // gap-0 keeps the step pitch at exactly 44px — the step height — so
        // neighbouring hit areas tile without overlapping.
        className="pointer-events-none fixed right-[clamp(14px,2.5vw,30px)] top-1/2 z-40 hidden -translate-y-1/2 flex-col md:flex"
      >
        {/* Panel treatment ported from the rail this replaced (main's
            HomeDescent version): a bordered, blurred plate rather than bare
            ticks floating on the page. gap-0 keeps the step pitch at exactly
            44px — the step height — so neighbouring hit areas tile without
            overlapping. */}
        <div className="pointer-events-auto flex flex-col rounded-2xl border border-border/70 bg-[color-mix(in_srgb,var(--color-bg-base)_82%,transparent)] px-2 py-2 shadow-[0_12px_34px_-18px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {steps.map((s, i) => item(s, i, 'rail'))}
        </div>
      </nav>

      {/* Mobile: a horizontally scrollable strip, rather than nothing at all. */}
      <nav
        aria-label={ariaLabel}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-[var(--color-bg-base)]/90 backdrop-blur md:hidden"
      >
        <div
          ref={stripRef}
          className="scroll-region flex items-center gap-1 overflow-x-auto px-2 py-1"
        >
          {steps.map((s, i) => item(s, i, 'strip'))}
        </div>
      </nav>
    </>
  );
}
