'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CompoundContent = dynamic(() => import('@/components/library/CompoundContent').then(mod => ({ default: mod.default || mod.CompoundContent })), { ssr: false });

export default function CompoundPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="container-page py-10 text-[var(--color-text-muted)]">Loading compound deep-dive...</div>}>
        <CompoundContent id={id} />
      </Suspense>
    </div>
  );
}
