import Dashboard from '@/components/dashboard/Dashboard';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

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
      'Quiz result persistence',
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
    </>
  );
}