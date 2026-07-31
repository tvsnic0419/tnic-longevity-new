import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { CompoundIntelligenceEngine } from '@/components/engine/CompoundIntelligenceEngine';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildArticleSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { COMPOUND_DB } from '@/lib/compound-engine-data';
import { SITE } from '@/lib/site';

export const metadata = seoRoutes.compoundEngine();

function buildEngineSchemas() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNiC Compound Intelligence Engine',
    url: `${SITE.url}/compound-engine`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Mechanistic scoring instrument for longevity supplement stacks: scores each compound on evidence, effect, breadth, bioavailability and safety, resolves stack synergy, and maps coverage across the 12 hallmarks of aging. Rule-based, transparent — not generative AI.',
    featureList: [
      'Per-compound mechanistic scoring',
      'Adjustable scoring-model weights',
      'Stack synergy + convergent-pathway analysis',
      'Interaction, redundancy and redox-load cautions',
      'Hallmark coverage bloom',
      'Evidence provenance fact-check',
    ],
    isAccessibleForFree: true,
    about: {
      '@type': 'Thing',
      name: 'Hallmarks of Aging',
      description: `Coverage mapped across 12 hallmarks over ${COMPOUND_DB.length} curated compounds.`,
    },
  };
  return [
    webApp,
    buildArticleSchema({
      title: 'Compound Intelligence Engine — Mechanistic Stack Scoring',
      description:
        'A transparent, rule-based instrument that scores longevity compounds and stacks on evidence, effect, breadth, bioavailability and safety, and maps hallmark coverage.',
      path: '/compound-engine',
      evidenceTier: 'B',
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Compound Intelligence Engine', path: '/compound-engine' },
    ]),
  ];
}

export default function CompoundEnginePage() {
  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={buildEngineSchemas()} />
      <CompoundIntelligenceEngine />
    </SubPageLayout>
  );
}
