import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { NicoQuestionnaire } from '@/components/nico/NicoQuestionnaire';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { SITE } from '@/lib/site';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import { ContinueTrail } from '@/components/ui/WalkCard';

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
      'One-click hand-off into Stack Builder',
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
      {/* This page's body is a client island, so it server-rendered no
          in-body links at all — a reader arriving from search, and every
          crawler, saw a shell that connected to nothing. */}
      <div className="container-page pb-16">
        <ContinueTrail
          title="After NICO."
          items={[
            { href: '/stacks', kicker: 'Decide', title: 'Load stack in Architect', detail: 'Inspect synergies and share a stack URL.', accent: 'violet' },
            { href: '/library', kicker: 'Explore', title: 'Explore the library', detail: 'Read the evidence behind each recommended compound.', accent: 'cyan' },
            { href: '/elite-8', kicker: 'Shortlist', title: 'Compare Elite 8', detail: 'See how your picks rank by Longevity Quotient.', accent: 'amber' },
            { href: '/shop', kicker: 'Verify', title: 'Verify stack', detail: 'COA and dose-form checklist before you buy.', accent: 'emerald' },
          ]}
        />
        <PageConnections cluster={clusterFrom('start', '/nico')} accent="emerald" id="nico-start-connections" />
        <PageConnections cluster={clusterFrom('decide', '/nico')} accent="violet" id="nico-decide-connections" className="mt-6" />
        <PageConnections cluster={clusterFrom('verify', '/nico')} accent="amber" id="nico-verify-connections" className="mt-6" />
      </div>
    </SubPageLayout>
  );
}
