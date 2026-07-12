'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CompoundRenderer = dynamic(
  () => import('@/components/library/CompoundRenderer')
    .then(mod => ({ default: mod.CompoundRenderer || mod.default }))
    .catch(() => import('@/components/library/CompoundContent')
      .then(mod => ({ default: mod.CompoundContent || mod.default }))
      .catch(() => import('./CompoundFallback'))
    ),
  { 
    ssr: false,
    loading: () => <div className="container-page py-10 text-[var(--color-text-muted)]">Loading compound deep-dive...</div> 
  }
);

export default function CompoundPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="container-page py-10 text-[var(--color-text-muted)]">Loading...</div>}>
        <CompoundRenderer id={id} />
      </Suspense>
    </div>
  );
}
