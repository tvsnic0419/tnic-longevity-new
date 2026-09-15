# First-screen + /tools premium visual pass

**Branch:** `ui/first-screen-tools-premium`  
**Date:** 2026-09-15  
**Goal:** Diligence-grade first viewport + tools shelf under sponsor UI pressure.

## Surfaces

### Homepage first screen
- `HomeDescent` hero: tighter display hierarchy, stronger primary CTA glow (reduced-motion gated), richer library instrument panel depth.
- `HomeInstrumentStrip`: terminal **instrument bezel** chrome + dual instrument modules (BiologicalAgeGauge + DepthBarChart) with **items-stretch** mirrored panels.
- `BiologicalAgeGauge` unscanned state: intentional **Standby · run scan** chrome (`--.-`) instead of a broken em-dash.
- `HomeEliteGrid` / `.elite-card`: deeper elevation, taller media plinth, equal-height grid, verify action treated as primary instrument control.

### /tools shelf
- `ToolsHub` cards: equal-weight instrument modules, badge glow, active elevation, `ToolInstrumentPreview` glass/specular modules.
- Concierge decision routes: equal-height stretch grid.
- `ToolEmptyState`: premium instrument empty surface.

### Adjacent hubs (coherence)
- `/stacks` and `/labs` PageHeader wrapped in matching `.hub-instrument-hero` chrome.
- Dashboard DIP: instrument-bezel + mirrored gauge/coverage panels.
- Elite8: hub-instrument-hero + symmetric top-3 row.
- Nav/Footer: site-nav / site-footer material hooks.
- Shop: shop-pick-card equal-height material.

## Thomas brief (non-negotiable)

1. **Symmetry** — aligned columns, equal card heights, balanced gutters, mirrored paired instruments, consistent section rhythm.
2. **Return ambience** — cohesive luminous dark glass; visitors return because it feels good to be there.
3. **Proactive health calm** — clarifying/hopeful, not clinical clutter or hype.
4. **Orchestrated depth** — sleek slopes, beautiful depth rendering, instrument widgets in one material language sitewide.

## Constraints honored
- No invented evidence/data — Elite LQ + compound counts remain derived.
- Reused `.premium-card`, ChartKit/DepthBarChart, BiologicalAgeGauge, Button, vizDefs, `.tnic-button-*`.
- `prefers-reduced-motion` disables CTA breathe, LED pulse, standby pulse, hover lifts.
- Overture gate unchanged — theater stays collapsed behind Explore.

## Tests
- `HomeInstrumentStrip.test.tsx` — bezel + standby chrome
- `ToolInstrumentPreview.test.tsx` — instrument-module class
- `ToolEmptyState.test.tsx` — premium empty

## Site-wide expansion (same PR)

- `PageHeader` handoff/default: `.hub-instrument-hero` + theme `data-hub-accent`
- `CinematicHubHero`: research-hero specular instrument language (CSS)
- `Elite8Hub` hero + ranked cards: instrument language
- `DashboardInstrumentPanel`: instrument bezel
- Shop/product cards: decision-surface classes
- `app/instrument-depth.css`: site-wide depth + Thomas symmetry/ambience package
