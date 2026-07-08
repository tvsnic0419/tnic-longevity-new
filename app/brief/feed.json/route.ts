import { NextResponse } from 'next/server';
import { getAllBriefIssues } from '@/lib/brief-research-sync';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';

export async function GET() {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'TNiC Protocol Brief',
    home_page_url: `${SITE.url}/brief`,
    feed_url: `${SITE.url}/brief/feed.json`,
    description: 'PMID-curated longevity research drops tied to TNiC library updates.',
    items: getAllBriefIssues().map((entry) => ({
      id: entry.id,
      url: `${SITE.url}/brief#${entry.id}`,
      title: entry.headline,
      summary: entry.summary,
      date_published: `${entry.date}T12:00:00Z`,
      tags: entry.tags,
      external_urls: entry.pmids.map((p) => `https://pubmed.ncbi.nlm.nih.gov/${p}/`),
    })),
  };

  return NextResponse.json(feed, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}