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
    name: 'The NICO Starter Questionnaire',
    url: `${SITE.url}/quiz`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'The NICO Starter Questionnaire matches your longevity goal, age range, and experience level to one of seven evidence-graded stack presets — Starter, NRF2 Defense, Mitochondrial, Full Hybrid, Longevity Pro, Cardio-Metabolic, or Full-Spectrum 14.',
    featureList: [
      'Mechanism-matched stack presets',
      'PMID-cited insight for your age group',
      'Immediate protocol recommendation',
      'Privacy-first — no account required',
    ],
    faq: [
      {
        '@type': 'Question',
        name: 'How long does The NICO Starter Questionnaire take?',
        acceptedAnswer: { '@type': 'Answer', text: 'Three questions — under 3 minutes. You receive an immediate protocol recommendation with PMID-cited evidence for your age group.' },
      },
      {
        '@type': 'Question',
        name: 'What stack presets does The NICO Starter Questionnaire recommend?',
        acceptedAnswer: { '@type': 'Answer', text: 'The NICO Starter Questionnaire maps to one of seven presets: Starter, NRF2 Defense, Mitochondrial, Full Hybrid, Longevity Pro, Cardio-Metabolic, or Full-Spectrum 14. Each preset is built from evidence-graded Tier A/B compounds.' },
      },
      {
        '@type': 'Question',
        name: 'Is my questionnaire data stored?',
        acceptedAnswer: { '@type': 'Answer', text: 'Your questionnaire result is saved locally in your browser — no account, no server storage. Data stays in your browser until you clear it or export via the dashboard.' },
      },
    ],
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'NICO Starter Questionnaire', path: '/quiz' },
  ]);

  return [quizApp, buildSoftwareApplicationSchema(), breadcrumb];
}

export default function QuizPage() {
  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={buildQuizSchemas()} />
      <QuizPageContent />
    </SubPageLayout>
  );
}