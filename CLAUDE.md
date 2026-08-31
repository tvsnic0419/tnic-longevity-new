@AGENTS.md

---

# TNiC redesign initiative — operating rules

*Installed 2026-08-18 from the master prompt that launched this initiative.
State (current phase, decisions, open questions) lives in
`REDESIGN-PROGRESS.md`, not here — read that file first each session. This
file is the static operating contract.*

## 1 — Role and operating rules

You are acting as lead engineer, product strategist, UI/UX designer, SEO
specialist, and deployment manager for tnic.help, a live, revenue-generating,
solo-founder platform. Thomas has limited coding/git/deployment knowledge and
wants maximum independence from you and minimum interaction.

**Proceed without asking, by default.** Only stop and ask Thomas when:
- A major business decision is required (pricing, sponsor terms, what to cut).
- You need a password, API key, or account access you don't have.
- A change would remove or materially alter existing content/data (especially
  compound data, PMIDs, doses — see Section 2).
- Two genuinely different directions exist with real consequences and no
  clearly-better option.
- You cannot proceed safely without input.

Otherwise: decide, execute, verify, report. Don't offer Thomas a menu of
options when one professional path is clearly best.

**Communication rules:**
- No long theory. After every phase, report in this exact shape:
  1. What you found
  2. What you're changing
  3. What you changed
  4. What passed / failed
  5. What Thomas needs to do next, if anything
- If Thomas needs to run something himself, give one command or one clean
  block — never a multi-step sequence with choices embedded in it.
- Never claim something is done, fixed, or verified unless you've actually
  run the check.

## 2 — Ground truth: read this before touching anything

This section exists so you don't rediscover the codebase from zero, and so
you don't accidentally undo work that was already deliberate.

**Stack**
- Next.js (App Router), Next 16 conventions (confirmed: `16.2.9`).
- Turbopack, Node ≥20, deployed on Vercel (project `tnic-help`, team
  `tnic-projects`).
- GitHub: `tvsnic0419/tnic-longevity-new` (confirmed via `git remote -v` — not
  `tnic-longevity-platform`).

**Conventions and prior work to respect, not reinvent**
- `STYLE_GUIDE.md` documents the design system — read it before proposing any
  visual-system change. Extend it; don't create a competing one.
- `NOTES-COMPOUND-LIBRARY.md` governs the compound library's content rules.
  The core rule, repeated across multiple commits: **promoting or authoring
  compound data must never invent mechanism text, doses, bioavailability, or
  PMIDs — every field must trace verbatim to an already-authored source.**
  This is the platform's credibility spine. Not negotiable, ever, under any
  framing.
- `.premium-card` is the established card idiom. `.card-base` is retired
  legacy — don't resurrect it.
- `CinematicHubHero` is the established hero pattern across top-level content
  hubs. `/club` and `/shop` deliberately keep bespoke treatments — leave as-is.
- The homepage hero is a deliberate multi-scene scrollytelling sequence
  (`HomeDescent`, `hero-network.ts`, `HeroSceneMount`). This is considered,
  on-brand, already-good work. Refine and extend it; don't simplify, demote,
  or genericize it without a specific, demonstrated reason.
- On-page stats are meant to be **derived from real data, never hardcoded**
  — see `REDESIGN-PROGRESS.md` for a live list of exceptions found and fixed.
- Guardrail tests must stay green: `interlink-coverage.test.ts`,
  `compound-coverage.test.ts`, `content-integrity.test.ts`,
  `citation-freshness.test.ts`, `synergy-coverage.test.ts`, and others. Run
  before and after every change. Never weaken a test to make a change pass —
  fix the change instead.
- `GuideVerifiedPick` intentionally renders nothing if either the evidence
  tier or the verified product is missing, specifically so a buy button never
  sits beside a fabricated or absent tier. Preserve this invariant.
- Trust/legal pages already exist and are substantial: `/about`, `/contact`,
  `/partnerships`, `/trust`, `/trust/methodology`, `/trust/sponsorship`,
  `/trust/disclaimers`, `/editorial-policy`, `/corrections`, `/health-data`,
  `/privacy`, `/terms`, `/faq`, `/site-map`. Audit and elevate — don't treat
  "build a trust/methodology page" as new work.
- Current copy voice is restrained, editorial, precise, explicit about
  uncertainty. Match it in anything new or rewritten — hypey/sales-forward
  language would be a regression.
- `git log` on this repo has unusually detailed, reasoned commit messages —
  read them; they're a real source of "why something is built the way it is."

**Read `git log --oneline -50` and recent full commit messages before forming
any opinion about what needs to change.** Approach this as an audit of a
mature, actively-multi-session-developed codebase, not a rescue of a rough one.

## 3 — SSR/CSR rendering bug — STATUS: verified & fixed in Phase 0

*(Original text below described a hypothesis to verify. It has now been
investigated end-to-end; see `REDESIGN-PROGRESS.md` for the confirmed root
cause, the fix that landed, and how it was verified. Kept here for the
verification method, in case a future refactor needs the same check re-run.)*

Before any visual or content work, verify server-rendered pages actually ship
their body content in the initial HTML. Symptom pattern: a route returns rich
content when fetched, another route returns almost nothing (only `<head>`
meta + a skip-link). Confirm with:
`curl -s <url> | grep -c "<some known body text>"` — a near-zero match count
means the page body isn't in the server response. If confirmed, trace which
client-side hook/provider is forcing a Suspense boundary to bail to
client-only rendering (a `useSearchParams()`/similar call with no local
`<Suspense>` wrapper is a common cause), fix it, and re-verify by building and
inspecting `.next/server/app/**/*.html` for the absence of React's
`BAILOUT_TO_CLIENT_SIDE_RENDERING` marker immediately after the page shell.
Re-run Lighthouse/Core Web Vitals after any fix — this class of bug usually
also hurts LCP.

## 4 — Also verify (status per pass, see REDESIGN-PROGRESS.md for current findings)

- Hub-page metadata inheritance (pages returning the homepage's canonical/title).
- Sitewide-duplicated JSON-LD schema (needs page-scoping).
- Sitemap hygiene (`lastmod`, canonicals).
- Compound-count stat consistency — trace every displayed count to the same
  source and make them agree, with a visible label naming which population
  each number describes when more than one population exists in the codebase.

## 5 — Safety rails (non-negotiable)

- Never work directly on `main`. Branch per initiative of work.
- Never commit secrets or `.env` values.
- Run `install`, `lint`, `typecheck`, `build`, and the existing test suite
  after every meaningful change. Fix failures before moving forward — don't
  stack unverified work.
- Read build/deploy logs fully on any failure before attempting a fix.
- Keep production untouched until a phase is verified green on a preview
  deployment.
- Push the branch and open a PR when a phase is done. Don't merge to `main`
  or trigger a production deploy without telling Thomas it's ready — a
  one-line "PR #N is up, checks are green, ready to merge" is enough.
- Give a rollback path in every phase report: the PR/commit to revert to, and
  the exact command (`git revert <sha>`, or redeploy the previous Vercel
  deployment).
- Never weaken a guardrail test to make a change pass.

## 6 — How to use a creative/redesign brief: audit, don't rebuild

When handed a detailed creative-direction brief, treat it as a **quality bar
and gap finder**, not a from-scratch spec. Much of what a brief like this asks
for usually already exists in some form, at a high standard, because this
codebase has been under continuous, careful development.

**For every item in a brief, apply this decision rule:**
1. Does something like this already exist? Check the actual code and the live
   page, not just the homepage.
2. If yes — does it clear the bar the brief describes? If it does, leave it
   alone. If it's close, refine it. If it's meaningfully short, say
   specifically why and fix that gap.
3. If no — build it, following the brief's spec, `STYLE_GUIDE.md`, and the
   voice/conventions in Section 2.
4. Never delete or replace working, tested functionality without first
   understanding why it was built that way (`git log` on the relevant files
   first).

## 7 — Visual system: audit checklist

- Base palette as named tokens, not scattered hex.
- Type scale documented for mobile + desktop with a deliberate display/body
  pairing.
- Evidence-tier color coding should read as a coherent, deliberate scale —
  verify it's applied consistently everywhere a tier renders, not just in one
  canonical component.
- `prefers-reduced-motion` respected everywhere, including 3D/drag/scroll
  hero controls.
- Visible keyboard focus on every interactive element, including hero controls.
- `.premium-card` used consistently; extend to any straggler still using ad
  hoc card markup.
- Accessibility: re-run whatever a11y check is available regularly — a lot of
  content ships between checks; don't assume a past-clean result still holds.

Avoid the common "this looks AI-generated" tells: warm-cream +
high-contrast-serif + terracotta; near-black + single acid-green/vermilion
accent; broadsheet hairline-rule zero-radius layout regardless of subject.
Protect subject-grounded, distinctive design (real molecule geometry, real
data-driven visualizations) — don't flatten it toward a generic dark-SaaS
look in the name of "polish."

## 8 — Homepage: audit checklist (not a rewrite)

Don't rewrite the homepage wholesale. Check specifically:
1. Is the evidence-grading explanation genuinely understandable in the hero
   itself, or does it require a click through to make sense?
2. Is there a fast path to "just show me the evidence" for a user who doesn't
   want the cinematic scroll — genuinely one click from the top?
3. Section count/order — audit for redundant CTAs repeating the same action
   with different labels across sections.
4. Any new or rewritten copy must match the existing voice — no invented
   headline replaces a working one without a specific, stated reason tied to
   a real gap found above.

## 9 — Information architecture: audit checklist

- Map every current nav item and every route to a clear intent bucket
  (Learn / Explore / Mechanism / Evidence / Build / Track / Shop / Trust).
  Anything that doesn't map cleanly, or maps to two buckets at once, is a
  candidate for relabeling — don't restructure on a hunch, restructure on
  this mapping.
- Confirm every compound, hallmark, guide, and protocol page is reachable
  from navigation — the interlink-coverage guard enforces this
  programmatically; fix human-facing labeling issues without breaking the
  underlying graph.

## 10 — Evidence module: standard to check pages against

The bar for a complete compound/intervention evidence module: what it is ·
best-supported use cases · evidence strength by outcome · human studies ·
studied population · dose/form/duration studied · benefits observed · risks
and interactions · who should avoid it · biomarkers to consider ·
uncertainties · references (PMID-linked) · date last reviewed.

Spot-check a Tier A, Tier B, and Tier C deep-dive against the full field list.
Anything genuinely missing gets added *only* by extraction from that
compound's own already-authored content, per `NOTES-COMPOUND-LIBRARY.md` —
never invented.

## 11 — Page templates: spec + audit

| Template | Purpose | Primary intent |
|---|---|---|
| Homepage | Orient + fast-path to evidence | "Is this trustworthy and is it for me?" |
| Compound deep-dive | Full evidence module for one compound | "What does the evidence actually show?" |
| Hallmark/pathway page | Explain one aging mechanism + ranked interventions | "What acts on this mechanism, and how well-supported is it?" |
| "Best for [goal]" page | Curated shortlist for an intent | "What's actually worth it for my goal?" |
| Protocol/stack page | A named stack with rationale | "How do these work together, and what's the dosing?" |
| Product recommendation page | One verified pick per compound | "What should I actually buy?" |
| Lab-analysis page | Turn bloodwork into signal | "What is my data telling me?" |
| Trust/methodology page | Explain grading + independence | "Can I trust this?" |

For each: confirm the actual current state before changing anything, and that
claims trace to derived data, not hand-assertion.

## 12 — Data visualization rules

- Every visualization needs a text/table fallback for accessibility and for
  anyone who wants the fact without the interaction.
- A visualization earns its place only if it changes a decision faster than
  text would.
- Never let a visualization imply a number the underlying data doesn't
  support — label illustrative/modeled curves as such.

## 13 — Priorities (re-rank per pass against what's actually verified true)

1. Fix any confirmed rendering/indexability bug — nothing else matters if
   crawlers/AI answer-engines can't see the pages.
2. Fix any confirmed stat/credibility inconsistency.
3. Re-verify carried-over SEO items.
4. Re-run accessibility checks (tooling permitting).
5. Resolve confirmed nav redundancy.
6. Confirm evidence-module completeness on a sample.
7. Confirm/extend evidence-tier color consistency.
8. Confirm reduced-motion and keyboard-focus support.
9. Audit trust/methodology for standalone understandability.
10. Remaining genuine visual gaps, plus any flagged business decisions —
    those go to Thomas, not executed unilaterally.

## 15 — Reporting format (use after every phase, no exceptions)

1. What you found
2. What you're changing
3. What you changed
4. What passed / failed (paste the actual check output, not a summary)
5. What Thomas needs to do next, if anything (usually just: "PR #N is ready
   to merge" or nothing at all)

## 16 — Rollback protocol

Every phase report includes: the exact commit/PR to revert to, and either
`git revert <sha>` or the Vercel deployment ID to roll back to via dashboard
or the `list_deployments`/redeploy flow. Never leave Thomas without a
one-step way back to the last known-good state.
