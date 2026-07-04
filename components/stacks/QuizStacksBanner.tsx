'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';
import { stackPresets, type PresetKey } from '@/lib/presets';

export function QuizStacksBanner({ preset }: { preset: PresetKey }) {
  const [dismissed, setDismissed] = useState(false);
  const stack = stackPresets[preset];

  if (dismissed || !stack) return null;

  return (
    <div className="mb-8 rounded-2xl border border-accent-emerald/30 bg-accent-emerald/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-emerald/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-bold text-accent-emerald">Quiz preset loaded</p>
          <p className="text-body-sm text-muted-foreground mt-1">
            <strong>{stack.label}</strong> stack is active in the Builder — {stack.desc}. Adjust compounds,
            check synergy score, then save or export your protocol.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/quiz"
          className="focus-ring text-xs font-semibold text-accent-cyan hover:underline rounded px-2 py-1"
        >
          Retake quiz
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="focus-ring p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
          aria-label="Dismiss quiz banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}