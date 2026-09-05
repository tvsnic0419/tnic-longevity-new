/**
 * Back-compat shim. The canonical derived-stats source of truth is now
 * `lib/derived-stats.ts` — import from there for new code. This module is
 * kept so existing importers keep working.
 */
export { platformStats, DERIVED_STATS, type PlatformStatCard } from './derived-stats';
