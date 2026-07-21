'use client';

import { useState } from 'react';
import { ShieldAlert, ChevronDown, Pill } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { medicationClasses, checkMedicationFlags } from '@/lib/medication-classes';
import { compounds } from '@/lib/data';
import { cn } from '@/lib/utils';

interface MedicationCheckPanelProps {
  selectedIds: string[];
  className?: string;
}

const compoundName = (id: string) => compounds.find((c) => c.id === id)?.name ?? id;

/**
 * Self-report medication classes and cross-check them against the current
 * stack. Every match surfaces a verbatim quote from the compound's own
 * published safety note — this never diagnoses or infers an interaction
 * that isn't already documented, it just makes existing text personally
 * relevant instead of requiring the user to read every module.
 */
export function MedicationCheckPanel({ selectedIds, className = '' }: MedicationCheckPanelProps) {
  const { profile, setProfile } = usePlatform();
  const [open, setOpen] = useState(profile.medications.length > 0);

  const toggleMedication = (id: string) => {
    const next = profile.medications.includes(id)
      ? profile.medications.filter((m) => m !== id)
      : [...profile.medications, id];
    setProfile({ medications: next });
  };

  const matches = checkMedicationFlags(selectedIds, profile.medications);

  return (
    <div className={cn('glass rounded-2xl p-5', matches.length > 0 && 'border border-accent-rose/30', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="focus-ring interactive flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <span className="text-label text-accent-rose flex items-center gap-2">
          <Pill className="w-3.5 h-3.5" aria-hidden="true" />
          Check your medications
        </span>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {!open && matches.length > 0 && (
        <p className="text-xs text-accent-rose mt-2">
          {matches.length} flag{matches.length > 1 ? 's' : ''} on your selected medications — expand to review.
        </p>
      )}

      {open && (
        <div className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Select any medication classes you currently take. This checks them against the safety notes already
            published for each compound in your stack — it does not diagnose or guarantee safety.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {medicationClasses.map((m) => {
              const active = profile.medications.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMedication(m.id)}
                  aria-pressed={active}
                  title={m.examples || undefined}
                  className={cn(
                    'focus-ring text-xs font-medium px-2.5 py-1 rounded-full border transition',
                    active
                      ? 'bg-accent-rose/15 text-accent-rose border-accent-rose/40'
                      : 'text-muted-foreground border-border hover:border-accent-rose/30 hover:text-foreground',
                  )}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {profile.medications.length > 0 && selectedIds.length > 0 && (
            <div>
              {matches.length > 0 ? (
                <div className="space-y-2">
                  {matches.map((m) => (
                    <div key={`${m.compoundId}-${m.medicationClassId}`} className="flex gap-2 text-xs rounded-lg bg-accent-rose/5 border border-accent-rose/20 p-3">
                      <ShieldAlert className="w-3.5 h-3.5 text-accent-rose shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-accent-rose">
                          {compoundName(m.compoundId)} + {m.medicationLabel}
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          Published note: &ldquo;{m.note}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-muted-foreground pt-1">
                    Not medical advice. Bring this list to a pharmacist or physician before combining with the
                    medications above.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No published flags for your selected medications against the compounds currently in your stack —
                  that reflects what TNiC has documented, not a guarantee of safety.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
