import { Suspense } from 'react';
import { ToolsHub } from '@/components/tools/ToolsHub';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { toolsRegistry, featuredAdvancedTools, totalToolCount } from '@/lib/registry';
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
    description: `${totalToolCount} evidence-graded longevity tools: ${[...toolsRegistry.map((t) => t.label), ...featuredAdvancedTools.map((t) => t.label)].join(', ')}.`,
    featureList: [
      ...toolsRegistry.map((t) => t.label),
      ...featuredAdvancedTools.map((t) => t.label),
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
      <CinematicHubHero
        hue="violet"
        kicker="Interactive Tools"
        title={<>Knowledge, made <em>actionable</em>.</>}
        lead="Evidence-graded calculators that turn the library into practical models — rule-based, transparent reasoning you can inspect, not a generative black box."
        stats={[
          { value: String(totalToolCount), label: 'Interactive tools' },
          { value: 'Free', label: 'No account needed' },
          { value: 'Local-first', label: 'Private by default' },
        ]}
        primary={{ href: '/nico', label: 'Find your personalized stack' }}
        secondary={{ href: '/library', label: 'Browse the library' }}
      />
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