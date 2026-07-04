import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Trust & Transparency';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Trust & Transparency',
    subtitle: 'Evidence grading methodology, disclaimer framework, N=1 founder protocol, and full update history',
    accent: '#34d399',
  });
}
