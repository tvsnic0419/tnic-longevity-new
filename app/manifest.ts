import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description:
      'Evidence-based longevity education — hallmarks library, stacks, labs, and interactive tools.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#030712',
    lang: 'en',
    categories: ['health', 'education', 'productivity'],
    // The manifest carried no icons, so an installed instance fell back to a
    // screenshot of the page. `any` and `maskable` are listed separately on
    // purpose: a maskable icon is cropped to the launcher's own shape, so it
    // needs its own, more generously inset artwork rather than a purpose list
    // that would let a launcher crop the standard icon's mark.
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
