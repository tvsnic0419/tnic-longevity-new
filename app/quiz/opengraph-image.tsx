import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC Starter Questionnaire';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'The NICO Starter Questionnaire',
    subtitle: '9 questions → personalized stack · evidence-graded entry point',
    accent: '#34d399',
  });
}