import { describe, expect, it } from 'vitest';
import { researchFeed } from './data';
import {
  getAllBriefIssues,
  getCuratedPmids,
  getResearchBriefIssues,
  getBriefHrefForResearch,
  researchFeedToBriefEntry,
} from './brief-research-sync';

describe('brief-research-sync', () => {
  it('maps research feed items to brief entries', () => {
    const entry = researchFeedToBriefEntry(researchFeed[1]);
    expect(entry.id).toBe('brief-research-r2');
    expect(entry.source).toBe('research-intel');
    expect(entry.pmids).toContain('36656670');
    expect(entry.libraryHrefs.length).toBeGreaterThan(1);
  });

  it('excludes PMIDs already in curated briefs', () => {
    const curated = getCuratedPmids();
    expect(curated.has('36656670')).toBe(true);
    const researchOnly = getResearchBriefIssues();
    expect(researchOnly.every((b) => !curated.has(b.pmids[0]))).toBe(true);
  });

  it('merges curated and research issues', () => {
    const all = getAllBriefIssues();
    expect(all.length).toBeGreaterThan(researchFeed.length);
    expect(all.some((b) => b.source === 'curated')).toBe(true);
    expect(all.some((b) => b.source === 'research-intel')).toBe(true);
  });

  it('links research intel to brief anchor', () => {
    const synced = getResearchBriefIssues().find((b) => b.researchFeedId === 'r1');
    if (synced) {
      expect(getBriefHrefForResearch('r1')).toBe(`/brief#${synced.id}`);
    }
  });
});