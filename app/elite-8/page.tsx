import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { Elite8Hub } from '@/components/elite8/Elite8Hub';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildArticleSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { getScoredCompounds } from '@/lib/elite-8-data';
import { SITE } from '@/lib/site';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import { ContinueTrail } from '@/components/ui/WalkCard';

export const metadata = seoRoutes.elite8();

function buildElite8ItemListSchema() {
  const compounds = getScoredCompounds();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Elite 8 Longevity Compounds — Ranked by Longevity Quotient',
    description:
      'Eight premier longevity interventions ranked by the Longevity Quotient: a weighted synthesis of clinical evidence, epigenetic impact, effect size, evolutionary conservation, safety, and bioavailability.',
    url: `${SITE.url}/elite-8`,
    numberOfItems: compounds.length,
    itemListElement: compounds.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${c.name} — LQ ${c.score.toFixed(1)}`,
      description: c.mechanism,
      url: c.libraryHref ? `${SITE.url}${c.libraryHref}` : `${SITE.url}/elite-8`,
    })),
  };
}

export default function Elite8Page() {
  const schemas = [
    buildElite8ItemListSchema(),
    buildArticleSchema({
      title: 'Elite 8 Longevity Rankings — Longevity Quotient',
      description:
        'Eight premier longevity interventions ranked by the Longevity Quotient — a calibrated synthesis of clinical rigor, epigenetic signals, evolutionary conservation, and safety.',
      path: '/elite-8',
      evidenceTier: 'A',
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Elite 8 Rankings', path: '/elite-8' },
    ]),
  ];

  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={schemas} />
      <Elite8Hub />
      <div className="container-page pb-16">
        <ContinueTrail
          title="After the Elite shortlist."
          items={[
            { href: '/library', kicker: 'Explore', title: 'Explore the library', detail: 'Full evidence modules for every ranked compound.', accent: 'cyan' },
            { href: '/stacks', kicker: 'Decide', title: 'Build in Stack Architect', detail: 'Load Elite picks and check interactions.', accent: 'violet' },
            { href: '/shop', kicker: 'Verify', title: 'Verify stack', detail: 'Dose-matched buyer checklists.', accent: 'amber' },
            { href: '/nico', kicker: 'Start', title: 'Start with NICO', detail: 'Personalize beyond the global shortlist.', accent: 'emerald' },
          ]}
        />
        <PageConnections cluster={clusterFrom('explore', '/elite-8')} accent="amber" id="elite8-explore-connections" />
        <PageConnections cluster={clusterFrom('decide', '/elite-8')} accent="violet" id="elite8-decide-connections" className="mt-6" />
        <PageConnections cluster={clusterFrom('verify', '/elite-8')} accent="emerald" id="elite8-verify-connections" className="mt-6" />
      </div>
    </SubPageLayout>
  );
}
