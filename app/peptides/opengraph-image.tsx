import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC Anti-Aging Peptides';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Anti-Aging Peptides',
    subtitle: 'BPC-157 · GHK-Cu · Epithalon · Thymosin Alpha-1 — evidence & legal status graded',
    accent: '#fb7185',
  });
}
