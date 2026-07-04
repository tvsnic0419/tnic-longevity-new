<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Infrastructure

- **Production:** `https://tnic.help` on Vercel (`tnic-projects/tnic-help`)
- **Infra reference:** `infra/vercel-project.json` + `README.md` deployment section
- **Env template:** `.env.example` (production requires `CRON_SECRET`, `LAB_WEBHOOK_SECRET`)
- **CI:** `.github/workflows/ci.yml` — test + build on push/PR to `main`
