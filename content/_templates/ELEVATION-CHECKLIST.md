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

## Elevation status (2026-06-16)

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