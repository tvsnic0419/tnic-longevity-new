# TNiC site upgrade plan

Five phases, each independently shippable and independently revertable.

Every item below was found by reading the current codebase, not assumed. Where something is a judgment call rather than a defect, it says so.

---

## Phase 1 — The orphaned privacy notice *(corrected — no compliance gap)*

**An earlier revision of this document claimed analytics was running while ignoring a user consent choice. That was wrong, and it is retracted here so nobody acts on it.** The correction, after reading the code rather than inferring from filenames:

- `components/PrivacyConsentBanner.tsx` is **not** an analytics opt-in. It is a notice — *"Local-only health data: labs, stacks, and notes stay in your browser."* Its "Got it" button sets `privacyConsent`, meaning "acknowledged the notice," not "agreed to be tracked."
- The analytics is genuinely **cookieless**. `lib/analytics.ts` documents it, and the server-side `track()` in `app/api/go/[productId]/route.ts` sends only product ID, destination host, and a companion flag — explicitly no visitor identifier.
- `/privacy` describes this accurately. Its "consent choice" line refers to what is kept in `localStorage`, which is correct.

So no promise is being broken, and **gating cookieless analytics behind a local-data acknowledgement would be incoherent** — the banner never asks about analytics. Building that would add a consent prompt implying tracking that does not occur.

**What is actually true, and much smaller:** the banner is finished, styled, accessible UI that was never mounted (orphaned since `dfb5472`). That is a completeness gap, not a compliance one.

**Status: deliberately left dormant** (owner decision, 2026-08). The same local-data promise is already made on `/privacy`, in the footer, and in the homepage's "Data stays on your device" line, so an interstitial is not required. The component stays in the tree, available if an onboarding notice is wanted later.

**Method note worth keeping:** this item was wrong because it was assembled from filenames and a grep for `consent` rather than from reading `PrivacyConsentBanner.tsx` and `lib/analytics.ts` end to end. Findings in an audit document need the same standard of evidence as code.

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

1. **Per-pair synergy coverage — ✅ tooling built, content work outstanding.**

   `npm run synergy:coverage` (`lib/synergy-coverage.ts`, `lib/synergy-coverage.test.ts`) reports the provenance distribution across every edge and prints the backlog ranked by how visible each pair is in the graph.

   **Baseline as of 2026-08:**

   | Source | Edges | |
   | --- | ---: | --- |
   | `emergent` (authored, `lib/relations.ts`) | 7 | pair-specific prose |
   | `synergy-link` (authored, `stackInteractions`) | 3 | pair-specific prose |
   | `derived` (computed fallback) | **41** | true but generic |
   | **Total** | **51** | **19.6% pair-specific** |

   Four in five clickable pairs currently answer "why do these work together?" with a hallmark-overlap sentence. That is honest, but it is not the depth the library promises. The report names the highest-traffic gaps first — `CoQ10 + NMN`, `Taurine + NMN`, `Fisetin + NMN`, `Omega-3 + Trans-Resveratrol` lead the list, all hub pairings a visitor is most likely to click.

   Fixing one is a single `{ type: 'synergy' }` entry in `stackInteractions`; the hero widget and every other synergy surface pick it up with no code change. The test carries an authored-edge floor that ratchets as coverage improves.

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
