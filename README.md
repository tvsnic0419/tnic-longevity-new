# TNiC — Evidence-graded longevity library

Independent education platform at **[tnic.help](https://tnic.help)**.

Every compound is graded A–C from human evidence. Citations are PMID-linked.
Commercial relationships cannot buy a grade, a stack position, or a product pick.

## For reviewers (eight minutes)

Send this README or, better, the live brief: **[tnic.help/partnerships](https://tnic.help/partnerships)**.

1. [Home](https://tnic.help/) — the thesis
2. [Library](https://tnic.help/library) — every intervention, graded
3. [Evidence table](https://tnic.help/library/evidence) — the index
4. [GlyNAC deep-dive](https://tnic.help/library/compounds/glynac) — a Tier A module
5. [Methodology](https://tnic.help/trust/methodology) — how a grade is assigned
6. [Sponsorship principles](https://tnic.help/trust/sponsorship) — what money cannot buy

Partnership inquiries: [protocol@tnic.help](mailto:protocol@tnic.help)

## What this repository is

The production Next.js app behind tnic.help. Product contracts live at the root:

| File | Why it is here |
|------|----------------|
| `STYLE_GUIDE.md` | Design system |
| `NOTES-COMPOUND-LIBRARY.md` | Content integrity — no invented mechanism, dose, or PMID |
| `LICENSE` | All rights reserved |
| `docs/` | Public docs index; session logs live under `docs/internal/` |

Internal commercial outreach (target lists, commission tables, email scripts) is **not** in this tree.

## Stack

- **Next.js 16** (App Router) · **React 19** · **Tailwind CSS 4**
- **Vercel** — production hosting, domain, cron (`tnic-projects/tnic-help`)
- **Vitest** — unit tests · **ESLint** — linting

## Local development

```bash
npm install
cp .env.example .env.local   # fill secrets as needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run typecheck` | TypeScript check |
| `npm run ci` | Full CI pipeline locally |

## Deployment

**Production URL:** `https://tnic.help`
**Vercel project:** `tnic-projects/tnic-help`
**Infra reference:** `infra/vercel-project.json`

1. Push to `main` on GitHub → Vercel auto-deploys production
2. PR branches get preview URLs (use their `*.vercel.app` hostname)
3. GitHub Actions runs lint + test + build on every push/PR

Required production env vars are listed in `.env.example`. Canonical domain is the apex `tnic.help` (`www` 308-redirects).

## Project structure

```
app/          # Next.js routes & API
components/   # UI components
lib/          # Business logic, SEO, integrations
content/      # Authored compound / guide MDX
docs/         # Public docs + internal/ session logs
infra/        # Committed deployment metadata (not secrets)
```
