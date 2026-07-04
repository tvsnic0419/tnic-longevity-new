import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { QuizPageContent } from '@/components/quiz/QuizPageContent';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildSoftwareApplicationSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { SITE } from '@/lib/site';

export const metadata = seoRoutes.quiz();

function buildQuizSchemas() {
  const quizApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNiC 3-Minute Longevity Stack Quiz',
    url: `${SITE.url}/quiz`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Three-question quiz that matches your longevity goal, age range, and experience level to a personalized evidence-graded supplement stack preset — NRF2 Defense, NAD+ Restoration, Mitochondrial Health, Senolytic Protocol, Foundation, or Elite.',
    featureList: [
      'Mechanism-matched stack presets',
      'PMID-cited insight for your age group',
      'Immediate protocol recommendation',
      'Privacy-first — no account required',
    ],
    faq: [
      {
        '@type': 'Question',
        name: 'How long does the longevity quiz take?',
        acceptedAnswer: { '@type': 'Answer', text: 'Three questions — under 3 minutes. You receive an immediate protocol recommendation with PMID-cited evidence for your age group.' },
      },
      {
        '@type': 'Question',
        name: 'What stack presets does the quiz recommend?',
        acceptedAnswer: { '@type': 'Answer', text: 'The quiz maps to one of six presets: NRF2 Defense Triad, NAD+ Mitochondrial Stack, Mitochondrial Health, Senolytic Protocol, Foundation Starter, or Full Hybrid. Each preset is built from evidence-graded Tier A/B compounds.' },
      },
      {
        '@type': 'Question',
        name: 'Is my quiz data stored?',
        acceptedAnswer: { '@type': 'Answer', text: 'Your quiz result is saved locally in your browser — no account, no server storage. Data stays in your browser until you clear it or export via the dashboard.' },
      },
    ],
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Starter Quiz', path: '/quiz' },
  ]);

  return [quizApp, buildSoftwareApplicationSchema(), breadcrumb];
}

export default function QuizPage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={buildQuizSchemas()} />
      <QuizPageContent />
    </SubPageLayout>
  );
}