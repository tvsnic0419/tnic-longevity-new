'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Shield, Zap, Layers, Check } from 'lucide-react';
import { quizSteps, getQuizResult, type QuizAnswers } from '@/lib/homepage';
import { stackPresets } from '@/lib/presets';
import { compounds } from '@/lib/data';
import { QuizResultPanel } from '@/components/quiz/QuizResultPanel';
import { parseQuizSearchParams } from '@/lib/quiz-share';
import { usePlatform } from '@/context/PlatformContext';

const goalIcons = {
  book: BookOpen,
  shield: Shield,
  zap: Zap,
  layers: Layers,
};

const goalAccent: Record<string, string> = {
  learn:     'var(--accent-cyan)',
  defense:   'var(--accent-emerald)',
  energy:    'var(--accent-amber)',
  longevity: 'var(--accent-violet)',
  metabolic: 'var(--accent-rose)',
  full:      'var(--accent-cyan)',
};

const goalPreset: Record<string, keyof typeof stackPresets> = {
  energy:    'mito',
  defense:   'nrf2',
  longevity: 'longevity',
  metabolic: 'metabolic',
  full:      'hybrid',
  learn:     'starter',
};

function LiveStackPreview({ goal }: { goal: string }) {
  const presetKey = goalPreset[goal] ?? 'starter';
  const preset = stackPresets[presetKey];
  const accent = goalAccent[goal] ?? 'var(--accent-cyan)';
  const compoundNames = preset.ids.map((id) => {
    const c = compounds.find((x) => x.id === id);
    return c?.name.split(' ')[0] ?? id;
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-xl px-3 py-2.5 border"
      style={{
        background: `color-mix(in srgb, ${accent} 8%, transparent)`,
        borderColor: `color-mix(in srgb, ${accent} 25%, transparent)`,
      }}
    >
      <p className="text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: accent }}>
        Predicted stack → {preset.label}
      </p>
      <div className="flex flex-wrap gap-1">
        {compoundNames.map((name) => (
          <span
            key={name}
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: `color-mix(in srgb, ${accent} 15%, transparent)`,
              color: accent,
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function StarterQuiz({ variant = 'embedded' }: { variant?: 'embedded' | 'page' }) {
  const searchParams = useSearchParams();
  const { setQuizResult } = usePlatform();
  // Derive the shared-result state from the URL during render rather than in an
  // effect — this is deterministic from the query string, so computing the
  // initial state directly avoids an extra render pass (React 19 guidance).
  const shared = variant === 'page' ? parseQuizSearchParams(searchParams.toString()) : null;
  const [step, setStep] = useState(shared ? quizSteps.length - 1 : 0);
  const [answers, setAnswers] = useState<QuizAnswers>(shared ?? {});
  const [done, setDone] = useState(Boolean(shared));

  const current = quizSteps[step];
  const progress = done ? 100 : ((step + 1) / quizSteps.length) * 100;

  const select = (optionId: string) => {
    const key = current.id as keyof QuizAnswers;
    const next = { ...answers, [key]: optionId };
    setAnswers(next);

    if (step < quizSteps.length - 1) {
      setStep(step + 1);
    } else {
      const finalResult = getQuizResult(next);
      setQuizResult({
        goal: next.goal ?? '',
        age: next.age,
        experience: next.experience,
        preset: finalResult.preset,
        completedAt: new Date().toISOString(),
      });
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  const result = done ? getQuizResult(answers) : null;

  return (
    <div
      className={`p-6 md:p-8 ${variant === 'page' ? 'card-ultra shadow-lg shadow-accent-emerald/10' : ''}`}
      role="form"
      aria-label="3-minute starter quiz"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] text-accent-cyan tracking-widest mb-1">3-MIN QUIZ</p>
          <h3 className="text-lg font-bold">
            {variant === 'page' ? 'Your personalized path' : 'Find Your Entry Point'}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {variant === 'embedded' && (
            <Link
              href="/quiz"
              className="focus-ring text-[10px] font-mono text-accent-cyan hover:underline rounded"
            >
              Full screen
            </Link>
          )}
        </div>
      </div>

      {/* Step indicator dots */}
      {!done && (
        <div className="flex items-center gap-2 mb-4">
          {quizSteps.map((s, i) => {
            const isComplete = i < step;
            const isActive = i === step;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300"
                  style={{
                    background: isComplete
                      ? 'var(--accent-emerald)'
                      : isActive
                        ? 'color-mix(in srgb, var(--accent-cyan) 20%, transparent)'
                        : 'color-mix(in srgb, currentColor 8%, transparent)',
                    border: isActive
                      ? '1.5px solid var(--accent-cyan)'
                      : isComplete
                        ? '1.5px solid var(--accent-emerald)'
                        : '1.5px solid color-mix(in srgb, currentColor 15%, transparent)',
                    color: isComplete ? '#000' : isActive ? 'var(--accent-cyan)' : 'var(--muted-foreground)',
                  }}
                >
                  {isComplete ? <Check className="w-2.5 h-2.5" /> : i + 1}
                </div>
                {i < quizSteps.length - 1 && (
                  <div
                    className="h-px flex-1 w-6 transition-all duration-500"
                    style={{
                      background: i < step ? 'var(--accent-emerald)' : 'color-mix(in srgb, currentColor 10%, transparent)',
                    }}
                  />
                )}
              </div>
            );
          })}
          <span className="text-[10px] font-mono text-muted-foreground ml-auto">
            {step + 1}/{quizSteps.length}
          </span>
        </div>
      )}

      <div className="h-0.5 bg-muted rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-cyan to-accent-emerald rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Live stack preview — visible on steps 2+ once goal is answered */}
      {!done && step > 0 && answers.goal && (
        <LiveStackPreview goal={answers.goal} />
      )}

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <p className="text-sm font-semibold mb-3">{current.question}</p>
            <div className="space-y-2">
              {current.options.map((opt) => {
                const Icon = 'icon' in opt ? goalIcons[opt.icon] : null;
                const optAccent =
                  step === 0
                    ? goalAccent[opt.id] ?? 'var(--accent-cyan)'
                    : 'var(--accent-cyan)';
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => select(opt.id)}
                    className="focus-ring w-full text-left glass glass-hover rounded-xl px-4 py-3 flex items-center gap-3 transition-all group"
                    style={{ ['--hover-accent' as string]: optAccent }}
                  >
                    {Icon && (
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                        style={{
                          background: `color-mix(in srgb, ${optAccent} 15%, transparent)`,
                        }}
                      >
                        <Icon
                          className="w-3.5 h-3.5"
                          style={{ color: optAccent }}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold group-hover:text-foreground transition-colors"
                        style={{ color: 'inherit' }}>
                        {opt.label}
                      </p>
                      {'desc' in opt && <p className="text-[10px] text-muted-foreground">{opt.desc}</p>}
                    </div>
                    {step === 0 && (
                      <span
                        className="shrink-0 text-[9px] font-semibold font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: optAccent }}
                      >
                        {stackPresets[goalPreset[opt.id] ?? 'starter']?.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : result && (
          <QuizResultPanel result={result} answers={answers} onRetake={reset} />
        )}
      </AnimatePresence>
    </div>
  );
}
