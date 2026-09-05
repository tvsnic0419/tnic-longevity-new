'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ListTree, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ReadingToc — persistent section wayfinding for the site's long-form pages.
//
// Why this exists: a compound deep-dive runs ~24,000px on a 390px phone (about
// 30 screens) and ~13,000px on desktop, across 13 sections. The only in-page
// navigation was a static "On this page" panel sitting inline near the top —
// it scrolls out of view within the first ~5% of the page and never comes
// back, so for the remaining 95% a reader has no way to see where they are or
// jump to the section they came for. The one persistent rail on the site
// (ScrollProgress) navigates top-level ROUTES, not sections, and only renders
// at >=1280px.
//
// Behaviour:
//  - The inline panel keeps its existing markup and server-rendered links, so
//    nothing regresses for SEO/no-JS; it just gains an active-section highlight.
//  - Once the inline panel scrolls out of view, a compact control docks at the
//    bottom-left (deliberately: BackToTop owns bottom-right, CompoundStickyBar
//    owns the top) showing the current section and expanding to the full list.
//  - Scroll-spy picks the last heading above the reading line, so the active
//    item matches what the reader is actually looking at.
// ─────────────────────────────────────────────────────────────────────────────

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/** Matches the sitewide anchor scroll-margin so "active" tracks the same line
 *  the browser scrolls a heading to. */
const READING_LINE_OFFSET = 96;

export function ReadingToc({
  headings,
  readingMinutes,
}: {
  headings: TocHeading[];
  readingMinutes: number;
}) {
  const inlineRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');
  const [docked, setDocked] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll-spy: the active section is the last heading whose top has passed
  // the reading line. rAF-throttled — this runs on every scroll frame.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0]?.id ?? '';
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= READING_LINE_OFFSET) current = h.id;
        else break;
      }
      setActiveId(current);

      // Dock only once the inline panel has scrolled ABOVE the reading line.
      // "Not intersecting" is not the right test: it is equally true before the
      // reader has reached the panel, which would float the control over the
      // hero from the very first paint.
      // Require a real measurement before docking. An unlaid-out or hidden
      // element reports an all-zero rect, and a bare "bottom < offset" test
      // reads that as "already scrolled past" — which would float the control
      // over the hero before the reader has reached the panel at all.
      const panel = inlineRef.current;
      const rect = panel?.getBoundingClientRect();
      setDocked(!!rect && rect.height > 0 && rect.bottom < READING_LINE_OFFSET);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [headings]);

  // A docked panel that is open should close on Escape, like any other overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const jump = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return; // let the browser follow the href normally
    e.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    // Move focus so keyboard and screen-reader users land in the section too.
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    history.replaceState(null, '', `#${id}`);
    setOpen(false);
  }, []);

  const activeHeading = headings.find((h) => h.id === activeId) ?? headings[0];

  return (
    <>
      {/* ── Inline panel (unchanged position in the flow, now scroll-aware) ── */}
      <nav
        ref={inlineRef}
        aria-label="On this page"
        className="not-prose mb-8 rounded-xl border border-border bg-muted/20 p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ListTree className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
            <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground">
              On this page
            </p>
          </div>
          <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground">
            ~{readingMinutes} min read
          </p>
        </div>
        <ul className="space-y-1.5">
          {headings.map((h) => {
            const isActive = h.id === activeId;
            return (
              <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => jump(e, h.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`focus-ring rounded text-sm transition-colors hover:text-accent-cyan ${
                    isActive ? 'font-medium text-accent-cyan' : 'text-muted-foreground'
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Docked control, once the inline panel is gone ─────────────────── */}
      {docked && activeHeading && createPortal(
        <nav className="reading-toc-dock print:hidden" aria-label="Section navigation">
          {open && (
            <div
              id="reading-toc-panel"
              className="reading-toc-panel"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
                <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground">
                  Jump to section
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close section list"
                  className="focus-ring interactive rounded p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <ul className="reading-toc-list">
                {headings.map((h) => {
                  const isActive = h.id === activeId;
                  return (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        onClick={(e) => jump(e, h.id)}
                        aria-current={isActive ? 'location' : undefined}
                        className={`focus-ring block rounded px-2 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-accent-cyan ${
                          h.level === 3 ? 'pl-5' : ''
                        } ${isActive ? 'font-medium text-accent-cyan' : 'text-muted-foreground'}`}
                      >
                        {h.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <button
            type="button"
            // Opens on pointerdown, not click. Measured on this fixed control:
            // the browser does not reliably synthesise a click from pointer
            // input here — pointerdown lands on the button, but the matching
            // click can fail to follow, leaving an onClick-only trigger dead to
            // both mouse and touch. pointerdown is the one event guaranteed to
            // land on the element actually pressed, and opening a menu on press
            // is a long-standing pattern. Keyboard activation still arrives as a
            // click with detail === 0 and is handled below, so Enter and Space
            // keep working.
            onPointerDown={() => setOpen((v) => !v)}
            onClick={(e) => {
              if (e.detail === 0) setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls={open ? 'reading-toc-panel' : undefined}
            className="reading-toc-trigger focus-ring"
          >
            <ListTree className="h-4 w-4 shrink-0 text-accent-cyan" aria-hidden="true" />
            <span className="reading-toc-trigger__label">
              <span className="sr-only">Jump to section. Currently reading: </span>
              {activeHeading.text}
            </span>
          </button>
        </nav>,
        document.body,
      )}
    </>
  );
}
