import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PeptideDetail } from '@/components/peptides/PeptideDetail';
import { StructuredData } from '@/components/seo/StructuredData';
import { ModuleHero, type ModuleHeroData } from '@/components/viz/ModuleHero';
import { getPeptideBySlug, peptideCategoryMeta, peptideLibrary } from '@/lib/peptides-library';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { getCompoundsForPeptideHallmarks } from '@/lib/library-graph';
import { getMolecularPathwaysForHallmark } from '@/lib/pathways';
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

  // Visual parity with compound deep-dives: a lighter overture built from
  // peptide-library fields plus a live PMID count from the body.
  const moduleHeroData: ModuleHeroData = {
    id: peptide.slug,
    title: peptide.name,
    kicker: peptideCategoryMeta[peptide.category].label,
    summary: peptide.summary,
    evidenceTier: peptide.evidenceTier,
    studyCount: new Set(
      (mdx?.body.match(/\bPMID:?\s*(\d{7,8})\b/g) ?? []).map((m) => m.replace(/\D/g, '')),
    ).size,
    hallmarks: peptide.relatedHallmarkIds
      .map((hid) => hallmarkLibrary.find((h) => h.id === hid)?.title)
      .filter((t): t is string => Boolean(t)),
  };

  // Derived cross-type bridges (computed server-side to keep the datasets out of
  // the client bundle): compounds that share this peptide's target hallmarks, and
  // the molecular pathways those hallmarks run through. Both are honest
  // derivations from authored data — no invented peptide↔compound edges.
  const relatedCompounds = getCompoundsForPeptideHallmarks(peptide.relatedHallmarkIds);
  const relatedPathways = (() => {
    const bySlug = new Map<string, { slug: string; name: string }>();
    for (const hid of peptide.relatedHallmarkIds) {
      for (const p of getMolecularPathwaysForHallmark(hid)) {
        if (!bySlug.has(p.slug)) bySlug.set(p.slug, { slug: p.slug, name: p.name });
      }
    }
    return [...bySlug.values()].slice(0, 6);
  })();

  return (
    <>
      <StructuredData schemas={schemas} />
      <ModuleHero {...moduleHeroData} />
      <PeptideDetail
        peptide={peptide}
        mdxBody={mdx?.body ?? null}
        relatedCompounds={relatedCompounds}
        relatedPathways={relatedPathways}
        lastUpdated={mdx?.frontmatter.last_updated}
        author={mdx?.frontmatter.author}
        reviewer={reviewer}
      />
    </>
  );
}
