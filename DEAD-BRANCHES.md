# Dead branches — archive record

*Compiled 2026-08-24 during a full repo-wide branch sweep (see
`REDESIGN-PROGRESS.md`'s "2026-08-24 sweep" note). This is the permanent
record of that audit: every one of these 93 remote branches was
individually checked — not assumed dead by staleness alone — and confirmed
**dead code: none of it ever reached `main`, and none of it needs to.**
Every branch listed here still physically exists on GitHub as of this
writing (this session does not have branch-delete permission — `git push
origin --delete` returns HTTP 403 on this token). This file is the "notate
as dead" half of that; the "archive" half — actually removing the refs — is
a one-command, one-time job for whoever has admin/delete rights. That
command is unchanged from the prior report; ask and it'll be reprinted.*

## How each branch was checked

Not by commit-behind count alone (misleading — see below). For every
branch: (1) `git merge-base origin/main <branch>` — does it even share
history with current `main`? (2) if yes, a local dry-run `git merge
--no-commit --no-ff` against the *current* `main` tip — clean, or does it
conflict? (3) for anything that sounded substantive by commit message, a
direct content check against current `main` (e.g. compound counts, existing
components, active guardrail tests) rather than trusting the branch's own
claim.

## Category 1 — No shared history with `main` (50 branches)

`git merge-base` returns nothing: these branches' entire commit graph is
disconnected from current `main`. Not a staleness estimate — an objective
git fact. Nearly all predate a documented app-recovery event
(`cleanup/stabilize-main`'s own commit: *"restore: recover the Next.js
application and stabilize the build"*, 2026-07-04) — i.e. artifacts from
before the app was rebuilt. Two are individually worth naming: `fix/citation-integrity`
and `claude/audit-phased-upgrade-rollout-4oz2py` both attempted PMID/citation
fabrication fixes from that earlier era — superseded not by assumption but
by direct verification that `lib/citation-freshness.test.ts` and
`lib/content-integrity.test.ts` actively guard this today (309 tests,
green). `fix/hub-metadata-and-jsonld-scoping` is the exact bug class
`CLAUDE.md` §3 documents as already verified-fixed. `feat/deep-glass-system`
/ `feat/deep-glass-system-v2` are early prototypes of what's now the real,
shipped Deep Glass system (`.glass-deep`, `GlassPanel`).

```
3d-hero-depth-rollout
claude/audit-phased-upgrade-rollout-4oz2py
claude/dataviz-aesthetics
claude/depth-quality-ultra-v2
claude/front-page-sponsor-redesign-0uj1zx
claude/phase-0-design-system
claude/phase-1-authority-pages
claude/phase-2-knowledge-graph
claude/professional-ui-graphics-6r1i13
claude/quality-top-priority
claude/quiz-routing-logic-3hat8d
claude/roi-improvements-audit-plan-1ruq6i
claude/session-5dk7r0
claude/signature-headings
claude/site-audit-quiz-logic-y4xfn9
claude/site-audit-ui-improvements-0ksrvk
claude/sitewide-polish
claude/tnic-design-audit-2w0xdf
claude/tnic-design-audit-yew5u3
claude/tnic-help-design-upgrades-1kdv30
claude/tnic-help-priority-upgrades-ovj7vq
claude/tnic-longevity-dashboard-0hb1ij
claude/tnic-redesign-content-fixes-4bk08z
claude/top-5-quality-improvements-hg0dpk
claude/typography-coherence
claude/visual-polish-motion
cleanup/stabilize-main
feat/a11y-seo-hardening
feat/compound-deep-dives-visual-polish
feat/content-trust-final-qa
feat/deep-glass-system
feat/deep-glass-system-v2
feat/design-system-consolidation
feat/hallmark-pages-luminous-polish
feat/library-visual-polish
feat/performance-optimization
feat/premium-visual-hero-upgrade
feat/site-improvement-phase1
feat/site-wide-luminous-consistency
feat/visual-system-upgrade
fix/citation-integrity
fix/enhanced-dynamic-fallbacks
fix/final-dynamic-push
fix/homepage-duplication-cleanup
fix/hub-metadata-and-jsonld-scoping
fix/nuclear-cleanup-today
fix/remove-all-my-changes
fix/restore-dynamic-pages
fix/sophisticated-dynamic-restore
fix/visual-degradation-cleanup
```

## Category 2 — Shares history, but zero unique commits (18 branches)

Shares a real merge-base with `main`, but the branch tip *is* the
merge-base — nothing was ever committed on the branch beyond where it
forked. Empty by construction, not by later supersession.

```
claude/coherency-roi-pass
claude/compound-engine-polish-nav-ow8yag
claude/front-page-website-combine-qelyob
claude/homepage-coherence-roi
claude/new-session-rjc6pi
claude/phase-1-a11y-compliance
claude/phase-2-a11y-semantics
claude/phase-2-ambient-cinematic-layer
claude/phase-3-homepage-altitude
claude/phase-3-interactive-a11y
claude/phase-4-hub-cinema
claude/phase-5-perf-cwv
claude/site-audit-ui-improvements-4hbfq5
claude/site-improvements-content-ui-xp8lzj
claude/site-ui-improvements-lurdtf
claude/tnic-content-quality-gaps-712c3y
feat/compound-library-expansion
feature/visual-system-upgrades
```

## Category 3 — Merges clean, but content is already redundant (4 branches)

Real commits, no conflict against current `main` — but a dry-run merge
changes **zero files**: whatever the branch built already exists on `main`,
shipped through a different PR.

- `claude/chore-middleware-to-proxy` — the Next 16 `middleware.ts`→`proxy.ts`
  migration it attempts is already done, identically, on `main`.
- `claude/compound-intelligence-matrix` — the Compound Intelligence Matrix
  panel it adds already exists on `main` (`CompoundIntelligenceMatrix.tsx`).
- `quality-pass` — content already superseded elsewhere.
- `feature/protocol-assessment` — technically clean-merging, but a dead
  prototype in the wrong stack entirely: `.jsx`/`.js` files (no other file
  in the repo uses these extensions) and a standalone `data/compounds.js`
  outside `lib/data.ts` — exactly the duplicate-data-source risk
  `NOTES-COMPOUND-LIBRARY.md` warns against. Superseded by the real stack
  tooling (Stack Architect, NICO, Combination Lab).

```
claude/chore-middleware-to-proxy
claude/compound-intelligence-matrix
quality-pass
feature/protocol-assessment
```

## Category 4 — Conflicts against current `main`, superseded (21 branches)

Real, substantive commits that no longer apply cleanly — `main` moved on.
Individually checked, not assumed:

- `claude/major-upgrades-roi-4pjrgn` ("Promote 54 compounds into the graded
  set, 27→81") — `main` now carries **95** graded compounds, confirmed by
  direct count. Whatever this did happened again, better, elsewhere.
- `claude/site-review-roi-upgrades-kt0u4l` ("Add verified-pick buy paths") —
  superseded by this session's own Phase 3 (PR #115), which reworked the
  exact same files (`GuideVerifiedPick.tsx`, `LibraryModuleDetail.tsx`).
- `claude/global-chrome-redesign` ("command-palette search") — `CommandPalette.tsx`
  already exists on `main`, built independently.
- `claude/tnic-ui-ux-transformation-dtwnv6` — this **is** PR #106, confirmed
  closed without merging because its hero/nav rework would have regressed
  later work; its two genuinely net-new modules were cleanly salvaged into
  PR #124. `claude/tnic-forensic-polish` shares the same fork point/lineage.
- `nav-adaptive-qa` — its nav-self-fitting idea was explicitly ported into
  PR #125 (credited in that PR's own description).
- `ui-roi-upgrades` — an earlier, cruder attempt at the same nav-overflow
  problem PR #125 solved properly with a `ResizeObserver`.
- `claude/ui-aesthetic-depth` ("card elevation") — superseded by the
  `.premium-card` system itself.

```
claude/2nd-act-1page-deployment-ch8unc
claude/cinematic-light-mode
claude/coherence-graphics-tools-07p85j
claude/global-chrome-redesign
claude/intervention-library-linking-r02ku9
claude/major-upgrades-roi-4pjrgn
claude/molecule-coverage
claude/pathway-architect-nextjs-e3ivyn
claude/side-coherence-content-f7c404
claude/site-elite-upgrade-jobk0p
claude/site-review-roi-upgrades-kt0u4l
claude/sponsor-review-polish
claude/supplement-intelligence-engine-lkiokk
claude/supplement-stack-longevity-e3zrjz
claude/tnic-forensic-polish
claude/tnic-library-bundle-hbeyon
claude/tnic-ui-ux-transformation-dtwnv6
claude/top-roi-ui-enhancements-ba1dt2
claude/ui-aesthetic-depth
nav-adaptive-qa
ui-roi-upgrades
```

## Not on this list — resolved, not dead

`claude/site-monetization-strategies-h7xzx0` went through the same sweep,
came back clean-mergeable, and turned out to be real, safe, well-built
sponsor infrastructure — **merged** via PR #130 (2026-08-24), not archived.
Its branch ref is stale now the same way any merged branch's is (harmless,
safe to delete whenever the branch-cleanup command runs), but the work
itself lived — the opposite of everything above.

## To actually delete these refs

Needs delete-ref permission this session's git credentials don't have
(confirmed via direct `HTTP 403` on `git push origin --delete`, not a
policy choice). One `git push origin --delete <93 names>` command does it
in one shot from any machine with real push access to the repo — already
handed over in full in an earlier report; ask again and it's reprinted.
Nothing about this file requires that step to happen — it stands as the
record either way.
