import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Your Anti-Aging Operating System';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Your longevity OS',
    subtitle: 'Stacks · Labs · Library · Six interactive tools — free, cited, local-first',
  });
}