import type { Metadata } from 'next';
import { SystemsPage } from '@/components/library/SystemsPage';

export const metadata: Metadata = {
  title: 'Systems Synthesis | Hallmarks of Aging — TNiC',
  description:
    'Explore the cross-hallmark effects, cascade propagation, shared molecular pathways, and emergent synergies across the 12 Hallmarks of Aging. Evidence-graded systems map.',
  openGraph: {
    title: 'Hallmark Systems Map — TNiC',
    description: 'How do the 12 Hallmarks of Aging interact? Explore leverage scores, cascade effects, and emergent compound synergies.',
  },
};

export default function SystemsRoute() {
  return <SystemsPage />;
}
