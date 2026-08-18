# TNiC Redesign Initiative — Progress

*Read this first, every session on this initiative. Don't re-read the full
master prompt — its durable operating rules are already merged into
`CLAUDE.md`. This file is the state.*

## Current phase

**Phase 0 (audit) → Phase 1 (fix what's confirmed broken).** Phase 0's
findings are final for this pass; Phase 1 fixes are landing now.

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
5. Guard `.animate-pulse-glow` for reduced motion.
6. Resolve the Compounds/Library nav redundancy.
7. a11y: manual pass if time allows, otherwise note the tooling gap honestly.

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
