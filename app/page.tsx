import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SectionProgress } from '@/components/ui/SectionProgress';
import { HomeDescent } from '@/components/home/HomeDescent';
import { HomeInstrumentStrip } from '@/components/home/HomeInstrumentStrip';
import { HomeSystemOvertureGate } from '@/components/home/HomeSystemOvertureGate';
import { HomeCredibilityStrip } from '@/components/home/HomeCredibilityStrip';
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
import { evidenceIndexStats } from '@/lib/evidence-index';

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
      'The Longevity OS — learn the system, not just the supplement list: how interventions are graded on human evidence, what the 12 hallmarks of aging are and which compounds act on each, and how to read the trial behind any claim. GlyNAC, NAD⁺, Ca-AKG, NRF2 and 96 more, each paired with one verified product. Free, PubMed-backed, no pay-for-placement.',
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

/**
 * The homepage spine, in scroll order. The numerals are the page's own chapter
 * numbers — the same ones the section eyebrows and CellularDivider print — so
 * the rail can never disagree with what is on screen. The three overture
 * scenes carry no numeral because the page gives them none.
 */
const HOME_SECTIONS = [
  { targetId: 'arrive', label: 'Start' },
  { targetId: 'molecule', label: 'Molecule' },
  { targetId: 'system', label: 'System', numeral: '01' },
  { targetId: 'goal', label: 'Goal', numeral: '02' },
  { targetId: 'your-path', label: 'Your path' },
  { targetId: 'elite-interventions', label: 'Interventions', numeral: '03' },
  { targetId: 'mechanisms', label: 'Mechanisms', numeral: '04' },
  { targetId: 'protocol', label: 'Protocol', numeral: '05' },
  { targetId: 'personalize', label: 'Personalize', numeral: '06' },
];

/**
 * The library-wide tier split, resolved here on the server so the homepage's
 * first-viewport instrument reads the same source as /library and
 * /library/evidence rather than a second population. Computed outside the
 * component: `evidenceIndexStats()` walks every module and the page is static.
 */
const evidenceStats = evidenceIndexStats();
const libraryTiers = {
  total: evidenceStats.total,
  A: evidenceStats.byTier.A,
  B: evidenceStats.byTier.B,
  C: evidenceStats.byTier.C,
};

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
      {/* The homepage's location rail. Mounted here rather than inside
          HomeDescent because it spans the whole six-chapter spine, not just the
          cinematic overture — which is also what lets its numerals be the
          page's real 01–06 chapter numbers. ScrollProgress suppresses its own
          route rail on `/` so the two never collide. */}
      <SectionProgress ariaLabel="Homepage sections" steps={HOME_SECTIONS} />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <HomeDescent libraryTiers={libraryTiers} />
        <HomeSystemOvertureGate />
        <HomeInstrumentStrip />
        <HomeCredibilityStrip />
        <HomeEliteInterventions />
        <HomeHallmarks />
        <HomeSteps />
        <HomeNicoStarter />
      </main>
      <Footer />
    </div>
  );
}
