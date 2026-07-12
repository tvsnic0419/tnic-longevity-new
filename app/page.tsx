'use client';

import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeExplore } from '@/components/home/HomeExplore';
import { HomeSteps } from '@/components/home/HomeSteps';
import { HomeEvidence } from '@/components/home/HomeEvidence';
import { HomeGuides } from '@/components/home/HomeGuides';
import { HomeCTA } from '@/components/home/HomeCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <ScrollProgress />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <HomeHero />
        <HomeExplore />
        <HomeSteps />
        <HomeEvidence />
        <HomeGuides />
        <HomeCTA />
      </main>
      <Footer />
    </div>
  );
}
