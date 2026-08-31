'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, FlaskConical, Layers, Scan, Sparkles } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { cn } from '@/lib/utils';

type FocusStep = {
  id: 'nico' | 'stack' | 'labs' | 'scan';
  eyebrow: string;
  title: string;
  description: string;
  rationale: string;
  href: string;
  icon: typeof ClipboardList;
  accent: string;
  complete: boolean;
};

const goalLabels: Record<string, string> = {
  learn: 'Learning the science',
  defense: 'Cellular defense',
  energy: 'Mitochondrial energy',
  full: 'Full longevity optimization',
  longevity: 'Senolytic & healthspan focus',
  metabolic: 'Cardio-metabolic health',
};

/**
 * A compact decision surface for the private, browser-held TNiC journey state.
 * It deliberately presents only existing routes and facts; it never changes the
 * platform ranking, scoring, recommendations, or data model.
 */
export function DashboardFocusDeck() {
  const { quizResult, selected, labs, profile } = usePlatform();

  const steps: FocusStep[] = [
    {
      id: 'nico',
      eyebrow: 'Goal',
      title: 'Choose a starting point',
      description: 'Use nine adjustable questions to open an evidence-graded starter stack.',
      rationale: 'A stated goal gives the rest of this workspace useful context.',
      href: '/nico',
      icon: ClipboardList,
      accent: 'cyan',
      complete: Boolean(quizResult),
    },
    {
      id: 'stack',
      eyebrow: 'Configuration',
      title: 'Build or inspect your stack',
      description: 'Review an existing configuration before you add, remove, or verify anything.',
      rationale: 'A visible configuration is the foundation for coverage and interaction checks.',
      href: '/stacks?view=builder',
      icon: Layers,
      accent: 'violet',
      complete: selected.length > 0,
    },
    {
      id: 'labs',
      eyebrow: 'Baseline',
      title: 'Log a result you already have',
      description: 'Keep a local week-zero reference point for later trend review.',
      rationale: 'A baseline makes a future trend more interpretable than a single snapshot.',
      href: '/labs?mode=single',
      icon: FlaskConical,
      accent: 'emerald',
      complete: labs.length > 0,
    },
    {
      id: 'scan',
      eyebrow: 'Review',
      title: 'Run the defense scan',
      description: 'Explore a transparent, educational model in the existing Tools workspace.',
      rationale: 'This completes the current four-part dashboard setup path.',
      href: '/tools?tab=healthspan',
      icon: Scan,
      accent: 'amber',
      complete: profile.scanned,
    },
  ];

  const completed = steps.filter((step) => step.complete).length;
  const next = steps.find((step) => !step.complete);
  const fallback = {
    eyebrow: 'Continue',
    title: 'Return to your saved research',
    description: 'Resume the evidence modules you chose to keep in this browser.',
    rationale: 'Your setup is complete. Keep the evidence question in view as you explore.',
    href: '/library#research-queue',
    icon: BookOpen,
    accent: 'cyan',
  } as const;
  const focus = next ?? fallback;
  const FocusIcon = focus.icon;

  return (
    <section
      className="card-floating card-shine relative mb-8 overflow-hidden rounded-2xl p-5 md:p-6"
      aria-labelledby="dashboard-focus-title"
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-accent-violet/15 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-violet" aria-hidden="true" />
              <p className="text-micro font-mono uppercase tracking-[0.14em] text-accent-violet">Your focus</p>
            </div>
            <h2 id="dashboard-focus-title" className="mt-2 text-xl font-bold tracking-tight">
              {completed === steps.length ? 'Your workspace is ready to revisit.' : `${completed} of ${steps.length} setup signals are in place.`}
            </h2>
            <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">
              {quizResult ? `Current goal: ${goalLabels[quizResult.goal] ?? quizResult.goal}. ` : ''}
              One clear action at a time; all status remains private to this browser.
            </p>
          </div>
          <div className="flex gap-1.5" aria-label={`${completed} of ${steps.length} setup signals complete`}>
            {steps.map((step) => (
              <span
                key={step.id}
                className={cn('h-1.5 w-7 rounded-full', step.complete ? 'bg-accent-emerald' : 'bg-border')}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <Link
          href={focus.href}
          className={cn(
            'focus-ring group mt-5 flex flex-col gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
            focus.accent === 'violet' && 'border-accent-violet/30 bg-accent-violet/[0.07] hover:bg-accent-violet/[0.11]',
            focus.accent === 'emerald' && 'border-accent-emerald/30 bg-accent-emerald/[0.07] hover:bg-accent-emerald/[0.11]',
            focus.accent === 'amber' && 'border-accent-amber/30 bg-accent-amber/[0.07] hover:bg-accent-amber/[0.11]',
            focus.accent === 'cyan' && 'border-accent-cyan/30 bg-accent-cyan/[0.07] hover:bg-accent-cyan/[0.11]',
          )}
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/35">
              <FocusIcon
                className={cn(
                  'h-4.5 w-4.5',
                  focus.accent === 'violet' && 'text-accent-violet',
                  focus.accent === 'emerald' && 'text-accent-emerald',
                  focus.accent === 'amber' && 'text-accent-amber',
                  focus.accent === 'cyan' && 'text-accent-cyan',
                )}
                aria-hidden="true"
              />
            </span>
            <div className="min-w-0">
              <p className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">{focus.eyebrow} · next action</p>
              <p className="mt-1 text-base font-semibold text-foreground">{focus.title}</p>
              <p className="mt-1 text-body-sm leading-relaxed text-muted-foreground">{focus.description}</p>
              <p className="mt-2 text-caption text-muted-foreground"><span className="font-semibold text-foreground">Why this first:</span> {focus.rationale}</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground group-hover:text-accent-cyan">
            Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-caption text-muted-foreground">
          {steps.map((step) => (
            <span key={step.id} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className={cn('h-3.5 w-3.5', step.complete ? 'text-accent-emerald' : 'text-muted-foreground/60')} aria-hidden="true" />
              {step.eyebrow}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
