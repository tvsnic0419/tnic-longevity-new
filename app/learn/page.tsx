import { Suspense } from 'react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { LearnPageClient } from '@/components/learn/LearnPageClient';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildHowToSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { gettingStartedSteps, consumerFAQ } from '@/lib/data';
import { SITE } from '@/lib/site';

export const metadata = seoRoutes.learn();

function buildLearnSchemas() {
  const howTo = buildHowToSchema({
    name: 'How to Start Your Longevity Protocol with TNiC',
    description:
      'A 5-step onboarding guide for setting up your personalized anti-aging stack using the TNiC Longevity OS — quiz, biomarkers, stack building, safety review, and progress tracking.',
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
    <SubPageLayout>
      <StructuredData schemas={buildLearnSchemas()} />
      <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Loading…</div>}>
        <LearnPageClient />
      </Suspense>
    </SubPageLayout>
  );
}