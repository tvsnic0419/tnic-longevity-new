import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { ProductsHub } from '@/components/shop/ProductsHub';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
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
  // Derived from the live pick registry so the rail can never overstate what's
  // curated (the /products page excludes the `nr` pick, matching ProductsHub).
  const picks = Object.values(PRODUCT_PICKS).filter((p) => p.compoundId !== 'nr');
  const brands = new Set(picks.map((p) => p.brand)).size;
  const hallmarksAddressed = new Set(
    picks.flatMap((p) => compounds.find((c) => c.id === p.compoundId)?.hallmarks ?? []),
  ).size;

  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={productSchemas} />
      <CinematicHubHero
        hue="emerald"
        kicker="Verified Picks"
        title={<>One vetted product, <em>per compound</em>.</>}
        lead="For each evidence-graded compound, a single third-party-tested product that meets the studied dose and form — affiliate disclosure in plain sight. TNiC sells nothing; commission never moves a ranking."
        stats={[
          { value: String(picks.length), label: 'Verified picks' },
          { value: String(brands), label: 'Independent brands' },
          { value: String(hallmarksAddressed), label: 'Hallmarks addressed', href: '/hallmarks' },
        ]}
        primary={{ href: '/shop', label: 'Open the Protocol Shop' }}
        secondary={{ href: '/library', label: 'Browse the library' }}
      />
      <ProductsHub />
    </SubPageLayout>
  );
}