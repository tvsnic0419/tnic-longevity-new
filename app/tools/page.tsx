import { Suspense } from 'react';
import { ToolsHub } from '@/components/tools/ToolsHub';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = seoRoutes.tools();

function buildToolsSchemas() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNiC Longevity Tools Suite',
    url: `${SITE.url}/tools`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Six evidence-graded longevity tools: healthspan defense scan, intervention impact ranker, stack synergy map, biomarker risk scorer, protocol timeline builder, and compound interaction checker.',
    featureList: [
      'Healthspan defense scan',
      'Intervention impact ranker',
      'Stack synergy map',
      'Biomarker risk scorer',
      'Protocol timeline builder',
      'Compound interaction checker',
    ],
    isAccessibleForFree: true,
  };
  return [webApp, buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
  ])];
}

export default function ToolsPage() {
  return (
    <>
      <StructuredData schemas={buildToolsSchemas()} />
      <Suspense
        fallback={
          <div className="container-page py-12">
            <SectionSkeleton height="lg" />
          </div>
        }
      >
        <ToolsHub />
      </Suspense>
    </>
  );
}