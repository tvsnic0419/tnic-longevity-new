import { Suspense } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ContextBar } from '@/components/os/ContextBar';

interface SubPageLayoutProps {
  children: React.ReactNode;
  /**
   * ContextBar surfaces the visitor's persisted OS state (hallmark coverage,
   * synergy score, currently-loaded stack) — real leftover data from a prior
   * session on this browser. That's the right context on hub pages like
   * Dashboard or Stacks, but it reads as "this is already in progress" on a
   * standalone entry-point flow like the quiz, which promises a fresh start
   * every time. Pass true there to render just Nav + content + Footer.
   */
  hideContextBar?: boolean;
}

export function SubPageLayout({ children, hideContextBar = false }: SubPageLayoutProps) {
  return (
    <div className="min-h-screen canvas-scrim text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Nav />
      <div className="pt-14 md:pt-16">
        {!hideContextBar && (
          /* ContextBar calls useSearchParams(). Unwrapped, that opts the
             ENTIRE route out of server rendering — every page rendering this
             bar shipped an empty document with no <main>, <h1>, or <footer>,
             and painted nothing until JS hydrated. Measured across the site:
             every page passing `hideContextBar` server-rendered correctly and
             every page without it rendered blank. The Suspense boundary keeps
             the bailout scoped to this bar, so the rest of the page — nav,
             header, content, footer — is server-rendered again. Never render a
             useSearchParams consumer here without one. */
          <aside aria-label="Your saved workspace">
            <Suspense fallback={null}>
              <ContextBar />
            </Suspense>
          </aside>
        )}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}