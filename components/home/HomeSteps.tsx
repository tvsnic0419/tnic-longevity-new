import Link from 'next/link';
import { ClipboardList, BookOpen, Activity, ArrowRight, type LucideIcon } from 'lucide-react';
import { RevealItem } from '@/components/ui/RevealItem';

/**
 * A calm three-step path from curiosity to a tracked protocol. Server-rendered.
 * Rendered as a connected sequence (a track linking the three badges) rather
 * than three disconnected cards — the steps happen in order, so the layout
 * says that instead of three equally-weighted, unrelated options.
 */

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
  href: string;
}

const steps: Step[] = [
  {
    num: '01',
    icon: ClipboardList,
    title: 'Take the 3-minute quiz',
    desc: 'Answer a few questions and get a mechanism-matched starting stack, tuned to your goal and experience.',
    cta: 'Start the quiz',
    href: '/quiz',
  },
  {
    num: '02',
    icon: BookOpen,
    title: 'Explore the evidence',
    desc: 'See how each hallmark of aging actually works, and why every compound sits where it does on the A–C scale.',
    cta: 'Open the library',
    href: '/library',
  },
  {
    num: '03',
    icon: Activity,
    title: 'Build & track your protocol',
    desc: 'Design a protocol, model its projected impact, then log labs to watch it move — all private to your device.',
    cta: 'Open the dashboard',
    href: '/dashboard',
  },
];

export function HomeSteps() {
  return (
    <section
      aria-labelledby="home-steps-heading"
      className="border-t border-border/50 py-20 md:py-28"
    >
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-label mb-3 text-accent-emerald">Get started in 3 steps</p>
          <h2 id="home-steps-heading" className="heading-section mb-3">
            From curious to a protocol you can trust.
          </h2>
          <p className="text-body mx-auto max-w-xl">
            No account, no upsell, no data leaving your device — just a clear path you can
            follow at your own pace.
          </p>
        </div>

        {/* Connecting track — badges sit at the flex row's own edges via
            justify-between, so a 22px inset (half the 44px badge) on each
            side lands the line exactly at every badge's center. Desktop only;
            each step shows its own badge inline below on mobile instead. */}
        <div aria-hidden="true" className="relative mb-8 hidden items-center justify-between md:flex">
          <div className="absolute left-[22px] right-[22px] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-accent-cyan/50 via-border to-accent-emerald/50" />
          {steps.map(({ num, icon: Icon }) => (
            <span
              key={num}
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full icon-badge-cyan ring-4 ring-background"
            >
              <Icon className="h-5 w-5 text-accent-cyan" aria-hidden="true" />
            </span>
          ))}
        </div>

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
          {steps.map(({ num, icon: Icon, title, desc, cta, href }, i) => (
            <li key={num}>
              <RevealItem index={i}>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full icon-badge-cyan md:hidden">
                  <Icon className="h-5 w-5 text-accent-cyan" aria-hidden="true" />
                </span>
                <p className="mb-1.5 font-mono text-xs font-bold tracking-widest text-accent-cyan/70">
                  STEP {num}
                </p>
                <h3 className="heading-card mb-2 text-lg">{title}</h3>
                <p className="text-body-sm mb-4 leading-relaxed">{desc}</p>
                <Link
                  href={href}
                  className="focus-ring group inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-accent-cyan"
                >
                  {cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </RevealItem>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
