'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Shield,
  Zap,
  Layers,
  Check,
  Square,
  SquareCheck,
  ArrowRight,
  Target,
  HeartPulse,
  CalendarDays,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { quizSteps, getQuizResult, getQuizPreset, type QuizAnswers } from '@/lib/homepage';
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

/** One icon per question, driving the step rail — independent of the goal
 * step's own per-option icons. */
const STEP_ICON: Record<string, typeof Target> = {
  goal: Target,
  concern: HeartPulse,
  age: CalendarDays,
  experience: TrendingUp,
  budget: Wallet,
  safety: ShieldCheck,
};

/** One signature accent per question, so the whole flow reads as six
 * distinct moments instead of one repeated cyan form. The goal step's own
 * per-option rainbow (goalAccent above) always wins over this. */
const STEP_ACCENT: Record<string, string> = {
  goal: 'var(--accent-cyan)',
  concern: 'var(--accent-violet)',
  age: 'var(--accent-amber)',
  experience: 'var(--accent-emerald)',
  budget: 'var(--accent-rose)',
  safety: 'var(--accent-cyan)',
};

function LiveStackPreview({ answers }: { answers: QuizAnswers }) {
  // Reuse the quiz engine's own resolution rather than a second hand-rolled
  // goal→preset map, so this preview can never drift from what the completed
  // quiz actually recommends. Experience (the field that can broaden the
  // result — see getQuizPreset) is always still unanswered while this is
  // showing, so today it renders the goal's base preset; passing the full
  // answers keeps that guarantee automatic if the step order ever changes.
  const presetKey = getQuizPreset(answers);
  const preset = stackPresets[presetKey];
  const accent = goalAccent[answers.goal ?? ''] ?? 'var(--accent-cyan)';
  const compoundNames = preset.ids.map((id) => {
    const c = compounds.find((x) => x.id === id);
    return c?.name.split(' ')[0] ?? id;
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-4 overflow-hidden rounded-xl px-3.5 py-3 border"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 10%, transparent), color-mix(in srgb, ${accent} 3%, transparent))`,
        borderColor: `color-mix(in srgb, ${accent} 28%, transparent)`,
      }}
    >
      <p
        className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest mb-1.5"
        style={{ color: accent }}
      >
        <Sparkles className="w-3 h-3" aria-hidden="true" />
        Predicted stack → {preset.label}
      </p>
      <div className="flex flex-wrap gap-1">
        {compoundNames.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: `color-mix(in srgb, ${accent} 16%, transparent)`,
              color: accent,
            }}
          >
            {name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function StepRail({ step, done }: { step: number; done: boolean }) {
  return (
    <div className="flex items-center mb-5" aria-hidden="true">
      {quizSteps.map((s, i) => {
        const Icon = STEP_ICON[s.id] ?? Target;
        const isComplete = done || i < step;
        const isActive = !done && i === step;
        return (
          <div key={s.id} className={`flex items-center ${i < quizSteps.length - 1 ? 'flex-1' : ''}`}>
            <div
              className="relative shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
              style={{
                transform: isActive ? 'scale(1.12)' : 'scale(1)',
                background: isComplete
                  ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))'
                  : isActive
                    ? 'color-mix(in srgb, var(--accent-cyan) 18%, transparent)'
                    : 'color-mix(in srgb, currentColor 6%, transparent)',
                border: isComplete
                  ? 'none'
                  : isActive
                    ? '1.5px solid var(--accent-cyan)'
                    : '1.5px solid color-mix(in srgb, currentColor 14%, transparent)',
                boxShadow: isActive
                  ? '0 0 0 4px color-mix(in srgb, var(--accent-cyan) 14%, transparent), 0 0 18px color-mix(in srgb, var(--accent-cyan) 30%, transparent)'
                  : 'none',
              }}
            >
              {isComplete ? (
                <Check className="w-3.5 h-3.5 text-black" aria-hidden="true" />
              ) : (
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--muted-foreground)' }}
                  aria-hidden="true"
                />
              )}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full animate-pulse-glow"
                  style={{ border: '1.5px solid var(--accent-cyan)' }}
                />
              )}
            </div>
            {i < quizSteps.length - 1 && (
              <div className="h-[2px] flex-1 mx-1.5 rounded-full overflow-hidden bg-[color-mix(in_srgb,currentColor_10%,transparent)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))' }}
                  initial={false}
                  animate={{ width: i < step || done ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
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
  const [multiDraft, setMultiDraft] = useState<string[]>([]);

  const current = quizSteps[step];
  const stepAccent = STEP_ACCENT[current.id] ?? 'var(--accent-cyan)';

  const advance = (next: QuizAnswers) => {
    setAnswers(next);
    setMultiDraft([]);

    if (step < quizSteps.length - 1) {
      setStep(step + 1);
    } else {
      const finalResult = getQuizResult(next);
      setQuizResult({
        goal: next.goal ?? '',
        concern: next.concern,
        age: next.age,
        experience: next.experience,
        budget: next.budget,
        safety: next.safety,
        preset: finalResult.preset,
        completedAt: new Date().toISOString(),
      });
      setDone(true);
    }
  };

  const select = (optionId: string) => {
    const key = current.id as Exclude<keyof QuizAnswers, 'safety'>;
    advance({ ...answers, [key]: optionId });
  };

  // 'none' is exclusive — picking it clears any other flags and finishes the
  // step immediately, same one-tap feel as every single-select question.
  const toggleMulti = (optionId: string) => {
    if (optionId === 'none') {
      advance({ ...answers, safety: [] });
      return;
    }
    setMultiDraft((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
    );
  };

  const confirmMulti = () => advance({ ...answers, safety: multiDraft });

  const reset = () => {
    setStep(0);
    setAnswers({});
    setMultiDraft([]);
    setDone(false);
  };

  const result = done ? getQuizResult(answers) : null;
  const isPage = variant === 'page';

  return (
    <div
      className={
        isPage
          ? 'relative isolate glass-deep glass-plane-content rounded-3xl p-6 md:p-8 overflow-hidden'
          : 'p-6 md:p-8'
      }
      role="form"
      aria-label="The Nico Starter Questionnaire"
    >
      {/* Ambient glow — page variant only (embedded already sits inside its
          own TiltGlassPanel; a second glass+glow layer there would just
          muddy the one the parent already provides). Tracks the current
          question's signature accent so the card's mood shifts as you
          progress, the same "route-aware tint" idea as AmbientTone. */}
      {isPage && (
        <motion.div
          aria-hidden="true"
          className="w-64 h-64 rounded-full pointer-events-none"
          animate={{ background: `radial-gradient(circle, color-mix(in srgb, ${stepAccent} 30%, transparent), transparent 70%)` }}
          transition={{ duration: 0.6 }}
          // Inline position/inset/z-index, not Tailwind classes: this is a
          // direct child of .glass-deep, whose unlayered `.glass-deep > *
          // { position: relative; z-index: 2; }` rule beats any Tailwind
          // utility class regardless of source order — silently turning
          // `absolute` into `relative` and leaving this 256px box's normal-
          // flow space reserved (pushing the header down) instead of
          // floating free. Only an inline style wins over that rule.
          style={{ position: 'absolute', top: '-96px', right: '-64px', zIndex: 0, filter: 'blur(50px)' }}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[10px] text-accent-cyan tracking-widest mb-1">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan animate-pulse-glow" aria-hidden="true" />
            THE NICO QUESTIONNAIRE
          </p>
          <h3 className="font-display text-xl font-medium tracking-tight">The Nico Starter Questionnaire</h3>
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

      {!done && <StepRail step={step} done={done} />}

      {/* Live stack preview — visible on steps 2+ once goal is answered */}
      {!done && step > 0 && answers.goal && (
        <LiveStackPreview answers={answers} />
      )}

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <p className="text-base font-semibold mb-1 tracking-tight">{current.question}</p>
            {current.multi && (
              <p className="text-[11px] text-muted-foreground mb-3">
                Select any that apply, then continue — helps flag interactions before you start.
              </p>
            )}

            {current.multi ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {current.options
                    .filter((opt) => opt.id !== 'none')
                    .map((opt) => {
                      const checked = multiDraft.includes(opt.id);
                      const CheckboxIcon = checked ? SquareCheck : Square;
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleMulti(opt.id)}
                          aria-pressed={checked}
                          className="focus-ring interactive text-left rounded-xl px-3.5 py-3 flex items-center gap-2 transition-all"
                          style={{
                            background: checked
                              ? `color-mix(in srgb, ${stepAccent} 14%, transparent)`
                              : 'var(--color-bg-muted)',
                            border: `1px solid ${checked ? `color-mix(in srgb, ${stepAccent} 45%, transparent)` : 'var(--color-border-subtle)'}`,
                            boxShadow: checked ? `0 0 0 1px color-mix(in srgb, ${stepAccent} 20%, transparent)` : 'none',
                          }}
                        >
                          <CheckboxIcon
                            className="w-4 h-4 shrink-0"
                            style={{ color: checked ? stepAccent : 'var(--muted-foreground)' }}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium leading-tight">{opt.label}</span>
                        </motion.button>
                      );
                    })}
                </div>

                <div className="flex items-center gap-3 my-3" aria-hidden="true">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <button
                  type="button"
                  onClick={() => toggleMulti('none')}
                  className="focus-ring interactive w-full text-center rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-accent-cyan/30 transition-all"
                >
                  None of these apply
                </button>

                <button
                  type="button"
                  onClick={confirmMulti}
                  disabled={multiDraft.length === 0}
                  className="btn-gradient w-full mt-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </>
            ) : (
              <div className="space-y-2">
                {current.options.map((opt) => {
                  const Icon = 'icon' in opt ? goalIcons[opt.icon] : null;
                  const optAccent = step === 0 ? goalAccent[opt.id] ?? stepAccent : stepAccent;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => select(opt.id)}
                      className="focus-ring interactive relative w-full text-left overflow-hidden rounded-xl px-4 py-3 flex items-center gap-3 transition-all group glass glass-hover"
                      style={{ ['--hover-accent' as string]: optAccent }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-[3px] opacity-0 group-hover:opacity-90 transition-opacity"
                        style={{ background: optAccent }}
                      />
                      {Icon ? (
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
                      ) : (
                        <span
                          className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                          style={{ background: optAccent }}
                          aria-hidden="true"
                        />
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
                          {stackPresets[getQuizPreset({ goal: opt.id })].label}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : result && (
          <QuizResultPanel result={result} answers={answers} onRetake={reset} />
        )}
      </AnimatePresence>
    </div>
  );
}
