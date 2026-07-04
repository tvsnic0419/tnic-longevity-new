import type { PresetKey } from './presets';
import type { HubContext } from './hub-context';
import { researchFeed } from './data';

export type ResearchImpact = 'breakthrough' | 'clinical' | 'preclinical';

export interface ResearchFeedItem {
  id: string;
  title: string;
  source: string;
  date: string;
  tag: string;
  summary: string;
  pmid: string;
  impact: ResearchImpact;
  relatedHrefs: { label: string; href: string }[];
  presetKey?: PresetKey;
}

export interface ResearchIntelFilters {
  tag: string;
  impact: ResearchImpact | 'all';
  compound: string;
  hallmark: string;
}

export const researchImpactStyles = {
  breakthrough: { color: 'text-accent-amber bg-accent-amber/10', label: 'Breakthrough' },
  clinical: { color: 'text-accent-emerald bg-accent-emerald/10', label: 'Clinical Trial' },
  preclinical: { color: 'text-accent-cyan bg-accent-cyan/10', label: 'Preclinical' },
} as const;

export const researchImpactFilters = [
  { id: 'all' as const, label: 'All evidence' },
  { id: 'breakthrough' as const, label: 'Breakthrough' },
  { id: 'clinical' as const, label: 'Clinical' },
  { id: 'preclinical' as const, label: 'Preclinical' },
];

const COMPOUND_LABELS: Record<string, string> = {
  glynac: 'GlyNAC',
  nmn: 'NMN',
  cakg: 'Ca-AKG',
  sulforaphane: 'Sulforaphane',
  resveratrol: 'Resveratrol',
  rala: 'R-ALA',
};

function compoundFromHref(href: string): string | null {
  const match = href.match(/\/library\/compounds\/([^/]+)/);
  return match?.[1] ?? null;
}

function hallmarkFromHref(href: string): string | null {
  const match = href.match(/^\/library\/([^/]+)$/);
  if (!match) return null;
  const slug = match[1];
  if (['compounds', 'compare', 'delivery-systems'].includes(slug)) return null;
  return slug;
}

function collectFromFeed<T>(
  extractor: (item: ResearchFeedItem) => T[],
): T[] {
  const set = new Set<T>();
  for (const item of researchFeed) {
    for (const v of extractor(item)) set.add(v);
  }
  return [...set];
}

export const researchTags = ['All', ...collectFromFeed((r) => [r.tag])];

function buildCompoundFilters() {
  const ids = collectFromFeed((r) =>
    r.relatedHrefs
      .map((l) => compoundFromHref(l.href))
      .filter((id): id is string => !!id),
  );
  return [
    { id: 'all', label: 'All compounds' },
    ...ids
      .sort()
      .map((id) => ({ id, label: COMPOUND_LABELS[id] ?? id })),
  ];
}

function buildHallmarkFilters() {
  const ids = collectFromFeed((r) =>
    r.relatedHrefs
      .map((l) => hallmarkFromHref(l.href))
      .filter((slug): slug is string => !!slug),
  );
  return [
    { id: 'all', label: 'All hallmarks' },
    ...ids
      .sort()
      .map((id) => ({ id, label: id.replace(/-/g, ' ') })),
  ];
}

export const researchCompoundFilters = buildCompoundFilters();
export const researchHallmarkFilters = buildHallmarkFilters();

export function filterResearchFeed(
  feed: ResearchFeedItem[],
  filters: ResearchIntelFilters,
): ResearchFeedItem[] {
  return feed.filter((article) => {
    if (filters.tag !== 'All' && article.tag !== filters.tag) return false;
    if (filters.impact !== 'all' && article.impact !== filters.impact) return false;
    if (filters.compound !== 'all') {
      const hasCompound = article.relatedHrefs.some(
        (l) => compoundFromHref(l.href) === filters.compound,
      );
      if (!hasCompound) return false;
    }
    if (filters.hallmark !== 'all') {
      const hasHallmark = article.relatedHrefs.some(
        (l) => hallmarkFromHref(l.href) === filters.hallmark,
      );
      if (!hasHallmark) return false;
    }
    return true;
  });
}

export function getResearchIntelContext(filters: ResearchIntelFilters): HubContext {
  if (filters.compound !== 'all') {
    const label = COMPOUND_LABELS[filters.compound] ?? filters.compound;
    return {
      what: `Research feed filtered to ${label} — headlines mapped to protocol modules, stacks, and biomarkers.`,
      why: 'Compound-specific news without context leads to dose chasing. See only studies tied to your intervention.',
      next: `Expand a ${label} headline, open the compound module, then verify form and COA at Protocol Shop.`,
    };
  }
  if (filters.hallmark !== 'all') {
    const label = filters.hallmark.replace(/-/g, ' ');
    return {
      what: `Studies relevant to the ${label} hallmark — interventions and biomarkers you can act on today.`,
      why: 'Hallmark-first thinking beats brand-first shopping. Filter noise to the biological problem you are targeting.',
      next: `Open the hallmark library page, review top interventions, then log hallmark-linked markers in Labs.`,
    };
  }
  if (filters.impact === 'clinical') {
    return {
      what: 'Human trial headlines with PMID anchors and links to compounds tested in RCTs.',
      why: 'Preclinical hype does not justify spend. Clinical items show what actually moved biomarkers in humans.',
      next: 'Expand a clinical item, open the linked compound module, then log baseline labs before starting.',
    };
  }
  if (filters.impact === 'preclinical') {
    return {
      what: 'Preclinical and mechanistic studies — strong biology, not yet human outcome proof.',
      why: 'Mechanism matters for stack design, but tier expectations must stay honest. Preclinical ≠ prescription.',
      next: 'Note evidence tier on linked modules, then run Simulator before adding preclinical-only compounds.',
    };
  }
  if (filters.impact === 'breakthrough') {
    return {
      what: 'High-signal breakthrough headlines — paradigm shifts, major reviews, and lifespan headlines.',
      why: 'Breakthrough news sets research direction. TNiC maps each headline to actionable protocol links, not hype.',
      next: 'Pick one breakthrough item, follow protocol links, then read the matching Protocol Brief issue.',
    };
  }
  if (filters.tag !== 'All') {
    return {
      what: `Topic filter: ${filters.tag} — curated longevity headlines with stack and hallmark bridges.`,
      why: 'Topic silos help you deep-dive one pathway without losing protocol context on every surface.',
      next: `Expand the top ${filters.tag} item, follow protocol links, then load a matching stack preset.`,
    };
  }
  return {
    what: 'A curated feed of longevity research headlines with protocol links to hallmarks, compounds, and stacks.',
    why: 'Raw science news is disconnected from action. TNiC bridges every headline to your personal OS.',
    next: 'Filter by impact or compound, expand any item for protocol links, then open the matching Protocol Brief.',
  };
}