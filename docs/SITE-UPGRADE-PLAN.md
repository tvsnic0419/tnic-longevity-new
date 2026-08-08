# TNiC site upgrade plan

Five phases, ordered so that anything with legal or trust exposure lands first and cosmetic work lands last. Each phase is independently shippable and independently revertable.

Every item below was found by reading the current codebase, not assumed. Where something is a judgment call rather than a defect, it says so.

---

## Phase 1 — Close the consent gap (do this first)

**The finding.** `@vercel/analytics` is mounted site-wide in `app/layout.tsx`, and `app/api/go/[productId]/route.ts` additionally tracks server-side on every outbound product click. `lib/privacy.ts` already implements consent storage (`readPrivacyConsent` / `writePrivacyConsent`, key `tnic-privacy-consent`), and `components/PrivacyConsentBanner.tsx` is a complete, working banner wired to `PlatformContext`.

**The banner is never mounted.** It has been orphaned since `dfb5472`. So the consent machinery exists, the privacy page at `/privacy` tells visitors they have "a consent choice," and analytics runs regardless of it.

This is the one item on this list with real exposure: a health-adjacent site telling visitors they control tracking while shipping tracking that ignores that control. It also directly contradicts the homepage's own "Data stays on your device" copy.

**Work:**
1. Mount `<PrivacyConsentBanner />` in `app/layout.tsx`.
2. Gate `<Analytics />` on `privacyConsent` — analytics must not load before a choice is made. This needs a small client wrapper, since `layout.tsx` is a server component and consent lives in `PlatformContext`.
3. Gate the server-side `track()` in `app/api/go/[productId]/route.ts`, or drop the identifying detail from it. Decide deliberately: outbound-click counts may be defensible as non-identifying, but that should be a stated decision, not an oversight.
4. Reconcile `/privacy` copy with whatever the code actually does after (1)–(3).
5. Test: consent default off, banner appears, accepting persists and loads analytics, declining keeps it off across a reload.

**Judgment call for the owner:** whether declining should be sticky forever or re-prompt. Recommend sticky.

---

## Phase 2 — Retire or reactivate the orphaned components

Four components are built, styled, and reachable by nobody:

| File | Status | Recommendation |
| --- | --- | --- |
| `components/PrivacyConsentBanner.tsx` | orphaned | **Mount** — Phase 1 |
| `components/ui/SynergyNetworkGraph.tsx` | orphaned | **Reactivate** — see below |
| `components/ui/TiltCard.tsx` | orphaned, superseded by `TiltGlassPanel` | **Delete** |
| `components/home/HomeOSComingSoon.tsx` | orphaned **on purpose** | **Leave alone** — 2026-07 owner directive is in the file |

`SynergyNetworkGraph.tsx` is the interesting one. It is a hand-authored 2D SVG synergy map with pathway coloring (`nrf2` cyan, `nad` emerald, `sirtuin` violet, `ampk` amber, `senolytic` pink), per-edge mechanism notes, a legend, and deep links. It is a genuinely good teaching artifact that nothing renders.

It should not go on the homepage — the hero widget now owns that job (PR #91). It belongs on `/stacks` or `/pathways/[slug]`, where a visitor is already committed to understanding mechanism and a static, readable, print-friendly diagram beats an interactive 3D one.

Its node/edge data is hardcoded, unlike `lib/hero-network.ts`. Before mounting it, port it onto derived data so it cannot drift from the catalog — the same guardrail the hero network already has, and the same one `lib/compound-coverage.test.ts` exists to enforce elsewhere.

Deleting `TiltCard.tsx` is not cleanup theater: two tilt primitives with different behavior is a trap for whoever reaches for the wrong one next.

---

## Phase 3 — Content: make the evidence layer legible

The library is the product; this phase raises how much a visitor learns per screen.

1. **Per-pair synergy coverage.** `getEdgeExplanation` (added in PR #91) now reports its own provenance: `emergent` → `synergy-link` → `derived`. Add a script or test that prints the distribution across every edge in the live network. Every `derived` result is a pair whose "why" is generic — that list *is* the content backlog, ranked by how prominent the pair is (node degree). Author real mechanism text for the top ones into `stackInteractions`; the widget and every other surface pick it up for free.

2. **Evidence-tier transparency.** Tier A/B/C drives node color, ranking, and product picks sitewide, but the grading rubric is not consistently one click away from where a tier is shown. Link tier badges to `/trust/methodology`.

3. **Citation freshness.** `Compound.studies[]` carries `{title, journal, year, pmid}`. Add a test that flags compounds whose newest citation is older than N years — not to auto-update, but to produce a review queue. For a site whose whole claim is "PubMed-backed," a silently stale citation is the failure mode that matters most.

4. **Retire the Longevity OS teaser line.** `components/Footer.tsx:181` still says "· Longevity OS coming soon." That is the last live marketing surface for a name the 2026-07 directive said not to market yet. Either drop the line or get an explicit decision to keep it — right now the codebase contradicts itself in two places.

---

## Phase 4 — Performance and resilience

1. **Homepage weight.** The homepage now mounts several client islands (`HomeDescent`, the hero WebGL scene, `ScrollProgress`, `Nav`). Measure before changing anything: run a production build and record first-load JS for `/`. The 3D chunk is already correctly deferred behind `HeroSceneMount`'s `dynamic(ssr:false)` + capability gate, so it should not appear in the initial bundle — verify that it doesn't rather than assume.

2. **`HomeDescent`.** At ~840 lines with inline `<style>`, it is the largest client component on the critical path. Worth a look at whether its below-fold scenes can be deferred the way the hero scene is.

3. **WebGL context budget.** The homepage can now hold multiple live canvases (`HomeDescent` scenes plus the hero network). Browsers cap concurrent WebGL contexts (commonly ~16) and drop the oldest — which surfaces as a randomly blank canvas. `HeroSceneMount` already disposes its probe context via `WEBGL_lose_context`; audit whether the descent scenes release theirs on unmount.

4. **Reduced-motion coverage.** The hero widget honors it. Confirm the descent scenes do too — this should be uniform, since inconsistent motion handling is worse than none.

---

## Phase 5 — Visual system consistency

Last on purpose: this is the phase where changes are most visible and least load-bearing.

1. **Glass budget.** `GlassPanel`'s own doc comment says to reserve glass for one or two moments per page. Audit the actual count per route — the homepage hero alone uses the float eyebrow, the mid stat row, and the content NICO card. Decide whether that guidance is real (and enforce it) or outdated (and rewrite it). Right now it is documented but not followed, which is the worst of both.

2. **Tier color is load-bearing — verify it in both themes.** A `#34d399` / `#fbbf24` / `#94a3b8` triad carries real meaning across the hero network, the poster, `SynergyNetworkGraph`, and badges. Check contrast in light and dark, and confirm tier is never signaled by color *alone* (the hero panel pairs it with a text label — everywhere else should too, for colorblind visitors).

3. **Hero band composition on mid-widths.** The new synergy stage is tuned for desktop and for the mobile poster. The 768–1024px range — poster, but a wide short container — is worth an explicit look.

4. **Focus-visible sweep.** `.focus-ring` exists and is used in the new work. Sweep interactive elements that predate it, particularly the SVG poster links added in PR #91 and the command palette.

---

## Sequencing

Phase 1 stands alone and should ship on its own branch. Phases 2–5 are independent of each other and can be interleaved. Phase 3's item 1 depends on PR #91 landing, since it reads the provenance field that PR introduces.

Nothing here touches `HomeOSComingSoon.tsx`.
