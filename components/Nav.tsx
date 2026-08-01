'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ClipboardList, Menu, Search, ShieldCheck, X } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { Logo } from '@/components/ui/Logo';
import { SiteSearch } from '@/components/SiteSearch';
import { COMMAND_PALETTE_EVENT } from '@/components/os/os-events';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { GlassPanel } from '@/components/ui/GlassPanel';

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    if (!mobileOpen) return;
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
  }, [mobileOpen]);

  useEffect(() => {
    // Close the mobile menu on route change, including back/forward navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const isInternal = (href: string) => href.startsWith('/');
  const isActive = (href: string) => href === pathname || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <nav className="fixed top-0 w-full z-50" aria-label="Main navigation">
      <div
        className={`absolute inset-0 nav-glass ${scrolled ? 'nav-glass-scrolled' : ''}`}
      />
      <div className="relative container-page py-3 md:py-4 flex justify-between items-center gap-4">
        {/* No aria-label here: it would duplicate/conflict with the Logo's
            own role="img" + aria-label below, which Lighthouse's
            label-content-name-mismatch audit flags as visible text not
            reflected in the accessible name. Let the link's name derive
            from that single nested image role instead. */}
        <Link
          href="/"
          className="focus-ring interactive flex items-center rounded-xl shrink-0 group transition-transform hover:scale-[1.02]"
        >
          <Logo variant="lockup" size="nav" alt="TNiC – Transformative Nutrition in Cell-Health · Home" />
        </Link>

        <div className="hidden lg:flex gap-0.5 xl:gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const className = `focus-ring interactive isolate relative px-3.5 py-2 rounded-xl text-sm font-semibold tracking-tight transition-colors ${
              active
                ? 'text-accent-cyan'
                : 'text-foreground/70 hover:text-foreground hover:bg-accent-cyan/10'
            }`;
            const pill = active && (
              <motion.span
                layoutId="nav-active-pill"
                className="absolute inset-0 -z-10 rounded-xl bg-accent-cyan/10 ring-1 ring-inset ring-accent-cyan/25"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            );

            return isInternal(link.href) ? (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={className}
              >
                {pill}
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className={className}>
                {pill}
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <ThemeToggle compact />
          <SiteSearch />
          <GlassPanel depth="float" className="glass-hover rounded-full">
            <Link
              href="/quiz"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <ClipboardList className="w-4 h-4 text-accent-violet" aria-hidden="true" />
              Nico
            </Link>
          </GlassPanel>
          <GlassPanel depth="float" className="glass-hover rounded-full">
            <Link
              href="/shop"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <ShieldCheck className="w-4 h-4 text-accent-amber" aria-hidden="true" />
              Verify
            </Link>
          </GlassPanel>
          <Link href="/dashboard" className="focus-ring btn-gradient text-sm !py-2.5 !px-5 !min-h-0 rounded-full">
            Dashboard
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle compact />
          <button
            onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))}
            className="focus-ring touch-target flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            ref={menuButtonRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="focus-ring touch-target flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden relative nav-glass nav-glass-scrolled border-b border-border"
          >
            <div className="container-page py-4 flex flex-col gap-1">
              {navLinks.map((link) =>
                isInternal(link.href) ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className="focus-ring interactive flex justify-between items-center text-foreground hover:text-accent-cyan py-3.5 min-h-[var(--space-touch)] text-base font-medium border-b border-border/50 last:border-0"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="focus-ring interactive flex justify-between items-center text-foreground hover:text-accent-cyan py-3.5 min-h-[var(--space-touch)] text-base font-medium border-b border-border/50 last:border-0"
                  >
                    {link.label}
                  </a>
                ),
              )}
              <div className="flex flex-col gap-2 mt-3">
                <GlassPanel depth="float" className="glass-hover rounded-xl">
                  <Link
                    href="/quiz"
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring block rounded-xl py-3 text-center text-sm font-semibold"
                  >
                    The Nico Starter Questionnaire
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
