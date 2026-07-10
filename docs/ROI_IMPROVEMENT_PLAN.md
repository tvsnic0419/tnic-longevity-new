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

## Phase 2 — Core Web Vitals & performance ✅ (shipped)

**Why:** CWV is both a ranking factor and a conversion factor; Phase 1's
Speed Insights makes the wins measurable.

**Shipped — shared-bundle diet.** The biggest, cheapest CWV win turned out to
be removing content-data payloads that always-mounted OS chrome was dragging
into the shared client bundle on every one of ~200 routes:

- The **command palette** and **export kit** rendered eagerly in the root
  layout, pulling the command index (compounds, hallmarks, comparisons,
  library modules) into every page even though they only open on ⌘K / a
  button. A lightweight launcher (`OsOverlays`) now owns the hotkeys/events and
  lazy-loads each overlay via `next/dynamic` on first use.
- **`ContextBar`** renders on nearly every page and imported `route-context`,
  which imported the full `comparisons` (64 kB), `hallmarks-library` (53 kB)
  and `library-modules` (26 kB) modules purely to resolve breadcrumb *titles*.
  A dependency-free `lib/breadcrumb-titles.ts` (slug→title maps, guarded by a
  drift test) replaced those imports.

**Measured result (production build, gzipped initial JS):** −46 to −47 kB on
every content page (~13%), −53 kB on the homepage. Verified in a real browser
that ⌘K, `/`, the Nav search button, Escape/toggle/reopen, and the export kit
all still work.

**Still open for a later pass:**

- Audit remaining client components; hoist static, non-interactive sections to
  server components.
- Defer/lazy-load below-the-fold heavy widgets (network graphs, charts).
- Verify LCP image handling and font loading on top landing pages.

## Phase 3 — SEO depth & discoverability ✅ (largely shipped)

**Why:** organic search is the traffic engine for an education/affiliate
site; compounding, durable ROI.

**Audit finding:** the structured-data layer was already mature — `FAQPage`,
`BreadcrumbList`, `Product`, `HowTo`, `MedicalWebPage`, and `Article` schemas
are all built and wired. The real gaps were social/link-preview coverage and
accessibility, so the sponsor-readiness pass and the accessibility pass below
carried the incremental ROI here.

**Shipped — OG / link-preview coverage.** ~17 metadata-exporting pages that
ship no `opengraph-image` file (partnerships, contact, sponsorship + other
trust children, dashboard, site-map, supplement guides) had *no* social image.
`buildPageMetadata` now supplies a brand-default image, scoped by a
`SEGMENTS_WITH_OWN_OG_IMAGE` list so pages with bespoke images keep them.
Every sitemap page now emits exactly one `og:image`.

**Still open for a later pass:**

- Strengthen internal linking between guides, library modules, and compare
  pages.

## Phase 3.5 — Accessibility (WCAG AA) ✅ (shipped)

**Why:** accessibility is a Google ranking signal, a conversion factor, and a
legal-exposure reducer — and an `axe-core` sweep is objective and measurable.

**Audit:** ran `axe-core` (WCAG 2.0/2.1 A + AA + best-practice) across 15 key
pages. Found 114 color-contrast nodes, plus critical form-label / select-name /
tab-ARIA / link-distinguishability defects and missing landmarks.

**Shipped:**

- **Contrast (114 → 0):** bumped the dark `--color-text-faint` token to meet
  4.5:1 on the `#020811` base (fixes `.text-caption` sitewide); brightened the
  hero/elite `text-white/45` micro-labels; fixed the near-invisible (1.14:1)
  bio-age step indicator; bumped the tab-badge opacity; underlined the
  in-text tool disclaimer links so they no longer rely on color alone.
- **Critical control fixes:** accessible names on the `Slider` range input and
  the bio-age biological-sex `<select>`; valid `aria-controls` target on the
  trust hub tabpanel (`id`/`aria-labelledby`).
- **Landmarks:** `<main id="main-content">` on `/about` and `/partnerships`
  (restoring the skip-link target); wrapped the OS `ContextBar` in a
  complementary `<aside>`; made the fixed section-scroll rail a labelled
  `<nav>`. Resolves every `region` / `landmark-one-main` / `skip-link` finding.

**Result:** only 7 advisory `heading-order` nodes remain (deferred — they need
per-page heading-level judgment). All serious/critical findings cleared.

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
