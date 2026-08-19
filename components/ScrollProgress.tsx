'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/nav-data';

/**
 * Two things: a top reading-progress bar, and a right-rail of dots that mark
 * where you are across the site's primary sections.
 *
 * The dots link to top-level routes, so "active" is the current route — not a
 * scroll position. (The previous version scroll-spied for in-page ids that
 * matched the route paths, which never existed on any page, so no dot ever lit
 * up.) On the homepage the Descent already renders its own in-scene chapter
 * rail on the same edge, so the route rail is suppressed there to avoid two
 * overlapping rails; the progress bar still shows everywhere.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showRail = pathname !== '/';
  const isActive = (href: string) => href === pathname || pathname.startsWith(`${href}/`);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent">
        <div
          className="scroll-progress-glow h-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {showRail && (
        <nav
          aria-label="Section navigation"
          className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 justify-end"
                title={link.label}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`text-micro font-mono transition-all duration-300 ${
                    active ? 'text-accent-cyan opacity-100' : 'text-caption opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {link.label}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    active
                      ? 'bg-accent-cyan scale-150 shadow-[0_0_16px_rgba(34,211,238,0.8)] ring-2 ring-accent-cyan/30'
                      : 'bg-zinc-700/80 group-hover:bg-accent-cyan/40 group-hover:scale-110'
                  }`}
                />
              </a>
            );
          })}
        </nav>
      )}
    </>
  );
}
