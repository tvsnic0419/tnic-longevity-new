import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Cross-Hallmark Systems Map';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Cross-Hallmark Systems Map',
    subtitle: 'How the 12 hallmarks of aging interact — upstream drivers, downstream cascades, and intervention leverage points',
    accent: '#22d3ee',
  });
}
