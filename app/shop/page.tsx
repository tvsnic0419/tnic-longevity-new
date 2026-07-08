import { ProtocolShopPanel } from '@/components/shop/ProtocolShopPanel';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Protocol Shop — Stack-Filtered Buyer Verification',
  description:
    'Brand-agnostic verification checklists filtered by your active stack. COA demands, RCT dose anchors, red flags. Affiliate links disclosed — commission never influences which products are listed.',
  path: '/shop',
  keywords: ['supplement buyer guide', 'NMN COA', 'protocol shop', 'stack verification'],
});

function buildShopSchemas() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNiC Protocol Shop — Supplement Verification Tool',
    url: `${SITE.url}/shop`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Stack-filtered supplement buyer verification. COA demands, RCT dose anchors, and red-flag checklists for longevity compounds. Affiliate links disclosed — commission never influences listings.',
    featureList: [
      'COA (Certificate of Analysis) verification checklist',
      'RCT-anchored dosage reference',
      'Red-flag ingredient filter',
      'Stack-filtered buyer guide',
      'Zero pay-for-placement policy',
    ],
  };
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Protocol Shop', path: '/shop' },
  ]);
  return [webApp, breadcrumb];
}

export default function ShopPage() {
  return (
    <div className="container-page py-8 md:py-12 max-w-4xl">
      <StructuredData schemas={buildShopSchemas()} />
      <ProtocolShopPanel />
    </div>
  );
}