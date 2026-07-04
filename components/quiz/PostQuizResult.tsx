'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target, CheckCircle } from 'lucide-react';
import { RecommendedNextSteps } from '@/components/ui/RecommendedNextSteps';

interface PostQuizResultProps {
  stackName?: string;
  focusArea?: string;
}

export const PostQuizResult: React.FC<PostQuizResultProps> = ({ 
  stackName = "Your Personalized Stack",
  focusArea = "your primary goal"
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-emerald)]/10 mb-6">
          <CheckCircle className="w-8 h-8 text-[var(--accent-emerald)]" />
        </div>
        
        <h2 className="text-3xl font-semibold mb-3">Your Starting Point is Ready</h2>
        <p className="text-xl text-[var(--color-text-secondary)]">
          Based on your answers, we recommend focusing on <span className="text-[var(--color-text-primary)] font-medium">{focusArea}</span>.
        </p>
      </div>

      <div className="tnic-glass rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-[var(--accent-cyan)]/10">
            <Target className="w-6 h-6 text-[var(--accent-cyan)]" />
          </div>
          <div>
            <div className="font-semibold text-lg">{stackName}</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Mechanism-matched starting protocol</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 mt-0.5 text-[var(--accent-emerald)] flex-shrink-0" />
            <span>Evidence-graded compounds</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 mt-0.5 text-[var(--accent-emerald)] flex-shrink-0" />
            <span>Synergy scoring included</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 mt-0.5 text-[var(--accent-emerald)] flex-shrink-0" />
            <span>90-day protocol timeline</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 mt-0.5 text-[var(--accent-emerald)] flex-shrink-0" />
            <span>Local data only</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-label text-[var(--accent-cyan)] mb-4 px-1">NEXT STEPS</div>
        <RecommendedNextSteps context="quiz" />
      </div>

      <div className="text-center">
        <Link 
          href="/dashboard" 
          className="tnic-button-primary inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-medium"
        >
          Import to Dashboard &amp; Start Tracking
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-xs text-[var(--color-text-muted)] mt-3">
          Your data stays in your browser. No account needed.
        </p>
      </div>
    </div>
  );
};
