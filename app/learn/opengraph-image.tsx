import { OgImage } from '@/lib/og-image';

export const alt = 'Learn with TNiC';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Learn before you stack',
    subtitle: 'Getting started · Glossary · Red flags · FAQ · Outcome timelines',
    accent: '#22d3ee',
  });
}