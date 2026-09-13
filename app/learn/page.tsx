import { Suspense } from 'react';
import { BookOpen } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { getHubContext } from '@/lib/hub-context';
import { LearnPageClient } from '@/components/learn/LearnPageClient';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { gettingStartedSteps, consumerFAQ, glossary } from '@/lib/data';
import { SITE } from '@/lib/site';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';

export const metadata = seoRoutes.learn();

function buildLearnSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start Your Longevity Protocol with TNiC',
    description:
      'A 5-step guide to getting oriented with TNiC — how evidence is graded, reading the hallmarks library, comparing nutrients and compounds, safety basics, and tracking biomarkers privately.',
    path: '/learn',
    totalTime: 'PT15M',
    steps: gettingStartedSteps.map((s) => ({
      name: s.title,
      text: s.desc,
      url: `${SITE.url}${s.link.startsWith('/') ? s.link : '/learn'}`,
    })),
  });

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: consumerFAQ.slice(0, 8).map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Learn Hub', path: '/learn' },
  ]);

  return [howTo, faqPage, breadcrumb];
}

export default function LearnPage() {
  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={buildLearnSchemas()} />
      <CinematicHubHero
        hue="amber"
        kicker="Learn Hub"
        title={<>Understand it, <em>then</em> take it.</>}
        lead="The plain-language layer over the whole site — how evidence is graded, what the jargon means, what results to actually expect, and the red flags that should stop you. Start here before any protocol."
        stats={[
          { value: String(consumerFAQ.length), label: 'Answered questions' },
          { value: String(glossary.length), label: 'Glossary terms' },
          { value: String(gettingStartedSteps.length), label: 'Getting-started steps' },
        ]}
        primary={{ href: '/nico', label: 'Find your personalized stack' }}
        secondary={{ href: '/library', label: 'Browse the library' }}
      />
      {/* Identity on the server, ahead of the client island — see the note in
          app/stacks/page.tsx and STYLE_GUIDE §14. LearnPageClient reads the
          ?tab= param, so nothing below it reached the initial HTML.
          LearnCenter also rendered a SECOND CinematicHubHero of its own under
          this page's, with different copy — visible as two stacked hero bands
          once the island hydrated. The page's hero is the canonical one; the
          duplicate is gone. */}
      <PageShell className="bg-background">
        <PageHeader
          icon={BookOpen}
          eyebrow="Learn"
          title="Learn Before You Stack"
          description="Intelligent consumers ask hard questions. TNiC answers them openly — from first-time basics to supplement industry red flags."
          theme="cyan"
          context={getHubContext('learn')}
          contextVariant="compact"
        />
        <Suspense fallback={<div className="py-20 text-muted-foreground">Loading…</div>}>
          <LearnPageClient />
        </Suspense>
      {/* This page's body is a client island behind Suspense, so it
          server-rendered almost no in-body links — a reader arriving from
          search, and every crawler, saw a shell that connected to nothing. */}
      <div className="container-page">
        <PageConnections cluster={clusterFrom('explore', '/learn')} accent="cyan" id="explore-connections" />
      </div>
      </PageShell>
    </SubPageLayout>
  );
}