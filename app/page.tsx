import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SectionProgress } from '@/components/ui/SectionProgress';
import { HomeDescent } from '@/components/home/HomeDescent';
import { HomeCredibilityStrip } from '@/components/home/HomeCredibilityStrip';
import { HomeBioBible } from '@/components/home/HomeBioBible';
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
 * and is crawlable. Structured as a six-chapter descent plus a paid Bio Bible
 * teaser after the credibility strip.
 */

const HOME_TITLE = 'TNiC — Evidence-Graded Longevity Supplements & Anti-Aging Library';

export const metadata = {
  ...buildPageMetadata({
    title: HOME_TITLE,
    description:
      'Elite anti-aging interventions — GlyNAC, NAD⁺, Ca-AKG, NRF2 and more — graded by the strength of human evidence, each paired with one verified product to buy well. Plus a free, PubMed-backed library of the 12 hallmarks of aging. No pay-for-placement.',
    path: '',
  }),
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

const HOME_SECTIONS = [
  { targetId: 'arrive', label: 'Start' },
  { targetId: 'molecule', label: 'Molecule' },
  { targetId: 'system', label: 'System', numeral: '01' },
  { targetId: 'goal', label: 'Goal', numeral: '02' },
  { targetId: 'your-path', label: 'Your path' },
  { targetId: 'bio-bible', label: 'Bio Bible' },
  { targetId: 'elite-interventions', label: 'Interventions', numeral: '03' },
  { targetId: 'mechanisms', label: 'Mechanisms', numeral: '04' },
  { targetId: 'protocol', label: 'Protocol', numeral: '05' },
  { targetId: 'personalize', label: 'Personalize', numeral: '06' },
];

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
      <SectionProgress ariaLabel="Homepage sections" steps={HOME_SECTIONS} />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <HomeDescent />
        <HomeCredibilityStrip />
        <HomeBioBible />
        <HomeEliteInterventions />
        <HomeHallmarks />
        <HomeSteps />
        <HomeNicoStarter />
      </main>
      <Footer />
    </div>
  );
}
