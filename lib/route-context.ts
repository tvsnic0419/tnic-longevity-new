import type { ThemeAccent } from './design-system';
import { getHubContext, hubContexts, type HubContextEntry } from './hub-context';
import type { LibraryModuleCategory } from './library-modules';
import type { ToolId } from './registry';
import {
  comparisonTitles,
  hallmarkTitles,
  libraryModuleTitles,
  libraryCategoryLabels,
  toolLabels,
  peptideTitles,
} from './breadcrumb-titles';

export type HubKey = keyof typeof hubContexts;

/** Longest-prefix wins — mirrors command palette hub detection */
export const HUB_PATH_MAP: Record<string, HubKey> = {
  '/dashboard': 'dashboard',
  '/stacks': 'stacks',
  '/labs': 'labs',
  '/tools': 'tools',
  '/shop': 'shop',
  '/products': 'products',
  '/elite-8': 'tools',
  '/brief': 'brief',
  '/learn': 'learn',
  '/faq': 'faq',
  '/quiz': 'quiz',
  '/library/compare': 'compare',
  '/library/delivery-systems': 'deliverySystems',
  '/library/top-picks': 'topPicks',
  '/library': 'library',
  '/peptides': 'peptides',
  '/trust': 'trust',
  '/contact': 'contact',
};

export interface BreadcrumbSegment {
  label: string;
  href: string;
}

export interface RouteContext {
  hubKey: HubKey | null;
  hub: HubContextEntry | null;
  breadcrumbs: BreadcrumbSegment[];
  hubLabel: string | null;
}

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  stacks: 'Stacks',
  labs: 'Labs',
  tools: 'Tools',
  shop: 'Protocol Shop',
  products: 'Products',
  brief: 'Protocol Brief',
  learn: 'Learn',
  faq: 'FAQ',
  quiz: 'Nico Questionnaire',
  library: 'Library',
  peptides: 'Peptides',
  trust: 'Trust',
  contact: 'Contact',
  'elite-8': 'Elite 8',
  'site-map': 'Site Map',
  compare: 'Comparisons',
  compounds: 'Compounds',
  synergies: 'Synergies',
  lifestyle: 'Lifestyle',
  guides: 'Guides',
  methodology: 'Methodology',
  disclaimers: 'Disclaimers',
  journey: 'Journey',
  updates: 'Updates',
  'delivery-systems': 'Delivery Systems',
};

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function resolveHubKey(pathname: string): HubKey | null {
  const entries = Object.entries(HUB_PATH_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [prefix, key] of entries) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return key;
    }
  }
  return null;
}

function hubLabelForKey(key: HubKey, pathname: string): string {
  if (pathname.startsWith('/elite-8')) return 'Elite 8';
  if (pathname.startsWith('/faq')) return 'FAQ';
  if (pathname.startsWith('/library/delivery-systems')) return 'Delivery Systems';
  const segment = pathname.split('/').filter(Boolean)[0];
  return SEGMENT_LABELS[segment ?? ''] ?? titleCase(segment ?? key);
}

export function buildRouteBreadcrumbs(pathname: string, searchTab?: string | null): BreadcrumbSegment[] {
  if (!pathname || pathname === '/') return [];

  const crumbs: BreadcrumbSegment[] = [{ label: 'TNiC', href: '/' }];
  const parts = pathname.split('/').filter(Boolean);

  if (parts[0] === 'library' && parts[1] === 'compare' && parts[2]) {
    return [
      ...crumbs,
      { label: 'Library', href: '/library' },
      { label: 'Comparisons', href: '/library/compare' },
      {
        label: comparisonTitles[parts[2]] ?? titleCase(parts[2]),
        href: `/library/compare/${parts[2]}`,
      },
    ];
  }

  if (
    parts[0] === 'library' &&
    parts.length === 3 &&
    ['compounds', 'synergies', 'lifestyle', 'guides'].includes(parts[1])
  ) {
    const category = parts[1] as LibraryModuleCategory;
    const catLabel = libraryCategoryLabels[category] ?? titleCase(parts[1]);
    return [
      ...crumbs,
      { label: 'Library', href: '/library' },
      { label: catLabel, href: `/library/${parts[1]}` },
      { label: libraryModuleTitles[`${category}/${parts[2]}`] ?? titleCase(parts[2]), href: pathname },
    ];
  }

  if (parts[0] === 'library' && parts.length === 2) {
    const hallTitle = hallmarkTitles[parts[1]];
    if (hallTitle) {
      return [
        ...crumbs,
        { label: 'Library', href: '/library' },
        { label: hallTitle, href: pathname },
      ];
    }
  }

  if (parts[0] === 'peptides' && parts.length === 2) {
    return [
      ...crumbs,
      { label: 'Peptides', href: '/peptides' },
      { label: peptideTitles[parts[1]] ?? titleCase(parts[1]), href: pathname },
    ];
  }

  if (parts[0] === 'library' && parts[1] === 'delivery-systems') {
    return [
      ...crumbs,
      { label: 'Library', href: '/library' },
      { label: 'Delivery Systems', href: '/library/delivery-systems' },
    ];
  }

  let path = '';
  for (const part of parts) {
    path += `/${part}`;
    crumbs.push({
      label: SEGMENT_LABELS[part] ?? titleCase(part),
      href: path,
    });
  }

  if (pathname.startsWith('/tools') && searchTab) {
    const toolLabel = toolLabels[searchTab as ToolId];
    if (toolLabel) {
      crumbs.push({ label: toolLabel, href: `/tools?tab=${searchTab}` });
    }
  }

  return crumbs;
}

export function getRouteContext(pathname: string, searchTab?: string | null): RouteContext {
  const hubKey = resolveHubKey(pathname);
  const hub = hubKey ? getHubContext(hubKey) : null;
  const breadcrumbs = buildRouteBreadcrumbs(pathname, searchTab);
  const hubLabel = hubKey ? hubLabelForKey(hubKey, pathname) : null;

  return { hubKey, hub, breadcrumbs, hubLabel };
}

export function accentForRoute(hub: HubContextEntry | null): ThemeAccent {
  return hub?.theme ?? 'cyan';
}