import type { Metadata } from 'next';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { StructuredData } from '@/components/seo/StructuredData';
import { BiohackSalesPage } from '@/components/biohack/BiohackSalesPage';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { BIOHACK_PRICE_USD } from '@/lib/biohack/protocol';

export const metadata: Metadata = buildPageMetadata({
  title: 'TNiC Bio Bible — Intelligence They Prefer Unindexed',
  description:
    'A dual-exposure monograph: forty compounds mapped to the enzymatic and organelle lesions of methamphetamine and tobacco. Educational intelligence product. Not medical advice.',
  path: '/biohack-100',
  keywords: ['TNiC Bio Bible', 'BIOHACK 100', 'dual-exposure protocol', 'paid longevity protocol'],
});

export default async function BiohackPage({
  searchParams,
}: {
  searchParams: Promise<{ need?: string }>;
}) {
  const params = await searchParams;
  const checkoutUrl =
    process.env.WHOP_BIOHACK_CHECKOUT_URL || process.env.NEXT_PUBLIC_WHOP_BIOHACK_CHECKOUT_URL || '';
  const price = Number.isFinite(BIOHACK_PRICE_USD) ? BIOHACK_PRICE_USD : 49;

  return (
    <SubPageLayout hideContextBar>
      <StructuredData
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Bio Bible', path: '/biohack-100' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'TNiC Bio Bible — BIOHACK 100',
            description:
              'Paid information product: forty-compound dual-exposure longevity monograph. Educational reference only.',
            brand: { '@type': 'Brand', name: 'TNiC' },
            url: `${SITE.url}/biohack-100`,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: String(price),
              availability: 'https://schema.org/OnlineOnly',
              url: `${SITE.url}/biohack-100`,
            },
          },
        ]}
      />
      <BiohackSalesPage checkoutUrl={checkoutUrl} needAccess={params.need === 'access'} />
    </SubPageLayout>
  );
}
