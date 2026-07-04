import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Lab Analysis Hub';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Lab Analysis Hub',
    subtitle: 'Interpret biomarkers, track longevity panels, optimize your labs — locally',
    accent: '#34d399',
  });
}
