'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList, LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { getHeroPersonalization } from '@/lib/homepage-personalization';
import { HeroNetworkCanvas } from '@/components/ui/HeroNetworkCanvas';
import { StarterQuiz } from '@/components/sections/StarterQuiz';
import { HeroOfferingRail } from '@/components/sections/HeroOfferingRail';

export function Hero() {
  const { quizResult } = usePlatform();
  const hero = getHeroPersonalization(quizResult);

  return (
    <section className="relative min-h-[92vh] md:min-h-[96vh] flex items-center pt-24 md:pt-28 pb-14 md:pb-20 overflow-hidden bg-[#020811]">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a2338_0.8px,transparent_1px)] bg-[length:4px_4px] opacity-40" />
      <HeroNetworkCanvas />

      <div className="container-page relative z-10 w-full">
        <div className="lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-emerald)] flex items-center justify-center">
                  <span className="text-[#020811] font-bold text-xl">T</span>
                </div>
                <div>
                  <span className="text-4xl md:text-5xl font-semibold tracking-tighter">TN</span>
                  <span className="text-4xl md:text-5xl font-semibold tracking-tighter text-[var(--accent-cyan)]">i</span>
                  <span className="text-4xl md:text-5xl font-semibold tracking-tighter">C</span>
                </div>
              </div>
              <div className="badge-live">
                <span className="badge-live-dot" /> Platform Active
              </div>
            </div>

            <div className="max-w-3xl mx-auto lg:mx-0">
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" /> Anti-Aging Operating System <span className="text-[var(--accent-cyan)]">v2.1</span>
                </span>
              </div>

              <h1 className="headline-editorial mb-5">
                {hero.line1}<br />
                <span className="gradient-sweep-text">{hero.line2}</span>
              </h1>

              {/* REFINED SHIMMER GRADIENT */}
              <p className="max-w-2xl mx-auto lg:mx-0 mb-6 text-[26px] md:text-[30px] leading-[1.1] font-semibold tracking-[-0.025em] 
                 bg-gradient-to-r from-[#f8fafc] via-[#67f6ff] to-[#f8fafc] bg-clip-text text-transparent">
                Subtract years from your biological age.
              </p>

              <p className="text-body text-lg max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed text-[var(--color-text-secondary)]">
                With evidence-graded protocols — privately, locally, and transparently.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Link 
                  href={hero.primary.href} 
                  className="tnic-button-primary group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-medium focus-ring"
                >
                  <ClipboardList className="w-5 h-5" />
                  Take the 3-Min Quiz
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link 
                  href={hero.secondary.href} 
                  className="tnic-button-secondary inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-medium focus-ring"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Open Dashboard
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-[var(--color-text-muted)]">
                <span>Free forever</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>Data stays local</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>No accounts required</span>
              </div>
            </div>
          </div>

          {/* Right Column - Quiz */}
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--accent-cyan)]/10 via-transparent to-[var(--accent-emerald)]/10 blur-2xl" />
              <div className="relative tnic-glass rounded-3xl p-1">
                <StarterQuiz />
              </div>
            </div>
          </div>
        </div>

        {/* Offering rail — surfaces the core capabilities up front, Library first */}
        <HeroOfferingRail />
      </div>
    </section>
  );
}
