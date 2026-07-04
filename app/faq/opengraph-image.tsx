import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC FAQ';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: '12 honest FAQ answers',
    subtitle: 'Safety · Evidence tiers · Protocols · How TNiC differs from supplement stores',
    accent: '#a78bfa',
  });
}