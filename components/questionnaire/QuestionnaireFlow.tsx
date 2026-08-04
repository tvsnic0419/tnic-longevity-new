'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Shield, Zap, Layers, Check, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import {
  quizSteps,
  getQuizPreset,
  isCompleteAnswers,
  type QuestionnaireAnswers,
  type IconKey,
} from '@/lib/questionnaire';
import { buildResultsPath } from '@/lib/quiz-share';
import { stackPresets } from '@/lib/presets';
import { compounds } from '@/lib/data';

const goalIcons: Record<IconKey, typeof BookOpen> = {
  book: BookOpen,
  shield: Shield,
  zap: Zap,
  layers: Layers,
};

const goalAccent: Record<string, string> = {
  learn: 'var(--accent-cyan)',
  defense: 'var(--accent-emerald)',
  energy: 'var(--accent-amber)',
  longevity: 'var(--accent-violet)',
  metabolic: 'var(--accent-rose)',
  full: 'var(--accent-cyan)',
};

/**
 * Live preview of where the answers are heading. Reuses the questionnaire's own
 * resolver rather than a second hand-rolled map, so the preview can never
 * promise a stack the completed questionnaire wouldn't give.
 */
function LiveStackPreview({ answers }: { answers: QuestionnaireAnswers }) {
  const preset = stackPresets[getQuizPreset(answers)];
  const accent = goalAccent[answers.goal ?? ''] ?? 'var(--accent-cyan)';
  const names = preset.ids.map((id) => compounds.find((c) => c.id === id)?.name.split(' ')[0] ?? id);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 rounded-xl border px-3 py-2.5"
      style={{
        background: `color-mix(in srgb, ${accent} 8%, transparent)`,
        borderColor: `color-mix(in srgb, ${accent} 25%, transparent)`,
      }}
      aria-live="polite"
    >
      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
        Tracking toward → {preset.label}
      </p>
      <div className="flex flex-wrap gap-1">
        {names.map((name) => (
          <span
            key={name}
            className="rounded px-1.5 py-0.5 text-[11px] font-semibold"
            style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}
          >
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function QuestionnaireFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [submitting, setSubmitting] = useState(false);

  const current = quizSteps[step];
  const isLast = step === quizSteps.length - 1;
  const progress = ((step + 1) / quizSteps.length) * 100;

  const multiSelected = useMemo(
    () => (current.kind === 'multi' ? ((answers[current.id] as string[]) ?? []) : []),
    [answers, current],
  );

  const advance = (next: QuestionnaireAnswers) => {
    if (isLast) {
      setSubmitting(true);
      router.push(buildResultsPath(next));
      return;
    }
    setStep((s) => s + 1);
  };

  const selectSingle = (optionId: string) => {
    const next = { ...answers, [current.id]: optionId };
    setAnswers(next);
    advance(next);
  };

  const toggleMulti = (optionId: string) => {
    const currently = multiSelected;
    // "None of these" is mutually exclusive with every other flag — selecting a
    // real condition alongside it would make the safety screen self-contradictory.
    let updated: string[];
    if (optionId === 'none') {
      updated = currently.includes('none') ? [] : ['none'];
    } else {
      const withoutNone = currently.filter((id) => id !== 'none');
      updated = withoutNone.includes(optionId)
        ? withoutNone.filter((id) => id !== optionId)
        : [...withoutNone, optionId];
    }
    setAnswers({ ...answers, [current.id]: updated });
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const canContinue = current.kind === 'multi' ? multiSelected.length > 0 : Boolean(answers[current.id]);

  return (
    <div className="card-ultra p-6 md:p-8" aria-label="Questionnaire">
      {/* Progress */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent-cyan">
          Step {step + 1} of {quizSteps.length}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="focus-ring inline-flex items-center gap-1.5 rounded-md text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back
          </button>
        )}
      </div>

      <div className="mb-6 h-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-emerald"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        Question {step + 1} of {quizSteps.length}: {current.question}
      </p>

      {step > 0 && answers.goal && <LiveStackPreview answers={answers} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <fieldset>
            <legend className="heading-card mb-1 flex items-start gap-2">
              {current.id === 'safety' && (
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" aria-hidden="true" />
              )}
              {current.question}
            </legend>
            {current.help && <p className="mb-4 text-caption text-muted-foreground">{current.help}</p>}

            <div className={current.help ? 'space-y-2' : 'mt-4 space-y-2'}>
              {current.options.map((opt) => {
                const Icon = opt.icon ? goalIcons[opt.icon] : null;
                const accent = step === 0 ? (goalAccent[opt.id] ?? 'var(--accent-cyan)') : 'var(--accent-cyan)';
                const selected =
                  current.kind === 'multi'
                    ? multiSelected.includes(opt.id)
                    : answers[current.id] === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => (current.kind === 'multi' ? toggleMulti(opt.id) : selectSingle(opt.id))}
                    aria-pressed={current.kind === 'multi' ? selected : undefined}
                    className="focus-ring group glass glass-hover flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                    style={
                      selected
                        ? {
                            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                            borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    {Icon && (
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                        style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)` }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: accent }} aria-hidden="true" />
                      </span>
                    )}
                    {current.kind === 'multi' && (
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
                        style={{
                          borderColor: selected ? accent : 'color-mix(in srgb, currentColor 25%, transparent)',
                          background: selected ? accent : 'transparent',
                        }}
                        aria-hidden="true"
                      >
                        {selected && <Check className="h-3 w-3 text-black" />}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-body-sm font-semibold">{opt.label}</span>
                      {opt.desc && <span className="block text-caption text-muted-foreground">{opt.desc}</span>}
                    </span>
                    {step === 0 && (
                      <span
                        className="shrink-0 font-mono text-[11px] font-semibold opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ color: accent }}
                      >
                        {stackPresets[getQuizPreset({ goal: opt.id })].label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {current.kind === 'multi' && (
            <button
              type="button"
              onClick={() => advance(answers)}
              disabled={!canContinue || submitting}
              className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-cyan px-4 py-3.5 text-body-sm font-semibold text-black transition-colors hover:bg-accent-emerald disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Building your recommendation…' : 'See my recommendation'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-center text-caption text-muted-foreground">
        {isCompleteAnswers(answers) ? 'All answered' : `${quizSteps.length - step - 1} questions left`} · No account,
        no tracking ·{' '}
        <Link href="/explore" className="focus-ring rounded underline hover:text-foreground">
          browse the library instead
        </Link>
      </p>
    </div>
  );
}
