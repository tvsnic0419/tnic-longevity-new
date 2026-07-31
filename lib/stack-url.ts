import { compounds } from './data';
import { stackPresets, type PresetKey } from './presets';

export function isPresetKey(value: string): value is PresetKey {
  return value in stackPresets;
}

/** Parse ?stack= — preset key (starter), nr-only shop mode, or comma-separated compound ids */
export function parseStackParam(param: string): string[] | null {
  const trimmed = param.trim();
  if (!trimmed) return null;

  if (trimmed === 'nr') return [];

  if (!trimmed.includes(',') && isPresetKey(trimmed)) {
    return [...stackPresets[trimmed].ids];
  }

  const ids = trimmed
    .split(',')
    .map((id) => id.trim())
    .filter((id) => compounds.some((c) => c.id === id));

  return ids.length > 0 ? ids : null;
}

export function readStackFromSearch(search: string): string[] | null {
  const param = new URLSearchParams(search).get('stack');
  if (!param) return null;
  return parseStackParam(param);
}

export function buildShopStackUrl(ids: string[]): string {
  return `/shop?stack=${ids.join(',')}`;
}

/**
 * Hand the current stack to the Compound Intelligence Engine. The engine keys
 * compounds by its own ids but carries this module's ids as aliases, so the
 * same comma-separated `?stack=` shape works across both namespaces — see
 * `parseEngineStackParam` in lib/compound-engine-data.ts. Compounds the engine
 * hasn't curated are simply dropped on arrival.
 */
export function buildEngineStackUrl(ids: string[]): string {
  return ids.length > 0 ? `/compound-engine?stack=${ids.join(',')}` : '/compound-engine';
}

export function buildShopPresetUrl(key: PresetKey): string {
  return `/shop?stack=${key}`;
}

export function formatStackParam(ids: string[]): string {
  return ids.join(',');
}