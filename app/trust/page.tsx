import { TrustHub } from '@/components/trust/TrustHub';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema, buildOrganizationSchema } from '@/lib/seo';

export const metadata = seoRoutes.trust();

function buildTrustSchemas() {
  return [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Trust', path: '/trust' },
    ]),
  ];
}

export default function TrustPage() {
  return (
    <>
      <StructuredData schemas={buildTrustSchemas()} />
      <TrustHub />
    </>
  );
}