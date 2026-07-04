'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { stackPresets } from '@/lib/presets';

const DEFAULT_IDS = new Set<string>(stackPresets.starter.ids);

function isDefaultStack(selected: string[]) {
  if (selected.length !== DEFAULT_IDS.size) return true;
  return selected.every((id) => DEFAULT_IDS.has(id));
}

export function OnboardingStrip() {
  const { quizResult, selected, labs, profile } = usePlatform();

  const steps = [
    {
      id: 'quiz',
      label: 'Take the quiz',
      sublabel: 'Get your personalized stack preset',
      href: '/quiz',
      done: !!quizResult,
    },
    {
      id: 'stack',
      label: 'Build your stack',
      sublabel: 'Customize compounds in Stack Architect',
      href: '/stacks',
      done: !isDefaultStack(selected),
    },
    {
      id: 'labs',
      label: 'Log baseline labs',
      sublabel: 'Set week-0 reference points',
      href: '/labs',
      done: labs.length > 0,
    },
    {
      id: 'scan',
      label: 'Run defense scan',
      sublabel: 'Calibrate your biological age estimate',
      href: '/tools?tab=healthspan',
      done: profile.scanned,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;

  if (completedCount === steps.length) return null;

  const nextStep = steps.find((s) => !s.done);

  return (
    <div className="glass rounded-2xl border border-accent-cyan/20 p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-label text-accent-cyan">GET STARTED</p>
          <p className="text-sm font-semibold mt-0.5">
            {completedCount === 0
              ? 'Set up your Longevity OS in 4 steps'
              : `${completedCount} of ${steps.length} setup steps complete`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`w-2 h-2 rounded-full transition-colors ${s.done ? 'bg-accent-emerald' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {steps.map((step, i) => (
          <Link
            key={step.id}
            href={step.done ? step.href : step.href}
            className={`focus-ring flex items-start gap-2.5 rounded-xl p-3 transition-all text-left group ${
              step.done
                ? 'opacity-50 cursor-default pointer-events-none'
                : nextStep?.id === step.id
                  ? 'bg-accent-cyan/10 border border-accent-cyan/30 hover:bg-accent-cyan/15'
                  : 'glass hover:bg-muted/40'
            }`}
          >
            {step.done ? (
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-snug">
                <span className="text-muted-foreground font-mono mr-1">{i + 1}.</span>
                {step.label}
              </p>
              {!step.done && (
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                  {step.sublabel}
                </p>
              )}
            </div>
            {nextStep?.id === step.id && (
              <ChevronRight className="w-3.5 h-3.5 text-accent-cyan shrink-0 ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
