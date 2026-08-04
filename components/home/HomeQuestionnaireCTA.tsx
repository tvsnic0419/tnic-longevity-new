import Link from 'next/link';
import { ClipboardList, ArrowRight, ShieldCheck, FlaskConical, Lock } from 'lucide-react';
import { QUESTIONNAIRE_NAME, quizSteps } from '@/lib/questionnaire';

/**
 * Hero CTA pointing at the questionnaire, which lives at the site root.
 *
 * This replaced an embedded copy of the quiz flow. Running the real
 * questionnaire in two places meant two entry points competing to be the front
 * door — and the embedded one was the shallow three-question version that made
 * the recommendation feel arbitrary. One questionnaire, one home.
 */

const points = [
  { icon: FlaskConical, text: 'Evidence-graded, PMID-traceable compounds' },
  { icon: ShieldCheck, text: 'Screened against your meds and conditions' },
  { icon: Lock, text: 'No account, no tracking, no stored data' },
];

export function HomeQuestionnaireCTA() {
  return (
    <div className="p-6 md:p-8">
      <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent-cyan">
        <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
        {quizSteps.length} questions · ~3 minutes
      </p>
      <h2 className="heading-card mb-2 text-xl">{QUESTIONNAIRE_NAME}</h2>
      <p className="text-body-sm mb-5 text-white/70">
        Goal, age, experience, sleep, energy, stress, movement, and a safety screen — matched to an evidence-graded
        stack with the reasoning shown for every compound.
      </p>

      <ul className="mb-6 space-y-2.5">
        {points.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-2.5 text-body-sm text-white/70">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>

      <Link
        href="/"
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-accent-cyan px-4 py-3.5 text-body-sm font-semibold text-black transition-colors hover:bg-accent-emerald"
      >
        Start the questionnaire
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
