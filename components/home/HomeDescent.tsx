"use client";

import Link from "next/link";
import {
  useState, useRef, useEffect, useMemo, useCallback,
  type ChangeEvent,
} from "react";
import { eliteInterventions } from "@/lib/elite-interventions";
import { COMPOUND_COUNT } from "@/lib/library-modules";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MoleculeStage } from "@/components/viz/MoleculeStage";
import { HUES } from "@/components/viz/tokens";
import { runWhenVisible, cappedDpr } from "@/lib/raf-visibility";

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
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.tnic-descent {
  --void: #050710;
  --void2: #0a0e1e;
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
  position: relative;
  background:
    radial-gradient(140% 60% at 50% 0%, #0a1024 0%, #050710 45%, #030510 100%);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
  isolation: isolate;
}
.tnic-descent * { box-sizing: border-box; }

.tnic-layer {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; display: block;
}
.tnic-shimmer { z-index: 0; }
.tnic-cursor  { z-index: 1; mix-blend-mode: screen; opacity: .85; }
.tnic-vignette {
  z-index: 2;
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(95,227,224,0.07), transparent 45%),
    radial-gradient(140% 120% at 50% 120%, rgba(240,196,106,0.06), transparent 55%),
    radial-gradient(100% 100% at 50% 50%, transparent 55%, rgba(3,5,12,0.85) 100%);
}
.tnic-grid {
  z-index: 1; opacity: .35;
  background:
    linear-gradient(rgba(150,170,220,0.05) 1px, transparent 1px) 0 0/60px 60px,
    linear-gradient(90deg, rgba(150,170,220,0.05) 1px, transparent 1px) 0 0/60px 60px;
  mask-image: radial-gradient(90% 70% at 50% 40%, #000 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(90% 70% at 50% 40%, #000 40%, transparent 100%);
}

.tnic-act {
  position: relative; z-index: 3;
  min-height: 100svh;
  display: flex; flex-direction: column; justify-content: center;
  padding: clamp(24px, 6vw, 80px);
  max-width: 1240px; margin: 0 auto; width: 100%;
}

.tnic-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--cyan); margin: 0 0 20px;
  display: inline-flex; align-items: center; gap: 12px;
  opacity: 0; transform: translateY(14px);
  transition: opacity .8s ease, transform .8s ease;
}
.tnic-kicker::before { content: ''; width: 26px; height: 1px; background: var(--cyan); opacity: .6; }

.tnic-h1 {
  font-family: 'Fraunces', serif; font-weight: 400;
  font-size: clamp(44px, 9vw, 108px); line-height: 0.96;
  letter-spacing: -0.025em; margin: 0; color: var(--ink);
  opacity: 0; transform: translateY(22px);
  transition: opacity 1s ease .08s, transform 1s ease .08s;
}
.tnic-h1 em { font-style: italic; color: var(--cyan); }
.tnic-h1 .warm { color: var(--gold); font-style: italic; }

.tnic-h2 {
  font-family: 'Fraunces', serif; font-weight: 400;
  font-size: clamp(32px, 6.2vw, 66px); line-height: 1.02;
  letter-spacing: -0.02em; margin: 0; color: var(--ink);
  opacity: 0; transform: translateY(20px);
  transition: opacity 1s ease .08s, transform 1s ease .08s;
}
.tnic-h2 em { font-style: italic; color: var(--cyan); }
.tnic-h2 .warm { color: var(--gold); font-style: italic; }

.tnic-lead {
  font-size: clamp(15px, 2.1vw, 19px); line-height: 1.6;
  color: var(--muted); max-width: 52ch; margin: 22px 0 0;
  opacity: 0; transform: translateY(16px);
  transition: opacity 1s ease .2s, transform 1s ease .2s;
}
.tnic-note {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; letter-spacing: .04em; color: var(--faint);
  margin-top: 14px;
  opacity: 0; transition: opacity 1s ease .5s;
}

.is-in .tnic-kicker,
.is-in .tnic-h1,
.is-in .tnic-h2,
.is-in .tnic-lead,
.is-in .tnic-note,
.is-in .tnic-stage,
.is-in .tnic-molcard,
.is-in .tnic-hero-badges,
.is-in .tnic-final { opacity: 1; transform: none; }

.tnic-hero { align-items: flex-start; text-align: left; }
.tnic-hero-badges {
  display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px;
  opacity: 0; transform: translateY(14px);
  transition: opacity 1s ease .35s, transform 1s ease .35s;
}
.tnic-hero-badges .pill {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--muted);
  padding: 8px 14px; border: 1px solid var(--line); border-radius: 999px;
  background: rgba(14,20,38,0.55); backdrop-filter: blur(6px);
}
.tnic-hero-badges .pill b { color: var(--cyan); font-weight: 500; }
.tnic-hero-badges .pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }

.tnic-cue {
  position: absolute; left: 50%; bottom: 34px; transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
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
.tnic-stage canvas, .tnic-stage svg { width: 100%; height: 100%; display: block; }

.tnic-molhint {
  position: absolute; bottom: 12px; right: 14px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
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
.tnic-molcard h3 { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; margin: 0; letter-spacing: -.01em; }
.tnic-molcard .formula { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--cyan); letter-spacing: .08em; }
.tnic-molcard .facts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; margin-top: 4px; }
.tnic-molcard .fact { display: flex; flex-direction: column; gap: 3px; }
.tnic-molcard .fact .k { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase; color: var(--faint); }
.tnic-molcard .fact .v { font-size: 15px; color: var(--ink); }
.tnic-molcard .why { font-size: 13.5px; color: var(--muted); line-height: 1.55; margin-top: 4px; border-top: 1px solid var(--line); padding-top: 14px; }
.tnic-molcard .cite { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--faint); letter-spacing: .1em; }

.tnic-netwrap { display: grid; grid-template-columns: 1.5fr 1fr; gap: 28px; align-items: start; margin-top: 10px; }
@media (max-width: 900px){ .tnic-netwrap { grid-template-columns: 1fr; } }

.tnic-descent .edge { stroke-width: 1.5; fill: none; opacity: .28; transition: opacity .4s ease, stroke-width .4s ease; }
.tnic-descent .edge.flow { stroke-dasharray: 5 10; animation: tnic-flow 2.6s linear infinite; }
@keyframes tnic-flow { to { stroke-dashoffset: -15; } }
.tnic-descent .edge.dim { opacity: .05; }
.tnic-descent .edge.hot { opacity: 1; stroke-width: 3; filter: drop-shadow(0 0 6px currentColor); }
.tnic-descent .edge.warn { stroke-dasharray: 1 7; opacity: .48; }

.tnic-descent .node { cursor: pointer; }
.tnic-descent .node-hit { fill: transparent; }
.tnic-descent .node-core { transition: opacity .35s ease; }
.tnic-descent .node-label {
  font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
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
  padding: 10px 14px; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px;
  outline: none;
}
.tnic-search:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(95,227,224,0.15); }
.tnic-search::placeholder { color: var(--faint); }
.tnic-chip {
  display: inline-flex; align-items: center; gap: 7px; padding: 8px 12px;
  background: rgba(14,20,38,0.6); border: 1px solid var(--line); color: var(--muted);
  border-radius: 999px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  letter-spacing: .14em; text-transform: uppercase; cursor: pointer; transition: all .2s ease;
}
.tnic-chip.on { color: var(--ink); border-color: currentColor; background: rgba(255,255,255,0.03); }
.tnic-chip .sw { width: 8px; height: 8px; border-radius: 50%; }

.tnic-readout {
  background: linear-gradient(180deg, var(--panel2), var(--panel));
  border: 1px solid var(--line); border-radius: 18px; padding: 22px 22px 24px;
  min-height: 260px;
}
.tnic-readout .r-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--faint); display: flex; align-items: center; gap: 8px; }
.tnic-readout .r-elite {
  display: inline-flex; align-items: center; gap: 5px; margin-left: 4px;
  color: var(--gold); font-weight: 500;
}
.tnic-readout .r-elite svg { width: 11px; height: 11px; }
.tnic-readout .r-name { font-family: 'Fraunces', serif; font-size: 30px; margin: 6px 0 2px; letter-spacing: -.01em; }
.tnic-readout .r-role { font-size: 13.5px; color: var(--muted); margin-bottom: 12px; }
.tnic-readout .r-meta { display: flex; gap: 12px; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .1em; color: var(--faint); text-transform: uppercase; }
.tnic-readout .r-meta b { color: var(--ink); font-weight: 500; letter-spacing: .04em; }
.tnic-readout .r-link { display: flex; gap: 11px; padding: 12px 0; border-top: 1px solid var(--line); }
.tnic-readout .r-link .r-dot { width: 9px; height: 9px; border-radius: 50%; margin-top: 5px; flex: none; box-shadow: 0 0 8px currentColor; }
.tnic-readout .r-link .r-to { font-size: 14px; font-weight: 600; color: var(--ink); }
.tnic-readout .r-link .r-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; margin-left: 8px; }
.tnic-readout .r-link .r-why { font-size: 12.5px; color: var(--muted); line-height: 1.5; margin-top: 3px; }
.tnic-readout .r-cta {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  color: var(--cyan); text-decoration: none; font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  border-top: 1px solid var(--line); padding-top: 14px; width: 100%;
}
.tnic-readout .r-cta:hover { color: var(--gold); }
.tnic-readout .r-empty { color: var(--faint); font-size: 14px; line-height: 1.6; padding-top: 8px; }

.tnic-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 16px; }
.tnic-legend .lg { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .1em; color: var(--muted); text-transform: uppercase; }
.tnic-legend .lg .sw { width: 10px; height: 10px; border-radius: 50%; }

.tnic-tl { margin-top: 8px; }
.tnic-tl-head { display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap; margin-bottom: 6px; }
.tnic-age { font-family: 'Fraunces', serif; font-size: clamp(48px,8vw,80px); line-height: 1; color: var(--gold); letter-spacing: -.02em; }
.tnic-age small { font-size: .32em; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: .12em; margin-left: 8px; }
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
.tnic-tl-stat b { font-family: 'Fraunces', serif; font-size: 26px; color: var(--gold); letter-spacing: -.01em; }
.tnic-tl-stat .k { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--faint); }
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
.tnic-final-row .n { font-family: 'Fraunces', serif; font-size: 28px; color: var(--cyan); width: 36px; text-align: center; flex: none; }
.tnic-final-row .body { flex: 1; }
.tnic-final-row .body .t { font-size: 15px; color: var(--ink); font-weight: 500; }
.tnic-final-row .body .s { font-size: 12.5px; color: var(--muted); line-height: 1.5; margin-top: 2px; }

.tnic-final-elites { display: flex; flex-direction: column; gap: 12px; }
.tnic-final-elites .head {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .2em;
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
  font-family: 'Fraunces', serif; font-size: 22px; color: var(--gold);
  width: 32px; text-align: center; flex: none;
}
.tnic-elite-card .body { flex: 1; min-width: 0; }
.tnic-elite-card .body .name { font-size: 15px; font-weight: 600; color: var(--ink); }
.tnic-elite-card .body .path { font-size: 12px; color: var(--muted); margin-top: 2px; }
.tnic-elite-card .tier {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .18em;
  text-transform: uppercase; padding: 4px 8px; border-radius: 999px;
  border: 1px solid currentColor;
}

.tnic-cta {
  display: inline-flex; align-items: center; gap: 12px; margin-top: 22px;
  padding: 14px 24px; border-radius: 999px;
  background: linear-gradient(135deg, var(--cyan), var(--indigo));
  color: #050710; font-weight: 600; font-size: 15px; text-decoration: none;
  box-shadow: 0 0 32px rgba(95,227,224,0.3);
  transition: transform .2s ease, box-shadow .2s ease;
}
.tnic-cta:hover { transform: translateY(-1px); box-shadow: 0 0 40px rgba(95,227,224,0.5); }
.tnic-cta .arr { display: inline-block; transition: transform .2s ease; }
.tnic-cta:hover .arr { transform: translateX(4px); }
.tnic-cta.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); box-shadow: none; margin-left: 12px; }
.tnic-cta.ghost:hover { border-color: var(--cyan); }

.tnic-rail-track { position: absolute; top: 0; right: clamp(14px,2.5vw,30px); bottom: 0; width: 84px; pointer-events: none; z-index: 6; }
.tnic-rail { position: sticky; top: 50vh; transform: translateY(-50%); display: flex; flex-direction: column; gap: 4px; pointer-events: auto; }
@media (max-width: 720px){ .tnic-rail-track { display: none; } }
.tnic-rail button {
  background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px;
  padding: 6px 0; color: var(--faint); justify-content: flex-end;
}
.tnic-rail .lbl { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; opacity: 0; transform: translateX(6px); transition: all .3s ease; }
.tnic-rail button:hover .lbl, .tnic-rail button.on .lbl { opacity: 1; transform: none; color: var(--ink); }
.tnic-rail .tick { width: 26px; height: 2px; background: currentColor; border-radius: 2px; transition: all .3s ease; }
.tnic-rail button.on { color: var(--cyan); }
.tnic-rail button.on .tick { width: 44px; box-shadow: 0 0 12px var(--cyan); }

.tnic-descent[data-reduced="true"] .bar,
.tnic-descent[data-reduced="true"] .edge.flow,
.tnic-descent[data-reduced="true"] .node-pulse { animation: none !important; }
`;


type TierKey = "established" | "mechanistic" | "exploratory" | "caution";
const TIER: Record<TierKey, { color: string; label: string }> = {
  established: { color: "#5fe3e0", label: "Established" },
  mechanistic: { color: "#8c8cf5", label: "Mechanistic" },
  exploratory: { color: "#b98cf0", label: "Exploratory" },
  caution:     { color: "#eaa24a", label: "Caution" },
};

const NODE_DEFS: Array<[string, string, string, string | null]> = [
  ["curcumin", "Curcumin", "anti-inflammatory signaling", null],
  ["piperine", "Piperine", "absorption enhancer", null],
  ["omega3", "Omega-3", "resolving inflammation", null],
  ["resveratrol", "Resveratrol", "sirtuin / healthy-aging", "resveratrol"],
  ["pterostilbene", "Pterostilbene", "longer-acting resveratrol", "pterostilbene"],
  ["fisetin", "Fisetin", "senolytic / cellular cleanup", null],
  ["vitd", "Vitamin D", "calcium uptake, immune", null],
  ["k2", "Vitamin K2", "directs calcium to bone", null],
  ["magnesium", "Magnesium", "enzyme cofactor", null],
  ["zinc", "Zinc", "immune, enzymes", null],
  ["copper", "Copper", "balances zinc", null],
  ["iron", "Iron", "oxygen transport", null],
  ["vitc", "Vitamin C", "antioxidant, absorption", null],
  ["folate", "Folate", "one-carbon metabolism", null],
  ["b12", "Vitamin B12", "methylation, nerves", null],
  ["b6", "Vitamin B6", "homocysteine balance", null],
];
const NCX = 500, NCY = 350, NRX = 360, NRY = 260;

type NodeData = { name: string; role: string; ang: number; x: number; y: number; deg?: number; eliteCompoundId: string | null };
const NODES: Record<string, NodeData> = {};
NODE_DEFS.forEach(([id, name, role, elite], i) => {
  const ang = (i / NODE_DEFS.length) * Math.PI * 2 - Math.PI / 2;
  NODES[id] = { name, role, ang, x: NCX + Math.cos(ang) * NRX, y: NCY + Math.sin(ang) * NRY, eliteCompoundId: elite };
});

type Edge = { a: string; b: string; tier: TierKey; why: string };
const EDGES: Edge[] = [
  { a: "curcumin", b: "piperine", tier: "established", why: "Absorption — piperine blocks curcumin's breakdown in the gut, so far more reaches your blood." },
  { a: "iron", b: "vitc", tier: "established", why: "Absorption — vitamin C converts iron into the form your gut takes up far more easily." },
  { a: "vitd", b: "k2", tier: "established", why: "Calcium traffic — vitamin D pulls calcium in; K2 steers it into bone instead of arteries." },
  { a: "folate", b: "b12", tier: "established", why: "One-carbon metabolism — together they clear homocysteine and keep methylation running." },
  { a: "curcumin", b: "omega3", tier: "established", why: "Pathways — NF-κB inhibition plus pro-resolving mediators. The anti-inflammatory effects add up." },
  { a: "vitd", b: "magnesium", tier: "mechanistic", why: "Activation — magnesium is a required cofactor for the enzymes that switch vitamin D on." },
  { a: "b6", b: "folate", tier: "mechanistic", why: "Homocysteine — B6 covers the transsulfuration arm while folate handles remethylation." },
  { a: "b6", b: "b12", tier: "mechanistic", why: "Homocysteine — part of the B6 / B12 / folate trio that lowers it together." },
  { a: "resveratrol", b: "piperine", tier: "mechanistic", why: "Absorption — piperine raises resveratrol uptake, though human data is thinner than for curcumin." },
  { a: "fisetin", b: "curcumin", tier: "mechanistic", why: "Pathways — two polyphenols working on inflammation and worn-out cells from different angles." },
  { a: "resveratrol", b: "pterostilbene", tier: "exploratory", why: "Related sirtuin pathways; pterostilbene lingers longer in the body. Promising, not proven together." },
  { a: "pterostilbene", b: "fisetin", tier: "exploratory", why: "Both studied as senolytics — clearing senescent 'zombie' cells. Early, mostly preclinical." },
  { a: "fisetin", b: "omega3", tier: "exploratory", why: "Resolving inflammation from different directions. Rationale is sound; the pairing is under-studied." },
  { a: "curcumin", b: "resveratrol", tier: "exploratory", why: "Overlapping antioxidant signaling. Plausible, not isolated in trials." },
  { a: "zinc", b: "copper", tier: "caution", why: "Competes — sustained high zinc quietly depletes copper. Pair long-term zinc with a little copper." },
  { a: "iron", b: "zinc", tier: "caution", why: "Competes — iron and zinc fight for the same uptake path at high doses. Take them at different times." },
];

EDGES.forEach((e) => {
  NODES[e.a].deg = (NODES[e.a].deg || 0) + 1;
  NODES[e.b].deg = (NODES[e.b].deg || 0) + 1;
});
function edgePath(A: NodeData, B: NodeData): string {
  const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
  const cx = mx + (NCX - mx) * 0.35, cy = my + (NCY - my) * 0.35;
  return `M ${A.x} ${A.y} Q ${cx} ${cy} ${B.x} ${B.y}`;
}

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

const MILESTONES: Array<{ at: number; label: string; c: string }> = [
  { at: 40, label: "NAD⁺ decline steepens", c: "#5fe3e0" },
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
  const [active, setActive] = useState(0);
  const [selNode, setSelNode] = useState<string | null>(null);
  const [age, setAge] = useState(50);
  const reduced = useReducedMotion();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<Set<TierKey>>(new Set());
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
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    const palettes: Array<[number, number, number]> = [
      [95,227,224], [95,227,224], [140,140,245], [240,196,106], [95,227,224],
    ];
    let cur: [number, number, number] = [95,227,224];

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
            const o = (1 - d2 / 14000) * 0.08;
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
          const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
          g.addColorStop(0, `rgba(${cr},${cg},${cb},${l.alpha * tw})`);
          g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
          if (li < 2) {
            ctx.fillStyle = `rgba(230,240,255,${0.55 * tw})`;
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
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
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
        g.addColorStop(0, "rgba(95,227,224,0.14)");
        g.addColorStop(0.4, "rgba(140,140,245,0.06)");
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
          setActive(idx); activeRef.current = idx;
        }
      });
    }, { threshold: 0.45 });
    sectionRefs.forEach((s) => { if (s.current) obs.observe(s.current); });
    return () => obs.disconnect();
  }, [sectionRefs]);

  const goTo = useCallback((i: number) => {
    sectionRefs[i]?.current?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" });
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

  const nodeEdges = useCallback((id: string) => EDGES.filter((e) => e.a === id || e.b === id), []);
  const isEdgeHot = (e: Edge) => selNode && (e.a === selNode || e.b === selNode);
  const eliteById = useMemo(() => {
    const m = new Map<string, typeof eliteInterventions[number]>();
    for (const e of eliteInterventions) m.set(e.compoundId, e);
    return m;
  }, []);

  const toggleTier = (t: TierKey) => {
    setTierFilter((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  };
  const nodeMatchesSearch = (id: string) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return NODES[id].name.toLowerCase().includes(q) || NODES[id].role.toLowerCase().includes(q);
  };
  const edgePasses = (e: Edge) => tierFilter.size === 0 || tierFilter.has(e.tier);

  const topElites = eliteInterventions.slice(0, 4);
  const selElite = selNode ? NODES[selNode].eliteCompoundId && eliteById.get(NODES[selNode].eliteCompoundId!) : null;

  return (
    <div className="tnic-descent" data-reduced={reduced} ref={rootRef}>
      <style>{CSS}</style>
      <canvas ref={shimmerRef} className="tnic-layer tnic-shimmer" />
      <div className="tnic-layer tnic-grid" />
      <canvas ref={cursorRef} className="tnic-layer tnic-cursor" />
      <div className="tnic-layer tnic-vignette" />

      <div className="tnic-rail-track">
        <nav className="tnic-rail" aria-label="Descent sections">
          {["Arrive", "Molecule", "Synergies", "Healthspan", "Your path"].map((l, i) => (
            <button key={l} className={active === i ? "on" : ""} onClick={() => goTo(i)}>
              <span className="lbl">{l}</span><span className="tick" />
            </button>
          ))}
        </nav>
      </div>

      {/* ACT 0 — ARRIVE */}
      <section ref={s0} data-idx="0" className="tnic-act tnic-hero">
        <p className="tnic-kicker">TNiC · longevity, shown honestly</p>
        <h1 className="tnic-h1">See what{' '}<br />you&apos;re <em>protecting</em>.</h1>
        <p className="tnic-lead">
          You can&apos;t feel a cell aging. So we made it visible — the real biology
          behind your stack, rendered instead of promised. Five scenes. One
          continuous descent, from a molecule to the life it defends.
        </p>
        <div className="tnic-hero-badges">
          <span className="pill"><span className="dot" /><b>{eliteInterventions.length}</b>&nbsp;elite interventions</span>
          <span className="pill"><span className="dot" /><b>{COMPOUND_COUNT}</b>&nbsp;graded compounds</span>
          <span className="pill"><span className="dot" /><b>12</b>&nbsp;hallmarks of aging</span>
          <span className="pill"><span className="dot" /><b>A–C</b>&nbsp;evidence tiers</span>
        </div>
        <div className="tnic-cue"><span className="bar" />descend</div>
      </section>

      {/* ACT 1 — MOLECULE */}
      <section ref={s1} data-idx="1" className="tnic-act">
        <p className="tnic-kicker">01 — the molecule</p>
        <h2 className="tnic-h2">It starts smaller{' '}<br />than you can <em>picture</em>.</h2>
        <p className="tnic-lead">
          Trans-resveratrol — studied for sirtuin activation and healthy-aging
          pathways. Turn it over, zoom in. This is the actual shape doing the
          work, rendered live in your browser.
        </p>

        <div className="tnic-molwrap">
          <div className="tnic-stage">
            <MoleculeStage geometryId="resveratrol" hue={HUES.cyan} />
            <div className="tnic-molhint"><span className="dot" />drag · scroll to zoom</div>
          </div>

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
              <div className="fact"><span className="k">Evidence tier</span><span className="v" style={{ color: 'var(--gold)' }}>B — Human</span></div>
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
      <section ref={s2} data-idx="2" className="tnic-act">
        <p className="tnic-kicker">02 — your stack, alive</p>
        <h2 className="tnic-h2">Nothing works <em>alone</em>.</h2>
        <p className="tnic-lead">
          Tap a compound to trace how it interacts with the rest — the boosts,
          the clashes, the elite picks marked with a star. Every link is graded
          by evidence strength. Filter by tier, or search for a specific one.
        </p>

        <div className="tnic-toolbar">
          <input
            className="tnic-search" type="search" placeholder="Search compounds — e.g. resveratrol, magnesium…"
            value={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
          {(Object.keys(TIER) as TierKey[]).map((t) => (
            <button key={t} className={`tnic-chip${tierFilter.has(t) ? " on" : ""}`}
              style={tierFilter.has(t) ? { color: TIER[t].color } : {}}
              onClick={() => toggleTier(t)}>
              <span className="sw" style={{ background: TIER[t].color }} />{TIER[t].label}
            </button>
          ))}
        </div>

        <div className="tnic-netwrap">
          <div className="tnic-stage" style={{ aspectRatio: "10/7", maxHeight: "62vh" }}>
            <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="tnic-node-core" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#f0f6ff" />
                  <stop offset="60%" stopColor="#5fe3e0" />
                  <stop offset="100%" stopColor="#1e3350" />
                </radialGradient>
                <radialGradient id="tnic-node-elite" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#fff2d4" />
                  <stop offset="60%" stopColor="#f0c46a" />
                  <stop offset="100%" stopColor="#4a3510" />
                </radialGradient>
              </defs>
              {EDGES.map((e, i) => {
                const A = NODES[e.a], B = NODES[e.b];
                const hot = isEdgeHot(e);
                const move = e.tier === "caution" ? "warn" : "flow";
                const passes = edgePasses(e);
                const cls = `edge ${move}${!passes ? " dim" : selNode ? (hot ? " hot" : " dim") : ""}`;
                return (
                  <path key={i} className={cls} d={edgePath(A, B)}
                    stroke={TIER[e.tier].color} />
                );
              })}
              {Object.entries(NODES).map(([id, n]) => {
                const dim = (selNode && selNode !== id && !nodeEdges(selNode).some((e) => e.a === id || e.b === id))
                  || !nodeMatchesSearch(id);
                const sel = selNode === id;
                const elite = !!n.eliteCompoundId && eliteById.has(n.eliteCompoundId);
                const nr = 13 + Math.min(n.deg || 1, 6) * 1.8;
                return (
                  <g key={id} className={`node${dim ? " dim" : ""}${sel ? " sel" : ""}${elite ? " elite" : ""}`}
                    onClick={() => setSelNode(sel ? null : id)}>
                    <circle className="node-pulse" cx={n.x} cy={n.y} r={nr + 10} fill={elite ? "#f0c46a" : "#5fe3e0"} opacity="0.2" />
                    <circle className="node-ring" cx={n.x} cy={n.y} r={nr + 6} />
                    <circle className="node-hit" cx={n.x} cy={n.y} r={nr + 26} />
                    <circle className="node-core" cx={n.x} cy={n.y} r={nr}
                      fill={elite ? "url(#tnic-node-elite)" : "url(#tnic-node-core)"}
                      stroke={elite ? "#f0c46a" : "#dce8ff"} strokeWidth="1.5" />
                    <g className="elite-badge" transform={`translate(${n.x + nr * 0.75},${n.y - nr * 0.75})`}>
                      <circle r="8" fill="#f0c46a" />
                      <path d={STAR_D} fill="#050710" transform="scale(0.9)" />
                    </g>
                    <text className="node-label"
                      x={NCX + Math.cos(n.ang) * (NRX + 48)}
                      y={NCY + Math.sin(n.ang) * (NRY + 40)}
                      textAnchor="middle">{n.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div>
            <div className="tnic-readout">
              {selNode ? (
                <>
                  <div className="r-eyebrow">
                    Compound
                    {selElite && (
                      <span className="r-elite">
                        <svg viewBox="-8 -8 16 16"><path d={STAR_D} fill="currentColor" /></svg>
                        TNiC elite pick
                      </span>
                    )}
                  </div>
                  <div className="r-name">{NODES[selNode].name}</div>
                  <div className="r-role">Role · {NODES[selNode].role}</div>
                  {selElite && (
                    <div className="r-meta">
                      <span>Evidence <b>{selElite.evidence}</b></span>
                      <span>Studies <b>{selElite.studyCount}</b></span>
                      <span>Rank <b>#{selElite.rank}</b></span>
                    </div>
                  )}
                  {nodeEdges(selNode).map((e, i) => {
                    const otherId = e.a === selNode ? e.b : e.a;
                    return (
                      <div className="r-link" key={i}>
                        <span className="r-dot" style={{ background: TIER[e.tier].color, color: TIER[e.tier].color }} />
                        <div>
                          <span className="r-to">{NODES[otherId].name}</span>
                          <span className="r-tag" style={{ color: TIER[e.tier].color }}>
                            {TIER[e.tier].label}
                          </span>
                          <div className="r-why">{e.why}</div>
                        </div>
                      </div>
                    );
                  })}
                  {selElite && (
                    <Link className="r-cta" href={selElite.libraryHref}>
                      Full evidence module <span>→</span>
                    </Link>
                  )}
                </>
              ) : (
                <div className="r-empty">
                  Tap a node to trace its interactions.<br /><br />
                  Cool links are synergies; amber links compete and belong at
                  different times of day. Color shows how strong the evidence is.
                  A gold star marks a TNiC elite pick.
                </div>
              )}
            </div>
            <div className="tnic-legend">
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
          </div>
        </div>
      </section>

      {/* ACT 3 — TIMELINE */}
      <section ref={s3} data-idx="3" className="tnic-act">
        <p className="tnic-kicker">03 — the honest dream</p>
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
                  <text x={ageToX(m.at) + 6} y={vitToY(interp(CURVE_GOAL, m.at)) - 10}
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
            onChange={(e) => setAge(Number(e.target.value))} aria-label="Age" />

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
      <section ref={s4} data-idx="4" className="tnic-act">
        <p className="tnic-kicker">04 — the path from here</p>
        <h2 className="tnic-h2">You&apos;ve seen the shape. <br />Now <em>build</em> to it.</h2>
        <p className="tnic-lead">
          Everything below this section is the working version of what you just
          watched — the elite interventions graded by human evidence, the full
          library of {COMPOUND_COUNT} compounds, and a 90-second quiz that turns
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
                <div className="s">Absorption partners, competing minerals, cofactors — the network view is why timing beats stacking.</div>
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
              <Link href="/quiz" className="tnic-cta">
                Start the 90-second quiz <span className="arr">→</span>
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
                <span className="tier" style={{
                  color: e.evidence === 'A' ? 'var(--cyan)' : e.evidence === 'B' ? 'var(--gold)' : 'var(--indigo)',
                }}>Tier {e.evidence}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
