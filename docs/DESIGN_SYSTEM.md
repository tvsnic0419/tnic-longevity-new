# TNiC Design System — v2 (Restraint)

> Companion to `STYLE_GUIDE.md`. This document governs the **Phase 0 design-system
> upgrade**: the typography system, the "one accent" restraint rules, and the
> reusable **signature components** that define the brand on every entity page.
>
> The north star: **premium = restraint.** The old "rinky-dink" read came from
> growth-by-addition — gradient borders on everything, five accent colors rotating
> per hub, four card variants. v2 reduces instead of adds.

---

## 1. Typography system

A real type system is the single biggest perceived-quality lever. v2 uses **three
roles**, each with one font:

| Role | Font | Where | Token |
|------|------|-------|-------|
| **Display** | Bricolage Grotesque (500–700) | Page + section + card titles | `var(--font-display)` |
| **Body** | Geist Sans | Paragraphs, UI copy | `var(--font-sans)` |
| **Mono / label** | Geist Mono | Small caps labels, numeric tokens, code | `var(--font-mono)` |

Fonts are loaded in `app/layout.tsx` via `next/font/google` (self-hosted at build,
no runtime request) and exposed as CSS variables on `<html>`. The display face is
wired into `.heading-page` / `.heading-section` / `.heading-card` in
`app/globals.css`, so **every page inherits it automatically** — do not set font
families ad-hoc in components.

### Type scale (`.heading-*`, `.text-*` in globals.css)

| Class | Size | Tracking | Use |
|-------|------|----------|-----|
| `.heading-page` | `clamp(2rem → 3.25rem)` | `-0.03em` | One per page (H1) |
| `.heading-section` | `clamp(1.5rem → 2.5rem)` | `-0.02em` | Section titles (H2) |
| `.heading-card` | `1rem` | normal | Card / panel titles |
| `.text-body` | `1rem` | normal | Body copy |
| `.text-body-sm` | `0.875rem` | normal | Secondary copy |
| `.text-caption` | `0.75rem` | normal | Captions, metadata |
| `.text-label` | `0.6875rem` | `+0.08em`, uppercase, mono | Eyebrow labels |

**Rule:** small labels always get positive letter-spacing (`.text-label`);
display headings always get negative tracking. This contrast is what reads as
"designed."

---

## 2. Color & the "one accent" rule

The palette (`lib/design-system.ts`, `app/globals.css`) still defines five hub
accents (cyan, emerald, amber, violet, rose) — these are **not deleted**; hubs may
theme their own hero. But going forward, inside content and on entity pages:

- **Cyan is the primary accent.** Use it — and only it — for interactive affordances
  (links, hover, focus, active states) and primary CTAs.
- **Evidence grades own their colors.** Emerald / cyan / violet / muted are reserved
  for the `EvidenceBadge` taxonomy (see §3). Do not reuse those hues decoratively
  next to an evidence badge, or the signal blurs.
- **Status colors** (emerald / amber / rose) are reserved for lab/biomarker status.
- Everything else is **neutral**: `text-foreground`, `text-muted-foreground`,
  `border-border`.

### Surfaces: hairline over gradient

- **Standard surface** = `border border-border bg-card/40 rounded-xl` (a hairline).
- `.gradient-border` is **deprecated** for new work. It remains defined for legacy
  callers, but do not add new usages; migrate opportunistically. Hairline borders +
  generous whitespace are the v2 default.

---

## 3. Signature components

Three components carry the brand and appear across entity pages. Reuse them —
never re-implement their look inline.

### 3a. Evidence-Grade badge — `components/trust/EvidenceBadge.tsx`

The trust anchor. Renders a compound/claim's evidence level as a colored badge.

```tsx
import { EvidenceBadge, EvidenceBadgeFromTier } from '@/components/trust/EvidenceBadge';

<EvidenceBadge level="Strong" sources="2 RCTs" />
<EvidenceBadgeFromTier tier="A" />   // A→Strong, B→Moderate, C→Mechanistic
```

Taxonomy (`lib/trust.ts`): **Strong · Moderate · Mechanistic · Emerging · Personal**,
derived from the authored `EvidenceTier` A/B/C on each compound. This taxonomy is
canonical — treat "Limited/Preclinical" language in prose as mapping onto
*Emerging/Mechanistic*; do not fork a second badge system.

### 3b. Citation — `components/trust/SourceCitation.tsx` + `CitationList.tsx`

Renders a real, verifiable reference (journal, year, PMID/DOI link). Never render a
citation as plain text; use these so every source is clickable and consistently
styled.

```tsx
import { CitationList } from '@/components/trust/CitationList';
<CitationList citations={citations} title="Human evidence" />
```

**Evidence integrity is non-negotiable:** citations must come from authored data or
be a clearly-marked `[TODO: verify]` placeholder — never a plausible-sounding fake.

### 3c. Hallmark chip — `components/design/HallmarkChip.tsx` *(new in v2)*

The reusable atom for hallmark ↔ entity interlinking. A hairline chip with a mono
number token that links to the canonical hallmark page `/library/<slug>`.

```tsx
import { HallmarkChip, HallmarkChipGroup } from '@/components/design/HallmarkChip';

<HallmarkChipGroup
  label="Targets these hallmarks"
  hallmarks={[{ slug: 'mitochondrial-dysfunction', title: 'Mitochondrial dysfunction', number: 6 }]}
/>
```

Pure presentational + server-safe: pass small serializable props so heavy hallmark
data stays server-side. Slugs must resolve (guarded by graph tests) so chips never
404.

---

## 4. Surfaces — consolidated card set

Prefer these over bespoke card markup (`components/ui/Card.tsx`):

| Variant | Look | Use |
|---------|------|-----|
| `default` | Glass, hairline | Most content panels |
| `elevated` | Raised, soft shadow | Cards that need to pop (KPIs, featured) |
| `scientific` | Left cyan rule | Mechanistic / data callouts |

`outline` remains for the lightest cases. Three surfaces cover the site; resist
adding a fourth.

---

## 5. OS chrome audit

Keep only chrome that earns its space: the **command palette** (⌘K) and **context
bar** are load-bearing navigation and stay. They are already deferred out of the
shared bundle (`components/os/OsOverlays`, PR #15) so they cost nothing until first
use. Decorative OS flourishes should not be added back.

---

## 6. Proof

Phase 0 is applied end-to-end on the **compound deep-dive** flagship
(`components/library/LibraryModuleDetail.tsx`): display typeface on all headings,
the ad-hoc "related hallmarks" list replaced by the signature `HallmarkChip`, and
the panel switched from a themed label to a neutral hairline surface. Every later
phase builds on these primitives.
