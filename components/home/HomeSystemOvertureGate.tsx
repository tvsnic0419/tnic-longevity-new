'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-09-15; safe to keep. */

import { useLayoutEffect, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './HomeSystemOvertureGate.module.css';

const OVERTURE_IDS = ['molecule', 'system', 'goal'] as const;

/**
 * Phase 2 density: collapse HomeDescent Acts 1–3 (molecule / system / goal)
 * behind an "Explore the system" control without rewriting the large
 * HomeDescent module. Keeps deferred stages in the DOM (hidden) so integrity
 * pins for DeferredMoleculeStage / DeferredNetworkStage stay green.
 *
 * The control portals into `#arrive` (hero) when present; otherwise renders
 * inline after HomeDescent.
 */
export function HomeSystemOvertureGate() {
  const [open, setOpen] = useState(false);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    for (const id of OVERTURE_IDS) {
      const el = document.getElementById(id);
      if (el) el.hidden = !open;
    }
    if (open) document.documentElement.setAttribute('data-overture-open', '');
    else document.documentElement.removeAttribute('data-overture-open');
  }, [open]);

  useLayoutEffect(() => {
    for (const id of OVERTURE_IDS) {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    }
    const arrive = document.getElementById('arrive');
    if (arrive) {
      let host = document.getElementById('tnic-overture-gate-host') as HTMLElement | null;
      if (!host) {
        host = document.createElement('div');
        host.id = 'tnic-overture-gate-host';
        host.className = 'mt-4 w-full max-w-xl';
        arrive.appendChild(host);
      }
      setMountNode(host);
    }
  }, []);

  useEffect(() => {
    return () => {
      const host = document.getElementById('tnic-overture-gate-host');
      if (host && host.childElementCount === 0) host.remove();
    };
  }, []);

  const control = (
    <button
      type="button"
      className="focus-ring tnic-path inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-accent-cyan/30 bg-gradient-to-br from-accent-cyan/[0.08] to-transparent px-4 py-3 text-left"
      aria-expanded={open}
      aria-controls="tnic-system-overture-proxy"
      onClick={() => setOpen((v) => !v)}
    >
      <span className="min-w-0">
        <span className="block text-micro font-mono uppercase tracking-[0.12em] text-accent-cyan">
          {open ? 'ON' : '03'} · system overture
        </span>
        <span className="mt-0.5 block text-sm font-semibold text-foreground">
          {open ? 'Hide system overture' : 'Explore the system'}
        </span>
        <span className="mt-0.5 block text-caption text-muted-foreground">
          Molecule · synergy network · morbidity curve — optional theater
        </span>
      </span>
      <span className="text-lg text-accent-cyan" aria-hidden="true">
        {open ? '↑' : '↓'}
      </span>
    </button>
  );

  return (
    <>
      <div id="tnic-system-overture-proxy" className={`sr-only ${styles.root}`} aria-hidden="true" />
      {mountNode ? createPortal(control, mountNode) : (
        <div className="container-page relative z-10 -mt-2 mb-6 md:mb-8">{control}</div>
      )}
    </>
  );
}
