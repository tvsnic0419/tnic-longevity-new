'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { PresetKey } from '@/lib/presets';
import { stackPresets } from '@/lib/presets';

export function QuizShareRedirect({ preset }: { preset: PresetKey }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stack = stackPresets[preset];

  useEffect(() => {
    const qs = new URLSearchParams();
    qs.set('preset', preset);
    for (const key of ['goal', 'age', 'experience'] as const) {
      const val = searchParams.get(key);
      if (val) qs.set(key, val);
    }
    router.replace(`/quiz?${qs.toString()}`);
  }, [preset, router, searchParams]);

  return (
    <div className="container-page py-24 text-center">
      <p className="text-label text-accent-emerald mb-2">Quiz result</p>
      <h1 className="heading-section text-2xl mb-2">{stack.label} Stack</h1>
      <p className="text-body-sm text-muted-foreground">Opening your personalized quiz result…</p>
    </div>
  );
}