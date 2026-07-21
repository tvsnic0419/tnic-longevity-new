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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Nav />
      <div className="pt-14 md:pt-16">
        {!hideContextBar && (
          <aside aria-label="Your saved workspace">
            <ContextBar />
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