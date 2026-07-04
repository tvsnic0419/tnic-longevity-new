import { OgImage } from '@/lib/og-image';
import { hallmarkLibrary } from '@/lib/hallmarks-library';

export const alt = 'TNiC — Hallmark of Aging';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return hallmarkLibrary.map((h) => ({ slug: h.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = hallmarkLibrary.find((x) => x.slug === slug);

  if (!h) return OgImage({ title: 'Hallmark of Aging', accent: '#22d3ee' });

  return OgImage({
    title: h.title,
    subtitle: `Hallmark ${h.number} of 12 · ${h.tagline}`,
    accent: '#22d3ee',
  });
}
