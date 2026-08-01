import { OgImage } from '@/lib/og-image';

export const alt = 'The Nico Starter Questionnaire';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'The Nico Starter Questionnaire',
    subtitle: 'Goal, concern, budget & safety → your personalized stack',
    accent: '#34d399',
  });
}