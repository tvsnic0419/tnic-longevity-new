import Link from 'next/link';
import { BookOpen, Scale, ShieldCheck, ArrowRight, type LucideIcon } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';

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
    icon: BookOpen,
    title: 'Start with a hallmark or compound',
    desc: 'Pick an aging mechanism you want to act on, or a nutrient you keep hearing about, and open its evidence page.',
    cta: 'Open the library',
    href: '/library',
  },
  {
    num: '02',
    icon: Scale,
    title: 'Read the graded evidence',
    desc: 'See the human studies, the doses actually tested, and where each claim sits on the A–C scale — with every source linked.',
    cta: 'See the 12 hallmarks',
    href: '/hallmarks',
  },
  {
    num: '03',
    icon: ShieldCheck,
    title: 'Decide what’s worth it',
    desc: 'Use the buyer checklist to verify a product before you spend — and take your questions to a clinician before you start.',
    cta: 'Open the buyer checklist',
    href: '/shop',
  },
];

export function HomeSteps() {
  return (
    <section
      aria-labelledby="home-steps-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider />
      <div className="container-page">
        <RevealItem className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-label mb-3 text-accent-emerald">Get started in 3 steps</p>
          <h2 id="home-steps-heading" className="heading-section mb-3">
            From curious to confident — no account needed.
          </h2>
          <p className="text-body mx-auto max-w-xl">
            No sign-up, no upsell, no data leaving your device — just a clear path from the
            science to a decision you can stand behind.
          </p>
        </RevealItem>

        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map(({ num, icon: Icon, title, desc, cta, href }, i) => (
            <li key={num} className="h-full">
              <RevealItem index={i} className="h-full">
                <GlassPanel depth="mid" className="glass-hover flex h-full flex-col rounded-2xl p-7">
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
                </GlassPanel>
              </RevealItem>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
