import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { NicoQuestionnaire } from '@/components/nico/NicoQuestionnaire';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { SITE } from '@/lib/site';
import { STACK_ARCHITECT } from '@/lib/product-names';

export const metadata = seoRoutes.nico();

function buildNicoSchemas() {
  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NICO Starter Questionnaire',
    url: `${SITE.url}/nico`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'A personalized longevity questionnaire that computes an evidence-graded compound stack from your goals, lifestyle signals, focus areas, and safety profile.',
    featureList: [
      'Personalized stack computed from your answers',
      'Evidence-graded Tier A/B/C compounds',
      'Built-in safety screen and interaction holds',
      `One-click hand-off into ${STACK_ARCHITECT}`,
      'Privacy-first — no account required',
    ],
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'NICO Starter Questionnaire', path: '/nico' },
  ]);

  return [app, breadcrumb];
}

export default function NicoPage() {
  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={buildNicoSchemas()} />
      <NicoQuestionnaire />
    </SubPageLayout>
  );
}
