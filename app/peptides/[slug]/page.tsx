import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PeptideDetail } from '@/components/peptides/PeptideDetail';
import { StructuredData } from '@/components/seo/StructuredData';
import { getPeptideBySlug, peptideLibrary } from '@/lib/peptides-library';
import { loadMdx } from '@/lib/mdx';
import { buildMedicalWebPageSchema, buildBreadcrumbSchema, getCitationsFromBody } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';

export function generateStaticParams() {
  return peptideLibrary.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) return { title: 'Not Found' };
  return seoRoutes.peptide({ name: peptide.name, tagline: peptide.tagline, slug: peptide.slug });
}

export default async function PeptidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) notFound();

  const mdx = loadMdx(peptide.mdxSlug, 'peptides');
  const path = `/peptides/${peptide.slug}`;
  const reviewer = mdx?.frontmatter.reviewer;
  const breadcrumbItems = [
    { name: 'Peptides', path: '/peptides' },
    { name: peptide.name, path },
  ];

  const schemas = [
    buildMedicalWebPageSchema({
      title: peptide.name,
      description: peptide.summary,
      path,
      dateModified: mdx?.frontmatter.last_updated,
      evidenceTier: peptide.evidenceTier,
      reviewer,
      citations: getCitationsFromBody(mdx?.body),
    }),
    buildBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <>
      <StructuredData schemas={schemas} />
      <PeptideDetail
        peptide={peptide}
        mdxBody={mdx?.body ?? null}
        lastUpdated={mdx?.frontmatter.last_updated}
        author={mdx?.frontmatter.author}
        reviewer={reviewer}
      />
    </>
  );
}
