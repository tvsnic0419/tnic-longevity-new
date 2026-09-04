# Phase 0 — Clear the board

Read against `main` @ `1c05b1e` (includes merged PR #153). Visual architecture only.

## 0a. Aurora / trust-badge / nav-fix branch

There is **no open PR** and no unique unmerged branch that is safe to merge as-is.

What already landed on `main`:

- Site-wide aurora: `components/ui/AmbientLayer.tsx` mounted from `app/layout.tsx`.
- Hero aurora depth + instrument surfaces: PR #153 (`HomeDescent`, `CompoundHero`, `.premium-card`).
- Nav scroll backdrop + Lab/Labs: PR #125.
- Trust badges / evidence tags: `EvidenceTag` + `lib/trust.ts` (long since on `main`).

Stale cousins (`claude/depth-quality-ultra-v2`, `feat/deep-glass-system-v2`, `3d-hero-depth-rollout`, `nav-adaptive-qa`, `claude/compound-engine-polish-nav-ow8yag`) diverge weeks behind current `main`. Merging them would replay conflicts into `HomeNicoStarter` / `HomeDescent` the same way #132/#133 did. **Resolution: do not merge them. Treat current `AmbientLayer` + #153 as the aurora baseline.**

## 0b. Duplicate navigation

Two `<Nav />` instances on one interior route would kill any z-index ladder. Audit result:

- Root `app/layout.tsx` does **not** mount `Nav`. It mounts `AmbientLayer` only.
- Interior chrome is exactly one `SubPageLayout` → `<Nav />` + optional `ContextBar` + `<Footer />`.
- Homepage mounts `<Nav />` itself (`app/page.tsx`). No `SubPageLayout` there.
- `/trust/*` uses `TrustPageTemplate` **without** `standalone`, so it does not wrap a second layout.
- Root legal pages (`/terms`, `/privacy`, …) use `standalone` because they have no hub `layout.tsx`. That is one Nav, not two.
- `app/tools/pathway-architect/page.tsx` has an explicit comment that a second `SubPageLayout` was already removed.

`ContextBar` is not a second nav. It is a workspace strip under `Nav`, inside its own Suspense boundary so `useSearchParams` cannot bail the page out of SSR.

**No duplicate-Nav fix to ship.** If a future page wraps `SubPageLayout` inside a hub that already uses it, `lib/site-integrity.test.ts` is the guard — keep it green.

## 0c. `/library/compounds`

Not a missing folder. It is a category slug of `app/library/[slug]`:

- `GET /library/compounds` → 200, `x-matched-path: /library/[slug]`, title *Compound Deep-Dives*.
- `GET /library/compounds/nmn` → 200, `x-matched-path: /library/compounds/nmn`, prerendered.
- Canonical path helper: `getModulePath` → `/library/${category}/${slug}`.

`/library/nmn` is a 404 **by design** (no uncategorized compound route). Do not add a competing `/library/[compound]` tree in this upgrade.

## 0d. Primitive names (do not rename)

The brief's `--cyan --indigo --gold --rose --ink --faint --bg` **do not exist**. Live primitives:

| Brief name | Live token |
|---|---|
| `--bg` | `--color-bg-base`, `--color-bg-elevated`, `--color-bg-surface` |
| `--ink` | `--color-text-primary` |
| `--faint` | `--color-text-faint` |
| `--cyan` | `--accent-cyan` |
| `--rose` | `--accent-rose` |
| `--gold` | **missing** — rank currently collides with `--accent-amber` / `--status-watch` |
| `--indigo` | **missing** — stacks use `--accent-violet` |

Phase 1 adds a **semantic layer above these**. It must not rename or delete the live names.

Light theme already exists as `[data-theme="light"]` in `app/globals.css`. Dark is default (`:root, [data-theme="dark"]`). Phase 1 must re-derive dark elevation from fill + rim, not by lowering light-mode shadow opacity.

## 0e. Budget baseline already over the Phase 2 cap

`backdrop-filter` appears **far more than three times**, almost all in `app/globals.css` (nav, glass, premium-card, command palette, sticky bars, …). Phase 1/2 must collapse this to ≤3 call sites or the upgrade fails its own budget.

Lighthouse mobile baseline: **not recorded this session**. Do not start Phase 1 until a mobile Lighthouse number is written next to this paragraph.

## Scope for Phase 1

See `docs/PHASE0-VISUAL-INVENTORY.md`. Highest-leverage deletion targets:

1. `app/globals.css` — 68 hex, 105 shadows, 32 z-index.
2. `components/home/HomeDescent.tsx` — 44 hex, 21 shadows, 15 z-index.
3. `components/viz/tokens.ts` + `lib/design-system.ts` — second and third color sources.
4. Illustration canvases — hex is draw-loop paint; map through `viz/tokens.ts`, do not leave raw `#` in the renderer.

Emails and OG image files are out of scope for the page-elevation ladder.
