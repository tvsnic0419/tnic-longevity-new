'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Enhanced dynamic loader with multiple fallback layers
const HallmarkContent = dynamic(
  async () => {
    const paths = [
      '@/components/library/HallmarkContent',
      '@/components/library/HallmarkRenderer',
      '@/components/HallmarkContent',
      './HallmarkContent',
    ];
    
    for (const path of paths) {
      try {
        const mod = await import(path);
        if (mod.default || mod.HallmarkContent || mod.HallmarkRenderer) {
          return { default: mod.default || mod.HallmarkContent || mod.HallmarkRenderer };
        }
      } catch (e) {
        continue;
      }
    }
    
    // Final fallback
    return { default: () => <div className="container-page py-12">Hallmark content temporarily unavailable. Please refresh.</div> };
  },
  { ssr: false, loading: () => <div className="container-page py-12 text-[var(--color-text-muted)]">Loading deep-dive...</div> }
);

export default function HallmarkPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="container-page py-12">Loading...</div>}>
        <HallmarkContent slug={params.slug} />
      </Suspense>
    </div>
  );
}
