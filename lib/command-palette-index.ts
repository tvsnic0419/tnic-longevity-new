import { consumerFAQ, glossary, compounds } from './data';
import { hallmarkLibrary } from './hallmarks-library';
import { libraryModules, getModulePath } from './library-modules';
import { evidenceComparisons } from './comparisons';
import { toolsRegistry } from './registry';
import { peptideLibrary } from './peptides-library';

export type PaletteItemKind =
  | 'page'
  | 'tool'
  | 'hallmark'
  | 'module'
  | 'compound'
  | 'peptide'
  | 'compare'
  | 'faq'
  | 'glossary'
  | 'action';

export interface PaletteItem {
  id: string;
  kind: PaletteItemKind;
  title: string;
  subtitle?: string;
  href?: string;
  keywords: string[];
  actionId?: 'export-json' | 'export-kit' | 'purge-data';
}

const hubPages: PaletteItem[] = [
  {
    id: 'page-home',
    kind: 'page',
    title: 'Homepage',
    subtitle: 'Overview and getting started',
    href: '/',
    keywords: ['home', 'start', 'landing'],
  },
  {
    id: 'page-dashboard',
    kind: 'page',
    title: 'My Longevity OS',
    subtitle: 'Personal command center',
    href: '/dashboard',
    keywords: ['dashboard', 'os', 'command center', 'status'],
  },
  {
    id: 'page-quiz',
    kind: 'page',
    title: 'Nico Starter Questionnaire',
    subtitle: 'Personalized stack recommendation',
    href: '/quiz',
    keywords: ['quiz', 'starter', 'beginner', 'onboarding', '3 min', 'entry'],
  },
  {
    id: 'page-library',
    kind: 'page',
    title: 'Anti-Aging Library',
    subtitle: '12 hallmarks and deep guides',
    href: '/library',
    keywords: ['library', 'hallmarks', 'learn', 'science'],
  },
  {
    id: 'page-compare',
    kind: 'page',
    title: 'Evidence Comparisons',
    subtitle: 'NMN vs NR, stack vs stack',
    href: '/library/compare',
    keywords: ['compare', 'nmn vs nr', 'evidence table', 'comparison', 'share'],
  },
  {
    id: 'page-peptides',
    kind: 'page',
    title: 'Peptide Library',
    subtitle: 'Anti-aging peptides, graded honestly',
    href: '/peptides',
    keywords: ['peptides', 'bpc-157', 'ghk-cu', 'semaglutide', 'research chemical'],
  },
  {
    id: 'page-top-picks',
    kind: 'page',
    title: 'Top TNiC Picks',
    subtitle: 'Sirtuin, PARP, and NRF2 pathway picks',
    href: '/library/top-picks',
    keywords: ['top picks', 'sirtuin', 'parp', 'nrf2', 'editorial'],
  },
  {
    id: 'page-dashboard-export',
    kind: 'page',
    title: 'Dashboard status export',
    subtitle: 'Markdown + PNG N=1 snapshot',
    href: '/dashboard#dashboard-status',
    keywords: ['export', 'status', 'journal', 'markdown', 'png'],
  },
  {
    id: 'page-shop',
    kind: 'page',
    title: 'Protocol Shop',
    subtitle: 'Stack-filtered buyer verification',
    href: '/shop',
    keywords: ['shop', 'buy', 'coa', 'verify', 'supplement'],
  },
  {
    id: 'page-shop-starter',
    kind: 'page',
    title: 'Shop — Starter stack',
    subtitle: 'Deep link verification checklist',
    href: '/shop?stack=starter',
    keywords: ['shop link', 'starter', 'stack', 'deep link', 'share'],
  },
  {
    id: 'page-shop-hybrid',
    kind: 'page',
    title: 'Shop — Full Hybrid stack',
    subtitle: 'Deep link verification checklist',
    href: '/shop?stack=hybrid',
    keywords: ['shop link', 'hybrid', 'stack', 'deep link'],
  },
  {
    id: 'page-brief',
    kind: 'page',
    title: 'Protocol Brief',
    subtitle: 'PMID research digest',
    href: '/brief',
    keywords: ['brief', 'digest', 'research', 'newsletter', 'pmid'],
  },
  {
    id: 'page-brief-rss',
    kind: 'page',
    title: 'Protocol Brief RSS',
    subtitle: 'Automated feed delivery',
    href: '/brief/feed.xml',
    keywords: ['rss', 'feed', 'brief', 'subscribe'],
  },
  {
    id: 'page-contact',
    kind: 'page',
    title: 'Contact TNiC',
    subtitle: 'Questions and partnership inquiries',
    href: '/contact',
    keywords: ['contact', 'help', 'support', 'question', 'partnership'],
  },
  {
    id: 'page-partnerships',
    kind: 'page',
    title: 'Partner With TNiC',
    subtitle: 'Selective collaboration path',
    href: '/partnerships',
    keywords: ['partner', 'partnership', 'sponsor', 'brand', 'collaboration', 'advertising'],
  },
  {
    id: 'page-hallmark-tiles',
    kind: 'page',
    title: 'Hallmark targets',
    subtitle: 'Target what slows with age',
    href: '/#hallmark-targets',
    keywords: ['hallmark', 'target', 'aging', 'twelve'],
  },
  {
    id: 'page-stacks',
    kind: 'page',
    title: 'Stack Architect',
    subtitle: 'Build and compare protocols',
    href: '/stacks',
    keywords: ['stack', 'builder', 'protocol', 'synergy'],
  },
  {
    id: 'page-labs',
    kind: 'page',
    title: 'Lab Hub',
    subtitle: 'Track biomarkers locally',
    href: '/labs',
    keywords: ['labs', 'biomarker', 'gsh', 'nad', 'crp'],
  },
  {
    id: 'page-lab-oauth',
    kind: 'page',
    title: 'Lab Partner OAuth',
    subtitle: 'Order at-home panels & auto-import',
    href: '/labs#lab-partner-oauth',
    keywords: ['oauth', 'partner', 'order', 'lab import', 'webhook', 'longevity direct'],
  },
  {
    id: 'page-brief-unsubscribe',
    kind: 'page',
    title: 'Protocol Brief unsubscribe',
    subtitle: 'One-click email opt-out',
    href: '/brief#brief-subscribe',
    keywords: ['unsubscribe', 'opt out', 'brief email'],
  },
  {
    id: 'page-lab-events',
    kind: 'page',
    title: 'Lab webhook events',
    subtitle: 'Poll partner panel completions',
    href: '/labs#lab-partner-oauth',
    keywords: ['webhook', 'events', 'lab push', 'notification'],
  },
  {
    id: 'page-tools',
    kind: 'page',
    title: 'Longevity Tools',
    subtitle: 'Simulator, protocol engine, forecasts',
    href: '/tools',
    keywords: ['tools', 'calculator', 'simulator'],
  },
  {
    id: 'page-trust',
    kind: 'page',
    title: 'Trust Hub',
    subtitle: 'Evidence methodology and journey',
    href: '/trust',
    keywords: ['trust', 'evidence', 'methodology', 'disclaimer'],
  },
  {
    id: 'page-sponsorship-principles',
    kind: 'page',
    title: 'Sponsorship Principles',
    subtitle: 'Editorial and commercial boundaries',
    href: '/trust/sponsorship',
    keywords: ['sponsorship', 'advertising', 'affiliate', 'editorial', 'integrity', 'commercial'],
  },
  {
    id: 'page-next-up',
    kind: 'page',
    title: "What's next",
    subtitle: 'Functional improvements roadmap',
    href: '/trust/updates#next-up',
    keywords: ['roadmap', 'next', 'upcoming', 'planned', 'shipped', 'changelog', 'improvements'],
  },
  {
    id: 'page-journey',
    kind: 'page',
    title: 'Personal Journey',
    subtitle: 'N=1 timeline template',
    href: '/trust/journey',
    keywords: ['journey', 'n=1', 'milestones'],
  },
];

const toolItems: PaletteItem[] = toolsRegistry.map((t) => ({
  id: `tool-${t.id}`,
  kind: 'tool' as const,
  title: t.label,
  subtitle: t.shortLabel,
  href: t.href,
  keywords: [t.label.toLowerCase(), ...t.keywords, t.id],
}));

const hallmarkItems: PaletteItem[] = hallmarkLibrary.map((h) => ({
  id: `hallmark-${h.id}`,
  kind: 'hallmark' as const,
  title: h.title,
  subtitle: `Hallmark ${h.number}`,
  href: `/library/${h.slug}`,
  keywords: [h.title.toLowerCase(), h.tagline.toLowerCase(), h.id, h.slug],
}));

const moduleItems: PaletteItem[] = libraryModules.map((m) => ({
  id: `module-${m.slug}`,
  kind: 'module' as const,
  title: m.title,
  subtitle: m.tagline,
  href: getModulePath(m),
  keywords: [m.title.toLowerCase(), m.category, m.slug, ...m.relatedHallmarkIds],
}));

const compareItems: PaletteItem[] = evidenceComparisons.map((c) => ({
  id: `compare-${c.slug}`,
  kind: 'compare' as const,
  title: c.title,
  subtitle: `${c.labelA} vs ${c.labelB}`,
  href: `/library/compare/${c.slug}`,
  keywords: [
    c.title.toLowerCase(),
    c.slug,
    c.labelA.toLowerCase(),
    c.labelB.toLowerCase(),
    'compare',
    'vs',
    ...c.keywords,
  ],
}));

const compoundItems: PaletteItem[] = compounds.map((c) => ({
  id: `compound-${c.id}`,
  kind: 'compound' as const,
  title: c.name,
  subtitle: c.pathway,
  href: `/library/compounds/${c.id}`,
  keywords: [c.name.toLowerCase(), c.id, c.pathway.toLowerCase(), c.badge],
}));

const peptideItems: PaletteItem[] = peptideLibrary.map((p) => ({
  id: `peptide-${p.id}`,
  kind: 'peptide' as const,
  title: p.name,
  subtitle: p.tagline,
  href: `/peptides/${p.slug}`,
  keywords: [p.name.toLowerCase(), p.id, p.category, ...(p.aliases ?? []).map((a) => a.toLowerCase())],
}));

const faqItems: PaletteItem[] = consumerFAQ.map((f, i) => ({
  id: `faq-${i}`,
  kind: 'faq' as const,
  title: f.question,
  subtitle: 'FAQ',
  href: '/faq',
  keywords: [f.question.toLowerCase(), 'faq', 'learn'],
}));

const glossaryItems: PaletteItem[] = glossary.map((g) => ({
  id: `glossary-${g.term}`,
  kind: 'glossary' as const,
  title: g.term,
  subtitle: g.simple.slice(0, 80),
  href: '/learn?tab=glossary',
  keywords: [g.term.toLowerCase(), 'glossary', g.simple.toLowerCase()],
}));

const actionItems: PaletteItem[] = [
  {
    id: 'action-library-search',
    kind: 'action',
    title: 'Search library',
    subtitle: 'Hallmarks, compounds, synergies',
    href: '/library',
    keywords: ['search', 'library', 'find', 'hallmark', 'compound'],
  },
  {
    id: 'action-export-kit',
    kind: 'action',
    title: 'Open export kit',
    subtitle: 'JSON, CSV, stack text, physician summary',
    keywords: ['export', 'download', 'backup', 'csv', 'physician', 'kit'],
    actionId: 'export-kit',
  },
  {
    id: 'action-export',
    kind: 'action',
    title: 'Quick export (JSON)',
    subtitle: 'Download stack, labs, and profile',
    keywords: ['export', 'download', 'backup', 'json'],
    actionId: 'export-json',
  },
  {
    id: 'action-calculator',
    kind: 'action',
    title: 'Run Defense Scan',
    subtitle: 'Biological age and pathway priority',
    href: '/tools?tab=healthspan',
    keywords: ['calculator', 'bio age', 'defense', 'scan'],
  },
];

export const paletteIndex: PaletteItem[] = [
  ...hubPages,
  ...toolItems,
  ...compareItems,
  ...hallmarkItems,
  ...moduleItems,
  ...compoundItems,
  ...peptideItems,
  ...faqItems,
  ...glossaryItems,
  ...actionItems,
];

export function searchPalette(query: string, limit = 12): PaletteItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...hubPages, ...toolItems.slice(0, 3), ...actionItems].slice(0, limit);
  }

  const scored = paletteIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const subtitle = (item.subtitle ?? '').toLowerCase();
      let score = 0;
      if (title === q) score += 100;
      else if (title.startsWith(q)) score += 50;
      else if (title.includes(q)) score += 30;
      if (subtitle.includes(q)) score += 10;
      if (item.keywords.some((k) => k.includes(q))) score += 8;
      if (item.kind === 'page' || item.kind === 'tool') score += 2;
      if (item.kind === 'compare' && (q.includes('vs') || q.includes('compare'))) score += 12;
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.item);
}

export const paletteKindLabels: Record<PaletteItemKind, string> = {
  page: 'Page',
  tool: 'Tool',
  hallmark: 'Hallmark',
  module: 'Guide',
  compound: 'Compound',
  peptide: 'Peptide',
  compare: 'Compare',
  faq: 'FAQ',
  glossary: 'Glossary',
  action: 'Action',
};
