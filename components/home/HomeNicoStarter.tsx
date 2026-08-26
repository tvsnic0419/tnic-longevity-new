'use client';

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, FlaskConical, ClipboardList, Sparkles, RotateCcw } from 'lucide-react';
import {
  computeNicoStack,
  NICO_DEFAULT_ANSWERS,
  NICO_GOAL_OPTIONS,
  type NicoGoal,
  type NicoResult,
  type Scale,
} from '@/lib/nico-questionnaire';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { RevealItem } from '@/components/ui/RevealItem';
import { SelectableChip } from '@/components/ui/SelectableChip';

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
// The short label stays the compact homepage wording; the explanatory line is
// DERIVED from `NICO_GOAL_OPTIONS` (the full flow's own already-authored copy)
// rather than written fresh here, so the two surfaces can never describe the
// same goal differently.
const GOAL_DESC = new Map(NICO_GOAL_OPTIONS.map((g) => [g.id, g.desc]));

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
    <div className="card-elevated p-3 text-center">
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

  // When the stack is computed, move focus (and scroll) to the result heading
  // so the outcome isn't stranded below the fold with focus left on the button.
  const resultRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

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
                    <SelectableChip
                      key={a.id}
                      shape="card"
                      selected={ageId === a.id}
                      onSelect={() => setAgeId(a.id)}
                      label={a.label}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-label mb-3 text-muted-foreground">Activity level</legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label="Activity level">
                  {ACTIVITY.map((a) => (
                    <SelectableChip
                      key={a.id}
                      shape="card"
                      selected={actId === a.id}
                      onSelect={() => setActId(a.id)}
                      label={a.label}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-label mb-3 text-muted-foreground">
                  Focus areas — up to three{' '}
                  <span aria-live="polite" className="text-accent-emerald">
                    ({focus.length}/{MAX_FOCUS})
                  </span>
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Focus areas">
                  {FOCUS.map((f) => {
                    const on = focus.includes(f.id);
                    const atLimit = !on && focus.length >= MAX_FOCUS;
                    return (
                      <SelectableChip
                        key={f.id}
                        shape="card"
                        selected={on}
                        onSelect={() => toggleFocus(f.id)}
                        label={f.label}
                        description={GOAL_DESC.get(f.id)}
                        // The cap used to communicate itself with opacity alone.
                        // SelectableChip keeps the chip focusable (aria-disabled,
                        // not `disabled`) AND names the reason via
                        // aria-describedby, so the limit is discoverable.
                        disabledReason={
                          atLimit
                            ? `You have already chosen ${MAX_FOCUS} focus areas. Deselect one to pick this.`
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </fieldset>

              {/* Selected-answer summary. Neither NICO flow showed one before
                  submit, so the visitor committed without a recap of what they
                  had actually chosen — and on this screen the form is replaced
                  by the result, so the answers then disappear entirely.
                  Everything here is read back from the current selection; the
                  focus-area default is stated rather than silently applied. */}
              <div className="rounded-xl border border-border/60 bg-white/[0.02] px-4 py-3">
                <p className="text-label mb-2 text-muted-foreground">Your answers</p>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-muted-foreground">Age range:</dt>
                    <dd className="font-medium text-foreground">
                      {AGE_RANGES.find((a) => a.id === ageId)?.label}
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-muted-foreground">Activity:</dt>
                    <dd className="font-medium text-foreground">
                      {ACTIVITY.find((a) => a.id === actId)?.label}
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-muted-foreground">Focus:</dt>
                    <dd className="font-medium text-foreground">
                      {focus.length
                        ? focus.map((id) => FOCUS.find((f) => f.id === id)?.label).join(' · ')
                        : 'None picked — defaults to Longevity core'}
                    </dd>
                  </div>
                </dl>
              </div>

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
