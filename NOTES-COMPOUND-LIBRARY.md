# Compound Library — Source of Truth & Guardrails

_Last updated: 2026-07-22._

This note exists because the compound library has "disappeared" before — the full
set lived on an unmerged branch while production shipped a smaller one. Read this
before touching compound counts, the library routes, or `lib/data.ts`.

## The two compound tiers (this is the important part)

There are **55 compounds** in the library, but they come in two tiers. Both are real;
they serve different surfaces.

| Tier | Count | Lives in | Powers |
|------|-------|----------|--------|
| **Library deep-dives** | **55** | `content/compounds/*.mdx` + `lib/library-modules.ts` (`category: 'compounds'`) | The library, `/library/compounds`, hallmark interlinks, the "at-a-glance" panel |
| **Stack-buildable** | 27 | `lib/data.ts` `compounds[]` (a subset, with mechanism/bioavailability/dose/PMIDs) | Stack Architect, tools, compare tool, elite interventions |

Every stack-buildable compound is also a library deep-dive. The other 28 are
library-only (educational) and **do not** have a `lib/data.ts` entry — that is by
design, not a bug. Do **not** fabricate mechanism text, doses, bioavailability, or
PMIDs to promote one into `data.ts`; that requires real evidence review by the owner.

## Single source of truth for the count

**Never hard-code a compound count in UI copy.** Import it:

```ts
import { COMPOUND_COUNT } from '@/lib/library-modules'; // = compoundModules.length
```

Used by: `components/home/HomeHero.tsx` (hero stat), `components/home/HomeExplore.tsx`
(explore card), `lib/data.ts` (`communityPulse`). If you add a new place that names a
number of compounds, wire it here too.

## Guardrail test

`lib/compound-coverage.test.ts` locks the invariant:

- `COMPOUND_COUNT === 55` and there are exactly 55 compound modules.
- 1:1 correspondence between `content/compounds/*.mdx` and compound modules.
- Every module has an evidence tier + ≥1 hallmark (so the glance panel and hallmark
  interlink always render).

If you **intentionally** add/remove a compound, update `EXPECTED_COMPOUND_COUNT` in
that test **in the same commit** — the failing test is the guardrail, the edit is the
paper trail.

## Routes

- `/library/compounds` — category index listing all 55 (served by
  `app/library/[slug]/page.tsx`, which now treats the 4 library category slugs —
  `compounds`, `synergies`, `lifestyle`, `guides` — as index pages instead of 404s).
- `/library/compounds/<slug>` — deep-dive, served by `app/library/[slug]/[moduleSlug]/page.tsx`.
  **Do not** create a static `app/library/compounds/` folder: under Next 16 it would
  shadow the `[slug]/[moduleSlug]` route and break all 55 deep-dive pages.

## Coherence wiring (2026-07-22)

- `components/library/ModuleGlancePanel.tsx` — "at-a-glance" for the 28 library-only
  compounds, built from module data + a live PMID count from the MDX body (no
  fabrication). The 27 stack-buildable compounds keep the richer `CompoundGlancePanel`.
- `lib/library-graph.ts` `getCompoundsForHallmark()` unions **both** tiers, so hallmark
  pages link their full evidence set (capped to the 12 best-evidenced in the UI, with an
  "All compounds →" link to `/library/compounds`).

## Deploy lineage

The 55-compound expansion was reconciled with production (`origin/main`, which carried
the PMID-correction, security, and WCAG fixes) via merge, then landed on `main`. A
backup tag `backup/pre-merge-55compounds` marks the pre-merge branch tip.
