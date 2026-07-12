'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CompoundContent = dynamic(() => import('@/components/library/CompoundContent').catch(() => import('./CompoundFallback')), {
  ssr: false,
  loading: () => <div className="container-page py-10">Loading deep-dive...</div>
});

export default function CompoundPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="container-page py-10">Loading...</div>}>
        <CompoundContent id={params.id} />
      </Suspense>
    </div>
  );
}
