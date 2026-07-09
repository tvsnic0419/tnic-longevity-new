import Link from 'next/link';
import { ClipboardList, BookOpen, Activity, ArrowRight, type LucideIcon } from 'lucide-react';

/** A calm three-step path from curiosity to a tracked protocol. Server-rendered. */

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
    title: 'Build & track in the OS',
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

        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map(({ num, icon: Icon, title, desc, cta, href }) => (
            <li key={num} className="card-base flex flex-col p-7">
              <div className="mb-6 flex items-center gap-4">
                <span className="font-mono text-3xl font-semibold text-accent-cyan/60">{num}</span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl icon-badge-cyan">
                  <Icon className="h-5 w-5 text-accent-cyan" aria-hidden="true" />
                </span>
              </div>
              <h3 className="heading-card mb-2 text-lg">{title}</h3>
              <p className="text-body-sm mb-6 flex-1 leading-relaxed">{desc}</p>
              <Link
                href={href}
                className="focus-ring group mt-auto inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-accent-cyan"
              >
                {cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
