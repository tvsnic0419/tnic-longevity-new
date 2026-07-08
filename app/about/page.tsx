import { buildPageMetadata } from '@/lib/seo';
import { AboutSection } from '@/components/sections/AboutSection';

export const metadata = buildPageMetadata({
  title: 'About — Tommy Nichols & TNiC',
  description:
    'TNiC was built by Tommy Nichols to be the longevity platform he wished existed — evidence-graded compounds, PubMed-cited, independent, and free of supplement industry conflicts.',
  path: '/about',
  keywords: ['about TNiC', 'Tommy Nichols longevity', 'longevity platform founder', 'independent supplement research'],
});

export default function AboutPage() {
  return (
    <div className="container-page py-8 md:py-12 max-w-4xl">
      <AboutSection />
    </div>
  );
}
