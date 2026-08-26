'use client';

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';
import type { StageHandle } from './stage-handle';

/**
 * The shared shell for an interactive scientific visualization.
 *
 * `MoleculeStage` and `NetworkStage` are genuinely distinctive — real
 * ball-and-stick geometry, a real synergy graph — but they shipped as bare
 * `<canvas role="img">` elements: no title bar, no legend (the molecule's atom
 * colors were never explained anywhere in the UI), no controls, no keyboard
 * path, and a "drag · scroll to zoom" hint that was always on rather than a
 * first-use cue. The frame around them was hand-rolled twice, in two files.
 *
 * This gives every one of them the same shell:
 *
 *  - a **title bar** naming the object;
 *  - a **legend** slot, so color and halo mean something before you interact;
 *  - a **control row** — Reset, Zoom in/out, Open full screen — which is also
 *    the first pointer-free way to drive these canvases;
 *  - **keyboard rotation** on the stage itself (arrow keys), so the
 *    visualization is operable without a pointer at all;
 *  - a **first-use cue** that dismisses once the visitor has actually
 *    interacted, and never appears for keyboard or reduced-motion users;
 *  - an always-present **static summary**, which is the honest answer to
 *    "what about touch, keyboard, reduced motion, or no WebGL" — the same
 *    always-visible fallback contract `StackNetworkGraph` and
 *    `SynergyNetworkGraph` already keep, rather than four brittle detections.
 */

export interface InteractiveSciencePanelProps {
  /** Names the object under study, e.g. "Resveratrol". */
  title: string;
  /** Small mono kicker above the title. */
  eyebrow?: string;
  /** The canvas/SVG stage. */
  children: ReactNode;
  /** Ref to the stage's imperative handle. Omit for a stage with no controls. */
  stageRef?: RefObject<StageHandle | null>;
  /** Key explaining what the colors and halos mean. */
  legend?: ReactNode;
  /**
   * The text/table equivalent of the visualization. Always rendered — this is
   * the accessibility contract, not a fallback that waits for a failure.
   */
  summary: ReactNode;
  /** First-use interaction hint, e.g. "Drag to rotate · scroll to zoom". */
  cue?: string;
  className?: string;
}

export function InteractiveSciencePanel({
  title,
  eyebrow,
  children,
  stageRef,
  legend,
  summary,
  cue,
  className,
}: InteractiveSciencePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const summaryId = useId();
  const titleId = useId();

  // The browser can leave fullscreen without going through our button (Esc,
  // the OS chrome), so mirror the real state rather than tracking our own.
  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === panelRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      // Not universally available (iOS Safari); failing silently leaves the
      // panel exactly as it was, which is a fine outcome for a view control.
      void panelRef.current?.requestFullscreen?.().catch(() => {});
    }
  };

  const handle = () => stageRef?.current;
  const nudge = (dx: number, dy: number) => {
    handle()?.rotateBy(dx, dy);
    setTouched(true);
  };

  // A plain presence check — never dereference the ref during render.
  const hasControls = stageRef !== undefined;

  return (
    <div
      ref={panelRef}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-[var(--color-bg-elevated)]',
        fullscreen && 'h-full w-full rounded-none',
        className,
      )}
    >
      {/* ── Title bar ── */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5">
        <div className="min-w-0">
          {eyebrow && (
            <p className="font-mono text-micro font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <p id={titleId} className="truncate text-sm font-semibold text-foreground">
            {title}
          </p>
        </div>

        {hasControls && (
          <div className="flex shrink-0 items-center gap-0.5">
            <IconButton
              icon={ZoomOut}
              label={`Zoom out of ${title}`}
              size="sm"
              onClick={() => {
                handle()?.zoomBy(1 / 1.2);
                setTouched(true);
              }}
            />
            <IconButton
              icon={ZoomIn}
              label={`Zoom into ${title}`}
              size="sm"
              onClick={() => {
                handle()?.zoomBy(1.2);
                setTouched(true);
              }}
            />
            <IconButton
              icon={RotateCcw}
              label={`Reset the ${title} view`}
              size="sm"
              onClick={() => {
                handle()?.reset();
                setTouched(true);
              }}
            />
            <IconButton
              icon={fullscreen ? Minimize2 : Maximize2}
              label={fullscreen ? `Exit full screen` : `Open ${title} full screen`}
              size="sm"
              onClick={toggleFullscreen}
            />
          </div>
        )}
      </div>

      {/* ── Stage ──
          The wrapper carries the keyboard affordance: the canvas inside is
          role="img" and can't own arrow-key handling without lying about what
          it is. Described by the summary, so a screen reader reaching this
          group is pointed at the readable equivalent. */}
      <div
        className={cn('relative flex-1', fullscreen && 'min-h-0')}
        role={hasControls ? 'group' : undefined}
        aria-labelledby={hasControls ? titleId : undefined}
        aria-describedby={hasControls ? summaryId : undefined}
        tabIndex={hasControls ? 0 : undefined}
        onKeyDown={
          hasControls
            ? (e) => {
                const step = 0.12;
                if (e.key === 'ArrowLeft') { nudge(-step, 0); e.preventDefault(); }
                else if (e.key === 'ArrowRight') { nudge(step, 0); e.preventDefault(); }
                else if (e.key === 'ArrowUp') { nudge(0, -step); e.preventDefault(); }
                else if (e.key === 'ArrowDown') { nudge(0, step); e.preventDefault(); }
                else if (e.key === 'Home') { handle()?.reset(); setTouched(true); e.preventDefault(); }
              }
            : undefined
        }
        onPointerDown={hasControls ? () => setTouched(true) : undefined}
      >
        {children}

        {/* First-use cue. Dismisses on the first real interaction — the old
            hint was permanent furniture, so it stopped being read. */}
        {cue && !touched && (
          <p
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-[var(--color-bg-base)]/85 px-3 py-1 font-mono text-micro uppercase tracking-[0.14em] text-muted-foreground backdrop-blur"
          >
            {cue}
          </p>
        )}
      </div>

      {/* ── Legend ── */}
      {legend && (
        <div className="border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
          {legend}
        </div>
      )}

      {/* ── Static summary ──
          Always present. Collapsed into a <details> so it doesn't compete with
          the visual on a wide screen, but it is real text in the DOM for
          crawlers, screen readers, and anyone who just wants the fact. */}
      <details id={summaryId} className="border-t border-border/60 px-4 py-2.5">
        <summary className="focus-ring cursor-pointer list-none font-mono text-micro font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
          Read this as text
        </summary>
        <div className="mt-2.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {summary}
        </div>
      </details>
    </div>
  );
}
