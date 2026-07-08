'use client';

import { ClipboardList, LineChart, Lightbulb, Dna, Shield } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: ClipboardList,
    title: 'Input Your Labs',
    desc: 'Log single markers, enter a full blood panel, or upload a CSV from your lab portal. All processing happens locally.',
  },
  {
    step: 2,
    icon: LineChart,
    title: 'Track Trends',
    desc: 'Repeat tests over time to unlock trajectory charts. Green zones show optimal ranges; trends flag improving vs declining markers.',
  },
  {
    step: 3,
    icon: Dna,
    title: 'Hallmark Risk Map',
    desc: 'Each biomarker links to longevity hallmarks. See which aging processes are under stress and read prognosis insights.',
  },
  {
    step: 4,
    icon: Lightbulb,
    title: 'Get Recommendations',
    desc: 'Personalized compound, monitoring, and clinical suggestions based on your values, trends, and active stack.',
  },
  {
    step: 5,
    icon: Shield,
    title: 'Export & Own Your Data',
    desc: 'Download CSV, sync with your stack builder, or wipe all data. No accounts, no cloud, no lock-in.',
  },
];

interface UserFlowGuideProps {
  currentStep?: number;
}

export function UserFlowGuide({ currentStep = 1 }: UserFlowGuideProps) {
  return (
    <div className="glass rounded-2xl p-5 mb-8">
      <p className="text-[10px] font-mono text-accent-rose uppercase tracking-wider mb-4">User Flow</p>

      {/* Step indicator row */}
      <div className="flex items-center mb-5 px-1">
        {steps.map((s, i) => {
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          return (
            <div key={s.step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-300"
                  style={{
                    background: isDone
                      ? 'var(--accent-emerald)'
                      : isCurrent
                        ? 'color-mix(in srgb, var(--accent-rose) 20%, transparent)'
                        : 'color-mix(in srgb, currentColor 6%, transparent)',
                    border: isCurrent
                      ? '1.5px solid var(--accent-rose)'
                      : isDone
                        ? '1.5px solid var(--accent-emerald)'
                        : '1.5px solid color-mix(in srgb, currentColor 12%, transparent)',
                    color: isDone
                      ? '#000'
                      : isCurrent
                        ? 'var(--accent-rose)'
                        : 'var(--muted-foreground)',
                  }}
                >
                  {s.step}
                </div>
                <span
                  className="text-[8px] font-mono hidden sm:block"
                  style={{ color: isCurrent ? 'var(--accent-rose)' : 'var(--muted-foreground)', opacity: isCurrent ? 1 : 0.5 }}
                >
                  {s.title.split(' ')[0]}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="h-px flex-1 mx-1 transition-all duration-500"
                  style={{
                    background: isDone
                      ? 'var(--accent-emerald)'
                      : 'color-mix(in srgb, currentColor 10%, transparent)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step cards */}
      <div className="grid sm:grid-cols-5 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          return (
            <div
              key={s.step}
              className="rounded-xl p-3 transition-all duration-300"
              style={{
                background: isCurrent
                  ? 'color-mix(in srgb, var(--accent-rose) 8%, transparent)'
                  : isDone
                    ? 'color-mix(in srgb, var(--accent-emerald) 5%, transparent)'
                    : 'color-mix(in srgb, currentColor 3%, transparent)',
                border: isCurrent
                  ? '1px solid color-mix(in srgb, var(--accent-rose) 30%, transparent)'
                  : isDone
                    ? '1px solid color-mix(in srgb, var(--accent-emerald) 20%, transparent)'
                    : '1px solid transparent',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-mono"
                  style={{ color: isCurrent ? 'var(--accent-rose)' : isDone ? 'var(--accent-emerald)' : 'var(--muted-foreground)', opacity: isCurrent || isDone ? 1 : 0.5 }}
                >
                  0{s.step}
                </span>
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isCurrent ? 'var(--accent-rose)' : isDone ? 'var(--accent-emerald)' : 'var(--muted-foreground)', opacity: isCurrent || isDone ? 1 : 0.4 }}
                />
              </div>
              <h4
                className="font-semibold text-xs mb-1"
                style={{ opacity: isCurrent || isDone ? 1 : 0.5 }}
              >
                {s.title}
              </h4>
              <p
                className="text-[10px] leading-relaxed"
                style={{ color: 'var(--muted-foreground)', opacity: isCurrent ? 0.85 : isDone ? 0.6 : 0.35 }}
              >
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
