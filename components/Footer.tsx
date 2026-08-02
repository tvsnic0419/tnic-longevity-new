import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
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
} from 'lucide-react';
import { POPULAR_GUIDE_LINKS } from '@/lib/index-priority';
import { citationRegistry } from '@/lib/trust';
import { compounds } from '@/lib/data';

const tierACount = compounds.filter((c) => c.evidence === 'A').length;
const tierBCount = compounds.filter((c) => c.evidence === 'B').length;

const hubLinks = [
  { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/quiz', label: '5-Min Quiz', icon: HelpCircle },
  { href: '/library', label: 'Anti-Aging Library', icon: Library },
  { href: '/peptides', label: 'Peptide Library', icon: Syringe },
  { href: '/learn', label: 'Learn Hub', icon: GraduationCap },
  { href: '/stacks', label: 'Stacks & Protocols', icon: Layers },
  { href: '/labs', label: 'Lab Analysis Hub', icon: FlaskConical },
];

const resourceLinks = [
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-10">
          <div className="sm:col-span-2 lg:col-span-1">
            {/* No aria-label here — see the matching comment in Nav.tsx. */}
            <Link
              href="/"
              className="focus-ring inline-flex items-center mb-4 rounded-xl group transition-transform hover:scale-[1.02]"
            >
              <Logo variant="lockup" size="md" alt="TNiC – Transformative Nutrition in Cell-Health · Home" />
            </Link>
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
                    className="focus-ring interactive flex items-center gap-2 text-body-sm hover:text-accent-cyan rounded-md"
                  >
                    <link.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label mb-4">Popular Guides</p>
            <ul className="space-y-3">
              {POPULAR_GUIDE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring interactive text-body-sm hover:text-accent-cyan rounded-md"
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
                    className="focus-ring interactive flex items-center gap-2 text-body-sm hover:text-accent-cyan rounded-md"
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
              <Link href="/privacy" className="text-accent-cyan hover:underline focus-ring rounded">
                Privacy
              </Link>{' '}·{' '}
              <Link href="/trust/disclaimers" className="text-accent-cyan hover:underline focus-ring rounded">
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
              className="focus-ring interactive text-caption hover:text-accent-cyan rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-emerald/25 to-transparent" />
          <p className="text-caption font-mono">
            © 2026 TNiC · Independent · Evidence-First
            <span className="text-muted-foreground/60"> · Longevity OS coming soon</span>
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption font-mono">
            <span>Tier A: {tierACount} compounds</span>
            <span>Tier B: {tierBCount} compounds</span>
            <span>{citationRegistry.length} indexed PMIDs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
