import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC Molecular Pathways';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Molecular pathways',
    subtitle: 'AMPK · NRF2 · Sirtuins · mTOR · Mitochondria · Senescence',
    accent: '#c084fc',
  });
}
