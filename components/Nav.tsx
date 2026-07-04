'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ClipboardList, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { SiteSearch } from '@/components/SiteSearch';
import { COMMAND_PALETTE_EVENT } from '@/components/os/CommandPalette';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/ui/Logo';

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isExternal = (href: string) => href.startsWith('/');

  return (
    <nav className="fixed top-0 w-full z-50" aria-label="Main navigation">
      <div
        className={`absolute inset-0 nav-glass ${scrolled ? 'nav-glass-scrolled' : ''}`}
      />
      <div className="relative container-page py-3 md:py-4 flex justify-between items-center gap-4">
        <Link href="/" className="focus-ring interactive flex items-center gap-3 rounded-lg shrink-0 group">
          <Logo variant="emblem" size="nav" className="group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold tracking-tight" style={{ color: '#ffffff' }}>
            TN<span className="shimmer-text">i</span>C
          </span>
        </Link>

        <div className="hidden lg:flex gap-0.5 xl:gap-1">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            const cls = `focus-ring interactive px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              active
                ? 'text-accent-cyan bg-accent-cyan/12 shadow-[0_0_20px_-4px_rgba(34,211,238,0.35)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent-cyan/10'
            }`;
            return isExternal(link.href) ? (
              <Link key={link.href} href={link.href} className={cls} aria-current={active ? 'page' : undefined}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className={cls}>
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ThemeToggle compact />
          <SiteSearch />
          <Link
            href="/quiz"
            className="focus-ring hidden lg:inline-flex items-center gap-1.5 glass glass-hover px-4 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ClipboardList className="w-4 h-4 text-accent-violet" aria-hidden="true" />
            Quiz
          </Link>
          <Link
            href="/shop"
            className="focus-ring hidden lg:inline-flex items-center gap-1.5 glass glass-hover px-4 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ShoppingBag className="w-4 h-4 text-accent-amber" aria-hidden="true" />
            Shop
          </Link>
          <Link href="/dashboard" className="focus-ring btn-gradient text-sm !py-2.5 !px-5 !min-h-0 rounded-full">
            Open OS
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle compact />
          <button
            onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))}
            className="focus-ring touch-target flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
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
                isExternal(link.href) ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring interactive flex justify-between items-center text-foreground hover:text-accent-cyan py-3.5 min-h-[var(--space-touch)] text-base font-medium border-b border-border/50 last:border-0"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring interactive flex justify-between items-center text-foreground hover:text-accent-cyan py-3.5 min-h-[var(--space-touch)] text-base font-medium border-b border-border/50 last:border-0"
                  >
                    {link.label}
                  </a>
                ),
              )}
              <div className="flex flex-col gap-2 mt-3">
                <Link
                  href="/quiz"
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring glass glass-hover text-sm text-center py-3 rounded-xl font-semibold"
                >
                  3-Min Stack Quiz
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring glass glass-hover text-sm text-center py-3 rounded-xl font-semibold"
                >
                  Protocol Shop
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring btn-gradient text-sm text-center justify-center"
                >
                  Open Longevity OS
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}