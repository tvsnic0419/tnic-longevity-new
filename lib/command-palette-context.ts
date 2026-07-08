import { compounds } from './data';
import { getHubContext, type HubContext } from './hub-context';
import { resolveHubKey } from './route-context';
import {
  paletteIndex,
  paletteKindLabels,
  searchPalette,
  type PaletteItem,
  type PaletteItemKind,
} from './command-palette-index';
import type { RecentModuleEntry } from './recent-modules';

export interface PaletteGroup {
  label: string;
  items: PaletteItem[];
}

export interface PaletteResults {
  groups: PaletteGroup[];
  flat: PaletteItem[];
  hubHint?: HubContext;
}

function item(
  id: string,
  title: string,
  opts: {
    kind?: PaletteItemKind;
    subtitle?: string;
    href?: string;
    keywords?: string[];
    actionId?: PaletteItem['actionId'];
  } = {},
): PaletteItem {
  return {
    id,
    kind: opts.kind ?? 'action',
    title,
    subtitle: opts.subtitle,
    href: opts.href,
    keywords: opts.keywords ?? [title.toLowerCase()],
    actionId: opts.actionId,
  };
}

function getPageContextItems(pathname: string): PaletteItem[] {
  if (pathname.startsWith('/dashboard')) {
    return [
      item('ctx-dash-labs', 'Log baseline labs', { href: '/labs?tab=input', subtitle: 'Start biomarker tracking' }),
      item('ctx-dash-stacks', 'Open Stack Architect', { href: '/stacks', kind: 'page' }),
      item('ctx-dash-export', 'Export status kit', { actionId: 'export-kit', subtitle: 'Markdown + JSON backup' }),
    ];
  }
  if (pathname.startsWith('/stacks')) {
    return [
      item('ctx-stacks-sim', 'Simulate current stack', { href: '/tools?tab=simulator', kind: 'tool' }),
      item('ctx-stacks-shop', 'Verify picks at Shop', { href: '/shop', kind: 'page' }),
      item('ctx-stacks-labs', 'Log labs for stack markers', { href: '/labs?tab=input', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/labs')) {
    return [
      item('ctx-labs-trends', 'View lab trends', { href: '/labs?tab=trends', kind: 'page' }),
      item('ctx-labs-impact', 'Biomarker impact ranking', { href: '/tools?tab=impact', kind: 'tool' }),
      item('ctx-labs-stacks', 'Adjust stack from labs', { href: '/stacks', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/tools')) {
    return [
      item('ctx-tools-elite8', 'Elite 8 Longevity Quotient', { href: '/elite-8', kind: 'tool' }),
      item('ctx-tools-protocol', 'Build phased protocol', { href: '/tools?tab=protocol', kind: 'tool' }),
      item('ctx-tools-stacks', 'Load stack in Architect', { href: '/stacks', kind: 'page' }),
      item('ctx-tools-labs', 'Import labs for forecasts', { href: '/labs', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/elite-8')) {
    return [
      item('ctx-elite8-compare', 'Head-to-head comparison', { href: '/elite-8', kind: 'tool' }),
      item('ctx-elite8-library', 'Compound evidence modules', { href: '/library', kind: 'page' }),
      item('ctx-elite8-trust', 'Evidence tier methodology', { href: '/trust/methodology', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/library/compare')) {
    return [
      item('ctx-compare-shop', 'Verify winner at Shop', { href: '/shop', kind: 'page' }),
      item('ctx-compare-stacks', 'Load preset in Architect', { href: '/stacks', kind: 'page' }),
      item('ctx-compare-trust', 'Evidence tier definitions', { href: '/trust', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/library')) {
    return [
      item('ctx-lib-compare', 'Evidence comparisons', { href: '/library/compare', kind: 'page' }),
      item('ctx-lib-quiz', '3-min stack quiz', { href: '/quiz', kind: 'page' }),
      item('ctx-lib-delivery', 'Delivery systems guide', { href: '/library/delivery-systems', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/shop')) {
    return [
      item('ctx-shop-stacks', 'Edit stack in Architect', { href: '/stacks', kind: 'page' }),
      item('ctx-shop-compare', 'Compare before buying', { href: '/library/compare', kind: 'page' }),
      item('ctx-shop-trust', 'COA verification methodology', { href: '/trust/methodology', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/products')) {
    return [
      item('ctx-products-shop', 'Stack-filtered verification', { href: '/shop', kind: 'page' }),
      item('ctx-products-library', 'Compound evidence modules', { href: '/library', kind: 'page' }),
      item('ctx-products-brief', 'Subscribe to Protocol Brief', { href: '/brief#brief-subscribe', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/brief')) {
    return [
      item('ctx-brief-research', 'Research Intel feed', { href: '/#research', kind: 'page' }),
      item('ctx-brief-library', 'Open linked modules', { href: '/library', kind: 'page' }),
      item('ctx-brief-rss', 'Subscribe RSS feed', { href: '/brief/feed.xml', kind: 'page' }),
    ];
  }
  if (pathname.startsWith('/trust')) {
    return [
      item('ctx-trust-evidence', 'Evidence tier criteria', { href: '/trust', kind: 'page' }),
      item('ctx-trust-citations', 'Export citation bundle', { href: '/trust', kind: 'page' }),
      item('ctx-trust-updates', 'Platform changelog', { href: '/trust/updates', kind: 'page' }),
    ];
  }
  if (pathname === '/' || pathname === '') {
    return [
      item('ctx-home-quiz', 'Take 3-min quiz', { href: '/quiz', kind: 'page' }),
      item('ctx-home-products', 'Verified product catalog', { href: '/products', kind: 'page' }),
      item('ctx-home-dashboard', 'Open your OS dashboard', { href: '/dashboard', kind: 'page' }),
      item('ctx-home-research', 'Research Intel feed', { href: '/#research', kind: 'page' }),
    ];
  }
  return [
    item('ctx-default-dashboard', 'My Longevity OS', { href: '/dashboard', kind: 'page' }),
    item('ctx-default-library', 'Anti-Aging Library', { href: '/library', kind: 'page' }),
    item('ctx-default-quiz', '3-Min Starter Quiz', { href: '/quiz', kind: 'page' }),
  ];
}

function getStackItems(stackIds: string[]): PaletteItem[] {
  if (stackIds.length === 0) return [];
  const items: PaletteItem[] = [
    item('stack-simulate', 'Simulate your stack', {
      href: '/tools?tab=simulator',
      kind: 'tool',
      subtitle: `${stackIds.length} compounds selected`,
    }),
  ];
  for (const id of stackIds.slice(0, 4)) {
    const compound = compounds.find((c) => c.id === id);
    if (!compound) continue;
    items.push(
      item(`stack-mod-${id}`, `${compound.name} deep-dive`, {
        href: `/library/compounds/${id}`,
        kind: 'compound',
        subtitle: 'Library module',
        keywords: [compound.name.toLowerCase(), id, 'stack'],
      }),
      item(`stack-shop-${id}`, `Verify ${compound.name}`, {
        href: `/shop?stack=${id}`,
        kind: 'action',
        subtitle: 'Buyer checklist',
        keywords: [compound.name.toLowerCase(), 'shop', 'coa'],
      }),
    );
  }
  return items;
}

function recentToPalette(recent: RecentModuleEntry[]): PaletteItem[] {
  return recent.map((r) => ({
    id: `recent-${r.slug}`,
    kind: 'module' as const,
    title: r.title,
    subtitle: 'Recently viewed',
    href: r.href,
    keywords: [r.title.toLowerCase(), r.slug, r.category, 'recent'],
  }));
}

function dedupeItems(items: PaletteItem[]): PaletteItem[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

function boostStackMatches(items: PaletteItem[], stackIds: string[]): PaletteItem[] {
  const stackSet = new Set(stackIds);
  return [...items].sort((a, b) => {
    const aBoost = a.keywords.some((k) => stackSet.has(k)) || stackIds.some((id) => a.href?.includes(id)) ? 1 : 0;
    const bBoost = b.keywords.some((k) => stackSet.has(k)) || stackIds.some((id) => b.href?.includes(id)) ? 1 : 0;
    return bBoost - aBoost;
  });
}

export function getPaletteResults(options: {
  pathname: string;
  query: string;
  stackIds: string[];
  recentModules: RecentModuleEntry[];
  limit?: number;
}): PaletteResults {
  const { pathname, query, stackIds, recentModules, limit = 14 } = options;
  const hubKey = resolveHubKey(pathname);
  const hubHint = hubKey ? getHubContext(hubKey) : undefined;

  const q = query.trim();
  if (q) {
    const searched = searchPalette(q, limit);
    const flat = dedupeItems(boostStackMatches(searched, stackIds));
    return { groups: [{ label: 'Search results', items: flat }], flat, hubHint };
  }

  const pageItems = getPageContextItems(pathname);
  const stackItems = getStackItems(stackIds);
  const recentItems = recentToPalette(recentModules);

  const groups: PaletteGroup[] = [
    { label: 'Suggested here', items: pageItems },
    ...(stackItems.length > 0 ? [{ label: 'Your stack', items: stackItems }] : []),
    ...(recentItems.length > 0 ? [{ label: 'Recent modules', items: recentItems }] : []),
  ];

  const flat = dedupeItems(groups.flatMap((g) => g.items)).slice(0, limit);
  return { groups, flat, hubHint };
}

export { paletteKindLabels, paletteIndex };