# UI Audit Notes — 2026-08-28

## Live homepage first-screen review

- The loaded homepage has a strong premium science visual system: molecule-field background, clear evidence-led positioning, and a high-contrast primary dashboard CTA.
- Primary intent is split across four statistic links, three journey cards, an adjacent dashboard CTA, and the navigation. The hierarchy is polished but a first-time visitor must decide among multiple parallel next steps.
- The hero’s principal conversion routes are `Elite Eight`, `The Library`, and `NICO Starter`; the language is distinct but the cards are relatively compact and the active visual state does not clearly establish a single recommended starting point.
- The persistent right-side chapter rail is visually small, duplicated by compact top controls, and competes with the main route selection without offering clear progress or utility on the initial viewport.
- The product discovery/content hierarchy appears intentionally evidence-forward: evidence tiers, citation counts, studied dose, and verified product links are all exposed. The broader audit should preserve this clinical-trust behavior while reducing decision friction.

## Technical baseline

- Repository: `tvsnic0419/tnic-longevity-new`; default branch: `main`.
- The app uses Next.js 16.3.3 / React 19.2.4 / Tailwind 4 and has local `npm ci` dependencies installed.
- Codebase rules require consulting installed Next documentation and preserving small client-component boundaries.
- Existing documentation shows major prior work in analytics, performance, SEO and WCAG AA; changes should be incremental and clearly user-facing rather than duplicate that work.

## Library and NICO review

- **Library hub:** The top section provides an attractive evidence-led entry, but the visitor sees at least four separate actions before getting to the content (`Find your personalized stack`, Stack Architect, a 3-step research path, and comparison / prioritization / mapping shortcuts). The interface therefore needs an explicit default action and better task-based orientation.
- **Library hub:** Hallmark selection, personal-notes controls, intervention-type filters, compound-only checkbox, search, suggested queries, and evidence-tier buttons form a powerful but dense panel. The order can be simplified around the main search and the primary filter choices, with secondary controls visually contained.
- **NICO:** The questionnaire’s first question is exceptionally clear, limited to seven goal cards with a visible stepper. The main opportunity is confidence/completion support: state why the question is asked, show a brief privacy/safety cue at the decision point, and make the next step’s commitment more concrete. This is a safe high-ROI refinement because it affects guided-stack completion without changing recommendation logic.
- **Global:** Both hubs retain the same broad header and small right-edge section rail. In the library, the extra local top navigation plus global navigation create a crowded first 100 pixels. A compact, context-sensitive presentation would protect content space on research-heavy routes.

## Product and stack-workflow review

- **Products:** The hero articulates the value proposition clearly: one vetted product per compound, dose/form matching, independent selection, and disclosure. The strongest friction is the gap between the hero’s broad `Open the Protocol Shop` CTA and the visitor’s likely need to identify a product for a specific goal or compound; goal-led discovery and an obvious `evidence → product` route should be surfaced nearer the top.
- **Products:** The product cards already make the core trust signals available (evidence tier and evidence module) but the action is largely icon-only in the page extraction, and long lists of library-only compounds follow verified picks. The UI should clearly distinguish `verified pick` from `research-only` content while making the safe manufacturer handoff predictable.
- **Stacks:** The landing experience cleanly explains three entry paths (NICO, curated protocol, build from scratch) and is one of the strongest task-orientation patterns in the product. Several promotional links, a Combination Lab announcement, and a multi-tool grid arrive before the builder tabs, though, adding scanning cost after the visitor has already selected a goal. The screen would benefit from a compact task rail and a stronger active-state explanation at the tabs.
- **Cross-flow opportunity:** NICO, the Library, Products, and Stacks each have good individual starting points, but the site needs more visible continuity after the visitor commits to one: structured handoffs with selected-context copy, persistent saved-query / saved-stack cues, and cohesive primary actions.

## Local production QA — library

The local production build renders the revised library sequence correctly. Search now appears directly below the cinematic overview, before the hallmark atlas and associated research controls. The promoted `GlyNAC` suggestion updated the URL to `?q=GlyNAC`, populated the search field, and returned 19 grouped results, including the compound, a comparison, the deep-dive, and relevant evidence context. The state-aware navigation rendered `Start your stack` as the filled action and `My dashboard` as the secondary action in a browser without a saved stack.

## Local production QA — products

The local production page renders the product-filter panel as intended, with five goal options, three evidence options, a live verified-pick count, and the research-only catalogue collapsed behind a native disclosure control. Each verified product has a persistent `Verify on <brand>` label on its product image plus a clear `Verify pick` action near the dose note, while the existing evidence-module link remains independently accessible. The visual hierarchy keeps the educational decision steps and COA warning ahead of the external manufacturer destination.

During product-filter QA, the first automated activation did not change the rendered goal selection. A DOM state check confirmed that `All verified picks` remained selected, so the interaction will be retried against the current rendered control before the flow is marked complete.

The product-filter interaction was then confirmed directly against the rendered control: choosing `Energy & mitochondria` selected that goal and reduced the live count from 10 to 7 verified picks. The earlier no-change result was caused by a mis-targeted browser coordinate rather than an application defect.

## Local production QA — stack handoff

The final production build correctly parses the representative NICO handoff (`glynac,nmn`), persists the two-compound stack, and redirects attention to the live Builder. The context-aware navigation changes to `Dashboard` and `Refine with NICO` once a stack exists. The incoming configuration panel exposes distinct `Verify this stack` and `Score this configuration` actions with selected-compound query parameters, and the builder reports the loaded compounds, coverage, score, cautions, and buyer-grade review action. The refined status message avoids repeating the panel’s instructional copy.

## Local production QA — elite component pass

The final Stack Architect view confirms that the new `ActionCard` component provides a materially stronger entry experience: the recommended NICO path uses a focused accent treatment, clear purpose label, outcome text, and directional action marker, while the curated and build paths remain calm supporting options. The component is responsive in a three-column desktop grid and retains strong visual differentiation from the surrounding workbench surface. The upgraded shared decision rail now provides an explicit `Recommended` state and action labels such as `Start here` and `Explore`, which makes the first action more legible without removing alternate routes.

The final library visual review confirms that the upgraded decision rail remains compact and balanced beneath the dedicated evidence-search surface. The recommended search path has a distinct but restrained accent rule and badge, while the two secondary routes preserve equal readability and clear `Explore` calls to action. The shared styling is consistent with the new Stack Architect action cards and retains the product’s evidence-first visual language.

## Live quality audit — homepage stage

The live homepage has strong editorial hierarchy and a polished arrival sequence, but the first scroll into the molecule act currently exposes a large dark stage that can read as empty before or without the canvas render. The explanatory copy remains low-contrast during that state. This is the highest-leverage remaining quality opportunity: the visual stage needs a deterministic, attractive fallback that communicates the molecule/system concept even when the optional canvas is delayed, unsupported, or still initializing.

## Local production QA — homepage stage fallback

The rebuilt local homepage now shows the molecule act as a composed instrument even while the optional renderer initializes. The stage has a visible `Live visual / Molecular structure` label, orbital rings, illuminated nodes, a central core, and a restrained grid, while the live resveratrol canvas renders over the same surface when available. The adjacent data card remains legible and the visual no longer reads as an empty dark rectangle.
