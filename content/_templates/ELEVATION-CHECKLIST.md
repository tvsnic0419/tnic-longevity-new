# TNiC Library Elevation Checklist

Use this when rewriting any MDX module to Examine.com-tier quality with TNiC OS integration.

## Quality bar

- [ ] **TL;DR** blockquote: 3 sentences (biology → intervention → tracking)
- [ ] **Scannable tables** for mechanisms, evidence, dosing, biomarkers (not walls of prose)
- [ ] **Numbered sections** matching template (`## 1.` for compounds/stacks; `## What this hallmark means` for hallmarks)
- [ ] **Internal links** to real TNiC routes (`/library/...`, `/stacks`, `/labs`) — no dead `#anchors`
- [ ] **Tier honesty** — distinguish human RCT vs preclinical vs modeled

## Required MDX directives (minimum per file)

### All types
- [ ] `:::evidence tier="A|B|C"` — one anchor citation with PMID or journal
- [ ] `:::practical title="..."` — actionable protocol or inclusion criteria
- [ ] `:::redflag title="..."` — hard stops with physician escalation
- [ ] `:::decision title="..."` — decision tree (`node |`, `yes |`, `no |`, `redflag |`)
- [ ] `:::cta href="..."` — at least one Labs or Stacks CTA

### Hallmarks (12)
- [ ] `:::hallmark type="..."` — position in aging network
- [ ] `:::pathway` — mechanism diagram
- [ ] Failure mode table (3+ rows)
- [ ] Intervention hierarchy (numbered list)
- [ ] `:::compare` — before/after biomarker or subjective panel
- [ ] `:::personal` — N=1 log table + win/plateau/adverse criteria
- [ ] Synergy table linking to stack guides

### Compounds (7)
- [ ] `:::pathway` — synthesis/signaling diagram
- [ ] Evidence table (study, design, N, duration, outcomes, tier)
- [ ] Dosing table + week-one checklist
- [ ] Monitoring table + `:::compare` trajectory
- [ ] Synergy table with stack links
- [ ] `:::personal` — dose/biomarker/energy log

### Synergy stacks (3)
- [ ] Layer table with analogies + gap analysis bullets
- [ ] `:::visual` — diagram brief for designers
- [ ] `:::pathway` — stack flow
- [ ] AM/PM choreography table
- [ ] Budget tier table
- [ ] `:::warning` — soft cautions (GI, taste, timing)
- [ ] Compliance + response criteria in `:::personal`

### Lifestyle (4) + Guides (1)
- [ ] Hallmark mapping table
- [ ] `:::practical` — weekly protocol
- [ ] `:::decision` — when to prioritize vs defer supplements
- [ ] Labs/proxy metrics to log

## Elevation status (2026-07-18)

Verified by section count (`## N.` headers) against the 8-section template per
type, plus spot-reads of every file previously marked incomplete. All 40
content files are structurally elevated — no partial files remain. This
supersedes the 2026-06-16 table below, which had drifted: it tracked only 6 of
18 compounds and 3 of 5 synergies, and flagged `rapamycin.mdx`/`tudca.mdx` as
needing work when both were already fully elevated (Rx disclaimer directives
and all).

Known real content gaps — tracked here instead, so this file stays a source of
truth rather than pointing at already-finished work:
- Only 5 of 18 compounds participate in Stack Architect's synergy/breadth
  scoring (`lib/data.ts`). This is **deliberate**, not a gap to close blind —
  NR, grape seed, and TUDCA each say so explicitly in their own MDX ("not a
  native Stack Architect compound"); rapamycin has its own Rx-gated path via
  `rxCompoundCatalog` in `lib/stacks-library.ts` instead. Don't add these four
  to `lib/data.ts`'s `compounds` array without revisiting that editorial call
  first.
- 13 of 18 compounds still lack a dedicated synergy deep-dive for pairings
  their own "Synergies" table already names (5 dedicated pages exist against
  18 compounds' worth of table-cell claims).

| File | Status |
| --- | --- |
| `hallmarks/mitochondrial-dysfunction.mdx` | ✅ Flagship |
| `hallmarks/genomic-instability.mdx` | ✅ Elevated |
| `hallmarks/chronic-inflammation.mdx` | ✅ Elevated |
| `hallmarks/cellular-senescence.mdx` | ✅ Elevated |
| `hallmarks/loss-of-proteostasis.mdx` | ✅ Elevated |
| `hallmarks/telomere-attrition.mdx` | ✅ Elevated |
| `hallmarks/epigenetic-alterations.mdx` | ✅ Elevated |
| `hallmarks/disabled-autophagy.mdx` | ✅ Elevated (cross-links H12) |
| `hallmarks/disabled-macroautophagy.mdx` | ✅ Elevated (cross-links H5) |
| `hallmarks/stem-cell-exhaustion.mdx` | ✅ Elevated |
| `hallmarks/altered-intercellular-communication.mdx` | ✅ Elevated |
| `hallmarks/dysbiosis.mdx` | ✅ Elevated |
| `compounds/glynac.mdx` | ✅ Flagship |
| `compounds/nmn.mdx` | ✅ Elevated |
| `compounds/sulforaphane.mdx` | ✅ Elevated |
| `compounds/resveratrol.mdx` | ✅ Elevated |
| `compounds/rapamycin.mdx` | ✅ Elevated (Rx disclaimer + educational-only framing throughout) |
| `compounds/tudca.mdx` | ✅ Elevated (explicitly library-only, not a Stack Architect toggle — by design) |
| `compounds/berberine.mdx` | ✅ Elevated |
| `compounds/cakg.mdx` | ✅ Elevated |
| `compounds/coq10.mdx` | ✅ Elevated |
| `compounds/fisetin.mdx` | ✅ Elevated |
| `compounds/grapeseed.mdx` | ✅ Elevated (explicitly not a Stack Architect toggle — mixed meta-analysis evidence, by design) |
| `compounds/nr.mdx` | ✅ Elevated (explicitly not a Stack Architect toggle — defers to NMN, by design) |
| `compounds/omega3.mdx` | ✅ Elevated |
| `compounds/pterostilbene.mdx` | ✅ Elevated |
| `compounds/rala.mdx` | ✅ Elevated |
| `compounds/spermidine.mdx` | ✅ Elevated |
| `compounds/taurine.mdx` | ✅ Elevated |
| `compounds/urolithina.mdx` | ✅ Elevated |
| `synergies/glynac-nrf2-triad.mdx` | ✅ Flagship |
| `synergies/nad-mito-stack.mdx` | ✅ Elevated |
| `synergies/nmn-resveratrol-sirt1.mdx` | ✅ Elevated |
| `synergies/berberine-resveratrol-ampk-sirt1.mdx` | ✅ Elevated |
| `synergies/coq10-rala-redox-recycling.mdx` | ✅ Elevated |
| `lifestyle/sleep.mdx` | ✅ Elevated |
| `lifestyle/exercise.mdx` | ✅ Elevated |
| `lifestyle/nutrition.mdx` | ✅ Elevated |
| `lifestyle/stress.mdx` | ✅ Elevated |
| `guides/testing-and-monitoring.mdx` | ✅ Elevated |

<details>
<summary>Superseded 2026-06-16 table (kept for history)</summary>

| File | Status |
| --- | --- |
| `hallmarks/mitochondrial-dysfunction.mdx` | ✅ Flagship |
| `hallmarks/genomic-instability.mdx` | ✅ Elevated |
| `hallmarks/chronic-inflammation.mdx` | ✅ Elevated |
| `hallmarks/cellular-senescence.mdx` | ✅ Elevated |
| `hallmarks/loss-of-proteostasis.mdx` | ✅ Elevated |
| `hallmarks/telomere-attrition.mdx` | ✅ Elevated |
| `hallmarks/epigenetic-alterations.mdx` | ✅ Elevated |
| `hallmarks/disabled-autophagy.mdx` | ✅ Elevated (cross-links H12) |
| `hallmarks/disabled-macroautophagy.mdx` | ✅ Elevated (cross-links H5) |
| `hallmarks/stem-cell-exhaustion.mdx` | ✅ Elevated |
| `hallmarks/altered-intercellular-communication.mdx` | ✅ Elevated |
| `hallmarks/dysbiosis.mdx` | ✅ Elevated |
| `compounds/glynac.mdx` | ✅ Flagship |
| `compounds/nmn.mdx` | ✅ Elevated |
| `compounds/sulforaphane.mdx` | ✅ Elevated |
| `compounds/resveratrol.mdx` | ✅ Elevated |
| `compounds/rapamycin.mdx` | ⬜ Needs Rx disclaimer pass |
| `compounds/tudca.mdx` | ⬜ Partial |
| `synergies/glynac-nrf2-triad.mdx` | ✅ Flagship |
| `synergies/nad-mito-stack.mdx` | ✅ Elevated |
| `synergies/nmn-resveratrol-sirt1.mdx` | ✅ Elevated |
| `lifestyle/sleep.mdx` | ✅ Elevated |
| `lifestyle/exercise.mdx` | ✅ Elevated |
| `lifestyle/nutrition.mdx` | ✅ Elevated |
| `lifestyle/stress.mdx` | ✅ Elevated |
| `guides/testing-and-monitoring.mdx` | ⬜ Template pass pending |

</details>

## Rewrite workflow (per file)

1. Copy matching `TEMPLATE-*.mdx` into target path
2. Pull interventions from `lib/hallmarks-library.ts` for that hallmark
3. Pull compound data from `lib/data.ts` (dose, hallmarks, synergies)
4. Add 2+ internal links to OS surfaces (dashboard, labs, stacks)
5. Run `npm run build` — MDX loads via `lib/mdx.ts`
6. Spot-check in browser: directive rendering, table scroll, decision tree indent

## Visual hierarchy rules

- One idea per `##` section — max 3 paragraphs before a table or directive
- Bold **only** for decision-critical terms (dose, duration, retest week)
- Use `>` TL;DR and directive blocks to break gray text monotony
- End every module with `:::personal` + `:::cta` — ties content to Longevity OS