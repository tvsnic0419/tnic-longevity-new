import { OgImage } from '@/lib/og-image';
import { peptideLibrary } from '@/lib/peptides-library';

export const alt = 'TNiC — Anti-Aging Peptide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return peptideLibrary.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = peptideLibrary.find((x) => x.slug === slug);

  if (!p) return OgImage({ title: 'Anti-Aging Peptide', accent: '#fb7185' });

  return OgImage({
    title: p.name,
    subtitle: p.tagline,
    accent: '#fb7185',
  });
}
