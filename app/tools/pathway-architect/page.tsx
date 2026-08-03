import { Suspense } from 'react';
import { PathwayArchitect } from '@/components/pathway-architect/PathwayArchitect';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { COMPOUND_DB } from '@/lib/compound-engine-data';
import { STARTER_STACKS } from '@/lib/pathway-architect-data';
import { SITE } from '@/lib/site';

export const metadata = seoRoutes.pathwayArchitect();

function buildPathwayArchitectSchemas() {
  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TNiC Pathway Architect',
    url: `${SITE.url}/tools/pathway-architect`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Interactive protocol builder: add compounds one at a time and watch synergy score, convergent-pathway analysis, interaction cautions, redundancy flags, and hallmark coverage update live. Rule-based and transparent, not generative AI.',
    featureList: [
      'Live stack synergy scoring',
      'Convergent-pathway detection',
      'Interaction, redundancy and redox-load cautions',
      'Hallmark-of-aging coverage tracking',
      `${STARTER_STACKS.length} pre-loaded starter stacks`,
      'Shareable protocol URLs',
      'Local-only persistence, printable protocol export',
    ],
    isAccessibleForFree: true,
    about: {
      '@type': 'Thing',
      name: 'Hallmarks of Aging',
      description: `Coverage mapped across 12 hallmarks over ${COMPOUND_DB.length} curated, mechanistically-scored compounds.`,
    },
  };
  return [
    softwareApp,
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: 'Pathway Architect', path: '/tools/pathway-architect' },
    ]),
  ];
}

export default function PathwayArchitectPage() {
  return (
    <>
      <StructuredData schemas={buildPathwayArchitectSchemas()} />
      <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Loading Pathway Architect…</div>}>
        <PathwayArchitect />
      </Suspense>
    </>
  );
}
