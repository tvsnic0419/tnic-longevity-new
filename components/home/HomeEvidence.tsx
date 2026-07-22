import Link from 'next/link';
import { ShieldCheck, Lock, BookMarked, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { citationRegistry } from '@/lib/trust';
import { GRADED_COMPOUND_COUNT } from '@/lib/library-modules';

type Accent = 'emerald' | 'cyan' | 'violet';

const accentBadge: Record<Accent, string> = {
  emerald: 'icon-badge-emerald',
  cyan: 'icon-badge-cyan',
  violet: 'icon-badge-violet',
};

const accentText: Record<Accent, string> = {
  emerald: 'text-accent-emerald',
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
};

const accentVar: Record<Accent, string> = {
  emerald: 'var(--accent-emerald)',
  cyan: 'var(--accent-cyan)',
  violet: 'var(--accent-violet)',
};

/**
 * Credibility band — the numbers and principles a sponsor or first-time visitor
 * needs to trust the platform. Citation count is read from the live registry so
 * it never drifts from the source of truth.
 */

const citationCount = citationRegistry.length;

const stats: { value: string; label: string }[] = [
  { value: String(GRADED_COMPOUND_COUNT), label: 'Evidence-graded compounds' },
  { value: '12', label: 'Hallmarks of aging mapped' },
  { value: `${citationCount}`, label: 'Indexed PubMed citations' },
  { value: '100%', label: 'Free & independent' },
];

const pillars: { icon: LucideIcon; title: string; desc: string; accent: Accent }[] = [
  {
    icon: ShieldCheck,
    title: 'Independent by design',
    desc: 'No supplement inventory to move and no affiliate-driven rankings — the evidence sets the order, not a sponsor.',
    accent: 'emerald',
  },
  {
    icon: Lock,
    title: 'Private by default',
    desc: 'Your quiz, stack, and lab results stay on your device. No accounts, no health-data sales, no tracking pixels.',
    accent: 'cyan',
  },
  {
    icon: BookMarked,
    title: 'Cited to the source',
    desc: 'Every tier and claim traces back to human trials, linked by PubMed ID so you can check the work yourself.',
    accent: 'violet',
  },
];

export function HomeEvidence() {
  return (
    <section
      aria-labelledby="home-evidence-heading"
      className="relative overflow-hidden border-t border-border/50 bg-[var(--color-bg-elevated)] py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent"
        aria-hidden="true"
      />
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-label mb-3 text-accent-cyan">Why you can trust it</p>
          <h2 id="home-evidence-heading" className="heading-section mb-3">
            Built to be inspected, not just believed.
          </h2>
          <p className="text-body mx-auto max-w-xl">
            TNiC is educational infrastructure for longevity — transparent about its
            methods, honest about uncertainty, and free for everyone.
          </p>
        </div>

        <dl className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--color-bg-elevated)] px-5 py-7 text-center"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="tnic-tabular block text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-xs leading-tight text-muted-foreground">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, desc, accent }) => (
            <div
              key={title}
              className="card-premium card-accent-glow p-6"
              style={{ ['--card-accent' as string]: accentVar[accent] }}
            >
              <span className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${accentBadge[accent]}`}>
                <Icon className={`h-5 w-5 ${accentText[accent]}`} aria-hidden="true" />
              </span>
              <h3 className="heading-card mb-2">{title}</h3>
              <p className="text-body-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/trust"
            className="focus-ring group inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-accent-cyan"
          >
            Read our trust &amp; transparency principles
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
