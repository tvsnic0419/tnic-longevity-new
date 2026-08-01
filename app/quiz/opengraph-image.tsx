import { OgImage } from '@/lib/og-image';

export const alt = 'Nico Starter Questionnaire';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Nico Starter Questionnaire',
    subtitle: 'Goal, concern, budget & safety → your personalized stack',
    accent: '#34d399',
  });
}