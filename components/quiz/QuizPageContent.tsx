'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StarterQuiz } from '@/components/sections/StarterQuiz';

/**
 * Every "take the questionnaire" link site-wide points straight here — so this page
 * is the questions, not a landing page that explains them first. No
 * PageHeader/ContextRail preamble: StarterQuiz's own compact header (eyebrow,
 * step dots, progress bar) is the framing. Answering the first question is
 * the only thing between a click anywhere else on the site and this page.
 */
export function QuizPageContent() {
  return (
    <div className="container-page py-6 md:py-8">
      <Link
        href="/"
        className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-4 rounded-md"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to homepage
      </Link>

      <div className="max-w-2xl mx-auto">
        <StarterQuiz variant="page" />
      </div>
    </div>
  );
}