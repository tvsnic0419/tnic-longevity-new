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

        <ol className="step-row grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {steps.map(({ num, icon: Icon, title, desc, cta, href }, i) => (
            <li key={num} className="h-full">
              <RevealItem index={i} className="h-full">
                <Link href={href} className="step-card focus-ring group">
                  <div className="step-card__head">
                    <span className="step-card__icon icon-badge-emerald">
                      <Icon className="h-5 w-5 text-accent-emerald" aria-hidden="true" />
                    </span>
                    <span className="step-card__num" aria-hidden="true">{num}</span>
                  </div>
                  <p className="step-card__eyebrow">Step {num}</p>
                  <h3 className="step-card__title">{title}</h3>
                  <p className="step-card__desc">{desc}</p>
                  <span className="step-card__cta">
                    {cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </RevealItem>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
