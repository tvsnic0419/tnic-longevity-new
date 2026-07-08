'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string; score: number }[];
}

interface ResilienceResult {
  score: number;
  tier: 'foundation' | 'intermediate' | 'advanced';
  headline: string;
  summary: string;
  topCompounds: string[];
  nextStep: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'goal',
    text: 'What is your primary longevity goal right now?',
    options: [
      { label: 'Slow cellular aging', value: 'cellular', score: 3 },
      { label: 'Boost energy & mitochondria', value: 'energy', score: 2 },
      { label: 'Reduce inflammation', value: 'inflammation', score: 2 },
      { label: 'General health optimization', value: 'general', score: 1 },
    ],
  },
  {
    id: 'experience',
    text: 'How familiar are you with longevity supplementation?',
    options: [
      { label: 'New — just getting started', value: 'new', score: 1 },
      { label: 'Some experience (1–2 compounds)', value: 'some', score: 2 },
      { label: 'Experienced (built a stack)', value: 'experienced', score: 3 },
      { label: 'Advanced (track biomarkers)', value: 'advanced', score: 4 },
    ],
  },
  {
    id: 'age',
    text: 'Which age range are you in?',
    options: [
      { label: 'Under 35', value: 'under35', score: 1 },
      { label: '35–49', value: '35to49', score: 2 },
      { label: '50–64', value: '50to64', score: 3 },
      { label: '65+', value: '65plus', score: 4 },
    ],
  },
];

const RESULTS: ResilienceResult[] = [
  {
    score: 0, // placeholder — computed dynamically
    tier: 'foundation',
    headline: 'Foundation Builder',
    summary:
      'Your profile points to core cellular defense as the highest-leverage entry point. Start with well-studied, high-safety compounds before layering complexity.',
    topCompounds: ['NMN (NAD+ precursor)', 'Magnesium Glycinate', 'Vitamin D3 + K2'],
    nextStep: 'Explore the Foundation Stack on the Stacks page to see a pre-built protocol.',
  },
  {
    score: 0,
    tier: 'intermediate',
    headline: 'Cellular Optimizer',
    summary:
      'You have a solid base to build on. Focus on mitochondrial efficiency and senolytic compounds to push your cellular resilience further.',
    topCompounds: ['Fisetin', 'Urolithin A', 'Alpha-Lipoic Acid'],
    nextStep: 'Try the Stack Builder to customize your protocol and see live synergy scores.',
  },
  {
    score: 0,
    tier: 'advanced',
    headline: 'Longevity Advanced',
    summary:
      'Your profile supports an advanced NRF2 + NAD+ dual-pathway stack. Biomarker tracking will give you the feedback loop needed at this tier.',
    topCompounds: ['GlyNAC', 'Spermidine', 'Pterostilbene'],
    nextStep: 'Head to the Elite 8 tool to benchmark your approach against longevity leaders.',
  },
];

function getTier(total: number): ResilienceResult {
  if (total <= 5) return RESULTS[0];
  if (total <= 8) return RESULTS[1];
  return RESULTS[2];
}

export function ResilienceQuiz({ className = '' }: { className?: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<ResilienceResult | null>(null);

  const currentQuestion = QUESTIONS[currentIdx];
  const isComplete = currentIdx >= QUESTIONS.length;

  function handleAnswer(score: number) {
    const next = { ...answers, [currentQuestion.id]: score };
    setAnswers(next);

    if (currentIdx + 1 >= QUESTIONS.length) {
      const total = Object.values(next).reduce((a, b) => a + b, 0);
      setResult(getTier(total));
      setCurrentIdx(QUESTIONS.length);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  function reset() {
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
  }

  return (
    <div className={`rounded-2xl border border-border/60 bg-card/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-emerald-500/10 to-transparent">
        <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium mb-1">
          Cellular Resilience Quiz
        </p>
        <h2 className="text-xl font-semibold text-foreground">Find your longevity entry point</h2>
        <p className="text-sm text-muted-foreground mt-0.5">3 questions · ~1 minute</p>
      </div>

      <div className="p-6">
        {!isComplete && (
          <>
            {/* Progress */}
            <div className="flex gap-1.5 mb-6">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < currentIdx
                      ? 'bg-emerald-500'
                      : i === currentIdx
                      ? 'bg-emerald-500/50'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              Question {currentIdx + 1} of {QUESTIONS.length}
            </p>
            <p className="text-base font-medium text-foreground mb-4">{currentQuestion.text}</p>

            <div className="grid gap-2">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-border/60 bg-background/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-sm text-foreground group"
                >
                  <span className="flex items-center gap-3">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {isComplete && result && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Your result</span>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">{result.headline}</h3>
            <p className="text-sm text-muted-foreground mb-5">{result.summary}</p>

            <div className="rounded-xl bg-background/60 border border-border/50 p-4 mb-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Top compounds for your profile
              </p>
              <ul className="space-y-1.5">
                {result.topCompounds.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 mb-5 text-sm text-foreground">
              <span className="font-medium text-emerald-400">Next step: </span>
              {result.nextStep}
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResilienceQuiz;
