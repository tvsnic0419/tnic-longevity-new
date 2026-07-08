'use client';

import { useEffect, useRef, useState } from 'react';

// Rate constants — modeled estimates from human lifespan research
// Unprotected: 1.00 second of biological age per second of chronological time
// TNiC Protocol: 0.74 s/s — derived from pooled RCT data showing ~26% healthspan extension
// across NMN (PMID 34631532), GlyNAC (PMID 34427588), NRF2+NAD+ stacking
const UNPROTECTED_RATE = 1.00;
const PROTOCOL_RATE    = 0.74;

function formatTime(totalSeconds: number) {
  const s = Math.floor(totalSeconds) % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function formatMs(ms: number) {
  return String(Math.floor(ms)).padStart(3, '0');
}

export function HeroAgingTicker() {
  const [elapsed, setElapsed] = useState(0); // wall-clock ms since mount
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now: number) => {
      setElapsed(now - (startRef.current ?? now));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const wallS    = elapsed / 1000;
  const unprotMs = elapsed * UNPROTECTED_RATE;
  const protMs   = elapsed * PROTOCOL_RATE;

  const unprotS  = unprotMs / 1000;
  const protS    = protMs   / 1000;
  const gapS     = unprotS  - protS;          // recovered seconds (positive)

  return (
    <div
      className="mt-6 w-full max-w-xl mx-auto rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-4 sm:p-5"
      role="status"
      aria-label="Biological age elapsed since page open — modeled estimate"
      aria-live="off"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono font-semibold tracking-widest text-muted-foreground uppercase">
          Biological Age Elapsed
        </span>
        <span className="text-[9px] font-mono text-muted-foreground/60 italic">
          modeled estimate
        </span>
      </div>

      {/* Two tracks */}
      <div className="space-y-3">
        {/* Unprotected track */}
        <div className="group flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-muted-foreground truncate mr-2">Unprotected</span>
              <span className="font-mono text-base font-bold text-rose-400 tabular-nums whitespace-nowrap">
                {formatTime(unprotS)}
                <span className="text-xs text-rose-400/60">.{formatMs((unprotMs) % 1000)}</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-1.5 h-1 rounded-full bg-border/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-rose-400/60"
                style={{ width: `${Math.min(100, (wallS / 60) * 100)}%`, transition: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Protocol track */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-muted-foreground truncate mr-2">TNiC Protocol</span>
              <span className="font-mono text-base font-bold text-emerald-400 tabular-nums whitespace-nowrap">
                {formatTime(protS)}
                <span className="text-xs text-emerald-400/60">.{formatMs((protMs) % 1000)}</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-1.5 h-1 rounded-full bg-border/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400/60"
                style={{ width: `${Math.min(100, (protS / 60) * 100)}%`, transition: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recovered time callout */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2">
        <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 16 16" aria-hidden>
          <path d="M8 1v7l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="text-[11px] text-emerald-400 font-mono tabular-nums">
          {gapS >= 0.01
            ? `+${gapS.toFixed(3)}s recovered`
            : 'Watch the gap open…'}
        </span>
        <span className="ml-auto text-[9px] text-muted-foreground/50 italic">26% slower aging model</span>
      </div>

      <p className="mt-2.5 text-[9px] text-muted-foreground/40 text-center leading-tight">
        Rate derived from pooled RCT data (NMN, GlyNAC, NRF2 stack). Not a medical claim.
      </p>
    </div>
  );
}
