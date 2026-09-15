import Dashboard from '@/components/dashboard/Dashboard';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import { ContinueTrail } from '@/components/ui/WalkCard';

export const metadata = seoRoutes.dashboard();

function buildDashboardSchemas() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNiC Personal Longevity Dashboard',
    url: `${SITE.url}/dashboard`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Privacy-first personal longevity dashboard: track your active supplement stack, monitor progress toward longevity goals, and view protocol history. All data stored locally — no account required.',
    featureList: [
      'Active stack tracker',
      'Protocol history log',
      'Biomarker trend visualization',
      'Questionnaire result persistence',
      'Local-only data with CSV export',
    ],
    isAccessibleForFree: true,
  };
  return [webApp, buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
  ])];
}

export default function DashboardPage() {
  return (
    <>
      <StructuredData schemas={buildDashboardSchemas()} />
      <Dashboard />
      <div className="container-page pb-16">
        <ContinueTrail
          title="Continue from your OS."
          items={[
            { href: '/nico', kicker: 'Start', title: 'Start with NICO', detail: 'Refresh a personalized starter when goals change.', accent: 'emerald' },
            { href: '/stacks', kicker: 'Decide', title: 'Open Stack Architect', detail: 'Edit the protocol your dashboard is tracking.', accent: 'violet' },
            { href: '/labs', kicker: 'Track', title: 'Log labs', detail: 'Baseline and retest the markers that matter.', accent: 'rose' },
            { href: '/shop', kicker: 'Verify', title: 'Verify stack', detail: 'COA checklists for the compounds you are running.', accent: 'amber' },
          ]}
        />
        <PageConnections cluster={clusterFrom('start', '/dashboard')} accent="emerald" id="dashboard-connections" />
        <PageConnections cluster={clusterFrom('verify', '/dashboard')} accent="amber" id="dashboard-verify-connections" className="mt-6" />
      </div>
    </>
  );
}
