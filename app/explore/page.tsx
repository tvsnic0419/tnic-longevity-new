import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeDescent } from '@/components/home/HomeDescent';
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
 * Explore — the cinematic overview of the platform.
 *
 * This was the homepage until the NICO Starter Questionnaire took over `/` as
 * the site's front door. The body moved here verbatim so none of the evidence
 * depth (elite interventions, hallmarks, guides) or its SEO value was lost —
 * it is now the "just browse instead" destination linked from the
 * questionnaire and from the results page.
 *
 * A server component, so the full page renders to HTML and stays crawlable.
 * Interactive pieces (nav, descent scene) are isolated client islands.
 */

const EXPLORE_TITLE = 'Explore TNiC — Evidence-Graded Longevity Supplements & Anti-Aging Library';

export const metadata = {
  ...buildPageMetadata({
    title: EXPLORE_TITLE,
    description:
      'Elite anti-aging interventions — GlyNAC, NAD⁺, Ca-AKG, NRF2 and more — graded by the strength of human evidence, each paired with one verified product to buy well. Plus a free, PubMed-backed library of the 12 hallmarks of aging. No pay-for-placement.',
    path: '/explore',
    keywords: [
      'anti-aging supplements',
      'longevity library',
      'hallmarks of aging',
      'evidence-graded supplements',
      'NAD+ supplements',
    ],
  }),
  // Absolute title so the `%s | TNiC` template doesn't double the brand name.
  title: { absolute: EXPLORE_TITLE },
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

export default function ExplorePage() {
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
        <HomeHero />
        <HomeEliteInterventions />
        <HomeHallmarks />
        <HomeGuides />
        <HomeExplore />
        <HomeSteps />
        <HomeCTA />
      </main>
      <Footer />
    </div>
  );
}
