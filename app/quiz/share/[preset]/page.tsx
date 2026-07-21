import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { QuizShareRedirect } from '@/components/quiz/QuizShareRedirect';
import { isPresetKey } from '@/lib/stack-url';
import type { PresetKey } from '@/lib/presets';

// This route only client-redirects a shared preset into the live builder, so it
// must not compete in the index or spend crawl budget — but it should still pass
// link equity onward (follow) when the share URL is linked externally.
export const metadata: Metadata = {
  title: 'Your TNiC Stack',
  robots: { index: false, follow: true },
};

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