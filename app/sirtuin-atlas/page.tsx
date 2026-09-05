import type { Metadata } from 'next';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { SirtuinAtlas } from '@/components/sirtuins/SirtuinAtlas';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sirtuin Atlas: SIRT1–SIRT7 Activators, NAD+ & Evidence | TNiC',
  description:
    'Explore an interactive evidence atlas of SIRT1 through SIRT7. Compare direct activators, NAD+ support, expression effects, research compounds, human translation stage, and unproven supplement claims.',
  alternates: { canonical: '/sirtuin-atlas' },
  keywords: [
    'SIRT1 activator',
    'SIRT2 activator',
    'SIRT3 activator',
    'SIRT6 activator',
    'sirtuins',
    'NAD+',
    'NMN',
    'NR',
    'resveratrol',
    'longevity',
  ],
  openGraph: {
    title: 'The Sirtuin Atlas — SIRT1 to SIRT7',
    description: 'What actually activates human sirtuins? An interactive target-engagement and translation map from TNiC.',
    url: '/sirtuin-atlas',
    type: 'article',
    siteName: 'TNiC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Sirtuin Atlas — SIRT1 to SIRT7',
    description: 'Direct activators, NAD+ support, signaling claims and evidence maturity — separated instead of blurred together.',
  },
};

export default function SirtuinAtlasPage() {
  const schemas = [
    buildArticleSchema({
      title: 'The Sirtuin Atlas — SIRT1 to SIRT7 Activators and Evidence',
      description:
        'Interactive evidence map separating direct sirtuin activation, NAD+ substrate support, expression/signaling effects and translation maturity across SIRT1 through SIRT7.',
      path: '/sirtuin-atlas',
      evidenceTier: 'B',
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Sirtuin Atlas', path: '/sirtuin-atlas' },
    ]),
  ];

  return (
    <SubPageLayout>
      <StructuredData schemas={schemas} />
      <SirtuinAtlas />
    </SubPageLayout>
  );
}
