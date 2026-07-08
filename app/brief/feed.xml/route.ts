import { NextResponse } from 'next/server';
import { getAllBriefIssues } from '@/lib/brief-research-sync';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  const items = getAllBriefIssues()
    .map(
      (e) => `
    <item>
      <title>${escapeXml(e.headline)}</title>
      <link>${SITE.url}/brief#${e.id}</link>
      <guid isPermaLink="true">${SITE.url}/brief#${e.id}</guid>
      <pubDate>${new Date(`${e.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(e.summary)}</description>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TNiC Protocol Brief</title>
    <link>${SITE.url}/brief</link>
    <description>PMID-curated longevity research drops</description>
    <language>en-us</language>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}