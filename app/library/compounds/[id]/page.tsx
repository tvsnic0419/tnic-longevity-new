'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicCompound = dynamic(
  async () => {
    const possiblePaths = [
      '@/components/library/CompoundContent',
      '@/components/library/CompoundRenderer',
      '@/components/CompoundContent',
      '@/components/CompoundRenderer',
      './CompoundContent',
      './CompoundRenderer',
    ];

    for (const path of possiblePaths) {
      try {
        const mod = await import(path);
        const Comp = mod.default || mod.CompoundContent || mod.CompoundRenderer;
        if (Comp) {
          return { 
            default: (props: any) => (
              <div className="tnic-glass-luminous rounded-2xl p-8 my-8">
                <Comp {...props} />
              </div>
            ) 
          };
        }
      } catch (e) {
        continue;
      }
    }

    return { 
      default: () => (
        <div className="container-page py-10">
          <div className="tnic-glass-luminous rounded-2xl p-8">
            <p>Compound deep-dive content is loading or temporarily unavailable.</p>
          </div>
        </div>
      ) 
    };
  },
  { ssr: false, loading: () => <div className="container-page py-10 text-[var(--color-text-muted)]">Loading deep-dive...</div> }
);

export default function CompoundPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="container-page py-10">Loading...</div>}>
        <DynamicCompound id={params.id} />
      </Suspense>
    </div>
  );
}
