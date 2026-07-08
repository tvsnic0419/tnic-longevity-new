import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Verified Longevity Products';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Verified Longevity Products',
    subtitle: 'COA-verified, third-party tested supplements — matched to your TNiC stack and hallmark priorities',
    accent: '#22d3ee',
  });
}
