'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, BookOpen, ChevronDown, ClipboardList, FlaskConical, Layers, LayoutDashboard, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { navGroups } from '@/lib/nav-data';
import { Logo } from '@/components/ui/Logo';
import { SiteSearch } from '@/components/SiteSearch';
import { COMMAND_PALETTE_EVENT } from '@/components/os/os-events';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import { usePlatform } from '@/context/PlatformContext';

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// adaptive measurement still runs before first paint on the client.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Keep the first five destinations focused on the site’s principal visitor jobs.
// The remainder stay one click away in the Explore panel, avoiding a crowded
// desktop header without sending a standard laptop straight to the hamburger.
const desktopPrimaryLinks = [
  { href: '/library', label: 'Library' },
  { href: '/stacks', label: 'Stacks' },
  { href: '/labs', label: 'Labs' },
  { href: '/products', label: 'Products' },
];

const compactPurposePaths = [
  {
    href: '/nico',
    label: 'Find a starting point',
    detail: 'Nine adjustable questions',
    icon: ClipboardList,
    accent: 'text-accent-violet',
  },
  {
    href: '/library',
    label: 'Explore a compound',
    detail: 'Evidence and mechanisms',
    icon: BookOpen,
    accent: 'text-accent-cyan',
  },
  {
    href: '/stacks?view=builder',
    label: 'Inspect a stack',
    detail: 'Coverage and cautions',
    icon: Layers,
    accent: 'text-accent-emerald',
  },
  {
    href: '/labs?mode=single',
    label: 'Log a lab result',
    detail: 'Private browser tracking',
    icon: FlaskConical,
    accent: 'text-accent-rose',
  },
  {
    href: '/shop',
    label: 'Verify a product',
    detail: 'COA-first checklist',
    icon: ShoppingBag,
    accent: 'text-accent-amber',
  },
] as const;

const exploreGroups = [
  {
    label: 'Learn',
    links: [
      { href: '/peptides', label: 'Peptides' },
      { href: '/insights', label: 'Insights' },
      { href: '/learn', label: 'Learning hub' },
    ],
  },
  {
    label: 'Build',
    links: [
      { href: '/protocols', label: 'Protocols' },
      { href: '/tools', label: 'Tools' },
      { href: '/compound-engine', label: 'Compound engine' },
    ],
  },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { selected } = usePlatform();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
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
  const exploreRef = useRef<HTMLDivElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);

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
      // Measurement keeps mid-size desktop chrome adaptive, while the explicit
      // narrow-viewport floor prevents a constrained touch layout from briefly
      // retaining a clipped desktop row before intrinsic widths settle.
      const mustUseCompactChrome = window.innerWidth < 1024;
      if (mustUseCompactChrome) {
        if (!compactRef.current) {
          compactRef.current = true;
          setCompact(true);
        }
        return;
      }
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
  // At compact widths, CSS also enforces the compact chrome so touch navigation
  // stays reachable while intrinsic desktop-width measurement settles. The
  // narrow-viewport check makes an explicit menu activation reliable during
  // that short measurement window, while a later resize still closes the drawer.
  const narrowViewport = typeof window !== 'undefined' && window.innerWidth < 1024;
  const drawerOpen = mobileOpen && (compact || narrowViewport);

  useEffect(() => {
    if (!exploreOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!exploreRef.current?.contains(event.target as Node)) {
        setExploreOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExploreOpen(false);
        exploreButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [exploreOpen]);

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
    // Close open navigation surfaces on route change, including back/forward navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  const isActive = (href: string) => href === pathname || (href !== '/' && pathname.startsWith(`${href}/`));
  const hasActiveStack = selected.length > 0;
  const primaryAction = hasActiveStack
    ? { href: '/dashboard', label: 'Dashboard', ariaLabel: 'Open my dashboard' }
    : { href: '/nico', label: 'Start your stack', ariaLabel: 'Start the NICO Starter Questionnaire' };
  const secondaryAction = hasActiveStack
    ? { href: '/nico', label: 'Refine with NICO', icon: ClipboardList }
    : { href: '/dashboard', label: 'My dashboard', icon: LayoutDashboard };
  const SecondaryActionIcon = secondaryAction.icon;

  // The current route already carries aria-current="page"; these give that state
  // a matching visual token so it is not announced-only. Keyed off the attribute
  // rather than a second isActive() branch, so the two can never diverge.
  const navLinkClass =
    'focus-ring interactive relative whitespace-nowrap px-2 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent-cyan/10 transition-all ' +
    'after:pointer-events-none after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-accent-cyan after:to-accent-emerald after:transition-transform after:duration-300 ' +
    'aria-[current=page]:text-foreground aria-[current=page]:bg-accent-cyan/10 aria-[current=page]:after:scale-x-100';
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

        {/* The desktop bar prioritizes five core routes. Secondary research and
            builder destinations live in a structured disclosure so the first
            screen stays composed instead of becoming a wall of tiny links. */}
        <div ref={linksRef} className={cn('items-center gap-1 shrink-0 max-[1023px]:!hidden', compact ? 'hidden' : 'flex')}>
          {desktopPrimaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={navLinkClass}
            >
              {link.label}
            </Link>
          ))}
          <div ref={exploreRef} className="relative ml-1">
            <button
              ref={exploreButtonRef}
              type="button"
              onClick={() => setExploreOpen((open) => !open)}
              aria-expanded={exploreOpen}
              aria-controls="desktop-explore-panel"
              className={cn(
                'focus-ring interactive inline-flex items-center gap-1 whitespace-nowrap rounded-xl px-2 py-2 text-sm font-medium transition-all',
                exploreOpen
                  ? 'bg-accent-cyan/10 text-foreground'
                  : 'text-muted-foreground hover:bg-accent-cyan/10 hover:text-foreground',
              )}
            >
              Explore
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform duration-200', exploreOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  id="desktop-explore-panel"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute right-0 top-[calc(100%+0.8rem)] grid w-[25rem] grid-cols-2 gap-2 rounded-2xl border border-border/80 bg-[color-mix(in_srgb,var(--color-bg-elevated)_94%,transparent)] p-3 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
                  aria-label="Explore more TNiC resources"
                >
                  {exploreGroups.map((group) => (
                    <div key={group.label} className="rounded-xl p-2">
                      <p className="mb-2 px-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {group.label}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setExploreOpen(false)}
                            aria-current={isActive(link.href) ? 'page' : undefined}
                            className="focus-ring rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent-cyan/10 hover:text-foreground aria-[current=page]:bg-accent-cyan/10 aria-[current=page]:text-foreground"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div ref={actionsRef} className={cn('items-center gap-2.5 shrink-0 max-[1023px]:!hidden', compact ? 'hidden' : 'flex')}>
          <ThemeToggle compact />
          <SiteSearch />
          {/* The filled action changes with local stack state: newcomers receive
              a guided start, while returning visitors resume the work they
              already began. The quieter companion keeps the alternate path one
              click away without presenting two competing primary CTAs. */}
          <GlassPanel depth="float" className="glass-hover flex items-center rounded-full">
            <Link
              href={secondaryAction.href}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full py-2 px-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <SecondaryActionIcon className="w-4 h-4 text-accent-violet" aria-hidden="true" />
              {secondaryAction.label}
            </Link>
          </GlassPanel>
          <Link href={primaryAction.href} aria-label={primaryAction.ariaLabel} className="focus-ring btn-gradient text-sm !py-2.5 !px-5 !min-h-0 rounded-full">
            {primaryAction.label}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Compact chrome — shown only when the full bar above does not fit. */}
        <div className={cn('items-center gap-1 max-[1023px]:!flex', compact ? 'flex' : 'hidden')}>
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
              'relative nav-glass nav-glass-scrolled max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-border',
              drawerOpen ? 'block' : 'hidden',
            )}
          >
            <div className="container-page py-4 flex flex-col gap-1">
              <section className="mb-3 rounded-2xl border border-border/70 bg-background/20 p-3" aria-labelledby="quick-purpose-title">
                <div className="mb-2 flex items-center justify-between gap-3 px-1">
                  <p id="quick-purpose-title" className="text-label text-accent-cyan">START WITH A PURPOSE</p>
                  <span className="text-micro font-mono uppercase tracking-[0.1em] text-muted-foreground">Choose a task</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {compactPurposePaths.map((path) => {
                    const Icon = path.icon;
                    return (
                      <Link
                        key={path.href}
                        href={path.href}
                        onClick={() => setMobileOpen(false)}
                        className="focus-ring group rounded-xl border border-border/60 bg-background/20 p-3 transition-colors hover:border-accent-cyan/35 hover:bg-accent-cyan/[0.045] last:col-span-2"
                      >
                        <Icon className={cn('h-3.5 w-3.5', path.accent)} aria-hidden="true" />
                        <p className="mt-2 text-xs font-semibold leading-snug text-foreground group-hover:text-accent-cyan">{path.label}</p>
                        <p className="mt-1 text-micro leading-snug text-muted-foreground">{path.detail}</p>
                      </Link>
                    );
                  })}
                </div>
              </section>

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
                    href={secondaryAction.href}
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring flex items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-semibold"
                  >
                    <SecondaryActionIcon className="h-4 w-4 text-accent-violet" aria-hidden="true" />
                    {secondaryAction.label}
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
                  href={primaryAction.href}
                  onClick={() => setMobileOpen(false)}
                  aria-label={primaryAction.ariaLabel}
                  className="focus-ring btn-gradient text-sm text-center justify-center"
                >
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
