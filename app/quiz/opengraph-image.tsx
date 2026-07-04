import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC 3-Min Starter Quiz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: '3-Min Starter Quiz',
    subtitle: '3 questions → personalized stack · evidence-graded entry point',
    accent: '#34d399',
  });
}