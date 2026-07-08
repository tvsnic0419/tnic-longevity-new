import { researchFeed } from './data';
import type { ProtocolBriefEntry } from './protocol-brief';
import { protocolBriefIssues } from './protocol-brief';
import type { EvidenceTier } from './types';

export type BriefSource = 'curated' | 'research-intel';

export interface MergedBriefEntry extends ProtocolBriefEntry {
  source: BriefSource;
  researchFeedId?: string;
}

function impactToTier(impact: 'breakthrough' | 'clinical' | 'preclinical'): EvidenceTier {
  if (impact === 'clinical') return 'A';
  if (impact === 'preclinical') return 'C';
  return 'B';
}

/** Map research intel feed items to Protocol Brief entries */
export function researchFeedToBriefEntry(
  item: (typeof researchFeed)[number],
): MergedBriefEntry {
  const tags = [
    ...item.tag.toLowerCase().split(/[\s/]+/).filter(Boolean),
    'research-intel',
  ];

  return {
    id: `brief-research-${item.id}`,
    date: item.date,
    headline: item.title,
    summary: item.summary,
    evidenceTier: impactToTier(item.impact),
    pmids: [item.pmid],
    libraryHrefs: [
      ...item.relatedHrefs,
      { label: 'Research intel feed', href: '/#research' },
    ],
    takeaway: `PubMed ${item.pmid} — use protocol links above before changing your stack.`,
    tags,
    source: 'research-intel',
    researchFeedId: item.id,
  };
}

/** PMIDs already covered by curated brief issues */
export function getCuratedPmids(): Set<string> {
  return new Set(protocolBriefIssues.flatMap((issue) => issue.pmids));
}

/** Research-derived briefs excluding PMIDs already in curated issues */
export function getResearchBriefIssues(): MergedBriefEntry[] {
  const curatedPmids = getCuratedPmids();
  return researchFeed
    .filter((item) => !curatedPmids.has(item.pmid))
    .map(researchFeedToBriefEntry);
}

/** Full rotation pool: curated first, then research-intel sync */
export function getAllBriefIssues(): MergedBriefEntry[] {
  const curated: MergedBriefEntry[] = protocolBriefIssues.map((issue) => ({
    ...issue,
    source: 'curated' as const,
  }));
  return [...curated, ...getResearchBriefIssues()];
}

export function getBriefEntryByResearchId(feedId: string): MergedBriefEntry | undefined {
  return getAllBriefIssues().find((b) => b.researchFeedId === feedId);
}

export function getBriefHrefForResearch(feedId: string): string {
  const entry = getBriefEntryByResearchId(feedId);
  return entry ? `/brief#${entry.id}` : '/brief';
}