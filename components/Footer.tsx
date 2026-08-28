import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  Cpu,
  Shield,
  BookOpen,
  Layers,
  FlaskConical,
  Library,
  LayoutDashboard,
  HelpCircle,
  GraduationCap,
  Rocket,
  Syringe,
  Waypoints,
  BarChart3,
} from 'lucide-react';
import { POPULAR_GUIDE_LINKS } from '@/lib/index-priority';
import { citationRegistry } from '@/lib/trust';
import { compoundTierCount } from '@/lib/compound-core';
import { FooterBriefSubscribe } from '@/components/brief/FooterBriefSubscribe';

const tierACount = compoundTierCount('A');
const tierBCount = compoundTierCount('B');

const hubLinks = [
  { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/nico', label: 'NICO Starter Questionnaire', icon: HelpCircle },
  { href: '/library', label: 'Anti-Aging Library', icon: Library },
  { href: '/peptides', label: 'Peptide Library', icon: Syringe },
  { href: '/pathways', label: 'Pathways', icon: Waypoints },
  { href: '/learn', label: 'Learn Hub', icon: GraduationCap },
  { href: '/insights', label: 'Longevity by the Numbers', icon: BarChart3 },
  { href: '/stacks', label: 'Stacks & Protocols', icon: Layers },
  { href: '/protocols', label: 'Protocol Library', icon: Layers },
  { href: '/labs', label: 'Lab Analysis Hub', icon: FlaskConical },
  { href: '/compound-engine', label: 'Compound Engine', icon: Cpu },
];

const resourceLinks = [
  { href: '/best', label: 'Best Supplements by Goal', icon: Rocket },
  { href: '/elite-8', label: 'Elite 8 Compounds', icon: Rocket },
  { href: '/products', label: 'Products', icon: BookOpen },
  { href: '/shop', label: 'Protocol Shop', icon: BookOpen },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/about', label: 'About / Founder', icon: HelpCircle },
  { href: '/club', label: '150-Year Club', icon: Rocket },
  { href: '/trust', label: 'Trust & Transparency', icon: Shield },
  { href: '/trust/methodology', label: 'Methodology', icon: BookOpen },
  { href: '/trust/disclaimers', label: 'Disclaimers', icon: BookOpen },
  { href: '/trust/sponsorship', label: 'Sponsorship Principles', icon: Shield },
  { href: '/editorial-policy', label: 'Editorial Policy', icon: BookOpen },
  { href: '/corrections', label: 'Corrections', icon: BookOpen },
  { href: '/partnerships', label: 'Partnerships', icon: Rocket },
  { href: '/contact', label: 'Contact', icon: HelpCircle },
  { href: '/site-map', label: 'Site Map', icon: BookOpen },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/health-data', label: 'Health Data' },
  { href: '/trust/disclaimers', label: 'Disclaimers' },
];

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
        </div>

        <FooterBriefSubscribe />

        <section className="mb-12 rounded-3xl border border-accent-cyan/20 bg-accent-cyan/[0.045] p-5 md:p-6" aria-labelledby="footer-start-heading">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-label mb-2 text-accent-cyan">Choose your next step</p>
              <h2 id="footer-start-heading" className="font-display text-2xl tracking-tight text-foreground md:text-3xl">Start with the question you actually have.</h2>
              <p className="mt-2 text-body-sm">Use the shortest path to the evidence, comparison, or starting point you need.</p>
            </div>
            <Link href="/site-map" className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan">
              View the full map <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/supplement-guides', label: 'Understand a supplement', detail: 'Mechanism, human evidence, and cautions' },
              { href: '/best', label: 'Find by goal', detail: 'Goal-led shortlists without hype' },
              { href: '/library', label: 'Explore the library', detail: 'Compounds, hallmarks, and comparisons' },
              { href: '/nico', label: 'Build a starting point', detail: 'A free, adjustable questionnaire' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="focus-ring group rounded-2xl border border-border/60 bg-background/25 p-4 transition-colors hover:border-accent-cyan/40 hover:bg-accent-cyan/[0.07]">
                <span className="block text-sm font-semibold text-foreground group-hover:text-accent-cyan">{link.label}</span>
                <span className="mt-1 block text-caption leading-relaxed">{link.detail}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10 mb-10">
          <div className="sm:col-span-2 lg:col-span-1">
            {/* No aria-label here — see the matching comment in Nav.tsx. */}
            <Link
              href="/"
              className="focus-ring inline-flex items-center mb-4 rounded-xl group transition-transform hover:scale-[1.02]"
            >
              <Logo variant="lockup" size="md" alt="TNiC – Transformative Nutrition in Cell-Health · Home" />
            </Link>
            <p className="text-label mb-3 text-muted-foreground">Cell-Health Library</p>
            <p className="text-body-sm max-w-xs">
              Independent longevity intelligence. Evidence-graded compounds,
              transparent methodology, and consumer safety at the center of every recommendation.
            </p>
          </div>

          <div>
            <p className="text-label mb-4">Hubs</p>
            <ul className="space-y-3">
              {hubLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring interactive link-underline flex items-center gap-2 text-body-sm hover:text-accent-cyan rounded-md"
                  >
                    <link.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Guides runs ~2× the link count of its sibling columns,
              so it takes two grid tracks and flows its own list into two
              sub-columns — no single towering tail unbalancing the footer. */}
          <div className="lg:col-span-2">
            <p className="text-label mb-4">Popular Guides</p>
            <ul className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-3 lg:space-y-0">
              {POPULAR_GUIDE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring interactive link-underline text-body-sm hover:text-accent-cyan rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label mb-4">Resources</p>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="focus-ring interactive link-underline flex items-center gap-2 text-body-sm hover:text-accent-cyan rounded-md"
                  >
                    <link.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label mb-4">Important Notice</p>
            <p className="text-body-sm mb-3">
              TNiC is educational — not a medical provider. Biological age
              and biomarker projections are modeled estimates, not lab diagnostics.
            </p>
            <p className="text-caption mb-3">
              TNiC does not sell supplements. Verified product links may carry an
              affiliate token at no extra cost to you — commission never influences
              which products are listed or their evidence tier.
            </p>
            <p className="text-caption">
              Consult a physician before starting any protocol.{' '}
              <Link href="/privacy" className="text-accent-cyan link-underline focus-ring rounded">
                Privacy
              </Link>{' '}·{' '}
              <Link href="/trust/disclaimers" className="text-accent-cyan link-underline focus-ring rounded">
                Disclaimers
              </Link>
            </p>
          </div>
        </div>

        <nav aria-label="Legal" className="pt-6 flex flex-wrap gap-x-5 gap-y-2 mb-4">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring interactive link-underline text-caption hover:text-accent-cyan rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* The back page — a quiet, unlisted harm-reduction cheat sheet. Kept
            deliberately understated (muted, no icon) so it reads as an aside,
            not a promoted feature, but it's real focusable text so anyone
            navigating by keyboard or screen reader can still find it. */}
        <Link
          href="/sheepeople"
          className="focus-ring link-underline mb-4 inline-block rounded text-caption text-muted-foreground/45 transition-colors hover:text-accent-cyan"
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
