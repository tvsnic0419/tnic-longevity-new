'use client';

import { MoleculeStage } from '@/components/viz/MoleculeStage';
import { TiltGlassPanel } from '@/components/ui/TiltGlassPanel';
import { hasGeometry, getGeometry } from '@/components/viz/molecule';
import { signatureHue } from '@/components/viz/tokens';

/**
 * A compact molecule-stage panel for the standalone SEO compound-guide pages
 * (berberine, glynac, nad, spermidine, sulforaphane, taurine), which previously
 * had a rich top hero but zero illustration anywhere in the body. Reuses the
 * exact stage/caption pattern already established in ModuleHero/CompoundHero:
 * real ball-and-stick geometry when authored (`hasGeometry`), otherwise the
 * honest abstract "orbital field" fallback — never fabricated structure.
 */
export function GuideMoleculeWell({ compoundId, className }: { compoundId: string; className?: string }) {
  const structured = hasGeometry(compoundId);
  const geom = structured ? getGeometry(compoundId) : null;

  return (
    <TiltGlassPanel
      depth="content"
      className={`mx-auto flex w-full max-w-sm flex-col gap-2.5 overflow-hidden rounded-3xl p-5 ${className ?? ''}`}
    >
      <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--color-border-subtle)]" style={{ aspectRatio: '16 / 11' }}>
        <MoleculeStage geometryId={structured ? compoundId : undefined} hue={signatureHue(compoundId)} />
      </div>
      <p className="text-center font-mono text-micro leading-relaxed text-muted-foreground">
        {structured
          ? `Rendered structure${geom?.label ? ` · ${geom.label}` : ''} · stylized for legibility, not a crystallographic reproduction.`
          : 'Illustrative orbital motif — not the literal molecular structure.'}
      </p>
    </TiltGlassPanel>
  );
}
