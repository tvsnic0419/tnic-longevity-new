# TNiC Redesign Initiative — Progress

*Read this first, every session on this initiative. Don't re-read the full
master prompt — its durable operating rules are already merged into
`CLAUDE.md`. This file is the state.*

## 2026-09-04 (third pass) — NICO starter: the safety screen it claimed but never ran

**The finding.** The homepage NICO starter (section 06) collected age, activity
and goals, then called the engine as
`computeNicoStack({ ...NICO_DEFAULT_ANSWERS, age, movement, goals })`. That
spread silently sent **`safety: []`** and a neutral **3** for sleep / energy /
stress / diet on every single run. Two real consequences:

1. **A safety claim the code did not honour.** `answers.safety` drives
   `SAFETY_EXCLUDE`, `SAFETY_BOOST` and `safetyNotes`. With an always-empty
   list the exclusions never fired — flagging pregnancy removes 13 compounds,
   anticoagulants removes 4 — and the result panel's "Safety notes" block was
   unreachable code. Meanwhile the section copy promised "a built-in safety
   screen". On a health platform that is the credibility spine, not a nit.
2. **Everyone got the same answer.** `SIGNAL_BOOST` keys off sleep <= 2,
   stress >= 4, energy <= 2, diet <= 2. Pinned at 3, none could ever fire.

**Shipped.** Rebuilt as three short steps (You / Signals / Safety) with a
progress rail, rather than one long column:
- **Step 2** asks the four lifestyle pillars the engine actually scores, using
  `NICO_SCALE_LABELS`' own question and endpoint wording so the starter cannot
  drift from `/nico`.
- **Step 3** is a real safety screen built from `NICO_SAFETY_OPTIONS`, and
  **Compute is disabled until it is answered** — including an explicit "None of
  these apply". Treating an unanswered question as "no contraindications" is
  exactly the original bug, so a blank answer must never reach the engine.
- Result gains a **"What NICO used"** panel listing the inputs, so the numbers
  are inspectable rather than asserted.

**Measured effect, stated honestly — the two are not the same size**, and the
UI copy was corrected mid-build to stop overstating the weaker one:
- Safety screen: **large**. Flagging pregnancy takes the stack from
  `nmn / cakg / spermidine / glynac` to `glynac / coq10 / egcg / grapeseed` and
  emits a real note. Verified through the rendered UI, not just the engine.
- Lifestyle signals: **a scoring nudge**. `diet 1 / energy 1` swaps a slot
  (glynac -> coq10); `sleep 1 / stress 5` on a longevity goal reorders the same
  four compounds without changing the set. An earlier draft of the step-2 copy
  said these "genuinely change the stack" — measured, corrected.

**Verified**: lint 0 errors (3 pre-existing warnings, untouched files),
typecheck clean, **677/677 tests** across 53 files (5 new in
`components/home/HomeNicoStarter.test.tsx`, guarding that the safety step stays
reachable and still refuses a blank answer), clean build. axe-core WCAG 2.1
A/AA + best-practice: **0 violations** across all three steps and the result, on
mobile and desktop. Flow driven end to end against the real build: the gate
blocks compute until answered, and pregnancy/anticoagulant flags produce the
right stack and notes.

**Rollback**: `git revert <merge sha>` — one component, one test, one CSS block.

## 2026-09-04 (second pass) — persistent section wayfinding on long-form pages

**What the audit found.** Measured, not assumed: a compound deep-dive renders
**~24,000-25,000px on a 390px phone (about 30 screens)** and ~13,000px on
desktop, across **13 h2 sections**. Its only in-page navigation was the static
"On this page" panel inside the MDX flow, which leaves the viewport inside the
first ~5% and never returns — so for the remaining 95% a reader had no way to
see where they were or reach the section they came for. The one persistent rail
on the site (`ScrollProgress`) navigates top-level **routes**, not sections, and
only renders at >=1280px, yet was labelled `aria-label="Section navigation"` —
telling screen-reader users it would move within the page.

**Shipped.** `components/library/ReadingToc.tsx` replaces the static TOC inside
`MdxRenderer`, so every long MDX page benefits (compound deep-dives *and*
hallmark pages), not just one route:
- the inline panel keeps its markup and **server-rendered** links (11 section
  anchors still in the SSR HTML — no SEO or no-JS regression) and gains an
  active-section highlight;
- once it scrolls above the reading line, a compact control docks bottom-left
  (BackToTop owns bottom-right, CompoundStickyBar owns the top edge) showing the
  section you are in, expanding to the full list;
- jumping moves focus to the target heading, so keyboard and screen-reader users
  land in the section rather than just scrolling the page.
- `ScrollProgress`'s rail relabelled `aria-label="Site sections"` to match what
  it actually does.

**Four real bugs found by driving the built page rather than trusting the diff
— worth recording, because three are traps any future floating UI here will hit:**
1. **`position: fixed` was silently neutralised.** An ancestor with a
   transform/filter/backdrop-filter becomes the containing block for fixed
   descendants, and the deep-dive's article column has one: the "fixed" dock was
   being parked at document y~4741 and scrolling away with the article on
   desktop, while mobile's different column layout happened to escape it.
   **Any fixed overlay rendered inside page content on this site must be
   portalled to `<body>`.**
2. **Activation could not rely on `click`.** On this control the browser did not
   reliably synthesise a click from pointer input (pointerdown landed on the
   button, no click followed), leaving an onClick-only trigger dead to mouse and
   touch alike. Now opens on `pointerdown`, with keyboard activation handled via
   `click` where `detail === 0`, so Enter/Space still work.
3. **`.premium-card` is not an overlay surface.** Its translucency let the
   article read straight through the floating panel — verified by screenshot,
   not by reasoning. The panel now carries its own near-opaque blurred ground.
4. **A zero-size rect read as "already scrolled past".** An unlaid-out or hidden
   element reports an all-zero rect, so a bare `bottom < offset` test floated the
   control over the hero. The dock now requires a real measurement
   (`height > 0`). Caught by the new jsdom test, which is exactly the condition
   that surfaces it.

Also: portalling to `<body>` put the dock outside every landmark, which axe
flags as `region`; it is genuinely section navigation, so it is a labelled
`<nav>` — correct semantics and the fix at once.

**Verified**: lint 0 errors (3 pre-existing warnings in untouched files),
typecheck clean, **672/672 tests** across 52 files (5 new in
`components/library/ReadingToc.test.tsx`), clean production build. axe-core
WCAG 2.1 A/AA + best-practice: **0 violations** across compound desktop/mobile
with the panel open, compound dock-closed, and a hallmark page. Behaviour driven
against the real build on phone/tablet/desktop: dock correctly absent at 0-5%,
present at 50-95%; open, jump, focus-move, Escape and keyboard activation all
confirmed. One synthetic-only failure is *not* a defect: Playwright's
`isMobile:true` at 768px remaps tap coordinates, and the same width with plain
touch (and 820/1024/390) works.

**Rollback**: `git revert <merge sha>` — additive apart from the MdxRenderer TOC
swap and the ScrollProgress aria-label.

## 2026-09-04 — Head-to-Head: the free-form "pick any two" comparison

Closed the second of the three gaps flagged on 2026-09-03 ("Free-form 'pick
any two compounds' comparison tool, distinct from the curated-pairs
`/library/compare` hub"). New route `/library/compare/head-to-head`.

**Why this one, and why NOT the multi-axis evidence model.** The brief's
biggest-visual-impact candidate was the flagged "Evidence Breakdown/Matrix"
(mechanistic / animal / human-biomarker / RCT / observational axes). It was
investigated first and **ruled out on measured evidence, not on effort**:
classifying study design requires study *titles*, and of the 276 study entries
in `lib/data.ts`, only ~25% carry classifiable design language. The rest are
author-year citation stubs (`Zhang 2016`, `Ferenci 1989`, `SELECT 2011`,
`HOPE-2 (Lonn 2006`). A conservative keyword classifier over all 276 scored
**25.4% coverage**. Building the matrix would have meant either rendering
"unclassified" on three-quarters of every compound's evidence, or inventing the
classification — the one thing `NOTES-COMPOUND-LIBRARY.md` forbids absolutely.
Recorded here so a future session doesn't re-derive this: **the blocker is the
citation data shape, not the UI.** The unlock is backfilling real titles for
the ~180 stub entries, which is a content project.

**What shipped instead.** The comparison tool is the highest-intent surface on
the site and its engines were already built and *completely unused*:
`lib/tnic-score.ts` (PR #124) had zero UI consumers in the entire codebase.
This makes the six-dimension derived score visible for the first time.

- `lib/head-to-head.ts` — pure server-safe reader joining `tnic-score` +
  canonical `lib/data.ts`. No new dataset, no new claim. Honesty contract
  enforced in code and in `lib/head-to-head.test.ts` (13 tests): a dimension
  either side can't support is `insufficient` and is never scored as zero (an
  unscored dimension must not read as a loss); a `TIE_BAND` of ±3 points
  suppresses fake winners on what are derived composites, not measurements; an
  undocumented pairing reads as *absence of a record*, explicitly "not evidence
  that the pairing is safe".
- `components/library/HeadToHeadCompare.tsx` — server-rendered end to end.
  Diverging "duel" bars (compound A grows left from a centre line, B grows
  right), dual `ScoreGauge`s, hallmark shared/unique partition, and the
  always-visible `<table>` fallback required by CLAUDE.md §12.
- `components/library/HeadToHeadPicker.tsx` — the only client component.
  Selection lives in the URL (`?a=&b=`), so every comparison is a real
  shareable address. **Deliberately does not call `useSearchParams()`** — the
  page reads its own `searchParams` prop on the server, which is what keeps
  this surface out of the §3 client-side-rendering bailout. Verified: 0
  `BAILOUT_TO_CLIENT_SIDE_RENDERING` markers in the served HTML.
- **SEO**: ~3,200 valid pairings all canonicalize to the bare tool URL, and
  only that base URL is added to the sitemap. Enumerating the variants would
  be doorway-page spam, not coverage. Confirmed in the served HTML that
  `?a=iodine&b=piperine` emits `canonical → /library/compare/head-to-head`.
- Two real bugs found by looking at the rendered page rather than trusting the
  diff: (1) screen-reader text read "Too close to call **by 0 points**" — the
  gap is now only voiced when a leader was actually declared; (2) a genuine
  **stat contradiction** — the scored `Bioavailability` *rating* (resveratrol
  30) sat on the same page as the library's published oral-bioavailability
  *percentage* (72%), same word, different units, no explanation. Both are now
  explicitly labelled ("rating 0–100" vs "measured %") with a note naming them
  as different measures.
- `CompareHub.tsx` microcopy no longer apologizes ("not a free pick-any-two
  tool") and instead routes to the tool, plus a CTA banner on the hub.

**Verified**: lint 0 errors (3 pre-existing warnings, all in untouched files),
typecheck clean, **667/667 tests** across 51 files, clean production build
(exit 0, route builds as `ƒ` dynamic — correct for a `searchParams` page).
axe-core WCAG 2.1 A/AA + best-practice sweep against the real production
server: **0 violations** on the tool (rich-data pair), the tool (thin-data
pair), and the compare hub. Exactly one `<h1>`. Verified against a server whose
PID start-time postdates the build, per this doc's own stale-process warning —
which did in fact bite once this session and was caught.

**Rollback**: `git revert <merge sha of PR>` — additive apart from the
`CompareHub` microcopy and one sitemap line; nothing existing was removed.

**Note for the next session**: 57 of 81 compounds resolve to the `canonical`
scoring source, which returns `null` for clinicalEvidence / mechanisticStrength
/ safety — so a comparison between two of them is honest but thin (renders
"Not scored for both" on 3–4 of 6 rows). Only 24 compounds carry full-depth
scores. Widening that is a `lib/compound-engine-data.ts` coverage question, not
a UI one.

## 2026-09-03 — reconciliation + Phase 7 (audit-driven gap fixes)

This file hadn't been updated since before PR #131, even though work
continued: PRs #131 (Sirtuin Atlas + TNiC Score/Match surfaced), #155
(color-coded instrument-card redesign), #156/#157 (StackDock "Your Protocol"
tray + shareable protocol grade card), #158 (self-canonical fix on 4 pages),
#159/#160 (answer-first AnswerBox on comparisons/best-for/lead pages), #161
(AddToProtocol primitive, best-leaderboard, Combination Lab empty state),
#162 (sticky compound conversion rail), and #163 ("Sharper & faster"
fidelity/perf pass) all merged to `main` with no entry here. Recorded now so
this doc is trustworthy as the single source of truth again.

A large creative-direction brief (repositioning as "evidence intelligence
for healthy aging," a full IA/visual/evidence-system rebuild) was received
and handled per CLAUDE.md Section 6 — as a quality-bar/gap-finder audit, not
a rebuild spec. Most of the brief's asks already exist at or above the bar
described (cinematic homepage, `.premium-card`/tier-color system, Cmd+K
command palette across compounds/hallmarks/tools/comparisons, Stack
Architect with synergy/redundancy/interaction detection, curated evidence
comparisons, TNiC Score/Match, methodology/trust pages, corrections process).
Three concrete, verified gaps were fixed this pass; larger ones are flagged
below as recommended future phases rather than attempted unilaterally.

**Fixed this pass:**
- **No automated accessibility regression guard.** Prior sweeps (28-page
  axe-core pass, 0 violations) were manual and left nothing to catch a
  future regression — noted as a known gap in this doc's own Decisions log
  ("a11y tooling" entry, which proposed `@axe-core/playwright`). Took a
  lighter path instead: added `jsdom` + `@testing-library/react` + `jest-axe`
  as devDependencies and `lib/accessibility.test.tsx`, a component-level axe
  guardrail (EvidenceBadge/EvidenceBadgeLegend, ProductPickCard) that now
  runs in `npm run test`/`npm run ci`. Verified it's a real guard, not a
  no-op, by deliberately introducing an `alt`-text violation and confirming
  the test failed, then reverting. Full page-level (Playwright) coverage is
  still a good future addition — this covers the highest-regression-risk
  components, not every route.
- **Product cards had no testing/COA field and no visible affiliate
  disclosure.** `ProductPickCard.tsx` showed manufacturer/dose/TNiC
  Match/link-verified-date but nothing on third-party testing, and the
  affiliate relationship lived only in link `rel="sponsored"` + page-level
  copy. Added an optional `thirdPartyTested` field to `ProductPick` in
  `lib/product-picks.ts`, set to `true` only on the 5 entries whose existing
  `whyThisPick` prose already states it (nmn, cakg, spermidine,
  pterostilbene, tudca) — never inferred for the rest, which now render an
  honest "Testing documentation not verified" state. Added a visible
  "Affiliate link" chip on every card next to the buy CTA, and reworded
  "Link verified" to "Buy link checked" to avoid implying lab verification.
- **Compare hub didn't say it was curated.** `/library/compare` only offers
  pre-authored pairs (NMN vs NR, etc.), not a free pick-any-two tool, with
  nothing telling the user that. Added one line of microcopy pointing users
  who want an uncovered pairing to Stack Architect instead.

**Flagged for a future phase (not attempted here — each is a real
architectural change, not a small fix):**
- Multi-axis evidence model (mechanistic/animal/human-biomarker/RCT/
  observational/clinical-outcome, distinct from the current single A/B/C
  tier) — the brief's "Evidence Breakdown/Matrix/Timeline" components. Real
  gap: `lib/trust.ts`'s `evidenceLevelFromTier` derives Strong/Moderate/
  Mechanistic 1:1 from the tier, it doesn't independently track evidence
  *type*. Building this without fabricating data means auditing every
  compound's existing MDX/citations first — a multi-session content project.
- Free-form "pick any two compounds" comparison tool, distinct from the
  curated-pairs `/library/compare` hub.
- Homepage: no dedicated "featured compounds," "Stack Architect preview," or
  "product verification" *sections* — those live as full separate routes
  and the homepage points to them via `HomeEliteInterventions`/`HomeSteps`/
  footer rather than dedicated blocks. Worth a homepage-audit pass against
  Section 8's checklist specifically, next.
- Full page-level a11y coverage (Playwright-driven, all routes) as a
  successor to this pass's component-level guard.

## Current phase

**Phase 6 complete**, and — undocumented here until now — six more PRs from
other concurrent sessions shipped on top of it between 2026-08-19 and
2026-08-23 (six-chapter homepage restructure, Combination Lab, a 28-page
a11y sweep, TNiC Score/Match foundation, and three funnel/polish passes),
plus one PR (#125) found genuinely still open and merged during a
**2026-08-24 reconciliation sweep**. See "Unnumbered work" and "PR #125"
directly below for what each one actually did — this is the same
concurrent-sessions pattern already noted in the Decisions log (PR #113,
PR #109); nothing here contradicts or duplicates Phase 5/6.

**2026-08-24 sweep**: checked all open/recently-merged PRs and all ~90
remote branches for anything unmerged. Found exactly one live item — PR
#125 (nav scroll-backdrop bug, desktop overflow, packshot scale) — verified
with a clean local dry-run merge against current `main` (zero conflicts),
merged via the GitHub API (`a6c20f77`), Vercel Production Deploy green.
Everything else recent was already merged. ~90 older branches (44–190
commits behind `main`, mostly July dates, pre-dating this initiative) are
dead — not evaluated individually, not touched.

## 2026-08-28 — mobile GPU paint budget for the always-on blur layers

A performance pass on the *visual* layer (no restyle). Audit finding: the
site's heaviest continuous graphics cost is the always-on ambient field
(`.ambient-layer` — three `filter: blur(90px)` aurora orbs + a drifting
molecule cascade, on 100% of pages) plus the per-hub `.hub-hero-field`
(two `blur(60px)` orbs). The codebase already established a "halve blur cost on
phones, that's where it janks" budget for the glass surfaces
(`.glass-deep`, `@media (max-width: 767px)`, globals.css) but **never extended
it to these `filter: blur()` layers** — they rendered identical blur radii on a
320px phone and a 5K display. Extended the same pattern:

- `.ambient-orb` blur `90px → 60px` on ≤767px (radius only; ~55% cheaper raster
  — blur cost scales with radius² — and imperceptible as a background wash at
  ~55vw). `.molecule-cascade` drops its full-viewport `drop-shadow` filter
  region on phones (imperceptible at the field's 0.09–0.2 opacity).
- `.hub-hero-field::before/::after` blur `60px → 38px` on ≤767px.
- `.ambient-layer` gained `contain: layout paint` — it already clips to itself
  (`overflow: hidden`) and owns a stacking context (`fixed` + `z-index:0`), so
  this is zero visual change; it just keeps the always-animating subtree off the
  document's layout/paint invalidation path.

Nothing hidden or repositioned; reduced-motion still freezes all of it. Dead
CSS `.aurora-beams` (defined, used nowhere) left untouched.

**`content-visibility: auto` — evaluated and deliberately NOT adopted.** It's
the biggest modern rendering lever and is unused here, but it forces
`contain: paint` (clips descendant painting to the box) *even on-screen*, and
this site leans on outset decoration everywhere: `CellularDivider` chapter
glyphs sit `absolute top-0 -translate-y-1/2` (half above each home section),
`.premium-card:hover` lifts + glows past its box, `--footer-lift-shadow` casts
up above the footer. Applying cv:auto to those surfaces would clip that
decoration — a real regression. Safe adoption needs per-target restructuring
(a non-overflowing inner wrapper), so it's a deferred content-visibility item,
not a mechanical retrofit. Recorded so a future session doesn't ship the naïve
version.

Verified: lint 0 errors, typecheck clean, 648/648 tests, clean build (427
routes), all three rules confirmed in the compiled CSS bundle bound to the
right selectors. Rollback: `git revert <sha>` (single CSS + this note).

## PR #125 — nav scroll bug + overflow fix + packshot normalization (merged 2026-08-24)

1. **Nav lost its backdrop on scroll, sitewide.** `.nav-glass-scrolled`
   declared `position: relative`, overriding the Tailwind `absolute` on the
   backdrop layer beneath it — the same unlayered-CSS-beats-`@layer` trap
   already documented for `.premium-card` in this file. Measured 76px→1px
   effective backdrop height on scroll; nav content read through onto page
   content underneath. Rule no longer sets `position`.
2. **Desktop nav overflowed from 1440px up** (content needs ~1490px inside a
   1280px-capped container, clipping 5–7 trailing elements). Row is now
   full-bleed; `Nav.tsx` measures its own content via `ResizeObserver` and
   shows the full bar whenever it actually fits, rather than at one
   hardcoded breakpoint — full bar now from 1512px (was 1600px); zero
   overflow measured 390px→2560px.
3. Removed `/stacks/lab` from the top-level nav — read as "Lab" four items
   from "Labs" (`/labs`). Already promoted at the top of `/stacks` and in
   the sitemap.
4. **Product packshots normalized** — manufacturer photos carried wildly
   different built-in whitespace (28%–100% measured fill ratio); re-padded 8
   images to a consistent ~4%-of-longest-edge margin, 5 already-tight assets
   left untouched. Image-only change.

Verified per PR body: 607/607 tests, clean build (427 routes), nav measured
at 11 widths, axe sweep across 7 pages at 1440px (0 violations).

## Unnumbered work merged between Phase 6 and this update (2026-08-19 – 2026-08-23)

Six PRs from other sessions, all merged before this sweep found them
undocumented here, each green on this repo's standard gates
(lint/typecheck/test/build, guardrail suites intact) per its own PR body:

- **PR #122 — Combination Lab** (`/stacks/lab`, new tool): progressive
  stack-relationship analyzer — per-pair classification (synergy /
  complementary / additive / redundancy / interaction-caution / antagonism /
  honestly-labeled uncertain), an itemized 0–100 score, a marginal-
  contribution view, a removal-simulation optimizer. Pure-TS engine
  (`lib/combination-lab.ts`) with an honesty contract enforced in code —
  ontology-derived edges are always `demonstrated: false` with a disclosed
  hypothesis; curated edges are `demonstrated: true`; antagonism is never
  discounted. Distinct from the existing `/tools` interaction browser and
  `/stacks` Architect — neither does marginal analysis scoped to a user's
  own selected stack. Ships with the always-visible fallback `<table>`.
- **PR #124 — TNiC Score + TNiC Match, salvaged from #106**: rescued the two
  genuinely net-new modules from the otherwise-superseded PR #106 (below) —
  `lib/tnic-score.ts` (deterministic 0–100 composite per compound; layers
  the three *existing* evidence sources — Elite-8 LQ model, Compound Engine,
  canonical `lib/data.ts` — by richness rather than adding a fourth dataset;
  unsupported dimensions return `null`; `confidence` reports data
  completeness, not clinical certainty, per `NOTES-COMPOUND-LIBRARY.md`) and
  `lib/tnic-match.ts` (transparent product-pick criteria checklist — not a
  purity/lab-testing claim). Added with no UI consumers yet — foundation
  only, nothing else modified.
- **PR #123 — UI/a11y pass**: axe-core sweep across 28 production pages
  found 56 violation nodes, taken to 0. Fixed ~20 routes double-rendering
  site chrome (`/tools/pathway-architect` + all 19 `/pathways/*` wrapped
  themselves in `SubPageLayout` while their segment layout already did);
  `/protocols` and `/insights` had no `<h1>` at all (new opt-in
  `titleAsHeading` prop on `CinematicHubHero`, default `false`); a
  tier-color drift in `lib/hero-network.ts` (Tier B rendered amber — the
  Tier C color — feeding the homepage hero panel); plus list-semantics,
  duplicate-link-name, color-only-distinction, and heading-order fixes.
- **PR #126, #127 — Polish batches 2–3**: homepage interactive-component
  hardening — elite-interventions filter no longer unmounts cards on chip
  click, gained a live result count; NICO starter's primary button fixed
  from ~2.4:1 contrast to the canonical `.btn-gradient`, added a live
  focus-area counter and result-focus management. Batch 3: toast/back-to-top
  overlap, NICO's redundant double `aria-live` announcement, focus-limit
  chips staying perceivable at the 3-selection cap, descent rail vocabulary
  (`Synergies`/`Healthspan` → `System`/`Goal`, matching the numbered spine).
- **PR #128 — NICO → Stack Builder → Shop funnel tightening**: fixed a real
  Protocol Shop dead-end — a stack whose compounds *all* lack a verified
  pick fell through to the generic "No stack loaded yet" state instead of
  showing what it actually had. Now shows a dedicated "Stack loaded · no
  verified picks yet" panel. Added a "Loaded from your NICO questionnaire"
  banner on handoff, and a "Verify & shop this stack" exit CTA at the end of
  the Stack Builder.
- **PR #120 — Polish batch 1**: sitewide anchor `scroll-margin-top` (deep
  links were landing under the fixed nav), visible 01–06 numbers on the
  homepage's chapter eyebrows, a reduced-motion-aware `BackToTop` control,
  and a dead `ScrollProgress` right-rail fixed (was scroll-spying for
  element ids that exist on no page — switched to route-based active state).
- **PR #119 — six-chapter homepage restructure**: reorganized the homepage
  into the numbered spine hero → 01 System → 02 Goal → 03 Interventions →
  04 Mechanisms → 05 Protocol → 06 Personalize, reusing existing cinematic
  components. New `HomeEliteGrid` hallmark filter (chips derived from
  hallmarks actually present on the elite set; default `all`, server HTML
  ships every card unfiltered). New `HomeNicoStarter` — a compact on-page
  NICO flow using the same deterministic engine (`computeNicoStack`) as the
  full `/nico` page. Dropped `HomeGuides`/`HomeExplore`/the old `HomeCTA`
  from `app/page.tsx` (files retained, unused).
- **PR #106 — superseded, closed without merging (2026-08-19)**: an earlier,
  larger "TNiC Score + TNiC Verified + hero rework + intent-based nav"
  attempt. Closed because its homepage/hero rework would have regressed what
  Phases 5–6 and the six-chapter restructure had since landed on `main`. Its
  two genuinely net-new library modules were salvaged cleanly into PR #124
  (above); nothing else from it was carried forward. `mergeable_state` is
  now `dirty` against current `main`, confirming it's correctly dead.

## Phase 6 — hallmark taxonomy correction (the Phase 4 flag, resolved)

**Decision (delegated by Thomas 2026-08-19):** align the registry to the
canonical López-Otín 2023 framework and to the site's own engine layer, which
already used the correct labels (`compound-engine-data.ts` HALLMARKS and
`stack-engine.ts` HALLMARK_LABEL both map id `autophagy` → "Disabled
macroautophagy" and id `nutrient` → "Deregulated nutrient sensing"). The two
library entries' **titles/slugs were swapped relative to their content**;
content was never wrong, only labels. No merge, no deletion — both sets of
fully-authored content stay, now under the correct names:

- Entry `autophagy` (#5, ULK1/LC3/mitophagy content): slug
  `disabled-autophagy` → **`disabled-macroautophagy`**, title → **Disabled
  Macroautophagy**.
- Entry `nutrient` (#12, mTORC1/AMPK/rapamycin/metformin content): slug
  `disabled-macroautophagy` → **`deregulated-nutrient-sensing`**, title →
  **Deregulated Nutrient Sensing**.
- Hallmark numbers unchanged (#5 / #12 — the site appends the three 2023
  additions at 10–12; MDX bodies cross-reference these numbers throughout).
- Join-key `id`s unchanged (`autophagy`, `nutrient`) — zero data-model blast
  radius; only the user-facing label/URL layer moved.

**What changed:**
- `lib/hallmarks-library.ts` — the two entries' slug/title/mdxSlug.
- Pages: `app/hallmarks/disabled-macroautophagy/` now serves the macroautophagy
  deep-dive (moved from `disabled-autophagy/`, metadata retitled);
  `app/hallmarks/deregulated-nutrient-sensing/` now serves the nutrient-sensing
  deep-dive (moved from the old `disabled-macroautophagy/`).
- MDX: `content/hallmarks/disabled-macroautophagy.mdx` (macroautophagy content)
  and `deregulated-nutrient-sensing.mdx` (nutrient content) renamed with
  frontmatter titles and all intra-MDX cross-links retargeted.
- Redirects (`next.config.ts`): `/hallmarks/disabled-autophagy` →
  `/hallmarks/disabled-macroautophagy` (kept — now lands on the *correct*
  content; the old "duplicate deep-dive" comment was wrong and is rewritten),
  plus new `/library/disabled-autophagy` → `/library/disabled-macroautophagy`.
  The nutrient content's old URL keeps serving — now under its correct name at
  the new slug.
- Reference sweep (each audited by semantic intent, not blind sed):
  research-feed (rapamycin r12 + berberine r22 + metformin r28 → nutrient
  sensing; urolithin A r20/r23 + spermidine r21 → macroautophagy),
  protocol-brief rapamycin link → nutrient sensing, comparisons
  nmn-vs-spermidine label, cross-links HALLMARKS, breadcrumb-titles
  hallmarkTitles (guardrail-tested against the registry), data.ts hallmark
  card titles, CrossHallmarkEffects + ImpactPropagationView label maps
  (also fixed a third drifting variant, "Nutrient Dysregulation"),
  LibraryFacetFilters chips (5↔12 were swapped), HallmarkVisuals aria/visible
  labels + legacy slug map, DisabledMacroautophagyVisual/DeregulatedNutrient-
  SensingVisual internal "HALLMARK nn" badges (were inverted), /library visual
  grid order, 4 compound MDX "primary hallmarks" links, ELEVATION-CHECKLIST.
- `app/hallmarks/page.tsx` EDITORIAL_SLUGS — the index grid now shows the
  correct 12 names and clicking the macroautophagy card no longer 308s into
  the nutrient-sensing page (the live production bug from the Phase 4 flag).

## Phase 5 — homepage structure + tool-surface elevation

**Homepage structure (3 confirmed production bugs fixed):**
- `HomeHero.tsx` — the stacked-hero problem: HomeDescent Act 0 already opens
  with a display h1 + the NICO/Explore CTA pair, and HomeHero immediately
  re-stated a second display headline with the *identical* CTA pair. Demoted
  the hero's h2 from `.headline-editorial` to `.heading-section` (kept
  `!text-white` + the `.gradient-sweep-text` span; the comment now describes
  the shared heading scale's theme-aware color, since `.heading-section`'s
  color lives in `@layer components`) and **deleted the duplicated CTA row**
  — the NICO card's "Begin" is now the band's single action. Unused `Library`
  lucide import removed.
- `HomeDescent.tsx` Act 3 — the milestone-label collision on production:
  "NAD⁺ decline steepens" (x=40) overlapped the "function preserved →" axis
  label and crowded "Senescent-cell window" (x=50). `MILESTONES` entries now
  accept `below?: boolean`; the NAD⁺ label renders below its marker
  (`+24` instead of `-10` on y). Verified visually: labels fully separated.
- `HomeDescent.tsx` Act 4 — capstone: a decorative `aria-hidden` SVG reuses
  the already-computed `goalPath`, mirrored via `translate(1000,0)
  scale(-1,1)` so the descent becomes an ascent behind the closing section
  (faint gold stroke at 0.38 + gradient area fill, `.tnic-act4-sky` at
  `z-index:-1` inside the act's stacking context).
- `Footer.tsx` — column imbalance: outer grid `lg:grid-cols-5` →
  `lg:grid-cols-6`; Popular Guides (27 links vs 11–16 in siblings) takes
  `lg:col-span-2` and flows into an inner 2-column grid. No more towering tail.

**Tool surfaces (the user's priority target — the stack analyzer family):**
- `StackNetworkGraph` was the weakest surface on the site: all ~81
  catalogued compounds were laid out on a single r=150 ring in a 400-unit
  viewBox — an illegible overlapping label band. Rebuilt the layout in
  `lib/tools/stack-network.ts`: only compounds with ≥1 documented
  interaction (or staged in the user's stack) earn a node — measured 68 of
  ~95 had *zero* edges and contributed nothing but clutter; nodes are
  grouped by physiological pathway (largest clusters first) so related
  compounds sit adjacent; node size now scales with interaction degree; the
  tier letter sits inside each node with the canonical A/B/C tier color on
  the ring; labels render radially *outside* the ring, rotated with the
  orbit and flipped on the left half so nothing reads upside-down. The
  omitted-node count is surfaced honestly under the legend ("N catalogued
  compounds have no documented pair interaction yet and are omitted from
  the map") via a new derived `stats.isolatedCount` — never silently
  dropped. The always-visible fallback table (Phase 4 guardrail) is
  untouched. Design method: musepool references for dense dark-network UIs
  (radial label placement, edge-dimming focus pattern, legend-at-edge).
- **Stale hardcoded stats eliminated (CLAUDE.md: derived, never literal):**
  `/stacks` hero "6 Graded presets" → `Object.keys(stackPresets).length`
  (actually 7 — production was wrong); the HowTo schema's preset list named
  presets that don't exist ("Foundation Tier", "Elite Protocol") → now
  generated from the real registry; `StacksLibrary` meta "6 evidence-graded
  compounds" → `${compounds.length} stack-buildable compounds`; `/tools`
  hub copy + JSON-LD said "Six" tools → derived from `toolsRegistry`
  (actually 7); `/compound-engine` hero + schema "12 hallmarks" →
  `HALLMARKS.length` from the engine's own registry (this is the engine's
  private hallmark list — unrelated to the flagged taxonomy issue, which
  was not touched).

**Verification**: `npm run lint`/`typecheck`/`test` clean at every step
(41 files / 571 tests). Full clean rebuild (`rm -rf .next && npm run build`)
succeeded — 426 routes, no new warnings (the one edge-runtime notice is
pre-existing on baseline). SSR HTML spot-checks: exactly one `<h1>` on `/`,
`/stacks`, `/tools`, `/compound-engine` (checked post-hydration via
Playwright — the last three keep their h1 inside a client Suspense boundary
by design, unchanged from baseline); `heading-section` + `tnic-act4-sky`
confirmed in the homepage's server HTML; the derived "7" presets stat
confirmed in `/stacks` SSR output. Visual QA against the production build
(Playwright + Chromium): network graph legible in all three filter states
plus preset-selected state; Act 3 labels separated; Act 4 ascent backdrop
renders; footer columns balanced.

## ✅ Resolved — hallmark taxonomy conflict (was Phase 4's open flag)

Resolved in Phase 6 (above) under Thomas's 2026-08-19 delegation. Summary of
what the flag had established, preserved for the record: the registry carried
two entries whose titles/slugs were swapped relative to their content —
`disabled-autophagy` (id `autophagy`, #5) held the autophagy-machinery
content the literature calls *disabled macroautophagy*, and
`disabled-macroautophagy` (id `nutrient`, #12) held the mTOR/AMPK content the
literature calls *deregulated nutrient-sensing*; a permanent redirect sent
the autophagy URL to the nutrient-sensing page. The Phase 4 note's "13
entries" was an overcount — the library always held exactly 12; the bug was
labeling, not cardinality. Phase 6 relabeled to the canonical framework,
fixed the redirect semantics, and swept every reference site.

## Phase 4 — coherence / UI-consistency pass

Finished Phase 2's explicitly-deferred `.premium-card` migration backlog,
plus one more confirmed a11y-fallback-table gap found in the same family as
two already fixed in Phase 2. Re-surveyed current state first (a prior
session's find can go stale) rather than trusting old notes.

**`.premium-card` migration — 21 ad hoc cards across 16 files, with
documented exceptions where migrating would be a regression:**
- All 12 `/hallmarks/<slug>` detail pages' biomarkers-table wrappers, plus 3
  extra accent-neutral wrapper cards found along the way (cellular-senescence,
  genomic-instability, mitochondrial-dysfunction).
- `/insights`, `/protocols` closing CTA bands; `/best/[goal]`'s "How we
  rank" note and FAQ cards; `HomeEliteInterventions.tsx`'s disclosure notice.
- Where a card needs a horizontal `sm:flex-row` layout, `.premium-card` went
  on an *outer* wrapper with the flex layout moved to a *nested inner* div —
  `.premium-card`'s own unlayered CSS forces `flex-direction: column` on
  itself (unlayered always beats Tailwind `@layer utilities`, confirmed from
  `app/globals.css`'s own comment on this), so putting it directly on a
  flex-row element would silently collapse the row. The nested-wrapper
  approach only lets it affect its own layout, not descendants.
- **Explicitly NOT migrated, verified against `.premium-card`'s actual CSS
  before deciding** (documented in the commit, not silently skipped):
  `HomeEliteInterventions.tsx`'s elite-card itself (already has a more
  sophisticated, deliberate hover system — CLAUDE.md protects exactly this
  kind of distinctive design from being flattened for consistency's sake);
  several cards deliberately accent-tinted *at rest* (best/[goal]'s NICO
  CTA, partnerships' "Non-negotiables", trust/sponsorship's "Professional
  review" notice, cellular-senescence's Senolytics/Senomorphics sub-cards) —
  `.premium-card` only shows accent via a thin hairline at rest and a
  hover-triggered glow, so forcing these onto it would downgrade cards
  meant to stand out immediately; `Modal.tsx` and `CommandPalette.tsx`'s
  dialog panels — stationary, keyboard-driven, constantly-hovered-while-in-
  use surfaces where `.premium-card:hover`'s `translateY(-4px)` would
  visibly jump the panel; `PrivacyConsentBanner.tsx` — a fixed persistent
  toast, same hover-jump problem while reading/dismissing; trust/sponsorship's
  5 "principle" cards, which already stack `.glass` — combining `.glass`'s
  own background with `.premium-card`'s separately-declared one would
  silently discard `.glass`'s tinted backdrop rather than layer with it.

**`disabled-autophagy/page.tsx` migrated to `HallmarkPageHero`** (matching
its 11 siblings), fixing a real duplicate-landmark a11y bug and a wrong
canonical URL along the way — see the flagged taxonomy finding above for why
this page doesn't currently reach real users despite being fixed.

**`StackNetworkGraph.tsx`** (the Advanced Stack Simulator's interaction-network
graph) — confirmed still hover-only with no text/table fallback, the same
CLAUDE.md violation already fixed twice in Phase 2. Unlike those two, its
edges already carry real `label`/`detail`/`severity` text computed live from
the user's stack (`buildStackNetwork()`) — no resolver needed, just never
rendered outside the hover interaction. Added the same always-visible-table
idiom as `ConnectionMatrix.tsx`.

**Verification**: `npm run lint`/`typecheck`/`test` clean at every commit
(41 files / 571 tests). Full clean rebuild (`rm -rf .next && npm run build`)
succeeded with 0 errors/warnings, confirmed `/hallmarks/disabled-autophagy`
still builds as a static route. Manual QA against the real build: exactly
one `<h1>` on every touched page (spot-checked 5 hallmark pages plus the 3
non-hallmark pages), `.premium-card` class confirmed present in the live
SSR HTML on `/insights`, `/protocols`, and a real `/best/<goal>` page.

## Phase 3 — conversion-funnel fixes (5 workstreams)

Same audit-and-extend discipline as Phase 2, applied to the site's actual
monetization surface. **Never fabricates**: every fix is code/UX/copy —
nothing here invents a product pick, a reviewer identity, or any claim not
already backed by real, already-authored data. Two Explore agents audited
the actual buy-path/CTA structure and trust-signal placement; a Plan agent
turned the findings into a file-by-file plan, which I then independently
re-verified against source before executing — and found the plan's own
claim that 2 of 5 "duplicate" disclosure boxes were near-duplicates was
wrong on direct read (see Workstream 3 below), so didn't force a merge that
would have been a content regression.

1. **Honest empty-state for the ~75% of compounds with no buy path** — 47 of
   63 compound library modules had zero buy CTA, including 5 that already
   have a full buyer's-guide checklist (rapamycin, berberine, urolithin-a,
   coq10, omega3) with literally nothing after it. `CompoundBuyerGuide.tsx`
   and `LibraryModuleDetail.tsx` now show an honest "TNiC hasn't verified a
   manufacturer pick yet" note with a real next step (`/products`, `/nico`)
   instead of silence — never a fabricated pick. **Flagged for Thomas, not
   executed**: actually sourcing/vetting real products for more compounds
   (the 5 with existing checklists first — half the vetting work is already
   done) is almost certainly the single highest-revenue lever on this whole
   list, but it's a business/data task no code fix substitutes for.
2. **Fixed a silent data-loss bug in the site's own flagship funnel.** NICO
   quiz → Stack Builder → "Protocol Shop" is the most-repeated CTA path on
   the homepage (5 links). `getStackShopItems()` only recognized 10
   hardcoded compound ids and silently dropped everything else with no
   message — a user could lose half their built stack at the exact moment
   they were ready to buy. New `getUnmatchedStackCompounds()` in
   `lib/protocol-shop.ts` (additive, existing behavior untouched) now
   surfaces what got dropped, linking to a library page when one exists (31
   of 81 stack-buildable ids have none — those render as plain text, never
   a dead link).
3. **Consolidated buy-CTA disclosure + made evidence-tier badges clickable.**
   New `components/trust/AffiliateDisclosure.tsx` de-duplicates 2 genuinely
   near-identical inline copies (`GuideVerifiedPick.tsx`,
   `LibraryModuleDetail.tsx`'s fallbackPick block) and closes a real gap —
   `CompoundBuyerGuidePanel`, used on ~10 compound pages with a live buy
   card, had *no* disclosure at all. **Correction to the plan**: I
   independently re-read `ProductsHub.tsx`'s and `HomeEliteInterventions.tsx`'s
   own disclosure boxes before touching them and found both are genuinely
   distinct, page-appropriate copy, not near-duplicates —
   `HomeEliteInterventions.tsx`'s has strictly *more* content (a "talk to a
   clinician" line found nowhere else); forcing the shared component's
   shorter text in either would have been a content regression disguised as
   cleanup, so both were left untouched. Also wired the existing (already
   built, just unused) `href` prop on `EvidenceTag` at every buy-adjacent
   site that was safe to touch (6 files) — was hover-only via a native
   `title` attribute almost everywhere, unreachable on mobile right at the
   decision point. Excluded 2 sites (`CompoundSelectorGrid.tsx`,
   `EliteStackCard.tsx`) where the tag sits inside a `<button onClick>` —
   adding `href` there would nest an `<a>` inside a `<button>`.
4. **Sitewide email capture.** The only working capture mechanism
   (`BriefSubscribePanel`, real backend) rendered only on `/brief`, which
   isn't in nav and isn't linked from the homepage or footer. New
   `components/brief/FooterBriefSubscribe.tsx` reuses
   `submitBriefSubscription()` — the same function the full panel calls, so
   validation/save/API behavior is 100% shared — condensed to one input +
   button, now in the sitewide footer.
5. **Shortened the funnel's last mile.** `StackExport.tsx` previously
   offered only Copy Text/JSON/Download/Share once a stack was built — no
   buy/shop action anywhere in the builder. Added a prominent "Shop this
   stack" button (reusing the existing `buildShopStackUrl()` helper),
   sequenced after item 2 so it never routes into the silent-drop dead end
   that used to exist. `StackExport` has exactly 2 consumers, so this closes
   the gap in both the Stack Architect and the Advanced Stack Simulator at
   once.

**Verification**: `npm run lint`/`typecheck`/`test` clean at every commit
(41 files / 571 tests). Full clean rebuild succeeded with 0 errors/warnings.
Manual QA against the real build (curl for SSR content, Playwright for the
client-rendered `/shop` page since it's behind a pre-existing Suspense
boundary by design): confirmed the empty-state renders server-side on
`rapamycin`/`fisetin`, confirmed `nmn`/`glynac`-only stacks show no
regression, confirmed the unmatched-compounds notice appears for a mixed
stack and correctly lists a linked library page vs. plain text for
compounds with none, confirmed the `isNrOnlyMode` and empty-stack states are
unaffected (using a fresh, isolated browser context — the first pass showed
a false negative from stack-selection state persisting across sequential
navigations in one context, which is itself correct pre-existing behavior,
not a bug), confirmed "Shop this stack" generates the right URL end-to-end
from Stack Builder into the shop notice. Exactly one `<h1>` on every touched
page — no heading regression.

## Phase 2 — visual/UI depth pass (3 workstreams)

Audit-and-extend, not a redesign: every fix below consolidates onto or
extends an already-established, already-distinctive pattern
(`.premium-card`, `CinematicHubHero`, `MoleculeStage`, `viz/tokens.ts`,
`HallmarkPageHero`, `getEdgeExplanation`) — nothing new invented, nothing
working removed. Full plan (with file:line citations) is in the session
transcript; this is the outcome summary.

**Workstream 1 — token fidelity, card consolidation, typography.**
- Documented the real-but-undocumented `.text-h3` class in
  `STYLE_GUIDE.md`'s type-scale table; gave it a second live consumer
  (`scorecard/[code]`'s grade label).
- Killed every found canonical-token bypass: `longevity-supplements-guide`'s
  inline score-color literals, `HallmarkVisuals.tsx`'s duplicated (not
  imported) hex map, two guide pages' raw `amber-400`/`amber-500` Tailwind
  classes, `SynergyNetworkGraph.tsx`'s `PATHWAY_COLOR`/`getTierBadgeColor()`,
  `SynergyNetworkVisual.tsx`'s 6 hardcoded node/edge hex values — all now
  source from `components/viz/tokens.ts`'s `VIZ`/`tierColor()`.
- Fixed an isolated typography regression (`nad-supplement-guide`'s h1 used
  raw text-size classes instead of `.heading-page`) and an invented
  background shade (`bg-[#050a14]/50` → the real `--color-bg-elevated`
  token), both in the same file.
- Migrated the 6 standalone SEO compound-guide pages' ad hoc
  `rounded-xl border ... bg-card/50` divs to `.premium-card` — mechanism
  card grids and best-practices/caution/key-finding callouts, ~30 divs
  total. Deferred (documented backlog, not this pass): `/insights`,
  `/protocols`, `/best/[goal]`, the 11 `/hallmarks/*` detail pages,
  `/partnerships`, `/trust/sponsorship`, plus 4 smaller standalone
  components — same fix, lower per-file return, next pass.

**Workstream 2 — closed 3 real visual-escalation gaps** (pages flatter than
their peers, brought up to the established bar with already-built
components only):
- `/compound-engine` was the one documented hub route with no
  `CinematicHubHero` — added one (`hue="cyan"`, stats derived from
  `COMPOUND_DB.length`/scoring-dimension count).
- `/library/<hallmark-slug>` (`HallmarkDetail.tsx`) used to hand-roll its
  own plain header + a separately-duplicated "why it matters" panel — a
  real step-down vs. its sibling route `/hallmarks/<slug>`, which covers
  the same content via the richer `HallmarkPageHero`. Wired it in, removed
  the now-duplicated blocks.
- New `components/guides/GuideMoleculeWell.tsx` (a 4th guide-specific
  wrapper, following the existing `GuideHeroPanel` precedent) — reuses
  `CompoundHero`/`ModuleHero`'s exact pattern (real geometry when authored,
  the honest "orbital field" fallback otherwise). Inserted into all 6 SEO
  guide pages, which previously had a rich top hero but zero illustration
  anywhere in the body.
- Deferred (documented, needs a homepage-specific design conversation, not
  a mechanical fix): `HomeDescent`'s flat Act0/Act4 bookends, the
  3-stacked-hero-moments homepage investigation, the repeated `/nico`/
  `/library` CTA count.

**Workstream 3 — data-viz integrity + accessibility.** Fixed a confirmed
`CLAUDE.md` rule violation (every visualization needs a text/table
fallback) on the two standalone synergy-network components
(`SynergyNetworkGraph.tsx` on `/pathways`, `SynergyNetworkVisual.tsx` in
`EmergentEffectsView`'s "Emergent" tab — `StackNetworkGraph.tsx` was already
correctly data-driven and is untouched):
- Both previously surfaced edge/mechanism data only on mouse hover, with no
  non-hover fallback. Added an always-visible table below each (compound
  A/B, strength, mechanism), following `ConnectionMatrix.tsx`'s established
  idiom (`scroll-region` wrapper, `sr-only` caption, `scope="col"` headers).
- Both now read their "why" text through `lib/hero-network.ts`'s
  `getEdgeExplanation()` — the same never-fabricating resolver already live
  on compound deep-dives — instead of locally hand-authored prose, closing
  a real drift risk between 3 previously-independent synergy datasets.
- Fixed a real id typo along the way: `SynergyNetworkVisual.tsx`'s node
  `'ca-akg'` → `'cakg'` (the id used everywhere else in the codebase) — the
  old id silently broke any id-based lookup against that node.
- **Verified finding, not a bug**: `getEdgeExplanation()`'s highest-priority
  tier is an authored multi-compound "emergent effect" writeup. Where 3
  compounds share one such writeup (confirmed 2 clusters:
  NMN/Resveratrol/Ca-AKG and GlyNAC/Sulforaphane/R-ALA), all 3 pairwise
  sub-edges correctly show the same broader text — accurate, not
  fabricated, just less pair-specific than the original hand-authored notes
  for those 6 of 23 edges. Authoring narrower `SYNERGY_MECHANISMS` entries
  for those specific pairs is a content decision, not a mechanical fix —
  left as a deferred content-backlog item, not blocking.

**Verification**: `npm run lint`/`typecheck`/`test` clean at every commit
(41 files / 571 tests). Full clean rebuild (`rm -rf .next && npm run
build`) succeeded with no errors or warnings. Manual SSR HTML checks against
the real build output (not just typecheck): exactly one `<h1>` on every
changed route (no duplicate-heading regression from stacking hero
components); the SSR-bailout marker count unchanged from Phase 1's fix (no
regression); `CinematicHubHero`/`HallmarkPageHero` content confirmed present
in the raw server-rendered HTML; the `/pathways` fallback table confirmed
server-rendered with real, non-empty mechanism text (23 rows, 19 unique
texts).

## Done

- **Self-install.** `CLAUDE.md` now carries the initiative's operating rules
  (appended below the existing `@AGENTS.md` include). This file created.
- **Merged fresh `origin/main`** (9 commits, incl. the 27→81 compound
  promotion) into the working branch and reconciled all 6 conflicts — see
  Decisions log. Merge commit `9ba659a`.
- **Found and fixed 2 genuinely wrong PMIDs during reconciliation** (not
  hypothesized — verified via PubMed and corrected at both the MDX source and
  `lib/data.ts`, keeping them in sync per `promoted-compounds.test.ts`'s
  verbatim-tracing guard, which caught the divergence):
  - `niacin.mdx`/`lib/data.ts`: PMID `1105674` (claimed as "CDP 1975") was
    actually an unrelated 1975 cancer-philanthropy dedication. Corrected to
    PMID `2044644` (Berge & Canner 1991, the real CDP niacin-arm paper;
    N corrected to the verified 3,908 niacin+placebo, not 8,341).
  - `milk-thistle.mdx`/`lib/data.ts`: PMID `2769569` (claimed as "Ferenci
    1989") was actually an unrelated 1989 rat-melatonin study. Corrected to
    PMID `2671116` (the real Ferenci 1989 silymarin-cirrhosis RCT).
  - Also fixed `l-carnosine`'s citation with a literal `year: 0` data bug
    (PMID 31987255 is real; the year field was just wrong — corrected to 2019).
- **Recalibrated two of my own new guardrails** against the tripled dataset
  (these were calibrated for 27 structured compounds; the merge brought 81):
  `citation-freshness.test.ts`'s `STALE_CITATION_BUDGET` 3→20 and its
  implausible-year floor 1990→1970 (both changes are honest recalibrations to
  real data, not loosened to hide a problem — see that file's comments).
  `synergy-coverage.test.ts`'s floor took upstream's stronger value (51,
  full coverage) over my partial 18.
- **Wired 35 more compounds into `lib/cross-links.ts`** — upstream's 35-compound
  expansion (PR #107) hadn't been wired into the prose cross-linker; my own
  `cross-links.test.ts` coverage guard (added earlier this session) caught the
  gap immediately after merging.
- **Phase 0 audit — every master-prompt claim verified against source**, not
  assumed. Summary (full detail was in the planning transcript; re-derive from
  source if it matters, don't trust old prose to stay accurate):
  - **SSR/CSR bailout bug: CONFIRMED, and far worse than hypothesized** — not
    2 pages, ~90% of prerendered routes (~175/195). Root cause:
    `components/os/ContextBar.tsx` calls `useSearchParams()` with no local
    `<Suspense>` boundary; mounted unwrapped in
    `components/layouts/SubPageLayout.tsx`, which backs nearly every hub
    layout. The hypothesized cause (a provider reading `localStorage` during
    render) was traced exhaustively and is **not** the issue — every such
    access in the codebase is properly isolated in `useEffect`/guards.
  - `middleware.ts` vs `proxy.ts` claim: **false**, `middleware.ts` still exists.
  - Repo name: confirmed `tvsnic0419/tnic-longevity-new`.
  - "27→81 graded compounds": **true**, landed in `origin/main` (PR #113,
    commit `9654dfe`) concurrently with this audit. Full library is now 100
    compounds (up from 65, from 55).
  - Hub-page metadata inheritance bug, sitewide-duplicated JSON-LD: **both
    refuted** on direct inspection of multiple page types.
  - Nav "Compounds" vs "Library": **confirmed real redundancy** —
    `/library/compounds` duplicates the `CompoundExplorer` section already on
    `/library`. Nav "Engine" vs "Tools": **not** redundant — deliberately
    isolated datasets by design.
  - Tier-color-as-stoplight (red=danger): **refuted**, no tier renders red/rose
    anywhere. Real tier-color bugs found instead: `EvidenceBadge.tsx` (a
    second badge implementation) maps Tier C to violet, not canonical amber;
    `HomeDescent.tsx` (homepage) uses its own non-canonical palette mismatching
    canonical on all three tiers.
  - Reduced motion: strong sitewide coverage; one real gap
    (`.animate-pulse-glow` in `app/globals.css`, unguarded, used on homepage
    hero's NICO badge).
  - Keyboard focus: no real gap on the draggable hero canvases (deliberately
    non-focusable, correctly so); one minor design-token nit on the age-slider's
    focus color.
  - Three hardcoded `"14" compounds` literals found stale against the live
    count: `lib/presets.ts:34`, `lib/data.ts:1183`, `lib/data.ts:1663`.
  - Real same-page/cross-page stat contradictions: `/library`'s
    `CompoundExplorer` tier pills (full-library count) sit directly above the
    sitewide `Footer`'s different, smaller tier counts (structured-subset),
    with no label distinguishing the populations. `/library` and `/insights`
    both say "Graded compounds" for two different numbers.
  - `NOTES-COMPOUND-LIBRARY.md` and `lib/compound-coverage.test.ts`'s own
    prose are stale (still say "55") though the test's enforced constant is live.
  - Compound Intelligence Matrix (`components/library/CompoundIntelligenceMatrix.tsx`,
    landed via PR #105, concurrently with this audit) is server-rendered and
    already covers identity/tier/RCT-flag/study-count/PubMed-link on every
    deep-dive — a real head start on the evidence-module completeness bar.
  - `/trust/methodology` is substantial, specific, well-organized content —
    not a thin page needing a rewrite.
  - No axe-core/jest-axe tooling installed; `playwright-core` is present
    (usable for a manual pass, not automated/CI-gated).

## In progress / next (this pass)

1. ~~Merge fresh `origin/main`...~~ **DONE** — merge commit `9ba659a`,
   reconciliation commit `c9d348e`. PR #114 (draft) open.
2. ~~Fix the Suspense/SSR bailout bug~~ **DONE** — commit `95a805e`. Verified
   against the real build output, not just typecheck: swept all 238 built HTML
   routes for the `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker's position. 0 of
   238 now show the old symptom (marker in the first ~2KB with nothing else in
   the file). Real content confirmed present throughout (e.g. 68 mentions of
   "glutathione" spanning a full compound deep-dive). Remaining markers are
   correctly narrow-scoped: the one `ContextBar` aside, plus the legitimately
   unavoidable client-only toast-notification region.
3. ~~Fix the three hardcoded "14" literals...~~ **DONE** — commit `3f76feb`.
   `/insights` turned out already fixed upstream (PR #112 rescoped it with
   proper population labels — re-verified, no action needed there). Footer's
   tier counts now labeled "stack-buildable" so they don't silently disagree
   with `/library`'s full-set tier pills on the same page. Two items from the
   original 3 hardcoded literals were reclassified on closer read: the
   `SynergyNetworkGraph` "14" is correct (describes its own fixed 14-node
   diagram, not the library) and `lib/next-up.ts`'s "Sprint 40/41... 14
   compounds" entries are a genuine historical sprint changelog — left both
   alone; rewriting either would misrepresent, not correct.
4. ~~Consolidate tier colors...~~ **DONE** — commit `7bbb7d4`. Both confirmed
   still live post-merge (upstream's own tier-color unification pass didn't
   reach these two files). `EvidenceBadge.tsx`: swapped Mechanistic↔Personal
   so Tier-C-derived badges show canonical amber, not violet (safe — the only
   place all 5 colors render together, `EvidenceBadgeLegend`, is orphaned).
   `HomeDescent.tsx`: repointed its two tier-color expressions from a local
   non-canonical palette to the real `--accent-*` tokens. Left its separate
   `TIER` object (synergy-edge confidence: established/mechanistic/
   exploratory/caution) alone — different axis, not a tier-grade color.
5. ~~Guard `.animate-pulse-glow` for reduced motion.~~ **DONE** — extended
   the existing `prefers-reduced-motion` block in `app/globals.css` to also
   cover `.animate-pulse-glow`, `.animate-breathe`, `.animate-gradient` (found
   two more instances of the identical gap while checking neighboring
   `@keyframes` — same fix, same pass).
6. ~~Resolve the Compounds/Library nav redundancy.~~ **DONE** — removed the
   standalone "Compounds" nav entry from `lib/nav-data.ts` (both `navLinks`
   and `navGroups.Learn`); the route itself stays (load-bearing for every
   `/library/compounds/<slug>` deep-dive), it's just not double-billed
   alongside the `CompoundExplorer` section already on `/library`.
7. ~~a11y: manual pass~~ **DONE, with real tooling this time** — added
   `axe-core` as a devDependency (`playwright-core` was already present for
   the Chromium binary) and ran a WCAG 2.1 A/AA + best-practice sweep against
   a genuine production build (`next build` + `next start`) on 5 representative
   pages (`/`, a compound deep-dive, a hallmark page, `/trust/methodology`,
   `/stacks`). Found and fixed 3 real violations, all at shared components so
   the fix applies sitewide, not just to the sampled pages:
   - `scrollable-region-focusable` + `landmark-unique` on every MDX-rendered
     data table (`components/library/MdxRenderer.tsx`): the horizontally
     -scrolling table wrapper wasn't keyboard-focusable, and every table
     shared the identical generic `aria-label="Data table"`. Fixed by adding
     `tabIndex={0}` and deriving a per-table label from that table's own
     header row.
   - `heading-order` on hallmark pages (`components/library/InterventionExplorer.tsx`):
     each intervention row's title was an `<h4>`, but a hallmark page's MDX
     body only ever emits up to `<h2>` — so the DOM heading sequence skipped
     `<h3>` entirely. Changed to `<h3>`; confirmed no other heading on the
     page depends on the old level, and confirmed the component's other call
     site (`AntiAgingLibrary.tsx`) already precedes it with an `<h3>` of its
     own, so this is a sibling relationship, not a new skip.
   - Re-ran the sweep against a genuinely clean rebuild after both fixes:
     **0 violations across all 5 pages.**
   - **A red herring worth recording**, in case a future session hits the
     same shape of bug: mid-investigation, 2 of the 5 pages appeared to show
     `region`/`skip-link` violations caused by a `ChunkLoadError` for a chunk
     file (`1panoj_-juawn.js`) that didn't exist in the build output, sending
     the page to its client-side `ErrorBoundary` fallback instead of real
     content. This looked like a genuine, deterministic site bug — it
     reproduced identically across what appeared to be two separate builds.
     Root cause, once found: a `next start` process from an *earlier* build
     cycle never actually died between test runs; deleting and rebuilding
     `.next` out from under it (`rm -rf .next && npm run build`) left the
     still-running old process holding its old, now-stale in-memory chunk
     manifest, so any client request for that build's chunk names 500'd
     against the new file layout. A later `npm run start` attempt correctly
     failed with `EADDRINUSE` — that was the tell. Killed the stale process,
     confirmed via `ps` that the new one's start time was after the rebuild,
     re-ran the sweep: the `ChunkLoadError` and both violations were gone.
     **Not a production bug** — Vercel deploys don't have this "rebuild under
     a live local dev server" failure mode — but a real trap for local
     verification: always confirm the serving process's PID/start-time
     postdates your last build before trusting a local repro.

## Explicitly deferred (future sessions, not this pass)

- Full evidence-module field-by-field audit beyond the Compound Intelligence
  Matrix spot-check.
- Broader visual-system/homepage/page-template refinement (Sections 7–11 of
  the operating rules, beyond what Phase 0 already found).
- The sponsor-offer/audience-proof business decision — **Thomas's call**, not
  to be acted on unilaterally.
- The future research chatbot — don't start speculatively.

## Decisions log

- **Branch strategy**: continuing on the existing session-designated branch
  (`claude/content-upgrades-interlinking-gc1w40`) rather than adopting the
  master prompt's `redesign/phase-N-*` naming convention *for this pass*. The
  harness-level branch instruction for this session is explicit
  ("never push to a different branch without explicit permission"), and
  `main` is moving fast with multiple concurrent sessions — introducing a new
  branch name mid-stream adds coordination risk without a clear benefit right
  now. Revisit the `redesign/phase-N` convention once this pass merges to `main`.
- **Compound backfill**: an earlier sub-task this session (before the redesign
  master prompt arrived) had deliberately *deferred* promoting library-only
  compounds into the structured/graded set, per an explicit user decision at
  the time. That decision has since been **overtaken by events** — a
  different, concurrent session already did the backfill at scale (27→81,
  PR #113). Noted here so nobody re-litigates a decision that's moot.
- **Pathway-rail duplication**: this session had independently built a
  hallmark→pathway rail (`getPathwaysForHallmark` in `lib/pathways.ts`,
  a `pathways` prop on `HallmarkDetail.tsx`) before discovering upstream
  (PR #109) had already shipped the same feature under different, more
  careful naming (`getMolecularPathwaysForHallmark`, chosen specifically to
  avoid colliding with an unrelated same-named function in
  `lib/relations.ts`). Resolution: **drop the local duplicate, keep
  upstream's.** The hallmark→guide rail (`getGuidesForHallmark`) from the
  same local work is *not* duplicated upstream — that one is kept.
- **a11y tooling**: not fabricating a "clean axe-core re-run" claim without
  the tooling installed. If a future session wants this automated, add
  `@axe-core/playwright` as a devDependency (repo already has `playwright-core`
  for the Chromium binary).

## Open questions for Thomas

*(none blocking right now)*
