'use client';

import { toast } from 'sonner';
import { EXPORT_KIT_EVENT } from './os-events';
import { usePlatform } from '@/context/PlatformContext';
import { analyzeStack } from '@/lib/stack-analysis';
import { HallmarkCoverageRing } from './HallmarkCoverageRing';
import { Download, RotateCcw } from 'lucide-react';

/**
 * The persisted-stack cluster of the ContextBar — coverage ring, stack label,
 * Reset, Export. Split out of ContextBar (which renders on every page through
 * the layouts) because `analyzeStack` pulls the full compound data layer in;
 * this only renders for visitors who actually have a stack, so ContextBar
 * loads it on demand instead of shipping it site-wide.
 */
export function ContextBarStackReadout() {
  const { selected, setSelected, selectedCompounds } = usePlatform();
  const analysis = analyzeStack(selected);

  // Persisted stacks follow the visitor across every hub page. If that state is
  // stale or unexpected, one click returns the OS to a clean 0/12 slate — with
  // an Undo so nothing is lost by accident.
  const resetStack = () => {
    if (selected.length === 0) return;
    const previous = selected;
    setSelected([]);
    toast('Stack reset', {
      description: 'Your OS is back to a clean slate.',
      action: { label: 'Undo', onClick: () => setSelected(previous) },
    });
  };

  const stackLabel =
    selectedCompounds.length > 0
      ? selectedCompounds.map((c) => c.name.split(' ')[0]).join(' + ')
      : 'No stack';

  return (
    <>
      <HallmarkCoverageRing covered={analysis.hallmarkCount} />
      <span className="hidden md:inline truncate font-medium text-[var(--color-text-secondary)] max-w-[200px] lg:max-w-xs">
        {stackLabel}
      </span>
      <button
        type="button"
        onClick={resetStack}
        className="focus-ring interactive inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-caption font-semibold text-muted-foreground hover:text-accent-rose hover:border-accent-rose/30 shrink-0"
        aria-label="Reset stack to a clean slate"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Reset</span>
      </button>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(EXPORT_KIT_EVENT))}
        className="focus-ring interactive hidden sm:inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-caption font-semibold text-muted-foreground hover:text-accent-cyan hover:border-accent-cyan/30 shrink-0"
        aria-label="Open export kit"
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        Export
      </button>
    </>
  );
}
