import type { Metadata } from 'next';
import { TopPicksHub } from '@/components/library/TopPicksHub';

export const metadata: Metadata = {
  title: 'Top TNiC Picks — Sirtuin, PARP & NRF2 | Anti-Aging Library',
  description:
    'TNiC\'s highest-conviction compound picks for three overlapping longevity pathways: sirtuin (SIRT1-7) activation, PARP-mediated DNA repair, and NRF2 antioxidant signaling — with the mechanistic reason each pick made the list.',
  openGraph: {
    title: 'Top TNiC Picks by Pathway — Sirtuin, PARP, NRF2',
    description: 'Evidence-graded top picks for sirtuin activation, PARP/DNA-repair support, and NRF2 antioxidant signaling.',
  },
};

export default function TopPicksRoute() {
  return <TopPicksHub />;
}
