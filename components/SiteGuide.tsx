'use client';

import Link from 'next/link';
import { BookOpen, Wrench, Shield, ArrowRight } from 'lucide-react';
import { ContextRail } from '@/components/ui/ContextRail';

const paths = [
  {
    icon: BookOpen,
    title: 'Learn the Science',
    purpose: 'Understand before you supplement',
    gradFrom: 'from-accent-cyan/[0.09]',
    iconBadge: 'icon-badge-cyan',
    iconText: 'text-accent-cyan',
    titleColor: 'text-accent-cyan',
    glowHover: 'glow-hover-cyan',
    steps: [
      { label: '3-Min starter quiz', href: '/quiz' },
      { label: 'Learn hub', href: '/learn' },
      { label: 'All supplement guides', href: '/supplement-guides' },
      { label: 'Best supplements 2026 guide', href: '/longevity-supplements-guide' },
      { label: 'NAD+ supplement guide 2026', href: '/nad-supplement-guide' },
      { label: 'GlyNAC supplement guide', href: '/glynac-supplement-guide' },
      { label: "Berberine guide — nature's Ozempic?", href: '/berberine-supplement-guide' },
      { label: 'Taurine longevity guide (Science 2023)', href: '/taurine-supplement-guide' },
      { label: 'Sulforaphane & NRF2 guide', href: '/sulforaphane-supplement-guide' },
      { label: 'Spermidine autophagy guide', href: '/spermidine-supplement-guide' },
      { label: 'FAQ — 15 answers', href: '/faq' },
      { label: 'Research digest', href: '/brief' },
      { label: 'Search library', href: '/library' },
      { label: 'Compound deep-dives', href: '/library/compounds/glynac' },
      { label: 'Head-to-head comparisons', href: '/library/compare' },
      { label: 'Delivery systems guide', href: '/library/delivery-systems' },
    ],
  },
  {
    icon: Wrench,
    title: 'Use the OS',
    purpose: 'Build, track, and optimize',
    gradFrom: 'from-accent-violet/[0.09]',
    iconBadge: 'icon-badge-violet',
    iconText: 'text-accent-violet',
    titleColor: 'text-accent-violet',
    glowHover: 'glow-hover-violet',
    steps: [
      { label: 'Personal dashboard', href: '/dashboard' },
      { label: 'Stack Architect', href: '/stacks' },
      { label: 'Protocol Shop — verify picks', href: '/shop' },
      { label: 'Defense scan', href: '/tools?tab=healthspan' },
      { label: 'Lab hub (local)', href: '/labs' },
    ],
  },
  {
    icon: Shield,
    title: 'Verify & Trust',
    purpose: 'Check evidence before you commit',
    gradFrom: 'from-accent-emerald/[0.09]',
    iconBadge: 'icon-badge-emerald',
    iconText: 'text-accent-emerald',
    titleColor: 'text-accent-emerald',
    glowHover: 'glow-hover-emerald',
    steps: [
      { label: 'Evidence standards', href: '/trust/methodology' },
      { label: 'Safety & disclaimers', href: '/trust/disclaimers' },
      { label: 'Founder journey', href: '/trust/journey' },
      { label: 'Platform updates', href: '/trust/updates' },
      { label: 'Contact & questions', href: '/contact' },
    ],
  },
];

export function SiteGuide() {
  return (
    <section className="py-16 md:py-20 border-b border-border section-mesh">
      <div className="container-page">
        <div className="text-center mb-8 section-header-mesh">
          <p className="text-label mb-2">How to use this site</p>
          <h2 className="heading-section mb-3">Three paths through TNiC</h2>
          <p className="text-body-sm max-w-xl mx-auto">
            New to longevity science? Start with the library. Ready to build? Open your OS. Skeptical? Trust comes first.
          </p>
        </div>

        <ContextRail
          what="A guided map of every major section — organized by intent, not navigation menus."
          why="Longevity information is overwhelming. These three paths match how people actually use TNiC."
          next="Pick the path that matches where you are today. You can switch paths anytime."
          theme="violet"
          className="mb-10 max-w-4xl mx-auto"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((path, i) => (
            <div
              key={path.title}
              className={`path-connector rounded-2xl p-6 border border-border/60 card-premium bg-gradient-to-br ${path.gradFrom} to-transparent transition-all duration-300 ${path.glowHover}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${path.iconBadge}`}>
                  <path.icon className={`w-5 h-5 ${path.iconText}`} />
                </div>
                <div>
                  <p className="os-card-number mb-0.5">Path {String(i + 1).padStart(2, '0')}</p>
                  <h3 className={`font-bold ${path.titleColor}`}>{path.title}</h3>
                </div>
              </div>
              <p className="text-xs font-mono text-muted-foreground mb-4">{path.purpose}</p>
              <ul className="space-y-2">
                {path.steps.map((step) => (
                  <li key={step.label}>
                    <Link
                      href={step.href}
                      className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition group py-1"
                    >
                      {step.label}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}