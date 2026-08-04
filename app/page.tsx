import Link from 'next/link';
import { ClipboardList, ShieldCheck, FlaskConical, Lock, ArrowRight } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { QuestionnaireFlow } from '@/components/questionnaire/QuestionnaireFlow';
import { StructuredData } from '@/components/seo/StructuredData';
import {
  buildSoftwareApplicationSchema,
  buildItemListSchema,
  buildPageMetadata,
} from '@/lib/seo';
import { QUESTIONNAIRE_NAME, quizSteps } from '@/lib/questionnaire';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { citationRegistry } from '@/lib/trust';
import { SITE } from '@/lib/site';

/**
 * Homepage — The NICO Starter Questionnaire.
 *
 * The questionnaire is the site's front door: a visitor lands directly on
 * question one rather than scrolling a marketing page to find it. The
 * cinematic overview that used to live here moved to `/explore` intact and is
 * linked from here and from `/results`, so someone who'd rather browse than
 * answer questions is one click away.
 *
 * A server component so the copy, trust signals, and outbound links all render
 * to crawlable HTML — the root URL carries real content, not just a form. Only
 * the question flow itself is a client island.
 */

const HOME_TITLE = `${QUESTIONNAIRE_NAME} — Your Evidence-Graded Longevity Stack`;

export const metadata = {
  ...buildPageMetadata({
    title: HOME_TITLE,
    description:
      'Nine questions — goal, age, experience, sleep, energy, stress, movement, and a safety screen — matched to an evidence-graded supplement stack drawn from a PubMed-backed library of the 12 hallmarks of aging. Free, private, no account.',
    path: '',
    keywords: [
      'longevity questionnaire',
      'personalized supplement stack',
      'evidence-graded supplements',
      'hallmarks of aging',
      'anti-aging protocol quiz',
    ],
  }),
  // Absolute title so the `%s | TNiC` template doesn't double the brand name.
  title: { absolute: HOME_TITLE },
};

const questionnaireSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: QUESTIONNAIRE_NAME,
  url: SITE.url,
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'A nine-question longevity assessment covering goal, age, supplement experience, sleep, energy, stress, movement, and a medication and condition safety screen — resolving to an evidence-graded supplement stack with per-compound safety flags.',
  featureList: [
    'Mechanism-matched stack presets',
    'Safety screen against per-compound contraindication data',
    'Lifestyle burden scoring that shapes the recommendation',
    'Shareable, refresh-safe result page',
    'Privacy-first — no account required',
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `How long does ${QUESTIONNAIRE_NAME} take?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${quizSteps.length} questions — a few minutes. You get an evidence-graded stack, the reasoning behind it, and per-compound safety flags immediately, with no account.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Does the questionnaire check whether a supplement is safe for me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The final question screens for pregnancy or nursing, blood thinners, diabetes and thyroid medication, kidney or liver disease, active cancer treatment, and other prescriptions. Any compound whose curated safety data conflicts is removed or flagged, with the reason shown. This is decision support, not medical advice — always confirm with your doctor or pharmacist.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my questionnaire data stored?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your answers live in the result URL and in your own browser. There is no account and no server-side storage.',
      },
    },
  ],
};

const trustPoints = [
  {
    icon: FlaskConical,
    title: 'Graded on human evidence',
    body: `Every one of the ${COMPOUND_COUNT} compounds carries a Tier A/B/C grade traced to ${citationRegistry.length} PubMed citations — not marketing claims.`,
  },
  {
    icon: ShieldCheck,
    title: 'Screened for safety',
    body: 'The last question checks your medications and conditions against per-compound contraindication data, then removes or flags what conflicts.',
  },
  {
    icon: Lock,
    title: 'Private by default',
    body: 'No account, no tracking pixel, no server-side storage. Your answers stay in your browser and in the result link you choose to share.',
  },
];

const exits = [
  { href: '/explore', label: 'Explore the platform', desc: 'The full overview' },
  { href: '/library', label: 'Anti-Aging Library', desc: `${COMPOUND_COUNT} compound deep-dives` },
  { href: '/hallmarks', label: 'Hallmarks of Aging', desc: `${hallmarkLibrary.length} mechanisms` },
  { href: '/stacks', label: 'Stack Architect', desc: 'Build it yourself' },
  { href: '/compound-engine', label: 'Compound Engine', desc: 'Mechanistic scoring' },
  { href: '/tools', label: 'Tools', desc: 'Local-first calculators' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden canvas-scrim text-foreground">
      <StructuredData
        schemas={[
          questionnaireSchema,
          faqSchema,
          buildSoftwareApplicationSchema(),
          buildItemListSchema(),
        ]}
      />
      <Nav />
      {/* Nav is fixed — clear its height so the eyebrow isn't tucked underneath. */}
      <main id="main-content" tabIndex={-1} className="pt-14 md:pt-16">
        {/*
          Three siblings in DOM order: compact header, questionnaire, then the
          supporting detail. On phones that reads top-to-bottom and puts question
          one within the first screen — measured, because an earlier layout with
          the full framing above the card pushed the first answer to y=989 on a
          375×812 viewport. On desktop the questionnaire spans both rows on the
          right, so the header sits above the detail on the left as before.
        */}
        <section className="container-page grid gap-8 py-10 md:py-16 lg:grid-cols-12 lg:items-start lg:gap-x-12 lg:gap-y-8">
          <div className="lg:col-span-5">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent-cyan">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              {quizSteps.length} questions · ~3 minutes
            </p>
            <h1 className="heading-page mb-3">{QUESTIONNAIRE_NAME}</h1>
            <p className="text-body text-muted-foreground">
              Answer {quizSteps.length} questions. Get an evidence-graded stack, the reasoning behind every compound
              in it, and a plain list of anything removed or flagged for your safety.
            </p>
          </div>

          {/* The questionnaire itself — first screen on mobile, no scrolling to reach it */}
          <div className="lg:col-span-7 lg:row-span-2">
            <QuestionnaireFlow />
          </div>

          <div className="lg:col-span-5">
            <dl className="mb-6 space-y-4">
              {trustPoints.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" aria-hidden="true" />
                  <div>
                    <dt className="heading-card">{title}</dt>
                    <dd className="text-body-sm text-muted-foreground">{body}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <p className="text-caption text-muted-foreground">
              TNiC is an educational resource, not a medical service. Nothing here diagnoses, treats, or prevents
              disease — review any protocol with your physician or pharmacist first. See{' '}
              <Link href="/trust/disclaimers" className="focus-ring rounded underline hover:text-foreground">
                our disclaimers
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Wayfinding — crawlable internal links out of the front door */}
        <section aria-labelledby="explore-heading" className="container-page pb-16 md:pb-24">
          <h2 id="explore-heading" className="heading-section mb-2">
            Rather just look around?
          </h2>
          <p className="text-body mb-6 text-muted-foreground">
            The questionnaire is the fastest way in, but everything it draws on is open to browse.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exits.map((exit) => (
              <li key={exit.href}>
                <Link
                  href={exit.href}
                  className="focus-ring glass glass-hover group flex items-center justify-between gap-3 rounded-xl px-4 py-3.5"
                >
                  <span>
                    <span className="block text-body-sm font-semibold">{exit.label}</span>
                    <span className="block text-caption text-muted-foreground">{exit.desc}</span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
