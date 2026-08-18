import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { CompoundIntelligenceEngine } from '@/components/engine/CompoundIntelligenceEngine';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildArticleSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { COMPOUND_DB, DEFAULT_WEIGHTS } from '@/lib/compound-engine-data';
import { SITE } from '@/lib/site';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';

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
    // Mirrors the visible ContextBar crumb (`routeTitles` in
    // lib/breadcrumb-titles.ts) — Google expects the two to agree.
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Compound Engine', path: '/compound-engine' },
    ]),
  ];
}

export default function CompoundEnginePage() {
  // Same shell as the sibling tool routes (/tools, /stacks, /labs) so the
  // breadcrumb and next action are here, but without the ContextBar's stack
  // readout: the engine scores compounds against its own curated hallmark
  // dataset, which is deliberately not the one `lib/stack-analysis` uses, so
  // rendering both would put two different coverage numbers for the same stack
  // on one screen.
  return (
    <SubPageLayout hideStackReadout>
      <StructuredData schemas={buildEngineSchemas()} />
      <CinematicHubHero
        hue="cyan"
        kicker="Compound Intelligence"
        title={<>Score every compound, <em>mechanistically</em>.</>}
        lead="A transparent, rule-based instrument — evidence, effect, breadth, bioavailability, and safety scored per compound, then resolved across the twelve hallmarks of aging."
        stats={[
          { value: String(COMPOUND_DB.length), label: 'Curated compounds' },
          { value: String(Object.keys(DEFAULT_WEIGHTS).length), label: 'Scoring dimensions' },
          { value: '12', label: 'Hallmarks mapped' },
        ]}
        primary={{ href: '/library', label: 'Browse the compound library' }}
        secondary={{ href: '/tools', label: 'All interactive tools' }}
      />
      <CompoundIntelligenceEngine />
    </SubPageLayout>
  );
}
