'use client';

import Link from 'next/link';
import { ClipboardList, Clock, ArrowLeft } from 'lucide-react';
import { StarterQuiz } from '@/components/sections/StarterQuiz';
import { PageHeader } from '@/components/ui/PageHeader';
import { getHubContext } from '@/lib/hub-context';

export function QuizPageContent() {
  return (
    <div className="container-page py-10 md:py-14">
      <Link
        href="/"
        className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-8 rounded-md"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to homepage
      </Link>

      <div className="max-w-xl mx-auto">
        <PageHeader
          icon={ClipboardList}
          eyebrow="~3 minutes"
          title="Find your longevity entry point"
          description="Answer three quick questions. Get an evidence-graded stack preset, your next OS step, and a personalized insight — no account required."
          meta="Goal · Age range · Experience"
          theme="emerald"
          context={getHubContext('quiz')}
        />

        <StarterQuiz variant="page" />

        <p className="flex items-center justify-center gap-2 text-caption font-mono mt-6">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          3 questions · Results saved locally when you load a stack
        </p>
      </div>
    </div>
  );
}