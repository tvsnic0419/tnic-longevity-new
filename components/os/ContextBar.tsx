'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronRight, Layers, FlaskConical, Activity, Download, MapPin } from 'lucide-react';
import { EXPORT_KIT_EVENT } from './ExportKitModal';
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

export function ContextBar() {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const route = getRouteContext(pathname, tab);
  const accent = accentForRoute(route.hub);
  const theme = themes[accent];

  const { selected, selectedCompounds, labs, profile, score, defenseProfile } = usePlatform();
  const analysis = analyzeStack(selected);

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
  const hubNext = route.hub?.next;

  return (
    <aside
      className={cn(
        'sticky top-14 md:top-16 z-40 border-b border-border',
        'bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85',
      )}
      aria-label="Hub context and OS status"
    >
      {(crumbs.length > 1 || hubNext) && (
        <div className="border-b border-border/50 bg-muted/20">
          <div className="container-page flex flex-col gap-1.5 py-2 sm:flex-row sm:items-center sm:gap-4">
            {crumbs.length > 1 && (
              <nav aria-label="Breadcrumb" className="flex items-center gap-1 min-w-0 text-xs">
                <MapPin className={cn('w-3.5 h-3.5 shrink-0', theme.text)} aria-hidden="true" />
                <ol className="flex items-center gap-1 min-w-0 flex-wrap">
                  {crumbs.map((crumb, i) => {
                    const isLast = i === crumbs.length - 1;
                    return (
                      <li key={crumb.href} className="flex items-center gap-1 min-w-0">
                        {i > 0 && (
                          <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" aria-hidden="true" />
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

            {hubNext && (
              <p className="text-xs text-muted-foreground sm:ml-auto min-w-0 sm:max-w-[55%] lg:max-w-[48%] leading-relaxed">
                <span className={cn('font-semibold mr-1.5', theme.text)}>Next here:</span>
                <span className="line-clamp-2 sm:line-clamp-1">{hubNext}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5 text-xs">
        <HallmarkCoverageRing covered={analysis.hallmarkCount} />

        <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
          <Layers className="w-3.5 h-3.5 text-accent-violet shrink-0" aria-hidden="true" />
          <span className="font-mono">
            Synergy <span className="font-bold text-accent-violet">{score}</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 min-w-0 max-w-[200px] lg:max-w-xs">
          <span className="text-caption shrink-0">Stack</span>
          <span className="truncate font-medium text-foreground/90">{stackLabel}</span>
        </div>

        {profile.scanned && (
          <div className="hidden lg:flex items-center gap-1.5 text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-accent-rose shrink-0" aria-hidden="true" />
            <span className="font-mono">
              Bio age{' '}
              <span className="font-bold text-accent-rose">{defenseProfile.biologicalAge}</span>
            </span>
          </div>
        )}

        {latestLabDate && (
          <Link
            href="/labs"
            className="hidden sm:inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent-cyan focus-ring rounded-md px-1"
          >
            <FlaskConical className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              Labs{' '}
              <span className="font-mono">
                {daysSince(latestLabDate) === 0
                  ? 'today'
                  : `${daysSince(latestLabDate)}d ago`}
              </span>
            </span>
          </Link>
        )}

        <div className="ml-auto flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(EXPORT_KIT_EVENT))}
            className="focus-ring interactive hidden sm:inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-caption font-semibold text-muted-foreground hover:text-accent-cyan hover:border-accent-cyan/30 shrink-0"
            aria-label="Open export kit"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Export
          </button>
          <span className="text-caption text-muted-foreground truncate hidden md:inline max-w-[140px] lg:max-w-none">
            {next.message}
          </span>
          <Link
            href={next.href}
            className="focus-ring interactive inline-flex items-center gap-1 rounded-lg bg-accent-emerald/10 border border-accent-emerald/25 px-2.5 py-1.5 font-semibold text-accent-emerald hover:bg-accent-emerald/15 shrink-0"
          >
            {next.label}
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}