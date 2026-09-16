# TNiC Design System & Style Guide

> Version 1.12 · September 2026  
> Governs typography, spacing, components, accessibility, and page patterns across tnic.help.  
> v1.1 documents the cinematic viz family (§7, §12) that the premium hubs are built on.  
> v1.2 corrects the drifted §2 color values, documents the signal roles, the
> canonical tier scale, the interaction primitives (`IconButton`,
> `SelectableChip`, `ExternalAction`, `InteractiveSciencePanel`) and the
> hit-area rules.  
> v1.3 adds §13 — the atmosphere budget, the `.action-link` control floor, and
> the tap-target gate that enforces it.  
> v1.4 adds §14 — what a page must say before JavaScript runs, and the route
> audit that enforces it.  
> v1.5 adds §15 — the hub hero's two-column composition and its instrument
> panel.  
> v1.6 adds §16 — the measured performance baseline, what is gated versus only
> reported, and `.card-deferred`.  
> v1.7 adds §17 — Hanken Grotesk as the body face, `HubSplitInstrument` as the
> hub-hero data figure, and the HUD / table / selection tokens that travel
> with them.  
> v1.8 adds §18 — sitewide glass material: chrome is frost, cards are grounded
> glass-look, overlays share `.glass-chrome`.  
> v1.9 adds §19 — the surface ladder (`.surface-well` / `.surface-track`) and
> the quieter motion recipe so leftover fills and competing hovers read as one
> product.  
> v1.10 adds §20 — walk cards and the continue trail, so related destinations
> look like neighbors instead of leftover text lists.  
> v1.11 adds §21 — homepage arrival composition, metric type, and geometry tokens.  
> v1.12 adds §22 — the lit ground, the elevated plane, the editorial measure,
> and the accent-aware heading rule.

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
| `.text-micro` | 11px sans | Chips, badge text, stat suffixes, fine print |
| `.metric-display` | Fraunces, tabular, tracking `-0.04em` | Longevity counts and instrument numbers |

**Three faces, one job each.** Self-hosted via `next/font` in `app/layout.tsx`,
exposed as CSS variables, never loaded from a runtime `@import`.

| Role | Face | Token |
|------|------|-------|
| Display | Fraunces | `--font-display` / `--font-fraunces` |
| Body | Hanken Grotesk | `--font-sans` / `--font-hanken` |
| Data | JetBrains Mono | `--font-mono` / `--font-jetbrains-mono` |

Hanken replaced Inter as the body face in v1.7. Same small-size legibility,
more character, so the text plane no longer reads as a default SaaS stack.
`--font-inter` is retired; do not reintroduce it.

**11px is the floor.** `.text-micro` was 10px until an audit of the rendered
pages (`npm run audit:ui`) found it on 753 elements of `/library` alone —
making it, by volume, the size most of the site is actually read at. Nothing
in the HTML type scale goes below 11px. SVG data-visualisation labels (chart
axes, molecule atom labels) are a separate system and still render smaller.

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

**24px is the hard minimum** (WCAG 2.2 AA 2.5.8), and 44px remains the
preference. Prefer real height (`min-h-6` on an `inline-flex items-center`
link) over an expanded hit area in any row tight enough that growth could
overlap a neighbour — see the two incidents recorded above.

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
  └─ CinematicHubHero   (hero title + derived stat rail + CTAs + instrument panel)
  └─ PageHeader         (the <h1> *unless* the hero took it via titleAsHeading)
  └─ content grid (.premium-card / GlassPanel)
```

- **One `<h1>` per page.** Default: `CinematicHubHero`'s title is a decorative
  `<p>` and the real `<h1>` lives in the `PageHeader` below. Exception: hubs
  whose cover *is* the identity (`/library`, `/protocols`, `/insights`, and
  any other page that passes `titleAsHeading`) put the `<h1>` in the hero and
  must not render a second one.
- **Hero accent = the page's `PageHeader` theme**, so hero and header read as one unit.
- **Stats are derived, never literals** — pass values joined from the live
  registries (`COMPOUND_COUNT`, `hallmarkLibrary.length`, `citationRegistry.length`, …)
  so a hero can never drift below what's published. See `lib/platform-stats.ts`.
- **The right-hand panel is a data figure when the hub has a countable set.**
  Pass `figure={<HubSplitInstrument … />}` (or a thin wrapper like
  `LibraryHeroInstrument`) and caption it as derived. The decorative molecular
  field is the fallback for hubs with nothing to count, not the default. See §17.

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
| `MoleculeThumb` | Server-rendered SVG of the same geometry, for browse cards. Unique per compound; orbital fallback when `hasGeometry` is false. Never a canvas, never a client import of the geometry file. |
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

## 13. Atmosphere budget — cinematic shell, instrument core

*Added v1.3, from measuring the rendered site rather than reading the code.*

The site has two visual jobs and they are not the same job.

**The shell is cinematic.** The homepage descent, the hub hero bands, the
molecule stages, the drifting `AmbientLayer` field — that is the brand, it is
subject-grounded (real geometry, real networks), and it is deliberately
expensive. Protect it. Nothing in this section is licence to flatten it toward
a generic dark-SaaS look.

**The core is an instrument.** A compound deep-dive is a reader's workbench:
doses, tiers, PMIDs, biomarker ranges. Atmosphere behind a reading column is
not atmosphere, it is noise — and it was measurably reaching the content. The
`AmbientLayer` is `position: fixed` behind every page and page wrappers are
transparent by design (`.canvas-scrim`), so the molecular linework painted
*through* card bodies, through the compound buyer-guide band's body copy, and —
on a phone, where there are no margins for it to live in — directly under the
12-hallmark filter column on `/library`.

So the field is budgeted, not removed:

| Rule | How |
|---|---|
| A content card sits on a ground | `--card-ground` is the third background layer of `.premium-card` — 92% `--color-bg-elevated` in dark, fully opaque in light (light theme already did this; dark was the inconsistent one) |
| A full-width content band sits on a ground | `bg-[var(--card-ground)]` beneath its own accent wash |
| A glass moment stays glass | `.glass-deep` / `GlassPanel` are untouched — budget 1–2 per page, as before |
| The field is tuned per viewport | Depth opacities step down ~45% under 768px, where a structure spans most of the screen instead of a fraction of it |
| The field keeps the margins | Between cards, in page gutters, behind hero bands — full strength |

**The test:** if you can read a chemical structure crossing a sentence, the
budget is broken on that surface. Re-run `npm run audit:ui` and look at the
page, not the code.

### Control geometry

Paired with the above, because they are the same idea applied to touch: the
shell may be expressive, but **anything you touch obeys one geometry.** §4 sets
24px as the hard floor and 44px as the preference. `npm run audit:ui` now
enforces the floor — see below — and `.action-link` is the one class to reach
for on a link that is an *action* rather than a word in a sentence (a
"View NMN →" at the foot of a panel, an entry in a related-links list, a
citation chip). It only ever grows the hit area, never the type.

### The gate

`npm run audit:ui` separates the two groups WCAG 2.2 AA 2.5.8 treats
differently and **exits non-zero on the second**:

- *Exempt* — links inside a sentence, controls hit through a ≥24px `<label>`,
  stretched-link card titles, `sr-only` skip links.
- *Actionable* — standalone controls rendering under 24px. Budget: **0**.

The raw `smallTap` number conflates the two and is not actionable on its own:
on `/library` it read 135, of which 120 were PMID and glossary links sitting in
prose. Read the `actionable` count.

---

## 14. What a page says before JavaScript runs

*Added v1.4, from auditing the server-rendered HTML of all 227 sitemap routes.*

A page's identity — its `<h1>`, its description, the prose that says what it is
— must be in the **initial HTML**. Not after hydration. That HTML is what a
crawler indexes, what an AI answer engine quotes, what a screen reader builds
its document outline from, and what a reader on a slow connection sees first.

### The trap

`useSearchParams()` in a client component makes React **bail the enclosing
Suspense boundary to client-side rendering** during prerender. Everything
inside that boundary is absent from the initial HTML. The boundary is the unit
— not the hook, not the component that calls it.

This is subtle enough that it got past lint, types, 714 tests and a green build
on seven routes at once. Measured on 2026-09-13:

- `/stacks`, `/labs`, `/learn`, `/shop`, `/tools` — five top-level nav hubs —
  shipped **no `<h1>` at all**, because the `PageHeader` that carries it lived
  inside the island.
- `/library/systems` and `/tools/pathway-architect` shipped an **empty
  `<main>`** with a `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker. The second had
  no `<main>` element at all: with no Suspense boundary of its own, the bailout
  climbed to the root and took the layout's `<main>` with it.
- `/learn` rendered a **second `CinematicHubHero`** inside the island, under the
  page's own, with different copy — invisible in the HTML, two stacked heroes
  once hydrated.

### The rule

**Identity renders in the server page. Interactivity renders in the island.**

```tsx
// app/<hub>/page.tsx — server
<CinematicHubHero … />          {/* hero: server */}
<PageShell>
  <PageHeader … />              {/* the <h1>: server */}
  <Suspense fallback={…}>
    <HubClientIsland />         {/* useSearchParams() lives in here */}
  </Suspense>
</PageShell>
```

Two corollaries worth stating, because both bit:

1. **Every `useSearchParams()` island needs its own `<Suspense>`.** Without
   one, the bailout escalates to the nearest boundary above — which may be the
   root layout, taking `<main>` with it.
2. **A segment `loading.tsx` is a Suspense boundary around the whole
   segment.** On an async route it ships the skeleton *as* `<main>` and streams
   the real content in after `</footer>`. Wrap the part that actually awaits
   something instead; a loading state scoped to that part costs nothing.

### Sitemap hygiene

A sitemap entry that the page canonicalises away is a contradiction — the
sitemap asks for indexing, the page declines it. Don't list query-parameter
variants of a canonical page (`/tools?tab=…` were listed, all eight sharing
`/tools`' title and canonical).

### The gate

`npm run audit:routes` fetches every sitemap route and checks, per route:
status · `<title>` present and unique · description present and unique ·
canonical present and self-referential · exactly one `<h1>` · `<main>` holds
real text; and across routes: every internal link target resolves, and every
route is linked from somewhere. It runs in CI after the build and **fails the
build** on any of those. Run it before and after any change to a page shell,
a layout, or a client island's boundary.

---

## 15. Hub hero composition

*Added v1.5, from measuring the rendered hero at 1440×900 on all eleven hubs.*

`CinematicHubHero` was a single left-aligned column — eyebrow, title, lead,
stat rail, actions — with roughly **45% of the first viewport left empty** on
every hub. The `MoleculeStage` field that was meant to occupy it sat at 0.34
opacity behind a veil, masked toward the centre (i.e. behind the copy), and
read as nothing. The component was named cinematic and rendered a void.

The site already had the answer. Hallmark pages pair their copy with a real
figure on the right — coverage ring, ranked interventions, biomarker chips —
and are the strongest visual on the site. The hero now does the same thing.

### The composition

```
< 1024px   one column (unchanged — the copy already fills the width)

≥ 1024px   ┌──────────────────────┬─────────────────────┐
           │ eyebrow              │                     │
           │ title                │   instrument panel  │   row 1
           │ lead                 │   + mono caption    │
           │ actions              │                     │
           ├──────────────────────┴─────────────────────┤
           │ stat rail — spans both columns              │   row 2
           └─────────────────────────────────────────────┘
```

Rows are **pinned explicitly** (`grid-row: 1` / `grid-row: 2`). The stat rail
spans `1 / -1`, so leaving placement to auto-flow drops the figure onto a third
row under the rail instead of beside the copy.

The rail's `width: min(100%, 50rem)` cap is right for a single-column hero and
wrong when it spans both, so the override is scoped through the parent
(`.research-hero__inner .research-hero__stats`) — a media query adds no
specificity, and the base rule is defined later in the file.

### The panel

Same framing language as the homepage's live-visual panels: bordered plane,
accent light-catch hairline along the top edge, real elevation, canvas masked
so it fades into the panel rather than ending on a hard edge, and a **mono
caption that names what the visual is**.

The caption is load-bearing, not decoration. A site that grades evidence has to
say whether a picture is data or atmosphere — the default reads
`Molecular field · decorative`. A hub with a real data figure passes it via the
`figure` prop and captions it accordingly.

With the panel carrying the right column, the background field's job changes
from "fill the void" to "texture the ground": at ≥1024px it drops to 0.26 and
its mask moves left, behind the copy, so it no longer competes with the panel.

---

## 16. Performance: the numbers, and what they're worth

*Added v1.6, from measuring the site in a real browser rather than asserting.*

### The baseline

Median of three runs per page, encoded (on-the-wire) bytes:

| route | LCP | CLS | doc | js | css | fonts | total |
|---|---|---|---|---|---|---|---|
| `/` | 404 ms | 0 | 69 | 714 | 50 | 186 | 1,141 KB |
| `/library` | 640 ms | 0 | 261 | 783 | 50 | 186 | 1,402 KB |
| `/library/compounds/nmn` | 460 ms | 0.008 | 75 | 788 | 50 | 187 | 1,207 KB |
| `/trust` | 660 ms | 0.008 | 37 | 718 | 50 | 167 | 1,095 KB |
| `/stacks` | 572 ms | 0.008 | 36 | 741 | 50 | 167 | 1,081 KB |
| `/hallmarks` | 668 ms | 0.008 | 47 | 716 | 50 | 186 | 1,091 KB |

LCP and CLS are comfortably inside Core Web Vitals "good" (2,500 ms / 0.1).
Code splitting works: `three`, `recharts` and `framer-motion` are all absent
from a content page's bundle. The honest remaining cost is **~700–790 KB of
compressed JavaScript per page**, spread across ~48 chunks rather than
concentrated in one library — many small client islands, not one villain.

### Encoded vs decoded — the trap that sent one pass after the wrong thing

`response.body()` in Playwright returns the **decoded** buffer. Measuring that
reported `/trust` at ~2,250 KB of script when production transfers ~456 KB of
it compressed — a ~4× overstatement, easily enough to justify an optimisation
that was never needed. `audit:perf` reads
`request.sizes().responseBodySize` (encoded) and prints the decoded total
alongside it, so the gap is visible instead of assumed. A local `next start`
that does not compress makes both columns equal; calibrate against production.

### What is gated, and what is only reported

| metric | treatment | why |
|---|---|---|
| CLS | **gated** ≤ 0.1 | stable to 3 decimal places across runs |
| total encoded KB | **gated** ≤ 1,700 | varies < 10% run to run |
| LCP | reported, with min–max | swings > 2× on a shared runner — 588 ms to 1,356 ms for the same build |

A gate on a number that noisy fails builds at random, and a CI check that cries
wolf gets switched off — which is worse than not having one. Breaching the LCP
target prints a warning so a real regression is still visible.

`audit:perf` needs a browser, so like `audit:ui` it runs locally rather than in
CI (`audit:routes` is fetch-only, which is why that one gates the build).

### Long, uniform grids: `.card-deferred`

`content-visibility: auto` plus `contain-intrinsic-size` lets the browser skip
layout, style and paint for list items outside the viewport. Applied to the
100-card `/library` grid — the heaviest page on the site — and A/B'd on one
build, five runs each side:

| | longest task | total blocking |
|---|---|---|
| off | 329 / 359 / 310 ms | 1,026 / 1,034 / 979 ms |
| on | **257 / 259 / 243 ms** | **792 / 867 / 783 ms** |

Consistently −22% to −28% on the longest main-thread task and −16% to −23% on
total blocking time, across three independent rounds. `domComplete` moved in
both directions and showed no signal.

Reach for it on any list long enough that most of it is off-screen. Set
`contain-intrinsic-size` to the measured item height: getting it wrong costs
scroll-position accuracy, not layout stability, because the value is only used
while the item is skipped.

---

## 17. Instrument material — type, figure, chrome

*Added v1.7, from treating the whole site as one instrument rather than restyling pages.*

The sixth-pass library instrument was a one-off. Eleven other hubs still filled
the right column with the decorative molecular field even when they had a
countable, derived set. Inter was still the body face. The chrome (nav, tables,
inputs, selection) did not yet read as the same instrument the library had
become. This section is the contract for that pass.

### Body face

`--font-sans` resolves to `--font-hanken` (Hanken Grotesk), then system-ui.
`--font-inter` is gone. Canvas labels in `NetworkStage` use `system-ui`, not
Inter. Viz token `FONT.sans` names Hanken Grotesk as the fallback.

Body text sets `font-optical-sizing: auto` and
`font-feature-settings: "kern" 1, "liga" 1, "calt" 1`. Do not add a fourth
face, and do not load Inter "just for the engine" — the Compound Intelligence
surface follows the same three roles.

### Hub-hero data figure

`HubSplitInstrument` (`components/viz/HubSplitInstrument.tsx`) is the shared
primitive. It is a server component. It never invents a number and never
hardcodes a colour: the caller passes `total`, `rows[].count`, and
`rows[].color` from a live registry (`TIER_COLOR_VAR`, `HUB_ACCENT_VAR`, or a
status token). A thin wrapper (`LibraryHeroInstrument`) is allowed when a
page wants a named view over a specific stats helper; it must still render
`HubSplitInstrument`.

A hub with a countable set **must** pass `figure` and a caption that says the
split is derived. A hub with nothing to count keeps the molecular field and
captions it as decorative — that is the honest fallback, not a hole.

Do not put a heading inside the instrument. The page `<h1>` lives in the hero
title (when `titleAsHeading`) or in the `PageHeader` beside it.

### HUD / table / selection tokens

These are sitewide, not per-page:

| Token / rule | Job |
|---|---|
| `::selection` | Cyan 28% mix on `--color-text-primary` |
| `[data-theme="light"] body::after` | Grain opacity 0.016 — film, not dirt |
| `.nav-glass::before` | Always-on 1px cyan HUD tick along the bottom edge |
| `.nav-glass-scrolled::before` | Top specular; wins over the tick when scrolled |
| `.input-base` | Inset 1px highlight so fields read as recessed instrument wells |
| `.table-base thead th` | Sticky header + bottom hairline |
| `.research-hero__figure-stage--data` | Inset bezel; no atmospheric mask (labels stay readable) |

Do not add more glow or a second grain overlay. The atmosphere
budget in §13 still holds; this section only names the chrome that was
missing from it.

---

## 18. Sitewide glass material

*Added v1.8. Chrome is glass. Content is grounded glass-look.*

The v8 Deep Glass budget (1–2 true `backdrop-filter` planes per page via
`GlassPanel`) still holds. What was missing was a shared *material* so the
rest of the site did not read as flat fills sitting next to those planes.

| Surface | Material | Blur? |
|---|---|---|
| Nav, context bar, footer, overlays, command palette, modal, toasts | Frosted glass (`.nav-glass`, `.glass-chrome`, `.glass-overlay`) | Yes — chrome only |
| Inputs, chips, ghost/outline buttons, filter pills | Lightweight glass (`.glass`, `.input-base`) | Yes — small area |
| `.premium-card` / `.card-elevated` | Refractive rim + inner specular + frost *wash* over `--card-ground` | **No** — library grid is 100 cards |
| `GlassPanel` / `.glass-deep` | Layered Deep Glass planes (v8) | Yes — budget 1–2 / page |

Tokens that travel with this: `--glass-inner-highlight`, `--glass-inner-shade`,
`--glass-rim`, `--glass-chrome-blur`, `--glass-chrome-fill`. Light theme gets
a white frost wash instead of a dark one.

**The test is still §13:** if you can read a chemical structure crossing a
sentence, the card ground has been punctured. Do not "fix" that by putting
`backdrop-filter` on `.premium-card`.

Phone budget: chrome blur halves under 768px; sticky table headers drop blur
entirely. `prefers-reduced-motion` still kills card lift.

---

## 19. Surface ladder and motion (coherence)

*Added v1.9. Same theme. One product, not several fills.*

| Layer | Class | Use |
|---|---|---|
| Page | `--color-bg-base` + ambient field | The canvas |
| Nested well | `.surface-well` | Chips, inset panels, filter groups, compact tiles. **No blur.** |
| Segmented track | `.surface-track` | TabBar, theme toggle — one well, inner pills |
| Content card | `.premium-card` | Browse cards, accordions, science panels. Grounded glass-look |
| Chrome | `.nav-glass` / `.glass-chrome` | Nav, overlays, footer. Real frost |

Do not invent a fourth fill (`bg-card/40`, `bg-background/25`, `bg-muted/10`,
mixed `border-border/60–80`). Reach for `.surface-well`. Nested wells step
down in fill so they still read as inset.

**Motion is one recipe.** `--dur-fast` / `--ease-standard`. Cards lift 2px,
not 4. No diagonal shine sweep. Press is `scale(0.98)` via `.interactive`.
Effects are the material catching light, not a second animation language.

`Field` controls use `.input-base`. `TabBar` is a segmented track. Icon-only
surface buttons use `.glass`.

---

## 20. Walk cards (related destinations)

*Added v1.10. Same theme. Neighbors look like neighbors.*

A compound, hallmark, peptide, protocol, or hub page that ends without a
walkable next destination is a dead end. Do not hand-roll a third next-steps
system (`RecommendedNextSteps` is retired). Use:

| Primitive | Job |
|---|---|
| `WalkCard` | One related destination — kicker, title, one-line why |
| `ContinueTrail` | 3–4 walk cards at the close of a deep-dive or hub |
| `DecisionSteps` | Hub orientation at the *top* of a workbench |
| `getProtocolsForCompound` | Reverse edge: compound → the protocol it belongs to |

Related rails in a sidebar can stay compact lists. The page *close* is the
trail. Hash-link protocols (`/protocols#slug`) until they have their own routes.

Homepage hallmark cards walk to `/library/{slug}` (the linked evidence surface),
not the editorial twin. Compound names on editorial intervention cards walk to
`/library/compounds/{id}`.

---

## 21. Homepage arrival and metric type (visual identity)

*Added v1.11. Same cyan / emerald identity. The first viewport is a composed
instrument, not a left-column dump.*

**Arrival composition.** `#arrive` is a two-column grid (`.tnic-hero-grid`):
copy left, library instrument right, three destination paths spanning beneath.
The instrument is a 12-tick hallmark compass with NAD+ / mTOR / AMPK / NRF2
cardinals and live counts from `COMPOUND_COUNT` / `eliteInterventions` /
`eliteTierCounts`. It is **not** a personal longevity score — the caption
says so. A–C meters in the first viewport use the canonical three-bar
legend (A clinical / B emerging / C preclinical) and link to
`/trust/methodology`.

**Do not** fill the right column with orbital decoration. Do not invent a
score. Do not put `backdrop-filter` on `.tnic-intel` — chrome is frost;
the instrument is a grounded panel.

**Geometry tokens**

| Token | Value | Use |
|---|---|---|
| `--page-max` | `80rem` | `.container-page` and descent acts |
| `--section-y` | `clamp(4.5rem, 7vw, 7rem)` | Homepage section padding |
| `--metric-tracking` | `-0.04em` | `.metric-display` |

**Metric type.** `.metric-display` is Fraunces, tabular lining figures, tight
tracking. Use it for counts that should read as instruments.

**Type floor on arrival.** Nothing in Act 0 HTML goes below 11px
(`.text-micro`). Path names are 16px. The cinematic H1 caps at 76px so the
primary CTA stays inside a 1280×800 first screen.

**CTA.** The primary path uses the signature cyan→emerald gradient
(`.btn-gradient` / `.tnic-cta`). Secondary paths are grounded panels. Nav
secondary actions use `.tnic-button-outline`, not a nested `GlassPanel`.
The chapter rail is hidden on `#arrive` so it does not sit on top of the
instrument.

**Motion.** Cards lift 2px. Hallmark and step cards share that recipe.
The desktop rail fades in after the first scroll.

---

---

## 22. The lit ground, the elevated plane, and the editorial measure

*Added v1.12, from a visual pass done by screenshotting the rendered site at
1440px and 390px in both themes rather than by reading the stylesheet.*

### 22.1 The ground is lit, not flat

`body` paints a four-part composition, pinned with
`background-attachment: fixed` so the light stays overhead on a long page
instead of scrolling away after one screen:

| Token | Role |
|---|---|
| `--ground-key` | Key light above the fold, centred |
| `--ground-fill` | Cool fill from the upper left |
| `--ground-counter` | Warm counter-light in the opposite corner, so the field is never mono-cyan |
| `--ground-falloff` | Vertical tone falloff toward a deeper floor |

All four are sub-8% mixes in dark and sub-5% in light. This is depth, not
colour. Both themes define all four, so the composition is identical and only
the alphas differ.

**Why on `body` and not on a wrapper:** `body` already sits behind the fixed
`.ambient-layer` (z-0) and `.page-canvas` (z-1), both transparent by design, so
one declaration reaches every route — including the ~40 that use
`.canvas-scrim`. Do **not** repaint an opaque background on a page wrapper; that
is the same rule `.canvas-scrim` already exists to enforce, and it now hides the
ground as well as the molecular field.

### 22.2 The elevated plane is a real step

`--color-bg-elevated` is `#0b1424` in dark. It was `#080f1c` — roughly a 3%
luminance step over the base, below the threshold at which an unlit dark surface
reads as *raised* rather than as the same slab with a border drawn on it. Every
card, panel, table header and popover resolves here, directly or through
`--card-ground` / `--glass-fill-*` / `--glass-bg`, so the whole surface ladder
was compressed into nearly one tone. `lib/design-system.ts`'s `palette` mirrors
this value — keep the two in sync.

### 22.3 Two page measures

| Class | Max width | Use |
|---|---|---|
| `.container-page` | `80rem` | Hubs: grids, tables, instrument panels |
| `.container-page--reading` | `66rem` | Long-form: trust, methodology, legal, policy |

Reach for `reading` through `PageShell`'s `measure` prop, not by hand. The
long-form pages already cap their own content at `max-w-4xl`; the problem was
never the line length, it was a 56rem column hugging the left edge of an 80rem
frame with 24rem of empty page beside it.

### 22.4 The field keeps the margins — now enforced for prose too

§13 states the rule ("the field keeps the margins"; "if you can read a chemical
structure crossing a sentence, the budget is broken"). `.premium-card` enforced
it for cards via `--card-ground`; nothing enforced it for running text, and on
`/trust/methodology` a benzene ring sat behind the page description.

`.molecule-cascade` is now masked out of the centre column above 1024px. This is
composition, not dimming — depth opacities are untouched, so where the field
shows it is exactly as present as before. Below 1024px the reading column *is*
the viewport, so no mask is applied; the existing 9–20% depth opacities carry it
there.

### 22.5 The heading rule follows the section accent

`.heading-accent-rule` reads `--rule-accent` (default `--accent-cyan`). Set it
from `themes[theme].cssVar` wherever the surrounding header is themed —
`PageHeader` and `SectionShell` already do. Before this the gradient and glow
were hardcoded cyan→emerald, so a rose hallmark page, a violet `/stacks` and an
amber warning band all printed the same cyan dash under headers whose every
other element (eyebrow dot, icon, badge, hero field) obeyed the accent system.
Call sites that are genuinely cyan — `ContinueTrail`, whose eyebrow is cyan
too — pass nothing and keep the default.

### 22.6 An eyebrow hugs its content

`.page-header__eyebrow` is `inline-flex`. It previously had no base definition
at all (only the `--handoff` modifier did), so the `<div>` rendered as a block
and the pill stretched to the full width of its `max-w-4xl` header on every
page using PageHeader's default variant. Inline-level also means a centred
header centres it with no auto-margin special case.

### 22.7 A ring label is HTML, not SVG `<text>`

The homepage compass cardinals are HTML spans in `.tnic-intel-cardinals`, placed
in the dial's own padding. As SVG `<text>` inside a 240-unit viewBox they were
(a) positioned *on* the r=102 ring, so the ring stroke and the hallmark ticks ran
through the words, and (b) scaled with the viewBox, rendering near 6px in the
132px compact layout — half the §3 floor, on the narrowest device.

**The general rule:** §3's "SVG data-visualisation labels are a separate system"
exemption covers annotations whose size is set by the geometry — atom labels,
chart axes. A label that names a UI element is not one of those. If it must stay
legible at every container size, it is HTML and it holds `--type-11`.

---

*Maintained by TNiC platform team. Update this guide when adding new hub pages or tokens.*