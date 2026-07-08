import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LibraryModuleDetail } from '@/components/library/LibraryModuleDetail';
import { StructuredData } from '@/components/seo/StructuredData';
import {
  getAllModuleParams,
  getModuleBySlug,
  getModulePath,
  libraryCategoryMeta,
  type LibraryModuleCategory,
} from '@/lib/library-modules';
import { loadMdx } from '@/lib/mdx';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildMedicalWebPageSchema,
  getCompoundCitations,
} from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';

const VALID_CATEGORIES = Object.keys(libraryCategoryMeta) as LibraryModuleCategory[];

export function generateStaticParams() {
  return getAllModuleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}): Promise<Metadata> {
  const { slug: category, moduleSlug } = await params;
  if (!VALID_CATEGORIES.includes(category as LibraryModuleCategory)) return { title: 'Not Found' };
  const mod = getModuleBySlug(category as LibraryModuleCategory, moduleSlug);
  if (!mod) return { title: 'Not Found' };
  const path = getModulePath(mod);
  return seoRoutes.module({
    title: mod.title,
    summary: mod.summary,
    path,
    categoryLabel: libraryCategoryMeta[mod.category].label,
  });
}

export default async function LibraryModulePage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug: category, moduleSlug } = await params;
  if (!VALID_CATEGORIES.includes(category as LibraryModuleCategory)) notFound();

  const mod = getModuleBySlug(category as LibraryModuleCategory, moduleSlug);
  if (!mod) notFound();

  const mdx = loadMdx(mod.mdxSlug, mod.category);
  const path = getModulePath(mod);

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Library', path: '/library' },
    { name: libraryCategoryMeta[mod.category].label, path: `/library#content-modules` },
    { name: mod.title, path },
  ]);

  const schemas =
    mod.category === 'compounds'
      ? [
          buildMedicalWebPageSchema({
            title: mod.title,
            description: mod.summary,
            path,
            dateModified: mdx?.frontmatter.last_updated,
            evidenceTier: mod.evidenceTier,
            citations: getCompoundCitations(mod.slug, mod.compoundId),
          }),
          breadcrumb,
        ]
      : [
          buildArticleSchema({
            title: mod.title,
            description: mod.summary,
            path,
            dateModified: mdx?.frontmatter.last_updated,
            evidenceTier: mod.evidenceTier,
          }),
          breadcrumb,
        ];

  return (
    <>
      <StructuredData schemas={schemas} />
      <LibraryModuleDetail module={mod} mdxBody={mdx?.body ?? null} />
    </>
  );
}