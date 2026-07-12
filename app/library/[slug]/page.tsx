'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Sophisticated dynamic loader - attempts to restore original behavior
// Falls back gracefully if the expected component structure has changed
const HallmarkRenderer = dynamic(
  () => import('@/components/library/HallmarkRenderer')
    .then(mod => ({ default: mod.HallmarkRenderer || mod.default }))
    .catch(() => import('@/components/library/HallmarkContent')
      .then(mod => ({ default: mod.HallmarkContent || mod.default }))
      .catch(() => import('./HallmarkFallback'))
    ),
  { 
    ssr: false,
    loading: () => <div className="container-page py-12 text-[var(--color-text-muted)]">Loading hallmark deep-dive...</div> 
  }
);

export default function HallmarkPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="container-page py-12 text-[var(--color-text-muted)]">Loading...</div>}>
        <HallmarkRenderer slug={slug} />
      </Suspense>
    </div>
  );
}
