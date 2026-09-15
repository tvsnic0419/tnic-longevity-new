# First-screen + /tools premium visual pass

**Branch:** `ui/first-screen-tools-premium`  
**Date:** 2026-09-15  
**Goal:** Diligence-grade first viewport + tools shelf under sponsor UI pressure.

## Surfaces

### Homepage first screen
- `HomeDescent` hero: tighter display hierarchy, stronger primary CTA glow (reduced-motion gated), richer library instrument panel depth.
- `HomeInstrumentStrip`: terminal **instrument bezel** chrome + dual instrument modules (BiologicalAgeGauge + DepthBarChart).
- `BiologicalAgeGauge` unscanned state: intentional **Standby · run scan** chrome (`--.-`) instead of a broken em-dash.
- `HomeEliteGrid` / `.elite-card`: deeper elevation, taller media plinth, verify action treated as primary instrument control.

### /tools shelf
- `ToolsHub` cards: equal-weight instrument modules, badge glow, active elevation, `ToolInstrumentPreview` glass/specular modules.
- `ToolEmptyState`: premium instrument empty surface.

### Adjacent hubs (coherence)
- `/stacks` and `/labs` PageHeader wrapped in matching `.hub-instrument-hero` chrome.

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
- globals: site-wide depth package (nav/footer/charts/ranked rows/empty states)
