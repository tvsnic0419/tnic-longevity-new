"use client";

import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AmbientTone — a route's palette anchor for the site-wide cinematic camera.
// Renders nothing; on mount it tints the two lead ambient orbs (the third orb
// stays constant as a cohesion anchor) by setting registered @property colors on
// <html>, and restores them on unmount. Because --ambient-tint-* are registered
// <color> custom properties (see app/globals.css), the change cross-fades as you
// move between hubs instead of snapping. SSR-safe — no markup, no layout shift.
// ─────────────────────────────────────────────────────────────────────────────

export type AmbientHue = "cyan" | "violet" | "rose" | "emerald" | "gold";

// [lead orb, second orb] — aligned with the viz/STYLE_GUIDE accent family.
const TONES: Record<AmbientHue, [string, string]> = {
  cyan:    ["rgba(56,189,248,0.50)",  "rgba(129,140,248,0.40)"],
  violet:  ["rgba(167,139,250,0.50)", "rgba(129,140,248,0.40)"],
  rose:    ["rgba(244,138,122,0.48)", "rgba(167,139,250,0.38)"],
  emerald: ["rgba(52,211,153,0.46)",  "rgba(56,189,248,0.38)"],
  gold:    ["rgba(240,196,106,0.48)", "rgba(244,138,122,0.38)"],
};

export function AmbientTone({ hue }: { hue: AmbientHue }) {
  useEffect(() => {
    const tone = TONES[hue];
    if (!tone) return;
    const root = document.documentElement;
    root.style.setProperty("--ambient-tint-1", tone[0]);
    root.style.setProperty("--ambient-tint-2", tone[1]);
    return () => {
      root.style.removeProperty("--ambient-tint-1");
      root.style.removeProperty("--ambient-tint-2");
    };
  }, [hue]);

  return null;
}
