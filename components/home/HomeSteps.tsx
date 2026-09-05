import Link from 'next/link';
import { BookOpen, Scale, ShieldCheck, ArrowRight, type LucideIcon } from 'lucide-react';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';

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
      id="protocol"
      aria-labelledby="home-steps-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider hue="var(--accent-emerald)" index="05" label="Protocol" />
      <div className="container-page">
        <RevealItem className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-label mb-3 text-accent-emerald">05 / Protocol</p>
          <h2 id="home-steps-heading" className="heading-section mb-3">
            From curious to confident — no account needed.
          </h2>
          <div className="heading-accent-rule is-center mb-4" aria-hidden="true" />
          <p className="text-body mx-auto max-w-xl">
            No sign-up, no upsell, no data leaving your device — just a clear path from the
            science to a decision you can stand behind.
          </p>
        </RevealItem>

        {/* Connecting track — badges sit at the flex row's own edges via
            justify-between, so a 22px inset (half the 44px badge) on each
            side lands the line exactly at every badge's center. Desktop only;
            each step shows its own badge inline below on mobile instead.
            The track is emerald end-to-end (this section's accent) and deepens
            left→right so the three badges read as an ordered progression, not
            three equal dots. */}
        <div aria-hidden="true" className="relative mb-8 hidden items-center justify-between md:flex">
          <div className="absolute left-[22px] right-[22px] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-accent-emerald/30 via-accent-emerald/50 to-accent-emerald/70" />
          {steps.map(({ num, icon: Icon }) => (
            <span
              key={num}
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full icon-badge-emerald ring-4 ring-background"
            >
              <Icon className="h-5 w-5 text-accent-emerald" aria-hidden="true" />
            </span>
          ))}
        </div>

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
          {steps.map(({ num, icon: Icon, title, desc, cta, href }, i) => (
            <li key={num}>
              <RevealItem index={i}>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full icon-badge-emerald md:hidden">
                  <Icon className="h-5 w-5 text-accent-emerald" aria-hidden="true" />
                </span>
                <p className="mb-1.5 font-mono text-xs font-bold tracking-widest text-accent-emerald/70">
                  STEP {num}
                </p>
                <h3 className="heading-card mb-2 text-lg">{title}</h3>
                <p className="text-body-sm mb-4 leading-relaxed">{desc}</p>
                <Link
                  href={href}
                  className="focus-ring group inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-accent-emerald"
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
