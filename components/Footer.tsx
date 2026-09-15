import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  Shield,
  BookOpen,
  Library,
  LayoutDashboard,
  HelpCircle,
  Rocket,
  FlaskConical,
  Layers,
  Sparkles,
  ArrowRight,
  ClipboardList,
  ShoppingBag,
  Orbit,
} from 'lucide-react';
import { citationRegistry } from '@/lib/trust';
import { compoundTierCount } from '@/lib/compound-core';
import { FooterBriefSubscribe } from '@/components/brief/FooterBriefSubscribe';

const tierACount = compoundTierCount('A');
const tierBCount = compoundTierCount('B');

const startLinks = [
  { href: '/nico', label: 'NICO Starter', icon: ClipboardList },
  { href: '/library', label: 'Evidence library', icon: Library },
  { href: '/elite-8', label: 'Elite 8', icon: Rocket },
  { href: '/stacks', label: 'Stack Architect', icon: Layers },
  { href: '/labs', label: 'Lab Analysis', icon: FlaskConical },
];

const hubLinks = [
  { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/hallmarks', label: '12 Hallmarks', icon: Orbit },
  { href: '/products', label: 'Verified products', icon: ShoppingBag },
  { href: '/shop', label: 'Verify before you buy', icon: ShoppingBag },
  { href: '/protocols', label: 'Protocols', icon: Layers },
];

const trustLinks = [
  { href: '/trust', label: 'Trust & Transparency', icon: Shield },
  { href: '/trust/methodology', label: 'Methodology', icon: BookOpen },
  { href: '/trust/disclaimers', label: 'Disclaimers', icon: BookOpen },
  { href: '/editorial-policy', label: 'Editorial Policy', icon: BookOpen },
  { href: '/about', label: 'About / Founder', icon: HelpCircle },
  { href: '/contact', label: 'Contact', icon: HelpCircle },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/health-data', label: 'Health Data' },
  { href: '/trust/disclaimers', label: 'Disclaimers' },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; icon: typeof Shield }[];
}) {
  return (
    <details className="group border-b border-border/40 pb-3 md:border-0 md:pb-0 open:pb-3 md:open:pb-0" open>
      <summary className="text-label mb-3 flex cursor-pointer list-none items-center justify-between gap-2 md:pointer-events-none md:cursor-default [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden="true"
          className="text-muted-foreground transition-transform group-open:rotate-180 md:hidden"
        >
          ▾
        </span>
      </summary>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="focus-ring interactive link-underline flex min-h-6 items-center gap-2 text-body-sm hover:text-accent-cyan rounded-md"
            >
              <link.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function Footer() {
  return (
    <footer className="relative py-14 md:py-20 footer-aurora border-t border-border/50" role="contentinfo">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
      <div className="container-page">
        <div className="mb-12 md:mb-16 text-center border-b border-border/40 pb-10 md:pb-14">
          <p className="footer-manifesto max-w-3xl mx-auto mb-4">
            Independent longevity intelligence — built on evidence, designed for privacy, free for everyone.
          </p>
          <p className="text-body-sm max-w-xl mx-auto">
            No supplement inventory to move. No user health data sales model.
            Just cell-health research made easier to inspect, question, and apply responsibly.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/nico"
              className="tnic-button-primary focus-ring group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm min-h-[var(--space-touch)]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Start the NICO Questionnaire
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/library"
              className="tnic-button-outline focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold min-h-[var(--space-touch)]"
            >
              <Library className="h-4 w-4" aria-hidden="true" />
              Explore the evidence library
            </Link>
          </div>
        </div>

        <FooterBriefSubscribe />

        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="focus-ring brand-link inline-flex items-center mb-4 rounded-full group transition-transform hover:scale-[1.02]"
            >
              <Logo variant="lockup" size="md" alt="TNiC – Transformative Nutrition in Cell-Health · Home" />
            </Link>
            <p className="text-label mb-3 text-muted-foreground">Cell-Health Library</p>
            <p className="text-body-sm max-w-xs mb-4">
              The Longevity OS. Independent and evidence-graded —
              transparent methodology and consumer safety at the center of every recommendation.
            </p>
            <Link
              href="/site-map"
              className="focus-ring interactive link-underline inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-accent-cyan rounded-md"
            >
              Full site map <span aria-hidden="true">→</span>
            </Link>
          </div>

          <FooterColumn title="Start" links={startLinks} />
          <FooterColumn title="Hubs" links={hubLinks} />
          <FooterColumn title="Trust" links={trustLinks} />
        </div>

        <section
          className="mb-8 rounded-2xl border border-border/60 bg-white/[0.02] p-4 md:p-5"
          aria-labelledby="footer-notice-heading"
        >
          <h2 id="footer-notice-heading" className="text-label mb-2 text-muted-foreground">
            Important notice
          </h2>
          <p className="text-body-sm mb-2">
            TNiC is educational — not a medical provider. Biological age
            and biomarker projections are modeled estimates, not lab diagnostics.
          </p>
          <p className="text-caption">
            TNiC does not sell supplements. Verified product links may carry an
            affiliate token at no extra cost to you — commission never influences
            which products are listed or their evidence tier. Consult a physician
            before starting any protocol.
          </p>
        </section>

        <nav aria-label="Legal" className="pt-2 flex flex-wrap gap-x-5 gap-y-2 mb-4">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring interactive link-underline text-caption hover:text-accent-cyan rounded inline-flex min-h-6 items-center"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Quiet harm-reduction aside — readable contrast, not a promoted feature. */}
        <Link
          href="/sheepeople"
          className="focus-ring link-underline mb-4 inline-flex min-h-6 items-center rounded text-caption text-muted-foreground transition-colors hover:text-accent-cyan"
        >
          the back page
        </Link>

        <div className="relative pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-emerald/25 to-transparent" />
          <p className="text-caption font-mono">
            © 2026 TNiC · Independent · Evidence-First
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption font-mono">
            <span title="Of the stack-buildable set — the full library carries more at every tier">
              Stack-buildable — Tier A: {tierACount} · Tier B: {tierBCount}
            </span>
            <span>{citationRegistry.length} indexed PMIDs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
