# TNiC Design System & Style Guide

> Version 1.0 · June 2026  
> Governs typography, spacing, components, accessibility, and page patterns across tnic.help.

---

## 1. Design Principles

1. **Scannable first** — Users skim. Lead with labels, stats, and cards; bury detail in accordions.
2. **Evidence visible** — Tier badges, citations, and status colors appear before prose.
3. **Mobile-native** — 44px touch targets, horizontal scroll for tables/tabs, single-column defaults.
4. **Privacy legible** — Local-first data patterns are explained inline, not hidden in footnotes.
5. **Accessible by default** — Focus rings, semantic HTML, WCAG AA contrast, reduced-motion support.

---

## 2. Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-base` | `#030712` | Page background |
| `--color-bg-elevated` | `#0a0f1a` | Gradient-border cards |
| `--color-text-primary` | `#fafafa` | Headings, values |
| `--color-text-secondary` | `#d4d4d8` | Body copy (AA on base) |
| `--color-text-muted` | `#a1a1aa` | Supporting text |
| `--color-text-faint` | `#71717a` | Labels, captions |
| `--color-border-subtle` | `rgba(255,255,255,0.06)` | Card borders |
| `--color-border-focus` | `rgba(34,211,238,0.6)` | Focus rings |

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
| `.text-body` | 16px / 1.65 | Descriptions |
| `.text-body-sm` | 14px / 1.6 | Card body, table cells |
| `.text-caption` | 12px | Meta, disclaimers |
| `.text-label` | 11px mono uppercase | Eyebrows, column headers |

**Before:** Mixed `text-[10px]`, `text-xs`, `text-sm` with no hierarchy.  
**After:** Six semantic classes used consistently via `PageHeader`, `SectionShell`, cards.

---

## 4. Spacing & Layout

| Token | Value |
|-------|-------|
| `.container-page` | max 80rem, fluid `px` clamp 16–24px |
| Page vertical | `py-16 md:py-24 lg:py-28` |
| Section vertical | `py-16 md:py-24 lg:py-32` |
| Grid gap | `gap-4 md:gap-6 lg:gap-8` |
| Touch min | `--space-touch: 2.75rem` (44px) |

---

## 5. Components (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| `PageShell` | Hub page wrapper + container |
| `PageHeader` | Eyebrow + title + description + meta |
| `TabBar` | Accessible tablist with scroll on mobile |
| `StatStrip` | 2-col mobile → auto-fit desktop summary |
| `Button` | primary / secondary / ghost / danger |
| `Accordion` | Expandable detail without page jump |
| `DataTable` | Scrollable table + `sr-only` caption |
| `Card` patterns | `.card-base`, `.card-elevated`, `.glass` |

Import theme maps from `lib/design-system.ts`.

---

## 6. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Focus visible | `.focus-ring` on all interactives |
| Skip link | `SkipLink` → `#main-content` |
| Touch targets | `min-h-[var(--space-touch)]` on buttons/nav |
| Color contrast | Body text `#d4d4d8` on `#030712` ≥ 7:1 |
| Motion | `prefers-reduced-motion` disables animations |
| Tables | `scope="col"`, caption, horizontal scroll |
| Tabs | `role="tablist"`, `aria-selected`, `aria-controls` |
| Forms | `<label>` + `htmlFor`, `aria-label` on icon-only |
| Live regions | `aria-live="polite"` on dynamic panels |

---

## 7. Page Patterns

### Hub pages (`/library`, `/stacks`, `/labs`)

```
PageShell
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

*Maintained by TNiC platform team. Update this guide when adding new hub pages or tokens.*