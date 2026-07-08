import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC Anti-Aging Library';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Anti-Aging Library',
    subtitle: '12 hallmarks · Compounds · Synergies · Lifestyle protocols — evidence-graded',
    accent: '#fbbf24',
  });
}