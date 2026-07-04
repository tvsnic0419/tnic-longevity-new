import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Bioavailability & Delivery Systems';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Bioavailability & Delivery Systems',
    subtitle: 'Liposomal, sublingual, enteric-coated, micronized — which delivery form actually increases absorption and why',
    accent: '#f59e0b',
  });
}
