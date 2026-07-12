'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Clean restoration attempt
const HallmarkContent = dynamic(() => import('@/components/library/HallmarkContent').catch(() => import('./HallmarkFallback')), {
  ssr: false,
  loading: () => <div className="container-page py-12">Loading deep-dive...</div>
});

export default function HallmarkPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="container-page py-12">Loading...</div>}>
        <HallmarkContent slug={params.slug} />
      </Suspense>
    </div>
  );
}
