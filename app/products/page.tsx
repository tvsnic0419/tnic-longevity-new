import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { ProductsHub } from '@/components/shop/ProductsHub';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildProductListSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { PRODUCT_PICKS } from '@/lib/product-picks';
import { compounds } from '@/lib/data';

export const metadata = seoRoutes.products();

const productSchemas = [
  buildProductListSchema(
    Object.values(PRODUCT_PICKS)
      .filter((p) => p.compoundId !== 'nr')
      .map((p) => {
        const compound = compounds.find((c) => c.id === p.compoundId);
        return {
          name: p.productName,
          description: p.whyThisPick,
          brand: p.brand,
          url: p.purchaseUrl,
          evidenceTier: compound?.evidence,
        };
      }),
  ),
  buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Recommended Products', path: '/products' },
  ]),
];

export default function ProductsPage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={productSchemas} />
      <ProductsHub />
    </SubPageLayout>
  );
}