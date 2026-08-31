import { PathwayArchitect } from '@/components/tools/PathwayArchitect';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildArticleSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { COMPOUND_DB, PATHWAY_LABELS } from '@/lib/compound-engine-data';
import { SITE } from '@/lib/site';

export const metadata = seoRoutes.pathwayArchitect();

function buildPathwayArchitectSchemas() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNiC Pathway Architect',
    url: `${SITE.url}/tools/pathway-architect`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Build an evidence-graded longevity protocol from curated compounds mapped to molecular pathways, with live synergy detection, redundancy and interaction cautions, and hallmark coverage — the same engine that powers the Compound Intelligence Engine.',
    featureList: [
      `${COMPOUND_DB.length} evidence-graded compounds`,
      'Live synergy, redundancy, and interaction detection',
      `Coverage across ${Object.keys(PATHWAY_LABELS).length} molecular pathways`,
      'Shareable, refresh-safe protocol URLs',
      'Privacy-first — no account required',
    ],
    isAccessibleForFree: true,
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'Pathway Architect', path: '/tools/pathway-architect' },
  ]);

  return [
    webApp,
    buildArticleSchema({
      title: 'Pathway Architect — Protocol Builder',
      description:
        'A protocol builder over the curated compound-engine dataset, with live synergy, redundancy, and pathway-coverage intelligence.',
      path: '/tools/pathway-architect',
      evidenceTier: 'B',
    }),
    breadcrumb,
  ];
}

export default function PathwayArchitectPage() {
  // The shell (and `hideStackReadout`, for the same reason as /compound-engine:
  // this scores against its own curated hallmark dataset, not the one
  // lib/stack-analysis uses) comes from app/tools/layout.tsx. Wrapping in a
  // second SubPageLayout here rendered the entire chrome twice.
  return (
    <>
      <StructuredData schemas={buildPathwayArchitectSchemas()} />
      <PathwayArchitect />
    </>
  );
}
