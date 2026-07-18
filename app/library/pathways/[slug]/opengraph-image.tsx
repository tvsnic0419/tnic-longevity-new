import { OgImage } from '@/lib/og-image';
import { getAllPathwaySlugs, getPathwayBySlug } from '@/lib/pathways';

export const alt = 'TNiC Molecular Pathway';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllPathwaySlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pathway = getPathwayBySlug(slug);

  if (!pathway) {
    return OgImage({ title: 'Molecular pathway', accent: '#c084fc' });
  }

  return OgImage({
    title: pathway.name,
    subtitle: pathway.keyMolecules.slice(0, 4).join(' · '),
    accent: '#c084fc',
  });
}
