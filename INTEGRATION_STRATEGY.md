# TNiC Production Source and Historical Integration Record

## Active production source — verified 2026-08-27

The production-equivalent TNiC application source is [`tvsnic0419/tnic-longevity-new`](https://github.com/tvsnic0419/tnic-longevity-new) on `main`. Its current commits include the shipped Evidence-in-Flow experience, progressive homepage delivery, and canonical master-guide repair. Its configured origin is `https://github.com/tvsnic0419/tnic-longevity-new.git`.

| Role | Verified reference | Operational rule |
|---|---|---|
| Active application source | `tvsnic0419/tnic-longevity-new` → `main` | Create reviewed feature branches here, merge only approved pull requests into `main`, then verify the production release. |
| Hosting project | `tnic-projects/tnic-help` (`prj_SMGpRy7Dgmk3UOyjgxdKqwBkvtcU`) | Preserve project, environment variables, redirects, domains, and production-branch safeguards. The project name is a hosting identifier, not source-control evidence. |
| Canonical domain | `https://tnic.help` | Verify the apex URL after each production deployment; `www.tnic.help` must redirect to the apex. |
| Deprecated source reference | `tvsnic0419/tnic-help` | Do not use as a release base or deploy from it. |
| Older snapshot | `tvsnic0419/tnic-longevity-platform` | Do not deploy it over the modern production application. |

> **Release safety rule:** Never resolve a repository discrepancy by deploying a legacy snapshot. Confirm the modern production-equivalent source, protect it through a branch and pull request, retain a rollback-capable production deployment, and verify the apex domain after release.

## Historical migration record

The remainder of this file records a June 2026 selective-cherry-pick plan. It is retained for its implementation history, but it is not current deployment instruction. References below to `tnic-help` or `tnic-longevity-platform` are historical and must not supersede the active-source table above.

## Execution status (2026-06-20)

| PR | Scope | Status |
|----|-------|--------|
| PR1 | `.github/workflows/self-heal.yml` (adapted for current production) | ✅ Shipped |
| PR2 | `lib/elite-8-data.ts` + tests | ✅ Shipped |
| PR3 | `/elite-8` route, `Elite8Hub`, SEO/sitemap/tools promo | ✅ Shipped |
| PR4 | Taurine, Spermidine, Pterostilbene in `lib/data.ts` + library MDX | ✅ Shipped |
| PR5 | `nmn-molecular.png`, `longevity-stack` library page | ❌ Rejected |

### PR5 rejection reasons

- **`nmn-molecular.png`** — 24-byte placeholder on feature branch, not a real educational asset
- **`longevity-stack` page** — stub with affiliate disclosure only; does not meet production library standard

## Integrated from feature branch

- **Elite 8 Longevity Quotient** — `/elite-8` with production design tokens, Rx disclaimers, clock confidence labels, head-to-head compare, weight tuner
- **Self-heal workflow** — monitors homepage, key routes, branding markers, www redirect
- **Tier B compounds** — Taurine, Spermidine, Pterostilbene in `lib/data.ts`, `lib/library-modules.ts`, hallmark mappings, MDX deep-dives

## Rejected (do not port)

- `ResilienceQuiz.tsx` — duplicates `/quiz`
- `StackBuilder.tsx` — duplicates Stack Architect
- `ProductCard.tsx` — affiliate CTAs conflict with zero-commission shop
- `Hero.tsx` — production hero is quiz-personalized
- Cream/light hex palette (`#F8F5EE`, `#1A3A2A`) — incompatible with dark cinematic shell
- Feature branch git history — unrelated root commit; cherry-pick only

## Governance

- Current source of truth: `tnic-longevity-new` → `main`; the prior `tnic-help` reference is deprecated.
- Treat `tnic-longevity-platform` as an older snapshot; do not use it as a production release base.
- Sprint commits: `feat: Sprint NN — [area]: [description]`

## Open product decisions (resolved)

1. **Rx compounds in Elite 8** — included with disclaimers (not OTC-only scope)
2. **LQ weights** — disclosed as editorial TNiC consensus, not peer-reviewed meta-score
3. **Affiliate revenue** — any future links must use `/products` pattern only
4. **Self-heal vs Vercel cron** — independent GitHub Actions only; no Vercel cron interaction