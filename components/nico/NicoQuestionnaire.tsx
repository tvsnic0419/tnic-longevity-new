'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  LayoutDashboard,
  FlaskConical,
  Minus,
  Plus,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import {
  computeNicoStack,
  NICO_DEFAULT_ANSWERS,
  NICO_GOAL_OPTIONS,
  NICO_FOCUS_OPTIONS,
  NICO_SAFETY_OPTIONS,
  NICO_SCALE_LABELS,
  type NicoAnswers,
  type NicoGoal,
  type NicoFocus,
  type NicoSafetyFlag,
  type Scale,
} from '@/lib/nico-questionnaire';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

/**
 * One question per screen.
 *
 * The scoring engine (`lib/nico-questionnaire.ts`) is untouched — it already
 * computes a real, per-visitor stack from these same answers. What was wrong
 * was pacing: the previous version put age, sleep, energy, stress, movement,
 * and diet on a single screen labeled "Lifestyle," breaking the one-question
 * pattern every other step already used. Nine questions, one at a time, then
 * the result.
 */
const SCALE_ORDER = ['sleep', 'energy', 'stress', 'movement', 'diet'] as const;

type StepId = 'goals' | 'age' | (typeof SCALE_ORDER)[number] | 'focus' | 'safety' | 'result';

const STEP_IDS: StepId[] = ['goals', 'age', ...SCALE_ORDER, 'focus', 'safety', 'result'];
const QUESTION_COUNT = STEP_IDS.length - 1; // excludes the result screen

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'focus-ring interactive text-left rounded-xl border px-4 py-3 text-sm font-semibold transition-all',
        active
          ? 'border-accent-emerald bg-accent-emerald/10 text-accent-emerald shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_8px_20px_-12px_rgba(52,211,153,0.4)]'
          // Label stays bright (text-foreground) even when inactive — only the
          // border/background communicate selection state, not text contrast.
          : 'border-border bg-card/60 text-foreground hover:border-foreground/40 hover:bg-card/80',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/** Renders just the 1–5 buttons + low/high labels. The question itself is the
 * step's own <h2> now that each scale has a full screen — no duplicate text. */
function ScaleButtons({
  pillar,
  value,
  onChange,
}: {
  pillar: (typeof SCALE_ORDER)[number];
  value: Scale;
  onChange: (v: Scale) => void;
}) {
  const meta = NICO_SCALE_LABELS[pillar];
  return (
    <div>
      <div className="grid grid-cols-5 gap-2" role="group" aria-label={meta.question}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            onClick={() => onChange(n as Scale)}
            className={[
              'focus-ring interactive rounded-lg border py-3 text-base font-mono transition-all',
              value === n
                ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                : 'border-border bg-card/40 text-muted-foreground hover:border-foreground/30',
            ].join(' ')}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-micro font-mono text-caption mt-2">
        <span>{meta.low}</span>
        <span>{meta.high}</span>
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4 text-center">
      <p className="text-2xl font-black font-mono text-accent-emerald mb-1">{value}</p>
      <p className="text-micro text-muted-foreground uppercase tracking-wide">{label}</p>
    </div>
  );
}

/** Shared heading treatment so every single-question screen reads consistently. */
function QuestionHeading({
  id,
  question,
  helper,
}: {
  id: string;
  question: string;
  helper?: string;
}) {
  return (
    <div className="mb-5">
      <h2 id={id} tabIndex={-1} className="text-lg font-bold text-foreground mb-1 outline-none">
        {question}
      </h2>
      {helper && <p className="text-sm text-muted-foreground">{helper}</p>}
    </div>
  );
}

export function NicoQuestionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<NicoAnswers>({ ...NICO_DEFAULT_ANSWERS });

  const stepId = STEP_IDS[step];
  const isResult = stepId === 'result';

  const result = useMemo(() => (isResult ? computeNicoStack(answers) : null), [isResult, answers]);

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  // Only Goals is required — a visitor must anchor the stack to at least one
  // goal, but every other question has a sane default (age 45, scales at the
  // 3/5 midpoint, focus and safety both legitimately empty).
  const canAdvance = stepId === 'goals' ? answers.goals.length > 0 : true;

  // Fire nico_started once, the moment the visitor commits past the first
  // question — a page view is not a funnel start.
  const startedRef = useRef(false);
  const goNext = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent(ANALYTICS_EVENTS.nicoStarted);
    }
    setStep((s) => Math.min(STEP_IDS.length - 1, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => {
    setAnswers({ ...NICO_DEFAULT_ANSWERS });
    setStep(0);
  };

  const setAge = (next: number) => setAnswers((a) => ({ ...a, age: Math.max(18, Math.min(100, next)) }));

  // On step change, move focus (and with it, scroll) to the new question's
  // heading. Screen height varies a lot between screens — Goals is 7 chips
  // tall, Age is one short stepper — and without this the browser keeps
  // whatever scroll position the "Continue" click left it at. On a shorter
  // next screen that strands the visitor scrolled past the new content
  // entirely (confirmed: landed in the page footer on mobile). Skipped on
  // the very first render so page load doesn't steal focus from the URL bar
  // / skip link before the visitor has done anything.
  const cardRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    cardRef.current?.querySelector<HTMLElement>('h2')?.focus();
  }, [step]);

  // Fire nico_completed once, when the visitor first reaches the recommended
  // stack. This is the key funnel-completion signal (previously defined in
  // ANALYTICS_EVENTS but never emitted).
  const completedRef = useRef(false);
  useEffect(() => {
    if (isResult && !completedRef.current) {
      completedRef.current = true;
      trackEvent(ANALYTICS_EVENTS.nicoCompleted, { stackSize: result?.compoundIds.length ?? 0 });
    }
  }, [isResult, result]);

  const stackHref =
    result && result.compoundIds.length
      ? `/stacks?stack=${result.compoundIds.join(',')}&from=nico`
      : '/stacks';

  const currentQuestionText = (() => {
    switch (stepId) {
      case 'goals':
        return 'What do you most want to improve?';
      case 'age':
        return 'How old are you?';
      case 'focus':
        return 'Any specific systems you want to target?';
      case 'safety':
        return 'Any of these apply to you?';
      case 'result':
        return null;
      default:
        return NICO_SCALE_LABELS[stepId].question;
    }
  })();

  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          icon={Sparkles}
          eyebrow="Personalized"
          title="NICO Starter Questionnaire"
          description={`${QUESTION_COUNT} quick questions — the NICO Starter Questionnaire builds your personalized stack from your own answers, loads it into Stack Builder, and tracks it in your OS dashboard. No account required.`}
          theme="emerald"
        />

        {/* Progress — "Step X of N" plus a continuous bar. A per-segment tick
            row (as the old 5-step version used) gets too dense once each
            question has its own screen, so this mirrors the pacing already
            verified on real devices for a similarly-sized flow. */}
        {!isResult && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-micro uppercase tracking-widest text-accent-emerald">
                Question {step + 1} of {QUESTION_COUNT}
              </p>
            </div>
            <div className="h-1 rounded-full bg-border/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-emerald transition-all duration-300"
                style={{ width: `${((step + 1) / QUESTION_COUNT) * 100}%` }}
              />
            </div>
            <p className="sr-only" aria-live="polite">
              Question {step + 1} of {QUESTION_COUNT}: {currentQuestionText}
            </p>
          </div>
        )}

        <div ref={cardRef} className="card-ultra p-6 md:p-8">
          {/* Goals */}
          {stepId === 'goals' && (
            <section aria-labelledby="nico-goals">
              <QuestionHeading id="nico-goals" question="What do you most want to improve?" helper="Pick one or more. This anchors your stack." />
              <div className="grid sm:grid-cols-2 gap-3">
                {NICO_GOAL_OPTIONS.map((g) => (
                  <Chip
                    key={g.id}
                    active={answers.goals.includes(g.id)}
                    onClick={() => setAnswers((a) => ({ ...a, goals: toggle<NicoGoal>(a.goals, g.id) }))}
                  >
                    <span className="block">{g.label}</span>
                    <span className="block text-micro font-normal text-muted-foreground mt-0.5">
                      {g.desc}
                    </span>
                  </Chip>
                ))}
              </div>
            </section>
          )}

          {/* Age — its own screen, a large stepper instead of a bare number input */}
          {stepId === 'age' && (
            <section aria-labelledby="nico-age">
              <QuestionHeading
                id="nico-age"
                question="How old are you?"
                helper="This tunes which pathways matter most right now — some compounds address age-specific decline."
              />
              <div className="flex items-center justify-center gap-5 py-4">
                <button
                  type="button"
                  onClick={() => setAge(answers.age - 1)}
                  disabled={answers.age <= 18}
                  aria-label="Decrease age"
                  className="focus-ring interactive flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/50 text-foreground transition-all hover:border-foreground/30 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <label htmlFor="nico-age-input" className="sr-only">
                  Your age in years
                </label>
                <input
                  id="nico-age-input"
                  type="number"
                  inputMode="numeric"
                  min={18}
                  max={100}
                  value={answers.age}
                  onChange={(e) => setAge(Number(e.target.value) || 18)}
                  className="w-24 bg-transparent text-center text-4xl font-black font-mono text-accent-emerald outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setAge(answers.age + 1)}
                  disabled={answers.age >= 100}
                  aria-label="Increase age"
                  className="focus-ring interactive flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/50 text-foreground transition-all hover:border-foreground/30 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* Sleep / Energy / Stress / Movement / Diet — one scale per screen */}
          {(SCALE_ORDER as readonly string[]).includes(stepId) && (
            <section aria-labelledby="nico-scale">
              <QuestionHeading id="nico-scale" question={NICO_SCALE_LABELS[stepId as (typeof SCALE_ORDER)[number]].question} helper="Rate it 1 to 5." />
              <ScaleButtons
                pillar={stepId as (typeof SCALE_ORDER)[number]}
                value={answers[stepId as (typeof SCALE_ORDER)[number]]}
                onChange={(v) => setAnswers((a) => ({ ...a, [stepId]: v }))}
              />
            </section>
          )}

          {/* Focus areas */}
          {stepId === 'focus' && (
            <section aria-labelledby="nico-focus">
              <QuestionHeading
                id="nico-focus"
                question="Any specific systems you want to target?"
                helper="Optional — tilts the stack toward these. Skip if you're not sure."
              />
              <div className="grid sm:grid-cols-2 gap-3">
                {NICO_FOCUS_OPTIONS.map((f) => (
                  <Chip
                    key={f.id}
                    active={answers.focus.includes(f.id)}
                    onClick={() => setAnswers((a) => ({ ...a, focus: toggle<NicoFocus>(a.focus, f.id) }))}
                  >
                    <span className="block">{f.label}</span>
                    <span className="block text-micro font-normal text-muted-foreground mt-0.5">
                      {f.desc}
                    </span>
                  </Chip>
                ))}
              </div>
            </section>
          )}

          {/* Safety screen */}
          {stepId === 'safety' && (
            <section aria-labelledby="nico-safety">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-accent-rose" />
                <h2 id="nico-safety" tabIndex={-1} className="text-lg font-bold text-foreground outline-none">
                  Any of these apply to you?
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Select anything that applies so the stack can hold back compounds with a known interaction. Leave
                blank if none apply. This is educational, not a substitute for your prescriber.
              </p>
              <div className="grid gap-3">
                {NICO_SAFETY_OPTIONS.map((s) => (
                  <Chip
                    key={s.id}
                    active={answers.safety.includes(s.id)}
                    onClick={() =>
                      setAnswers((a) => ({ ...a, safety: toggle<NicoSafetyFlag>(a.safety, s.id) }))
                    }
                  >
                    {s.label}
                  </Chip>
                ))}
              </div>
            </section>
          )}

          {/* Result */}
          {isResult && result && (
            <section aria-labelledby="nico-result">
              <p className="text-micro font-mono text-accent-emerald uppercase tracking-widest mb-1">
                Your personalized stack
              </p>
              <h2 id="nico-result" tabIndex={-1} className="text-2xl font-black text-foreground mb-2 outline-none">
                {result.protocolName}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-5">{result.summary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <StatTile value={`${result.synergy}`} label="Synergy /100" />
                <StatTile value={`${result.hallmarksCovered}`} label="Hallmarks" />
                <StatTile value={`${result.compoundCount}`} label="Compounds" />
                <StatTile value={`$${result.estMonthlyCost}`} label="Est. /mo" />
              </div>

              <ul className="space-y-3 mb-6">
                {result.compounds.map((c) => (
                  <li key={c.id} className="card-elevated p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-foreground">{c.name}</span>
                        <EvidenceTag tier={c.evidence} size="sm" />
                      </div>
                      <p className="text-micro font-mono text-muted-foreground mt-0.5">
                        {c.dose} · {c.timing}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{c.rationale}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {result.drivers.length > 0 && (
                <div className="card-elevated p-4 mb-4">
                  <p className="text-micro font-mono text-accent-cyan uppercase tracking-wider mb-2">
                    Why this stack
                  </p>
                  <ul className="space-y-1">
                    {result.drivers.map((d) => (
                      <li key={d} className="text-xs text-muted-foreground">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.safetyNotes.length > 0 && (
                <div className="rounded-xl border border-accent-rose/30 bg-accent-rose/10 p-4 mb-6">
                  <p className="text-micro font-mono text-accent-rose uppercase tracking-wider mb-2">
                    Safety notes
                  </p>
                  <ul className="space-y-1.5">
                    {result.safetyNotes.map((n) => (
                      <li key={n} className="text-xs text-[var(--color-text-secondary)]">
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  href={stackHref}
                  className="focus-ring inline-flex items-center gap-2 bg-accent-emerald text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-accent-emerald/90 transition-colors"
                >
                  <FlaskConical className="w-4 h-4" /> Load in Stack Builder
                </Link>
                <Link
                  href="/dashboard"
                  className="focus-ring inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Track in OS dashboard
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="focus-ring inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-foreground transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Retake
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Nav buttons */}
        {!isResult && (
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="focus-ring interactive inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-foreground disabled:opacity-40 disabled:pointer-events-none rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="focus-ring inline-flex items-center gap-2 bg-accent-emerald text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-accent-emerald/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {step === STEP_IDS.length - 2 ? 'See my stack' : 'Continue'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
