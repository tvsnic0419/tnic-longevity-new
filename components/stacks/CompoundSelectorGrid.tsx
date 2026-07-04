'use client';

import { Check } from 'lucide-react';
import { compounds } from '@/lib/data';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { cn } from '@/lib/utils';

interface CompoundSelectorGridProps {
  selected: string[];
  onToggle: (id: string) => void;
  showPathway?: boolean;
  className?: string;
}

const hallmarkColor: Record<string, string> = {
  mito:          'var(--accent-emerald)',
  genomic:       'var(--accent-cyan)',
  epigenetic:    'var(--accent-violet)',
  telomeres:     'var(--accent-amber)',
  proteostasis:  'var(--accent-violet)',
  autophagy:     'var(--accent-cyan)',
  senescence:    'var(--accent-rose)',
  stem:          'var(--accent-violet)',
  communication: 'var(--accent-amber)',
  inflammation:  'var(--accent-rose)',
  dysbiosis:     'var(--accent-emerald)',
  nutrient:      'var(--accent-amber)',
};

const hallmarkShort: Record<string, string> = {
  mito: 'Mito', genomic: 'DNA', epigenetic: 'Epi', telomeres: 'Telo',
  proteostasis: 'Prot', autophagy: 'Auto', senescence: 'Sen',
  stem: 'Stem', communication: 'Sig', inflammation: 'Inflam',
  dysbiosis: 'Micro', nutrient: 'Nutri',
};

const timingColor: Record<string, string> = {
  'AM':         'var(--accent-amber)',
  'PM':         'var(--accent-violet)',
  'AM/PM':      'var(--accent-cyan)',
  'with food':  'var(--accent-emerald)',
};

export function CompoundSelectorGrid({
  selected,
  onToggle,
  showPathway = true,
  className = '',
}: CompoundSelectorGridProps) {
  return (
    <div className={cn('grid sm:grid-cols-2 lg:grid-cols-3 gap-3', className)}>
      {compounds.map((c) => {
        const isOn = selected.includes(c.id);
        const hasSynergy = selected.some((id) => c.synergies?.includes(id));
        const targets = (c.hallmarks ?? []).slice(0, 3);
        const bioavPct = c.bioavailability ?? 0;
        const tColor = timingColor[c.timing] ?? 'var(--accent-cyan)';

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onToggle(c.id)}
            className={cn(
              'focus-ring interactive text-left p-4 rounded-xl transition-all duration-300 relative',
              isOn
                ? 'bg-accent-violet/10 border border-accent-violet/40 shadow-sm'
                : 'glass glass-hover opacity-80 hover:opacity-100',
            )}
          >
            {hasSynergy && !isOn && (
              <span
                className="absolute top-2 right-2 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full"
                style={{
                  color: 'var(--accent-emerald)',
                  background: 'color-mix(in srgb, var(--accent-emerald) 12%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--accent-emerald) 25%, transparent)',
                }}
              >
                SYNERGY
              </span>
            )}

            <div className="flex items-center justify-between mb-2">
              <span
                className={cn(
                  'w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all',
                  isOn ? 'bg-accent-violet text-primary-foreground' : 'border border-border',
                )}
              >
                {isOn && <Check className="w-3 h-3" aria-hidden="true" />}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded"
                  style={{ color: tColor, background: `color-mix(in srgb, ${tColor} 10%, transparent)` }}
                >
                  {c.timing}
                </span>
                <EvidenceTag tier={c.evidence} size="sm" />
              </div>
            </div>

            <h4 className="font-bold text-sm mb-0.5 pr-12">{c.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">{c.dose}</p>

            {/* Bioavailability bar */}
            {bioavPct > 0 && (
              <div className="mb-2.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[8px] font-mono text-muted-foreground/60">Bioav.</span>
                  <span
                    className="text-[8px] font-mono"
                    style={{ color: isOn ? 'var(--accent-violet)' : 'var(--muted-foreground)' }}
                  >
                    {bioavPct}%
                  </span>
                </div>
                <div className="h-0.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${bioavPct}%`,
                      background: isOn
                        ? 'linear-gradient(90deg, var(--accent-violet), var(--accent-cyan))'
                        : 'var(--muted-foreground)',
                      opacity: isOn ? 1 : 0.4,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Hallmark targets */}
            {targets.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {targets.map((h) => (
                  <span
                    key={h}
                    className="text-[8px] font-semibold px-1 py-0.5 rounded"
                    style={{
                      color: hallmarkColor[h] ?? 'var(--accent-cyan)',
                      background: `color-mix(in srgb, ${hallmarkColor[h] ?? 'var(--accent-cyan)'} 10%, transparent)`,
                    }}
                  >
                    {hallmarkShort[h] ?? h}
                  </span>
                ))}
              </div>
            ) : showPathway ? (
              <p className="text-[10px] text-caption mt-1 font-mono">{c.pathway}</p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
