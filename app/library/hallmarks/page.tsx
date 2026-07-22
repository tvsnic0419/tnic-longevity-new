import type { Metadata } from 'next';
import { HallmarksExplorer } from '@/components/library/HallmarksExplorer';

export const metadata: Metadata = {
  title: 'The 12 Hallmarks of Aging | TNiC',
  description:
    'Each of the 12 Hallmarks of Aging explained with mechanistic visuals, evidence-ranked interventions, PubMed citations, and personal notes. Select a hallmark to explore its deep-dive.',
  openGraph: {
    title: 'The 12 Hallmarks of Aging — TNiC',
    description:
      'Interactive explorer for the 12 Hallmarks of Aging — visuals, evidence-ranked interventions, and the compounds that target each one.',
  },
};

export default function HallmarksRoute() {
  return <HallmarksExplorer />;
}
