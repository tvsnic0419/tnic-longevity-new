import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HallmarkDetail } from '@/components/library/HallmarkDetail';
import { StructuredData } from '@/components/seo/StructuredData';
import { getHallmarkBySlug, hallmarkLibrary } from '@/lib/hallmarks-library';
import { loadMdx } from '@/lib/mdx';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';

export function generateStaticParams() {
  return hallmarkLibrary.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hallmark = getHallmarkBySlug(slug);
  if (!hallmark) return { title: 'Not Found' };
  return seoRoutes.hallmark({
    title: hallmark.title,
    summary: hallmark.summary,
    slug: hallmark.slug,
    number: hallmark.number,
  });
}

export default async function HallmarkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hallmark = getHallmarkBySlug(slug);
  if (!hallmark) notFound();

  const mdx = loadMdx(hallmark.mdxSlug);
  const path = `/library/${hallmark.slug}`;

  const schemas = [
    buildArticleSchema({
      title: hallmark.title,
      description: hallmark.summary,
      path,
      dateModified: mdx?.frontmatter.last_updated,
      evidenceTier: 'A',
    }),
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: hallmark.title, path },
    ]),
  ];

  return (
    <>
      <StructuredData schemas={schemas} />
      <HallmarkDetail hallmark={hallmark} mdxBody={mdx?.body ?? null} />
    </>
  );
}