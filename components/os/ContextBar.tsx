'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronRight, Download, MapPin, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { EXPORT_KIT_EVENT } from './os-events';
import { usePlatform } from '@/context/PlatformContext';
import { analyzeStack } from '@/lib/stack-analysis';
import { HallmarkCoverageRing } from './HallmarkCoverageRing';
import { accentForRoute, getRouteContext } from '@/lib/route-context';
import { themes } from '@/lib/design-system';
import { cn } from '@/lib/utils';

function daysSince(dateStr: string): number {
  return Math.floor(
    (Date.now() - new Date(dateStr + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getNextAction(input: {
  selectedCount: number;
  scanned: boolean;
  labsCount: number;
  latestLabDate: string | null;
  pathname: string;
}): { message: string; href: string; label: string } {
  const { selectedCount, scanned, labsCount, latestLabDate, pathname } = input;

  if (selectedCount === 0) {
    return { message: 'No protocol yet', href: '/stacks', label: 'Build stack' };
  }
  if (!scanned) {
    return { message: 'Personalize your OS', href: '/tools?tab=healthspan', label: 'Defense scan' };
  }
  if (labsCount === 0) {
    return { message: 'Log baseline labs', href: '/labs', label: 'Open Labs' };
  }
  if (latestLabDate && daysSince(latestLabDate) > 90) {
    return { message: 'Retest due (90+ days)', href: '/labs', label: 'Update labs' };
  }
  if (pathname === '/dashboard') {
    return { message: 'Explore tools', href: '/tools', label: 'Open Tools' };
  }
  return { message: 'Command center', href: '/dashboard', label: 'Dashboard' };
}

interface ContextBarProps {
  /**
   * Drop the persisted-stack cluster (coverage ring, stack label, Reset,
   * Export) and keep only the breadcrumb and next action. For pages that carry
   * their own, more detailed stack readout — the Compound Engine scores the
   * same compounds against its own curated hallmark dataset, so showing both
   * puts two different coverage numbers for one stack on the same screen.
   */
  hideStackReadout?: boolean;
}

export function ContextBar({ hideStackReadout = false }: ContextBarProps = {}) {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const route = getRouteContext(pathname, tab);
  const accent = accentForRoute(route.hub);
  const theme = themes[accent];

  const { selected, setSelected, selectedCompounds, labs, profile } = usePlatform();
  const analysis = analyzeStack(selected);

  // Persisted stacks follow the visitor across every hub page. If that state is
  // stale or unexpected, one click returns the OS to a clean 0/12 slate — with
  // an Undo so nothing is lost by accident.
  const resetStack = () => {
    if (selected.length === 0) return;
    const previous = selected;
    setSelected([]);
    toast('Stack reset', {
      description: 'Your OS is back to a clean slate.',
      action: { label: 'Undo', onClick: () => setSelected(previous) },
    });
  };

  const stackLabel =
    selectedCompounds.length > 0
      ? selectedCompounds.map((c) => c.name.split(' ')[0]).join(' + ')
      : 'No stack';

  const latestLabDate =
    labs.length > 0
      ? labs.reduce((max, e) => (e.date > max ? e.date : max), labs[0].date)
      : null;

  const next = getNextAction({
    selectedCount: selected.length,
    scanned: profile.scanned,
    labsCount: labs.length,
    latestLabDate,
    pathname,
  });

  if (!route.hub && route.breadcrumbs.length === 0) return null;

  const crumbs = route.breadcrumbs;

  return (
    <aside
      className={cn(
        'sticky top-14 md:top-16 z-40 border-b border-border',
        'bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85',
      )}
      aria-label="Hub context and OS status"
    >
      <div className="container-page flex items-center gap-x-4 gap-y-2 py-2 text-xs">
        {crumbs.length > 1 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 min-w-0">
            <MapPin className={cn('w-3.5 h-3.5 shrink-0', theme.text)} aria-hidden="true" />
            <ol className="flex items-center gap-1 min-w-0 flex-wrap">
              {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-1 min-w-0">
                    {i > 0 && (
                      <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden="true" />
                    )}
                    {isLast ? (
                      <span className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="focus-ring text-muted-foreground hover:text-foreground truncate max-w-[100px] sm:max-w-none rounded"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2 min-w-0">
          {selected.length > 0 && !hideStackReadout && (
            <>
              <HallmarkCoverageRing covered={analysis.hallmarkCount} />
              <span className="hidden md:inline truncate font-medium text-foreground/90 max-w-[200px] lg:max-w-xs">
                {stackLabel}
              </span>
              <button
                type="button"
                onClick={resetStack}
                className="focus-ring interactive inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-caption font-semibold text-muted-foreground hover:text-accent-rose hover:border-accent-rose/30 shrink-0"
                aria-label="Reset stack to a clean slate"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(EXPORT_KIT_EVENT))}
                className="focus-ring interactive hidden sm:inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-caption font-semibold text-muted-foreground hover:text-accent-cyan hover:border-accent-cyan/30 shrink-0"
                aria-label="Open export kit"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Export
              </button>
            </>
          )}
          <Link
            href={next.href}
            className="focus-ring interactive tnic-button-tonal [--btn-accent:var(--accent-emerald)] inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 shrink-0"
          >
            {next.label}
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}