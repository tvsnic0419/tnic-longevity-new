import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { CompoundAuthorityPage } from '@/components/library/CompoundAuthorityPage';
import { StructuredData } from '@/components/seo/StructuredData';
import { getCompound, allCompoundIds, latestStudyYear } from '@/lib/compound-authority';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';

// Only the real compound ids are valid pages; anything else 404s at the router
// instead of rendering a thin on-demand page.
export const dynamicParams = false;

export function generateStaticParams() {
  return allCompoundIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const compound = getCompound(id);
  if (!compound) return { title: 'Compound not found' };

  const path = `/library/compounds/${id}`;
  const description = `${compound.name} (${compound.pathway}) — Tier ${compound.evidence} evidence. Mechanism, human trials, dosing (${compound.dose}), timing, safety, and stacking. ${compound.desc}`.slice(0, 320);

  return {
    title: `${compound.name}: Mechanism, Evidence & Dosing`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${compound.name} — Evidence & Dosing | TNiC`,
      description,
      url: path,
      type: 'article',
    },
  };
}

export default async function CompoundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const compound = getCompound(id);
  if (!compound) notFound();

  const path = `/library/compounds/${id}`;
  const year = latestStudyYear(compound);

  const schemas = [
    buildArticleSchema({
      title: `${compound.name}: Mechanism, Evidence & Dosing`,
      description: compound.desc,
      path,
      dateModified: year ? `${year}-01-01` : undefined,
      evidenceTier: compound.evidence,
    }),
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: 'Compounds', path: '/library' },
      { name: compound.name, path },
    ]),
  ];

  return (
    <SubPageLayout>
      <StructuredData schemas={schemas} />
      <CompoundAuthorityPage compound={compound} />
    </SubPageLayout>
  );
}
