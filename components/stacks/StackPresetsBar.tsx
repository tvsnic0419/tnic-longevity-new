'use client';

import { Sparkles } from 'lucide-react';
import { stackPresets, type PresetKey } from '@/lib/presets';
import { compounds } from '@/lib/data';
import { cn } from '@/lib/utils';

interface StackPresetsBarProps {
  selected: string[];
  onApply: (key: PresetKey) => void;
  className?: string;
}

const presetAccent: Record<PresetKey, string> = {
  starter:   'var(--accent-cyan)',
  nrf2:      'var(--accent-emerald)',
  mito:      'var(--accent-amber)',
  hybrid:    'var(--accent-violet)',
  longevity: 'var(--accent-rose)',
  metabolic: 'var(--accent-cyan)',
  full:      'var(--accent-violet)',
};

export function StackPresetsBar({ selected, onApply, className = '' }: StackPresetsBarProps) {
  const presetKeys = Object.keys(stackPresets) as PresetKey[];

  return (
    <div className={className}>
      <p className="text-label text-accent-violet mb-3 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        Evidence-graded presets
      </p>
      <div className="flex flex-wrap gap-2">
        {presetKeys.map((key) => {
          const p = stackPresets[key];
          const accent = presetAccent[key];
          const isActive =
            p.ids.length === selected.length && p.ids.every((id) => selected.includes(id));
          const hallmarkCount = new Set(
            p.ids.flatMap((id) => compounds.find((c) => c.id === id)?.hallmarks ?? [])
          ).size;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onApply(key)}
              className={cn(
                'focus-ring interactive px-4 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group',
                isActive
                  ? 'text-primary-foreground'
                  : 'glass text-muted-foreground hover:text-foreground',
              )}
              style={
                isActive
                  ? { background: `color-mix(in srgb, ${accent} 85%, transparent)`, borderColor: accent }
                  : { ['--hover-border' as string]: accent }
              }
            >
              <span className="block group-hover:text-foreground transition-colors"
                style={isActive ? {} : {}}>
                {p.label}
              </span>
              <span
                className={cn(
                  'block text-[10px] font-normal',
                  isActive ? 'text-primary-foreground/70' : 'text-caption',
                )}
              >
                {p.desc}
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[9px] font-mono font-bold px-1 py-0.5 rounded"
                  style={
                    isActive
                      ? { color: 'black', background: 'rgba(0,0,0,0.2)' }
                      : { color: accent, background: `color-mix(in srgb, ${accent} 12%, transparent)` }
                  }
                >
                  {p.ids.length} cpd
                </span>
                {hallmarkCount > 0 && (
                  <span
                    className="text-[9px] font-mono px-1 py-0.5 rounded"
                    style={
                      isActive
                        ? { color: 'black', background: 'rgba(0,0,0,0.15)' }
                        : { color: 'var(--muted-foreground)' }
                    }
                  >
                    {hallmarkCount}H
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}