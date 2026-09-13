import { Suspense } from 'react';
import { Calculator } from 'lucide-react';
import { ToolsHub } from '@/components/tools/ToolsHub';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { HubSplitInstrument, HUB_ACCENT_VAR } from '@/components/viz/HubSplitInstrument';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { toolsRegistry } from '@/lib/registry';
import { SITE } from '@/lib/site';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';

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
      `${toolsRegistry.length} evidence-graded longevity tools: ${toolsRegistry.map((t) => t.label).join(', ')}.`,
    featureList: toolsRegistry.map((t) => t.label),
    isAccessibleForFree: true,
  };
  return [webApp, buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
  ])];
}

export default function ToolsPage() {
  const badgeRows = [
    {
      key: 'new',
      label: 'New',
      count: toolsRegistry.filter((t) => t.badge === 'New').length,
      color: HUB_ACCENT_VAR.cyan,
    },
    {
      key: 'advanced',
      label: 'Advanced',
      count: toolsRegistry.filter((t) => t.badge === 'Advanced').length,
      color: HUB_ACCENT_VAR.violet,
    },
    {
      key: 'core',
      label: 'Core',
      count: toolsRegistry.filter((t) => !t.badge).length,
      color: HUB_ACCENT_VAR.emerald,
    },
  ];

  return (
    <>
      <StructuredData schemas={buildToolsSchemas()} />
      <CinematicHubHero
        hue="violet"
        kicker="Interactive Tools"
        title={<>Knowledge, made <em>actionable</em>.</>}
        lead="Evidence-graded calculators that turn the library into practical models — rule-based, transparent reasoning you can inspect, not a generative black box."
        stats={[
          { value: String(toolsRegistry.length), label: 'Interactive tools' },
          { value: 'Free', label: 'No account needed' },
          { value: 'Local-first', label: 'Private by default' },
        ]}
        primary={{ href: '/nico', label: 'Find your personalized stack' }}
        secondary={{ href: '/library', label: 'Browse the library' }}
        figure={
          <HubSplitInstrument
            kicker="Tool shelf"
            total={toolsRegistry.length}
            totalLabel="interactive tools"
            rows={badgeRows}
            href="/compound-engine"
            hrefLabel="Open the scoring engine →"
          />
        }
        figureCaption="Tool split · derived from the tools registry"
      />
      {/* Identity on the server, ahead of the client island — see the note in
          app/stacks/page.tsx and STYLE_GUIDE §14. */}
      <section className="canvas-scrim pt-6 md:pt-8">
        <div className="container-page">
          <PageHeader
            icon={Calculator}
            eyebrow="Interactive Tools"
            title="Longevity Tools"
            description={`${toolsRegistry.length} evidence-graded calculators that turn library knowledge into practical models. Rule-based, transparent reasoning — not generative AI.`}
            theme="violet"
            variant="handoff"
            as="h1"
          />
        </div>
      </section>
      <Suspense
        fallback={
          <div className="container-page py-12">
            <SectionSkeleton height="lg" />
          </div>
        }
      >
        <ToolsHub />
      </Suspense>
      {/* This page's body is a client island behind Suspense, so it
          server-rendered almost no in-body links — a reader arriving from
          search, and every crawler, saw a shell that connected to nothing. */}
      <div className="container-page">
        <PageConnections cluster={clusterFrom('explore', '/tools')} accent="cyan" id="explore-connections" />
      </div>
    </>
  );
}