import { Suspense } from 'react';
import { LabHub } from '@/components/labs/LabHub';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = seoRoutes.labs();

function buildLabsSchemas() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNiC Lab Hub — Local Biomarker Tracker',
    url: `${SITE.url}/labs`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Local-first biomarker tracker for longevity labs: log CBC, metabolic panel, lipids, HbA1c, hscrp, homocysteine, and longevity panels. Track trends over time with reference ranges mapped to optimal longevity targets — not just clinical normal.',
    featureList: [
      'Local-only lab result storage',
      'Longevity-optimized reference ranges',
      'Trend charts for key biomarkers',
      'PDF lab import (structured extraction)',
      'No account — data never leaves your device',
    ],
    isAccessibleForFree: true,
  };
  return [webApp, buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Lab Hub', path: '/labs' },
  ])];
}

export default function LabsPage() {
  return (
    <>
      <StructuredData schemas={buildLabsSchemas()} />
      <Suspense fallback={<SectionSkeleton height="lg" />}>
        <LabHub />
      </Suspense>
    </>
  );
}