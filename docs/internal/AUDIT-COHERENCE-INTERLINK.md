# Audit — coherence + interlink ×20 (2026-09-15)

Branch: `fix/audit-coherence-interlink`  
PR: https://github.com/tvsnic0419/tnic-longevity-new/pull/208

## Audit findings

1. Thin page-connections (explore/trust/policy/about only)
2. Hubs missing PageConnections / ContinueTrail cross-links
3. RecommendedNextSteps linked Build stack to `/dashboard` not `/stacks`
4. Elite-8 palette compare self-linked to `/elite-8`
5. CTA language drift across hubs
6. Shop PageConnections nested inside narrow client island
7. Elite cards lacked stacks/shop verify paths

## Fixes shipped

- Start / Explore / Decide / Verify clusters in `lib/page-connections.ts`
- PageConnections + ContinueTrail on major hubs (dashboard, nico, elite-8, labs, products, protocols, shop, stacks, stacks/lab, tools, pathway-architect, learn, library, bio-age, club, library/systems)
- CTA language: Start with NICO / Explore library / Verify stack
- RecommendedNextSteps + palette compare fixes
- Elite card Open in stacks + Verify stack (`?stack=`)
- `lib/journey-rails.integrity.test.ts` + `lib/page-connections.test.ts`
- This audit note

## Follow-ups (drafted locally, not in this PR tip)

- Hallmarks index ContinueTrail / PageConnections
- Peptides / pathways / head-to-head rails
- `command-palette-index`, `hub-context`, `next-up` expansions

## CI risks

Integrity pins are string-based; multi-rail hubs add DOM but stay SSR-safe. Elite `?stack=` deep links assume existing stacks/shop parsers.
