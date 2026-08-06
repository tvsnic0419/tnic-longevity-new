import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ContextBar } from '@/components/os/ContextBar';
import { GuideCrossLinks } from '@/components/guides/GuideCrossLinks';

interface SubPageLayoutProps {
  children: React.ReactNode;
  /**
   * When set to a supplement-guide route, renders the derived
   * "Related guides & comparisons" cross-link block after the page content —
   * closing the guide→sibling-guide / guide→comparison loops in one place
   * instead of hand-curating links per guide page.
   */
  guideHref?: string;
  /**
   * ContextBar surfaces the visitor's persisted OS state (hallmark coverage,
   * synergy score, currently-loaded stack) — real leftover data from a prior
   * session on this browser. That's the right context on hub pages like
   * Dashboard or Stacks, but it reads as "this is already in progress" on a
   * standalone entry-point flow like the NICO Starter Questionnaire, which promises a fresh start
   * every time. Pass true there to render just Nav + content + Footer.
   */
  hideContextBar?: boolean;
  /**
   * Keep the ContextBar (breadcrumb, next action) but drop its persisted-stack
   * readout. For pages that render their own stack analysis and would otherwise
   * show two coverage numbers side by side — see `ContextBarProps`.
   */
  hideStackReadout?: boolean;
}

export function SubPageLayout({
  children,
  hideContextBar = false,
  hideStackReadout = false,
  guideHref,
}: SubPageLayoutProps) {
  return (
    <div className="min-h-screen canvas-scrim text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Nav />
      <div className="pt-14 md:pt-16">
        {!hideContextBar && (
          <aside aria-label="Your saved workspace">
            <ContextBar hideStackReadout={hideStackReadout} />
          </aside>
        )}
        <main id="main-content" tabIndex={-1}>
          {children}
          {guideHref && <GuideCrossLinks currentHref={guideHref} />}
        </main>
      </div>
      <Footer />
    </div>
  );
}