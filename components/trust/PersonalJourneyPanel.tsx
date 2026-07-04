'use client';

import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { personalJourneyTemplate } from '@/lib/journey';
import { gettingStartedSteps } from '@/lib/data';
import { usePlatform } from '@/context/PlatformContext';

export function PersonalJourneyPanel() {
  const { checklist, labs, selected, profile } = usePlatform();

  const progress = gettingStartedSteps.map((step) => ({
    ...step,
    done: checklist.includes(String(step.step)),
  }));

  const doneCount = progress.filter((p) => p.done).length;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card-base p-5 border-accent-cyan/20">
          <p className="text-label text-accent-cyan mb-2">Your Progress</p>
          <p className="text-3xl font-bold tabular-nums text-accent-cyan">{doneCount}/{gettingStartedSteps.length}</p>
          <p className="text-caption mt-1">Getting started checklist</p>
        </div>
        <div className="card-base p-5">
          <p className="text-label mb-2">Active Data</p>
          <p className="text-body-sm">
            {selected.length} compounds · {new Set(labs.map((l) => l.markerId)).size} lab markers
            {profile.scanned && ' · Defense scan complete'}
          </p>
        </div>
      </div>

      <div role="list" aria-label="Your longevity journey steps">
        {personalJourneyTemplate.map((item, i) => {
          const matched = progress.find((p) => p.step === item.step);
          const done = matched?.done ?? false;
          return (
            <div
              key={item.step}
              role="listitem"
              className={`card-base p-4 mb-3 flex gap-4 ${done ? 'border-accent-emerald/20' : ''}`}
            >
              <div className="shrink-0 mt-0.5">
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-accent-emerald" aria-label="Completed" />
                ) : (
                  <Circle className="w-5 h-5 text-caption" aria-label="Not completed" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-label">Step {item.step}</span>
                  {i === 0 && <span className="text-label text-accent-amber">Start here</span>}
                </div>
                <h4 className="heading-card mb-1">{item.title}</h4>
                <p className="text-body-sm mb-2">{item.desc}</p>
                <Link
                  href={item.link}
                  className="focus-ring text-sm font-semibold text-accent-cyan hover:text-accent-emerald rounded"
                >
                  Go →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}