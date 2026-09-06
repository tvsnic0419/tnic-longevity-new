import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Library, Sparkles, ArrowRight } from 'lucide-react';
import { citationRegistry } from '@/lib/trust';
import { compoundTierCount } from '@/lib/compound-core';
import { FooterBriefSubscribe } from '@/components/brief/FooterBriefSubscribe';

const tierACount = compoundTierCount('A');
const tierBCount = compoundTierCount('B');

// Curated short lists — the footer carries the highest-intent destinations per
// bucket, not the whole directory. The full directory lives one click away
// behind the "View the full map" link in the decision panel above, so these
// columns stay scannable chrome rather than a second navigation. No real
// destination is removed from the site by this — only from the footer wall.
const hubLinks = [
  { href: '/library', label: 'Anti-Aging Library' },
  { href: '/stacks', label: 'Stacks & Protocols' },
  { href: '/labs', label: 'Lab Analysis' },
  { href: '/peptides', label: 'Peptide Library' },
  { href: '/learn', label: 'Learn Hub' },
];

const trustLinks = [
  { href: '/trust', label: 'Trust & Transparency' },
  { href: '/trust/methodology', label: 'Methodology' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/about', label: 'About / Founder' },
  { href: '/contact', label: 'Contact' },
];

const linkColumns = [
  { heading: 'Hubs', links: hubLinks },
  { heading: 'Trust', links: trustLinks },
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
          {/* Closing conversion beat — the footer's one action moment, so the
              long scroll ends in a next step rather than a wall of links.
              Semantic color: emerald primary = advance (the questionnaire),
              cyan secondary = explore (the library). One shared pill radius
              across nav, footer, and section CTAs. */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/nico"
              className="tnic-button-primary focus-ring group inline-flex min-h-[var(--space-touch)] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Start the NICO Questionnaire
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/library"
              className="tnic-button-outline focus-ring inline-flex min-h-[var(--space-touch)] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              <Library className="h-4 w-4" aria-hidden="true" />
              Explore the evidence library
            </Link>
          </div>
        </div>

        <FooterBriefSubscribe />

        {/* High-intent decision panel — four shortest-paths plus the single link
            to the full directory. This carries the footer's wayfinding so the
            columns below can stay short. */}
        <section className="mb-12 rounded-3xl border border-accent-cyan/20 bg-accent-cyan/[0.045] p-5 md:p-6" aria-labelledby="footer-start-heading">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-label mb-2 text-accent-cyan">Choose your next step</p>
              <h2 id="footer-start-heading" className="font-display text-2xl tracking-tight text-foreground md:text-3xl">Start with the question you actually have.</h2>
              <p className="mt-2 text-body-sm">Use the shortest path to the evidence, comparison, or starting point you need.</p>
            </div>
            <Link href="/site-map" className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full border border-border/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan">
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

        {/* Slimmed from the former six-column link wall to a brand block plus two
            short curated columns — the deep directory now lives behind the
            "View the full map" link in the panel above. */}
        <div className="grid gap-8 lg:gap-10 mb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            {/* No aria-label here — see the matching comment in Nav.tsx. */}
            <Link
              href="/"
              className="focus-ring inline-flex items-center mb-4 rounded-xl group transition-transform hover:scale-[1.02]"
            >
              <Logo variant="lockup" size="md" alt="TNiC – Transformative Nutrition in Cell-Health · Home" />
            </Link>
            <p className="text-label mb-3 text-muted-foreground">Cell-Health Library</p>
            <p className="text-body-sm max-w-md">
              Independent longevity intelligence. Evidence-graded compounds,
              transparent methodology, and consumer safety at the center of every recommendation.
            </p>
            <p className="text-caption mt-4 max-w-md">
              TNiC is educational — not a medical provider. Biological age and biomarker
              projections are modeled estimates, not lab diagnostics. Verified product links may
              carry an affiliate token at no extra cost to you; commission never influences which
              products are listed or their evidence tier. Consult a physician before starting any protocol.
            </p>
          </div>

          {linkColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-label mb-4">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
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
          ))}
        </div>

        <nav aria-label="Legal" className="pt-6 flex flex-wrap gap-x-5 gap-y-2 mb-4 border-t border-border/40">
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
            understated (muted, no icon) so it reads as an aside, not a promoted
            feature, but it's real focusable text at a legible token color
            (muted-foreground clears WCAG AA — no sub-0.7 opacity dimming) so
            anyone navigating by keyboard or screen reader can still find it. */}
        <Link
          href="/sheepeople"
          className="focus-ring link-underline mb-4 inline-block rounded text-caption text-muted-foreground transition-colors hover:text-accent-cyan"
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
