import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Longevity Stacks & Protocols';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Longevity Stacks & Protocols',
    subtitle: 'Evidence-graded supplement stacks built on the 12 Hallmarks of Aging',
    accent: '#a78bfa',
  });
}
