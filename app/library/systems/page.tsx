import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SystemsPage } from '@/components/library/SystemsPage';

export const metadata: Metadata = {
  // Absolute title so the `%s | TNiC` template doesn't double the brand.
  title: { absolute: 'Systems Synthesis | Hallmarks of Aging — TNiC' },
  description:
    'Explore the cross-hallmark effects, cascade propagation, shared molecular pathways, and emergent synergies across the 12 Hallmarks of Aging. Evidence-graded systems map.',
  // Self-canonical (was inheriting the homepage root canonical).
  alternates: { canonical: '/library/systems' },
  openGraph: {
    title: 'Hallmark Systems Map — TNiC',
    description: 'How do the 12 Hallmarks of Aging interact? Explore leverage scores, cascade effects, and emergent compound synergies.',
  },
};

export default function SystemsRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen canvas-scrim" aria-busy="true" />}>
      <SystemsPage />
    </Suspense>
  );
}
