'use client';

import { ContextRail } from '@/components/ui/ContextRail';
import { getModuleContext } from '@/lib/hub-context';
import type { LibraryModule } from '@/lib/library-modules';
import { libraryCategoryMeta } from '@/lib/library-modules';

const categoryTheme = {
  compounds: 'cyan',
  synergies: 'violet',
  lifestyle: 'amber',
  guides: 'emerald',
} as const;

interface ModuleContextStripProps {
  module: LibraryModule;
}

export function ModuleContextStrip({ module }: ModuleContextStripProps) {
  const ctx = getModuleContext(module);
  const theme = categoryTheme[module.category];
  const meta = libraryCategoryMeta[module.category];

  return (
    <div className="mb-8">
      <p className="text-label text-muted-foreground mb-3">
        {meta.label} · Tier {module.evidenceTier}
      </p>
      <ContextRail what={ctx.what} why={ctx.why} next={ctx.next} theme={theme} />
    </div>
  );
}