import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { ProductsHub } from '@/components/shop/ProductsHub';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { HubSplitInstrument } from '@/components/viz/HubSplitInstrument';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildProductListSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { PRODUCT_PICKS } from '@/lib/product-picks';
import { compounds } from '@/lib/data';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import { ContinueTrail } from '@/components/ui/WalkCard';

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
  const coaPublished = picks.filter((p) => p.thirdPartyTested).length;

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
        primary={{ href: '/shop', label: 'Verify stack' }}
        secondary={{ href: '/library', label: 'Explore library' }}
        figure={
          <HubSplitInstrument
            kicker="Verification"
            total={picks.length}
            totalLabel="verified picks"
            rows={[
              {
                key: 'coa',
                label: 'COA published',
                count: coaPublished,
                color: 'var(--status-optimal)',
              },
              {
                key: 'unstated',
                label: 'Not stated',
                count: picks.length - coaPublished,
                color: 'var(--color-text-faint)',
              },
            ]}
            href="/shop"
            hrefLabel="Buyer checklists →"
          />
        }
        figureCaption="COA split · derived from the pick registry, never inferred"
      />
      <ProductsHub />
      <div className="container-page pb-16">
        <ContinueTrail
          title="From a verified pick."
          items={[
            { href: '/library', kicker: 'Explore', title: 'Read the compound module', detail: 'PMID-graded evidence before you commit spend.', accent: 'cyan' },
            { href: '/stacks', kicker: 'Decide', title: 'Open Stack Architect', detail: 'See how this pick sits with the rest of a protocol.', accent: 'violet' },
            { href: '/shop', kicker: 'Verify', title: 'Verify stack', detail: 'Buyer checklist filtered to your active compounds.', accent: 'amber' },
            { href: '/labs', kicker: 'Track', title: 'Log baseline labs', detail: 'Supplements without labs is guessing.', accent: 'rose' },
          ]}
        />
        <PageConnections cluster={clusterFrom('verify', '/products')} accent="emerald" id="products-connections" />
        <PageConnections cluster={clusterFrom('explore', '/products')} accent="cyan" id="products-explore-connections" className="mt-6" />
      </div>
    </SubPageLayout>
  );
}
