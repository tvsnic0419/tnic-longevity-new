# TNiC Growth Roadmap — toward a multi-million-dollar property

A phased plan to grow tnic.help's valuation. It sits on top of the foundation
already shipped (analytics, performance, accessibility, SEO structured data,
CI hygiene — see `ROI_IMPROVEMENT_PLAN.md`) and is organised around the four
levers that actually move a web property's value.

## How this kind of site is valued

Content/affiliate properties trade at roughly **monthly net profit × a
multiple** (~35–45× monthly for affiliate sites, higher when revenue is
recurring and diversified). So there are four levers, and every phase maps to
one:

1. **Traffic** — grow qualified organic sessions (the profit numerator)
2. **Revenue per visitor** — convert and monetise that traffic better
3. **Revenue quality** — diversify / make it recurring (raises the *multiple*)
4. **Transferable assets** — email list, brand, proprietary tools, clean ops
   (raises the multiple and de-risks a sale)

**Chosen track: traffic-first**, keeping the privacy-first / no-accounts /
free positioning intact, with revenue quick-wins in parallel.

---

## Phase 1 — Organic traffic engine *(lever: traffic)*

The biggest, most durable valuation driver. TNiC's library is data-driven, so
we scale *structure and discoverability* — not thin auto-generated pages.

**Guardrail:** this is YMYL (health) content. The existing comparison/compound
pages are hand-authored with real PMIDs and trial data. We do **not**
mass-generate medical prose. Programmatic work is limited to structure,
interlinking, and metadata derived from already-authored data.

### Shipped

- **Comparison interlinking (topic clusters).** The 15 evidence comparisons
  were a strong buyer-intent asset but weakly linked into the site. Now:
  - each compound deep-dive surfaces a **"Compare {compound}"** card listing
    the comparisons that feature it (derived from each comparison's curated
    `relatedHrefs`, so links can't 404 — guarded by `comparison-relations.test.ts`);
  - each comparison page shows a **"Related comparisons"** section of siblings
    that share a compound, ranked by overlap.
  - Bundle-safe: links are computed server-side and passed as a lightweight
    prop, so the 64 kB `comparisons` module never enters the client bundle.

### Next

- Pillar → cluster internal linking across hallmarks, compounds, and guides.
- CTR-optimised titles/descriptions on the highest-intent templates.
- `FAQPage` schema on comparison/compound pages, composed faithfully from
  existing authored verdicts (no new claims) to win SERP real estate.
- Freshness signals via the Protocol Brief.
- **KPI:** indexed high-intent pages; non-brand organic clicks.

## Phase 2 — Revenue depth *(lever: revenue per visitor)*

Now measurable via the live analytics.
- Funnel A/B on quiz → stack → shop → affiliate click.
- Diversify beyond affiliate (lifts the multiple): sponsorship inventory
  (partnerships infra exists) and productising the existing lab-partner
  integration code in `lib/` into a lead-gen/referral line.
- **KPI:** revenue per 1,000 sessions; % revenue from non-affiliate sources.

## Phase 3 — Audience & retention *(lever: transferable assets)*
- Email lifecycle + segmentation off the Protocol Brief.
- Retention loops via the Longevity OS (saved stacks, milestones, dashboard)
  and the Club feature.
- **KPI:** email list size + engagement; returning-visitor rate.

## Phase 4 — Authority & moat *(lever: multiple / defensibility)*
- E-E-A-T hardening: author credentials, medical-review process, sourcing.
- Package proprietary tools (synergy scoring, hallmark mapping, stack engine)
  as embeddable/shareable link magnets.
- **KPI:** referring domains; branded search volume.

## Phase 5 — Operational maturity *(lever: multiple / due-diligence readiness)*
- Analytics → reporting dashboards + a decision cadence; SEO regression tests;
  expanded `lib/` coverage; uptime monitoring; documented content SOPs.
- **KPI:** revenue/traffic reporting a buyer could diligence in an afternoon.

---

## Strategic fork (revisit later)

Reaching the highest valuation multiples eventually favours **recurring
revenue** (a premium/membership tier), which requires accounts + server infra
and softens the current local-only, free-forever positioning. Deferred by the
traffic-first decision; re-evaluate once traffic and the email list have scaled.
