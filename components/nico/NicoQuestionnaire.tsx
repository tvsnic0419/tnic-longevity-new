'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  LayoutDashboard,
  FlaskConical,
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

const STEPS = ['Goals', 'Lifestyle', 'Focus', 'Safety', 'Your stack'] as const;

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
          ? 'border-accent-emerald bg-accent-emerald/10 text-accent-emerald'
          : 'border-border bg-card/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function ScaleRow({
  pillar,
  value,
  onChange,
}: {
  pillar: keyof typeof NICO_SCALE_LABELS;
  value: Scale;
  onChange: (v: Scale) => void;
}) {
  const meta = NICO_SCALE_LABELS[pillar];
  return (
    <div>
      <p className="text-sm font-semibold text-foreground mb-2">{meta.question}</p>
      <div className="grid grid-cols-5 gap-2" role="group" aria-label={meta.question}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            onClick={() => onChange(n as Scale)}
            className={[
              'focus-ring interactive rounded-lg border py-2 text-sm font-mono transition-all',
              value === n
                ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                : 'border-border bg-card/40 text-muted-foreground hover:border-foreground/30',
            ].join(' ')}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] font-mono text-caption mt-1">
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
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
    </div>
  );
}

export function NicoQuestionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<NicoAnswers>({ ...NICO_DEFAULT_ANSWERS });

  const result = useMemo(
    () => (step === STEPS.length - 1 ? computeNicoStack(answers) : null),
    [step, answers],
  );

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const canAdvance =
    step === 0 ? answers.goals.length > 0 : true; // only Goals is required

  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => {
    setAnswers({ ...NICO_DEFAULT_ANSWERS });
    setStep(0);
  };

  const stackHref =
    result && result.compoundIds.length
      ? `/stacks?stack=${result.compoundIds.join(',')}&from=nico`
      : '/stacks';

  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          icon={Sparkles}
          eyebrow="Personalized"
          title="NICO Starter Questionnaire"
          description="Answer a few questions — the NICO Starter Questionnaire builds your personalized stack from your own selections, loads it into Stack Builder, and tracks it in your OS dashboard. No account required."
          theme="emerald"
        />

        {/* Progress */}
        <ol className="flex items-center gap-1.5 mb-8" aria-label="Progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <div
                className={[
                  'h-1 rounded-full transition-colors',
                  i <= step ? 'bg-accent-emerald' : 'bg-border/50',
                ].join(' ')}
              />
              <span
                className={[
                  'mt-1.5 block text-[10px] font-mono uppercase tracking-wide',
                  i === step ? 'text-accent-emerald' : 'text-caption',
                ].join(' ')}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-border/60 bg-card/30 p-6 md:p-8">
          {/* Step 0 — Goals */}
          {step === 0 && (
            <section aria-labelledby="nico-goals">
              <h2 id="nico-goals" className="text-lg font-bold text-foreground mb-1">
                What do you most want to improve?
              </h2>
              <p className="text-sm text-muted-foreground mb-5">Pick one or more. This anchors your stack.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {NICO_GOAL_OPTIONS.map((g) => (
                  <Chip
                    key={g.id}
                    active={answers.goals.includes(g.id)}
                    onClick={() => setAnswers((a) => ({ ...a, goals: toggle<NicoGoal>(a.goals, g.id) }))}
                  >
                    <span className="block">{g.label}</span>
                    <span className="block text-[11px] font-normal text-muted-foreground/80 mt-0.5">
                      {g.desc}
                    </span>
                  </Chip>
                ))}
              </div>
            </section>
          )}

          {/* Step 1 — Lifestyle */}
          {step === 1 && (
            <section aria-labelledby="nico-lifestyle" className="space-y-5">
              <div>
                <h2 id="nico-lifestyle" className="text-lg font-bold text-foreground mb-1">
                  A few signals about your baseline
                </h2>
                <p className="text-sm text-muted-foreground">These tune the recommendation to where you are now.</p>
              </div>
              <div>
                <label htmlFor="nico-age" className="text-sm font-semibold text-foreground block mb-2">
                  Your age
                </label>
                <input
                  id="nico-age"
                  type="number"
                  min={18}
                  max={100}
                  value={answers.age}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, age: Math.max(18, Math.min(100, Number(e.target.value) || 0)) }))
                  }
                  className="w-28 bg-muted/50 border border-border rounded-xl px-4 py-2 text-sm font-mono outline-none focus:border-accent-emerald/50"
                />
              </div>
              <ScaleRow pillar="sleep" value={answers.sleep} onChange={(v) => setAnswers((a) => ({ ...a, sleep: v }))} />
              <ScaleRow pillar="energy" value={answers.energy} onChange={(v) => setAnswers((a) => ({ ...a, energy: v }))} />
              <ScaleRow pillar="stress" value={answers.stress} onChange={(v) => setAnswers((a) => ({ ...a, stress: v }))} />
              <ScaleRow pillar="movement" value={answers.movement} onChange={(v) => setAnswers((a) => ({ ...a, movement: v }))} />
              <ScaleRow pillar="diet" value={answers.diet} onChange={(v) => setAnswers((a) => ({ ...a, diet: v }))} />
            </section>
          )}

          {/* Step 2 — Focus areas */}
          {step === 2 && (
            <section aria-labelledby="nico-focus">
              <h2 id="nico-focus" className="text-lg font-bold text-foreground mb-1">
                Any hallmarks you want to prioritize?
              </h2>
              <p className="text-sm text-muted-foreground mb-5">Optional — tilts the stack toward these systems.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {NICO_FOCUS_OPTIONS.map((f) => (
                  <Chip
                    key={f.id}
                    active={answers.focus.includes(f.id)}
                    onClick={() => setAnswers((a) => ({ ...a, focus: toggle<NicoFocus>(a.focus, f.id) }))}
                  >
                    {f.label}
                  </Chip>
                ))}
              </div>
            </section>
          )}

          {/* Step 3 — Safety screen */}
          {step === 3 && (
            <section aria-labelledby="nico-safety">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-accent-rose" />
                <h2 id="nico-safety" className="text-lg font-bold text-foreground">
                  Safety screen
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Select anything that applies so the NICO Starter Questionnaire can hold back compounds with a known interaction. Leave blank if none
                apply. This is educational and not a substitute for your prescriber.
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

          {/* Step 4 — Result */}
          {step === 4 && result && (
            <section aria-labelledby="nico-result">
              <p className="text-[10px] font-mono text-accent-emerald uppercase tracking-widest mb-1">
                Your personalized stack
              </p>
              <h2 id="nico-result" className="text-2xl font-black text-foreground mb-2">
                {result.protocolName}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">{result.summary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <StatTile value={`${result.synergy}`} label="Synergy /100" />
                <StatTile value={`${result.hallmarksCovered}`} label="Hallmarks" />
                <StatTile value={`${result.compoundCount}`} label="Compounds" />
                <StatTile value={`$${result.estMonthlyCost}`} label="Est. /mo" />
              </div>

              <ul className="space-y-3 mb-6">
                {result.compounds.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-xl border border-border/60 bg-card/40 p-4 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-foreground">{c.name}</span>
                        <EvidenceTag tier={c.evidence} size="sm" />
                      </div>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        {c.dose} · {c.timing}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{c.rationale}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {result.drivers.length > 0 && (
                <div className="rounded-xl border border-border/50 bg-card/30 p-4 mb-4">
                  <p className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider mb-2">
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
                <div className="rounded-xl border border-accent-rose/30 bg-accent-rose/5 p-4 mb-6">
                  <p className="text-[10px] font-mono text-accent-rose uppercase tracking-wider mb-2">
                    Safety notes
                  </p>
                  <ul className="space-y-1.5">
                    {result.safetyNotes.map((n) => (
                      <li key={n} className="text-xs text-muted-foreground">
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
                  className="focus-ring inline-flex items-center gap-2 border border-border px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Track in OS dashboard
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="focus-ring inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Retake
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Nav buttons */}
        {step < STEPS.length - 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="focus-ring interactive inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="focus-ring inline-flex items-center gap-2 bg-accent-emerald text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-accent-emerald/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {step === STEPS.length - 2 ? 'See my stack' : 'Continue'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
