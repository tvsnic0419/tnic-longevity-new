'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Layers,
  FlaskConical,
  Library,
  Wand2,
  ArrowRight,
} from 'lucide-react';
import { ContextRail } from '@/components/ui/ContextRail';
import { usePlatform } from '@/context/PlatformContext';
import { getOsFunnelOrder } from '@/lib/homepage-personalization';

type AccentKey = 'emerald' | 'violet' | 'cyan' | 'amber' | 'rose';

const accentConfig: Record<AccentKey, {
  gradFrom: string;
  iconBadge: string;
  iconText: string;
  ctaText: string;
  featuredRing: string;
}> = {
  emerald: {
    gradFrom: 'from-accent-emerald/[0.09]',
    iconBadge: 'icon-badge-emerald',
    iconText: 'text-accent-emerald',
    ctaText: 'text-accent-emerald',
    featuredRing: 'ring-1 ring-accent-emerald/25',
  },
  violet: {
    gradFrom: 'from-accent-violet/[0.09]',
    iconBadge: 'icon-badge-violet',
    iconText: 'text-accent-violet',
    ctaText: 'text-accent-violet',
    featuredRing: '',
  },
  cyan: {
    gradFrom: 'from-accent-cyan/[0.09]',
    iconBadge: 'icon-badge-cyan',
    iconText: 'text-accent-cyan',
    ctaText: 'text-accent-cyan',
    featuredRing: '',
  },
  amber: {
    gradFrom: 'from-accent-amber/[0.09]',
    iconBadge: 'icon-badge-amber',
    iconText: 'text-accent-amber',
    ctaText: 'text-accent-amber',
    featuredRing: '',
  },
  rose: {
    gradFrom: 'from-accent-rose/[0.09]',
    iconBadge: 'icon-badge-rose',
    iconText: 'text-accent-rose',
    ctaText: 'text-accent-rose',
    featuredRing: '',
  },
};

const osPaths = [
  {
    icon: LayoutDashboard,
    title: 'Forecast Hub',
    desc: 'Command center — active supplement stack, hallmark coverage map, lab status, modeled outcomes, and export kit.',
    context: 'Turns your inputs into a clear view of possible longevity impact, visible at a glance.',
    href: '/dashboard',
    cta: 'Open dashboard',
    accent: 'emerald' as AccentKey,
    featured: true,
    step: '01',
  },
  {
    icon: Layers,
    title: 'Stack Architect',
    desc: 'Build supplement protocols with live synergy scoring, hallmark coverage, contraindication flags, and pathway impact.',
    context: 'Every compound is evidence-graded Tier A/B/C before it enters a preset. No random bundling.',
    href: '/stacks',
    cta: 'Build stack',
    accent: 'violet' as AccentKey,
    step: '02',
  },
  {
    icon: FlaskConical,
    title: 'Lab Hub',
    desc: 'Log biomarkers locally. Track NAD+, glutathione, hs-CRP, trends, retest nudges, and CSV export.',
    context: 'Compare real bloodwork against modeled supplement effect ranges — no cloud, no accounts.',
    href: '/labs',
    cta: 'Track labs',
    accent: 'cyan' as AccentKey,
    step: '03',
  },
  {
    icon: Library,
    title: 'Anti-Aging Library',
    desc: '12 hallmarks, 9 compound deep-dives, synergy guides — all PMID-cited and evidence-graded.',
    context: 'Search by compound, hallmark, or pathway. Every entry explains expected effect, limits, and primary trials.',
    href: '/library',
    cta: 'Search library',
    accent: 'amber' as AccentKey,
    step: '04',
  },
  {
    icon: Wand2,
    title: 'Longevity Forecast Tools',
    desc: 'Interactive tools for stack simulation, interaction networks, biomarker forecasts, and defense scanning.',
    context: 'All local-first. Run scenarios before you commit to a supplement plan.',
    href: '/tools',
    cta: 'Open tools',
    accent: 'rose' as AccentKey,
    step: '05',
  },
] as const;

const funnelNextByGoal: Record<string, string> = {
  learn: 'Start at the Library for mechanism-mapped deep-dives, then take the quiz for a stack preset.',
  defense: 'Run Defense Scan first, then build an NRF2-focused stack with synergy scoring.',
  energy: 'Open Stack Architect for mitochondrial presets, then log NAD+ and inflammation labs.',
  full: 'Open the Forecast Hub for the full picture, then customize the Hybrid preset in Stack Architect.',
};

export function HomepageOSFunnel() {
  const { quizResult } = usePlatform();
  const order = getOsFunnelOrder(quizResult?.goal);
  const sorted = [...osPaths].sort((a, b) => order.indexOf(a.href) - order.indexOf(b.href));
  const featuredHref = order[0];
  const contextNext = funnelNextByGoal[quizResult?.goal ?? ''] ?? 'Start at the Forecast Hub for the full picture, or jump directly to the module you need right now.';

  return (
    <section id="os" className="py-16 md:py-24 border-b border-border bg-card section-glow-emerald section-mesh">
      <div className="container-page">
        <div className="text-center mb-8 md:mb-10 section-header-mesh">
          <p className="text-label text-accent-emerald mb-2">Longevity Forecasting</p>
          <h2 className="heading-section">
            One evidence engine. Five ways to understand impact.
          </h2>
          <p className="text-body-sm mt-3 max-w-xl mx-auto">
            Every module explains what a supplement may affect, how confident the evidence is, and how to track whether the projection matches your own biology. No paywall. No accounts. No supplement store agenda.
          </p>
        </div>

        <ContextRail
          what="Five evidence-grounded modules — stack architect, biomarker tracker, library, forecasting tools, and dashboard — built around the 12 Hallmarks of Aging."
          why="Most people combine supplements from multiple sources with no synergy check, no effect-size context, and no outcome tracking. TNiC maps every compound to a hallmark, checks pathway interactions, and compares modeled effects against real follow-up data."
          next={contextNext}
          theme="emerald"
          className="mb-10 md:mb-14 max-w-4xl mx-auto"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((path, i) => {
            const Icon = path.icon;
            const cfg = accentConfig[path.accent];
            const isFeatured = path.href === featuredHref;

            return (
              <motion.div
                key={path.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className={isFeatured ? 'sm:col-span-2 lg:col-span-1' : ''}
              >
                <Link
                  href={path.href}
                  className={[
                    'focus-ring group block h-full rounded-2xl p-6 card-premium',
                    'bg-gradient-to-br', cfg.gradFrom, 'to-transparent',
                    `glow-hover-${path.accent}`,
                    isFeatured ? cfg.featuredRing : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cfg.iconBadge}`}>
                      <Icon className={`w-5 h-5 ${cfg.iconText}`} aria-hidden="true" />
                    </div>
                    <span className="os-card-number">{path.step}</span>
                  </div>

                  <h3 className="font-bold text-lg mb-1.5 leading-snug">{path.title}</h3>
                  <p className="text-xs font-mono text-muted-foreground mb-2 leading-relaxed">{path.context}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{path.desc}</p>

                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold mt-5 group-hover:gap-3 transition-all duration-300 ${cfg.ctaText}`}>
                    {path.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
