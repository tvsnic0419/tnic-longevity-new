import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PathwayDetail } from '@/components/library/PathwayDetail';
import { StructuredData } from '@/components/seo/StructuredData';
import { getAllPathwaySlugs, getPathwayBySlug } from '@/lib/pathways';
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getAllPathwaySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pathway = getPathwayBySlug(slug);
  if (!pathway) return { title: 'Not Found' };
  return buildPageMetadata({
    title: `${pathway.name} — Molecular Pathway`,
    description: pathway.tagline,
    path: `/library/pathways/${slug}`,
    keywords: pathway.keyMolecules,
  });
}

export default async function PathwayDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pathway = getPathwayBySlug(slug);
  if (!pathway) notFound();

  const schemas = [
    buildArticleSchema({
      title: pathway.name,
      description: pathway.tagline,
      path: `/library/pathways/${slug}`,
    }),
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: 'Pathways', path: '/library/pathways' },
      { name: pathway.name, path: `/library/pathways/${slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData schemas={schemas} />
      <PathwayDetail pathway={pathway} />
    </>
  );
}
