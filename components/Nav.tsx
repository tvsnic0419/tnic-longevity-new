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
      <div className={`absolute inset-0 nav-glass ${scrolled ? 'nav-glass-scrolled' : ''}`} />
      <div className="relative container-page py-3 md:py-3.5 flex justify-between items-center gap-4">
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

        {/* Primary links — a sliding underline (shared layoutId) tracks the
            active section as you navigate, the signature motion of the bar. */}
        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const cls =
              'focus-ring interactive relative px-3 py-2 rounded-lg text-[13px] font-medium tracking-tight transition-colors ' +
              (active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground');
            const inner = (
              <>
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-px rounded-full bg-gradient-to-r from-accent-cyan/50 via-accent-cyan to-accent-cyan/50"
                    transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                  />
                )}
              </>
            );
            return isInternal(link.href) ? (
              <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined} className={cls}>
                {inner}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className={cls}>
                {inner}
              </a>
            );
          })}
        </div>

        {/* Utility + actions — one clear hierarchy: quiet utilities, quiet
            secondary links, a single filled primary. */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <SiteSearch />
          <ThemeToggle compact />
          <span className="mx-1 h-5 w-px bg-border/70" aria-hidden="true" />
          <Link
            href="/quiz"
            className="focus-ring interactive inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ClipboardList className="w-4 h-4 text-accent-violet" aria-hidden="true" />
            Quiz
          </Link>
          <Link
            href="/shop"
            className="focus-ring interactive inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-accent-amber" aria-hidden="true" />
            Verify
          </Link>
          <Link
            href="/dashboard"
            className="focus-ring btn-gradient text-[13px] !py-2 !px-4 !min-h-0 rounded-full ml-0.5"
          >
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
            className="lg:hidden relative nav-glass nav-glass-scrolled border-b border-border overflow-hidden"
          >
            <div className="container-page py-4 flex flex-col gap-0.5">
              {navLinks.map((link, i) => {
                const active = isActive(link.href);
                const rowCls =
                  'focus-ring interactive flex justify-between items-center py-3.5 min-h-[var(--space-touch)] text-base font-medium border-b border-border/50 last:border-0 transition-colors ' +
                  (active ? 'text-accent-cyan' : 'text-foreground hover:text-accent-cyan');
                const row = (
                  <>
                    <span>{link.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" aria-hidden="true" />}
                  </>
                );
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {isInternal(link.href) ? (
                      <Link href={link.href} aria-current={active ? 'page' : undefined} className={rowCls}>
                        {row}
                      </Link>
                    ) : (
                      <a href={link.href} className={rowCls}>
                        {row}
                      </a>
                    )}
                  </motion.div>
                );
              })}
              <div className="flex flex-col gap-2 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/quiz"
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring interactive inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:border-accent-violet/50"
                  >
                    <ClipboardList className="w-4 h-4 text-accent-violet" aria-hidden="true" />
                    Quiz
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring interactive inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:border-accent-amber/50"
                  >
                    <ShieldCheck className="w-4 h-4 text-accent-amber" aria-hidden="true" />
                    Verify
                  </Link>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring btn-gradient text-sm text-center justify-center"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
