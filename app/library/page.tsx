'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports — each is a client island; keep the route lean.
const LibraryModulesHub = dynamic(() => import('@/components/library/LibraryModulesHub').then((m) => ({ default: m.LibraryModulesHub })), { ssr: false });
const LifestylePillarsHub = dynamic(() => import('@/components/library/LifestylePillarsHub').then((m) => ({ default: m.LifestylePillarsHub })), { ssr: false });
const LibrarySearch = dynamic(() => import('@/components/library/LibrarySearch').then((m) => ({ default: m.LibrarySearch })), { ssr: false });
const ToolsPromoStrip = dynamic(() => import('@/components/tools/ToolsPromoStrip').then((m) => ({ default: m.ToolsPromoStrip })), { ssr: false });
const RecommendedNextSteps = dynamic(() => import('@/components/ui/RecommendedNextSteps').then((m) => ({ default: m.RecommendedNextSteps })), { ssr: false });

export default function LibraryPage() {
  return (
    <>
      {/* Lead with the interventions — the compound library is what "Library"
          should open to. A prominent "12 Hallmarks of Aging" link sits in the
          hub header (next to Evidence comparisons); the full hallmark theory
          now lives on its own interlinked page at /library/hallmarks. */}
      <LibraryModulesHub asPageTitle />

      {/* Search across the whole library — hallmarks, compounds, comparisons */}
      <Suspense fallback={<div className="h-12 animate-pulse bg-foreground/5" />}>
        <LibrarySearch />
      </Suspense>

      <LifestylePillarsHub />

      <div className="container-page py-8">
        <ToolsPromoStrip headline="Simulate stacks, build protocols, and project healthspan from library modules" />
      </div>

      <div className="container-page pb-12">
        <RecommendedNextSteps context="library" />
      </div>
    </>
  );
}
