import { ShoppingBag } from 'lucide-react';
import { ProtocolShopPanel } from '@/components/shop/ProtocolShopPanel';
import { PageHeader } from '@/components/ui/PageHeader';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { getHubContext } from '@/lib/hub-context';
import { stackPresets } from '@/lib/presets';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import { ContinueTrail } from '@/components/ui/WalkCard';

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
    <>
      {/* Hero and identity on the server, ahead of the client island — see the
          note in app/stacks/page.tsx and STYLE_GUIDE §14. ProtocolShopPanel
          wraps its body in a Suspense boundary around a useSearchParams()
          reader, so everything it rendered — the hero and the <h1> included —
          was replaced by a pulsing placeholder in the initial HTML. */}
      <CinematicHubHero
        hue="amber"
        kicker="Protocol Shop"
        title={<>Buy smart, <em>not branded</em>.</>}
        lead="Stack-filtered verification checklists from the buyer guides — what to look for on a label before you spend, never who paid to be listed."
        stats={[
          { value: String(Object.keys(stackPresets).length), label: 'Stack presets' },
          { value: String(COMPOUND_COUNT), label: 'Compounds covered' },
          { value: 'COA-first', label: 'Verification standard' },
        ]}
        primary={{ href: '/stacks', label: 'Open Stack Architect' }}
        secondary={{ href: '/products', label: 'Verified products' }}
      />
      <div className="container-page pt-10 md:pt-12 lg:pt-14 pb-16 md:pb-20 lg:pb-24 max-w-4xl">
        <StructuredData schemas={buildShopSchemas()} />
        <PageHeader
          icon={ShoppingBag}
          eyebrow="Protocol Shop"
          title="Buy Smart — Not Branded"
          description="Stack-filtered verification checklists from buyer guides. Share /shop?stack= links to pre-load any preset or custom stack."
          theme="amber"
          context={getHubContext('shop')}
          contextVariant="compact"
          variant="handoff"
        />
        <ProtocolShopPanel />
      </div>
      {/* Client island above hydrates the checklist; these rails stay in the
          initial HTML so crawlers and pre-hydrate readers still get a path. */}
      <div className="container-page pb-16">
        <ContinueTrail
          title="After you verify."
          items={[
            { href: '/products', kicker: 'Catalog', title: 'Verified product picks', detail: 'One dose-matched manufacturer pick per compound.', accent: 'emerald' },
            { href: '/stacks', kicker: 'Decide', title: 'Edit stack in Architect', detail: 'Adjust compounds, then return with ?stack=.', accent: 'violet' },
            { href: '/labs', kicker: 'Track', title: 'Log baseline labs', detail: 'Confirm the protocol is moving the right markers.', accent: 'rose' },
            { href: '/library', kicker: 'Explore', title: 'Explore the library', detail: 'Re-read evidence before a large reorder.', accent: 'cyan' },
          ]}
        />
        <PageConnections cluster={clusterFrom('verify', '/shop')} accent="amber" id="shop-verify-connections" />
        <PageConnections cluster={clusterFrom('decide', '/shop')} accent="violet" id="shop-decide-connections" className="mt-6" />
        <PageConnections cluster={clusterFrom('explore', '/shop')} accent="cyan" id="shop-explore-connections" className="mt-6" />
      </div>
    </>
  );
}
