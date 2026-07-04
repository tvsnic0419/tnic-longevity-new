'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, FlaskConical, Flame, Zap, Moon, RotateCcw,
  ShieldCheck, AlertTriangle, TrendingDown, TrendingUp, Minus, CheckCircle2,
} from 'lucide-react';
import {
  computeBioAge,
  type BasicProfile, type MetabolicInputs, type InflammatoryInputs,
  type HormonalMitoInputs, type LifestyleInputs, type BioAgeResult, type Sex,
} from '@/lib/bio-age-engine';

// ── Slider ────────────────────────────────────────────────────────────────

function Slider({
  label, value, onChange, min, max, step = 1, unit = '', lowLabel, highLabel,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; unit?: string;
  lowLabel?: string; highLabel?: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="text-sm font-mono font-semibold text-foreground">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500 bg-border"
      />
      {(lowLabel || highLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{lowLabel}</span>
          <span className="text-[10px] text-muted-foreground">{highLabel}</span>
        </div>
      )}
    </div>
  );
}

function NumberInput({
  label, value, onChange, placeholder, unit, optional = true,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; unit?: string; optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1.5">
        {label} {optional && <span className="text-xs opacity-60">(optional)</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '—'}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
        />
        {unit && <span className="text-xs text-muted-foreground shrink-0 w-10">{unit}</span>}
      </div>
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────

function WizardProgress({ step }: { step: number }) {
  const steps = ['Profile', 'Metabolic', 'Inflammation', 'Lifestyle', 'Results'];
  return (
    <div className="mb-8">
      <div className="flex gap-1 mb-3">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i < step ? 'bg-emerald-500' : i === step ? 'bg-emerald-500/50' : 'bg-border'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {steps.map((s, i) => (
          <span
            key={s}
            className={`text-[10px] font-medium tracking-wide transition-colors ${
              i === step ? 'text-emerald-400' : i < step ? 'text-muted-foreground' : 'text-border'
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Domain score bar ─────────────────────────────────────────────────────

function DomainBar({
  name, score, delta, grade,
}: { name: string; score: number; delta: number; grade: string }) {
  const color =
    grade === 'excellent' ? 'bg-emerald-500'
    : grade === 'good' ? 'bg-cyan-500'
    : grade === 'fair' ? 'bg-amber-500'
    : 'bg-rose-500';

  const DeltaIcon = delta < -0.3 ? TrendingDown : delta > 0.3 ? TrendingUp : Minus;
  const deltaColor = delta < -0.3 ? 'text-emerald-400' : delta > 0.3 ? 'text-rose-400' : 'text-muted-foreground';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <div className={`flex items-center gap-1 text-xs font-mono ${deltaColor}`}>
          <DeltaIcon className="w-3 h-3" />
          {delta > 0 ? '+' : ''}{delta.toFixed(1)} yr
        </div>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground capitalize">{grade}</span>
        <span className="text-[10px] font-mono text-muted-foreground">{score}/100</span>
      </div>
    </div>
  );
}

// ── Age gauge ─────────────────────────────────────────────────────────────

function AgeGauge({ chronological, biological }: { chronological: number; biological: number }) {
  const delta = biological - chronological;
  const isYounger = delta <= 0;
  const color = isYounger ? '#10b981' : delta < 3 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="relative flex items-center justify-center w-48 h-48">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="68" fill="none" stroke="var(--color-border)" strokeWidth="10" />
          <motion.circle
            cx="80" cy="80" r="68" fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 68}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - Math.min(biological, 120) / 120) }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute text-center">
          <motion.p
            className="text-5xl font-black font-mono"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {biological}
          </motion.p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">BIOLOGICAL AGE</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="text-2xl font-bold font-mono text-foreground">{chronological}</p>
          <p className="text-xs text-muted-foreground">Chronological</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold font-mono" style={{ color }}>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)} yr
          </p>
          <p className="text-xs text-muted-foreground">
            {isYounger ? 'Younger' : 'Older'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Steps ────────────────────────────────────────────────────────────────

function StepProfile({
  data, onChange,
}: {
  data: BasicProfile;
  onChange: (d: Partial<BasicProfile>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl font-bold text-foreground mb-1">Your baseline</p>
        <p className="text-sm text-muted-foreground">Used to calibrate your biological age delta.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Chronological Age</label>
          <input
            type="number" min={20} max={90} value={data.chronologicalAge}
            onChange={(e) => onChange({ chronologicalAge: Number(e.target.value) })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Biological Sex</label>
          <select
            value={data.sex}
            onChange={(e) => onChange({ sex: e.target.value as Sex })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer_not">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          label="Weight" value={String(data.weightKg)} unit="kg" placeholder="75" optional={false}
          onChange={(v) => onChange({ weightKg: Number(v) || 70 })}
        />
        <NumberInput
          label="Height" value={String(data.heightCm)} unit="cm" placeholder="175" optional={false}
          onChange={(v) => onChange({ heightCm: Number(v) || 170 })}
        />
      </div>

      {data.weightKg > 0 && data.heightCm > 0 && (
        <div className="rounded-xl bg-background/60 border border-border/50 p-3 text-sm">
          <span className="text-muted-foreground">BMI: </span>
          <span className="font-mono font-semibold text-foreground">
            {(data.weightKg / ((data.heightCm / 100) ** 2)).toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
}

function StepMetabolic({
  data, onChange,
}: {
  data: MetabolicInputs;
  onChange: (d: Partial<MetabolicInputs>) => void;
}) {
  const toStr = (v: number | null) => v === null ? '' : String(v);
  const toNum = (v: string): number | null => v === '' ? null : Number(v);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl font-bold text-foreground mb-1">Metabolic markers</p>
        <p className="text-sm text-muted-foreground">
          Your most recent blood panel. Skip any you don’t have — we’ll estimate from BMI.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput label="Fasting Glucose" value={toStr(data.fastingGlucose)} unit="mg/dL" placeholder="85"
          onChange={(v) => onChange({ fastingGlucose: toNum(v) })} />
        <NumberInput label="HbA1c" value={toStr(data.hba1c)} unit="%" placeholder="5.2"
          onChange={(v) => onChange({ hba1c: toNum(v) })} />
        <NumberInput label="Triglycerides" value={toStr(data.triglycerides)} unit="mg/dL" placeholder="100"
          onChange={(v) => onChange({ triglycerides: toNum(v) })} />
        <NumberInput label="HDL Cholesterol" value={toStr(data.hdl)} unit="mg/dL" placeholder="60"
          onChange={(v) => onChange({ hdl: toNum(v) })} />
        <NumberInput label="LDL Cholesterol" value={toStr(data.ldl)} unit="mg/dL" placeholder="110"
          onChange={(v) => onChange({ ldl: toNum(v) })} />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="checkbox" checked={data.skipped}
          onChange={(e) => onChange({ skipped: e.target.checked })}
          className="w-4 h-4 rounded accent-emerald-500" />
        <span className="text-sm text-muted-foreground">I don’t have lab values — use BMI only</span>
      </label>

      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-xs text-muted-foreground leading-relaxed">
        <strong className="text-emerald-400">Pro tip:</strong> Fasting glucose and HbA1c are the highest-signal metabolic markers for biological age. A basic metabolic panel costs ~$30 at most labs.
      </div>
    </div>
  );
}

function StepInflammatory({
  data, onChange,
}: {
  data: InflammatoryInputs;
  onChange: (d: Partial<InflammatoryInputs>) => void;
}) {
  const toStr = (v: number | null) => v === null ? '' : String(v);
  const toNum = (v: string): number | null => v === '' ? null : Number(v);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl font-bold text-foreground mb-1">Inflammation & lifestyle</p>
        <p className="text-sm text-muted-foreground">
          Chronic inflammation is the #1 accelerant of biological aging.
        </p>
      </div>

      <NumberInput label="hs-CRP" value={toStr(data.hsCRP)} unit="mg/L" placeholder="0.5"
        onChange={(v) => onChange({ hsCRP: toNum(v), skipped: toNum(v) === null })} />

      <Slider
        label="Diet Quality"
        value={data.dietQuality}
        onChange={(v) => onChange({ dietQuality: v })}
        min={0} max={100}
        lowLabel="Ultra-processed"
        highLabel="Whole-food plant-rich"
      />

      <Slider
        label="Gut Health"
        value={data.gutHealth}
        onChange={(v) => onChange({ gutHealth: v })}
        min={0} max={100}
        lowLabel="Chronic issues"
        highLabel="Excellent"
      />

    </div>
  );
}

function StepLifestyle({
  data, onChange, hormonalData, onHormonalChange,
}: {
  data: LifestyleInputs;
  onChange: (d: Partial<LifestyleInputs>) => void;
  hormonalData: HormonalMitoInputs;
  onHormonalChange: (d: Partial<HormonalMitoInputs>) => void;
}) {
  const toStr = (v: number | null) => v === null ? '' : String(v);
  const toNum = (v: string): number | null => v === '' ? null : Number(v);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl font-bold text-foreground mb-1">Lifestyle & vitality</p>
        <p className="text-sm text-muted-foreground">
          Sleep, exercise, stress, and habits — the levers you control every day.
        </p>
      </div>

      <div className="space-y-5">
        <Slider label="Sleep Hours" value={data.sleepHours} onChange={(v) => onChange({ sleepHours: v })}
          min={4} max={10} step={0.5} unit="h" lowLabel="4h" highLabel="10h" />
        <Slider label="Sleep Quality" value={data.sleepQuality} onChange={(v) => onChange({ sleepQuality: v })}
          min={0} max={100} lowLabel="Poor / broken" highLabel="Deep & consistent" />
        <Slider label="Exercise Days / Week" value={data.exerciseDaysPerWeek}
          onChange={(v) => onChange({ exerciseDaysPerWeek: v })} min={0} max={7} unit=" days" />
        <Slider label="Exercise Intensity" value={data.exerciseIntensity}
          onChange={(v) => onChange({ exerciseIntensity: v })} min={0} max={100}
          lowLabel="Light walks" highLabel="High-intensity / resistance" />
        <Slider label="Chronic Stress Load" value={data.stressLoad}
          onChange={(v) => onChange({ stressLoad: v })} min={0} max={100}
          lowLabel="None" highLabel="Severe & persistent" />
        <Slider label="Fasting / Time-Restricted Eating" value={data.fastingPractice}
          onChange={(v) => onChange({ fastingPractice: v })} min={0} max={100}
          lowLabel="Never" highLabel="Daily 16:8+" />
        <Slider label="Smoking & Alcohol Impact" value={data.smokingAlcohol}
          onChange={(v) => onChange({ smokingAlcohol: v })} min={0} max={100}
          lowLabel="None" highLabel="Heavy both" />
      </div>

      <div className="border-t border-border pt-5 space-y-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Hormonal & Mitochondrial</p>
        <NumberInput label="Vitamin D" value={toStr(hormonalData.vitaminD)} unit="ng/mL" placeholder="50"
          onChange={(v) => onHormonalChange({ vitaminD: toNum(v) })} />
        <NumberInput label="Resting Heart Rate" value={toStr(hormonalData.restingHR)} unit="bpm" placeholder="62"
          onChange={(v) => onHormonalChange({ restingHR: toNum(v) })} />
        <Slider label="Energy Level (NAD+ proxy)" value={hormonalData.energyLevel}
          onChange={(v) => onHormonalChange({ energyLevel: v })} min={0} max={100}
          lowLabel="Exhausted" highLabel="High & stable" />
        <Slider label="Hormonal Vitality" value={hormonalData.libidoVitality}
          onChange={(v) => onHormonalChange({ libidoVitality: v })} min={0} max={100}
          lowLabel="Very low" highLabel="Strong" />
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────────────────

function Results({ result, onReset }: { result: BioAgeResult; onReset: () => void }) {
  const priorityIcon =
    result.ageDelta <= 0 ? ShieldCheck
    : result.ageDelta < 3 ? AlertTriangle
    : Flame;

  const PriorityIcon = priorityIcon;

  return (
    <div className="space-y-6">
      <AgeGauge chronological={result.chronologicalAge} biological={result.biologicalAge} />

      <div className={`rounded-xl p-4 border text-center ${
        result.ageDelta <= -2 ? 'bg-emerald-500/10 border-emerald-500/30'
        : result.ageDelta < 3 ? 'bg-amber-500/10 border-amber-500/30'
        : 'bg-rose-500/10 border-rose-500/30'
      }`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <PriorityIcon className={`w-4 h-4 ${
            result.ageDelta <= -2 ? 'text-emerald-400'
            : result.ageDelta < 3 ? 'text-amber-400'
            : 'text-rose-400'
          }`} />
          <span className="text-sm font-semibold text-foreground">{result.headline}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Longevity Score: <span className="font-mono font-bold text-foreground">{result.longevityScore}/100</span>
          &nbsp;·&nbsp;BMI: <span className="font-mono font-bold text-foreground">{result.bmi}</span>
        </p>
      </div>

      {/* Domain breakdown */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Domain breakdown</p>
        <DomainBar {...result.domains.metabolic} />
        <DomainBar {...result.domains.inflammatory} />
        <DomainBar {...result.domains.hormonalMito} />
        <DomainBar {...result.domains.lifestyle} />
      </div>

      {/* Priority insight */}
      {(() => {
        const domainMap: Record<string, typeof result.domains.metabolic> = {
          metabolic: result.domains.metabolic,
          inflammatory: result.domains.inflammatory,
          hormonalMito: result.domains.hormonalMito,
          lifestyle: result.domains.lifestyle,
        };
        const priority = domainMap[result.priorityDomain];
        return priority ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-xs text-rose-400 font-medium uppercase tracking-wide mb-1">
              Highest Impact Fix — {priority.name}
            </p>
            <p className="text-sm text-foreground mb-1">{priority.insight}</p>
            <p className="text-xs text-muted-foreground">{priority.topFix}</p>
          </div>
        ) : null;
      })()}

      {/* Protocol */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">
          Personalized Protocol
        </p>
        <div className="space-y-3">
          {result.protocol.map((entry) => (
            <div key={entry.compound}
              className="flex items-start justify-between gap-3 py-2 border-b border-border/40 last:border-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    entry.priority === 'critical' ? 'bg-rose-400'
                    : entry.priority === 'high' ? 'bg-amber-400'
                    : 'bg-emerald-400'
                  }`} />
                  <span className="text-sm font-semibold text-foreground">{entry.compound}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 pl-3.5">{entry.mechanism}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{entry.domain}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/40">
          This estimate is for educational purposes. Consult a physician before starting any supplement protocol.
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href="/stacks"
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-black py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors"
        >
          Build Your Stack <ArrowRight className="w-4 h-4" />
        </a>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
        >
          <RotateCcw className="w-4 h-4" /> Retake
        </button>
      </div>
    </div>
  );
}

// ── Main wizard ───────────────────────────────────────────────────────────

const STEP_ICONS = [CheckCircle2, FlaskConical, Flame, Moon, Zap];

export function BioAgeWizard() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<BioAgeResult | null>(null);

  const [profile, setProfile] = useState<BasicProfile>({
    chronologicalAge: 38,
    sex: 'male',
    weightKg: 78,
    heightCm: 178,
  });

  const [metabolic, setMetabolic] = useState<MetabolicInputs>({
    fastingGlucose: null, hba1c: null, triglycerides: null, hdl: null, ldl: null, skipped: false,
  });

  const [inflammatory, setInflammatory] = useState<InflammatoryInputs>({
    hsCRP: null, dietQuality: 60, gutHealth: 65, skipped: false,
  });

  const [hormonalMito, setHormonalMito] = useState<HormonalMitoInputs>({
    vitaminD: null, energyLevel: 60, libidoVitality: 60, restingHR: null,
  });

  const [lifestyle, setLifestyle] = useState<LifestyleInputs>({
    sleepHours: 7, sleepQuality: 65, exerciseDaysPerWeek: 3, exerciseIntensity: 55,
    stressLoad: 45, fastingPractice: 20, smokingAlcohol: 10,
  });

  function compute() {
    const res = computeBioAge({ profile, metabolic, inflammatory, hormonalMito, lifestyle });
    setResult(res);
    setStep(4);
  }

  function reset() {
    setResult(null);
    setStep(0);
  }


  return (
    <div className="max-w-2xl mx-auto">
      <WizardProgress step={step} />

      <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-emerald-500/8 to-transparent">
          <div className="flex items-center gap-3">
            {(() => { const Icon = STEP_ICONS[step] ?? CheckCircle2; return <Icon className="w-5 h-5 text-emerald-400" />; })()}
            <div>
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">
                {step < 4 ? `Step ${step + 1} of 4` : 'Your Results'}
              </p>
              <p className="text-lg font-bold text-foreground">
                {step === 0 ? 'Basic Profile'
                  : step === 1 ? 'Metabolic Health'
                  : step === 2 ? 'Inflammation'
                  : step === 3 ? 'Lifestyle & Vitality'
                  : 'Biological Age Report'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && <StepProfile data={profile} onChange={(d) => setProfile((p) => ({ ...p, ...d }))} />}
              {step === 1 && <StepMetabolic data={metabolic} onChange={(d) => setMetabolic((p) => ({ ...p, ...d }))} />}
              {step === 2 && (
                <StepInflammatory data={inflammatory} onChange={(d) => setInflammatory((p) => ({ ...p, ...d }))} />
              )}
              {step === 3 && (
                <StepLifestyle
                  data={lifestyle}
                  onChange={(d) => setLifestyle((p) => ({ ...p, ...d }))}
                  hormonalData={hormonalMito}
                  onHormonalChange={(d) => setHormonalMito((p) => ({ ...p, ...d }))}
                />
              )}
              {step === 4 && result && <Results result={result} onReset={reset} />}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button
                onClick={() => step < 3 ? setStep((s) => s + 1) : compute()}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-black py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors"
              >
                {step < 3 ? 'Continue' : 'Calculate My Biological Age'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
