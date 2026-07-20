'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Activity,
  Gauge,
  Plus,
  Check,
  Pencil,
  ChevronRight,
} from 'lucide-react';
import { compounds } from '@/lib/data';
import { stackPresets, type PresetKey } from '@/lib/presets';
import { usePlatform } from '@/context/PlatformContext';
import {
  projectAgingPace,
  type AgingPaceIntake,
  type Sex,
  type Verdict,
} from '@/lib/tools/aging-pace';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────
   Biological Age Trajectory — a guided studio that turns a 7-question intake
   plus the user's supplement stack into a modeled pace of aging and a
   multi-year biological-age trajectory. Engine: lib/tools/aging-pace.ts.
   ───────────────────────────────────────────────────────────────────────── */

const MAX_STACK = 10;

const verdictTheme: Record<
  Verdict,
  { accent: string; text: string; word: string; sub: string }
> = {
  slowing: {
    accent: 'var(--accent-emerald)',
    text: 'text-accent-emerald',
    word: 'Slower than the calendar',
    sub: "You're banking biological years.",
  },
  'on-par': {
    accent: 'var(--accent-cyan)',
    text: 'text-accent-cyan',
    word: 'In step with the calendar',
    sub: 'Holding the line — poised to pull ahead.',
  },
  faster: {
    accent: 'var(--accent-amber)',
    text: 'text-accent-amber',
    word: 'Faster than the calendar',
    sub: 'Your stack is already clawing it back.',
  },
};

// ── Intake question config ──────────────────────────────────────────────────
interface SliderQ {
  key: 'sleep' | 'exercise' | 'diet' | 'stress' | 'substances';
  eyebrow: string;
  question: string;
  accent: string;
  lowLabel: string;
  highLabel: string;
  bands: [threshold: number, label: string][];
}

const SLIDER_QS: SliderQ[] = [
  {
    key: 'sleep',
    eyebrow: 'Recovery',
    question: 'How is your sleep, most nights?',
    accent: 'var(--accent-violet)',
    lowLabel: 'Poor',
    highLabel: 'Excellent',
    bands: [
      [0, 'Under 5h, rarely refreshing'],
      [35, 'Short or broken — 5–6h'],
      [60, 'Solid — around 7h, mostly restful'],
      [80, '7–8h, consistently deep and restful'],
    ],
  },
  {
    key: 'exercise',
    eyebrow: 'Movement',
    question: 'How much do you move in a typical week?',
    accent: 'var(--accent-emerald)',
    lowLabel: 'Sedentary',
    highLabel: 'Athletic',
    bands: [
      [0, 'Mostly sedentary'],
      [30, 'Light — a walk here and there'],
      [55, 'Consistent — 3–4 sessions a week'],
      [78, 'Athletic — 5+ sessions, mixed intensity'],
    ],
  },
  {
    key: 'diet',
    eyebrow: 'Nutrition',
    question: 'What does your diet mostly look like?',
    accent: 'var(--accent-cyan)',
    lowLabel: 'Processed',
    highLabel: 'Whole-food',
    bands: [
      [0, 'Largely ultra-processed'],
      [35, 'Mixed — some whole, some processed'],
      [60, 'Mostly whole foods'],
      [80, 'Whole-food, plant-forward, minimal processed'],
    ],
  },
  {
    key: 'stress',
    eyebrow: 'Load',
    question: 'How heavy is your chronic stress?',
    accent: 'var(--accent-amber)',
    lowLabel: 'Low',
    highLabel: 'Severe',
    bands: [
      [0, 'Low — well-regulated'],
      [35, 'Moderate — manageable most days'],
      [65, 'High — frequently overloaded'],
      [85, 'Severe — sustained, unrelenting'],
    ],
  },
  {
    key: 'substances',
    eyebrow: 'Exposure',
    question: 'Smoking and alcohol?',
    accent: 'var(--accent-rose)',
    lowLabel: 'None',
    highLabel: 'Heavy',
    bands: [
      [0, 'None'],
      [30, 'Occasional — a drink now and then'],
      [60, 'Regular alcohol or light smoking'],
      [80, 'Heavy — daily drinking and/or smoking'],
    ],
  },
];

function bandLabel(q: SliderQ, value: number): string {
  let label = q.bands[0][1];
  for (const [threshold, text] of q.bands) if (value >= threshold) label = text;
  return label;
}

const DEFAULT_INTAKE: AgingPaceIntake = {
  age: 48,
  sex: 'prefer_not',
  sleep: 60,
  exercise: 50,
  diet: 55,
  stress: 45,
  substances: 15,
};

const QUICK_PRESETS: PresetKey[] = ['starter', 'hybrid', 'longevity', 'metabolic'];

type Step = 'intake' | 'stack' | 'result';

// ── Count-up hook (animates from previous value → target, ease-out cubic) ────
function useCountUp(target: number, decimals = 1, duration = 1000) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      setDisplay(v);
      fromRef.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return { ref, value: display.toFixed(decimals) };
}

export function AgingPaceStudio() {
  const { selected, profile } = usePlatform();

  const [step, setStep] = useState<Step>('intake');
  const [qIndex, setQIndex] = useState(0);
  const [intake, setIntake] = useState<AgingPaceIntake>(() => ({
    ...DEFAULT_INTAKE,
    age: profile.age || DEFAULT_INTAKE.age,
  }));
  const [stackIds, setStackIds] = useState<string[]>(() => selected.slice(0, MAX_STACK));
  const [horizon, setHorizon] = useState<number>(10);
  const [adherence, setAdherence] = useState<number>(1);

  const result = useMemo(
    () => projectAgingPace({ intake, stackIds, horizonYears: horizon, adherence }),
    [intake, stackIds, horizon, adherence],
  );

  const setField = <K extends keyof AgingPaceIntake>(key: K, value: AgingPaceIntake[K]) =>
    setIntake((prev) => ({ ...prev, [key]: value }));

  const toggleCompound = (id: string) =>
    setStackIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_STACK
          ? prev
          : [...prev, id],
    );

  const TOTAL_Q = SLIDER_QS.length + 2; // age + sex + sliders

  return (
    <section
      aria-label="Biological Age Trajectory studio"
      className="relative overflow-hidden rounded-3xl border border-accent-emerald/20 card-ultra"
    >
      <StudioHeader step={step} />

      <div className="relative p-5 md:p-8">
        <AnimatePresence mode="wait">
          {step === 'intake' && (
            <motion.div
              key="intake"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <IntakeStep
                total={TOTAL_Q}
                index={qIndex}
                intake={intake}
                setField={setField}
                onBack={() => setQIndex((i) => Math.max(0, i - 1))}
                onNext={() => {
                  if (qIndex < TOTAL_Q - 1) setQIndex((i) => i + 1);
                  else setStep('stack');
                }}
              />
            </motion.div>
          )}

          {step === 'stack' && (
            <motion.div
              key="stack"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <StackStep
                stackIds={stackIds}
                toggleCompound={toggleCompound}
                onLoadPreset={(ids) => setStackIds(ids.slice(0, MAX_STACK))}
                onClear={() => setStackIds([])}
                onBack={() => {
                  setStep('intake');
                  setQIndex(TOTAL_Q - 1);
                }}
                onSeeResult={() => setStep('result')}
              />
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <ResultStep
                result={result}
                horizon={horizon}
                setHorizon={setHorizon}
                adherence={adherence}
                setAdherence={setAdherence}
                onEditIntake={() => {
                  setStep('intake');
                  setQIndex(0);
                }}
                onEditStack={() => setStep('stack')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────
function StudioHeader({ step }: { step: Step }) {
  const stepLabel =
    step === 'intake' ? 'Step 1 · Your baseline' : step === 'stack' ? 'Step 2 · Your stack' : 'Your projection';
  return (
    <header className="relative border-b border-border/50 bg-gradient-to-br from-accent-emerald/[0.07] via-transparent to-accent-cyan/[0.05] px-5 py-5 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-emerald/10 border border-accent-emerald/25">
            <Gauge className="h-5 w-5 text-accent-emerald" aria-hidden="true" />
          </span>
          <div>
            <p className="text-label text-accent-emerald">Flagship model</p>
            <h2 className="heading-card text-lg md:text-xl">Biological Age Trajectory</h2>
          </div>
        </div>
        <span className="text-caption font-mono rounded-full border border-border/60 px-3 py-1">
          {stepLabel}
        </span>
      </div>
      <p className="text-body-sm mt-3 max-w-2xl">
        Answer seven quick questions, enter your stack, and see whether you&apos;re modeled to age{' '}
        <span className="text-accent-emerald font-semibold">slower</span>,{' '}
        <span className="text-accent-cyan font-semibold">in step</span>, or{' '}
        <span className="text-accent-amber font-semibold">faster</span> than the calendar — and how
        many biological years your protocol reclaims.
      </p>
    </header>
  );
}

// ── Step 1: Intake ───────────────────────────────────────────────────────────
function IntakeStep({
  total,
  index,
  intake,
  setField,
  onBack,
  onNext,
}: {
  total: number;
  index: number;
  intake: AgingPaceIntake;
  setField: <K extends keyof AgingPaceIntake>(key: K, value: AgingPaceIntake[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const isAge = index === 0;
  const isSex = index === 1;
  const sliderQ = !isAge && !isSex ? SLIDER_QS[index - 2] : null;

  return (
    <div>
      {/* Progress dots */}
      <div className="mb-8 flex items-center gap-1.5" role="progressbar" aria-valuenow={index + 1} aria-valuemax={total}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              i < index ? 'bg-accent-emerald/70' : i === index ? 'bg-accent-emerald' : 'bg-border/60',
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="min-h-[220px]"
        >
          {isAge && (
            <QuestionShell eyebrow="Baseline" question="How old are you?">
              <div className="text-center">
                <span className="card-data-value text-6xl font-black text-accent-cyan">{intake.age}</span>
                <span className="text-body-sm text-muted-foreground ml-2">years</span>
              </div>
              <PaceSlider
                value={intake.age}
                min={18}
                max={90}
                accent="var(--accent-cyan)"
                onChange={(v) => setField('age', v)}
                lowLabel="18"
                highLabel="90"
              />
            </QuestionShell>
          )}

          {isSex && (
            <QuestionShell eyebrow="Baseline" question="Biological sex?" hint="Used only as a small baseline-hazard adjustment.">
              <div className="grid grid-cols-3 gap-3">
                {(['female', 'male', 'prefer_not'] as Sex[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setField('sex', s)}
                    className={cn(
                      'focus-ring interactive rounded-xl border px-3 py-4 text-sm font-semibold transition-all',
                      intake.sex === s
                        ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                        : 'border-border/60 text-muted-foreground hover:border-accent-cyan/40 hover:text-foreground',
                    )}
                  >
                    {s === 'female' ? 'Female' : s === 'male' ? 'Male' : 'Prefer not'}
                  </button>
                ))}
              </div>
            </QuestionShell>
          )}

          {sliderQ && (
            <QuestionShell eyebrow={sliderQ.eyebrow} question={sliderQ.question}>
              <div className="text-center">
                <p
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: sliderQ.accent }}
                >
                  {bandLabel(sliderQ, intake[sliderQ.key])}
                </p>
              </div>
              <PaceSlider
                value={intake[sliderQ.key]}
                min={0}
                max={100}
                accent={sliderQ.accent}
                onChange={(v) => setField(sliderQ.key, v)}
                lowLabel={sliderQ.lowLabel}
                highLabel={sliderQ.highLabel}
              />
            </QuestionShell>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={index === 0}
          className="focus-ring interactive inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="focus-ring press btn-gradient text-sm !py-2.5 !px-6"
        >
          {index < total - 1 ? 'Next' : 'Enter your stack'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function QuestionShell({
  eyebrow,
  question,
  hint,
  children,
}: {
  eyebrow: string;
  question: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <p className="text-label text-accent-emerald mb-2 text-center">{eyebrow}</p>
      <h3 className="heading-section text-xl md:text-2xl text-center mb-8">{question}</h3>
      <div className="space-y-6">{children}</div>
      {hint && <p className="text-caption text-center mt-5">{hint}</p>}
    </div>
  );
}

function PaceSlider({
  value,
  min,
  max,
  accent,
  onChange,
  lowLabel,
  highLabel,
}: {
  value: number;
  min: number;
  max: number;
  accent: string;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="pace-range"
        style={{ ['--range-fill' as string]: `${fill}%`, ['--range-accent' as string]: accent }}
        aria-label={`${lowLabel} to ${highLabel}`}
      />
      <div className="mt-2 flex justify-between text-caption font-mono">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

// ── Step 2: Stack ─────────────────────────────────────────────────────────────
function StackStep({
  stackIds,
  toggleCompound,
  onLoadPreset,
  onClear,
  onBack,
  onSeeResult,
}: {
  stackIds: string[];
  toggleCompound: (id: string) => void;
  onLoadPreset: (ids: string[]) => void;
  onClear: () => void;
  onBack: () => void;
  onSeeResult: () => void;
}) {
  const full = stackIds.length >= MAX_STACK;
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-label text-accent-emerald mb-1">Step 2 · Your stack</p>
          <h3 className="heading-section text-xl md:text-2xl">What are you taking?</h3>
          <p className="text-body-sm mt-1">Select up to {MAX_STACK} — tap to add or remove.</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'card-data-value text-2xl font-bold',
              full ? 'text-accent-amber' : 'text-accent-emerald',
            )}
          >
            {stackIds.length}
            <span className="text-muted-foreground text-base font-normal"> / {MAX_STACK}</span>
          </span>
          {stackIds.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="focus-ring interactive text-caption text-muted-foreground hover:text-accent-rose rounded-md px-1.5 py-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick presets */}
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="text-caption self-center mr-1">Quick load:</span>
        {QUICK_PRESETS.map((key) => {
          const p = stackPresets[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onLoadPreset([...p.ids])}
              className="focus-ring interactive inline-flex items-center gap-1.5 rounded-full border border-accent-violet/25 bg-accent-violet/5 px-3 py-1.5 text-caption font-semibold text-accent-violet hover:bg-accent-violet/10"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Compound grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {compounds.map((c) => {
          const active = stackIds.includes(c.id);
          const disabled = !active && full;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCompound(c.id)}
              disabled={disabled}
              aria-pressed={active}
              className={cn(
                'focus-ring interactive group flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                active
                  ? 'border-accent-emerald/50 bg-accent-emerald/[0.07]'
                  : 'border-border/50 glass-hover',
                disabled && 'opacity-35 pointer-events-none',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all',
                  active
                    ? 'border-accent-emerald bg-accent-emerald text-[#04140c]'
                    : 'border-border text-muted-foreground group-hover:border-accent-emerald/40',
                )}
              >
                {active ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">{c.name}</span>
                <span className="block truncate text-caption">{c.pathway}</span>
              </span>
              <EvidenceTag tier={c.evidence} size="sm" showTooltip={false} />
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="focus-ring interactive inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={onSeeResult}
          className="focus-ring press btn-gradient text-sm !py-2.5 !px-6"
        >
          See your trajectory
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Result ────────────────────────────────────────────────────────────
function ResultStep({
  result,
  horizon,
  setHorizon,
  adherence,
  setAdherence,
  onEditIntake,
  onEditStack,
}: {
  result: ReturnType<typeof projectAgingPace>;
  horizon: number;
  setHorizon: (h: number) => void;
  adherence: number;
  setAdherence: (a: number) => void;
  onEditIntake: () => void;
  onEditStack: () => void;
}) {
  const theme = verdictTheme[result.verdict];
  const empty = result.contributions.length === 0;
  const { ref: reclaimedRef, value: reclaimedValue } = useCountUp(result.yearsReclaimedByStack, 1);

  return (
    <div>
      {/* Verdict banner */}
      <div
        className="mb-6 rounded-2xl border p-5 md:p-6"
        style={{
          borderColor: `color-mix(in srgb, ${theme.accent} 30%, transparent)`,
          background: `color-mix(in srgb, ${theme.accent} 7%, transparent)`,
        }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-bold uppercase tracking-wide"
            style={{ color: theme.accent, background: `color-mix(in srgb, ${theme.accent} 12%, transparent)` }}
          >
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            {theme.word}
          </span>
        </div>
        <p className="heading-section text-xl md:text-2xl leading-tight">{result.headline}</p>
        <p className="text-body-sm mt-2 max-w-3xl">{result.detail}</p>
      </div>

      {/* Hero grid: dial + reclaimed + trajectory */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Pace dial */}
        <div
          className="card-data glass rounded-2xl p-5 lg:col-span-4 flex flex-col"
          style={{ ['--data-accent' as string]: theme.accent }}
        >
          <p className="text-label mb-1" style={{ color: theme.accent }}>Pace of aging</p>
          <PaceDial pace={result.paceOfAging} accent={theme.accent} />
          <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
            <MiniStat label="Chronological" value={`${result.chronologicalAge}`} unit="yrs" />
            <MiniStat label="Biological (now)" value={`${result.currentBioAge}`} unit="yrs" accent={theme.accent} />
          </div>
        </div>

        {/* Reclaimed + trajectory */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div
            className="card-data glass rounded-2xl p-5"
            style={{ ['--data-accent' as string]: 'var(--accent-emerald)' }}
          >
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-label text-accent-emerald mb-1">Biological years reclaimed by your stack</p>
                <p className="flex items-baseline gap-2">
                  <span ref={reclaimedRef} className="card-data-value text-5xl md:text-6xl font-black text-accent-emerald">
                    {empty ? '0.0' : reclaimedValue}
                  </span>
                  <span className="text-body-sm text-muted-foreground">yrs over {result.horizonYears}</span>
                </p>
              </div>
              {!empty && (
                <p className="text-caption font-mono text-right">
                  range {result.yearsReclaimedRange[0]}–{result.yearsReclaimedRange[1]} yrs
                  <br />
                  vs no stack, same lifestyle
                </p>
              )}
            </div>
          </div>

          <div className="card-base glass rounded-2xl p-4 md:p-5">
            <TrajectoryChart result={result} accent={theme.accent} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ControlGroup label="Projection horizon">
          {[5, 10, 20].map((h) => (
            <ControlPill key={h} active={horizon === h} onClick={() => setHorizon(h)}>
              {h} yrs
            </ControlPill>
          ))}
        </ControlGroup>
        <ControlGroup label="Protocol adherence">
          {[
            [1, '100%'],
            [0.85, '85%'],
            [0.7, '70%'],
          ].map(([a, l]) => (
            <ControlPill key={l} active={adherence === a} onClick={() => setAdherence(a as number)}>
              {l as string}
            </ControlPill>
          ))}
        </ControlGroup>
      </div>

      {/* Contributions */}
      {!empty && <ContributionBars result={result} />}

      {/* Meta row */}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-caption font-mono">
        <span>Synergy <span className="text-accent-violet font-bold">{result.synergyScore}</span></span>
        <span>Hallmarks <span className="text-accent-emerald font-bold">{result.hallmarkCount}/12</span></span>
        <span>Stack evidence tier <span className={verdictTheme.slowing.text + ' font-bold'}>{result.evidenceTier}</span></span>
        <span>Effects ramp in over <span className="text-foreground font-bold">{result.rampMonths} mo</span></span>
      </div>

      {/* Disclaimer + actions */}
      <p className="text-caption mt-5 border-t border-border/50 pt-4">{result.disclaimer}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEditStack}
          className="focus-ring interactive inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-accent-emerald hover:border-accent-emerald/30"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit stack
        </button>
        <button
          type="button"
          onClick={onEditIntake}
          className="focus-ring interactive inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-accent-cyan hover:border-accent-cyan/30"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Redo intake
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit, accent }: { label: string; value: string; unit: string; accent?: string }) {
  return (
    <div>
      <p className="text-caption">{label}</p>
      <p className="card-data-value text-xl font-bold" style={accent ? { color: accent } : undefined}>
        {value}
        <span className="text-caption font-normal text-muted-foreground ml-1">{unit}</span>
      </p>
    </div>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 glass px-3 py-2">
      <span className="text-caption shrink-0">{label}</span>
      <div className="flex gap-1.5">{children}</div>
    </div>
  );
}

function ControlPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'focus-ring interactive rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
        active ? 'bg-accent-emerald/15 text-accent-emerald' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

// ── Pace dial (semicircular gauge; calendar pace marked at 1.0×) ──────────────
function PaceDial({ pace, accent }: { pace: number; accent: string }) {
  const size = 220;
  const r = size * 0.4;
  const cx = size / 2;
  const cy = size * 0.62;
  const sw = size * 0.05;
  const lx = cx - r;
  const rx = cx + r;
  const arc = `M ${lx.toFixed(2)},${cy.toFixed(2)} A ${r.toFixed(2)},${r.toFixed(2)} 0 0,1 ${rx.toFixed(2)},${cy.toFixed(2)}`;

  // Map pace [0.6..1.3] → fraction from left (0=slow/young) to right (1=fast/old).
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const frac = clamp((pace - 0.6) / (1.3 - 0.6));
  const pt = (f: number, radius = r) => {
    const a = Math.PI * (1 - f);
    return [cx + radius * Math.cos(a), cy - radius * Math.sin(a)] as const;
  };
  const [mx, my] = pt(frac);
  // "Calendar" pace (1.0×) tick
  const calFrac = clamp((1.0 - 0.6) / (1.3 - 0.6));
  const [c1x, c1y] = pt(calFrac, r - sw * 0.7);
  const [c2x, c2y] = pt(calFrac, r + sw * 0.7);

  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <svg ref={ref} viewBox={`0 0 ${size} ${cy + sw}`} className="w-full" role="img" aria-label={`Pace of aging ${pace.toFixed(2)} times`}>
      <defs>
        <linearGradient id="pace-track" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-emerald)" />
          <stop offset="50%" stopColor="var(--accent-cyan)" />
          <stop offset="100%" stopColor="var(--accent-amber)" />
        </linearGradient>
      </defs>

      {/* Faint spectrum track */}
      <path d={arc} fill="none" stroke="url(#pace-track)" strokeOpacity={0.16} strokeWidth={sw} strokeLinecap="round" />

      {/* Filled arc from left up to the marker */}
      <motion.path
        d={arc}
        fill="none"
        stroke={accent}
        strokeWidth={sw}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: frac } : { pathLength: 0 }}
        transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Calendar-pace tick */}
      <line x1={c1x.toFixed(2)} y1={c1y.toFixed(2)} x2={c2x.toFixed(2)} y2={c2y.toFixed(2)} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
      <text x={pt(calFrac, r + sw * 1.9)[0]} y={pt(calFrac, r + sw * 1.9)[1]} textAnchor="middle" fontSize={size * 0.05} fill="currentColor" fillOpacity={0.4} fontFamily="monospace">1.0×</text>

      {/* Marker dot */}
      <motion.circle
        cx={mx}
        cy={my}
        r={sw * 0.62}
        fill={accent}
        stroke="var(--color-bg-base)"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      />

      {/* End labels */}
      <text x={lx} y={cy + size * 0.075} textAnchor="middle" fontSize={size * 0.048} fill="var(--accent-emerald)" fillOpacity={0.7} fontFamily="monospace">younger</text>
      <text x={rx} y={cy + size * 0.075} textAnchor="middle" fontSize={size * 0.048} fill="var(--accent-amber)" fillOpacity={0.7} fontFamily="monospace">older</text>

      {/* Center readout */}
      <text x={cx} y={cy - r * 0.22} textAnchor="middle" fontSize={size * 0.2} fontWeight={800} fill={accent} fontFamily="monospace">
        {pace.toFixed(2)}×
      </text>
      <text x={cx} y={cy - r * 0.22 + size * 0.075} textAnchor="middle" fontSize={size * 0.05} fill="currentColor" fillOpacity={0.4} fontFamily="monospace">
        bio yrs / calendar yr
      </text>
    </svg>
  );
}

// ── Trajectory chart (chronological · baseline · on-stack + bands) ────────────
function TrajectoryChart({ result, accent }: { result: ReturnType<typeof projectAgingPace>; accent: string }) {
  const { points, horizonYears } = result;
  const W = 520;
  const H = 260;
  const padL = 34;
  const padR = 14;
  const padT = 14;
  const padB = 26;

  const ages = points.flatMap((p) => [p.chronoAge, p.baselineBioAge, p.stackBioAge, p.stackBioAgeOptimistic]);
  const minA = Math.floor(Math.min(...ages)) - 1;
  const maxA = Math.ceil(Math.max(...ages)) + 1;

  const x = (year: number) => padL + (year / horizonYears) * (W - padL - padR);
  const y = (age: number) => padT + ((maxA - age) / (maxA - minA)) * (H - padT - padB);

  const line = (sel: (p: (typeof points)[number]) => number) =>
    points.map((p) => `${x(p.year).toFixed(1)},${y(sel(p)).toFixed(1)}`).join(' ');

  const chrono = line((p) => p.chronoAge);
  const baseline = line((p) => p.baselineBioAge);
  const stack = line((p) => p.stackBioAge);

  // Reclaimed area: between baseline (upper) and on-stack (lower)
  const reclaimArea =
    points.map((p) => `${x(p.year).toFixed(1)},${y(p.baselineBioAge).toFixed(1)}`).join(' ') +
    ' ' +
    [...points].reverse().map((p) => `${x(p.year).toFixed(1)},${y(p.stackBioAge).toFixed(1)}`).join(' ');

  // Confidence band: optimistic (lower) ↔ conservative (upper)
  const band =
    points.map((p) => `${x(p.year).toFixed(1)},${y(p.stackBioAgeConservative).toFixed(1)}`).join(' ') +
    ' ' +
    [...points].reverse().map((p) => `${x(p.year).toFixed(1)},${y(p.stackBioAgeOptimistic).toFixed(1)}`).join(' ');

  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const yTicks = [minA, Math.round((minA + maxA) / 2), maxA];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption">
        <LegendSwatch color="currentColor" dash label="Chronological" muted />
        <LegendSwatch color="var(--accent-amber)" dash label="Without stack" />
        <LegendSwatch color={accent} label="On your stack" />
      </div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Biological age trajectory over time">
        <defs>
          <linearGradient id="reclaim-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={0.28} />
            <stop offset="100%" stopColor={accent} stopOpacity={0.04} />
          </linearGradient>
        </defs>

        {/* Y gridlines + labels */}
        {yTicks.map((age) => (
          <g key={age}>
            <line x1={padL} y1={y(age)} x2={W - padR} y2={y(age)} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
            <text x={padL - 6} y={y(age) + 3} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.4} fontFamily="monospace">
              {age}
            </text>
          </g>
        ))}

        {/* X labels */}
        <text x={padL} y={H - 8} textAnchor="start" fontSize={9} fill="currentColor" fillOpacity={0.4} fontFamily="monospace">now</text>
        <text x={W - padR} y={H - 8} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.4} fontFamily="monospace">+{horizonYears}y</text>

        {/* Reclaimed area */}
        <motion.polygon
          points={reclaimArea}
          fill="url(#reclaim-fill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        />
        {/* Confidence band */}
        <polygon points={band} fill={accent} fillOpacity={0.1} />

        {/* Chronological reference */}
        <polyline points={chrono} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} strokeDasharray="2 3" />
        {/* Baseline (no stack) */}
        <polyline points={baseline} fill="none" stroke="var(--accent-amber)" strokeWidth={1.75} strokeDasharray="5 3" strokeOpacity={0.8} />
        {/* On-stack (animated) */}
        <motion.polyline
          points={stack}
          fill="none"
          stroke={accent}
          strokeWidth={2.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Endpoint dot */}
        <motion.circle
          cx={x(horizonYears)}
          cy={y(points[points.length - 1].stackBioAge)}
          r={4}
          fill={accent}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 1.4 }}
        />
      </svg>
    </div>
  );
}

function LegendSwatch({ color, label, dash, muted }: { color: string; label: string; dash?: boolean; muted?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', muted && 'opacity-70')}>
      <svg width="18" height="6" aria-hidden="true">
        <line x1="0" y1="3" x2="18" y2="3" stroke={color} strokeWidth={2.5} strokeDasharray={dash ? '4 2' : undefined} strokeLinecap="round" />
      </svg>
      <span>{label}</span>
    </span>
  );
}

// ── Per-compound contribution bars ────────────────────────────────────────────
function ContributionBars({ result }: { result: ReturnType<typeof projectAgingPace> }) {
  const max = Math.max(...result.contributions.map((c) => c.paceReductionPct), 0.1);
  return (
    <div className="mt-6">
      <p className="text-label mb-3">What&apos;s driving your reduction</p>
      <div className="space-y-2.5">
        {result.contributions.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3">
            <span className="w-32 shrink-0 truncate text-sm font-medium text-foreground">{c.name}</span>
            <EvidenceTag tier={c.evidence} size="sm" showTooltip={false} />
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-border/40">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-accent-emerald"
                initial={{ width: 0 }}
                whileInView={{ width: `${(c.paceReductionPct / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 * i, ease: 'easeOut' }}
              />
            </div>
            <span className="card-data-value w-12 shrink-0 text-right text-xs font-semibold text-accent-emerald">
              {c.paceReductionPct}%
            </span>
          </div>
        ))}
      </div>
      <p className="text-caption mt-3">
        Bars show each compound&apos;s modeled share of the stack&apos;s pace slowing, after diminishing
        returns and synergy. <ChevronRight className="inline h-3 w-3" aria-hidden="true" /> Higher evidence
        tiers carry more weight.
      </p>
    </div>
  );
}
