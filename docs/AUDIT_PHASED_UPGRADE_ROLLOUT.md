# TNiC Audit & Phased Upgrade Rollout (2026-07-11)

A full-depth technical audit — security, Next.js 16 API currency, dependency
health, and CI/code-quality hygiene — plus the phased rollout of fixes. This
sits alongside `ROI_IMPROVEMENT_PLAN.md` (product/growth ROI) and
`GROWTH_ROADMAP.md` (traffic/revenue); this document is the engineering
health/security counterpart.

**Scope:** every `app/api/**` route, `middleware`/proxy, `next.config.ts`,
`lib/` security-adjacent modules (secrets, OAuth, webhooks), dependency tree,
and the CI pipeline. Verified against the actual installed `next@16.2.9`
docs bundled in `node_modules/next/dist/docs/` (per `AGENTS.md` — this repo
runs ahead of the assistant's training data).

**Method:** installed deps fresh (`npm ci`), ran the real pipeline
(`lint`/`typecheck`/`test`/`build`), read every API route and its supporting
`lib/` modules line by line, cross-checked build warnings against the
bundled Next.js docs, and grep-audited for common defect classes
(`dangerouslySetInnerHTML`, secret comparisons, CSP, Dependabot).

---

## Phase 0 — Critical fixes (shipped in this PR)

### 🔴 Critical — cross-visitor health-data exposure via `GET /api/labs/partner/events`

The lab-partner webhook (`/api/labs/partner/webhook`) records every
completed panel's real biomarker payload (GSH, HS-CRP, NAD index, etc.) into
a shared in-memory, 2-hour ring buffer, tagged by `order_id`. The polling
endpoint `GET /api/labs/partner/events` read from that buffer with **no
authentication at all**, and — critically — treated the `order_ids` query
filter as optional. Any unauthenticated request with no `order_ids` (or a
guessed one) returned every visitor's recent lab results platform-wide,
directly contradicting the site's documented "privacy-first: local-only
health data, no server DB" posture (`ROI_IMPROVEMENT_PLAN.md`) — the client
believes nothing sensitive persists server-side, but it did, and it was
readable by anyone.

**Fix:** the route now requires (a) the caller's own OAuth Bearer token,
validated the same way `/api/labs/partner/order/status` already validates
it, and (b) a non-empty `order_ids` filter — the "give me everything" mode
is removed entirely. `useLabOrderWatcher.ts` (the only caller) now sends its
already-held Bearer token. Added `app/api/labs/partner/events/route.test.ts`
asserting: no token → 401, no `order_ids` → 400, foreign token → 401, and a
scoped request never returns another order's payload.

**Deferred to Phase 2:** today's fix is on par with `/order/status`'s
existing trust model (a live partner's opaque token isn't independently
re-verified against the partner's own API for this route). When
`longevity-direct` moves from `coming_soon` to actually `live`, extend this
route to confirm each requested `order_id` against the upstream partner
(mirroring `fetchLiveOrderStatus`) before returning its payload.

### 🟠 High — non-constant-time secret comparisons

`GET /api/cron/brief` and `POST /api/labs/partner/webhook` compared
`CRON_SECRET` / `LAB_WEBHOOK_SECRET` with plain `!==`, a timing side-channel
(`lib/brief-unsubscribe.ts` already had the correct `timingSafeEqual`
pattern next to them). **Fixed:** added `safeEqual()` to `lib/env.ts`
(constant-time, length-checked) and switched both routes to it, preserving
the existing "open in dev/preview when secret unset" behavior. Covered by
new tests in `lib/env.test.ts`.

### 🟡 Medium — Next.js 16 deprecation: `middleware.ts` → `proxy.ts`

The build emitted: *"The 'middleware' file convention is deprecated. Please
use 'proxy' instead."* Per the bundled Next 16 docs
(`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`),
Middleware was renamed to Proxy in v16.0.0 — same behavior, new name, own
migration codemod (`npx @next/codemod@canary middleware-to-proxy .`).
**Fixed:** renamed `middleware.ts` → `proxy.ts`, `export function middleware`
→ `export function proxy`, updated the one living-doc reference
(`README.md`); left two dated changelog entries (`lib/trust.ts`,
`lib/next-up.ts`) describing what shipped under the old name at the time —
those are historical records, not living docs, so they're intentionally
untouched. Build warning is gone.

### 🟡 Medium — redundant `next.config.ts` Cache-Control override

The build also warned: *"Custom Cache-Control headers detected for
`/_next/static/(.*)` ... can break Next.js development behavior."* Verified
in `node_modules/next/dist/server/lib/router-server.js:398` that Next.js
already sets `Cache-Control: public, max-age=31536000, immutable` on hashed
static assets natively — the custom header block was a pure duplicate of
already-native behavior. **Fixed:** removed it; only the security-headers
block remains. Build warning is gone.

### 🟢 Low — JSON-LD script-tag hardening

`components/seo/StructuredData.tsx` rendered
`JSON.stringify(schema)` into a `<script>` via `dangerouslySetInnerHTML`
without escaping `<`. All current schema content is authored, not
user-submitted, so this wasn't exploitable today — but it's a one-line,
zero-risk defense-in-depth fix (`<`-escape `<`), applied.

### Dependency patch/minor bumps (same major, zero behavior change expected)

| Package | Before | After |
|---|---|---|
| next | 16.2.9 | 16.2.10 |
| eslint-config-next | 16.2.9 | 16.2.10 |
| react / react-dom | 19.2.4 | 19.2.7 |
| framer-motion | 12.40.0 | 12.42.2 |
| lucide-react | 1.20.0 | 1.24.0 |
| recharts | 3.8.1 | 3.9.2 |
| eslint | 9.39.4 | 9.39.5 |
| vitest | 4.1.9 | 4.1.10 |

Full `lint` → `typecheck` → `test` (186 passing) → `build` (206 routes)
verified green after every change in this phase.

### CI hardening

- `ci.yml`'s lint step had been dropped with a comment claiming
  "pre-existing debt." Re-ran `npm run lint` fresh: **zero errors.** That
  debt no longer exists (or never carried into this working tree) — the
  comment was stale. Re-enabled `lint` and added an explicit `typecheck`
  step to CI and to the local `npm run ci` composite script, closing the
  item `ROI_IMPROVEMENT_PLAN.md` Phase 5 had explicitly left open.
- Added `.github/dependabot.yml` (weekly, npm + GitHub Actions, Next/React
  grouped) — there was no automated dependency-drift detection at all
  before this.

---

## Phase 1 — Next up (recommended, not yet done)

1. **Content-Security-Policy.** `next.config.ts`'s `securityHeaders` cover
   framing/sniffing/referrer/permissions but ship no CSP. Not done in this
   pass because the app has several legitimate inline-script/style users
   (`ThemeScript.tsx`'s FOUC-avoidance script, JSON-LD, Tailwind arbitrary
   values, framer-motion inline styles) — a CSP bolted on without nonce
   wiring would either break those or ship `'unsafe-inline'`, which is
   security theater. Proper fix: generate a per-request nonce in `proxy.ts`,
   thread it to `ThemeScript`/`StructuredData` via a header or context, and
   set `script-src 'self' 'nonce-<x>'`. Worth its own PR with visual QA.
2. **Live-partner event authorization** (see Phase 0 critical-fix note above).
3. **`npm audit`'s 4 moderate findings** — all are `postcss` nested inside
   `next`'s own vendored build tooling
   (`node_modules/next/node_modules/postcss`), matched against a version
   range (`next@9.3.4-canary.0 - 16.3.0-canary.5`) that's a known npm-audit
   false-positive pattern for Next's internal compiler dependency, not a
   runtime dependency your app or its visitors ever execute. **Do not** run
   the suggested `npm audit fix --force` — it downgrades `next` to `9.3.3`.
   Re-check after the next `next` release; if it persists, file upstream.
4. **Rate limiting / abuse protection** on `POST /api/brief/subscribe` and
   `POST /api/labs/partner-import` — both are public, unauthenticated, and
   currently uncapped. Low urgency (no cost-bearing side effects today
   beyond Resend API calls), but worth a Vercel Edge Config or KV-backed
   limiter before traffic scales per `GROWTH_ROADMAP.md` Phase 1.
5. **Demo lab tokens are trivially forgeable** (`validateDemoToken` just
   checks a string prefix). Fine as-is — it's an explicitly-labeled demo
   flow gated behind the same auth bar as everything else in Phase 0 — but
   don't let this pattern leak into the `longevity-direct` live path.

## Phase 2 — Test-coverage depth

Only 24 of 86 `lib/` modules have a co-located test file; the gap
concentrated exactly where Phase 0's bug lived (`lab-partner-oauth.ts`,
`lab-partner-live.ts`, `lab-webhook-events.ts` had zero coverage before this
PR's `route.test.ts`). Recommend, in order: `lib/lab-webhook-events.ts`
(prune/TTL logic), `lib/lab-partner-live.ts` (token-exchange error paths),
`lib/resend.ts` (email-sending fallback chain), `lib/lab-partner-import.ts`
(partner JSON schema edge cases).

## Phase 3 — Deferred majors (do not rush)

`@types/node` (20→26), `typescript` (5→7), `eslint` (9→10) all have major
version jumps available. None are urgent — current majors are fully
supported and passing — but each warrants its own isolated PR with a full
`tsc`/lint re-run and manual smoke test, not a bundled bump. Not attempted
here; bundling a major version with this security/deprecation pass would
make a revert harder if something regresses.

---

## What changed in this PR, at a glance

| Area | Before | After |
|---|---|---|
| `/api/labs/partner/events` | Unauthenticated, unfiltered | Bearer-token + mandatory `order_ids` |
| `CRON_SECRET`/`LAB_WEBHOOK_SECRET` checks | `!==` | `timingSafeEqual` via `safeEqual()` |
| Middleware convention | `middleware.ts` (deprecated) | `proxy.ts` |
| `next.config.ts` | Redundant Cache-Control override (build warning) | Removed; native Next.js caching applies |
| JSON-LD script tag | Unescaped `<` | Escaped |
| CI | `test` + `build` only, lint disabled | `lint` + `typecheck` + `test` + `build` |
| Dependency drift detection | None | `.github/dependabot.yml` |
| Dependencies | next 16.2.9 / React 19.2.4 / … | next 16.2.10 / React 19.2.7 / … (see table above) |
| Test count | 178 | 186 |
