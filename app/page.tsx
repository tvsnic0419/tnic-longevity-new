import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeDescent } from '@/components/home/HomeDescent';
import { HomeTnicScore } from '@/components/home/HomeTnicScore';
import { HomeEliteInterventions } from '@/components/home/HomeEliteInterventions';
import { HomeHallmarks } from '@/components/home/HomeHallmarks';
import { HomeGuides } from '@/components/home/HomeGuides';
import { HomeExplore } from '@/components/home/HomeExplore';
import { HomeSteps } from '@/components/home/HomeSteps';
import { HomeCTA } from '@/components/home/HomeCTA';
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
 * and is crawlable. The page leads with the elite-interventions showcase
 * (products anchored to graded evidence) directly under the hero, then the
 * evidence depth that justifies those picks (hallmarks + guides), then the
 * wayfinding grid and how-to path. Interactive pieces (nav) are isolated
 * client islands within this server shell.
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
        {/* Conversion layer first: value prop → the TNiC Score → the science →
            the build path → verified products → wayfinding. The cinematic
            HomeDescent overture now plays *below* that layer, before the final
            CTA, so the first viewport sells product value, not spectacle. */}
        <HomeHero />
        <HomeTnicScore />
        <HomeHallmarks />
        <HomeSteps />
        <HomeEliteInterventions />
        <HomeExplore />
        <HomeGuides />
        <HomeDescent />
        <HomeCTA />
      </main>
      <Footer />
    </div>
  );
}
