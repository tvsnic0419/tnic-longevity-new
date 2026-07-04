import { ProtocolBriefHub } from '@/components/brief/ProtocolBriefHub';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Protocol Brief — PMID-Curated Research Digest',
  description:
    'Weekly longevity research drops tied to TNiC library updates. Evidence-first retention — not coupon marketing.',
  path: '/brief',
  keywords: ['longevity research digest', 'NMN study', 'GlyNAC trial', 'protocol brief'],
});

function buildBriefSchemas() {
  const blog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'TNiC Protocol Brief — Longevity Research Digest',
    url: `${SITE.url}/brief`,
    description:
      'PMID-curated longevity research drops. Each entry links directly to the PubMed source. No coupon marketing — evidence-first retention.',
    inLanguage: 'en-US',
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    isAccessibleForFree: true,
    potentialAction: {
      '@type': 'SubscribeAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/brief/feed.xml` },
    },
  };
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Protocol Brief', path: '/brief' },
  ]);
  return [blog, breadcrumb];
}

export default function BriefPage() {
  return (
    <div className="container-page py-8 md:py-12 max-w-3xl">
      <StructuredData schemas={buildBriefSchemas()} />
      <ProtocolBriefHub />
    </div>
  );
}