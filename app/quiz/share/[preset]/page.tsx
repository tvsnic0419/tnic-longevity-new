import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { QuizShareRedirect } from '@/components/quiz/QuizShareRedirect';
import { isPresetKey } from '@/lib/stack-url';
import type { PresetKey } from '@/lib/presets';

export default async function QuizSharePage({
  params,
}: {
  params: Promise<{ preset: string }>;
}) {
  const { preset } = await params;
  if (!isPresetKey(preset)) notFound();

  return (
    <Suspense fallback={<div className="container-page py-24 text-muted-foreground">Loading…</div>}>
      <QuizShareRedirect preset={preset as PresetKey} />
    </Suspense>
  );
}