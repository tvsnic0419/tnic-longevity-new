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
  };
}
