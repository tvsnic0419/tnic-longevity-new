import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HallmarkDetail } from '@/components/library/HallmarkDetail';
import { LibraryCategoryIndex } from '@/components/library/LibraryCategoryIndex';
import { StructuredData } from '@/components/seo/StructuredData';
import { getHallmarkBySlug, hallmarkLibrary } from '@/lib/hallmarks-library';
import { loadMdx } from '@/lib/mdx';
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata, getCitationsFromBody } from '@/lib/seo';
import { getCompoundsForHallmark, getCompoundIdToSlugMap } from '@/lib/library-graph';
import { libraryCategoryMeta, type LibraryModuleCategory } from '@/lib/library-modules';
import { seoRoutes } from '@/lib/seo-routes';

const CATEGORY_SLUGS = Object.keys(libraryCategoryMeta) as LibraryModuleCategory[];
const isCategorySlug = (slug: string): slug is LibraryModuleCategory =>
  (CATEGORY_SLUGS as string[]).includes(slug);

export function generateStaticParams() {
  return [
    ...hallmarkLibrary.map((h) => ({ slug: h.slug })),
    ...CATEGORY_SLUGS.map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isCategorySlug(slug)) {
    const meta = libraryCategoryMeta[slug];
    return buildPageMetadata({
      title: `${meta.label} — Evidence-Graded Library`,
      description: meta.description,
      path: `/library/${slug}`,
    });
  }
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
  if (isCategorySlug(slug)) {
    return <LibraryCategoryIndex category={slug} />;
  }
  const hallmark = getHallmarkBySlug(slug);
  if (!hallmark) notFound();

  const mdx = loadMdx(hallmark.mdxSlug);
  const path = `/library/${hallmark.slug}`;
  const targetingCompounds = getCompoundsForHallmark(hallmark.id);
  const compoundHrefs = getCompoundIdToSlugMap();

  const reviewer = mdx?.frontmatter.reviewer;
  const breadcrumbItems = [
    { name: 'Library', path: '/library' },
    { name: hallmark.title, path },
  ];
  const schemas = [
    buildArticleSchema({
      title: hallmark.title,
      description: hallmark.summary,
      path,
      dateModified: mdx?.frontmatter.last_updated,
      evidenceTier: 'A',
      reviewer,
      citations: getCitationsFromBody(mdx?.body),
    }),
    buildBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <>
      <StructuredData schemas={schemas} />
      <HallmarkDetail
        hallmark={hallmark}
        mdxBody={mdx?.body ?? null}
        targetingCompounds={targetingCompounds}
        compoundHrefs={compoundHrefs}
        lastUpdated={mdx?.frontmatter.last_updated}
        author={mdx?.frontmatter.author}
        reviewer={reviewer}
      />
    </>
  );
}