import Link from 'next/link';
import {
  Library,
  GraduationCap,
  Layers,
  FlaskConical,
  LineChart,
  Pill,
  ShoppingBag,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';

/**
 * The homepage's primary navigation surface — clean, crawlable cards that route
 * to the site's hubs. Server-rendered so search engines see real internal links
 * and descriptions, and users get one purposeful path in.
 */

type Accent = 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber';

interface Destination {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  desc: string;
  accent: Accent;
}

const destinations: Destination[] = [
  {
    href: '/products',
    icon: Pill,
    eyebrow: 'Buy well',
    title: 'Recommended Products',
    desc: 'One evidence-aligned pick per compound — brand, form, and dose matched to the studies, with affiliate links disclosed.',
    accent: 'emerald',
  },
  {
    href: '/library',
    icon: Library,
    eyebrow: 'Reference',
    title: 'The Evidence Library',
    desc: `The 12 hallmarks of aging and ${COMPOUND_COUNT} nutrients and compounds — each graded A–C by the strength of human evidence, with PubMed citations.`,
    accent: 'cyan',
  },
  {
    href: '/learn',
    icon: GraduationCap,
    eyebrow: 'Understand',
    title: 'Learn Hub',
    desc: 'Plain-language explainers, in-depth supplement guides, and a research digest — the science before the supplement.',
    accent: 'violet',
  },
  {
    href: '/stacks',
    icon: Layers,
    eyebrow: 'Build',
    title: 'Stacks & Protocols',
    desc: 'Assemble protocols that target the pathways driving your aging, with synergy scoring and clear, sourced dosing.',
    accent: 'emerald',
  },
  {
    href: '/labs',
    icon: FlaskConical,
    eyebrow: 'Measure',
    title: 'Lab Analysis',
    desc: 'Turn bloodwork into signal — track biomarkers over time and see what your protocol is actually moving.',
    accent: 'rose',
  },
  {
    href: '/tools',
    icon: LineChart,
    eyebrow: 'Simulate',
    title: 'Longevity Tools',
    desc: 'A healthspan estimator, biomarker-impact ranking, and stack synergy simulator — model the effect before you commit.',
    accent: 'amber',
  },
  {
    href: '/shop',
    icon: ShoppingBag,
    eyebrow: 'Buy well',
    title: 'Verify Before You Buy',
    desc: 'What to check on a label — third-party testing, the form used in studies, and a real dose — so you spend on what actually works.',
    accent: 'cyan',
  },
];

const accentText: Record<Accent, string> = {
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
  emerald: 'text-accent-emerald',
  rose: 'text-accent-rose',
  amber: 'text-accent-amber',
};

const accentBadge: Record<Accent, string> = {
  cyan: 'icon-badge-cyan',
  violet: 'icon-badge-violet',
  emerald: 'icon-badge-emerald',
  rose: 'icon-badge-rose',
  amber: 'icon-badge-amber',
};

export function HomeExplore() {
  return (
    <section
      aria-labelledby="home-explore-heading"
      className="relative border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider />
      <div className="container-page">
        <RevealItem className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-label mb-3 text-accent-cyan">Explore the library</p>
            <h2 id="home-explore-heading" className="heading-section mb-3">
              From the science to the shelf — one honest path.
            </h2>
            <p className="text-body">
              Six places to look, each doing one thing well: understand the biology, read the
              graded evidence, and know what&apos;s genuinely worth buying.
            </p>
          </div>
          <Link
            href="/site-map"
            className="focus-ring group hidden shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            See the full site map
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </RevealItem>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map(({ href, icon: Icon, eyebrow, title, desc, accent }, i) => (
            <RevealItem key={title} index={i}>
              <GlassPanel depth="mid" className="glass-hover h-full rounded-2xl">
                <Link href={href} className="focus-ring group flex h-full flex-col rounded-2xl p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accentBadge[accent]}`}
                    >
                      <Icon className={`h-5 w-5 ${accentText[accent]}`} aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className={`text-label mb-1.5 ${accentText[accent]}`}>{eyebrow}</p>
                  <h3 className="heading-card mb-2 text-base">{title}</h3>
                  <p className="text-body-sm leading-relaxed">{desc}</p>
                </Link>
              </GlassPanel>
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
