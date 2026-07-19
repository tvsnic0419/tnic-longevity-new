import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC Mechanism Atlas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'The Mechanism Atlas',
    subtitle: '12 hallmarks · 6 pathways · every compound & peptide lever, wired together',
    accent: '#22d3ee',
  });
}
