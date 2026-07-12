'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CompoundContent = dynamic(
  async () => {
    const paths = [
      '@/components/library/CompoundContent',
      '@/components/library/CompoundRenderer',
      '@/components/CompoundContent',
      './CompoundContent',
    ];
    
    for (const path of paths) {
      try {
        const mod = await import(path);
        if (mod.default || mod.CompoundContent || mod.CompoundRenderer) {
          return { default: mod.default || mod.CompoundContent || mod.CompoundRenderer };
        }
      } catch (e) {
        continue;
      }
    }
    
    return { default: () => <div className="container-page py-10">Compound content temporarily unavailable.</div> };
  },
  { ssr: false, loading: () => <div className="container-page py-10 text-[var(--color-text-muted)]">Loading deep-dive...</div> }
);

export default function CompoundPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="container-page py-10">Loading...</div>}>
        <CompoundContent id={params.id} />
      </Suspense>
    </div>
  );
}
