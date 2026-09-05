"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import { eliteInterventions } from "@/lib/elite-interventions";
import { COMPOUND_COUNT } from "@/lib/library-modules";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DeferredMoleculeStage, DeferredNetworkStage } from "@/components/home/DeferredCinematicStage";
import { InteractiveSciencePanel } from "@/components/viz/InteractiveSciencePanel";
import type { StageHandle } from "@/components/viz/stage-handle";
import type { NetworkNode, NetworkEdge } from "@/components/viz/NetworkStage";
import { HUES } from "@/components/viz/tokens";
import { runWhenVisible, cappedDpr, fitCanvas } from "@/lib/raf-visibility";
import { createGlowCache, blitGlow } from "@/lib/canvas-glow";

// Canvas draw colors are plain rgba literals (not CSS custom properties), so
// they can't pick up the `.tnic-descent` light-theme override in the CSS
// block below automatically — this reads the resolved theme once at effect
// setup so the shimmer/cursor-glow canvases don't render as a full-intensity
// dark-mode neon glow on a light background. Read once (not subscribed) is a
// deliberate scope boundary: it covers "page loads in light mode," not "user
// toggles theme while this ambient background is on screen," which the rest
// of the CSS-driven theming handles live but a canvas repaint would need a
// dedicated theme subscription for — out of scope for ambient decoration.
function isLightTheme(): boolean {
  return typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light';
}

// ─────────────────────────────────────────────────────────────────────────────
// TNiC · "Descent" — a captivate-on-arrival scrollytelling section
// Five acts that share one camera: cellular shimmer → 3D resveratrol →
// synergy network wired to real elite picks → morbidity-compression timeline
// → a landing beat that hands the reader into the rest of the homepage.
// Rendering is a single-pass canvas + SVG stack (no r3f dep). All fixed
// backdrops are scoped to the section wrapper so nothing bleeds onto the
// pages below.
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `

.tnic-descent {
  --void: #050710;
  --void2: #0a0e1e;
  --void3: #030510;
  --panel: #0e1426;
  --panel2: #131a30;
  --line: rgba(150,170,220,0.14);
  --cyan: #5fe3e0;
  --indigo: #8c8cf5;
  --violet: #b98cf0;
  --gold: #f0c46a;
  --rose: #f08a7a;
  --amber: #eaa24a;
  --ink: #eef2fb;
  --muted: #96a0bc;
  --faint: #7d88a8;
  --vignette-edge: rgba(3,5,12,0.85);
  position: relative;
  background:
    radial-gradient(140% 60% at 50% 0%, var(--void2) 0%, var(--void) 45%, var(--void3) 100%);
  color: var(--ink);
  font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
  isolation: isolate;
}
.tnic-descent * { box-sizing: border-box; }

/* ── Light theme ──
   Re-tints every custom property above from app/globals.css's own light
   tokens (--color-bg-base/elevated, --color-text-primary/secondary/muted) —
   not an improvised second palette. Accents stay closer to their dark-theme
   values (cyan/indigo/gold etc. already read fine on a light backdrop; only
   void/panel/ink/muted, which assume a near-black canvas, actually break). */
:root[data-theme="light"] .tnic-descent {
  --void: #f8fafc;
  --void2: #eef2f7;
  --void3: #e2e8f0;
  --panel: #ffffff;
  --panel2: #f1f5f9;
  --line: rgba(15,23,42,0.10);
  --ink: #0f172a;
  --muted: #475569;
  --faint: #64748b;
  --vignette-edge: rgba(226,232,240,0.85);
}

.tnic-layer {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; display: block;
}
.tnic-shimmer { z-index: 0; height: 100svh; }
.tnic-cursor  { z-index: 1; height: 100svh; mix-blend-mode: screen; opacity: .85; }
.tnic-vignette {
  z-index: 2;
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(95,227,224,0.07), transparent 45%),
    radial-gradient(140% 120% at 50% 120%, rgba(240,196,106,0.06), transparent 55%),
    radial-gradient(100% 100% at 50% 50%, transparent 55%, var(--vignette-edge) 100%);
}
.tnic-grid {
  z-index: 1; opacity: .35;
  background:
    linear-gradient(rgba(150,170,220,0.05) 1px, transparent 1px) 0 0/60px 60px,
    linear-gradient(90deg, rgba(150,170,220,0.05) 1px, transparent 1px) 0 0/60px 60px;
  mask-image: radial-gradient(90% 70% at 50% 40%, #000 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(90% 70% at 50% 40%, #000 40%, transparent 100%);
}
/* ── Volumetric arrival light ──
   A single restrained light source high on the arrival screen: a soft cyan
   "sun" that lifts the headline off the void, plus two faint, near-vertical
   god-ray beams for depth. Sits at the very back (z:0, first layer) so the
   particle shimmer and grid composite over it — it deepens the background,
   never washes the foreground. Height is capped to the first screen so it
   reads as the atmosphere of the arrival, not the whole descent. The drift is
   a 34s barely-perceptible breath, disabled under reduced-motion. */
.tnic-aurora {
  z-index: 0; height: 118svh; opacity: .9;
  background:
    radial-gradient(52% 42% at 30% 8%, color-mix(in srgb, var(--cyan) 24%, transparent) 0%, transparent 58%),
    radial-gradient(40% 40% at 82% 4%, color-mix(in srgb, var(--emerald) 12%, transparent) 0%, transparent 62%),
    conic-gradient(from 180deg at 34% -14%,
      transparent 0deg,
      color-mix(in srgb, var(--cyan) 9%, transparent) 12deg,
      transparent 26deg,
      transparent 150deg,
      color-mix(in srgb, var(--emerald) 7%, transparent) 172deg,
      transparent 192deg);
  mask-image: linear-gradient(180deg, #000 0%, #000 44%, transparent 82%);
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 44%, transparent 82%);
  transform-origin: 40% 0%;
  animation: tnic-aurora-drift 34s ease-in-out infinite;
}
:root[data-theme="light"] .tnic-aurora { opacity: .5; }
@keyframes tnic-aurora-drift {
  0%, 100% { transform: translate3d(-1.5%, 0, 0) scale(1.02); opacity: .82; }
  50%      { transform: translate3d(2.5%, 0, 0) scale(1.06); opacity: 1; }
}

.tnic-act {
  position: relative; z-index: 3;
  min-height: 100svh;
  display: flex; flex-direction: column; justify-content: center;
  padding: clamp(24px, 6vw, 80px);
  max-width: 1240px; margin: 0 auto; width: 100%;
}

.tnic-kicker {
  font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
  font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--cyan); margin: 0 0 20px;
  display: inline-flex; align-items: center; gap: 12px;
  opacity: 0; transform: translateY(14px);
  transition: opacity .5s var(--ease-entrance, cubic-bezier(.16,1,.3,1)), transform .5s var(--ease-entrance, cubic-bezier(.16,1,.3,1));
}
.tnic-kicker::before { content: ''; width: 26px; height: 1px; background: var(--cyan); opacity: .6; }

.tnic-h1 {
  font-family: var(--font-display, 'Fraunces', Georgia, serif); font-weight: 400;
  font-size: clamp(44px, 9vw, 108px); line-height: 0.96;
  letter-spacing: -0.025em; margin: 0; color: var(--ink);
  opacity: 0; transform: translateY(22px);
  transition: opacity .58s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .04s, transform .58s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .04s;
}
.tnic-h1 em { font-style: italic; color: var(--cyan); }
.tnic-h1 .warm { color: var(--gold); font-style: italic; }

.tnic-h2 {
  font-family: var(--font-display, 'Fraunces', Georgia, serif); font-weight: 400;
  font-size: clamp(32px, 6.2vw, 66px); line-height: 1.02;
  letter-spacing: -0.02em; margin: 0; color: var(--ink);
  opacity: 0; transform: translateY(20px);
  transition: opacity .58s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .04s, transform .58s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .04s;
}
.tnic-h2 em { font-style: italic; color: var(--cyan); }
.tnic-h2 .warm { color: var(--gold); font-style: italic; }

.tnic-lead {
  font-size: clamp(15px, 2.1vw, 19px); line-height: 1.6;
  color: var(--muted); max-width: 52ch; margin: 22px 0 0;
  opacity: 0; transform: translateY(16px);
  transition: opacity .54s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .1s, transform .54s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .1s;
}
.tnic-trustline {
  display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 18px;
  max-width: 720px; color: var(--faint);
  font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
  font-size: 10px; letter-spacing: .08em; text-transform: uppercase;
  opacity: 0; transform: translateY(12px);
  transition: opacity .5s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .16s, transform .5s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .16s;
}
.tnic-trustline span { display: inline-flex; align-items: center; gap: 7px; }
.tnic-trustline span::before { content: '•'; color: var(--cyan); font-size: 14px; line-height: 0; }
.tnic-note {
  font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
  font-size: 11.5px; letter-spacing: .04em; color: var(--faint);
  margin-top: 14px;
  opacity: 0; transition: opacity 1s ease .5s;
}

.is-in .tnic-kicker,
.is-in .tnic-h1,
.is-in .tnic-h2,
.is-in .tnic-lead,
.is-in .tnic-trustline,
.is-in .tnic-note,
.is-in .tnic-stage,
.is-in .tnic-molcard,
.is-in .tnic-hero-badges,
.is-in .tnic-paths,
.is-in .tnic-final { opacity: 1; transform: none; }

.tnic-hero {
  align-items: flex-start;
  text-align: left;
  isolation: isolate;
}
/* The first screen should feel atmospheric but never empty. These low-contrast
   orbital planes focus the arrival moment without suggesting an actual molecular
   structure or competing with the real render in Act 1. */
.tnic-hero::before,
.tnic-hero::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: -1;
}
.tnic-hero::before {
  width: min(70vw, 820px);
  aspect-ratio: 1;
  right: -10vw;
  top: 50%;
  transform: translateY(-50%);
  border: 1px solid color-mix(in srgb, var(--cyan) 15%, transparent);
  border-radius: 50%;
  box-shadow:
    0 0 0 52px color-mix(in srgb, var(--cyan) 5%, transparent),
    0 0 0 132px color-mix(in srgb, var(--indigo) 3%, transparent),
    0 0 150px 36px color-mix(in srgb, var(--cyan) 8%, transparent);
  opacity: .9;
}
.tnic-hero::after {
  inset: 16% 4% 14% 46%;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--cyan) 16%, transparent) 1px, transparent 1px) 0 0 / 72px 72px,
    linear-gradient(color-mix(in srgb, var(--cyan) 12%, transparent) 1px, transparent 1px) 0 0 / 72px 72px;
  mask-image: radial-gradient(75% 80% at 70% 50%, #000 0%, transparent 72%);
  -webkit-mask-image: radial-gradient(75% 80% at 70% 50%, #000 0%, transparent 72%);
  opacity: .42;
}
@media (max-width: 720px) {
  /* The global nav is fixed; reserve a deliberate arrival margin so the
     eyebrow never enters beneath its glass edge on narrow screens. */
  .tnic-hero {
    justify-content: flex-start;
    padding-top: calc(5.5rem + env(safe-area-inset-top));
    padding-bottom: 4rem;
  }
  .tnic-hero::before { width: 100vw; right: -38vw; top: 28%; opacity: .56; }
  .tnic-hero::after { inset: 8% -30% auto 18%; height: 44%; opacity: .24; }
}
.tnic-hero-badges {
  display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px;
  opacity: 0; transform: translateY(14px);
  transition: opacity .5s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .2s, transform .5s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .2s;
}
.tnic-hero-badges .pill {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 11px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--muted);
  padding: 8px 14px; border: 1px solid var(--line); border-radius: 999px;
  background: rgba(14,20,38,0.55); backdrop-filter: blur(6px);
}
.tnic-hero-badges .pill b { color: var(--cyan); font-weight: 500; }
.tnic-hero-badges .pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }
.tnic-hero-badges a.pill { text-decoration: none; transition: border-color .2s ease, color .2s ease, background .2s ease; }
.tnic-hero-badges a.pill:hover { border-color: color-mix(in srgb, var(--cyan) 55%, transparent); color: var(--ink); background: rgba(14,20,38,0.8); }

/* The arrival screen now makes the three principal visitor jobs explicit:
   evaluate the strongest evidence, browse the science, or get a personalised
   starting point. This replaces competing generic CTAs with a compact choice
   architecture that stays inside the first viewport. */
.tnic-paths {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;
  width: min(100%, 780px); margin-top: 28px;
  opacity: 0; transform: translateY(14px);
  transition: opacity .5s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .26s, transform .5s var(--ease-entrance, cubic-bezier(.16,1,.3,1)) .26s;
}
.tnic-path {
  position: relative; overflow: hidden;
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
  gap: 10px; min-height: 82px; padding: 13px 14px; border-radius: 14px;
  color: var(--ink); text-decoration: none; border: 1px solid var(--line);
  background: color-mix(in srgb, var(--panel) 86%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 8px 22px -18px rgba(0,0,0,.7);
  transition: transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease;
}
/* Engineered top light-catch + hover accent bloom on the two secondary paths —
   brings them up to the "elite card" tell without touching the primary gradient. */
.tnic-path:not(.primary)::before {
  content: ''; position: absolute; inset-inline: 0; top: 0; height: 1px; z-index: 2;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--cyan) 52%, transparent), transparent);
  opacity: .55; pointer-events: none;
}
.tnic-path:not(.primary)::after {
  content: ''; position: absolute; inset: 0; z-index: 0;
  background: radial-gradient(130% 90% at 50% -20%, color-mix(in srgb, var(--cyan) 14%, transparent), transparent 60%);
  opacity: 0; transition: opacity .25s ease; pointer-events: none;
}
.tnic-path:not(.primary) > * { position: relative; z-index: 1; }
.tnic-path:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--cyan) 55%, transparent); background: color-mix(in srgb, var(--panel2) 92%, transparent); box-shadow: 0 14px 30px -16px rgba(95,227,224,.5), inset 0 1px 0 rgba(255,255,255,.08); }
.tnic-path:not(.primary):hover::before { opacity: .95; }
.tnic-path:not(.primary):hover::after { opacity: 1; }
/* Tactile press — the card acknowledges the tap, matching the sitewide
   press vocabulary in globals.css. Gated so reduced-motion users get none. */
@media (prefers-reduced-motion: no-preference) {
  .tnic-path:active { transform: translateY(0) scale(.988); transition-duration: .09s; }
  .tnic-hero-badges a.pill:active { transform: scale(.96); }
}
.tnic-path.primary { color: #030712; border-color: transparent; background: linear-gradient(135deg, #5fe3e0 0%, #68e5c7 52%, #b8f3d8 100%); box-shadow: 0 10px 30px -16px rgba(95,227,224,.85); }
.tnic-path.primary:hover { border-color: transparent; background: linear-gradient(135deg, #75ebe7 0%, #77ebcf 52%, #c8f7e2 100%); box-shadow: 0 14px 36px -16px rgba(95,227,224,.95); }
.tnic-path-index { font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10px; letter-spacing: .12em; color: var(--faint); }
.tnic-path.primary .tnic-path-index { color: rgba(3,7,18,.58); }
.tnic-path-copy { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.tnic-path-label { font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 9px; line-height: 1.2; letter-spacing: .11em; text-transform: uppercase; color: var(--faint); }
.tnic-path.primary .tnic-path-label { color: rgba(3,7,18,.62); }
.tnic-path-name { font-size: 14px; line-height: 1.2; font-weight: 650; }
.tnic-path-detail { font-size: 11px; line-height: 1.35; color: var(--muted); }
.tnic-path.primary .tnic-path-detail { color: rgba(3,7,18,.66); }
.tnic-path-arr { font-size: 18px; line-height: 1; color: var(--cyan); transition: transform .2s ease; }
.tnic-path.primary .tnic-path-arr { color: #030712; }
.tnic-path:hover .tnic-path-arr { transform: translateX(3px); }
@media (max-width: 720px) {
  /* Keep the full proof set, but turn it into a compact 2×2 telemetry panel so
     the visitor reaches the primary choice in the first mobile viewport. */
  .tnic-hero-badges {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
    max-width: 440px;
    margin-top: 20px;
  }
  .tnic-hero-badges .pill {
    min-width: 0;
    gap: 5px;
    padding: 7px 8px;
    font-size: 8px;
    letter-spacing: .09em;
    white-space: nowrap;
  }
  .tnic-hero-badges .pill .dot { width: 5px; height: 5px; }

  /* One primary path earns the full row. The two supporting paths become an
     adjacent comparison, preserving every destination without a three-card
     vertical stack competing with the hero. */
  .tnic-paths { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; max-width: 440px; margin-top: 18px; }
  .tnic-path.primary { grid-column: 1 / -1; }
  .tnic-path { min-height: 78px; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; padding: 11px; }
  .tnic-path-index { display: none; }
  .tnic-path-label { font-size: 8px; letter-spacing: .09em; }
  .tnic-path-name { font-size: 13px; }
  .tnic-path-detail { font-size: 10px; line-height: 1.3; }
}

.tnic-cue {
  position: absolute; left: 50%; bottom: 34px; transform: translateX(-50%);
  font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase; color: var(--faint);
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.tnic-cue .bar { width: 1px; height: 46px; background: linear-gradient(var(--cyan), transparent); animation: tnic-cuepulse 2.4s ease-in-out infinite; transform-origin: top; }
@keyframes tnic-cuepulse { 0%,100%{ transform: scaleY(.4); opacity:.5 } 50%{ transform: scaleY(1); opacity:1 } }

.tnic-molwrap { display: grid; grid-template-columns: 1.35fr 1fr; gap: 30px; align-items: stretch; margin-top: 12px; }
@media (max-width: 900px) { .tnic-molwrap { grid-template-columns: 1fr; } }

.tnic-stage {
  position: relative; width: 100%;
  aspect-ratio: 16/10; max-height: 62vh; margin: 8px 0 0;
  opacity: 0; transform: scale(.97);
  transition: opacity 1.1s ease .1s, transform 1.1s ease .1s;
  border-radius: 20px; overflow: hidden;
  background:
    radial-gradient(100% 100% at 30% 20%, rgba(95,227,224,0.06), transparent 60%),
    radial-gradient(100% 100% at 80% 90%, rgba(140,140,245,0.06), transparent 60%),
    linear-gradient(180deg, rgba(14,20,38,0.55), rgba(10,14,30,0.85));
  border: 1px solid var(--line);
}
.tnic-stage canvas, .tnic-stage svg { position: relative; z-index: 1; width: 100%; height: 100%; display: block; }
.tnic-stage-mount { position: relative; width: 100%; height: 100%; isolation: isolate; }
.tnic-stage-fallback {
  position: absolute; z-index: 0; inset: 0; overflow: hidden;
  background:
    radial-gradient(circle at 50% 50%, rgba(95,227,224,0.14), transparent 17%),
    radial-gradient(circle at 50% 50%, rgba(140,140,245,0.1), transparent 45%),
    linear-gradient(135deg, rgba(95,227,224,0.025), transparent 44%, rgba(140,140,245,0.035));
}
.tnic-stage-fallback::before {
  content: ''; position: absolute; inset: 10%; opacity: .26;
  background:
    linear-gradient(rgba(95,227,224,.14) 1px, transparent 1px) 0 0 / 42px 42px,
    linear-gradient(90deg, rgba(95,227,224,.14) 1px, transparent 1px) 0 0 / 42px 42px;
  mask-image: radial-gradient(70% 70% at 50% 50%, #000 0%, transparent 80%);
  -webkit-mask-image: radial-gradient(70% 70% at 50% 50%, #000 0%, transparent 80%);
}
.tnic-stage-fallback__orbit,
.tnic-stage-fallback__node,
.tnic-stage-fallback__core { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.tnic-stage-fallback__orbit { border: 1px solid rgba(95,227,224,.24); border-radius: 50%; transform: translate(-50%, -50%) rotate(-18deg); }
.tnic-stage-fallback__orbit--outer { width: 68%; aspect-ratio: 1.8; border-color: rgba(140,140,245,.18); animation: tnic-orbit-breathe 11s ease-in-out infinite; }
.tnic-stage-fallback__orbit--middle { width: 50%; aspect-ratio: 1.8; transform: translate(-50%, -50%) rotate(54deg); border-color: rgba(95,227,224,.28); animation: tnic-orbit-breathe 8s ease-in-out infinite reverse; }
.tnic-stage-fallback__orbit--inner { width: 31%; aspect-ratio: 1.8; transform: translate(-50%, -50%) rotate(-48deg); border-color: rgba(240,196,106,.3); animation: tnic-orbit-breathe 6s ease-in-out infinite; }
@keyframes tnic-orbit-breathe { 0%, 100% { opacity: .62; scale: .98; } 50% { opacity: 1; scale: 1.02; } }
.tnic-stage-fallback__node { width: .55rem; height: .55rem; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 0 .25rem rgba(95,227,224,.08), 0 0 1.2rem rgba(95,227,224,.62); }
.tnic-stage-fallback__node--one { margin: -25% 0 0 27%; }
.tnic-stage-fallback__node--two { margin: 20% 0 0 -25%; background: var(--gold); box-shadow: 0 0 0 .25rem rgba(240,196,106,.08), 0 0 1.2rem rgba(240,196,106,.56); }
.tnic-stage-fallback__node--three { margin: -18% 0 0 -33%; background: var(--violet); box-shadow: 0 0 0 .25rem rgba(185,140,240,.08), 0 0 1.2rem rgba(185,140,240,.56); }
.tnic-stage-fallback__core { width: 7%; aspect-ratio: 1; border: 1px solid rgba(255,255,255,.72); border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff, var(--cyan) 42%, rgba(95,227,224,.12) 100%); box-shadow: 0 0 0 12px rgba(95,227,224,.06), 0 0 2.2rem rgba(95,227,224,.6); }
.tnic-stage-fallback__label { position: absolute; left: 22px; top: 20px; display: flex; flex-direction: column; gap: 5px; color: var(--faint); font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 9px; letter-spacing: .16em; line-height: 1.2; text-transform: uppercase; }
.tnic-stage-fallback__label strong { color: var(--ink); font-size: 11px; font-weight: 500; letter-spacing: .1em; }
.tnic-stage-placeholder { display: none; }
@media (max-width: 720px) { .tnic-stage-fallback__label { left: 16px; top: 16px; } }

.tnic-molhint {
  position: absolute; bottom: 12px; right: 14px;
  font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 11px;
  color: var(--faint); letter-spacing: .06em; pointer-events: none;
  display: flex; align-items: center; gap: 7px;
}
.tnic-molhint .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 10px var(--cyan); animation: tnic-cuepulse 2s infinite; }

.tnic-molcard {
  background: linear-gradient(180deg, var(--panel2), var(--panel));
  border: 1px solid var(--line); border-radius: 20px; padding: 24px 24px 26px;
  display: flex; flex-direction: column; gap: 14px;
  opacity: 0; transform: translateY(16px);
  transition: opacity 1s ease .3s, transform 1s ease .3s;
}
.tnic-molcard h3 { font-family: var(--font-display, 'Fraunces', Georgia, serif); font-size: 30px; font-weight: 400; margin: 0; letter-spacing: -.01em; }
.tnic-molcard .formula { font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 14px; color: var(--cyan); letter-spacing: .08em; }
.tnic-molcard .facts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; margin-top: 4px; }
.tnic-molcard .fact { display: flex; flex-direction: column; gap: 3px; }
.tnic-molcard .fact .k { font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase; color: var(--faint); }
.tnic-molcard .fact .v { font-size: 15px; color: var(--ink); }
/* The shared science panel, sized inside the Descent's two-column wraps. It
   wraps the deferred stage rather than replacing it, so the lazy-mount seam
   (DeferredCinematicStage) still governs when the canvas loads. Stage ratios
   match the .tnic-stage frame these acts used before — the molecule renderer
   sizes geometry to the canvas, so a changed ratio crops it. */
.tnic-sci { background: linear-gradient(180deg, var(--panel2), var(--panel)); border-color: var(--line); }
.tnic-sci > div:nth-child(2) { min-height: 300px; aspect-ratio: 16 / 10; max-height: 62vh; }
.tnic-sci--net > div:nth-child(2) { aspect-ratio: 10 / 7; }
.tnic-sci .tnic-stage-mount { width: 100%; height: 100%; }
.tnic-sci canvas { width: 100%; height: 100%; display: block; }

.tnic-molcard .why { font-size: 13.5px; color: var(--muted); line-height: 1.55; max-width: 52ch; margin-top: 4px; border-top: 1px solid var(--line); padding-top: 14px; }
.tnic-molcard .cite { font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10.5px; color: var(--faint); letter-spacing: .1em; }

.tnic-netwrap { display: grid; grid-template-columns: 1.5fr 1fr; gap: 28px; align-items: start; margin-top: 10px; }
@media (max-width: 900px){ .tnic-netwrap { grid-template-columns: 1fr; } }

.tnic-descent .edge { stroke-width: 1.5; fill: none; opacity: .28; transition: opacity .4s ease, stroke-width .4s ease; }
.tnic-descent .edge.flow { stroke-dasharray: 5 10; animation: tnic-flow 2.6s linear infinite; }
@keyframes tnic-flow { to { stroke-dashoffset: -15; } }
.tnic-descent .edge.dim { opacity: .05; }
.tnic-descent .edge.hot { opacity: 1; stroke-width: 3; filter: drop-shadow(0 0 6px currentColor); }
.tnic-descent .edge.warn { stroke-dasharray: 1 7; opacity: .48; }

.tnic-descent .node { cursor: pointer; }
.tnic-descent .node:focus { outline: none; }
.tnic-descent .node:focus-visible .node-ring { opacity: 1; stroke: var(--cyan); stroke-width: 2.5; }
.tnic-descent .node-hit { fill: transparent; }
.tnic-descent .node-core { transition: opacity .35s ease; }
.tnic-descent .node-label {
  font-family: var(--font-sans, 'Inter', system-ui, sans-serif); font-size: 14px; font-weight: 500;
  fill: var(--ink); pointer-events: none; transition: opacity .35s ease, fill .35s ease;
  paint-order: stroke; stroke: rgba(5,7,16,0.9); stroke-width: 4;
}
.tnic-descent .node.dim .node-label { opacity: .3; }
.tnic-descent .node.dim .node-core { opacity: .32; }
.tnic-descent .node.sel .node-label { fill: var(--gold); font-weight: 600; }
.tnic-descent .node.sel .node-ring { opacity: 1; }
.tnic-descent .node.elite .elite-badge { opacity: 1; }
.tnic-descent .node-ring { fill: none; stroke: var(--gold); stroke-width: 1.6; opacity: 0; transition: opacity .35s ease; }
.tnic-descent .elite-badge { opacity: 0; transition: opacity .35s ease; pointer-events: none; }
.tnic-descent .node-pulse {
  transform-box: fill-box; transform-origin: center;
  animation: tnic-nodepulse 3.6s ease-in-out infinite;
}
@keyframes tnic-nodepulse { 0%,100%{ opacity:.16; transform: scale(1) } 50%{ opacity:.34; transform: scale(1.35) } }

.tnic-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.tnic-search {
  flex: 1; min-width: 180px;
  background: rgba(14,20,38,0.6); border: 1px solid var(--line); color: var(--ink);
  padding: 10px 14px; border-radius: 10px; font-family: var(--font-sans, 'Inter', system-ui, sans-serif); font-size: 14px;
  outline: none;
}
.tnic-search:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(95,227,224,0.15); }
.tnic-search::placeholder { color: var(--faint); }
.tnic-chip {
  display: inline-flex; align-items: center; gap: 7px; padding: 8px 12px;
  background: rgba(14,20,38,0.6); border: 1px solid var(--line); color: var(--muted);
  border-radius: 999px; font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10.5px;
  letter-spacing: .14em; text-transform: uppercase; cursor: pointer; transition: all .2s ease;
}
.tnic-chip.on { color: var(--ink); border-color: currentColor; background: rgba(255,255,255,0.03); }
.tnic-chip:focus-visible { outline: none; border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(95,227,224,0.15); }
.tnic-chip .sw { width: 8px; height: 8px; border-radius: 50%; }

.tnic-readout {
  background: linear-gradient(180deg, var(--panel2), var(--panel));
  border: 1px solid var(--line); border-radius: 18px; padding: 22px 22px 24px;
  min-height: 260px;
}
.tnic-readout .r-eyebrow { font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--faint); display: flex; align-items: center; gap: 8px; }
.tnic-readout .r-elite {
  display: inline-flex; align-items: center; gap: 5px; margin-left: 4px;
  color: var(--gold); font-weight: 500;
}
.tnic-readout .r-elite svg { width: 11px; height: 11px; }
.tnic-readout .r-name { font-family: var(--font-display, 'Fraunces', Georgia, serif); font-size: 30px; margin: 6px 0 2px; letter-spacing: -.01em; }
.tnic-readout .r-role { font-size: 13.5px; color: var(--muted); margin-bottom: 12px; }
.tnic-readout .r-meta { display: flex; gap: 12px; margin-bottom: 12px; font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10.5px; letter-spacing: .1em; color: var(--faint); text-transform: uppercase; }
.tnic-readout .r-meta b { color: var(--ink); font-weight: 500; letter-spacing: .04em; }
.tnic-readout .r-link { display: flex; gap: 11px; padding: 12px 0; border-top: 1px solid var(--line); }
.tnic-readout .r-link .r-dot { width: 9px; height: 9px; border-radius: 50%; margin-top: 5px; flex: none; box-shadow: 0 0 8px currentColor; }
.tnic-readout .r-link .r-to { font-size: 14px; font-weight: 600; color: var(--ink); }
.tnic-readout .r-link .r-tag { font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; margin-left: 8px; }
.tnic-readout .r-link .r-why { font-size: 12.5px; color: var(--muted); line-height: 1.5; margin-top: 3px; }
.tnic-readout .r-cta {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  color: var(--cyan); text-decoration: none; font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
  font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  border-top: 1px solid var(--line); padding-top: 14px; width: 100%;
}
.tnic-readout .r-cta:hover { color: var(--gold); }
.tnic-readout .r-empty { color: var(--faint); font-size: 14px; line-height: 1.6; padding-top: 8px; }

.tnic-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 16px; }
.tnic-legend .lg { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10.5px; letter-spacing: .1em; color: var(--muted); text-transform: uppercase; }
.tnic-legend .lg .sw { width: 10px; height: 10px; border-radius: 50%; }

.tnic-tl { margin-top: 8px; }
.tnic-tl-head { display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap; margin-bottom: 6px; }
.tnic-age { font-family: var(--font-display, 'Fraunces', Georgia, serif); font-size: clamp(48px,8vw,80px); line-height: 1; color: var(--gold); letter-spacing: -.02em; }
.tnic-age small { font-size: .32em; color: var(--muted); font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); letter-spacing: .12em; margin-left: 8px; }
.tnic-stage-cap { font-size: 16px; color: var(--ink); max-width: 36ch; line-height: 1.4; }
.tnic-range { -webkit-appearance: none; appearance: none; width: 100%; height: 3px; border-radius: 3px; background: var(--line); margin: 18px 0 4px; cursor: pointer; }
.tnic-range::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: var(--gold); border: 3px solid var(--void); box-shadow: 0 0 0 1px var(--gold), 0 0 22px rgba(240,196,106,.6); cursor: grab; }
.tnic-range::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: var(--gold); border: 3px solid var(--void); box-shadow: 0 0 0 1px var(--gold), 0 0 22px rgba(240,196,106,.6); cursor: grab; }
.tnic-range:focus-visible { outline: 2px solid var(--cyan); outline-offset: 6px; }
.tnic-tl-stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 16px;
}
@media (max-width: 720px){ .tnic-tl-stats { grid-template-columns: 1fr; } }
.tnic-tl-stat {
  background: linear-gradient(180deg, rgba(19,26,48,0.75), rgba(14,20,38,0.75));
  border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px;
  display: flex; flex-direction: column; gap: 4px;
}
.tnic-tl-stat b { font-family: var(--font-display, 'Fraunces', Georgia, serif); font-size: 26px; color: var(--gold); letter-spacing: -.01em; }
.tnic-tl-stat .k { font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--faint); }
.tnic-tl-stat .n { font-size: 12.5px; color: var(--muted); line-height: 1.4; }
.tnic-honest { font-size: 13px; color: var(--faint); font-style: italic; margin-top: 14px; max-width: 60ch; line-height: 1.55; }
.tnic-tl-toggle { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }

.tnic-final {
  opacity: 0; transform: translateY(20px);
  transition: opacity 1s ease .15s, transform 1s ease .15s;
  display: grid; grid-template-columns: 1fr 1fr; gap: 26px; margin-top: 18px;
}
@media (max-width: 900px){ .tnic-final { grid-template-columns: 1fr; } }
.tnic-final-recap { display: flex; flex-direction: column; gap: 14px; }
.tnic-final-row {
  display: flex; align-items: center; gap: 14px; padding: 14px 16px;
  background: linear-gradient(180deg, rgba(19,26,48,0.7), rgba(14,20,38,0.7));
  border: 1px solid var(--line); border-radius: 14px;
}
.tnic-final-row .n { font-family: var(--font-display, 'Fraunces', Georgia, serif); font-size: 28px; color: var(--cyan); width: 36px; text-align: center; flex: none; }
.tnic-final-row .body { flex: 1; }
.tnic-final-row .body .t { font-size: 15px; color: var(--ink); font-weight: 500; }
.tnic-final-row .body .s { font-size: 12.5px; color: var(--muted); line-height: 1.5; margin-top: 2px; }

.tnic-final-elites { display: flex; flex-direction: column; gap: 12px; }
.tnic-final-elites .head {
  font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 11px; letter-spacing: .2em;
  text-transform: uppercase; color: var(--faint); display: flex; justify-content: space-between; align-items: baseline;
}
.tnic-final-elites .head a { color: var(--cyan); text-decoration: none; letter-spacing: .18em; }
.tnic-final-elites .head a:hover { color: var(--gold); }
.tnic-elite-card {
  display: flex; align-items: center; gap: 14px; padding: 14px 16px;
  background: linear-gradient(180deg, rgba(19,26,48,0.75), rgba(14,20,38,0.75));
  border: 1px solid var(--line); border-radius: 14px;
  text-decoration: none; color: inherit; transition: border-color .2s ease, transform .2s ease;
}
.tnic-elite-card:hover { border-color: var(--cyan); transform: translateY(-1px); }
.tnic-elite-card .rank {
  font-family: var(--font-display, 'Fraunces', Georgia, serif); font-size: 22px; color: var(--gold);
  width: 32px; text-align: center; flex: none;
}
.tnic-elite-card .body { flex: 1; min-width: 0; }
.tnic-elite-card .body .name { font-size: 15px; font-weight: 600; color: var(--ink); }
.tnic-elite-card .body .path { font-size: 12px; color: var(--muted); margin-top: 2px; }
.tnic-elite-card .tier {
  font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace); font-size: 10px; letter-spacing: .18em;
  text-transform: uppercase; padding: 4px 8px; border-radius: 999px;
  border: 1px solid currentColor;
}

.tnic-cta {
  display: inline-flex; align-items: center; gap: 12px; margin-top: 22px;
  padding: 14px 24px; border-radius: 999px;
  /* Site signature gradient (matches .btn-gradient) so the descent's actions
     read as the same primary CTA as the rest of the site. */
  background: linear-gradient(135deg, #00e0ff 0%, #34d399 50%, #6ee7b7 100%);
  color: #030712; font-weight: 600; font-size: 15px; text-decoration: none;
  box-shadow: 0 0 32px rgba(0,224,255,0.32);
  transition: transform .2s ease, box-shadow .2s ease;
}
.tnic-cta:hover { transform: translateY(-1px); box-shadow: 0 0 42px rgba(0,224,255,0.5); }
.tnic-cta:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }
.tnic-cta .arr { display: inline-block; transition: transform .2s ease; }
.tnic-cta:hover .arr { transform: translateX(4px); }
.tnic-cta.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); box-shadow: none; margin-left: 12px; }
.tnic-cta.ghost:hover { border-color: var(--cyan); }

/* Journey navigator — persistent labels turn the cinematic sequence into an
   understandable five-part story instead of an unexplained floating rail. */
/* .tnic-rail* retired — see SectionProgress (mounted in app/page.tsx). */

.tnic-descent[data-reduced="true"] .bar,
.tnic-descent[data-reduced="true"] .edge.flow,
.tnic-descent[data-reduced="true"] .node-pulse,
.tnic-descent[data-reduced="true"] .tnic-aurora,
.tnic-descent[data-reduced="true"] .tnic-stage-fallback__orbit { animation: none !important; }

/* Act 4 capstone backdrop — the goal curve from Act 3, mirrored into an
   ascent behind the closing section. Negative z stays inside the act's
   stacking context (.tnic-act creates one via z-index:3), behind the text. */
.tnic-act4-sky {
  position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%;
  pointer-events: none; opacity: .55;
}

/* Reduced motion: the per-element entrance reveals (opacity/transform on the
   kicker, headlines, lead, stage, cards, badges, CTA, recap) are motion too —
   show everything in its final composed state immediately instead of sliding
   it in on scroll. */
@media (prefers-reduced-motion: reduce) {
  .tnic-descent .tnic-kicker,
  .tnic-descent .tnic-h1,
  .tnic-descent .tnic-h2,
  .tnic-descent .tnic-lead,
  .tnic-descent .tnic-note,
  .tnic-descent .tnic-stage,
  .tnic-descent .tnic-molcard,
  .tnic-descent .tnic-hero-badges,
  .tnic-descent .tnic-paths,
  .tnic-descent .tnic-final {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .tnic-descent .tnic-stage-fallback__orbit { animation: none !important; }
  .tnic-descent .tnic-aurora { animation: none !important; }
}
`;


type TierKey = "established" | "mechanistic" | "exploratory" | "caution";
const TIER: Record<TierKey, { color: string; label: string }> = {
  established: { color: "#5fe3e0", label: "Established" },
  mechanistic: { color: "#8c8cf5", label: "Mechanistic" },
  exploratory: { color: "#b98cf0", label: "Exploratory" },
  caution:     { color: "#eaa24a", label: "Caution" },
};

// Real TNiC library compounds — the marquee nodes of the synergy graph. Every
// node links to its own /library/compounds/<slug> module. Tuple:
// [id, name, role, librarySlug, eliteCompoundId | null]. Ordered around the
// circle so clustered relationships (NAD⁺/SIRT, AMPK, senolytics, autophagy,
// NRF2/glutathione) sit adjacent and edges cross as little as possible.
const NODE_DEFS: Array<[string, string, string, string, string | null]> = [
  ["nmn", "NMN", "NAD⁺ precursor — fuels sirtuins & repair", "nmn", "nmn"],
  ["nr", "NR", "NAD⁺ precursor — converts to NMN", "nr", null],
  ["cakg", "Ca-AKG", "TCA fuel + epigenetic cofactor", "cakg", "cakg"],
  ["resveratrol", "Resveratrol", "SIRT1 activator (needs NAD⁺)", "resveratrol", "resveratrol"],
  ["pterostilbene", "Pterostilbene", "longer-acting SIRT1 stilbene", "pterostilbene", "pterostilbene"],
  ["berberine", "Berberine", "AMPK activator (metformin-like)", "berberine", null],
  ["metformin", "Metformin", "AMPK via Complex-I (Rx)", "metformin", null],
  ["fisetin", "Fisetin", "senolytic flavonoid", "fisetin", null],
  ["quercetin", "Quercetin", "senolytic flavonoid + CD38", "quercetin", null],
  ["urolithin-a", "Urolithin A", "mitophagy activator", "urolithin-a", null],
  ["spermidine", "Spermidine", "autophagy inducer", "spermidine", "spermidine"],
  ["omega3", "Omega-3", "resolves inflammation (EPA/DHA)", "omega3", null],
  ["sulforaphane", "Sulforaphane", "NRF2 gene-defense switch", "sulforaphane", "sulforaphane"],
  ["glynac", "GlyNAC", "rebuilds glutathione (GSH)", "glynac", "glynac"],
  ["nac", "NAC", "cysteine donor for glutathione", "nac", null],
  ["rala", "R-ALA", "recycles the antioxidant network", "rala", "rala"],
];
type Edge = { a: string; b: string; tier: TierKey; why: string };
const EDGES: Edge[] = [
  // ── Synergies (cool) — real pairings documented in the compound modules ──
  // Flagship documented stacks (NRF2 triad, NAD⁺ Mito / SIRT1 pair) → "established"
  { a: "glynac", b: "sulforaphane", tier: "established", why: "NRF2 Defense Triad — GlyNAC supplies the glutathione substrate; sulforaphane switches on the genes that build more. Substrate before signal." },
  { a: "glynac", b: "rala", tier: "established", why: "NRF2 triad — R-ALA recycles the oxidised glutathione GlyNAC's precursors keep synthesising, closing the redox loop." },
  { a: "sulforaphane", b: "rala", tier: "established", why: "NRF2 triad — gene induction (sulforaphane) plus antioxidant recycling (R-ALA) cover the same defence from two angles." },
  { a: "nmn", b: "resveratrol", tier: "established", why: "SIRT1 pair — NMN refills the NAD⁺ that resveratrol-activated SIRT1 must burn. The activator needs the fuel." },
  { a: "nmn", b: "cakg", tier: "established", why: "NAD⁺ Mito Stack — NMN restores NAD⁺ while Ca-AKG feeds the TCA cycle: two independent mitochondrial levers." },
  { a: "nmn", b: "rala", tier: "established", why: "NAD⁺ repair plus lipid-phase antioxidant recycling — orthogonal coverage while NAD⁺ restores DNA-repair capacity." },
  // Sound mechanism, combination not RCT-proven → "mechanistic"
  { a: "cakg", b: "resveratrol", tier: "mechanistic", why: "Ca-AKG fuels the metabolic context; resveratrol drives SIRT1 biogenesis signalling on top of it." },
  { a: "spermidine", b: "nmn", tier: "mechanistic", why: "Spermidine induces autophagy to clear damage; NMN restores the NAD⁺ that SIRT-mediated autophagy regulation draws on." },
  { a: "spermidine", b: "resveratrol", tier: "mechanistic", why: "Complementary autophagy + SIRT1 signalling in the PM window — two routes into the same repair program." },
  { a: "urolithin-a", b: "nmn", tier: "mechanistic", why: "Urolithin A clears damaged mitochondria (mitophagy); NMN fuels biogenesis of the replacements." },
  { a: "urolithin-a", b: "spermidine", tier: "mechanistic", why: "Mitochondria-specific mitophagy (urolithin A) alongside general autophagy (spermidine) — complementary, not redundant." },
  { a: "omega3", b: "sulforaphane", tier: "mechanistic", why: "Omega-3 resolves inflammation via specialised pro-resolving mediators; sulforaphane runs the NRF2 antioxidant program — orthogonal coverage." },
  { a: "omega3", b: "resveratrol", tier: "mechanistic", why: "Two independent anti-inflammatory routes — pro-resolving mediators plus AMPK/SIRT1 signalling." },
  { a: "pterostilbene", b: "nmn", tier: "mechanistic", why: "Pterostilbene is a longer-acting SIRT1 stilbene; NMN supplies the NAD⁺ that activation consumes." },
  { a: "berberine", b: "nmn", tier: "mechanistic", why: "Berberine's AMPK activation primes the repair state; NMN restores the NAD⁺ that state runs on." },
  { a: "berberine", b: "resveratrol", tier: "mechanistic", why: "AMPK energy-deficit signal (berberine) feeding SIRT1 activation (resveratrol) — the caloric-restriction-mimic axis." },
  // Early / thin combination evidence → "exploratory"
  { a: "fisetin", b: "resveratrol", tier: "exploratory", why: "Fisetin clears senescent cells; resveratrol has partial SASP-suppressive effects on any that remain. Sound rationale, under-studied together." },
  { a: "fisetin", b: "nmn", tier: "exploratory", why: "Clearing senescent cells lowers the SASP burden that drains NAD⁺ via CD38; NMN restores the pool. Early, mostly preclinical." },
  // ── Clashes (amber) — real redundancy/competition from the antagonist tables ──
  { a: "nmn", b: "nr", tier: "caution", why: "Redundant — NR converts to NMN en route to NAD⁺. Running both at high dose pays twice for one pathway. Pick one precursor." },
  { a: "berberine", b: "metformin", tier: "caution", why: "Redundant — near-identical AMPK / Complex-I mechanism, and additive hypoglycaemia risk. Choose one under medical guidance; don't stack them." },
  { a: "quercetin", b: "fisetin", tier: "caution", why: "Redundant — two flavonoid senolytics hitting the same survival pathways. Overlapping, not additive. Pick one." },
  { a: "nac", b: "glynac", tier: "caution", why: "Redundant — NAC is already GlyNAC's cysteine leg. Adding standalone NAC on top duplicates the same precursor." },
  { a: "resveratrol", b: "pterostilbene", tier: "caution", why: "Redundant — same SIRT1-stilbene target. Pterostilbene lingers longer; run one, not both, to avoid doubling the stilbene load." },
];

// ── Act-2 artwork geometry — a deterministic Fibonacci sphere (same layout
// math as lib/hero-network.ts), computed once so the synergy graph reads as a
// sibling of the Act-1 molecule: a 3D object you turn over, drawn on canvas
// (no WebGL) by NetworkStage. Degree drives node size; the tier color and the
// caution=clash flag drive the edges. ──
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
function fibonacciSphere(count: number, radius: number): Array<[number, number, number]> {
  if (count <= 1) return count === 1 ? [[0, 0, radius]] : [];
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;
    pts.push([Math.cos(theta) * ring * radius, y * radius, Math.sin(theta) * ring * radius]);
  }
  return pts;
}

const NET_DEGREE: Record<string, number> = {};
EDGES.forEach((e) => {
  NET_DEGREE[e.a] = (NET_DEGREE[e.a] || 0) + 1;
  NET_DEGREE[e.b] = (NET_DEGREE[e.b] || 0) + 1;
});
const NET_INDEX: Record<string, number> = {};
NODE_DEFS.forEach(([id], i) => { NET_INDEX[id] = i; });
const NET_POS = fibonacciSphere(NODE_DEFS.length, 2.3);
const NET_NODES: NetworkNode[] = NODE_DEFS.map(([id, name, , , elite], i) => ({
  name,
  pos: NET_POS[i],
  elite: elite !== null,
  degree: NET_DEGREE[id] ?? 1,
}));
const NET_EDGES: NetworkEdge[] = EDGES.map((e) => ({
  a: NET_INDEX[e.a],
  b: NET_INDEX[e.b],
  color: TIER[e.tier].color,
  dashed: e.tier === "caution",
}));
const NET_ELITE_COUNT = NET_NODES.filter((n) => n.elite).length;
const NET_ELITE_NAMES = NET_NODES.filter((n) => n.elite).map((n) => n.name);

/**
 * MoleculeStage has coloured atoms by element since it shipped, and nothing in
 * the UI ever said what the colours meant. Mirrors its own ELEMENT_COLOR cores.
 */
const MOLECULE_LEGEND: Array<{ symbol: string; name: string; color: string }> = [
  { symbol: "C", name: "Carbon", color: "rgb(216,234,255)" },
  { symbol: "O", name: "Oxygen", color: "rgb(244,142,126)" },
];

const STAGES = [
  { at: 30, cap: "Peak reserve. Nothing feels at stake yet." },
  { at: 40, cap: "The first quiet slope — invisible, still reversible." },
  { at: 50, cap: "Where the two paths begin to separate." },
  { at: 60, cap: "Function becomes something you actively defend." },
  { at: 70, cap: "The years healthspan is really about." },
  { at: 80, cap: "Compress the decline into the very end." },
  { at: 90, cap: "Not just more years — better ones, for longer." },
];

const CURVE_BASE: Array<[number, number]> = [[30,92],[40,87],[50,79],[60,67],[70,51],[80,33],[90,17],[95,9]];
const CURVE_GOAL: Array<[number, number]> = [[30,96],[40,94],[50,90],[60,85],[70,77],[80,63],[90,38],[95,16]];
const CURVE_ELITE: Array<[number, number]> = [[30,98],[40,97],[50,95],[60,92],[70,86],[80,74],[90,52],[95,22]];

const MILESTONES: Array<{ at: number; label: string; c: string; below?: boolean }> = [
  // NAD⁺ at x=40 sits high on the goal curve, where an above-curve label
  // collides with the "function preserved →" axis label and crowds the
  // x=50 milestone — this one renders below its marker instead.
  { at: 40, label: "NAD⁺ decline steepens", c: "#5fe3e0", below: true },
  { at: 50, label: "Senescent-cell window", c: "#b98cf0" },
  { at: 65, label: "Sarcopenia inflection", c: "#eaa24a" },
  { at: 80, label: "Morbidity horizon", c: "#f08a7a" },
];

function interp(pts: Array<[number, number]>, x: number): number {
  if (x <= pts[0][0]) return pts[0][1];
  if (x >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1][1];
}

// Star SVG path used for elite badges in the network and readout.
const STAR_D = "M0 -6 L1.7 -1.9 L6 -1.9 L2.6 0.7 L3.9 5 L0 2.5 L-3.9 5 L-2.6 0.7 L-6 -1.9 L-1.7 -1.9 Z";


export function HomeDescent() {
  // `active` was React state purely to drive the old scene rail's highlight.
  // The rail moved to SectionProgress and nothing rendered here reads it now —
  // only `activeRef`, inside the canvas loop, to lerp the ambient palette.
  // Dropping the state also drops a re-render per scene.
  const [age, setAge] = useState(50);
  const reduced = useReducedMotion();
  // Handles onto the two canvases so the shared science panel can drive
  // Reset / Zoom / keyboard rotation. Passed as plain props through the
  // deferred wrappers, so the lazy-mount seam is untouched.
  const moleculeRef = useRef<StageHandle | null>(null);
  const networkRef = useRef<StageHandle | null>(null);
  const [showElite, setShowElite] = useState(true);
  const reducedRef = useRef(false);
  const shimmerRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const s0 = useRef<HTMLElement | null>(null);
  const s1 = useRef<HTMLElement | null>(null);
  const s2 = useRef<HTMLElement | null>(null);
  const s3 = useRef<HTMLElement | null>(null);
  const s4 = useRef<HTMLElement | null>(null);
  const sectionRefs = useMemo(() => [s0, s1, s2, s3, s4], []);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  // ── shimmer: 3 parallax layers ──
  useEffect(() => {
    const cv = shimmerRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let w = 0, h = 0;
    const dpr = cappedDpr();
    const layers = [
      { n: 130, sp: 0.00012, dxr: 0.00008, rMin: 0.3, rMax: 1.2, alpha: 0.55 },
      { n: 60,  sp: 0.00020, dxr: 0.00014, rMin: 0.8, rMax: 2.2, alpha: 0.75 },
      { n: 22,  sp: 0.00028, dxr: 0.00020, rMin: 1.8, rMax: 3.6, alpha: 0.85 },
    ];
    const P = layers.map(l => Array.from({ length: l.n }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * (l.rMax - l.rMin) + l.rMin,
      sp: Math.random() * l.sp + l.sp * 0.3,
      ph: Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * l.dxr,
    })));
    function resize() {
      if (!cv || !ctx) return;
      // Device-pixel-exact backing store — crisp on fractional layout widths.
      ({ w, h } = fitCanvas(cv, ctx, dpr));
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    const palettes: Array<[number, number, number]> = [
      [95,227,224], [95,227,224], [140,140,245], [240,196,106], [95,227,224],
    ];
    let cur: [number, number, number] = [95,227,224];
    // Cached glow sprites keyed by the (slowly cross-fading) rounded palette
    // color — a fresh sprite is baked only when the rounded color changes, so
    // the 200+ particles/frame blit a bitmap instead of each allocating and
    // rasterizing its own radial gradient.
    const glow = createGlowCache();
    const light = isLightTheme();
    // Same hues, dialed back on light: the dark-theme alpha values (0.55–0.85)
    // were calibrated as a glow against near-black — at full strength on a
    // light background they read as a garish neon smear rather than ambient
    // texture, so light gets a softer multiplier instead of a second palette.
    const alphaMul = light ? 0.45 : 1;

    function draw() {
      if (!ctx) return;
      const target = palettes[Math.min(activeRef.current, palettes.length - 1)];
      cur = cur.map((c, i) => c + (target[i] - c) * 0.02) as [number, number, number];
      const [cr, cg, cb] = cur.map(Math.round);
      ctx.clearRect(0, 0, w, h);
      const near = P[1];
      for (let i = 0; i < near.length; i++) {
        const a = near[i];
        const ax = a.x * w, ay = a.y * h;
        for (let j = i + 1; j < near.length; j++) {
          const b = near[j];
          const bx = b.x * w, by = b.y * h;
          const d2 = (ax - bx) ** 2 + (ay - by) ** 2;
          if (d2 < 14000) {
            const o = (1 - d2 / 14000) * 0.08 * alphaMul;
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${o})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
          }
        }
      }
      for (let li = 0; li < layers.length; li++) {
        const l = layers[li];
        const parts = P[li];
        for (const p of parts) {
          if (!reducedRef.current) {
            p.y -= p.sp; p.x += p.dx;
            p.ph += 0.02;
            if (p.y < -0.02) p.y = 1.02;
            if (p.x < -0.02) p.x = 1.02; if (p.x > 1.02) p.x = -0.02;
          }
          const tw = 0.55 + Math.sin(p.ph) * 0.45;
          const px = p.x * w, py = p.y * h;
          const rad = p.r * (li === 2 ? 8 : li === 1 ? 5 : 3);
          blitGlow(ctx, glow([cr, cg, cb]), px, py, rad, l.alpha * tw * alphaMul);
          if (li < 2) {
            // Sparkle core: near-white reads as a bright twinkle against the
            // dark backdrop but is nearly invisible white-on-white in light
            // mode, so it flips to a dark ink dot instead — same twinkle
            // effect, correct polarity for the background it's drawn on.
            ctx.fillStyle = light
              ? `rgba(15,23,42,${0.35 * tw})`
              : `rgba(230,240,255,${0.55 * tw})`;
            ctx.beginPath(); ctx.arc(px, py, p.r * 0.6, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
    }
    const stopLoop = runWhenVisible(cv, draw);
    return () => { stopLoop(); ro.disconnect(); };
  }, []);

  // ── cursor glow: follows the pointer over the section ──
  useEffect(() => {
    const cv = cursorRef.current; const root = rootRef.current; if (!cv || !root) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const dpr = cappedDpr();
    let w = 0, h = 0;
    const state = { x: 0, y: 0, tx: 0, ty: 0, on: false };
    function resize() {
      if (!cv || !ctx) return;
      // Device-pixel-exact backing store — crisp on fractional layout widths.
      ({ w, h } = fitCanvas(cv, ctx, dpr));
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const light = isLightTheme();
    function onMove(e: PointerEvent) {
      if (!root) return;
      const rect = root.getBoundingClientRect();
      state.tx = e.clientX - rect.left;
      state.ty = e.clientY - rect.top;
      state.on = true;
    }
    function onLeave() { state.on = false; }
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    function draw() {
      if (!ctx) return;
      state.x += (state.tx - state.x) * 0.15;
      state.y += (state.ty - state.y) * 0.15;
      ctx.clearRect(0, 0, w, h);
      if (state.on) {
        const rad = 220;
        const g = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, rad);
        // Same hues, softened on light for the same reason as the shimmer
        // layer above — full dark-mode intensity reads as a garish smear on
        // a light background.
        g.addColorStop(0, light ? "rgba(8,145,178,0.10)" : "rgba(95,227,224,0.14)");
        g.addColorStop(0.4, light ? "rgba(124,58,237,0.04)" : "rgba(140,140,245,0.06)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(state.x, state.y, rad, 0, Math.PI * 2); ctx.fill();
      }
    }
    const stopLoop = runWhenVisible(cv, draw);
    return () => {
      stopLoop(); ro.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          const idx = Number((en.target as HTMLElement).dataset.idx);
          activeRef.current = idx;
        }
      });
    }, { threshold: 0.45 });
    sectionRefs.forEach((s) => { if (s.current) obs.observe(s.current); });
    return () => obs.disconnect();
  }, [sectionRefs]);

  // ── timeline geometry ──
  const TW = 1000, TH = 500, PAD = { l: 30, r: 30, t: 30, b: 46 };
  const ageToX = (a: number) => PAD.l + ((a - 30) / (95 - 30)) * (TW - PAD.l - PAD.r);
  const vitToY = (v: number) => PAD.t + (1 - v / 100) * (TH - PAD.t - PAD.b);
  function smoothPath(pts: Array<[number, number]>): string {
    const P = pts.map(([a, v]) => [ageToX(a), vitToY(v)] as [number, number]);
    if (P.length < 2) return "";
    let d = `M ${P[0][0]} ${P[0][1]}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }
  const goalPath = smoothPath(CURVE_GOAL);
  const basePath = smoothPath(CURVE_BASE);
  const elitePath = smoothPath(CURVE_ELITE);
  const areaPath = `${goalPath} L ${ageToX(95)} ${vitToY(CURVE_BASE[CURVE_BASE.length - 1][1])} ` +
    smoothPath([...CURVE_BASE].reverse()).replace(/^M/, "L") + " Z";
  const eliteAreaPath = `${elitePath} L ${ageToX(95)} ${vitToY(CURVE_GOAL[CURVE_GOAL.length - 1][1])} ` +
    smoothPath([...CURVE_GOAL].reverse()).replace(/^M/, "L") + " Z";
  const clipW = ageToX(age) - PAD.l;
  const curStage = STAGES.reduce((acc, s) => (age >= s.at ? s : acc), STAGES[0]);
  const yearsPreserved = (() => {
    let sum = 0;
    for (let a = 30; a <= age; a++) sum += Math.max(0, interp(CURVE_GOAL, a) - interp(CURVE_BASE, a));
    return (sum / 100).toFixed(1);
  })();
  const eliteExtra = (() => {
    let sum = 0;
    for (let a = 30; a <= age; a++) sum += Math.max(0, interp(CURVE_ELITE, a) - interp(CURVE_GOAL, a));
    return (sum / 100).toFixed(1);
  })();
  const morbidityCompressed = (() => {
    const frailtyBase = CURVE_BASE.find(([, v]) => v <= 40)?.[0] ?? 95;
    const frailtyGoal = CURVE_GOAL.find(([, v]) => v <= 40)?.[0] ?? 95;
    return (frailtyGoal - frailtyBase).toFixed(0);
  })();

  const topElites = eliteInterventions.slice(0, 4);

  return (
    <div className="tnic-descent" data-reduced={reduced} ref={rootRef}>
      <style>{CSS}</style>
      <div className="tnic-layer tnic-aurora" aria-hidden="true" />
      <canvas ref={shimmerRef} className="tnic-layer tnic-shimmer" aria-hidden="true" />
      <div className="tnic-layer tnic-grid" aria-hidden="true" />
      <canvas ref={cursorRef} className="tnic-layer tnic-cursor" aria-hidden="true" />
      <div className="tnic-layer tnic-vignette" aria-hidden="true" />

      {/* The scene rail moved to the shared `SectionProgress`, mounted at page
          level. It covers the full 01–06 chapter spine rather than these five
          overture acts, adds a completed state and `aria-current="step"`, and
          becomes a scrollable strip on mobile instead of `display: none`. This
          rail's panel treatment was ported across, so nothing visual is lost. */}

      {/* ACT 0 — ARRIVE */}
      <section ref={s0} data-idx="0" id="arrive" className="tnic-act tnic-hero is-in">
        <p className="tnic-kicker">Evidence-Graded Longevity Library</p>
        <h1 className="tnic-h1">Evidence-based <em>longevity</em>,<br />without the hype.</h1>
        <p className="tnic-lead">
          A free, PubMed-backed library for understanding longevity supplements,
          the 12 Hallmarks of Aging, and the evidence behind each compound —
          before you buy or build a stack.
        </p>
        <div className="tnic-trustline" aria-label="TNiC trust signals">
          <span>Human evidence graded</span>
          <span>PubMed citations</span>
          <span>No pay-for-placement</span>
          <span>Free and privacy-first</span>
        </div>
        <div className="tnic-hero-badges">
          <Link href="/elite-8" className="pill focus-ring"><span className="dot" /><b>{eliteInterventions.length}</b>&nbsp;elite interventions</Link>
          <Link href="/library/compounds" className="pill focus-ring"><span className="dot" /><b>{COMPOUND_COUNT}</b>&nbsp;graded compounds</Link>
          <Link href="/hallmarks" className="pill focus-ring"><span className="dot" /><b>12</b>&nbsp;hallmarks of aging</Link>
          <Link href="/trust/methodology" className="pill focus-ring"><span className="dot" /><b>A–C</b>&nbsp;evidence tiers</Link>
        </div>
        <div className="tnic-paths" aria-label="Choose where to begin">
          <Link href="/elite-8" className="tnic-path primary focus-ring">
            <span className="tnic-path-index">01</span>
            <span className="tnic-path-copy">
              <span className="tnic-path-label">Start with confidence</span>
              <span className="tnic-path-name">Elite Eight</span>
              <span className="tnic-path-detail">8 dose-matched picks · cited human trials</span>
            </span>
            <span className="tnic-path-arr" aria-hidden="true">→</span>
          </Link>
          <Link href="/library" className="tnic-path focus-ring">
            <span className="tnic-path-index">02</span>
            <span className="tnic-path-copy">
              <span className="tnic-path-label">Explore the science</span>
              <span className="tnic-path-name">The Library</span>
              <span className="tnic-path-detail">100 graded compounds · 12 hallmarks</span>
            </span>
            <span className="tnic-path-arr" aria-hidden="true">→</span>
          </Link>
          <Link href="/nico" className="tnic-path focus-ring">
            <span className="tnic-path-index">03</span>
            <span className="tnic-path-copy">
              <span className="tnic-path-label">Get your starting point</span>
              <span className="tnic-path-name">NICO Starter</span>
              <span className="tnic-path-detail">Nine questions · adjustable stack plan</span>
            </span>
            <span className="tnic-path-arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="tnic-cue"><span className="bar" />descend</div>
      </section>

      {/* ACT 1 — MOLECULE */}
      <section ref={s1} data-idx="1" id="molecule" className="tnic-act">
        <p className="tnic-kicker">The molecule · rendered live</p>
        <h2 className="tnic-h2">It starts smaller{' '}<br />than you can <em>picture</em>.</h2>
        <p className="tnic-lead">
          Trans-resveratrol — studied for sirtuin activation and healthy-aging
          pathways. Turn it over, zoom in. This is the actual shape doing the
          work, rendered live in your browser.
        </p>

        <div className="tnic-molwrap">
          <InteractiveSciencePanel
            title="Resveratrol · 3D structure"
            eyebrow="Rendered live"
            stageRef={moleculeRef}
            cue="Drag to rotate"
            className="tnic-sci"
            legend={
              <div className="tnic-legend">
                {MOLECULE_LEGEND.map((el) => (
                  <span className="lg" key={el.symbol}>
                    <span className="sw" style={{ background: el.color }} />
                    {el.symbol} · {el.name}
                  </span>
                ))}
              </div>
            }
            summary={
              <p>
                Trans-resveratrol, C₁₄H₁₂O₃ — a stilbenoid polyphenol of 228.24 g/mol
                with a half-life near 9 hours, studied as a SIRT1 activator and graded
                Tier B on human evidence. Two carbon rings joined by a trans double
                bond, with three hydroxyl groups placed for the hydrogen bonds that
                hold it in the binding site. Atoms are coloured by element:{' '}
                {MOLECULE_LEGEND.map((el) => `${el.symbol} (${el.name})`).join(', ')}.
                Stylised for legibility — not a crystallographic reproduction.
              </p>
            }
          >
            <DeferredMoleculeStage
              geometryId="resveratrol"
              hue={HUES.cyan}
              stageRef={moleculeRef}
              ariaLabel="Rotatable 3D model of the resveratrol molecule. Full details are in the panel beside it."
            />
          </InteractiveSciencePanel>

          <aside className="tnic-molcard">
            <div>
              <h3>Resveratrol</h3>
              <div className="formula">C₁₄H₁₂O₃ · trans-3,5,4′-trihydroxystilbene</div>
            </div>
            <div className="facts">
              <div className="fact"><span className="k">Mass</span><span className="v">228.24 g/mol</span></div>
              <div className="fact"><span className="k">Half-life</span><span className="v">~9 hours</span></div>
              <div className="fact"><span className="k">Target</span><span className="v">SIRT1 activator</span></div>
              <div className="fact"><span className="k">Family</span><span className="v">Stilbenoid polyphenol</span></div>
              <div className="fact"><span className="k">First isolated</span><span className="v">1939, white hellebore</span></div>
              <div className="fact"><span className="k">Evidence tier</span><span className="v" style={{ color: 'var(--accent-cyan)' }}>B — Human</span></div>
            </div>
            <p className="why">
              The two carbon rings and the trans double bond form the exact
              geometry SIRT1 recognises — small enough to slip through the
              membrane, symmetrical enough to bind, hydroxyls placed for the
              hydrogen bonds that hold it in place.
            </p>
            <div className="cite">
              <Link href="/library/compounds/resveratrol" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>
                Full compound module →
              </Link>
            </div>
          </aside>
        </div>

        <p className="tnic-note">Rendered live · stylized for legibility, not a crystallographic reproduction</p>
      </section>

      {/* ACT 2 — NETWORK */}
      <section ref={s2} data-idx="2" id="system" className="tnic-act">
        <p className="tnic-kicker">01 / System · Your stack, alive</p>
        <h2 className="tnic-h2">Nothing works <em>alone</em>.</h2>
        <p className="tnic-lead">
          Every graded compound, plotted against the ones it boosts and the ones
          it clashes with. Turn the network over — the cool links are synergies,
          the amber ones are clashes, and the gold halos mark the TNiC elite
          picks. This is your stack as one connected system.
        </p>

        <div className="tnic-netwrap">
          <InteractiveSciencePanel
            title="Compound synergy network"
            eyebrow={`${NODE_DEFS.length} compounds · ${EDGES.length} graded links`}
            stageRef={networkRef}
            cue="Drag to rotate"
            className="tnic-sci tnic-sci--net"
            legend={
              <div className="tnic-legend">
                {Object.values(TIER).map((t) => (
                  <span className="lg" key={t.label}>
                    <span className="sw" style={{ background: t.color }} />{t.label}
                  </span>
                ))}
                <span className="lg" style={{ color: 'var(--gold)' }}>
                  <svg width="12" height="12" viewBox="-8 -8 16 16" aria-hidden="true">
                    <path d={STAR_D} fill="currentColor" />
                  </svg>
                  Elite pick
                </span>
              </div>
            }
            summary={
              <>
                <p className="mb-2">
                  {NODE_DEFS.length} graded compounds and {EDGES.length} documented links.
                  Link colour encodes confidence in the pairing —{' '}
                  {Object.values(TIER).map((t) => t.label).join(', ').toLowerCase()} — and a
                  gold halo marks a TNiC elite pick.
                </p>
                <ul className="space-y-1">
                  {NET_ELITE_NAMES.map((name) => (
                    <li key={name}>Elite pick · {name}</li>
                  ))}
                </ul>
              </>
            }
          >
            <DeferredNetworkStage
              nodes={NET_NODES}
              edges={NET_EDGES}
              stageRef={networkRef}
              ariaLabel="Rotatable 3D network of TNiC compounds. Cool links are synergies, amber links are clashes, gold-haloed nodes are elite picks. Details and the legend are in the panel beside it."
            />
          </InteractiveSciencePanel>

          <aside className="tnic-molcard">
            <div>
              <h3>One connected system</h3>
              <div className="formula">{NODE_DEFS.length} compounds · {EDGES.length} graded links</div>
            </div>
            <p className="why" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
              No compound acts in isolation. NMN refuels the NAD⁺ that
              resveratrol-activated SIRT1 burns; GlyNAC, sulforaphane and R-ALA
              cover the same defence from three angles; two flavonoid senolytics
              only duplicate each other. The graph shows which pairings reinforce
              — and which are redundant.
            </p>
            <div className="tnic-legend" style={{ marginTop: 4 }}>
              {Object.values(TIER).map((t) => (
                <span className="lg" key={t.label}>
                  <span className="sw" style={{ background: t.color }} />{t.label}
                </span>
              ))}
              <span className="lg" style={{ color: 'var(--gold)' }}>
                <svg width="12" height="12" viewBox="-8 -8 16 16"><path d={STAR_D} fill="currentColor" /></svg>
                Elite pick
              </span>
            </div>
            <div className="cite">
              <Link href="/library" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>
                Explore every compound →
              </Link>
            </div>
          </aside>
        </div>

        <p className="tnic-note">Rendered live · {NET_ELITE_COUNT} elite picks haloed gold · synergies cool, clashes amber</p>
      </section>

      {/* ACT 3 — TIMELINE */}
      <section ref={s3} data-idx="3" id="goal" className="tnic-act">
        <p className="tnic-kicker">02 / Goal · The honest dream</p>
        <h2 className="tnic-h2">Not longer. <span className="warm">Well</span>, longer.</h2>
        <p className="tnic-lead">
          Longevity&apos;s real goal isn&apos;t just more years — it&apos;s keeping function
          high and pushing the decline into the very end. Drag through a life
          to watch the two paths separate. Toggle the elite protocol to see
          the ceiling a graded stack aims at.
        </p>

        <div className="tnic-tl-toggle">
          <button className={`tnic-chip${showElite ? " on" : ""}`}
            style={showElite ? { color: 'var(--gold)' } : {}}
            onClick={() => setShowElite(v => !v)}>
            <span className="sw" style={{ background: 'var(--gold)' }} />Elite protocol
          </button>
        </div>

        <div className="tnic-tl">
          <div className="tnic-tl-head">
            <div className="tnic-age">{age}<small>YEARS</small></div>
            <div className="tnic-stage-cap">{curStage.cap}</div>
          </div>

          <div className="tnic-stage" style={{ aspectRatio: "1000/500", maxHeight: "48vh", opacity: 1, transform: "none" }}>
            <svg viewBox="0 0 1000 500" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tnic-goldfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(240,196,106,0.45)" />
                  <stop offset="100%" stopColor="rgba(240,196,106,0.05)" />
                </linearGradient>
                <linearGradient id="tnic-elitefill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(95,227,224,0.35)" />
                  <stop offset="100%" stopColor="rgba(95,227,224,0.03)" />
                </linearGradient>
                <clipPath id="tnic-reveal"><rect x={PAD.l} y="0" width={Math.max(0, clipW)} height={TH} /></clipPath>
              </defs>

              {/* frailty threshold */}
              <line x1={PAD.l} y1={vitToY(40)} x2={TW - PAD.r} y2={vitToY(40)}
                stroke="rgba(240,138,122,0.4)" strokeWidth="1" strokeDasharray="3 6" />
              <text x={TW - PAD.r} y={vitToY(40) - 8} textAnchor="end"
                fontFamily="'JetBrains Mono',monospace" fontSize="12" fill="rgba(240,138,122,0.75)">
                frailty threshold
              </text>

              {/* filled areas revealed to age */}
              <g clipPath="url(#tnic-reveal)">
                <path d={areaPath} fill="url(#tnic-goldfill)" />
                {showElite && <path d={eliteAreaPath} fill="url(#tnic-elitefill)" />}
              </g>

              {/* baseline */}
              <path d={basePath} fill="none" stroke="rgba(139,149,176,0.6)" strokeWidth="2" strokeDasharray="2 7" />
              {/* goal */}
              <path d={goalPath} fill="none" stroke="var(--gold)" strokeWidth="3" />
              {/* elite */}
              {showElite && (
                <path d={elitePath} fill="none" stroke="var(--cyan)" strokeWidth="2.5" strokeDasharray="6 5" />
              )}

              {/* milestone markers */}
              {MILESTONES.map((m) => (
                <g key={m.at}>
                  <line x1={ageToX(m.at)} y1={PAD.t} x2={ageToX(m.at)} y2={TH - PAD.b}
                    stroke={m.c} strokeOpacity="0.15" strokeWidth="1" />
                  <circle cx={ageToX(m.at)} cy={vitToY(interp(CURVE_GOAL, m.at))} r="4"
                    fill={m.c} opacity={age >= m.at ? 1 : 0.35} />
                  <text x={ageToX(m.at) + 6} y={vitToY(interp(CURVE_GOAL, m.at)) + (m.below ? 24 : -10)}
                    fontFamily="'JetBrains Mono',monospace" fontSize="10" fill={m.c} opacity={age >= m.at ? 0.95 : 0.4}>
                    {m.label}
                  </text>
                </g>
              ))}

              {/* scrubber */}
              <line x1={ageToX(age)} y1={PAD.t - 10} x2={ageToX(age)} y2={TH - PAD.b}
                stroke="rgba(240,196,106,0.5)" strokeWidth="1.5" />
              <circle cx={ageToX(age)} cy={vitToY(interp(CURVE_GOAL, age))} r="7" fill="var(--gold)" />
              <circle cx={ageToX(age)} cy={vitToY(interp(CURVE_BASE, age))} r="5" fill="rgba(139,149,176,0.9)" />
              {showElite && (
                <circle cx={ageToX(age)} cy={vitToY(interp(CURVE_ELITE, age))} r="6" fill="var(--cyan)" />
              )}

              {/* axis */}
              {[30,45,60,75,90].map((a) => (
                <text key={a} x={ageToX(a)} y={TH - 16} textAnchor="middle"
                  fontFamily="'JetBrains Mono',monospace" fontSize="12" fill="var(--faint)">{a}</text>
              ))}
              <text x={PAD.l} y={vitToY(96) - 6} fontFamily="'JetBrains Mono',monospace"
                fontSize="12" fill="var(--gold)">function preserved →</text>
              <text x={PAD.l + 4} y={vitToY(CURVE_BASE[2][1]) + 22} fontFamily="'JetBrains Mono',monospace"
                fontSize="12" fill="var(--faint)">typical decline</text>
            </svg>
          </div>

          <input className="tnic-range" type="range" min="30" max="95" value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            aria-label="Age" aria-valuetext={`Age ${age} — ${curStage.cap}`} />

          <div className="tnic-tl-stats">
            <div className="tnic-tl-stat">
              <span className="k">Function preserved</span>
              <b>{yearsPreserved} yrs</b>
              <span className="n">Goal-curve gain over the typical trajectory by age {age}.</span>
            </div>
            <div className="tnic-tl-stat">
              <span className="k">Elite ceiling</span>
              <b>+{eliteExtra} yrs</b>
              <span className="n">Additional runway the elite protocol reaches for on top of the goal curve.</span>
            </div>
            <div className="tnic-tl-stat">
              <span className="k">Morbidity compressed</span>
              <b>{morbidityCompressed} yrs</b>
              <span className="n">Delay to crossing the frailty threshold — the point at which everyday function starts to give.</span>
            </div>
          </div>

          <p className="tnic-honest">
            Illustrative curves — the shape of the goal, not a number promised
            on any bottle. The gold area is the difference between fading early
            and staying well to the end. The cyan ceiling is what a graded stack
            aims at — no supplement is proven to land you there.
          </p>
        </div>
      </section>

      {/* ACT 4 — YOUR PATH */}
      <section ref={s4} data-idx="4" id="your-path" className="tnic-act">
        {/* Capstone backdrop — Act 3's goal curve mirrored into an ascent:
            the descent you just scrolled becomes the climb you build. Purely
            decorative; the text below carries the actual content. */}
        <svg className="tnic-act4-sky" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="tnic-act4-rise" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(240,196,106,0.28)" />
              <stop offset="100%" stopColor="rgba(240,196,106,0.02)" />
            </linearGradient>
          </defs>
          <g transform="translate(1000,0) scale(-1,1)">
            <path d={`${goalPath} L ${TW - PAD.r} ${TH} L ${PAD.l} ${TH} Z`} fill="url(#tnic-act4-rise)" />
            <path d={goalPath} fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeOpacity="0.38" />
          </g>
        </svg>
        <p className="tnic-kicker">The path from here</p>
        <h2 className="tnic-h2">You&apos;ve seen the shape. <br />Now <em>build</em> to it.</h2>
        <p className="tnic-lead">
          Everything below this section is the working version of what you just
          watched — the elite interventions graded by human evidence, the full
          library of {COMPOUND_COUNT} compounds, and a NICO Starter Questionnaire that turns
          it into a stack pointed at your goals.
        </p>

        <div className="tnic-final">
          <div className="tnic-final-recap">
            <div className="tnic-final-row">
              <span className="n">01</span>
              <div className="body">
                <div className="t">A molecule is a shape, and the shape is the mechanism.</div>
                <div className="s">Every compound in the library is broken down to what its geometry actually does inside a cell.</div>
              </div>
            </div>
            <div className="tnic-final-row">
              <span className="n">02</span>
              <div className="body">
                <div className="t">Synergies matter as much as ingredients.</div>
                <div className="s">Cofactor pairs, redundant precursors, competing mechanisms — the network view is why the right pairing beats a longer list.</div>
              </div>
            </div>
            <div className="tnic-final-row">
              <span className="n">03</span>
              <div className="body">
                <div className="t">The goal is compressed morbidity, not more years.</div>
                <div className="s">Push the frailty threshold to the end, and every intervention gets evaluated against that curve.</div>
              </div>
            </div>
            <div>
              <Link href="/nico" className="tnic-cta">
                Start the NICO Starter Questionnaire <span className="arr">→</span>
              </Link>
              <Link href="#elite-interventions" className="tnic-cta ghost">
                See the elite picks
              </Link>
            </div>
          </div>

          <div className="tnic-final-elites">
            <div className="head">
              <span>Elite interventions · top {topElites.length}</span>
              <Link href="#elite-interventions">view all →</Link>
            </div>
            {topElites.map((e) => (
              <Link className="tnic-elite-card" key={e.compoundId} href={e.libraryHref}>
                <span className="rank">#{e.rank}</span>
                <div className="body">
                  <div className="name">{e.compoundName}</div>
                  <div className="path">{e.pathway} · {e.mechanismLine}</div>
                </div>
                {/* Canonical tier colors (must match EvidenceTag/tierColor()
                    site-wide) — not this section's local --cyan/--gold/--indigo
                    palette, which would disagree with every other tier badge. */}
                <span className="tier" style={{
                  color: e.evidence === 'A' ? 'var(--accent-emerald)' : e.evidence === 'B' ? 'var(--accent-cyan)' : 'var(--accent-amber)',
                }}>Tier {e.evidence}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
