'use client';

import Link from 'next/link';
import { ClipboardList, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { StarterQuiz } from '@/components/sections/StarterQuiz';
import { ContextRail } from '@/components/ui/ContextRail';
import { getHubContext } from '@/lib/hub-context';

/**
 * The dedicated /quiz route leads with the quiz itself, not a pitch for it.
 * Someone who clicked "Quiz" already wants to take it, so the interactive card
 * sits above the fold behind only a compact intro; the "what this is / why it
 * matters / what to do next" reassurance moves *below* the quiz for anyone who
 * scrolls. (Previously a full-height hero + that 3-card rail pushed the first
 * answer option a whole screen below the fold — ~950px down on desktop, ~1120px
 * on mobile — so the page read as a landing page, not a quiz.)
 */
export function QuizPageContent() {
  const context = getHubContext('quiz');

  return (
    <div className="container-page py-6 md:py-10">
      <Link
        href="/"
        className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-6 rounded-md"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to homepage
      </Link>

      <div className="max-w-xl mx-auto">
        {/* Compact intro — enough to orient, small enough that the quiz's first
            question is visible without scrolling. */}
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 card-ultra rounded-full px-4 py-2 mb-4 text-body-sm">
            <ClipboardList className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
            <span className="text-foreground/90">3 questions · ~3 minutes</span>
          </div>
          <h1 className="heading-page text-3xl md:text-4xl mb-3">Find your longevity entry point</h1>
          <p className="text-body-sm text-muted-foreground max-w-md mx-auto">
            Answer three quick questions for an evidence-graded stack preset and your best next
            step — no account required.
          </p>
        </header>

        <StarterQuiz variant="page" />

        <p className="flex items-center justify-center gap-2 text-caption font-mono mt-5">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          Private by default · results saved locally in your browser
        </p>

        {/* Reassurance context, moved below the quiz so it never blocks it. */}
        {context && (
          <ContextRail
            what={context.what}
            why={context.why}
            next={context.next}
            theme="emerald"
            className="mt-12"
          />
        )}

        <p className="flex items-center justify-center gap-2 text-caption font-mono mt-6">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          Under 3 minutes · Retake anytime
        </p>
      </div>
    </div>
  );
}
