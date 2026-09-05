# TNiC Design System & Style Guide

> Version 1.2 · August 2026  
> Governs typography, spacing, components, accessibility, and page patterns across tnic.help.  
> v1.1 documents the cinematic viz family (§7, §12) that the premium hubs are built on.  
> v1.2 corrects the drifted §2 color values, documents the signal roles, the
> canonical tier scale, the interaction primitives (`IconButton`,
> `SelectableChip`, `ExternalAction`, `InteractiveSciencePanel`) and the
> hit-area rules.

---

## 1. Design Principles

1. **Scannable first** — Users skim. Lead with labels, stats, and cards; bury detail in accordions.
2. **Evidence visible** — Tier badges, citations, and status colors appear before prose.
3. **Mobile-native** — 44px touch targets, horizontal scroll for tables/tabs, single-column defaults.
4. **Privacy legible** — Local-first data patterns are explained inline, not hidden in footnotes.
5. **Accessible by default** — Focus rings, semantic HTML, WCAG AA contrast, reduced-motion support.

---

## 2. Color System

Values below are the **dark-theme** defaults, verified against
`app/globals.css`. Every one is redefined under `[data-theme="light"]`.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-base` | `#020811` | Page background (the brief's `surface.canvas`) |
| `--color-bg-elevated` | `#080f1c` | Raised cards, chart panels (`surface.raised`) |
| `--color-bg-surface` | `rgba(12,20,40,0.65)` | Translucent panels over the canvas |
| `--color-bg-muted` | `rgba(255,255,255,0.03)` | Quiet fills, meter tracks |
| `--surface-selected` | 10% `--selected-accent` | **Chosen** state — selected chips, picked answers, active rail step |
| `--color-text-primary` | `#fafafa` | Headings, values |
| `--color-text-secondary` | `#edeef1` | Body copy |
| `--color-text-muted` | `#ced0d7` | Supporting text |
| `--color-text-faint` | `#c1c2ca` | Labels, captions |
| `--color-border-subtle` | `rgba(255,255,255,0.07)` | Card borders |
| `--color-border-focus` | `rgba(0,224,255,0.75)` | Focus rings |

### Signal roles

One rule decides which accent a thing gets. Cyan explores, emerald chooses,
gold ranks.

| Token | Value | Means |
|-------|-------|-------|
| `--accent-cyan` | `#00e0ff` | Exploration and interactive data — hover, focus, network links, active scientific visuals |
| `--accent-emerald` | `#34d399` | Progress and **chosen** state — primary CTA, selected option, completed step |
| `--signal-elite` | `#d8b25f` | Elite / rank **only**. Deliberately not amber, so a rank accent can never be mistaken for a Tier C badge |

### Evidence tiers

The canonical A/B/C mapping. Lives in `components/trust/EvidenceTag.tsx`
(`tierMeta`) and is mirrored by `tierColor()` in `components/viz/tokens.ts`.
A tier must never be communicated by color alone — `EvidenceTag` always ships
the tier letter, its descriptor, and a three-bar strength meter.

| Tier | Token | Descriptor | Meter |
|------|-------|-----------|-------|
| A | `--accent-emerald` | Clinical | 3 bars |
| B | `--accent-cyan` | Emerging | 2 bars |
| C | `--accent-amber` | Preclinical | 1 bar |

`--status-optimal` / `-watch` / `-critical` share those hexes but are a
**different axis** (biomarker status, not evidence grade). Don't read one as
the other.

### Theme accents (one per hub/section)

| Theme | Hub / Section | Solid CTA |
|-------|---------------|-----------|
| `cyan` | Library, Science | `bg-cyan-400` |
| `violet` | Stacks | `bg-violet-400` |
| `rose` | Labs | `bg-rose-400` |
| `emerald` | Trust, Success | `bg-emerald-400` |
| `amber` | Warnings | `bg-amber-400` |

### Status colors

| Status | Text | Background |
|--------|------|------------|
| Optimal | `text-emerald-400` | `bg-emerald-400/10` |
| Watch | `text-amber-400` | `bg-amber-400/10` |
| Critical | `text-rose-400` | `bg-rose-400/10` |

---

## 3. Typography Scale

| Class | Size | Use |
|-------|------|-----|
| `.heading-page` | clamp 30–48px | Hub H1 |
| `.heading-section` | clamp 24–40px | Section H2 |
| `.heading-card` | 16px / 600 | Card titles |
| `.text-h3` | clamp 19–22px | Sub-section heading, one step below `.heading-section` — long-form/utility pages (trust, legal) via `.prose-tnic` |
| `.text-body` | 16px / 1.65 | Descriptions |
| `.text-body-sm` | 14px / 1.6 | Card body, table cells |
| `.text-caption` | 12px | Meta, disclaimers |
| `.text-label` | 11px mono uppercase | Eyebrows, column headers |

**Before:** Mixed `text-[10px]`, `text-xs`, `text-sm` with no hierarchy.  
**After:** Seven semantic classes used consistently via `PageHeader`, `SectionShell`, cards.

---

## 4. Spacing & Layout

| Token | Value |
|-------|-------|
| `.container-page` | max 80rem, fluid `px` clamp 16–24px |
| Page vertical | `py-16 md:py-24 lg:py-28` |
| Section vertical | `py-16 md:py-24 lg:py-32` |
| Grid gap | `gap-4 md:gap-6 lg:gap-8` |
| Touch min | `--space-touch: 2.75rem` (44px) |
| Spacing scale | `--space-1…9`: 4, 8, 12, 16, 24, 32, 48, 72, 112px |

**Touch targets.** Prefer making the control 44px. Expand the *hit area*
instead only where real height would wreck the layout — a compact filter chip
in a wrapping row.

| Class | Use for |
|---|---|
| `.touch-target` | Controls that can simply be 44px (icon buttons, nav rows, rail steps) |
| `.tap-expand-y` | A compact control inside a row of them — grows the hit area **vertically only** |
| `.chip-row` | The container for a wrapping chip row. Its 16px row gap is load-bearing |

An expanded hit area that overlaps a neighbour's is worse than a small one: the
wrong control receives the tap, silently. **This bit twice.** On the homepage
filter row, 28px chips at a 36px row pitch overlapped by 8px and a tap 6px
below one chip landed on the chip in the row beneath. On the section rail, 14px
ticks at an 18px pitch overlapped so badly that clicking one step activated
another — caught only once the test clicked *every* step rather than the last
one, which has no later sibling to steal from it.

So: pair `.tap-expand-y` with `.chip-row`, whose 16px gap makes the pitch
exactly 44px; and never expand a control whose neighbours sit closer than 44px
away. A both-axes variant existed briefly and was removed once nothing used it.

---

## 5. Components (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| `PageShell` | Hub page wrapper + container |
| `PageHeader` | Eyebrow + title + description + meta |
| `TabBar` | Accessible tablist with scroll on mobile |
| `StatStrip` | 2-col mobile → auto-fit desktop summary |
| `Button` | primary / secondary / ghost / danger / outline (the canonical CTA primitive) |
| `IconButton` | The canonical icon-only control — 40/44px, `type="button"`, label required (doubles as tooltip) |
| `SelectableChip` | The canonical selection control — `shape="chip"` for filter rows, `shape="card"` for questionnaire answers. Selected is always emerald |
| `ExternalAction` | The canonical off-site action — decides `rel` once, always names the destination and warns it opens a new tab |
| `InteractiveSciencePanel` | The shell every interactive visualization sits in — title bar, legend, Reset/Zoom/Fullscreen, keyboard rotation, first-use cue, always-present text summary |
| `Accordion` | Expandable detail without page jump |
| `DataTable` | Scrollable table + `sr-only` caption |
| Card surfaces | `.premium-card` (canonical), `GlassPanel` / `.glass-deep`, `.card-elevated`, `.glass` |

Import theme maps from `lib/design-system.ts`. **Card surfaces:** default to
`.premium-card` (accent-aware via `--card-accent`) for content cards and
`GlassPanel` for layered glass moments; the legacy `.card-base` was retired.
Every card class draws its elevation from the shared `--glass-shadow-*` tokens
(one shadow recipe), so surfaces read at the same depth in both themes.

**Buttons — one system.** Reach for the `<Button>` primitive
(`components/ui/Button.tsx`) in new code; `variant="primary"` is the signature
cyan→emerald gradient. That gradient — its fill, shadow, and hover — is defined
**once** in `globals.css` on a shared `.btn-gradient, .tnic-button-primary` rule
(the "Signature primary CTA" block), so the React path and the CSS skins can
never drift. The `.tnic-button-*` classes are **skins for link-shaped CTAs**
(`<Link>`/`<a>`) that must control their own padding/radius: `-primary`
(gradient), `-accent` (solid, tinted via `--btn-accent`), `-tonal` (translucent
accent), `-outline` (theme-neutral). Don't hand-roll a button — use the
primitive or one of these skins.

---

## 6. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Focus visible | `.focus-ring` on all interactives |
| Skip link | `SkipLink` → `#main-content` |
| Touch targets | `min-h-[var(--space-touch)]` on buttons/nav |
| Color contrast | Body text `--color-text-secondary` (`#edeef1`) on `--color-bg-base` (`#020811`) |
| Motion | `prefers-reduced-motion` disables animations |
| Tables | `scope="col"`, caption, horizontal scroll |
| Tabs | `role="tablist"`, `aria-selected`, `aria-controls` |
| Forms | `<label>` + `htmlFor`, `aria-label` on icon-only |
| Live regions | `aria-live="polite"` on dynamic panels |

---

## 7. Page Patterns

### Hub pages — cinematic pattern (`/library`, `/stacks`, `/labs`, `/hallmarks`, `/peptides`, `/pathways`, `/tools`, `/trust`, `/products`, `/best`, `/supplement-guides`)

Every top-level hub opens with the shared cinematic band, then anchors its
semantic title beneath it:

```
SubPageLayout (folder layout.tsx → Nav + ContextBar + Footer)
  └─ CinematicHubHero   (decorative: molecular field + hero title + derived stat rail + CTAs)
  └─ PageHeader as="h1" (the single semantic <h1> — hero title is a non-heading <p>)
  └─ content grid (.premium-card / GlassPanel)
```

- **One `<h1>` per page.** `CinematicHubHero`'s `hh-title` is intentionally a
  decorative `<p>`; the real `<h1>` lives in the `PageHeader` (or a
  title-bearing content component) directly below it.
- **Hero accent = the page's `PageHeader` theme**, so hero and header read as one unit.
- **Stats are derived, never literals** — pass values joined from the live
  registries (`COMPOUND_COUNT`, `hallmarkLibrary.length`, `citationRegistry.length`, …)
  so a hero can never drift below what's published. See `lib/platform-stats.ts`.

### Interior / utility hub pages

```
PageShell (or SubPageLayout)
  └─ PageHeader (theme-colored eyebrow)
  └─ StatStrip (optional metrics)
  └─ TabBar (scrollable mobile)
  └─ tabpanel content
```

### Homepage sections

```
SectionShell (theme prop)
  └─ heading-section + text-body subtitle
  └─ content grid
```

---

## 8. Before / After — Key Pages

### Homepage Hero

| Before | After |
|--------|-------|
| `href="#library"` anchor | `href="/library"` dedicated hub |
| `text-lg text-zinc-300` | `.text-body` token |
| Fixed `px-6` | `.container-page` fluid padding |
| No focus ring on CTAs | `.focus-ring` + 44px min height |
| `min-h-[92vh]` on mobile | `85vh` mobile, `92vh` desktop |

### `/library` — Anti-Aging Library

| Before | After |
|--------|-------|
| Custom centered header markup | `PageHeader` component |
| `text-[10px]` hallmark labels | `.text-label` + `.heading-card` |
| 2–3 col grid cramped on mobile | 1 col → 2 col → sidebar |
| Search input without label | `<label class="sr-only">` + `input-base` |
| No `aria-current` on selection | `aria-current` on active hallmark |
| Detail in plain div | `card-elevated` summary card |

### `/stacks` — Stacks Library

| Before | After |
|--------|-------|
| Duplicated tab button styles | `TabBar` with `role="tablist"` |
| Inconsistent header | `PageHeader` + meta line |
| Raw `<table>` | `DataTable` + `scope="col"` + caption |
| Filter selects without labels | `aria-label` + `input-base` |

### `/labs` — Lab Hub

| Before | After |
|--------|-------|
| `text-[9px]` stat labels | `StatStrip` + `.text-label` |
| 5-col stats broken on mobile | 2-col mobile summary strip |
| Tab buttons wrap awkwardly | Horizontal scroll `TabBar` |
| Alert as plain text | `role="status"` summary card |
| Duplicate builder at bottom | Preserved with `aria-label` section |

### Global Nav

| Before | After |
|--------|-------|
| Logo `href="#"` | `Link href="/"` |
| No escape key on mobile menu | Escape closes + body scroll lock |
| `aria-label` only on menu button | Full `aria-expanded` / `aria-controls` |
| 8 links same weight | 44px row height, clearer tap zones |
| Hash-only hub links | `/library`, `/stacks`, `/labs` |

### Footer

| Before | After |
|--------|-------|
| 3 columns, no hub links | 4 columns with Library/Stacks/Labs |
| `text-sm text-zinc-500` low contrast | `.text-body-sm` token |
| Duplicate FAQ links | Structured Resources + Hubs |

### SectionShell (20+ homepage sections)

| Before | After |
|--------|-------|
| `py-28 md:py-36` excessive mobile padding | `py-16 md:py-24 lg:py-32` |
| "MODULE ACTIVE" badge noise | Removed — cleaner hierarchy |
| `text-zinc-400` subtitle | `.text-body` |
| No `aria-labelledby` | Section linked to heading id |

---

## 9. Mobile Checklist

- [x] Tab bars scroll horizontally
- [x] Tables use `.scroll-region`
- [x] Stats grid 2-column on phone
- [x] Nav menu full-width 44px rows
- [x] Hero stacks quiz below copy on mobile
- [x] Hallmark selector single column on xs
- [x] Reduced hover transforms on touch devices

---

## 10. File Reference

```
app/globals.css          — Tokens, typography, utilities
lib/design-system.ts     — Theme maps, spacing constants
components/ui/           — Primitives
components/layouts/      — SubPageLayout
STYLE_GUIDE.md           — This document
```

---

## 11. Usage Examples

```tsx
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabBar } from '@/components/ui/TabBar';

<PageShell>
  <PageHeader
    icon={FlaskConical}
    eyebrow="Lab Hub"
    title="Your Biomarkers"
    description="..."
    theme="rose"
  />
  <TabBar tabs={tabs} active={tab} onChange={setTab} theme="rose" ariaLabel="Sections" />
</PageShell>
```

```tsx
// Accessible form field
<label htmlFor="marker" className="text-label block mb-1">Biomarker</label>
<select id="marker" className="input-base">...</select>
```

---

## 12. Cinematic viz system (`components/viz/`)

The premium visual language that the hub pages share. Draw from these instead
of hand-rolling a new header/graphic — reaching for the old flat `PageHeader`
alone is what created the earlier "two-tier" unevenness.

| Component / token | Purpose |
|-------------------|---------|
| `viz/tokens.ts` | Single source of truth for the cinematic palette/glow/stroke/type (`VIZ`, `FONT`, `HUES`, `tierColor`, `signatureHue`). Every viz surface draws from here. |
| `CinematicHubHero` | Reusable hub opening band — full-bleed `MoleculeStage` field, Fraunces headline, derived stat rail, gradient CTAs, keyed to a hub hue. |
| `MoleculeStage` | Shared canvas renderer: `mode="molecule"` (real ball-and-stick geometry) or `mode="field"` (abstract orbital field when no structure exists — never fabricate a molecule). |
| `NetworkStage` | Network sibling of `MoleculeStage` — the synergy graph as a rotating 3D artwork. |
| `CompoundHero` / `ModuleHero` | Per-compound overture bands built only from real `lib/data.ts` / library fields. |
| `ui/CellularDivider` | Numbered, hue-keyed section seam between homepage sections. |
| `ui/GlassPanel` (`.glass-deep`) | The canonical layered-glass panel (Deep Glass v8): tokenized, theme-aware shadows. Budget 1–2 glass moments per page. |
| `.premium-card` | The canonical accent-aware content card (`--card-accent`). |

**Honesty contract:** a named ball-and-stick structure ships only when its
skeleton was actually laid out (`viz/molecule.ts`); everything else falls back
to the abstract field. Accent hexes in canvas/SVG components must match the
canonical tokens in `lib/design-system.ts` `palette` / `--accent-*`.

**Motion:** all viz honors `prefers-reduced-motion` (global
`MotionConfig reducedMotion="user"` + per-component guards) and is
visibility-gated via `lib/raf-visibility`.

---

*Maintained by TNiC platform team. Update this guide when adding new hub pages or tokens.*