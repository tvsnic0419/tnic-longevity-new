# TNiC Site Coherence & Content Audit

A pass focused on **coherence** — making the site's numbers, links, and copy
agree with what is actually published — and on **content depth derived from
data already authored** (the only kind of content growth the YMYL guardrail in
`GROWTH_ROADMAP.md` permits). It sits alongside `ROI_IMPROVEMENT_PLAN.md` and
`GROWTH_ROADMAP.md`; where those track traffic/revenue levers, this one tracks
internal consistency.

## Baseline

The platform is coherent by design: `lib/platform-stats.ts` derives every
"platform by the numbers" figure from the live registries, the footer computes
tier and PMID counts at build time, and a large integrity-test suite
(`site-integrity`, `content-integrity`, `library-graph`, `cross-links`,
`comparison-relations`, …) guards links and content depth. The findings below
are the residual drift that slipped outside those guards.

---

## Shipped (this pass)

### 1. Stale share-card count → live count *(coherence)*

`app/scorecard/[code]/page.tsx` — the shareable Longevity Scorecard — claimed
**"14 compounds, 12 hallmarks of aging."** The library now grades
`COMPOUND_COUNT` (55) compounds, so the site's most viral surface was
understating itself by ~4× to every visitor who landed on a shared card. It now
reads `{COMPOUND_COUNT} evidence-graded compounds`, deriving from the same
constant the hero, `/library`, `/stacks`, `/labs`, and `/trust` already use, so
it can never drift below reality again. Guarded by a new
`site-integrity.test.ts` case that fails if the card reverts to a hardcoded
`"<n> compounds, 12 hallmarks"` literal or drops the `COMPOUND_COUNT` reference.

### 2. Removed dead, stale `communityPulse` data *(coherence / hygiene)*

`lib/data.ts` exported a `communityPulse` array — `12 Hallmarks`, `33 FAQ
Answers`, `20 Glossary Terms`, `28 Clinical Studies` — that **nothing
imported** and whose numbers had already rotted (the glossary holds 26 terms,
data.ts alone carries 93 study PMIDs). It was a stale-stats landmine that
directly contradicted the site's derived-stats principle. Removed, along with
its now-unused `COMPOUND_COUNT` import. Anything wanting these figures should
follow the `platform-stats.ts` pattern and derive them live.

---

## Shipped (guide cross-link pass)

The three items previously queued here are now done, all derived from
already-authored data.

### 3. Guide count claims → derived *(coherence)*

`app/supplement-guides/page.tsx`'s stat row (in-depth guides, compound profiles,
head-to-head comparisons) now derives its numbers from the live `guides` /
`compoundDeepDives` / `comparisons` arrays instead of hardcoded literals, so it
can never drift below what the page actually lists. The `SynergyNetworkGraph`
"14 compounds" labels were left alone (correct — they describe that viz's own
14-node layout).

### 4. Guide→sibling-guide + guide→comparison loops closed *(coherence)*

Every `*-supplement-guide` landing page now renders a derived
`GuideCrossLinks` block (via a `guideHref` prop on `SubPageLayout`) with sibling
guides (master hub first) and the head-to-head comparisons that feature the
compound(s) the guide covers. Both are DERIVED — siblings from a new single-
source `lib/guides.ts` registry, comparisons by inverting the compound→guide map
(`getCompoundSlugsForGuide`) and reusing `getComparisonsForCompound` — so a guide
can no longer be a dead end that leans on the footer, and the links can't drift
from the library graph.

### 5. Content-coverage guard *(coherence)*

`lib/guides.test.ts` asserts the guide registry ↔ compound→guide map agree: every
route referenced by the compound→guide map has a registry entry, every non-master
guide covers at least one compound that resolves to a real `/library/compounds`
page, routes are unique, and siblings never include the current page. Adding a
guide without wiring it — or renaming a route on one side only — now fails CI
instead of silently orphaning a high-intent page.

### 6. Guides index consolidated onto the registry *(coherence)*

`app/supplement-guides/page.tsx` previously carried its own inline `guides`
array — a second source of truth beside `lib/guides.ts` and the compound→guide
map. The index now renders from `SUPPLEMENT_GUIDES` (the registry, enriched with
accent/badge/pills/description), keeping only a route→icon map locally (icons are
React components). Its cards were upgraded to the shared `.premium-card` idiom in
the same pass, and the `guides.test.ts` guard now asserts every registry entry
carries complete presentation metadata. One list, one place.

### 7. Guide→hallmark loop closed *(coherence)*

`GuideCrossLinks` now also renders "Hallmarks of aging it targets", derived by
`getHallmarksForGuide` (a guide's compounds → their `relatedHallmarkIds` → the
canonical `/library/<slug>` hallmark pages). Guides now link up into the
mechanism map, not just sideways. Guarded by a test asserting every non-master
guide resolves to real, number-ordered hallmark pages.

### 8. Guide breadcrumbs — the "up" loop closed *(coherence)*

The guide pages had gained sideways (sibling guides, comparisons) and downward
(compounds, hallmarks) links via `GuideCrossLinks`, but no *upward* navigation:
they were absent from `route-context`/`breadcrumb-titles` and rendered with
`hideContextBar`, so a visitor had no breadcrumb back to the index. Now
`buildRouteBreadcrumbs` special-cases the `*-supplement-guide` routes into a
`TNiC › Supplement Guides › <title>` trail (titles from a new bundle-light
`guideTitles` map, kept in sync with the `SUPPLEMENT_GUIDES` registry by a
`breadcrumb-titles.test.ts` assertion — same single-source discipline as the
other breadcrumb maps), and each guide switched from `hideContextBar` to
`hideStackReadout` so the breadcrumb + next-action bar shows without a phantom
saved-stack readout on what is a landing page. Guarded by a `route-context.test.ts`
case asserting the trail and that the parent crumb resolves to the real index.
