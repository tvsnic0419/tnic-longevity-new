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
      'Nine-question quiz that matches your longevity goal, age range, experience level, and lifestyle (sleep, stress, diet, training, budget, safety) to a personalized evidence-graded supplement stack preset — NRF2 Defense, NAD+ Restoration, Mitochondrial Health, Senolytic Protocol, Foundation, or Elite — with individual compound additions layered on from your lifestyle answers.',
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
        acceptedAnswer: { '@type': 'Answer', text: 'Nine questions — about 5 minutes. You receive an immediate protocol recommendation with PMID-cited evidence for your age group, personalized further by your sleep, stress, diet, and training answers.' },
      },
      {
        '@type': 'Question',
        name: 'What stack presets does the quiz recommend?',
        acceptedAnswer: { '@type': 'Answer', text: 'The quiz maps to one of seven presets: Starter, NRF2 Defense, Mitochondrial, Full Hybrid, Longevity Pro, Cardio-Metabolic, or Full-Spectrum 14. Each preset is built from evidence-graded Tier A/B compounds, and lifestyle answers can add individual compounds on top.' },
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
    <SubPageLayout hideContextBar>
      <StructuredData schemas={buildQuizSchemas()} />
      <QuizPageContent />
    </SubPageLayout>
  );
}