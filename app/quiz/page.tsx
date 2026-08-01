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
    name: 'The Nico Starter Questionnaire',
    url: `${SITE.url}/quiz`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'A goal, concern, age, experience, budget, and safety-flag questionnaire that matches your longevity profile to a personalized evidence-graded supplement stack preset — NRF2 Defense, NAD+ Restoration, Mitochondrial Health, Senolytic Protocol, Foundation, or Elite.',
    featureList: [
      'Mechanism-matched stack presets, refined by your stated concern',
      'Real cost comparison against your stated budget',
      'PMID-cited insight for your age group',
      'Compound-specific safety cautions when you flag a condition',
      'Privacy-first — no account required',
    ],
    faq: [
      {
        '@type': 'Question',
        name: 'How long does the longevity questionnaire take?',
        acceptedAnswer: { '@type': 'Answer', text: 'A handful of quick-tap questions — under 2 minutes. You receive an immediate protocol recommendation with PMID-cited evidence for your age group.' },
      },
      {
        '@type': 'Question',
        name: 'What stack presets does the questionnaire recommend?',
        acceptedAnswer: { '@type': 'Answer', text: 'It maps to one of seven presets: Foundation, NRF2 Defense, Mitochondrial, Full Hybrid, Longevity Pro, Cardio-Metabolic, or Full-Spectrum 14. Each preset is built from evidence-graded Tier A/B/C compounds.' },
      },
      {
        '@type': 'Question',
        name: 'Is my questionnaire data stored?',
        acceptedAnswer: { '@type': 'Answer', text: 'Your result is saved locally in your browser — no account, no server storage. Data stays in your browser until you clear it or export via the dashboard.' },
      },
    ],
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'The Nico Starter Questionnaire', path: '/quiz' },
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