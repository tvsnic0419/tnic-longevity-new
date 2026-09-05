'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import type { EvidenceTier } from '@/lib/types';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { AddToProtocol } from '@/components/ui/AddToProtocol';
import { isStackCompoundId } from '@/lib/compound-core';

/**
 * Sticky compound action rail for the deep-dive pages.
 *
 * The verified-pick / buy section sits far down a very long evidence page, so
 * once the hero scrolls away the reader's buy-intent has nowhere to go for the
 * rest of the read. This rail reveals after the hero, pinned just under the
 * fixed nav, keeping the compound identity + evidence tier + the primary
 * conversion action in reach the whole way down.
 *
 * - Reveal is driven by an IntersectionObserver sentinel placed at the rail's
 *   mount position (no scroll listener); it shows once that point scrolls above
 *   the viewport.
 * - It clears the fixed nav by measuring the nav's height (robust to the two
 *   nav heights + font-load reflow) rather than hard-coding an offset.
 * - While hidden it is `visibility: hidden` (out of the tab order and the a11y
 *   tree); reduced-motion drops the slide.
 */
export function CompoundStickyBar({
  name,
  tier,
  pathway,
  hasPick,
  buyAnchor = '#verified-pick',
  stackHref,
  compoundId,
}: {
  name: string;
  tier: EvidenceTier;
  pathway?: string;
  hasPick: boolean;
  buyAnchor?: string;
  stackHref?: string;
  /** Stack compound id — lets the rail carry the same one-tap "Add to protocol"
   *  verb as the hero (via AddToProtocol), instead of a navigate-away CTA. */
  compoundId?: string;
}) {
  // One conversion language: when the compound is stackable, the rail adds to
  // the protocol in place (matching the hero + StackDock). "Build a stack" only
  // survives as the fallback for non-stackable modules, which never showed the
  // hero's add control either.
  const stackable = compoundId ? isStackCompoundId(compoundId) : false;
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [top, setTop] = useState(64);

  useEffect(() => {
    // The main top nav specifically — not the first <nav> in the DOM (the
    // deep-dive's fixed scene-navigator is a <nav> too and would mis-measure).
    const measure = () =>
      setTop(
        document.querySelector<HTMLElement>('nav[aria-label="Main navigation"]')?.offsetHeight ?? 72,
      );
    // Reveal once the sentinel (mounted right after the hero) scrolls above the
    // viewport top. A rAF-throttled scroll read is used rather than an
    // IntersectionObserver because an instant/large scroll can move the sentinel
    // from below the viewport to above it without ever intersecting, which never
    // fires an IO callback (isIntersecting stays false). Same pattern the Nav
    // uses for its scrolled state.
    let raf = 0;
    const update = () => {
      raf = 0;
      measure();
      const el = sentinelRef.current;
      if (el) setShown(el.getBoundingClientRect().top < 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.fonts?.ready.then(update).catch(() => {});
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="compound-bar-sentinel" />
      <div
        className={`compound-bar${shown ? ' is-shown' : ''}`}
        style={{ top }}
        role="region"
        aria-label={`${name} — quick actions`}
        aria-hidden={!shown}
      >
        <div className="container-page compound-bar__inner">
          <div className="compound-bar__id">
            <span className="compound-bar__name">{name}</span>
            {pathway && <span className="compound-bar__path">{pathway}</span>}
            <EvidenceTag tier={tier} size="sm" showTooltip={false} className="shrink-0 whitespace-nowrap" />
          </div>
          <div className="compound-bar__cta">
            {stackable && compoundId && (
              <AddToProtocol compoundId={compoundId} name={name} size="sm" />
            )}
            {hasPick ? (
              <a href={buyAnchor} className="compound-bar__primary focus-ring">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                See the verified pick
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : !stackable && stackHref ? (
              <Link href={stackHref} className="compound-bar__primary focus-ring">
                Build a stack
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
