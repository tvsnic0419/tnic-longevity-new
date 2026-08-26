'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ClipboardList, Menu, Search, X } from 'lucide-react';
import { navGroups } from '@/lib/nav-data';
import { Logo } from '@/components/ui/Logo';
import { SiteSearch } from '@/components/SiteSearch';
import { COMMAND_PALETTE_EVENT } from '@/components/os/os-events';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// adaptive measurement still runs before first paint on the client.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Adaptive fit: render the full desktop bar whenever it actually fits the
  // available width, collapsing to the compact/hamburger chrome only when it
  // genuinely does not — measured, at any width, instead of flipping at one
  // hardcoded breakpoint. The old fixed `nav:` breakpoint left the full row
  // rendering at widths where its content needed ~1579px inside a 1280px
  // container, so the trailing actions were clipped past the viewport edge.
  const [compact, setCompact] = useState(false);
  const compactRef = useRef(false);
  const requiredRef = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const evaluate = () => {
      const logo = logoRef.current;
      const links = linksRef.current;
      const actions = actionsRef.current;
      // Cache the natural desktop width only while the clusters are in flow and
      // measurable (they are shrink-0 + nowrap, so scrollWidth is the true
      // content width, not a flex-compressed one). When compact they are
      // display:none and unmeasurable, so reuse the cached value — that is what
      // prevents a measure-while-hidden flip loop.
      if (logo && links && actions && !compactRef.current) {
        requiredRef.current = logo.offsetWidth + links.scrollWidth + actions.scrollWidth + 40;
      }
      const cs = getComputedStyle(row);
      const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const available = row.clientWidth - pad;
      const required = requiredRef.current;
      if (required <= 0) return;
      const next = required > available;
      if (next !== compactRef.current) {
        compactRef.current = next;
        setCompact(next);
      }
    };
    evaluate();
    const ro = new ResizeObserver(evaluate);
    ro.observe(row);
    // Re-measure once web fonts settle — glyph widths shift the natural width.
    document.fonts?.ready.then(evaluate).catch(() => {});
    return () => ro.disconnect();
  }, []);

  // The drawer only exists in compact chrome, so derive its visibility rather
  // than syncing state in an effect: expanding back to the full desktop bar
  // implicitly closes it, with no extra render and no set-state-in-effect.
  const drawerOpen = compact && mobileOpen;

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>('a[href]')?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    // Close the mobile menu on route change, including back/forward navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => href === pathname || (href !== '/' && pathname.startsWith(`${href}/`));

  // The current route already carries aria-current="page"; these give that state
  // a matching visual token so it is not announced-only. Keyed off the attribute
  // rather than a second isActive() branch, so the two can never diverge.
  const navLinkClass =
    'focus-ring interactive whitespace-nowrap px-2 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent-cyan/10 transition-all ' +
    'aria-[current=page]:text-foreground aria-[current=page]:bg-accent-cyan/10';
  const mobileNavLinkClass =
    'focus-ring interactive flex justify-between items-center text-foreground hover:text-accent-cyan py-3.5 min-h-[var(--space-touch)] text-base font-medium border-b border-border/50 last:border-0 ' +
    'aria-[current=page]:text-accent-cyan';

  return (
    <nav className="fixed top-0 w-full z-50" aria-label="Main navigation">
      <div
        className={`absolute inset-0 nav-glass ${scrolled ? 'nav-glass-scrolled' : ''}`}
      />
      {/* Full-bleed row (container-page's 1280px cap removed via !max-w-none):
          the bar spans the viewport rather than the article column, so the
          adaptive measurement compares content against real available width.
          Horizontal padding is still inherited from container-page. */}
      <div
        ref={rowRef}
        className="relative container-page !max-w-none py-3 md:py-4 flex justify-between items-center gap-4"
      >
        {/* No aria-label here: it would duplicate/conflict with the Logo's
            own role="img" + aria-label below, which Lighthouse's
            label-content-name-mismatch audit flags as visible text not
            reflected in the accessible name. Let the link's name derive
            from that single nested image role instead. */}
        <div ref={logoRef} className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            className="focus-ring interactive flex items-center rounded-xl group transition-transform hover:scale-[1.02]"
          >
            <Logo variant="lockup" size="nav" alt="TNiC – Transformative Nutrition in Cell-Health · Home" />
          </Link>
          {/* Brand descriptor from the site wordmark. Decorative (aria-hidden)
              and kept OUTSIDE the logo link so it can't create a
              label-content-name-mismatch with the link's accessible name.
              Wide screens only, so the ≥1440px nav row stays uncrowded. */}
          <span
            aria-hidden="true"
            className="hidden xl:block border-l border-border/60 pl-2.5 font-mono text-[0.58rem] font-semibold uppercase leading-[1.25] tracking-[0.18em] text-muted-foreground"
          >
            Cell-Health
            <br />
            Library
          </span>
        </div>

        {/* Grouped by intent (Learn / Build / Track / Shop) with a hairline
            divider between clusters, so the row reads as labeled families
            rather than nine flat links. */}
        <div ref={linksRef} className={cn('items-center gap-1 shrink-0', compact ? 'hidden' : 'flex')}>
          {navGroups.map((group, gi) => (
            <div key={group.label} className="flex items-center gap-0.5" role="group" aria-label={group.label}>
              {gi > 0 && <span className="mx-1 h-4 w-px bg-border/60" aria-hidden="true" />}
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={navLinkClass}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div ref={actionsRef} className={cn('items-center gap-2.5 shrink-0', compact ? 'hidden' : 'flex')}>
          <ThemeToggle compact />
          <SiteSearch />
          {/* NICO (questionnaire) is the secondary action; Dashboard is the
              single filled primary. The former "Verify" shortcut lives in the
              mobile menu, the footer, and the on-page Protocol Shop CTAs —
              keeping the desktop bar narrow enough to appear on standard
              laptops (≥1440px) instead of only ultra-wide displays. */}
          <GlassPanel depth="float" className="glass-hover flex items-center rounded-full">
            <Link
              href="/nico"
              aria-label="NICO Starter Questionnaire"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full py-2 px-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <ClipboardList className="w-4 h-4 text-accent-violet" aria-hidden="true" />
              NICO
            </Link>
          </GlassPanel>
          <Link href="/dashboard" className="focus-ring btn-gradient text-sm !py-2.5 !px-5 rounded-full">
            Dashboard
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Compact chrome — shown only when the full bar above does not fit. */}
        <div className={cn('items-center gap-1', compact ? 'flex' : 'hidden')}>
          <ThemeToggle compact />
          <IconButton
            icon={Search}
            label="Search"
            onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))}
          />
          <IconButton
            ref={menuButtonRef}
            icon={mobileOpen ? X : Menu}
            label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          />
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            // Keyed off the measured `compact` state, not the old fixed
            // breakpoint — otherwise a width could exist where neither the
            // desktop row nor this drawer is reachable.
            className={cn(
              'relative nav-glass nav-glass-scrolled border-b border-border',
              compact ? 'block' : 'hidden',
            )}
          >
            <div className="container-page py-4 flex flex-col gap-1">
              {navGroups.map((group) => (
                <div
                  key={group.label}
                  className="pb-1"
                  role="group"
                  aria-labelledby={`navgroup-${group.label.toLowerCase()}`}
                >
                  <p
                    id={`navgroup-${group.label.toLowerCase()}`}
                    className="text-label text-muted-foreground pt-3 pb-1.5"
                  >
                    {group.label}
                  </p>
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className={mobileNavLinkClass}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="flex flex-col gap-2 mt-3">
                <GlassPanel depth="float" className="glass-hover rounded-xl">
                  <Link
                    href="/nico"
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring block rounded-xl py-3 text-center text-sm font-semibold"
                  >
                    NICO Starter Questionnaire
                  </Link>
                </GlassPanel>
                <GlassPanel depth="float" className="glass-hover rounded-xl">
                  <Link
                    href="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring block rounded-xl py-3 text-center text-sm font-semibold"
                  >
                    Verify a Product
                  </Link>
                </GlassPanel>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring btn-gradient text-sm text-center justify-center"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
