import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HallmarkDetail } from '@/components/library/HallmarkDetail';
import { LibraryCategoryIndex } from '@/components/library/LibraryCategoryIndex';
import { StructuredData } from '@/components/seo/StructuredData';
import { SITE } from '@/lib/site';
import { getHallmarkBySlug, hallmarkLibrary } from '@/lib/hallmarks-library';
import { loadMdx } from '@/lib/mdx';
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata, getCitationsFromBody } from '@/lib/seo';
import {
  getCompoundsForHallmark,
  getCompoundIdToSlugMap,
  getGuidesForHallmark,
  getPeptidesForHallmark,
} from '@/lib/library-graph';
import { getMolecularPathwaysForHallmark } from '@/lib/pathways';
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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tiers?: string }>;
}) {
  const { slug } = await params;
  if (isCategorySlug(slug)) {
    const { tiers } = await searchParams;
    const activeTiers = (tiers ?? '')
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter((t): t is 'A' | 'B' | 'C' => t === 'A' || t === 'B' || t === 'C');
    // Advertise the machine-readable compound dataset to Google Dataset Search
    // and LLM crawlers so /compounds.json becomes a discoverable, citeable source.
    const datasetSchema =
      slug === 'compounds'
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'Dataset',
              name: 'TNiC evidence-graded compound library',
              description:
                'Longevity compounds graded A/B/C by the strength of human evidence, mapped to the 12 hallmarks of aging, with studied doses and PubMed citations.',
              url: `${SITE.url}/library/compounds`,
              license: `${SITE.url}/terms`,
              creator: { '@type': 'Organization', name: SITE.name, url: SITE.url },
              distribution: [
                {
                  '@type': 'DataDownload',
                  encodingFormat: 'application/json',
                  contentUrl: `${SITE.url}/compounds.json`,
                },
              ],
            },
          ]
        : [];
    return (
      <>
        {datasetSchema.length > 0 && <StructuredData schemas={datasetSchema} />}
        <LibraryCategoryIndex category={slug} activeTiers={activeTiers} />
      </>
    );
  }
  const hallmark = getHallmarkBySlug(slug);
  if (!hallmark) notFound();

  const mdx = loadMdx(hallmark.mdxSlug);
  const path = `/library/${hallmark.slug}`;
  const targetingCompounds = getCompoundsForHallmark(hallmark.id);
  const compoundHrefs = getCompoundIdToSlugMap();
  const guides = getGuidesForHallmark(hallmark.id);
  const targetingPeptides = getPeptidesForHallmark(hallmark.id);
  const drivingPathways = getMolecularPathwaysForHallmark(hallmark.id).map((p) => ({
    slug: p.slug,
    name: p.name,
    summary: p.summary,
  }));

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
        targetingPeptides={targetingPeptides}
        drivingPathways={drivingPathways}
        compoundHrefs={compoundHrefs}
        guides={guides}
        lastUpdated={mdx?.frontmatter.last_updated}
        author={mdx?.frontmatter.author}
        reviewer={reviewer}
      />
    </>
  );
}