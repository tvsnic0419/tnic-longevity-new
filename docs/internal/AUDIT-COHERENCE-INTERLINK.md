# Audit — coherence + interlink ×20 (2026-09-15)

Branch: `fix/audit-coherence-interlink`

## Audit findings

1. Thin page-connections (explore/trust/policy/about only)
2. Hubs missing PageConnections: labs, products, hallmarks, protocols, stacks, dashboard, library
3. RecommendedNextSteps linked Build stack to /dashboard not /stacks
4. Elite-8 palette compare self-linked to /elite-8
5. CTA language drift across hubs
6. Shop PageConnections nested wrong
7. next-up had no planned items
8. Elite cards lacked stacks/shop paths

## Fixes

- Start/Explore/Decide/Verify clusters in lib/page-connections.ts
- PageConnections + ContinueTrail on major hubs
- CTA language: Start with NICO / Explore library / Verify stack
- RecommendedNextSteps + palette fixes
- Elite card Open in stacks + Verify stack
- Tests + this audit note

## CI risks

Integrity pins are string-based; multi-rail hubs add DOM but stay SSR-safe.
