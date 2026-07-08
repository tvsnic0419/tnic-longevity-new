import { compounds } from './data';
import { hallmarkLibrary } from './hallmarks-library';
import { libraryModules, getModulePath, libraryCategoryMeta } from './library-modules';
import { evidenceComparisons } from './comparisons';
import { getAllBriefIssues } from './brief-research-sync';
import { lifestylePillars } from './lifestyle-pillars';

export type LibrarySearchKind = 'hallmark' | 'module' | 'compound' | 'compare' | 'brief';

export interface LibrarySearchItem {
  id: string;
  kind: LibrarySearchKind;
  title: string;
  subtitle: string;
  href: string;
  evidenceTier?: string;
  keywords: string[];
}

function buildIndex(): LibrarySearchItem[] {
  const hallmarkItems: LibrarySearchItem[] = hallmarkLibrary.map((h) => ({
    id: `hallmark-${h.id}`,
    kind: 'hallmark',
    title: h.title,
    subtitle: `Hallmark ${h.number} · ${h.tagline}`,
    href: `/library/${h.slug}`,
    keywords: [
      h.title.toLowerCase(),
      h.tagline.toLowerCase(),
      h.slug,
      h.id,
      ...h.biomarkers.map((b) => b.toLowerCase()),
      ...h.relatedCompoundIds,
    ],
  }));

  const moduleItems: LibrarySearchItem[] = libraryModules.map((m) => {
    const pillar =
      m.category === 'lifestyle'
        ? lifestylePillars[m.slug as keyof typeof lifestylePillars]
        : undefined;

    return {
      id: `module-${m.category}-${m.slug}`,
      kind: 'module',
      title: m.title,
      subtitle: `${libraryCategoryMeta[m.category].label} · Tier ${m.evidenceTier}`,
      href: getModulePath(m),
      evidenceTier: m.evidenceTier,
      keywords: [
        m.title.toLowerCase(),
        m.tagline.toLowerCase(),
        m.summary.toLowerCase(),
        m.slug,
        m.category,
        ...m.relatedHallmarkIds,
        ...(m.compoundId ? [m.compoundId] : []),
        ...(m.synergyCompoundIds ?? []),
        ...(pillar
          ? [
              'decision tree',
              'lab tie-in',
              'lifestyle pillar',
              pillar.headline.toLowerCase(),
              ...pillar.labTieIns.map((l) => l.label.toLowerCase()),
              ...pillar.wearableSignals.map((w) => w.label.toLowerCase()),
            ]
          : []),
      ],
    };
  });

  const compoundItems: LibrarySearchItem[] = compounds.map((c) => ({
    id: `compound-${c.id}`,
    kind: 'compound',
    title: c.name,
    subtitle: `${c.pathway} · Evidence ${c.evidence}`,
    href: `/library/compounds/${c.id}`,
    evidenceTier: c.evidence,
    keywords: [
      c.name.toLowerCase(),
      c.id,
      c.pathway.toLowerCase(),
      c.mechanism.toLowerCase(),
      c.badge,
      ...c.hallmarks,
      ...c.synergies,
    ],
  }));

  const compareItems: LibrarySearchItem[] = evidenceComparisons.map((c) => ({
    id: `compare-${c.slug}`,
    kind: 'compare',
    title: c.title,
    subtitle: `${c.labelA} vs ${c.labelB} · ${c.category}`,
    href: `/library/compare/${c.slug}`,
    evidenceTier: c.evidenceTier,
    keywords: [
      c.title.toLowerCase(),
      c.subtitle.toLowerCase(),
      c.slug,
      c.labelA.toLowerCase(),
      c.labelB.toLowerCase(),
      'compare',
      'vs',
      ...c.keywords,
    ],
  }));

  const briefItems: LibrarySearchItem[] = getAllBriefIssues().map((b) => ({
    id: `brief-${b.id}`,
    kind: 'brief',
    title: b.headline,
    subtitle: `Protocol Brief · ${b.date}${b.source === 'research-intel' ? ' · Intel sync' : ''}`,
    href: `/brief#${b.id}`,
    evidenceTier: b.evidenceTier,
    keywords: [
      b.headline.toLowerCase(),
      b.summary.toLowerCase(),
      'brief',
      'digest',
      ...b.tags,
      ...b.pmids,
    ],
  }));

  return [...hallmarkItems, ...moduleItems, ...compoundItems, ...compareItems, ...briefItems];
}

const librarySearchIndex = buildIndex();

export function searchLibrary(query: string, limit = 24): LibrarySearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = librarySearchIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const subtitle = item.subtitle.toLowerCase();
      let score = 0;

      if (title === q) score += 100;
      else if (title.startsWith(q)) score += 50;
      else if (title.includes(q)) score += 30;

      if (subtitle.includes(q)) score += 12;
      if (item.keywords.some((k) => k.includes(q))) score += 10;
      if (item.kind === 'hallmark' && q.includes('hallmark')) score += 5;
      if (item.kind === 'compound' && (q.includes('stack') || q.includes('supplement'))) score += 3;
      if (item.kind === 'compare' && (q.includes('vs') || q.includes('compare'))) score += 15;
      if (item.kind === 'brief' && (q.includes('brief') || q.includes('digest'))) score += 12;

      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.item);
}

export const librarySearchKindLabels: Record<LibrarySearchKind, string> = {
  hallmark: 'Hallmark',
  module: 'Guide',
  compound: 'Compound',
  compare: 'Compare',
  brief: 'Brief',
};

export const librarySearchSuggestions = [
  'NMN vs NR',
  'GlyNAC',
  'NRF2',
  'compare',
  'mitochondrial',
  'NAD+',
  'sulforaphane',
] as const;