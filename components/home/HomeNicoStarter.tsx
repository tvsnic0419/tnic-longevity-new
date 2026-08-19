'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, FlaskConical, ClipboardList, Sparkles, RotateCcw } from 'lucide-react';
import {
  computeNicoStack,
  NICO_DEFAULT_ANSWERS,
  type NicoGoal,
  type NicoResult,
  type Scale,
} from '@/lib/nico-questionnaire';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { RevealItem } from '@/components/ui/RevealItem';

/**
 * Section 06 — PERSONALIZE. A compact, on-page NICO starter.
 *
 * Three quick inputs (age range, activity, up to three focus areas) map onto
 * the SAME deterministic scoring engine the full /nico questionnaire uses
 * (`lib/nico-questionnaire.ts` → `computeNicoStack`). It invents nothing: the
 * starting stack, its synergy, hallmark coverage and per-compound dosing are
 * all computed from the graded compound data. Everything runs on the visitor's
 * device — no answer leaves the browser, nothing is stored.
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

const MAX_FOCUS = 3;

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-3 text-center">
      <p className="mb-0.5 font-mono text-xl font-bold text-accent-violet">{value}</p>
      <p className="text-micro uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

export function HomeNicoStarter() {
  const [ageId, setAgeId] = useState('40to60');
  const [actId, setActId] = useState('moderate');
  const [focus, setFocus] = useState<NicoGoal[]>([]);
  const [result, setResult] = useState<NicoResult | null>(null);

  const toggleFocus = (id: NicoGoal) =>
    setFocus((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : f.length < MAX_FOCUS ? [...f, id] : f,
    );

  const compute = () => {
    const age = AGE_RANGES.find((a) => a.id === ageId)!.age;
    const movement = ACTIVITY.find((a) => a.id === actId)!.movement;
    const goals: NicoGoal[] = focus.length ? focus : ['longevity'];
    setResult(computeNicoStack({ ...NICO_DEFAULT_ANSWERS, age, movement, goals }));
  };

  const reset = () => setResult(null);

  const stackHref =
    result && result.compoundIds.length
      ? `/stacks?stack=${result.compoundIds.join(',')}&from=nico`
      : '/stacks';

  const singleClass = (on: boolean) =>
    [
      'focus-ring interactive rounded-xl border px-4 py-3 text-sm font-semibold transition-all',
      on
        ? 'border-accent-violet bg-accent-violet/10 text-accent-violet'
        : 'border-border bg-card/50 text-foreground hover:border-foreground/40 hover:bg-card/80',
    ].join(' ');

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
            Answer three quick questions and NICO assembles a personalized, evidence-graded starting
            stack pointed at your goals — with a built-in safety screen. Nothing is stored; everything
            runs on your device.
          </p>
        </RevealItem>

        <div
          className="premium-card mx-auto max-w-2xl p-6 md:p-8"
          style={{ '--card-accent': 'var(--accent-violet)' } as CSSProperties}
        >
          {!result ? (
            <div className="space-y-7">
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
                  Focus areas — select up to three
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
                        disabled={atLimit}
                        onClick={() => toggleFocus(f.id)}
                        className={[
                          singleClass(on),
                          atLimit ? 'opacity-40 pointer-events-none' : '',
                        ].join(' ')}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={compute}
                className="btn-gradient focus-ring group w-full justify-center rounded-full text-sm"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Compute my starting stack
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>
          ) : (
            <div aria-live="polite">
              <p className="mb-1 font-mono text-micro uppercase tracking-widest text-accent-violet">
                Your starting stack
              </p>
              <h3 className="mb-2 text-2xl font-bold text-foreground">{result.protocolName}</h3>
              <p className="mb-5 text-sm text-[var(--color-text-secondary)]">{result.summary}</p>

              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat value={`${result.synergy}`} label="Synergy /100" />
                <Stat value={`${result.hallmarksCovered}`} label="Hallmarks" />
                <Stat value={`${result.compoundCount}`} label="Compounds" />
                <Stat value={`$${result.estMonthlyCost}`} label="Est. /mo" />
              </div>

              <ul className="mb-6 space-y-2">
                {result.compounds.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card/40 p-3.5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{c.name}</span>
                        <EvidenceTag tier={c.evidence} size="sm" />
                      </div>
                      <p className="mt-0.5 font-mono text-micro text-muted-foreground">
                        {c.dose} · {c.timing}
                      </p>
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

              <div className="flex flex-wrap gap-3">
                <Link
                  href={stackHref}
                  className="focus-ring inline-flex items-center gap-2 rounded-xl bg-accent-violet px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-accent-violet/90"
                >
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
                A quick starting point — the full questionnaire adds sleep, stress, diet and a safety
                screen for a more precise stack.
              </p>
            </div>
          )}
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
