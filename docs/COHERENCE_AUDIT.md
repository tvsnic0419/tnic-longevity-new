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

## Next (verified, safe to sequence)

Ranked by coherence value; each is derivable from already-authored data, so
none crosses the "don't mass-generate medical prose" line.

1. **Audit the remaining hand-written count claims for a floor phrasing.**
   `app/supplement-guides/page.tsx` advertises the master guide as "12+
   compounds / 50+ citations." These are soft floors (still true), but they
   read as small next to a 55-compound library — consider deriving the compound
   figure or lifting the floor so the copy sells the real depth. The
   `SynergyNetworkGraph` "14 compounds" labels are **correct** — they describe
   that visualization's own fixed 14-node layout, not the library — and should
   be left alone.

2. **Close the last pillar→cluster link loops** (the open item in both existing
   roadmaps). The compound↔guide, compound↔hallmark, hallmark→compound, and
   comparison↔comparison loops are already wired and test-guarded via
   `library-graph.ts` / `comparison-relations.ts`. The remaining gap is
   guide→sibling-guide and guide→related-comparison surfacing on the individual
   `*-supplement-guide` landing pages, which currently lean on the footer's
   popular-guides list rather than in-context cross-links.

3. **A single "content coverage" guard** asserting that every compound with a
   dedicated supplement-guide route is present in `library-graph.ts`'s
   `COMPOUND_GUIDE` map (and vice-versa), so adding a guide page without wiring
   the back-link — or renaming a route — fails CI instead of silently orphaning
   a high-intent page.
