'use client';

import Link from 'next/link';
import { Library, Gauge, Layers, LineChart, ArrowUpRight, type LucideIcon } from 'lucide-react';

type Accent = 'cyan' | 'violet' | 'emerald' | 'amber';

interface Offering {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  desc: string;
  accent: Accent;
}

// Library first — the platform's core reference — then the tools for measuring
// how you age and the supplement protocols that act on it.
const offerings: Offering[] = [
  {
    href: '/library',
    icon: Library,
    eyebrow: 'Reference',
    title: 'Anti-Aging Library',
    desc: 'The 12 Hallmarks of Aging and 50+ evidence-graded compounds — every one tiered A/B/C from human trials, with PubMed citations.',
    accent: 'cyan',
  },
  {
    href: '/bio-age',
    icon: Gauge,
    eyebrow: 'Measure',
    title: 'Biological Age Engine',
    desc: 'See how fast you are actually aging. Estimate your biological age and watch it move as your protocol takes effect.',
    accent: 'violet',
  },
  {
    href: '/stacks',
    icon: Layers,
    eyebrow: 'Act',
    title: 'Supplement Stacks',
    desc: 'Build protocols that target the pathways driving your aging — with synergy scoring, dosing, and offset-vs-slow modeling.',
    accent: 'emerald',
  },
  {
    href: '/tools',
    icon: LineChart,
    eyebrow: 'Track',
    title: 'Longevity Tools',
    desc: 'Healthspan estimator, biomarker-impact ranking, and a stack synergy simulator — see the projected effect before you commit.',
    accent: 'amber',
  },
];

const accentText: Record<Accent, string> = {
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
  emerald: 'text-accent-emerald',
  amber: 'text-accent-amber',
};

const accentBadge: Record<Accent, string> = {
  cyan: 'icon-badge-cyan',
  violet: 'icon-badge-violet',
  emerald: 'icon-badge-emerald',
  amber: 'icon-badge-amber',
};

const accentHover: Record<Accent, string> = {
  cyan: 'glow-hover-cyan',
  violet: 'glow-hover-violet',
  emerald: 'glow-hover-emerald',
  amber: 'glow-hover-amber',
};

export function HeroOfferingRail() {
  return (
    <section aria-labelledby="hero-offering-heading" className="mt-14 lg:mt-16">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <div>
          <p className="text-label text-accent-cyan mb-1.5">What you can do here</p>
          <h2 id="hero-offering-heading" className="heading-section text-2xl md:text-3xl">
            Understand how you age — then act on it.
          </h2>
        </div>
        <Link
          href="/site-map"
          className="focus-ring hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground shrink-0"
        >
          See everything
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {offerings.map(({ href, icon: Icon, eyebrow, title, desc, accent }) => (
          <Link
            key={href}
            href={href}
            className={`card-premium group focus-ring interactive ${accentHover[accent]} flex flex-col p-5 rounded-2xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${accentBadge[accent]}`}
              >
                <Icon className={`w-5 h-5 ${accentText[accent]}`} aria-hidden="true" />
              </span>
              <ArrowUpRight
                className="w-4 h-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            <p className={`text-label ${accentText[accent]} mb-1`}>{eyebrow}</p>
            <h3 className="heading-card text-base mb-2">{title}</h3>
            <p className="text-body-sm text-muted-foreground leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
