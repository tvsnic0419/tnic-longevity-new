'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Attempt to restore dynamic rendering pattern
const HallmarkContent = dynamic(() => import('@/components/library/HallmarkContent').then(mod => ({ default: mod.default || mod.HallmarkContent })), { ssr: false });

export default function HallmarkPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="container-page py-12 text-[var(--color-text-muted)]">Loading hallmark deep-dive...</div>}>
        <HallmarkContent slug={slug} />
      </Suspense>
    </div>
  );
}
