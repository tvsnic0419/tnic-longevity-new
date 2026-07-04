'use client';

import Link from 'next/link';
import { ArrowRight, Scan, BookOpen, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { ContextRail } from '@/components/ui/ContextRail';
import { usePlatform } from '@/context/PlatformContext';
import { buildShopPresetUrl } from '@/lib/stack-url';
import type { PresetKey } from '@/lib/presets';

type AccentKey = 'cyan' | 'rose' | 'emerald' | 'amber';

const basePaths = [
  {
    icon: BookOpen,
    title: 'Search the library',
    desc: 'Hallmarks, compounds, synergies — full-text search with evidence tiers.',
    href: '/library',
    cta: 'Open Library',
    accent: 'cyan' as AccentKey,
  },
  {
    icon: Scan,
    title: 'Run defense scan',
    desc: 'Estimate biological age from lifestyle inputs. Sets your OS profile locally.',
    href: '/tools?tab=healthspan',
    cta: 'Defense Scan',
    accent: 'rose' as AccentKey,
  },
  {
    icon: LayoutDashboard,
    title: 'Launch command center',
    desc: 'Stack, labs, milestones, hallmark grid — unified dashboard. Data stays local.',
    href: '/dashboard',
    cta: 'Open Dashboard',
    accent: 'emerald' as AccentKey,
  },
  {
    icon: ShoppingBag,
    title: 'Verify at Protocol Shop',
    desc: 'Stack-filtered COA checklists and red flags — affiliate links disclosed, commission never influences listings.',
    href: '/shop',
    cta: 'Open Shop',
    accent: 'amber' as AccentKey,
  },
];

const accentConfig: Record<AccentKey, {
  iconBadge: string;
  iconText: string;
  gradFrom: string;
  ctaText: string;
  glowHover: string;
}> = {
  cyan: {
    iconBadge: 'icon-badge-cyan',
    iconText: 'text-accent-cyan',
    gradFrom: 'from-accent-cyan/[0.08]',
    ctaText: 'text-accent-cyan',
    glowHover: 'glow-hover-cyan',
  },
  rose: {
    iconBadge: 'icon-badge-rose',
    iconText: 'text-accent-rose',
    gradFrom: 'from-accent-rose/[0.08]',
    ctaText: 'text-accent-rose',
    glowHover: 'glow-hover-rose',
  },
  emerald: {
    iconBadge: 'icon-badge-emerald',
    iconText: 'text-accent-emerald',
    gradFrom: 'from-accent-emerald/[0.08]',
    ctaText: 'text-accent-emerald',
    glowHover: 'glow-hover-emerald',
  },
  amber: {
    iconBadge: 'icon-badge-amber',
    iconText: 'text-accent-amber',
    gradFrom: 'from-accent-amber/[0.08]',
    ctaText: 'text-accent-amber',
    glowHover: 'glow-hover-amber',
  },
};

export function HomepageCTA() {
  const { quizResult } = usePlatform();
  const shopHref =
    quizResult?.preset && quizResult.preset in { starter: 1, nrf2: 1, mito: 1, hybrid: 1 }
      ? buildShopPresetUrl(quizResult.preset as PresetKey)
      : '/shop';

  const paths = basePaths.map((p) =>
    p.title === 'Verify at Protocol Shop' ? { ...p, href: shopHref } : p,
  );

  return (
    <section className="py-20 md:py-28 relative overflow-hidden section-mesh section-glow-cyan">
      <div className="absolute inset-0 bg-gradient-to-t from-accent-cyan/8 via-transparent to-accent-violet/6 pointer-events-none" />
      <div className="relative container-page">
        <div className="text-center mb-8">
          <h2 className="heading-section mb-4">Four paths into your OS.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn → scan → command center → verify. Every path leads to the same local-first Longevity OS.
          </p>
        </div>

        <ContextRail
          what="Four conversion paths — library science, defense scan, dashboard OS, and stack-filtered shop verification."
          why="Different visitors arrive with different intent. TNiC surfaces the right next step without forcing everyone through the same funnel."
          next={quizResult?.preset ? `Your quiz preset deep-links Shop to ${quizResult.preset} — verify before you buy.` : 'Take the quiz first for preset-aware Shop and Stack Architect handoffs.'}
          theme="cyan"
          className="mb-10 max-w-4xl mx-auto"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {paths.map((path) => {
            const cfg = accentConfig[path.accent];
            return (
              <Link
                key={path.title}
                href={path.href}
                className={`group block rounded-2xl p-6 border border-border/60 bg-gradient-to-br ${cfg.gradFrom} to-transparent backdrop-blur-sm transition-all duration-300 ${cfg.glowHover} h-full`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${cfg.iconBadge}`}>
                  <path.icon className={`w-5 h-5 ${cfg.iconText}`} aria-hidden="true" />
                </div>
                <h3 className="font-bold mb-2 text-sm">{path.title}</h3>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{path.desc}</p>
                <span className={`inline-flex items-center gap-2 text-sm font-semibold ${cfg.ctaText} group-hover:gap-3 transition-all`}>
                  {path.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="gradient-border p-8 md:p-12 text-center max-w-3xl mx-auto">
          <p className="text-label text-accent-violet mb-3">YOUR OS AWAITS</p>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Everything in one place.<br className="hidden sm:block" /> Free. Local. Yours.
          </h3>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Stack architect, lab hub, 12-hallmark library, six evidence tools — all running in your browser with no account required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="focus-ring glow-hover-emerald bg-gradient-to-r from-accent-cyan to-accent-emerald text-black px-8 py-3.5 rounded-xl font-semibold text-sm text-center flex items-center justify-center gap-2 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Launch Longevity OS
            </Link>
            <Link
              href="/library"
              className="focus-ring glass glow-hover-violet px-8 py-3.5 rounded-xl font-semibold text-sm text-accent-violet flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Browse Library <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}