import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC — Compound Intelligence Engine';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Compound Intelligence Engine',
    subtitle: 'Score longevity compounds and stacks on evidence, effect, breadth, bioavailability and safety — hallmark coverage mapped, rule-based',
    accent: '#34d399',
  });
}
