import { ContextRail } from '@/components/ui/ContextRail';
import { getPeptideContext } from '@/lib/hub-context';
import type { Peptide } from '@/lib/types';

/**
 * Mirrors components/library/ModuleContextStrip.tsx — the same "what /
 * why / next" pattern every compound and hallmark detail page gets.
 * 'compact' variant: this is a reference page the reader came to read,
 * not a tool being onboarded into.
 */
export function PeptideContextStrip({ peptide }: { peptide: Peptide }) {
  const ctx = getPeptideContext(peptide);

  return (
    <div className="mb-8">
      <ContextRail what={ctx.what} why={ctx.why} next={ctx.next} theme="rose" variant="compact" />
    </div>
  );
}
