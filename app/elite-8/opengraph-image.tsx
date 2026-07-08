import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Elite 8 Longevity Compounds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Elite 8 Longevity Compounds',
    subtitle: 'Evidence-ranked interventions for mitochondria, NAD+, autophagy, and inflammation — Longevity Quotient scored',
    accent: '#a78bfa',
  });
}
