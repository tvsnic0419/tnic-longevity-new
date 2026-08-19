import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { HomeDescent } from '@/components/home/HomeDescent';
import { HomeEliteInterventions } from '@/components/home/HomeEliteInterventions';
import { HomeHallmarks } from '@/components/home/HomeHallmarks';
import { HomeSteps } from '@/components/home/HomeSteps';
import { HomeNicoStarter } from '@/components/home/HomeNicoStarter';
import { StructuredData } from '@/components/seo/StructuredData';
import {
  buildSoftwareApplicationSchema,
  buildItemListSchema,
  buildProductListSchema,
  buildPageMetadata,
} from '@/lib/seo';
import { eliteInterventions } from '@/lib/elite-interventions';

/**
 * Homepage — a server component so the full page renders to HTML on the server
 * and is crawlable. Structured as a six-chapter descent:
 *   hero + 01 System (synergy network) + 02 Goal (morbidity curve) live in the
 *   cinematic HomeDescent overture, then 03 Interventions (elite picks +
 *   hallmark filter), 04 Mechanisms (the 12 hallmarks), 05 Protocol (the
 *   three-step path), and 06 Personalize (the on-page NICO starter). The full
 *   guide/hub wayfinding lives in the footer (and is reachability-guarded from
 *   the hallmark pages), so the body stays a single, legible narrative.
 *   Interactive pieces (nav, the elite filter, the NICO starter) are isolated
 *   client islands within this server shell.
 */

const HOME_TITLE = 'TNiC — Evidence-Graded Longevity Supplements & Anti-Aging Library';

export const metadata = {
  ...buildPageMetadata({
    title: HOME_TITLE,
    description:
      'Elite anti-aging interventions — GlyNAC, NAD⁺, Ca-AKG, NRF2 and more — graded by the strength of human evidence, each paired with one verified product to buy well. Plus a free, PubMed-backed library of the 12 hallmarks of aging. No pay-for-placement.',
    path: '',
  }),
  // Absolute title so the `%s | TNiC` template doesn't double the brand name.
  title: { absolute: HOME_TITLE },
};

const eliteProductSchema = buildProductListSchema(
  eliteInterventions.map((e) => ({
    name: e.pick.productName,
    description: e.pick.whyThisPick,
    brand: e.pick.brand,
    url: e.pick.purchaseUrl,
    evidenceTier: e.evidence,
  })),
);

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden canvas-scrim text-foreground">
      <StructuredData
        schemas={[
          buildSoftwareApplicationSchema(),
          buildItemListSchema(),
          eliteProductSchema,
        ]}
      />
      <ScrollProgress />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <HomeDescent />
        <HomeEliteInterventions />
        <HomeHallmarks />
        <HomeSteps />
        <HomeNicoStarter />
      </main>
      <Footer />
    </div>
  );
}
