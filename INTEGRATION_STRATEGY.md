# TNiC Integration Strategy

`feature/priority-upgrades` → `tnic-help` main

**Decision:** Strategy A — selective cherry-pick (not rebase).  
**Canonical repo:** `tvsnic0419/tnic-help` (production at https://tnic.help)  
**Mirror repo:** `tvsnic0419/tnic-longevity-platform` — `main` synced to match `tnic-help` main.

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

- Single source of truth: `tnic-help`
- Archive `tnic-longevity-platform` after integration with README redirect (manual GitHub setting)
- Sprint commits: `feat: Sprint NN — [area]: [description]`

## Open product decisions (resolved)

1. **Rx compounds in Elite 8** — included with disclaimers (not OTC-only scope)
2. **LQ weights** — disclosed as editorial TNiC consensus, not peer-reviewed meta-score
3. **Affiliate revenue** — any future links must use `/products` pattern only
4. **Self-heal vs Vercel cron** — independent GitHub Actions only; no Vercel cron interaction