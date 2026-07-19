import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Evidence-Graded Longevity Compounds & Protocols';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'The 12 Hallmarks of Aging',
    subtitle: 'Evidence-graded compounds, protocols, and biomarker tracking — free, cited, local-first',
  });
}