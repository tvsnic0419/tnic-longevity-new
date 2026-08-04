import { OgImage } from '@/lib/og-image';

export const alt = 'Explore TNiC — Transformative Nutrition in Cell-Health';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Transformative Nutrition in Cell-Health',
    subtitle: 'Evidence-graded nutrients & compounds for the 12 hallmarks of aging — free, PMID-cited, local-first',
  });
}
