import Link from 'next/link';
import type { Metadata } from 'next';
import { Library, HelpCircle, LayoutDashboard, ArrowRight, Compass } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { NotFoundSearchButton } from '@/components/NotFoundSearchButton';
import { CellularDivider } from '@/components/ui/CellularDivider';
import { POPULAR_GUIDE_LINKS } from '@/lib/index-priority';

export const metadata: Metadata = {
  title: 'Page Not Found — TNiC',
  description: 'This page could not be found. Find your way back to the TNiC longevity library, quiz, or dashboard.',
  robots: { index: false, follow: true },
};

const recoveryLinks = [
  { href: '/library', label: 'Browse all hallmarks', desc: 'The 12 Hallmarks of Aging library', icon: Library },
  { href: '/quiz', label: 'Take the 3-min quiz', desc: 'Get a personalized stack preset', icon: HelpCircle },
  { href: '/dashboard', label: 'Go to dashboard', desc: 'Your Longevity OS command center', icon: LayoutDashboard },
];

const popularGuides = POPULAR_GUIDE_LINKS.slice(0, 4);

export default function NotFound() {
  return (
    <SubPageLayout hideContextBar>
      <div className="canvas-scrim py-20 md:py-28">
        <div className="container-page max-w-3xl text-center relative">
          <CellularDivider className="!-top-3" />

          <p className="text-eyebrow !text-accent-cyan mb-6 justify-center flex">Page not found</p>
          <p
            className="font-black tracking-tight text-accent-cyan leading-none mb-4"
            style={{ fontSize: 'clamp(4.5rem, 14vw, 9rem)' }}
          >
            404
          </p>
          <h1 className="heading-page mb-4">This page hasn&apos;t been built yet</h1>
          <p className="text-body max-w-xl mx-auto mb-10">
            TNiC is growing fast, and this link is either outdated or still in progress. Here&apos;s where to go
            instead:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-14 text-left">
            <NotFoundSearchButton />
            {recoveryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring interactive card-ultra rounded-2xl p-4 flex items-center gap-3 hover:border-accent-cyan/30"
              >
                <span className="shrink-0 w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center">
                  <link.icon className="w-4 h-4 text-accent-cyan" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-body-sm font-semibold text-foreground">{link.label}</span>
                  <span className="block text-caption truncate">{link.desc}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2 justify-center mb-5">
              <Compass className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
              <p className="text-label">Popular guides</p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-xl mx-auto">
              {popularGuides.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring interactive inline-flex items-center gap-1.5 text-body-sm hover:text-accent-cyan rounded-md group"
                  >
                    <span className="truncate">{link.label}</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
