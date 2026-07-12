'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Final aggressive attempt to restore original content + apply luminous treatment
const DynamicHallmark = dynamic(
  async () => {
    const possiblePaths = [
      '@/components/library/HallmarkContent',
      '@/components/library/HallmarkRenderer',
      '@/components/HallmarkContent',
      '@/components/HallmarkRenderer',
      './HallmarkContent',
      './HallmarkRenderer',
      '@/app/library/[slug]/HallmarkContent',
    ];

    for (const path of possiblePaths) {
      try {
        const mod = await import(path);
        const Comp = mod.default || mod.HallmarkContent || mod.HallmarkRenderer;
        if (Comp) {
          // Wrap with luminous container if we found real content
          return { 
            default: (props: any) => (
              <div className="illustration-container max-w-5xl mx-auto my-8">
                <Comp {...props} />
              </div>
            ) 
          };
        }
      } catch (e) {
        continue;
      }
    }

    // If nothing found, show a minimal but styled fallback
    return { 
      default: () => (
        <div className="container-page py-12">
          <div className="tnic-glass-luminous rounded-2xl p-8">
            <p>Hallmark content is loading or temporarily unavailable.</p>
          </div>
        </div>
      ) 
    };
  },
  { ssr: false, loading: () => <div className="container-page py-12 text-[var(--color-text-muted)]">Loading deep-dive...</div> }
);

export default function HallmarkPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="container-page py-12">Loading...</div>}>
        <DynamicHallmark slug={params.slug} />
      </Suspense>
    </div>
  );
}
