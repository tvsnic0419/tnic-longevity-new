# TNiC ROI Improvement Plan

A phased, ROI-ranked program for tnic.help. Each phase is independently
shippable and ordered so earlier phases unlock or de-risk later ones.

## Audit baseline (2026-07-09)

The platform is mature and healthy:

- 153 unit tests passing, clean `typecheck`, clean production build
- 54/55 pages carry route metadata; JSON-LD structured data present
- SEO infra in place: sitemap, robots, IndexNow, per-route OG images
- Affiliate redirect layer (`/api/go/[productId]`) with HTTPS-only guard
- Privacy-first: local-only health data, no cookies, no server DB

### The one gap that caps everything: measurement

The site monetizes through **affiliate clicks** and grows through **email
capture**, yet it ships **zero analytics**. There is no web-analytics
package, no Core Web Vitals telemetry, and the affiliate redirect logs
nothing. Every conversion signal — which products get clicked, which pages
convert, whether the quiz drives stacks, whether a copy change helps — is
currently invisible. You cannot improve an ROI you cannot see, so
instrumentation is Phase 1 and the foundation for validating every later
phase.

---

## Phase 1 — Measurement & conversion instrumentation ✅ (this PR)

**Why first:** turns every subsequent change from a guess into a measured
bet. Highest ROI-per-effort because it is small, safe, and unlocks the rest.

- Cookieless **Vercel Web Analytics** (`@vercel/analytics`) — no PII, no
  cookies, consistent with the site's stated privacy principles.
- **Speed Insights** (`@vercel/speed-insights`) — real-user Core Web Vitals,
  which are a Google ranking factor.
- First-party **affiliate-click tracking** in the `/api/go` edge route —
  server-side `track('affiliate_click', …)` captures the #1 revenue signal
  (product, destination host, companion flag) with no third-party pixel.
- Typed client event helper (`lib/analytics.ts`) with a fixed event union,
  wired into the key conversions: quiz completed, email subscribed,
  stack exported, product click.

### Also in this PR: "prefilled stack" quality fix

A persisted stack follows the visitor across every hub page as ambient OS
status ("6/12 hallmarks · your stack"), which reads as phantom/pre-filled
progress on a return visit — and the dashboard onboarding simultaneously
said "build your stack," contradicting the status bar. (A genuinely
first-time visitor already sees a clean 0/12; confirmed in a fresh browser.)
Per the chosen direction — keep persistence, add an easy reset — this PR:

- adds a one-click **Reset** control to the OS status bar (shown only when a
  stack exists) that returns the OS to a clean 0/12, with an **Undo** toast so
  nothing is lost by accident;
- makes the dashboard onboarding honest — any non-empty stack now counts as
  "stack built," so the status bar and the getting-started strip agree.

## Phase 2 — Core Web Vitals & performance

**Why:** CWV is both a ranking factor and a conversion factor; Phase 1's
Speed Insights makes the wins measurable.

- Audit the 167 client components; hoist static, non-interactive sections to
  server components (smaller First Load JS on landing pages).
- Defer/lazy-load below-the-fold heavy widgets (network graphs, charts).
- Verify LCP image handling and font loading on top landing pages.

## Phase 3 — SEO depth & discoverability

**Why:** organic search is the traffic engine for an education/affiliate
site; compounding, durable ROI.

- Add explicit metadata to the few pages inheriting only root defaults
  (`/library`, quiz-share presets).
- Expand structured data: `FAQPage`, `BreadcrumbList`, `Product`/`Review`
  where warranted.
- Strengthen internal linking between guides, library modules, and compare
  pages.

## Phase 4 — Conversion-rate optimization

**Why:** with Phase 1 telemetry live, iterate on the funnel with evidence.

- Tighten quiz → stack → shop handoff; measure drop-off per step.
- A/B-friendly CTA hooks on the highest-traffic landing pages.
- Email-capture placement and copy experiments.

## Phase 5 — Code quality & CI hardening

**Why:** protects the velocity of every phase above.

- Re-enable lint in CI incrementally (currently excluded for pre-existing
  debt); burn down the debt behind it.
- Extend unit coverage on `lib/` business logic that drives recommendations.
