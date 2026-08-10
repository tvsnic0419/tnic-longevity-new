'use client';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  hint?: string;
}

export function Select({ label, value, onChange, options, hint }: SelectProps) {
  return (
    <div>
      <label className="text-sm text-muted-foreground block mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base w-full appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[var(--color-bg-elevated)]">
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-caption mt-1">{hint}</p>}
    </div>
  );
}