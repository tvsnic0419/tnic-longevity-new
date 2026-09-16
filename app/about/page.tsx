import { buildPageMetadata } from '@/lib/seo';
import { AboutSection } from '@/components/sections/AboutSection';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';

export const metadata = buildPageMetadata({
  title: 'About — Tommy Nichols & TNiC',
  description:
    'TNiC was built by Tommy Nichols to be the longevity platform he wished existed — evidence-graded compounds, PubMed-cited, independent, and free of supplement industry conflicts.',
  path: '/about',
  keywords: ['about TNiC', 'Tommy Nichols longevity', 'longevity platform founder', 'independent supplement research'],
});

export default function AboutPage() {
  return (
    <SubPageLayout>
      <div className="container-page py-8 md:py-12 max-w-4xl">
        <AboutSection />
      </div>
      <div className="container-page max-w-4xl">
        <PageConnections cluster={clusterFrom('about', '/about')} accent="cyan" id="about-connections" />
      </div>
    </SubPageLayout>
  );
}
