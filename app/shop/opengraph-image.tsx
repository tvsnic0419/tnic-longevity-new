import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC Protocol Shop';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Protocol Shop',
    subtitle: 'Stack-filtered buyer verification · COA checklists · zero inventory conflict',
    accent: '#fbbf24',
  });
}