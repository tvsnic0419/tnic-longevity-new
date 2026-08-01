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

/** One icon per question — drives both the step rail and, for every
 * single-select step besides goal (which has its own per-option icons),
 * every option tile's badge too, so no step ever falls back to a bare dot. */
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
      className="relative mb-5 overflow-hidden rounded-2xl px-4 py-3.5 border"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 12%, transparent), color-mix(in srgb, ${accent} 3%, transparent))`,
        borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
      }}
    >
      <p
        className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest mb-2"
        style={{ color: accent }}
      >
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        Predicted stack → {preset.label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {compoundNames.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, type: 'spring', stiffness: 300, damping: 22 }}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg"
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
    <div className="flex items-center mb-6" aria-hidden="true">
      {quizSteps.map((s, i) => {
        const Icon = STEP_ICON[s.id] ?? Target;
        const isComplete = done || i < step;
        const isActive = !done && i === step;
        return (
          <div key={s.id} className={`flex items-center ${i < quizSteps.length - 1 ? 'flex-1' : ''}`}>
            <div
              className="relative shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300"
              style={{
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
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
                  ? '0 0 0 4px color-mix(in srgb, var(--accent-cyan) 16%, transparent), 0 0 20px color-mix(in srgb, var(--accent-cyan) 35%, transparent)'
                  : 'none',
              }}
            >
              {isComplete ? (
                <Check className="w-4 h-4 text-black" aria-hidden="true" />
              ) : (
                <Icon
                  className="w-4 h-4"
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
  // Brief "locked in" confirm state before the step actually advances — a
  // deliberate ~180ms beat so a tap reads as a considered choice instead of
  // an instant snap-away. Cheap (transform/opacity + a timeout), not a
  // second render pass or new animation loop.
  const [justSelected, setJustSelected] = useState<string | null>(null);

  const current = quizSteps[step];
  const stepAccent = STEP_ACCENT[current.id] ?? 'var(--accent-cyan)';
  const isPage = variant === 'page';

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
    setJustSelected(optionId);
    window.setTimeout(() => {
      const key = current.id as Exclude<keyof QuizAnswers, 'safety'>;
      advance({ ...answers, [key]: optionId });
      setJustSelected(null);
    }, 180);
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
    setJustSelected(null);
    setDone(false);
  };

  const result = done ? getQuizResult(answers) : null;
  // Exactly-3-option steps (experience, budget) get a 3-column grid so
  // there's no orphaned single tile in a second row; everything else with
  // 4+ options gets 2 columns. Embedded stays single-column — it's a
  // ~450px teaser slot, not the full-width /quiz page.
  const gridCols = !isPage
    ? 'grid-cols-1'
    : current.options.length === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div
      className={
        isPage
          ? 'relative isolate glass-deep glass-plane-content rounded-3xl p-6 md:p-10 overflow-hidden'
          : 'p-6 md:p-8'
      }
      role="form"
      aria-label="The Nico Starter Questionnaire"
    >
      {/* Ambient glow — page variant only (embedded already sits inside its
          own TiltGlassPanel; a second glass+glow layer there would just
          muddy the one the parent already provides). Two blobs: one tracks
          the current question's signature accent so the card's mood shifts
          as you progress, the other stays a constant emerald/cyan brand
          anchor (same "cohesion anchor" idea as AmbientLayer's third orb) so
          the card never reads as a single flat hue. */}
      {isPage && (
        <>
          <motion.div
            aria-hidden="true"
            className="w-80 h-80 rounded-full pointer-events-none"
            animate={{ background: `radial-gradient(circle, color-mix(in srgb, ${stepAccent} 32%, transparent), transparent 70%)` }}
            transition={{ duration: 0.6 }}
            // Inline position/inset/z-index, not Tailwind classes: this is a
            // direct child of .glass-deep, whose unlayered `.glass-deep > *
            // { position: relative; z-index: 2; }` rule beats any Tailwind
            // utility class regardless of source order — silently turning
            // `absolute` into `relative` and leaving this box's normal-flow
            // space reserved (pushing content down) instead of floating
            // free. Only an inline style wins over that rule.
            style={{ position: 'absolute', top: '-120px', right: '-96px', zIndex: 0, filter: 'blur(60px)' }}
          />
          <div
            aria-hidden="true"
            className="w-72 h-72 rounded-full pointer-events-none"
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-90px',
              zIndex: 0,
              filter: 'blur(60px)',
              background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-emerald) 16%, transparent), transparent 70%)',
            }}
          />
        </>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[10px] text-accent-cyan tracking-widest mb-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan animate-pulse-glow" aria-hidden="true" />
            THE NICO QUESTIONNAIRE
          </p>
          <h3 className={`font-display font-medium tracking-tight ${isPage ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
            The Nico Starter Questionnaire
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

      {!done && <StepRail step={step} done={done} />}

      {/* Live stack preview — visible on steps 2+ once goal is answered */}
      {!done && step > 0 && answers.goal && (
        <LiveStackPreview answers={answers} />
      )}

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4">
              <p className={`font-display font-medium tracking-tight ${isPage ? 'text-xl md:text-2xl' : 'text-base font-sans font-semibold'}`}>
                {current.question}
              </p>
              <span
                className="mt-2 block h-[3px] w-11 rounded-full"
                style={{ background: `linear-gradient(90deg, ${stepAccent}, var(--accent-emerald))` }}
                aria-hidden="true"
              />
              {current.multi && (
                <p className="text-[11px] text-muted-foreground mt-2.5">
                  Select any that apply, then continue — helps flag interactions before you start.
                </p>
              )}
            </div>

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
              <div className={`grid ${gridCols} gap-2.5`}>
                {current.options.map((opt) => {
                  const GoalIcon = 'icon' in opt ? goalIcons[opt.icon] : null;
                  const BadgeIcon = GoalIcon ?? STEP_ICON[current.id];
                  const optAccent = step === 0 ? goalAccent[opt.id] ?? stepAccent : stepAccent;
                  const locked = justSelected === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      animate={locked ? { scale: 1.02 } : { scale: 1 }}
                      onClick={() => select(opt.id)}
                      disabled={justSelected !== null}
                      className={`focus-ring interactive relative text-left overflow-hidden rounded-2xl flex items-center gap-3 transition-colors group glass glass-hover ${
                        isPage ? 'px-5 py-4' : 'px-4 py-3'
                      }`}
                      style={{
                        ['--hover-accent' as string]: optAccent,
                        borderColor: locked ? optAccent : undefined,
                        boxShadow: locked
                          ? `0 0 0 1.5px ${optAccent}, 0 0 24px color-mix(in srgb, ${optAccent} 40%, transparent)`
                          : undefined,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-[3px] transition-opacity"
                        style={{ background: optAccent, opacity: locked ? 1 : 0 }}
                      />
                      <span className="absolute inset-y-0 left-0 w-[3px] opacity-0 group-hover:opacity-90 transition-opacity" style={{ background: optAccent }} aria-hidden="true" />
                      <div
                        className={`rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 ${isPage ? 'w-10 h-10' : 'w-8 h-8'}`}
                        style={{ background: `color-mix(in srgb, ${optAccent} 16%, transparent)` }}
                      >
                        {locked ? (
                          <Check className={isPage ? 'w-5 h-5' : 'w-4 h-4'} style={{ color: optAccent }} aria-hidden="true" />
                        ) : (
                          <BadgeIcon className={isPage ? 'w-5 h-5' : 'w-4 h-4'} style={{ color: optAccent }} aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold group-hover:text-foreground transition-colors ${isPage ? 'text-[15px]' : 'text-sm'}`}
                          style={{ color: 'inherit' }}>
                          {opt.label}
                        </p>
                        {'desc' in opt && <p className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</p>}
                      </div>
                      {step === 0 && !locked && (
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
