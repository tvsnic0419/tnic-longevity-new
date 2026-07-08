'use client';

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
}

export function Slider({ label, value, onChange, min, max, step = 1, unit = '', hint }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="font-mono text-sm text-foreground tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full age-slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      {hint && <p className="text-caption text-caption mt-1">{hint}</p>}
    </div>
  );
}