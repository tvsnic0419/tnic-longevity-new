# TNiC UI ROI Improvement Plan

**Scope:** This implementation pass concentrates on the primary journey from arrival to evidence discovery, stack configuration, and verified manufacturer handoff. The changes retain the established evidence-first, privacy-conscious design system and do not alter medical guidance, ranking logic, or recommendation data.

| Priority | Improvement | ROI rationale | Implementation target |
|---:|---|---|---|
| 1 | Make the global filled CTA state-aware | A first-time visitor should begin with a guided starting point, while a returning visitor with an active stack should resume their dashboard. | `components/Nav.tsx` |
| 2 | Consolidate a secondary desktop navigation item into Explore | Removing one competing primary link makes the header easier to scan and protects the main CTA at common desktop widths. | `components/Nav.tsx` |
| 3 | Promote library search directly beneath the library hero | Searching a compound, pathway, or comparison is the highest-intent research action and should not require scrolling through the hallmark atlas first. | `app/library/page.tsx` |
| 4 | Give library search a task-oriented entry treatment | A concise heading, explanation, and intent-led suggestions convert the control from a generic field into a clear research starting point. | `components/library/LibrarySearch.tsx` |
| 5 | Remove the empty research-queue switchboard | A first-time visitor already receives a deliberate research path; a second three-card decision panel creates redundant branching before any content is explored. | `components/library/ResearchQueueShelf.tsx` |
| 6 | Add goal, evidence-tier, and hallmark filters to verified products | Visitors can locate a relevant pick by intent without scanning every product card; transparent filters preserve evidence-led discovery. | `components/shop/ProductsHub.tsx` |
| 7 | Make the verified manufacturer action persistent and explicit | The current product-card purchase indication is hover-only in part of the card. A visible, descriptive action makes the verified destination predictable across touch and desktop input. | `components/shop/ProductsHub.tsx` |
| 8 | Collapse the research-only product catalogue by default | Keeping verified products visually distinct from library-only modules lowers purchase-path cognitive load while retaining full discovery and SEO content. | `components/shop/ProductsHub.tsx` |
| 9 | Make incoming NICO and elite-stack handoffs immediately configuration-focused | Visitors arriving with a selected starting stack should see their handoff status and the builder first, rather than re-evaluate every entry path. | `components/stacks/StacksLibrary.tsx` |
| 10 | Remove the redundant second Stack Builder and move advanced tools after the core workflow | A single builder surface with a focused tab explanation reduces duplicated controls, page weight, and scanning cost before task completion. | `components/stacks/StacksLibrary.tsx` |

## Guardrails

All new actions must meet the existing 44px touch-target, visible-focus, contrast, reduced-motion, and client-boundary standards. Product refinements continue to present affiliate disclosure and manufacturer/COA guidance before the external handoff. The NICO scoring engine, product-pick registry, library content, and stack analysis are out of scope for modification.
