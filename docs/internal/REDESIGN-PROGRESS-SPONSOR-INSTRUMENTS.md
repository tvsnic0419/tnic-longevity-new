# REDESIGN progress — sponsor instruments (2026-09-15)

Companion to `docs/internal/REDESIGN-PROGRESS.md` and `docs/COPILOT-UI-UPGRADE.md`.

## Shipped on branch `ui/sponsor-instruments`

Extends merged **PR #206** (Phase 1 chrome + DepthBarChart / BiologicalAgeGauge foundations).

### Instruments
- ToolsHub: per-card mini instruments (`ToolInstrumentPreview` — gauge / spark / depth / network)
- DepthBarChart wired: Protocol Engine, Healthspan, Biomarker dashboard, Stack Simulator, Biomarker Impact, SynergyScorePanel
- Home: `HomeInstrumentStrip` (BiologicalAgeGauge + elite depth ranking from derived stats)
- Dashboard: `DashboardInstrumentPanel`
- Premium `ToolEmptyState` on empty tool surfaces
- ChartKit glass tooltips (from #206; retained)

### Phase 2 density
- Library: modules behind `#browse-modules` disclosure
- Products: verified-first (pre-existing / retained)
- Home: `HomeSystemOvertureGate` collapses `#molecule` / `#system` / `#goal` behind Explore the system (hero portal; deferred stages stay in DOM)
- Mobile: ContextBar “Your workspace” disclosure; Stacks equalWidth tabs + Clone & Customize; labs tile balance

### Docs / tests
- `docs/COPILOT-UI-UPGRADE.md` Phase 1 (#206) + Phase 2 checked
- Smoke tests for instrument widgets + overture gate
- Integrity pins: 338 site/content integrity tests green locally
