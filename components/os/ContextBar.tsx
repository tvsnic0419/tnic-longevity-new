'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronRight, MapPin } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { accentForRoute, getRouteContext } from '@/lib/route-context';
import { themes } from '@/lib/design-system';
import { cn } from '@/lib/utils';
import styles from '@/components/ui/FlagshipFoundation.module.css';

// The stack cluster needs `analyzeStack` (and through it the full compound
// data layer), but only renders for visitors who have built a stack. The bar
// itself is on every page, so the readout is fetched on demand.
const ContextBarStackReadout = dynamic(
  () => import('./ContextBarStackReadout').then((m) => m.ContextBarStackReadout),
  { ssr: false },
);

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

/**
 * The persistent workspace cue. It deliberately stays compact: breadcrumb
 * establishes location, optional live data proves continuity, and one next
 * action removes ambiguity. The component never owns primary navigation.
 */
export function ContextBar({ hideStackReadout = false }: ContextBarProps = {}) {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const route = getRouteContext(pathname, tab);
  const accent = accentForRoute(route.hub);
  const theme = themes[accent];

  const { selected, labs, profile } = usePlatform();

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
    <aside className={`${styles.foundation} context-bar sticky top-14 md:top-16 z-40`} aria-label="Hub context and OS status">
      <div className="context-bar__inner container-page">
        {crumbs.length > 1 && (
          <nav aria-label="Breadcrumb" className="context-bar__crumbs">
            <MapPin className={cn('context-bar__pin', theme.text)} aria-hidden="true" />
            <ol className="context-bar__crumb-list">
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                  <li key={crumb.href} className="context-bar__crumb">
                    {index > 0 && <ChevronRight className="context-bar__separator" aria-hidden="true" />}
                    {isLast ? (
                      <span className="context-bar__current">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="context-bar__crumb-link focus-ring">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        <div className="context-bar__workspace">
          {selected.length > 0 && !hideStackReadout && <ContextBarStackReadout />}
          <span className="context-bar__status">{next.message}</span>
          <Link
            href={next.href}
            className={cn('context-bar__action focus-ring', theme.text)}
          >
            <span>{next.label}</span>
            <ArrowRight className="context-bar__action-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
