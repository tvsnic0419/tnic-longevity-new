# TNiC Redesign Initiative — Progress

*Read this first, every session on this initiative. Don't re-read the full
master prompt — its durable operating rules are already merged into
`CLAUDE.md`. This file is the state.*

## 2026-09-17 (second pass) — the tap-target backlog, and what the molecule was claiming

Owner asked to keep advancing the UI's ambience and aesthetic. Two things were
already measured and waiting, and both turned out to be single root causes
rather than long lists.

**102 sub-24px controls, one cause.** The previous pass widened `audit:ui` from
11 routes to 29 and surfaced 102 actionable controls under the 24px floor,
reported but not gated: `/protocols` 48, `/insights` 24, `/products` 20,
`/dashboard` 8, `/trust/methodology` 2. Every one of them was a standalone
action link or chip with no control floor — the exact case `.action-link`
(STYLE_GUIDE §13) exists for. Eight components, one class each; no new CSS.

The `/insights` twelve were worse than short: the connection matrix's column
headers measured 16x20 — under the floor in *both* axes — and their only
accessible name was the visible text "01". `title` is a tooltip, not a name a
screen reader or a voice-control user can act on. They are now square targets
carrying the hallmark's real name in sr-only text.

Re-measured after: **102 → 0**, with 0 axe violations and 0 sub-11px text
across all 29 routes at both widths. All five routes folded into `GATED`, so
the gate now covers every route the sweep visits.

**The molecular artwork was making a chemical claim it could not support.**
`MoleculeStage` printed the literal string `OH` inside every oxygen, in every
structure, unconditionally. Measured against the shipped geometry: **242 of the
oxygens so captioned are not hydroxyls** — carbonyls, ethers, esters, phosphate
oxygens — across 79 of the 81 oxygen-bearing structures. CoQ10 and berberine
have no hydroxyl at all and every one of their oxygens said `OH`.

These structures are heavy-atom only, so nothing in the data separates a
hydroxyl from a deprotonated oxygen without asserting a protonation state the
geometry does not record. The label now stops at the element symbol, which is
what the data says — and says more than `OH` did, since N, S, P, Se and Co were
previously distinguishable only by sphere colour. Symbols are placed in their
own pass, nearest atom first, and one that would overlap a placed symbol is
dropped rather than smudged over it (the collision that made phone renders
unreadable). `heteroatomSummary()` carries the tally as text.

**And the camera was one camera for 87 different molecules.** Origin-centred,
`min(w,h)/7.2` units-to-pixels, eye a fixed 6 units back. Measured over a
sampled sphere of orientations against a 419px stage, **all 87 project past the
half-extent they have to fit in** at some point in their own rotation —
resveratrol to 384px against 210px, pterostilbene to 428px. The long molecules
were being cut off, and had been for as long as they shipped.

`cameraFit()` derives the centroid (a structure averaging 0.94 units off-origin
was orbiting a point outside itself), an eye distance proportional to the
structure's radius (near-side magnification ranged 2.2×–5.5× across the set; it
now holds within 0.6), and the worst-case projected radius sampled across
orientations. Sphere radii, bond widths and the double-bond offset are now per
geometry unit rather than per pixel, so a phone renders a smaller drawing
instead of a cruder one. The atom pass was also painting back-to-front
inverted — the bond pass in the same function always sorted the other way.

`components/viz/molecule-camera.test.ts` sweeps every structure at a finer
resolution than the fit itself. The guard was checked against the old camera
before being trusted: it fails for 87 of 87 there, passes for 87 of 87 now.

**Smaller, same pass.** The stage affordance line said "drag · scroll to zoom"
on every device; the touch handlers cover a one-finger drag only, so half that
sentence named a gesture a phone does not have. Both phrasings ship and CSS
picks by `(pointer: coarse)` — no JS, no hydration mismatch. The hint also sat
4px from the instrument frame's bottom-right registration bracket and read as
clipped; it now sits inside the frame.

**Checks.** `tsc --noEmit` clean · `eslint` clean · `vitest run` 73 files /
797 tests pass (790 + 7 new) · `next build` clean · `audit:ui` 0 axe / 0
actionable / 0 micro-type across 29 routes × 2 viewports.

**Rollback.** Revert the PR's merge commit, or `git revert <sha>` on the single
commit. Nothing in this pass touches data, routing or content.

## 2026-09-17 — A duplicate stylesheet was silently reverting shipped fixes

Owner asked for the next 10 most significant UI upgrades against a much
larger, aspirational brief (a full "quality up-convert" spanning IA,
evidence UX, interlinking, homepage restructuring). Scope was too large to
deliver in full in the time available; what follows is the honest partial
delivery, tracked as PR #218, plus a base-branch CI fix (#219, merged).

**The structural finding.** `components/ui/FlagshipFoundation.module.css`
held a second copy of the hub-hero, context-bar and decision-switchboard
systems — 51 of its 53 `:global()` selectors were also defined in
`app/globals.css`, with different values. A CSS Module's output loads after
`globals.css`, so the module copy silently won every conflict. This had
already reverted PR #215's `.research-hero__stat-label` wrap fix in
production (verified, merged, never took effect — stat labels kept
truncating on nine hub routes) and was rendering the decision-switchboard
CTA clipped. Removed the duplication; `globals.css` is now the single
definition. Verified by diffing computed styles across 12 page/viewport
combinations.

**A mistake, and the gate that caught it.** The dedup compared which
selectors the two files shared, not which declarations. `.context-bar__crumb-link`
existed in both, but the module alone carried `min-height: 1.5rem` — the
24px control floor. Removing it dropped 17 controls under the floor;
`audit:ui` caught it against budget 0. Fixed by restoring the three
missing declarations to `globals.css`. Selector overlap is not declaration
overlap.

**Guardrail strengthened, not weakened.** `lib/site-integrity.test.ts` had
asserted the module *contained* the duplicates — pinning a location, not
the contract its own header states ("shared, token-driven, not
component-local"). Rewritten to enforce single-definition: no selector may
exist in both files. Verified the new guard fails when a duplicate is
reintroduced and names the offending selector.

**The audit was measuring 11 of 230 routes.** `audit:ui`'s `PAGES` list
covered only library/trust routes — every other template was unaudited,
which is why the duplicate-stylesheet fallout went unreported. Widened to
29 routes, one per template. This surfaced 102 pre-existing sub-24px tap
targets (concentrated in `/protocols`, `/insights`, `/products`,
`/dashboard`, `/trust/methodology`) and two `heading-order` violations
(`/trust/methodology`, `/about` — both `h1` straight to `h3`, fixed).
The 102 are reported, not gated — the existing 11 routes stay gated at
budget 0 so widening coverage could not quietly loosen the bar. Also fixed
a flaky-gate cause: `axe` ran with no settle time and was catching
scroll-reveal elements mid-fade (two nodes measured at ~50% opacity,
0 once settled); the sweep now lets reveals land before measuring.

**Unrelated base-branch breakage, found and fixed in passing.** `main`
moved 4 commits during this work (Amplitude analytics wiring, nav
unification). One of those commits added `@amplitude/unified` to
`package.json` without regenerating `package-lock.json`, breaking `npm ci`
— and therefore CI — for every PR against `main`, not just this one. Filed
as standalone PR #219, verified, merged. Ported into this branch too so
its own CI didn't have to wait; the second `main` merge afterward produced
a byte-identical no-op lockfile diff, confirming both regenerations agreed.

**Verified, final state:** `npm ci` succeeds from clean, typecheck clean,
lint 0, 790/790 tests, build ok, `audit:ui` exit 0 with 0 axe violations
(0 gated / 102 reported on tap targets), `audit:routes` 230 routes 0 fail
0 warn.

**Not done, stated plainly:** the 102 reported tap-target controls, a
molecule atom-label collision at 390px on compound pages, and
`HallmarkCoverageAtlas`'s `truncate` class rendering correctly only by
accident (computed `white-space` is `normal` despite the class — a latent
trap, not touched). None of the larger brief's IA/homepage/evidence-UX
scope was attempted this pass.

## 2026-09-16 — PR queue cleared: two merged, three closed, two measured empty

The owner asked for the open work to be identified, merged if good, and old
bad work archived. Six PRs were open. Outcome, with the reasoning, so none of
this gets re-litigated from scratch:

**Merged.**
- **#212** — lit ground, elevated plane, editorial measure. Independently
  re-verified before merge (typecheck, lint, 784 tests, build, `audit:ui`
  exit 0), not merged on its own say-so.
- **#215** — the ten measured defects, the landing page, the hero. Reconciled
  onto #212 rather than merged past it; four collisions, resolved to the
  better fix each time. See the merge commit for which side won and why.
- **#213** — Bio Bible folio + Stripe gate. Brought up from a much older base,
  then the money paths were exercised directly rather than taken on trust:
  folio renders inert (zero Stripe links) with the env unset; the delivery
  gate refuses on no session, on `../../etc/passwd`, and on a plausible-but-
  fake `cs_test_…`; the gate is `noindex, nofollow`. It sells nothing until
  `NEXT_PUBLIC_BIO_BIBLE_PRICE` and `NEXT_PUBLIC_BIO_BIBLE_PAYMENT_URL` are
  set, and the monograph file still does not exist. Both remain owner
  decisions; merging did not make them.

**Closed.**
- **#179** (Whop Bio Bible) — Vercel red since 2026-09-08, four files missing
  including the product. Superseded by #213, which solves the content problem
  by extraction-with-provenance rather than by authoring 40 cards.
- **#214** (workbench prototype) — see below.
- **#209** (site-wide 5× depth) — see below.

### The two that were closed on measurement, not taste

Both were closed with a reason, then the reason was checked against the
rendered site rather than asserted. Recording the numbers because "we already
have that" is exactly the claim a future session should be able to re-test.

**#214 duplicated the library into `public/`.** `app.js` inlined tiers, doses,
study counts and mechanism summaries as literals. The GlyNAC dose matched
`glynac.mdx` *on the day it was written* — which is the failure mode, not the
defence, since nothing linked them. It also graded **hallmarks** "Tier A" /
"Tier B"; `lib/hallmarks-library.ts` has no tier field and should not, because
A–C grades human evidence for a compound, not an aging mechanism. And `public/`
is outside every guard here: not in the 229 routes `audit:routes` walks, not
measured by `audit:ui`, no typecheck, no tests, no interlink coverage.

Its five ideas were then checked against the app, and all five already exist
registry-backed:

| Prototype idea | Real route | Coverage |
|---|---|---|
| Compound search + filters | `/library` | **100** compound links (prototype: 6) |
| Systems map | `/hallmarks` | **12** hallmarks (prototype: 6) |
| Comparison matrix | `/library/compare/head-to-head` | whole graded set |
| Protocol builder | `/stacks` | whole graded set |
| Full evidence table | `/library/evidence` | **100** rows |

So there was nothing to rebuild. The only unique contribution was its layouts,
and those arrive attached to the data duplication.

**#209's remaining goal was already met.** Its three open items were the
HomeDescent CTA hierarchy (landed in #215 — first phone CTA moved y=1142 →
y=524), and two sets of class hooks for CSS that only exists on its own branch.
Its substantive claim was equal-height cards, so that was measured on current
`main` at 1440×900, grouping every card by row and reporting any row whose
heights differ by more than 2px:

```
HOME elite cards    []
HOME hallmark cards []
TOOLS cards         []
```

Zero mismatches. The grids plus #212 and #215 got there independently. What
remained was 948 lines of unverified CSS (`instrument-depth.css`,
`instrument-symmetry.css`, `elite-library-hallmarks-depth.css`) plus edits to
six components that #212 and #215 had just rewritten — porting it would have
undone verified work to solve a problem that no longer reproduces.

**If either is revisited:** both branches still exist
(`feat/tnic-intelligence-workbench`, `ui/first-screen-tools-premium`). Nothing
was deleted.

**Rollback for this pass:** `main` went `4713870` → `2ffda04` (#212) →
`92b2658` (#215) → `294c363` (#213). Revert any one independently, or redeploy
the Vercel deployment for the SHA below the one you want gone.

## 2026-09-16 — Ten UI upgrades, chosen by measuring rather than reading

**The question asked:** identify and ship the ten highest-value UI upgrades.

**How they were chosen.** Baseline first, on a real production build served
locally: `audit:ui` (axe + layout + tap targets, 11 routes × 2 viewports),
`audit:routes` (229 routes), `audit:perf`, the 784-test suite, then screenshots
of the homepage, `/library`, `/library/evidence` and `/library/compounds/nmn` at
1440×900 and 390×844. Everything below is a defect that measurement produced.
Nothing here is a preference.

Baseline: 784 tests green, routes 0 fail / 0 warn, perf within budget — and
`audit:ui` **exiting non-zero**, with 2 axe violations.

### The credibility one

**1 · The homepage instrument contradicted the library, and said so only to
screen readers.** `.tnic-intel` rendered a dial reading *100 graded compounds*
with *Tier A 4 · B 4 · C 0* directly beneath it. Those counts were
`eliteTierCounts` — the Elite Eight — and "elite" appeared nowhere in rendered
text, only in an `aria-label`. `/library` and `/library/evidence` both publish
**10 · 71 · 19** from `evidenceIndexStats()`. Two numbers under one label, on
the site whose entire proposition is that its numbers trace.

Fixed at the root rather than by relabelling: the row now shows the
library-wide split — the population the dial actually headlines, from the same
`evidenceIndexStats()` both other surfaces read — under a visible
`EVIDENCE MIX · ALL 100 GRADED` caption, and links to `/library/evidence`
instead of the methodology page. The elite set keeps its own count in the
metrics row above. The split is computed in `app/page.tsx` (server) and passed
as `libraryTiers`, not imported into the client bundle: `lib/evidence-index`
pulls `compoundModules`, `hallmarks-library`, `tnic-score` and `entity-graph`
behind it, and `lib/derived-stats` already says to prefer props here. Cost
measured at +3KB JS on the homepage.

Written up as STYLE_GUIDE §22.1, because the rule generalises: an `aria-label`
is not a substitute for a visible population label — it hands screen-reader
users the truth and leaves everyone else with the contradiction.

### The mobile ones

**2 · Sixteen hubs hid their data figure from every phone.**
`.research-hero__figure { display: none }` below 1024px is correct for what the
column originally held — the decorative molecular field. Since #189 a hub can
pass a real derived figure, and sixteen now do (`/library`, `/library/evidence`,
`/library/trials`, `/trust`, `/stacks`, `/hallmarks`, `/pathways`, `/peptides`,
`/protocols`, `/products`, `/tools`, `/learn`, `/insights`, `/compound-engine`,
`/supplement-guides`, `/stacks/lab`). The same rule was withholding the most
credibility-bearing number on each of them from every mobile reader. A
`--data` modifier now splits atmosphere from data: data renders at every width,
ordered between the copy and the stat rail. Verified on `/library` (Evidence
split, 100 graded) and `/library/trials` (363 study rows, 264 human).

**3 · The homepage dial was illegible on a phone.** At ≤900px the radar was
given a 132px column against a 240-unit viewBox, so its 11px cardinal labels
rendered at ~6px — under the type scale's own floor by nearly half, and
visibly garbled in a 390px screenshot. `audit:ui`'s micro-type probe excludes
SVG by design, so nothing caught it. The panel now stacks: the radar gets a
240px column and the three metric tiles get the full width, which also
uncramps them.

**After the #212 merge** the labels are HTML rather than SVG `<text>`, so they
hold 11px at any dial size and the stacking is no longer what rescues them.
It still earns its place: #212's own compact layout hid the cardinals below
900px because a 132px dial has no room for a label ring, and stacking gives
the dial 240px with the full ring padding intact — so the labels stay visible
on a phone instead of being dropped. Hiding real information from the majority
of traffic was a cost of the compact layout, not a goal.

**4 · Hero stat labels truncated instead of wrapping.** `white-space: nowrap` +
ellipsis on `.research-hero__stat-label`: at 390px "Hallmarks of aging" needed
135px in a 130px cell and rendered as `HALLMARKS OF AGI…`. A rail whose job is
to name what a number counts cannot cut the name off.

### The accessibility ones

**5 · The tap-target gate was failing.** `audit:ui` exits non-zero on any
actionable control under 24px, budget 0. "Full ranking" in
`HomeInstrumentStrip` rendered 87×20. Given `.action-link`, the documented
control floor. Gate now exits 0.

**6 · `role="listitem"` on `<a>` elements** (axe, both viewports). The homepage
instrument's grade tiles were links carrying a role they cannot take, inside a
`div role="list"` — the list semantics the author intended did not exist. Now a
real `<ul>`/`<li>` with the link inside.

**7 · The scroll reveal fades text through sub-AA contrast — and parks there.**
This is the one worth reading twice. `animation-timeline: view()` does not play
an animation, it **scrubs** one: a section the reader stops on mid-range holds
that opacity indefinitely. Fading from 0 is therefore not a 400ms transient, it
is text at arbitrary partial opacity while being read. Measured on
`/library/mitochondrial-dysfunction`: walk-card kickers composited to `#73529d`
(3.23:1) and `#208163` (4.13:1), from tokens that are 7.4:1 and 10.2:1 at full
strength. The audit's header warns that below-the-fold contrast hits can be
mid-fade false positives; this one is not, because the fade does not finish on
its own. Scrubbed reveals now use `section-reveal-scrubbed`, floored at
`opacity: 0.78` (worst case worked back from the violet accent, which holds
4.5:1 to ~0.75). The 40px rise — the half of the gesture that actually reads —
is untouched. Time-based reveals keep fading from 0: they self-complete.

### The craft and symmetry ones

**8 · The radar's cardinal labels had ticks drawn through them.** The four
emphasised ticks span r=92..102; NAD+, mTOR, AMPK and NRF2 sat at r=98, dead
centre of that band. This pass first fixed it by padding the viewBox 18 units
per side so the labels could move out past the band.

**Superseded on merge.** PR #212, developed in parallel, fixed the same defect
by lifting the cardinals out of the SVG entirely — HTML spans absolutely
positioned in a 30px ring padding on `.tnic-intel-radar`. That is the better
primitive and #212 merged first, so it won: HTML text holds `--type-11` at
every container size, where SVG `<text>` scales with the viewBox and was the
reason the same labels rendered at ~6px on a phone (see item 3). The viewBox
padding was reverted to `0 0 240 240` on merge, because it existed only to
make room for `<text>` nodes that no longer exist and would otherwise shrink
the dial inside the ring #212 built for it.

**9 · `HubSplitInstrument` had its hierarchy inverted.** The count is the
figure's whole payload and was its smallest, faintest element: 11px muted mono
against a 14px semibold coloured label. Promoted to value type at full
contrast, with each row's share of the whole beside it so the bar length has a
number. Applies across all sixteen hubs.

**10 · Symmetry, on both hero compositions.**
- *Homepage.* The instrument column was a free `0.85fr` measuring 499px while
  `.tnic-intel` is 420px pinned to its end — 79px of dead air on the **inner**
  side, so the gap the reader saw was 143px, not the 64px the gap declares.
  Track capped at the panel width; the declared gap is now the real one and the
  copy takes the width back. The H1 still breaks in three lines; the badge row
  gained a line back.
- *Hub heroes.* Measured on `/library` at 1440×900: copy column 501px, panel
  333px, centred — 168px of visible imbalance, the panel reading as a small
  card floating beside a tall column. Data panels now stretch, with the flex
  chain carried through to the instrument, which was always written as
  `h-full` + `justify-between` and had simply never been given a height to
  fill. The decorative field is excluded and keeps `center`: it is a fixed 4/3
  canvas and stretching it distorts the artwork.

**Verified (after):** 784 tests green · lint 0 · typecheck clean · build ok ·
`audit:ui` **exit 0, axe violations 0 on all 22 page/viewport combinations**
(was 2), actionable sub-24px controls 0 (was 2), HTML text under 11px 0 ·
`audit:routes` 229 routes, 0 fail 0 warn · `audit:perf` all pages within
budget (homepage JS 874→877KB, CLS 0.049→0.052, gate 0.1).

**Not done, deliberately.** `/library/evidence` reports 215 sub-24px targets at
desktop and 140 at phone — all non-actionable (table cell text, tier meter
bars), so the gate ignores them and so did this pass; worth a look only if the
table gets interactive cells. The `ambient-orb-2` overflow that every route
reports is contained by `.ambient-layer`'s `overflow: hidden` + `contain:
layout paint` and causes no page scroll; it is audit noise, not a defect.

**Rollback:** revert the commits on `claude/top-10-ui-upgrades-ti1p8x`, or
redeploy the Vercel deployment for `4713870`.

## 2026-09-15 — "The Longevity OS" as slogan: a method, not an app

**Refined same day, after the first pass shipped as "The Longevity Intelligence
OS".** The owner cut it to **"The Longevity OS"** and — more importantly — said
what it means:

> ready to market it, but not because of the lab push. Because they can come to
> the website and learn the operating system — the system of using the
> interventions, the system of knowing what the hallmarks are.

So **OS = method, not software.** Not an app a reader signs into; the system they
learn: tiers A–C on human evidence, the twelve hallmarks and which compounds act
on each, how a stack is assembled, which trial sits under a claim. That reframe
resolves the tension the earlier pass had to write around — the site is not
promising an unbuilt product, it is naming the one it already has.

Copy now carries the method reading rather than leaving it to inference. The hero
lead was rewritten (same length, same voice, same keywords) from "a free,
PubMed-backed library for understanding…" to "a free, PubMed-backed **system for
longevity decisions**: how the evidence is graded, what the 12 Hallmarks of Aging
are, and which trial sits under each compound." With the kicker reading "The
Longevity OS", a lead that says *library* leaves "OS" to be read as an app.

**Unresolved and deliberately not decided here — a name collision.**
`HomeOSComingSoon.tsx` uses "Longevity OS" for a personal cell-health WORKSPACE:
dashboard, stack simulation, private lab logs. That is a different product from
the method the slogan names, wearing the same name. Mounting that band as-is
would tell a reader the OS is something to log into — the exact reading the
slogan is written to avoid — and would market an unbuilt app. The workspace needs
its own name; it is a feature *inside* the Longevity OS, not the Longevity OS.
Recorded in that file, owner's call, still unmounted.

**Owner decision, verbatim in intent:** TNiC is and always was *Transformative
Nutrition in Cell-Health*. "Longevity Intelligence OS" has a ring to it, so it
becomes a **slogan** alongside the name — not a replacement for it.

This settles PR #200, which proposed retitling the homepage to "TNiC — Longevity
Intelligence OS" and rewriting the meta description. That PR was **not merged**:
it swapped the keyword-bearing `<title>` on a revenue-generating page for a
brand-only one, and by its own description it was a partial slice with follow-ups
still pending in the same branch. The good half of it — the credibility strip's
census framing — is carried here instead.

**Where the slogan lives now.** `SITE.slogan` is the single source; `SITE.tagline`
keeps the brand's actual meaning, and the two are documented as distinct so
neither gets used for the other.

- Hero kicker, above the H1 (which is untouched — it works, per §8)
- Footer brand paragraph
- Homepage meta description, leading, with every compound keyword kept
- Organization JSON-LD `slogan` — schema.org carries the property natively, so
  the positioning is machine-readable rather than rendered-copy-only

**What was deliberately NOT changed.** `HOME_TITLE` — the homepage `<title>` is
the highest-value SEO surface on the site and already carries the terms that earn
the traffic. The nav descriptor stays "Cell-Health Library": that is what TNiC
stands for, and the owner decision was explicit that the name's meaning is not
up for replacement.

**The 2026-07 reservation was narrowed, not lifted.** `HomeOSComingSoon.tsx`
records an owner direction that the Longevity OS name "should NOT be marketed
yet" — attached to an unmounted teaser for a personal workspace that does not
exist. The slogan names the evidence system that DOES exist (library, hallmark
and pathway graph, trial index); the product teaser stays unmounted. That
component's note now states both halves so a future session cannot read the old
directive as either stale or as permission to mount the band.

**Verified:** 766 tests · lint 0 errors · typecheck clean · build ok · homepage
`<title>` unchanged, H1 unchanged, slogan present in hero/footer/description/
JSON-LD, OS teaser absent from the rendered homepage.

## 2026-09-14 (ninth pass) — the Trial Index: the cited literature, as data

**The question asked:** identify and ship the highest-value content upgrade.

**What was actually there, counted rather than assumed.**

The top item under *Explicitly deferred* was the evidence-module field audit.
Running it structurally across all 100 deep-dives (H2 frequency, then table
shape) found the real gap, and it was not a missing section:

- **87 of 100 deep-dives carry an authored evidence table** — `Study | Design |
  N | Duration | Key outcomes | Tier`, in 17 header variants — totalling **363
  study rows, 301 of them PMID-cited**. Sample sizes, durations, populations and
  reported outcomes, all authored, all real.
- **None of it existed as data.** `/library/evidence` (#191) indexes the
  *compounds*; the literature behind them was reachable only by opening 87 pages
  one at a time. `lib/data.ts` is not a substitute: its 276 `StudyRef`s are
  title/journal/year/PMID only — no design, no N, no duration, no outcome.
- So the library could not answer the question it is best equipped to answer:
  which human trials, in whom, for how long, finding what.

**Shipped — `/library/trials`, the Trial Index.**

- **`lib/trial-index.ts`** — types, parser and classifiers, all pure. Maps the 17
  header shapes onto one schema; an unrecognised header is ignored rather than
  guessed into a field, so a new shape degrades to missing data, not wrong data.
  A column the source never had stays `null` and renders as an em-dash.
- **`lib/trial-index.server.ts`** — the `fs` half. Split out because the client
  table imports the types module, and a `fs` import anywhere in that graph fails
  the Turbopack client build (it did, once, exactly that way).
- **Nothing is authored.** Every cell is verbatim from the compound's own table.
  `lib/trial-index.test.ts` proves it rather than asserting it: for all 363 rows
  it re-reads the source `.mdx` and fails if any published string is not present
  in the file the row names. 17 tests total.
- **Two derived fields, both conservative.** `designClass` and `evidenceBase` sit
  *beside* the verbatim design text, never replacing it, and fall back to
  `unclassified`/`unclear` rather than guessing. A design naming both people and
  animals classifies as `mixed` — "multi-species + human association" is a real
  authored design and calling it human evidence would be the exact overclaim this
  library exists to avoid. Result: 264 human, 34 preclinical, 6 mixed, 59 not
  stated. The 59 are labelled, not quietly counted as human.
- **The gap is on the page.** The 11 compounds with no evidence table are named,
  linked and explained, not omitted — a gap you can see is a review queue.
- **`TrialHeroInstrument`**, not `LibraryHeroInstrument`: that one is bound to
  `evidenceIndexStats()` and would have put 100 graded *compounds* beside a
  headline counting 363 study *rows*, under a caption claiming it came from the
  cited literature. Same primitive, honest numbers. Human takes violet rather
  than the emerald that means Tier A — a human trial is not automatically strong
  evidence, and borrowing the tier palette would have said it was.

**Caught by the repo's own gates, not by eye.**

- `audit:ui` failed the tap-target budget: short compound links ("Zinc") measured
  23×24px against a budget of 0. Fixed by making the control genuinely 24px —
  not `.tap-expand-y`, whose own note warns against expanding a control whose
  neighbours sit within 44px, and these share a line with the PMID link.
- Turbopack failed the first build on `Can't resolve 'fs'`, which is what forced
  the pure/server split above. The split is better structure, so it stayed.

**Verified:** 766 tests (63 files) · lint 0 errors · typecheck clean · build ok ·
`audit:ui` 0 sub-24px controls, 0 text under 11px, no horizontal scroll at 390px ·
`audit:routes` 229 routes, 0 fail 0 warn · 363 `<tr>` present in the
server-rendered HTML (the rows are crawlable, not client-only).

**Still deferred:** the *field-by-field* half of the evidence-module audit — this
pass did the structural audit and shipped the extraction. Filling a genuinely
missing field on a specific compound still requires extraction from that
compound's own authored content, per `NOTES-COMPOUND-LIBRARY.md`, and is not
something to batch.

## 2026-09-13 (eighth pass) — geometry, the type ladder, and the entity graph

**The question asked:** evaluate and upgrade the UI; then, separately, finish
the typography and apply a platform-upgrade patch.

**What was actually wrong, measured rather than assumed.**

- `SectionProgress` appeared from `md` (768px), but the gutter it needs is
  `(100vw - 80rem)/2`, which is ZERO there. It overlapped page content at 16
  of 19 scroll positions at 1280px and 15 of 19 at 1366px — the two most
  common laptop widths — clipping Tier A badges by up to 178px. The seventh
  pass added a fade-at-top to this rail but left the breakpoint alone.
- The descent ran on its own column. The seventh pass had already capped
  `.tnic-act` at 80rem, but its uniform padding clamp still put content at
  160px on a 1440px viewport while every other section started at 104px.
- **138 font-size declarations bypassed the type scale, in 40 distinct
  spellings** — six ways to write ~11px, five for 13–14px, four for 15px.
  The scale was not missing; it was being routed around, because the t-shirt
  names had gaps at 13px and 15px and nobody wanted to round to the wrong one.
  Below the floor, 59 of those rendered HTML text between 4px and 10.5px, and
  on a PHONE they were smaller still (hub hero stat labels at 8.64px) — the
  device with the least reading comfort got the least legible type.
- **Six fluid sizes were each defined twice**, in `globals.css` AND
  `FlagshipFoundation.module.css`, for the same selectors, with both
  stylesheets loaded. Which won depended on CSS order, and the copies had
  already drifted in spelling (`.7rem` vs `0.7rem`).
- **21 routes carried under three in-body links** (counting inside `<main>`
  only — nav and footer link everywhere by construction and mask this).
  `/sirtuin-atlas` server-rendered 12,183 characters about SIRT1–SIRT7
  activators, naming eight compounds that each have a deep-dive, and linked
  to ZERO. `/pathways` printed "6 compounds · 3 hallmarks" on every card
  while `pathway.compoundSlugs` sat right there in the data.

**Shipped.**

- **One content column and a measured rail rule.** Rail: labelled ≥1700px,
  ticks-only ≥1500px, bottom strip below (the strip had stopped at `md`,
  leaving 768–1500px with an overlapping rail and no fallback). The seventh
  pass's fade-at-top is kept, with its breakpoint moved to match so the two
  cannot disagree. After: 0/19 overlaps at every width.
- **The type ladder, named by pixel size.** `--type-11` through `--type-48`,
  with the t-shirt names kept as aliases resolving to numeric rungs so no
  call site changes meaning. There is no judgement left in picking a rung.
  The six duplicated clamps are now single tokens — deliberately left as
  clamps rather than snapped onto the fixed ladder, because a hero title is
  tuned to its own line-breaks and forcing distinct heroes onto shared rungs
  would flatten them for tidiness rather than for a reason.
- **Analytic numeric typography.** 72 ad-hoc `tabular-nums` declarations were
  each setting their own size, weight and tracking. `.text-metric`,
  `.text-metric-lg`, `.text-data`, `.text-citation`. The comment records the
  distinction that matters: `.stat-value`/`.stat-value-hero` gradient-fill
  their glyphs, right for a figure meant to be looked at and wrong for one
  meant to be compared against the figure below it, because a gradient makes
  two numbers in a column different colours.
- **`lib/entity-graph.ts`** — one derived place to ask what an entity connects
  to across types. It invents nothing: an unresolvable id is dropped rather
  than turned into a link to a route that may not exist, and name matching is
  exact-slug-or-exact-title only (fuzzy matching is how "Quercetin /
  isoquercetin" ends up pointed at a page that is not about that thing).
- **`EntityChips`** — each chip carries its kind as a glyph AND an accent
  (never colour alone), and a compound chip carries its evidence tier,
  because a link to a Tier C compound and a link to a Tier A compound are not
  the same invitation.
- **`lib/page-connections.ts`** for pages no registry can reach. Clusters are
  DECLARED — a generated "related pages" block is exactly the
  random-links-everywhere failure it would be trying to fix — but siblings
  within a cluster are derived, so a page added to a cluster links itself
  from every other member.
- **Search routed through the knowledge graph.** The header box handed its
  query to `/library?q=`, which only searches compounds; it now opens the
  command palette pre-populated, which searches everything and labels each
  result with the kind of thing it is. All 19 pathways indexed, keyed on the
  pathway registry's own `aliases` field. `/library?q=` still works and still
  backs the WebSite SearchAction.

**Three new gates, so none of this drifts back.**

- `audit-ui.mjs` micro-type gate (budget 0). Replaces the old `minFont`
  probe, which its own docstring admitted was dominated by SVG.
- `audit-routes.mjs` dead-end gate, exempting routes with almost no body text
  (a redirect stub has nothing to link FROM, and failing it would just invite
  padding). The floor is deliberately low: it catches pages linking to
  NOTHING, not pages that could link to more.
- `lib/type-scale.test.ts` gates the ladder at the SOURCE, so a bypass fails
  the moment it is written, including in a component no audited page renders.

**Deliberately not done, and why.**

- Snapping the fluid display clamps onto the fixed ladder. See above.
- Raising SVG `<text>` to the 11px floor. Inside a scaled viewBox its computed
  size is in user units, not screen pixels, and these are molecular-diagram
  annotations whose size is set by the bond geometry. Their accessibility
  answer is the text fallback every visualization owes (CLAUDE.md §12).
- Repainting the site purple. The brief asked to preserve the existing
  palette; TNiC's is cyan/emerald/violet, and repainting would have
  contradicted the same instruction it came with.

**Measured.**

```
route audit        228 routes, fail 0, warn 0      (was 21 dead-end failures)
in-body links      /pathways 22 -> 64, /sirtuin-atlas 0 -> 23,
                   /stacks 3 -> 18, /labs 5 -> 18
rendered sizes     34 -> 27 distinct at 1440px, 33 -> 26 at 390px
raw font-sizes     138 -> 1 (the SVG exemption), gated by test
micro-type         0 HTML text nodes under 11px   (was 198 at phone width)
tap targets        0 actionable sub-24px
axe                0 violations
```

**A measurement mistake worth recording.** An intermediate reading of "22
distinct sizes" was wrong: it came from a browser pointed at a `next start`
process running since several builds earlier, serving a stale route manifest
against new CSS chunk names. Always start the server AFTER the build you mean
to measure, and cross-check one number against a direct computed-style probe.

## 2026-09-13 (seventh pass) — instrument material, sitewide

**The question asked:** mechanical upgraded visual experience, significantly
improve UI sitewide. Token-driven, cascading, not page-by-page restyles.

**What was actually missing.** The sixth pass gave `/library` a real
instrument and an honest identity. Everything else still arrived looking like
a SaaS template wearing a science coat:

- Inter was the body face. Same stack as Linear, Vercel, every default
  Next.js app. The display face (Fraunces) and the data face (JetBrains)
  were chosen; the text plane was not.
- Eleven cinematic hubs still filled the right-hand column with the
  decorative molecular field, even when they had a countable, derived set
  (stacks, protocols, trust, tools, insights, products, peptides, pathways,
  hallmarks, learn, combination lab).
- Labs / trust / protocols still printed a literal `'12'` on the hallmark
  rail. Peptides still said "Eight" in the PageHeader.
- Chrome — nav, tables, inputs, selection — did not yet read as the same
  instrument the library had become.

**Deliberately not done, and why.**

- Absorbing stale PR #178's full Hanken branch (library gallery restructure).
  This pass takes the font intent only.
- Scoring the 20 unscored compounds, or converting 100 inline molecule SVGs
  to `<img>`. Same reasons as the sixth pass; neither is a visual-system job.
- Restyling `/club` or `/shop` — CLAUDE.md: those keep bespoke treatments.
- Rewriting the homepage descent. Already-good work; Hanken inherits through
  `--font-sans` without touching the scrollytelling.
- Putting a data figure on hubs with nothing honest to split (`/best` is nine
  goals, `/labs` biomarkers have no category axis, `/shop` is a checklist).
  Decorative field + caption remains the honest fallback.

**Shipped.**

- **Hanken Grotesk** as `--font-sans` (`--font-hanken`). Inter retired from
  layout, globals, viz tokens, NetworkStage, HomeDescent, and the engine
  comment. Optical sizing + kern/liga/calt on body.
- **`HubSplitInstrument`** — shared server primitive. Counts and colours are
  the caller's problem; the component never invents either. Compact layout
  when a split has more than four rows; non-zero bars keep a 4px minimum so
  small slices stay visible.
- **Derived figures** on hallmarks (intervention A/B/C), peptides (legal
  status), pathways (families), evidence (library wrap), stacks (elite-stack
  grades), stacks/lab (synergy / caution / contraindication), tools (New /
  Advanced / Core), trust (scored-set A/B/C), protocols (protocol grades),
  insights (library mix), products (COA published vs not stated), compound
  engine (A–D including D), supplement-guides (guides / profiles /
  comparisons), learn (FAQ / glossary / steps).
- **Hardcoded counts removed:** labs / trust / protocols hallmark rail now
  `hallmarkLibrary.length`; peptides PageHeader uses `peptideLibrary.length`.
- **Cascading chrome:** `::selection`, light-theme grain whisper, nav HUD
  tick, sticky table headers, input inner highlight, data-figure bezel.
- **STYLE_GUIDE v1.7 / §17.** §3 names the three faces. §7 records
  `titleAsHeading` and the data-figure rule.

**Checks.** Lint, typecheck, the test suite including the new instrument /
Hanken / derived-count guards, and a production HTML spot-check of
`/library`, `/hallmarks`, `/peptides`, `/pathways`, `/stacks`, `/trust`.

**Rollback:** `git revert` the merge of this branch.

## 2026-09-13 (sixth pass) — the library tells the truth about itself


**The question asked:** independently determine and ship the most significant
upgrades, rather than wait on an external patch.

**What was actually missing.** Five passes today already gave the library an
evidence table, a molecule-first grid, a two-column hero shell, and a route
audit. The remaining hole was identity, not features. Measured against live
HTML of `/library`:

- The `<h1>` was still "The 12 Hallmarks of Aging", rendered *below* the
  100-card compound grid, because `AntiAgingLibrary asPageTitle` owned the
  heading and `CinematicHubHero` left `titleAsHeading` off.
- The `<title>` and hero lead named the hallmarks as the product. The page
  the visitor was looking at is the compound library.
- The hero's right-hand instrument panel — built this morning so eleven hubs
  would stop shipping 45% empty viewport — still showed the decorative
  molecular field on the one hub that has a real, derived evidence split.
- `/library/compare/head-to-head` (canonical, no query) shipped identity and
  a skeleton. The default comparison (resveratrol vs pterostilbene) lived
  behind the `searchParams` island, so the indexable address had ~675
  characters of `<main>` text.
- Sitemap `lastmod` was frozen at 2026-08-27, seventeen days and five
  production merges behind.

**Deliberately not done, and why.**

- Scoring the 20 compounds the Evidence Table marks *Not scored*. They have
  no `compoundId` in the structured set. Promoting them would mean inventing
  mechanism/dose/PMID fields, which `NOTES-COMPOUND-LIBRARY.md` forbids.
- Turning 100 inline molecule SVGs into `<img>` thumbs. It would cut `/library`
  HTML roughly in half, and it would also stop the thumbs inheriting
  `currentColor` across themes. Visuals were the stated priority of the
  surrounding work; that regression is still not worth the bytes today.
- Authoring new synergy-pair prose. Coverage is already 51/51 pair-specific
  (`synergy-coverage` floor). The upgrade plan's 19.6% figure is stale.

**Shipped.**

- **Library identity.** Hero is the `<h1>` ("Every intervention, graded").
  Title, description and lead name the `${COMPOUND_COUNT}`-compound library.
  Hallmark atlas is the second chapter (`h2`), with its local search hidden
  because the hub already has one. Hallmark count derived from
  `hallmarkLibrary.length`, never a literal `12`.
- **A real instrument in the hero.** `LibraryHeroInstrument` draws the A/B/C
  split and the scored/unscored counts from `evidenceIndexStats()`, colours
  from `TIER_COLOR_VAR`, and links to the Evidence Table. The hero's
  atmospheric radial mask is skipped when a data figure is passed
  (`.research-hero__figure-stage--data`) so labels stay readable.
- **CollectionPage JSON-LD** on `/library`, with `numberOfItems` derived.
- **Head-to-head canonical URL.** The Suspense fallback is now the default
  pair's full comparison, not a skeleton. Crawlers get the duel. When the
  island resolves to that same pair, nothing flashes. Parameterized URLs
  still swap; they canonicalise here and are not in the sitemap.
- **Sitemap `lastmod`** aligned to 2026-09-13.
- **Atlas copy.** The visual-gallery chapter dropped "COMPLETE VISUAL SYSTEM"
  / "Hover to explore" for derived hallmark count and a sentence that states
  the honesty point (first-party mechanism drawings, no stock art).

**Checks.** Run on this branch before the PR: lint, typecheck, the test
suite including the new identity / fallback / lastmod guards, and a
production HTML spot-check of `/library` (one `<h1>`, compounds in the
title) and `/library/compare/head-to-head` (default pair in `<main>`).

**Rollback:** `git revert` the merge of this branch.

## 2026-09-13 (fifth pass) — the Evidence Table


**The question asked:** continue UI and coherence work, add state-of-the-art
visual and content assets, with the goal of increasing what the site is worth.

**What was actually missing.** The route survey says the content architecture
is dense — 100 compound deep-dives, 19 pathways, 18 comparisons, 9 goal pages,
8 peptides. The gap was not more pages. It was that **the library had no index
of itself**: 100 compounds browsable as cards, and no single view where every
grade sits beside every other one. A reader who wants to compare the whole set
had nowhere to go, and a crawler had no single hub linking to all 100 deep-dives.

Two things were deliberately NOT built, and the reasoning matters:

- **More comparison pages.** The head-to-head engine can compare any pair of
  the 81 comparable compounds — thousands of permutations. Generating them
  would be a doorway-page pattern that Google penalises and that would dilute
  the 17 genuinely authored comparisons. Page count is not value.
- **Anything authored.** Per `NOTES-COMPOUND-LIBRARY.md`, no mechanism text,
  dose or PMID may be invented. Every field in the new page is read from a
  registry that already publishes it on the compound's own page.

**Shipped — `/library/evidence`, "The Evidence Table".**

Every graded compound as one sortable, filterable row: tier, composite TNiC
Score, score confidence, hallmark coverage, linked to its deep-dive.

- **`lib/evidence-index.ts`** — a derived view, not a data file.
  `compoundModules` for identity and tier, `computeTnicScore` for the composite
  and its provenance, `hallmarkLibrary` for mechanism labels. Headline counts
  are computed from the rows themselves, so a figure on the page cannot drift
  from the table under it.
- **It ships the gaps.** 20 of the 100 have no computable score. They stay in
  the table marked *Not scored* rather than being dropped or given a filler
  number — a table of 80 calling itself the library would be a quieter lie than
  a missing row. An honesty panel in front of the table states that 57 of the
  80 composites rest on a canonical record at **limited** confidence, and that
  the tier — not the score — is the claim the site stands behind.
- **Server-rendered.** A plain `useState` client component, deliberately not a
  `useSearchParams()` one, so all 100 rows are in the initial HTML (§14).
  Verified: 100 compound links, 101 `<tr>`, no bailout over the table.
- Described to answer engines as a **`Dataset`**, with `variableMeasured`
  naming each column, rather than as an Article.
- Linked from the footer, from the compound explorer on `/library` at the point
  a reader stops browsing and starts comparing, and added to the sitemap at
  priority 0.9 — it is the index a crawler should reach earliest to find the
  other hundred.
- **8 guardrail tests** asserting the table says what the deep-dives say: same
  tier, same score or null, no invented confidence, every row links to a real
  module, only real hallmark names, counts derived from rows.

**A design-system bug the build surfaced.** `.table-base th` styled *every*
`th` as a column header — mono, uppercase, faint — so row headers, the
accessible way to label a data row, rendered as uppercase mono labels.
Three existing tables (`HeadToHeadCompare`, `SirtuinAtlas`, `ConnectionMatrix`)
had each worked around it locally with their own overrides. Now scoped: `thead
th` keeps the column treatment, `tbody th` gets a real row-header treatment.
Fixed once, for every table.

**A guardrail caught me.** The first version declared its own tier→colour map.
`site-integrity.test.ts` failed it — that map is canonical in `lib/trust.ts`
and must not be re-declared. It was right; the component now imports
`TIER_COLOR_VAR`.

**Measured.** `/library/evidence`: LCP 708 ms, CLS 0.008, doc 55 KB, total
1,113 KB encoded — lighter than `/library` despite 100 rows, because rows are
text rather than inline SVG. axe violations 0, actionable sub-24px controls 0,
at desktop and 390px. Route audit 228 routes, 0 fail, 0 warn.

**Why this should matter commercially, stated as a hypothesis rather than a
promise.** One page now links to all 100 deep-dives, which strengthens the
crawl graph over the library's most valuable pages; a sortable evidence table
is the kind of reference people cite and link to; and it routes comparison
intent toward deep-dives that carry verified product picks. Whether that moves
traffic or revenue is measurable in Search Console and analytics over weeks —
it is not something this session can claim to have achieved.

**Checks:** `npm run lint` 0 errors (3 pre-existing warnings) · `npm run
typecheck` clean · `npm test` 58 files → **722 tests** (8 new) · `npm run
build` green · `npm run audit:routes` 228 routes, 0 fail / 0 warn ·
`npm run audit:ui` 0 actionable / 0 axe · `npm run audit:perf` within budget.

**Rollback:** `git revert` the merge of this branch.

## 2026-09-13 (fourth pass) — performance, measured properly

**The question asked:** start making the site state of the art.

**What that turned out to mean.** "State of the art" is not a look — the visual
system is in good shape after the last three passes. It is whether the site's
quality is *measured and enforced* rather than asserted. There were two
instruments (`audit:ui` for layout/contrast/tap targets, `audit:routes` for
structure over every route) and neither could answer "how long does this take
to become useful, and how many bytes does it spend getting there". So this pass
built the third one and calibrated it honestly.

**The baseline, median of three runs, encoded bytes.**

| route | LCP | CLS | doc | js | css | fonts | total |
|---|---|---|---|---|---|---|---|
| `/` | 404 ms | 0 | 69 | 714 | 50 | 186 | 1,141 KB |
| `/library` | 640 ms | 0 | 261 | 783 | 50 | 186 | 1,402 KB |
| `/library/compounds/nmn` | 460 ms | 0.008 | 75 | 788 | 50 | 187 | 1,207 KB |
| `/trust` | 660 ms | 0.008 | 37 | 718 | 50 | 167 | 1,095 KB |
| `/stacks` | 572 ms | 0.008 | 36 | 741 | 50 | 167 | 1,081 KB |
| `/hallmarks` | 668 ms | 0.008 | 47 | 716 | 50 | 186 | 1,091 KB |

LCP and CLS are comfortably inside Core Web Vitals "good". Code splitting
works — `three`, `recharts` and `framer-motion` are all absent from a content
page's bundle, verified by grepping the actual shipped chunks. **The site was
in better shape than the first measurement suggested.**

**Two corrections to my own numbers, both worth recording.**

1. **I reported 3.5–4.8 MB transferred per page in the last session. That was
   wrong.** Playwright's `response.body()` returns the *decoded* buffer, so I
   was measuring uncompressed bytes against a local server. Real encoded
   transfer is ~1.0–1.4 MB. `audit:perf` now reads
   `request.sizes().responseBodySize` and prints the decoded total beside it so
   the gap is visible rather than assumed.
2. **A single run is not a measurement.** The same page on the same build
   measured LCP 700 ms, 1356 ms and 588 ms on three consecutive loads. An
   earlier reading of "LCP 768 → 1536 after the change" was noise, not a
   regression, and I nearly acted on it. Every metric is now the median of
   three runs.

**What is gated and what is not.** CLS (stable to three decimals) and total
encoded KB (< 10% run-to-run) gate. LCP is reported with its min–max range and
only warns: it swings over 2× on a shared runner, and a CI check that fails at
random gets switched off, which is worse than not having one.

**Shipped — the one real win.** `.card-deferred` — `content-visibility: auto`
with `contain-intrinsic-size` — on the 100-card `/library` grid, the heaviest
page on the site. A/B'd on a single build, five runs each side, three
independent rounds:

| | longest task | total blocking |
|---|---|---|
| off | 329 / 359 / 310 ms | 1,026 / 1,034 / 979 ms |
| on | **257 / 259 / 243 ms** | **792 / 867 / 783 ms** |

Consistently **−22% to −28% on the longest main-thread task** and **−16% to
−23% on total blocking time**. `domComplete` moved both ways and showed no
signal; reported as no effect rather than dressed up.

**Named and not done.** ~700–790 KB of compressed JS per page is the honest
remaining cost, spread across ~48 chunks — many small client islands, not one
library to delete. Reducing it means converting client components to server
components and deferring below-fold islands: a large refactor across 54+ files
with real regression risk, and not something to start at the end of a pass.
That is the next genuine performance project.

`audit:perf` needs a browser, so like `audit:ui` it runs locally rather than in
CI; `audit:routes` is fetch-only, which is why that one gates the build.
Enforcing perf in CI would mean provisioning Chromium there — a deliberate
cost, not an oversight.

**Checks:** `npm run lint` 0 errors (3 pre-existing warnings) · `npm run
typecheck` clean · `npm test` 58 files / 714 tests · `npm run build` green ·
`npm run audit:routes` 0 fail / 0 warn over 227 routes · `npm run audit:ui`
0 actionable sub-24px controls, 0 axe violations · `npm run audit:perf` all
pages within budget.

**Rollback:** `git revert` the merge of this branch.

## 2026-09-13 (third pass) — the hub hero stops being a void

**The question asked:** upgrade the site on multiple levels, ~30% better UI and
functionality, visuals weighted highest.

**What the screenshots showed.** Eleven hub pages, measured at 1440×900: every
one opens with `CinematicHubHero` as a single left-aligned column, and
**roughly 45% of the first viewport is empty**. The `MoleculeStage` field meant
to fill it sits at 0.34 opacity behind a veil, masked toward 48%/34% — i.e.
behind the copy, not in the gap — and reads as nothing. The component is named
cinematic and renders dark air on the site's eleven most important arrival
surfaces.

The answer was already in the codebase. Hallmark pages pair copy with a real
figure on the right (coverage ring, ranked interventions, biomarker chips) and
are the best-looking thing on the site. Per CLAUDE.md §6 — does something like
this already exist, and does it clear the bar — the hero now does the same.

**Shipped — visual.**

- **Two-column hero at ≥1024px.** Copy left; a framed **instrument panel**
  right carrying the hub's molecular field at full strength, masked to fade
  into the panel, with a mono caption naming what the visual is
  (`Molecular field · decorative` by default — a site that grades evidence has
  to say whether a picture is data or atmosphere). Stat rail spans both
  columns as the composition's base. Phone and tablet unchanged; the figure is
  `display:none` below 1024px, where the copy already fills the width.
- **A `figure` prop** so a hub with a real data figure can pass one and caption
  it honestly.
- **Background field re-tuned** at ≥1024px: 0.34 → 0.26, mask moved to 26%/38%,
  so it textures the copy column's ground instead of competing with the panel.
- **Compound card chips pinned to the bottom** (`mt-auto`) across the 100-card
  browse grid, so chip rows sit on one baseline per row instead of floating
  wherever the tagline ended.

Documented as STYLE_GUIDE §15, including the two traps that cost a build each:
the stat rail spans `1 / -1`, so auto-flow drops the figure onto a third row
unless rows are pinned; and the rail's `width: min(100%, 50rem)` base rule is
defined later in the file, so the media-query override needs parent scoping to
beat it (a media query adds no specificity).

**Shipped — functional.**

- **`/library` HTML: 3,021 KB → 2,651 KB (−12.3%).** The molecule thumbs
  emitted IEEE-double coordinates — `x1="43.78637600033787"`, 18 characters to
  place a point on a 0–100 viewBox that renders at 72 CSS pixels, where 2dp is
  already ~700× finer than a device pixel. Paid for twice, because the RSC
  Flight payload re-encodes the same element tree the HTML already carries.
  Rounded to 2dp at the projection choke point plus the derived bond offsets
  and atom radii. Verified pixel-identical against a before screenshot.

**Measured but not fixed, stated plainly.** `/library` is still 2,651 KB —
708 KB of inline `<svg>` and 1,344 KB of Flight payload re-encoding it. The
only way to remove that duplication is to stop inlining 100 SVG element trees,
i.e. serve each thumb as an `<img>` from a static route with `loading="lazy"`.
That would likely take the page under 1 MB and lazy-load all but the visible
thumbs — but an `<img>` cannot inherit `currentColor`, so the thumbs would stop
adapting to light/dark theme. Given visuals were the stated priority, the
theming regression was not worth the bytes on this pass. It is the right next
functional move if page weight becomes the priority.

**Checks:** `npm run lint` 0 errors (3 pre-existing warnings) · `npm run
typecheck` clean · `npm test` 58 files / 714 tests · `npm run build` green ·
`npm run audit:routes` 0 fail / 0 warn across 227 routes · `npm run audit:ui`
0 actionable sub-24px controls, 0 axe violations. Light theme, dark theme and
390px phone all verified by screenshot on the new hero.

**One transient worth recording:** an `audit:ui` run reported a single axe
colour-contrast violation on phone `/library`; a second run reported zero. That
is the false positive the script's own header documents — axe measures what is
painted at that instant, and a scroll reveal caught mid-fade composites toward
the background.

**Rollback:** `git revert` the merge of this branch.

## 2026-09-13 (second pass) — what the pages say before JavaScript runs

**The question asked:** find the highest functional and coherence upgrade,
implement it, ship it.

**How it was found.** `audit:ui` measures nine pages in a browser. It cannot
see a property of the whole route set — two pages claiming the same title, a
canonical pointing elsewhere, a page with no heading. So this pass started by
building a second instrument, `scripts/audit-routes.mjs` (`npm run
audit:routes`), which fetches **every route in the sitemap** and reads its
server-rendered HTML: status, title, description, canonical, `<h1>` count,
whether `<main>` holds real text, whether every internal link resolves, and
whether every route is linked from anywhere.

First run: **25 hard failures, 8 warnings, across 234 routes.** Lint, types,
714 tests and the build were all green at the same moment.

**What it found — one root cause under almost all of it.**

`useSearchParams()` in a client component makes React bail the enclosing
Suspense boundary to client-side rendering during prerender. Everything inside
that boundary is absent from the initial HTML. Seven routes had their page
identity inside such a boundary:

1. **Five top-level nav hubs shipped no `<h1>` at all** — `/stacks`, `/labs`,
   `/learn`, `/shop`, `/tools`. The `PageHeader` that carries the `<h1>` lived
   inside the client island. STYLE_GUIDE §7 documents the opposite ("the real
   `<h1>` lives in the PageHeader") — the pattern was written down and not
   delivered.
2. **Two routes shipped an empty `<main>`** — `/library/systems` and
   `/tools/pathway-architect`, both carrying the literal
   `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker CLAUDE.md §3 names as the symptom.
   Pathway Architect had **no `<main>` element at all**: with no Suspense
   boundary of its own the bailout climbed to the root and took the layout's
   `<main>` with it.
3. **`/library/compare/head-to-head` streamed its content after the footer** —
   `</main>` closed at byte 51,087, `<footer>` opened at 51,100, and all 318 KB
   of the comparison arrived afterwards. Cause: a segment `loading.tsx`, the
   exact pattern PR #180 removed from 142 routes. Its own doc comment explains
   why that is wrong and then argues the cost is acceptable here because it is
   one route; measured, the failure is identical in kind.
4. **`/learn` rendered two hero bands** — `LearnCenter` carried a second
   `CinematicHubHero` under the page's own, with different copy. Invisible in
   the HTML, two stacked heroes once the island hydrated.
5. **Eight sitemap URLs shared one title** — `/tools` plus seven
   `/tools?tab=…` variants, every one of them canonicalising back to `/tools`.
   A sitemap entry the page canonicalises away is a contradiction.

**Shipped.**

- **Identity moved to the server page on all seven routes** — hero and
  `PageHeader` above the `<Suspense>`, interactivity below it. Documented as
  STYLE_GUIDE §14.
- **`/tools/pathway-architect` got a Suspense boundary of its own**, so the
  bailout stops at the tool instead of the root.
- **`/library/compare/head-to-head`**: `loading.tsx` deleted, the awaiting half
  split into `HeadToHeadResult` behind a scoped boundary. Loading state kept,
  content back inside `<main>`.
- **`/learn`**: duplicate hero and nested `PageShell` removed.
- **Sitemap**: the seven `?tab=` entries dropped.
- **`npm run audit:routes` runs in CI after the build and fails it.** This
  class of defect is invisible to lint, types, tests and the build — all four
  were green while five hubs published no heading.

**Measured result.**

| | before | after |
|---|---|---|
| hard failures | **25** | **0** |
| warnings | 8 | 0 |
| routes with no `<h1>` | 7 (14 incl. `?tab=`) | 0 |
| routes with empty `<main>` | 3 | 0 |
| routes with a wrong canonical | 7 | 0 |
| duplicate-title groups | 1 (8 URLs) | 0 |

Per-route, `<main>` text in the initial HTML: `/stacks` 0→3,190 chars,
`/labs` 0→1,998, `/learn` 0→6,242, `/shop` 0→1,834, `/tools` 0→1,354,
`/library/systems` 0→678, `/tools/pathway-architect` 0→2,085,
`/library/compare/head-to-head` 0→679. Each now ships exactly one `<h1>`.

**One guardrail was repointed, not weakened.** `site-integrity.test.ts`
asserted `variant="handoff"` appeared in `LabHub.tsx` and `StacksLibrary.tsx`.
That markup moved up into `app/labs/page.tsx` and `app/stacks/page.tsx`. The
assertion is unchanged — those two hubs must still use the handoff variant —
only the file it reads.

**Not touched:** compound data, PMIDs, doses, the homepage, the atmosphere
work from the first pass.

**Checks:** `npm run lint` (0 errors, 3 pre-existing warnings) · `npm run
typecheck` clean · `npm test` 58 files / 714 tests passed · `npm run build`
green · `npm run audit:routes` exit 0 (0 fail, 0 warn) · `npm run audit:ui`
exit 0 (actionable sub-24px controls: 0, axe violations: 0).

**Rollback:** `git revert` the merge of this branch.

## 2026-09-13 — UI aesthetic verdict + the atmosphere budget and control floor

**The question asked:** evaluate the site and decide the most scalable,
plausible, functional UI aesthetic, then implement it.

**The verdict, stated plainly: the aesthetic is already right — do not
redirect it.** Dark instrument base, cyan-explores / emerald-chooses /
gold-ranks signal roles, Fraunces + Inter + JetBrains Mono, real PubChem
geometry and real graded networks as the imagery. It is distinctive,
subject-grounded, and carries none of the generic tells. Anything proposing a
new palette or a new hero idiom here would be replacing working, considered
work with something less specific. What was missing was not a direction — it
was the **second half of the direction**: the system had an excellent
*cinematic* tier and no codified *instrument* tier. Named and documented as
**"cinematic shell, instrument core"** in the new STYLE_GUIDE §13.

**What that gap actually cost, measured on the rendered site**
(`npm run audit:ui` at 1440px and 390px, nine representative routes — not read
off the code):

1. **The ambient field was reaching the content.** `AmbientLayer` is fixed
   behind every page and page wrappers are transparent by design
   (`.canvas-scrim`), but `.premium-card`'s dark-theme fill was white-alpha
   only — no ground. So the drifting skeletal linework painted *through* card
   bodies on `/library`, through the buyer-guide band's body copy on all 100
   compound pages, and, on a phone, straight under the 12-hallmark filter
   column. Light theme had already solved this (it fills with
   `--color-bg-elevated`); dark theme was the inconsistent one.
2. **The control layer had not kept pace with the atmosphere layer.** 1,187
   sub-24px tap targets across the nine routes. The worst were not marginal:
   the homepage age scrubber under the morbidity curve — the flagship
   interactive — had a **3px-tall** drag box, and `.age-slider` (the canonical
   `Slider` primitive, plus the bio-age wizard and hallmark notes panel) had
   **6px**. The footer shipped 28 links at 23px on every one of 431 routes.
3. **The `smallTap` number itself was not actionable.** On `/library` it read
   135, of which ~120 were PMID and glossary links sitting inside sentences —
   targets WCAG 2.2 AA 2.5.8 explicitly exempts. The real number was buried.

**Shipped.**

- **`--card-ground`** — one token, both themes. Third background layer of
  `.premium-card` (92% elevated in dark, opaque in light), and under the
  compound buyer-guide band's amber→cyan wash. The field still reads faintly
  through a card; it no longer competes with the text inside one.
- **Phone density correction** — `.molecule-node` depth opacities step down
  ~45% under 768px, where a structure spans most of the screen instead of a
  fraction of it and there are no margins for it to live in. Desktop tuning
  untouched; the field keeps full strength in gutters, between cards and
  behind hero bands.
- **Sliders rebuilt on track pseudo-elements** — `.age-slider` 6px → **28px**
  box, `.tnic-range` 3px → **32px**, visual tracks unchanged. Deliberately not
  44px: both sit in stacked rows whose neighbours are closer than that, and §4
  records two incidents of an over-grown hit area stealing its neighbour's tap.
- **`.action-link`** — the new system class for a link that is an *action*
  rather than a word in a sentence. Applied across the library's panel footers,
  related-link lists, citation rows and reference lists. Grows the hit area,
  never the type.
- **Point fixes** to the footer hub/resource columns, the route rail, the
  breadcrumb bar, the reading ToC, the linked `EvidenceTag` (fixed in the
  canonical component, so every surface that renders a linked tier inherits it),
  `EvidenceTrace`, `ContentByline` and the buyer-guide compare link.
- **`npm run audit:ui` is now a gate.** It separates exempt (inline-in-a-
  sentence, hit through a ≥24px `<label>`, stretched-link card titles,
  `sr-only`) from actionable (standalone controls under 24px) and **exits
  non-zero** on the second. Budget 0. Its one known blind spot — a standalone
  action left as a bare inline `<a>` — is documented in the script rather than
  papered over.

**Measured result.**

| Route (phone / desktop) | sub-24px before | after |
|---|---|---|
| `/` | 54 / 50 | **5 / 5** |
| `/library` | 120 / 135 | 84 / 93 |
| `/library/compounds/nmn` | 102 / 118 | 34 / 41 |
| `/library/compare/nmn-vs-nr` | 37 / 45 | 4 / 4 |
| `/smoker-defense-stack` | 42 / 49 | 4 / 5 |
| `/supplement-guides` | 36 / 44 | 7 / 9 |
| `/trust` | 33 / 39 | 4 / 4 |
| `/stacks` | 36 / 42 | 4 / 4 |
| `/library/mitochondrial-dysfunction` | 83 / 102 | 24 / 35 |
| **total** | **1,187** | **373** |

Actionable sub-24px controls: **0** (gate passes). axe-core violations: **0**
across all 18 page×viewport combinations, unchanged. The residual `smallTap`
count is inline prose citations, which is where it should be.

**Not touched:** the homepage descent, hub hero idiom, `.glass-deep` glass
moments, desktop field tuning, compound data, PMIDs, doses.

**Checks:** `npm run lint` (0 errors, 3 pre-existing warnings) · `npm run
typecheck` clean · `npm test` 58 files / 714 tests passed · `npm run build`
green, 431 routes · `npm run audit:ui` exit 0.

**Rollback:** `git revert` the merge of this branch.

## 2026-09-12 — Surface identity: molecule-first library + one overture per deep-dive

**The finding, measured on the live site.** The homepage cinematic descent is
already the brand. The two surfaces that do the work — `/library` browse and
the 100 compound deep-dives — were still generic next to it.

1. **Library cards had no visual identity.** PR #182 put real PubChem geometry
   on compound *pages*. The browse grid that leads to those pages was still a
   text card: tier chip, title, tagline, hallmark chips. 100 cards, one
   picture. On a phone that is a CMS dump, not a library of molecules.
2. **Compound pages said the name four times before the evidence.** Order on
   `/library/compounds/glynac`: CompoundHero → Full-Spectrum data package →
   Intelligence Matrix → LibraryModuleDetail (icon + h1 + tagline + summary +
   glance panel, repeating dose/tier/hallmarks the hero already printed). The
   MDX — the reason the page exists — started ~a viewport later. Chip soup
   was the first impression.
3. **`/library` buried the compound grid** under DecisionSteps, the evidence
   spectrum, the research-queue shelf, and the 12-hallmark atlas. Search is
   high-intent; the grid it is meant to drive was the fifth block.

**Shipped.**

- `MoleculeThumb` — server SVG of the same geometry MoleculeStage draws.
  Honesty contract identical: no geometry → orbital field, never a fabricated
  molecule. Ships in the initial HTML; the 115 KB geometry file stays off the
  client explorer bundle.
- Compound cards: 72px unique thumb + title + two hallmark chips. Grid is a
  **server** component; tier pills remain a client island (`CompoundExplorerFilters`).
- `/library` order: hero → search → facets → **compound grid** → spectrum →
  decision path → hallmark atlas. `#hallmark-atlas` kept (palette + brief
  deep-links).
- Deep-dive order: hero → sticky bar → **evidence module** → full-spectrum
  appendix → intelligence matrix. `heroPresent` suppresses the second identity
  stack (icon, tagline, summary, glance, evidence-trace) so the semantic `<h1>`
  is the only name restatement, and it is a section heading, not a second hero.
  Hero gains a "Read the evidence" skip to `#evidence-module`.

**Not touched:** homepage descent (CLAUDE.md §2 — already-good work), compound
data, PMIDs, doses.

**Rollback:** `git revert` the merge of this branch.

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

**Component UI pass merged onto current `main` (PR #133)** — applies the Manus
"TNIC.help Component UI Upgrade Brief" Thomas supplied on 2026-08-26. Built as
five phases, then merged forward on 2026-09-05 after the branch fell 86 commits
behind; two phases were dropped as superseded by concurrent work. See
"Component UI upgrade brief" and "Merging onto current `main`" directly below —
the second records what actually landed, and a list of pre-existing a11y debt
on `main` that the merge verification surfaced but did not widen into scope.

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

## Component UI upgrade brief — PR #133 (5 phases, 2026-08-26 → 09-05)

Thomas supplied an 8-page Manus brief ("cinematic discovery, clinical clarity")
and asked what was already on `main` and what wasn't.

**The headline finding: most of the brief was already satisfied.** It was
written from the rendered site, not the source, so it repeatedly asks for
things that exist and are good — `EvidenceTag` already renders a tier as letter
+ descriptor + a three-bar strength meter (never colour alone); the type scale,
`--space-touch`, `.focus-ring`, `.premium-card`, the viz fallback tables and the
NICO progress component were all in place. Per CLAUDE.md §6 those were left
alone and said so, rather than rebuilt.

What the brief did surface is one real, consistent gap: **the site had canonical
primitives for surfaces and evidence but none for the interactive layer.** Chips,
icon buttons, selection cards and visualization shells were each re-implemented
per component — three different "selected" colours, hit areas as small as 25px,
`rel` drifted into five variants. That is what the pass fixes.

**Two product decisions went to Thomas rather than being taken unilaterally**
(CLAUDE.md §1 — business decisions):
- **Elite card CTAs** — the brief wants "Read evidence" primary and the retailer
  link demoted. **Decision: keep Buy visually primary.** The brief's UI argument
  doesn't outweigh the funnel PR #128 deliberately tightened. Every
  non-commercial part of the card rebuild still shipped.
- **Mobile elite card** — **decision: ship the brief's compact preview +
  one-tap expansion.**

### Phase 1 — interaction primitives (`d91f1e2`)

New in `components/ui/`: `IconButton`, `SelectableChip`, `ExternalAction`.
Selected now means emerald everywhere via a new `--surface-selected` token (the
homepage NICO starter was violet, the full NICO flow's chips were emerald while
its own 1–5 scale *in the same flow* was cyan). `rel` is decided once — two of
eight off-site links had shipped `noreferrer` with no `noopener`. Nav's
Dashboard CTA used `!min-h-0`, cancelling `.btn-gradient`'s own 44px floor;
site-search was ~37px. New `--signal-elite` (`#d8b25f`): there was no gold token
at all — `VIZ.gold` and `--sie-gold` both aliased `--accent-amber`, which *is*
Tier C, so a rank accent and a Tier C badge rendered the same hue side by side.
`lib/tokens.ts` (a rival `spaceScale` nothing imported) deleted.

### Phase 2 — decision surfaces (`51ee5d7`)

**Three components were showing readers the wrong evidence grade:**
`SynergyScorePanel` and `Elite8Hub` hardcoded emerald for *every* tier (a Tier C
stack rendered green), and `/nad-supplement-guide` coloured its tier pill by the
product's brand hue. All three now render `EvidenceTag`.

The A/B/C→colour map was copy-pasted into a dozen components, each with a "keep
in sync" comment instead of an import — and they had drifted. It now lives in
`lib/trust.ts` (`TIER_ACCENT_NAME`, `TIER_COLOR_VAR`, `TIER_TEXT_CLASS`,
`TIER_CHIP_CLASS`, `TIER_CHIP_CLASS_STRONG`), with two `site-integrity` guards:
one asserts the maps agree, the other fails if any file under `components/` or
`app/` re-declares a local copy. **The second guard immediately found two more
copies the manual sweep had missed**, which is the point.

Elite card reworked to the brief's four-zone anatomy: three consistent facts
instead of two, the `whyThisPick` disclosure (already authored in
`lib/product-picks.ts`, previously rendered only into JSON-LD), line-clamps so
uneven copy stops stretching the grid row, and the mobile compact preview.

### Phase 3 — interactive science (`1690300`)

`InteractiveSciencePanel` — the two canvas stages shipped as bare
`<canvas role="img">`: no title bar, no legend, no controls, no keyboard path.
**The molecule renderer had coloured atoms by element since it shipped and
nothing in the UI ever said what the colours meant.** The panel adds a title
bar, legend, Reset/Zoom/Fullscreen, arrow-key rotation, a first-use cue that
dismisses, and an always-present text summary.

Goal simulator: the "Elite protocol" control was a bare `<button>` with no
`type` and **no `aria-pressed`** — now a labelled `role="radiogroup"`. Its
swatch was gold while the curve it toggles is cyan; the "Elite ceiling" metric
rendered unconditionally even with the curve switched off. New `OutcomeMetric`
gives every number the same uncertainty marker.

Reduced motion: the constellation's stagger, the synergy graph's pulse rings and
the Descent's cursor-glow lerp all ran unconditionally.

**Hit areas — a bug found by measurement, not reading.** `.tap-expand` worked,
but a tap 6px below one filter chip landed on the chip in the row *beneath*:
28px chips at a 36px pitch gave overlapping 44px areas. Split into `.tap-expand`
(both axes, isolated controls) and `.tap-expand-y` (vertical only), plus a
`.chip-row` container whose 16px row gap makes the pitch exactly 44px.

### Phase 4 — guided paths (`366d48e`) — **superseded, dropped at merge**

Built a hallmark persistent detail panel and selected-answer summaries for both
NICO flows. PR #171 rebuilt the NICO starter (safety screen) and #176 reworked
the elite card in the same week, so at merge time main's versions won and this
phase was dropped rather than merged over them. Its `aria-pressed` /
`aria-expanded` fixes to `CompoundSelectorGrid` and `Elite8Hub` did survive.

### Phase 5 — SectionProgress (`08e99bb`)

The Descent's scene rail covered only the overture, had two states, no numerals,
no `aria-current`, a ~25px hit area and `display: none` below 721px.
`components/ui/SectionProgress.tsx` spans the whole page — which is what lets
its numerals be the real 01–06 chapter spine rather than a second numbering
contradicting the visible "01 / System". Adds a complete state (a check mark,
not just a colour), `aria-current="step"`, and a mobile strip.

**A second hit-area overlap bug, same family as Phase 3's:** clicking a rail
step activated a *different* step — 14px ticks at an 18px pitch made the 44px
expanded areas overlap so a neighbour won every hit test. The rail is a column
with nothing beside it, so each step is now a real 44px control at a 44px pitch.
**The first test pass missed it because it clicked only the last step**, which
has no later sibling to steal its hit area. The retest clicks all nine. This is
the lesson worth keeping: test every element of a repeated control, not one.

## Merging onto current `main` (2026-09-05, `a3e718a`)

The session paused after Phase 5 and resumed nine days later, by which point the
branch was **86 commits behind** and 12 files conflicted — PRs #153, #167, #170,
#171 and #176 had reworked much of the same surface. Thomas had closed PR #133
on 09-04; it was reopened to carry the merge, on his instruction to "merge main
in, resolve all 12".

**Resolution rule: main's newer version is the base, mine re-applied on top.**
The four heavily-reworked homepage components were reset to main *exactly*
(`git checkout origin/main --`) and then given only additive changes, so the
result is provable rather than hand-woven.

**Kept** (all with real consumers): `IconButton`, `SelectableChip`,
`ExternalAction`, `SectionProgress`, `InteractiveSciencePanel`, the canonical
tier map + guards, the three tier-colour bug fixes, the tokens, and
`STYLE_GUIDE.md` v1.2. **Dropped as superseded**: the elite-card rework, the
hallmark detail panel, the NICO summaries, the goal-simulator toggle.

**The tier guard earned its keep immediately.** main had added five *more* files
each carrying a private tier-colour map — `ComparisonLandscape`,
`TnicScorePanel`, `PeptideLandscape`, `HomeEliteGrid`, `EvidenceGradingLadder` —
several with comments calling themselves canonical. All five now import
`TIER_COLOR_VAR`; values are byte-identical, so nothing renders differently.
**This is the drift mechanism that produced the three live tier-colour bugs, and
it recurs on its own within days.** Do not weaken that guard.

**Two collisions:** main's `HomeDescent` still had its own `.tnic-rail` (two
rails on one page) — removed in favour of `SectionProgress`, with main's nicer
panel treatment ported across. And #167 moved the canvases behind lazy
`Deferred*Stage` wrappers, orphaning `InteractiveSciencePanel`; the panel now
*wraps* those wrappers, so the lazy-mount seam still governs when the canvas
loads. Stage handles cross that boundary as a plain `handleRef` prop —
`next/dynamic` does not reliably forward refs.

### Verification

lint 0 errors · typecheck · **679/679 tests** · clean build. axe-core
WCAG 2.1 A/AA + best-practice across 9 pages: **0 violations and 0 JS errors on
`/`, a compound deep-dive, `/hallmarks`, `/nico`, `/stacks`, `/elite-8`,
`/peptides`.** Rail driven in a browser: 44px step at a 44px pitch, every step
owning its own centre, all 9 landing correctly in both normal and
reduced-motion contexts.

**Known pre-existing a11y debt on `main`, NOT from this branch** (proven by
diffing the owning files, not assumed) — worth a future pass:

- `/library`: 24 colour-contrast failures on the TNiC-score chip's `/100`
  suffix (`#248b6c` on `#0c1f29` at 8.5px ≈ 4:1), plus 7 `dl`/`dlitem`
  structure failures in `EvidenceTierSpectrum.tsx` (`<dt>`/`<dd>` wrapped in
  intermediate `<div>`s).
- `/trust/methodology`: 1 heading-order skip in `EvidenceGradingLadder.tsx`.

**The stale-`next start` trap recorded below bit twice during this pass**,
producing exactly the misleading result it warns about (a hit-area test
"failing" against a previous build). Confirm the port is free *and* that the
serving process postdates the build — `ss -ltn` alone raced and reported free
while a server still held it.


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

---

## Visual pass — v14 "lit ground" (branch `claude/ui-design-visual-pass-sa6c4p`)

*Method: built the site, served it, and screenshotted `/`, `/library`,
`/hallmarks`, `/hallmarks/cellular-senescence`, `/stacks`,
`/library/compounds/spermidine` and `/trust/methodology` at 1440×900 and
390×844 in both themes — before and after. Everything below was found by
looking at a render, not by reading the stylesheet.*

### What was found

1. **The page ground was a flat slab.** `--color-bg-base` edge to edge on every
   route that is not the homepage or a hero band, with the only relief being the
   fixed `.ambient-layer`, which is corner-masked and effectively invisible on
   the dense hubs. `/library` and `/hallmarks` rendered as content floating on
   unlit black.
2. **The elevated plane was not a plane.** `--color-bg-elevated` `#080f1c` is a
   ~3% luminance step over `#020811` — under the threshold at which a dark
   surface reads as raised. Every card, panel, table header and popover resolves
   to it (directly or via `--card-ground` / `--glass-fill-*` / `--glass-bg`), so
   the whole surface ladder was compressed into nearly one tone.
3. **`.page-header__eyebrow` had no base definition** — only the `--handoff`
   modifier did. The element is a `<div>`, so on every page using PageHeader's
   default variant the eyebrow rendered as a *block*: a `.card-ultra` pill
   stretched to the full width of its `max-w-4xl` header. On
   `/trust/methodology` that is a 900px capsule around the words "TRUST ·
   METHODOLOGY". Affected the whole trust/legal/utility set.
4. **Long-form pages were composed hard-left.** `TrustPageTemplate` caps its
   content at `max-w-4xl` (56rem) but sat inside the 80rem hub container, so at
   1440px the column hugged the left edge with 24rem of empty page beside it.
5. **The molecular field crossed running text.** §13 already states the rule
   ("the field keeps the margins"), and `--card-ground` enforces it for cards —
   but nothing enforced it for prose. A benzene ring sat behind the second line
   of `/trust/methodology`'s page description.
6. **The homepage compass cardinals were struck through by their own dial.**
   The four `<text>` nodes sat at x=22 / x=218 inside a 240 viewBox whose outer
   ring runs r=102 (x=18…222), so the ring stroke and the 12 hallmark ticks ran
   *through* "NRF2" and "mTOR" — on the site's signature first-viewport
   instrument. And as SVG text they scaled with the viewBox: 11px in a 240-unit
   box displayed at 132px on a phone is ~6px, half the §3 floor.
7. **`.heading-accent-rule` ignored the accent system.** Gradient and glow both
   hardcoded cyan→emerald, so a rose hallmark page, a violet `/stacks` and an
   amber warning band printed the same cyan dash under headers whose every other
   element obeyed the per-hub accent.
8. **`npm run audit:ui` was red.** One `aria-allowed-role` violation
   (`<a role="listitem">` in the homepage tier-mix list — `listitem` is not an
   allowed role for an anchor, so AT got a list whose items were not items) and
   one actionable sub-24px control ("Full ranking", 87×20).

### What changed

| # | Change | Where |
|---|---|---|
| 1 | Four ground tokens (`--ground-key` / `-fill` / `-counter` / `-falloff`) composing a lit field, painted on `body` with `background-attachment: fixed`. Both themes define all four | `app/globals.css` |
| 2 | `--color-bg-elevated` `#080f1c` → `#0b1424`; `--glass-bg` / `--color-bg-surface` tracked. JS mirror updated | `app/globals.css`, `lib/design-system.ts` |
| 3 | `.page-header__eyebrow` base definition — `inline-flex` | `app/globals.css` |
| 4 | `PageShell` gains `measure="reading"` → `.container-page--reading` (66rem); TrustPageTemplate uses it | `components/ui/PageShell.tsx`, `components/trust/TrustPageTemplate.tsx`, `app/globals.css` |
| 5 | `.molecule-cascade` masked out of the centre column ≥1024px. Composition, not dimming — depth opacities untouched | `app/globals.css` |
| 6 | Compass cardinals become HTML spans in the dial's padding, holding `--type-11` at every size; hidden with their explanatory clause in the compact layout | `components/home/HomeDescent.tsx` |
| 7 | `.heading-accent-rule` reads `--rule-accent`; PageHeader and SectionShell pass `themes[theme].cssVar` | `app/globals.css`, `components/ui/PageHeader.tsx`, `components/SectionShell.tsx` |
| 8 | Tier-mix list becomes real `<ul>`/`<li>` markup; "Full ranking" gets `min-h-6` | `components/home/HomeDescent.tsx`, `components/home/HomeInstrumentStrip.tsx` |

Documented as STYLE_GUIDE §22 (guide bumped to v1.12).

### Verified

- `npm run typecheck` — clean.
- `npm run lint` — 0 errors, 0 warnings.
- `npm test` — 71 files, 784 tests, all passing. No guardrail test was touched
  or weakened.
- `npm run build` — clean.
- `npm run audit:ui` against a production build, 11 routes × {1440×900,
  390×844}: **0 axe violations on all 22 combinations** (was 1 rule across 2
  pages), **0 actionable sub-24px controls** (was 2, budget 0 — the gate was
  red before this pass), **0 HTML text below the 11px floor**.
- Light theme screenshotted alongside dark on every sampled page; the ground
  composition, the reading measure and the eyebrow fix all read correctly there.

### Deliberately not done

- **Elite-card CTA stack.** `HomeEliteInterventions` cards carry five actions
  ("Read evidence", "Add to protocol", "Open in stacks", "Verify stack",
  "Verify on <brand>"). That is the CTA redundancy the operating rules' §8.3
  asks about, but resolving it removes or merges working destinations — an IA
  decision, not a visual one. Flagged, not executed.
- **Hub-hero top band.** ~140px of padding above the eyebrow on every
  `CinematicHubHero`. It read as void on a flat ground; with the lit ground it
  reads as atmosphere, so it was left alone rather than tuned on a hunch.

## Open questions for Thomas

*(none blocking right now)*
