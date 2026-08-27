'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, ClipboardList, Layers, Wrench } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { cn } from '@/lib/utils';

type CompassPath = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: typeof ClipboardList;
  accent: 'cyan' | 'violet' | 'emerald' | 'amber';
  meta?: string;
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
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.title}
                href={path.href}
                className={cn(
                  'focus-ring group min-h-40 rounded-xl border p-4 transition-colors',
                  path.accent === 'cyan' && 'border-accent-cyan/25 bg-accent-cyan/[0.035] hover:bg-accent-cyan/[0.08]',
                  path.accent === 'violet' && 'border-accent-violet/25 bg-accent-violet/[0.035] hover:bg-accent-violet/[0.08]',
                  path.accent === 'emerald' && 'border-accent-emerald/25 bg-accent-emerald/[0.035] hover:bg-accent-emerald/[0.08]',
                  path.accent === 'amber' && 'border-accent-amber/25 bg-accent-amber/[0.035] hover:bg-accent-amber/[0.08]',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      path.accent === 'cyan' && 'text-accent-cyan',
                      path.accent === 'violet' && 'text-accent-violet',
                      path.accent === 'emerald' && 'text-accent-emerald',
                      path.accent === 'amber' && 'text-accent-amber',
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-micro font-mono uppercase tracking-[0.1em] text-muted-foreground">{path.eyebrow}</span>
                </div>
                <p className="mt-4 text-sm font-semibold leading-snug text-foreground group-hover:text-accent-cyan">{path.title}</p>
                <p className="mt-2 text-caption leading-relaxed text-muted-foreground">{path.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2 text-micro font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  <span>{path.meta}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-cyan" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
