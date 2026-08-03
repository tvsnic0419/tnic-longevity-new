import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Pathway Architect';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Pathway Architect',
    subtitle: 'Build a protocol and watch synergy, cautions, and hallmark coverage update live',
    accent: '#fbbf24',
  });
}
