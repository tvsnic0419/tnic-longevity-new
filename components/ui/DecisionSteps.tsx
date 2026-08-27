import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';

export interface DecisionStepItem {
  title: string;
  detail: string;
  href?: string;
  icon: LucideIcon;
}

const themeClasses: Record<ThemeAccent, { text: string; border: string; surface: string; icon: string }> = {
  cyan: {
    text: 'text-accent-cyan',
    border: 'border-accent-cyan/25 hover:border-accent-cyan/45',
    surface: 'bg-accent-cyan/[0.055] hover:bg-accent-cyan/[0.09]',
    icon: 'bg-accent-cyan/[0.12] text-accent-cyan',
  },
  emerald: {
    text: 'text-accent-emerald',
    border: 'border-accent-emerald/25 hover:border-accent-emerald/45',
    surface: 'bg-accent-emerald/[0.055] hover:bg-accent-emerald/[0.09]',
    icon: 'bg-accent-emerald/[0.12] text-accent-emerald',
  },
  violet: {
    text: 'text-accent-violet',
    border: 'border-accent-violet/25 hover:border-accent-violet/45',
    surface: 'bg-accent-violet/[0.055] hover:bg-accent-violet/[0.09]',
    icon: 'bg-accent-violet/[0.12] text-accent-violet',
  },
  rose: {
    text: 'text-accent-rose',
    border: 'border-accent-rose/25 hover:border-accent-rose/45',
    surface: 'bg-accent-rose/[0.055] hover:bg-accent-rose/[0.09]',
    icon: 'bg-accent-rose/[0.12] text-accent-rose',
  },
  amber: {
    text: 'text-accent-amber',
    border: 'border-accent-amber/25 hover:border-accent-amber/45',
    surface: 'bg-accent-amber/[0.055] hover:bg-accent-amber/[0.09]',
    icon: 'bg-accent-amber/[0.12] text-accent-amber',
  },
};

/**
 * A consistent orientation surface for high-intent TNiC experiences. It makes
 * the first three actions clear without reducing the surrounding page to a
 * conversion funnel or implying an individualized health recommendation.
 */
export function DecisionSteps({
  eyebrow = 'A confident path',
  title,
  detail,
  steps,
  theme = 'cyan',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  detail: string;
  steps: DecisionStepItem[];
  theme?: ThemeAccent;
  className?: string;
}) {
  const colors = themeClasses[theme];

  return (
    <section className={`card-floating card-shine relative overflow-hidden rounded-2xl p-5 md:p-6 ${className}`} aria-label={title}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/[0.035] blur-3xl" aria-hidden="true" />
      <div className="relative">
        <p className={`text-micro font-mono uppercase tracking-[0.14em] ${colors.text}`}>{eyebrow}</p>
        <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">{detail}</p>
          </div>
          <p className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Inspect before you decide</p>
        </div>
        <ol className="mt-5 grid gap-2.5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const content = (
              <>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={`text-micro font-mono ${colors.text}`}>{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-semibold text-foreground">{step.title}</span>
                  </span>
                  <span className="mt-1 block text-caption leading-relaxed text-muted-foreground">{step.detail}</span>
                </span>
                {step.href && <ArrowRight className={`mt-0.5 h-4 w-4 shrink-0 ${colors.text} transition-transform group-hover:translate-x-0.5`} aria-hidden="true" />}
              </>
            );
            const baseClass = `group flex items-start gap-3 rounded-xl border p-3.5 transition-colors ${colors.border} ${colors.surface}`;
            return (
              <li key={step.title}>
                {step.href ? (
                  <Link href={step.href} className={`focus-ring ${baseClass}`}>
                    {content}
                  </Link>
                ) : (
                  <div className={baseClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
