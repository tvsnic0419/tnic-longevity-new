import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Longevity Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Longevity Tools',
    subtitle: 'Stack synergy, defense scan, biomarker trends, and more — free and local-first',
    accent: '#f59e0b',
  });
}
