import { OgImage } from '@/lib/og-image';

export const alt = 'TNiC Protocol Brief';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Protocol Brief',
    subtitle: 'PMID-curated research drops · library-linked takeaways',
    accent: '#a78bfa',
  });
}