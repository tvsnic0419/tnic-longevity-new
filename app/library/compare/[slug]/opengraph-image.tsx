import { OgImage } from '@/lib/og-image';
import { getAllComparisonSlugs, getComparison } from '@/lib/comparisons';

export const alt = 'TNiC Evidence Comparison';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comp = getComparison(slug);

  if (!comp) {
    return OgImage({ title: 'Evidence comparison', accent: '#a78bfa' });
  }

  return OgImage({
    title: comp.title,
    subtitle: `${comp.labelA} vs ${comp.labelB} · Tier ${comp.evidenceTier} · PMID-anchored`,
    accent: '#22d3ee',
  });
}