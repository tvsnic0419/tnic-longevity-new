'use client';

import { BookOpen, ClipboardList, Layers, Wrench } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { cn } from '@/lib/utils';
import { ActionCard } from '@/components/ui/ActionCard';

type CompassPath = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: typeof ClipboardList;
  accent: 'cyan' | 'violet' | 'emerald' | 'amber';
  meta?: string;
  featured?: boolean;
};

/**
 * Reduces Stack Architect's first-session choice load. Every path remains an
 * existing educational route; the component carries no stack rules or safety
 * calculations of its own.
 */
export function StackStartCompass() {
  const { selected, quizResult } = usePlatform();

  const paths: CompassPath[] = [
    ...(selected.length > 0
      ? [{
          eyebrow: 'Continue',
          title: 'Inspect your active configuration',
          description: 'Return to the builder with your current compounds, coverage, and interaction checks in view.',
          href: '/stacks?view=builder',
          icon: Layers,
          accent: 'violet' as const,
          meta: `${selected.length} active ${selected.length === 1 ? 'compound' : 'compounds'}`,
          featured: true,
        }]
      : []),
    {
      eyebrow: quizResult ? 'Refine' : 'Start with a goal',
      title: quizResult ? 'Revisit your NICO starting point' : 'Answer nine adjustable questions',
      description: quizResult
        ? 'Reopen the existing goal-led questionnaire before changing a starting stack.'
        : 'Use the NICO Starter Questionnaire to open an evidence-graded starting configuration.',
      href: '/nico',
      icon: ClipboardList,
      accent: 'cyan',
      meta: quizResult ? 'Goal already saved locally' : 'Goal-led entry',
      featured: selected.length === 0,
    },
    {
      eyebrow: 'Inspect',
      title: 'Review a curated stack first',
      description: 'Open a pre-built protocol and examine its authored evidence, timing, and coverage before you customize.',
      href: '/stacks?view=catalog',
      icon: BookOpen,
      accent: 'amber',
      meta: 'Curated protocols',
    },
    {
      eyebrow: 'Build',
      title: 'Start with the catalogue',
      description: 'Search the evidence-graded compound catalogue and use the existing live analysis as you assemble a stack.',
      href: '/stacks?view=builder',
      icon: Wrench,
      accent: 'emerald',
      meta: 'Build from scratch',
    },
  ];

  return (
    <section className="card-floating card-shine relative mb-8 overflow-hidden rounded-2xl p-5 md:p-6" aria-labelledby="stack-compass-title">
      <div className="pointer-events-none absolute -left-12 top-0 h-40 w-40 rounded-full bg-accent-violet/15 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-micro font-mono uppercase tracking-[0.14em] text-accent-violet">Starting point</p>
            <h2 id="stack-compass-title" className="mt-2 text-xl font-bold tracking-tight">Choose the way you want to inspect a stack.</h2>
            <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">Begin with a goal, a curated blueprint, or your own catalogue search. The same existing evidence and interaction checks follow each route.</p>
          </div>
          <p className="text-micro font-mono uppercase tracking-[0.11em] text-muted-foreground">Educational planning only</p>
        </div>

        <div className={cn('mt-5 grid gap-2', paths.length === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3')}>
          {paths.map((path) => (
            <ActionCard
              key={path.title}
              eyebrow={path.eyebrow}
              title={path.title}
              description={path.description}
              href={path.href}
              icon={path.icon}
              accent={path.accent}
              meta={path.meta}
              featured={path.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
