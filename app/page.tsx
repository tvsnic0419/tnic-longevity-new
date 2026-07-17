import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeExplore } from '@/components/home/HomeExplore';
import { HomeSteps } from '@/components/home/HomeSteps';
import { HomeHallmarks } from '@/components/home/HomeHallmarks';
import { HomeGuides } from '@/components/home/HomeGuides';
import { HomeCTA } from '@/components/home/HomeCTA';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildSoftwareApplicationSchema, buildItemListSchema } from '@/lib/seo';

/**
 * Homepage — a server component so the full page renders to HTML on the server
 * and is crawlable. The previous version was a client page with every section
 * loaded `ssr: false`, which left crawlers with an empty shell and no nav or
 * footer. Interactive pieces (nav, quiz) are isolated client islands within
 * this server-rendered shell.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden canvas-scrim text-foreground">
      <StructuredData schemas={[buildSoftwareApplicationSchema(), buildItemListSchema()]} />
      <ScrollProgress />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <HomeHero />
        <HomeExplore />
        <HomeSteps />
        <HomeHallmarks />
        <HomeGuides />
        <HomeCTA />
      </main>
      <Footer />
    </div>
  );
}
