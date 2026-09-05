'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  FlaskConical,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  computeNicoStack,
  NICO_DEFAULT_ANSWERS,
  NICO_SAFETY_OPTIONS,
  NICO_SCALE_LABELS,
  type NicoGoal,
  type NicoResult,
  type NicoSafetyFlag,
  type Scale,
} from '@/lib/nico-questionnaire';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { RevealItem } from '@/components/ui/RevealItem';

/**
 * Section 06 — PERSONALIZE. A compact, on-page NICO starter.
 *
 * Runs the SAME deterministic engine as the full /nico questionnaire
 * (`lib/nico-questionnaire.ts` → `computeNicoStack`) and invents nothing: the
 * stack, its synergy, hallmark coverage and dosing are all computed from the
 * graded compound data. Everything runs on the visitor's device.
 *
 * Why this asks more than it used to. The previous version collected only age,
 * activity and goals, and spread NICO_DEFAULT_ANSWERS over the rest — which
 * meant it silently sent `safety: []` and a neutral 3 for sleep/energy/stress/
 * diet on every single run. Two consequences, both real:
 *
 *  1. The engine's SAFETY_EXCLUDE never fired. Flagging pregnancy removes 13
 *     compounds and anticoagulants removes 4, but the starter could not raise
 *     either — while the section copy promised "a built-in safety screen" and
 *     the result panel rendered a "Safety notes" block that could never appear.
 *     That is a safety claim the code did not honour, on a health platform.
 *  2. The engine's SIGNAL_BOOST rules key off sleep <= 2, stress >= 4,
 *     energy <= 2 and diet <= 2. Pinned at 3, not one of them could ever fire.
 *     Measured, the two effects are NOT the same size, and the copy reflects
 *     that rather than flattering it: the safety screen can replace the stack
 *     outright (flagging pregnancy takes nmn/cakg/spermidine to
 *     glynac/coq10/egcg/grapeseed and emits a real note), whereas the
 *     lifestyle signals are a scoring nudge — diet 1 / energy 1 swaps a slot
 *     (glynac -> coq10), while sleep 1 / stress 5 on a longevity goal reorders
 *     the same four compounds without changing the set.
 *
 * The flow is therefore three short steps rather than one long column, and the
 * safety step requires an explicit answer: "unanswered" must never be recorded
 * as "no contraindications", which is precisely the bug above.
 */

const AGE_RANGES: { id: string; label: string; age: number }[] = [
  { id: 'under40', label: 'Under 40', age: 32 },
  { id: '40to60', label: '40 – 60', age: 50 },
  { id: 'over60', label: 'Over 60', age: 68 },
];

const ACTIVITY: { id: string; label: string; movement: Scale }[] = [
  { id: 'sedentary', label: 'Mostly sedentary', movement: 1 },
  { id: 'moderate', label: 'Moderately active', movement: 3 },
  { id: 'training', label: 'Training regularly', movement: 5 },
];

// Focus areas map straight onto NICO goals — the same ids the full engine scores.
const FOCUS: { id: NicoGoal; label: string }[] = [
  { id: 'energy', label: 'Energy' },
  { id: 'cognitive', label: 'Cognition' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'inflammation', label: 'Inflammation' },
  { id: 'longevity', label: 'Longevity core' },
  { id: 'sleep', label: 'Sleep' },
];

/** The lifestyle pillars the engine's SIGNAL_BOOST actually reads. Question and
 *  endpoint wording come from the engine's own NICO_SCALE_LABELS — never
 *  re-authored here, so the starter and the full questionnaire cannot drift. */
const SIGNALS = ['sleep', 'energy', 'stress', 'diet'] as const;
type SignalKey = (typeof SIGNALS)[number];

const MAX_FOCUS = 3;
const STEPS = ['You', 'Signals', 'Safety'] as const;

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-elevated p-3 text-center">
      <p className="mb-0.5 font-mono text-xl font-bold text-accent-violet">{value}</p>
      <p className="text-micro uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

/** A 1–5 pillar rating, matching the full questionnaire's ScaleButtons idiom. */
function SignalScale({
  pillar,
  value,
  onChange,
}: {
  pillar: SignalKey;
  value: Scale;
  onChange: (v: Scale) => void;
}) {
  const meta = NICO_SCALE_LABELS[pillar];
  return (
    <fieldset>
      <legend className="text-label mb-2 text-muted-foreground">{meta.question}</legend>
      <div className="grid grid-cols-5 gap-1.5" role="group" aria-label={meta.question}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            onClick={() => onChange(n as Scale)}
            className={['nico-opt focus-ring interactive !min-h-11 font-mono', value === n ? 'is-on' : ''].join(' ')}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-micro font-mono text-caption">
        <span>{meta.low}</span>
        <span>{meta.high}</span>
      </div>
    </fieldset>
  );
}

export function HomeNicoStarter() {
  const [step, setStep] = useState(0);
  const [ageId, setAgeId] = useState('40to60');
  const [actId, setActId] = useState('moderate');
  const [focus, setFocus] = useState<NicoGoal[]>([]);
  const [signals, setSignals] = useState<Record<SignalKey, Scale>>({
    sleep: 3,
    energy: 3,
    stress: 3,
    diet: 3,
  });
  const [safety, setSafety] = useState<NicoSafetyFlag[]>([]);
  // Explicitly distinct from "no flags selected": the engine treats an empty
  // list as "nothing to avoid", so that has to be a choice the reader made.
  const [noneChecked, setNoneChecked] = useState(false);
  const [result, setResult] = useState<NicoResult | null>(null);

  // Move focus to the new step's heading (and to the result when it arrives) so
  // the flow is followable by keyboard and screen reader, not just by sight.
  const stepRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (result) resultRef.current?.focus();
    else if (step > 0) stepRef.current?.focus();
  }, [result, step]);

  const toggleFocus = (id: NicoGoal) =>
    setFocus((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : f.length < MAX_FOCUS ? [...f, id] : f,
    );

  const toggleSafety = (id: NicoSafetyFlag) => {
    setNoneChecked(false);
    setSafety((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const chooseNone = () => {
    setNoneChecked(true);
    setSafety([]);
  };

  const compute = () => {
    const age = AGE_RANGES.find((a) => a.id === ageId)!.age;
    const movement = ACTIVITY.find((a) => a.id === actId)!.movement;
    const goals: NicoGoal[] = focus.length ? focus : ['longevity'];
    setResult(
      computeNicoStack({
        ...NICO_DEFAULT_ANSWERS,
        age,
        movement,
        goals,
        sleep: signals.sleep,
        energy: signals.energy,
        stress: signals.stress,
        diet: signals.diet,
        safety,
      }),
    );
  };

  const reset = () => {
    setResult(null);
    setStep(0);
  };

  const stackHref =
    result && result.compoundIds.length
      ? `/stacks?stack=${result.compoundIds.join(',')}&from=nico`
      : '/stacks';

  const singleClass = (on: boolean) => ['nico-opt focus-ring interactive', on ? 'is-on' : ''].join(' ');
  const safetyAnswered = noneChecked || safety.length > 0;

  return (
    <section
      id="personalize"
      aria-labelledby="home-nico-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider hue="var(--accent-violet)" index="06" label="Personalize" />
      <div className="container-page">
        <RevealItem className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-label mb-3 text-accent-violet">06 / Personalize</p>
          <h2 id="home-nico-heading" className="heading-section mb-3">
            Your first move — computed for you.
          </h2>
          <div className="heading-accent-rule is-center mb-4" aria-hidden="true" />
          <p className="text-body mx-auto max-w-xl">
            Three short steps — who you are, how you&apos;re actually doing, and anything NICO needs
            to avoid. It then assembles an evidence-graded starting stack from the graded compound
            library. Nothing is stored; everything runs on your device.
          </p>
        </RevealItem>

        <div className="nico-console mx-auto max-w-2xl">
          <div className="nico-console__head">
            <span className="nico-console__dot" aria-hidden="true" />
            NICO engine · runs on your device
          </div>

          {!result && (
            <ol className="nico-steps" aria-label="Progress">
              {STEPS.map((label, i) => (
                <li
                  key={label}
                  className={['nico-step', i === step ? 'is-current' : '', i < step ? 'is-done' : ''].join(' ')}
                  aria-current={i === step ? 'step' : undefined}
                >
                  <span className="nico-step__num" aria-hidden="true">{i + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
          )}

          <div className="nico-console__body">
            {!result ? (
              <div className="space-y-7">
                <p
                  ref={stepRef}
                  tabIndex={-1}
                  className="text-caption text-muted-foreground outline-none"
                >
                  {step === 0 && 'Step 1 of 3 — the basics that set your baseline.'}
                  {step === 1 &&
                    'Step 2 of 3 — these feed the same scoring the full questionnaire uses. A low score pulls the compounds that address it up the ranking, and can change what makes the cut.'}
                  {step === 2 &&
                    'Step 3 of 3 — anything here removes compounds that interact with it. Tell us even if it feels obvious.'}
                </p>

                {step === 0 && (
                  <>
                    <fieldset>
                      <legend className="text-label mb-3 text-muted-foreground">Age range</legend>
                      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Age range">
                        {AGE_RANGES.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            aria-pressed={ageId === a.id}
                            onClick={() => setAgeId(a.id)}
                            className={singleClass(ageId === a.id)}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="text-label mb-3 text-muted-foreground">Activity level</legend>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label="Activity level">
                        {ACTIVITY.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            aria-pressed={actId === a.id}
                            onClick={() => setActId(a.id)}
                            className={singleClass(actId === a.id)}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="text-label mb-3 text-muted-foreground">
                        Focus areas — up to three{' '}
                        <span aria-live="polite" className="text-accent-violet">
                          ({focus.length}/{MAX_FOCUS})
                        </span>
                      </legend>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Focus areas">
                        {FOCUS.map((f) => {
                          const on = focus.includes(f.id);
                          const atLimit = !on && focus.length >= MAX_FOCUS;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              aria-pressed={on}
                              // aria-disabled (not `disabled`) so the chip stays
                              // focusable and announced at the limit; toggleFocus
                              // already no-ops once three are selected.
                              aria-disabled={atLimit}
                              onClick={() => toggleFocus(f.id)}
                              className={[singleClass(on), atLimit ? 'is-limit' : ''].join(' ')}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-caption text-muted-foreground">
                        Skip this and NICO builds the broad longevity core.
                      </p>
                    </fieldset>
                  </>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    {SIGNALS.map((key) => (
                      <SignalScale
                        key={key}
                        pillar={key}
                        value={signals[key]}
                        onChange={(v) => setSignals((s) => ({ ...s, [key]: v }))}
                      />
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <fieldset>
                    <legend className="text-label mb-3 text-muted-foreground">
                      Do any of these apply to you?
                    </legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Safety screen">
                      {NICO_SAFETY_OPTIONS.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          aria-pressed={safety.includes(o.id)}
                          onClick={() => toggleSafety(o.id)}
                          className={[singleClass(safety.includes(o.id)), 'sm:!justify-start sm:text-left'].join(' ')}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      aria-pressed={noneChecked}
                      onClick={chooseNone}
                      className={[singleClass(noneChecked), 'mt-2'].join(' ')}
                    >
                      None of these apply
                    </button>
                    <p className="mt-3 flex items-start gap-2 text-caption text-muted-foreground">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-emerald" aria-hidden="true" />
                      NICO removes compounds that interact with what you select. This is a filter, not
                      medical advice — check any protocol with your clinician.
                    </p>
                  </fieldset>
                )}

                <div className="flex items-center gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="focus-ring interactive inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s + 1)}
                      className="btn-gradient focus-ring group flex-1 justify-center rounded-full text-sm"
                    >
                      Continue
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={compute}
                      disabled={!safetyAnswered}
                      className="btn-gradient focus-ring group flex-1 justify-center rounded-full text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      Compute my starting stack
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
                {step === STEPS.length - 1 && !safetyAnswered && (
                  <p className="text-caption text-muted-foreground" aria-live="polite">
                    Pick an option above — including &ldquo;None of these apply&rdquo; — so the safety
                    screen runs on a real answer rather than a blank one.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="mb-1 font-mono text-micro uppercase tracking-widest text-accent-violet">
                  Your starting stack
                </p>
                <h3
                  ref={resultRef}
                  tabIndex={-1}
                  className="mb-2 text-2xl font-bold text-foreground outline-none"
                >
                  {result.protocolName}
                </h3>
                <p className="mb-5 text-sm text-[var(--color-text-secondary)]">{result.summary}</p>

                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat value={`${result.synergy}`} label="Synergy /100" />
                  <Stat value={`${result.hallmarksCovered}`} label="Hallmarks" />
                  <Stat value={`${result.compoundCount}`} label="Compounds" />
                  <Stat value={`$${result.estMonthlyCost}`} label="Est. /mo" />
                </div>

                <ul className="mb-6 space-y-2">
                  {result.compounds.map((c) => (
                    <li key={c.id} className="premium-card p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{c.name}</span>
                            <EvidenceTag tier={c.evidence} size="sm" />
                          </div>
                          <p className="mt-0.5 font-mono text-micro text-muted-foreground">
                            {c.dose} · {c.timing}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {result.safetyNotes.length > 0 && (
                  <div className="mb-6 rounded-xl border border-accent-rose/30 bg-accent-rose/10 p-4">
                    <p className="mb-2 font-mono text-micro uppercase tracking-wider text-accent-rose">
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

                {/* What the engine actually used — so the number above is
                    inspectable rather than asserted. */}
                <div className="mb-6 rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="mb-2 font-mono text-micro uppercase tracking-wider text-muted-foreground">
                    What NICO used
                  </p>
                  <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                    <li>
                      {AGE_RANGES.find((a) => a.id === ageId)!.label} ·{' '}
                      {ACTIVITY.find((a) => a.id === actId)!.label.toLowerCase()}
                    </li>
                    <li>
                      Sleep {signals.sleep}/5 · Energy {signals.energy}/5 · Stress {signals.stress}/5 ·
                      Diet {signals.diet}/5
                    </li>
                    <li>
                      Focus:{' '}
                      {focus.length
                        ? focus.map((f) => FOCUS.find((x) => x.id === f)!.label).join(', ')
                        : 'Longevity core (default)'}
                    </li>
                    <li>
                      Safety screen:{' '}
                      {safety.length
                        ? safety.map((s) => NICO_SAFETY_OPTIONS.find((o) => o.id === s)!.label).join(', ')
                        : 'nothing flagged'}
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href={stackHref} className="btn-gradient focus-ring text-sm">
                    <FlaskConical className="h-4 w-4" aria-hidden="true" /> Load in Stack Builder
                  </Link>
                  <Link
                    href="/nico"
                    className="focus-ring inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-foreground/40 hover:text-foreground"
                  >
                    <ClipboardList className="h-4 w-4" aria-hidden="true" /> Open the full questionnaire
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-foreground"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start over
                  </button>
                </div>

                <p className="mt-4 text-caption text-muted-foreground">
                  A starting point, not a prescription. The full questionnaire adds per-hallmark
                  focus and a wider safety screen for a more precise stack.
                </p>
              </div>
            )}
          </div>
        </div>

        <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <li className="font-mono uppercase tracking-widest">Free forever</li>
          <li aria-hidden="true" className="text-border">·</li>
          <li className="font-mono uppercase tracking-widest">Data stays on your device</li>
          <li aria-hidden="true" className="text-border">·</li>
          <li className="font-mono uppercase tracking-widest">No account needed</li>
        </ul>
      </div>
    </section>
  );
}
