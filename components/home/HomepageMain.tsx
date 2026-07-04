'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { HomepageOSFunnel } from '@/components/sections/HomepageOSFunnel';
import { HomepageTrustStrip } from '@/components/sections/HomepageTrustStrip';
import { TrustBanner } from '@/components/TrustBanner';
import { LibraryHighlights } from '@/components/sections/LibraryHighlights';
import { ResearchIntel } from '@/components/sections/ResearchIntel';
import { HomepageBriefRail } from '@/components/sections/HomepageBriefRail';
import { HomepageCompareRow } from '@/components/sections/HomepageCompareRow';
import { CompetitiveEdge } from '@/components/sections/CompetitiveEdge';
import { HomepageTrust } from '@/components/sections/HomepageTrust';
import { HomepageCTA } from '@/components/sections/HomepageCTA';
import { HomepageProductRail } from '@/components/sections/HomepageProductRail';
import { HomepagePersonalizedRail } from '@/components/sections/HomepagePersonalizedRail';
import { NextUpSection } from '@/components/sections/NextUpSection';
import { HallmarkProblemTiles } from '@/components/sections/HallmarkProblemTiles';
import { HomepageSynergyNetwork } from '@/components/sections/HomepageSynergyNetwork';
import { EliteCompoundsShowcase } from '@/components/sections/EliteCompoundsShowcase';
import { PopularGuidesStrip } from '@/components/sections/PopularGuidesStrip';
import { PlatformTicker } from '@/components/ui/PlatformTicker';
import { ParallaxSection } from '@/components/ui/ParallaxSection';
import { SiteGuide } from '@/components/SiteGuide';

/** Client wrapper — parallax scroll transitions between homepage sections */
export function HomepageMain() {
  return (
    <>
      <HeroSection />
      <PopularGuidesStrip />
      <PlatformTicker />

      <ParallaxSection depth={1} theme="violet">
        <HomepagePersonalizedRail />
      </ParallaxSection>

      <ParallaxSection depth={1} theme="emerald">
        <HomepageTrustStrip />
      </ParallaxSection>

      <ParallaxSection depth={2} theme="cyan">
        <HomepageOSFunnel />
      </ParallaxSection>

      <ParallaxSection depth={1}>
        <SiteGuide />
      </ParallaxSection>

      <ParallaxSection depth={2} theme="violet">
        <HallmarkProblemTiles />
      </ParallaxSection>

      <ParallaxSection depth={1} theme="amber">
        <TrustBanner />
      </ParallaxSection>

      <ParallaxSection depth={2} theme="cyan">
        <LibraryHighlights />
      </ParallaxSection>

      <ParallaxSection depth={2} theme="cyan">
        <EliteCompoundsShowcase />
      </ParallaxSection>

      <ParallaxSection depth={1} theme="violet">
        <HomepageSynergyNetwork />
      </ParallaxSection>

      <ParallaxSection depth={1}>
        <HomepageCompareRow />
      </ParallaxSection>

      <ParallaxSection depth={2} theme="emerald">
        <ResearchIntel />
      </ParallaxSection>

      <ParallaxSection depth={1} theme="rose">
        <HomepageBriefRail />
      </ParallaxSection>

      <ParallaxSection depth={1}>
        <CompetitiveEdge />
      </ParallaxSection>

      <ParallaxSection depth={2} theme="amber">
        <HomepageProductRail />
      </ParallaxSection>

      <ParallaxSection depth={1} theme="emerald">
        <HomepageTrust />
      </ParallaxSection>

      <ParallaxSection depth={2} theme="cyan">
        <HomepageCTA />
      </ParallaxSection>

      <ParallaxSection depth={1}>
        <NextUpSection />
      </ParallaxSection>
    </>
  );
}